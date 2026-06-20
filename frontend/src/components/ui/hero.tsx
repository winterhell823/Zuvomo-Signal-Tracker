import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Marquee } from "@/components/ui/marquee"

const traderAvatars = [
  {
    initials: "TK",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    initials: "MR",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    initials: "SL",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    initials: "JW",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
  {
    initials: "AP",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
]

const stats = [
  { emoji: "📊", label: "LIVE SIGNALS TRACKED", value: "500+" },
  { emoji: "📈", label: "AVG ROI PER SIGNAL", value: "8.4%" },
  { emoji: "⚡", label: "BINANCE PAIRS MONITORED", value: "50+" },
  { emoji: "🎯", label: "TARGET HIT RATE", value: "72%" },
]

function AvatarStack() {
  return (
    <div className="flex -space-x-3">
      {traderAvatars.map((member, index) => (
        <Avatar
          className="h-12 w-12 border-2 border-primary bg-neutral-800"
          key={member.initials}
          style={{ zIndex: traderAvatars.length - index }}
        >
          <AvatarImage alt={`Trader ${index + 1}`} src={member.src} />
          <AvatarFallback className="bg-neutral-700 text-xs text-white">{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}

function StatsMarquee() {
  return (
    <Marquee
      className="border-y border-white/10 bg-black/30 py-2 backdrop-blur-sm [--duration:30s] [--gap:2rem]"
      pauseOnHover
      repeat={4}
    >
      {stats.map((stat) => (
        <div className="flex items-center gap-3 whitespace-nowrap" key={stat.label}>
          <span className="font-mono text-sm font-bold tracking-wide text-primary">{stat.value}</span>
          <span className="font-mono text-sm font-medium uppercase tracking-[0.15em] text-white/70">
            {stat.label}
          </span>
          <span className="text-base">{stat.emoji}</span>
        </div>
      ))}
    </Marquee>
  )
}

export function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-start justify-end">
      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-8 lg:px-16">
        <div className="space-y-4">
          <AvatarStack />
          <StatsMarquee />
        </div>
      </div>

      <div className="relative z-10 w-full px-4 pb-16 sm:px-8 sm:pb-24 lg:px-16 lg:pb-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="w-full space-y-4 sm:w-1/2">
            <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              We <span className="text-primary">signal</span>, you{" "}
              <span className="text-primary">trade</span>
              <br />
              <span className="text-white">— that&apos;s the deal</span>
            </h1>
            <Button asChild className="rounded-none py-0 pr-0 text-lg font-normal text-black">
              <Link to="/dashboard/monitor">
                Open Signal Monitor
                <span className="border-l border-neutral-500 p-3">
                  <ArrowRight />
                </span>
              </Link>
            </Button>
          </div>
          <div className="w-full sm:w-1/2">
            <p className="text-base italic text-primary sm:text-right md:text-2xl">
              Track live Binance prices, monitor ROI in real time, and let automated status logic
              tell you when targets hit, stop losses trigger, or signals expire — all from one
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
