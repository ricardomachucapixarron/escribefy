import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
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
  'organizations': 'organizations'
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
    const folderName = ENTITY_FOLDERS[type]
    const dataDir = path.join(process.cwd(), 'src', 'data', folderName)
    const filePath = path.join(dataDir, `${id}.json`)

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
