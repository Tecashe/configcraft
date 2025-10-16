"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code2, Zap, CheckCircle2, Cpu, Database, Layout, Palette } from "lucide-react"

interface Stage {
  id: string
  label: string
  icon: any
  color: string
  duration: number
}

const stages: Stage[] = [
  { id: "analyze", label: "Analyzing Requirements", icon: Cpu, color: "hsl(var(--chart-1))", duration: 2000 },
  { id: "design", label: "Designing Architecture", icon: Layout, color: "hsl(var(--chart-2))", duration: 2500 },
  { id: "style", label: "Crafting Interface", icon: Palette, color: "hsl(var(--chart-3))", duration: 3000 },
  { id: "code", label: "Generating Code", icon: Code2, color: "hsl(var(--chart-4))", duration: 4000 },
  { id: "integrate", label: "Integrating Systems", icon: Database, color: "hsl(var(--chart-5))", duration: 2000 },
  { id: "optimize", label: "Optimizing Performance", icon: Zap, color: "hsl(var(--primary))", duration: 1500 },
]

export function CinematicBuilder() {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [codeLines, setCodeLines] = useState<string[]>([])

  const sampleCode = [
    "import { useState } from 'react'",
    "export default function Component() {",
    "  const [data, setData] = useState([])",
    "  return (",
    "    <div className='container'>",
    "      <h1>Generated Tool</h1>",
    "      {data.map(item => (",
    "        <Card key={item.id}>",
    "          <CardContent>{item.name}</CardContent>",
    "        </Card>",
    "      ))}",
    "    </div>",
    "  )",
    "}",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStage < stages.length - 1) {
            setCurrentStage(currentStage + 1)
            return 0
          }
          return 100
        }
        return prev + 1
      })
    }, stages[currentStage].duration / 100)

    return () => clearInterval(interval)
  }, [currentStage])

  useEffect(() => {
    if (currentStage === 3) {
      // Code generation stage
      const interval = setInterval(() => {
        setCodeLines((prev) => {
          if (prev.length < sampleCode.length) {
            return [...prev, sampleCode[prev.length]]
          }
          return prev
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [currentStage])

  const CurrentIcon = stages[currentStage].icon

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Ambient background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 2,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl px-8">
        {/* Main stage indicator */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            key={currentStage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="relative">
              <CurrentIcon className="w-12 h-12" style={{ color: stages[currentStage].color }} />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${stages[currentStage].color}` }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </motion.div>
          <motion.h2
            key={`label-${currentStage}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold mb-2"
          >
            {stages[currentStage].label}
          </motion.h2>
          <p className="text-muted-foreground">Building your tool with AI precision</p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full"
              style={{ backgroundColor: stages[currentStage].color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>
              Stage {currentStage + 1} of {stages.length}
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Stage timeline */}
        <div className="flex justify-between mb-12">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const isComplete = index < currentStage
            const isCurrent = index === currentStage

            return (
              <div key={stage.id} className="flex flex-col items-center gap-2 flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isComplete ? "bg-primary border-primary" : isCurrent ? "border-primary" : "border-border"
                  }`}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </motion.div>
                <span
                  className={`text-xs text-center ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}
                >
                  {stage.label.split(" ")[0]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Code generation visualization */}
        <AnimatePresence>
          {currentStage === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-border rounded-lg p-6 font-mono text-sm"
            >
              {codeLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-foreground/80"
                >
                  <span className="text-muted-foreground mr-4">{index + 1}</span>
                  {line}
                </motion.div>
              ))}
              <motion.span
                className="inline-block w-2 h-4 bg-primary ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: "Components", value: Math.floor((progress / 100) * 12) },
            { label: "Lines of Code", value: Math.floor((progress / 100) * 847) },
            { label: "Files", value: Math.floor((progress / 100) * 8) },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              className="bg-card border border-border rounded-lg p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-2xl font-bold text-primary">{metric.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
