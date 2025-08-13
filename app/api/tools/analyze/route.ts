import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { openai } from "@/lib/openai"

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireCompany()
    const body = await req.json()
    const { description } = body

    if (!description || description.length < 10) {
      return NextResponse.json({ error: "Description too short" }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a business analyst. Analyze user requirements and provide helpful suggestions for improving their tool description. Be concise and actionable.",
        },
        {
          role: "user",
          content: `Analyze this tool requirement and suggest improvements: "${description}"`,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    })

    const suggestions =
      completion.choices[0]?.message?.content ||
      "Consider adding more details about user roles, data fields, and desired workflows."

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({
      suggestions:
        "Consider mentioning specific integrations you need (Slack, Salesforce, etc.) and any approval workflows required.",
    })
  }
}
