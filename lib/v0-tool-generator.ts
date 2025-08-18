import { v0 } from "v0-sdk"

export interface ToolGenerationRequest {
  toolName: string
  requirements: string
  category: string
  userEmail: string
}

export interface ToolFile {
  name: string
  content: string
  type?: string
  path?: string
}

export interface ToolGenerationResult {
  chatId: string
  demoUrl?: string
  chatUrl?: string
  files: ToolFile[]
  status: "generating" | "completed" | "error"
  error?: string
  progress?: number
  step?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Enhanced logging utility
class V0Logger {
  private static log(level: "info" | "warn" | "error", message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [V0_SERVICE] [${level.toUpperCase()}] ${message}`

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

// Enhanced file mapping with comprehensive logging
function mapSdkFilesToToolFiles(sdkFiles: any[] | undefined): ToolFile[] {
  V0Logger.info("📁 Starting file mapping process", {
    filesReceived: sdkFiles?.length || 0,
    filesType: typeof sdkFiles,
  })

  if (!sdkFiles || !Array.isArray(sdkFiles)) {
    V0Logger.warn("⚠️ No files received or invalid format", {
      sdkFiles: sdkFiles,
      isArray: Array.isArray(sdkFiles),
    })
    return []
  }

  const mapped = sdkFiles.map((file: any, index: number) => {
    const mappedFile = {
      name: (file?.name as string) ?? (file?.meta?.name as string) ?? `file-${index + 1}.tsx`,
      content: (file?.content as string) ?? (file?.source as string) ?? "",
      type: (file?.type as string) ?? (file?.lang as string) ?? "typescript",
      path: (file?.path as string) ?? undefined,
    }

    V0Logger.info(`📄 Mapped file ${index + 1}`, {
      originalFile: {
        name: file?.name,
        metaName: file?.meta?.name,
        hasContent: !!file?.content,
        hasSource: !!file?.source,
        contentLength: (file?.content || file?.source || "").length,
      },
      mappedFile: {
        name: mappedFile.name,
        type: mappedFile.type,
        contentLength: mappedFile.content.length,
        hasPath: !!mappedFile.path,
      },
    })

    return mappedFile
  })

  V0Logger.info(`✅ File mapping completed`, {
    totalFiles: mapped.length,
    fileNames: mapped.map((f) => f.name),
    totalContentSize: mapped.reduce((sum, f) => sum + f.content.length, 0),
  })

  return mapped
}

export class V0ToolGenerator {
  private validateApiKey(): boolean {
    const apiKey = process.env.V0_API_KEY
    if (!apiKey) {
      V0Logger.error("❌ V0_API_KEY environment variable not found")
      return false
    }

    V0Logger.info("✅ V0 API key found", {
      keyLength: apiKey.length,
      keyPrefix: apiKey.substring(0, 8) + "...",
    })
    return true
  }

  async generateTool(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
    const startTime = Date.now()
    V0Logger.info("🚀 Starting tool generation with v0 SDK", {
      toolName: request.toolName,
      category: request.category,
      requirementsLength: request.requirements.length,
      userEmail: request.userEmail,
      timestamp: new Date().toISOString(),
    })

    // Validate API key first
    if (!this.validateApiKey()) {
      return {
        chatId: "",
        files: [],
        status: "error",
        error: "V0 API key not configured. Please set V0_API_KEY environment variable.",
        progress: 0,
        step: "error",
      }
    }

    try {
      // Step 1: Build the prompt
      V0Logger.info("📝 Building comprehensive tool prompt")
      const prompt = this.buildToolPrompt(request.toolName, request.requirements, request.category)
      V0Logger.info("✅ Prompt built successfully", {
        promptLength: prompt.length,
        promptPreview: prompt.substring(0, 200) + "...",
      })

      // Step 2: Create chat with v0 SDK
      V0Logger.info("🤖 Creating chat with v0 SDK", {
        modelId: "v0-1.5-md",
        chatPrivacy: "private",
        imageGenerations: false,
      })

      const chatStartTime = Date.now()
      const chat: any = await v0.chats.create({
        message: prompt,
        system:
          "You are an expert React and TypeScript developer who creates professional business applications with modern UI/UX patterns. Always generate complete, production-ready code with proper error handling, TypeScript types, and responsive design.",
        chatPrivacy: "private",
        modelConfiguration: {
          modelId: "v0-1.5-md",
          imageGenerations: false,
          thinking: false,
        },
      })

      const chatEndTime = Date.now()
      V0Logger.info(`✅ Chat created successfully`, {
        chatId: chat.id,
        chatUrl: chat.url,
        demoUrl: chat.demo,
        status: chat.status,
        createdAt: chat.createdAt,
        filesCount: chat.files?.length || 0,
        creationTime: `${chatEndTime - chatStartTime}ms`,
      })

      // Step 3: Process and validate response
      V0Logger.info("🔍 Processing chat response", {
        chatId: chat.id,
        hasFiles: !!chat.files,
        filesArray: Array.isArray(chat.files),
        rawFilesCount: chat.files?.length || 0,
      })

      // Map files with enhanced logging
      const files = mapSdkFilesToToolFiles(chat.files)

      // Step 4: Determine status and validate results
      let status: "generating" | "completed" | "error" = "completed"
      let progress = 100
      let step = "completed"

      if (!chat.id) {
        V0Logger.error("❌ No chat ID returned from v0", { chatResponse: chat })
        status = "error"
        progress = 0
        step = "error"
      } else if (files.length === 0) {
        V0Logger.warn("⚠️ No files generated, but chat exists", {
          chatId: chat.id,
          chatStatus: chat.status,
          demoUrl: chat.demo,
        })
        status = "generating"
        progress = 50
        step = "generating"
      } else {
        V0Logger.info("🎉 Tool generation completed successfully", {
          chatId: chat.id,
          filesGenerated: files.length,
          hasDemoUrl: !!chat.demo,
          totalContentSize: files.reduce((sum, f) => sum + f.content.length, 0),
        })
      }

      const totalTime = Date.now() - startTime
      const result: ToolGenerationResult = {
        chatId: chat.id,
        demoUrl: chat.demo as string | undefined,
        chatUrl: chat.url as string | undefined,
        files,
        status,
        progress,
        step,
      }

      V0Logger.info("📊 Tool generation summary", {
        ...result,
        totalGenerationTime: `${totalTime}ms`,
        averageFileSize:
          files.length > 0 ? Math.round(files.reduce((sum, f) => sum + f.content.length, 0) / files.length) : 0,
      })

      return result
    } catch (error) {
      const totalTime = Date.now() - startTime
      V0Logger.error("💥 v0 generation error", {
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
                cause: error.cause,
              }
            : error,
        totalTime: `${totalTime}ms`,
        request: {
          toolName: request.toolName,
          category: request.category,
          requirementsLength: request.requirements.length,
        },
      })

      // Enhanced error handling with specific error types
      let errorMessage = "Unknown error occurred during tool generation"
      if (error instanceof Error) {
        errorMessage = error.message

        // Check for specific v0 API errors
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "Invalid V0 API key. Please check your V0_API_KEY environment variable."
        } else if (error.message.includes("429") || error.message.includes("rate limit")) {
          errorMessage = "Rate limit exceeded. Please try again in a few minutes."
        } else if (error.message.includes("400") || error.message.includes("Bad Request")) {
          errorMessage = "Invalid request parameters. Please check your tool requirements."
        } else if (error.message.includes("500") || error.message.includes("Internal Server Error")) {
          errorMessage = "v0 service is temporarily unavailable. Please try again later."
        }
      }

      return {
        chatId: "",
        files: [],
        status: "error",
        error: errorMessage,
        progress: 0,
        step: "error",
      }
    }
  }

  private buildToolPrompt(toolName: string, requirements: string, category: string): string {
    V0Logger.info("🏗️ Building comprehensive prompt", {
      toolName,
      category,
      requirementsLength: requirements.length,
    })

    const prompt = `Create a professional business application: ${toolName}

Category: ${category}

Business Requirements:
${requirements}

Technical Specifications:
- Build with React and TypeScript for type safety
- Use Tailwind CSS for modern, responsive design
- Include comprehensive form validation and error handling
- Add loading states and user feedback for all async operations
- Implement full CRUD operations (Create, Read, Update, Delete)
- Include search, filter, and sort functionality where appropriate
- Add data export capabilities (CSV/Excel) if relevant
- Ensure mobile-first responsive design
- Include proper accessibility features (ARIA labels, keyboard navigation)
- Use modern UI patterns (cards, tables, modals, dropdowns, tabs)
- Add realistic sample data for demonstration purposes
- Include user roles and permissions if applicable
- Add email notification triggers where relevant
- Implement comprehensive data validation (client and server-side patterns)
- Include analytics/reporting dashboard if needed
- Add proper error boundaries and fallback UI
- Use React hooks and modern patterns
- Include proper TypeScript interfaces and types

Design Guidelines:
- Clean, professional interface suitable for business use
- Consistent color scheme and typography
- Intuitive navigation and user experience
- Loading skeletons for async operations
- Success/error toast notifications
- Proper spacing and visual hierarchy using Tailwind
- Modern buttons, inputs, and interactive elements
- Dark mode support with proper contrast ratios
- Professional color palette (avoid bright/neon colors)

Code Requirements:
- Generate multiple files for proper component structure
- Include comprehensive TypeScript interfaces and types
- Add proper error boundaries and error handling
- Include proper state management (useState, useEffect, custom hooks)
- Add utility functions and helpers as needed
- Generate a complete, working application with multiple pages/views
- Include proper routing if multi-page application
- Add proper data persistence patterns (localStorage, API calls)
- Include comprehensive comments and documentation

The application should be production-ready and immediately usable by business teams. Generate ALL necessary files including components, types, utilities, hooks, and the main application file. Make it a complete, functional business tool that demonstrates best practices in React development.`

    V0Logger.info("✅ Prompt construction completed", {
      finalPromptLength: prompt.length,
      sections: [
        "Category",
        "Business Requirements",
        "Technical Specifications",
        "Design Guidelines",
        "Code Requirements",
      ],
    })

    return prompt.trim()
  }

  async regenerateTool(chatId: string, feedback: string): Promise<ToolGenerationResult> {
    V0Logger.info("🔄 Starting tool regeneration", {
      chatId,
      feedbackLength: feedback.length,
      timestamp: new Date().toISOString(),
    })

    if (!this.validateApiKey()) {
      return {
        chatId,
        files: [],
        status: "error",
        error: "V0 API key not configured",
        progress: 0,
        step: "error",
      }
    }

    try {
      V0Logger.info("📤 Sending regeneration message to v0", { chatId, feedback })

      const messageStartTime = Date.now()
      await v0.chats.sendMessage({
        chatId,
        message: `Please improve the tool based on this feedback: ${feedback}

Make sure to maintain all the original requirements while incorporating these improvements. Keep the code production-ready with proper TypeScript types, error handling, and responsive design.`,
      })

      const messageEndTime = Date.now()
      V0Logger.info("✅ Message sent successfully", {
        chatId,
        messageTime: `${messageEndTime - messageStartTime}ms`,
      })

      V0Logger.info("📥 Fetching updated chat from v0", { chatId })

      const fetchStartTime = Date.now()
      const updatedChat: any = await v0.chats.getById({ chatId })
      const fetchEndTime = Date.now()

      V0Logger.info("✅ Updated chat retrieved", {
        chatId: updatedChat.id,
        status: updatedChat.status,
        filesCount: updatedChat.files?.length || 0,
        fetchTime: `${fetchEndTime - fetchStartTime}ms`,
      })

      const files = mapSdkFilesToToolFiles(updatedChat.files)

      const result: ToolGenerationResult = {
        chatId: updatedChat.id,
        demoUrl: updatedChat.demo as string | undefined,
        chatUrl: updatedChat.url as string | undefined,
        files,
        status: "completed",
        progress: 100,
        step: "completed",
      }

      V0Logger.info("🎉 Tool regeneration completed", result)
      return result
    } catch (error) {
      V0Logger.error("💥 Regeneration error", {
        chatId,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      })

      return {
        chatId,
        files: [],
        status: "error",
        error: error instanceof Error ? error.message : "Regeneration failed",
        progress: 0,
        step: "error",
      }
    }
  }

  async getChatHistory(chatId: string) {
    V0Logger.info("📜 Fetching chat history", { chatId })

    if (!this.validateApiKey()) {
      V0Logger.error("❌ Cannot fetch chat history - API key not configured")
      return null
    }

    try {
      const chatStartTime = Date.now()
      const chat: any = await v0.chats.getById({ chatId })
      const chatEndTime = Date.now()

      V0Logger.info("📥 Chat data retrieved", {
        chatId: chat.id,
        status: chat.status,
        fetchTime: `${chatEndTime - chatStartTime}ms`,
      })

      const messagesStartTime = Date.now()
      const messagesResponse = await v0.chats.findMessages({ chatId })
      const messagesEndTime = Date.now()

      const messages = messagesResponse.data ?? []

      V0Logger.info("📜 Chat history retrieved successfully", {
        chatId: chat.id,
        messagesCount: messages.length,
        status: chat.status,
        messagesFetchTime: `${messagesEndTime - messagesStartTime}ms`,
      })

      return {
        id: chat.id,
        messages: messages.map((msg: any, index: number) => ({
          id: `${chat.id}-${index}`,
          role: (msg.role as "user" | "assistant") ?? "assistant",
          content: (msg.content as string) ?? "",
          timestamp: new Date((msg.createdAt as string) ?? Date.now()),
        })),
        status: (chat.latestVersion?.status as string) ?? (chat.status as string) ?? "unknown",
        created: (chat.createdAt as string) ?? new Date().toISOString(),
        updated: (chat.updatedAt as string) ?? new Date().toISOString(),
        demoUrl: chat.demo as string | undefined,
        chatUrl: chat.url as string | undefined,
      }
    } catch (error) {
      V0Logger.error("💥 Chat history retrieval error", {
        chatId,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      })
      return null
    }
  }

  async continueChat(chatId: string, message: string): Promise<ToolGenerationResult> {
    V0Logger.info("💬 Continuing chat conversation", {
      chatId,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    })

    if (!this.validateApiKey()) {
      return {
        chatId,
        files: [],
        status: "error",
        error: "V0 API key not configured",
        progress: 0,
        step: "error",
      }
    }

    try {
      const sendStartTime = Date.now()
      await v0.chats.sendMessage({ chatId, message })
      const sendEndTime = Date.now()

      V0Logger.info("✅ Message sent to chat", {
        chatId,
        sendTime: `${sendEndTime - sendStartTime}ms`,
      })

      const fetchStartTime = Date.now()
      const updatedChat: any = await v0.chats.getById({ chatId })
      const fetchEndTime = Date.now()

      V0Logger.info("📥 Updated chat retrieved", {
        chatId: updatedChat.id,
        filesCount: updatedChat.files?.length || 0,
        fetchTime: `${fetchEndTime - fetchStartTime}ms`,
      })

      const files = mapSdkFilesToToolFiles(updatedChat.files)

      const result: ToolGenerationResult = {
        chatId: updatedChat.id,
        demoUrl: updatedChat.demo as string | undefined,
        chatUrl: updatedChat.url as string | undefined,
        files,
        status: "completed",
        progress: 100,
        step: "completed",
      }

      V0Logger.info("🎉 Chat continuation completed", result)
      return result
    } catch (error) {
      V0Logger.error("💥 Chat continuation error", {
        chatId,
        message,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      })

      return {
        chatId,
        files: [],
        status: "error",
        error: error instanceof Error ? error.message : "Chat continuation failed",
        progress: 0,
        step: "error",
      }
    }
  }

  async listChats(limit = 20, offset = 0) {
    V0Logger.info("📋 Listing chats", { limit, offset })

    if (!this.validateApiKey()) {
      V0Logger.error("❌ Cannot list chats - API key not configured")
      return { chats: [], total: 0 }
    }

    try {
      const startTime = Date.now()
      const chatsResponse = await v0.chats.find({
        limit: String(limit),
        offset: String(offset),
      })
      const endTime = Date.now()

      const chats = chatsResponse.data ?? []

      V0Logger.info("📋 Chats retrieved successfully", {
        chatsCount: chats.length,
        limit,
        offset,
        fetchTime: `${endTime - startTime}ms`,
      })

      return {
        chats: chats.map((chat: any) => ({
          id: chat.id,
          title: chat.name ?? chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          url: chat.url as string,
          demo: chat.demo as string | undefined,
        })),
        total: chats.length,
      }
    } catch (error) {
      V0Logger.error("💥 Error listing chats", {
        limit,
        offset,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      })
      return { chats: [], total: 0 }
    }
  }

  async getGenerationStatus(chatId: string): Promise<ToolGenerationResult> {
    V0Logger.info("🔍 Checking generation status", { chatId })

    if (!this.validateApiKey()) {
      return {
        chatId,
        files: [],
        status: "error",
        error: "V0 API key not configured",
        progress: 0,
        step: "error",
      }
    }

    try {
      const startTime = Date.now()
      const chat: any = await v0.chats.getById({ chatId })
      const endTime = Date.now()

      V0Logger.info("📊 Chat status retrieved", {
        chatId: chat.id,
        status: chat.status,
        filesCount: chat.files?.length || 0,
        fetchTime: `${endTime - startTime}ms`,
      })

      const files = mapSdkFilesToToolFiles(chat.files)

      // Determine status based on chat state with enhanced logic
      let status: "generating" | "completed" | "error" = "generating"
      let progress = 25
      let step = "analyzing"

      if (chat.status === "completed" || (files.length > 0 && chat.demo)) {
        status = "completed"
        progress = 100
        step = "completed"
        V0Logger.info("✅ Generation completed", { chatId, filesCount: files.length })
      } else if (chat.status === "error") {
        status = "error"
        progress = 0
        step = "error"
        V0Logger.warn("❌ Generation failed", { chatId, chatStatus: chat.status })
      } else if (files.length > 0) {
        progress = 75
        step = "finalizing"
        V0Logger.info("🔧 Generation finalizing", { chatId, filesCount: files.length })
      } else if (chat.status === "generating") {
        progress = 50
        step = "generating"
        V0Logger.info("⚡ Generation in progress", { chatId })
      }

      const result: ToolGenerationResult = {
        chatId: chat.id,
        demoUrl: chat.demo as string | undefined,
        chatUrl: chat.url as string | undefined,
        files,
        status,
        progress,
        step,
      }

      V0Logger.info("🔍 Status check completed", result)
      return result
    } catch (error) {
      V0Logger.error("💥 Status check error", {
        chatId,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      })

      return {
        chatId,
        files: [],
        status: "error",
        error: error instanceof Error ? error.message : "Status check failed",
        progress: 0,
        step: "error",
      }
    }
  }
}

// Export singleton instance with enhanced logging
V0Logger.info("🚀 V0ToolGenerator service initialized", {
  hasApiKey: !!process.env.V0_API_KEY,
  timestamp: new Date().toISOString(),
})

export const v0ToolGenerator = new V0ToolGenerator()
