import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const directory = searchParams.get('directory')
    
    if (!directory) {
      return NextResponse.json(
        { error: 'directory parameter is required' },
        { status: 400 }
      )
    }

    const dirPath = path.join(process.cwd(), 'src', 'data', directory)
    
    try {
      const files = await fs.readdir(dirPath)
      return NextResponse.json({ files })
    } catch (error) {
      // If directory doesn't exist, return empty array
      return NextResponse.json({ files: [] })
    }
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}
