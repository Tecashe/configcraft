"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Download, Share2, ExternalLink, Code2, Eye, Settings, Command } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onAction: (action: string) => void
  files: Array<{ name: string; path: string }>
}

const actions = [
  { id: "preview", label: "Open Preview", icon: Eye, shortcut: "P" },
  { id: "code", label: "View Code", icon: Code2, shortcut: "C" },
  { id: "download", label: "Download Files", icon: Download, shortcut: "D" },
  { id: "share", label: "Share Tool", icon: Share2, shortcut: "S" },
  { id: "deploy", label: "Deploy to Vercel", icon: ExternalLink, shortcut: "V" },
  { id: "settings", label: "Settings", icon: Settings, shortcut: "," },
]

export function CommandPalette({ isOpen, onClose, onAction, files }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState(0)

  const filteredActions = actions.filter((action) => action.label.toLowerCase().includes(search.toLowerCase()))

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()))

  const allResults = [
    ...filteredActions.map((a) => ({ ...a, type: "action" as const })),
    ...filteredFiles.map((f) => ({ ...f, type: "file" as const, icon: Code2 })),
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelected((prev) => (prev + 1) % allResults.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelected((prev) => (prev - 1 + allResults.length) % allResults.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        const result = allResults[selected]
        if (result.type === "action") {
          onAction(result.id)
        } else {
          onAction(`open-file:${result.path}`)
        }
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selected, onAction, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Type a command or search files..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelected(0)
            }}
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {allResults.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">No results found</div>
            ) : (
              allResults.map((result, index) => {
                const Icon = result.icon
                return (
                  <motion.div
                    key={result.type === "action" ? result.id : result.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      selected === index ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onClick={() => {
                      if (result.type === "action") {
                        onAction(result.id)
                      } else {
                        onAction(`open-file:${result.path}`)
                      }
                      onClose()
                    }}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{result.type === "action" ? result.label : result.name}</span>
                    {result.type === "action" && "shortcut" in result && (
                      <kbd className="px-2 py-1 text-xs bg-muted rounded">{result.shortcut}</kbd>
                    )}
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
