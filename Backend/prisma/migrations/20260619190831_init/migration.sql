-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "SignalStatus" AS ENUM ('OPEN', 'TARGET_HIT', 'STOPLOSS_HIT', 'EXPIRED');

-- CreateTable
CREATE TABLE "signals" (
    "id" UUID NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "direction" "Direction" NOT NULL,
    "entry_price" DECIMAL(18,8) NOT NULL,
    "stop_loss" DECIMAL(18,8) NOT NULL,
    "target_price" DECIMAL(18,8) NOT NULL,
    "entry_time" TIMESTAMP(6) NOT NULL,
    "expiry_time" TIMESTAMP(6) NOT NULL,
    "status" "SignalStatus" NOT NULL DEFAULT 'OPEN',
    "realized_roi" DECIMAL(18,8),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "signals_symbol_idx" ON "signals"("symbol");

-- CreateIndex
CREATE INDEX "signals_status_idx" ON "signals"("status");

-- CreateIndex
CREATE INDEX "signals_created_at_idx" ON "signals"("created_at");
