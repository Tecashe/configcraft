// import { type NextRequest, NextResponse } from "next/server"
// import { requireCompany } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"
// import { generateToolWithAI } from "@/lib/openai"
// import { STRIPE_PLANS } from "@/lib/stripe"

// export async function POST(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const body = await req.json()
//     const { description, category } = body

//     if (!description || description.length < 20) {
//       return NextResponse.json({ error: "Description must be at least 20 characters" }, { status: 400 })
//     }

//     // Check subscription limits
//     const subscription = await prisma.subscription.findFirst({
//       where: { companyId: company.id },
//       orderBy: { createdAt: "desc" },
//     })

//     if (!subscription) {
//       return NextResponse.json({ error: "No subscription found" }, { status: 400 })
//     }

//     const planLimits = STRIPE_PLANS[subscription.plan as keyof typeof STRIPE_PLANS]
//     const currentToolCount = await prisma.tool.count({
//       where: { companyId: company.id, status: { not: "ARCHIVED" } },
//     })

//     if (currentToolCount >= planLimits.toolLimit) {
//       return NextResponse.json(
//         { error: `Tool limit reached. Upgrade your plan to create more tools.` },
//         { status: 403 },
//       )
//     }

//     const generatedTool = await generateToolWithAI(description, category)

//     // Create tool in database
//     const tool = await prisma.tool.create({
//       data: {
//         ...generatedTool,
//         slug: generatedTool.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
//         creatorId: user.id,
//         companyId: company.id,
//         status: "GENERATED",
//       },
//     })

//     // Track usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_CREATED",
//         userId: user.id,
//         companyId: company.id,
//         toolId: tool.id,
//         metadata: {
//           generatedFromDescription: true,
//           aiGenerated: true,
//           originalDescription: description,
//           category: category || "General",
//         },
//       },
//     })

//     return NextResponse.json(tool)
//   } catch (error) {
//     console.error("Tool generation error:", error)

//     // Return more specific error messages
//     if (error instanceof Error) {
//       if (error.message.includes("OpenAI")) {
//         return NextResponse.json({ error: "AI service temporarily unavailable. Please try again." }, { status: 503 })
//       }
//       if (error.message.includes("JSON")) {
//         return NextResponse.json(
//           { error: "Tool generation failed. Please try with a different description." },
//           { status: 400 },
//         )
//       }
//     }

//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { v0Api, processRequirements } from "@/lib/v0-api"
import { STRIPE_PLANS } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { name, description, requirements, category } = body

    if (!name || !requirements || requirements.length < 20) {
      return NextResponse.json(
        {
          error: "Tool name and requirements (minimum 20 characters) are required",
        },
        { status: 400 },
      )
    }

    // Check subscription limits
    const subscription = await prisma.subscription.findFirst({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 })
    }

    const planLimits = STRIPE_PLANS[subscription.plan as keyof typeof STRIPE_PLANS]
    const currentToolCount = await prisma.tool.count({
      where: { companyId: company.id, status: { not: "ARCHIVED" } },
    })

    if (currentToolCount >= planLimits.toolLimit) {
      return NextResponse.json(
        { error: `Tool limit reached. Upgrade your plan to create more tools.` },
        { status: 403 },
      )
    }

    // Create tool record first
    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        requirements,
        category: category || "Custom",
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        creatorId: user.id,
        companyId: company.id,
        status: "GENERATING",
        generationStatus: "generating",
        config: {},
        schema: {},
        ui: {},
      },
    })

    // Process requirements into v0 prompt
    const v0Prompt = processRequirements(requirements, name)

    // Update tool with processed prompt
    await prisma.tool.update({
      where: { id: tool.id },
      data: { v0Prompt },
    })

    // Start v0 generation (async)
    generateToolAsync(tool.id, v0Prompt, user.id, company.id)

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId: user.id,
        companyId: company.id,
        toolId: tool.id,
        metadata: {
          generatedFromDescription: true,
          aiGenerated: true,
          originalRequirements: requirements,
          category: category || "Custom",
        },
      },
    })

    return NextResponse.json({
      toolId: tool.id,
      status: "generating",
      message: "Tool generation started successfully",
    })
  } catch (error) {
    console.error("Tool generation error:", error)

    if (error instanceof Error) {
      if (error.message.includes("V0 API")) {
        return NextResponse.json(
          {
            error: "AI service temporarily unavailable. Please try again.",
          },
          { status: 503 },
        )
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Async function to handle v0 generation
async function generateToolAsync(toolId: string, prompt: string, userId: string, companyId: string) {
  try {
    // Call v0 API
    const result = await v0Api.generateTool(prompt)

    // Update tool with generated code
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATED",
        generationStatus: "generated",
        v0Code: result.code,
        previewUrl: result.preview_url,
        generatedAt: new Date(),
        config: {
          generated: true,
          v0GenerationId: result.id,
        },
        schema: {
          type: "v0Generated",
          generatedAt: new Date().toISOString(),
        },
        ui: {
          theme: "dark",
          generated: true,
        },
      },
    })

    console.log(`Tool ${toolId} generated successfully`)
  } catch (error) {
    console.error(`Tool generation failed for ${toolId}:`, error)

    // Update tool with error status
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "ERROR",
        generationStatus: "error",
        generationError: error instanceof Error ? error.message : "Unknown error",
      },
    })
  }
}
