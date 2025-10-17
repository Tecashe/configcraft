// import { createClient } from "v0-sdk"
// import type { ChatDetail } from "v0-sdk"

// const v0Client = createClient({
//   apiKey: "v1:2O1ufiQWUtqtytK816dVv9fP:gyo8fnHgKRFV0bYsg6UP6gWn",
// })

// export interface StreamEvent {
//   type: "chunk" | "file" | "complete" | "error"
//   data: any
//   timestamp: number
// }

// export interface AdvancedGenerationOptions {
//   toolName: string
//   category: string
//   requirements: string
//   organizationSlug: string
//   userEmail: string
//   integrations?: string[]
//   systemPrompt?: string
//   attachments?: Array<{ url: string }>
//   modelConfig?: {
//     modelId?: string
//     imageGenerations?: boolean
//   }
//   chatPrivacy?: "public" | "private"
// }

// export class V0ServiceAdvanced {
//   async generateToolWithStreaming(
//     options: AdvancedGenerationOptions,
//     onEvent: (event: StreamEvent) => void,
//   ): Promise<ChatDetail> {
//     try {
//       const prompt = this.buildComprehensivePrompt(options)

//       onEvent({
//         type: "chunk",
//         data: { message: "Initiating real-time generation..." },
//         timestamp: Date.now(),
//       })

//       // Use streaming mode for real-time updates
//       const response = await v0Client.chats.create({
//         message: prompt,
//         system:
//           options.systemPrompt ||
//           "You are an expert full-stack developer specializing in Next.js, React, and TypeScript.",
//         chatPrivacy: options.chatPrivacy || "private",
//         attachments: options.attachments,
//         modelConfiguration: options.modelConfig,
//         responseMode: "sync", // Using sync for now as streaming needs special handling
//       })

//       onEvent({
//         type: "complete",
//         data: response,
//         timestamp: Date.now(),
//       })

//       return response
//     } catch (error) {
//       onEvent({
//         type: "error",
//         data: { error: error instanceof Error ? error.message : "Unknown error" },
//         timestamp: Date.now(),
//       })
//       throw error
//     }
//   }

//   async continueChat(chatId: string, message: string, onEvent?: (event: StreamEvent) => void): Promise<any> {
//     try {
//       if (onEvent) {
//         onEvent({
//           type: "chunk",
//           data: { message: "Sending message to chat..." },
//           timestamp: Date.now(),
//         })
//       }

//       const response = await v0Client.chats.sendMessage({
//         chatId,
//         message,
//       })

//       if (onEvent) {
//         onEvent({
//           type: "complete",
//           data: response,
//           timestamp: Date.now(),
//         })
//       }

//       return response
//     } catch (error) {
//       if (onEvent) {
//         onEvent({
//           type: "error",
//           data: { error: error instanceof Error ? error.message : "Unknown error" },
//           timestamp: Date.now(),
//         })
//       }
//       throw error
//     }
//   }

//   async getChatHistory(): Promise<any> {
//     return await v0Client.chats.find()
//   }

//   async favoriteChat(chatId: string): Promise<void> {
//     await v0Client.chats.favorite({ chatId })
//   }

//   async unfavoriteChat(chatId: string): Promise<void> {
//     await v0Client.chats.unfavorite({ chatId })
//   }

//   async deleteChat(chatId: string): Promise<void> {
//     await v0Client.chats.delete({ chatId })
//   }

//   async createProject(name: string, description?: string): Promise<any> {
//     return await v0Client.projects.create({
//       name,
//       description,
//     })
//   }

//   async getProjects(): Promise<any> {
//     return await v0Client.projects.find()
//   }

//   async getUserInfo(): Promise<any> {
//     return await v0Client.user.get()
//   }

//   async getUserPlan(): Promise<any> {
//     return await v0Client.user.getPlan()
//   }

//   private buildComprehensivePrompt(options: AdvancedGenerationOptions): string {
//     const { toolName, category, requirements, integrations = [] } = options

//     let prompt = `Create a professional ${category} tool called "${toolName}".\n\n`
//     prompt += `Requirements:\n${requirements}\n\n`

//     if (integrations.length > 0) {
//       prompt += `Integrations to use: ${integrations.join(", ")}\n\n`
//     }

//     prompt += `Technical specifications:\n`
//     prompt += `- Use Next.js 14+ with App Router\n`
//     prompt += `- TypeScript for type safety\n`
//     prompt += `- Tailwind CSS for styling\n`
//     prompt += `- shadcn/ui components for UI\n`
//     prompt += `- Responsive design (mobile-first)\n`
//     prompt += `- Clean, maintainable code with comments\n`
//     prompt += `- Proper error handling\n`
//     prompt += `- Loading states and user feedback\n\n`

//     prompt += `Please create a complete, production-ready implementation.`

//     return prompt
//   }
// }

// export const v0ServiceAdvanced = new V0ServiceAdvanced()

import { createClient } from "v0-sdk"
import type { ChatDetail } from "v0-sdk"

const v0Client = createClient({
  apiKey: "v1:2O1ufiQWUtqtytK816dVv9fP:gyo8fnHgKRFV0bYsg6UP6gWn",
})

export interface StreamEvent {
  type: "chunk" | "file" | "complete" | "error"
  data: any
  timestamp: number
}

type ModelId = "v0-1.5-sm" | "v0-1.5-md" | "v0-1.5-lg" | "v0-gpt-5"

export interface AdvancedGenerationOptions {
  toolName: string
  category: string
  requirements: string
  organizationSlug: string
  userEmail: string
  integrations?: string[]
   existingChatId?: string
  systemPrompt?: string
  attachments?: Array<{ url: string }>
  modelConfig?: {
    modelId?: ModelId
    imageGenerations?: boolean
  }
  chatPrivacy?: "public" | "private"
}

export class V0ServiceAdvanced {
  async generateToolWithStreaming(
    options: AdvancedGenerationOptions,
    onEvent: (event: StreamEvent) => void,
  ): Promise<ChatDetail> {
    try {
      const prompt = this.buildComprehensivePrompt(options)

      onEvent({
        type: "chunk",
        data: { message: "Initiating real-time generation..." },
        timestamp: Date.now(),
      })

      // Use streaming mode for real-time updates
      const response = await v0Client.chats.create({
        message: prompt,
        system:
          options.systemPrompt ||
          "You are an expert full-stack developer specializing in Next.js, React, and TypeScript.",
        chatPrivacy: options.chatPrivacy || "private",
        attachments: options.attachments,
        modelConfiguration: options.modelConfig
          ? {
              modelId: options.modelConfig.modelId as ModelId,
              imageGenerations: options.modelConfig.imageGenerations,
            }
          : undefined,
        responseMode: "sync",
      })

      onEvent({
        type: "complete",
        data: response,
        timestamp: Date.now(),
      })

      return response
    } catch (error) {
      onEvent({
        type: "error",
        data: { error: error instanceof Error ? error.message : "Unknown error" },
        timestamp: Date.now(),
      })
      throw error
    }
  }

  async continueChat(chatId: string, message: string, onEvent?: (event: StreamEvent) => void): Promise<any> {
    try {
      if (onEvent) {
        onEvent({
          type: "chunk",
          data: { message: "Sending message to chat..." },
          timestamp: Date.now(),
        })
      }

      const response = await v0Client.chats.sendMessage({
        chatId,
        message,
      })

      if (onEvent) {
        onEvent({
          type: "complete",
          data: response,
          timestamp: Date.now(),
        })
      }

      return response
    } catch (error) {
      if (onEvent) {
        onEvent({
          type: "error",
          data: { error: error instanceof Error ? error.message : "Unknown error" },
          timestamp: Date.now(),
        })
      }
      throw error
    }
  }

  async getChatHistory(): Promise<any> {
    return await v0Client.chats.find()
  }

  async favoriteChat(chatId: string): Promise<void> {
    await v0Client.chats.favorite({ chatId, isFavorite: true })
  }

  async unfavoriteChat(chatId: string): Promise<void> {
    await v0Client.chats.favorite({ chatId, isFavorite: false })
  }

  async deleteChat(chatId: string): Promise<void> {
    await v0Client.chats.delete({ chatId })
  }

  async createProject(name: string, description?: string): Promise<any> {
    return await v0Client.projects.create({
      name,
      description,
    })
  }

  async getProjects(): Promise<any> {
    return await v0Client.projects.find()
  }

  async getUserInfo(): Promise<any> {
    return await v0Client.user.get()
  }

  async getUserPlan(): Promise<any> {
    return await v0Client.user.getPlan()
  }

  private buildComprehensivePrompt(options: AdvancedGenerationOptions): string {
    const { toolName, category, requirements, integrations = [] } = options

    let prompt = `Create a professional ${category} tool called "${toolName}".\n\n`
    prompt += `Requirements:\n${requirements}\n\n`

    if (integrations.length > 0) {
      prompt += `Integrations to use: ${integrations.join(", ")}\n\n`
    }

    prompt += `Technical specifications:\n`
    prompt += `- Use Next.js 14+ with App Router\n`
    prompt += `- TypeScript for type safety\n`
    prompt += `- Tailwind CSS for styling\n`
    prompt += `- shadcn/ui components for UI\n`
    prompt += `- Responsive design (mobile-first)\n`
    prompt += `- Clean, maintainable code with comments\n`
    prompt += `- Proper error handling\n`
    prompt += `- Loading states and user feedback\n\n`

    prompt += `Please create a complete, production-ready implementation.`

    return prompt
  }
}

export const v0ServiceAdvanced = new V0ServiceAdvanced()
