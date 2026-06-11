/**
 * GET /api/sync
 *
 * Manual sync trigger + status endpoint.
 * Use ?action=trigger to force a single sync cycle.
 * Use without params (or ?action=status) to check sync status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runSingleSync, getSyncStatus } from '@/lib/sync/engine';
import type { Exchange } from '@/lib/sync/types';

const CRON_SECRET = process.env.CRON_SECRET || '';
const VALID_EXCHANGES: Exchange[] = ['NSE', 'BSE', 'Both'];

function isAuthorized(request: NextRequest): boolean {
  if (!CRON_SECRET) return false;

  const secret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  return secret === CRON_SECRET || authHeader === `Bearer ${CRON_SECRET}`;
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action') || 'status';
  const rawExchange = request.nextUrl.searchParams.get('exchange') || 'NSE';
  const exchange = VALID_EXCHANGES.includes(rawExchange as Exchange) ? rawExchange as Exchange : 'NSE';

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (action === 'trigger') {
    try {
      const result = await runSingleSync(exchange);
      return NextResponse.json({
        ok: true,
        ...result,
        syncStatus: getSyncStatus(),
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Sync failed' },
        { status: 500 }
      );
    }
  }

  // Default: return status
  return NextResponse.json({
    ok: true,
    syncStatus: getSyncStatus(),
  });
}
