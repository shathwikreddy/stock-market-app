import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import axios from 'axios';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter }) as unknown as PrismaClient;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else current += ch;
  }
  result.push(current.trim());
  return result;
}

async function buildIsinTickerMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const res = await axios.get(
      'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }
    );
    const lines = (res.data as string).split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const vals = parseCSVLine(line);
      if (vals.length >= 7) {
        const ticker = vals[0].trim();
        const isin = vals[6].trim();
        if (ticker && isin) map.set(isin, ticker);
      }
    }
    console.log(`Built ISIN→ticker map: ${map.size} entries`);
  } catch (e) {
    console.error('Failed to fetch EQUITY_L.csv:', e instanceof Error ? e.message : e);
  }
  return map;
}

function resolveYahooSymbol(
  tradingSymbol: string,
  isin: string,
  exchange: string,
  isinMap: Map<string, string>
): string {
  const nseTicker = isinMap.get(isin);
  if (nseTicker) return nseTicker + '.NS';
  return tradingSymbol + (exchange === 'NSE' ? '.NS' : '.BO');
}

async function main() {
  const exchange = process.argv[2]?.toUpperCase() || 'NSE';
  if (exchange !== 'NSE' && exchange !== 'BSE' && exchange !== 'BOTH') {
    console.error('Usage: npx tsx scripts/enrich-all.ts [NSE|BSE|BOTH]');
    process.exit(1);
  }

  const isinMap = await buildIsinTickerMap();

  // Init yahoo-finance2 v3
  const mod = await import('yahoo-finance2');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const YahooFinance = mod.default as any;
  const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

  // Get stocks from DB
  const whereClause = exchange === 'BOTH' ? {} : { exchange };
  const stocks = await prisma.stockMaster.findMany({
    where: whereClause,
    select: { securityId: true, tradingSymbol: true, exchange: true, isin: true },
    orderBy: { displayName: 'asc' },
  });
  console.log(`Total ${exchange} stocks: ${stocks.length}`);

  // ── Phase 1: Batch market cap via quote() ──
  console.log('\n--- Phase 1: Batch market cap update ---');
  const QUOTE_BATCH = 50;
  let mcUpdated = 0;
  const p1Start = Date.now();

  for (let i = 0; i < stocks.length; i += QUOTE_BATCH) {
    const batch = stocks.slice(i, i + QUOTE_BATCH);
    const symbolToStock = new Map<string, typeof batch[0]>();
    const symbols: string[] = [];

    for (const stock of batch) {
      const sym = resolveYahooSymbol(stock.tradingSymbol, stock.isin, stock.exchange, isinMap);
      symbols.push(sym);
      symbolToStock.set(sym, stock);
    }

    try {
      const quotes = await yf.quote(symbols);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: any[] = Array.isArray(quotes) ? quotes : [quotes];

      for (const q of results) {
        if (!q?.symbol || !q?.marketCap || q.marketCap <= 0) continue;
        const stock = symbolToStock.get(q.symbol);
        if (!stock) continue;

        await prisma.stockMaster.updateMany({
          where: { securityId: stock.securityId, exchange: stock.exchange },
          data: { marketCapValue: q.marketCap },
        });
        mcUpdated++;
      }
    } catch (e) {
      console.error(`  Batch quote error at ${i}:`, e instanceof Error ? e.message : e);
    }

    const progress = Math.min(i + QUOTE_BATCH, stocks.length);
    process.stdout.write(`\r  Market cap: ${progress}/${stocks.length} checked, ${mcUpdated} updated`);
  }

  const p1Time = ((Date.now() - p1Start) / 1000).toFixed(1);
  console.log(`\n  Phase 1 done: ${mcUpdated} market caps updated in ${p1Time}s`);

  // ── Phase 2: Detailed sector/industry via quoteSummary() ──
  console.log('\n--- Phase 2: Sector/industry enrichment ---');
  const concurrency = 8;
  let enriched = 0;
  let failed = 0;
  let noData = 0;
  const p2Start = Date.now();

  for (let i = 0; i < stocks.length; i += concurrency) {
    const batch = stocks.slice(i, i + concurrency);

    await Promise.allSettled(
      batch.map(async (stock) => {
        const yahooSymbol = resolveYahooSymbol(stock.tradingSymbol, stock.isin, stock.exchange, isinMap);

        try {
          const result = await yf.quoteSummary(yahooSymbol, {
            modules: ['assetProfile', 'price'],
          });

          const sector = result.assetProfile?.sector || '-';
          const industry = result.assetProfile?.industry || '-';
          const marketCap = result.price?.marketCap || 0;
          const gotData = sector !== '-' || industry !== '-' || marketCap > 0;

          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: stock.exchange },
            data: {
              sector,
              industry,
              marketCapValue: marketCap,
              enrichedAt: gotData ? new Date() : new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
          });

          if (gotData) enriched++;
          else noData++;
        } catch {
          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: stock.exchange },
            data: { enrichedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
          }).catch(() => {});
          failed++;
        }
      })
    );

    const elapsed = ((Date.now() - p2Start) / 1000).toFixed(1);
    const progress = Math.min(i + concurrency, stocks.length);
    const pct = ((progress / stocks.length) * 100).toFixed(1);
    process.stdout.write(
      `\r  [${elapsed}s] ${progress}/${stocks.length} (${pct}%) — enriched: ${enriched}, noData: ${noData}, failed: ${failed}   `
    );

    if (i + concurrency < stocks.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const p2Time = ((Date.now() - p2Start) / 1000).toFixed(1);
  console.log(`\n  Phase 2 done: ${enriched} enriched, ${noData} no data, ${failed} failed in ${p2Time}s`);

  // ── Summary ──
  const totalEnriched = await prisma.stockMaster.count({ where: { sector: { not: '-' } } });
  const totalMcap = await prisma.stockMaster.count({ where: { marketCapValue: { gt: 0 } } });
  const totalStocks = await prisma.stockMaster.count();

  console.log(`\n=== Summary ===`);
  console.log(`Sector/Industry coverage: ${totalEnriched}/${totalStocks}`);
  console.log(`Market Cap coverage:      ${totalMcap}/${totalStocks}`);

  const sample = await prisma.stockMaster.findMany({
    where: { sector: { not: '-' } },
    select: { tradingSymbol: true, exchange: true, sector: true, industry: true, marketCapValue: true },
    take: 10,
    orderBy: { marketCapValue: 'desc' },
  });
  console.log('\nTop enriched stocks:');
  sample.forEach(s => {
    const mcCr = (s.marketCapValue / 1e7).toFixed(0);
    console.log(`  ${s.tradingSymbol} (${s.exchange}): ${s.sector} | ${s.industry} | ₹${mcCr} Cr`);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
