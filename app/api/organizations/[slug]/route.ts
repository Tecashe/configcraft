import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkUserAccess } from "@/lib/organization"
import { z } from "zod"

const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]).optional(),
  customBranding: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Check user access
    const hasAccess = await checkUserAccess(slug)
    if (!hasAccess) {
      return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
    }

    // Get organization with user's role
    const userId = user.id

    // First check if user owns the organization
    const ownedOrg = await prisma.organization.findFirst({
      where: {
        slug,
        owner: { clerkId: userId },
      },
      include: {
        owner: true,
        _count: {
          select: {
            members: true,
            tools: true,
          },
        },
      },
    })

    if (ownedOrg) {
      return NextResponse.json({
        id: ownedOrg.id,
        name: ownedOrg.name,
        slug: ownedOrg.slug,
        description: ownedOrg.description,
        logoUrl: ownedOrg.logoUrl,
        website: ownedOrg.website,
        industry: ownedOrg.industry,
        size: ownedOrg.size,
        customBranding: ownedOrg.customBranding,
        brandColors: ownedOrg.brandColors,
        createdAt: ownedOrg.createdAt,
        updatedAt: ownedOrg.updatedAt,
        memberCount: ownedOrg._count.members,
        toolCount: ownedOrg._count.tools,
        role: "OWNER",
      })
    }

    // Check if user is a member
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        organization: { slug },
      },
      include: {
        organization: {
          include: {
            _count: {
              select: {
                members: true,
                tools: true,
              },
            },
          },
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({
      id: membership.organization.id,
      name: membership.organization.name,
      slug: membership.organization.slug,
      description: membership.organization.description,
      logoUrl: membership.organization.logoUrl,
      website: membership.organization.website,
      industry: membership.organization.industry,
      size: membership.organization.size,
      customBranding: membership.organization.customBranding,
      brandColors: membership.organization.brandColors,
      createdAt: membership.organization.createdAt,
      updatedAt: membership.organization.updatedAt,
      memberCount: membership.organization._count.members,
      toolCount: membership.organization._count.tools,
      role: membership.role,
    })
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Check user access (only owners and admins can update)
    const hasAccess = await checkUserAccess(slug, "ADMIN")
    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateOrganizationSchema.parse(body)

    const organization = await prisma.organization.update({
      where: { slug },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        _count: {
          select: {
            members: true,
            tools: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      logoUrl: organization.logoUrl,
      website: organization.website,
      industry: organization.industry,
      size: organization.size,
      customBranding: organization.customBranding,
      brandColors: organization.brandColors,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      memberCount: organization._count.members,
      toolCount: organization._count.tools,
    })
  } catch (error) {
    console.error("Error updating organization:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 })
  }
}
