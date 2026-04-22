/**
 * GET /api/cron/renew-token
 *
 * Renews the Dhan API access token (expires every 24h) and persists the new
 * token in the Setting table. All hot paths read via getDhanAccessToken() and
 * pick up the new token within 60s (cache TTL) — no process restart needed.
 *
 * Invoked daily at ~02:30 IST by systemd (stock-market-app-renew.timer).
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getDhanAccessToken, setDhanAccessToken } from '@/lib/dhan/token';

const CRON_SECRET = process.env.CRON_SECRET || '';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const authHeader = request.headers.get('authorization');
  const isBearer = authHeader === `Bearer ${CRON_SECRET}`;
  if (CRON_SECRET && secret !== CRON_SECRET && !isBearer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = process.env.DHAN_CLIENT_ID || '';
  if (!clientId) {
    return NextResponse.json({ error: 'DHAN_CLIENT_ID not set' }, { status: 500 });
  }

  const currentToken = await getDhanAccessToken();
  if (!currentToken) {
    return NextResponse.json(
      { error: 'No Dhan token present. Seed DHAN_ACCESS_TOKEN in env for first boot.' },
      { status: 500 },
    );
  }

  try {
    const resp = await axios.get('https://api.dhan.co/v2/RenewToken', {
      headers: {
        'access-token': currentToken,
        'dhanClientId': clientId,
      },
      timeout: 15_000,
      validateStatus: () => true,
    });

    if (resp.status === 200 && resp.data?.token) {
      await setDhanAccessToken(resp.data.token);
      console.log(`[Cron:RenewToken] Token renewed. Expires: ${resp.data.expiryTime || 'unknown'}`);
      return NextResponse.json({
        ok: true,
        expiryTime: resp.data.expiryTime || null,
        rotatedAt: new Date().toISOString(),
      });
    }

    console.error(`[Cron:RenewToken] Renewal failed (${resp.status}):`, resp.data);
    return NextResponse.json(
      { ok: false, status: resp.status, body: resp.data },
      { status: 502 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[Cron:RenewToken] Error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
