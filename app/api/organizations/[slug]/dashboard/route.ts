import { NextResponse } from "next/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Get dashboard statistics
    const [tools, members, usageRecords] = await Promise.all([
      prisma.tool.findMany({
        where: { organizationId: organization.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          category: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.organizationMember.count({
        where: { organizationId: organization.id },
      }),
      prisma.usageRecord.findMany({
        where: {
          tool: { organizationId: organization.id },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ])

    // Calculate usage data for chart
    const usageData = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayUsage = usageRecords.filter(
        (record) => record.createdAt >= dayStart && record.createdAt <= dayEnd,
      ).length

      usageData.push({
        date: dayStart.toISOString().split("T")[0],
        usage: dayUsage,
      })
    }

    const stats = {
      totalTools: await prisma.tool.count({
        where: { organizationId: organization.id },
      }),
      activeTools: await prisma.tool.count({
        where: { organizationId: organization.id, status: "PUBLISHED" },
      }),
      totalUsers: members,
      monthlyUsage: Math.round((usageRecords.length / 1000) * 100), // Percentage of some baseline
    }

    return NextResponse.json({
      stats,
      recentTools: tools,
      usageData,
    })
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
