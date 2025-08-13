import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not set")
}

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from = "ConfigCraft <noreply@configcraft.com>" }: EmailTemplate) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Email send error:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Email service error:", error)
    throw error
  }
}

export function generateWelcomeEmail(userName: string, companyName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ConfigCraft</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ConfigCraft!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi ${userName},</h2>
        
        <p>Welcome to ConfigCraft! We're excited to help ${companyName} build custom business tools in minutes, not months.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
          <h3 style="margin-top: 0; color: #7c3aed;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Complete your company profile setup</li>
            <li>Create your first custom business tool</li>
            <li>Invite your team members</li>
            <li>Explore our template library</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
             style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Get Started
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #7c3aed;">help center</a>.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          ConfigCraft - Custom business tools in 24 hours, not 6 months<br>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color: #7c3aed;">configcraft.com</a>
        </p>
      </div>
    </body>
    </html>
  `
}

export function generateToolCreatedEmail(userName: string, toolName: string, toolUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Tool is Ready!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Tool is Ready!</h1>
      </div>
      
      <div style="background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi ${userName},</h2>
        
        <p>Great news! Your custom tool <strong>"${toolName}"</strong> has been successfully created and is ready to use.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <h3 style="margin-top: 0; color: #059669;">What You Can Do Now:</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Test your tool with sample data</li>
            <li>Customize the styling and layout</li>
            <li>Invite team members to collaborate</li>
            <li>Publish it for your team to use</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${toolUrl}" 
             style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Your Tool
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          Need help customizing your tool? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #059669;">documentation</a> or contact support.
        </p>
      </div>
    </body>
    </html>
  `
}

export function generateInviteEmail(inviterName: string, companyName: string, inviteUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited to Join ${companyName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
        <p><strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> on ConfigCraft.</p>
        
        <p>ConfigCraft helps teams build custom business tools in minutes. You'll be able to:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
          <ul style="margin: 0; padding-left: 20px;">
            <li>Access your team's custom tools</li>
            <li>Collaborate on tool development</li>
            <li>Create your own business tools</li>
            <li>Integrate with your existing workflow</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">
          This invitation will expire in 7 days. If you have any questions, contact ${inviterName} or our support team.
        </p>
      </div>
    </body>
    </html>
  `
}
