"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { GripVertical } from "lucide-react"

interface ResizablePanelsProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
}

export function ResizablePanels({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      setLeftWidth(Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, minLeftWidth, maxLeftWidth])

  return (
    <div ref={containerRef} className="flex h-full relative">
      <div style={{ width: `${leftWidth}%` }} className="overflow-hidden">
        {left}
      </div>

      <motion.div
        className={`w-1 bg-border hover:bg-primary cursor-col-resize relative group ${isDragging ? "bg-primary" : ""}`}
        onMouseDown={() => setIsDragging(true)}
        whileHover={{ width: 4 }}
      >
        <div className="absolute inset-y-0 -left-2 -right-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-background border border-border rounded-full p-1">
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-hidden">
        {right}
      </div>
    </div>
  )
}
