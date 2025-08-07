import { NextRequest, NextResponse } from 'next/server'
import { unlink, readFile, writeFile } from 'fs/promises'
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    
    console.log('DELETE Image Request:', { imageId, entityType, entityId })

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entityType y entityId son requeridos' },
        { status: 400 }
      )
    }

    // Validar tipo de entidad
    if (!ENTITY_FOLDERS[entityType]) {
      return NextResponse.json(
        { error: `Tipo de entidad '${entityType}' no válido` },
        { status: 400 }
      )
    }

    // Leer el archivo JSON de la entidad
    const folderName = ENTITY_FOLDERS[entityType]
    const entityFilePath = path.join(process.cwd(), 'src', 'data', folderName, `${entityId}.json`)

    if (!existsSync(entityFilePath)) {
      return NextResponse.json(
        { error: 'Entidad no encontrada' },
        { status: 404 }
      )
    }

    // Leer datos de la entidad
    const entityData = JSON.parse(await readFile(entityFilePath, 'utf8'))
    
    // Encontrar la imagen a eliminar
    const imageIndex = entityData.images?.findIndex((img: any) => img.id === imageId)
    
    console.log('Images in entity:', entityData.images?.length || 0)
    console.log('Looking for imageId:', imageId)
    console.log('Found at index:', imageIndex)
    
    if (imageIndex === -1 || !entityData.images) {
      console.log('Image not found in entity')
      return NextResponse.json(
        { error: 'Imagen no encontrada en la entidad' },
        { status: 404 }
      )
    }

    const imageToDelete = entityData.images[imageIndex]
    console.log('Image to delete:', imageToDelete)
    
    // Eliminar archivo físico del servidor
    try {
      // Construir ruta del archivo físico
      const imagePath = path.join(process.cwd(), 'public', imageToDelete.url)
      
      if (existsSync(imagePath)) {
        await unlink(imagePath)
        console.log('Archivo físico eliminado:', imagePath)
      }
    } catch (fileError) {
      console.warn('Error eliminando archivo físico:', fileError)
      // Continuar aunque no se pueda eliminar el archivo físico
    }

    // Eliminar imagen del array
    entityData.images.splice(imageIndex, 1)
    
    // Si era la imagen principal y quedan otras imágenes, hacer la primera como principal
    if (imageToDelete.isPrimary && entityData.images.length > 0) {
      entityData.images[0].isPrimary = true
    }

    // Actualizar timestamp
    entityData.updatedAt = new Date().toISOString()

    // Guardar archivo JSON actualizado
    await writeFile(entityFilePath, JSON.stringify(entityData, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Imagen eliminada correctamente',
      deletedImage: imageToDelete,
      updatedEntity: entityData
    })

  } catch (error) {
    console.error('Error eliminando imagen:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
