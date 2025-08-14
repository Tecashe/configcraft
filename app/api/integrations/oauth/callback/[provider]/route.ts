import { NextResponse } from "next/server"
import { oauthService } from "@/lib/oauth"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/security"

export async function GET(request: Request, { params }: { params: { provider: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    if (error) {
      const errorDescription = searchParams.get("error_description") || "OAuth authorization failed"
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=${encodeURIComponent(errorDescription)}`,
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=Missing authorization code or state`,
      )
    }

    const provider = params.provider

    // Exchange code for tokens
    const { tokens, organizationId, userId } = await oauthService.exchangeCodeForTokens(provider, code, state)

    // Test the connection
    const connectionTest = await oauthService.testConnection(provider, tokens)

    if (!connectionTest.success) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=${encodeURIComponent(
          connectionTest.error || "Connection test failed",
        )}`,
      )
    }

    // Encrypt the tokens
    const encryptedTokens = await encrypt(JSON.stringify(tokens))

    // Get integration type based on provider
    const integrationTypes: Record<string, string> = {
      salesforce: "CRM",
      google: "PRODUCTIVITY",
      github: "PRODUCTIVITY",
      slack: "COMMUNICATION",
    }

    // Create or update the integration
    const integration = await prisma.integration.upsert({
      where: {
        organizationId_provider: {
          organizationId,
          provider,
        },
      },
      update: {
        credentials: encryptedTokens,
        status: "CONNECTED",
        lastSyncAt: new Date(),
        config: {
          userInfo: connectionTest.userInfo,
          connectedAt: new Date().toISOString(),
        },
      },
      create: {
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Integration`,
        type: integrationTypes[provider] as any,
        provider,
        organizationId,
        credentials: encryptedTokens,
        status: "CONNECTED",
        lastSyncAt: new Date(),
        config: {
          userInfo: connectionTest.userInfo,
          connectedAt: new Date().toISOString(),
        },
      },
    })

    // Log the successful connection
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        level: "INFO",
        message: `${provider} integration connected successfully`,
        data: {
          userId,
          provider,
          userInfo: connectionTest.userInfo,
        },
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "INTEGRATION_SYNC",
        userId,
        organizationId,
        metadata: {
          action: "oauth_connected",
          provider,
        },
      },
    })

    // Redirect to integrations page with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/integrations?success=${encodeURIComponent(
        `${provider} connected successfully`,
      )}`,
    )
  } catch (error) {
    console.error("OAuth callback error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/integrations?error=${encodeURIComponent(
        "Failed to complete OAuth connection",
      )}`,
    )
  }
}
