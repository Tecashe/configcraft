import type React from "react"
import { AppNavigation } from "./app-navigation"
import { getUserOrganizations, getCurrentOrganization } from "@/lib/organization"

interface AppLayoutProps {
  children: React.ReactNode
}

export async function AppLayout({ children }: AppLayoutProps) {
  const organizations = await getUserOrganizations()
  const currentOrganization = await getCurrentOrganization()

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation organizations={organizations} currentOrganization={currentOrganization} />

      {/* Main content area with proper spacing for desktop sidebar */}
      <div className="lg:pl-72">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
