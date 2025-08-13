"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, File, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUpload: (result: { url: string; pathname: string }) => void
  folder?: string
  accept?: string
  maxSize?: number
  className?: string
}

export function FileUpload({ onUpload, folder = "uploads", accept, maxSize = 10, className }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()
      onUpload(result)

      toast({
        title: "Upload successful",
        description: "File has been uploaded successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <Card
      className={`${className} ${dragOver ? "border-primary bg-primary/5" : ""} ${
        uploading ? "opacity-50" : ""
      } transition-all duration-200`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-lg font-medium mb-2">Upload File</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop a file here, or click to select</p>

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-transparent"
          >
            {uploading ? "Uploading..." : "Choose File"}
          </Button>

          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />

          <p className="text-xs text-muted-foreground mt-2">Maximum file size: {maxSize}MB</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface UploadedFile {
  url: string
  pathname: string
  name: string
  size: number
  type: string
}

interface FileListProps {
  files: UploadedFile[]
  onRemove: (pathname: string) => void
}

export function FileList({ files, onRemove }: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = (type: string) => type.startsWith("image/")

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.pathname} className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
            {isImage(file.type) ? (
              <ImageIcon className="w-4 h-4 text-primary" />
            ) : (
              <File className="w-4 h-4 text-primary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(file.pathname)}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
