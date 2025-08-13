interface V0GenerationRequest {
  prompt: string
  model?: string
  temperature?: number
}

interface V0GenerationResponse {
  id: string
  code: string
  preview_url: string
  status: "generating" | "completed" | "error"
  error?: string
}

export class V0ApiService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.V0_API_KEY || ""
    this.baseUrl = process.env.V0_API_URL || "https://api.v0.dev"

    if (!this.apiKey) {
      throw new Error("V0_API_KEY environment variable is required")
    }
  }

  async generateTool(prompt: string): Promise<V0GenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: "gpt-4",
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("V0 API generation error:", error)
      throw new Error("Failed to generate tool with V0 API")
    }
  }

  async getGenerationStatus(generationId: string): Promise<V0GenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate/${generationId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`V0 API error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("V0 API status check error:", error)
      throw new Error("Failed to check generation status")
    }
  }
}

export function processRequirements(userInput: string, toolName: string): string {
  return `
Create a professional business application for: ${toolName}

Requirements: ${userInput}

Generate a complete React application with:
- Modern, clean interface using Tailwind CSS with dark theme (#121212 background, #E0E0E0 text)
- Fully responsive design for desktop and mobile
- Professional form inputs for data entry with proper validation
- Interactive table/list views for data display with sorting and filtering
- Complete CRUD operations (Create, Read, Update, Delete)
- Professional styling with excellent UX and accessibility
- Include realistic sample data to demonstrate all functionality
- Use modern React patterns with hooks and proper state management
- Add loading states, error handling, and success feedback
- Include a professional header with navigation
- Make it production-ready with proper TypeScript types

The application should be a complete, working business tool that users can immediately start using for their specific needs.

Style requirements:
- Use dark theme with #121212 background
- Primary text: #E0E0E0
- Secondary text: #B0B0B0  
- Borders: #444444
- Accent color: #888888
- Professional, modern design
- Excellent contrast and readability
- Smooth animations and transitions
`
}

export const v0Api = new V0ApiService()
