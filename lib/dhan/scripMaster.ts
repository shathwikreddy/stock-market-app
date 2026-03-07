import axios from 'axios';
import connectDB from '@/lib/mongodb';
import StockMaster, { IStockMaster } from '@/models/StockMaster';

export interface ScripInfo {
  securityId: number;
  tradingSymbol: string;
  displayName: string;
  exchange: string;
  exchangeSegment: string;
  series: string;
  instrumentType: string;
  isin: string;
  faceValue: number;
}

// In-memory cache per exchange
const memCache: Record<string, { data: ScripInfo[]; timestamp: number }> = {};
const MEM_CACHE_TTL = 60 * 60 * 1000; // 1 hour in-memory
const DB_REFRESH_TTL = 24 * 60 * 60 * 1000; // 24 hours DB refresh

// Parse CSV line handling commas in quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

// Fetch face values from NSE equity list
async function fetchFaceValues(): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  try {
    const response = await axios.get(
      'https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }
    );
    const lines = (response.data as string).split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const vals = parseCSVLine(line);
      if (vals.length >= 8) {
        const symbol = vals[0].trim();
        const isin = vals[6].trim();
        const fv = parseFloat(vals[7]) || 1;
        map.set(symbol, fv);
        if (isin) map.set(isin, fv);
      }
    }
  } catch (e) {
    console.error('[ScripMaster] Failed to fetch NSE face values:', e instanceof Error ? e.message : e);
  }
  return map;
}

// Download Dhan scrip master CSV and parse for given exchange
async function downloadScripMaster(
  faceValues: Map<string, number>
): Promise<ScripInfo[]> {
  console.log('[ScripMaster] Downloading Dhan scrip master CSV...');
  const response = await axios.get(
    'https://images.dhan.co/api-data/api-scrip-master-detailed.csv',
    { timeout: 60000 }
  );
  const csv = response.data as string;
  const lines = csv.split('\n');
  const headers = parseCSVLine(lines[0]);
  const col: Record<string, number> = {};
  headers.forEach((h, i) => { col[h] = i; });

  const stocks: ScripInfo[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = parseCSVLine(line);
    if (vals.length < 11) continue;

    const exchange = vals[col['EXCH_ID']] || '';
    const segment = vals[col['SEGMENT']] || '';
    const instType = vals[col['INSTRUMENT_TYPE']] || '';

    // Only equity shares (ES) on equity segment (E) for NSE or BSE
    if (segment !== 'E' || instType !== 'ES') continue;
    if (exchange !== 'NSE' && exchange !== 'BSE') continue;

    const series = vals[col['SERIES']] || '';
    // NSE: only EQ series. BSE: all equity groups (A, B, T, X, etc.) except debt
    if (exchange === 'NSE' && series !== 'EQ') continue;

    const securityId = parseInt(vals[col['SECURITY_ID']]) || 0;
    const tradingSymbol = vals[col['SYMBOL_NAME']] || '';
    const displayName = vals[col['DISPLAY_NAME']] || tradingSymbol;
    const isin = vals[col['ISIN']] || '';
    if (!securityId || !tradingSymbol) continue;

    const fv = faceValues.get(tradingSymbol) || faceValues.get(isin) || 1;

    stocks.push({
      securityId,
      tradingSymbol,
      displayName,
      exchange,
      exchangeSegment: exchange === 'NSE' ? 'NSE_EQ' : 'BSE_EQ',
      series,
      instrumentType: instType,
      isin,
      faceValue: fv,
    });
  }

  return stocks;
}

// Persist scrip master to MongoDB
async function persistToDb(stocks: ScripInfo[]): Promise<void> {
  const now = new Date();
  const bulkOps = stocks.map((s) => ({
    updateOne: {
      filter: { securityId: s.securityId, exchange: s.exchange },
      update: {
        $set: {
          tradingSymbol: s.tradingSymbol,
          displayName: s.displayName,
          exchangeSegment: s.exchangeSegment,
          series: s.series,
          instrumentType: s.instrumentType,
          isin: s.isin,
          faceValue: s.faceValue,
          refreshedAt: now,
        },
      },
      upsert: true,
    },
  }));

  // Batch bulkWrite in chunks of 1000
  for (let i = 0; i < bulkOps.length; i += 1000) {
    await StockMaster.bulkWrite(bulkOps.slice(i, i + 1000));
  }
  console.log(`[ScripMaster] Persisted ${stocks.length} stocks to DB`);
}

// Load from MongoDB
async function loadFromDb(exchange?: string): Promise<ScripInfo[]> {
  const filter: Record<string, string> = {};
  if (exchange && exchange !== 'Both') filter.exchange = exchange;

  const docs: IStockMaster[] = await StockMaster.find(filter)
    .sort({ displayName: 1 })
    .lean();

  return docs.map((d) => ({
    securityId: d.securityId,
    tradingSymbol: d.tradingSymbol,
    displayName: d.displayName,
    exchange: d.exchange,
    exchangeSegment: d.exchangeSegment,
    series: d.series,
    instrumentType: d.instrumentType,
    isin: d.isin,
    faceValue: d.faceValue,
  }));
}

// Check if DB data is fresh enough
async function isDbFresh(): Promise<boolean> {
  const latest = await StockMaster.findOne().sort({ refreshedAt: -1 }).lean();
  if (!latest?.refreshedAt) return false;
  return Date.now() - new Date(latest.refreshedAt).getTime() < DB_REFRESH_TTL;
}

/**
 * Get scrip master for the given exchange.
 * Uses in-memory cache → MongoDB → Dhan CSV (cascading fallback).
 */
export async function getScripMaster(exchange: 'NSE' | 'BSE' | 'Both' = 'NSE'): Promise<ScripInfo[]> {
  // 1) In-memory cache
  if (memCache[exchange] && Date.now() - memCache[exchange].timestamp < MEM_CACHE_TTL) {
    return memCache[exchange].data;
  }

  await connectDB();

  // 2) Try MongoDB
  const dbFresh = await isDbFresh();
  if (dbFresh) {
    const stocks = await loadFromDb(exchange);
    if (stocks.length > 0) {
      memCache[exchange] = { data: stocks, timestamp: Date.now() };
      console.log(`[ScripMaster] Loaded ${stocks.length} ${exchange} stocks from DB`);
      return stocks;
    }
  }

  // 3) Download from CSV and persist
  const faceValues = await fetchFaceValues();
  const allStocks = await downloadScripMaster(faceValues);

  const nseCount = allStocks.filter((s) => s.exchange === 'NSE').length;
  const bseCount = allStocks.filter((s) => s.exchange === 'BSE').length;
  console.log(`[ScripMaster] Downloaded ${nseCount} NSE + ${bseCount} BSE stocks`);

  await persistToDb(allStocks);

  // Filter for requested exchange
  let result: ScripInfo[];
  if (exchange === 'Both') {
    result = allStocks;
  } else {
    result = allStocks.filter((s) => s.exchange === exchange);
  }
  result.sort((a, b) => a.displayName.localeCompare(b.displayName));

  memCache[exchange] = { data: result, timestamp: Date.now() };
  return result;
}

/**
 * For "Both" mode: deduplicate by ISIN, preferring NSE.
 */
export function deduplicateByIsin(stocks: ScripInfo[]): ScripInfo[] {
  const seen = new Map<string, ScripInfo>();
  // Process NSE first so they take priority
  const sorted = [...stocks].sort((a, b) =>
    a.exchange === 'NSE' && b.exchange !== 'NSE' ? -1 : 1
  );
  for (const s of sorted) {
    const key = s.isin || `${s.exchange}-${s.securityId}`;
    if (!seen.has(key)) {
      seen.set(key, s);
    }
  }
  return Array.from(seen.values());
}
