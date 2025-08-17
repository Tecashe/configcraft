
// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { v0ToolGenerator } from "@/lib/v0-service"
// import { z } from "zod"

// const createToolSchema = z.object({
//   name: z.string().min(1, "Tool name is required"),
//   description: z.string().optional(),
//   requirements: z.string().min(10, "Requirements must be at least 10 characters"),
//   category: z.string().optional(),
// })

// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Get organization and check membership
//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Get tools for this organization
//     const tools = await prisma.tool.findMany({
//       where: { organizationId: organization.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         creator: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//         usageRecords: {
//           select: { id: true },
//         },
//       },
//     })

//     const formattedTools = tools.map((tool) => ({
//       id: tool.id,
//       name: tool.name,
//       description: tool.description,
//       category: tool.category,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       createdAt: tool.createdAt.toISOString(),
//       updatedAt: tool.updatedAt.toISOString(),
//       previewUrl: tool.previewUrl,
//       publishedUrl: tool.publishedUrl,
//       generationError: tool.generationError,
//       creator: tool.creator,
//       usageCount: tool.usageRecords.length,
//     }))

//     return NextResponse.json(formattedTools)
//   } catch (error) {
//     console.error("Error fetching tools:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params
//     const body = await request.json()
//     const validatedData = createToolSchema.parse(body)

//     // Get user and organization
//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//         subscriptions: {
//           where: { status: "ACTIVE" },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check subscription limits
//     const subscription = organization.subscriptions[0]
//     if (!subscription) {
//       // Check free tier limits
//       const toolCount = await prisma.tool.count({
//         where: { organizationId: organization.id },
//       })

//       if (toolCount >= 3) {
//         return NextResponse.json(
//           {
//             error: "Free tier limit reached. Please upgrade to create more tools.",
//           },
//           { status: 403 },
//         )
//       }
//     }

//     // Generate a unique slug
//     const baseSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
//     let slug_generated = baseSlug
//     let counter = 1

//     while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug: slug_generated } })) {
//       slug_generated = `${baseSlug}-${counter}`
//       counter++
//     }

//     // Create the tool with initial status
//     const tool = await prisma.tool.create({
//       data: {
//         name: validatedData.name,
//         description: validatedData.description,
//         slug: slug_generated,
//         status: "GENERATING",
//         category: validatedData.category || "General",
//         requirements: validatedData.requirements,
//         generationStatus: "analyzing",
//         config: {},
//         schema: {},
//         ui: {},
//         createdById: user.clerkId,
//         organizationId: organization.id,
//       },
//     })

//     // Start generation process asynchronously
//     generateToolAsync(tool.id, {
//       toolName: validatedData.name,
//       requirements: validatedData.requirements,
//       category: validatedData.category || "General",
//       userEmail: user.email,
//     })

//     // Track usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_CREATED",
//         userId: user.clerkId,
//         organizationId: organization.id,
//         toolId: tool.id,
//         metadata: {
//           category: validatedData.category,
//         },
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       toolId: tool.id,
//       message: "Tool generation started",
//     })
//   } catch (error) {
//     console.error("Error creating tool:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         {
//           error: "Validation error",
//           details: error.errors,
//         },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json(
//       {
//         error: "Failed to create tool",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// // Async function to handle tool generation
// async function generateToolAsync(
//   toolId: string,
//   request: {
//     toolName: string
//     requirements: string
//     category: string
//     userEmail: string
//   },
// ) {
//   try {
//     console.log(`Starting async generation for tool ${toolId}`)

//     // Update status to generating
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "GENERATING",
//         generationStatus: "analyzing",
//       },
//     })

//     // Generate with v0
//     const result = await v0ToolGenerator.generateTool(request)

//     if (result.status === "error") {
//       throw new Error(result.error || "Generation failed")
//     }

//     // Extract main component code
//     const mainComponent = result.files.find((f) => f.name.includes(".tsx") && !f.name.includes("test"))

//     // Update tool with results
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "GENERATED",
//         generationStatus: "completed",
//         v0Code: mainComponent?.content || "",
//         previewUrl: result.demoUrl,
//         generatedCode: result.files.map((f) => `// ${f.name}\n${f.content}`).join("\n\n"),
//         generatedAt: new Date(),
//       },
//     })

//     // Create chat session record
//     if (result.chatId) {
//       await prisma.chatSession.create({
//         data: {
//           toolId,
//           userId: (await prisma.tool.findUnique({ where: { id: toolId } }))?.createdById || "",
//           organizationId:
//             (
//               await prisma.tool.findUnique({
//                 where: { id: toolId },
//                 include: { organization: true },
//               })
//             )?.organizationId || "",
//           v0ChatId: result.chatId,
//           status: "completed",
//           demoUrl: result.demoUrl,
//         },
//       })
//     }

//     console.log(`Tool ${toolId} generation completed successfully`)
//   } catch (error) {
//     console.error(`Async generation error for tool ${toolId}:`, error)

//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "ERROR",
//         generationStatus: "error",
//         generationError: error instanceof Error ? error.message : "Unknown error",
//       },
//     })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { v0ToolGenerator } from "@/lib/v0-service"

// Enhanced logging utility for API routes
class APILogger {
  private static log(level: "info" | "warn" | "error", message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [TOOLS_API] [${level.toUpperCase()}] ${message}`

    if (data) {
      console.log(logMessage, data)
    } else {
      console.log(logMessage)
    }
  }

  static info(message: string, data?: any) {
    this.log("info", message, data)
  }

  static warn(message: string, data?: any) {
    this.log("warn", message, data)
  }

  static error(message: string, data?: any) {
    this.log("error", message, data)
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const startTime = Date.now()
  APILogger.info("📥 GET /api/organizations/[slug]/tools", { slug: params.slug })

  try {
    const { userId } = await auth()
    if (!userId) {
      APILogger.warn("❌ Unauthorized request - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    APILogger.info("👤 User authenticated", { userId })

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      APILogger.warn("❌ Organization not found or user not member", {
        slug: params.slug,
        userId,
        organizationFound: !!organization,
        memberCount: organization?.members.length || 0,
      })
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    APILogger.info("🏢 Organization access verified", {
      organizationId: organization.id,
      organizationName: organization.name,
    })

    const tools = await prisma.tool.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { usageRecords: true },
        },
      },
    })

    const endTime = Date.now()
    APILogger.info("✅ Tools retrieved successfully", {
      toolsCount: tools.length,
      organizationId: organization.id,
      requestTime: `${endTime - startTime}ms`,
    })

    return NextResponse.json(tools)
  } catch (error) {
    const endTime = Date.now()
    APILogger.error("💥 Error fetching tools", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      slug: params.slug,
      requestTime: `${endTime - startTime}ms`,
    })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const startTime = Date.now()
  APILogger.info("🚀 POST /api/organizations/[slug]/tools - Starting tool creation", {
    slug: params.slug,
    timestamp: new Date().toISOString(),
  })

  try {
    const { userId } = await auth()
    if (!userId) {
      APILogger.error("❌ Unauthorized request - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    APILogger.info("👤 User authenticated", { userId })

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      APILogger.error("❌ Organization not found or user not member", {
        slug: params.slug,
        userId,
        organizationFound: !!organization,
      })
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    APILogger.info("🏢 Organization verified", {
      organizationId: organization.id,
      organizationName: organization.name,
    })

    const requestBody = await request.json()
    const { name, description, category, requirements } = requestBody

    APILogger.info("📝 Tool creation request parsed", {
      name,
      category,
      descriptionLength: description?.length || 0,
      requirementsLength: requirements?.length || 0,
      hasDescription: !!description,
      hasRequirements: !!requirements,
    })

    if (!name || !requirements || !category) {
      APILogger.error("❌ Missing required fields", {
        hasName: !!name,
        hasRequirements: !!requirements,
        hasCategory: !!category,
      })
      return NextResponse.json({ error: "Name, category, and requirements are required" }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    let slug = baseSlug
    let counter = 1

    APILogger.info("🔗 Generating unique slug", { baseSlug })

    while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
      APILogger.info("🔄 Slug collision, trying", { slug, counter })
    }

    APILogger.info("✅ Unique slug generated", { finalSlug: slug })

    // Create tool record first
    const toolCreationStart = Date.now()
    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        category,
        requirements,
        slug,
        status: "GENERATING",
        generationStatus: "analyzing",
        organizationId: organization.id,
        createdById: userId,
      },
    })
    const toolCreationEnd = Date.now()

    APILogger.info("✅ Tool record created in database", {
      toolId: tool.id,
      toolName: tool.name,
      status: tool.status,
      generationStatus: tool.generationStatus,
      creationTime: `${toolCreationEnd - toolCreationStart}ms`,
    })

    // Start generation in background with comprehensive logging
    generateToolInBackground(tool.id, {
      toolName: name,
      requirements,
      category,
      userEmail: "", // We could get this from Clerk if needed
    }).catch((error) => {
      APILogger.error("💥 Background generation failed", {
        toolId: tool.id,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      })
    })

    const endTime = Date.now()
    APILogger.info("🚀 Tool creation initiated successfully", {
      toolId: tool.id,
      organizationId: organization.id,
      totalRequestTime: `${endTime - startTime}ms`,
    })

    return NextResponse.json({
      toolId: tool.id,
      status: "GENERATING",
      message: "Tool creation started successfully",
    })
  } catch (error) {
    const endTime = Date.now()
    APILogger.error("💥 Error creating tool", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      slug: params.slug,
      totalRequestTime: `${endTime - startTime}ms`,
    })
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function generateToolInBackground(toolId: string, request: any) {
  const startTime = Date.now()
  APILogger.info("🔄 Starting background generation", {
    toolId,
    request: {
      toolName: request.toolName,
      category: request.category,
      requirementsLength: request.requirements?.length || 0,
    },
    timestamp: new Date().toISOString(),
  })

  try {
    // Update status to analyzing
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATING",
        generationStatus: "analyzing",
      },
    })
    APILogger.info("📊 Status updated to analyzing", { toolId })

    // Call v0 service for actual generation
    APILogger.info("🤖 Calling v0ToolGenerator service", { toolId })
    const generationStart = Date.now()

    const result = await v0ToolGenerator.generateTool(request)

    const generationEnd = Date.now()
    APILogger.info("🎯 v0ToolGenerator completed", {
      toolId,
      result: {
        status: result.status,
        chatId: result.chatId,
        filesCount: result.files.length,
        hasDemoUrl: !!result.demoUrl,
        error: result.error,
      },
      generationTime: `${generationEnd - generationStart}ms`,
    })

    if (result.status === "error") {
      APILogger.error("❌ v0 generation failed", {
        toolId,
        error: result.error,
        chatId: result.chatId,
      })

      await prisma.tool.update({
        where: { id: toolId },
        data: {
          status: "ERROR",
          generationStatus: "error",
          generationError: result.error,
        },
      })
      return
    }

    // Update tool with successful generation results
    const updateStart = Date.now()
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATED",
        generationStatus: "completed",
        previewUrl: result.demoUrl,
        chatUrl: result.chatUrl,
        v0ChatId: result.chatId,
        generatedAt: new Date(),
        generatedCode: JSON.stringify(result.files),
      },
    })
    const updateEnd = Date.now()

    // Create chat session record if we have a chat ID
    if (result.chatId) {
      try {
        const chatSession = await prisma.chatSession.create({
          data: {
            toolId,
            v0ChatId: result.chatId,
            status: "completed",
            demoUrl: result.demoUrl,
            userId: "", // We'd need to pass this from the original request
            organizationId: "", // We'd need to pass this from the original request
          },
        })

        // Add files to chat session
        if (result.files.length > 0) {
          await prisma.chatFile.createMany({
            data: result.files.map((file) => ({
              chatSessionId: chatSession.id,
              name: file.name,
              content: file.content,
              type: file.type || "typescript",
              size: Buffer.byteLength(file.content, "utf8"),
            })),
          })
        }

        APILogger.info("💾 Chat session and files saved", {
          toolId,
          chatSessionId: chatSession.id,
          filesCount: result.files.length,
        })
      } catch (chatError) {
        APILogger.warn("⚠️ Failed to save chat session", {
          toolId,
          chatId: result.chatId,
          error: chatError instanceof Error ? chatError.message : "Unknown error",
        })
      }
    }

    const totalTime = Date.now() - startTime
    APILogger.info("🎉 Tool generation completed successfully!", {
      toolId,
      chatId: result.chatId,
      demoUrl: result.demoUrl,
      filesGenerated: result.files.length,
      updateTime: `${updateEnd - updateStart}ms`,
      totalBackgroundTime: `${totalTime}ms`,
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    APILogger.error("💥 Background generation error", {
      toolId,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      totalTime: `${totalTime}ms`,
    })

    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "ERROR",
        generationStatus: "error",
        generationError: error instanceof Error ? error.message : "Unknown error",
      },
    })
  }
}


