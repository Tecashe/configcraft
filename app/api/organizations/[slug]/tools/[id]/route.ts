// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { getOrganizationBySlug } from "@/lib/organization"
// import { prisma } from "@/lib/prisma"

// export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access
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

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     return NextResponse.json(tool)
//   } catch (error) {
//     console.error("Failed to fetch tool:", error)
//     return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { slug: string; id: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access
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

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     // Check if user owns the tool or has admin rights
//     if (tool.createdById !== userId && !["OWNER", "ADMIN"].includes(membership.role)) {
//       return NextResponse.json({ error: "Permission denied" }, { status: 403 })
//     }

//     // Delete related records first
//     await prisma.$transaction([
//       // Delete tool integrations
//       prisma.toolIntegration.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete tool analytics
//       prisma.toolAnalytics.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete tool versions
//       prisma.toolVersion.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete usage records
//       prisma.usageRecord.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Finally delete the tool
//       prisma.tool.delete({
//         where: { id: tool.id },
//       }),
//     ])

//     // Log the deletion
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_CREATED", // We'll use negative count to indicate deletion
//         count: -1,
//         userId: userId,
//         organizationId: organization.id,
//         metadata: {
//           action: "tool_deleted",
//           toolName: tool.name,
//           toolId: tool.id,
//         },
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Failed to delete tool:", error)
//     return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
//   }
// }

// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { getOrganizationBySlug } from "@/lib/organization"
// import { z } from "zod"

// const updateToolSchema = z.object({
//   name: z.string().min(1).max(100).optional(),
//   description: z.string().max(500).optional(),
//   category: z.string().max(50).optional(),
//   config: z.record(z.any()).optional(),
//   schema: z.record(z.any()).optional(),
//   ui: z.record(z.any()).optional(),
//   isPublic: z.boolean().optional(),
//   status: z.enum(["DRAFT", "GENERATING", "GENERATED", "PUBLISHED", "ARCHIVED", "ERROR"]).optional(),
// })

// export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access
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

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//             imageUrl: true,
//           },
//         },
//         versions: {
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         },
//         integrations: {
//           include: {
//             integration: {
//               select: {
//                 id: true,
//                 name: true,
//                 provider: true,
//                 status: true,
//               },
//             },
//           },
//         },
//         analytics: {
//           where: {
//             date: {
//               gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
//             },
//           },
//           orderBy: { date: "desc" },
//         },
//         publishedTools: {
//           orderBy: { createdAt: "desc" },
//           take: 1,
//         },
//         chatSessions: {
//           orderBy: { createdAt: "desc" },
//           take: 5,
//           include: {
//             messages: {
//               orderBy: { createdAt: "desc" },
//               take: 10,
//             },
//           },
//         },
//         _count: {
//           select: {
//             versions: true,
//             integrations: true,
//             analytics: true,
//             usageRecords: true,
//           },
//         },
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     return NextResponse.json(tool)
//   } catch (error) {
//     console.error("Failed to fetch tool:", error)
//     return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
//   }
// }

// export async function PUT(request: Request, { params }: { params: { slug: string; id: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access
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

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     // Check if user owns the tool or has admin rights
//     if (tool.createdById !== userId && !["OWNER", "ADMIN"].includes(membership.role)) {
//       return NextResponse.json({ error: "Permission denied" }, { status: 403 })
//     }

//     const body = await request.json()
//     const updateData = updateToolSchema.parse(body)

//     // Update tool
//     const updatedTool = await prisma.tool.update({
//       where: { id: tool.id },
//       data: {
//         ...updateData,
//         updatedAt: new Date(),
//       },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//             imageUrl: true,
//           },
//         },
//       },
//     })

//     // Create audit log
//     await prisma.auditLog.create({
//       data: {
//         action: "UPDATE",
//         resource: "tool",
//         resourceId: tool.id,
//         userId: userId,
//         organizationId: organization.id,
//         toolId: tool.id,
//         metadata: {
//           changes: updateData,
//           toolName: updatedTool.name,
//         },
//       },
//     })

//     // Log usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_VIEW",
//         userId: userId,
//         organizationId: organization.id,
//         toolId: tool.id,
//         metadata: {
//           action: "tool_updated",
//           changes: Object.keys(updateData),
//         },
//       },
//     })

//     return NextResponse.json(updatedTool)
//   } catch (error) {
//     console.error("Failed to update tool:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Failed to update tool" }, { status: 500 })
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { slug: string; id: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access
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

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     // Check if user owns the tool or has admin rights
//     if (tool.createdById !== userId && !["OWNER", "ADMIN"].includes(membership.role)) {
//       return NextResponse.json({ error: "Permission denied" }, { status: 403 })
//     }

//     // Delete related records first
//     await prisma.$transaction([
//       // Delete tool integrations
//       prisma.toolIntegration.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete tool analytics
//       prisma.toolAnalytics.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete tool versions
//       prisma.toolVersion.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete usage records
//       prisma.usageRecord.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete chat sessions and related data
//       prisma.chatFile.deleteMany({
//         where: { chatSession: { toolId: tool.id } },
//       }),
//       prisma.chatMessage.deleteMany({
//         where: { chatSession: { toolId: tool.id } },
//       }),
//       prisma.chatSession.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete published tools
//       prisma.publishedTool.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Delete audit logs
//       prisma.auditLog.deleteMany({
//         where: { toolId: tool.id },
//       }),
//       // Finally delete the tool
//       prisma.tool.delete({
//         where: { id: tool.id },
//       }),
//     ])

//     // Log the deletion
//     await prisma.usageRecord.create({
//       data: {
//         type: "TOOL_CREATED", // We'll use negative count to indicate deletion
//         count: -1,
//         userId: userId,
//         organizationId: organization.id,
//         metadata: {
//           action: "tool_deleted",
//           toolName: tool.name,
//           toolId: tool.id,
//         },
//       },
//     })

//     // Create audit log for deletion
//     await prisma.auditLog.create({
//       data: {
//         action: "DELETE",
//         resource: "tool",
//         resourceId: tool.id,
//         userId: userId,
//         organizationId: organization.id,
//         metadata: {
//           toolName: tool.name,
//           deletedAt: new Date(),
//         },
//       },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Failed to delete tool:", error)
//     return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
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
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const tool = await prisma.tool.findUnique({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
      include: {
        chatSessions: {
          orderBy: { createdAt: "desc" },
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
            files: {
              orderBy: { name: "asc" },
            },
          },
        },
        versions: {
          orderBy: { createdAt: "desc" },
        },
        integrations: {
          include: {
            integration: true,
          },
        },
        publishedTools: {
          orderBy: { createdAt: "desc" },
        },
        analytics: {
          orderBy: { date: "desc" },
          take: 30,
        },
        creator: {
          select: {
            id: true,
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    await prisma.usageRecord.create({
      data: {
        type: "TOOL_VIEW",
        userId,
        organizationId: organization.id,
        toolId: tool.id,
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Error fetching tool:", error)
    return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
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
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const body = await request.json()
    const {
      status,
      generationStatus,
      generationError,
      v0ChatId,
      previewUrl,
      chatUrl,
      publishedUrl,
      v0Code,
      generatedCode,
      analysisData,
    } = body

    const tool = await prisma.tool.update({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
      data: {
        ...(status && { status }),
        ...(generationStatus && { generationStatus }),
        ...(generationError !== undefined && { generationError }),
        ...(v0ChatId && { v0ChatId }),
        ...(previewUrl && { previewUrl }),
        ...(chatUrl && { chatUrl }),
        ...(publishedUrl && { publishedUrl }),
        ...(v0Code && { v0Code }),
        ...(generatedCode && { generatedCode }),
        ...(analysisData && { analysisData }),
        ...(generationStatus === "completed" && { generatedAt: new Date() }),
        ...(status === "PUBLISHED" && { publishedAt: new Date() }),
      },
    })

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        resource: "tool",
        resourceId: tool.id,
        userId,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: body,
      },
    })

    if (status === "PUBLISHED") {
      await prisma.usageRecord.create({
        data: {
          type: "TOOL_PUBLISHED",
          userId,
          organizationId: organization.id,
          toolId: tool.id,
        },
      })
    } else if (generationStatus === "error") {
      await prisma.usageRecord.create({
        data: {
          type: "TOOL_ERROR",
          userId,
          organizationId: organization.id,
          toolId: tool.id,
          metadata: { error: generationError },
        },
      })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Error updating tool:", error)
    return NextResponse.json({ error: "Failed to update tool" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
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
      },
    })

    if (!organization || organization.members.length === 0) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        resource: "tool",
        resourceId: params.id,
        userId,
        organizationId: organization.id,
        toolId: params.id,
      },
    })

    await prisma.tool.delete({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tool:", error)
    return NextResponse.json({ error: "Failed to delete tool" }, { status: 500 })
  }
}
