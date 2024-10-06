import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tomlPath = searchParams.get('path')

  if (typeof tomlPath !== 'string') {
    return NextResponse.json(
      { error: `Invalid path: ${tomlPath}` },
      { status: 400 }
    )
  }

  try {
    let fileContent: string

    if (process.env.VERCEL) {
      // Vercel 环境：使用 @vercel/next 静态导入
      const filePath = path.join('public', tomlPath)
      console.log('[INFO] Vercel file path:', filePath)
      const importedContent = await import(`@vercel/next?url=${filePath}`)
      fileContent = importedContent.default
    } else {
      // 非 Vercel 环境：使用 fs 读取文件
      const filePath = path.join(process.cwd(), 'public', tomlPath)
      console.log('[INFO] Local file path:', filePath)
      fileContent = await fs.readFile(filePath, 'utf8')
    }

    return new NextResponse(fileContent, {
      headers: { 'Content-Type': 'text/plain' },
    })
  } catch (error) {
    console.error('[ERROR] Error reading file:', error)
    return NextResponse.json(
      { error: `Error reading file: ${(error as Error).message}` },
      { status: 404 }
    )
  }
}
