// import { NextResponse } from "next/server"
// import { getOrganizationBySlug } from "@/lib/organization"
// import { prisma } from "@/lib/prisma"

// export async function GET(request: Request, { params }: { params: { slug: string } }) {
//   try {
//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Get dashboard statistics
//     const [tools, members, usageRecords] = await Promise.all([
//       prisma.tool.findMany({
//         where: { organizationId: organization.id },
//         orderBy: { createdAt: "desc" },
//         take: 5,
//         select: {
//           id: true,
//           name: true,
//           category: true,
//           status: true,
//           createdAt: true,
//         },
//       }),
//       prisma.organizationMember.count({
//         where: { organizationId: organization.id },
//       }),
//       prisma.usageRecord.findMany({
//         where: {
//           tool: { organizationId: organization.id },
//           createdAt: {
//             gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//           },
//         },
//         select: {
//           createdAt: true,
//         },
//       }),
//     ])

//     // Calculate usage data for chart
//     const usageData = []
//     for (let i = 29; i >= 0; i--) {
//       const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
//       const dayStart = new Date(date.setHours(0, 0, 0, 0))
//       const dayEnd = new Date(date.setHours(23, 59, 59, 999))

//       const dayUsage = usageRecords.filter(
//         (record) => record.createdAt >= dayStart && record.createdAt <= dayEnd,
//       ).length

//       usageData.push({
//         date: dayStart.toISOString().split("T")[0],
//         usage: dayUsage,
//       })
//     }

//     const stats = {
//       totalTools: await prisma.tool.count({
//         where: { organizationId: organization.id },
//       }),
//       activeTools: await prisma.tool.count({
//         where: { organizationId: organization.id, status: "PUBLISHED" },
//       }),
//       totalUsers: members,
//       monthlyUsage: Math.round((usageRecords.length / 1000) * 100), // Percentage of some baseline
//     }

//     return NextResponse.json({
//       stats,
//       recentTools: tools,
//       usageData,
//     })
//   } catch (error) {
//     console.error("Failed to fetch dashboard data:", error)
//     return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
//   }
// }


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

    // Get dashboard statistics
    const [toolsCount, membersCount, integrationsCount, subscription, recentTools, recentActivity] = await Promise.all([
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
    ])

    // Calculate usage percentages
    const toolsUsagePercentage = subscription ? (toolsCount / subscription.toolsLimit) * 100 : 0
    const membersUsagePercentage = subscription ? (membersCount / subscription.membersLimit) * 100 : 0

    // Get tools by status
    const toolsByStatus = await prisma.tool.groupBy({
      by: ["status"],
      where: { organizationId: organization.id },
      _count: { status: true },
    })

    const statusCounts = {
      DRAFT: 0,
      GENERATING: 0,
      GENERATED: 0,
      PUBLISHED: 0,
      ERROR: 0,
      ARCHIVED: 0,
    }

    toolsByStatus.forEach((item) => {
      statusCounts[item.status as keyof typeof statusCounts] = item._count.status
    })

    return NextResponse.json({
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
          total: toolsCount,
          limit: subscription?.toolsLimit || 1,
          usagePercentage: Math.min(toolsUsagePercentage, 100),
          byStatus: statusCounts,
        },
        members: {
          total: membersCount,
          limit: subscription?.membersLimit || 3,
          usagePercentage: Math.min(membersUsagePercentage, 100),
        },
        integrations: {
          total: integrationsCount,
        },
      },
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            toolsLimit: subscription.toolsLimit,
            membersLimit: subscription.membersLimit,
          }
        : null,
      recentTools,
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        type: activity.type,
        createdAt: activity.createdAt,
        user: activity.user,
        tool: activity.tool,
        metadata: activity.metadata,
      })),
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
