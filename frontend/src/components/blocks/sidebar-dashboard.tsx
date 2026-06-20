import {
  Bell,
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  LayoutDashboard,
  Search,
  Settings,
  User,
} from "lucide-react"
import { Link } from "react-router-dom"

import { useScreenSize } from "@/components/hooks/use-screen-size"
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

type TradeRow = {
  symbol: string
  direction: "Long" | "Short"
  entryPrice: number
  target: number
  stopLoss: number
  currentLivePrice: number
  status: "Open" | "Hit Target" | "Stopped"
  roi: string
  timeRemaining: string
}

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
]

const trades: TradeRow[] = [
  {
    symbol: "BTCUSDT",
    direction: "Long",
    entryPrice: 67420,
    target: 68980,
    stopLoss: 66100,
    currentLivePrice: 68211,
    status: "Open",
    roi: "+1.17%",
    timeRemaining: "04h 12m",
  },
  {
    symbol: "ETHUSDT",
    direction: "Short",
    entryPrice: 3525,
    target: 3388,
    stopLoss: 3602,
    currentLivePrice: 3457,
    status: "Open",
    roi: "+1.93%",
    timeRemaining: "09h 55m",
  },
  {
    symbol: "SOLUSDT",
    direction: "Long",
    entryPrice: 168.2,
    target: 177.5,
    stopLoss: 163.4,
    currentLivePrice: 177.5,
    status: "Hit Target",
    roi: "+5.53%",
    timeRemaining: "Closed",
  },
  {
    symbol: "XRPUSDT",
    direction: "Long",
    entryPrice: 0.684,
    target: 0.739,
    stopLoss: 0.659,
    currentLivePrice: 0.661,
    status: "Stopped",
    roi: "-3.36%",
    timeRemaining: "Closed",
  },
]

const heroImage =
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"

export function SidebarDashboard() {
  const screenSize = useScreenSize()

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

          <main id="dashboard" className="relative z-10 flex flex-1 flex-col px-4 py-4 md:px-8 md:py-6">
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

            <section className="grid gap-4 pb-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Market Overview</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                  Track live positions, target windows, and risk controls with a dashboard tuned for
                  high-contrast readability on the same ambient dark theme.
                </p>
              </div>
              <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl">
                <img alt="Desk setup" className="h-full min-h-[150px] w-full object-cover" src={heroImage} />
              </figure>
            </section>

            <section className="rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1040px] text-left text-sm">
                  <thead className="bg-white/[0.04] text-white/70">
                    <tr>
                      <th className="px-4 py-3 font-medium">Symbol</th>
                      <th className="px-4 py-3 font-medium">Direction</th>
                      <th className="px-4 py-3 font-medium">Entry Price</th>
                      <th className="px-4 py-3 font-medium">Target</th>
                      <th className="px-4 py-3 font-medium">Stop Loss</th>
                      <th className="px-4 py-3 font-medium">Current Live Price</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">ROI %</th>
                      <th className="px-4 py-3 font-medium">Time Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade) => {
                      const roiPositive = trade.roi.startsWith("+")
                      const statusTone =
                        trade.status === "Hit Target"
                          ? "bg-emerald-500/20 text-emerald-200"
                          : trade.status === "Stopped"
                            ? "bg-red-500/20 text-red-200"
                            : "bg-amber-500/20 text-amber-200"

                      return (
                        <tr key={trade.symbol} className="border-t border-white/10 text-white/88">
                          <td className="px-4 py-3 font-semibold tracking-wide">{trade.symbol}</td>
                          <td className="px-4 py-3">{trade.direction}</td>
                          <td className="px-4 py-3">{trade.entryPrice}</td>
                          <td className="px-4 py-3">{trade.target}</td>
                          <td className="px-4 py-3">{trade.stopLoss}</td>
                          <td className="px-4 py-3">{trade.currentLivePrice}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-1 text-xs ${statusTone}`}>{trade.status}</span>
                          </td>
                          <td className={`px-4 py-3 font-semibold ${roiPositive ? "text-emerald-300" : "text-red-300"}`}>
                            {trade.roi}
                          </td>
                          <td className="px-4 py-3 text-white/72">{trade.timeRemaining}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}