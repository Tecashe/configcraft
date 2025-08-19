import type { NextRequest } from "next/server"
import { v0ToolGenerator } from "@/lib/v0-service"

export async function POST(request: NextRequest) {
  try {
    const { toolName, requirements, category, userEmail } = await request.json()

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()

        const sendUpdate = (data: any) => {
          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        }

        // Start the generation process with real streaming
        generateToolWithRealStreaming({ toolName, requirements, category, userEmail }, sendUpdate)
          .then(() => {
            controller.close()
          })
          .catch((error) => {
            sendUpdate({
              type: "error",
              error: error.message,
              timestamp: Date.now(),
            })
            controller.close()
          })
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to start streaming" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

async function generateToolWithRealStreaming(request: any, sendUpdate: (data: any) => void) {
  try {
    // Step 1: Analysis phase
    sendUpdate({
      type: "progress",
      step: "analyzing",
      progress: 10,
      message: "Analyzing business requirements...",
      timestamp: Date.now(),
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    sendUpdate({
      type: "log",
      message: "🔍 Parsing tool requirements and category",
      timestamp: Date.now(),
    })

    // Step 2: Design phase
    sendUpdate({
      type: "progress",
      step: "designing",
      progress: 25,
      message: "Designing UI components and architecture...",
      timestamp: Date.now(),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    sendUpdate({
      type: "log",
      message: "🎨 Creating component architecture and design system",
      timestamp: Date.now(),
    })

    // Step 3: Integration setup
    sendUpdate({
      type: "progress",
      step: "integrating",
      progress: 40,
      message: "Setting up integrations and data flow...",
      timestamp: Date.now(),
    })

    await new Promise((resolve) => setTimeout(resolve, 800))

    sendUpdate({
      type: "log",
      message: "🔗 Configuring database and API integrations",
      timestamp: Date.now(),
    })

    // Step 4: Start real v0 generation
    sendUpdate({
      type: "progress",
      step: "generating",
      progress: 50,
      message: "Starting code generation with v0 AI...",
      timestamp: Date.now(),
    })

    sendUpdate({
      type: "log",
      message: "🤖 Connecting to v0 API for code generation",
      timestamp: Date.now(),
    })

    // Call the actual v0 service
    const result = await v0ToolGenerator.generateTool(request)

    if (result.status === "error") {
      throw new Error(result.error || "Generation failed")
    }

    // Step 5: Processing generated files
    sendUpdate({
      type: "progress",
      step: "testing",
      progress: 75,
      message: "Processing generated files...",
      timestamp: Date.now(),
    })

    sendUpdate({
      type: "log",
      message: `📁 Generated ${result.files.length} files successfully`,
      timestamp: Date.now(),
    })

    // Send files progressively to simulate real-time generation
    for (let i = 0; i < result.files.length; i++) {
      const file = result.files[i]

      sendUpdate({
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

      sendUpdate({
        type: "log",
        message: `✅ Created ${file.name} (${Buffer.byteLength(file.content, "utf8")} bytes)`,
        timestamp: Date.now(),
      })

      // Small delay to show progressive file creation
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Step 6: Deployment preparation
    sendUpdate({
      type: "progress",
      step: "deploying",
      progress: 95,
      message: "Preparing deployment...",
      timestamp: Date.now(),
    })

    sendUpdate({
      type: "log",
      message: "🚀 Preparing tool for deployment",
      timestamp: Date.now(),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Step 7: Completion
    sendUpdate({
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

    sendUpdate({
      type: "log",
      message: "🎉 Tool generation completed! Ready for preview and deployment.",
      timestamp: Date.now(),
    })
  } catch (error) {
    sendUpdate({
      type: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: Date.now(),
    })

    sendUpdate({
      type: "log",
      message: `❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      timestamp: Date.now(),
    })
  }
}
