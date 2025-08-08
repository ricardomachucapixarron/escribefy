import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Mapeo obsoleto eliminado - ahora los capítulos se guardan directamente en /manuscripts/{manuscriptId}/chapters/

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const manuscriptId = searchParams.get('manuscriptId')
    
    if (!manuscriptId) {
      return NextResponse.json(
        { error: 'manuscriptId parameter is required' },
        { status: 400 }
      )
    }

    // Leer todos los capítulos desde la carpeta estándar
    const chaptersDir = path.join(process.cwd(), 'src', 'data', 'chapters')
    
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
            
            // Extraer datos del capítulo (estructura anidada)
            const chapter = chapterData.chapter || chapterData
            
            // Filtrar solo capítulos del manuscrito solicitado
            if (chapter.manuscriptId === manuscriptId) {
              chapters.push({
                id: chapterId,
                title: chapter.title || `Chapter ${chapterId}`,
                synopsis: chapter.synopsis || '',
                wordCount: chapter.wordCount || 0,
                status: chapter.status || 'draft',
                order: chapter.order || parseInt(chapterId.replace('chapter-', '')) || 0,
                lastModified: chapter.lastModified || stat.mtime,
                manuscriptId: chapter.manuscriptId
              })
            }
          } catch (error) {
            console.error(`Error reading chapter ${file}:`, error)
            // Skip corrupted files
          }
        }
      }

      // Sort chapters by order
      chapters.sort((a, b) => a.order - b.order)

      return NextResponse.json({ 
        chapters,
        manuscriptId,
        totalChapters: chapters.length 
      })
    } catch (error) {
      // If chapters directory doesn't exist, return empty array
      return NextResponse.json({ 
        chapters: [],
        manuscriptId,
        totalChapters: 0 
      })
    }
  } catch (error) {
    console.error('Error listing chapters by manuscript:', error)
    return NextResponse.json(
      { error: 'Failed to list chapters' },
      { status: 500 }
    )
  }
}
