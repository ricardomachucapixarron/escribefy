'use client'

import React, { useState } from 'react'

interface ArrayFieldProps {
  value: string[]
  onChange: (newArray: string[]) => void
  placeholder?: string
  maxItems?: number
  label?: string
}

export default function ArrayField({ 
  value = [], 
  onChange, 
  placeholder = "Agregar elemento...",
  maxItems = 20,
  label = "Elementos"
}: ArrayFieldProps) {
  const [newItem, setNewItem] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')

  const handleAddItem = () => {
    if (newItem.trim() && value.length < maxItems) {
      const updatedArray = [...value, newItem.trim()]
      onChange(updatedArray)
      setNewItem('')
    }
  }

  const handleRemoveItem = (index: number) => {
    const updatedArray = value.filter((_, i) => i !== index)
    onChange(updatedArray)
  }

  const handleStartEdit = (index: number) => {
    setEditingIndex(index)
    setEditingValue(value[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const updatedArray = [...value]
      updatedArray[editingIndex] = editingValue.trim()
      onChange(updatedArray)
      setEditingIndex(null)
      setEditingValue('')
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        handleAddItem()
      } else {
        handleSaveEdit()
      }
    } else if (e.key === 'Escape' && action === 'edit') {
      handleCancelEdit()
    }
  }

  return (
    <div className="space-y-3">
      {/* Lista de elementos existentes */}
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
            {editingIndex === index ? (
              // Modo edición
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, 'edit')}
                  className="flex-1 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  disabled={!editingValue.trim()}
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                >
                  ✕
                </button>
              </div>
            ) : (
              // Modo visualización
              <>
                <span className="flex-1 text-sm text-gray-700">{item}</span>
                <button
                  onClick={() => handleStartEdit(index)}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Campo para agregar nuevo elemento */}
      {value.length < maxItems && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'add')}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Agregar
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500">
        {value.length} de {maxItems} elementos
        {value.length > 0 && (
          <span className="ml-2">
            • Haz clic en ✏️ para editar • Haz clic en 🗑️ para eliminar
          </span>
        )}
      </div>
    </div>
  )
}
