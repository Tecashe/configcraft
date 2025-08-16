 
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getOrganizationBySlug } from "@/lib/organization"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access to this organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get dashboard statistics with proper error handling
    const [
      toolsCount,
      membersCount,
      integrationsCount,
      subscription,
      recentTools,
      recentActivity,
      toolsByStatus,
      usageRecords,
    ] = await Promise.allSettled([
      // Tools count
      prisma.tool.count({
        where: { organizationId: organization.id, status: { not: "ARCHIVED" } },
      }),

      // Members count
      prisma.organizationMember.count({
        where: { organizationId: organization.id, status: "ACTIVE" },
      }),

      // Integrations count
      prisma.integration.count({
        where: { organizationId: organization.id, status: "CONNECTED" },
      }),

      // Subscription details
      prisma.subscription.findFirst({
        where: { organizationId: organization.id },
        orderBy: { createdAt: "desc" },
      }),

      // Recent tools
      prisma.tool.findMany({
        where: { organizationId: organization.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          generationStatus: true,
          createdAt: true,
          category: true,
        },
      }),

      // Recent activity
      prisma.usageRecord.findMany({
        where: { organizationId: organization.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
          tool: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Tools by status
      prisma.tool.groupBy({
        by: ["status"],
        where: { organizationId: organization.id },
        _count: { status: true },
      }),

      // Usage records for analytics
      prisma.usageRecord.findMany({
        where: {
          organizationId: organization.id,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        select: {
          type: true,
          createdAt: true,
          tool: {
            select: {
              category: true,
            },
          },
        },
      }),
    ])

    // Extract values with fallbacks
    const toolsTotal = toolsCount.status === "fulfilled" ? toolsCount.value : 0
    const membersTotal = membersCount.status === "fulfilled" ? membersCount.value : 0
    const integrationsTotal = integrationsCount.status === "fulfilled" ? integrationsCount.value : 0
    const subscriptionData = subscription.status === "fulfilled" ? subscription.value : null
    const toolsData = recentTools.status === "fulfilled" ? recentTools.value : []
    const activityData = recentActivity.status === "fulfilled" ? recentActivity.value : []
    const statusData = toolsByStatus.status === "fulfilled" ? toolsByStatus.value : []
    const usageData = usageRecords.status === "fulfilled" ? usageRecords.value : []

    // Default subscription limits for free plan
    const defaultLimits = {
      toolsLimit: 3,
      membersLimit: 5,
      plan: "FREE",
    }

    const effectiveSubscription = subscriptionData || defaultLimits

    // Calculate usage percentages
    const toolsUsagePercentage =
      effectiveSubscription.toolsLimit > 0 ? Math.min((toolsTotal / effectiveSubscription.toolsLimit) * 100, 100) : 0
    const membersUsagePercentage =
      effectiveSubscription.membersLimit > 0
        ? Math.min((membersTotal / effectiveSubscription.membersLimit) * 100, 100)
        : 0

    // Process tools by status
    const statusCounts = {
      DRAFT: 0,
      GENERATING: 0,
      GENERATED: 0,
      PUBLISHED: 0,
      ERROR: 0,
      ARCHIVED: 0,
    }

    statusData.forEach((item) => {
      if (item.status in statusCounts) {
        statusCounts[item.status as keyof typeof statusCounts] = item._count.status
      }
    })

    // Calculate analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Performance metrics calculation
    const totalRequests = usageData.length
    const errorCount = usageData.filter((record) => record.type === "TOOL_ERROR").length
    const successCount = totalRequests - errorCount
    const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 100
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0

    // Category usage analysis
    const categoryUsage = usageData.reduce(
      (acc, record) => {
        const category = record.tool?.category || "Uncategorized"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const usageByCategory = Object.entries(categoryUsage).map(([category, count]) => ({
      category,
      count,
      percentage: totalRequests > 0 ? (count / totalRequests) * 100 : 0,
    }))

    // Tools over time (last 7 days)
    const toolsOverTime = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayCount = toolsData.filter((tool) => {
        const toolDate = new Date(tool.createdAt)
        return toolDate >= dayStart && toolDate <= dayEnd
      }).length

      toolsOverTime.push({
        date: dayStart.toISOString().split("T")[0],
        count: dayCount,
      })
    }

    const responseData = {
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        industry: organization.industry,
        size: organization.size,
      },
      stats: {
        tools: {
          total: toolsTotal,
          limit: effectiveSubscription.toolsLimit,
          usagePercentage: toolsUsagePercentage,
          byStatus: statusCounts,
        },
        members: {
          total: membersTotal,
          limit: effectiveSubscription.membersLimit,
          usagePercentage: membersUsagePercentage,
        },
        integrations: {
          total: integrationsTotal,
        },
      },
      subscription: subscriptionData
        ? {
            plan: subscriptionData.plan,
            status: subscriptionData.status,
            currentPeriodEnd: subscriptionData.currentPeriodEnd,
            toolsLimit: subscriptionData.toolsLimit,
            membersLimit: subscriptionData.membersLimit,
          }
        : {
            plan: "FREE",
            status: "ACTIVE",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            toolsLimit: 3,
            membersLimit: 5,
          },
      recentTools: toolsData,
      recentActivity: activityData.map((activity) => ({
        id: activity.id,
        type: activity.type,
        createdAt: activity.createdAt,
        user: activity.user,
        tool: activity.tool,
        metadata: activity.metadata,
      })),
      analytics: {
        toolsOverTime,
        usageByCategory,
        memberActivity: [], // Can be expanded later
        integrationHealth: [], // Can be expanded later
        performanceMetrics: {
          avgGenerationTime: 45, // This would come from actual timing data
          successRate: Math.round(successRate * 100) / 100,
          errorRate: Math.round(errorRate * 100) / 100,
          totalRequests,
        },
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Dashboard API error:", error)

    // Return a structured error response that the frontend can handle gracefully
    return NextResponse.json(
      {
        error: "Failed to load dashboard data",
        organization: null,
        stats: {
          tools: {
            total: 0,
            limit: 3,
            usagePercentage: 0,
            byStatus: { DRAFT: 0, GENERATING: 0, GENERATED: 0, PUBLISHED: 0, ERROR: 0, ARCHIVED: 0 },
          },
          members: { total: 0, limit: 5, usagePercentage: 0 },
          integrations: { total: 0 },
        },
        subscription: {
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodEnd: new Date().toISOString(),
          toolsLimit: 3,
          membersLimit: 5,
        },
        recentTools: [],
        recentActivity: [],
        analytics: {
          toolsOverTime: [],
          usageByCategory: [],
          memberActivity: [],
          integrationHealth: [],
          performanceMetrics: { avgGenerationTime: 0, successRate: 0, errorRate: 0, totalRequests: 0 },
        },
      },
      { status: 500 },
    )
  }
}
