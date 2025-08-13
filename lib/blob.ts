import { put, del, list } from "@vercel/blob"

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is not set")
}

export interface UploadResult {
  url: string
  pathname: string
  contentType: string
  contentDisposition: string
}

export async function uploadFile(file: File, folder = "uploads"): Promise<UploadResult> {
  try {
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    })

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      contentDisposition: `attachment; filename="${file.name}"`,
    }
  } catch (error) {
    console.error("File upload error:", error)
    throw new Error("Failed to upload file")
  }
}

export async function deleteFile(pathname: string): Promise<void> {
  try {
    await del(pathname)
  } catch (error) {
    console.error("File deletion error:", error)
    throw new Error("Failed to delete file")
  }
}

export async function listFiles(folder = "uploads") {
  try {
    const { blobs } = await list({
      prefix: folder,
      limit: 100,
    })
    return blobs
  } catch (error) {
    console.error("File listing error:", error)
    throw new Error("Failed to list files")
  }
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || ""
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"]
  return imageExtensions.includes(getFileExtension(filename))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
