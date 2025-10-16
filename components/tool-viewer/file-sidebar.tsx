"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileNode[]
  content?: string
  language?: string
}

interface FileSidebarProps {
  files: Array<{ name: string; path?: string; content: string; type?: string }>
  selectedFile: string | null
  onFileSelect: (file: { name: string; content: string; type?: string }) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function FileSidebar({ files, selectedFile, onFileSelect, isCollapsed, onToggleCollapse }: FileSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]))

  // Build file tree from flat file list
  const buildFileTree = (): FileNode[] => {
    const root: FileNode[] = []

    files.forEach((file) => {
      const path = file.path || file.name
      const parts = path.split("/").filter(Boolean)
      let currentLevel = root

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1
        const fullPath = parts.slice(0, index + 1).join("/")

        let existing = currentLevel.find((node) => node.name === part)

        if (!existing) {
          existing = {
            name: part,
            path: fullPath,
            type: isFile ? "file" : "folder",
            children: isFile ? undefined : [],
            content: isFile ? file.content : undefined,
            language: isFile ? file.type : undefined,
          }
          currentLevel.push(existing)
        }

        if (!isFile && existing.children) {
          currentLevel = existing.children
        }
      })
    })

    return root
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path)
    const isSelected = selectedFile === node.name

    if (node.type === "folder") {
      return (
        <div key={node.path}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFolder(node.path)}
            className={cn("w-full justify-start h-8 px-2 font-normal hover:bg-accent", depth > 0 && "ml-4")}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1 shrink-0" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1 shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 mr-2 shrink-0 text-primary" />
            ) : (
              <Folder className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate text-sm">{node.name}</span>
          </Button>
          {isExpanded && node.children && (
            <div className="ml-2">{node.children.map((child) => renderNode(child, depth + 1))}</div>
          )}
        </div>
      )
    }

    return (
      <Button
        key={node.path}
        variant="ghost"
        size="sm"
        onClick={() => onFileSelect({ name: node.name, content: node.content || "", type: node.language })}
        className={cn(
          "w-full justify-start h-8 px-2 font-normal hover:bg-accent",
          depth > 0 && "ml-4",
          isSelected && "bg-accent",
        )}
      >
        <FileCode className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{node.name}</span>
      </Button>
    )
  }

  const fileTree = buildFileTree()

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col items-center py-4 space-y-2">
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Badge variant="secondary" className="rotate-90 origin-center">
          {files.length}
        </Badge>
      </div>
    )
  }

  return (
    <div className="w-64 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col">
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Files</span>
          <Badge variant="secondary" className="h-5 text-xs">
            {files.length}
          </Badge>
        </div>
        {onToggleCollapse && (
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
            <ChevronRight className="h-3 w-3 rotate-180" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">{fileTree.map((node) => renderNode(node))}</div>
      </ScrollArea>
    </div>
  )
}
