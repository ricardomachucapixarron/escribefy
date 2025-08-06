"use client"

import { motion } from 'framer-motion'
import { BookOpen, Calendar, Target, Settings, Image, Plus, Trash2, Globe, Lock, Eye, Users, MapPin, Layers, FileText } from 'lucide-react'

interface ProjectFormProps {
  currentData: any
  updateProjectField: (field: string, value: any) => void
  addPortfolioItem: () => void
  removePortfolioItem: (index: number) => void
  onViewChapters?: () => void
  onViewCharacters?: () => void
  onViewLocations?: () => void
  onViewGroups?: () => void
}

export default function ProjectForm({ 
  currentData, 
  updateProjectField, 
  addPortfolioItem, 
  removePortfolioItem,
  onViewChapters,
  onViewCharacters,
  onViewLocations,
  onViewGroups
}: ProjectFormProps) {
  const project = currentData?.project || {}
  const portfolio = project?.portfolio || []

  const handleNestedUpdate = (section: string, field: string, value: any) => {
    const updatedSection = { ...project[section], [field]: value }
    updateProjectField(section, updatedSection)
  }

  const handlePortfolioUpdate = (index: number, field: string, value: any) => {
    const updatedPortfolio = [...portfolio]
    updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value }
    updateProjectField('portfolio', updatedPortfolio)
  }

  const handleTagsUpdate = (index: number, tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    handlePortfolioUpdate(index, 'tags', tags)
  }

  return (
    <div className="space-y-8">
      {/* Información Básica del Proyecto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Información Básica</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ID del Proyecto</label>
            <input
              type="text"
              value={project.id || ''}
              onChange={(e) => updateProjectField('id', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
            <input
              type="text"
              value={project.title || ''}
              onChange={(e) => updateProjectField('title', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Autor</label>
            <input
              type="text"
              value={project.author || ''}
              onChange={(e) => updateProjectField('author', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
            <input
              type="text"
              value={project.genre || ''}
              onChange={(e) => updateProjectField('genre', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={project.status || 'draft'}
              onChange={(e) => updateProjectField('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="draft">Borrador</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Visibilidad</label>
            <select
              value={project.visibility || 'private'}
              onChange={(e) => updateProjectField('visibility', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="private">Privado</option>
              <option value="public">Público</option>
              <option value="unlisted">No Listado</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Sinopsis</label>
          <textarea
            value={project.synopsis || ''}
            onChange={(e) => updateProjectField('synopsis', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Describe tu proyecto..."
          />
        </div>
      </motion.div>

      {/* Progreso y Métricas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Progreso y Métricas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo de Palabras</label>
            <input
              type="number"
              value={project.targetWordCount || 0}
              onChange={(e) => updateProjectField('targetWordCount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Palabras Actuales</label>
            <input
              type="number"
              value={project.currentWordCount || 0}
              onChange={(e) => updateProjectField('currentWordCount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Progreso (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={project.progress || 0}
              onChange={(e) => updateProjectField('progress', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Configuración del Proyecto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Configuración</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Modo Cinemático</label>
            <input
              type="checkbox"
              checked={project.settings?.cinematicMode || false}
              onChange={(e) => handleNestedUpdate('settings', 'cinematicMode', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Modo AR</label>
            <input
              type="checkbox"
              checked={project.settings?.arMode || false}
              onChange={(e) => handleNestedUpdate('settings', 'arMode', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Asistencia IA</label>
            <input
              type="checkbox"
              checked={project.settings?.aiAssistance || false}
              onChange={(e) => handleNestedUpdate('settings', 'aiAssistance', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Respaldo Automático</label>
            <input
              type="checkbox"
              checked={project.settings?.autoBackup || false}
              onChange={(e) => handleNestedUpdate('settings', 'autoBackup', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
            <select
              value={project.settings?.language || 'es'}
              onChange={(e) => handleNestedUpdate('settings', 'language', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Zona Horaria</label>
            <input
              type="text"
              value={project.settings?.timezone || ''}
              onChange={(e) => handleNestedUpdate('settings', 'timezone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="America/New_York"
            />
          </div>
        </div>
      </motion.div>

      {/* Portfolio de Imágenes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image className="h-6 w-6 text-orange-400" />
            <h3 className="text-xl font-semibold text-white">Portfolio de Imágenes</h3>
          </div>
          <button
            onClick={addPortfolioItem}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Imagen
          </button>
        </div>
        
        {portfolio.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Image className="h-12 w-12 mx-auto mb-4 text-gray-500" />
            <p>No hay imágenes en el portfolio</p>
            <p className="text-sm">Haz clic en "Agregar Imagen" para empezar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolio.map((item: any, index: number) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">Imagen {index + 1}</h4>
                  <button
                    onClick={() => removePortfolioItem(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Archivo</label>
                    <input
                      type="text"
                      value={item.filename || ''}
                      onChange={(e) => handlePortfolioUpdate(index, 'filename', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ruta</label>
                    <input
                      type="text"
                      value={item.path || ''}
                      onChange={(e) => handlePortfolioUpdate(index, 'path', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => handlePortfolioUpdate(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tags (separados por comas)</label>
                    <input
                      type="text"
                      value={item.tags?.join(', ') || ''}
                      onChange={(e) => handleTagsUpdate(index, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                      placeholder="cover, sci-fi, futuristic"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                    <textarea
                      value={item.prompt || ''}
                      onChange={(e) => handlePortfolioUpdate(index, 'prompt', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                    <input
                      type="text"
                      value={item.mood || ''}
                      onChange={(e) => handlePortfolioUpdate(index, 'mood', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Navegación del Proyecto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Layers className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Elementos del Proyecto</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Botón Capítulos */}
          {onViewChapters && (
            <button
              onClick={onViewChapters}
              className="flex flex-col items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 hover:border-green-500/30 transition-all duration-200 group"
            >
              <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-white mb-1">Capítulos</h4>
                <p className="text-xs text-gray-400">Gestionar capítulos del proyecto</p>
              </div>
            </button>
          )}

          {/* Botón Personajes */}
          {onViewCharacters && (
            <button
              onClick={onViewCharacters}
              className="flex flex-col items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-200 group"
            >
              <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-white mb-1">Personajes</h4>
                <p className="text-xs text-gray-400">Editar personajes y protagonistas</p>
              </div>
            </button>
          )}

          {/* Botón Lugares */}
          {onViewLocations && (
            <button
              onClick={onViewLocations}
              className="flex flex-col items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 hover:border-orange-500/30 transition-all duration-200 group"
            >
              <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-white mb-1">Lugares</h4>
                <p className="text-xs text-gray-400">Administrar ubicaciones y escenarios</p>
              </div>
            </button>
          )}

          {/* Botón Grupos */}
          {onViewGroups && (
            <button
              onClick={onViewGroups}
              className="flex flex-col items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-200 group"
            >
              <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-center">
                <h4 className="text-sm font-semibold text-white mb-1">Grupos</h4>
                <p className="text-xs text-gray-400">Organizar facciones y organizaciones</p>
              </div>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
