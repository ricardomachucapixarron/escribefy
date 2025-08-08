import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// Mapeo de tipos de entidad a carpetas (maneja singular y plural)
const ENTITY_FOLDERS: Record<string, string> = {
  'author': 'authors',
  'authors': 'authors',
  'manuscript': 'manuscripts',
  'manuscripts': 'manuscripts', 
  'character': 'characters',
  'characters': 'characters',
  'scene': 'scenes',
  'scenes': 'scenes',
  'organization': 'organizations',
  'organizations': 'organizations',
  'location': 'locations',
  'locations': 'locations',
  'chapter': 'chapters', // Estructura especial
  'chapters': 'chapters'
}

// Mapeo obsoleto eliminado - ahora los capítulos se guardan directamente en /manuscripts/{manuscriptId}/chapters/

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params

    // Validar tipo de entidad
    if (!ENTITY_FOLDERS[type]) {
      return NextResponse.json(
        { error: `Tipo de entidad '${type}' no válido` },
        { status: 400 }
      )
    }

    // Construir ruta del archivo
    const folderName = ENTITY_FOLDERS[type]
    const dataDir = path.join(process.cwd(), 'src', 'data', folderName)
    const filePath = path.join(dataDir, `${id}.json`)

    // Verificar si el archivo existe
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: `${type} con id '${id}' no encontrado` },
        { status: 404 }
      )
    }

    // Leer el archivo
    const fileContent = await readFile(filePath, 'utf8')
    const entityData = JSON.parse(fileContent)

    return NextResponse.json({
      success: true,
      data: entityData
    })

  } catch (error) {
    console.error('Error reading entity:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al leer la entidad' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params
    const data = await request.json()

    // Validar tipo de entidad
    if (!ENTITY_FOLDERS[type]) {
      return NextResponse.json(
        { error: `Tipo de entidad '${type}' no válido` },
        { status: 400 }
      )
    }

    // Construir ruta del archivo
    let dataDir: string
    let filePath: string
    
    // Lógica estándar para todas las entidades (incluyendo capítulos)
    const folderName = ENTITY_FOLDERS[type]
    dataDir = path.join(process.cwd(), 'src', 'data', folderName)
    filePath = path.join(dataDir, `${id}.json`)

    // Crear directorio si no existe
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Agregar timestamp de actualización
    const entityData = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    // Escribir archivo JSON
    await writeFile(filePath, JSON.stringify(entityData, null, 2), 'utf8')

    return NextResponse.json({ 
      success: true, 
      message: `${type} '${id}' guardado correctamente`,
      data: entityData
    })

  } catch (error) {
    console.error('Error guardando entidad:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  // POST para crear nueva entidad (mismo código que PUT)
  return PUT(request, { params })
}
