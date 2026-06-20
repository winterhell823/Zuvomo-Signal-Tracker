import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

import { Footer } from "@/components/ui/footer-section"
import { Hero } from "@/components/ui/hero"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { useScreenSize } from "@/components/hooks/use-screen-size"

export function Homepage() {
  const screenSize = useScreenSize()

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#101111] text-[#f4efe6] font-body">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,190,120,0.16),_transparent_35%),linear-gradient(180deg,_rgba(19,19,19,0.3),_rgba(10,10,10,1))]" />
      <div className="absolute inset-0 bg-grain bg-[size:18px_18px] opacity-10 mix-blend-screen" />

      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 36 : 72}
          fadeDuration={0}
          delay={1200}
          pixelClassName="rounded-full bg-[#ff9a4d] shadow-[0_0_20px_rgba(255,154,77,0.7)]"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-white/50">Zuvomo</p>
            <h1 className="mt-2 font-display text-xl tracking-tight text-white sm:text-2xl">
              Trading Signal Tracker
            </h1>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
            to="/dashboard/monitor"
          >
            Open dashboard
            <ArrowRight size={16} />
          </Link>
        </header>

        <Hero />

        <div className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
          <Footer />
        </div>
      </div>
    </div>
  )
}
