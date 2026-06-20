import { useEffect, useMemo, useState } from "react"
import { Bell, ChevronUp, Home, Inbox, LayoutDashboard, Loader2, Search, Settings, Trash2, User } from "lucide-react"
import { Link } from "react-router-dom"

import { PixelTrail } from "@/components/ui/pixel-trail"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignalForm } from "@/components/signal-form"
import { createSignal, deleteSignal, getSignals } from "@/services/signals"
import { formatNumber } from "@/utils/formatNumber"
import { timeRemaining } from "@/utils/timeRemaining"
import { useScreenSize } from "@/components/hooks/use-screen-size"

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
]

function badgeClasses(status) {
  if (status === "TARGET_HIT") {
    return "bg-emerald-500/20 text-emerald-200"
  }

  if (status === "STOPLOSS_HIT") {
    return "bg-red-500/20 text-red-200"
  }

  if (status === "EXPIRED") {
    return "bg-slate-500/20 text-slate-200"
  }

  return "bg-amber-500/20 text-amber-200"
}

export function DashboardPage() {
  const screenSize = useScreenSize()
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState("")
  const [formError, setFormError] = useState("")

  const loadSignals = async () => {
    try {
      setError("")
      const data = await getSignals()
      setSignals(data)
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load signals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSignals()
    const interval = window.setInterval(loadSignals, 15000)
    return () => window.clearInterval(interval)
  }, [])

  const handleCreateSignal = async (payload) => {
    setFormLoading(true)
    try {
      setFormError("")
      await createSignal(payload)
      await loadSignals()
    } catch (error) {
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteSignal = async (id) => {
    try {
      setError("")
      await deleteSignal(id)
      await loadSignals()
    } catch (error) {
      setError(error?.response?.data?.error || "Failed to delete signal")
    }
  }

  const emptyState = useMemo(() => {
    return !loading && signals.length === 0
  }, [loading, signals.length])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#101111] text-[#f4efe6] font-body">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,190,120,0.14),_transparent_35%),linear-gradient(180deg,_rgba(19,19,19,0.35),_rgba(10,10,10,1))]" />
      <div className="absolute inset-0 bg-grain bg-[size:18px_18px] opacity-10 mix-blend-screen" />
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 34 : 70}
          fadeDuration={0}
          delay={1200}
          pixelClassName="rounded-full bg-[#ff9a4d] shadow-[0_0_20px_rgba(255,154,77,0.7)]"
        />
      </div>

      <SidebarProvider>
        <div className="relative z-10 flex min-h-screen w-full">
          <Sidebar className="border-r border-sidebar-border/70 bg-sidebar/95 backdrop-blur-xl">
            <SidebarHeader className="border-b border-sidebar-border/70 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">Zuvomo</p>
                  <h2 className="mt-2 font-display text-xl text-white">Trade Desk</h2>
                </div>
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                  <Bell className="h-4 w-4" />
                </button>
              </div>
              <SidebarInput placeholder="Search ticker..." className="mt-3 border-sidebar-border bg-black/30" />
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.title === "Dashboard"}>
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/70 p-3">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-12 justify-between" tooltip="Account">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">John Doe</span>
                        <span className="text-xs text-sidebar-foreground/65">john@example.com</span>
                      </div>
                    </div>
                    <ChevronUp className="h-4 w-4 text-sidebar-foreground/70" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="relative z-10 flex flex-1 flex-col px-4 py-4 md:px-8 md:py-6">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl md:p-5">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-9 w-9 rounded-md border border-white/15 bg-white/5 text-white hover:bg-white/10" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Dashboard</p>
                  <h1 className="font-display text-2xl text-white md:text-3xl">Signal Monitor</h1>
                </div>
              </div>
              <span className="rounded-full border border-[#ff9a4d]/50 bg-[#ff9a4d]/20 px-3 py-1 text-xs text-[#ffd3aa]">
                Live Strategies
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <SignalForm
                onCreate={handleCreateSignal}
                loading={formLoading}
                errorMessage={formError}
                onClearError={setFormError}
              />

              <section className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Signal Dashboard</p>
                <div className="mt-4 overflow-x-auto">
                  {error ? <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
                  {loading ? (
                    <div className="flex h-64 items-center justify-center text-white/70">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading signals...
                    </div>
                  ) : emptyState ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center text-white/65">
                      <p className="text-lg font-medium text-white">No signals yet</p>
                      <p className="mt-2 max-w-sm text-sm leading-6">
                        Create your first trading signal to begin tracking live performance, status, and ROI.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full min-w-[1040px] text-left text-sm">
                      <thead className="bg-white/[0.04] text-white/70">
                        <tr>
                          <th className="px-4 py-3 font-medium">Symbol</th>
                          <th className="px-4 py-3 font-medium">Direction</th>
                          <th className="px-4 py-3 font-medium">Entry Price</th>
                          <th className="px-4 py-3 font-medium">Target Price</th>
                          <th className="px-4 py-3 font-medium">Stop Loss</th>
                          <th className="px-4 py-3 font-medium">Current Price</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">ROI %</th>
                          <th className="px-4 py-3 font-medium">Time Remaining</th>
                          <th className="px-4 py-3 font-medium">Delete Button</th>
                        </tr>
                      </thead>
                      <tbody>
                        {signals.map((signal) => (
                          <tr key={signal.id} className="border-t border-white/10 text-white/88">
                            <td className="px-4 py-3 font-semibold tracking-wide">{signal.symbol}</td>
                            <td className="px-4 py-3">{signal.direction}</td>
                            <td className="px-4 py-3">{formatNumber(signal.entryPrice)}</td>
                            <td className="px-4 py-3">{formatNumber(signal.targetPrice)}</td>
                            <td className="px-4 py-3">{formatNumber(signal.stopLoss)}</td>
                            <td className="px-4 py-3">{formatNumber(signal.currentPrice)}</td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2 py-1 text-xs ${badgeClasses(signal.status)}`}>{signal.status}</span>
                            </td>
                            <td className={`px-4 py-3 font-semibold ${Number(signal.roi) >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                              {Number(signal.roi).toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-white/72">{timeRemaining(signal.expiryTime)}</td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/20"
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
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}