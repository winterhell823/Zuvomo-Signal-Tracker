import { Bell, ChevronUp, Home, LayoutDashboard, PlusCircle, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { Footer } from "@/components/ui/footer-section"
import { PixelTrail } from "@/components/ui/pixel-trail"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useScreenSize } from "@/components/hooks/use-screen-size"

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Signal Monitor", url: "/dashboard/monitor", icon: LayoutDashboard },
  { title: "Create Signal", url: "/dashboard/create", icon: PlusCircle },
]

export function DashboardLayout({ children, title, subtitle }) {
  const screenSize = useScreenSize()
  const location = useLocation()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#101111] text-[#f4efe6] font-body">
      {/* Background Gradients & Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,190,120,0.14),_transparent_35%),linear-gradient(180deg,_rgba(19,19,19,0.35),_rgba(10,10,10,1))]" />
      <div className="absolute inset-0 bg-grain bg-[size:18px_18px] opacity-10 mix-blend-screen" />
      
      {/* Pixel Trail Effect */}
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
          {/* Sidebar */}
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
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={location.pathname === item.url}
                        >
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

          {/* Main Content Area */}
          <main className="relative z-10 flex flex-1 flex-col px-4 py-4 md:px-8 md:py-6 overflow-hidden">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl md:p-5">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="h-9 w-9 rounded-md border border-white/15 bg-white/5 text-white hover:bg-white/10" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">{subtitle || "Dashboard"}</p>
                  <h1 className="font-display text-2xl text-white md:text-3xl">{title}</h1>
                </div>
              </div>
              <span className="rounded-full border border-[#ff9a4d]/50 bg-[#ff9a4d]/20 px-3 py-1 text-xs text-[#ffd3aa]">
                Live Strategies
              </span>
            </div>

            {/* Dashboard Content */}
            <div className="flex flex-1 flex-col overflow-y-auto">
              {children}
              <div className="mt-8 shrink-0">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
