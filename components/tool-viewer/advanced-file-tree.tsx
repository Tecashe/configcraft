"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, FileCode, Folder, FolderOpen, FileJson, FileType, ImageIcon, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  path: string
  type: "file" | "folder"
  content?: string
  language?: string
  children?: FileNode[]
  size?: number
  lines?: number
}

interface AdvancedFileTreeProps {
  files: Array<{ name: string; path: string; content: string; type?: string }>
  selectedFile: string | null
  onFileSelect: (file: { name: string; content: string; type?: string; path: string }) => void
}

function buildFileTree(files: Array<{ name: string; path: string; content: string; type?: string }>): FileNode[] {
  const root: FileNode[] = []

  files.forEach((file) => {
    const parts = file.path.split("/")
    let current = root

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      let node = current.find((n) => n.name === part)

      if (!node) {
        node = {
          name: part,
          path: parts.slice(0, index + 1).join("/"),
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
          content: isFile ? file.content : undefined,
          language: isFile ? file.type : undefined,
          lines: isFile ? file.content.split("\n").length : undefined,
          size: isFile ? new Blob([file.content]).size : undefined,
        }
        current.push(node)
      }

      if (!isFile && node.children) {
        current = node.children
      }
    })
  })

  return root
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()

  switch (ext) {
    case "json":
      return FileJson
    case "ts":
    case "tsx":
      return FileType
    case "png":
    case "jpg":
    case "svg":
      return ImageIcon
    case "config":
      return Settings
    default:
      return FileCode
  }
}

function FileTreeNode({
  node,
  level = 0,
  selectedFile,
  onFileSelect,
}: {
  node: FileNode
  level?: number
  selectedFile: string | null
  onFileSelect: (file: any) => void
}) {
  const [isOpen, setIsOpen] = useState(level === 0)
  const Icon = node.type === "folder" ? (isOpen ? FolderOpen : Folder) : getFileIcon(node.name)

  const isSelected = selectedFile === node.name

  return (
    <div>
      <motion.div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (node.type === "folder") {
            setIsOpen(!isOpen)
          } else {
            onFileSelect({
              name: node.name,
              content: node.content || "",
              type: node.language,
              path: node.path,
            })
          }
        }}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15 }}
      >
        {node.type === "folder" && (
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}
        <Icon className={cn("w-4 h-4", node.type === "folder" ? "text-primary" : "text-muted-foreground")} />
        <span className="flex-1 text-sm truncate">{node.name}</span>
        {node.type === "file" && node.lines && (
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {node.lines}L
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {node.type === "folder" && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                level={level + 1}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AdvancedFileTree({ files, selectedFile, onFileSelect }: AdvancedFileTreeProps) {
  const tree = buildFileTree(files)

  return (
    <div className="space-y-1">
      {tree.map((node) => (
        <FileTreeNode key={node.path} node={node} selectedFile={selectedFile} onFileSelect={onFileSelect} />
      ))}
    </div>
  )
}
