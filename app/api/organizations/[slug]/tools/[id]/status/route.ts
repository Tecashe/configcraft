// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { getOrganizationBySlug } from "@/lib/organization"
// import { prisma } from "@/lib/prisma"
// import { chatManager } from "@/lib/chat-management"

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

//     // Get chat session if exists
//     let chatSession = null
//     if (tool.chatSessionId) {
//       chatSession = await chatManager.getChatSession(tool.chatSessionId)
//     }

//     // Calculate progress using the chat manager
//     const progress = chatManager.calculateProgress(tool.status, tool.generationStatus || undefined)

//     // Determine current step based on generation status
//     let currentStep = "analyzing"
//     switch (tool.generationStatus) {
//       case "pending":
//         currentStep = "analyzing"
//         break
//       case "analyzing":
//         currentStep = "analyzing"
//         break
//       case "designing":
//         currentStep = "designing"
//         break
//       case "generating":
//         currentStep = "generating"
//         break
//       case "finalizing":
//         currentStep = "finalizing"
//         break
//       case "completed":
//         currentStep = "completed"
//         break
//       case "error":
//         currentStep = "error"
//         break
//       default:
//         currentStep = "analyzing"
//     }

//     return NextResponse.json({
//       id: tool.id,
//       status: tool.status,
//       generationStatus: tool.generationStatus,
//       currentStep,
//       previewUrl: tool.previewUrl,
//       demoUrl: chatSession?.demoUrl,
//       error: tool.generationError || chatSession?.error,
//       progress,
//       chatSession: chatSession
//         ? {
//             id: chatSession.id,
//             status: chatSession.status,
//             messages: chatSession.messages,
//             files: chatSession.files,
//             demoUrl: chatSession.demoUrl,
//             progress: chatSession.progress,
//           }
//         : null,
//       files: chatSession?.files || [],
//       createdAt: tool.createdAt,
//       updatedAt: tool.updatedAt,
//     })
//   } catch (error) {
//     console.error("Failed to get tool status:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to get tool status",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { ChatManager } from "@/lib/chat-management"

export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
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

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Get chat session if exists
    let chatSession = null
    if (tool.chatSessionId) {
      chatSession = await ChatManager.getChatSession(tool.chatSessionId)
    }

    // Calculate progress using the static method
    const progress = ChatManager.calculateProgress(tool.status, tool.generationStatus || undefined)

    // Determine current step based on generation status
    let currentStep = "analyzing"
    switch (tool.generationStatus) {
      case "pending":
        currentStep = "analyzing"
        break
      case "analyzing":
        currentStep = "analyzing"
        break
      case "designing":
        currentStep = "designing"
        break
      case "generating":
        currentStep = "generating"
        break
      case "finalizing":
        currentStep = "finalizing"
        break
      case "completed":
        currentStep = "completed"
        break
      case "error":
        currentStep = "error"
        break
      default:
        currentStep = "analyzing"
    }

    return NextResponse.json({
      id: tool.id,
      status: tool.status,
      generationStatus: tool.generationStatus,
      currentStep,
      previewUrl: tool.previewUrl,
      demoUrl: chatSession?.demoUrl,
      error: tool.generationError || chatSession?.error,
      progress,
      chatSession: chatSession
        ? {
            id: chatSession.id,
            status: chatSession.status,
            messages: chatSession.messages,
            files: chatSession.files,
            demoUrl: chatSession.demoUrl,
            progress: ChatManager.calculateProgress(chatSession.status, undefined),
          }
        : null,
      files: chatSession?.files || [],
      createdAt: tool.createdAt,
      updatedAt: tool.updatedAt,
    })
  } catch (error) {
    console.error("Failed to get tool status:", error)
    return NextResponse.json(
      {
        error: "Failed to get tool status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

