CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "LiveQuote" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "securityId" INTEGER NOT NULL,
    "exchange" TEXT NOT NULL,
    "exchangeSegment" TEXT NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "sector" TEXT NOT NULL DEFAULT '-',
    "industry" TEXT NOT NULL DEFAULT '-',
    "series" TEXT NOT NULL DEFAULT '',
    "faceValue" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "marketCapValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketCapLabel" TEXT NOT NULL DEFAULT '-',
    "priceBand" TEXT NOT NULL DEFAULT 'No Band',
    "lastPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prevClose" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "open" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "high" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "low" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netChange" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pctChange" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "upperCircuit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lowerCircuit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "week52High" DOUBLE PRECISION,
    "week52Low" DOUBLE PRECISION,
    "percentChanges" JSONB NOT NULL DEFAULT '{}',
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveQuote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LiveQuote_securityId_exchange_key" ON "LiveQuote"("securityId", "exchange");
CREATE INDEX "LiveQuote_exchange_pctChange_idx" ON "LiveQuote"("exchange", "pctChange" DESC);
CREATE INDEX "LiveQuote_exchange_volume_idx" ON "LiveQuote"("exchange", "volume" DESC);
CREATE INDEX "LiveQuote_exchange_displayName_idx" ON "LiveQuote"("exchange", "displayName");
CREATE INDEX "LiveQuote_exchange_netChange_idx" ON "LiveQuote"("exchange", "netChange");

CREATE TABLE "MarketStats" (
    "id" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "totalStocks" INTEGER NOT NULL DEFAULT 0,
    "totalGainers" INTEGER NOT NULL DEFAULT 0,
    "totalLosers" INTEGER NOT NULL DEFAULT 0,
    "totalUnchanged" INTEGER NOT NULL DEFAULT 0,
    "avgGain" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgLoss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "topGainerName" TEXT,
    "topGainerSymbol" TEXT,
    "topGainerSector" TEXT,
    "topGainerLtp" DOUBLE PRECISION,
    "topGainerPct" DOUBLE PRECISION,
    "topLoserName" TEXT,
    "topLoserSymbol" TEXT,
    "topLoserSector" TEXT,
    "topLoserLtp" DOUBLE PRECISION,
    "topLoserPct" DOUBLE PRECISION,
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncCycles" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketStats_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MarketStats_exchange_key" ON "MarketStats"("exchange");
