import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { aiRequirementsService } from "@/lib/openai"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await req.json()
    const { requirements, context = [] } = body

    if (!requirements || requirements.length < 20) {
      return NextResponse.json({ error: "Requirements must be at least 20 characters long" }, { status: 400 })
    }

    console.log("Analyzing requirements:", requirements.substring(0, 100) + "...")

    // Use AI to analyze the requirements
    const analysis = await aiRequirementsService.analyzeRequirements(requirements)

    // Generate follow-up questions if context is provided
    let followUpQuestions = analysis.followUpQuestions
    if (context.length > 0) {
      followUpQuestions = await aiRequirementsService.generateFollowUpQuestions(requirements, context)
    }

    return NextResponse.json({
      analysis: {
        ...analysis,
        followUpQuestions,
      },
    })
  } catch (error) {
    console.error("Requirements analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze requirements" }, { status: 500 })
  }
}
