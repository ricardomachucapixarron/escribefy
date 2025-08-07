"use client"

import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Star, Upload, X, Tag } from 'lucide-react'

interface ImageMetadata {
  id: string
  url: string
  filename: string
  title: string
  description: string
  tags: string[]
  isPrimary: boolean
  uploadedAt: string
  size: number
  dimensions: { width: number; height: number }
}

interface ImageGalleryFieldProps {
  value: ImageMetadata[]
  onChange: (images: ImageMetadata[]) => void
  maxImages?: number
  allowedFormats?: string[]
  entityType?: string
  entityId?: string
}

export default function ImageGalleryField({ 
  value = [], 
  onChange, 
  maxImages = 10,
  allowedFormats = ['jpg', 'jpeg', 'png', 'webp'],
  entityType = 'entity',
  entityId = 'unknown'
}: ImageGalleryFieldProps) {
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ImageMetadata>>({})
  const [dragOver, setDragOver] = useState(false)
  const [previewImage, setPreviewImage] = useState<ImageMetadata | null>(null)
  const [deletingImage, setDeletingImage] = useState<string | null>(null)

  // Upload real de imagen usando la API
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    for (let i = 0; i < files.length && value.length < maxImages; i++) {
      const file = files[i]
      
      // Validar formato
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (!extension || !allowedFormats.includes(extension)) {
        alert(`Formato ${extension} no permitido. Use: ${allowedFormats.join(', ')}`)
        continue
      }

      try {
        // Crear FormData para el upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append('entityType', entityType || 'entity')
        formData.append('entityId', entityId || 'unknown')
        formData.append('title', file.name.split('.')[0].replace(/[-_]/g, ' '))
        formData.append('description', '')
        formData.append('tags', '')

        // Llamar a la API de upload
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error subiendo imagen')
        }

        const result = await response.json()
        
        if (result.success && result.image) {
          // Marcar como principal si es la primera imagen
          const newImage = {
            ...result.image,
            isPrimary: value.length === 0
          }
          
          onChange([...value, newImage])
        }

      } catch (error) {
        console.error('Error subiendo imagen:', error)
        alert(`Error subiendo ${file.name}: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const startEdit = (image: ImageMetadata) => {
    setEditingImage(image.id)
    setEditForm({
      title: image.title,
      description: image.description,
      tags: [...image.tags]
    })
  }

  const saveEdit = () => {
    if (!editingImage) return
    
    const updatedImages = value.map(img => 
      img.id === editingImage 
        ? { 
            ...img, 
            title: editForm.title || img.title,
            description: editForm.description || img.description,
            tags: editForm.tags || img.tags
          }
        : img
    )
    
    onChange(updatedImages)
    setEditingImage(null)
    setEditForm({})
  }

  const cancelEdit = () => {
    setEditingImage(null)
    setEditForm({})
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return
    }

    setDeletingImage(imageId)

    try {
      // Llamar a la API para eliminar la imagen
      const response = await fetch(`/api/upload/image/${imageId}?entityType=${entityType}&entityId=${entityId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error eliminando imagen')
      }

      const result = await response.json()
      
      if (result.success) {
        // Actualizar estado local con los datos actualizados del servidor
        const updatedImages = value.filter(img => img.id !== imageId)
        
        // Si la imagen eliminada era principal y quedan imágenes, marcar la primera como principal
        const deletedImage = value.find(img => img.id === imageId)
        if (deletedImage?.isPrimary && updatedImages.length > 0) {
          updatedImages[0].isPrimary = true
        }
        
        onChange(updatedImages)
        console.log('Imagen eliminada correctamente:', result.deletedImage.filename)
      }

    } catch (error) {
      console.error('Error eliminando imagen:', error)
      alert(`Error eliminando imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setDeletingImage(null)
    }
  }

  const setPrimary = (imageId: string) => {
    const updatedImages = value.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }))
    onChange(updatedImages)
  }

  const addTag = (tag: string) => {
    if (tag.trim() && editForm.tags && !editForm.tags.includes(tag.trim())) {
      setEditForm({
        ...editForm,
        tags: [...editForm.tags, tag.trim()]
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditForm({
      ...editForm,
      tags: editForm.tags?.filter(tag => tag !== tagToRemove) || []
    })
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-400 mb-2">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <input
          type="file"
          multiple
          accept={allowedFormats.map(f => `.${f}`).join(',')}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer text-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Seleccionar imágenes
        </label>
        <p className="text-xs text-gray-500 mt-2">
          {value.length}/{maxImages} imágenes • Formatos: {allowedFormats.join(', ')}
        </p>
      </div>

      {/* Image Gallery */}
      {value.length > 0 && (
        <div className="mt-4 space-y-3">
          {value.map((image) => (
            <div key={image.id} className="bg-slate-700 rounded-lg p-4">
              {editingImage === image.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-slate-600 rounded flex items-center justify-center">
                      <span className="text-sm">🖼️</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-1 text-sm"
                        placeholder="Título de la imagen"
                      />
                      <input
                        type="text"
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-1 text-sm"
                        placeholder="Descripción"
                      />
                    </div>
                  </div>
                  
                  {/* Tags Editor */}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tags:</label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {editForm.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 rounded text-xs"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Agregar tag (presiona Enter)"
                      className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-1 text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPreviewImage(image)}
                    className="w-16 h-16 bg-slate-600 rounded flex items-center justify-center hover:bg-slate-500 transition-colors cursor-pointer group"
                    title="Click para ver imagen completa"
                  >
                    {image.url ? (
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="w-full h-full object-cover rounded group-hover:opacity-80"
                        onError={() => {
                          // Si la imagen no carga, mostrar icono
                          console.log('Error cargando imagen:', image.url)
                        }}
                      />
                    ) : (
                      <span className="text-sm">🖼️</span>
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{image.title}</h4>
                      {image.isPrimary && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{image.filename}</p>
                    {image.description && (
                      <p className="text-xs text-gray-300 mb-1">{image.description}</p>
                    )}
                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {image.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-600/30 rounded text-xs"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!image.isPrimary && (
                      <button
                        onClick={() => setPrimary(image.id)}
                        className="p-1 hover:bg-slate-600 rounded"
                        title="Marcar como principal"
                      >
                        <Star className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(image)}
                      className="p-1 hover:bg-slate-600 rounded"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteImage(image.id)}
                      disabled={deletingImage === image.id}
                      className={`p-1 rounded transition-colors ${
                        deletingImage === image.id 
                          ? 'bg-red-600 cursor-not-allowed' 
                          : 'hover:bg-slate-600'
                      }`}
                      title={deletingImage === image.id ? 'Eliminando...' : 'Eliminar'}
                    >
                      {deletingImage === image.id ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-4">
          No hay imágenes. Sube algunas para comenzar.
        </p>
      )}

      {/* Modal de Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-slate-800 rounded-lg max-w-4xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-semibold">{previewImage.title}</h3>
                <p className="text-sm text-gray-400">{previewImage.filename}</p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Imagen */}
            <div className="p-4">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-w-full max-h-[70vh] mx-auto rounded"
                onError={() => {
                  console.log('Error cargando imagen en preview:', previewImage.url)
                }}
              />
            </div>

            {/* Metadata */}
            <div className="p-4 border-t border-slate-700 space-y-3">
              {previewImage.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Descripción:</label>
                  <p className="text-sm text-gray-400">{previewImage.description}</p>
                </div>
              )}
              
              {previewImage.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tags:</label>
                  <div className="flex flex-wrap gap-1">
                    {previewImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/30 rounded text-xs"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div>
                  <span className="font-medium">Dimensiones:</span> {previewImage.dimensions.width} x {previewImage.dimensions.height}px
                </div>
                <div>
                  <span className="font-medium">Tamaño:</span> {(previewImage.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <div>
                  <span className="font-medium">Subida:</span> {new Date(previewImage.uploadedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Estado:</span> {previewImage.isPrimary ? 'Principal' : 'Secundaria'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
