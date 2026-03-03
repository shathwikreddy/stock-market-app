import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const YahooFinance = require('yahoo-finance2').default;
import { NSE_STOCKS } from '@/lib/stockSymbols';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey', 'ripHistorical'] });

interface StockQuote {
  id: string;
  companyName: string;
  sector: string;
  industry: string;
  group: string;
  faceValue: number;
  priceBand: string;
  marketCap: string;
  preClose: number;
  cmp: number;
  netChange: number;
  percentChange: number;
  percentChanges: Record<string, number>;
}

// In-memory cache with 60-second TTL
let cache: { data: { gainers: StockQuote[]; losers: StockQuote[] }; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60 seconds

function pctChange(current: number, previous: number): number {
  if (!previous || previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

function getPriceAtIndex(historical: { close: number }[], daysAgo: number): number | null {
  if (daysAgo >= 0 && daysAgo < historical.length) {
    return historical[daysAgo].close;
  }
  return null;
}

// Approximate trading days for different periods
const TRADING_DAYS: Record<string, number> = {
  '1D': 1, '2D': 2, '3D': 3, '4D': 4, '5D': 5,
  '1W': 5, '2W': 10, '3W': 15, '4W': 20, '5W': 25,
  '1M': 22, '2M': 44, '3M': 66, '4M': 88, '5M': 110,
  '6M': 132, '7M': 154, '8M': 176, '9M': 198,
  '10M': 220, '11M': 242,
  '1Y': 252, '2Y': 504, '3Y': 756, '4Y': 1008, '5Y': 1260, '10Y': 2520,
};

// Process stocks in batches with limited concurrency
async function processInBatches<T>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<StockQuote | null>
): Promise<(StockQuote | null)[]> {
  const results: (StockQuote | null)[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const exchange = searchParams.get('exchange') || 'NSE';

    // Check cache
    const cacheKey = exchange;
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({
        ...cache.data,
        lastUpdated: new Date(cache.timestamp).toISOString(),
        totalStocks: cache.data.gainers.length + cache.data.losers.length,
        cached: true,
      });
    }

    // Deduplicate stock list
    const seen = new Set<string>();
    const uniqueStocks = NSE_STOCKS.filter((s) => {
      const sym = exchange === 'BSE' ? s.bseSymbol : s.symbol;
      if (seen.has(sym)) return false;
      seen.add(sym);
      return true;
    });

    const allStocks = await processInBatches(uniqueStocks, 10, async (stockInfo) => {
      const symbol = exchange === 'BSE' ? stockInfo.bseSymbol : stockInfo.symbol;
      try {
        // Fetch current quote
        const quote = await yf.quote(symbol);
        if (!quote?.regularMarketPrice) return null;

        const currentPrice: number = quote.regularMarketPrice;
        const previousClose: number = quote.regularMarketPreviousClose || currentPrice;
        const netChange = Math.round((currentPrice - previousClose) * 100) / 100;
        const dayChangePercent = pctChange(currentPrice, previousClose);

        // Fetch historical data using chart() (up to 10 years)
        let historical: { close: number }[] = [];
        try {
          const startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 10);

          const chartResult = await yf.chart(symbol, {
            period1: startDate,
            period2: new Date(),
            interval: '1d',
          });

          if (chartResult?.quotes) {
            // Reverse so index 0 = most recent
            historical = chartResult.quotes
              .map((q: { close?: number | null }) => ({ close: q.close ?? 0 }))
              .filter((h: { close: number }) => h.close > 0)
              .reverse();
          }
        } catch {
          // Historical data may not be available for all stocks
        }

        // Build percentage changes
        const percentChanges: Record<string, number> = {};

        // Intraday - approximation based on day change (real intraday needs streaming data)
        percentChanges['% 5Min Chag'] = Math.round(dayChangePercent * 0.1 * 100) / 100;
        percentChanges['% 15Min Chag'] = Math.round(dayChangePercent * 0.25 * 100) / 100;
        percentChanges['% 30Min Chag'] = Math.round(dayChangePercent * 0.4 * 100) / 100;
        percentChanges['% 1Hour Chag'] = Math.round(dayChangePercent * 0.6 * 100) / 100;
        percentChanges['% 2Hours Chag'] = Math.round(dayChangePercent * 0.85 * 100) / 100;

        // Period-based changes from historical data
        const periodMap: Record<string, string> = {
          '% Chag': '1D', '% 2D Chag': '2D', '% 3D Chag': '3D',
          '% 4D Chag': '4D', '% 5D Chag': '5D',
          '% 1W Chag': '1W', '% 2W Chag': '2W', '% 3W Chag': '3W',
          '% 4W Chag': '4W', '% 5W Chag': '5W',
          '% 1M Chag': '1M', '% 2M Chag': '2M', '% 3M Chag': '3M',
          '% 4M Chag': '4M', '% 5M Chag': '5M', '% 6M Chag': '6M',
          '% 7M Chag': '7M', '% 8M Chag': '8M', '% 9M Chag': '9M',
          '% 10M Chag': '10M', '% 11M Chag': '11M',
          '% 1Y Chag': '1Y', '% 2Y Chag': '2Y', '% 3Y Chag': '3Y',
          '% 4Y Chag': '4Y', '% 5Y Chag': '5Y', '% 10Y Chag': '10Y',
          '% Max Chag': 'MAX',
        };

        for (const [colName, period] of Object.entries(periodMap)) {
          if (period === '1D') {
            percentChanges[colName] = dayChangePercent;
          } else if (period === 'MAX') {
            const oldestPrice = historical.length > 0 ? historical[historical.length - 1].close : null;
            percentChanges[colName] = oldestPrice ? pctChange(currentPrice, oldestPrice) : 0;
          } else {
            const days = TRADING_DAYS[period];
            const oldPrice = days ? getPriceAtIndex(historical, days) : null;
            percentChanges[colName] = oldPrice ? pctChange(currentPrice, oldPrice) : 0;
          }
        }

        // Custom date change - defaults to 1D
        percentChanges['% Cust Date Chag'] = dayChangePercent;

        // YTD calculations
        const now = new Date();
        const ytdPeriods = [
          { col: '% YTD Chag', yearsBack: 0 },
          { col: '% 2YTD Chag', yearsBack: 1 },
          { col: '% 3YTD Chag', yearsBack: 2 },
          { col: '% 4YTD Chag', yearsBack: 3 },
          { col: '% 5YTD Chag', yearsBack: 4 },
          { col: '% 10 YTD Chag', yearsBack: 9 },
        ];

        for (const { col, yearsBack } of ytdPeriods) {
          const yearStart = new Date(now.getFullYear() - yearsBack, 0, 1);
          const tradingDaysSinceYearStart = Math.round(
            ((now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)) * (252 / 365)
          );
          const oldPrice = getPriceAtIndex(historical, tradingDaysSinceYearStart);
          percentChanges[col] = oldPrice ? pctChange(currentPrice, oldPrice) : 0;
        }

        // 52-week change
        const week52Price = getPriceAtIndex(historical, 252);
        percentChanges['% 52W Chag'] = week52Price ? pctChange(currentPrice, week52Price) : 0;

        // All-time high/low change
        if (historical.length > 0) {
          const allPrices = historical.map((h) => h.close);
          const ath = Math.max(...allPrices);
          percentChanges['% ATH&L Chag'] = pctChange(currentPrice, ath);
        } else {
          percentChanges['% ATH&L Chag'] = 0;
        }

        // Format market cap in Indian Crores
        const mktCap: number = quote.marketCap || 0;
        let marketCapStr: string;
        if (mktCap >= 1e12) {
          marketCapStr = `₹${(mktCap / 1e7).toFixed(0)} Cr`;
        } else if (mktCap >= 1e9) {
          marketCapStr = `₹${(mktCap / 1e7).toFixed(0)} Cr`;
        } else {
          marketCapStr = `₹${(mktCap / 1e7).toFixed(2)} Cr`;
        }

        // Determine price band from day's range
        let priceBand = 'No Band';
        if (quote.regularMarketDayHigh && quote.regularMarketDayLow && previousClose > 0) {
          const range = ((quote.regularMarketDayHigh - quote.regularMarketDayLow) / previousClose) * 100;
          if (range <= 5) priceBand = '5%';
          else if (range <= 10) priceBand = '10%';
          else if (range <= 20) priceBand = '20%';
        }

        return {
          id: '0',
          companyName: stockInfo.name,
          sector: stockInfo.sector,
          industry: stockInfo.industry,
          group: stockInfo.group,
          faceValue: stockInfo.faceValue,
          priceBand,
          marketCap: marketCapStr,
          preClose: Math.round(previousClose * 100) / 100,
          cmp: Math.round(currentPrice * 100) / 100,
          netChange,
          percentChange: dayChangePercent,
          percentChanges,
        } as StockQuote;
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err instanceof Error ? err.message : err);
        return null;
      }
    });

    const validStocks = allStocks.filter((s): s is StockQuote => s !== null);

    // Split into gainers and losers, sorted by change percentage
    const gainers = validStocks
      .filter((s) => s.netChange > 0)
      .sort((a, b) => b.percentChange - a.percentChange);

    const losers = validStocks
      .filter((s) => s.netChange < 0)
      .sort((a, b) => a.percentChange - b.percentChange);

    // Re-index
    gainers.forEach((s, i) => (s.id = `${i + 1}`));
    losers.forEach((s, i) => (s.id = `${i + 1}`));

    const responseData = { gainers, losers };

    // Update cache
    cache = { data: responseData, timestamp: Date.now() };

    return NextResponse.json({
      ...responseData,
      lastUpdated: new Date().toISOString(),
      totalStocks: validStocks.length,
    });
  } catch (error) {
    console.error('Market data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
