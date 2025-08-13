import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const user = await currentUser()
  if (!user) return null

  // Sync user with database
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

  return dbUser
}

export async function getCurrentUserWithCompany() {
  const user = await getCurrentUser()
  if (!user) return null

  const userWithCompany = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      companies: {
        include: {
          company: true,
        },
      },
      ownedCompanies: true,
    },
  })

  return userWithCompany
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireCompany() {
  const user = await getCurrentUserWithCompany()
  if (!user) {
    throw new Error("Authentication required")
  }

  const company = user.ownedCompanies[0] || user.companies[0]?.company
  if (!company) {
    throw new Error("Company required")
  }

  return { user, company }
}
