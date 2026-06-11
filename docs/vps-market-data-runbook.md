# VPS Market Data Runbook

This app should run with Postgres as the market-data source of truth. Dhan is used by authenticated jobs to populate and refresh Postgres.

## Production Data Flow

1. `StockMaster` stores every NSE/BSE equity from the Dhan scrip master CSV.
2. `HistoricalPrice` stores 10-year daily close arrays for historical change columns and custom date ranges.
3. `LiveQuote` stores the latest computed live quote row for each stock.
4. `MarketStats` stores precomputed gainers/losers/unchanged summaries.
5. `/market` reads only from Postgres through `/api/market/live` and `/api/market/filters`.
6. Dhan API calls happen through authenticated sync jobs, not through normal user traffic.

## Required VPS Env

Create `/etc/stock-market-app.env` with mode `0600`:

```bash
DATABASE_URL="postgresql://stockapp:CHANGE_ME@127.0.0.1:5432/stockmarket?schema=public"
JWT_SECRET="CHANGE_ME_LONG_RANDOM"
CRON_SECRET="CHANGE_ME_LONG_RANDOM"
DHAN_CLIENT_ID="YOUR_DHAN_CLIENT_ID"
DHAN_ACCESS_TOKEN="INITIAL_DHAN_ACCESS_TOKEN"
NODE_ENV="production"
PORT="3000"
```

Create `/etc/stock-market-app-cron.env`:

```bash
CRON_SECRET="SAME_VALUE_AS_ABOVE"
APP_URL="http://127.0.0.1:3000"
```

Do not set `MARKET_REQUEST_SYNC=true` in production. That flag is only for local development when you intentionally want a read request to trigger Dhan sync.

## First VPS Bootstrap

```bash
sudo bash scripts/pg-setup.sh
./scripts/deploy.sh
sudo cp scripts/stock-market-app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now stock-market-app
npm run market:bootstrap -- --backfill
```

The bootstrap script triggers authenticated NSE and BSE live syncs, runs the historical backfill when `--backfill` is passed, then clears the in-memory historical cache so the app reloads DB history.

The backfill is safe to stop and rerun. It skips stocks that already have sufficient history.

## Enable Scheduled Jobs

```bash
sudo cp scripts/stock-market-app-cron.service scripts/stock-market-app-cron.timer /etc/systemd/system/
sudo cp scripts/stock-market-app-enrich.service scripts/stock-market-app-enrich.timer /etc/systemd/system/
sudo cp scripts/stock-market-app-renew.service scripts/stock-market-app-renew.timer /etc/systemd/system/
sudo cp scripts/stock-market-app-backup.service scripts/stock-market-app-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now stock-market-app-cron.timer
sudo systemctl enable --now stock-market-app-enrich.timer
sudo systemctl enable --now stock-market-app-renew.timer
sudo systemctl enable --now stock-market-app-backup.timer
```

## Verify

```bash
curl -fsS -H "Authorization: Bearer $CRON_SECRET" "http://127.0.0.1:3000/api/sync?action=status"
curl -fsS "http://127.0.0.1:3000/api/market/live?exchange=NSE&page=1&pageSize=5"
systemctl list-timers 'stock-market-app*'
journalctl -u stock-market-app -f
```

If `/api/market/live` says market data is not initialized, run `npm run market:bootstrap` after confirming the app service is running and Dhan env values are valid.
