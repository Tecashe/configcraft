import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { deleteOrganization, checkUserAccess } from "@/lib/organization"

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  console.log(`🗑️ [DELETE_ORG_API] Starting organization deletion: ${params.slug}`)

  try {
    const { userId } = await auth()
    if (!userId) {
      console.log(`❌ [DELETE_ORG_API] Unauthorized request`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    console.log(`👤 [DELETE_ORG_API] User ${userId} requesting deletion of: ${slug}`)

    // Check if user has owner access (only owners can delete)
    const hasOwnerAccess = await checkUserAccess(slug, "OWNER")
    if (!hasOwnerAccess) {
      console.log(`❌ [DELETE_ORG_API] User ${userId} does not have owner access to: ${slug}`)
      return NextResponse.json(
        {
          error: "Only organization owners can delete organizations",
        },
        { status: 403 },
      )
    }

    // Delete the organization
    await deleteOrganization(slug)

    console.log(`🎉 [DELETE_ORG_API] Organization deleted successfully: ${slug}`)
    return NextResponse.json({
      success: true,
      message: "Organization deleted successfully",
    })
  } catch (error) {
    console.error(`💥 [DELETE_ORG_API] Error deleting organization:`, error)

    const errorMessage = error instanceof Error ? error.message : "Failed to delete organization"
    const statusCode = errorMessage.includes("not found") || errorMessage.includes("permission") ? 404 : 500

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: statusCode },
    )
  }
}
