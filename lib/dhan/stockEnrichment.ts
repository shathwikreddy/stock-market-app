import { prisma } from '@/lib/prisma';

// Dynamic import for yahoo-finance2 v3 (ESM)
let yfInstance: {
  quoteSummary: (
    symbol: string,
    options: { modules: string[] }
  ) => Promise<{
    assetProfile?: { sector?: string; industry?: string };
    price?: { marketCap?: number };
  }>;
} | null = null;

async function getYahoo() {
  if (yfInstance) return yfInstance;
  const mod = await import('yahoo-finance2');
  const YahooFinance = mod.default as unknown as new (opts?: {
    suppressNotices?: string[];
  }) => typeof yfInstance;
  yfInstance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });
  return yfInstance!;
}

// Guard against concurrent runs
let enrichmentRunning = false;

/**
 * Background enrichment: fetches sector, industry, and marketCap
 * from Yahoo Finance for stocks that haven't been enriched recently.
 *
 * Processes up to `limit` stocks per call (default 50).
 * Designed to be called fire-and-forget from cron or API routes.
 */
export async function startEnrichment(limit = 50): Promise<void> {
  if (enrichmentRunning) return;
  enrichmentRunning = true;

  try {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days

    const stocks = await prisma.stockMaster.findMany({
      where: {
        OR: [{ enrichedAt: null }, { enrichedAt: { lt: cutoff } }],
        exchange: 'NSE', // Enrich NSE first (primary), BSE later
      },
      select: { securityId: true, tradingSymbol: true, exchange: true },
      take: limit,
      orderBy: { enrichedAt: { sort: 'asc', nulls: 'first' } },
    });

    if (stocks.length === 0) {
      // Try BSE stocks if all NSE done
      const bseStocks = await prisma.stockMaster.findMany({
        where: {
          OR: [{ enrichedAt: null }, { enrichedAt: { lt: cutoff } }],
          exchange: 'BSE',
        },
        select: { securityId: true, tradingSymbol: true, exchange: true },
        take: limit,
        orderBy: { enrichedAt: { sort: 'asc', nulls: 'first' } },
      });
      if (bseStocks.length === 0) return;
      await enrichBatch(bseStocks);
      return;
    }

    await enrichBatch(stocks);
  } catch (e) {
    console.error('[Enrichment] Error:', e instanceof Error ? e.message : e);
  } finally {
    enrichmentRunning = false;
  }
}

async function enrichBatch(
  stocks: { securityId: number; tradingSymbol: string; exchange: string }[]
): Promise<void> {
  const yf = await getYahoo();
  const concurrency = 5;
  let enriched = 0;

  for (let i = 0; i < stocks.length; i += concurrency) {
    const batch = stocks.slice(i, i + concurrency);

    await Promise.allSettled(
      batch.map(async (stock) => {
        const suffix = stock.exchange === 'NSE' ? '.NS' : '.BO';
        const yahooSymbol = stock.tradingSymbol + suffix;

        try {
          const result = await yf!.quoteSummary(yahooSymbol, {
            modules: ['assetProfile', 'price'],
          });

          const sector = result.assetProfile?.sector || '-';
          const industry = result.assetProfile?.industry || '-';
          const marketCap = result.price?.marketCap || 0;

          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: stock.exchange },
            data: {
              sector,
              industry,
              marketCapValue: marketCap,
              enrichedAt: new Date(),
            },
          });
          enriched++;
        } catch {
          // Mark as attempted so we don't keep retrying the same stock
          await prisma.stockMaster.updateMany({
            where: { securityId: stock.securityId, exchange: stock.exchange },
            data: { enrichedAt: new Date() },
          });
        }
      })
    );

    // Rate-limit: 300ms between batches
    if (i + concurrency < stocks.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(
    `[Enrichment] Enriched ${enriched}/${stocks.length} stocks`
  );
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
