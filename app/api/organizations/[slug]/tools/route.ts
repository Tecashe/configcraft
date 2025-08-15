// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { getOrganizationBySlug } from "@/lib/organization"
// import { prisma } from "@/lib/prisma"
// import { chatManager } from "@/lib/chat-management"

// export async function GET(request: Request, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access to this organization
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId: userId,
//         organizationId: organization.id,
//         status: "ACTIVE",
//       },
//     })

//     if (!membership) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     const tools = await prisma.tool.findMany({
//       where: { organizationId: organization.id },
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         category: true,
//         status: true,
//         generationStatus: true,
//         createdAt: true,
//         updatedAt: true,
//         previewUrl: true,
//         publishedUrl: true,
//         generationError: true,
//         slug: true,
//         isPublic: true,
//         version: true,
//       },
//     })

//     return NextResponse.json(tools)
//   } catch (error) {
//     console.error("Failed to fetch tools:", error)
//     return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
//   }
// }

// export async function POST(request: Request, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access to this organization
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId: userId,
//         organizationId: organization.id,
//         status: "ACTIVE",
//         role: { in: ["OWNER", "ADMIN", "MEMBER"] },
//       },
//     })

//     if (!membership) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     // Check subscription limits
//     const subscription = await prisma.subscription.findUnique({
//       where: { organizationId: organization.id },
//     })

//     if (!subscription) {
//       return NextResponse.json({ error: "No subscription found" }, { status: 400 })
//     }

//     // Count existing tools
//     const toolCount = await prisma.tool.count({
//       where: { organizationId: organization.id },
//     })

//     if (toolCount >= subscription.toolsLimit) {
//       return NextResponse.json(
//         {
//           error: "Tool limit reached",
//           limit: subscription.toolsLimit,
//           current: toolCount,
//           plan: subscription.plan,
//         },
//         { status: 403 },
//       )
//     }

//     const body = await request.json()
//     const { name, description, category, requirements } = body

//     // Validate required fields
//     if (!name || !description || !category || !requirements) {
//       return NextResponse.json(
//         { error: "Missing required fields: name, description, category, requirements" },
//         { status: 400 },
//       )
//     }

//     // Generate slug from name
//     const slug = name
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-")
//       .trim()

//     // Check if slug already exists in this organization
//     const existingTool = await prisma.tool.findFirst({
//       where: {
//         organizationId: organization.id,
//         slug: slug,
//       },
//     })

//     if (existingTool) {
//       return NextResponse.json({ error: "A tool with this name already exists" }, { status: 409 })
//     }

//     // Create the tool in the database
//     const tool = await prisma.tool.create({
//       data: {
//         name,
//         description,
//         category,
//         requirements,
//         slug,
//         status: "GENERATING",
//         generationStatus: "analyzing",
//         organizationId: organization.id,
//         createdById: userId,
//       },
//     })

//     // Track usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_CREATED",
//         userId: userId,
//         organizationId: organization.id,
//         toolId: tool.id,
//         metadata: {
//           toolName: name,
//           category,
//         },
//       },
//     })

//     // Create chat session for real v0 generation
//     const chatSession = await chatManager.createChatSession(
//       tool.id,
//       userId,
//       organization.id,
//       `Create a professional business application for: ${name}

// Description: ${description}
// Category: ${category}

// Requirements: ${requirements}

// Generate a complete React application with:
// - Modern, clean interface using Tailwind CSS with dark theme (#121212 background, #E0E0E0 text)
// - Fully responsive design for desktop and mobile
// - Professional form inputs for data entry with proper validation
// - Interactive table/list views for data display with sorting and filtering
// - Complete CRUD operations (Create, Read, Update, Delete)
// - Professional styling with excellent UX and accessibility
// - Include realistic sample data to demonstrate all functionality
// - Use modern React patterns with hooks and proper state management
// - Add loading states, error handling, and success feedback
// - Include a professional header with navigation
// - Make it production-ready with proper TypeScript types

// The application should be a complete, working business tool that users can immediately start using for their specific needs.

// Style requirements:
// - Use dark theme with #121212 background
// - Primary text: #E0E0E0
// - Secondary text: #B0B0B0  
// - Borders: #444444
// - Accent color: #888888
// - Professional, modern design
// - Excellent contrast and readability
// - Smooth animations and transitions`,
//     )

//     // Update tool with chat session ID
//     await prisma.tool.update({
//       where: { id: tool.id },
//       data: {
//         chatSessionId: chatSession.id,
//       },
//     })

//     return NextResponse.json(tool)
//   } catch (error) {
//     console.error("Failed to create tool:", error)
//     return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { requireCompany } from "@/lib/auth"
// import { prisma } from "@/lib/prisma"

// export async function GET(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const { searchParams } = new URL(req.url)
//     const category = searchParams.get("category")
//     const search = searchParams.get("search")

//     const where: any = {
//       companyId: company.id,
//     }

//     if (category && category !== "all") {
//       where.category = category
//     }

//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//       ]
//     }

//     const tools = await prisma.tool.findMany({
//       where,
//       include: {
//         _count: {
//           select: {
//             usageRecords: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     })

//     return NextResponse.json({ tools })
//   } catch (error) {
//     console.error("Tools fetch error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const body = await req.json()
//     const { name, description, category, requirements } = body

//     if (!name) {
//       return NextResponse.json({ error: "Tool name is required" }, { status: 400 })
//     }

//     // Create the tool first
//     const tool = await prisma.tool.create({
//       data: {
//         name,
//         description: description || "",
//         category: category || "Custom",
//         slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
//         creatorId: user.id,
//         companyId: company.id,
//         status: "DRAFT",
//         generationStatus: "pending",
//         requirements: requirements || "",
//         config: {},
//         schema: {},
//         ui: {},
//       },
//     })

//     // Record usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_CREATION",
//         count: 1,
//         userId: user.id,
//         organizationId: company.id,
//         toolId: tool.id,
//         metadata: {
//           category,
//           name,
//         },
//       },
//     })

//     // Start the generation process asynchronously
//     if (requirements) {
//       // Import and start generation
//       const { startToolGeneration } = await import("@/lib/tool-generation")
//       startToolGeneration(tool.id, requirements, user.id, company.id).catch((error) => {
//         console.error("Tool generation failed:", error)
//       })
//     }

//     return NextResponse.json({
//       id: tool.id,
//       toolId: tool.id,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//     })
//   } catch (error) {
//     console.error("Tool creation error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { ToolGenerator } from "@/lib/tool-generation"

// // Helper function to generate slug from name
// function generateSlug(name: string): string {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "")
// }

// // Helper function to track usage
// async function trackUsage(type: "TOOL_CREATED", organizationId: string, userId?: string, toolId?: string) {
//   try {
//     await prisma.usageRecord.create({
//       data: {
//         type,
//         organizationId,
//         userId,
//         toolId,
//         count: 1,
//         metadata: {
//           timestamp: new Date().toISOString(),
//         },
//       },
//     })
//   } catch (error) {
//     console.error("Error tracking usage:", error)
//   }
// }

// // Get all tools for an organization
// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Get organization and verify membership - fix: use 'members' not 'member'
//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//       include: {
//         members: {
//           where: { userId },
//         },
//       },
//     })

//     if (!organization || organization.members.length === 0) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Get tools with pagination
//     const page = Number.parseInt(request.nextUrl.searchParams.get("page") || "1")
//     const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "10")
//     const skip = (page - 1) * limit

//     const [tools, totalCount] = await Promise.all([
//       prisma.tool.findMany({
//         where: { organizationId: organization.id },
//         include: {
//           creator: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//               email: true,
//             },
//           },
//           chatSessions: {
//             select: {
//               id: true,
//               status: true,
//               demoUrl: true,
//               createdAt: true,
//             },
//             orderBy: { createdAt: "desc" },
//             take: 1,
//           },
//           _count: {
//             select: {
//               usageRecords: true,
//               publishedTools: true,
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//         skip,
//         take: limit,
//       }),
//       prisma.tool.count({
//         where: { organizationId: organization.id },
//       }),
//     ])

//     const response = {
//       tools: tools.map((tool) => ({
//         id: tool.id,
//         name: tool.name,
//         description: tool.description,
//         slug: tool.slug,
//         status: tool.status,
//         generationStatus: tool.generationStatus,
//         category: tool.category,
//         previewUrl: tool.previewUrl,
//         publishedUrl: tool.publishedUrl,
//         isPublic: tool.isPublic,
//         version: tool.version,
//         createdAt: tool.createdAt,
//         updatedAt: tool.updatedAt,
//         generatedAt: tool.generatedAt,
//         publishedAt: tool.publishedAt,
//         creator: tool.creator,
//         latestChatSession: tool.chatSessions[0] || null,
//         usageCount: tool._count.usageRecords,
//         publishedCount: tool._count.publishedTools,
//       })),
//       pagination: {
//         page,
//         limit,
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         hasNext: page * limit < totalCount,
//         hasPrev: page > 1,
//       },
//     }

//     return NextResponse.json(response)
//   } catch (error) {
//     console.error("Error fetching tools:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // Create a new tool
// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params
//     const body = await request.json()
//     const { name, description, requirements, category } = body

//     // Validate required fields
//     if (!name || !requirements) {
//       return NextResponse.json({ error: "Name and requirements are required" }, { status: 400 })
//     }

//     // Get organization and verify membership - fix: use 'subscriptions' not 'subscription'
//     const organization = await prisma.organization.findUnique({
//       where: { slug },
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

//     // Check subscription limits - fix: use subscriptions[0] since it's an array
//     const toolCount = await prisma.tool.count({
//       where: { organizationId: organization.id },
//     })

//     const toolsLimit = organization.subscriptions[0]?.toolsLimit || 1
//     if (toolCount >= toolsLimit) {
//       return NextResponse.json({ error: "Tool limit reached. Please upgrade your subscription." }, { status: 403 })
//     }

//     // Generate unique slug
//     let toolSlug = generateSlug(name)
//     let slugCounter = 1

//     while (true) {
//       const existingTool = await prisma.tool.findUnique({
//         where: {
//           organizationId_slug: {
//             organizationId: organization.id,
//             slug: toolSlug,
//           },
//         },
//       })

//       if (!existingTool) break

//       toolSlug = `${generateSlug(name)}-${slugCounter}`
//       slugCounter++
//     }

//     // Create tool
//     const tool = await prisma.tool.create({
//       data: {
//         name,
//         description,
//         slug: toolSlug,
//         requirements,
//         category,
//         status: "DRAFT",
//         generationStatus: "pending",
//         createdById: userId,
//         organizationId: organization.id,
//       },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     })

//     // Track usage
//     await trackUsage("TOOL_CREATED", organization.id, userId, tool.id)

//     // Create audit log
//     await prisma.auditLog.create({
//       data: {
//         action: "CREATE",
//         resource: "tool",
//         resourceId: tool.id,
//         userId,
//         organizationId: organization.id,
//         toolId: tool.id,
//         metadata: {
//           toolName: name,
//           category,
//         },
//       },
//     })

//     // Start tool generation in background - fix: use static method
//     try {
//       const chatSessionId = await ToolGenerator.generateTool(tool.id, requirements, userId, organization.id)

//       console.log(`Tool generation started for ${tool.id} with chat session ${chatSessionId}`)
//     } catch (generationError) {
//       console.error("Error starting tool generation:", generationError)
//       // Don't fail the tool creation, just log the error
//     }

//     const response = {
//       id: tool.id,
//       name: tool.name,
//       description: tool.description,
//       slug: tool.slug,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       category: tool.category,
//       requirements: tool.requirements,
//       createdAt: tool.createdAt,
//       updatedAt: tool.updatedAt,
//       creator: tool.creator,
//     }

//     return NextResponse.json(response, { status: 201 })
//   } catch (error) {
//     console.error("Error creating tool:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { ToolGenerator } from "@/lib/tool-generation"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
        subscriptions: true,
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const tools = await prisma.tool.findMany({
      where: { organizationId: organization.id },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            usageRecords: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      tools,
      subscription: organization.subscriptions[0] || null,
    })
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

    const organization = await prisma.organization.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId },
        },
        subscriptions: true,
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const { name, description, requirements } = await request.json()

    if (!name || !requirements) {
      return NextResponse.json({ error: "Name and requirements are required" }, { status: 400 })
    }

    // Check subscription limits
    const subscription = organization.subscriptions[0]
    if (subscription) {
      const toolCount = await prisma.tool.count({
        where: { organizationId: organization.id },
      })

      if (toolCount >= subscription.toolsLimit) {
        return NextResponse.json({ error: "Tool limit reached" }, { status: 403 })
      }
    }

    // Create slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create the tool
    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        slug,
        requirements,
        status: "GENERATING",
        generationStatus: "pending",
        createdById: userId,
        organizationId: organization.id,
      },
    })

    // Start generation process
    try {
      const chatSessionId = await ToolGenerator.generateTool(tool.id, requirements, userId, organization.id)

      return NextResponse.json({
        tool: {
          ...tool,
          chatSessionId,
        },
      })
    } catch (generationError) {
      console.error("Error starting tool generation:", generationError)

      // Update tool with error
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          status: "ERROR",
          generationStatus: "error",
          generationError: generationError instanceof Error ? generationError.message : "Unknown error",
        },
      })

      return NextResponse.json({
        tool,
        error: "Tool created but generation failed to start",
      })
    }
  } catch (error) {
    console.error("Error creating tool:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
