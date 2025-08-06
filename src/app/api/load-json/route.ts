import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file = searchParams.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'File parameter is required' },
        { status: 400 }
      )
    }

    // Construct the full path to the JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', file)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${file}` },
        { status: 404 }
      )
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const jsonData = JSON.parse(fileContent)
    
    return NextResponse.json(jsonData)
    
  } catch (error) {
    console.error('Error loading JSON file:', error)
    return NextResponse.json(
      { error: 'Failed to load JSON file' },
      { status: 500 }
    )
  }
}
