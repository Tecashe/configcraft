// import type React from "react"
// import { AppNavigation } from "./app-navigation"
// import { getUserOrganizations, getCurrentOrganization } from "@/lib/organization"

// interface AppLayoutProps {
//   children: React.ReactNode
// }

// export async function AppLayout({ children }: AppLayoutProps) {
//   const organizations = await getUserOrganizations()
//   const currentOrganization = await getCurrentOrganization()

//   return (
//     <div className="min-h-screen bg-background">
//       <AppNavigation organizations={organizations} currentOrganization={currentOrganization} />

//       {/* Main content area with proper spacing for desktop sidebar */}
//       <div className="lg:pl-72">
//         <main className="min-h-screen">{children}</main>
//       </div>
//     </div>
//   )
// }

// "use client"

// import type React from "react"

// import { useUser } from "@clerk/nextjs"
// import { useParams, usePathname } from "next/navigation"
// import { AppNavigation } from "./app-navigation"
// import { Loader2 } from "lucide-react"

// interface AppLayoutProps {
//   children: React.ReactNode
// }

// export function AppLayout({ children }: AppLayoutProps) {
//   const { user, isLoaded } = useUser()
//   const params = useParams()
//   const pathname = usePathname()

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   // Check if we're on an organization page
//   const orgSlug = params?.slug as string
//   const isOrgPage = pathname?.startsWith(`/${orgSlug}`) && orgSlug

//   return (
//     <div className="min-h-screen bg-background">
//       <AppNavigation />
//       <main className="pl-64">
//         <div className="p-6">{children}</div>
//       </main>
//     </div>
//   )
// }

// "use client"

// import type React from "react"
// import { useUser } from "@clerk/nextjs"
// import { useParams, usePathname } from "next/navigation"
// import { AppNavigation } from "./app-navigation"
// import { Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useState, useEffect } from "react"

// interface AppLayoutProps {
//   children: React.ReactNode
// }

// export function AppLayout({ children }: AppLayoutProps) {
//   const { user, isLoaded } = useUser()
//   const params = useParams()
//   const pathname = usePathname()
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

//   // Handle responsive sidebar collapse
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarCollapsed(true)
//       }
//     }

//     handleResize()
//     window.addEventListener("resize", handleResize)
//     return () => window.removeEventListener("resize", handleResize)
//   }, [])

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           <p className="text-sm text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   // Check if we're on an organization page
//   const orgSlug = params?.slug as string
//   const isOrgPage = pathname?.startsWith(`/${orgSlug}`) && orgSlug

//   return (
//     <div className="min-h-screen bg-background">
//       <AppNavigation />

//       {/* Main Content */}
//       <main
//         className={cn(
//           "transition-all duration-300 min-h-screen",
//           "lg:pl-72", // Default desktop sidebar width
//           "lg:data-[sidebar-collapsed=true]:pl-16", // Collapsed sidebar width
//         )}
//       >
//         {/* Mobile-safe content wrapper */}
//         <div className="mobile-safe-area">
//           {/* Content with proper spacing */}
//           <div className="p-4 sm:p-6 lg:p-8 max-w-full">{children}</div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Wrench,
  Zap,
  Users,
  Settings,
  CreditCard,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Building2,
  Plus,
  Command,
  Sparkles,
} from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tools", href: "/tools", icon: Wrench },
  { name: "Integrations", href: "/integrations", icon: Zap },
  { name: "Team", href: "/team", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const params = useParams()
  const pathname = usePathname()
  const orgSlug = params?.slug as string

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const isActive = (href: string) => {
    const fullPath = `/${orgSlug}${href}`
    return pathname === fullPath
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href={`/${orgSlug}/dashboard`} className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">ConfigCraft</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="border-b p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <div className="flex items-center space-x-2 truncate">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">{orgSlug}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Building2 className="mr-2 h-4 w-4" />
                  {orgSlug}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={`/${orgSlug}${item.href}`}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6 px-3">
              <Link href={`/${orgSlug}/tools/create`}>
                <Button className="w-full" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tool
                </Button>
              </Link>
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 text-left">
                    <p className="text-sm font-medium">User Name</p>
                    <p className="text-xs text-muted-foreground">user@email.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="hidden lg:flex items-center space-x-2 text-muted-foreground bg-transparent"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search...</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  )
}
