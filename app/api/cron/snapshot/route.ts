/**
 * GET /api/cron/snapshot
 *
 * Runs one sync cycle — fetches Dhan quotes, computes % changes, writes to
 * LiveQuote + MarketStats. API routes just read from those tables.
 *
 * Invoked by stock-market-app-cron.timer every minute during IST market hours.
 * BSE on even minutes, NSE on odd — each exchange refreshed every 2 minutes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runSyncLoop } from '@/lib/sync/engine';
import { isMarketOpen } from '@/lib/market-hours';

const CRON_SECRET = process.env.CRON_SECRET || '';

export async function GET(request: NextRequest) {
  const t0 = Date.now();

  const secret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const isBearer = authHeader === `Bearer ${CRON_SECRET}`;

  if (CRON_SECRET && secret !== CRON_SECRET && !isBearer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Force reload of historical cache (call after backfill is complete)
  const forceReload = request.nextUrl.searchParams.get('forceReload') === 'true';
  if (forceReload) {
    const { getState } = await import('@/lib/sync/state');
    const state = getState();
    state.historicalLoaded = {};
    state.historicalLoadPromise = {};
    console.log('[Cron] Historical cache cleared — will reload from DB on next sync');
    return NextResponse.json({
      ok: true,
      action: 'Historical cache cleared. Next sync cycle will reload from DB.',
    });
  }

  if (!isMarketOpen()) {
    return NextResponse.json({ skipped: true, reason: 'Outside market hours' });
  }

  try {
    const { cycles, results } = await runSyncLoop();

    const totalQuotes = results.reduce((sum, r) => sum + r.quotesUpdated, 0);
    const elapsed = Date.now() - t0;

    return NextResponse.json({
      ok: true,
      cycles,
      totalQuotesWritten: totalQuotes,
      elapsed: `${elapsed}ms`,
      avgCycleMs: cycles > 0 ? Math.round(elapsed / cycles) : 0,
      results: results.map((r) => ({
        cycle: r.cycle,
        quotes: r.quotesUpdated,
        elapsed: `${r.elapsed}ms`,
      })),
    });
  } catch (error) {
    console.error('[Cron] Sync loop error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
