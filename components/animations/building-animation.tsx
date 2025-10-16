"use client"

import { useEffect, useState } from "react"
import { Code2, Layers, Zap, Box, FileCode, Sparkles } from "lucide-react"

export function BuildingAnimation() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  const phases = [
    { icon: Code2, label: "Analyzing requirements", color: "text-purple-400" },
    { icon: Layers, label: "Designing architecture", color: "text-blue-400" },
    { icon: Box, label: "Building components", color: "text-emerald-400" },
    { icon: FileCode, label: "Generating code", color: "text-amber-400" },
    { icon: Zap, label: "Optimizing performance", color: "text-pink-400" },
    { icon: Sparkles, label: "Finalizing", color: "text-cyan-400" },
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 0.5
      })
    }, 50)

    const phaseInterval = setInterval(() => {
      setPhase((prev) => (prev + 1) % phases.length)
    }, 3000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(phaseInterval)
    }
  }, [])

  const CurrentIcon = phases[phase].icon

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <CurrentIcon className={`h-16 w-16 ${phases[phase].color} animate-pulse`} />
        </div>
      </div>

      {/* Phase Label */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{phases[phase].label}</h3>
        <p className="text-sm text-muted-foreground">Building your tool with AI precision</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-2">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Floating Code Blocks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xs font-mono text-foreground"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {["</>", "{}", "[]", "fn()", "=>", "const", "let", "var"][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>
    </div>
  )
}
