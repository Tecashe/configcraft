import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { oauthService } from "@/lib/oauth"

export async function GET(request: Request, { params }: { params: { provider: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationId")

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
    }

    const provider = params.provider
    const supportedProviders = ["salesforce", "google", "github", "slack"]

    if (!supportedProviders.includes(provider)) {
      return NextResponse.json({ error: "Unsupported OAuth provider" }, { status: 400 })
    }

    // Generate OAuth URL
    const authUrl = oauthService.generateAuthUrl(provider, organizationId, userId)

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error("OAuth initiation error:", error)
    return NextResponse.json({ error: "Failed to initiate OAuth" }, { status: 500 })
  }
}
