function decimalToNumber(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === "number") {
    return value
  }

  if (typeof value.toNumber === "function") {
    return value.toNumber()
  }

  return Number(value)
}

module.exports = decimalToNumber