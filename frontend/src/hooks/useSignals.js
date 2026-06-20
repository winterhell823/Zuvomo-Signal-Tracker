import { useCallback, useEffect, useState } from "react"

import { getSignals } from "@/services/signals"

const REFRESH_INTERVAL_MS = 15000

export function useSignals() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadSignals = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setError("")
      }

      const data = await getSignals()
      setSignals(data)
    } catch (err) {
      if (!silent) {
        setError(err?.response?.data?.error || "Failed to load signals")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSignals()

    const interval = window.setInterval(() => {
      loadSignals(true)
    }, REFRESH_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [loadSignals])

  return {
    signals,
    loading,
    error,
    setError,
    reload: loadSignals,
  }
}
