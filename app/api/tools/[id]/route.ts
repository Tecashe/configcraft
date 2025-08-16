import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateToolSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
})

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
      include: {
        _count: {
          select: {
            usageRecords: true,
          },
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Tool fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const toolId = params.id
    const body = await req.json()
    const validatedData = updateToolSchema.parse(body)

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
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const updatedTool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedTool)
  } catch (error) {
    console.error("Tool update error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    await prisma.tool.delete({
      where: { id: toolId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tool deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
