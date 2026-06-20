import { useState } from "react"
import { AlertCircle, HelpCircle, ShieldAlert } from "lucide-react"

import { DashboardLayout } from "@/components/DashboardLayout"
import { SignalForm } from "@/components/signal-form"
import { createSignal } from "@/services/signals"

export function CreateDashboardPage() {
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const handleCreateSignal = async (payload) => {
    setFormLoading(true)
    try {
      setFormError("")
      await createSignal(payload)
    } catch (error) {
      // Pass the validation or server error back down to SignalForm to handle
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <DashboardLayout title="Create Signal" subtitle="Publishing Hub">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Creation Form */}
        <div>
          <SignalForm
            onCreate={handleCreateSignal}
            loading={formLoading}
            errorMessage={formError}
            onClearError={setFormError}
          />
        </div>

        {/* Validation Rules & Help Details */}
        <section className="rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <HelpCircle className="h-5 w-5 text-[#ff9a4d]" />
              <h2 className="font-display text-xl text-white">Rule Specifications</h2>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-4">
                <h3 className="font-semibold text-emerald-300 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  BUY Signal Parameters
                </h3>
                <ul className="mt-2 list-disc list-inside text-xs text-emerald-100/80 space-y-1">
                  <li><strong>Stop Loss</strong> must be strictly <strong>below</strong> Entry Price.</li>
                  <li><strong>Target Price</strong> must be strictly <strong>above</strong> Entry Price.</li>
                </ul>
              </div>

              <div className="rounded-xl bg-red-500/10 border border-red-500/25 p-4">
                <h3 className="font-semibold text-red-300 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-red-400"></span>
                  SELL Signal Parameters
                </h3>
                <ul className="mt-2 list-disc list-inside text-xs text-red-100/80 space-y-1">
                  <li><strong>Stop Loss</strong> must be strictly <strong>above</strong> Entry Price.</li>
                  <li><strong>Target Price</strong> must be strictly <strong>below</strong> Entry Price.</li>
                </ul>
              </div>

              <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4">
                <h3 className="font-semibold text-white/90 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4 text-amber-300" />
                  General Rules
                </h3>
                <ul className="mt-2 list-disc list-inside text-xs text-white/70 space-y-1.5">
                  <li><strong>Expiry Time</strong> must always be after <strong>Entry Time</strong>.</li>
                  <li><strong>Entry Time</strong> in the past is allowed up to 24 hours for historical tracking.</li>
                  <li>Signals are evaluated live against current prices fetched from the <strong>Binance API</strong>.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[#ff9a4d]/20 bg-[#ff9a4d]/5 p-4 text-xs text-white/70 flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-[#ff9a4d] shrink-0 mt-0.5" />
            <p className="leading-5">
              Once submitted, signals are actively monitored. When prices cross the Target or Stop Loss, the state transitions dynamically. Expired signals lock their final state permanently.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
