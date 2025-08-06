"use client"

import React, { useState } from 'react'
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

export default function GenericEntityManager({ onClose }: GenericEntityManagerProps) {
  const [selectedEntityKey, setSelectedEntityKey] = useState('manuscript')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [language, setLanguage] = useState<'es' | 'en'>('es')
  const [savedData, setSavedData] = useState<Record<string, any[]>>({
    manuscript: [],
    author: [],
    character: [],
    organization: [],
    scene: []
  })

  const currentEntity = entities.find(e => e.key === selectedEntityKey)!

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

    // Guardar datos
    const newItem = { ...formData, createdAt: new Date().toISOString() }
    setSavedData(prev => ({
      ...prev,
      [selectedEntityKey]: [...prev[selectedEntityKey], newItem]
    }))

    console.log('Guardado:', newItem)
    alert('¡Datos guardados correctamente!')

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
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Crear {currentEntity.label[language]}
                </h2>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </button>
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
                Datos Guardados
              </h3>
              
              {Object.entries(savedData).map(([entityKey, items]) => (
                <div key={entityKey} className="mb-4">
                  <h4 className="font-medium text-blue-400 mb-2">
                    {entities.find(e => e.key === entityKey)?.label[language]} ({items.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={index} className="bg-slate-700 rounded p-2 text-sm">
                        <div className="font-medium">{item.name || item.title || item.id}</div>
                        <div className="text-gray-400 text-xs">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.values(savedData).every(items => items.length === 0) && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No hay datos guardados aún
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
