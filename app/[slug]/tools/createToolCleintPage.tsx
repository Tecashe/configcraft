"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, CheckCircle } from "lucide-react"

interface RequirementsAnalysis {
  toolType: string
  dataFields: string[]
  userRoles: string[]
  workflows: string[]
  integrations: string[]
  complexity: "simple" | "medium" | "complex"
  estimatedHours: number
  followUpQuestions: string[]
}

// Follow-up Question Component
function FollowUpQuestion({ question, onAnswer }: { question: string; onAnswer: (answer: string) => void }) {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer)
      setSubmitted(true)
    }
  }

  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
      <p className="font-medium mb-3" style={{ color: "#E0E0E0" }}>
        {question}
      </p>
      {!submitted ? (
        <div className="flex space-x-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            style={{ backgroundColor: "#333333", borderColor: "#333333", color: "#E0E0E0" }}
            className="placeholder:text-[#B0B0B0]"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={!answer.trim()}
            style={{ backgroundColor: "#888888", color: "#121212" }}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm" style={{ color: "#B0B0B0" }}>
            {answer}
          </span>
        </div>
      )}
    </div>
  )
}

export default function CreateToolClientPage() {
  return (
    <div>
      <h1>Create Tool Client Page</h1>
      <FollowUpQuestion question="What is your favorite color?" onAnswer={(answer) => console.log(answer)} />
    </div>
  )
}
