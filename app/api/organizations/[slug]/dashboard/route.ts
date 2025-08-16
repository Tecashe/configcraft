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


// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { getOrganizationBySlug } from "@/lib/organization"

// export async function GET(request: Request, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access to this organization
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId: userId,
//         organizationId: organization.id,
//         status: "ACTIVE",
//       },
//     })

//     if (!membership) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     // Get dashboard statistics
//     const [toolsCount, membersCount, integrationsCount, subscription, recentTools, recentActivity] = await Promise.all([
//       // Tools count
//       prisma.tool.count({
//         where: { organizationId: organization.id, status: { not: "ARCHIVED" } },
//       }),

//       // Members count
//       prisma.organizationMember.count({
//         where: { organizationId: organization.id, status: "ACTIVE" },
//       }),

//       // Integrations count
//       prisma.integration.count({
//         where: { organizationId: organization.id, status: "CONNECTED" },
//       }),

//       // Subscription details
//       prisma.subscription.findFirst({
//         where: { organizationId: organization.id },
//         orderBy: { createdAt: "desc" },
//       }),

//       // Recent tools
//       prisma.tool.findMany({
//         where: { organizationId: organization.id },
//         orderBy: { createdAt: "desc" },
//         take: 5,
//         select: {
//           id: true,
//           name: true,
//           description: true,
//           status: true,
//           generationStatus: true,
//           createdAt: true,
//           category: true,
//         },
//       }),

//       // Recent activity
//       prisma.usageRecord.findMany({
//         where: { organizationId: organization.id },
//         orderBy: { createdAt: "desc" },
//         take: 10,
//         include: {
//           user: {
//             select: {
//               firstName: true,
//               lastName: true,
//               imageUrl: true,
//             },
//           },
//           tool: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       }),
//     ])

//     // Calculate usage percentages
//     const toolsUsagePercentage = subscription ? (toolsCount / subscription.toolsLimit) * 100 : 0
//     const membersUsagePercentage = subscription ? (membersCount / subscription.membersLimit) * 100 : 0

//     // Get tools by status
//     const toolsByStatus = await prisma.tool.groupBy({
//       by: ["status"],
//       where: { organizationId: organization.id },
//       _count: { status: true },
//     })

//     const statusCounts = {
//       DRAFT: 0,
//       GENERATING: 0,
//       GENERATED: 0,
//       PUBLISHED: 0,
//       ERROR: 0,
//       ARCHIVED: 0,
//     }

//     toolsByStatus.forEach((item) => {
//       statusCounts[item.status as keyof typeof statusCounts] = item._count.status
//     })

//     return NextResponse.json({
//       organization: {
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//         description: organization.description,
//         industry: organization.industry,
//         size: organization.size,
//       },
//       stats: {
//         tools: {
//           total: toolsCount,
//           limit: subscription?.toolsLimit || 1,
//           usagePercentage: Math.min(toolsUsagePercentage, 100),
//           byStatus: statusCounts,
//         },
//         members: {
//           total: membersCount,
//           limit: subscription?.membersLimit || 3,
//           usagePercentage: Math.min(membersUsagePercentage, 100),
//         },
//         integrations: {
//           total: integrationsCount,
//         },
//       },
//       subscription: subscription
//         ? {
//             plan: subscription.plan,
//             status: subscription.status,
//             currentPeriodEnd: subscription.currentPeriodEnd,
//             toolsLimit: subscription.toolsLimit,
//             membersLimit: subscription.membersLimit,
//           }
//         : null,
//       recentTools,
//       recentActivity: recentActivity.map((activity) => ({
//         id: activity.id,
//         type: activity.type,
//         createdAt: activity.createdAt,
//         user: activity.user,
//         tool: activity.tool,
//         metadata: activity.metadata,
//       })),
//     })
//   } catch (error) {
//     console.error("Dashboard API error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { checkUserAccess } from "@/lib/organization"
// import { z } from "zod"

// const createIntegrationSchema = z.object({
//   name: z.string().min(1).max(100),
//   type: z.enum(["CRM", "DATABASE", "PAYMENT", "STORAGE", "COMMUNICATION", "PRODUCTIVITY", "ANALYTICS"]),
//   provider: z.string().min(1),
//   config: z.record(z.any()).optional(),
//   credentials: z.record(z.any()).optional(),
// })

// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access
//     const hasAccess = await checkUserAccess(slug)
//     if (!hasAccess) {
//       return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
//     }

//     // Get organization
//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//     })

//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const integrations = await prisma.integration.findMany({
//       where: {
//         organizationId: organization.id,
//       },
//       include: {
//         _count: {
//           select: {
//             toolIntegrations: true,
//             logs: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     })

//     return NextResponse.json(integrations)
//   } catch (error) {
//     console.error("Integrations fetch error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access
//     const hasAccess = await checkUserAccess(slug, "ADMIN")
//     if (!hasAccess) {
//       return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
//     }

//     // Get organization
//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//     })

//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const body = await request.json()
//     const validatedData = createIntegrationSchema.parse(body)

//     // Handle credentials properly - convert to JSON or null
//     let credentialsData = null
//     if (validatedData.credentials) {
//       credentialsData = validatedData.credentials
//     }

//     const integration = await prisma.integration.create({
//       data: {
//         name: validatedData.name,
//         type: validatedData.type,
//         provider: validatedData.provider,
//         config: validatedData.config || {},
//         credentials: credentialsData || {}, // This should now work with Json type
//         organizationId: organization.id,
//         status: "PENDING",
//       },
//     })

//     return NextResponse.json(integration)
//   } catch (error) {
//     console.error("Integration creation error:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
