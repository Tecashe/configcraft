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




// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { redirect } from "next/navigation"

// export async function getCurrentUser() {
//   const user = await currentUser()
//   if (!user) return null

//   // Sync user with database
//   const dbUser = await prisma.user.upsert({
//     where: { clerkId: user.id },
//     update: {
//       email: user.emailAddresses[0]?.emailAddress || "",
//       firstName: user.firstName,
//       lastName: user.lastName,
//       imageUrl: user.imageUrl,
//     },
//     create: {
//       clerkId: user.id,
//       email: user.emailAddresses[0]?.emailAddress || "",
//       firstName: user.firstName,
//       lastName: user.lastName,
//       imageUrl: user.imageUrl,
//     },
//   })

//   return dbUser
// }

// export async function getCurrentUserWithOrganizations() {
//   const user = await getCurrentUser()
//   if (!user) return null

//   // Get user's organizations (both owned and member)
//   const [ownedOrgs, memberships] = await Promise.all([
//     prisma.organization.findMany({
//       where: { ownerId: user.id },
//       include: {
//         _count: {
//           select: {
//             members: true,
//             tools: true,
//           },
//         },
//       },
//     }),
//     prisma.organizationMember.findMany({
//       where: {
//         userId: user.clerkId,
//         status: "ACTIVE",
//       },
//       include: {
//         organization: {
//           include: {
//             _count: {
//               select: {
//                 members: true,
//                 tools: true,
//               },
//             },
//           },
//         },
//       },
//     }),
//   ])

//   // Combine owned and member organizations
//   const organizations = [
//     ...ownedOrgs.map((org) => ({
//       ...org,
//       role: "OWNER" as const,
//       memberCount: org._count.members,
//       toolCount: org._count.tools,
//     })),
//     ...memberships
//       .filter((m) => !ownedOrgs.some((o) => o.id === m.organization.id))
//       .map((m) => ({
//         ...m.organization,
//         role: m.role,
//         memberCount: m.organization._count.members,
//         toolCount: m.organization._count.tools,
//       })),
//   ]

//   return {
//     user,
//     organizations,
//   }
// }

// export async function requireAuth() {
//   const user = await getCurrentUser()
//   if (!user) {
//     redirect("/auth/signin")
//   }
//   return user
// }

// export async function requireOrganization(slug?: string) {
//   const data = await getCurrentUserWithOrganizations()
//   if (!data) {
//     redirect("/auth/signin")
//   }

//   const { user, organizations } = data

//   // If no organizations exist, redirect to onboarding
//   if (organizations.length === 0) {
//     redirect("/onboarding")
//   }

//   // If slug is provided, find that specific organization
//   if (slug) {
//     const organization = organizations.find((org) => org.slug === slug)
//     if (!organization) {
//       // If user doesn't have access to this org, redirect to first available org
//       redirect(`/${organizations[0].slug}/dashboard`)
//     }
//     return { user, organization, organizations }
//   }

//   // If no slug provided, return first organization
//   const organization = organizations[0]
//   return { user, organization, organizations }
// }

// export async function getOrganizationBySlug(slug: string) {
//   const data = await getCurrentUserWithOrganizations()
//   if (!data) return null

//   const { organizations } = data
//   return organizations.find((org) => org.slug === slug) || null
// }

// export async function hasOrganizationAccess(slug: string, requiredRole?: string) {
//   const organization = await getOrganizationBySlug(slug)
//   if (!organization) return false

//   if (!requiredRole) return true

//   // Define role hierarchy
//   const roleHierarchy = {
//     OWNER: 4,
//     ADMIN: 3,
//     MEMBER: 2,
//     VIEWER: 1,
//   }

//   const userRoleLevel = roleHierarchy[organization.role as keyof typeof roleHierarchy] || 0
//   const requiredRoleLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

//   return userRoleLevel >= requiredRoleLevel
// }
