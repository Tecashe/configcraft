"use client"

import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowLeft, Download, ExternalLink, Share2 } from "lucide-react"

interface ToolNavbarProps {
  toolName?: string
  onDownload?: () => void
  onShare?: () => void
  previewUrl?: string
}

export function ToolNavbar({ toolName, onDownload, onShare, previewUrl }: ToolNavbarProps) {
  const params = useParams()
  const pathname = usePathname()
  const orgSlug = params?.slug as string

  return (
    <div className="h-14 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <Link href={`/${orgSlug}/tools`}>
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/${orgSlug}/tools`}>Tools</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{toolName || "Untitled Tool"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {previewUrl && (
            <Button variant="ghost" size="sm" asChild className="h-8">
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </a>
            </Button>
          )}
          {onShare && (
            <Button variant="ghost" size="sm" onClick={onShare} className="h-8">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
          {onDownload && (
            <Button variant="default" size="sm" onClick={onDownload} className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
