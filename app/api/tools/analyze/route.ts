import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

const analyzeSchema = z.object({
  requirements: z.string().min(20, "Requirements must be at least 20 characters long"),
  context: z.array(z.string()).optional().default([]),
})
//TODO
// Mock AI analysis service - replace with actual implementation
const mockAnalyzeRequirements = async (requirements: string) => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    complexity: "medium",
    estimatedHours: 4,
    suggestedTechnologies: ["React", "TypeScript", "Tailwind CSS"],
    features: ["User authentication", "Data visualization", "Export functionality", "Responsive design"],
    followUpQuestions: [
      "What type of data will users be working with?",
      "Do you need real-time updates?",
      "What export formats are required?",
      "Are there any specific design requirements?",
    ],
    v0Prompt: `Create a ${requirements.split(" ").slice(0, 10).join(" ")}... tool with modern UI components`,
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { requirements, context } = analyzeSchema.parse(body)

    console.log("Analyzing requirements:", requirements.substring(0, 100) + "...")

    // Use mock analysis for now - replace with actual AI service
    const analysis = await mockAnalyzeRequirements(requirements)

    // Generate follow-up questions if context is provided
    let followUpQuestions = analysis.followUpQuestions
    if (context.length > 0) {
      followUpQuestions = [
        "Based on your previous context, do you need integration with existing systems?",
        "What specific workflows should be automated?",
        "Are there any compliance requirements to consider?",
        "What level of user permissions do you need?",
      ]
    }

    return NextResponse.json({
      analysis: {
        ...analysis,
        followUpQuestions,
      },
    })
  } catch (error) {
    console.error("Requirements analysis error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to analyze requirements" }, { status: 500 })
  }
}
