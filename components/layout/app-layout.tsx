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

"use client"

import type React from "react"
import { useUser } from "@clerk/nextjs"
import { useParams, usePathname } from "next/navigation"
import { AppNavigation } from "./app-navigation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoaded } = useUser()
  const params = useParams()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Handle responsive sidebar collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check if we're on an organization page
  const orgSlug = params?.slug as string
  const isOrgPage = pathname?.startsWith(`/${orgSlug}`) && orgSlug

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          "lg:pl-72", // Default desktop sidebar width
          "lg:data-[sidebar-collapsed=true]:pl-16", // Collapsed sidebar width
        )}
      >
        {/* Mobile-safe content wrapper */}
        <div className="mobile-safe-area">
          {/* Content with proper spacing */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-full">{children}</div>
        </div>
      </main>
    </div>
  )
}
