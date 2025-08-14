import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access
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

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Failed to fetch tool:", error)
    return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string; id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN", "MEMBER"] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Check if user owns the tool or has admin rights
    if (tool.createdById !== userId && !["OWNER", "ADMIN"].includes(membership.role)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    // Delete related records first
    await prisma.$transaction([
      // Delete tool integrations
      prisma.toolIntegration.deleteMany({
        where: { toolId: tool.id },
      }),
      // Delete tool analytics
      prisma.toolAnalytics.deleteMany({
        where: { toolId: tool.id },
      }),
      // Delete tool versions
      prisma.toolVersion.deleteMany({
        where: { toolId: tool.id },
      }),
      // Delete usage records
      prisma.usageRecord.deleteMany({
        where: { toolId: tool.id },
      }),
      // Finally delete the tool
      prisma.tool.delete({
        where: { id: tool.id },
      }),
    ])

    // Log the deletion
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED", // We'll use negative count to indicate deletion
        count: -1,
        userId: userId,
        organizationId: organization.id,
        metadata: {
          action: "tool_deleted",
          toolName: tool.name,
          toolId: tool.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete tool:", error)
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
  }
}
