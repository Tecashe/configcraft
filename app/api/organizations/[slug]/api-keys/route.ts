import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkUserAccess } from "@/lib/organization"
import { z } from "zod"
import crypto from "crypto"

const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
})

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Check user access
    const membership = await checkUserAccess(slug)
    if (!membership) {
      return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
    }

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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      apiKeys.map((key) => ({
        id: key.id,
        name: key.name,
        key: `ck_${key.key.substring(0, 8)}${"*".repeat(32)}`,
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        status: key.status,
      })),
    )
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

    // Check user access (only owners and admins can create API keys)
    const membership = await checkUserAccess(slug, "ADMIN")
    if (!membership) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name } = createApiKeySchema.parse(body)

    // Get the current user's database record
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate API key
    const keyValue = crypto.randomBytes(32).toString("hex")

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key: keyValue,
        organizationId: organization.id,
        userId: dbUser.id,
        permissions: ["read", "write"], // Default permissions
        status: "ACTIVE",
      },
    })

    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      key: `ck_${keyValue}`,
      createdAt: apiKey.createdAt,
      lastUsedAt: null,
      status: apiKey.status,
    })
  } catch (error) {
    console.error("Error creating API key:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
