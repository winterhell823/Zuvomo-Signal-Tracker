require("dotenv").config()

const { PrismaClient, Prisma } = require("@prisma/client")
const { fetchCurrentPrice } = require("../src/services/binanceService")

const prisma = new PrismaClient()

const BINANCE_PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "MATICUSDT",
]

function roundPrice(value, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function priceDecimals(price) {
  if (price >= 1000) return 2
  if (price >= 1) return 4
  return 6
}

function buildSignalFromPrice(symbol, currentPrice, direction) {
  const decimals = priceDecimals(currentPrice)
  const entryPrice = roundPrice(currentPrice, decimals)

  if (direction === "BUY") {
    return {
      symbol,
      direction,
      entryPrice,
      stopLoss: roundPrice(entryPrice * 0.97, decimals),
      targetPrice: roundPrice(entryPrice * 1.05, decimals),
    }
  }

  return {
    symbol,
    direction,
    entryPrice,
    stopLoss: roundPrice(entryPrice * 1.03, decimals),
    targetPrice: roundPrice(entryPrice * 0.95, decimals),
  }
}

function randomHoursAgo(maxHours = 12) {
  const hours = Math.floor(Math.random() * maxHours)
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

function randomExpiryHoursFrom(entryTime, minHours = 6, maxHours = 48) {
  const hours = minHours + Math.floor(Math.random() * (maxHours - minHours))
  return new Date(entryTime.getTime() + hours * 60 * 60 * 1000)
}

function shuffle(items) {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  return copy
}

async function main() {
  const existingCount = await prisma.signal.count()
  const targetCount = 6
  const signalsToCreate = Math.max(0, targetCount - existingCount)

  if (signalsToCreate === 0) {
    console.log(`Database already has ${existingCount} signals. Skipping seed.`)
    return
  }

  const selectedPairs = shuffle(BINANCE_PAIRS).slice(0, signalsToCreate)
  const created = []

  for (const symbol of selectedPairs) {
    const currentPrice = await fetchCurrentPrice(symbol)
    const direction = Math.random() > 0.5 ? "BUY" : "SELL"
    const signal = buildSignalFromPrice(symbol, currentPrice, direction)
    const entryTime = randomHoursAgo()
    const expiryTime = randomExpiryHoursFrom(entryTime)

    const record = await prisma.signal.create({
      data: {
        symbol: signal.symbol,
        direction: signal.direction,
        entryPrice: new Prisma.Decimal(signal.entryPrice),
        stopLoss: new Prisma.Decimal(signal.stopLoss),
        targetPrice: new Prisma.Decimal(signal.targetPrice),
        entryTime,
        expiryTime,
      },
    })

    created.push({
      id: record.id,
      symbol: record.symbol,
      direction: record.direction,
      entryPrice: signal.entryPrice,
    })
  }

  console.log(`Seeded ${created.length} signal(s):`)
  created.forEach((signal) => {
    console.log(`  ${signal.direction} ${signal.symbol} @ ${signal.entryPrice}`)
  })
}

main()
  .catch((error) => {
    console.error("Seed failed:", error.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
