// import { prisma } from "@/lib/prisma"
// import { v0PlatformAPI, type V0Chat, type V0StreamChunk } from "@/lib/v0-platform-api"

// export interface ChatSession {
//   id: string
//   toolId: string
//   v0ChatId: string
//   status: "generating" | "completed" | "error"
//   messages: ChatMessage[]
//   files: ChatFile[]
//   demoUrl?: string
//   error?: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface ChatMessage {
//   id: string
//   role: "user" | "assistant" | "system"
//   content: string
//   timestamp: Date
// }

// export interface ChatFile {
//   id: string
//   name: string
//   content: string
//   type: string
//   size: number
// }

// // Production-ready Chat Management System
// export class ChatManager {
//   // Create a new chat session for tool generation
//   async createChatSession(
//     toolId: string,
//     userId: string,
//     organizationId: string,
//     initialMessage: string,
//   ): Promise<ChatSession> {
//     try {
//       // Create chat session in database
//       const chatSession = await prisma.chatSession.create({
//         data: {
//           toolId,
//           userId,
//           organizationId,
//           status: "generating",
//           messages: {
//             create: {
//               role: "user",
//               content: initialMessage,
//               userId,
//             },
//           },
//         },
//         include: {
//           messages: true,
//           files: true,
//         },
//       })

//       // Start v0 chat generation
//       this.generateWithV0(chatSession.id, initialMessage)

//       return this.mapToChatSession(chatSession)
//     } catch (error) {
//       console.error("Failed to create chat session:", error)
//       throw new Error("Failed to create chat session")
//     }
//   }

//   // Create streaming chat session with real-time updates
//   async createStreamingChatSession(
//     toolId: string,
//     userId: string,
//     organizationId: string,
//     initialMessage: string,
//     onUpdate: (session: ChatSession) => void,
//   ): Promise<ChatSession> {
//     try {
//       // Create chat session in database
//       const chatSession = await prisma.chatSession.create({
//         data: {
//           toolId,
//           userId,
//           organizationId,
//           status: "generating",
//           messages: {
//             create: {
//               role: "user",
//               content: initialMessage,
//               userId,
//             },
//           },
//         },
//         include: {
//           messages: true,
//           files: true,
//         },
//       })

//       // Start streaming v0 chat generation
//       this.generateStreamingWithV0(chatSession.id, initialMessage, onUpdate)

//       return this.mapToChatSession(chatSession)
//     } catch (error) {
//       console.error("Failed to create streaming chat session:", error)
//       throw new Error("Failed to create streaming chat session")
//     }
//   }

//   // Continue an existing chat conversation
//   async continueChat(chatSessionId: string, message: string, userId: string): Promise<ChatSession> {
//     try {
//       const chatSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//         include: { messages: true, files: true },
//       })

//       if (!chatSession) {
//         throw new Error("Chat session not found")
//       }

//       // Add user message
//       await prisma.chatMessage.create({
//         data: {
//           chatSessionId,
//           role: "user",
//           content: message,
//           userId,
//         },
//       })

//       // Update status to generating
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: { status: "generating" },
//       })

//       // Continue v0 chat if we have a v0ChatId
//       if (chatSession.v0ChatId) {
//         this.continueV0Chat(chatSessionId, chatSession.v0ChatId, message)
//       } else {
//         this.generateWithV0(chatSessionId, message)
//       }

//       const updatedSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//         include: { messages: true, files: true },
//       })

//       return this.mapToChatSession(updatedSession!)
//     } catch (error) {
//       console.error("Failed to continue chat:", error)
//       throw new Error("Failed to continue chat")
//     }
//   }

//   // Get chat session by ID
//   async getChatSession(chatSessionId: string): Promise<ChatSession | null> {
//     try {
//       const chatSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//       })

//       if (!chatSession) {
//         return null
//       }

//       return this.mapToChatSession(chatSession)
//     } catch (error) {
//       console.error("Failed to get chat session:", error)
//       return null
//     }
//   }

//   // Get all chat sessions for a tool
//   async getToolChatSessions(toolId: string): Promise<ChatSession[]> {
//     try {
//       const chatSessions = await prisma.chatSession.findMany({
//         where: { toolId },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//         orderBy: { createdAt: "desc" },
//       })

//       return chatSessions.map(this.mapToChatSession)
//     } catch (error) {
//       console.error("Failed to get tool chat sessions:", error)
//       return []
//     }
//   }

//   // Poll chat status for real-time updates
//   async pollChatStatus(chatSessionId: string): Promise<ChatSession | null> {
//     try {
//       const chatSession = await this.getChatSession(chatSessionId)

//       if (!chatSession || !chatSession.v0ChatId) {
//         return chatSession
//       }

//       // Check v0 chat status
//       try {
//         const v0Chat = await v0PlatformAPI.getChatStatus(chatSession.v0ChatId)

//         // Update database if status changed
//         if (v0Chat.status !== chatSession.status) {
//           await this.updateChatFromV0(chatSessionId, v0Chat)
//           return await this.getChatSession(chatSessionId)
//         }
//       } catch (error) {
//         console.warn("Failed to poll v0 chat status:", error)
//       }

//       return chatSession
//     } catch (error) {
//       console.error("Failed to poll chat status:", error)
//       return null
//     }
//   }

//   // Private method to generate with v0
//   private async generateWithV0(chatSessionId: string, message: string): Promise<void> {
//     try {
//       const v0Chat = await v0PlatformAPI.createChat(message, "v0-1.5-md")
//       await this.updateChatFromV0(chatSessionId, v0Chat)
//     } catch (error) {
//       console.error("v0 generation failed:", error)
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: {
//           status: "error",
//           error: error instanceof Error ? error.message : "Generation failed",
//         },
//       })
//     }
//   }

//   // Private method to generate streaming with v0
//   private async generateStreamingWithV0(
//     chatSessionId: string,
//     message: string,
//     onUpdate: (session: ChatSession) => void,
//   ): Promise<void> {
//     try {
//       const v0Chat = await v0PlatformAPI.createStreamingChat(
//         message,
//         async (chunk: V0StreamChunk) => {
//           // Update chat session with streaming content
//           const content = chunk.choices[0]?.delta?.content
//           if (content) {
//             // You could update the database with partial content here
//             // For now, we'll just trigger the callback
//             const session = await this.getChatSession(chatSessionId)
//             if (session) {
//               onUpdate(session)
//             }
//           }
//         },
//         "v0-1.5-md",
//       )

//       await this.updateChatFromV0(chatSessionId, v0Chat)

//       // Final update
//       const finalSession = await this.getChatSession(chatSessionId)
//       if (finalSession) {
//         onUpdate(finalSession)
//       }
//     } catch (error) {
//       console.error("v0 streaming generation failed:", error)
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: {
//           status: "error",
//           error: error instanceof Error ? error.message : "Generation failed",
//         },
//       })
//     }
//   }

//   // Private method to continue v0 chat
//   private async continueV0Chat(chatSessionId: string, v0ChatId: string, message: string): Promise<void> {
//     try {
//       const v0Chat = await v0PlatformAPI.continueChat(v0ChatId, message)
//       await this.updateChatFromV0(chatSessionId, v0Chat)
//     } catch (error) {
//       console.error("v0 chat continuation failed:", error)
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: {
//           status: "error",
//           error: error instanceof Error ? error.message : "Chat continuation failed",
//         },
//       })
//     }
//   }

//   // Private method to update chat session from v0 response
//   private async updateChatFromV0(chatSessionId: string, v0Chat: V0Chat): Promise<void> {
//     try {
//       // Update chat session
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: {
//           v0ChatId: v0Chat.id,
//           status: v0Chat.status,
//           demoUrl: v0Chat.demo,
//           error: v0Chat.error,
//         },
//       })

//       // Add assistant message if we have content
//       if (v0Chat.files.length > 0) {
//         const assistantContent = `Generated ${v0Chat.files.length} files:\n${v0Chat.files.map((f) => `- ${f.name}`).join("\n")}`

//         await prisma.chatMessage.create({
//           data: {
//             chatSessionId,
//             role: "assistant",
//             content: assistantContent,
//           },
//         })
//       }

//       // Save files
//       for (const file of v0Chat.files) {
//         await prisma.chatFile.upsert({
//           where: {
//             chatSessionId_name: {
//               chatSessionId,
//               name: file.name,
//             },
//           },
//           update: {
//             content: file.content,
//             type: file.type,
//             size: file.content.length,
//           },
//           create: {
//             chatSessionId,
//             name: file.name,
//             content: file.content,
//             type: file.type,
//             size: file.content.length,
//           },
//         })
//       }
//     } catch (error) {
//       console.error("Failed to update chat from v0:", error)
//       throw error
//     }
//   }

//   // Private method to map database model to interface
//   private mapToChatSession(dbSession: any): ChatSession {
//     return {
//       id: dbSession.id,
//       toolId: dbSession.toolId,
//       v0ChatId: dbSession.v0ChatId,
//       status: dbSession.status,
//       messages: dbSession.messages.map((msg: any) => ({
//         id: msg.id,
//         role: msg.role,
//         content: msg.content,
//         timestamp: msg.createdAt,
//       })),
//       files: dbSession.files.map((file: any) => ({
//         id: file.id,
//         name: file.name,
//         content: file.content,
//         type: file.type,
//         size: file.size,
//       })),
//       demoUrl: dbSession.demoUrl,
//       error: dbSession.error,
//       createdAt: dbSession.createdAt,
//       updatedAt: dbSession.updatedAt,
//     }
//   }
// }

// // Export singleton instance
// export const chatManager = new ChatManager()





// import { prisma } from "@/lib/prisma"
// import { v0PlatformAPI, type V0Chat, type V0StreamChunk } from "@/lib/v0-platform-api"

// export interface ChatSession {
//   id: string
//   toolId: string
//   v0ChatId?: string
//   status: "generating" | "completed" | "error"
//   messages: ChatMessage[]
//   files: ChatFile[]
//   demoUrl?: string
//   error?: string
//   progress: number
//   createdAt: Date
//   updatedAt: Date
// }

// export interface ChatMessage {
//   id: string
//   role: "user" | "assistant" | "system"
//   content: string
//   createdAt: Date
// }

// export interface ChatFile {
//   id: string
//   name: string
//   content: string
//   type: string
//   size: number
// }

// // Production-ready Chat Management System
// export class ChatManager {
//   // Create a new chat session for tool generation
//   async createChatSession(
//     toolId: string,
//     userId: string,
//     organizationId: string,
//     initialMessage: string,
//   ): Promise<ChatSession> {
//     try {
//       console.log("Creating chat session for tool:", toolId)

//       // Create chat session in database with correct enum values
//       const chatSession = await prisma.chatSession.create({
//         data: {
//           toolId,
//           userId,
//           organizationId,
//           status: "generating", // Using lowercase enum value
//           messages: {
//             create: {
//               role: "user",
//               content: initialMessage,
//               userId,
//             },
//           },
//         },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//       })

//       // Update tool with chat session ID using correct enum values
//       await prisma.tool.update({
//         where: { id: toolId },
//         data: {
//           chatSessionId: chatSession.id,
//           status: "GENERATING",
//           generationStatus: "analyzing", // Using correct enum value
//         },
//       })

//       // Start v0 generation asynchronously
//       this.generateWithV0(chatSession.id, initialMessage).catch((error) => {
//         console.error("v0 generation failed:", error)
//         this.handleGenerationError(chatSession.id, error)
//       })

//       return this.mapToChatSession(chatSession)
//     } catch (error) {
//       console.error("Failed to create chat session:", error)
//       throw new Error("Failed to create chat session")
//     }
//   }

//   // Create streaming chat session with real-time updates
//   async createStreamingChatSession(
//     toolId: string,
//     userId: string,
//     organizationId: string,
//     initialMessage: string,
//     onUpdate: (session: ChatSession) => void,
//     onProgress?: (progress: number) => void,
//   ): Promise<ChatSession> {
//     try {
//       console.log("Creating streaming chat session for tool:", toolId)

//       // Create chat session in database with correct enum values
//       const chatSession = await prisma.chatSession.create({
//         data: {
//           toolId,
//           userId,
//           organizationId,
//           status: "generating", // Using lowercase enum value
//           messages: {
//             create: {
//               role: "user",
//               content: initialMessage,
//               userId,
//             },
//           },
//         },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//       })

//       // Update tool with chat session ID
//       await prisma.tool.update({
//         where: { id: toolId },
//         data: {
//           chatSessionId: chatSession.id,
//           status: "GENERATING",
//           generationStatus: "analyzing",
//         },
//       })

//       // Start streaming v0 generation
//       this.generateStreamingWithV0(chatSession.id, initialMessage, onUpdate, onProgress).catch((error) => {
//         console.error("v0 streaming generation failed:", error)
//         this.handleGenerationError(chatSession.id, error)
//       })

//       return this.mapToChatSession(chatSession)
//     } catch (error) {
//       console.error("Failed to create streaming chat session:", error)
//       throw new Error("Failed to create streaming chat session")
//     }
//   }

//   // Continue an existing chat conversation
//   async continueChat(chatSessionId: string, message: string, userId: string): Promise<ChatSession> {
//     try {
//       console.log("Continuing chat session:", chatSessionId)

//       const chatSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//         include: { messages: true, files: true },
//       })

//       if (!chatSession) {
//         throw new Error("Chat session not found")
//       }

//       // Add user message
//       await prisma.chatMessage.create({
//         data: {
//           chatSessionId,
//           role: "user",
//           content: message,
//           userId,
//         },
//       })

//       // Update status to generating with correct enum value
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: { status: "generating" },
//       })

//       // Continue v0 chat if we have a v0ChatId
//       if (chatSession.v0ChatId) {
//         this.continueV0Chat(chatSessionId, chatSession.v0ChatId, message).catch((error) => {
//           console.error("v0 chat continuation failed:", error)
//           this.handleGenerationError(chatSession.id, error)
//         })
//       } else {
//         this.generateWithV0(chatSessionId, message).catch((error) => {
//           console.error("v0 generation failed:", error)
//           this.handleGenerationError(chatSession.id, error)
//         })
//       }

//       const updatedSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//       })

//       return this.mapToChatSession(updatedSession!)
//     } catch (error) {
//       console.error("Failed to continue chat:", error)
//       throw new Error("Failed to continue chat")
//     }
//   }

//   // Get chat session by ID
//   async getChatSession(chatSessionId: string): Promise<ChatSession | null> {
//     try {
//       const chatSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//       })

//       if (!chatSession) {
//         return null
//       }

//       return this.mapToChatSession(chatSession)
//     } catch (error) {
//       console.error("Failed to get chat session:", error)
//       return null
//     }
//   }

//   // Get all chat sessions for a tool
//   async getToolChatSessions(toolId: string): Promise<ChatSession[]> {
//     try {
//       const chatSessions = await prisma.chatSession.findMany({
//         where: { toolId },
//         include: {
//           messages: {
//             orderBy: { createdAt: "asc" },
//           },
//           files: true,
//         },
//         orderBy: { createdAt: "desc" },
//       })

//       return chatSessions.map(this.mapToChatSession)
//     } catch (error) {
//       console.error("Failed to get tool chat sessions:", error)
//       return []
//     }
//   }

//   // Poll chat status for real-time updates
//   async pollChatStatus(chatSessionId: string): Promise<ChatSession | null> {
//     try {
//       const chatSession = await this.getChatSession(chatSessionId)

//       if (!chatSession || !chatSession.v0ChatId) {
//         return chatSession
//       }

//       // Check v0 chat status
//       try {
//         const v0Chat = await v0PlatformAPI.getChatStatus(chatSession.v0ChatId)

//         // Update database if status changed
//         if (v0Chat.status !== chatSession.status) {
//           await this.updateChatFromV0(chatSessionId, v0Chat)
//           return await this.getChatSession(chatSessionId)
//         }
//       } catch (error) {
//         console.warn("Failed to poll v0 chat status:", error)
//       }

//       return chatSession
//     } catch (error) {
//       console.error("Failed to poll chat status:", error)
//       return null
//     }
//   }

//   // Calculate progress based on generation status
//   calculateProgress(status: string, generationStatus?: string): number {
//     if (status === "completed") return 100
//     if (status === "error") return 0

//     switch (generationStatus) {
//       case "pending":
//         return 5
//       case "analyzing":
//         return 15
//       case "designing":
//         return 35
//       case "generating":
//         return 65
//       case "finalizing":
//         return 85
//       case "completed":
//         return 100
//       case "error":
//         return 0
//       default:
//         return 10
//     }
//   }

//   // Private method to generate with v0
//   private async generateWithV0(chatSessionId: string, message: string): Promise<void> {
//     try {
//       console.log("Starting v0 generation for chat:", chatSessionId)

//       // Update status
//       await this.updateChatStatus(chatSessionId, "generating", "analyzing")

//       const v0Chat = await v0PlatformAPI.createChat(message, "v0-1.5-md")
//       await this.updateChatFromV0(chatSessionId, v0Chat)

//       console.log("v0 generation completed for chat:", chatSessionId)
//     } catch (error) {
//       console.error("v0 generation failed:", error)
//       await this.handleGenerationError(chatSessionId, error)
//     }
//   }

//   // Private method to generate streaming with v0
//   private async generateStreamingWithV0(
//     chatSessionId: string,
//     message: string,
//     onUpdate: (session: ChatSession) => void,
//     onProgress?: (progress: number) => void,
//   ): Promise<void> {
//     try {
//       console.log("Starting v0 streaming generation for chat:", chatSessionId)

//       // Update status
//       await this.updateChatStatus(chatSessionId, "generating", "analyzing")

//       const v0Chat = await v0PlatformAPI.createStreamingChat(
//         message,
//         async (chunk: V0StreamChunk) => {
//           // Handle streaming chunk
//           const content = chunk.choices[0]?.delta?.content
//           if (content) {
//             // Update progress
//             const session = await this.getChatSession(chatSessionId)
//             if (session) {
//               onUpdate(session)
//             }
//           }
//         },
//         onProgress,
//         "v0-1.5-md",
//       )

//       await this.updateChatFromV0(chatSessionId, v0Chat)

//       // Final update
//       const finalSession = await this.getChatSession(chatSessionId)
//       if (finalSession) {
//         onUpdate(finalSession)
//       }

//       console.log("v0 streaming generation completed for chat:", chatSessionId)
//     } catch (error) {
//       console.error("v0 streaming generation failed:", error)
//       await this.handleGenerationError(chatSessionId, error)
//     }
//   }

//   // Private method to continue v0 chat
//   private async continueV0Chat(chatSessionId: string, v0ChatId: string, message: string): Promise<void> {
//     try {
//       console.log("Continuing v0 chat:", v0ChatId)

//       const v0Chat = await v0PlatformAPI.continueChat(v0ChatId, message)
//       await this.updateChatFromV0(chatSessionId, v0Chat)

//       console.log("v0 chat continuation completed")
//     } catch (error) {
//       console.error("v0 chat continuation failed:", error)
//       await this.handleGenerationError(chatSessionId, error)
//     }
//   }

//   // Private method to update chat session from v0 response
//   private async updateChatFromV0(chatSessionId: string, v0Chat: V0Chat): Promise<void> {
//     try {
//       console.log("Updating chat session from v0 response:", chatSessionId)

//       // Update chat session with correct enum values
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: {
//           v0ChatId: v0Chat.id,
//           status: v0Chat.status === "completed" ? "completed" : "generating", // Using correct enum values
//           demoUrl: v0Chat.demo,
//           error: v0Chat.error,
//         },
//       })

//       // Add assistant message if we have files
//       if (v0Chat.files.length > 0) {
//         const assistantContent = `Generated ${v0Chat.files.length} files:\n${v0Chat.files.map((f) => `- ${f.name}`).join("\n")}`

//         await prisma.chatMessage.create({
//           data: {
//             chatSessionId,
//             role: "assistant",
//             content: assistantContent,
//           },
//         })
//       }

//       // Save files
//       for (const file of v0Chat.files) {
//         await prisma.chatFile.upsert({
//           where: {
//             chatSessionId_name: {
//               chatSessionId,
//               name: file.name,
//             },
//           },
//           update: {
//             content: file.content,
//             type: file.type,
//             size: file.size,
//           },
//           create: {
//             chatSessionId,
//             name: file.name,
//             content: file.content,
//             type: file.type,
//             size: file.size,
//           },
//         })
//       }

//       // Update associated tool with correct enum values
//       const chatSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//       })

//       if (chatSession?.toolId) {
//         const generatedCode = v0Chat.files.map((f) => `// ${f.name}\n${f.content}`).join("\n\n")

//         await prisma.tool.update({
//           where: { id: chatSession.toolId },
//           data: {
//             status: v0Chat.status === "completed" ? "GENERATED" : "GENERATING",
//             generationStatus: v0Chat.status === "completed" ? "completed" : "generating", // Using correct enum values
//             previewUrl: v0Chat.demo,
//             generatedCode,
//             v0Code: generatedCode,
//             generatedAt: v0Chat.status === "completed" ? new Date() : undefined,
//           },
//         })
//       }

//       console.log("Chat session updated successfully")
//     } catch (error) {
//       console.error("Failed to update chat from v0:", error)
//       throw error
//     }
//   }

//   // Private method to update chat status
//   private async updateChatStatus(chatSessionId: string, status: string, generationStatus?: string): Promise<void> {
//     try {
//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: { status: status as any },
//       })

//       if (generationStatus) {
//         const chatSession = await prisma.chatSession.findUnique({
//           where: { id: chatSessionId },
//         })

//         if (chatSession?.toolId) {
//           await prisma.tool.update({
//             where: { id: chatSession.toolId },
//             data: { generationStatus: generationStatus as any }, // Cast to correct enum type
//           })
//         }
//       }
//     } catch (error) {
//       console.error("Failed to update chat status:", error)
//     }
//   }

//   // Private method to handle generation errors
//   private async handleGenerationError(chatSessionId: string, error: any): Promise<void> {
//     try {
//       const errorMessage = error instanceof Error ? error.message : "Generation failed"

//       await prisma.chatSession.update({
//         where: { id: chatSessionId },
//         data: {
//           status: "error", // Using correct enum value
//           error: errorMessage,
//         },
//       })

//       // Update associated tool
//       const chatSession = await prisma.chatSession.findUnique({
//         where: { id: chatSessionId },
//       })

//       if (chatSession?.toolId) {
//         await prisma.tool.update({
//           where: { id: chatSession.toolId },
//           data: {
//             status: "ERROR",
//             generationStatus: "error", // Using correct enum value
//             generationError: errorMessage,
//           },
//         })
//       }
//     } catch (updateError) {
//       console.error("Failed to handle generation error:", updateError)
//     }
//   }

//   // Private method to map database model to interface
//   private mapToChatSession(dbSession: any): ChatSession {
//     return {
//       id: dbSession.id,
//       toolId: dbSession.toolId,
//       v0ChatId: dbSession.v0ChatId,
//       status: dbSession.status,
//       messages: dbSession.messages.map((msg: any) => ({
//         id: msg.id,
//         role: msg.role,
//         content: msg.content,
//         createdAt: msg.createdAt,
//       })),
//       files: dbSession.files.map((file: any) => ({
//         id: file.id,
//         name: file.name,
//         content: file.content,
//         type: file.type,
//         size: file.size,
//       })),
//       demoUrl: dbSession.demoUrl,
//       error: dbSession.error,
//       progress: this.calculateProgress(dbSession.status, dbSession.generationStatus),
//       createdAt: dbSession.createdAt,
//       updatedAt: dbSession.updatedAt,
//     }
//   }
// }

// // Export singleton instance
// export const chatManager = new ChatManager()



import { prisma } from "@/lib/prisma"
import { v0PlatformAPI } from "@/lib/v0-platform-api"

export interface ChatSession {
  id: string
  toolId: string
  userId: string
  organizationId: string
  v0ChatId?: string
  status: "generating" | "completed" | "error"
  messages: ChatMessage[]
  files: ChatFile[]
  demoUrl?: string
  error?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatSessionData {
  id: string
  toolId: string
  userId: string
  organizationId: string
  v0ChatId?: string
  status: "generating" | "completed" | "error"
  demoUrl?: string
  error?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
}

export interface ChatFile {
  id: string
  name: string
  content: string
  type: string
  size: number
  createdAt: Date
}

// Production-ready Chat Management System for ConfigCraft
export class ChatManager {
  // Create a new chat session for tool generation - Core functionality
  static async createChatSession(
    toolId: string,
    userId: string,
    organizationId: string,
    initialMessage: string,
  ): Promise<ChatSessionData> {
    try {
      console.log(`Creating chat session for tool ${toolId} in organization ${organizationId}`)

      // Create chat session in database
      const chatSession = await prisma.chatSession.create({
        data: {
          toolId,
          userId,
          organizationId,
          status: "generating",
        },
      })

      // Add initial user message
      await prisma.chatMessage.create({
        data: {
          chatSessionId: chatSession.id,
          role: "user",
          content: initialMessage,
          userId,
        },
      })

      console.log(`Chat session ${chatSession.id} created successfully`)

      // Convert null values to undefined for proper typing
      return {
        ...chatSession,
        v0ChatId: chatSession.v0ChatId || undefined,
        demoUrl: chatSession.demoUrl || undefined,
        error: chatSession.error || undefined,
      }
    } catch (error) {
      console.error("Error creating chat session:", error)
      throw new Error("Failed to create chat session")
    }
  }

  // Start v0 generation for a chat session - Main AI integration
  static async startV0Generation(chatSessionId: string, prompt: string): Promise<void> {
    try {
      console.log(`Starting v0 generation for chat session ${chatSessionId}`)

      // Get chat session
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: { tool: true },
      })

      if (!chatSession) {
        throw new Error("Chat session not found")
      }

      // Update tool status to generating
      await prisma.tool.update({
        where: { id: chatSession.toolId },
        data: {
          status: "GENERATING",
          generationStatus: "analyzing",
          chatSessionId,
        },
      })

      // Create v0 chat - This is where the magic happens
      const v0Chat = await v0PlatformAPI.createChat(prompt)

      // Update chat session with v0 chat ID
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          v0ChatId: v0Chat.id,
          status: "generating",
        },
      })

      console.log(`v0 chat ${v0Chat.id} created for session ${chatSessionId}`)

      // Start polling for completion
      this.pollChatCompletion(chatSessionId)
    } catch (error) {
      console.error("Error starting v0 generation:", error)

      // Update chat session with error
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })

      // Get the chat session to get the tool ID
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
      })

      if (chatSession) {
        // Update tool with error
        await prisma.tool.update({
          where: { id: chatSession.toolId },
          data: {
            status: "ERROR",
            generationStatus: "error",
            generationError: error instanceof Error ? error.message : "Unknown error",
          },
        })
      }

      throw error
    }
  }

  // Poll for chat completion - Real-time status updates
  private static async pollChatCompletion(chatSessionId: string): Promise<void> {
    const maxAttempts = 60 // 5 minutes with 5-second intervals
    let attempts = 0

    const poll = async (): Promise<void> => {
      try {
        attempts++
        console.log(`Polling chat completion attempt ${attempts}/${maxAttempts} for session ${chatSessionId}`)

        const chatSession = await prisma.chatSession.findUnique({
          where: { id: chatSessionId },
          include: { tool: true },
        })

        if (!chatSession || !chatSession.v0ChatId) {
          throw new Error("Chat session or v0 chat ID not found")
        }

        // Get chat status from v0 Platform API
        const chatStatus = await v0PlatformAPI.getChatStatus(chatSession.v0ChatId)

        if (chatStatus.status === "completed") {
          console.log(`Chat ${chatSessionId} completed successfully`)
          // Chat is completed, process the results
          await this.processChatCompletion(chatSessionId, chatStatus)
        } else if (chatStatus.status === "error") {
          console.error(`Chat ${chatSessionId} failed:`, chatStatus.error)
          // Chat failed
          await prisma.chatSession.update({
            where: { id: chatSessionId },
            data: {
              status: "error",
              error: chatStatus.error || "Generation failed",
            },
          })

          await prisma.tool.update({
            where: { id: chatSession.toolId },
            data: {
              status: "ERROR",
              generationStatus: "error",
              generationError: chatStatus.error || "Generation failed",
            },
          })
        } else if (attempts < maxAttempts) {
          // Still generating, continue polling
          console.log(`Chat ${chatSessionId} still generating, continuing to poll...`)

          // Update generation status based on v0 response
          const generationStatus = this.mapV0StatusToGenerationStatus(chatStatus.status)
          await prisma.tool.update({
            where: { id: chatSession.toolId },
            data: {
              generationStatus,
            },
          })

          setTimeout(poll, 5000) // Poll every 5 seconds
        } else {
          console.error(`Chat ${chatSessionId} timed out after ${maxAttempts} attempts`)
          // Timeout
          await prisma.chatSession.update({
            where: { id: chatSessionId },
            data: {
              status: "error",
              error: "Generation timeout",
            },
          })

          await prisma.tool.update({
            where: { id: chatSession.toolId },
            data: {
              status: "ERROR",
              generationStatus: "error",
              generationError: "Generation timeout",
            },
          })
        }
      } catch (error) {
        console.error("Error polling chat completion:", error)

        if (attempts < maxAttempts) {
          setTimeout(poll, 5000) // Retry after 5 seconds
        } else {
          // Final error state
          await prisma.chatSession.update({
            where: { id: chatSessionId },
            data: {
              status: "error",
              error: "Polling failed",
            },
          })
        }
      }
    }

    // Start polling
    setTimeout(poll, 2000) // Initial delay of 2 seconds
  }

  // Process completed chat and extract files - Core business logic
  private static async processChatCompletion(chatSessionId: string, chatStatus: any): Promise<void> {
    try {
      console.log(`Processing chat completion for session ${chatSessionId}`)

      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: { tool: true },
      })

      if (!chatSession) {
        throw new Error("Chat session not found")
      }

      // Extract demo URL and files from v0 response
      const demoUrl = chatStatus.demo
      const files = chatStatus.files || []

      console.log(`Extracted ${files.length} files and demo URL: ${demoUrl}`)

      // Update chat session with completion data
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          status: "completed",
          demoUrl,
        },
      })

      // Save all generated files
      for (const file of files) {
        await prisma.chatFile.create({
          data: {
            chatSessionId,
            name: file.name,
            content: file.content,
            type: file.type || "text",
            size: file.content.length,
          },
        })
      }

      // Add assistant message about completion
      await prisma.chatMessage.create({
        data: {
          chatSessionId,
          role: "assistant",
          content: `✅ Tool generated successfully! Created ${files.length} files including components, styles, and configuration. Your tool is ready for preview and publishing.`,
        },
      })

      // Update tool with completion data
      const generatedCode = files.map((f: any) => `// ${f.name}\n${f.content}`).join("\n\n")

      await prisma.tool.update({
        where: { id: chatSession.toolId },
        data: {
          status: "GENERATED",
          generationStatus: "completed",
          previewUrl: demoUrl,
          generatedCode,
          v0Code: generatedCode,
          generatedAt: new Date(),
        },
      })

      console.log(`Tool ${chatSession.toolId} generation completed successfully`)
    } catch (error) {
      console.error("Error processing chat completion:", error)

      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: {
          status: "error",
          error: "Failed to process completion",
        },
      })
    }
  }

  // Get chat session with messages and files - For UI display
  static async getChatSession(chatSessionId: string): Promise<ChatSession | null> {
    try {
      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
          files: {
            orderBy: { createdAt: "asc" },
          },
        },
      })

      if (!chatSession) {
        return null
      }

      return {
        id: chatSession.id,
        toolId: chatSession.toolId,
        userId: chatSession.userId,
        organizationId: chatSession.organizationId,
        v0ChatId: chatSession.v0ChatId || undefined,
        status: chatSession.status,
        messages: chatSession.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
          createdAt: msg.createdAt,
        })),
        files: chatSession.files.map((file: any) => ({
          id: file.id,
          name: file.name,
          content: file.content,
          type: file.type,
          size: file.size,
          createdAt: file.createdAt,
        })),
        demoUrl: chatSession.demoUrl || undefined,
        error: chatSession.error || undefined,
        createdAt: chatSession.createdAt,
        updatedAt: chatSession.updatedAt,
      }
    } catch (error) {
      console.error("Error getting chat session:", error)
      return null
    }
  }

  // Add message to chat session - For user interactions
  static async addMessage(
    chatSessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    userId?: string,
  ): Promise<ChatMessage> {
    try {
      const message = await prisma.chatMessage.create({
        data: {
          chatSessionId,
          role,
          content,
          userId,
        },
      })

      // Return with proper type casting
      return {
        id: message.id,
        role: message.role as "user" | "assistant" | "system",
        content: message.content,
        createdAt: message.createdAt,
      }
    } catch (error) {
      console.error("Error adding message:", error)
      throw new Error("Failed to add message")
    }
  }

  // Get chat messages - For conversation history
  static async getMessages(chatSessionId: string): Promise<ChatMessage[]> {
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { chatSessionId },
        orderBy: { createdAt: "asc" },
      })

      return messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
        createdAt: msg.createdAt,
      }))
    } catch (error) {
      console.error("Error getting messages:", error)
      return []
    }
  }

  // Get chat files - For code display
  static async getFiles(chatSessionId: string): Promise<ChatFile[]> {
    try {
      const files = await prisma.chatFile.findMany({
        where: { chatSessionId },
        orderBy: { createdAt: "asc" },
      })

      return files.map((file) => ({
        id: file.id,
        name: file.name,
        content: file.content,
        type: file.type,
        size: file.size,
        createdAt: file.createdAt,
      }))
    } catch (error) {
      console.error("Error getting files:", error)
      return []
    }
  }

  // Delete chat session and related data - For cleanup
  static async deleteChatSession(chatSessionId: string): Promise<void> {
    try {
      await prisma.$transaction([
        prisma.chatFile.deleteMany({
          where: { chatSessionId },
        }),
        prisma.chatMessage.deleteMany({
          where: { chatSessionId },
        }),
        prisma.chatSession.delete({
          where: { id: chatSessionId },
        }),
      ])
    } catch (error) {
      console.error("Error deleting chat session:", error)
      throw new Error("Failed to delete chat session")
    }
  }

  // Calculate progress based on generation status - For UI progress bars
  static calculateProgress(status: string, generationStatus?: string): number {
    if (status === "completed") return 100
    if (status === "error") return 0

    switch (generationStatus) {
      case "pending":
        return 5
      case "analyzing":
        return 20
      case "designing":
        return 40
      case "generating":
        return 70
      case "finalizing":
        return 90
      case "completed":
        return 100
      case "error":
        return 0
      default:
        return 10
    }
  }

  // Map v0 status to our generation status
  private static mapV0StatusToGenerationStatus(
    v0Status: string,
  ): "pending" | "analyzing" | "designing" | "generating" | "finalizing" | "completed" | "error" {
    switch (v0Status) {
      case "pending":
        return "analyzing"
      case "processing":
        return "generating"
      case "generating":
        return "generating"
      case "finalizing":
        return "finalizing"
      case "completed":
        return "completed"
      case "error":
        return "error"
      default:
        return "generating"
    }
  }

  // Continue existing chat - For iterative improvements
  static async continueChat(chatSessionId: string, message: string, userId: string): Promise<void> {
    try {
      console.log(`Continuing chat session ${chatSessionId} with new message`)

      const chatSession = await prisma.chatSession.findUnique({
        where: { id: chatSessionId },
      })

      if (!chatSession || !chatSession.v0ChatId) {
        throw new Error("Chat session or v0 chat ID not found")
      }

      // Add user message
      await this.addMessage(chatSessionId, "user", message, userId)

      // Update status to generating
      await prisma.chatSession.update({
        where: { id: chatSessionId },
        data: { status: "generating" },
      })

      // Continue v0 chat
      const updatedChat = await v0PlatformAPI.continueChat(chatSession.v0ChatId, message)

      // Start polling for new completion
      this.pollChatCompletion(chatSessionId)
    } catch (error) {
      console.error("Error continuing chat:", error)
      throw new Error("Failed to continue chat")
    }
  }
}

// Export singleton instance
export const chatManager = new ChatManager()
