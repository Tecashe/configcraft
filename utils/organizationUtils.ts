import { prisma } from "@/lib/prisma"

export async function ensureUserHasOrganization(userId: string): Promise<string> {
  // First, ensure the user exists in our database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // If user doesn't exist, we need to create them first
  if (!user) {
    // This should be handled by the Clerk webhook, but as a fallback:
    throw new Error("User not found in database. Please complete registration.")
  }

  // Check if user has any organizations
  const existingOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { ownerId: user.id }, // Use the internal user.id, not clerkId
        {
          members: {
            some: {
              userId,
              status: "ACTIVE",
            },
          },
        },
      ],
    },
    orderBy: { createdAt: "asc" },
  })

  if (existingOrg) {
    return existingOrg.slug
  }

  // Create a default organization for the user
  const defaultName = user.firstName ? `${user.firstName}'s Organization` : "My Organization"
  const defaultSlug = `org-${userId.slice(-8)}`

  const newOrg = await prisma.organization.create({
    data: {
      name: defaultName,
      slug: defaultSlug,
      size: "SMALL",
      ownerId: user.id, // Use the internal user.id
      members: {
        create: {
          userId, // This is the clerkId for the member relationship
          role: "OWNER",
          status: "ACTIVE",
        },
      },
    },
  })

  return newOrg.slug
}
