import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Load user profile to get display name
    let userDisplayName = 'Unknown'
    try {
      const authorPath = path.join(process.cwd(), 'src', 'data', 'authors', `${userId}.json`)
      const authorData = JSON.parse(await fs.readFile(authorPath, 'utf-8'))
      userDisplayName = authorData.name || userId
    } catch (error) {
      console.error(`Error reading author profile for ${userId}:`, error)
    }

    // Read manuscripts from /src/data/manuscripts/ and filter by authorId
    const manuscriptsDir = path.join(process.cwd(), 'src', 'data', 'manuscripts')
    
    try {
      const manuscriptFiles = await fs.readdir(manuscriptsDir)
      const projects = []

      for (const file of manuscriptFiles) {
        if (file.endsWith('.json')) {
          try {
            const manuscriptPath = path.join(manuscriptsDir, file)
            const manuscriptData = JSON.parse(await fs.readFile(manuscriptPath, 'utf-8'))
            const stat = await fs.stat(manuscriptPath)
            
            // Filter by authorId - check if this manuscript belongs to the user
            if (manuscriptData.authorId === userId) {
              projects.push({
                id: manuscriptData.id,
                title: manuscriptData.title,
                author: userDisplayName,
                genre: manuscriptData.genre || 'Unknown',
                status: manuscriptData.status || 'draft',
                synopsis: manuscriptData.synopsis || '',
                wordCount: 0, // Will be calculated from chapters later
                lastModified: stat.mtime,
                tags: manuscriptData.tags || [],
                coverImage: manuscriptData.coverImage || null,
                createdAt: manuscriptData.createdAt || stat.birthtime,
                updatedAt: manuscriptData.updatedAt || stat.mtime
              })
            }
          } catch (error) {
            console.error(`Error reading manuscript ${file}:`, error)
            // Skip corrupted files
          }
        }
      }

      return NextResponse.json({ projects })
    } catch (error) {
      // If projects directory doesn't exist, return empty array
      return NextResponse.json({ projects: [] })
    }
  } catch (error) {
    console.error('Error listing projects:', error)
    return NextResponse.json(
      { error: 'Failed to list projects' },
      { status: 500 }
    )
  }
}
