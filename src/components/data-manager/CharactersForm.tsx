"use client"

import { motion } from 'framer-motion'
import { Users, Plus, X, Upload, Trash2 } from 'lucide-react'

interface CharactersFormProps {
  currentData: any
  updateCharacterField: (characterId: string, field: string, value: any) => void
  addCharacter: () => void
  removeCharacter: (characterId: string) => void
  addCharacterPortfolioItem: (characterId: string) => void
  removeCharacterPortfolioItem: (characterId: string, itemId: string) => void
}

export default function CharactersForm({
  currentData,
  updateCharacterField,
  addCharacter,
  removeCharacter,
  addCharacterPortfolioItem,
  removeCharacterPortfolioItem
}: CharactersFormProps) {
  const characters = currentData?.characters || []

  const handlePersonalityChange = (characterId: string, value: string) => {
    const personalityArray = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    updateCharacterField(characterId, 'personality', personalityArray)
  }

  const handleGroupingsChange = (characterId: string, value: string) => {
    const groupingsArray = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    updateCharacterField(characterId, 'groupings', groupingsArray)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Personajes del Proyecto</h2>
        </div>
        <button
          onClick={addCharacter}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Personaje
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="bg-slate-800/50 rounded-lg p-8 text-center border border-slate-700">
          <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No hay personajes creados aún</p>
          <button
            onClick={addCharacter}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Crear Primer Personaje
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {characters.map((character: any, index: number) => (
            <motion.div
              key={character.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {character.name || `Personaje ${index + 1}`}
                </h3>
                <button
                  onClick={() => removeCharacter(character.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Eliminar personaje"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-blue-400 mb-3">Información Básica</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={character.name || ''}
                      onChange={(e) => updateCharacterField(character.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Nombre del personaje"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rol
                    </label>
                    <select
                      value={character.role || ''}
                      onChange={(e) => updateCharacterField(character.id, 'role', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Seleccionar rol</option>
                      <option value="Protagonista">Protagonista</option>
                      <option value="Antagonista">Antagonista</option>
                      <option value="Secundario">Secundario</option>
                      <option value="Terciario">Terciario</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Aliado">Aliado</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Edad
                      </label>
                      <input
                        type="number"
                        value={character.age || ''}
                        onChange={(e) => updateCharacterField(character.id, 'age', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Edad"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ocupación
                      </label>
                      <input
                        type="text"
                        value={character.occupation || ''}
                        onChange={(e) => updateCharacterField(character.id, 'occupation', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="Ocupación"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción y Personalidad */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-green-400 mb-3">Descripción y Personalidad</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={character.description || ''}
                      onChange={(e) => updateCharacterField(character.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Descripción del personaje..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rasgos de Personalidad
                    </label>
                    <input
                      type="text"
                      value={character.personality ? character.personality.join(', ') : ''}
                      onChange={(e) => handlePersonalityChange(character.id, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Ej: valiente, inteligente, sarcástico (separados por comas)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Grupos/Afiliaciones
                    </label>
                    <input
                      type="text"
                      value={character.groupings ? character.groupings.join(', ') : ''}
                      onChange={(e) => handleGroupingsChange(character.id, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Ej: rebeldes, científicos, nobleza (separados por comas)"
                    />
                  </div>
                </div>
              </div>

              {/* Portfolio de Imágenes */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-purple-400">Portfolio de Imágenes</h4>
                  <button
                    onClick={() => addCharacterPortfolioItem(character.id)}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Upload className="h-3 w-3" />
                    Agregar Imagen
                  </button>
                </div>

                {character.portfolio && character.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {character.portfolio.map((item: any, itemIndex: number) => (
                      <div
                        key={item.id || itemIndex}
                        className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white truncate">
                            {item.filename || `Imagen ${itemIndex + 1}`}
                          </span>
                          <button
                            onClick={() => removeCharacterPortfolioItem(character.id, item.id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">
                          {item.description || 'Sin descripción'}
                        </p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-700/30 rounded-lg p-4 text-center border border-slate-600 border-dashed">
                    <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No hay imágenes en el portfolio</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
