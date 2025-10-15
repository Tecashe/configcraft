import type { NextRequest } from "next/server"
import { createClient } from "v0-sdk"

const v0Client = createClient({
  apiKey: "v1:2O1ufiQWUtqtytK816dVv9fP:gyo8fnHgKRFV0bYsg6UP6gWn",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolName, requirements, category, userEmail } = body

    console.log("[v0-api] Starting server-side generation for:", toolName)

    // Build comprehensive prompt
    const prompt = buildToolPrompt(toolName, requirements, category)

    console.log("[v0-api] Calling v0.chats.create")

    const chatResponse = await v0Client.chats.create({
      message: prompt,
      system:
        "You are an expert React and TypeScript developer who creates professional business applications with modern UI/UX patterns. Always generate complete, production-ready code with proper error handling, TypeScript types, and responsive design.",
      chatPrivacy: "private",
      responseMode: "async",
      modelConfiguration: {
        modelId: "v0-1.5-md",
        imageGenerations: false,
        thinking: false,
      },
    })

    console.log("[v0-api] Response received from v0 API")

    const files = mapSdkFilesToToolFiles(chatResponse.files)
    const linesOfCode = calculateLinesOfCode(files)

    const result = {
      success: true,
      chatId: chatResponse.id,
      files,
      previewUrl: null, // v0 SDK doesn't provide previewUrl in ChatDetail
      metrics: {
        linesOfCode,
        filesGenerated: files.length,
        componentsCreated: files.filter((f) => f.name.includes("component") || f.name.includes("Component")).length,
      },
    }

    console.log("[v0-api] Generation completed successfully:", {
      chatId: result.chatId,
      filesCount: files.length,
      linesOfCode,
    })

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("[v0-api] Server-side generation error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Generation failed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

function buildToolPrompt(toolName: string, requirements: string, category: string): string {
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

  return prompt.trim()
}

function mapSdkFilesToToolFiles(
  sdkFiles: any[] | undefined,
): Array<{ name: string; content: string; type?: string; path?: string }> {
  if (!sdkFiles || !Array.isArray(sdkFiles)) {
    return []
  }

  return sdkFiles.map((file: any, index: number) => ({
    name: file?.name ?? file?.meta?.name ?? `file-${index + 1}.tsx`,
    content: file?.content ?? file?.source ?? "",
    type: file?.type ?? file?.lang ?? "typescript",
    path: file?.path ?? undefined,
  }))
}

function calculateLinesOfCode(files: Array<{ content: string }>): number {
  return files.reduce((total, file) => {
    return total + file.content.split("\n").length
  }, 0)
}
