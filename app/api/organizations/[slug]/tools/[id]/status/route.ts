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

//     const tool = await prisma.tool.findFirst({
//       where: {
//         id: params.id,
//         organizationId: organization.id,
//       },
//       select: {
//         id: true,
//         name: true,
//         status: true,
//         generationStatus: true,
//         generationError: true,
//         previewUrl: true,
//         publishedUrl: true,
//       },
//     })

//     if (!tool) {
//       return NextResponse.json({ error: "Tool not found" }, { status: 404 })
//     }

//     return NextResponse.json(tool)
//   } catch (error) {
//     console.error("Failed to get tool status:", error)
//     return NextResponse.json({ error: "Failed to get tool status" }, { status: 500 })
//   }
// }
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"
import { chatManager } from "@/lib/chat-management"

export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
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

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Get real-time status from chat session if available
    if (tool.chatSessionId) {
      const chatSession = await chatManager.pollChatStatus(tool.chatSessionId)

      if (chatSession) {
        // Update tool status based on chat session
        let toolStatus = tool.status
        let generationStatus = tool.generationStatus

        switch (chatSession.status) {
          case "generating":
            toolStatus = "GENERATING"
            generationStatus = "generating"
            break
          case "completed":
            toolStatus = "GENERATED"
            generationStatus = "completed"
            break
          case "error":
            toolStatus = "ERROR"
            generationStatus = "error"
            break
        }

        // Update tool if status changed
        if (toolStatus !== tool.status || generationStatus !== tool.generationStatus) {
          await prisma.tool.update({
            where: { id: tool.id },
            data: {
              status: toolStatus,
              generationStatus,
              previewUrl: chatSession.demoUrl,
              generationError: chatSession.error,
              generatedAt: chatSession.status === "completed" ? new Date() : tool.generatedAt,
            },
          })
        }

        return NextResponse.json({
          id: tool.id,
          status: toolStatus,
          generationStatus,
          previewUrl: chatSession.demoUrl,
          error: chatSession.error,
          progress: this.calculateProgress(generationStatus),
          chatSession: {
            id: chatSession.id,
            messages: chatSession.messages,
            files: chatSession.files,
          },
        })
      }
    }

    return NextResponse.json({
      id: tool.id,
      status: tool.status,
      generationStatus: tool.generationStatus,
      previewUrl: tool.previewUrl,
      error: tool.generationError,
      progress: this.calculateProgress(tool.generationStatus),
    })
  } catch (error) {
    console.error("Failed to get tool status:", error)
    return NextResponse.json({ error: "Failed to get tool status" }, { status: 500 })
  }
}

// Helper function to calculate progress percentage
function calculateProgress(status: string): number {
  switch (status) {
    case "analyzing":
      return 10
    case "designing":
      return 30
    case "generating":
      return 60
    case "finalizing":
      return 90
    case "completed":
      return 100
    case "error":
      return 0
    default:
      return 0
  }
}
