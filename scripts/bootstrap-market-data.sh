#!/usr/bin/env bash
# Bootstrap market data on the VPS after the app service is running.
#
# Usage:
#   ./scripts/bootstrap-market-data.sh
#   ./scripts/bootstrap-market-data.sh --backfill
#
# This script:
#   1. Triggers authenticated NSE and BSE live syncs.
#   2. Optionally runs the 10-year historical backfill.
#   3. Clears the in-process historical cache so the app reloads DB history.

set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE=""
for f in .env.local .env /etc/stock-market-app.env /etc/stock-market-app-cron.env; do
  if [[ -f "$f" ]]; then
    ENV_FILE="$f"
    break
  fi
done

if [[ -z "$ENV_FILE" ]]; then
  echo "ERROR: no env file found (.env.local / .env / /etc/stock-market-app.env / /etc/stock-market-app-cron.env)" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

: "${CRON_SECRET:?CRON_SECRET must be set}"
: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${DHAN_CLIENT_ID:?DHAN_CLIENT_ID must be set}"
: "${DHAN_ACCESS_TOKEN:?DHAN_ACCESS_TOKEN must be set for first market bootstrap}"

APP_URL="${APP_URL:-http://127.0.0.1:${PORT:-3000}}"

echo "==> Using app URL: $APP_URL"
echo "==> Triggering first NSE sync"
curl -fsS --max-time 120 -H "Authorization: Bearer ${CRON_SECRET}" \
  "${APP_URL}/api/sync?action=trigger&exchange=NSE" >/tmp/stock-market-sync-nse.json
cat /tmp/stock-market-sync-nse.json
echo

echo "==> Triggering first BSE sync"
curl -fsS --max-time 180 -H "Authorization: Bearer ${CRON_SECRET}" \
  "${APP_URL}/api/sync?action=trigger&exchange=BSE" >/tmp/stock-market-sync-bse.json
cat /tmp/stock-market-sync-bse.json
echo

if [[ "${1:-}" == "--backfill" ]]; then
  echo "==> Running historical backfill. This can take a while and is safe to rerun."
  npm run backfill
fi

echo "==> Clearing historical in-memory cache"
curl -fsS --max-time 30 -H "Authorization: Bearer ${CRON_SECRET}" \
  "${APP_URL}/api/cron/snapshot?forceReload=true" >/tmp/stock-market-force-reload.json
cat /tmp/stock-market-force-reload.json
echo

echo "==> Market data bootstrap complete"
