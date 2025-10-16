// import { redirect } from "next/navigation"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"

// export default async function DashboardPage() {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/auth/signin")
//   }

//   try {
//     // Ensure user exists in database
//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       // User doesn't exist in our database, redirect to onboarding
//       redirect("/onboarding")
//     }

//     // Find user's first organization
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId,
//         status: "ACTIVE",
//       },
//       include: {
//         organization: true,
//       },
//       orderBy: {
//         joinedAt: "asc",
//       },
//     })

//     if (!membership) {
//       // User has no organizations, redirect to onboarding
//       redirect("/onboarding")
//     }

//     // Redirect to organization dashboard
//     redirect(`/${membership.organization.slug}/dashboard`)
//   } catch (error) {
//     console.error("Dashboard redirect error:", error)
//     // If there's any error, redirect to onboarding to start fresh
//     redirect("/onboarding")
//   }

//   // This return should never be reached due to redirects above
//   return null
// }


import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/auth/signin")
  }

  try {
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      console.log(`[Dashboard] User not found in database for clerkId: ${userId}`)
      redirect("/onboarding")
    }

    console.log(`[Dashboard] User found: ${user.id}, clerkId: ${user.clerkId}`)

    // Find user's organization memberships
    // NOTE: OrganizationMember.userId references User.clerkId (not User.id)
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId: userId, // This should match User.clerkId
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    })

    console.log(`[Dashboard] Found ${memberships.length} memberships for userId: ${userId}`)
    
    // Debug: Let's see what memberships exist
    if (memberships.length > 0) {
      memberships.forEach((m, index) => {
        console.log(`[Dashboard] Membership ${index + 1}:`, {
          id: m.id,
          userId: m.userId,
          organizationId: m.organizationId,
          organizationSlug: m.organization.slug,
          role: m.role,
          status: m.status,
        })
      })
    }

    if (memberships.length === 0) {
      // Debug: Let's check ALL memberships for this user (any status)
      const allMemberships = await prisma.organizationMember.findMany({
        where: {
          userId: userId,
        },
        include: {
          organization: true,
        },
      })
      
      console.log(`[Dashboard] Total memberships (all statuses): ${allMemberships.length}`)
      
      if (allMemberships.length > 0) {
        console.log(`[Dashboard] WARNING: User has ${allMemberships.length} memberships but none are ACTIVE!`)
        allMemberships.forEach((m, index) => {
          console.log(`[Dashboard] Membership ${index + 1} (${m.status}):`, {
            organizationSlug: m.organization.slug,
            role: m.role,
            status: m.status,
          })
        })
      } else {
        // Debug: Check if any memberships exist with the internal user.id
        const membershipsByInternalId = await prisma.organizationMember.findMany({
          where: {
            userId: user.id, // Check if accidentally using internal ID
          },
        })

        if (membershipsByInternalId.length > 0) {
          console.error(
            `[Dashboard] ERROR: Found ${membershipsByInternalId.length} memberships using internal user.id (${user.id}) instead of clerkId (${userId}). This is a data integrity issue!`
          )
        } else {
          console.log(`[Dashboard] No memberships found at all for this user`)
        }
      }

      console.log(`[Dashboard] No active memberships found, redirecting to onboarding`)
      redirect("/onboarding")
    }

    // Get the first (oldest) organization
    const membership = memberships[0]
    
    console.log(
      `[Dashboard] Redirecting to organization: ${membership.organization.slug}`
    )

    // Redirect to organization dashboard
    redirect(`/${membership.organization.slug}/dashboard`)
  } catch (error) {
    console.error("[Dashboard] Error:", error)
    
    // Log the specific error for debugging
    if (error instanceof Error) {
      console.error("[Dashboard] Error message:", error.message)
      console.error("[Dashboard] Error stack:", error.stack)
    }
    
    // If there's any error, redirect to onboarding to start fresh
    redirect("/onboarding")
  }

  // This return should never be reached due to redirects above
  return null
}