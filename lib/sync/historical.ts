/**
 * Historical price data management.
 * Loads from DB into memory on cold start, syncs daily from live quotes,
 * and populates missing stocks in the background.
 */

import { prisma } from '@/lib/prisma';
import { getState } from './state';
import { fetchHistoricalBatch } from './dhan-api';
import { randomUUID } from 'crypto';
import type { DhanQuote, Segment } from './types';

function ckey(id: number, seg: string): string {
  return `${seg}:${id}`;
}

/**
 * Load historical data from PostgreSQL into memory — ONCE per segment.
 * Concurrent callers share the same promise (no duplicate loads).
 */
export async function ensureHistoricalLoaded(segment: string): Promise<void> {
  const g = getState();
  if (g.historicalLoaded[segment]) return;

  if (!g.historicalLoadPromise[segment]) {
    g.historicalLoadPromise[segment] = (async () => {
      try {
        const docs = await prisma.historicalPrice.findMany({
          where: { exchangeSegment: segment },
          select: { securityId: true, exchangeSegment: true, closes: true, timestamps: true },
        });

        for (const d of docs) {
          g.historicalMem.set(ckey(d.securityId, d.exchangeSegment), {
            closes: d.closes,
            timestamps: d.timestamps,
          });
        }

        g.historicalLoaded[segment] = true;
        console.log(`[Sync:Hist] Loaded ${docs.length} ${segment} records from DB`);
      } catch (e) {
        console.error(`[Sync:Hist] DB load error for ${segment}:`, e);
        g.historicalLoadPromise[segment] = null;
      }
    })();
  }

  await g.historicalLoadPromise[segment];
}

/**
 * Daily sync: append/update today's close from live quotes.
 * Uses efficient bulk SQL (single UPDATE per batch, not per stock).
 * Also creates stub entries for stocks missing historical data.
 */
export async function syncDailyFromQuotes(
  quotes: Map<number, DhanQuote>,
  segment: string
): Promise<number> {
  const g = getState();
  const appends: { securityId: number; close: number; ts: number; tradeDate: string }[] = [];
  const newStubs: { securityId: number; close: number; ts: number; tradeDate: string }[] = [];
  let updatedInMemory = 0;

  for (const [id, q] of quotes.entries()) {
    if (!q.last_price || q.last_price <= 0) continue;

    const key = ckey(id, segment);
    const hist = g.historicalMem.get(key);

    const ltt = q.last_trade_time;
    if (!ltt) continue;
    const parts = ltt.split(' ')[0]?.split('/');
    if (!parts || parts.length !== 3) continue;
    const tradeDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const ts = Math.floor(new Date(tradeDate).getTime() / 1000);

    if (!hist || hist.closes.length === 0) {
      // Create stub entry so this stock starts accumulating daily closes
      g.historicalMem.set(key, { closes: [q.last_price], timestamps: [ts] });
      newStubs.push({ securityId: id, close: q.last_price, ts, tradeDate });
      continue;
    }

    const lastTs = hist.timestamps[hist.timestamps.length - 1];
    const lastStr = lastTs ? new Date(lastTs * 1000).toISOString().split('T')[0] : '';

    if (tradeDate === lastStr) {
      // Same day — update in-memory close to latest price (keeps calcChanges accurate)
      hist.closes[hist.closes.length - 1] = q.last_price;
      updatedInMemory++;
      continue;
    }

    if (tradeDate < lastStr) continue;

    // New trading day — append close
    hist.closes.push(q.last_price);
    hist.timestamps.push(ts);
    appends.push({ securityId: id, close: q.last_price, ts, tradeDate });
  }

  // ── Efficient bulk DB writes (single SQL per batch, not per stock) ──
  const BATCH = 500;

  // 1. Bulk append for existing stocks (new day)
  for (let i = 0; i < appends.length; i += BATCH) {
    const batch = appends.slice(i, i + BATCH);
    const values = batch
      .map((u) => `(${u.securityId}, '${segment}', ${u.close}, ${u.ts}, '${u.tradeDate}')`)
      .join(',');
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "HistoricalPrice" AS hp
        SET closes = array_cat(hp.closes, ARRAY[v.close::double precision]),
            timestamps = array_cat(hp.timestamps, ARRAY[v.ts::double precision]),
            "lastDate" = v.trade_date,
            "updatedAt" = NOW()
        FROM (VALUES ${values}) AS v(security_id, seg, close, ts, trade_date)
        WHERE hp."securityId" = v.security_id::int AND hp."exchangeSegment" = v.seg
      `);
    } catch (e) {
      console.error(`[Sync:Hist] Append batch ${Math.floor(i / BATCH) + 1} error:`, e instanceof Error ? e.message : e);
    }
  }

  // 2. Bulk insert stubs for stocks without historical data
  for (let i = 0; i < newStubs.length; i += BATCH) {
    const batch = newStubs.slice(i, i + BATCH);
    const values = batch
      .map((u) => `(gen_random_uuid(), ${u.securityId}, '${segment}', ARRAY[${u.close}::double precision], ARRAY[${u.ts}::double precision], '${u.tradeDate}', NOW(), NOW())`)
      .join(',');
    try {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "HistoricalPrice" (id, "securityId", "exchangeSegment", closes, timestamps, "lastDate", "createdAt", "updatedAt")
        VALUES ${values}
        ON CONFLICT ("securityId", "exchangeSegment") DO NOTHING
      `);
    } catch (e) {
      console.error(`[Sync:Hist] Stub insert batch ${Math.floor(i / BATCH) + 1} error:`, e instanceof Error ? e.message : e);
    }
  }

  const total = appends.length + newStubs.length;
  if (total > 0 || updatedInMemory > 0) {
    console.log(`[Sync:Hist] Daily sync ${segment}: ${appends.length} appended, ${newStubs.length} new stubs, ${updatedInMemory} in-memory updates`);
  }

  return total + updatedInMemory;
}

/**
 * Background-populate stocks that have no historical data yet.
 * Fetches 10-year history from Dhan API at 5 stocks/sec.
 */
export function startPopulation(
  items: { securityId: number; exchangeSegment: string }[]
): void {
  const g = getState();
  if (g.isPopulating) return;

  const missing = items.filter((i) => !g.historicalMem.has(ckey(i.securityId, i.exchangeSegment)));
  if (missing.length === 0) return;

  g.isPopulating = true;
  g.populationProgress = { completed: 0, total: missing.length };
  console.log(`[Sync:Hist] Background population: ${missing.length} stocks`);

  const now = new Date();
  const ago = new Date();
  ago.setFullYear(ago.getFullYear() - 10);

  fetchHistoricalBatch(
    missing.map((m) => ({
      securityId: m.securityId,
      exchangeSegment: m.exchangeSegment as Segment,
    })),
    ago.toISOString().split('T')[0],
    now.toISOString().split('T')[0],
    (id, seg, data) => {
      g.historicalMem.set(ckey(id, seg), { closes: data.close, timestamps: data.timestamp });
      const uuid = randomUUID();
      prisma.$executeRawUnsafe(
        `INSERT INTO "HistoricalPrice" (id, "securityId", "exchangeSegment", closes, timestamps, "lastDate", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4::double precision[], $5::double precision[], $6, NOW(), NOW())
         ON CONFLICT ("securityId", "exchangeSegment") DO UPDATE SET
           closes = $4::double precision[],
           timestamps = $5::double precision[],
           "lastDate" = $6,
           "updatedAt" = NOW()`,
        uuid, id, seg, data.close, data.timestamp, now.toISOString().split('T')[0]
      ).catch(() => {});
    },
    (done, total) => {
      g.populationProgress = { completed: done, total };
      if (done % 200 === 0 || done === total) {
        console.log(`[Sync:Hist] Population: ${done}/${total}`);
      }
    }
  )
    .then(() => {
      g.isPopulating = false;
      console.log(`[Sync:Hist] Population complete (${g.historicalMem.size} total)`);
    })
    .catch(() => {
      g.isPopulating = false;
    });
}

export function getPopulationStatus() {
  const g = getState();
  return {
    isPopulating: g.isPopulating,
    progress: g.populationProgress,
    cachedCount: g.historicalMem.size,
  };
}
