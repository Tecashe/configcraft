
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { v0ToolGenerator } from "@/lib/v0-service"

// Enhanced logging utility for chat API
class ChatAPILogger {
  private static log(level: "info" | "warn" | "error", message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [CHAT_API] [${level.toUpperCase()}] ${message}`

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

export async function GET(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const startTime = Date.now()
  ChatAPILogger.info("📜 GET /api/organizations/[slug]/tools/[id]/chat", {
    slug: params.slug,
    toolId: params.id,
  })

  try {
    const { userId } = await auth()
    if (!userId) {
      ChatAPILogger.warn("❌ Unauthorized request - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      ChatAPILogger.warn("❌ Organization access denied", {
        slug: params.slug,
        userId,
      })
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Get tool from database
    const tool = await prisma.tool.findUnique({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      ChatAPILogger.warn("❌ Tool not found", {
        toolId: params.id,
        organizationId: organization.id,
      })
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    if (!tool.v0ChatId) {
      ChatAPILogger.warn("❌ No v0 chat ID found for tool", {
        toolId: tool.id,
      })
      return NextResponse.json({ error: "No chat session found for this tool" }, { status: 400 })
    }

    ChatAPILogger.info("📜 Fetching chat history", {
      toolId: tool.id,
      v0ChatId: tool.v0ChatId,
    })

    // Get chat history from v0
    const chatHistory = await v0ToolGenerator.getChatHistory(tool.v0ChatId)

    if (!chatHistory) {
      ChatAPILogger.warn("⚠️ Failed to retrieve chat history", {
        toolId: tool.id,
        v0ChatId: tool.v0ChatId,
      })
      return NextResponse.json({ error: "Failed to retrieve chat history" }, { status: 500 })
    }

    const endTime = Date.now()
    ChatAPILogger.info("✅ Chat history retrieved successfully", {
      toolId: tool.id,
      messagesCount: chatHistory.messages.length,
      requestTime: `${endTime - startTime}ms`,
    })

    return NextResponse.json({
      success: true,
      toolId: tool.id,
      chatHistory,
    })
  } catch (error) {
    const endTime = Date.now()
    ChatAPILogger.error("💥 Chat history retrieval error", {
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
      totalTime: `${endTime - startTime}ms`,
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

export async function POST(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  const startTime = Date.now()
  ChatAPILogger.info("💬 POST /api/organizations/[slug]/tools/[id]/chat", {
    slug: params.slug,
    toolId: params.id,
  })

  try {
    const { userId } = await auth()
    if (!userId) {
      ChatAPILogger.warn("❌ Unauthorized request - no userId")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    ChatAPILogger.info("👤 User authenticated", { userId })

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
      ChatAPILogger.warn("❌ Organization access denied", {
        slug: params.slug,
        userId,
      })
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    ChatAPILogger.info("🏢 Organization access verified", {
      organizationId: organization.id,
    })

    // Get tool from database
    const tool = await prisma.tool.findUnique({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      ChatAPILogger.warn("❌ Tool not found", {
        toolId: params.id,
        organizationId: organization.id,
      })
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    if (!tool.v0ChatId) {
      ChatAPILogger.warn("❌ No v0 chat ID found for tool", {
        toolId: tool.id,
      })
      return NextResponse.json({ error: "No chat session found for this tool" }, { status: 400 })
    }

    const { message } = await request.json()
    if (!message || typeof message !== "string") {
      ChatAPILogger.warn("❌ Invalid message in request", { message })
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    ChatAPILogger.info("📝 Chat continuation request", {
      toolId: tool.id,
      v0ChatId: tool.v0ChatId,
      messageLength: message.length,
    })

    // Continue the chat with v0
    const chatStartTime = Date.now()
    const result = await v0ToolGenerator.continueChat(tool.v0ChatId, message)
    const chatEndTime = Date.now()

    ChatAPILogger.info("🤖 v0 chat continuation completed", {
      toolId: tool.id,
      result: {
        status: result.status,
        filesCount: result.files.length,
        hasDemoUrl: !!result.demoUrl,
        error: result.error,
      },
      chatTime: `${chatEndTime - chatStartTime}ms`,
    })

    if (result.status === "error") {
      ChatAPILogger.error("❌ Chat continuation failed", {
        toolId: tool.id,
        error: result.error,
      })
      return NextResponse.json(
        {
          error: "Chat continuation failed",
          details: result.error,
        },
        { status: 500 },
      )
    }

    // Update tool with new results
    const updateStartTime = Date.now()
    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        previewUrl: result.demoUrl || tool.previewUrl,
        chatUrl: result.chatUrl || tool.chatUrl,
        generatedCode: JSON.stringify(result.files),
        updatedAt: new Date(),
      },
    })
    const updateEndTime = Date.now()

    // Create new chat session record
    try {
      const chatSession = await prisma.chatSession.create({
        data: {
          toolId: tool.id,
          v0ChatId: tool.v0ChatId,
          status: result.status === "completed" ? "completed" : "generating",
          demoUrl: result.demoUrl,
          userId,
          organizationId: organization.id,
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

      ChatAPILogger.info("💾 Chat session updated", {
        toolId: tool.id,
        chatSessionId: chatSession.id,
        filesCount: result.files.length,
      })
    } catch (sessionError) {
      ChatAPILogger.warn("⚠️ Failed to update chat session", {
        toolId: tool.id,
        error: sessionError instanceof Error ? sessionError.message : "Unknown error",
      })
    }

    const endTime = Date.now()
    const response = {
      success: true,
      toolId: tool.id,
      chatId: result.chatId,
      status: result.status,
      progress: result.progress,
      step: result.step,
      files: result.files.map((file) => ({
        name: file.name,
        content: file.content,
        type: file.type || "typescript",
        size: Buffer.byteLength(file.content, "utf8"),
      })),
      demoUrl: result.demoUrl,
      chatUrl: result.chatUrl,
      message: "Chat continued successfully",
    }

    ChatAPILogger.info("✅ Chat continuation completed successfully", {
      toolId: tool.id,
      filesGenerated: result.files.length,
      updateTime: `${updateEndTime - updateStartTime}ms`,
      totalTime: `${endTime - startTime}ms`,
    })

    return NextResponse.json(response)
  } catch (error) {
    const endTime = Date.now()
    ChatAPILogger.error("💥 Chat continuation error", {
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
      totalTime: `${endTime - startTime}ms`,
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
