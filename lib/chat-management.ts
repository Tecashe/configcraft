import { prisma } from "@/lib/prisma"
import { v0PlatformAPI, type V0Chat, type V0StreamChunk } from "@/lib/v0-platform-api"

export interface ChatSession {
  id: string
  toolId: string
  v0ChatId: string
  status: "generating" | "completed" | "error"
  messages: ChatMessage[]
  files: ChatFile[]
  demoUrl?: string
  error?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export interface ChatFile {
  id: string
  name: string
  content: string
  type: string
  size: number
}

// Production-ready Chat Management System
export class ChatManager {
  // Create a new chat session for tool generation
  async createChatSession(
    toolId: string,
    userId: string,
    organizationId: string,
    initialMessage: string,
  ): Promise<ChatSession> {
    try {
      // Create chat session in database
      const chatSession = await prisma.chatSession.create({
        data: {
          toolId,
          userId,
          organizationId,
          status: "generating",
          messages: {
            create: {
              role: "user",
              content: initialMessage,
              userId,
            },
          },
        },
        include: {
          messages: true,
          files: true,
        },
      })

      // Start v0 chat generation
      this.generateWithV0(chatSession.id, initialMessage)

      return this.mapToChatSession(chatSession)
    } catch (error) {
      console.error("Failed to create chat session:", error)
      throw new Error("Failed to create chat session")
    }
  }

  // Create streaming chat session with real-time updates
  async createStreamingChatSession(
    toolId: string,
    userId: string,
    organizationId: string,
    initialMessage: string,
    onUpdate: (session: ChatSession) => void,
  ): Promise<ChatSession> {
    try {
      // Create chat session in database
      const chatSession = await prisma.chatSession.create({
        data: {
          toolId,
          userId,
          organizationId,
          status: "generating",
          messages: {
            create: {
              role: "user",
              content: initialMessage,
              userId,
            },
          },
        },
        include: {
          messages: true,
          files: true,
        },
      })

      // Start streaming v0 chat generation
      this.generateStreamingWithV0(chatSession.id, initialMessage, onUpdate)

      return this.mapToChatSession(chatSession)
    } catch (error) {
      console.error("Failed to create streaming chat session:", error)
      throw new Error("Failed to create streaming chat session")
    }
  }

  // Continue an existing chat conversation
  async continueChat(chatSessionId: string, message: string, userId: string): Promise<ChatSession> {
    try {
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: { messages: true, files: true },
      })

      if (!chatSession) {
        throw new Error("Chat session not found")
      }

      // Add user message
      await prisma.chatMessage.create({
        data: {
          chatSessionId,
          role: "user",
          content: message,
          userId,
        },
      })

      // Update status to generating
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: { status: "generating" },
      })

      // Continue v0 chat if we have a v0ChatId
      if (chatSession.v0ChatId) {
        this.continueV0Chat(chatSessionId, chatSession.v0ChatId, message)
      } else {
        this.generateWithV0(chatSessionId, message)
      }

      const updatedSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: { messages: true, files: true },
      })

      return this.mapToChatSession(updatedSession!)
    } catch (error) {
      console.error("Failed to continue chat:", error)
      throw new Error("Failed to continue chat")
    }
  }

  // Get chat session by ID
  async getChatSession(chatSessionId: string): Promise<ChatSession | null> {
    try {
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          files: true,
        },
      })

      if (!chatSession) {
        return null
      }

      return this.mapToChatSession(chatSession)
    } catch (error) {
      console.error("Failed to get chat session:", error)
      return null
    }
  }

  // Get all chat sessions for a tool
  async getToolChatSessions(toolId: string): Promise<ChatSession[]> {
    try {
      const chatSessions = await prisma.chatSession.findMany({
        where: { toolId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          files: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return chatSessions.map(this.mapToChatSession)
    } catch (error) {
      console.error("Failed to get tool chat sessions:", error)
      return []
    }
  }

  // Poll chat status for real-time updates
  async pollChatStatus(chatSessionId: string): Promise<ChatSession | null> {
    try {
      const chatSession = await this.getChatSession(chatSessionId)

      if (!chatSession || !chatSession.v0ChatId) {
        return chatSession
      }

      // Check v0 chat status
      try {
        const v0Chat = await v0PlatformAPI.getChatStatus(chatSession.v0ChatId)

        // Update database if status changed
        if (v0Chat.status !== chatSession.status) {
          await this.updateChatFromV0(chatSessionId, v0Chat)
          return await this.getChatSession(chatSessionId)
        }
      } catch (error) {
        console.warn("Failed to poll v0 chat status:", error)
      }

      return chatSession
    } catch (error) {
      console.error("Failed to poll chat status:", error)
      return null
    }
  }

  // Private method to generate with v0
  private async generateWithV0(chatSessionId: string, message: string): Promise<void> {
    try {
      const v0Chat = await v0PlatformAPI.createChat(message, "v0-1.5-md")
      await this.updateChatFromV0(chatSessionId, v0Chat)
    } catch (error) {
      console.error("v0 generation failed:", error)
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          status: "error",
          error: error instanceof Error ? error.message : "Generation failed",
        },
      })
    }
  }

  // Private method to generate streaming with v0
  private async generateStreamingWithV0(
    chatSessionId: string,
    message: string,
    onUpdate: (session: ChatSession) => void,
  ): Promise<void> {
    try {
      const v0Chat = await v0PlatformAPI.createStreamingChat(
        message,
        async (chunk: V0StreamChunk) => {
          // Update chat session with streaming content
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            // You could update the database with partial content here
            // For now, we'll just trigger the callback
            const session = await this.getChatSession(chatSessionId)
            if (session) {
              onUpdate(session)
            }
          }
        },
        "v0-1.5-md",
      )

      await this.updateChatFromV0(chatSessionId, v0Chat)

      // Final update
      const finalSession = await this.getChatSession(chatSessionId)
      if (finalSession) {
        onUpdate(finalSession)
      }
    } catch (error) {
      console.error("v0 streaming generation failed:", error)
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          status: "error",
          error: error instanceof Error ? error.message : "Generation failed",
        },
      })
    }
  }

  // Private method to continue v0 chat
  private async continueV0Chat(chatSessionId: string, v0ChatId: string, message: string): Promise<void> {
    try {
      const v0Chat = await v0PlatformAPI.continueChat(v0ChatId, message)
      await this.updateChatFromV0(chatSessionId, v0Chat)
    } catch (error) {
      console.error("v0 chat continuation failed:", error)
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          status: "error",
          error: error instanceof Error ? error.message : "Chat continuation failed",
        },
      })
    }
  }

  // Private method to update chat session from v0 response
  private async updateChatFromV0(chatSessionId: string, v0Chat: V0Chat): Promise<void> {
    try {
      // Update chat session
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          v0ChatId: v0Chat.id,
          status: v0Chat.status,
          demoUrl: v0Chat.demo,
          error: v0Chat.error,
        },
      })

      // Add assistant message if we have content
      if (v0Chat.files.length > 0) {
        const assistantContent = `Generated ${v0Chat.files.length} files:\n${v0Chat.files.map((f) => `- ${f.name}`).join("\n")}`

        await prisma.chatMessage.create({
          data: {
            chatSessionId,
            role: "assistant",
            content: assistantContent,
          },
        })
      }

      // Save files
      for (const file of v0Chat.files) {
        await prisma.chatFile.upsert({
          where: {
            chatSessionId_name: {
              chatSessionId,
              name: file.name,
            },
          },
          update: {
            content: file.content,
            type: file.type,
            size: file.content.length,
          },
          create: {
            chatSessionId,
            name: file.name,
            content: file.content,
            type: file.type,
            size: file.content.length,
          },
        })
      }
    } catch (error) {
      console.error("Failed to update chat from v0:", error)
      throw error
    }
  }

  // Private method to map database model to interface
  private mapToChatSession(dbSession: any): ChatSession {
    return {
      id: dbSession.id,
      toolId: dbSession.toolId,
      v0ChatId: dbSession.v0ChatId,
      status: dbSession.status,
      messages: dbSession.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt,
      })),
      files: dbSession.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        content: file.content,
        type: file.type,
        size: file.size,
      })),
      demoUrl: dbSession.demoUrl,
      error: dbSession.error,
      createdAt: dbSession.createdAt,
      updatedAt: dbSession.updatedAt,
    }
  }
}

// Export singleton instance
export const chatManager = new ChatManager()
