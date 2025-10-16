import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest, { params }: { params: { slug: string; id: string } }) {
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
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const body = await request.json()
    const { chatSessionId, files } = body

    let chatSession
    if (chatSessionId) {
      // If chatSessionId is provided, verify it exists and belongs to this tool
      chatSession = await prisma.chatSession.findUnique({
        where: {
          id: chatSessionId,
        },
      })

      // Verify the session belongs to this tool and organization
      if (!chatSession || chatSession.toolId !== tool.id || chatSession.organizationId !== organization.id) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
      }
    } else {
      // If no chatSessionId, find the most recent chat session for this tool
      chatSession = await prisma.chatSession.findFirst({
        where: {
          toolId: tool.id,
          organizationId: organization.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      if (!chatSession) {
        return NextResponse.json({ error: "No chat session found for this tool" }, { status: 404 })
      }
    }

    const savedFiles = await Promise.all(
      files.map((file: { name: string; content: string; type: string }) =>
        prisma.chatFile.create({
          data: {
            name: file.name,
            content: file.content,
            type: file.type,
            size: Buffer.byteLength(file.content, "utf8"),
            chatSessionId: chatSession.id,
          },
        }),
      ),
    )

    return NextResponse.json(savedFiles)
  } catch (error) {
    console.error("Error saving files:", error)
    return NextResponse.json({ error: "Failed to save files" }, { status: 500 })
  }
}
