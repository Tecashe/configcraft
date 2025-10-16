// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import {
//   Sparkles,
//   Code2,
//   Rocket,
//   Eye,
//   Download,
//   MessageSquare,
//   Loader2,
//   CheckCircle2,
//   ExternalLink,
//   Settings,
//   Copy,
//   Play,
// } from "lucide-react"
// import { v0ServiceAdvanced, type StreamEvent } from "@/lib/v0-service-advanced"
// import { vercelDeployment } from "@/lib/vercel-deployments"
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

// interface GeneratedFile {
//   name: string
//   content: string
//   type: string
//   path?: string
// }

// interface GenerationResult {
//   chatId: string
//   demoUrl: string | null
//   webUrl: string
//   files: GeneratedFile[]
// }

// export default function UltimateGenerationInterface() {
//   const [activeTab, setActiveTab] = useState("configure")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isDeploying, setIsDeploying] = useState(false)
//   const [generationProgress, setGenerationProgress] = useState(0)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [result, setResult] = useState<GenerationResult | null>(null)
//   const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
//   const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
//   const [chatInput, setChatInput] = useState("")
//   const [isSendingMessage, setIsSendingMessage] = useState(false)
//   const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

//   // Form state
//   const [toolName, setToolName] = useState("")
//   const [category, setCategory] = useState("dashboard")
//   const [requirements, setRequirements] = useState("")
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [attachments, setAttachments] = useState<Array<{ url: string }>>([])

//   const logsEndRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [streamingLogs])

//   const addLog = (message: string) => {
//     const timestamp = new Date().toLocaleTimeString()
//     setStreamingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
//   }

//   const handleGenerate = async () => {
//     if (!toolName || !requirements) {
//       addLog("❌ Please fill in tool name and requirements")
//       return
//     }

//     setIsGenerating(true)
//     setGenerationProgress(0)
//     setStreamingLogs([])
//     setActiveTab("generate")

//     try {
//       addLog("🚀 Starting generation...")
//       setGenerationProgress(10)

//       const response = await v0ServiceAdvanced.generateToolWithStreaming(
//         {
//           toolName,
//           category,
//           requirements,
//           organizationSlug: "default",
//           userEmail: "user@example.com",
//           integrations: selectedIntegrations,
//           attachments,
//           chatPrivacy: "private",
//         },
//         (event: StreamEvent) => {
//           if (event.type === "chunk") {
//             addLog(`📝 ${event.data.message}`)
//             setGenerationProgress((prev) => Math.min(prev + 10, 90))
//           } else if (event.type === "complete") {
//             addLog("✅ Generation complete!")
//             setGenerationProgress(100)
//           } else if (event.type === "error") {
//             addLog(`❌ Error: ${event.data.error}`)
//           }
//         },
//       )

//       // Extract files from response
//       const latestVersion = (response as any).latestVersion
//       const files: GeneratedFile[] =
//         latestVersion?.files?.map((file: any) => ({
//           name: file.name || file.path || "unnamed",
//           content: file.content || file.data || "",
//           type: file.type || file.language || "typescript",
//           path: file.path,
//         })) || []

//       const generationResult: GenerationResult = {
//         chatId: response.id,
//         demoUrl: latestVersion?.demoUrl || null,
//         webUrl: (response as any).webUrl || "",
//         files,
//       }

//       setResult(generationResult)
//       if (files.length > 0) {
//         setSelectedFile(files[0])
//       }

//       addLog(`✨ Generated ${files.length} files successfully!`)
//       setActiveTab("preview")
//     } catch (error) {
//       addLog(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleSendMessage = async () => {
//     if (!chatInput.trim() || !result) return

//     setIsSendingMessage(true)
//     const userMessage = chatInput
//     setChatInput("")

//     setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
//     addLog(`💬 You: ${userMessage}`)

//     try {
//       const response = await v0ServiceAdvanced.continueChat(result.chatId, userMessage, (event: StreamEvent) => {
//         if (event.type === "chunk") {
//           addLog(`🤖 ${event.data.message}`)
//         }
//       })

//       setChatMessages((prev) => [...prev, { role: "assistant", content: "Updated the tool based on your feedback" }])
//       addLog("✅ Tool updated successfully!")

//       // Refresh the result
//       // In a real implementation, you'd fetch the updated chat details
//     } catch (error) {
//       addLog(`❌ Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`)
//     } finally {
//       setIsSendingMessage(false)
//     }
//   }

//   const handleDeploy = async () => {
//     if (!result || result.files.length === 0) {
//       addLog("❌ No files to deploy")
//       return
//     }

//     setIsDeploying(true)
//     addLog("🚀 Starting deployment to Vercel...")

//     try {
//       const deploymentResult = await vercelDeployment.deployToVercel({
//         projectName: toolName.toLowerCase().replace(/\s+/g, "-"),
//         files: result.files.map((file) => ({
//           path: file.path || file.name,
//           content: file.content,
//         })),
//       })

//       if (deploymentResult.success) {
//         setDeploymentUrl(deploymentResult.url || null)
//         addLog(`✅ Deployed successfully! URL: ${deploymentResult.url}`)
//       } else {
//         addLog(`❌ Deployment failed: ${deploymentResult.error}`)
//       }
//     } catch (error) {
//       addLog(`❌ Deployment error: ${error instanceof Error ? error.message : "Unknown error"}`)
//     } finally {
//       setIsDeploying(false)
//     }
//   }

//   const downloadFiles = () => {
//     if (!result) return

//     result.files.forEach((file) => {
//       const blob = new Blob([file.content], { type: "text/plain" })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = file.name
//       a.click()
//       URL.revokeObjectURL(url)
//     })

//     addLog(`📥 Downloaded ${result.files.length} files`)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
//       <div className="container mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
//             Ultimate Tool Generator
//           </h1>
//           <p className="text-slate-400 text-lg">Powered by v0 AI - Generate, Refine, Deploy</p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur">
//             <TabsTrigger value="configure" className="data-[state=active]:bg-blue-600">
//               <Settings className="w-4 h-4 mr-2" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="generate" className="data-[state=active]:bg-purple-600">
//               <Sparkles className="w-4 h-4 mr-2" />
//               Generate
//             </TabsTrigger>
//             <TabsTrigger value="preview" className="data-[state=active]:bg-pink-600" disabled={!result}>
//               <Eye className="w-4 h-4 mr-2" />
//               Preview
//             </TabsTrigger>
//             <TabsTrigger value="chat" className="data-[state=active]:bg-green-600" disabled={!result}>
//               <MessageSquare className="w-4 h-4 mr-2" />
//               Refine
//             </TabsTrigger>
//           </TabsList>

//           {/* Configure Tab */}
//           <TabsContent value="configure" className="space-y-6">
//             <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
//               <div className="space-y-6">
//                 <div>
//                   <Label htmlFor="toolName" className="text-lg font-semibold text-slate-200">
//                     Tool Name
//                   </Label>
//                   <Input
//                     id="toolName"
//                     value={toolName}
//                     onChange={(e) => setToolName(e.target.value)}
//                     placeholder="e.g., Customer Support Dashboard"
//                     className="mt-2 bg-slate-800/50 border-slate-700 text-slate-100"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="category" className="text-lg font-semibold text-slate-200">
//                     Category
//                   </Label>
//                   <select
//                     id="category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="mt-2 w-full p-2 rounded-md bg-slate-800/50 border border-slate-700 text-slate-100"
//                   >
//                     <option value="dashboard">Dashboard</option>
//                     <option value="form">Form</option>
//                     <option value="landing-page">Landing Page</option>
//                     <option value="admin-panel">Admin Panel</option>
//                     <option value="e-commerce">E-commerce</option>
//                     <option value="analytics">Analytics</option>
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="requirements" className="text-lg font-semibold text-slate-200">
//                     Requirements
//                   </Label>
//                   <Textarea
//                     id="requirements"
//                     value={requirements}
//                     onChange={(e) => setRequirements(e.target.value)}
//                     placeholder="Describe what you want to build in detail..."
//                     rows={8}
//                     className="mt-2 bg-slate-800/50 border-slate-700 text-slate-100"
//                   />
//                 </div>

//                 <div>
//                   <Label className="text-lg font-semibold text-slate-200 mb-3 block">Integrations (Optional)</Label>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {["Supabase", "Stripe", "OpenAI", "Resend"].map((integration) => (
//                       <Button
//                         key={integration}
//                         variant={selectedIntegrations.includes(integration) ? "default" : "outline"}
//                         onClick={() => {
//                           setSelectedIntegrations((prev) =>
//                             prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
//                           )
//                         }}
//                         className="w-full"
//                       >
//                         {integration}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handleGenerate}
//                   disabled={isGenerating || !toolName || !requirements}
//                   className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="w-5 h-5 mr-2" />
//                       Generate Tool
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </Card>
//           </TabsContent>

//           {/* Generate Tab */}
//           <TabsContent value="generate" className="space-y-6">
//             <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold text-slate-200">Generation Progress</h3>
//                   <Badge variant="outline" className="text-lg px-4 py-1">
//                     {generationProgress}%
//                   </Badge>
//                 </div>

//                 <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
//                     style={{ width: `${generationProgress}%` }}
//                   />
//                 </div>

//                 <div className="bg-slate-950 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
//                   {streamingLogs.map((log, index) => (
//                     <div key={index} className="text-slate-300 mb-1">
//                       {log}
//                     </div>
//                   ))}
//                   <div ref={logsEndRef} />
//                 </div>
//               </div>
//             </Card>
//           </TabsContent>

//           {/* Preview Tab */}
//           <TabsContent value="preview" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Left: Preview */}
//               <div className="lg:col-span-2 space-y-4">
//                 <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-semibold text-slate-200">Live Preview</h3>
//                     <div className="flex gap-2">
//                       {result?.demoUrl && (
//                         <Button variant="outline" size="sm" onClick={() => window.open(result.demoUrl!, "_blank")}>
//                           <ExternalLink className="w-4 h-4 mr-2" />
//                           Open
//                         </Button>
//                       )}
//                       <Button variant="outline" size="sm" onClick={downloadFiles}>
//                         <Download className="w-4 h-4 mr-2" />
//                         Download
//                       </Button>
//                       <Button
//                         size="sm"
//                         onClick={handleDeploy}
//                         disabled={isDeploying}
//                         className="bg-gradient-to-r from-green-600 to-emerald-600"
//                       >
//                         {isDeploying ? (
//                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         ) : (
//                           <Rocket className="w-4 h-4 mr-2" />
//                         )}
//                         Deploy
//                       </Button>
//                     </div>
//                   </div>

//                   {result?.demoUrl ? (
//                     <iframe
//                       src={result.demoUrl}
//                       className="w-full h-[800px] bg-white rounded-lg border-2 border-slate-700"
//                       title="Generated Tool Preview"
//                       sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//                     />
//                   ) : (
//                     <div className="h-[800px] flex items-center justify-center bg-slate-950 rounded-lg border-2 border-slate-700">
//                       <div className="text-center text-slate-400">
//                         <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                         <p className="text-lg">Preview not available</p>
//                         <p className="text-sm mt-2">View files in the code panel →</p>
//                       </div>
//                     </div>
//                   )}

//                   {deploymentUrl && (
//                     <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-green-400 font-semibold">Deployed Successfully!</p>
//                           <a
//                             href={`https://${deploymentUrl}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-400 hover:underline text-sm"
//                           >
//                             {deploymentUrl}
//                           </a>
//                         </div>
//                         <CheckCircle2 className="w-8 h-8 text-green-400" />
//                       </div>
//                     </div>
//                   )}
//                 </Card>
//               </div>

//               {/* Right: Files */}
//               <div className="space-y-4">
//                 <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
//                   <h3 className="text-xl font-semibold text-slate-200 mb-4">
//                     Generated Files ({result?.files.length || 0})
//                   </h3>
//                   <div className="space-y-2 max-h-[400px] overflow-y-auto">
//                     {result?.files.map((file, index) => (
//                       <button
//                         key={index}
//                         onClick={() => setSelectedFile(file)}
//                         className={`w-full text-left p-3 rounded-lg transition-colors ${
//                           selectedFile === file
//                             ? "bg-blue-600 text-white"
//                             : "bg-slate-800/50 text-slate-300 hover:bg-slate-800"
//                         }`}
//                       >
//                         <div className="flex items-center gap-2">
//                           <Code2 className="w-4 h-4" />
//                           <span className="text-sm font-mono truncate">{file.name}</span>
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </Card>

//                 {selectedFile && (
//                   <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
//                     <div className="flex items-center justify-between mb-4">
//                       <h4 className="text-lg font-semibold text-slate-200 font-mono">{selectedFile.name}</h4>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           navigator.clipboard.writeText(selectedFile.content)
//                           addLog(`📋 Copied ${selectedFile.name} to clipboard`)
//                         }}
//                       >
//                         <Copy className="w-4 h-4" />
//                       </Button>
//                     </div>
//                     <div className="max-h-[400px] overflow-auto rounded-lg">
//                       <SyntaxHighlighter
//                         language={selectedFile.type}
//                         style={vscDarkPlus}
//                         customStyle={{
//                           margin: 0,
//                           borderRadius: "0.5rem",
//                           fontSize: "0.875rem",
//                         }}
//                       >
//                         {selectedFile.content}
//                       </SyntaxHighlighter>
//                     </div>
//                   </Card>
//                 )}
//               </div>
//             </div>
//           </TabsContent>

//           {/* Chat/Refine Tab */}
//           <TabsContent value="chat" className="space-y-6">
//             <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
//               <h3 className="text-xl font-semibold text-slate-200 mb-4">Refine Your Tool</h3>

//               <div className="space-y-4">
//                 <div className="bg-slate-950 rounded-lg p-4 h-96 overflow-y-auto">
//                   {chatMessages.length === 0 ? (
//                     <div className="h-full flex items-center justify-center text-slate-400">
//                       <div className="text-center">
//                         <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                         <p>Start a conversation to refine your tool</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {chatMessages.map((msg, index) => (
//                         <div
//                           key={index}
//                           className={`p-4 rounded-lg ${
//                             msg.role === "user" ? "bg-blue-600/20 ml-8" : "bg-purple-600/20 mr-8"
//                           }`}
//                         >
//                           <p className="text-sm font-semibold text-slate-300 mb-1">
//                             {msg.role === "user" ? "You" : "AI Assistant"}
//                           </p>
//                           <p className="text-slate-200">{msg.content}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   <Input
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     placeholder="Ask for changes or improvements..."
//                     className="bg-slate-800/50 border-slate-700 text-slate-100"
//                     disabled={isSendingMessage}
//                   />
//                   <Button
//                     onClick={handleSendMessage}
//                     disabled={isSendingMessage || !chatInput.trim()}
//                     className="bg-gradient-to-r from-purple-600 to-pink-600"
//                   >
//                     {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Sparkles,
  Code2,
  Rocket,
  Eye,
  Download,
  MessageSquare,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Settings,
  Copy,
  Play,
} from "lucide-react"
import { v0ServiceAdvanced, type StreamEvent } from "@/lib/v0-service-advanced"
import { vercelDeployment } from "@/lib/vercel-deployments"

interface GeneratedFile {
  name: string
  content: string
  type: string
  path?: string
}

interface GenerationResult {
  chatId: string
  demoUrl: string | null
  webUrl: string
  files: GeneratedFile[]
}

export default function UltimateGenerationInterface() {
  const [activeTab, setActiveTab] = useState("configure")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [streamingLogs, setStreamingLogs] = useState<string[]>([])
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

  // Form state
  const [toolName, setToolName] = useState("")
  const [category, setCategory] = useState("dashboard")
  const [requirements, setRequirements] = useState("")
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [attachments, setAttachments] = useState<Array<{ url: string }>>([])

  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [streamingLogs])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setStreamingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const handleGenerate = async () => {
    if (!toolName || !requirements) {
      addLog("❌ Please fill in tool name and requirements")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setStreamingLogs([])
    setActiveTab("generate")

    try {
      addLog("🚀 Starting generation...")
      setGenerationProgress(10)

      const response = await v0ServiceAdvanced.generateToolWithStreaming(
        {
          toolName,
          category,
          requirements,
          organizationSlug: "default",
          userEmail: "user@example.com",
          integrations: selectedIntegrations,
          attachments,
          chatPrivacy: "private",
        },
        (event: StreamEvent) => {
          if (event.type === "chunk") {
            addLog(`📝 ${event.data.message}`)
            setGenerationProgress((prev) => Math.min(prev + 10, 90))
          } else if (event.type === "complete") {
            addLog("✅ Generation complete!")
            setGenerationProgress(100)
          } else if (event.type === "error") {
            addLog(`❌ Error: ${event.data.error}`)
          }
        },
      )

      // Extract files from response
      const latestVersion = (response as any).latestVersion
      const files: GeneratedFile[] =
        latestVersion?.files?.map((file: any) => ({
          name: file.name || file.path || "unnamed",
          content: file.content || file.data || "",
          type: file.type || file.language || "typescript",
          path: file.path,
        })) || []

      const generationResult: GenerationResult = {
        chatId: response.id,
        demoUrl: latestVersion?.demoUrl || null,
        webUrl: (response as any).webUrl || "",
        files,
      }

      setResult(generationResult)
      if (files.length > 0) {
        setSelectedFile(files[0])
      }

      addLog(`✨ Generated ${files.length} files successfully!`)
      setActiveTab("preview")
    } catch (error) {
      addLog(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !result) return

    setIsSendingMessage(true)
    const userMessage = chatInput
    setChatInput("")

    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    addLog(`💬 You: ${userMessage}`)

    try {
      const response = await v0ServiceAdvanced.continueChat(result.chatId, userMessage, (event: StreamEvent) => {
        if (event.type === "chunk") {
          addLog(`🤖 ${event.data.message}`)
        }
      })

      setChatMessages((prev) => [...prev, { role: "assistant", content: "Updated the tool based on your feedback" }])
      addLog("✅ Tool updated successfully!")

      // Refresh the result
      // In a real implementation, you'd fetch the updated chat details
    } catch (error) {
      addLog(`❌ Failed to send message: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleDeploy = async () => {
    if (!result || result.files.length === 0) {
      addLog("❌ No files to deploy")
      return
    }

    setIsDeploying(true)
    addLog("🚀 Starting deployment to Vercel...")

    try {
      const deploymentResult = await vercelDeployment.deployToVercel({
        projectName: toolName.toLowerCase().replace(/\s+/g, "-"),
        files: result.files.map((file) => ({
          path: file.path || file.name,
          content: file.content,
        })),
      })

      if (deploymentResult.success) {
        setDeploymentUrl(deploymentResult.url || null)
        addLog(`✅ Deployed successfully! URL: ${deploymentResult.url}`)
      } else {
        addLog(`❌ Deployment failed: ${deploymentResult.error}`)
      }
    } catch (error) {
      addLog(`❌ Deployment error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsDeploying(false)
    }
  }

  const downloadFiles = () => {
    if (!result) return

    result.files.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    })

    addLog(`📥 Downloaded ${result.files.length} files`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Ultimate Tool Generator
          </h1>
          <p className="text-slate-400 text-lg">Powered by v0 AI - Generate, Refine, Deploy</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 backdrop-blur">
            <TabsTrigger value="configure" className="data-[state=active]:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-pink-600" disabled={!result}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-green-600" disabled={!result}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Refine
            </TabsTrigger>
          </TabsList>

          {/* Configure Tab */}
          <TabsContent value="configure" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="toolName" className="text-lg font-semibold text-slate-200">
                    Tool Name
                  </Label>
                  <Input
                    id="toolName"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g., Customer Support Dashboard"
                    className="mt-2 bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-lg font-semibold text-slate-200">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full p-2 rounded-md bg-slate-800/50 border border-slate-700 text-slate-100"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="form">Form</option>
                    <option value="landing-page">Landing Page</option>
                    <option value="admin-panel">Admin Panel</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-lg font-semibold text-slate-200">
                    Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe what you want to build in detail..."
                    rows={8}
                    className="mt-2 bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                <div>
                  <Label className="text-lg font-semibold text-slate-200 mb-3 block">Integrations (Optional)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Supabase", "Stripe", "OpenAI", "Resend"].map((integration) => (
                      <Button
                        key={integration}
                        variant={selectedIntegrations.includes(integration) ? "default" : "outline"}
                        onClick={() => {
                          setSelectedIntegrations((prev) =>
                            prev.includes(integration) ? prev.filter((i) => i !== integration) : [...prev, integration],
                          )
                        }}
                        className="w-full"
                      >
                        {integration}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !toolName || !requirements}
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Tool
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-200">Generation Progress</h3>
                  <Badge variant="outline" className="text-lg px-4 py-1">
                    {generationProgress}%
                  </Badge>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>

                <div className="bg-slate-950 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                  {streamingLogs.map((log, index) => (
                    <div key={index} className="text-slate-300 mb-1">
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Preview */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-200">Live Preview</h3>
                    <div className="flex gap-2">
                      {result?.demoUrl && (
                        <Button variant="outline" size="sm" onClick={() => window.open(result.demoUrl!, "_blank")}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={downloadFiles}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="bg-gradient-to-r from-green-600 to-emerald-600"
                      >
                        {isDeploying ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Rocket className="w-4 h-4 mr-2" />
                        )}
                        Deploy
                      </Button>
                    </div>
                  </div>

                  {result?.demoUrl ? (
                    <iframe
                      src={result.demoUrl}
                      className="w-full h-[800px] bg-white rounded-lg border-2 border-slate-700"
                      title="Generated Tool Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    />
                  ) : (
                    <div className="h-[800px] flex items-center justify-center bg-slate-950 rounded-lg border-2 border-slate-700">
                      <div className="text-center text-slate-400">
                        <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Preview not available</p>
                        <p className="text-sm mt-2">View files in the code panel →</p>
                      </div>
                    </div>
                  )}

                  {deploymentUrl && (
                    <div className="mt-4 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-400 font-semibold">Deployed Successfully!</p>
                          <a
                            href={`https://${deploymentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm"
                          >
                            {deploymentUrl}
                          </a>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right: Files */}
              <div className="space-y-4">
                <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
                  <h3 className="text-xl font-semibold text-slate-200 mb-4">
                    Generated Files ({result?.files.length || 0})
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {result?.files.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFile(file)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedFile === file
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          <span className="text-sm font-mono truncate">{file.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {selectedFile && (
                  <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-slate-200 font-mono">{selectedFile.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedFile.content)
                          addLog(`📋 Copied ${selectedFile.name} to clipboard`)
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="max-h-[400px] overflow-auto rounded-lg bg-slate-950 p-4">
                      <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
                        <code>{selectedFile.content}</code>
                      </pre>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Chat/Refine Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 backdrop-blur border-slate-800">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">Refine Your Tool</h3>

              <div className="space-y-4">
                <div className="bg-slate-950 rounded-lg p-4 h-96 overflow-y-auto">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <div className="text-center">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Start a conversation to refine your tool</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            msg.role === "user" ? "bg-blue-600/20 ml-8" : "bg-purple-600/20 mr-8"
                          }`}
                        >
                          <p className="text-sm font-semibold text-slate-300 mb-1">
                            {msg.role === "user" ? "You" : "AI Assistant"}
                          </p>
                          <p className="text-slate-200">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask for changes or improvements..."
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                    disabled={isSendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !chatInput.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
