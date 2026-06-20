const { Prisma } = require("@prisma/client")
const { z } = require("zod")

const prisma = require("../config/prisma")
const AppError = require("../utils/AppError")
const decimalToNumber = require("../utils/number")
const calculateROI = require("../utils/calculateROI")
const { fetchCurrentPrice } = require("./binanceService")
const { calculateSignalStatus } = require("./signalStatusService")

const signalCreateSchema = z
  .object({
    symbol: z.string().trim().min(3).max(20),
    direction: z.enum(["BUY", "SELL"]),
    entryPrice: z.coerce.number().positive("Entry price must be greater than 0"),
    stopLoss: z.coerce.number(),
    targetPrice: z.coerce.number(),
    entryTime: z.coerce.date(),
    expiryTime: z.coerce.date(),
  })
  .superRefine((value, context) => {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    if (value.entryTime < twentyFourHoursAgo) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["entryTime"],
        message: "Entry time may not be more than 24 hours in the past",
      })
    }

    if (value.expiryTime <= value.entryTime) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryTime"],
        message: "Expiry time must be after entry time",
      })
    }

    if (value.direction === "BUY") {
      if (value.stopLoss >= value.entryPrice) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stopLoss"],
          message: "For BUY signals stop loss must be below entry price",
        })
      }

      if (value.targetPrice <= value.entryPrice) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["targetPrice"],
          message: "For BUY signals target price must be above entry price",
        })
      }
    }

    if (value.direction === "SELL") {
      if (value.stopLoss <= value.entryPrice) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["stopLoss"],
          message: "For SELL signals stop loss must be above entry price",
        })
      }

      if (value.targetPrice >= value.entryPrice) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["targetPrice"],
          message: "For SELL signals target price must be below entry price",
        })
      }
    }
  })

function mapSignal(signal, currentPrice) {
  const roi = calculateROI(signal.direction, decimalToNumber(signal.entryPrice), currentPrice)
  const status = calculateSignalStatus(signal, currentPrice)

  return {
    id: signal.id,
    symbol: signal.symbol,
    direction: signal.direction,
    entryPrice: decimalToNumber(signal.entryPrice),
    stopLoss: decimalToNumber(signal.stopLoss),
    targetPrice: decimalToNumber(signal.targetPrice),
    entryTime: signal.entryTime,
    expiryTime: signal.expiryTime,
    status,
    currentPrice,
    roi,
    realizedROI: decimalToNumber(signal.realizedROI),
    createdAt: signal.createdAt,
  }
}

async function createSignal(payload) {
  const parsed = signalCreateSchema.safeParse(payload)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Invalid signal data"
    throw new AppError(400, message, parsed.error.flatten())
  }

  const normalized = {
    ...parsed.data,
    symbol: parsed.data.symbol.toUpperCase(),
  }

  await fetchCurrentPrice(normalized.symbol)

  const createdSignal = await prisma.signal.create({
    data: {
      symbol: normalized.symbol,
      direction: normalized.direction,
      entryPrice: new Prisma.Decimal(normalized.entryPrice),
      stopLoss: new Prisma.Decimal(normalized.stopLoss),
      targetPrice: new Prisma.Decimal(normalized.targetPrice),
      entryTime: normalized.entryTime,
      expiryTime: normalized.expiryTime,
    },
  })

  const currentPrice = await fetchCurrentPrice(normalized.symbol)
  return mapSignal(createdSignal, currentPrice)
}

async function getAllSignals() {
  const signals = await prisma.signal.findMany({ orderBy: { createdAt: "desc" } })

  const enrichedSignals = await Promise.all(
    signals.map(async (signal) => {
      const currentPrice = await fetchCurrentPrice(signal.symbol)
      const status = calculateSignalStatus(signal, currentPrice)

      if (status === "EXPIRED" && signal.status !== "EXPIRED") {
        const realizedROI = calculateROI(
          signal.direction,
          decimalToNumber(signal.entryPrice),
          currentPrice
        )

        await prisma.signal.update({
          where: { id: signal.id },
          data: {
            status: "EXPIRED",
            realizedROI: new Prisma.Decimal(realizedROI),
          },
        })

        signal.status = "EXPIRED"
        signal.realizedROI = new Prisma.Decimal(realizedROI)
      }

      return mapSignal(signal, currentPrice)
    })
  )

  return enrichedSignals
}

async function getSignalById(id) {
  const signal = await prisma.signal.findUnique({ where: { id } })

  if (!signal) {
    throw new AppError(404, "Signal not found")
  }

  const currentPrice = await fetchCurrentPrice(signal.symbol)
  const status = calculateSignalStatus(signal, currentPrice)

  if (status === "EXPIRED" && signal.status !== "EXPIRED") {
    const realizedROI = calculateROI(signal.direction, decimalToNumber(signal.entryPrice), currentPrice)

    await prisma.signal.update({
      where: { id: signal.id },
      data: {
        status: "EXPIRED",
        realizedROI: new Prisma.Decimal(realizedROI),
      },
    })

    signal.status = "EXPIRED"
    signal.realizedROI = new Prisma.Decimal(realizedROI)
  }

  return mapSignal(signal, currentPrice)
}

async function getSignalStatusById(id) {
  const signal = await prisma.signal.findUnique({ where: { id } })

  if (!signal) {
    throw new AppError(404, "Signal not found")
  }

  const currentPrice = await fetchCurrentPrice(signal.symbol)
  const status = calculateSignalStatus(signal, currentPrice)
  const roi = calculateROI(signal.direction, decimalToNumber(signal.entryPrice), currentPrice)

  if (status === "EXPIRED" && signal.status !== "EXPIRED") {
    await prisma.signal.update({
      where: { id: signal.id },
      data: {
        status: "EXPIRED",
        realizedROI: new Prisma.Decimal(roi),
      },
    })
  }

  return {
    status,
    currentPrice,
    roi,
  }
}

async function deleteSignal(id) {
  try {
    await prisma.signal.delete({ where: { id } })
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError(404, "Signal not found")
    }

    throw error
  }
}

module.exports = {
  createSignal,
  getAllSignals,
  getSignalById,
  getSignalStatusById,
  deleteSignal,
}