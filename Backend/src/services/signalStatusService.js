function calculateSignalStatus(signal, currentPrice, now = new Date()) {
  if (signal.status === "EXPIRED") {
    return "EXPIRED"
  }

  const expiryTime = new Date(signal.expiryTime)

  if (now > expiryTime) {
    return "EXPIRED"
  }

  const entryPrice = Number(signal.entryPrice)
  const targetPrice = Number(signal.targetPrice)
  const stopLoss = Number(signal.stopLoss)
  const price = Number(currentPrice)

  if (!Number.isFinite(price)) {
    return "OPEN"
  }

  if (signal.direction === "BUY") {
    if (price >= targetPrice) {
      return "TARGET_HIT"
    }

    if (price <= stopLoss) {
      return "STOPLOSS_HIT"
    }

    return "OPEN"
  }

  if (price <= targetPrice) {
    return "TARGET_HIT"
  }

  if (price >= stopLoss) {
    return "STOPLOSS_HIT"
  }

  return "OPEN"
}

module.exports = {
  calculateSignalStatus,
}