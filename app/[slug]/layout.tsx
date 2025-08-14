import type React from "react"
import { notFound } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { switchOrganization } from "@/lib/organization"

interface OrganizationLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export default async function OrganizationLayout({ children, params }: OrganizationLayoutProps) {
  try {
    // Verify user has access to this organization
    await switchOrganization(params.slug)
  } catch (error) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}
