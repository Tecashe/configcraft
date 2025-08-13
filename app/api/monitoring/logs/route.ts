import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { requestLogger } from "@/lib/monitoring"
import { prisma } from "@/lib/prisma" // Declare the prisma variable

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()

    // Only allow admin users to view logs
    const companyUser = await prisma.companyUser.findFirst({
      where: { userId: user.id, companyId: company.id },
    })

    if (!companyUser || companyUser.role !== "OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let logs
    if (type === "errors") {
      logs = requestLogger.getErrorLogs(limit)
    } else {
      logs = requestLogger.getRecentLogs(limit)
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
