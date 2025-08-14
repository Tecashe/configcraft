// import { prisma } from "@/lib/prisma"

// export async function ensureUserHasOrganization(userId: string): Promise<string> {
//   // First, ensure the user exists in our database
//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//   })

//   // If user doesn't exist, we need to create them first
//   if (!user) {
//     // This should be handled by the Clerk webhook, but as a fallback:
//     throw new Error("User not found in database. Please complete registration.")
//   }

//   // Check if user has any organizations
//   const existingOrg = await prisma.organization.findFirst({
//     where: {
//       OR: [
//         { ownerId: user.id }, // Use the internal user.id, not clerkId
//         {
//           members: {
//             some: {
//               userId,
//               status: "ACTIVE",
//             },
//           },
//         },
//       ],
//     },
//     orderBy: { createdAt: "asc" },
//   })

//   if (existingOrg) {
//     return existingOrg.slug
//   }

//   // Create a default organization for the user
//   const defaultName = user.firstName ? `${user.firstName}'s Organization` : "My Organization"
//   const defaultSlug = `org-${userId.slice(-8)}`

//   const newOrg = await prisma.organization.create({
//     data: {
//       name: defaultName,
//       slug: defaultSlug,
//       size: "SMALL",
//       ownerId: user.id, // Use the internal user.id
//       members: {
//         create: {
//           userId, // This is the clerkId for the member relationship
//           role: "OWNER",
//           status: "ACTIVE",
//         },
//       },
//     },
//   })

//   return newOrg.slug
// }

import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function ensureUserHasOrganization(): Promise<string> {
  const user = await currentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  // Ensure user exists in our database
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    },
  })

  // Check if user has any organizations (as owner)
  const ownedOrg = await prisma.organization.findFirst({
    where: { ownerId: dbUser.id },
    orderBy: { createdAt: "asc" },
  })

  if (ownedOrg) {
    return ownedOrg.slug
  }

  // Check if user is a member of any organizations
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
    },
    include: { organization: true },
    orderBy: { joinedAt: "asc" },
  })

  if (membership) {
    return membership.organization.slug
  }

  // No organization found, user needs to go through onboarding
  throw new Error("No organization found")
}
