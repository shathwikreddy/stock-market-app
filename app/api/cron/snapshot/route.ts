import { NextRequest, NextResponse } from 'next/server';
import { getQuotesForSegment } from '@/lib/dhan/marketData';
import { getScripMaster } from '@/lib/dhan/scripMaster';
import { ensureSnapshotsLoaded, storeSnapshot } from '@/lib/dhan/historicalService';

const CRON_SECRET = process.env.CRON_SECRET || '';

/**
 * Lightweight cron endpoint — fetches quotes and stores a price snapshot.
 * Designed to be pinged every 1 minute during market hours (9:15 AM - 3:30 PM IST).
 * Use an external cron service (cron-job.org, UptimeRobot, etc.) to call this.
 *
 * Protect with CRON_SECRET env var:
 *   GET /api/cron/snapshot?secret=YOUR_SECRET
 */
export async function GET(request: NextRequest) {
  // Auth check
  const secret = request.nextUrl.searchParams.get('secret');
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if within Indian market hours (9:15 AM - 3:35 PM IST, Mon-Fri)
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // UTC → IST
  const day = ist.getUTCDay(); // 0=Sun, 6=Sat
  const hhmm = ist.getUTCHours() * 100 + ist.getUTCMinutes();

  if (day === 0 || day === 6 || hhmm < 915 || hhmm > 1535) {
    return NextResponse.json({ skipped: true, reason: 'Outside market hours' });
  }

  try {
    // Load existing snapshots from DB on cold start
    await ensureSnapshotsLoaded();

    // Fetch NSE quotes (primary market, covers most stocks)
    const stocks = await getScripMaster('NSE');
    const ids = stocks.map((s) => s.securityId);
    const quotes = await getQuotesForSegment('NSE_EQ', ids);

    // Store snapshot to memory + MongoDB
    storeSnapshot(quotes);

    return NextResponse.json({
      ok: true,
      stocks: quotes.size,
      snapshots: `stored at ${now.toISOString()}`,
    });
  } catch (error) {
    console.error('[Cron] Snapshot error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
