import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
  Facebook,
  Frame,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react"
import { Link } from "react-router-dom"

interface FooterLink {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  external?: boolean
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: "Product",
    links: [
      { title: "Signal Monitor", href: "/dashboard/monitor" },
      { title: "Create Signal", href: "/dashboard/create" },
      { title: "Live Prices", href: "/dashboard/monitor" },
      { title: "ROI Tracking", href: "/dashboard/monitor" },
    ],
  },
  {
    label: "Platform",
    links: [
      { title: "Binance Integration", href: "/dashboard/monitor" },
      { title: "Status Engine", href: "/dashboard/monitor" },
      { title: "Expiry Logic", href: "/dashboard/monitor" },
      { title: "API Health", href: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/health`, external: true },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Documentation", href: "/" },
      { title: "Trading Pairs", href: "/dashboard/create" },
      { title: "Signal Rules", href: "/dashboard/create" },
      { title: "Help Center", href: "/" },
    ],
  },
  {
    label: "Social Links",
    links: [
      { title: "Facebook", href: "#", icon: Facebook },
      { title: "Instagram", href: "#", icon: Instagram },
      { title: "Youtube", href: "#", icon: Youtube },
      { title: "LinkedIn", href: "#", icon: Linkedin },
    ],
  },
]

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>["className"]
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = "inline-flex items-center transition-all duration-300 hover:text-foreground"
  const content = (
    <>
      {link.icon ? <link.icon className="me-1 size-4" /> : null}
      {link.title}
    </>
  )

  if (link.external) {
    return (
      <a className={className} href={link.href} rel="noreferrer" target="_blank">
        {content}
      </a>
    )
  }

  if (link.href.startsWith("#")) {
    return (
      <a className={className} href={link.href}>
        {content}
      </a>
    )
  }

  return (
    <Link className={className} to={link.href}>
      {content}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="relative mx-auto mt-auto flex w-full max-w-6xl flex-col items-center justify-center rounded-t-4xl border-t border-white/10 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-6 py-12 md:rounded-t-6xl lg:py-16">
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/20 blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <Frame className="size-8 text-primary" />
          <p className="mt-8 text-sm text-muted-foreground md:mt-0">
            © {new Date().getFullYear()} Zuvomo. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  {section.label}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  )
}
