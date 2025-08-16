// import { type NextRequest, NextResponse } from "next/server"
// import { requireCompany } from "@/lib/auth"
// import { sendEmail, generateWelcomeEmail, generateToolCreatedEmail, generateInviteEmail } from "@/lib/email"
// import { prisma } from "@/lib/prisma" // Declare the prisma variable

// export async function POST(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const body = await req.json()
//     const { type, to, data } = body

//     let emailContent: { subject: string; html: string }

//     switch (type) {
//       case "welcome":
//         emailContent = {
//           subject: "Welcome to ConfigCraft!",
//           html: generateWelcomeEmail(data.userName, data.companyName),
//         }
//         break

//       case "tool_created":
//         emailContent = {
//           subject: `Your tool "${data.toolName}" is ready!`,
//           html: generateToolCreatedEmail(data.userName, data.toolName, data.toolUrl),
//         }
//         break

//       case "invite":
//         emailContent = {
//           subject: `You're invited to join ${data.companyName} on ConfigCraft`,
//           html: generateInviteEmail(data.inviterName, data.companyName, data.inviteUrl),
//         }
//         break

//       default:
//         return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
//     }

//     const result = await sendEmail({
//       to,
//       subject: emailContent.subject,
//       html: emailContent.html,
//     })

//     // Log the email
//     await prisma.usageRecord.create({
//       data: {
//         type: "EMAIL_SENT",
//         userId: user.id,
//         companyId: company.id,
//         metadata: {
//           emailType: type,
//           recipient: to,
//           subject: emailContent.subject,
//         },
//       },
//     })

//     return NextResponse.json({ success: true, messageId: result?.id })
//   } catch (error) {
//     console.error("Email send error:", error)
//     return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { sendEmail, generateWelcomeEmail, generateToolCreatedEmail, generateInviteEmail } from "@/lib/email"
import { z } from "zod"

const sendEmailSchema = z.object({
  type: z.enum(["welcome", "tool_created", "invite"]),
  to: z.string().email(),
  organizationId: z.string(),
  data: z.object({
    userName: z.string().optional(),
    organizationName: z.string().optional(),
    toolName: z.string().optional(),
    toolUrl: z.string().url().optional(),
    inviterName: z.string().optional(),
    inviteUrl: z.string().url().optional(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { type, to, organizationId, data } = sendEmailSchema.parse(body)

    // Verify user has access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Check subscription limits for email sending
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organizationId },
      orderBy: { createdAt: "desc" },
    })

    // Count emails sent this month
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const emailsSentThisMonth = await prisma.usageRecord.count({
      where: {
        organizationId: organizationId,
        type: "API_CALL",
        createdAt: { gte: currentMonthStart },
        metadata: {
          path: ["action"],
          equals: "email_sent",
        },
      },
    })

    // Check limits based on plan
    const emailLimit = subscription?.plan === "FREE" ? 10 : subscription?.plan === "STARTER" ? 100 : 1000
    if (emailsSentThisMonth >= emailLimit) {
      return NextResponse.json({ error: "Email limit exceeded for current plan" }, { status: 429 })
    }

    let emailContent: { subject: string; html: string }

    switch (type) {
      case "welcome":
        emailContent = {
          subject: "Welcome to ConfigCraft!",
          html: generateWelcomeEmail(data.userName || "User", data.organizationName || membership.organization.name),
        }
        break

      case "tool_created":
        if (!data.toolName || !data.toolUrl) {
          return NextResponse.json({ error: "Tool name and URL required for tool_created email" }, { status: 400 })
        }
        emailContent = {
          subject: `Your tool "${data.toolName}" is ready!`,
          html: generateToolCreatedEmail(data.userName || "User", data.toolName, data.toolUrl),
        }
        break

      case "invite":
        if (!data.inviterName || !data.inviteUrl) {
          return NextResponse.json({ error: "Inviter name and invite URL required for invite email" }, { status: 400 })
        }
        emailContent = {
          subject: `You're invited to join ${data.organizationName || membership.organization.name} on ConfigCraft`,
          html: generateInviteEmail(
            data.inviterName,
            data.organizationName || membership.organization.name,
            data.inviteUrl,
          ),
        }
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    const result = await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    // Log the email
    await prisma.usageRecord.create({
      data: {
        type: "API_CALL",
        userId: userId,
        organizationId: organizationId,
        metadata: {
          action: "email_sent",
          emailType: type,
          recipient: to,
          subject: emailContent.subject,
        },
      },
    })

    return NextResponse.json({ success: true, messageId: result?.id })
  } catch (error) {
    console.error("Email send error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
