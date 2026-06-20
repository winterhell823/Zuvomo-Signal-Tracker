import { useState } from "react"

const initialForm = {
  symbol: "",
  direction: "BUY",
  entryPrice: "",
  stopLoss: "",
  targetPrice: "",
  entryTime: "",
  expiryTime: "",
}

export function SignalForm({ onCreate, loading, errorMessage, onClearError }) {
  const [form, setForm] = useState(initialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setFieldErrors({})
    setSuccessMessage("")
    onClearError?.()

    try {
      await onCreate({
        symbol: form.symbol,
        direction: form.direction,
        entryPrice: Number(form.entryPrice),
        stopLoss: Number(form.stopLoss),
        targetPrice: Number(form.targetPrice),
        entryTime: new Date(form.entryTime).toISOString(),
        expiryTime: new Date(form.expiryTime).toISOString(),
      })

      setForm(initialForm)
      setSuccessMessage("Signal created successfully")
    } catch (error) {
      const responseErrors = error?.response?.data?.details?.fieldErrors
      if (responseErrors) {
        const normalized = Object.entries(responseErrors).reduce((acc, [key, value]) => {
          acc[key] = Array.isArray(value) ? value[0] : value
          return acc
        }, {})
        setFieldErrors(normalized)
      } else {
        const message = error?.response?.data?.error || "Failed to create signal"
        onClearError?.(message)
      }
    }
  }

  return (
    <form className="grid gap-4 rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl" onSubmit={submit}>
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">Create Signal</p>
        <h2 className="mt-2 font-display text-2xl text-white">New Trading Signal</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-white/80">
          Symbol
          <input
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-white/35 focus:border-[#ff9a4d]"
            value={form.symbol}
            onChange={(event) => updateField("symbol", event.target.value.toUpperCase())}
            placeholder="BTCUSDT"
          />
          {fieldErrors.symbol ? <span className="text-sm text-red-300">{fieldErrors.symbol}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-white/80">
          Direction
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff9a4d]"
            value={form.direction}
            onChange={(event) => updateField("direction", event.target.value)}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          {fieldErrors.direction ? <span className="text-sm text-red-300">{fieldErrors.direction}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-white/80">
          Entry Price
          <input
            type="number"
            step="0.00000001"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff9a4d]"
            value={form.entryPrice}
            onChange={(event) => updateField("entryPrice", event.target.value)}
          />
          {fieldErrors.entryPrice ? <span className="text-sm text-red-300">{fieldErrors.entryPrice}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-white/80">
          Stop Loss
          <input
            type="number"
            step="0.00000001"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff9a4d]"
            value={form.stopLoss}
            onChange={(event) => updateField("stopLoss", event.target.value)}
          />
          {fieldErrors.stopLoss ? <span className="text-sm text-red-300">{fieldErrors.stopLoss}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-white/80">
          Target Price
          <input
            type="number"
            step="0.00000001"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff9a4d]"
            value={form.targetPrice}
            onChange={(event) => updateField("targetPrice", event.target.value)}
          />
          {fieldErrors.targetPrice ? <span className="text-sm text-red-300">{fieldErrors.targetPrice}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-white/80">
          Entry Time
          <input
            type="datetime-local"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff9a4d]"
            value={form.entryTime}
            onChange={(event) => updateField("entryTime", event.target.value)}
          />
          {fieldErrors.entryTime ? <span className="text-sm text-red-300">{fieldErrors.entryTime}</span> : null}
        </label>

        <label className="grid gap-2 text-sm text-white/80">
          Expiry Time
          <input
            type="datetime-local"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#ff9a4d]"
            value={form.expiryTime}
            onChange={(event) => updateField("expiryTime", event.target.value)}
          />
          {fieldErrors.expiryTime ? <span className="text-sm text-red-300">{fieldErrors.expiryTime}</span> : null}
        </label>
      </div>

      {errorMessage ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{errorMessage}</div> : null}
      {successMessage ? <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</div> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#ff9a4d] px-5 py-3 text-sm font-semibold text-[#1b130d] transition hover:bg-[#ffb56b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Creating..." : "Create Signal"}
      </button>
    </form>
  )
}