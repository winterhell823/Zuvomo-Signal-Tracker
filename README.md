# Trading Signal Tracking Application

A production-ready full-stack trading signal tracker built with Node.js, Express.js, PostgreSQL, Prisma, React, Vite, and Axios. It creates and tracks trading signals, fetches live Binance prices on demand, calculates dynamic ROI, and enforces expiry rules with persisted signal state.

## Project Overview

The application allows users to create trading signals and monitor live performance from Binance market data. The system is split into two apps:

- `Backend/` - Express + Prisma API
- `frontend/` - React + Vite dashboard UI

The dashboard does not store live prices in the database. Every read request enriches stored signals with current Binance prices, computed status, ROI, and remaining time.

## Architecture Explanation

The backend follows a clean architecture style:

- Controllers handle HTTP request and response.
- Services contain business logic, validation, Binance integration, and status calculation.
- Routes only declare endpoints.
- Utils hold reusable pure helpers such as ROI and time calculations.
- Middlewares handle errors and 404 responses.

The frontend is a route-based React application:

- `/` shows the landing homepage.
- `/dashboard/monitor` is the **Signal Monitor** dashboard with live prices, status, ROI, and 15-second auto-refresh.
- `/dashboard/create` is the signal creation form.
- `/dashboard` redirects to the Signal Monitor.

## Folder Structure

### Backend

```text
Backend/
  src/
    controllers/
    services/
    routes/
    middlewares/
    utils/
    config/
    app.js
    server.js
  prisma/
    schema.prisma
  package.json
  .env
```

### Frontend

```text
frontend/
  src/
    pages/
    components/
    services/
    hooks/
    utils/
    App.jsx
    main.jsx
  package.json
  vite.config.js
```

## Setup Instructions

### Backend

```bash
cd Backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/zuvomo_signals?schema=public
PORT=5000
```

No Binance credentials are required. Live prices are fetched from public Binance market-data endpoints.

### Frontend

```env
VITE_API_URL=http://localhost:5000
```

## Prisma Setup

The Prisma schema is located at [Backend/prisma/schema.prisma](Backend/prisma/schema.prisma).

Generate Prisma Client:

```bash
cd Backend
npx prisma generate
```

Create and apply a migration:

```bash
cd Backend
npx prisma migrate dev --name init
```

Open Prisma Studio:

```bash
cd Backend
npx prisma studio
```

## Database Setup

Create a PostgreSQL database named `zuvomo_signals` or update `DATABASE_URL` to match your database name and credentials.

The `signals` table stores:

- `id` UUID primary key
- `symbol` trading pair like `BTCUSDT`
- `direction` enum `BUY` or `SELL`
- `entry_price`
- `stop_loss`
- `target_price`
- `entry_time`
- `expiry_time`
- `status` enum `OPEN`, `TARGET_HIT`, `STOPLOSS_HIT`, `EXPIRED`
- `realized_roi`
- `created_at`

## Migration Commands

```bash
cd Backend
npx prisma migrate dev --name init
npx prisma generate
```

If you change the Prisma schema later:

```bash
cd Backend
npx prisma migrate dev --name describe_change
```

## API Documentation

Base URL: `http://localhost:5000`

### POST /api/signals

Create a signal.

Request body:

```json
{
  "symbol": "BTCUSDT",
  "direction": "BUY",
  "entryPrice": 100000,
  "stopLoss": 98000,
  "targetPrice": 105000,
  "entryTime": "2026-06-19T12:00:00Z",
  "expiryTime": "2026-06-20T12:00:00Z"
}
```

Response:

```json
{
  "success": true,
  "data": {}
}
```

### GET /api/signals

Returns all signals enriched with live Binance price, status, and ROI.

### GET /api/signals/:id

Returns a single signal with live price, status, and ROI.

### GET /api/signals/:id/status

Returns:

```json
{
  "status": "OPEN",
  "currentPrice": 103000,
  "roi": 3.2
}
```

### DELETE /api/signals/:id

Deletes a signal.

Response:

```json
{
  "success": true
}
```

## Assumptions

- Binance symbols are provided in uppercase, for example `BTCUSDT`.
- Entry times can be backdated up to 24 hours for historical signal support.
- Expiry is always after entry time.
- Only expired status is persisted after the expiry cutoff; live target and stop-loss outcomes are still evaluated dynamically on read.
- Live prices are fetched from Binance on demand and are never persisted.

## Trade-offs

- The dashboard refreshes every 15 seconds instead of using websockets to keep the implementation simple and predictable.
- ROI is calculated from the current live price for open signals and from the latest evaluated state for expired signals.
- The frontend uses client-side polling rather than server push to avoid extra infrastructure.

## How Live Binance Integration Works

The backend service [Backend/src/services/binanceService.js](Backend/src/services/binanceService.js) fetches prices from public endpoints:

Primary:

```text
https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
```

Fallback (used automatically if the primary request fails):

```text
https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT
```

The service validates the symbol, parses the numeric price, and throws a controlled error for invalid symbols, network failures, and Binance API failures. No API keys or request signing are required.

## How Status Engine Works

The status engine is implemented in [Backend/src/services/signalStatusService.js](Backend/src/services/signalStatusService.js).

Priority order:

1. If current time is past expiry time, status becomes `EXPIRED`.
2. For BUY signals:
   - `currentPrice >= targetPrice` => `TARGET_HIT`
   - `currentPrice <= stopLoss` => `STOPLOSS_HIT`
   - otherwise `OPEN`
3. For SELL signals:
   - `currentPrice <= targetPrice` => `TARGET_HIT`
   - `currentPrice >= stopLoss` => `STOPLOSS_HIT`
   - otherwise `OPEN`

Expired signals are persisted as `EXPIRED` and never transition out of that state.

## How Expiry Logic Works

Expiry is the highest-priority rule. Once the current time is greater than the stored expiry time:

- The signal becomes `EXPIRED`
- The status is persisted in the database
- Later target or stop-loss events do not change the expired state

## How ROI Calculation Works

ROI is implemented in [Backend/src/utils/calculateROI.js](Backend/src/utils/calculateROI.js).

BUY:

```text
((currentPrice - entryPrice) / entryPrice) * 100
```

SELL:

```text
((entryPrice - currentPrice) / entryPrice) * 100
```

The result is rounded to 2 decimal places.

## Notes on Paths

The workspace uses `Backend/` with a capital `B`. That folder contains the API and Prisma project. The frontend lives in `frontend/`.
