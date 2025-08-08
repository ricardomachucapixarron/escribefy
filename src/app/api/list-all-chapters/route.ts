import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const chaptersDir = path.join(process.cwd(), 'src', 'data', 'chapters')
    
    // Leer todos los archivos .json de la carpeta chapters
    const files = await readdir(chaptersDir)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    
    const chapters = []
    
    // Cargar cada archivo JSON
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(chaptersDir, file)
        const fileContent = await readFile(filePath, 'utf8')
        const chapterData = JSON.parse(fileContent)
        
        // Extraer datos del capítulo (estructura anidada o plana)
        const chapter = chapterData.chapter || chapterData
        
        chapters.push({
          id: chapter.id || file.replace('.json', ''),
          title: chapter.title || `Chapter ${chapter.id}`,
          synopsis: chapter.synopsis || '',
          manuscriptId: chapter.manuscriptId || '',
          status: chapter.status || 'draft',
          wordCount: chapter.wordCount || 0,
          order: chapter.order || 0,
          mood: chapter.mood || '',
          themes: chapter.themes || '',
          keyEvents: chapter.keyEvents || '',
          lastModified: chapter.lastModified || chapter.updatedAt || '',
          createdAt: chapter.createdAt || '',
          updatedAt: chapter.updatedAt || ''
        })
      } catch (error) {
        console.error(`Error loading chapter ${file}:`, error)
        // Continuar con el siguiente archivo si hay error
      }
    }
    
    // Ordenar por orden y luego por fecha de actualización
    chapters.sort((a, b) => {
      // Primero por manuscriptId para agrupar
      if (a.manuscriptId !== b.manuscriptId) {
        return a.manuscriptId.localeCompare(b.manuscriptId)
      }
      // Luego por orden dentro del mismo manuscrito
      if (a.order !== b.order) {
        return a.order - b.order
      }
      // Finalmente por fecha de actualización
      const dateA = new Date(a.updatedAt || a.lastModified || 0)
      const dateB = new Date(b.updatedAt || b.lastModified || 0)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json({
      chapters,
      total: chapters.length
    })
    
  } catch (error) {
    console.error('Error listing chapters:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
