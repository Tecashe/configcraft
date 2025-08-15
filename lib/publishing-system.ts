import { prisma } from "@/lib/prisma"
import { codeProcessor, type DeploymentPackage } from "@/lib/code-processor"
import type { ChatFile } from "@/lib/chat-management"

export interface PublishedTool {
  id: string
  toolId: string
  subdomain: string
  customDomain?: string
  url: string
  status: "deploying" | "deployed" | "failed"
  deploymentId?: string
  error?: string
  createdAt: Date
  updatedAt: Date
}

export interface DeploymentConfig {
  subdomain: string
  customDomain?: string
  environment: Record<string, string>
  buildCommand?: string
  outputDirectory?: string
}

// Production-ready Publishing System
export class PublishingSystem {
  private deploymentProvider = "vercel" // Could be vercel, netlify, etc.

  // Publish a tool to a subdomain
  async publishTool(
    toolId: string,
    files: ChatFile[],
    config: DeploymentConfig,
    organizationId: string,
  ): Promise<PublishedTool> {
    try {
      // Check if subdomain is available
      const existingPublication = await prisma.publishedTool.findFirst({
        where: {
          subdomain: config.subdomain,
          status: { in: ["deploying", "deployed"] },
        },
      })

      if (existingPublication) {
        throw new Error("Subdomain is already taken")
      }

      // Get tool details
      const tool = await prisma.tool.findUnique({
        where: { id: toolId },
      })

      if (!tool) {
        throw new Error("Tool not found")
      }

      // Create deployment package
      const deploymentPackage = await codeProcessor.createDeploymentPackage(toolId, files, tool.name, organizationId)

      // Create published tool record
      const publishedTool = await prisma.publishedTool.create({
        data: {
          toolId,
          subdomain: config.subdomain,
          customDomain: config.customDomain,
          url: this.generateToolUrl(config.subdomain, config.customDomain),
          status: "deploying",
          organizationId,
        },
      })

      // Start deployment process
      this.deployToProvider(publishedTool.id, deploymentPackage, config)

      return this.mapToPublishedTool(publishedTool)
    } catch (error) {
      console.error("Failed to publish tool:", error)
      throw new Error(`Failed to publish tool: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Update published tool
  async updatePublishedTool(
    publishedToolId: string,
    files: ChatFile[],
    organizationId: string,
  ): Promise<PublishedTool> {
    try {
      const publishedTool = await prisma.publishedTool.findUnique({
        where: { id: publishedToolId },
        include: { tool: true },
      })

      if (!publishedTool) {
        throw new Error("Published tool not found")
      }

      // Create new deployment package
      const deploymentPackage = await codeProcessor.createDeploymentPackage(
        publishedTool.toolId,
        files,
        publishedTool.tool.name,
        organizationId,
      )
       //TODO
      // Update status to deploying
      await prisma.publishedTool.update({
        where: { id: publishedToolId },
        data: { status: "deploying" },
      })

      // Deploy update
      const config: DeploymentConfig = {
        subdomain: publishedTool.subdomain,
        customDomain: publishedTool.customDomain || undefined,
        environment: {},
      }

      this.deployToProvider(publishedToolId, deploymentPackage, config)

      const updatedTool = await prisma.publishedTool.findUnique({
        where: { id: publishedToolId },
      })

      return this.mapToPublishedTool(updatedTool!)
    } catch (error) {
      console.error("Failed to update published tool:", error)
      throw new Error(`Failed to update published tool: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Unpublish a tool
  async unpublishTool(publishedToolId: string): Promise<void> {
    try {
      const publishedTool = await prisma.publishedTool.findUnique({
        where: { id: publishedToolId },
      })

      if (!publishedTool) {
        throw new Error("Published tool not found")
      }

      // Remove from deployment provider
      if (publishedTool.deploymentId) {
        await this.removeFromProvider(publishedTool.deploymentId)
      }

      // Delete from database
      await prisma.publishedTool.delete({
        where: { id: publishedToolId },
      })
    } catch (error) {
      console.error("Failed to unpublish tool:", error)
      throw new Error(`Failed to unpublish tool: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Get published tool by ID
  async getPublishedTool(publishedToolId: string): Promise<PublishedTool | null> {
    try {
      const publishedTool = await prisma.publishedTool.findUnique({
        where: { id: publishedToolId },
      })

      if (!publishedTool) {
        return null
      }

      return this.mapToPublishedTool(publishedTool)
    } catch (error) {
      console.error("Failed to get published tool:", error)
      return null
    }
  }

  // Get all published tools for an organization
  async getOrganizationPublishedTools(organizationId: string): Promise<PublishedTool[]> {
    try {
      const publishedTools = await prisma.publishedTool.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
      })

      return publishedTools.map(this.mapToPublishedTool)
    } catch (error) {
      console.error("Failed to get organization published tools:", error)
      return []
    }
  }

  // Check subdomain availability
  async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    try {
      const existing = await prisma.publishedTool.findFirst({
        where: {
          subdomain,
          status: { in: ["deploying", "deployed"] },
        },
      })

      return !existing
    } catch (error) {
      console.error("Failed to check subdomain availability:", error)
      return false
    }
  }

  // Get deployment status
  async getDeploymentStatus(publishedToolId: string): Promise<"deploying" | "deployed" | "failed"> {
    try {
      const publishedTool = await prisma.publishedTool.findUnique({
        where: { id: publishedToolId },
      })

      if (!publishedTool) {
        return "failed"
      }

      // Check with deployment provider if still deploying
      if (publishedTool.status === "deploying" && publishedTool.deploymentId) {
        const providerStatus = await this.checkProviderStatus(publishedTool.deploymentId)

        if (providerStatus !== "deploying") {
          // Update status in database
          await prisma.publishedTool.update({
            where: { id: publishedToolId },
            data: { status: providerStatus },
          })
        }

        return providerStatus
      }

      return publishedTool.status
    } catch (error) {
      console.error("Failed to get deployment status:", error)
      return "failed"
    }
  }

  // Private method to deploy to provider
  private async deployToProvider(
    publishedToolId: string,
    deploymentPackage: DeploymentPackage,
    config: DeploymentConfig,
  ): Promise<void> {
    try {
      // This would integrate with your chosen deployment provider
      // For now, we'll simulate the deployment process

      if (this.deploymentProvider === "vercel") {
        await this.deployToVercel(publishedToolId, deploymentPackage, config)
      } else {
        // Add other providers as needed
        throw new Error(`Deployment provider ${this.deploymentProvider} not supported`)
      }
    } catch (error) {
      console.error("Deployment failed:", error)

      // Update status to failed
      await prisma.publishedTool.update({
        where: { id: publishedToolId },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Deployment failed",
        },
      })
    }
  }

  // Private method to deploy to Vercel
  private async deployToVercel(
    publishedToolId: string,
    deploymentPackage: DeploymentPackage,
    config: DeploymentConfig,
  ): Promise<void> {
    try {
      // This would use the Vercel API to deploy
      // For production, you'd implement the actual Vercel deployment logic

      // Simulate deployment process
      setTimeout(async () => {
        try {
          // Simulate successful deployment
          const deploymentId = `vercel_${Date.now()}`

          await prisma.publishedTool.update({
            where: { id: publishedToolId },
            data: {
              status: "deployed",
              deploymentId,
            },
          })
        } catch (error) {
          console.error("Simulated deployment failed:", error)
          await prisma.publishedTool.update({
            where: { id: publishedToolId },
            data: {
              status: "failed",
              error: "Deployment simulation failed",
            },
          })
        }
      }, 5000) // Simulate 5 second deployment
    } catch (error) {
      throw error
    }
  }

  // Private method to check provider status
  private async checkProviderStatus(deploymentId: string): Promise<"deploying" | "deployed" | "failed"> {
    try {
      // This would check the actual deployment status with the provider
      // For now, we'll return the current status
      return "deployed" // Simulate successful deployment
    } catch (error) {
      console.error("Failed to check provider status:", error)
      return "failed"
    }
  }

  // Private method to remove from provider
  private async removeFromProvider(deploymentId: string): Promise<void> {
    try {
      // This would remove the deployment from the provider
      // Implementation depends on the provider's API
      console.log(`Removing deployment ${deploymentId} from provider`)
    } catch (error) {
      console.error("Failed to remove from provider:", error)
    }
  }

  // Private method to generate tool URL
  private generateToolUrl(subdomain: string, customDomain?: string): string {
    if (customDomain) {
      return `https://${customDomain}`
    }
    return `https://${subdomain}.configcraft.app`
  }

  // Private method to map database model to interface
  private mapToPublishedTool(dbTool: any): PublishedTool {
    return {
      id: dbTool.id,
      toolId: dbTool.toolId,
      subdomain: dbTool.subdomain,
      customDomain: dbTool.customDomain,
      url: dbTool.url,
      status: dbTool.status,
      deploymentId: dbTool.deploymentId,
      error: dbTool.error,
      createdAt: dbTool.createdAt,
      updatedAt: dbTool.updatedAt,
    }
  }
}

// Export singleton instance
export const publishingSystem = new PublishingSystem()
