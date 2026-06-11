import { prisma } from '@/lib/prisma';
import { clearScripMasterCache } from './scripMaster';

// ── Yahoo Finance v3 (ESM) dynamic import ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let yfInstance: any = null;

async function getYahoo() {
  if (yfInstance) return yfInstance;
  const mod = await import('yahoo-finance2');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const YahooFinance = mod.default as any;
  yfInstance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
  return yfInstance;
}

// ── ISIN → NSE ticker map (cached 24h in globalThis) ──

const TICKER_MAP_KEY = '__isin_ticker_map__';
const TICKER_MAP_TTL = 24 * 60 * 60 * 1000;

interface TickerMapCache {
  map: Map<string, string>;
  timestamp: number;
}

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

async function getIsinTickerMap(): Promise<Map<string, string>> {
  const cached = (globalThis as unknown as Record<string, TickerMapCache>)[TICKER_MAP_KEY];
  if (cached && Date.now() - cached.timestamp < TICKER_MAP_TTL) {
    return cached.map;
  }

  const map = new Map<string, string>();
  try {
    const { default: axios } = await import('axios');
    const res = await axios.get(
      'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }
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
    console.log(`[Enrichment] Built ISIN→ticker map: ${map.size} entries`);
  } catch (e) {
    console.error('[Enrichment] Failed to fetch ISIN map:', e instanceof Error ? e.message : e);
  }

  (globalThis as unknown as Record<string, TickerMapCache>)[TICKER_MAP_KEY] = { map, timestamp: Date.now() };
  return map;
}

/**
 * Resolve the best Yahoo Finance symbol for a stock.
 * ISIN → NSE ticker (most accurate), fallback to Dhan tradingSymbol.
 */
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

// Guard against concurrent runs
let enrichmentRunning = false;

interface StockRow {
  securityId: number;
  tradingSymbol: string;
  exchange: string;
  isin: string;
  sector: string;
  industry: string;
}

interface EnrichResult {
  enriched: number;
  mcUpdated: number;
  failed: number;
  total: number;
}

/**
 * Two-phase enrichment:
 *
 *   Phase 1 (fast): Batch quote() for market cap — 100+ stocks in ~2s
 *   Phase 2 (detailed): Individual quoteSummary() for sector/industry — ~30 stocks in ~5s
 *
 * Called from /api/cron/enrich every 5 minutes.
 */
export async function startEnrichment(budgetMs = 7000): Promise<EnrichResult> {
  if (enrichmentRunning) return { enriched: 0, mcUpdated: 0, failed: 0, total: 0 };
  enrichmentRunning = true;

  const deadline = Date.now() + budgetMs;
  let enriched = 0;
  let mcUpdated = 0;
  let failed = 0;
  let total = 0;

  try {
    const isinMap = await getIsinTickerMap();
    const yf = await getYahoo();
    const cutoff7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // ── Phase 1: Fast batch market cap via quote() ──
    // Targets stocks that have sector/industry but stale market cap (or any old enrichment)
    const mcStocks = await prisma.stockMaster.findMany({
      where: {
        OR: [
          { enrichedAt: null },
          { enrichedAt: { lt: cutoff7d } },
        ],
      },
      select: { securityId: true, tradingSymbol: true, exchange: true, isin: true, sector: true, industry: true },
      take: 200,
      orderBy: { enrichedAt: { sort: 'asc', nulls: 'first' } },
    });

    if (mcStocks.length > 0) {
      const batchResult = await batchMarketCapUpdate(yf, mcStocks, isinMap, deadline);
      mcUpdated = batchResult.updated;
      total += batchResult.processed;
    }

    // ── Phase 2: Detailed sector/industry via quoteSummary() ──
    // Only for stocks still missing sector OR industry
    if (Date.now() < deadline - 1000) {
      const detailStocks = await prisma.stockMaster.findMany({
        where: {
          OR: [
            { sector: '-' },
            { industry: '-' },
            { enrichedAt: null },
          ],
        },
        select: { securityId: true, tradingSymbol: true, exchange: true, isin: true, sector: true, industry: true },
        take: 80,
        orderBy: { enrichedAt: { sort: 'asc', nulls: 'first' } },
      });

      if (detailStocks.length > 0) {
        const detailResult = await detailedEnrichment(yf, detailStocks, isinMap, deadline);
        enriched = detailResult.enriched;
        failed = detailResult.failed;
        total += detailResult.processed;
      }
    }

    if (enriched > 0 || mcUpdated > 0) {
      clearScripMasterCache();
    }

    console.log(`[Enrichment] Done: ${enriched} sector/industry, ${mcUpdated} market caps, ${failed} failed (${total} processed)`);
  } catch (e) {
    console.error('[Enrichment] Error:', e instanceof Error ? e.message : e);
  } finally {
    enrichmentRunning = false;
  }

  return { enriched, mcUpdated, failed, total };
}

/**
 * Phase 1: Batch market cap update using quote().
 * quote() supports multiple symbols in one API call — much faster than quoteSummary().
 */
async function batchMarketCapUpdate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yf: any,
  stocks: StockRow[],
  isinMap: Map<string, string>,
  deadline: number
): Promise<{ updated: number; processed: number }> {
  let updated = 0;
  const BATCH = 50; // Yahoo allows ~50 symbols per quote() call

  for (let i = 0; i < stocks.length; i += BATCH) {
    if (Date.now() >= deadline - 2000) break; // Reserve 2s for Phase 2

    const batch = stocks.slice(i, i + BATCH);

    // Build symbol list and securityId mapping
    const symbolToStock = new Map<string, StockRow>();
    const symbols: string[] = [];
    for (const stock of batch) {
      const sym = resolveYahooSymbol(stock.tradingSymbol, stock.isin, stock.exchange, isinMap);
      symbols.push(sym);
      symbolToStock.set(sym, stock);
    }

    try {
      const quotes = await yf.quote(symbols);
      const results: Array<{ symbol?: string; marketCap?: number }> = Array.isArray(quotes) ? quotes : [quotes];

      for (const q of results) {
        if (!q?.symbol || !q?.marketCap || q.marketCap <= 0) continue;
        const stock = symbolToStock.get(q.symbol);
        if (!stock) continue;

        // Only update market cap (don't touch sector/industry or enrichedAt)
        // If the stock already has sector/industry, mark as enriched
        const hasMetadata = stock.sector !== '-' && stock.industry !== '-';
        await prisma.stockMaster.updateMany({
          where: { securityId: stock.securityId, exchange: stock.exchange },
          data: {
            marketCapValue: q.marketCap,
            ...(hasMetadata ? { enrichedAt: new Date() } : {}),
          },
        });
        updated++;
      }
    } catch (e) {
      console.error(`[Enrichment:MC] Batch quote error:`, e instanceof Error ? e.message : e);
    }
  }

  return { updated, processed: stocks.length };
}

/**
 * Phase 2: Detailed enrichment via quoteSummary().
 * Gets sector + industry (not available in quote()).
 */
async function detailedEnrichment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yf: any,
  stocks: StockRow[],
  isinMap: Map<string, string>,
  deadline: number
): Promise<{ enriched: number; failed: number; processed: number }> {
  let enriched = 0;
  let failed = 0;
  let processed = 0;
  const concurrency = 10;

  for (let i = 0; i < stocks.length; i += concurrency) {
    if (Date.now() >= deadline) break;

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
          else failed++;
        } catch {
          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: stock.exchange },
            data: { enrichedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
          }).catch(() => {});
          failed++;
        }
        processed++;
      })
    );

    // Brief pause between batches
    if (i + concurrency < stocks.length && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return { enriched, failed, processed };
}

/** Classify market cap value (INR) into category string */
export function classifyMarketCap(value: number): string {
  if (value <= 0) return '-';
  const crores = value / 1e7;
  if (crores >= 20000) return 'Large Cap';
  if (crores >= 5000) return 'Mid Cap';
  if (crores >= 500) return 'Small Cap';
  return 'Micro Cap';
}
