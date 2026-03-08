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

async function buildTickerMap(): Promise<Map<string, string>> {
  // NSE EQUITY_L.csv: SYMBOL, NAME, SERIES, DATE, PAID_UP, LOT, ISIN, FACE_VALUE
  const isinToTicker = new Map<string, string>();
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
        if (ticker && isin) isinToTicker.set(isin, ticker);
      }
    }
    console.log(`Built ISIN→ticker map: ${isinToTicker.size} entries`);
  } catch (e) {
    console.error('Failed to fetch EQUITY_L.csv:', e instanceof Error ? e.message : e);
  }
  return isinToTicker;
}

async function main() {
  // 1. Build ticker map from NSE
  const isinToTicker = await buildTickerMap();

  // 2. Init yahoo-finance2 v3
  const mod = await import('yahoo-finance2');
  const YahooFinance = mod.default as unknown as new (opts?: {
    suppressNotices?: string[];
  }) => {
    quoteSummary: (
      symbol: string,
      options: { modules: string[] }
    ) => Promise<{
      assetProfile?: { sector?: string; industry?: string };
      price?: { marketCap?: number };
    }>;
  };
  const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

  // 3. Get all NSE stocks from DB
  const stocks = await prisma.stockMaster.findMany({
    where: { exchange: 'NSE' },
    select: { securityId: true, tradingSymbol: true, exchange: true, isin: true },
    orderBy: { displayName: 'asc' },
  });
  console.log(`Total NSE stocks: ${stocks.length}`);

  // 4. Map each stock to its Yahoo ticker
  const stocksWithTickers = stocks.map(s => {
    const ticker = isinToTicker.get(s.isin) || null;
    return { ...s, ticker };
  });

  const withTicker = stocksWithTickers.filter(s => s.ticker);
  const withoutTicker = stocksWithTickers.filter(s => !s.ticker);
  console.log(`With ticker: ${withTicker.length}, Without: ${withoutTicker.length}`);

  // 5. Enrich in batches
  const concurrency = 10;
  let enriched = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < withTicker.length; i += concurrency) {
    const batch = withTicker.slice(i, i + concurrency);

    await Promise.allSettled(
      batch.map(async (stock) => {
        const yahooSymbol = stock.ticker + '.NS';
        try {
          const result = await yf.quoteSummary(yahooSymbol, {
            modules: ['assetProfile', 'price'],
          });

          const sector = result.assetProfile?.sector || '-';
          const industry = result.assetProfile?.industry || '-';
          const marketCap = result.price?.marketCap || 0;

          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: 'NSE' },
            data: {
              sector,
              industry,
              marketCapValue: marketCap,
              tradingSymbol: stock.ticker!, // Update to proper ticker
              enrichedAt: new Date(),
            },
          });
          enriched++;
        } catch {
          // Still update tradingSymbol even if Yahoo fails
          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: 'NSE' },
            data: {
              tradingSymbol: stock.ticker!,
              enrichedAt: new Date(),
            },
          });
          failed++;
        }
      })
    );

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const progress = Math.min(i + concurrency, withTicker.length);
    const pct = ((progress / withTicker.length) * 100).toFixed(1);
    process.stdout.write(
      `\r[${elapsed}s] ${progress}/${withTicker.length} (${pct}%) — enriched: ${enriched}, failed: ${failed}   `
    );

    // Rate-limit
    if (i + concurrency < withTicker.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`\n\nNSE Done! Enriched: ${enriched}, Failed: ${failed}`);
  console.log(`Time: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  // 6. Also update tradingSymbol for stocks without Yahoo data
  for (const stock of withoutTicker) {
    // These don't have NSE tickers, skip Yahoo but keep existing tradingSymbol
  }

  // 7. Quick verification
  const sample = await prisma.stockMaster.findMany({
    where: { exchange: 'NSE', sector: { not: '-' } },
    select: { tradingSymbol: true, sector: true, industry: true, marketCapValue: true },
    take: 10,
    orderBy: { marketCapValue: 'desc' },
  });
  console.log('\nTop enriched stocks:');
  sample.forEach(s => {
    const mcCr = (s.marketCapValue / 1e7).toFixed(0);
    console.log(`  ${s.tradingSymbol}: ${s.sector} | ${s.industry} | ₹${mcCr} Cr`);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
