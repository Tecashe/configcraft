import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/auth/signin")
  }

  try {
    // Ensure user exists in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      // User doesn't exist in our database, redirect to onboarding
      redirect("/onboarding")
    }

    // Find user's first organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    })

    if (!membership) {
      // User has no organizations, redirect to onboarding
      redirect("/onboarding")
    }

    // Redirect to organization dashboard
    redirect(`/${membership.organization.slug}/dashboard`)
  } catch (error) {
    console.error("Dashboard redirect error:", error)
    // If there's any error, redirect to onboarding to start fresh
    redirect("/onboarding")
  }

  // This return should never be reached due to redirects above
  return null
}
