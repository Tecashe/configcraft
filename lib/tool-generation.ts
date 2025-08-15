// import { prisma } from "@/lib/prisma"
// import { ChatManager } from "@/lib/chat-management"
// import { analyzeRequirements } from "@/lib/openai"

// export interface ToolGenerationResult {
//   success: boolean
//   toolId: string
//   chatSessionId?: string
//   error?: string
//   demoUrl?: string
//   files?: any[]
// }

// // Production-ready tool generation system
// export async function startToolGeneration(
//   toolId: string,
//   requirements: string,
//   userId: string,
//   organizationId: string,
// ): Promise<ToolGenerationResult> {
//   try {
//     console.log("Starting tool generation for:", toolId)

//     // Update tool status
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "GENERATING",
//         generationStatus: "analyzing",
//       },
//     })

//     // Step 1: Analyze requirements with OpenAI
//     console.log("Analyzing requirements...")
//     const analysis = await analyzeRequirements(requirements)

//     // Update tool with analysis - fix JSON type issue
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         generationStatus: "designing",
//         v0Prompt: analysis.v0Prompt,
//         config: {
//           analysis: JSON.parse(JSON.stringify(analysis)), // Convert to plain object
//           complexity: analysis.complexity,
//           estimatedHours: analysis.estimatedHours,
//         },
//       },
//     })

//     // Step 2: Create chat session for v0 generation
//     console.log("Creating chat session...")
//     const chatSession = await ChatManager.createChatSession(toolId, userId, organizationId, analysis.v0Prompt)

//     // Step 3: Start v0 generation
//     console.log("Starting v0 generation...")
//     await ChatManager.startV0Generation(chatSession.id, analysis.v0Prompt)

//     // Record usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_INTERACTION",
//         userId,
//         organizationId,
//         toolId,
//         metadata: {
//           action: "generation_started",
//           complexity: analysis.complexity,
//         },
//       },
//     })

//     return {
//       success: true,
//       toolId,
//       chatSessionId: chatSession.id,
//     }
//   } catch (error) {
//     console.error("Tool generation failed:", error)

//     // Update tool with error
//     await prisma.tool.update({
//       where: { id: toolId },
//       data: {
//         status: "ERROR",
//         generationStatus: "error",
//         generationError: error instanceof Error ? error.message : "Generation failed",
//       },
//     })

//     return {
//       success: false,
//       toolId,
//       error: error instanceof Error ? error.message : "Generation failed",
//     }
//   }
// }

// // Enhanced tool regeneration
// export async function regenerateTool(
//   toolId: string,
//   newRequirements: string,
//   userId: string,
// ): Promise<ToolGenerationResult> {
//   try {
//     console.log("Regenerating tool:", toolId)

//     const tool = await prisma.tool.findUnique({
//       where: { id: toolId },
//       include: {
//         chatSessions: {
//           take: 1,
//           orderBy: { createdAt: "desc" },
//         },
//       },
//     })

//     if (!tool) {
//       throw new Error("Tool not found")
//     }

//     // Continue existing chat or create new one
//     if (tool.chatSessions.length > 0) {
//       const chatSession = tool.chatSessions[0]
//       await ChatManager.addMessage(chatSession.id, "user", newRequirements, userId)
//       await ChatManager.startV0Generation(chatSession.id, newRequirements)

//       return {
//         success: true,
//         toolId,
//         chatSessionId: chatSession.id,
//       }
//     } else {
//       // Create new chat session - use organizationId instead of companyId
//       return await startToolGeneration(toolId, newRequirements, userId, tool.organizationId)
//     }
//   } catch (error) {
//     console.error("Tool regeneration failed:", error)
//     return {
//       success: false,
//       toolId,
//       error: error instanceof Error ? error.message : "Regeneration failed",
//     }
//   }
// }

// // Get tool generation status
// export async function getToolGenerationStatus(toolId: string) {
//   try {
//     const tool = await prisma.tool.findUnique({
//       where: { id: toolId },
//       include: {
//         chatSessions: {
//           include: {
//             messages: {
//               orderBy: { createdAt: "desc" },
//               take: 5,
//             },
//             files: true,
//           },
//           orderBy: { createdAt: "desc" },
//           take: 1,
//         },
//       },
//     })

//     if (!tool) {
//       throw new Error("Tool not found")
//     }

//     const chatSession = tool.chatSessions[0]

//     // Calculate progress based on status
//     const progress = calculateGenerationProgress(tool.status, tool.generationStatus)

//     return {
//       id: tool.id,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       progress,
//       error: tool.generationError,
//       previewUrl: tool.previewUrl,
//       demoUrl: chatSession?.demoUrl,
//       files: chatSession?.files || [],
//       messages: chatSession?.messages || [],
//       currentStep: getCurrentStep(tool.generationStatus),
//       chatSession: chatSession
//         ? {
//             id: chatSession.id,
//             status: chatSession.status,
//             demoUrl: chatSession.demoUrl,
//             error: chatSession.error,
//           }
//         : null,
//     }
//   } catch (error) {
//     console.error("Failed to get tool status:", error)
//     throw error
//   }
// }

// // Calculate generation progress
// export function calculateGenerationProgress(status: string, generationStatus?: string | null): number {
//   if (status === "GENERATED" || status === "PUBLISHED") return 100
//   if (status === "ERROR") return 0

//   switch (generationStatus) {
//     case "pending":
//       return 5
//     case "analyzing":
//       return 15
//     case "designing":
//       return 35
//     case "generating":
//       return 65
//     case "finalizing":
//       return 85
//     case "completed":
//       return 100
//     case "error":
//       return 0
//     default:
//       return 10
//   }
// }

// // Get current step for UI display
// function getCurrentStep(generationStatus?: string | null): string {
//   switch (generationStatus) {
//     case "analyzing":
//       return "analyzing"
//     case "designing":
//       return "designing"
//     case "generating":
//       return "generating"
//     case "finalizing":
//     case "completed":
//       return "finalizing"
//     case "error":
//       return "error"
//     default:
//       return "pending"
//   }
// }


import { prisma } from "@/lib/prisma"
import { ChatManager } from "@/lib/chat-management"
import { analyzeRequirements, type RequirementsAnalysis } from "@/lib/openai"

export interface ToolGenerationConfig {
  analysis: RequirementsAnalysis
  complexity: "simple" | "medium" | "complex"
  estimatedHours: number
}

// Main tool generation system for ConfigCraft
export class ToolGenerator {
  // Generate v0 prompt from analysis
  static generateV0Prompt(analysis: RequirementsAnalysis, toolName: string): string {
    const prompt = `
Create a modern, professional business tool called "${toolName}" with the following specifications:

## Overview
${analysis.summary}

## Key Features
${analysis.features.map((feature) => `- ${feature}`).join("\n")}

## User Interface Requirements
- Layout: ${analysis.userInterface.layout}
- Pages: ${analysis.userInterface.pages.join(", ")}
- Components: ${analysis.userInterface.components.join(", ")}

## Data Models
${analysis.dataModels
  .map(
    (model) => `
### ${model.name}
${model.fields.map((field) => `- ${field.name}: ${field.type}${field.required ? " (required)" : ""}`).join("\n")}
`,
  )
  .join("\n")}

## Technical Requirements
- Use React with TypeScript
- Use Tailwind CSS for styling
- Make it responsive and mobile-friendly
- Include proper form validation
- Add loading states and error handling
- Use modern UI patterns and components

## Design Guidelines
- Clean, professional design
- Consistent spacing and typography
- Accessible color scheme
- Intuitive navigation
- Clear call-to-action buttons

Please create a complete, functional tool that includes:
1. Main dashboard/overview page
2. Data entry forms
3. List/table views
4. Detail views
5. Navigation between sections
6. Proper state management
7. Error handling and validation

Make it production-ready with proper TypeScript types, error boundaries, and responsive design.
`

    return prompt.trim()
  }

  // Start tool generation process
  static async generateTool(
    toolId: string,
    requirements: string,
    userId: string,
    organizationId: string,
  ): Promise<string> {
    try {
      console.log(`Starting tool generation for tool ${toolId}`)

      // Step 1: Analyze requirements using the imported function
      const analysis = await analyzeRequirements(requirements)

      // Step 2: Update tool with analysis
      const config: ToolGenerationConfig = {
        analysis,
        complexity: analysis.complexity,
        estimatedHours: analysis.estimatedHours,
      }

      await prisma.tool.update({
        where: { id: toolId },
        data: {
          config: JSON.parse(JSON.stringify(config)), // Convert to plain object for Prisma
          generationStatus: "analyzing",
          analysisData: JSON.stringify(analysis),
        },
      })

      // Step 3: Get tool details for prompt generation
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
      })

      if (!tool) {
        throw new Error("Tool not found")
      }

      // Step 4: Generate v0 prompt
      const v0Prompt = this.generateV0Prompt(analysis, tool.name)

      // Step 5: Update tool with prompt
      await prisma.tool.update({
        where: { id: toolId },
        data: {
          v0Prompt,
          generationStatus: "designing",
        },
      })

      // Step 6: Create chat session
      const chatSession = await ChatManager.createChatSession(toolId, userId, organizationId, v0Prompt)

      // Step 7: Start v0 generation
      await ChatManager.startV0Generation(chatSession.id, v0Prompt)

      console.log(`Tool generation started for ${toolId} with chat session ${chatSession.id}`)
      return chatSession.id
    } catch (error) {
      console.error("Error generating tool:", error)

      // Update tool with error
      await prisma.tool.update({
        where: { id: toolId },
        data: {
          status: "ERROR",
          generationStatus: "error",
          generationError: error instanceof Error ? error.message : "Unknown error",
        },
      })

      throw error
    }
  }

  // Get generation progress
  static async getGenerationProgress(toolId: string): Promise<{
    status: string
    progress: number
    generationStatus?: string
    error?: string
  }> {
    try {
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
        include: {
          chatSessions: {
            include: {
              messages: {
                orderBy: { createdAt: "desc" },
                take: 5,
              },
              files: true,
            },
          },
        },
      })

      if (!tool) {
        throw new Error("Tool not found")
      }

      const progress = ChatManager.calculateProgress(tool.status, tool.generationStatus || undefined)

      return {
        status: tool.status,
        progress,
        generationStatus: tool.generationStatus || undefined,
        error: tool.generationError || undefined,
      }
    } catch (error) {
      console.error("Error getting generation progress:", error)
      return {
        status: "ERROR",
        progress: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Regenerate tool with new requirements
  static async regenerateTool(
    toolId: string,
    newRequirements: string,
    userId: string,
    organizationId: string,
  ): Promise<string> {
    try {
      console.log(`Regenerating tool ${toolId} with new requirements`)

      // Reset tool status
      await prisma.tool.update({
        where: { id: toolId },
        data: {
          status: "GENERATING",
          generationStatus: "pending",
          generationError: null,
          requirements: newRequirements,
        },
      })

      // Start new generation process
      return await this.generateTool(toolId, newRequirements, userId, organizationId)
    } catch (error) {
      console.error("Error regenerating tool:", error)
      throw error
    }
  }
}

// Export singleton instance
export const toolGenerator = new ToolGenerator()
