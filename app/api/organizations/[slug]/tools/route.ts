// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { ToolGenerator } from "@/lib/tool-generation"

// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug: params.slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//         subscriptions: true,
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const tools = await prisma.tool.findMany({
//       where: { organizationId: organization.id },
//       include: {
//         creator: {
//           select: {
//             firstName: true,
//             lastName: true,
//             imageUrl: true,
//           },
//         },
//         _count: {
//           select: {
//             usageRecords: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return NextResponse.json({
//       tools,
//       subscription: organization.subscriptions[0] || null,
//     })
//   } catch (error) {
//     console.error("Error fetching tools:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug: params.slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//         subscriptions: true,
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     const { name, description, requirements } = await request.json()

//     if (!name || !requirements) {
//       return NextResponse.json({ error: "Name and requirements are required" }, { status: 400 })
//     }

//     // Check subscription limits
//     const subscription = organization.subscriptions[0]
//     if (subscription) {
//       const toolCount = await prisma.tool.count({
//         where: { organizationId: organization.id },
//       })

//       if (toolCount >= subscription.toolsLimit) {
//         return NextResponse.json({ error: "Tool limit reached" }, { status: 403 })
//       }
//     }

//     // Create slug from name
//     const baseSlug = name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-|-$/g, "")
//     let slug = baseSlug
//     let counter = 1

//     // Ensure unique slug
//     while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug } })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }

//     // Create the tool
//     const tool = await prisma.tool.create({
//       data: {
//         name,
//         description,
//         slug,
//         requirements,
//         status: "GENERATING",
//         generationStatus: "pending",
//         createdById: userId,
//         organizationId: organization.id,
//       },
//     })

//     // Start generation process
//     try {
//       const chatSessionId = await ToolGenerator.generateTool(tool.id, requirements, userId, organization.id)

//       return NextResponse.json({
//         tool: {
//           ...tool,
//           chatSessionId,
//         },
//       })
//     } catch (generationError) {
//       console.error("Error starting tool generation:", generationError)

//       // Update tool with error
//       await prisma.tool.update({
//         where: { id: tool.id },
//         data: {
//           status: "ERROR",
//           generationStatus: "error",
//           generationError: generationError instanceof Error ? generationError.message : "Unknown error",
//         },
//       })

//       return NextResponse.json({
//         tool,
//         error: "Tool created but generation failed to start",
//       })
//     }
//   } catch (error) {
//     console.error("Error creating tool:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { v0ToolGenerator } from "@/lib/v0-service"
import { z } from "zod"

const createToolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  description: z.string().optional(),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  category: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Get organization and check membership
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Get tools for this organization
    const tools = await prisma.tool.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        usageRecords: {
          select: { id: true },
        },
      },
    })

    const formattedTools = tools.map((tool) => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.category,
      status: tool.status,
      generationStatus: tool.generationStatus,
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
      previewUrl: tool.previewUrl,
      publishedUrl: tool.publishedUrl,
      generationError: tool.generationError,
      creator: tool.creator,
      usageCount: tool.usageRecords.length,
    }))

    return NextResponse.json(formattedTools)
  } catch (error) {
    console.error("Error fetching tools:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const body = await request.json()
    const validatedData = createToolSchema.parse(body)

    // Get user and organization
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
        subscriptions: {
          where: { status: "ACTIVE" },
        },
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check subscription limits
    const subscription = organization.subscriptions[0]
    if (!subscription) {
      // Check free tier limits
      const toolCount = await prisma.tool.count({
        where: { organizationId: organization.id },
      })

      if (toolCount >= 3) {
        return NextResponse.json(
          {
            error: "Free tier limit reached. Please upgrade to create more tools.",
          },
          { status: 403 },
        )
      }
    }

    // Generate a unique slug
    const baseSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    let slug_generated = baseSlug
    let counter = 1

    while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug: slug_generated } })) {
      slug_generated = `${baseSlug}-${counter}`
      counter++
    }

    // Create the tool with initial status
    const tool = await prisma.tool.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug: slug_generated,
        status: "GENERATING",
        category: validatedData.category || "General",
        requirements: validatedData.requirements,
        generationStatus: "analyzing",
        config: {},
        schema: {},
        ui: {},
        createdById: user.clerkId,
        organizationId: organization.id,
      },
    })

    // Start generation process asynchronously
    generateToolAsync(tool.id, {
      toolName: validatedData.name,
      requirements: validatedData.requirements,
      category: validatedData.category || "General",
      userEmail: user.email,
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId: user.clerkId,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          category: validatedData.category,
        },
      },
    })

    return NextResponse.json({
      success: true,
      toolId: tool.id,
      message: "Tool generation started",
    })
  } catch (error) {
    console.error("Error creating tool:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to create tool",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Async function to handle tool generation
async function generateToolAsync(
  toolId: string,
  request: {
    toolName: string
    requirements: string
    category: string
    userEmail: string
  },
) {
  try {
    console.log(`Starting async generation for tool ${toolId}`)

    // Update status to generating
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATING",
        generationStatus: "analyzing",
      },
    })

    // Generate with v0
    const result = await v0ToolGenerator.generateTool(request)

    if (result.status === "error") {
      throw new Error(result.error || "Generation failed")
    }

    // Extract main component code
    const mainComponent = result.files.find((f) => f.name.includes(".tsx") && !f.name.includes("test"))

    // Update tool with results
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "GENERATED",
        generationStatus: "completed",
        v0Code: mainComponent?.content || "",
        previewUrl: result.demoUrl,
        generatedCode: result.files.map((f) => `// ${f.name}\n${f.content}`).join("\n\n"),
        generatedAt: new Date(),
      },
    })

    // Create chat session record
    if (result.chatId) {
      await prisma.chatSession.create({
        data: {
          toolId,
          userId: (await prisma.tool.findUnique({ where: { id: toolId } }))?.createdById || "",
          organizationId:
            (
              await prisma.tool.findUnique({
                where: { id: toolId },
                include: { organization: true },
              })
            )?.organizationId || "",
          v0ChatId: result.chatId,
          status: "completed",
          demoUrl: result.demoUrl,
        },
      })
    }

    console.log(`Tool ${toolId} generation completed successfully`)
  } catch (error) {
    console.error(`Async generation error for tool ${toolId}:`, error)

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
