"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface CodeMinimapProps {
  content: string
  currentLine?: number
  onLineClick?: (line: number) => void
}

export function CodeMinimap({ content, currentLine = 0, onLineClick }: CodeMinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const lines = content.split("\n")
  const totalLines = lines.length

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const lineHeight = height / totalLines

    ctx.clearRect(0, 0, width, height)

    // Draw code representation
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (trimmed.length === 0) return

      const intensity = Math.min(trimmed.length / 80, 1)
      const y = index * lineHeight

      ctx.fillStyle = `rgba(136, 136, 136, ${intensity * 0.3})`
      ctx.fillRect(0, y, width * (trimmed.length / 100), Math.max(lineHeight, 1))
    })

    // Draw current line indicator
    if (currentLine >= 0 && currentLine < totalLines) {
      ctx.fillStyle = "rgba(168, 85, 247, 0.5)"
      ctx.fillRect(0, currentLine * lineHeight, width, Math.max(lineHeight * 3, 2))
    }

    // Draw hovered line
    if (hoveredLine !== null) {
      ctx.fillStyle = "rgba(168, 85, 247, 0.3)"
      ctx.fillRect(0, hoveredLine * lineHeight, width, Math.max(lineHeight, 1))
    }
  }, [content, currentLine, hoveredLine, totalLines])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLineClick) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const y = e.clientY - rect.top
    const line = Math.floor((y / rect.height) * totalLines)
    onLineClick(line)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const y = e.clientY - rect.top
    const line = Math.floor((y / rect.height) * totalLines)
    setHoveredLine(line)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative">
      <canvas
        ref={canvasRef}
        width={80}
        height={600}
        className="cursor-pointer border-l border-border bg-card/50"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredLine(null)}
      />
      <div className="absolute top-2 left-2 text-xs text-muted-foreground">{totalLines} lines</div>
    </motion.div>
  )
}
