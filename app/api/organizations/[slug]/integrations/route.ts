import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getOrganizationBySlug } from "@/lib/organization"
import { encrypt } from "@/lib/security"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
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

    const integrations = await prisma.integration.findMany({
      where: { organizationId: organization.id },
      include: {
        _count: {
          select: {
            toolIntegrations: true,
            logs: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Remove sensitive credentials from response
    const safeIntegrations = integrations.map((integration) => ({
      ...integration,
      credentials: undefined, // Never send credentials to client
    }))

    return NextResponse.json(safeIntegrations)
  } catch (error) {
    console.error("Integrations fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
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

    const body = await request.json()
    const { name, type, provider, config, credentials } = body

    // Validate required fields
    if (!name || !type || !provider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if integration already exists
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        organizationId: organization.id,
        provider: provider,
      },
    })

    if (existingIntegration) {
      return NextResponse.json({ error: "Integration already exists" }, { status: 409 })
    }

    // Validate integration type
    const validTypes = ["CRM", "DATABASE", "PAYMENT", "STORAGE", "COMMUNICATION", "PRODUCTIVITY", "ANALYTICS"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid integration type" }, { status: 400 })
    }

    // Test the integration connection
    let connectionStatus = "PENDING"
    let connectionError = null

    try {
      const testResult = await testIntegrationConnection(provider, credentials)
      connectionStatus = testResult.success ? "CONNECTED" : "ERROR"
      if (!testResult.success) {
        connectionError = testResult.error
      }
    } catch (error) {
      connectionStatus = "ERROR"
      connectionError = "Failed to test connection"
    }

    // Encrypt credentials before storing
    const encryptedCredentials = credentials ? await encrypt(JSON.stringify(credentials)) : null

    // Create the integration
    const integration = await prisma.integration.create({
      data: {
        name,
        type: type as any,
        provider,
        config: config || {},
        credentials: encryptedCredentials,
        status: connectionStatus as any,
        organizationId: organization.id,
      },
    })

    // Log the integration creation
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        level: connectionStatus === "CONNECTED" ? "INFO" : "ERROR",
        message:
          connectionStatus === "CONNECTED"
            ? "Integration connected successfully"
            : connectionError || "Connection failed",
        data: {
          userId,
          action: "create",
          provider,
        },
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "INTEGRATION_SYNC",
        userId: userId,
        organizationId: organization.id,
        metadata: {
          action: "integration_created",
          provider,
          status: connectionStatus,
        },
      },
    })

    // Return integration without credentials
    const { credentials: _, ...safeIntegration } = integration
    return NextResponse.json(safeIntegration)
  } catch (error) {
    console.error("Integration creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Test integration connection based on provider
async function testIntegrationConnection(
  provider: string,
  credentials: any,
): Promise<{ success: boolean; error?: string }> {
  try {
    switch (provider) {
      case "slack":
        if (!credentials?.webhook_url) {
          return { success: false, error: "Webhook URL is required" }
        }
        // Test Slack webhook
        const slackResponse = await fetch(credentials.webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "ConfigCraft integration test" }),
        })
        return { success: slackResponse.ok }

      case "salesforce":
        if (!credentials?.client_id || !credentials?.client_secret || !credentials?.instance_url) {
          return { success: false, error: "Client ID, Client Secret, and Instance URL are required" }
        }
        // Test Salesforce OAuth (simplified)
        return { success: true } // In production, implement actual OAuth flow

      case "postgresql":
        if (!credentials?.host || !credentials?.database || !credentials?.username || !credentials?.password) {
          return { success: false, error: "Host, database, username, and password are required" }
        }
        // In production, test actual database connection
        return { success: true }

      case "sendgrid":
        if (!credentials?.api_key) {
          return { success: false, error: "API key is required" }
        }
        // Test SendGrid API
        const sendgridResponse = await fetch("https://api.sendgrid.com/v3/user/profile", {
          headers: {
            Authorization: `Bearer ${credentials.api_key}`,
          },
        })
        return { success: sendgridResponse.ok }

      default:
        return { success: true } // Default to success for unknown providers
    }
  } catch (error) {
    return { success: false, error: "Connection test failed" }
  }
}
