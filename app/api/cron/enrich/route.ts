/**
 * GET /api/cron/enrich
 *
 * Dedicated enrichment endpoint — enriches sector, industry, and market cap
 * from Yahoo Finance for stocks that haven't been enriched recently.
 *
 * Runs independently from the quote sync engine so that:
 *   1. Enrichment actually completes (sync's fire-and-forget gets killed by Vercel)
 *   2. Quote sync stays fast and focused on price data
 *
 * Call every 5 minutes from Google Apps Script or external cron.
 * Processes ~20-30 stocks per call within the 10s Vercel timeout.
 */

import { NextRequest, NextResponse } from 'next/server';
import { startEnrichment } from '@/lib/dhan/stockEnrichment';

const CRON_SECRET = process.env.CRON_SECRET || '';

export const maxDuration = 10;

export async function GET(request: NextRequest) {
  const t0 = Date.now();

  // Auth
  const secret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (CRON_SECRET && secret !== CRON_SECRET && !isVercelCron) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 7s budget — leaves 3s for cold start + response overhead
    const result = await startEnrichment(7000);
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
