// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { encrypt } from "@/lib/security"

// export async function POST(request: Request) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { provider, organizationId, credentials, config } = body

//     if (!provider || !organizationId || !credentials) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // Verify user has access to organization
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId,
//         organizationId,
//         status: "ACTIVE",
//         role: { in: ["OWNER", "ADMIN", "MEMBER"] },
//       },
//     })

//     if (!membership) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     // Test the connection based on provider
//     const connectionTest = await testNonOAuthConnection(provider, credentials)

//     if (!connectionTest.success) {
//       return NextResponse.json({ error: connectionTest.error }, { status: 400 })
//     }

//     // Encrypt credentials
//     const encryptedCredentials = await encrypt(JSON.stringify(credentials))

//     // Get integration type and name
//     const integrationConfig = getIntegrationConfig(provider)

//     // Create or update integration
//     const integration = await prisma.integration.upsert({
//       where: {
//         organizationId_provider: {
//           organizationId,
//           provider,
//         },
//       },
//       update: {
//         credentials: encryptedCredentials,
//         status: "CONNECTED",
//         lastSyncAt: new Date(),
//         config: {
//           ...config,
//           testResult: connectionTest.data,
//           connectedAt: new Date().toISOString(),
//         },
//       },
//       create: {
//         name: integrationConfig.name,
//         type: integrationConfig.type as any,
//         provider,
//         organizationId,
//         credentials: encryptedCredentials,
//         status: "CONNECTED",
//         config: {
//           ...config,
//           testResult: connectionTest.data,
//           connectedAt: new Date().toISOString(),
//         },
//       },
//     })

//     // Log the connection
//     await prisma.integrationLog.create({
//       data: {
//         integrationId: integration.id,
//         level: "INFO",
//         message: `${provider} integration connected successfully`,
//         data: {
//           userId,
//           provider,
//           testResult: connectionTest.data,
//         },
//       },
//     })

//     // Track usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "INTEGRATION_SYNC",
//         userId,
//         organizationId,
//         metadata: {
//           action: "api_key_connected",
//           provider,
//         },
//       },
//     })

//     // Return integration without credentials
//     const { credentials: _, ...safeIntegration } = integration
//     return NextResponse.json(safeIntegration)
//   } catch (error) {
//     console.error("Integration connection error:", error)
//     return NextResponse.json({ error: "Failed to connect integration" }, { status: 500 })
//   }
// }

// async function testNonOAuthConnection(
//   provider: string,
//   credentials: any,
// ): Promise<{ success: boolean; error?: string; data?: any }> {
//   try {
//     switch (provider) {
//       case "postgresql":
//         return await testPostgreSQLConnection(credentials)
//       case "mysql":
//         return await testMySQLConnection(credentials)
//       case "sendgrid":
//         return await testSendGridConnection(credentials)
//       case "stripe":
//         return await testStripeConnection(credentials)
//       case "openai":
//         return await testOpenAIConnection(credentials)
//       case "webhook":
//         return await testWebhookConnection(credentials)
//       default:
//         return { success: false, error: "Unsupported provider" }
//     }
//   } catch (error) {
//     return { success: false, error: error instanceof Error ? error.message : "Connection test failed" }
//   }
// }

// async function testPostgreSQLConnection(credentials: any) {
//   const { host, port, database, username, password } = credentials

//   if (!host || !port || !database || !username || !password) {
//     return { success: false, error: "Missing required PostgreSQL credentials" }
//   }

//   // In production, you would use a proper PostgreSQL client
//   // For now, we'll simulate the connection test
//   try {
//     // const { Client } = require('pg')
//     // const client = new Client({
//     //   host,
//     //   port: parseInt(port),
//     //   database,
//     //   user: username,
//     //   password,
//     //   connectionTimeoutMillis: 5000,
//     // })
//     // await client.connect()
//     // await client.query('SELECT 1')
//     // await client.end()

//     return {
//       success: true,
//       data: {
//         host,
//         port,
//         database,
//         username,
//         testedAt: new Date().toISOString(),
//       },
//     }
//   } catch (error) {
//     return { success: false, error: "Failed to connect to PostgreSQL database" }
//   }
// }

// async function testMySQLConnection(credentials: any) {
//   const { host, port, database, username, password } = credentials

//   if (!host || !port || !database || !username || !password) {
//     return { success: false, error: "Missing required MySQL credentials" }
//   }

//   // Similar to PostgreSQL, implement actual MySQL connection test
//   return {
//     success: true,
//     data: {
//       host,
//       port,
//       database,
//       username,
//       testedAt: new Date().toISOString(),
//     },
//   }
// }

// async function testSendGridConnection(credentials: any) {
//   const { apiKey } = credentials

//   if (!apiKey) {
//     return { success: false, error: "SendGrid API key is required" }
//   }

//   try {
//     const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     })

//     if (!response.ok) {
//       return { success: false, error: "Invalid SendGrid API key" }
//     }

//     const profile = await response.json()
//     return {
//       success: true,
//       data: {
//         email: profile.email,
//         username: profile.username,
//         testedAt: new Date().toISOString(),
//       },
//     }
//   } catch (error) {
//     return { success: false, error: "Failed to verify SendGrid API key" }
//   }
// }

// async function testStripeConnection(credentials: any) {
//   const { secretKey } = credentials

//   if (!secretKey) {
//     return { success: false, error: "Stripe secret key is required" }
//   }

//   try {
//     const response = await fetch("https://api.stripe.com/v1/account", {
//       headers: {
//         Authorization: `Bearer ${secretKey}`,
//       },
//     })

//     if (!response.ok) {
//       return { success: false, error: "Invalid Stripe secret key" }
//     }

//     const account = await response.json()
//     return {
//       success: true,
//       data: {
//         accountId: account.id,
//         businessProfile: account.business_profile,
//         testedAt: new Date().toISOString(),
//       },
//     }
//   } catch (error) {
//     return { success: false, error: "Failed to verify Stripe secret key" }
//   }
// }

// async function testOpenAIConnection(credentials: any) {
//   const { apiKey } = credentials

//   if (!apiKey) {
//     return { success: false, error: "OpenAI API key is required" }
//   }

//   try {
//     const response = await fetch("https://api.openai.com/v1/models", {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//     })

//     if (!response.ok) {
//       return { success: false, error: "Invalid OpenAI API key" }
//     }

//     const models = await response.json()
//     return {
//       success: true,
//       data: {
//         modelCount: models.data?.length || 0,
//         testedAt: new Date().toISOString(),
//       },
//     }
//   } catch (error) {
//     return { success: false, error: "Failed to verify OpenAI API key" }
//   }
// }

// async function testWebhookConnection(credentials: any) {
//   const { url, method = "POST", headers = {} } = credentials

//   if (!url) {
//     return { success: false, error: "Webhook URL is required" }
//   }

//   try {
//     const response = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       body: JSON.stringify({
//         test: true,
//         message: "ConfigCraft webhook test",
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     return {
//       success: response.ok,
//       data: {
//         status: response.status,
//         statusText: response.statusText,
//         testedAt: new Date().toISOString(),
//       },
//     }
//   } catch (error) {
//     return { success: false, error: "Failed to reach webhook URL" }
//   }
// }

// function getIntegrationConfig(provider: string) {
//   const configs: Record<string, { name: string; type: string }> = {
//     postgresql: { name: "PostgreSQL Database", type: "DATABASE" },
//     mysql: { name: "MySQL Database", type: "DATABASE" },
//     sendgrid: { name: "SendGrid Email", type: "COMMUNICATION" },
//     stripe: { name: "Stripe Payments", type: "PAYMENT" },
//     openai: { name: "OpenAI API", type: "PRODUCTIVITY" },
//     webhook: { name: "Custom Webhook", type: "PRODUCTIVITY" },
//   }

//   return configs[provider] || { name: `${provider} Integration`, type: "PRODUCTIVITY" }
// }


import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/security"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { provider, organizationId, credentials, config } = body

    if (!provider || !organizationId || !credentials) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user has access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN", "MEMBER"] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Test the connection based on provider
    const connectionTest = await testNonOAuthConnection(provider, credentials)

    if (!connectionTest.success) {
      return NextResponse.json({ error: connectionTest.error }, { status: 400 })
    }

    // Encrypt credentials
    const encryptedCredentials = await encrypt(JSON.stringify(credentials))

    // Get integration type and name
    const integrationConfig = getIntegrationConfig(provider)

    // Create or update integration
    const integration = await prisma.integration.upsert({
      where: {
        organizationId_provider: {
          organizationId,
          provider,
        },
      },
      update: {
        credentials: encryptedCredentials,
        status: "CONNECTED",
        lastSyncAt: new Date(),
        config: {
          ...config,
          testResult: connectionTest.data,
          connectedAt: new Date().toISOString(),
        },
      },
      create: {
        name: integrationConfig.name,
        type: integrationConfig.type as any,
        provider,
        organizationId,
        credentials: encryptedCredentials,
        status: "CONNECTED",
        config: {
          ...config,
          testResult: connectionTest.data,
          connectedAt: new Date().toISOString(),
        },
      },
    })

    // Log the connection
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        level: "INFO",
        message: `${provider} integration connected successfully`,
        data: {
          userId,
          provider,
          testResult: connectionTest.data,
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
          action: "api_key_connected",
          provider,
        },
      },
    })

    // Return integration without credentials
    const { credentials: _, ...safeIntegration } = integration
    return NextResponse.json(safeIntegration)
  } catch (error) {
    console.error("Integration connection error:", error)
    return NextResponse.json({ error: "Failed to connect integration" }, { status: 500 })
  }
}

async function testNonOAuthConnection(
  provider: string,
  credentials: any,
): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    switch (provider) {
      case "postgresql":
        return await testPostgreSQLConnection(credentials)
      case "mysql":
        return await testMySQLConnection(credentials)
      case "sendgrid":
        return await testSendGridConnection(credentials)
      case "stripe":
        return await testStripeConnection(credentials)
      case "openai":
        return await testOpenAIConnection(credentials)
      case "webhook":
        return await testWebhookConnection(credentials)
      default:
        return { success: false, error: "Unsupported provider" }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Connection test failed" }
  }
}

async function testPostgreSQLConnection(credentials: any) {
  const { host, port, database, username, password } = credentials

  if (!host || !port || !database || !username || !password) {
    return { success: false, error: "Missing required PostgreSQL credentials" }
  }

  // In production, you would use a proper PostgreSQL client
  // For now, we'll simulate the connection test
  try {
    // const { Client } = require('pg')
    // const client = new Client({
    //   host,
    //   port: parseInt(port),
    //   database,
    //   user: username,
    //   password,
    //   connectionTimeoutMillis: 5000,
    // })
    // await client.connect()
    // await client.query('SELECT 1')
    // await client.end()

    return {
      success: true,
      data: {
        host,
        port,
        database,
        username,
        testedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to connect to PostgreSQL database" }
  }
}

async function testMySQLConnection(credentials: any) {
  const { host, port, database, username, password } = credentials

  if (!host || !port || !database || !username || !password) {
    return { success: false, error: "Missing required MySQL credentials" }
  }

  // Similar to PostgreSQL, implement actual MySQL connection test
  return {
    success: true,
    data: {
      host,
      port,
      database,
      username,
      testedAt: new Date().toISOString(),
    },
  }
}

async function testSendGridConnection(credentials: any) {
  const { apiKey } = credentials

  if (!apiKey) {
    return { success: false, error: "SendGrid API key is required" }
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: "Invalid SendGrid API key" }
    }

    const profile = await response.json()
    return {
      success: true,
      data: {
        email: profile.email,
        username: profile.username,
        testedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to verify SendGrid API key" }
  }
}

async function testStripeConnection(credentials: any) {
  const { secretKey } = credentials

  if (!secretKey) {
    return { success: false, error: "Stripe secret key is required" }
  }

  try {
    const response = await fetch("https://api.stripe.com/v1/account", {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: "Invalid Stripe secret key" }
    }

    const account = await response.json()
    return {
      success: true,
      data: {
        accountId: account.id,
        businessProfile: account.business_profile,
        testedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to verify Stripe secret key" }
  }
}

async function testOpenAIConnection(credentials: any) {
  const { apiKey } = credentials

  if (!apiKey) {
    return { success: false, error: "OpenAI API key is required" }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      return { success: false, error: "Invalid OpenAI API key" }
    }

    const models = await response.json()
    return {
      success: true,
      data: {
        modelCount: models.data?.length || 0,
        testedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to verify OpenAI API key" }
  }
}

async function testWebhookConnection(credentials: any) {
  const { url, method = "POST", headers = {} } = credentials

  if (!url) {
    return { success: false, error: "Webhook URL is required" }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        test: true,
        message: "ConfigCraft webhook test",
        timestamp: new Date().toISOString(),
      }),
    })

    return {
      success: response.ok,
      data: {
        status: response.status,
        statusText: response.statusText,
        testedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    return { success: false, error: "Failed to reach webhook URL" }
  }
}

function getIntegrationConfig(provider: string) {
  const configs: Record<string, { name: string; type: string }> = {
    postgresql: { name: "PostgreSQL Database", type: "DATABASE" },
    mysql: { name: "MySQL Database", type: "DATABASE" },
    sendgrid: { name: "SendGrid Email", type: "COMMUNICATION" },
    stripe: { name: "Stripe Payments", type: "PAYMENT" },
    openai: { name: "OpenAI API", type: "PRODUCTIVITY" },
    webhook: { name: "Custom Webhook", type: "PRODUCTIVITY" },
  }

  return configs[provider] || { name: `${provider} Integration`, type: "PRODUCTIVITY" }
}
