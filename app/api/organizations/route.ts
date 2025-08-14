import { NextResponse } from "next/server"
import { getUserOrganizations, createOrganization } from "@/lib/organization"

export async function GET() {
  try {
    const organizations = await getUserOrganizations()
    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Failed to fetch organizations:", error)
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const organization = await createOrganization(name, slug)
    return NextResponse.json(organization)
  } catch (error) {
    console.error("Failed to create organization:", error)
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
  }
}
