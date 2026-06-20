const axios = require("axios")

const AppError = require("../utils/AppError")

const PRIMARY_BASE_URL = "https://api.binance.com/api/v3"
const FALLBACK_BASE_URL = "https://data-api.binance.vision/api/v3"
const REQUEST_TIMEOUT_MS = 8000

async function fetchPriceFromEndpoint(baseURL, symbol) {
  const response = await axios.get(`${baseURL}/ticker/price`, {
    params: { symbol },
    timeout: REQUEST_TIMEOUT_MS,
  })

  const price = Number(response.data?.price)

  if (!Number.isFinite(price)) {
    throw new AppError(502, "Failed to parse live price from Binance")
  }

  return price
}

function isInvalidSymbolError(error) {
  const status = error.response?.status
  const code = error.response?.data?.code

  return status === 400 || code === -1121
}

async function fetchCurrentPrice(symbol) {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase()

  if (!normalizedSymbol) {
    throw new AppError(400, "Symbol is required")
  }

  try {
    return await fetchPriceFromEndpoint(PRIMARY_BASE_URL, normalizedSymbol)
  } catch (primaryError) {
    if (primaryError instanceof AppError) {
      throw primaryError
    }

    if (isInvalidSymbolError(primaryError)) {
      throw new AppError(400, `Invalid symbol: ${normalizedSymbol}`)
    }

    try {
      return await fetchPriceFromEndpoint(FALLBACK_BASE_URL, normalizedSymbol)
    } catch (fallbackError) {
      if (fallbackError instanceof AppError) {
        throw fallbackError
      }

      if (isInvalidSymbolError(fallbackError)) {
        throw new AppError(400, `Invalid symbol: ${normalizedSymbol}`)
      }

      throw new AppError(502, `Failed to fetch live price from Binance for ${normalizedSymbol}`)
    }
  }
}

module.exports = {
  fetchCurrentPrice,
}
