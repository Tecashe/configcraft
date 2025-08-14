// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import crypto from "crypto"

// export interface Organization {
//   id: string
//   name: string
//   slug: string
//   description?: string | null
//   logoUrl?: string | null
//   website?: string | null
//   industry?: string | null
//   size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE"
//   domain?: string | null
//   customBranding: boolean
//   brandColors?: any
//   role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
//   memberCount: number
//   toolCount: number
//   createdAt: string
//   updatedAt: string
// }

// export async function getCurrentUser() {
//   const { userId } = await auth()
//   if (!userId) {
//     throw new Error("User not authenticated")
//   }
//   return userId
// }

// export async function ensureUserExists(clerkId: string) {
//   let user = await prisma.user.findUnique({
//     where: { clerkId },
//   })

//   if (!user) {
//     // Create user if they don't exist (fallback for webhook issues)
//     user = await prisma.user.create({
//       data: {
//         clerkId,
//         email: `${clerkId}@temp.com`, // Temporary email, should be updated by webhook
//       },
//     })
//   }

//   return user
// }

// export async function getUserOrganizations(): Promise<Organization[]> {
//   const userId = await getCurrentUser()

//   // Ensure user exists in our database
//   const user = await ensureUserExists(userId)

//   // Get user's owned organizations
//   const ownedOrgs = await prisma.organization.findMany({
//     where: { ownerId: user.id },
//     include: {
//       _count: {
//         select: {
//           members: true,
//           tools: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Get user's member organizations
//   const memberOrgs = await prisma.organizationMember.findMany({
//     where: {
//       userId,
//       status: "ACTIVE",
//     },
//     include: {
//       organization: {
//         include: {
//           _count: {
//             select: {
//               members: true,
//               tools: true,
//             },
//           },
//         },
//       },
//     },
//     orderBy: {
//       organization: {
//         createdAt: "desc",
//       },
//     },
//   })

//   const organizations: Organization[] = []

//   // Add owned organizations
//   for (const org of ownedOrgs) {
//     organizations.push({
//       id: org.id,
//       name: org.name,
//       slug: org.slug,
//       description: org.description,
//       logoUrl: org.logoUrl,
//       website: org.website,
//       industry: org.industry,
//       size: org.size,
//       domain: org.domain,
//       customBranding: org.customBranding,
//       brandColors: org.brandColors,
//       role: "OWNER",
//       memberCount: org._count.members,
//       toolCount: org._count.tools,
//       createdAt: org.createdAt.toISOString(),
//       updatedAt: org.updatedAt.toISOString(),
//     })
//   }

//   // Add member organizations (avoid duplicates if user is both owner and member)
//   for (const membership of memberOrgs) {
//     const existingOrg = organizations.find((o) => o.id === membership.organization.id)
//     if (!existingOrg) {
//       organizations.push({
//         id: membership.organization.id,
//         name: membership.organization.name,
//         slug: membership.organization.slug,
//         description: membership.organization.description,
//         logoUrl: membership.organization.logoUrl,
//         website: membership.organization.website,
//         industry: membership.organization.industry,
//         size: membership.organization.size,
//         domain: membership.organization.domain,
//         customBranding: membership.organization.customBranding,
//         brandColors: membership.organization.brandColors,
//         role: membership.role,
//         memberCount: membership.organization._count.members,
//         toolCount: membership.organization._count.tools,
//         createdAt: membership.organization.createdAt.toISOString(),
//         updatedAt: membership.organization.updatedAt.toISOString(),
//       })
//     }
//   }

//   return organizations
// }

// export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
//   const userId = await getCurrentUser()
//   const user = await ensureUserExists(userId)

//   // First check if user owns the organization
//   const ownedOrg = await prisma.organization.findFirst({
//     where: {
//       slug,
//       ownerId: user.id,
//     },
//     include: {
//       _count: {
//         select: {
//           members: true,
//           tools: true,
//         },
//       },
//     },
//   })

//   if (ownedOrg) {
//     return {
//       id: ownedOrg.id,
//       name: ownedOrg.name,
//       slug: ownedOrg.slug,
//       description: ownedOrg.description,
//       logoUrl: ownedOrg.logoUrl,
//       website: ownedOrg.website,
//       industry: ownedOrg.industry,
//       size: ownedOrg.size,
//       domain: ownedOrg.domain,
//       customBranding: ownedOrg.customBranding,
//       brandColors: ownedOrg.brandColors,
//       role: "OWNER",
//       memberCount: ownedOrg._count.members,
//       toolCount: ownedOrg._count.tools,
//       createdAt: ownedOrg.createdAt.toISOString(),
//       updatedAt: ownedOrg.updatedAt.toISOString(),
//     }
//   }

//   // Check if user is a member of the organization
//   const membership = await prisma.organizationMember.findFirst({
//     where: {
//       userId,
//       status: "ACTIVE",
//       organization: { slug },
//     },
//     include: {
//       organization: {
//         include: {
//           _count: {
//             select: {
//               members: true,
//               tools: true,
//             },
//           },
//         },
//       },
//     },
//   })

//   if (!membership) {
//     return null
//   }

//   return {
//     id: membership.organization.id,
//     name: membership.organization.name,
//     slug: membership.organization.slug,
//     description: membership.organization.description,
//     logoUrl: membership.organization.logoUrl,
//     website: membership.organization.website,
//     industry: membership.organization.industry,
//     size: membership.organization.size,
//     domain: membership.organization.domain,
//     customBranding: membership.organization.customBranding,
//     brandColors: membership.organization.brandColors,
//     role: membership.role,
//     memberCount: membership.organization._count.members,
//     toolCount: membership.organization._count.tools,
//     createdAt: membership.organization.createdAt.toISOString(),
//     updatedAt: membership.organization.updatedAt.toISOString(),
//   }
// }

// export async function switchOrganization(slug: string) {
//   const organization = await getOrganizationBySlug(slug)
//   if (!organization) {
//     throw new Error("Organization not found or access denied")
//   }
//   return organization
// }

// export async function createOrganization(data: {
//   name: string
//   slug: string
//   description?: string
//   industry?: string
//   size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE"
//   website?: string
// }) {
//   const userId = await getCurrentUser()
//   const user = await ensureUserExists(userId)

//   // Check if slug is already taken
//   const existing = await prisma.organization.findUnique({
//     where: { slug: data.slug },
//   })

//   if (existing) {
//     throw new Error("Organization slug already exists")
//   }

//   const organization = await prisma.organization.create({
//     data: {
//       name: data.name,
//       slug: data.slug,
//       description: data.description,
//       industry: data.industry,
//       size: data.size || "SMALL",
//       website: data.website,
//       ownerId: user.id, // Use internal user.id
//       members: {
//         create: {
//           userId, // Use clerkId for member relationship
//           role: "OWNER",
//           status: "ACTIVE",
//         },
//       },
//     },
//   })

//   return organization
// }

// export async function ensureUserHasOrganization(): Promise<string> {
//   const userId = await getCurrentUser()
//   const user = await ensureUserExists(userId)

//   // Check if user has any organizations
//   const existingOrg = await prisma.organization.findFirst({
//     where: {
//       OR: [
//         { ownerId: user.id },
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

//   const newOrg = await createOrganization({
//     name: defaultName,
//     slug: defaultSlug,
//     size: "SMALL",
//   })

//   return newOrg.slug
// }

// export function generateSlug(name: string): string {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)/g, "")
//     .substring(0, 50) // Limit length
// }

// export async function checkUserAccess(
//   organizationSlug: string,
//   requiredRole?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
// ): Promise<boolean> {
//   try {
//     const organization = await getOrganizationBySlug(organizationSlug)
//     if (!organization) {
//       return false
//     }

//     if (!requiredRole) {
//       return true // User has access
//     }

//     // Define role hierarchy
//     const roleHierarchy = {
//       OWNER: 4,
//       ADMIN: 3,
//       MEMBER: 2,
//       VIEWER: 1,
//     }

//     const userRoleLevel = roleHierarchy[organization.role]
//     const requiredRoleLevel = roleHierarchy[requiredRole]

//     return userRoleLevel >= requiredRoleLevel
//   } catch {
//     return false
//   }
// }

// export async function inviteUserToOrganization(
//   organizationSlug: string,
//   email: string,
//   role: "ADMIN" | "MEMBER" | "VIEWER" = "MEMBER",
// ) {
//   const userId = await getCurrentUser()
//   const user = await ensureUserExists(userId)
//   const organization = await getOrganizationBySlug(organizationSlug)

//   if (!organization) {
//     throw new Error("Organization not found")
//   }

//   // Check if user has permission to invite
//   if (!["OWNER", "ADMIN"].includes(organization.role)) {
//     throw new Error("Insufficient permissions to invite users")
//   }

//   // Check if user is already a member
//   const existingMember = await prisma.organizationMember.findFirst({
//     where: {
//       organizationId: organization.id,
//       user: { email },
//     },
//   })

//   if (existingMember) {
//     throw new Error("User is already a member of this organization")
//   }

//   // Create invitation
//   const token = crypto.randomUUID()
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

//   const invitation = await prisma.organizationInvitation.create({
//     data: {
//       email,
//       role,
//       token,
//       expiresAt,
//       organizationId: organization.id,
//       invitedById: user.id, // Use internal user.id
//     },
//   })

//   return invitation
// }

// export async function acceptInvitation(token: string) {
//   const userId = await getCurrentUser()
//   const user = await ensureUserExists(userId)

//   const invitation = await prisma.organizationInvitation.findUnique({
//     where: { token },
//     include: { organization: true },
//   })

//   if (!invitation) {
//     throw new Error("Invalid invitation token")
//   }

//   if (invitation.expiresAt < new Date()) {
//     throw new Error("Invitation has expired")
//   }

//   if (user.email !== invitation.email) {
//     throw new Error("Invitation email does not match user email")
//   }

//   // Create membership
//   await prisma.organizationMember.create({
//     data: {
//       userId, // clerkId for member relationship
//       organizationId: invitation.organizationId,
//       role: invitation.role,
//       status: "ACTIVE",
//     },
//   })

//   // Delete invitation
//   await prisma.organizationInvitation.delete({
//     where: { id: invitation.id },
//   })

//   return invitation.organization
// }

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

// Types for our organization system
export interface Organization {
  id: string
  name: string
  slug: string
  description?: string | null
  logoUrl?: string | null
  website?: string | null
  industry?: string | null
  size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE"
  domain?: string | null
  customBranding: boolean
  brandColors?: any
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
  memberCount: number
  toolCount: number
  createdAt: string
  updatedAt: string
}

export interface OrganizationMember {
  id: string
  role: string
  status: string
  joinedAt: Date
  userId: string
  organizationId: string
  organization: Organization
}

// Get current authenticated user
export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("User not authenticated")
  }
  return userId
}

// Ensure user exists in our database
export async function ensureUserExists(clerkId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    // Create user if they don't exist (fallback for webhook issues)
    user = await prisma.user.create({
      data: {
        clerkId,
        email: `${clerkId}@temp.com`, // Temporary email, should be updated by webhook
      },
    })
  }

  return user
}

// Get current organization from slug
export async function getCurrentOrganization(slug: string): Promise<Organization | null> {
  return await getOrganizationBySlug(slug)
}

// Get all organizations for the current user
export async function getUserOrganizations(): Promise<Organization[]> {
  const userId = await getCurrentUser()

  // Ensure user exists in our database
  const user = await ensureUserExists(userId)

  // Get user's owned organizations
  const ownedOrgs = await prisma.organization.findMany({
    where: { ownerId: user.id },
    include: {
      _count: {
        select: {
          members: true,
          tools: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get user's member organizations
  const memberOrgs = await prisma.organizationMember.findMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      organization: {
        include: {
          _count: {
            select: {
              members: true,
              tools: true,
            },
          },
        },
      },
    },
    orderBy: {
      organization: {
        createdAt: "desc",
      },
    },
  })

  const organizations: Organization[] = []

  // Add owned organizations
  for (const org of ownedOrgs) {
    organizations.push({
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      logoUrl: org.logoUrl,
      website: org.website,
      industry: org.industry,
      size: org.size,
      domain: org.domain,
      customBranding: org.customBranding,
      brandColors: org.brandColors,
      role: "OWNER",
      memberCount: org._count.members,
      toolCount: org._count.tools,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    })
  }

  // Add member organizations (avoid duplicates if user is both owner and member)
  for (const membership of memberOrgs) {
    const existingOrg = organizations.find((o) => o.id === membership.organization.id)
    if (!existingOrg) {
      organizations.push({
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        description: membership.organization.description,
        logoUrl: membership.organization.logoUrl,
        website: membership.organization.website,
        industry: membership.organization.industry,
        size: membership.organization.size,
        domain: membership.organization.domain,
        customBranding: membership.organization.customBranding,
        brandColors: membership.organization.brandColors,
        role: membership.role,
        memberCount: membership.organization._count.members,
        toolCount: membership.organization._count.tools,
        createdAt: membership.organization.createdAt.toISOString(),
        updatedAt: membership.organization.updatedAt.toISOString(),
      })
    }
  }

  return organizations
}

// Get organization by slug
export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const userId = await getCurrentUser()
  const user = await ensureUserExists(userId)

  // First check if user owns the organization
  const ownedOrg = await prisma.organization.findFirst({
    where: {
      slug,
      ownerId: user.id,
    },
    include: {
      _count: {
        select: {
          members: true,
          tools: true,
        },
      },
    },
  })

  if (ownedOrg) {
    return {
      id: ownedOrg.id,
      name: ownedOrg.name,
      slug: ownedOrg.slug,
      description: ownedOrg.description,
      logoUrl: ownedOrg.logoUrl,
      website: ownedOrg.website,
      industry: ownedOrg.industry,
      size: ownedOrg.size,
      domain: ownedOrg.domain,
      customBranding: ownedOrg.customBranding,
      brandColors: ownedOrg.brandColors,
      role: "OWNER",
      memberCount: ownedOrg._count.members,
      toolCount: ownedOrg._count.tools,
      createdAt: ownedOrg.createdAt.toISOString(),
      updatedAt: ownedOrg.updatedAt.toISOString(),
    }
  }

  // Check if user is a member of the organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      organization: { slug },
    },
    include: {
      organization: {
        include: {
          _count: {
            select: {
              members: true,
              tools: true,
            },
          },
        },
      },
    },
  })

  if (!membership) {
    return null
  }

  return {
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    description: membership.organization.description,
    logoUrl: membership.organization.logoUrl,
    website: membership.organization.website,
    industry: membership.organization.industry,
    size: membership.organization.size,
    domain: membership.organization.domain,
    customBranding: membership.organization.customBranding,
    brandColors: membership.organization.brandColors,
    role: membership.role,
    memberCount: membership.organization._count.members,
    toolCount: membership.organization._count.tools,
    createdAt: membership.organization.createdAt.toISOString(),
    updatedAt: membership.organization.updatedAt.toISOString(),
  }
}

// Switch to another organization
export async function switchOrganization(slug: string) {
  const organization = await getOrganizationBySlug(slug)
  if (!organization) {
    throw new Error("Organization not found or access denied")
  }
  return organization
}

// Create a new organization
export async function createOrganization(data: {
  name: string
  slug: string
  description?: string
  industry?: string
  size?: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE"
  website?: string
}) {
  const userId = await getCurrentUser()
  const user = await ensureUserExists(userId)

  // Check if slug is already taken
  const existing = await prisma.organization.findUnique({
    where: { slug: data.slug },
  })

  if (existing) {
    throw new Error("Organization slug already exists")
  }

  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      industry: data.industry,
      size: data.size || "SMALL",
      website: data.website,
      ownerId: user.id, // Use internal user.id
      members: {
        create: {
          userId, // Use clerkId for member relationship
          role: "OWNER",
          status: "ACTIVE",
        },
      },
    },
  })

  return organization
}

// Ensure user has at least one organization
export async function ensureUserHasOrganization(): Promise<string> {
  const userId = await getCurrentUser()
  const user = await ensureUserExists(userId)

  // Check if user has any organizations
  const existingOrg = await prisma.organization.findFirst({
    where: {
      OR: [
        { ownerId: user.id },
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

  const newOrg = await createOrganization({
    name: defaultName,
    slug: defaultSlug,
    size: "SMALL",
  })

  return newOrg.slug
}

// Generate a slug from a name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50) // Limit length
}

// Check if user has access to organization
export async function checkUserAccess(
  organizationSlug: string,
  requiredRole?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
): Promise<boolean> {
  try {
    const organization = await getOrganizationBySlug(organizationSlug)
    if (!organization) {
      return false
    }

    if (!requiredRole) {
      return true // User has access
    }

    // Define role hierarchy
    const roleHierarchy = {
      OWNER: 4,
      ADMIN: 3,
      MEMBER: 2,
      VIEWER: 1,
    }

    const userRoleLevel = roleHierarchy[organization.role]
    const requiredRoleLevel = roleHierarchy[requiredRole]

    return userRoleLevel >= requiredRoleLevel
  } catch {
    return false
  }
}

// Invite user to organization
export async function inviteUserToOrganization(
  organizationSlug: string,
  email: string,
  role: "ADMIN" | "MEMBER" | "VIEWER" = "MEMBER",
) {
  const userId = await getCurrentUser()
  const user = await ensureUserExists(userId)
  const organization = await getOrganizationBySlug(organizationSlug)

  if (!organization) {
    throw new Error("Organization not found")
  }

  // Check if user has permission to invite
  if (!["OWNER", "ADMIN"].includes(organization.role)) {
    throw new Error("Insufficient permissions to invite users")
  }

  // Check if user is already a member
  const existingMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId: organization.id,
      user: { email },
    },
  })

  if (existingMember) {
    throw new Error("User is already a member of this organization")
  }

  // Create invitation
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const invitation = await prisma.organizationInvitation.create({
    data: {
      email,
      role,
      token,
      expiresAt,
      organizationId: organization.id,
      invitedById: user.id, // Use internal user.id
    },
  })

  return invitation
}

// Accept invitation
export async function acceptInvitation(token: string) {
  const userId = await getCurrentUser()
  const user = await ensureUserExists(userId)

  const invitation = await prisma.organizationInvitation.findUnique({
    where: { token },
    include: { organization: true },
  })

  if (!invitation) {
    throw new Error("Invalid invitation token")
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error("Invitation has expired")
  }

  if (user.email !== invitation.email) {
    throw new Error("Invitation email does not match user email")
  }

  // Create membership
  await prisma.organizationMember.create({
    data: {
      userId, // clerkId for member relationship
      organizationId: invitation.organizationId,
      role: invitation.role,
      status: "ACTIVE",
    },
  })

  // Delete invitation
  await prisma.organizationInvitation.delete({
    where: { id: invitation.id },
  })

  return invitation.organization
}
