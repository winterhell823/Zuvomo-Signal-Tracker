function calculateROI(direction, entryPrice, currentPrice) {
  const entry = Number(entryPrice)
  const current = Number(currentPrice)

  if (!Number.isFinite(entry) || !Number.isFinite(current) || entry === 0) {
    return 0
  }

  const roi =
    direction === "BUY"
      ? ((current - entry) / entry) * 100
      : ((entry - current) / entry) * 100

  return Number(roi.toFixed(2))
}

module.exports = calculateROI