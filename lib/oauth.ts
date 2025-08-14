import crypto from "crypto"

export interface OAuthProvider {
  name: string
  authUrl: string
  tokenUrl: string
  clientId: string
  clientSecret: string
  scopes: string[]
  redirectUri: string
}

export interface OAuthTokens {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
}

export class OAuthService {
  private providers: Record<string, OAuthProvider> = {
    salesforce: {
      name: "Salesforce",
      authUrl: "https://login.salesforce.com/services/oauth2/authorize",
      tokenUrl: "https://login.salesforce.com/services/oauth2/token",
      clientId: process.env.SALESFORCE_CLIENT_ID!,
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET!,
      scopes: ["api", "refresh_token"],
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/oauth/callback/salesforce`,
    },
    google: {
      name: "Google",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/spreadsheets"],
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/oauth/callback/google`,
    },
    github: {
      name: "GitHub",
      authUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scopes: ["repo", "user"],
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/oauth/callback/github`,
    },
    slack: {
      name: "Slack",
      authUrl: "https://slack.com/oauth/v2/authorize",
      tokenUrl: "https://slack.com/api/oauth.v2.access",
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
      scopes: ["chat:write", "channels:read", "groups:read"],
      redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/oauth/callback/slack`,
    },
  }

  generateAuthUrl(provider: string, organizationId: string, userId: string): string {
    const config = this.providers[provider]
    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    const state = this.generateState(organizationId, userId, provider)
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(" "),
      response_type: "code",
      state,
      access_type: "offline", // For refresh tokens
      prompt: "consent",
    })

    return `${config.authUrl}?${params.toString()}`
  }

  async exchangeCodeForTokens(
    provider: string,
    code: string,
    state: string,
  ): Promise<{
    tokens: OAuthTokens
    organizationId: string
    userId: string
  }> {
    const config = this.providers[provider]
    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    // Verify and decode state
    const stateData = this.verifyState(state)
    if (stateData.provider !== provider) {
      throw new Error("Invalid state parameter")
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    const tokens = await tokenResponse.json()

    return {
      tokens,
      organizationId: stateData.organizationId,
      userId: stateData.userId,
    }
  }

  async refreshTokens(provider: string, refreshToken: string): Promise<OAuthTokens> {
    const config = this.providers[provider]
    if (!config) {
      throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    return response.json()
  }

  private generateState(organizationId: string, userId: string, provider: string): string {
    const data = {
      organizationId,
      userId,
      provider,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString("hex"),
    }

    const stateString = Buffer.from(JSON.stringify(data)).toString("base64url")
    return stateString
  }

  private verifyState(state: string): {
    organizationId: string
    userId: string
    provider: string
    timestamp: number
  } {
    try {
      const decoded = Buffer.from(state, "base64url").toString()
      const data = JSON.parse(decoded)

      // Check if state is not too old (5 minutes)
      if (Date.now() - data.timestamp > 5 * 60 * 1000) {
        throw new Error("State expired")
      }

      return data
    } catch (error) {
      throw new Error("Invalid state parameter")
    }
  }

  async testConnection(
    provider: string,
    tokens: OAuthTokens,
  ): Promise<{
    success: boolean
    userInfo?: any
    error?: string
  }> {
    try {
      switch (provider) {
        case "salesforce":
          return await this.testSalesforceConnection(tokens)
        case "google":
          return await this.testGoogleConnection(tokens)
        case "github":
          return await this.testGitHubConnection(tokens)
        case "slack":
          return await this.testSlackConnection(tokens)
        default:
          return { success: false, error: "Unsupported provider" }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Connection test failed" }
    }
  }

  private async testSalesforceConnection(tokens: OAuthTokens) {
    const response = await fetch("https://login.salesforce.com/services/oauth2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: "Failed to fetch user info" }
    }

    const userInfo = await response.json()
    return { success: true, userInfo }
  }

  private async testGoogleConnection(tokens: OAuthTokens) {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: "Failed to fetch user info" }
    }

    const userInfo = await response.json()
    return { success: true, userInfo }
  }

  private async testGitHubConnection(tokens: OAuthTokens) {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        "User-Agent": "ConfigCraft",
      },
    })

    if (!response.ok) {
      return { success: false, error: "Failed to fetch user info" }
    }

    const userInfo = await response.json()
    return { success: true, userInfo }
  }

  private async testSlackConnection(tokens: OAuthTokens) {
    const response = await fetch("https://slack.com/api/auth.test", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: "Failed to test Slack connection" }
    }

    const result = await response.json()
    if (!result.ok) {
      return { success: false, error: result.error }
    }

    return { success: true, userInfo: result }
  }
}

export const oauthService = new OAuthService()
