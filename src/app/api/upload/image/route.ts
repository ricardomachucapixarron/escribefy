import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const entityType = formData.get('entityType') as string
    const entityId = formData.get('entityId') as string
    const title = formData.get('title') as string || ''
    const description = formData.get('description') as string || ''
    const tags = formData.get('tags') as string || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido' },
        { status: 400 }
      )
    }

    // Normalizar entityType (singular a plural para carpetas)
    const entityTypeMap: Record<string, string> = {
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
    
    const normalizedEntityType = entityTypeMap[entityType] || entityType

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `${entityId}-${timestamp}.${extension}`
    
    // Crear directorio de uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', normalizedEntityType)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Guardar archivo
    const filePath = path.join(uploadsDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Crear metadata de la imagen
    const imageMetadata = {
      id: `img-${timestamp}`,
      url: `/uploads/${normalizedEntityType}/${filename}`,
      filename: filename,
      title: title || file.name.split('.')[0].replace(/[-_]/g, ' '),
      description: description,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      isPrimary: false,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      dimensions: { width: 800, height: 600 } // En producción, obtener dimensiones reales
    }

    return NextResponse.json({
      success: true,
      image: imageMetadata
    })

  } catch (error) {
    console.error('Error subiendo imagen:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
