import { prisma } from "@/lib/prisma"

export async function ensureUserHasOrganization(userId: string): Promise<string> {
  // Check if user has any organizations
  const existingOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { ownerId: userId },
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
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  const defaultName = user?.firstName ? `${user.firstName}'s Organization` : "My Organization"
  const defaultSlug = `org-${userId.slice(-8)}`

  // Check if slug is already taken
  const existing = await prisma.organization.findUnique({
    where: { slug: defaultSlug },
  })

  if (existing) {
    // If slug exists, add a random suffix
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const newSlug = `${defaultSlug}-${randomSuffix}`

    const newOrg = await prisma.organization.create({
      data: {
        name: defaultName,
        slug: newSlug,
        size: "SMALL",
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
            status: "ACTIVE",
          },
        },
      },
    })

    return newOrg.slug
  }

  const newOrg = await prisma.organization.create({
    data: {
      name: defaultName,
      slug: defaultSlug,
      size: "SMALL",
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
          status: "ACTIVE",
        },
      },
    },
  })

  return newOrg.slug
}
