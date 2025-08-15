// v0 Platform API Types based on official documentation
export interface V0ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface V0ChatRequest {
  model: "v0-1.5-md" | "v0-1.5-lg"
  messages: V0ChatMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface V0ChatResponse {
  id: string
  object: "chat.completion"
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: "assistant"
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface V0Chat {
  id: string
  demo?: string
  files: Array<{
    name: string
    content: string
    type: string
  }>
  status: "generating" | "completed" | "error"
  error?: string
}

export interface V0StreamChunk {
  id: string
  object: "chat.completion.chunk"
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: "assistant"
      content?: string
    }
    finish_reason?: string
  }>
}

// Production-ready v0 Platform API Service
export class V0PlatformAPI {
  private apiKey: string
  private baseUrl = "https://api.v0.dev"

  constructor() {
    this.apiKey = process.env.V0_API_KEY || ""

    if (!this.apiKey) {
      console.warn("V0_API_KEY not found - v0 Platform API will not work")
    }
  }

  // Create a new chat with v0 Platform API
  async createChat(message: string, model: "v0-1.5-md" | "v0-1.5-lg" = "v0-1.5-md"): Promise<V0Chat> {
    if (!this.apiKey) {
      throw new Error("V0_API_KEY is required for v0 Platform API")
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          stream: false,
          temperature: 0.7,
          max_tokens: 32000,
        } as V0ChatRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("v0 Platform API error:", response.status, errorText)
        throw new Error(`v0 Platform API error: ${response.status} ${response.statusText}`)
      }

      const chatResponse: V0ChatResponse = await response.json()

      // Extract chat ID and demo URL from response
      const chatId = chatResponse.id
      const generatedContent = chatResponse.choices[0]?.message?.content || ""

      // Parse the generated content to extract files and demo URL
      const files = this.parseGeneratedFiles(generatedContent)
      const demoUrl = await this.getDemoUrl(chatId)

      return {
        id: chatId,
        demo: demoUrl,
        files,
        status: "completed",
      }
    } catch (error) {
      console.error("v0 Platform API error:", error)
      throw new Error(`Failed to create chat: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Create streaming chat for real-time updates
  async createStreamingChat(
    message: string,
    onChunk: (chunk: V0StreamChunk) => void,
    model: "v0-1.5-md" | "v0-1.5-lg" = "v0-1.5-md",
  ): Promise<V0Chat> {
    if (!this.apiKey) {
      throw new Error("V0_API_KEY is required for v0 Platform API")
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 32000,
        } as V0ChatRequest),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`v0 Platform API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body reader available")
      }

      let chatId = ""
      let fullContent = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split("\n").filter((line) => line.trim() !== "")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") continue

              try {
                const parsed: V0StreamChunk = JSON.parse(data)
                chatId = parsed.id

                const content = parsed.choices[0]?.delta?.content
                if (content) {
                  fullContent += content
                }

                onChunk(parsed)
              } catch (parseError) {
                console.warn("Failed to parse streaming chunk:", parseError)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Parse the final content
      const files = this.parseGeneratedFiles(fullContent)
      const demoUrl = await this.getDemoUrl(chatId)

      return {
        id: chatId,
        demo: demoUrl,
        files,
        status: "completed",
      }
    } catch (error) {
      console.error("v0 Platform streaming API error:", error)
      throw new Error(`Failed to create streaming chat: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
   //TODO
  // Get demo URL for a chat
  async getDemoUrl(chatId: string): Promise<string | undefined> {
    try {
      // The demo URL is typically available at a predictable endpoint
      return `https://v0.dev/chat/${chatId}`
    } catch (error) {
      console.warn("Failed to get demo URL:", error)
      return undefined
    }
  }

  // Get chat status and files
  async getChatStatus(chatId: string): Promise<V0Chat> {
    if (!this.apiKey) {
      throw new Error("V0_API_KEY is required for v0 Platform API")
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to get chat status: ${response.status} ${response.statusText}`)
      }

      const chat: V0Chat = await response.json()
      return chat
    } catch (error) {
      console.error("Failed to get chat status:", error)
      throw new Error(`Failed to get chat status: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Continue a chat conversation
  async continueChat(chatId: string, message: string): Promise<V0Chat> {
    if (!this.apiKey) {
      throw new Error("V0_API_KEY is required for v0 Platform API")
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "v0-1.5-md",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          chat_id: chatId, // Continue existing chat
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to continue chat: ${response.status} ${response.statusText}`)
      }

      const chatResponse: V0ChatResponse = await response.json()
      const generatedContent = chatResponse.choices[0]?.message?.content || ""

      const files = this.parseGeneratedFiles(generatedContent)
      const demoUrl = await this.getDemoUrl(chatId)

      return {
        id: chatId,
        demo: demoUrl,
        files,
        status: "completed",
      }
    } catch (error) {
      console.error("Failed to continue chat:", error)
      throw new Error(`Failed to continue chat: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Parse generated files from v0 response
  private parseGeneratedFiles(content: string): Array<{ name: string; content: string; type: string }> {
    const files: Array<{ name: string; content: string; type: string }> = []

    // Parse code blocks from the response
    const codeBlockRegex = /```(\w+)?\s*(?:file="([^"]+)")?\s*\n([\s\S]*?)\n```/g
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [, language, filename, code] = match

      if (filename && code) {
        files.push({
          name: filename,
          content: code.trim(),
          type: this.getFileType(filename, language),
        })
      }
    }

    // If no files found, create a default component
    if (files.length === 0 && content.trim()) {
      files.push({
        name: "component.tsx",
        content: content,
        type: "react",
      })
    }

    return files
  }

  // Determine file type from filename and language
  private getFileType(filename: string, language?: string): string {
    const ext = filename.split(".").pop()?.toLowerCase()

    switch (ext) {
      case "tsx":
      case "jsx":
        return "react"
      case "ts":
        return "typescript"
      case "js":
        return "javascript"
      case "css":
        return "css"
      case "json":
        return "json"
      case "md":
        return "markdown"
      default:
        return language || "text"
    }
  }
}

// Export singleton instance
export const v0PlatformAPI = new V0PlatformAPI()
