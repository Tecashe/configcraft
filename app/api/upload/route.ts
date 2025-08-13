import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { uploadFile } from "@/lib/blob"
import { prisma } from "@/lib/prisma" // Declare the prisma variable

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const formData = await req.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "uploads"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const result = await uploadFile(file, `${company.id}/${folder}`)

    // Log the upload
    await prisma.usageRecord.create({
      data: {
        type: "FILE_UPLOADED",
        userId: user.id,
        companyId: company.id,
        metadata: {
          filename: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: result.url,
        },
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
