// import { v0 } from "v0-sdk"

// const v00 = new v0({
//   apiKey: process.env.V0_API_KEY!,
// })

// export interface ToolGenerationRequest {
//   toolName: string
//   requirements: string
//   category: string
//   userEmail: string
// }

// export interface ToolGenerationResult {
//   chatId: string
//   demoUrl?: string
//   files: Array<{
//     name: string
//     content: string
//     type: string
//   }>
//   status: "generating" | "completed" | "error"
//   error?: string
// }

// export interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// export class V0ToolGenerator {
//   async generateTool(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
//     try {
//       console.log(`Starting v0 generation for tool: ${request.toolName}`)

//       // Create detailed prompt for v0
//       const prompt = this.buildToolPrompt(request.toolName, request.requirements, request.category)

//       // Create chat with v0
//       const chat = await v0.chats.create({
//         message: prompt,
//       })

//       console.log(`v0 chat created with ID: ${chat.id}`)

//       // Wait for generation completion
//       const completedChat = await this.waitForCompletion(chat.id)

//       return {
//         chatId: chat.id,
//         demoUrl: completedChat.demo,
//         files: completedChat.files || [],
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("v0 generation error:", error)
//       return {
//         chatId: "",
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   private buildToolPrompt(toolName: string, requirements: string, category: string): string {
//     return `
// Create a professional business application: ${toolName}

// Category: ${category}

// Business Requirements:
// ${requirements}

// Technical Specifications:
// - Build with React and TypeScript
// - Use Tailwind CSS for modern, responsive design
// - Include proper form validation and error handling
// - Add loading states and user feedback
// - Implement CRUD operations (Create, Read, Update, Delete)
// - Include search, filter, and sort functionality where appropriate
// - Add data export capabilities (CSV/Excel)
// - Ensure mobile responsiveness
// - Include proper accessibility features
// - Use modern UI patterns (cards, tables, modals, dropdowns)
// - Add sample data for demonstration
// - Include user roles and permissions if applicable
// - Add email notification triggers where relevant
// - Implement proper data validation
// - Include analytics/reporting dashboard if needed

// Design Guidelines:
// - Clean, professional interface suitable for business use
// - Consistent color scheme and typography
// - Intuitive navigation and user experience
// - Loading skeletons for async operations
// - Success/error toast notifications
// - Proper spacing and visual hierarchy
// - Modern buttons, inputs, and interactive elements
// - Dark mode support with proper contrast

// The application should be production-ready and immediately usable by business teams.
//     `
//   }

//   private async waitForCompletion(chatId: string, maxAttempts = 30): Promise<any> {
//     console.log(`Waiting for completion of chat ${chatId}`)

//     for (let i = 0; i < maxAttempts; i++) {
//       try {
//         const chat = await v00.chats.retrieve(chatId)

//         console.log(`Chat ${chatId} status: ${chat.status} (attempt ${i + 1}/${maxAttempts})`)

//         if (chat.status === "completed") {
//           console.log(`Chat ${chatId} completed successfully`)
//           return chat
//         }

//         if (chat.status === "error") {
//           throw new Error("Chat generation failed")
//         }

//         // Wait 3 seconds before next check
//         await new Promise((resolve) => setTimeout(resolve, 3000))
//       } catch (error) {
//         console.error(`Error checking chat status (attempt ${i + 1}):`, error)
//         if (i === maxAttempts - 1) {
//           throw error
//         }
//         await new Promise((resolve) => setTimeout(resolve, 3000))
//       }
//     }

//     throw new Error("Generation timeout")
//   }

//   async regenerateTool(chatId: string, feedback: string): Promise<ToolGenerationResult> {
//     try {
//       console.log(`Regenerating tool for chat ${chatId} with feedback`)

//       const updatedChat = await v00.chats.update(chatId, {
//         message: `Please improve the tool based on this feedback: ${feedback}`,
//       })

//       const completedChat = await this.waitForCompletion(updatedChat.id)

//       return {
//         chatId: completedChat.id,
//         demoUrl: completedChat.demo,
//         files: completedChat.files || [],
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("v0 regeneration error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Regeneration failed",
//       }
//     }
//   }

//   async getChatHistory(chatId: string): Promise<{
//     id: string
//     messages: ChatMessage[]
//     status: string
//     created: string
//     updated: string
//   } | null> {
//     try {
//       const chat = await v00.chats.retrieve(chatId)

//       return {
//         id: chat.id,
//         messages: (chat.messages || []).map((msg: any, index: number) => ({
//           id: `${chat.id}-${index}`,
//           role: msg.role || "assistant",
//           content: msg.content || "",
//           timestamp: new Date(msg.created_at || Date.now()),
//         })),
//         status: chat.status || "unknown",
//         created: chat.created_at || new Date().toISOString(),
//         updated: chat.updated_at || new Date().toISOString(),
//       }
//     } catch (error) {
//       console.error("Chat retrieval error:", error)
//       return null
//     }
//   }

//   async continueChat(chatId: string, message: string): Promise<ToolGenerationResult> {
//     try {
//       console.log(`Continuing chat ${chatId} with message: ${message.substring(0, 100)}...`)

//       const updatedChat = await v00.chats.update(chatId, {
//         message,
//       })

//       const completedChat = await this.waitForCompletion(updatedChat.id)

//       return {
//         chatId: completedChat.id,
//         demoUrl: completedChat.demo,
//         files: completedChat.files || [],
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("Chat continuation error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Chat continuation failed",
//       }
//     }
//   }
// }

// // Export singleton instance
// export const v0ToolGenerator = new V0ToolGenerator()


// lib/v0-service.ts (or wherever you keep it)


// import { v0 } from "v0-sdk"

// export interface ToolGenerationRequest {
//   toolName: string
//   requirements: string
//   category: string
//   userEmail: string
// }

// export interface ToolFile {
//   name: string
//   content: string
//   type?: string
// }

// export interface ToolGenerationResult {
//   chatId: string
//   demoUrl?: string
//   chatUrl?: string
//   files: ToolFile[]            // REQUIRED (not optional) to kill ts(18048)
//   status: "generating" | "completed" | "error"
//   error?: string
// }

// export interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// function mapSdkFilesToToolFiles(sdkFiles: any[] | undefined): ToolFile[] {
//   // SDK often returns { lang, meta, source }. Normalize -> { name, content, type }
//   if (!sdkFiles || !Array.isArray(sdkFiles)) return []
//   return sdkFiles.map((f: any, i: number) => ({
//     name: (f?.meta?.name as string) ?? `file-${i + 1}`,
//     content: (f?.source as string) ?? "",
//     type: (f?.lang as string) ?? undefined,
//   }))
// }

// export class V0ToolGenerator {
//   async generateTool(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
//     try {
//       const prompt = this.buildToolPrompt(request.toolName, request.requirements, request.category)

//       const chat: any = await v0.chats.create({
//         message: prompt,
//         system:
//           "You are an expert React and TypeScript developer who creates professional business applications with modern UI/UX patterns.",
//         modelConfiguration: {
//           modelId: "v0-1.5-md",
//           imageGenerations: false,
//           thinking: false,
//         },
//         // Optionally scope to a project:
//         // projectId: "proj_xxx",
//       })

//       return {
//         chatId: chat.id,
//         demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
//         chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(chat.files),
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("v0 generation error:", error)
//       return {
//         chatId: "",
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   private buildToolPrompt(toolName: string, requirements: string, category: string): string {
//     return `Create a professional business application: ${toolName}

// Category: ${category}

// Business Requirements:
// ${requirements}

// Technical Specifications:
// - Build with React and TypeScript
// - Use Tailwind CSS for modern, responsive design
// - Include proper form validation and error handling
// - Add loading states and user feedback
// - Implement CRUD operations (Create, Read, Update, Delete)
// - Include search, filter, and sort functionality where appropriate
// - Add data export capabilities (CSV/Excel)
// - Ensure mobile responsiveness
// - Include proper accessibility features
// - Use modern UI patterns (cards, tables, modals, dropdowns)
// - Add sample data for demonstration
// - Include user roles and permissions if applicable
// - Add email notification triggers where relevant
// - Implement proper data validation
// - Include analytics/reporting dashboard if needed

// Design Guidelines:
// - Clean, professional interface suitable for business use
// - Consistent color scheme and typography
// - Intuitive navigation and user experience
// - Loading skeletons for async operations
// - Success/error toast notifications
// - Proper spacing and visual hierarchy
// - Modern buttons, inputs, and interactive elements
// - Dark mode support with proper contrast

// The application should be production-ready and immediately usable by business teams.`
//   }

//   async regenerateTool(chatId: string, feedback: string): Promise<ToolGenerationResult> {
//     try {
//       await v0.chats.sendMessage({
//         chatId,
//         message: `Please improve the tool based on this feedback: ${feedback}`,
//       })

//       const updatedChat: any = await v0.chats.getById({ chatId })

//       return {
//         chatId: updatedChat.id,
//         demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
//         chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(updatedChat.files),
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("v0 regeneration error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Regeneration failed",
//       }
//     }
//   }

//   async getChatHistory(chatId: string): Promise<{
//     id: string
//     messages: ChatMessage[]
//     status: string
//     created: string
//     updated: string
//     demoUrl?: string
//     chatUrl?: string
//   } | null> {
//     try {
//       const chat: any = await v0.chats.getById({ chatId })
//       const messages: any[] = await v0.chats.findMessages({ chatId }) // array per docs

//       return {
//         id: chat.id,
//         messages: (messages ?? []).map((msg: any, index: number) => ({
//           id: `${chat.id}-${index}`,
//           role: (msg.role as "user" | "assistant") ?? "assistant",
//           content: (msg.content as string) ?? "",
//           timestamp: new Date((msg.createdAt as string) ?? Date.now()),
//         })),
//         status:
//           (chat.latestVersion?.status as string) ??
//           (chat.status as string) ??
//           "unknown",
//         created: (chat.createdAt as string) ?? new Date().toISOString(),
//         updated: (chat.updatedAt as string) ?? new Date().toISOString(),
//         demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
//         chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
//       }
//     } catch (error) {
//       console.error("Chat retrieval error:", error)
//       return null
//     }
//   }

//   async continueChat(chatId: string, message: string): Promise<ToolGenerationResult> {
//     try {
//       await v0.chats.sendMessage({ chatId, message })

//       const updatedChat: any = await v0.chats.getById({ chatId })

//       return {
//         chatId: updatedChat.id,
//         demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
//         chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(updatedChat.files),
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("Chat continuation error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Chat continuation failed",
//       }
//     }
//   }

//   async listChats(limit: number = 20, offset: number = 0): Promise<{
//     chats: Array<{
//       id: string
//       title?: string
//       createdAt: string
//       updatedAt: string
//       url: string
//       demo?: string
//     }>
//     total: number
//   }> {
//     try {
//       // SDK returns array, not { items, total }
//       const chats: any[] = await v0.chats.find({
//         limit: String(limit),
//         offset: String(offset),
//       })

//       return {
//         chats: (chats ?? []).map((chat: any) => ({
//           id: chat.id,
//           title: chat.name ?? chat.title,
//           createdAt: chat.createdAt,
//           updatedAt: chat.updatedAt,
//           url: (chat.webUrl ?? chat.url) as string,
//           demo: (chat.demoUrl ?? chat.demo) as string | undefined,
//         })),
//         total: (chats ?? []).length,
//       }
//     } catch (error) {
//       console.error("Error listing chats:", error)
//       return { chats: [], total: 0 }
//     }
//   }

//   async deleteChat(chatId: string): Promise<boolean> {
//     try {
//       await v0.chats.delete({ chatId })
//       return true
//     } catch (error) {
//       console.error("Error deleting chat:", error)
//       return false
//     }
//   }

//   async favoriteChat(chatId: string): Promise<boolean> {
//     try {
//       await v0.chats.favorite({ chatId, isFavorite: true })
//       return true
//     } catch (error) {
//       console.error("Error favoriting chat:", error)
//       return false
//     }
//   }

//   async unfavoriteChat(chatId: string): Promise<boolean> {
//     try {
//       // No separate unfavorite; pass isFavorite: false
//       await v0.chats.favorite({ chatId, isFavorite: false })
//       return true
//     } catch (error) {
//       console.error("Error un-favoriting chat:", error)
//       return false
//     }
//   }

//   async getProject(chatId: string): Promise<any | null> {
//     try {
//       const project = await v0.projects.getByChatId({ chatId })
//       return project
//     } catch (error) {
//       console.error("Error getting chat project:", error)
//       return null
//     }
//   }

//   async createProject(name: string, description?: string): Promise<any | null> {
//     try {
//       const project = await v0.projects.create({
//         name,
//         description: description || `Project for ${name}`,
//       })
//       return project
//     } catch (error) {
//       console.error("Error creating project:", error)
//       return null
//     }
//   }

//   async listProjects(): Promise<any[]> {
//     try {
//       // SDK returns array (no items/total)
//       const projects: any[] = await v0.projects.find()
//       return projects ?? []
//     } catch (error) {
//       console.error("Error listing projects:", error)
//       return []
//     }
//   }
// }

// // Export singleton instance
// export const v0ToolGenerator = new V0ToolGenerator()





// import { v0 } from "v0-sdk"

// export interface ToolGenerationRequest {
//   toolName: string
//   requirements: string
//   category: string
//   userEmail: string
// }

// export interface ToolFile {
//   name: string
//   content: string
//   type?: string
// }

// export interface ToolGenerationResult {
//   chatId: string
//   demoUrl?: string
//   chatUrl?: string
//   files: ToolFile[]
//   status: "generating" | "completed" | "error"
//   error?: string
// }

// export interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// function mapSdkFilesToToolFiles(sdkFiles: any[] | undefined): ToolFile[] {
//   if (!sdkFiles || !Array.isArray(sdkFiles)) return []
//   return sdkFiles.map((f: any, i: number) => ({
//     name: (f?.meta?.name as string) ?? `file-${i + 1}`,
//     content: (f?.source as string) ?? "",
//     type: (f?.lang as string) ?? undefined,
//   }))
// }

// export class V0ToolGenerator {
//   async generateTool(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
//     try {
//       const prompt = this.buildToolPrompt(request.toolName, request.requirements, request.category)

//       const chat: any = await v0.chats.create({
//         message: prompt,
//         system:
//           "You are an expert React and TypeScript developer who creates professional business applications with modern UI/UX patterns.",
//         modelConfiguration: {
//           modelId: "v0-1.5-md",
//           imageGenerations: false,
//           thinking: false,
//         },
//       })

//       return {
//         chatId: chat.id,
//         demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
//         chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(chat.files),
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("v0 generation error:", error)
//       return {
//         chatId: "",
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }
//     }
//   }

//   private buildToolPrompt(toolName: string, requirements: string, category: string): string {
//     return `Create a professional business application: ${toolName}

// Category: ${category}

// Business Requirements:
// ${requirements}

// Technical Specifications:
// - Build with React and TypeScript
// - Use Tailwind CSS for modern, responsive design
// - Include proper form validation and error handling
// - Add loading states and user feedback
// - Implement CRUD operations (Create, Read, Update, Delete)
// - Include search, filter, and sort functionality where appropriate
// - Add data export capabilities (CSV/Excel)
// - Ensure mobile responsiveness
// - Include proper accessibility features
// - Use modern UI patterns (cards, tables, modals, dropdowns)
// - Add sample data for demonstration
// - Include user roles and permissions if applicable
// - Add email notification triggers where relevant
// - Implement proper data validation
// - Include analytics/reporting dashboard if needed

// Design Guidelines:
// - Clean, professional interface suitable for business use
// - Consistent color scheme and typography
// - Intuitive navigation and user experience
// - Loading skeletons for async operations
// - Success/error toast notifications
// - Proper spacing and visual hierarchy
// - Modern buttons, inputs, and interactive elements
// - Dark mode support with proper contrast

// The application should be production-ready and immediately usable by business teams.`
//   }

//   async regenerateTool(chatId: string, feedback: string): Promise<ToolGenerationResult> {
//     try {
//       await v0.chats.sendMessage({
//         chatId,
//         message: `Please improve the tool based on this feedback: ${feedback}`,
//       })

//       const updatedChat: any = await v0.chats.getById({ chatId })

//       return {
//         chatId: updatedChat.id,
//         demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
//         chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(updatedChat.files),
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("v0 regeneration error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Regeneration failed",
//       }
//     }
//   }

//   async getChatHistory(chatId: string) {
//     try {
//       const chat: any = await v0.chats.getById({ chatId })
//       const messagesResponse = await v0.chats.findMessages({ chatId })
//       const messages = messagesResponse.data ?? []

//       return {
//         id: chat.id,
//         messages: messages.map((msg: any, index: number) => ({
//           id: `${chat.id}-${index}`,
//           role: (msg.role as "user" | "assistant") ?? "assistant",
//           content: (msg.content as string) ?? "",
//           timestamp: new Date((msg.createdAt as string) ?? Date.now()),
//         })),
//         status:
//           (chat.latestVersion?.status as string) ??
//           (chat.status as string) ??
//           "unknown",
//         created: (chat.createdAt as string) ?? new Date().toISOString(),
//         updated: (chat.updatedAt as string) ?? new Date().toISOString(),
//         demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
//         chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
//       }
//     } catch (error) {
//       console.error("Chat retrieval error:", error)
//       return null
//     }
//   }

//   async continueChat(chatId: string, message: string): Promise<ToolGenerationResult> {
//     try {
//       await v0.chats.sendMessage({ chatId, message })

//       const updatedChat: any = await v0.chats.getById({ chatId })

//       return {
//         chatId: updatedChat.id,
//         demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
//         chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(updatedChat.files),
//         status: "completed",
//       }
//     } catch (error) {
//       console.error("Chat continuation error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Chat continuation failed",
//       }
//     }
//   }

//   async listChats(limit: number = 20, offset: number = 0) {
//     try {
//       const chatsResponse = await v0.chats.find({
//         limit: String(limit),
//         offset: String(offset),
//       })
//       const chats = chatsResponse.data ?? []

//       return {
//         chats: chats.map((chat: any) => ({
//           id: chat.id,
//           title: chat.name ?? chat.title,
//           createdAt: chat.createdAt,
//           updatedAt: chat.updatedAt,
//           url: (chat.webUrl ?? chat.url) as string,
//           demo: (chat.demoUrl ?? chat.demo) as string | undefined,
//         })),
//         total: chats.length,
//       }
//     } catch (error) {
//       console.error("Error listing chats:", error)
//       return { chats: [], total: 0 }
//     }
//   }

//   async deleteChat(chatId: string): Promise<boolean> {
//     try {
//       await v0.chats.delete({ chatId })
//       return true
//     } catch (error) {
//       console.error("Error deleting chat:", error)
//       return false
//     }
//   }

//   async favoriteChat(chatId: string): Promise<boolean> {
//     try {
//       await v0.chats.favorite({ chatId, isFavorite: true })
//       return true
//     } catch (error) {
//       console.error("Error favoriting chat:", error)
//       return false
//     }
//   }

//   async unfavoriteChat(chatId: string): Promise<boolean> {
//     try {
//       await v0.chats.favorite({ chatId, isFavorite: false })
//       return true
//     } catch (error) {
//       console.error("Error un-favoriting chat:", error)
//       return false
//     }
//   }

//   async getProject(chatId: string): Promise<any | null> {
//     try {
//       return await v0.projects.getByChatId({ chatId })
//     } catch (error) {
//       console.error("Error getting chat project:", error)
//       return null
//     }
//   }

//   async createProject(name: string, description?: string): Promise<any | null> {
//     try {
//       return await v0.projects.create({
//         name,
//         description: description || `Project for ${name}`,
//       })
//     } catch (error) {
//       console.error("Error creating project:", error)
//       return null
//     }
//   }

//   async listProjects(): Promise<any[]> {
//     try {
//       const projectsResponse = await v0.projects.find()
//       return projectsResponse.data ?? []
//     } catch (error) {
//       console.error("Error listing projects:", error)
//       return []
//     }
//   }
// }

// export const v0ToolGenerator = new V0ToolGenerator()


// import { v0 } from "v0-sdk"

// export interface ToolGenerationRequest {
//   toolName: string
//   requirements: string
//   category: string
//   userEmail: string
// }

// export interface ToolFile {
//   name: string
//   content: string
//   type?: string
// }

// export interface ToolGenerationResult {
//   chatId: string
//   demoUrl?: string
//   chatUrl?: string
//   files: ToolFile[]
//   status: "generating" | "completed" | "error"
//   error?: string
// }

// export interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// function mapSdkFilesToToolFiles(sdkFiles: any[] | undefined): ToolFile[] {
//   console.log("🔄 Mapping SDK files:", sdkFiles)
//   if (!sdkFiles || !Array.isArray(sdkFiles)) {
//     console.warn("⚠️ No files or invalid files array:", sdkFiles)
//     return []
//   }

//   const mappedFiles = sdkFiles.map((f: any, i: number) => {
//     const file = {
//       name: (f?.meta?.name as string) ?? `file-${i + 1}`,
//       content: (f?.source as string) ?? "",
//       type: (f?.lang as string) ?? undefined,
//     }
//     console.log(`📄 Mapped file ${i + 1}:`, { name: file.name, type: file.type, contentLength: file.content.length })
//     return file
//   })

//   console.log(`✅ Successfully mapped ${mappedFiles.length} files`)
//   return mappedFiles
// }

// export class V0ToolGenerator {
//   async generateTool(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
//     console.log("🚀 Starting tool generation with request:", {
//       toolName: request.toolName,
//       category: request.category,
//       requirementsLength: request.requirements.length,
//       userEmail: request.userEmail,
//     })

//     try {
//       const prompt = this.buildToolPrompt(request.toolName, request.requirements, request.category)
//       console.log("📝 Generated prompt length:", prompt.length)
//       console.log("📝 Prompt preview:", prompt.substring(0, 200) + "...")

//       console.log("🔄 Calling v0.chats.create...")
//       const startTime = Date.now()

//       const chat: any = await v0.chats.create({
//         message: prompt,
//         system:
//           "You are an expert React and TypeScript developer who creates professional business applications with modern UI/UX patterns.",
//         modelConfiguration: {
//           modelId: "v0-1.5-md",
//           imageGenerations: false,
//           thinking: false,
//         },
//       })

//       const duration = Date.now() - startTime
//       console.log(`✅ v0.chats.create completed in ${duration}ms`)
//       console.log("📊 Chat response structure:", {
//         id: chat.id,
//         hasDemo: !!chat.demoUrl || !!chat.demo,
//         hasFiles: !!chat.files,
//         filesCount: chat.files?.length || 0,
//         hasWebUrl: !!chat.webUrl || !!chat.url,
//       })

//       const result = {
//         chatId: chat.id,
//         demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
//         chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(chat.files),
//         status: "completed" as const,
//       }

//       console.log("🎉 Tool generation completed successfully:", {
//         chatId: result.chatId,
//         hasDemoUrl: !!result.demoUrl,
//         hasChatUrl: !!result.chatUrl,
//         filesGenerated: result.files.length,
//       })

//       return result
//     } catch (error) {
//       console.error("❌ v0 generation error:", error)
//       console.error("❌ Error details:", {
//         name: error instanceof Error ? error.name : "Unknown",
//         message: error instanceof Error ? error.message : String(error),
//         stack: error instanceof Error ? error.stack : undefined,
//       })

//       return {
//         chatId: "",
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Unknown error occurred during generation",
//       }
//     }
//   }

//   private buildToolPrompt(toolName: string, requirements: string, category: string): string {
//     const prompt = `Create a professional business application: ${toolName}

// Category: ${category}

// Business Requirements:
// ${requirements}

// Technical Specifications:
// - Build with React and TypeScript
// - Use Tailwind CSS for modern, responsive design
// - Include proper form validation and error handling
// - Add loading states and user feedback
// - Implement CRUD operations (Create, Read, Update, Delete)
// - Include search, filter, and sort functionality where appropriate
// - Add data export capabilities (CSV/Excel)
// - Ensure mobile responsiveness
// - Include proper accessibility features
// - Use modern UI patterns (cards, tables, modals, dropdowns)
// - Add sample data for demonstration
// - Include user roles and permissions if applicable
// - Add email notification triggers where relevant
// - Implement proper data validation
// - Include analytics/reporting dashboard if needed

// Design Guidelines:
// - Clean, professional interface suitable for business use
// - Consistent color scheme and typography
// - Intuitive navigation and user experience
// - Loading skeletons for async operations
// - Success/error toast notifications
// - Proper spacing and visual hierarchy
// - Modern buttons, inputs, and interactive elements
// - Dark mode support with proper contrast

// The application should be production-ready and immediately usable by business teams.`

//     console.log("📝 Built prompt for tool:", toolName)
//     return prompt
//   }

//   async regenerateTool(chatId: string, feedback: string): Promise<ToolGenerationResult> {
//     console.log("🔄 Regenerating tool with chatId:", chatId, "feedback length:", feedback.length)

//     try {
//       console.log("📤 Sending message to existing chat...")
//       await v0.chats.sendMessage({
//         chatId,
//         message: `Please improve the tool based on this feedback: ${feedback}`,
//       })

//       console.log("📥 Fetching updated chat...")
//       const updatedChat: any = await v0.chats.getById({ chatId })

//       const result = {
//         chatId: updatedChat.id,
//         demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
//         chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(updatedChat.files),
//         status: "completed" as const,
//       }

//       console.log("✅ Tool regeneration completed:", {
//         chatId: result.chatId,
//         filesUpdated: result.files.length,
//       })

//       return result
//     } catch (error) {
//       console.error("❌ v0 regeneration error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Regeneration failed",
//       }
//     }
//   }

//   async getChatHistory(chatId: string) {
//     console.log("📜 Fetching chat history for:", chatId)

//     try {
//       const chat: any = await v0.chats.getById({ chatId })
//       const messagesResponse = await v0.chats.findMessages({ chatId })
//       const messages = messagesResponse.data ?? []

//       console.log("📊 Chat history retrieved:", {
//         chatId,
//         messagesCount: messages.length,
//         hasDemo: !!chat.demoUrl || !!chat.demo,
//       })

//       return {
//         id: chat.id,
//         messages: messages.map((msg: any, index: number) => ({
//           id: `${chat.id}-${index}`,
//           role: (msg.role as "user" | "assistant") ?? "assistant",
//           content: (msg.content as string) ?? "",
//           timestamp: new Date((msg.createdAt as string) ?? Date.now()),
//         })),
//         status: (chat.latestVersion?.status as string) ?? (chat.status as string) ?? "unknown",
//         created: (chat.createdAt as string) ?? new Date().toISOString(),
//         updated: (chat.updatedAt as string) ?? new Date().toISOString(),
//         demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
//         chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
//       }
//     } catch (error) {
//       console.error("❌ Chat retrieval error:", error)
//       return null
//     }
//   }

//   async continueChat(chatId: string, message: string): Promise<ToolGenerationResult> {
//     console.log("💬 Continuing chat:", chatId, "with message length:", message.length)

//     try {
//       console.log("📤 Sending continuation message...")
//       await v0.chats.sendMessage({ chatId, message })

//       console.log("📥 Fetching updated chat after continuation...")
//       const updatedChat: any = await v0.chats.getById({ chatId })

//       const result = {
//         chatId: updatedChat.id,
//         demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
//         chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
//         files: mapSdkFilesToToolFiles(updatedChat.files),
//         status: "completed" as const,
//       }

//       console.log("✅ Chat continuation completed:", {
//         chatId: result.chatId,
//         filesCount: result.files.length,
//       })

//       return result
//     } catch (error) {
//       console.error("❌ Chat continuation error:", error)
//       return {
//         chatId,
//         files: [],
//         status: "error",
//         error: error instanceof Error ? error.message : "Chat continuation failed",
//       }
//     }
//   }

//   async listChats(limit = 20, offset = 0) {
//     console.log("📋 Listing chats with limit:", limit, "offset:", offset)

//     try {
//       const chatsResponse = await v0.chats.find({
//         limit: String(limit),
//         offset: String(offset),
//       })
//       const chats = chatsResponse.data ?? []

//       console.log("📊 Chats retrieved:", chats.length)

//       return {
//         chats: chats.map((chat: any) => ({
//           id: chat.id,
//           title: chat.name ?? chat.title,
//           createdAt: chat.createdAt,
//           updatedAt: chat.updatedAt,
//           url: (chat.webUrl ?? chat.url) as string,
//           demo: (chat.demoUrl ?? chat.demo) as string | undefined,
//         })),
//         total: chats.length,
//       }
//     } catch (error) {
//       console.error("❌ Error listing chats:", error)
//       return { chats: [], total: 0 }
//     }
//   }

//   async deleteChat(chatId: string): Promise<boolean> {
//     console.log("🗑️ Deleting chat:", chatId)

//     try {
//       await v0.chats.delete({ chatId })
//       console.log("✅ Chat deleted successfully:", chatId)
//       return true
//     } catch (error) {
//       console.error("❌ Error deleting chat:", error)
//       return false
//     }
//   }

//   async favoriteChat(chatId: string): Promise<boolean> {
//     console.log("⭐ Favoriting chat:", chatId)

//     try {
//       await v0.chats.favorite({ chatId, isFavorite: true })
//       console.log("✅ Chat favorited successfully:", chatId)
//       return true
//     } catch (error) {
//       console.error("❌ Error favoriting chat:", error)
//       return false
//     }
//   }

//   async unfavoriteChat(chatId: string): Promise<boolean> {
//     console.log("⭐ Unfavoriting chat:", chatId)

//     try {
//       await v0.chats.favorite({ chatId, isFavorite: false })
//       console.log("✅ Chat unfavorited successfully:", chatId)
//       return true
//     } catch (error) {
//       console.error("❌ Error un-favoriting chat:", error)
//       return false
//     }
//   }

//   async getProject(chatId: string): Promise<any | null> {
//     console.log("📁 Getting project for chat:", chatId)

//     try {
//       const project = await v0.projects.getByChatId({ chatId })
//       console.log("✅ Project retrieved:", project?.id)
//       return project
//     } catch (error) {
//       console.error("❌ Error getting chat project:", error)
//       return null
//     }
//   }

//   async createProject(name: string, description?: string): Promise<any | null> {
//     console.log("📁 Creating project:", name)

//     try {
//       const project = await v0.projects.create({
//         name,
//         description: description || `Project for ${name}`,
//       })
//       console.log("✅ Project created:", project?.id)
//       return project
//     } catch (error) {
//       console.error("❌ Error creating project:", error)
//       return null
//     }
//   }

//   async listProjects(): Promise<any[]> {
//     console.log("📋 Listing projects...")

//     try {
//       const projectsResponse = await v0.projects.find()
//       const projects = projectsResponse.data ?? []
//       console.log("📊 Projects retrieved:", projects.length)
//       return projects
//     } catch (error) {
//       console.error("❌ Error listing projects:", error)
//       return []
//     }
//   }
// }

// export const v0ToolGenerator = new V0ToolGenerator()


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

function mapSdkFilesToToolFiles(sdkFiles: any[] | undefined): ToolFile[] {
  console.log("📁 Mapping SDK files:", sdkFiles)
  if (!sdkFiles || !Array.isArray(sdkFiles)) {
    console.log("⚠️ No files or invalid format")
    return []
  }

  const mapped = sdkFiles.map((f: any, i: number) => ({
    name: (f?.meta?.name as string) ?? `file-${i + 1}.tsx`,
    content: (f?.source as string) ?? "",
    type: (f?.lang as string) ?? "typescript",
  }))

  console.log(
    `✅ Mapped ${mapped.length} files:`,
    mapped.map((f) => f.name),
  )
  return mapped
}

export class V0ToolGenerator {
  async generateTool(request: ToolGenerationRequest): Promise<ToolGenerationResult> {
    console.log("🚀 Starting tool generation with v0 SDK...")
    console.log("📋 Request details:", {
      toolName: request.toolName,
      category: request.category,
      requirementsLength: request.requirements.length,
      userEmail: request.userEmail,
    })

    try {
      // Step 1: Build the prompt
      console.log("📝 Building tool prompt...")
      const prompt = this.buildToolPrompt(request.toolName, request.requirements, request.category)
      console.log("✅ Prompt built successfully (length:", prompt.length, ")")

      // Step 2: Create chat with v0
      console.log("🤖 Creating chat with v0 SDK...")
      const startTime = Date.now()

      const chat: any = await v0.chats.create({
        message: prompt,
        system:
          "You are an expert React and TypeScript developer who creates professional business applications with modern UI/UX patterns. Always generate complete, production-ready code.",
        modelConfiguration: {
          modelId: "v0-1.5-md",
          imageGenerations: false,
          thinking: false,
        },
      })

      const endTime = Date.now()
      console.log(`✅ Chat created successfully in ${endTime - startTime}ms`)
      console.log("🔗 Chat details:", {
        id: chat.id,
        status: chat.status,
        demoUrl: chat.demoUrl,
        filesCount: chat.files?.length || 0,
      })

      // Step 3: Map files
      const files = mapSdkFilesToToolFiles(chat.files)
      console.log(`📦 Generated ${files.length} files`)

      // Step 4: Determine status
      let status: "generating" | "completed" | "error" = "completed"
      let progress = 100

      if (!chat.id) {
        console.error("❌ No chat ID returned from v0")
        status = "error"
        progress = 0
      } else if (files.length === 0) {
        console.warn("⚠️ No files generated, but chat exists")
        status = "generating"
        progress = 50
      }

      const result: ToolGenerationResult = {
        chatId: chat.id,
        demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
        chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
        files,
        status,
        progress,
        step: status === "completed" ? "finalizing" : "generating",
      }

      console.log("🎉 Tool generation result:", {
        chatId: result.chatId,
        status: result.status,
        progress: result.progress,
        filesCount: result.files.length,
        hasDemoUrl: !!result.demoUrl,
      })

      return result
    } catch (error) {
      console.error("💥 v0 generation error:", error)
      console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace")

      // Enhanced error handling
      let errorMessage = "Unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          cause: error.cause,
        })
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
    console.log("🏗️ Building comprehensive prompt for:", toolName)

    return `Create a professional business application: ${toolName}

Category: ${category}

Business Requirements:
${requirements}

Technical Specifications:
- Build with React and TypeScript
- Use Tailwind CSS for modern, responsive design
- Include proper form validation and error handling
- Add loading states and user feedback
- Implement CRUD operations (Create, Read, Update, Delete)
- Include search, filter, and sort functionality where appropriate
- Add data export capabilities (CSV/Excel)
- Ensure mobile responsiveness
- Include proper accessibility features
- Use modern UI patterns (cards, tables, modals, dropdowns)
- Add sample data for demonstration
- Include user roles and permissions if applicable
- Add email notification triggers where relevant
- Implement proper data validation
- Include analytics/reporting dashboard if needed

Design Guidelines:
- Clean, professional interface suitable for business use
- Consistent color scheme and typography
- Intuitive navigation and user experience
- Loading skeletons for async operations
- Success/error toast notifications
- Proper spacing and visual hierarchy
- Modern buttons, inputs, and interactive elements
- Dark mode support with proper contrast

Code Requirements:
- Generate multiple files for proper structure
- Include proper TypeScript interfaces
- Add comprehensive error boundaries
- Include proper state management
- Add proper hooks and utilities
- Generate a complete, working application

The application should be production-ready and immediately usable by business teams. Generate ALL necessary files including components, types, utilities, and the main application file.`
  }

  async regenerateTool(chatId: string, feedback: string): Promise<ToolGenerationResult> {
    console.log("🔄 Regenerating tool with chat ID:", chatId)
    console.log("💬 Feedback:", feedback)

    try {
      console.log("📤 Sending message to existing chat...")
      await v0.chats.sendMessage({
        chatId,
        message: `Please improve the tool based on this feedback: ${feedback}`,
      })

      console.log("📥 Fetching updated chat...")
      const updatedChat: any = await v0.chats.getById({ chatId })

      console.log("🔄 Updated chat details:", {
        id: updatedChat.id,
        status: updatedChat.status,
        filesCount: updatedChat.files?.length || 0,
      })

      const files = mapSdkFilesToToolFiles(updatedChat.files)

      return {
        chatId: updatedChat.id,
        demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
        chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
        files,
        status: "completed",
        progress: 100,
        step: "completed",
      }
    } catch (error) {
      console.error("💥 Regeneration error:", error)
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
    console.log("📜 Fetching chat history for:", chatId)

    try {
      const chat: any = await v0.chats.getById({ chatId })
      const messagesResponse = await v0.chats.findMessages({ chatId })
      const messages = messagesResponse.data ?? []

      console.log("📜 Chat history retrieved:", {
        chatId: chat.id,
        messagesCount: messages.length,
        status: chat.status,
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
        demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
        chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
      }
    } catch (error) {
      console.error("💥 Chat retrieval error:", error)
      return null
    }
  }

  async continueChat(chatId: string, message: string): Promise<ToolGenerationResult> {
    console.log("💬 Continuing chat:", chatId, "with message:", message)

    try {
      await v0.chats.sendMessage({ chatId, message })
      const updatedChat: any = await v0.chats.getById({ chatId })

      const files = mapSdkFilesToToolFiles(updatedChat.files)

      return {
        chatId: updatedChat.id,
        demoUrl: (updatedChat.demoUrl ?? updatedChat.demo) as string | undefined,
        chatUrl: (updatedChat.webUrl ?? updatedChat.url) as string | undefined,
        files,
        status: "completed",
        progress: 100,
        step: "completed",
      }
    } catch (error) {
      console.error("💥 Chat continuation error:", error)
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

  // Additional utility methods with logging
  async listChats(limit = 20, offset = 0) {
    console.log("📋 Listing chats with limit:", limit, "offset:", offset)

    try {
      const chatsResponse = await v0.chats.find({
        limit: String(limit),
        offset: String(offset),
      })
      const chats = chatsResponse.data ?? []

      console.log("📋 Retrieved", chats.length, "chats")

      return {
        chats: chats.map((chat: any) => ({
          id: chat.id,
          title: chat.name ?? chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          url: (chat.webUrl ?? chat.url) as string,
          demo: (chat.demoUrl ?? chat.demo) as string | undefined,
        })),
        total: chats.length,
      }
    } catch (error) {
      console.error("💥 Error listing chats:", error)
      return { chats: [], total: 0 }
    }
  }

  async getGenerationStatus(chatId: string): Promise<ToolGenerationResult> {
    console.log("🔍 Checking generation status for chat:", chatId)

    try {
      const chat: any = await v0.chats.getById({ chatId })
      const files = mapSdkFilesToToolFiles(chat.files)

      // Determine status based on chat state
      let status: "generating" | "completed" | "error" = "generating"
      let progress = 25
      let step = "analyzing"

      if (chat.status === "completed" || (files.length > 0 && chat.demoUrl)) {
        status = "completed"
        progress = 100
        step = "completed"
      } else if (chat.status === "error") {
        status = "error"
        progress = 0
        step = "error"
      } else if (files.length > 0) {
        progress = 75
        step = "finalizing"
      } else if (chat.status === "generating") {
        progress = 50
        step = "generating"
      }

      console.log("🔍 Status check result:", {
        chatId,
        status,
        progress,
        step,
        filesCount: files.length,
      })

      return {
        chatId: chat.id,
        demoUrl: (chat.demoUrl ?? chat.demo) as string | undefined,
        chatUrl: (chat.webUrl ?? chat.url) as string | undefined,
        files,
        status,
        progress,
        step,
      }
    } catch (error) {
      console.error("💥 Status check error:", error)
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

export const v0ToolGenerator = new V0ToolGenerator()
