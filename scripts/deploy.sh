#!/usr/bin/env bash
# VM deployment script. Run from the project root on the target VM.
#
# Assumptions:
#   - Node 22.x (nvm use, or system package) is installed
#   - PostgreSQL is reachable via DATABASE_URL in .env.local
#   - .env.local exists at project root with all required secrets
#
# Usage:
#   ./scripts/deploy.sh          # install + migrate + build
#   ./scripts/deploy.sh --start  # same, then run `npm start`

set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env.local && ! -f .env ]]; then
  echo "ERROR: no .env.local or .env file found in $(pwd)" >&2
  exit 1
fi

# Load env so prisma sees DATABASE_URL
set -a
# shellcheck disable=SC1091
[[ -f .env.local ]] && source .env.local
[[ -f .env && ! -f .env.local ]] && source .env
set +a

: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${JWT_SECRET:?JWT_SECRET must be set}"
: "${CRON_SECRET:?CRON_SECRET must be set}"

echo "==> node $(node -v) / npm $(npm -v)"

echo "==> Installing dependencies (npm ci)"
npm ci --no-audit --no-fund

echo "==> Applying database migrations"
npx prisma migrate deploy

echo "==> Building Next.js (standalone)"
NODE_ENV=production npm run build

echo "==> Build complete. Standalone server at .next/standalone/server.js"

if [[ "${1:-}" == "--start" ]]; then
  echo "==> Starting server on :${PORT:-3000}"
  exec npm start
fi
