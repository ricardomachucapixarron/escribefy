import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const manuscriptsDir = path.join(process.cwd(), 'src', 'data', 'manuscripts')
    
    // Leer todos los archivos .json de la carpeta manuscripts
    const files = await readdir(manuscriptsDir)
    const jsonFiles = files.filter(file => file.endsWith('.json'))
    
    const manuscripts = []
    
    // Cargar cada archivo JSON
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(manuscriptsDir, file)
        const fileContent = await readFile(filePath, 'utf8')
        const manuscriptData = JSON.parse(fileContent)
        manuscripts.push(manuscriptData)
      } catch (error) {
        console.error(`Error loading manuscript ${file}:`, error)
        // Continuar con el siguiente archivo si hay error
      }
    }
    
    // Ordenar por fecha de actualización (más recientes primero)
    manuscripts.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0)
      const dateB = new Date(b.updatedAt || b.createdAt || 0)
      return dateB.getTime() - dateA.getTime()
    })
    
    return NextResponse.json({
      manuscripts,
      total: manuscripts.length
    })
    
  } catch (error) {
    console.error('Error listing manuscripts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
