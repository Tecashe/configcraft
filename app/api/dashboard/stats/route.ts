import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get("organizationId")

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 })
    }

    // Verify user has access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get current month start
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    // Get basic stats
    const [toolsCount, membersCount, usageThisMonth, subscription] = await Promise.all([
      prisma.tool.count({
        where: { organizationId: organizationId },
      }),
      prisma.organizationMember.count({
        where: { organizationId: organizationId, status: "ACTIVE" },
      }),
      prisma.usageRecord.count({
        where: {
          organizationId: organizationId,
          createdAt: {
            gte: currentMonthStart,
          },
        },
      }),
      prisma.subscription.findFirst({
        where: { organizationId: organizationId },
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Get tools by status
    const toolsByStatus = await prisma.tool.groupBy({
      by: ["status"],
      where: { organizationId: organizationId },
      _count: true,
    })

    // Get recent tools
    const recentTools = await prisma.tool.findMany({
      where: { organizationId: organizationId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    })

    // Get usage analytics for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const usageAnalytics = await prisma.usageRecord.groupBy({
      by: ["type"],
      where: {
        organizationId: organizationId,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    })

    // Get integration stats
    const integrationsCount = await prisma.integration.count({
      where: { organizationId: organizationId, status: "CONNECTED" },
    })

    // Get published tools count
    const publishedToolsCount = await prisma.publishedTool.count({
      where: { organizationId: organizationId, status: "deployed" },
    })

    // Calculate growth metrics
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0)

    const [toolsLastMonth, usageLastMonth] = await Promise.all([
      prisma.tool.count({
        where: {
          organizationId: organizationId,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
      prisma.usageRecord.count({
        where: {
          organizationId: organizationId,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ])

    const toolsGrowth = toolsLastMonth > 0 ? ((toolsCount - toolsLastMonth) / toolsLastMonth) * 100 : 0
    const usageGrowth = usageLastMonth > 0 ? ((usageThisMonth - usageLastMonth) / usageLastMonth) * 100 : 0

    return NextResponse.json({
      stats: {
        toolsCount,
        membersCount,
        usageThisMonth,
        integrationsCount,
        publishedToolsCount,
        subscription: subscription?.plan || "FREE",
        toolsGrowth: Math.round(toolsGrowth * 100) / 100,
        usageGrowth: Math.round(usageGrowth * 100) / 100,
      },
      toolsByStatus: toolsByStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count
          return acc
        },
        {} as Record<string, number>,
      ),
      recentTools,
      usageAnalytics: usageAnalytics.reduce(
        (acc, item) => {
          acc[item.type] = item._count
          return acc
        },
        {} as Record<string, number>,
      ),
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
