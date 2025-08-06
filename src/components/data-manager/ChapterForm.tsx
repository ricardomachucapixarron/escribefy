'use client'

import { motion } from 'framer-motion'
import { 
  FileText, 
  BarChart3, 
  Settings, 
  Image, 
  Plus, 
  Trash2,
  Calendar,
  Target,
  Lightbulb,
  BookOpen
} from 'lucide-react'

interface ChapterFormProps {
  currentData: any
  updateChapterField: (field: string, value: any) => void
  addPortfolioItem: () => void
  removePortfolioItem: (index: number) => void
}

export default function ChapterForm({ 
  currentData, 
  updateChapterField, 
  addPortfolioItem, 
  removePortfolioItem 
}: ChapterFormProps) {
  const chapter = currentData?.chapter || {}

  const handleFieldUpdate = (field: string, value: any) => {
    updateChapterField(field, value)
  }

  const handleNestedUpdate = (parent: string, field: string, value: any) => {
    const parentObj = chapter[parent] || {}
    const updatedParent = { ...parentObj, [field]: value }
    updateChapterField(parent, updatedParent)
  }

  const handleArrayUpdate = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    updateChapterField(field, arrayValue)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 space-y-8"
    >
      {/* Información Básica */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Información Básica</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ID del Capítulo</label>
            <input
              type="text"
              value={chapter.id || ''}
              onChange={(e) => handleFieldUpdate('id', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="chapter-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
            <input
              type="text"
              value={chapter.title || ''}
              onChange={(e) => handleFieldUpdate('title', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título del capítulo"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Sinopsis</label>
            <textarea
              value={chapter.synopsis || ''}
              onChange={(e) => handleFieldUpdate('synopsis', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descripción del capítulo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={chapter.status || 'draft'}
              onChange={(e) => handleFieldUpdate('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Borrador</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="published">Publicado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ambiente/Mood</label>
            <input
              type="text"
              value={chapter.mood || ''}
              onChange={(e) => handleFieldUpdate('mood', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="mysterious, exciting, dramatic..."
            />
          </div>
        </div>
      </motion.div>

      {/* Métricas y Progreso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <BarChart3 className="h-5 w-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Métricas y Progreso</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Conteo de Palabras</label>
            <input
              type="number"
              value={chapter.wordCount || 0}
              onChange={(e) => handleFieldUpdate('wordCount', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Orden</label>
            <input
              type="number"
              value={chapter.order || 1}
              onChange={(e) => handleFieldUpdate('order', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ruta del Contenido</label>
            <input
              type="text"
              value={chapter.contentPath || ''}
              onChange={(e) => handleFieldUpdate('contentPath', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="/path/to/chapter.json"
            />
          </div>
        </div>
      </motion.div>

      {/* Temas y Eventos Clave */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Lightbulb className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Temas y Eventos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Temas (separados por comas)</label>
            <input
              type="text"
              value={chapter.themes?.join(', ') || ''}
              onChange={(e) => handleArrayUpdate('themes', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="mystery, discovery, conflict..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Eventos Clave (separados por comas)</label>
            <textarea
              value={chapter.keyEvents?.join(', ') || ''}
              onChange={(e) => handleArrayUpdate('keyEvents', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Evento importante 1, Evento importante 2..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Resumen de IA</label>
            <textarea
              value={chapter.aiSummary || ''}
              onChange={(e) => handleFieldUpdate('aiSummary', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Resumen generado por IA del capítulo..."
            />
          </div>
        </div>
      </motion.div>

      {/* Portfolio de Imágenes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Image className="h-5 w-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Portfolio de Imágenes</h2>
          </div>
          <button
            onClick={addPortfolioItem}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar Imagen
          </button>
        </div>

        <div className="space-y-4">
          {chapter.portfolio && chapter.portfolio.length > 0 ? (
            chapter.portfolio.map((item: any, index: number) => (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Imagen {index + 1}</h3>
                  <button
                    onClick={() => removePortfolioItem(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Archivo</label>
                    <input
                      type="text"
                      value={item.filename || ''}
                      onChange={(e) => {
                        const updatedPortfolio = [...(chapter.portfolio || [])]
                        updatedPortfolio[index] = { ...item, filename: e.target.value }
                        updateChapterField('portfolio', updatedPortfolio)
                      }}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                      placeholder="imagen.png"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Ruta</label>
                    <input
                      type="text"
                      value={item.path || ''}
                      onChange={(e) => {
                        const updatedPortfolio = [...(chapter.portfolio || [])]
                        updatedPortfolio[index] = { ...item, path: e.target.value }
                        updateChapterField('portfolio', updatedPortfolio)
                      }}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                      placeholder="/images/imagen.png"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedPortfolio = [...(chapter.portfolio || [])]
                        updatedPortfolio[index] = { ...item, description: e.target.value }
                        updateChapterField('portfolio', updatedPortfolio)
                      }}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm resize-none"
                      placeholder="Descripción de la imagen..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tags (separados por comas)</label>
                    <input
                      type="text"
                      value={item.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                        const updatedPortfolio = [...(chapter.portfolio || [])]
                        updatedPortfolio[index] = { ...item, tags }
                        updateChapterField('portfolio', updatedPortfolio)
                      }}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mood</label>
                    <input
                      type="text"
                      value={item.mood || ''}
                      onChange={(e) => {
                        const updatedPortfolio = [...(chapter.portfolio || [])]
                        updatedPortfolio[index] = { ...item, mood: e.target.value }
                        updateChapterField('portfolio', updatedPortfolio)
                      }}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm"
                      placeholder="mysterious, dramatic..."
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay imágenes en el portfolio</p>
              <p className="text-sm">Haz clic en "Agregar Imagen" para comenzar</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
