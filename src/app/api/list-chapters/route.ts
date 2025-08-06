import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')
    
    if (!userId || !projectId) {
      return NextResponse.json(
        { error: 'userId and projectId parameters are required' },
        { status: 400 }
      )
    }

    const chaptersDir = path.join(process.cwd(), 'src', 'data', 'users', userId, 'projects', projectId, 'chapters')
    
    try {
      const chapterFiles = await fs.readdir(chaptersDir)
      const chapters = []

      for (const file of chapterFiles) {
        if (file.endsWith('.json')) {
          try {
            const chapterPath = path.join(chaptersDir, file)
            const chapterData = JSON.parse(await fs.readFile(chapterPath, 'utf-8'))
            const stat = await fs.stat(chapterPath)
            
            const chapterId = file.replace('.json', '')
            
            chapters.push({
              id: chapterId,
              title: chapterData.title || `Chapter ${chapterId}`,
              synopsis: chapterData.synopsis || '',
              wordCount: chapterData.wordCount || 0,
              status: chapterData.status || 'draft',
              order: chapterData.order || parseInt(chapterId.replace('chapter-', '')) || 0,
              lastModified: stat.mtime,
              content: chapterData.content || '',
              scenes: chapterData.scenes || []
            })
          } catch (error) {
            console.error(`Error reading chapter ${file}:`, error)
            // Include file even if corrupted
            const chapterId = file.replace('.json', '')
            chapters.push({
              id: chapterId,
              title: `Chapter ${chapterId}`,
              synopsis: 'Chapter data unavailable',
              wordCount: 0,
              status: 'draft',
              order: parseInt(chapterId.replace('chapter-', '')) || 0,
              lastModified: new Date(),
              content: '',
              scenes: []
            })
          }
        }
      }

      // Sort chapters by order
      chapters.sort((a, b) => a.order - b.order)

      return NextResponse.json({ chapters })
    } catch (error) {
      // If chapters directory doesn't exist, return empty array
      return NextResponse.json({ chapters: [] })
    }
  } catch (error) {
    console.error('Error listing chapters:', error)
    return NextResponse.json(
      { error: 'Failed to list chapters' },
      { status: 500 }
    )
  }
}
