import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { v0ToolGenerator } from "@/lib/v0-service"

export async function POST(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, id: toolId } = params
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get organization and tool
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const tool = await prisma.tool.findUnique({
      where: {
        id: toolId,
        organizationId: organization.id,
      },
      include: {
        chatSessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Get the latest chat session
    const chatSession = tool.chatSessions[0]
    if (!chatSession?.v0ChatId) {
      return NextResponse.json({ error: "No active chat session found" }, { status: 404 })
    }

    // Add user message to database
    await prisma.chatMessage.create({
      data: {
        chatSessionId: chatSession.id,
        role: "user",
        content: message,
        userId,
      },
    })

    // Update tool status to generating
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATING",
        generationStatus: "generating",
      },
    })

    // Continue chat with v0
    continueToolChatAsync(toolId, chatSession.v0ChatId, message)

    return NextResponse.json({
      success: true,
      message: "Chat message sent",
    })
  } catch (error) {
    console.error("Error sending chat message:", error)
    return NextResponse.json(
      {
        error: "Failed to send message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Async function to continue chat
async function continueToolChatAsync(toolId: string, v0ChatId: string, message: string) {
  try {
    console.log(`Continuing chat for tool ${toolId} with v0 chat ${v0ChatId}`)

    // Continue chat with v0
    const result = await v0ToolGenerator.continueChat(v0ChatId, message)

    if (result.status === "error") {
      throw new Error(result.error || "Chat continuation failed")
    }

    // Update tool with new results
    const mainComponent = result.files.find((f) => f.name.includes(".tsx") && !f.name.includes("test"))

    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATED",
        generationStatus: "completed",
        v0Code: mainComponent?.content || "",
        previewUrl: result.demoUrl,
        generatedCode: result.files.map((f) => `// ${f.name}\n${f.content}`).join("\n\n"),
        generatedAt: new Date(),
      },
    })

    // Add assistant response to database
    const chatSession = await prisma.chatSession.findFirst({
      where: { v0ChatId },
    })

    if (chatSession) {
      await prisma.chatMessage.create({
        data: {
          chatSessionId: chatSession.id,
          role: "assistant",
          content: "I've updated your tool based on your feedback. The changes should now be reflected in the preview.",
        },
      })
    }

    console.log(`Chat continuation completed for tool ${toolId}`)
  } catch (error) {
    console.error(`Chat continuation error for tool ${toolId}:`, error)

    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "ERROR",
        generationStatus: "error",
        generationError: error instanceof Error ? error.message : "Chat continuation failed",
      },
    })
  }
}
