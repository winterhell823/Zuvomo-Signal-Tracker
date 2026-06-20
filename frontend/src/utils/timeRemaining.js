export function timeRemaining(expiryTime) {
  const expiry = new Date(expiryTime).getTime()
  const now = Date.now()

  if (Number.isNaN(expiry) || expiry <= now) {
    return "Expired"
  }

  const totalMinutes = Math.floor((expiry - now) / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  return `${hours}h ${minutes}m`
}