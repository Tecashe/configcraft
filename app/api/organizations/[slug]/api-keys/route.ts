import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkUserAccess } from "@/lib/organization"
import { z } from "zod"
import crypto from "crypto"

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional(),
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

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { slug },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        organizationId: organization.id,
      },
      select: {
        id: true,
        name: true,
        keyPreview: true,
        permissions: true,
        status: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Check user access (only admins and owners can create API keys)
    const hasAccess = await checkUserAccess(slug, "ADMIN")
    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get organization
    const organization = await prisma.organization.findUnique({
      where: { slug },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Get user record
    const userRecord = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = createApiKeySchema.parse(body)

    // Generate API key
    const apiKey = `cc_${crypto.randomBytes(32).toString("hex")}`
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex")
    const keyPreview = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`

    const newApiKey = await prisma.apiKey.create({
      data: {
        name: validatedData.name,
        key: apiKey,
        keyHash,
        keyPreview,
        permissions: validatedData.permissions,
        userId: user.id,
        organizationId: organization.id,
        createdById: userRecord.id,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
      select: {
        id: true,
        name: true,
        key: true, // Only return the full key on creation
        keyPreview: true,
        permissions: true,
        status: true,
        expiresAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json(newApiKey)
  } catch (error) {
    console.error("Error creating API key:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
