import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const toolId = params.id

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        organizationMemberships: {
          include: {
            organization: true,
          },
          where: {
            status: "ACTIVE",
          },
        },
      },
    })

    if (!user || !user.organizationMemberships.length) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 })
    }

    const organizationId = user.organizationMemberships[0].organization.id

    const tool = await prisma.tool.findFirst({
      where: {
        id: toolId,
        organizationId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        generationStatus: true,
        generationError: true,
        previewUrl: true,
        generatedAt: true,
        updatedAt: true,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
