
// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { v0ToolGenerator } from "@/lib/v0-service"

// // Enhanced logging utility for API routes
// class APILogger {
//   private static log(level: "info" | "warn" | "error", message: string, data?: any) {
//     const timestamp = new Date().toISOString()
//     const logMessage = `[${timestamp}] [TOOLS_API] [${level.toUpperCase()}] ${message}`

//     if (data) {
//       console.log(logMessage, data)
//     } else {
//       console.log(logMessage)
//     }
//   }

//   static info(message: string, data?: any) {
//     this.log("info", message, data)
//   }

//   static warn(message: string, data?: any) {
//     this.log("warn", message, data)
//   }

//   static error(message: string, data?: any) {
//     this.log("error", message, data)
//   }
// }

// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   const startTime = Date.now()
//   APILogger.info("📥 GET /api/organizations/[slug]/tools", { slug: params.slug })

//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       APILogger.warn("❌ Unauthorized request - no userId")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     APILogger.info("👤 User authenticated", { userId })

//     const organization = await prisma.organization.findUnique({
//       where: { slug: params.slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       APILogger.warn("❌ Organization not found or user not member", {
//         slug: params.slug,
//         userId,
//         organizationFound: !!organization,
//         memberCount: organization?.members.length || 0,
//       })
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     APILogger.info("🏢 Organization access verified", {
//       organizationId: organization.id,
//       organizationName: organization.name,
//     })

//     const tools = await prisma.tool.findMany({
//       where: { organizationId: organization.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         _count: {
//           select: { usageRecords: true },
//         },
//       },
//     })

//     const endTime = Date.now()
//     APILogger.info("✅ Tools retrieved successfully", {
//       toolsCount: tools.length,
//       organizationId: organization.id,
//       requestTime: `${endTime - startTime}ms`,
//     })

//     return NextResponse.json(tools)
//   } catch (error) {
//     const endTime = Date.now()
//     APILogger.error("💥 Error fetching tools", {
//       error:
//         error instanceof Error
//           ? {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//             }
//           : error,
//       slug: params.slug,
//       requestTime: `${endTime - startTime}ms`,
//     })
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   const startTime = Date.now()
//   APILogger.info("🚀 POST /api/organizations/[slug]/tools - Starting tool creation", {
//     slug: params.slug,
//     timestamp: new Date().toISOString(),
//   })

//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       APILogger.error("❌ Unauthorized request - no userId")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     APILogger.info("👤 User authenticated", { userId })

//     const organization = await prisma.organization.findUnique({
//       where: { slug: params.slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       APILogger.error("❌ Organization not found or user not member", {
//         slug: params.slug,
//         userId,
//         organizationFound: !!organization,
//       })
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     APILogger.info("🏢 Organization verified", {
//       organizationId: organization.id,
//       organizationName: organization.name,
//     })

//     const requestBody = await request.json()
//     const { name, description, category, requirements } = requestBody

//     APILogger.info("📝 Tool creation request parsed", {
//       name,
//       category,
//       descriptionLength: description?.length || 0,
//       requirementsLength: requirements?.length || 0,
//       hasDescription: !!description,
//       hasRequirements: !!requirements,
//     })

//     if (!name || !requirements || !category) {
//       APILogger.error("❌ Missing required fields", {
//         hasName: !!name,
//         hasRequirements: !!requirements,
//         hasCategory: !!category,
//       })
//       return NextResponse.json({ error: "Name, category, and requirements are required" }, { status: 400 })
//     }

//     // Generate unique slug
//     const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
//     let slug = baseSlug
//     let counter = 1

//     APILogger.info("🔗 Generating unique slug", { baseSlug })

//     while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug } })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//       APILogger.info("🔄 Slug collision, trying", { slug, counter })
//     }

//     APILogger.info("✅ Unique slug generated", { finalSlug: slug })

//     // Create tool record first
//     const toolCreationStart = Date.now()
//     const tool = await prisma.tool.create({
//       data: {
//         name,
//         description,
//         category,
//         requirements,
//         slug,
//         status: "GENERATING",
//         generationStatus: "analyzing",
//         organizationId: organization.id,
//         createdById: userId,
//       },
//     })
//     const toolCreationEnd = Date.now()

//     APILogger.info("✅ Tool record created in database", {
//       toolId: tool.id,
//       toolName: tool.name,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       creationTime: `${toolCreationEnd - toolCreationStart}ms`,
//     })

//     // Start generation in background with comprehensive logging
//     generateToolInBackground(tool.id, {
//       toolName: name,
//       requirements,
//       category,
//       userEmail: "", // We could get this from Clerk if needed
//     }).catch((error) => {
//       APILogger.error("💥 Background generation failed", {
//         toolId: tool.id,
//         error:
//           error instanceof Error
//             ? {
//                 name: error.name,
//                 message: error.message,
//                 stack: error.stack,
//               }
//             : error,
//       })
//     })

//     const endTime = Date.now()
//     APILogger.info("🚀 Tool creation initiated successfully", {
//       toolId: tool.id,
//       organizationId: organization.id,
//       totalRequestTime: `${endTime - startTime}ms`,
//     })

//     return NextResponse.json({
//       toolId: tool.id,
//       status: "GENERATING",
//       message: "Tool creation started successfully",
//     })
//   } catch (error) {
//     const endTime = Date.now()
//     APILogger.error("💥 Error creating tool", {
//       error:
//         error instanceof Error
//           ? {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//             }
//           : error,
//       slug: params.slug,
//       totalRequestTime: `${endTime - startTime}ms`,
//     })
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// async function generateToolInBackground(toolId: string, request: any) {
//   const startTime = Date.now()
//   APILogger.info("🔄 Starting background generation", {
//     toolId,
//     request: {
//       toolName: request.toolName,
//       category: request.category,
//       requirementsLength: request.requirements?.length || 0,
//     },
//     timestamp: new Date().toISOString(),
//   })

//   try {
//     // Update status to analyzing
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "GENERATING",
//         generationStatus: "analyzing",
//       },
//     })
//     APILogger.info("📊 Status updated to analyzing", { toolId })

//     // Call v0 service for actual generation
//     APILogger.info("🤖 Calling v0ToolGenerator service", { toolId })
//     const generationStart = Date.now()

//     const result = await v0ToolGenerator.generateTool(request)

//     const generationEnd = Date.now()
//     APILogger.info("🎯 v0ToolGenerator completed", {
//       toolId,
//       result: {
//         status: result.status,
//         chatId: result.chatId,
//         filesCount: result.files.length,
//         hasDemoUrl: !!result.demoUrl,
//         error: result.error,
//       },
//       generationTime: `${generationEnd - generationStart}ms`,
//     })

//     if (result.status === "error") {
//       APILogger.error("❌ v0 generation failed", {
//         toolId,
//         error: result.error,
//         chatId: result.chatId,
//       })

//       await prisma.tool.update({
//         where: { id: toolId },
//         data: {
//           status: "ERROR",
//           generationStatus: "error",
//           generationError: result.error,
//         },
//       })
//       return
//     }

//     // Update tool with successful generation results
//     const updateStart = Date.now()
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "GENERATED",
//         generationStatus: "completed",
//         previewUrl: result.demoUrl,
//         chatUrl: result.chatUrl,
//         v0ChatId: result.chatId,
//         generatedAt: new Date(),
//         generatedCode: JSON.stringify(result.files),
//       },
//     })
//     const updateEnd = Date.now()

//     // Create chat session record if we have a chat ID
//     if (result.chatId) {
//       try {
//         const chatSession = await prisma.chatSession.create({
//           data: {
//             toolId,
//             v0ChatId: result.chatId,
//             status: "completed",
//             demoUrl: result.demoUrl,
//             userId: "", // We'd need to pass this from the original request
//             organizationId: "", // We'd need to pass this from the original request
//           },
//         })

//         // Add files to chat session
//         if (result.files.length > 0) {
//           await prisma.chatFile.createMany({
//             data: result.files.map((file) => ({
//               chatSessionId: chatSession.id,
//               name: file.name,
//               content: file.content,
//               type: file.type || "typescript",
//               size: Buffer.byteLength(file.content, "utf8"),
//             })),
//           })
//         }

//         APILogger.info("💾 Chat session and files saved", {
//           toolId,
//           chatSessionId: chatSession.id,
//           filesCount: result.files.length,
//         })
//       } catch (chatError) {
//         APILogger.warn("⚠️ Failed to save chat session", {
//           toolId,
//           chatId: result.chatId,
//           error: chatError instanceof Error ? chatError.message : "Unknown error",
//         })
//       }
//     }

//     const totalTime = Date.now() - startTime
//     APILogger.info("🎉 Tool generation completed successfully!", {
//       toolId,
//       chatId: result.chatId,
//       demoUrl: result.demoUrl,
//       filesGenerated: result.files.length,
//       updateTime: `${updateEnd - updateStart}ms`,
//       totalBackgroundTime: `${totalTime}ms`,
//     })
//   } catch (error) {
//     const totalTime = Date.now() - startTime
//     APILogger.error("💥 Background generation error", {
//       toolId,
//       error:
//         error instanceof Error
//           ? {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//             }
//           : error,
//       totalTime: `${totalTime}ms`,
//     })

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
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const tools = await prisma.tool.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
      include: {
        chatSessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            files: true,
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        publishedTools: {
          where: { status: "deployed" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(
      tools.map((tool) => {
        const latestSession = tool.chatSessions[0]
        const publishedTool = tool.publishedTools[0]

        return {
          ...tool,
          previewUrl: tool.previewUrl || latestSession?.demoUrl,
          publishedUrl: publishedTool?.url || tool.publishedUrl,
          filesCount: latestSession?.files.length || 0,
          messagesCount: latestSession?.messages.length || 0,
          latestMessage: latestSession?.messages[0]?.content,
        }
      }),
    )
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, category, requirements, integrationIds } = body

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const tool = await prisma.tool.create({
      data: {
        name,
        slug,
        description,
        category,
        requirements,
        status: "GENERATING",
        generationStatus: "pending",
        organizationId: organization.id,
        createdById: userId,
        versions: {
          create: {
            version: "1.0.0",
            isActive: true,
          },
        },
      },
      include: {
        versions: true,
      },
    })

    if (integrationIds && integrationIds.length > 0) {
      await prisma.toolIntegration.createMany({
        data: integrationIds.map((integrationId: string) => ({
          toolId: tool.id,
          integrationId,
          isActive: true,
        })),
      })
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        resource: "tool",
        resourceId: tool.id,
        userId,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          name,
          category,
          integrationIds,
        },
      },
    })

    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          category,
        },
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Error creating tool:", error)
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
  }
}
