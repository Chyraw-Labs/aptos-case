// import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mdxPath = searchParams.get('path')

  console.log('[INFO] mdx.ts: ', mdxPath)

  if (typeof mdxPath !== 'string') {
    // return response.status(400).json({ error: 'Invalid path' })
    return new Response(`Invalid path: ${mdxPath}`, { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', mdxPath)

  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8')

    return new Response(fileContent)
  } catch (error) {
    console.error('Error reading MDX file:', error)
    // res.status(404).json({ error: 'MDX file not found' })
    return new Response(`Error reading file: ${error}`, { status: 404 })
  }
}
