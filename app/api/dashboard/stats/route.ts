import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()

    // Get basic stats
    const [toolsCount, membersCount, usageThisMonth, subscription] = await Promise.all([
      prisma.tool.count({
        where: { companyId: company.id },
      }),
      prisma.companyMember.count({
        where: { companyId: company.id, status: "ACTIVE" },
      }),
      prisma.usageRecord.count({
        where: {
          companyId: company.id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.subscription.findFirst({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Get tools by status
    const toolsByStatus = await prisma.tool.groupBy({
      by: ["status"],
      where: { companyId: company.id },
      _count: true,
    })

    // Get recent activity
    const recentTools = await prisma.tool.findMany({
      where: { companyId: company.id },
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
        companyId: company.id,
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: true,
    })

    return NextResponse.json({
      stats: {
        toolsCount,
        membersCount,
        usageThisMonth,
        subscription: subscription?.plan || "FREE",
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
