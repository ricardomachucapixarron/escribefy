"use client"

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Save, Plus, Database } from 'lucide-react'

// Imports de metadata reales
import { manuscriptMeta } from '@/metadata/manuscriptMeta'
import { authorMeta } from '@/metadata/authorMeta'
import { characterMeta } from '@/metadata/characterMeta'
import { organizationMeta } from '@/metadata/organizationMeta'
import { sceneMeta } from '@/metadata/sceneMeta'

interface GenericEntityManagerProps {
  onClose: () => void
}

// Usar las metadata reales importadas
const entities = [manuscriptMeta, authorMeta, characterMeta, organizationMeta, sceneMeta]

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
      const cronicasData = await import('@/data/manuscripts/cronicas-de-aethermoor.json')
      const guardianData = await import('@/data/manuscripts/el-ultimo-guardian.json')
      return [cronicasData.default, guardianData.default]
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
      const ciudadData = await import('@/data/organizations/ciudad-aethermoor.json')
      const temploData = await import('@/data/organizations/templo-equilibrio.json')
      return [ciudadData.default, temploData.default]
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
  const [savedData, setSavedData] = useState<Record<string, any[]>>({
    manuscript: [],
    author: [],
    character: [],
    organization: [],
    scene: []
  })

  const currentEntity = entities.find(e => e.key === selectedEntityKey)!

  // Cargar datos desde archivos JSON cuando cambia la entidad
  useEffect(() => {
    async function loadData() {
      if ((currentEntity as any).dataPath) {
        const data = await loadEntityData(currentEntity)
        setSavedData(prev => ({
          ...prev,
          [selectedEntityKey]: data
        }))
      }
    }
    loadData()
  }, [selectedEntityKey, currentEntity])
  
  // Limpiar selección cuando cambia la entidad (useEffect separado)
  useEffect(() => {
    setSelectedItem(null)
  }, [selectedEntityKey])

  // Inicializar formulario cuando cambia la entidad
  React.useEffect(() => {
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
  }, [selectedEntityKey, currentEntity])

  const handleInputChange = (fieldKey: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }))
  }

  const handleSave = () => {
    // Validar campos requeridos (buscar en la metadata real)
    const requiredFields = currentEntity.fields.filter((f: any) => f.required === true)
    const missingFields = requiredFields.filter((f: any) => !formData[f.key] || formData[f.key].toString().trim() === '')
    
    if (missingFields.length > 0) {
      alert(`Campos requeridos faltantes: ${missingFields.map((f: any) => f.label[language]).join(', ')}`)
      return
    }

    if (selectedItem) {
      // Modo edición: actualizar elemento existente
      const updatedItem = { 
        ...formData, 
        updatedAt: new Date().toISOString(),
        createdAt: selectedItem.createdAt // Mantener fecha de creación original
      }
      
      setSavedData(prev => ({
        ...prev,
        [selectedEntityKey]: prev[selectedEntityKey].map(item => 
          item.id === selectedItem.id ? updatedItem : item
        )
      }))
      
      setSelectedItem(updatedItem) // Actualizar el item seleccionado
      console.log('Actualizado:', updatedItem)
      alert('¡Datos actualizados correctamente!')
    } else {
      // Modo creación: agregar nuevo elemento
      const newItem = { ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      setSavedData(prev => ({
        ...prev,
        [selectedEntityKey]: [...prev[selectedEntityKey], newItem]
      }))
      
      console.log('Creado:', newItem)
      alert('¡Datos guardados correctamente!')
    }

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
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
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
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {savedData[selectedEntityKey]?.map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-slate-700 rounded p-2 text-sm cursor-pointer transition-colors hover:bg-slate-600 ${
                      selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedItem(item)
                      // Cargar solo campos válidos según el metadata actual
                      const filteredData: Record<string, any> = {}
                      currentEntity.fields.forEach((field: any) => {
                        if (item[field.key] !== undefined) {
                          filteredData[field.key] = item[field.key]
                        } else {
                          // Valor por defecto si el campo no existe en el item
                          if (field.type === 'number') {
                            filteredData[field.key] = 0
                          } else {
                            filteredData[field.key] = ''
                          }
                        }
                      })
                      setFormData(filteredData)
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
