"use client"

import { motion } from 'framer-motion'
import { FileText, Edit } from 'lucide-react'

interface ChaptersListProps {
  chapters: any[]
  selectedProject: any
  onEditChapter: (chapter: any) => void
}

export default function ChaptersList({ 
  chapters, 
  selectedProject, 
  onEditChapter 
}: ChaptersListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Capítulos de {selectedProject?.title}
      </h2>
      {chapters.length === 0 ? (
        <div className="bg-slate-800/50 rounded-lg p-6 text-center">
          <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay capítulos disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white truncate pr-4">
                      {chapter.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${
                      chapter.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      chapter.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {chapter.status === 'published' ? 'Publicado' :
                       chapter.status === 'draft' ? 'Borrador' : 'En progreso'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                    {chapter.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{chapter.wordsCount?.toLocaleString()} palabras</span>
                      <span>{new Date(chapter.lastModified).toLocaleDateString()}</span>
                    </div>
                    
                    <button
                      onClick={() => onEditChapter(chapter)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
