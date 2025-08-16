// import { type NextRequest, NextResponse } from "next/server"
// import { requireCompany } from "@/lib/auth"
// import { requestLogger } from "@/lib/monitoring"
// import { prisma } from "@/lib/prisma" // Declare the prisma variable

// export async function GET(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()

//     // Only allow admin users to view logs
//     const companyUser = await prisma.companyUser.findFirst({
//       where: { userId: user.id, companyId: company.id },
//     })

//     if (!companyUser || companyUser.role !== "OWNER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
//     }

//     const { searchParams } = new URL(req.url)
//     const type = searchParams.get("type") || "all"
//     const limit = Number.parseInt(searchParams.get("limit") || "100")

//     let logs
//     if (type === "errors") {
//       logs = requestLogger.getErrorLogs(limit)
//     } else {
//       logs = requestLogger.getRecentLogs(limit)
//     }

//     return NextResponse.json({ logs })
//   } catch (error) {
//     console.error("Logs fetch error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { requestLogger } from "@/lib/monitoring"

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get("organizationId")
    const type = searchParams.get("type") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 })
    }

    // Verify user has admin access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get audit logs from database
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        organizationId: organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(limit, 1000), // Cap at 1000 logs
    })

    // Get integration logs
    const integrationLogs = await prisma.integrationLog.findMany({
      where: {
        integration: {
          organizationId: organizationId,
        },
        ...(type === "errors" && { level: "ERROR" }),
      },
      include: {
        integration: {
          select: {
            name: true,
            provider: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(limit, 1000),
    })

    // Get system logs from monitoring service
    let systemLogs: any[] = []
    try {
      if (type === "errors") {
        systemLogs = requestLogger.getErrorLogs(Math.min(limit, 100))
      } else {
        systemLogs = requestLogger.getRecentLogs(Math.min(limit, 100))
      }
    } catch (error) {
      console.error("Failed to fetch system logs:", error)
      // Continue without system logs if monitoring service is unavailable
    }

    // Combine and format logs
    const combinedLogs = [
      ...auditLogs.map((log) => ({
        id: log.id,
        type: "audit",
        level: "INFO",
        message: `${log.action} ${log.resource}`,
        timestamp: log.createdAt,
        metadata: {
          //...log.metadata,
          resource: log.resource,
          resourceId: log.resourceId,
          userId: log.userId,
        },
      })),
      ...integrationLogs.map((log) => ({
        id: log.id,
        type: "integration",
        level: log.level,
        message: log.message,
        timestamp: log.createdAt,
        metadata: {
          //...log.data,
          integration: log.integration.name,
          provider: log.integration.provider,
        },
      })),
      ...systemLogs.map((log, index) => ({
        id: `system-${index}`,
        type: "system",
        level: log.level || "INFO",
        message: log.message || "System event",
        timestamp: new Date(log.timestamp || Date.now()),
        metadata: log.metadata || {},
      })),
    ]

    // Sort by timestamp and limit
    const sortedLogs = combinedLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)

    // Get log statistics
    const stats = {
      total: sortedLogs.length,
      errors: sortedLogs.filter((log) => log.level === "ERROR").length,
      warnings: sortedLogs.filter((log) => log.level === "WARN").length,
      info: sortedLogs.filter((log) => log.level === "INFO").length,
      byType: {
        audit: sortedLogs.filter((log) => log.type === "audit").length,
        integration: sortedLogs.filter((log) => log.type === "integration").length,
        system: sortedLogs.filter((log) => log.type === "system").length,
      },
    }

    return NextResponse.json({
      logs: sortedLogs,
      stats,
      pagination: {
        limit,
        hasMore: combinedLogs.length > limit,
      },
    })
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
