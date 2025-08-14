// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { checkUserAccess } from "@/lib/organization"
// import { z } from "zod"
// import crypto from "crypto"

// const createApiKeySchema = z.object({
//   name: z.string().min(1).max(100),
// })

// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access
//     const membership = await checkUserAccess(slug)
//     if (!membership) {
//       return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//     })

//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const apiKeys = await prisma.apiKey.findMany({
//       where: {
//         organizationId: organization.id,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     })

//     return NextResponse.json(
//       apiKeys.map((key) => ({
//         id: key.id,
//         name: key.name,
//         key: `ck_${key.key.substring(0, 8)}${"*".repeat(32)}`,
//         createdAt: key.createdAt,
//         lastUsedAt: key.lastUsedAt,
//         status: key.status,
//       })),
//     )
//   } catch (error) {
//     console.error("Error fetching API keys:", error)
//     return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access (only owners and admins can create API keys)
//     const membership = await checkUserAccess(slug, "ADMIN")
//     if (!membership) {
//       return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//     })

//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const body = await request.json()
//     const { name } = createApiKeySchema.parse(body)

//     // Get the current user's database record
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId: user.id },
//     })

//     if (!dbUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Generate API key
//     const keyValue = crypto.randomBytes(32).toString("hex")

//     const apiKey = await prisma.apiKey.create({
//       data: {
//         name,
//         key: keyValue,
//         organizationId: organization.id,
//         userId: dbUser.id,
//         permissions: ["read", "write"], // Default permissions
//         status: "ACTIVE",
//       },
//     })

//     return NextResponse.json({
//       id: apiKey.id,
//       name: apiKey.name,
//       key: `ck_${keyValue}`,
//       createdAt: apiKey.createdAt,
//       lastUsedAt: null,
//       status: apiKey.status,
//     })
//   } catch (error) {
//     console.error("Error creating API key:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  permissions: z.array(z.string()).optional().default(["read", "write"]),
})

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Get the organization and check permissions
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
        apiKeys: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has permission to view API keys
    const userMembership = organization.members[0]
    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Format API keys for response
    const apiKeys = organization.apiKeys.map((key) => ({
      id: key.id,
      name: key.name,
      key: key.key,
      createdAt: key.createdAt.toISOString(),
      lastUsed: key.lastUsedAt ? key.lastUsedAt.toISOString() : null,
      status: key.status,
      permissions: key.permissions,
    }))

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const body = await request.json()
    const { name, permissions } = createApiKeySchema.parse(body)

    // Get the organization and check permissions
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has permission to create API keys
    const userMembership = organization.members[0]
    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Generate API key
    const apiKey = `cc_${crypto.randomBytes(32).toString("hex")}`

    // Create API key in database
    const newApiKey = await prisma.apiKey.create({
      data: {
        name,
        key: apiKey,
        permissions,
        userId,
        organizationId: organization.id,
        status: "ACTIVE",
      },
    })

    return NextResponse.json({
      id: newApiKey.id,
      name: newApiKey.name,
      key: newApiKey.key,
      createdAt: newApiKey.createdAt.toISOString(),
      lastUsed: null,
      status: newApiKey.status,
      permissions: newApiKey.permissions,
    })
  } catch (error) {
    console.error("Error creating API key:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
