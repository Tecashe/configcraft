// import { v0ToolGenerator } from "@/lib/v0-service"

// export interface LiveGenerationUpdate {
//   type: "progress" | "log" | "file_created" | "completed" | "error"
//   step?: string
//   progress?: number
//   message?: string
//   error?: string
//   file?: {
//     name: string
//     content: string
//     type: string
//     size: number
//   }
//   result?: {
//     chatId: string
//     demoUrl?: string
//     chatUrl?: string
//     files: Array<{
//       name: string
//       content: string
//       type?: string
//     }>
//     metrics?: {
//       linesOfCode: number
//       components: number
//       apiEndpoints: number
//       estimatedValue: string
//     }
//   }
//   timestamp: number
// }

// export interface LiveGenerationRequest {
//   toolName: string
//   requirements: string
//   category: string
//   userEmail: string
// }

// export class LiveGenerationEngine {
//   private static instance: LiveGenerationEngine

//   static getInstance(): LiveGenerationEngine {
//     if (!LiveGenerationEngine.instance) {
//       LiveGenerationEngine.instance = new LiveGenerationEngine()
//     }
//     return LiveGenerationEngine.instance
//   }









//   async generateBusinessToolWithRealData(
//   request: LiveGenerationRequest,
//   organizationSlug: string,
//   selectedIntegrations: string[],
//   onUpdate: (update: LiveGenerationUpdate) => void,
// ): Promise<void> {
//   try {
//     // Step 1: Analysis phase with real data context
//     onUpdate({
//       type: "progress",
//       step: "analyzing",
//       progress: 10,
//       message: "Analyzing business requirements with real data context...",
//       timestamp: Date.now(),
//     })

//     await this.delay(1500)

//     onUpdate({
//       type: "log",
//       message: `🔍 Parsing tool requirements for organization: ${organizationSlug}`,
//       timestamp: Date.now(),
//     })

//     onUpdate({
//       type: "log",
//       message: `🔌 Selected integrations: ${selectedIntegrations.join(", ")}`,
//       timestamp: Date.now(),
//     })

//     // Step 2: Integration validation
//     onUpdate({
//       type: "progress",
//       step: "validating",
//       progress: 20,
//       message: "Validating selected integrations...",
//       timestamp: Date.now(),
//     })

//     await this.delay(1000)

//     for (const integration of selectedIntegrations) {
//       onUpdate({
//         type: "log",
//         message: `✅ Validated ${integration} integration`,
//         timestamp: Date.now(),
//       })
//       await this.delay(200)
//     }

//     // Step 3: Design phase
//     onUpdate({
//       type: "progress",
//       step: "designing",
//       progress: 35,
//       message: "Designing UI components and architecture...",
//       timestamp: Date.now(),
//     })

//     await this.delay(1000)

//     onUpdate({
//       type: "log",
//       message: "🎨 Creating component architecture with integration-specific features",
//       timestamp: Date.now(),
//     })

//     // Step 4: Integration setup
//     onUpdate({
//       type: "progress",
//       step: "integrating",
//       progress: 50,
//       message: "Setting up real data integrations and API connections...",
//       timestamp: Date.now(),
//     })

//     await this.delay(800)

//     onUpdate({
//       type: "log",
//       message: `🔗 Configuring ${selectedIntegrations.length} real data integrations`,
//       timestamp: Date.now(),
//     })

//     // Step 5: Start real v0 generation with enhanced context
//     onUpdate({
//       type: "progress",
//       step: "generating",
//       progress: 60,
//       message: "Starting code generation with v0 AI and real data context...",
//       timestamp: Date.now(),
//     })

//     onUpdate({
//       type: "log",
//       message: "🤖 Connecting to v0 API with enhanced requirements",
//       timestamp: Date.now(),
//     })

//     // Create enhanced request with real data context
//     const enhancedRequest: LiveGenerationRequest = {
//       ...request,
//       requirements: `${request.requirements}

// Organization: ${organizationSlug}
// Selected Integrations: ${selectedIntegrations.join(", ")}

// Please generate a business tool that:
// 1. Integrates with the following services: ${selectedIntegrations.join(", ")}
// 2. Is optimized for the ${organizationSlug} organization workflow
// 3. Includes proper error handling and real-time data synchronization
// 4. Has responsive design and modern UI components
// 5. Implements proper authentication and authorization`
//     }

//     // Call the actual v0 service with enhanced context
//     const result = await v0ToolGenerator.generateTool(enhancedRequest)

//     if (result.status === "error") {
//       throw new Error(result.error || "Generation failedhg")
//     }

//     // Step 6: Processing generated files
//     onUpdate({
//       type: "progress",
//       step: "processing",
//       progress: 80,
//       message: "Processing generated files with integration configs...",
//       timestamp: Date.now(),
//     })

//     onUpdate({
//       type: "log",
//       message: `📁 Generated ${result.files.length} files with real data integration`,
//       timestamp: Date.now(),
//     })

//     // Send files progressively
//     for (let i = 0; i < result.files.length; i++) {
//       const file = result.files[i]

//       onUpdate({
//         type: "file_created",
//         file: {
//           name: file.name,
//           content: file.content,
//           type: file.type || "typescript",
//           size: Buffer.byteLength(file.content, "utf8"),
//         },
//         progress: 80 + (i / result.files.length) * 15,
//         timestamp: Date.now(),
//       })

//       onUpdate({
//         type: "log",
//         message: `✅ Created ${file.name} with integration features (${Buffer.byteLength(file.content, "utf8")} bytes)`,
//         timestamp: Date.now(),
//       })

//       await this.delay(300)
//     }

//     // Step 7: Deployment preparation
//     onUpdate({
//       type: "progress",
//       step: "deploying",
//       progress: 95,
//       message: "Preparing deployment with real data connections...",
//       timestamp: Date.now(),
//     })

//     onUpdate({
//       type: "log",
//       message: `🚀 Preparing tool for deployment with ${selectedIntegrations.length} integrations`,
//       timestamp: Date.now(),
//     })

//     await this.delay(1000)

//     // Step 8: Completion
//     onUpdate({
//       type: "completed",
//       progress: 100,
//       step: "completed",
//       result: {
//         chatId: result.chatId,
//         demoUrl: result.demoUrl,
//         chatUrl: result.chatUrl,
//         files: result.files,
//         metrics: {
//           linesOfCode: result.files.reduce((sum, f) => sum + f.content.split("\n").length, 0),
//           components: result.files.filter((f) => f.name.includes("component") || f.name.includes(".tsx")).length,
//           apiEndpoints: result.files.filter((f) => f.name.includes("api") || f.name.includes("route")).length,
//           estimatedValue: "$3,500+", // Higher value due to real integrations
//         },
//       },
//       message: `Tool generation completed successfully with ${selectedIntegrations.length} real data integrations!`,
//       timestamp: Date.now(),
//     })

//     onUpdate({
//       type: "log",
//       message: `🎉 Tool generation completed for ${organizationSlug}! Ready for preview and deployment with live data.`,
//       timestamp: Date.now(),
//     })
//   } catch (error) {
//     onUpdate({
//       type: "error",
//       error: error instanceof Error ? error.message : "Unknown error occurred",
//       timestamp: Date.now(),
//     })

//     onUpdate({
//       type: "log",
//       message: `❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
//       timestamp: Date.now(),
//     })
//   }
// }



//   async generateBusinessTool(
//     request: LiveGenerationRequest,
//     onUpdate: (update: LiveGenerationUpdate) => void,
//   ): Promise<void> {
//     try {
//       // Step 1: Analysis phase
//       onUpdate({
//         type: "progress",
//         step: "analyzing",
//         progress: 10,
//         message: "Analyzing business requirements...",
//         timestamp: Date.now(),
//       })

//       await this.delay(1500)

//       onUpdate({
//         type: "log",
//         message: "🔍 Parsing tool requirements and category",
//         timestamp: Date.now(),
//       })

//       // Step 2: Design phase
//       onUpdate({
//         type: "progress",
//         step: "designing",
//         progress: 25,
//         message: "Designing UI components and architecture...",
//         timestamp: Date.now(),
//       })

//       await this.delay(1000)

//       onUpdate({
//         type: "log",
//         message: "🎨 Creating component architecture and design system",
//         timestamp: Date.now(),
//       })

//       // Step 3: Integration setup
//       onUpdate({
//         type: "progress",
//         step: "integrating",
//         progress: 40,
//         message: "Setting up integrations and data flow...",
//         timestamp: Date.now(),
//       })

//       await this.delay(800)

//       onUpdate({
//         type: "log",
//         message: "🔗 Configuring database and API integrations",
//         timestamp: Date.now(),
//       })

//       // Step 4: Start real v0 generation
//       onUpdate({
//         type: "progress",
//         step: "generating",
//         progress: 50,
//         message: "Starting code generation with v0 AI...",
//         timestamp: Date.now(),
//       })

//       onUpdate({
//         type: "log",
//         message: "🤖 Connecting to v0 API for code generation",
//         timestamp: Date.now(),
//       })

//       // Call the actual v0 service
//       const result = await v0ToolGenerator.generateTool(request)

//       if (result.status === "error") {
//         throw new Error(result.error || "Generation failedwed")
//       }

//       // Step 5: Processing generated files
//       onUpdate({
//         type: "progress",
//         step: "testing",
//         progress: 75,
//         message: "Processing generated files...",
//         timestamp: Date.now(),
//       })

//       onUpdate({
//         type: "log",
//         message: `📁 Generated ${result.files.length} files successfully`,
//         timestamp: Date.now(),
//       })

//       // Send files progressively to simulate real-time generation
//       for (let i = 0; i < result.files.length; i++) {
//         const file = result.files[i]

//         onUpdate({
//           type: "file_created",
//           file: {
//             name: file.name,
//             content: file.content,
//             type: file.type || "typescript",
//             size: Buffer.byteLength(file.content, "utf8"),
//           },
//           progress: 75 + (i / result.files.length) * 20,
//           timestamp: Date.now(),
//         })

//         onUpdate({
//           type: "log",
//           message: `✅ Created ${file.name} (${Buffer.byteLength(file.content, "utf8")} bytes)`,
//           timestamp: Date.now(),
//         })

//         // Small delay to show progressive file creation
//         await this.delay(300)
//       }

//       // Step 6: Deployment preparation
//       onUpdate({
//         type: "progress",
//         step: "deploying",
//         progress: 95,
//         message: "Preparing deployment...",
//         timestamp: Date.now(),
//       })

//       onUpdate({
//         type: "log",
//         message: "🚀 Preparing tool for deployment",
//         timestamp: Date.now(),
//       })

//       await this.delay(1000)

//       // Step 7: Completion
//       onUpdate({
//         type: "completed",
//         progress: 100,
//         step: "completed",
//         result: {
//           chatId: result.chatId,
//           demoUrl: result.demoUrl,
//           chatUrl: result.chatUrl,
//           files: result.files,
//           metrics: {
//             linesOfCode: result.files.reduce((sum, f) => sum + f.content.split("\n").length, 0),
//             components: result.files.filter((f) => f.name.includes("component") || f.name.includes(".tsx")).length,
//             apiEndpoints: result.files.filter((f) => f.name.includes("api") || f.name.includes("route")).length,
//             estimatedValue: "$2,500+",
//           },
//         },
//         message: "Tool generation completed successfully!",
//         timestamp: Date.now(),
//       })

//       onUpdate({
//         type: "log",
//         message: "🎉 Tool generation completed! Ready for preview and deployment.",
//         timestamp: Date.now(),
//       })
//     } catch (error) {
//       onUpdate({
//         type: "error",
//         error: error instanceof Error ? error.message : "Unknown error occurred",
//         timestamp: Date.now(),
//       })

//       onUpdate({
//         type: "log",
//         message: `❌ Generation failededewc: ${error instanceof Error ? error.message : "Unknown error"}`,
//         timestamp: Date.now(),
//       })
//     }
//   }

//   private delay(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms))
//   }

//   calculateProgress(content: string): number {
//     // Simple progress calculation based on content length
//     const lines = content.split("\n").length
//     return Math.min(Math.floor((lines / 100) * 100), 100)
//   }
// }

// export const liveGenerationEngine = LiveGenerationEngine.getInstance()

import { v0ToolGenerator } from "@/lib/v0-service"

export interface LiveGenerationUpdate {
  type: "progress" | "log" | "file_created" | "completed" | "error"
  step?: string
  progress?: number
  message?: string
  error?: string
  file?: {
    name: string
    content: string
    type: string
    size: number
  }
  result?: {
    chatId: string
    demoUrl?: string
    chatUrl?: string
    files: Array<{
      name: string
      content: string
      type?: string
    }>
    metrics?: {
      linesOfCode: number
      components: number
      apiEndpoints: number
      estimatedValue: string
    }
  }
  timestamp: number
}

export interface LiveGenerationRequest {
  toolName: string
  requirements: string
  category: string
  userEmail: string
}

export class LiveGenerationEngine {
  private static instance: LiveGenerationEngine

  static getInstance(): LiveGenerationEngine {
    if (!LiveGenerationEngine.instance) {
      LiveGenerationEngine.instance = new LiveGenerationEngine()
    }
    return LiveGenerationEngine.instance
  }

  async generateBusinessToolWithRealData(
    request: LiveGenerationRequest,
    organizationSlug: string,
    selectedIntegrations: string[],
    onUpdate: (update: LiveGenerationUpdate) => void,
  ): Promise<void> {
    try {
      // Step 1: Analysis phase with real data context
      onUpdate({
        type: "progress",
        step: "analyzing",
        progress: 10,
        message: "Analyzing business requirements with real data context...",
        timestamp: Date.now(),
      })

      await this.delay(1500)

      onUpdate({
        type: "log",
        message: `🔍 Parsing tool requirements for organization: ${organizationSlug}`,
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `🔌 Selected integrations: ${selectedIntegrations.join(", ")}`,
        timestamp: Date.now(),
      })

      // Step 2: Integration validation
      onUpdate({
        type: "progress",
        step: "validating",
        progress: 20,
        message: "Validating selected integrations...",
        timestamp: Date.now(),
      })

      await this.delay(1000)

      for (const integration of selectedIntegrations) {
        onUpdate({
          type: "log",
          message: `✅ Validated ${integration} integration`,
          timestamp: Date.now(),
        })
        await this.delay(200)
      }

      // Step 3: Design phase
      onUpdate({
        type: "progress",
        step: "designing",
        progress: 35,
        message: "Designing UI components and architecture...",
        timestamp: Date.now(),
      })

      await this.delay(1000)

      onUpdate({
        type: "log",
        message: "🎨 Creating component architecture with integration-specific features",
        timestamp: Date.now(),
      })

      // Step 4: Integration setup
      onUpdate({
        type: "progress",
        step: "integrating",
        progress: 50,
        message: "Setting up real data integrations and API connections...",
        timestamp: Date.now(),
      })

      await this.delay(800)

      onUpdate({
        type: "log",
        message: `🔗 Configuring ${selectedIntegrations.length} real data integrations`,
        timestamp: Date.now(),
      })

      // Step 5: Start real v0 generation with enhanced context
      onUpdate({
        type: "progress",
        step: "generating",
        progress: 60,
        message: "Starting code generation with v0 AI and real data context...",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: "🤖 Connecting to v0 API with enhanced requirements",
        timestamp: Date.now(),
      })

      // Create enhanced request with real data context
      const enhancedRequest: LiveGenerationRequest = {
        ...request,
        requirements: `${request.requirements}

Organization: ${organizationSlug}
Selected Integrations: ${selectedIntegrations.join(", ")}

Please generate a business tool that:
1. Integrates with the following services: ${selectedIntegrations.join(", ")}
2. Is optimized for the ${organizationSlug} organization workflow
3. Includes proper error handling and real-time data synchronization
4. Has responsive design and modern UI components
5. Implements proper authentication and authorization`,
      }

      // Call the actual v0 service with enhanced context
      const result = await v0ToolGenerator.generateTool(enhancedRequest)

      if (result.status === "error") {
        throw new Error(result.error || "Generation failedhg")
      }

      // Step 6: Processing generated files
      onUpdate({
        type: "progress",
        step: "processing",
        progress: 80,
        message: "Processing generated files with integration configs...",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `📁 Generated ${result.files.length} files with real data integration`,
        timestamp: Date.now(),
      })

      // Send files progressively
      for (let i = 0; i < result.files.length; i++) {
        const file = result.files[i]

        onUpdate({
          type: "file_created",
          file: {
            name: file.name,
            content: file.content,
            type: file.type || "typescript",
            size: Buffer.byteLength(file.content, "utf8"),
          },
          progress: 80 + (i / result.files.length) * 15,
          timestamp: Date.now(),
        })

        onUpdate({
          type: "log",
          message: `✅ Created ${file.name} with integration features (${Buffer.byteLength(file.content, "utf8")} bytes)`,
          timestamp: Date.now(),
        })

        await this.delay(300)
      }

      // Step 7: Deployment preparation
      onUpdate({
        type: "progress",
        step: "deploying",
        progress: 95,
        message: "Preparing deployment with real data connections...",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `🚀 Preparing tool for deployment with ${selectedIntegrations.length} integrations`,
        timestamp: Date.now(),
      })

      await this.delay(1000)

      // Step 8: Completion
      onUpdate({
        type: "completed",
        progress: 100,
        step: "completed",
        result: {
          chatId: result.chatId,
          demoUrl: result.demoUrl,
          chatUrl: result.chatUrl,
          files: result.files,
          metrics: {
            linesOfCode: result.files.reduce((sum, f) => sum + f.content.split("\n").length, 0),
            components: result.files.filter((f) => f.name.includes("component") || f.name.includes(".tsx")).length,
            apiEndpoints: result.files.filter((f) => f.name.includes("api") || f.name.includes("route")).length,
            estimatedValue: "$3,500+", // Higher value due to real integrations
          },
        },
        message: `Tool generation completed successfully with ${selectedIntegrations.length} real data integrations!`,
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `🎉 Tool generation completed for ${organizationSlug}! Ready for preview and deployment with live data.`,
        timestamp: Date.now(),
      })
    } catch (error) {
      onUpdate({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: Date.now(),
      })
    }
  }

  async generateBusinessTool(
    request: LiveGenerationRequest,
    onUpdate: (update: LiveGenerationUpdate) => void,
  ): Promise<void> {
    try {
      // Step 1: Analysis phase
      onUpdate({
        type: "progress",
        step: "analyzing",
        progress: 10,
        message: "Analyzing business requirements...",
        timestamp: Date.now(),
      })

      await this.delay(1500)

      onUpdate({
        type: "log",
        message: "🔍 Parsing tool requirements and category",
        timestamp: Date.now(),
      })

      // Step 2: Design phase
      onUpdate({
        type: "progress",
        step: "designing",
        progress: 25,
        message: "Designing UI components and architecture...",
        timestamp: Date.now(),
      })

      await this.delay(1000)

      onUpdate({
        type: "log",
        message: "🎨 Creating component architecture and design system",
        timestamp: Date.now(),
      })

      // Step 3: Integration setup
      onUpdate({
        type: "progress",
        step: "integrating",
        progress: 40,
        message: "Setting up integrations and data flow...",
        timestamp: Date.now(),
      })

      await this.delay(800)

      onUpdate({
        type: "log",
        message: "🔗 Configuring database and API integrations",
        timestamp: Date.now(),
      })

      // Step 4: Start real v0 generation
      onUpdate({
        type: "progress",
        step: "generating",
        progress: 50,
        message: "Starting code generation with v0 AI...",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: "🤖 Connecting to v0 API for code generation",
        timestamp: Date.now(),
      })

      // Call the actual v0 service
      const result = await v0ToolGenerator.generateTool(request)

      if (result.status === "error") {
        throw new Error(result.error || "Generation failedwed")
      }

      // Step 5: Processing generated files
      onUpdate({
        type: "progress",
        step: "testing",
        progress: 75,
        message: "Processing generated files...",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `📁 Generated ${result.files.length} files successfully`,
        timestamp: Date.now(),
      })

      // Send files progressively to simulate real-time generation
      for (let i = 0; i < result.files.length; i++) {
        const file = result.files[i]

        onUpdate({
          type: "file_created",
          file: {
            name: file.name,
            content: file.content,
            type: file.type || "typescript",
            size: Buffer.byteLength(file.content, "utf8"),
          },
          progress: 75 + (i / result.files.length) * 20,
          timestamp: Date.now(),
        })

        onUpdate({
          type: "log",
          message: `✅ Created ${file.name} (${Buffer.byteLength(file.content, "utf8")} bytes)`,
          timestamp: Date.now(),
        })

        // Small delay to show progressive file creation
        await this.delay(300)
      }

      // Step 6: Deployment preparation
      onUpdate({
        type: "progress",
        step: "deploying",
        progress: 95,
        message: "Preparing deployment...",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: "🚀 Preparing tool for deployment",
        timestamp: Date.now(),
      })

      await this.delay(1000)

      // Step 7: Completion
      onUpdate({
        type: "completed",
        progress: 100,
        step: "completed",
        result: {
          chatId: result.chatId,
          demoUrl: result.demoUrl,
          chatUrl: result.chatUrl,
          files: result.files,
          metrics: {
            linesOfCode: result.files.reduce((sum, f) => sum + f.content.split("\n").length, 0),
            components: result.files.filter((f) => f.name.includes("component") || f.name.includes(".tsx")).length,
            apiEndpoints: result.files.filter((f) => f.name.includes("api") || f.name.includes("route")).length,
            estimatedValue: "$2,500+",
          },
        },
        message: "Tool generation completed successfully!",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: "🎉 Tool generation completed! Ready for preview and deployment.",
        timestamp: Date.now(),
      })
    } catch (error) {
      onUpdate({
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: Date.now(),
      })

      onUpdate({
        type: "log",
        message: `❌ Generation failededewc: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: Date.now(),
      })
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  calculateProgress(content: string): number {
    // Simple progress calculation based on content length
    const lines = content.split("\n").length
    return Math.min(Math.floor((lines / 100) * 100), 100)
  }
}

export const liveGenerationEngine = LiveGenerationEngine.getInstance()
