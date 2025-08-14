"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppNavigation } from "./app-navigation"
import type { Organization } from "@/lib/organization"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const orgSlug = params?.slug as string

  useEffect(() => {
    fetchOrganizations()
  }, [orgSlug])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations")
      if (response.ok) {
        const orgs = await response.json()
        setOrganizations(orgs)

        // Set current organization based on slug
        if (orgSlug) {
          const current = orgs.find((org: Organization) => org.slug === orgSlug)
          setCurrentOrganization(current || null)
        } else if (orgs.length > 0) {
          // Default to first organization if no slug
          setCurrentOrganization(orgs[0])
        }
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation organizations={organizations} currentOrganization={currentOrganization} />

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
