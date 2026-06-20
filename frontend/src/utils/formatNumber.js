export function formatNumber(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return "-"
  }

  if (Math.abs(number) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(number)
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(number)
}