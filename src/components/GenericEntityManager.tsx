"use client"

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Save, Database } from 'lucide-react'
import ArrayField from './ArrayField'
import ImageGalleryField from './ImageGalleryField'
import RichTextEditor from './RichTextEditor'

// Imports de metadata reales
import { manuscriptMeta } from '@/metadata/manuscriptMeta'
import { authorMeta } from '@/metadata/authorMeta'
import { characterMeta } from '@/metadata/characterMeta'
import { organizationMeta } from '@/metadata/organizationMeta'
import { sceneMeta } from '@/metadata/sceneMeta'
import { locationMeta } from '@/metadata/locationMeta'
import { chapterMeta } from '@/metadata/chapterMeta'

interface GenericEntityManagerProps {
  onClose: () => void
}

// Usar las metadata reales importadas
const entities = [manuscriptMeta, authorMeta, characterMeta, organizationMeta, sceneMeta, locationMeta, chapterMeta]

// Función para cargar datos desde archivos JSON
async function loadEntityData(entityMeta: any) {
  if (!entityMeta.dataPath) return []
  
  try {
    // Carga específica por tipo de entidad
    if (entityMeta.key === 'author') {
      const ricardoData = await import('@/data/authors/ricardo-machuca.json')
      const solangeData = await import('@/data/authors/solange-gongora.json')
      const maiteData = await import('@/data/authors/maite-cantillana.json')
      return [ricardoData.default, solangeData.default, maiteData.default]
    }
    
    if (entityMeta.key === 'manuscript') {
      try {
        const response = await fetch('/api/list-all-manuscripts')
        if (response.ok) {
          const data = await response.json()
          return data.manuscripts || []
        }
      } catch (error) {
        console.error('Error loading manuscripts from API:', error)
      }
      return []
    }
    
    if (entityMeta.key === 'scene') {
      const aperturaData = await import('@/data/scenes/escena-apertura-cronicas.json')
      const batallaData = await import('@/data/scenes/batalla-guardian-final.json')
      return [aperturaData.default, batallaData.default]
    }
    
    if (entityMeta.key === 'character') {
      const lyraData = await import('@/data/characters/lyra-nightwhisper.json')
      const kiraData = await import('@/data/characters/kira-stormborn.json')
      return [lyraData.default, kiraData.default]
    }
    
    if (entityMeta.key === 'organization') {
      const ordenCristalData = await import('@/data/organizations/orden-guardianes-cristal.json')
      const hermandadVientosData = await import('@/data/organizations/hermandad-vientos-eternos.json')
      const gremioArchivistasData = await import('@/data/organizations/gremio-archivistas-valdris.json')
      const companiaNaveganteData = await import('@/data/organizations/compania-navegantes-niebla.json')
      return [ordenCristalData.default, hermandadVientosData.default, gremioArchivistasData.default, companiaNaveganteData.default]
    }
    
    if (entityMeta.key === 'location') {
      const bosqueData = await import('@/data/locations/bosque-susurros.json')
      const puertoData = await import('@/data/locations/puerto-nieblas.json')
      return [bosqueData.default, puertoData.default]
    }
    
    if (entityMeta.key === 'chapter') {
      // Cargar todos los capítulos desde la API simplificada
      try {
        const response = await fetch('/api/list-all-chapters')
        if (response.ok) {
          const data = await response.json()
          return data.chapters || []
        }
      } catch (error) {
        console.error('Error loading chapters from API:', error)
      }
      return []
    }
    
    return []
  } catch (error) {
    console.error('Error loading entity data:', error)
    return []
  }
}

export default function GenericEntityManager({ onClose }: GenericEntityManagerProps) {
  const [selectedEntityKey, setSelectedEntityKey] = useState('author')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [language, setLanguage] = useState<'es' | 'en'>('es')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedManuscriptFilter, setSelectedManuscriptFilter] = useState<string>('all')
  const [savedData, setSavedData] = useState<Record<string, any[]>>({
    manuscript: [],
    author: [],
    character: [],
    organization: [],
    scene: [],
    location: [],
    chapter: []
  })

  const currentEntity = entities.find(e => e.key === selectedEntityKey)!

  // Cargar datos desde archivos JSON cuando cambia la entidad
  useEffect(() => {
    async function loadData() {
      // Cargar la entidad actual
      if ((currentEntity as any).dataPath) {
        const data = await loadEntityData(currentEntity)
        setSavedData(prev => ({
          ...prev,
          [selectedEntityKey]: data
        }))
      }
      
      // Cargar todas las entidades necesarias para las relaciones
      const relationEntities = new Set<string>()
      currentEntity.fields.forEach((field: any) => {
        if (field.type === 'relation' && field.relation) {
          relationEntities.add(field.relation)
        }
      })
      
      // Cargar datos de entidades relacionadas
      for (const entityKey of relationEntities) {
        const relatedEntity = entities.find(e => e.key === entityKey)
        if (relatedEntity && !savedData[entityKey]?.length) {
          const relatedData = await loadEntityData(relatedEntity)
          setSavedData(prev => ({
            ...prev,
            [entityKey]: relatedData
          }))
        }
      }
      
      // Cargar manuscritos cuando se seleccionen capítulos (para el filtro)
      if (selectedEntityKey === 'chapter' && !savedData.manuscript?.length) {
        const manuscriptEntity = entities.find(e => e.key === 'manuscript')
        if (manuscriptEntity) {
          const manuscriptData = await loadEntityData(manuscriptEntity)
          setSavedData(prev => ({
            ...prev,
            manuscript: manuscriptData
          }))
        }
      }
    }
    loadData()
  }, [selectedEntityKey, currentEntity])
  
  // Limpiar selección cuando cambia la entidad (useEffect separado)
  useEffect(() => {
    setSelectedItem(null)
    setSelectedManuscriptFilter('all') // Resetear filtro de manuscrito
  }, [selectedEntityKey])

  // Inicializar formulario cuando cambia la entidad (solo para nuevos items)
  React.useEffect(() => {
    // Solo inicializar si no hay un item seleccionado (nuevo item)
    if (!selectedItem) {
      const initialData: Record<string, any> = {}
      currentEntity.fields.forEach((field: any) => {
        if (field.key === 'id') {
          initialData[field.key] = `${selectedEntityKey}-${Date.now()}`
        } else if (field.type === 'number') {
          initialData[field.key] = 0
        } else {
          initialData[field.key] = ''
        }
      })
      
      setFormData(initialData)
    }
  }, [selectedEntityKey, currentEntity, selectedItem])

  const handleInputChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }))
  }

  const handleSave = async () => {
    // Validar campos requeridos (buscar en la metadata real)
    const requiredFields = currentEntity.fields.filter((f: any) => f.required === true)
    const missingFields = requiredFields.filter((field: any) => {
      const value = formData[field.key]
      return !value || (typeof value === 'string' && value.trim() === '')
    })

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map((f: any) => f.label[language]).join(', ')
      alert(`Por favor completa los campos requeridos: ${fieldNames}`)
      return
    }

    try {
      // Preparar datos para guardar
      const dataToSave: any = {
        ...formData,
        updatedAt: new Date().toISOString()
      }

      // Si es nuevo elemento, agregar createdAt
      if (!selectedItem) {
        dataToSave.createdAt = new Date().toISOString()
      }

      // Llamar a la API para persistir
      const response = await fetch(`/api/entities/${selectedEntityKey}/${formData.id}`, {
        method: selectedItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error guardando datos')
      }

      const result = await response.json()
      
      if (result.success) {
        // Actualizar estado local
        if (selectedItem) {
          // Actualizar elemento existente
          setSavedData(prev => ({
            ...prev,
            [selectedEntityKey]: prev[selectedEntityKey].map((item: any) => 
              item.id === selectedItem.id ? result.data : item
            )
          }))
          
          alert('¡Datos actualizados correctamente!')
        } else {
          // Crear nuevo elemento
          setSavedData(prev => ({
            ...prev,
            [selectedEntityKey]: [...prev[selectedEntityKey], result.data]
          }))
          
          alert('¡Datos guardados correctamente!')
        }

        // Limpiar formulario solo si es nuevo elemento
        if (!selectedItem) {
          const initialData: Record<string, any> = {}
          currentEntity.fields.forEach((field: any) => {
            if (field.key === 'id') {
              initialData[field.key] = `${selectedEntityKey}-${Date.now()}`
            } else if (field.type === 'number') {
              initialData[field.key] = 0
            } else if (field.type === 'imageGallery' || field.type === 'array') {
              initialData[field.key] = []
            } else {
              initialData[field.key] = ''
            }
          })
          setFormData(initialData)
        }
      }

    } catch (error) {
      console.error('Error guardando:', error)
      alert(`Error guardando datos: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const renderField = (field: any) => {
    const { key, label, type, options, editable, required } = field
    const value = formData[key] || ''
    const isReadonly = !editable

    const baseClasses = "w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
    const readonlyClasses = isReadonly ? "bg-slate-800 text-gray-400" : "focus:border-blue-500 focus:outline-none"

    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses} min-h-[100px] resize-vertical`}
            placeholder={label[language]}
            readOnly={isReadonly}
          />
        )
      
      case 'richtext':
        return (
          <RichTextEditor
            value={value}
            onChange={(newValue) => handleInputChange(key, newValue)}
            placeholder={label[language]}
            readOnly={isReadonly}
            className=""
          />
        )
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses}`}
            disabled={isReadonly}
          >
            <option value="">Seleccionar {label[language]}</option>
            {options?.map((option: any, index: number) => (
              <option key={index} value={option.value || option.en}>
                {option.label ? option.label[language] : option[language]}
              </option>
            ))}
          </select>
        )
      
      case 'email':
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses}`}
            placeholder={label[language]}
            readOnly={isReadonly}
          />
        )
      
      case 'url':
        return (
          <input
            type="url"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses}`}
            placeholder={label[language]}
            readOnly={isReadonly}
          />
        )
      
      case 'date':
      case 'datetime':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses}`}
            readOnly={isReadonly}
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(key, Number(e.target.value))}
            className={`${baseClasses} ${readonlyClasses}`}
            placeholder={label[language]}
            readOnly={isReadonly}
          />
        )
      
      case 'array':
        const arrayValue = Array.isArray(value) ? value : []
        return (
          <ArrayField
            value={arrayValue}
            onChange={(newArray) => handleInputChange(key, newArray)}
            placeholder={`Agregar ${label[language].toLowerCase()}...`}
            maxItems={field.maxItems || 20}
            label={label[language]}
          />
        )
      
      case 'imageGallery':
        const images = Array.isArray(value) ? value : []
        return (
          <ImageGalleryField
            value={images}
            onChange={(newImages) => handleInputChange(key, newImages)}
            maxImages={field.maxImages || 10}
            entityType={selectedEntityKey}
            entityId={formData.id || 'new'}
          />
        )
      
      case 'relation':
        const relationData = savedData[field.relation] || []
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses}`}
            disabled={isReadonly}
          >
            <option value="">Seleccionar {label[language].toLowerCase()}...</option>
            {relationData.map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name || item.title || item.id}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={`${baseClasses} ${readonlyClasses}`}
            placeholder={label[language]}
            readOnly={isReadonly}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Editor Genérico de Entidades</h1>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-2"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            {/* Selector de Entidad */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Tipo de Entidad:</label>
              <select
                value={selectedEntityKey}
                onChange={(e) => setSelectedEntityKey(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-3"
              >
                {entities.map(entity => (
                  <option key={entity.key} value={entity.key}>
                    {entity.label[language]}
                  </option>
                ))}
              </select>
            </div>

            {/* Formulario Dinámico */}
            <div key={selectedEntityKey} className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {selectedItem ? `Editar ${currentEntity.label[language]}` : `Crear ${currentEntity.label[language]}`}
                </h2>
                <div className="flex gap-2">
                  {selectedItem && (
                    <button
                      onClick={() => {
                        setSelectedItem(null)
                        // Limpiar formulario
                        const initialData: Record<string, any> = {}
                        currentEntity.fields.forEach((field: any) => {
                          if (field.key === 'id') {
                            initialData[field.key] = `${selectedEntityKey}-${Date.now()}`
                          } else if (field.type === 'number') {
                            initialData[field.key] = 0
                          } else {
                            initialData[field.key] = ''
                          }
                        })
                        setFormData(initialData)
                      }}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Nuevo
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {selectedItem ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEntity.fields
                  .filter((field: any) => field.show === true)
                  .map((field: any) => (
                  <div key={field.key} className={field.type === 'textarea' || field.type === 'richtext' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label[language]}
                      {field.required === true && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Datos Guardados */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" />
                {currentEntity.label[language]} Guardados
              </h3>
              
              {/* Filtro de manuscrito para capítulos */}
              {selectedEntityKey === 'chapter' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Filtrar por Manuscrito:</label>
                  <select
                    value={selectedManuscriptFilter}
                    onChange={(e) => setSelectedManuscriptFilter(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                  >
                    <option value="all">Todos los manuscritos</option>
                    {savedData.manuscript?.map((manuscript: any) => (
                      <option key={manuscript.id} value={manuscript.id}>
                        {manuscript.title || manuscript.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {(selectedEntityKey === 'chapter' 
                  ? savedData[selectedEntityKey]?.filter((item: any) => 
                      selectedManuscriptFilter === 'all' || item.manuscriptId === selectedManuscriptFilter
                    )
                  : savedData[selectedEntityKey]
                )?.map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-slate-700 rounded p-2 text-sm cursor-pointer transition-colors hover:bg-slate-600 ${
                      selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={async () => {
                      setSelectedItem(item)
                      
                      // Para capítulos, cargar el contenido completo desde la API individual
                      if (selectedEntityKey === 'chapter') {
                        try {
                          const response = await fetch(`/api/entities/chapter/${item.id}`)
                          if (response.ok) {
                            const result = await response.json()
                            const fullChapterData = result.data || item
                            
                            // Cargar campos del capítulo completo
                            const filteredData: Record<string, any> = {}
                            currentEntity.fields.forEach((field: any) => {
                              if (fullChapterData[field.key] !== undefined) {
                                filteredData[field.key] = fullChapterData[field.key]
                              } else {
                                if (field.type === 'number') {
                                  filteredData[field.key] = 0
                                } else {
                                  filteredData[field.key] = ''
                                }
                              }
                            })
                            setFormData(filteredData)
                          } else {
                            console.error('Error loading full chapter data')
                            // Fallback a datos básicos
                            const filteredData: Record<string, any> = {}
                            currentEntity.fields.forEach((field: any) => {
                              if (item[field.key] !== undefined) {
                                filteredData[field.key] = item[field.key]
                              } else {
                                if (field.type === 'number') {
                                  filteredData[field.key] = 0
                                } else {
                                  filteredData[field.key] = ''
                                }
                              }
                            })
                            setFormData(filteredData)
                          }
                        } catch (error) {
                          console.error('Error fetching chapter content:', error)
                          // Fallback a datos básicos
                          const filteredData: Record<string, any> = {}
                          currentEntity.fields.forEach((field: any) => {
                            if (item[field.key] !== undefined) {
                              filteredData[field.key] = item[field.key]
                            } else {
                              if (field.type === 'number') {
                                filteredData[field.key] = 0
                              } else {
                                filteredData[field.key] = ''
                              }
                            }
                          })
                          setFormData(filteredData)
                        }
                      } else {
                        // Para otras entidades, usar lógica normal
                        const filteredData: Record<string, any> = {}
                        currentEntity.fields.forEach((field: any) => {
                          if (item[field.key] !== undefined) {
                            filteredData[field.key] = item[field.key]
                          } else {
                            if (field.type === 'number') {
                              filteredData[field.key] = 0
                            } else {
                              filteredData[field.key] = ''
                            }
                          }
                        })
                        setFormData(filteredData)
                      }
                    }}
                  >
                    <div className="font-medium">{item.name || item.title || item.id}</div>
                    <div className="text-gray-400 text-xs">
                      {new Date(item.createdAt || item.updatedAt).toLocaleString()}
                    </div>
                  </div>
                )) || []}
              </div>
              
              {(!savedData[selectedEntityKey] || savedData[selectedEntityKey].length === 0) && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No hay {currentEntity.label[language].toLowerCase()} guardados aún
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
