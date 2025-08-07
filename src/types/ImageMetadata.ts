// Tipos para el manejo de imágenes con metadata en el sistema
export interface ImageMetadata {
  id: string
  url: string
  filename: string
  title: string
  description: string
  tags: string[]
  isPrimary: boolean
  uploadedAt: string
  size: number
  dimensions: {
    width: number
    height: number
  }
}

export interface ImageGalleryFieldProps {
  value: ImageMetadata[]
  onChange: (images: ImageMetadata[]) => void
  maxImages?: number
  allowedFormats?: string[]
  entityType?: string
  entityId?: string
}

// Tipos para la API de upload
export interface ImageUploadResponse {
  success: boolean
  image?: ImageMetadata
  error?: string
}

export interface ImageUploadRequest {
  file: File
  entityType: string
  entityId: string
  title?: string
  description?: string
  tags?: string[]
}
