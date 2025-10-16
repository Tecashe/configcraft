"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeViewerProps {
  fileName: string
  content: string
  language?: string
}

export function CodeViewer({ fileName, content, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast({ title: "Copied to clipboard" })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLanguageColor = (lang?: string) => {
    const colors: Record<string, string> = {
      typescript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      javascript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      tsx: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      jsx: "bg-green-500/10 text-green-400 border-green-500/20",
      css: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      json: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    }
    return colors[lang || ""] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium truncate">{fileName}</span>
          {language && (
            <Badge variant="outline" className={getLanguageColor(language)}>
              {language}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} className="h-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <ScrollArea className="flex-1">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-foreground">{content}</code>
        </pre>
      </ScrollArea>
    </div>
  )
}
