/**
 * GET /api/cron/enrich
 *
 * Dedicated enrichment endpoint — enriches sector, industry, and market cap
 * from Yahoo Finance for stocks that haven't been enriched recently.
 *
 * Runs independently from the quote-sync engine so enrichment actually
 * completes and quote sync stays fast and focused on price data.
 *
 * Invoked by stock-market-app-enrich.timer every 5 min during IST market hours.
 */

import { NextRequest, NextResponse } from 'next/server';
import { startEnrichment } from '@/lib/dhan/stockEnrichment';
import { isMarketOpen } from '@/lib/market-hours';

const CRON_SECRET = process.env.CRON_SECRET || '';
const ENRICH_BUDGET_MS = 90_000;

export async function GET(request: NextRequest) {
  const t0 = Date.now();

  const secret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const isBearer = authHeader === `Bearer ${CRON_SECRET}`;

  if (CRON_SECRET && secret !== CRON_SECRET && !isBearer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const force = request.nextUrl.searchParams.get('force') === 'true';
  if (!force && !isMarketOpen()) {
    return NextResponse.json({ skipped: true, reason: 'Outside market hours' });
  }

  try {
    const result = await startEnrichment(ENRICH_BUDGET_MS);
    const elapsed = Date.now() - t0;

    return NextResponse.json({
      ok: true,
      ...result,
      elapsed: `${elapsed}ms`,
    });
  } catch (error) {
    console.error('[Cron:Enrich] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
