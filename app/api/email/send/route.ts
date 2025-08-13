import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { sendEmail, generateWelcomeEmail, generateToolCreatedEmail, generateInviteEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma" // Declare the prisma variable

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { type, to, data } = body

    let emailContent: { subject: string; html: string }

    switch (type) {
      case "welcome":
        emailContent = {
          subject: "Welcome to ConfigCraft!",
          html: generateWelcomeEmail(data.userName, data.companyName),
        }
        break

      case "tool_created":
        emailContent = {
          subject: `Your tool "${data.toolName}" is ready!`,
          html: generateToolCreatedEmail(data.userName, data.toolName, data.toolUrl),
        }
        break

      case "invite":
        emailContent = {
          subject: `You're invited to join ${data.companyName} on ConfigCraft`,
          html: generateInviteEmail(data.inviterName, data.companyName, data.inviteUrl),
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
        type: "EMAIL_SENT",
        userId: user.id,
        companyId: company.id,
        metadata: {
          emailType: type,
          recipient: to,
          subject: emailContent.subject,
        },
      },
    })

    return NextResponse.json({ success: true, messageId: result?.id })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
