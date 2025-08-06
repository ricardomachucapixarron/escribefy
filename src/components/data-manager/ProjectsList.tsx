"use client"

import { motion } from 'framer-motion'
import { BookOpen, Edit } from 'lucide-react'

interface ProjectsListProps {
  projects: any[]
  selectedUser: any
  onEditProject: (project: any) => void
  onViewChapters: (project: any) => void
}

export default function ProjectsList({ 
  projects, 
  selectedUser, 
  onEditProject, 
  onViewChapters 
}: ProjectsListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Proyectos de {selectedUser?.displayName}
      </h2>
      {projects.length === 0 ? (
        <div className="bg-slate-800/50 rounded-lg p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay proyectos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white truncate">{project.title}</h3>
                  <p className="text-sm text-gray-400">{project.genre}</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{project.chaptersCount} capítulos</span>
                <span>{project.wordsCount?.toLocaleString()} palabras</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded text-xs ${
                  project.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {project.status === 'published' ? 'Publicado' :
                   project.status === 'draft' ? 'Borrador' : 'En progreso'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(project.lastModified).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProject(project)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => onViewChapters(project)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Capítulos
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
