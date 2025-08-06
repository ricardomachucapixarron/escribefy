import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params
    
    // Construir la ruta al archivo del proyecto
    const projectPath = path.join(
      process.cwd(),
      'src',
      'data',
      'users',
      'ricardo-machuca',
      'projects',
      projectId,
      'project.json'
    )
    
    // Verificar si el archivo existe
    if (!fs.existsSync(projectPath)) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    // Leer y parsear el archivo JSON
    const fileContent = fs.readFileSync(projectPath, 'utf-8')
    const projectData = JSON.parse(fileContent)
    
    return NextResponse.json(projectData)
    
  } catch (error) {
    console.error('Error loading project data:', error)
    return NextResponse.json(
      { error: 'Failed to load project data' },
      { status: 500 }
    )
  }
}
