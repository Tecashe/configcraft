// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { requireCompany } from "@/lib/auth"

// export async function GET(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()

//     const integrations = await prisma.integration.findMany({
//       where: {
//         companyId: company.id,
//       },
//       include: {
//         _count: {
//           select: {
//             toolIntegrations: true,
//             logs: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     })

//     return NextResponse.json(integrations)
//   } catch (error) {
//     console.error("Integrations fetch error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const body = await req.json()
//     const { name, type, provider, config, credentials } = body

//     const integration = await prisma.integration.create({
//       data: {
//         name,
//         type,
//         provider,
//         config,
//         credentials, // Should be encrypted in production
//         companyId: company.id,
//         status: "PENDING",
//       },
//     })

//     return NextResponse.json(integration)
//   } catch (error) {
//     console.error("Integration creation error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createIntegrationSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["CRM", "DATABASE", "PAYMENT", "STORAGE", "COMMUNICATION", "PRODUCTIVITY", "ANALYTICS"]),
  provider: z.string().min(1).max(50),
  config: z.record(z.any()).optional(),
  credentials: z.record(z.any()).optional(),
  organizationId: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get("organizationId")

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 })
    }

    // Verify user has access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const integrations = await prisma.integration.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        _count: {
          select: {
            toolIntegrations: true,
            logs: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Remove sensitive credentials from response
    const sanitizedIntegrations = integrations.map((integration) => ({
      ...integration,
      credentials: integration.credentials ? { configured: true } : null,
    }))

    return NextResponse.json(sanitizedIntegrations)
  } catch (error) {
    console.error("Integrations fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, type, provider, config, credentials, organizationId } = createIntegrationSchema.parse(body)

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

    // Check if integration with same provider already exists
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        organizationId: organizationId,
        provider: provider,
      },
    })

    if (existingIntegration) {
      return NextResponse.json({ error: "Integration with this provider already exists" }, { status: 409 })
    }

    // Check subscription limits
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organizationId },
      orderBy: { createdAt: "desc" },
    })

    const integrationsCount = await prisma.integration.count({
      where: { organizationId: organizationId },
    })

    const integrationLimit = subscription?.plan === "FREE" ? 2 : subscription?.plan === "STARTER" ? 5 : 20
    if (integrationsCount >= integrationLimit) {
      return NextResponse.json({ error: "Integration limit exceeded for current plan" }, { status: 429 })
    }

    // Create integration
    const integration = await prisma.integration.create({
      data: {
        name,
        type: type as any,
        provider,
        config: config || {},
        credentials: credentials || {}, // Should be encrypted in production
        organizationId: organizationId,
        status: "PENDING",
      },
    })

    // Log the integration creation
    await prisma.usageRecord.create({
      data: {
        type: "INTEGRATION_SYNC",
        userId: userId,
        organizationId: organizationId,
        metadata: {
          action: "integration_created",
          integrationId: integration.id,
          provider: provider,
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        resource: "integration",
        resourceId: integration.id,
        userId: userId,
        organizationId: organizationId,
        metadata: {
          integrationName: name,
          provider: provider,
          type: type,
        },
      },
    })

    // Remove credentials from response
    const { credentials: _, ...integrationResponse } = integration

    return NextResponse.json(integrationResponse)
  } catch (error) {
    console.error("Integration creation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
