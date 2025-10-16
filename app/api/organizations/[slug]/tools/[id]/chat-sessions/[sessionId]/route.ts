import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; id: string; sessionId: string } },
) {
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
    const { status, demoUrl, error } = body

    const chatSession = await prisma.chatSession.update({
      where: {
        id: params.sessionId,
        toolId: params.id,
        organizationId: organization.id,
      },
      data: {
        ...(status && { status }),
        ...(demoUrl && { demoUrl }),
        ...(error !== undefined && { error }),
      },
    })

    return NextResponse.json(chatSession)
  } catch (error) {
    console.error("Error updating chat session:", error)
    return NextResponse.json({ error: "Failed to update chat session" }, { status: 500 })
  }
}
