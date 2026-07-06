import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { readFile } from "fs/promises"
import { existsSync } from "fs"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params

    const filepath = join(process.cwd(), "public", "uploads", filename)

    if (!existsSync(filepath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    try {
        const buffer = await readFile(filepath)

        // Determine content type from extension
        const ext = filename.split('.').pop()?.toLowerCase()
        const contentTypeMap: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
        }
        const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch {
        return NextResponse.json({ error: "Failed to read file" }, { status: 500 })
    }
}
