
// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { ChatManager } from "@/lib/chat-management"

// export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug: params.slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     // Get chat session if exists
//     let chatSession = null
//     if (tool.chatSessionId) {
//       chatSession = await ChatManager.getChatSession(tool.chatSessionId)
//     }

//     // Calculate progress using the static method
//     const progress = ChatManager.calculateProgress(tool.status, tool.generationStatus || undefined)

//     // Determine current step based on generation status
//     let currentStep = "analyzing"
//     switch (tool.generationStatus) {
//       case "pending":
//         currentStep = "analyzing"
//         break
//       case "analyzing":
//         currentStep = "analyzing"
//         break
//       case "designing":
//         currentStep = "designing"
//         break
//       case "generating":
//         currentStep = "generating"
//         break
//       case "finalizing":
//         currentStep = "finalizing"
//         break
//       case "completed":
//         currentStep = "completed"
//         break
//       case "error":
//         currentStep = "error"
//         break
//       default:
//         currentStep = "analyzing"
//     }

//     return NextResponse.json({
//       id: tool.id,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       currentStep,
//       previewUrl: tool.previewUrl,
//       demoUrl: chatSession?.demoUrl,
//       error: tool.generationError || chatSession?.error,
//       progress,
//       chatSession: chatSession
//         ? {
//             id: chatSession.id,
//             status: chatSession.status,
//             messages: chatSession.messages,
//             files: chatSession.files,
//             demoUrl: chatSession.demoUrl,
//             progress: ChatManager.calculateProgress(chatSession.status, undefined),
//           }
//         : null,
//       files: chatSession?.files || [],
//       createdAt: tool.createdAt,
//       updatedAt: tool.updatedAt,
//     })
//   } catch (error) {
//     console.error("Failed to get tool status:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to get tool status",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { v0ToolGenerator } from "@/lib/v0-service"

// // Enhanced logging utility for status API
// class StatusAPILogger {
//   private static log(level: "info" | "warn" | "error", message: string, data?: any) {
//     const timestamp = new Date().toISOString()
//     const logMessage = `[${timestamp}] [STATUS_API] [${level.toUpperCase()}] ${message}`

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

// export async function GET(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
//   const startTime = Date.now()
//   StatusAPILogger.info("📊 GET /api/organizations/[slug]/tools/[id]/status", {
//     slug: params.slug,
//     toolId: params.id,
//   })

//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       StatusAPILogger.warn("❌ Unauthorized request - no userId")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     StatusAPILogger.info("👤 User authenticated", { userId })

//     // Verify organization access
//     const organization = await prisma.organization.findUnique({
//       where: { slug: params.slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       StatusAPILogger.warn("❌ Organization access denied", {
//         slug: params.slug,
//         userId,
//         organizationFound: !!organization,
//       })
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     StatusAPILogger.info("🏢 Organization access verified", {
//       organizationId: organization.id,
//       organizationName: organization.name,
//     })

//     // Get tool from database
//     const tool = await prisma.tool.findUnique({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//       include: {
//         chatSessions: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//           include: {
//             files: true,
//           },
//         },
//       },
//     })

//     if (!tool) {
//       StatusAPILogger.warn("❌ Tool not found", {
//         toolId: params.id,
//         organizationId: organization.id,
//       })
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     StatusAPILogger.info("🔧 Tool found in database", {
//       toolId: tool.id,
//       toolName: tool.name,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       hasV0ChatId: !!tool.v0ChatId,
//       chatSessionsCount: tool.chatSessions.length,
//     })

//     let files: any[] = []
//     let demoUrl = tool.previewUrl
//     let chatUrl = tool.chatUrl
//     let progress = 0
//     let step = tool.generationStatus || "idle"
//     let status = tool.status?.toLowerCase() || "idle"

//     // Calculate progress based on status
//     switch (step) {
//       case "analyzing":
//         progress = 15
//         break
//       case "designing":
//         progress = 30
//         break
//       case "generating":
//         progress = 60
//         break
//       case "optimizing":
//         progress = 80
//         break
//       case "finalizing":
//         progress = 95
//         break
//       case "completed":
//         progress = 100
//         break
//       case "error":
//         progress = 0
//         break
//       default:
//         progress = 5
//     }

//     // If we have a v0 chat ID and the tool is still generating, check v0 status
//     if (tool.v0ChatId && (status === "generating" || status === "generated")) {
//       StatusAPILogger.info("🔍 Checking v0 generation status", {
//         toolId: tool.id,
//         v0ChatId: tool.v0ChatId,
//       })

//       try {
//         const v0Status = await v0ToolGenerator.getGenerationStatus(tool.v0ChatId)
//         StatusAPILogger.info("📊 v0 status retrieved", {
//           toolId: tool.id,
//           v0Status: {
//             status: v0Status.status,
//             progress: v0Status.progress,
//             step: v0Status.step,
//             filesCount: v0Status.files.length,
//             hasDemoUrl: !!v0Status.demoUrl,
//           },
//         })

//         // Update our response with v0 data
//         if (v0Status.files.length > 0) {
//           files = v0Status.files.map((file) => ({
//             name: file.name,
//             content: file.content,
//             type: file.type || "typescript",
//             size: Buffer.byteLength(file.content, "utf8"),
//           }))
//         }

//         if (v0Status.demoUrl) {
//           demoUrl = v0Status.demoUrl
//         }

//         if (v0Status.chatUrl) {
//           chatUrl = v0Status.chatUrl
//         }

//         if (v0Status.progress !== undefined) {
//           progress = v0Status.progress
//         }

//         if (v0Status.step) {
//           step = v0Status.step
//         }

//         if (v0Status.status) {
//           status = v0Status.status
//         }

//         // Update database if status changed
//         if (v0Status.status === "completed" && tool.status !== "GENERATED") {
//           StatusAPILogger.info("🔄 Updating tool status to completed", { toolId: tool.id })

//           await prisma.tool.update({
//             where: { id: tool.id },
//             data: {
//               status: "GENERATED",
//               generationStatus: "completed",
//               previewUrl: v0Status.demoUrl,
//               chatUrl: v0Status.chatUrl,
//               generatedAt: new Date(),
//               generatedCode: JSON.stringify(v0Status.files),
//             },
//           })
//         } else if (v0Status.status === "error" && tool.status !== "ERROR") {
//           StatusAPILogger.error("❌ Updating tool status to error", {
//             toolId: tool.id,
//             error: v0Status.error,
//           })

//           await prisma.tool.update({
//             where: { id: tool.id },
//             data: {
//               status: "ERROR",
//               generationStatus: "error",
//               generationError: v0Status.error,
//             },
//           })
//         }
//       } catch (v0Error) {
//         StatusAPILogger.warn("⚠️ Failed to get v0 status", {
//           toolId: tool.id,
//           v0ChatId: tool.v0ChatId,
//           error: v0Error instanceof Error ? v0Error.message : "Unknown error",
//         })
//       }
//     }

//     // If we have chat session files, use those
//     if (tool.chatSessions.length > 0 && tool.chatSessions[0].files.length > 0) {
//       files = tool.chatSessions[0].files.map((file) => ({
//         name: file.name,
//         content: file.content,
//         type: file.type,
//         size: file.size,
//       }))
//       StatusAPILogger.info("📁 Using chat session files", {
//         toolId: tool.id,
//         filesCount: files.length,
//       })
//     }

//     // Try to parse generated code if no other files found
//     if (files.length === 0 && tool.generatedCode) {
//       try {
//         const parsedFiles = JSON.parse(tool.generatedCode)
//         if (Array.isArray(parsedFiles)) {
//           files = parsedFiles
//           StatusAPILogger.info("📄 Using parsed generated code files", {
//             toolId: tool.id,
//             filesCount: files.length,
//           })
//         }
//       } catch (parseError) {
//         StatusAPILogger.warn("⚠️ Failed to parse generated code", {
//           toolId: tool.id,
//           error: parseError instanceof Error ? parseError.message : "Parse error",
//         })
//       }
//     }

//     const endTime = Date.now()
//     const response = {
//       toolId: tool.id,
//       status,
//       progress,
//       step,
//       message: getStatusMessage(step, progress),
//       files,
//       demoUrl,
//       chatUrl,
//       chatId: tool.v0ChatId,
//       error: tool.generationError,
//       createdAt: tool.createdAt,
//       updatedAt: tool.updatedAt,
//       generatedAt: tool.generatedAt,
//     }

//     StatusAPILogger.info("✅ Status check completed", {
//       toolId: tool.id,
//       status,
//       progress,
//       step,
//       filesCount: files.length,
//       hasDemoUrl: !!demoUrl,
//       requestTime: `${endTime - startTime}ms`,
//     })

//     return NextResponse.json(response)
//   } catch (error) {
//     const endTime = Date.now()
//     StatusAPILogger.error("💥 Status check error", {
//       error:
//         error instanceof Error
//           ? {
//               name: error.name,
//               message: error.message,
//               stack: error.stack,
//             }
//           : error,
//       slug: params.slug,
//       toolId: params.id,
//       requestTime: `${endTime - startTime}ms`,
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

// function getStatusMessage(step: string, progress: number): string {
//   switch (step) {
//     case "analyzing":
//       return "Analyzing your requirements and planning the application architecture..."
//     case "designing":
//       return "Designing the user interface and component structure..."
//     case "generating":
//       return "Generating React components and TypeScript code..."
//     case "optimizing":
//       return "Optimizing performance and adding final touches..."
//     case "finalizing":
//       return "Finalizing the application and preparing deployment..."
//     case "completed":
//       return "Your business tool is ready! Click to view the live preview."
//     case "error":
//       return "Generation encountered an error. Please try again."
//     default:
//       return `Processing... ${progress}% complete`
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { v0ToolGenerator } from "@/lib/v0-service"
import { GenerationStatus } from "@prisma/client" // Import the enum type

// Enhanced logging utility for status API
class StatusAPILogger {
  private static log(level: "info" | "warn" | "error", message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [STATUS_API] [${level.toUpperCase()}] ${message}`

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

// Helper function to validate and convert string to GenerationStatus
function mapToGenerationStatus(status: string): GenerationStatus {
  // Map common v0 status strings to your GenerationStatus enum values
  const statusMap: Record<string, GenerationStatus> = {
    'analyzing': 'analyzing' as GenerationStatus,
    'designing': 'designing' as GenerationStatus,
    'generating': 'generating' as GenerationStatus,
    'optimizing': 'optimizing' as GenerationStatus,
    'finalizing': 'finalizing' as GenerationStatus,
    'completed': 'completed' as GenerationStatus,
    'error': 'error' as GenerationStatus,
    'idle': 'pending' as GenerationStatus,
    'pending': 'pending' as GenerationStatus,
  }
  
  // Return mapped status or default to generating
  return statusMap[status.toLowerCase()] || 'generating' as GenerationStatus
}

export async function GET(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const startTime = Date.now()
  StatusAPILogger.info("📊 GET /api/organizations/[slug]/tools/[id]/status", {
    slug: params.slug,
    toolId: params.id,
  })

  try {
    const { userId } = await auth()
    if (!userId) {
      StatusAPILogger.warn("❌ Unauthorized request - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    StatusAPILogger.info("👤 User authenticated", { userId })

    // Verify organization access
    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      StatusAPILogger.warn("❌ Organization access denied", {
        slug: params.slug,
        userId,
        organizationFound: !!organization,
      })
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    StatusAPILogger.info("🏢 Organization access verified", {
      organizationId: organization.id,
      organizationName: organization.name,
    })

    // Get tool from database
    const tool = await prisma.tool.findUnique({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
      include: {
        chatSessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            files: true,
          },
        },
      },
    })

    if (!tool) {
      StatusAPILogger.warn("❌ Tool not found", {
        toolId: params.id,
        organizationId: organization.id,
      })
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    StatusAPILogger.info("🔧 Tool found in database", {
      toolId: tool.id,
      toolName: tool.name,
      status: tool.status,
      generationStatus: tool.generationStatus,
      hasV0ChatId: !!tool.v0ChatId,
      chatSessionsCount: tool.chatSessions.length,
    })

    let files: any[] = []
    let demoUrl = tool.previewUrl
    let chatUrl = tool.chatUrl
    let progress = 0
    let step: GenerationStatus = tool.generationStatus || 'pending' as GenerationStatus
    let status = tool.status?.toLowerCase() || "idle"

    // Calculate progress based on status
    switch (step) {
      case "analyzing":
        progress = 15
        break
      case "designing":
        progress = 30
        break
      case "generating":
        progress = 60
        break
      case "optimizing":
        progress = 80
        break
      case "finalizing":
        progress = 95
        break
      case "completed":
        progress = 100
        break
      case "error":
        progress = 0
        break
      default:
        progress = 5
    }

    // If we have a v0 chat ID and the tool is still generating, check v0 status
    if (tool.v0ChatId && (status === "generating" || status === "generated")) {
      StatusAPILogger.info("🔍 Checking v0 generation status", {
        toolId: tool.id,
        v0ChatId: tool.v0ChatId,
      })

      try {
        const v0Status = await v0ToolGenerator.getGenerationStatus(tool.v0ChatId)
        StatusAPILogger.info("📊 v0 status retrieved", {
          toolId: tool.id,
          v0Status: {
            status: v0Status.status,
            progress: v0Status.progress,
            step: v0Status.step,
            filesCount: v0Status.files.length,
            hasDemoUrl: !!v0Status.demoUrl,
          },
        })

        // Update our response with v0 data
        if (v0Status.files.length > 0) {
          files = v0Status.files.map((file: any) => ({
            name: file.name,
            content: file.content,
            type: file.type || "typescript",
            size: Buffer.byteLength(file.content, "utf8"),
          }))
        }

        if (v0Status.demoUrl) {
          demoUrl = v0Status.demoUrl
        }

        if (v0Status.chatUrl) {
          chatUrl = v0Status.chatUrl
        }

        if (v0Status.progress !== undefined) {
          progress = v0Status.progress
        }

        // Fix: Properly map the v0Status.step to GenerationStatus enum
        if (v0Status.step) {
          step = mapToGenerationStatus(v0Status.step)
        }

        if (v0Status.status) {
          status = v0Status.status
        }

        // Update database if status changed
        if (v0Status.status === "completed" && tool.status !== "GENERATED") {
          StatusAPILogger.info("🔄 Updating tool status to completed", { toolId: tool.id })

          await prisma.tool.update({
            where: { id: tool.id },
            data: {
              status: "GENERATED",
              generationStatus: mapToGenerationStatus("completed"),
              previewUrl: v0Status.demoUrl,
              chatUrl: v0Status.chatUrl,
              generatedAt: new Date(),
              generatedCode: JSON.stringify(v0Status.files),
            },
          })
        } else if (v0Status.status === "error" && tool.status !== "ERROR") {
          StatusAPILogger.error("❌ Updating tool status to error", {
            toolId: tool.id,
            error: v0Status.error,
          })

          await prisma.tool.update({
            where: { id: tool.id },
            data: {
              status: "ERROR",
              generationStatus: mapToGenerationStatus("error"),
              generationError: v0Status.error,
            },
          })
        }
      } catch (v0Error) {
        StatusAPILogger.warn("⚠️ Failed to get v0 status", {
          toolId: tool.id,
          v0ChatId: tool.v0ChatId,
          error: v0Error instanceof Error ? v0Error.message : "Unknown error",
        })
      }
    }

    // If we have chat session files, use those
    if (tool.chatSessions.length > 0 && tool.chatSessions[0].files.length > 0) {
      files = tool.chatSessions[0].files.map((file: any) => ({
        name: file.name,
        content: file.content,
        type: file.type,
        size: file.size,
      }))
      StatusAPILogger.info("📁 Using chat session files", {
        toolId: tool.id,
        filesCount: files.length,
      })
    }

    // Try to parse generated code if no other files found
    if (files.length === 0 && tool.generatedCode) {
      try {
        const parsedFiles = JSON.parse(tool.generatedCode)
        if (Array.isArray(parsedFiles)) {
          files = parsedFiles
          StatusAPILogger.info("📄 Using parsed generated code files", {
            toolId: tool.id,
            filesCount: files.length,
          })
        }
      } catch (parseError) {
        StatusAPILogger.warn("⚠️ Failed to parse generated code", {
          toolId: tool.id,
          error: parseError instanceof Error ? parseError.message : "Parse error",
        })
      }
    }

    const endTime = Date.now()
    const response = {
      toolId: tool.id,
      status,
      progress,
      step,
      message: getStatusMessage(step, progress),
      files,
      demoUrl,
      chatUrl,
      chatId: tool.v0ChatId,
      error: tool.generationError,
      createdAt: tool.createdAt,
      updatedAt: tool.updatedAt,
      generatedAt: tool.generatedAt,
    }

    StatusAPILogger.info("✅ Status check completed", {
      toolId: tool.id,
      status,
      progress,
      step,
      filesCount: files.length,
      hasDemoUrl: !!demoUrl,
      requestTime: `${endTime - startTime}ms`,
    })

    return NextResponse.json(response)
  } catch (error) {
    const endTime = Date.now()
    StatusAPILogger.error("💥 Status check error", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      slug: params.slug,
      toolId: params.id,
      requestTime: `${endTime - startTime}ms`,
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

function getStatusMessage(step: GenerationStatus, progress: number): string {
  switch (step) {
    case "analyzing":
      return "Analyzing your requirements and planning the application architecture..."
    case "designing":
      return "Designing the user interface and component structure..."
    case "generating":
      return "Generating React components and TypeScript code..."
    case "optimizing":
      return "Optimizing performance and adding final touches..."
    case "finalizing":
      return "Finalizing the application and preparing deployment..."
    case "completed":
      return "Your business tool is ready! Click to view the live preview."
    case "error":
      return "Generation encountered an error. Please try again."
    default:
      return `Processing... ${progress}% complete`
  }
}