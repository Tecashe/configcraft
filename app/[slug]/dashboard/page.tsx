import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

interface OrganizationDashboardPageProps {
  params: {
    slug: string
  }
}

export default async function OrganizationDashboardPage({ params }: OrganizationDashboardPageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/auth/signin")
  }

  // Get organization and verify user access
  const organization = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: {
      members: {
        where: { userId, status: "ACTIVE" },
      },
      tools: {
        take: 6,
        orderBy: { updatedAt: "desc" },
        include: {
          _count: {
            select: { usageRecords: true },
          },
        },
      },
      _count: {
        select: {
          members: true,
          tools: true,
        },
      },
    },
  })

  if (!organization || organization.members.length === 0) {
    redirect("/onboarding")
  }

  // Get subscription info
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId: organization.id },
  })

  // Get usage stats
  const usageThisMonth = await prisma.usageRecord.count({
    where: {
      organizationId: organization.id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  })

  const stats = {
    toolsCount: organization._count.tools,
    membersCount: organization._count.members,
    usageThisMonth,
    subscription: subscription?.plan || "FREE",
  }

  // Transform tools data to match expected interface
  const recentTools = organization.tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    status: tool.status,
    createdAt: tool.createdAt,
    updatedAt: tool.updatedAt,
    usageRecords: tool._count.usageRecords,
  }))

  // Generate sample usage data (replace with real data from your analytics)
  const usageData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    usage: Math.floor(Math.random() * 100) + 20,
  }))

  return (
    <DashboardClient
      organizationSlug={organization.slug}
      organizationName={organization.name}
      stats={stats}
      recentTools={recentTools}
      usageData={usageData}
    />
  )
}
