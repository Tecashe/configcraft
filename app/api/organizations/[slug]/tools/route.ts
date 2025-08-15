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

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"
import { chatManager } from "@/lib/chat-management"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const tools = await prisma.tool.findMany({
      where: {
        organizationId: organization.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Failed to fetch tools:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, category, requirements } = body

    if (!name || !requirements) {
      return NextResponse.json({ error: "Name and requirements are required" }, { status: 400 })
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    // Check if slug is unique within organization
    const existingTool = await prisma.tool.findFirst({
      where: {
        organizationId: organization.id,
        slug,
      },
    })

    if (existingTool) {
      return NextResponse.json({ error: "A tool with this name already exists" }, { status: 400 })
    }

    // Create tool
    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        slug,
        category: category || "General",
        requirements,
        status: "DRAFT",
        generationStatus: "pending",
        createdById: userId,
        organizationId: organization.id,
      },
    })

    // Create chat session and start generation
    const chatSession = await chatManager.createChatSession(tool.id, userId, organization.id, requirements)

    // Return tool with chat session info
    const toolWithChat = await prisma.tool.findUnique({
      where: { id: tool.id },
    })

    return NextResponse.json(toolWithChat)
  } catch (error) {
    console.error("Failed to create tool:", error)
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
  }
}
