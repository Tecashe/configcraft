import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "v0-sdk"

const v0Client = createClient({
  apiKey: "v1:2O1ufiQWUtqtytK816dVv9fP:gyo8fnHgKRFV0bYsg6UP6gWn",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, message } = body

    console.log("[v0-api] Continuing chat:", chatId)

    await v0Client.chats.sendMessage({ chatId, message })

    const updatedChat = await v0Client.chats.getById({ chatId })

    const files = mapSdkFilesToToolFiles(updatedChat.files)

    return NextResponse.json({
      success: true,
      chatId: updatedChat.id,
      demoUrl: updatedChat.demo,
      chatUrl: updatedChat.url,
      files,
    })
  } catch (error: any) {
    console.error("[v0-api] Chat continuation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Chat continuation failed",
      },
      { status: 500 },
    )
  }
}

function mapSdkFilesToToolFiles(
  sdkFiles: any[] | undefined,
): Array<{ name: string; content: string; type?: string; path?: string }> {
  if (!sdkFiles || !Array.isArray(sdkFiles)) {
    return []
  }

  return sdkFiles.map((file: any, index: number) => ({
    name: file?.name ?? file?.meta?.name ?? `file-${index + 1}.tsx`,
    content: file?.content ?? file?.source ?? "",
    type: file?.type ?? file?.lang ?? "typescript",
    path: file?.path ?? undefined,
  }))
}
