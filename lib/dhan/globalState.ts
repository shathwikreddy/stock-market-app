/**
 * Persistent global state that survives Next.js HMR / module reloads.
 * All caches live here so they never get wiped mid-session.
 */

import type { QuoteData } from './marketData';

interface QuoteCacheEntry {
  quotes: Map<number, QuoteData>;
  timestamp: number;
}

export interface PriceSnapshot {
  timestamp: number;
  prices: Map<number, number>; // securityId → last_price
}

interface GlobalDhanState {
  // Rate limiter
  lastApiCall: number;
  apiQueue: Array<{ run: () => Promise<void>; resolve: () => void }>;
  isProcessingQueue: boolean;

  // Quote cache per exchange segment (NSE_EQ, BSE_EQ)
  quoteCache: Record<string, QuoteCacheEntry>;

  // Historical data in memory (securityId:segment → closes/timestamps)
  historicalMem: Map<string, { closes: number[]; timestamps: number[] }>;
  historicalLoaded: Record<string, boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  historicalLoadPromise: Record<string, Promise<void> | null>;

  // Intraday price snapshots (rolling window for 5min/15min/30min/1hr/2hr changes)
  priceSnapshots: PriceSnapshot[];

  // Population state
  isPopulating: boolean;
  populationProgress: { completed: number; total: number };
}

const key = '__dhan_global_state__';

function getState(): GlobalDhanState {
  if (!(globalThis as Record<string, unknown>)[key]) {
    (globalThis as Record<string, unknown>)[key] = {
      lastApiCall: 0,
      apiQueue: [],
      isProcessingQueue: false,
      quoteCache: {},
      historicalMem: new Map(),
      historicalLoaded: {},
      historicalLoadPromise: {},
      priceSnapshots: [],
      isPopulating: false,
      populationProgress: { completed: 0, total: 0 },
    } satisfies GlobalDhanState;
  }
  return (globalThis as Record<string, unknown>)[key] as GlobalDhanState;
}

export default getState;
