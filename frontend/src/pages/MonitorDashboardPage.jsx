import { useMemo } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { DashboardLayout } from "@/components/DashboardLayout"
import { useSignals } from "@/hooks/useSignals"
import { deleteSignal } from "@/services/signals"
import { formatNumber } from "@/utils/formatNumber"
import { timeRemaining } from "@/utils/timeRemaining"

function badgeClasses(status) {
  if (status === "TARGET_HIT") {
    return "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
  }

  if (status === "STOPLOSS_HIT") {
    return "bg-red-500/20 text-red-200 border border-red-500/30"
  }

  if (status === "EXPIRED") {
    return "bg-slate-500/20 text-slate-200 border border-slate-500/30"
  }

  return "bg-amber-500/20 text-amber-200 border border-amber-500/30"
}

export function MonitorDashboardPage() {
  const { signals, loading, error, setError, reload } = useSignals()

  const handleDeleteSignal = async (id) => {
    try {
      setError("")
      await deleteSignal(id)
      await reload()
    } catch (deleteError) {
      setError(deleteError?.response?.data?.error || "Failed to delete signal")
    }
  }

  const emptyState = useMemo(() => {
    return !loading && signals.length === 0
  }, [loading, signals.length])

  return (
    <DashboardLayout title="Signal Monitor" subtitle="Tracking Hub">
      <section className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Signal Dashboard</p>
            <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1.5 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Auto-refreshing every 15s
            </p>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center text-white/70">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff9a4d] mb-2" />
              <span className="text-sm">Fetching live market data...</span>
            </div>
          ) : emptyState ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-white/65">
              <p className="text-lg font-medium text-white">No active signals</p>
              <p className="mt-2 max-w-sm text-sm leading-6">
                Create a trading signal in the "Create Signal" dashboard to begin tracking live Binance prices, ROI, and status.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[1040px] text-left text-sm border-collapse">
              <thead className="bg-white/[0.04] text-white/70">
                <tr>
                  <th className="px-4 py-3.5 font-medium rounded-l-xl">Symbol</th>
                  <th className="px-4 py-3.5 font-medium">Direction</th>
                  <th className="px-4 py-3.5 font-medium">Entry Price</th>
                  <th className="px-4 py-3.5 font-medium">Target</th>
                  <th className="px-4 py-3.5 font-medium">Stop Loss</th>
                  <th className="px-4 py-3.5 font-medium">Current Price (live)</th>
                  <th className="px-4 py-3.5 font-medium">Status</th>
                  <th className="px-4 py-3.5 font-medium">ROI %</th>
                  <th className="px-4 py-3.5 font-medium">Time Remaining</th>
                  <th className="px-4 py-3.5 font-medium rounded-r-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {signals.map((signal) => (
                  <tr key={signal.id} className="text-white/88 transition hover:bg-white/[0.02]">
                    <td className="px-4 py-4 font-semibold tracking-wide text-white">{signal.symbol}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        signal.direction === "BUY" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"
                      }`}>
                        {signal.direction}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono">{formatNumber(signal.entryPrice)}</td>
                    <td className="px-4 py-4 font-mono text-emerald-200">{formatNumber(signal.targetPrice)}</td>
                    <td className="px-4 py-4 font-mono text-red-200">{formatNumber(signal.stopLoss)}</td>
                    <td className="px-4 py-4 font-mono text-amber-200 font-medium">{formatNumber(signal.currentPrice)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClasses(signal.status)}`}>
                        {signal.status}
                      </span>
                    </td>
                    <td className={`px-4 py-4 font-semibold font-mono ${Number(signal.roi) >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                      {Number(signal.roi) >= 0 ? "+" : ""}{Number(signal.roi).toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-white/72">{timeRemaining(signal.expiryTime)}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs text-red-200 transition hover:bg-red-500/25 active:scale-95"
                        onClick={() => handleDeleteSignal(signal.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </DashboardLayout>
  )
}
