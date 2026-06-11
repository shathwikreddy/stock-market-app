/**
 * Dhan access token — single source of truth.
 *
 * Tokens expire every 24h. The renewal cron (/api/cron/renew-token) calls
 * Dhan /v2/RenewToken and writes the new value here via setDhanAccessToken().
 * All hot paths read via getDhanAccessToken() so the process picks up new
 * tokens without a restart.
 *
 * Storage: Setting table, key = 'dhan_access_token'.
 * Cache:   60s in-memory TTL — avoids per-request DB hit.
 * Bootstrap: if DB row is missing, falls back to process.env.DHAN_ACCESS_TOKEN
 *            and seeds the DB so subsequent reads use the DB.
 */

import { prisma } from '@/lib/prisma';

const KEY = 'dhan_access_token';
const TTL_MS = 60_000;

let cache: { value: string; ts: number } | null = null;

export async function getDhanAccessToken(): Promise<string> {
  const now = Date.now();
  if (cache && now - cache.ts < TTL_MS) return cache.value;

  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  if (row?.value) {
    cache = { value: row.value, ts: now };
    return row.value;
  }

  // Bootstrap from env and seed DB so future reads hit the DB.
  const envToken = process.env.DHAN_ACCESS_TOKEN || '';
  if (envToken) {
    try {
      await prisma.setting.upsert({
        where: { key: KEY },
        create: { key: KEY, value: envToken },
        update: { value: envToken },
      });
    } catch (e) {
      console.error('[dhan/token] failed to seed token to DB:', e instanceof Error ? e.message : e);
    }
    cache = { value: envToken, ts: now };
  }
  return envToken;
}

export async function setDhanAccessToken(value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  cache = { value, ts: Date.now() };
}

export function invalidateDhanTokenCache(): void {
  cache = null;
}
