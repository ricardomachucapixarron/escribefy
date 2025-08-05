// Componente de demostración para mostrar el trabajo con datos JSON
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, BookOpen, FileText, Clock, BarChart3, MapPin, Building } from 'lucide-react'
import { mockUser, mockProject, mockChapter, useMockChapter } from '@/data/mockData'
import type { Chapter } from '@/types/data'

// Función para contar palabras reales
function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remover HTML tags
    .replace(/[^\w\s\u00C0-\u017F\u0100-\u024F]/g, ' ') // Mantener solo letras y acentos
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()
  if (!cleanText) return 0
  return cleanText.split(' ').filter(word => word.length > 0).length
}

// Función para contar palabras totales del proyecto (suma de todos los capítulos)
function countProjectWords(): number {
  // Por ahora solo tenemos un capítulo, pero esta función se puede expandir
  // cuando tengamos múltiples capítulos
  return countWords(mockChapter.content)
}

export default function DataDemo() {
  const { chapter, loading, error, properNouns } = useMockChapter()
  const [selectedTab, setSelectedTab] = useState<'user' | 'project' | 'chapter'>('chapter')

  const tabs = [
    { id: 'user' as const, label: 'Usuario', icon: User },
    { id: 'project' as const, label: 'Proyecto', icon: BookOpen },
    { id: 'chapter' as const, label: 'Capítulo', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Sistema de Datos NovelCraft
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Demostración de integración con datos JSON para usuarios, proyectos y capítulos
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
        >
          {selectedTab === 'user' && <UserData />}
          {selectedTab === 'project' && <ProjectData />}
          {selectedTab === 'chapter' && (
            <ChapterData 
              chapter={chapter} 
              loading={loading} 
              error={error} 
              properNouns={properNouns} 
            />
          )}
        </motion.div>

        {/* JSON Preview */}
        <motion.div
          className="mt-8 bg-black/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estructura JSON
          </h3>
          <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
            {selectedTab === 'user' && JSON.stringify(mockUser, null, 2)}
            {selectedTab === 'project' && JSON.stringify(mockProject, null, 2)}
            {selectedTab === 'chapter' && chapter && JSON.stringify({
              id: chapter.id,
              title: chapter.title,
              synopsis: chapter.synopsis,
              status: chapter.status,
              wordCount: chapter.wordCount,
              themes: chapter.themes,
              keyEvents: chapter.keyEvents,
              contentPreview: chapter.content.substring(0, 200) + '...'
            }, null, 2)}
          </pre>
        </motion.div>
      </div>
    </div>
  )
}

function UserData() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="h-6 w-6" />
        Datos del Usuario
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InfoCard label="Nombre" value={mockUser.displayName} />
          <InfoCard label="Username" value={mockUser.username} />
          <InfoCard label="Plan" value={mockUser.plan} />
          <InfoCard label="Estado" value={mockUser.status} />
        </div>
        <div className="space-y-4">
          <InfoCard label="Proyectos" value={mockUser.projectsCount.toString()} />
          <InfoCard label="Palabras Totales" value={mockUser.totalWords.toLocaleString()} />
          <InfoCard label="Miembro desde" value={new Date(mockUser.joinedAt).toLocaleDateString()} />
          <InfoCard label="Última actividad" value={new Date(mockUser.lastActive).toLocaleDateString()} />
        </div>
      </div>
    </div>
  )
}

function ProjectData() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6" />
        Datos del Proyecto
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <InfoCard label="Título" value={mockProject.title} />
          <InfoCard label="Género" value={mockProject.genre} />
          <InfoCard label="Estado" value={mockProject.status} />
          <InfoCard label="Descripción" value={mockProject.description} />
        </div>
        <div className="space-y-4">
          <InfoCard label="Meta de palabras" value={mockProject.targetWordCount.toLocaleString()} />
          <InfoCard label="Palabras actuales (Real)" value={countProjectWords().toLocaleString()} />
          <InfoCard label="Progreso (Real)" value={`${Math.round((countProjectWords() / mockProject.targetWordCount) * 100)}%`} />
          <InfoCard label="Temas" value={mockProject.themes.join(', ')} />
        </div>
      </div>

      {/* Entidades del Proyecto (Nivel Libro) */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Entidades del Proyecto (Nivel Libro)
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Estas entidades están definidas a nivel de proyecto y se reutilizan en todos los capítulos.
        </p>
        
        {/* Personajes */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-purple-300 mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            Personajes
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockProject.characters.map((char) => (
              <div key={char.id} className="bg-black/30 rounded-lg p-5 border border-purple-400/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold text-lg mb-1">{char.name}</div>
                    <div className="text-sm text-purple-300 capitalize">{char.role}</div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>Edad: {char.age}</div>
                    <div>{char.occupation}</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300 mb-3 leading-relaxed">
                  {char.description}
                </div>
                
                {char.personality && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Personalidad:</div>
                    <div className="flex flex-wrap gap-1">
                      {char.personality.map((trait, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-600/20 border border-blue-400/40 rounded text-xs text-blue-300">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {char.groupings && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Afiliaciones:</div>
                    <div className="flex flex-wrap gap-1">
                      {char.groupings.map((group: string, idx: number) => (
                        <span key={idx} className="px-2 py-1 bg-orange-600/20 border border-orange-400/40 rounded text-xs text-orange-300">
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {char.portfolio && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-2">Portfolio ({char.portfolio.length} imágenes):</div>
                    <div className="grid grid-cols-2 gap-2">
                      {char.portfolio.map((item) => (
                        <div key={item.id} className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                          <div className="aspect-video bg-gray-700/50 rounded mb-2 overflow-hidden relative">
                            <img 
                              src={item.path} 
                              alt={item.description}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-gray-400">📷 ${item.filename}</div>`;
                                }
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-300 mb-2 line-clamp-2">{item.description}</div>
                          
                          {/* Metadatos Fotográficos */}
                          {(item.shotType || item.angle || item.composition || item.lighting) && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">Especificaciones:</div>
                              <div className="flex flex-wrap gap-1">
                                {item.shotType && (
                                  <span className="px-1 py-0.5 bg-blue-600/20 border border-blue-400/40 rounded text-xs text-blue-300">
                                    📷 {item.shotType}
                                  </span>
                                )}
                                {item.angle && (
                                  <span className="px-1 py-0.5 bg-cyan-600/20 border border-cyan-400/40 rounded text-xs text-cyan-300">
                                    🔄 {item.angle}
                                  </span>
                                )}
                                {item.composition && (
                                  <span className="px-1 py-0.5 bg-teal-600/20 border border-teal-400/40 rounded text-xs text-teal-300">
                                    🖼️ {item.composition}
                                  </span>
                                )}
                                {item.lighting && (
                                  <span className="px-1 py-0.5 bg-yellow-600/20 border border-yellow-400/40 rounded text-xs text-yellow-300">
                                    💡 {item.lighting}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-1 mb-1">
                            <span className="px-1 py-0.5 bg-indigo-600/20 border border-indigo-400/40 rounded text-xs text-indigo-300">
                              {item.mood}
                            </span>
                            <span className="px-1 py-0.5 bg-green-600/20 border border-green-400/40 rounded text-xs text-green-300">
                              {item.context}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="px-1 py-0.5 bg-gray-600/30 border border-gray-500/50 rounded text-xs text-gray-300">
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="px-1 py-0.5 bg-gray-600/20 border border-gray-500/30 rounded text-xs text-gray-400">
                                +{item.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {char.tags && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Tags para detección:</div>
                    <div className="flex flex-wrap gap-1">
                      {char.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-600/30 border border-purple-400/50 rounded text-xs text-purple-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Locaciones */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-green-300 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locaciones
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockProject.locations.map((location) => (
              <div key={location.id} className="bg-black/30 rounded-lg p-5 border border-green-400/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold text-lg mb-1">{location.name}</div>
                    <div className="text-sm text-green-300 capitalize">{location.type}</div>
                  </div>
                </div>
                
                {location.description && (
                  <div className="text-sm text-gray-300 mb-3 leading-relaxed">
                    {location.description}
                  </div>
                )}
                
                {location.portfolio && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-2">Portfolio ({location.portfolio.length} imágenes):</div>
                    <div className="grid grid-cols-2 gap-2">
                      {location.portfolio.map((item) => (
                        <div key={item.id} className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                          <div className="aspect-video bg-gray-700/50 rounded mb-2 overflow-hidden relative">
                            <img 
                              src={item.path} 
                              alt={item.description}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-gray-400">🏙️ ${item.filename}</div>`;
                                }
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-300 mb-1 line-clamp-2">{item.description}</div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            <span className="px-1 py-0.5 bg-indigo-600/20 border border-indigo-400/40 rounded text-xs text-indigo-300">
                              {item.mood}
                            </span>
                            <span className="px-1 py-0.5 bg-green-600/20 border border-green-400/40 rounded text-xs text-green-300">
                              {item.context}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {location.tags && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Tags para detección:</div>
                    <div className="flex flex-wrap gap-1">
                      {location.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-green-600/30 border border-green-400/50 rounded text-xs text-green-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Organizaciones */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-orange-300 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Organizaciones
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockProject.organizations?.map((org) => (
              <div key={org.id} className="bg-black/30 rounded-lg p-5 border border-orange-400/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold text-lg mb-1">{org.name}</div>
                    <div className="text-sm text-orange-300 capitalize">{org.type}</div>
                  </div>
                </div>
                
                {org.description && (
                  <div className="text-sm text-gray-300 mb-3 leading-relaxed">
                    {org.description}
                  </div>
                )}
                
                {org.portfolio && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-2">Portfolio ({org.portfolio.length} recursos):</div>
                    <div className="grid grid-cols-2 gap-2">
                      {org.portfolio.map((item) => (
                        <div key={item.id} className="bg-gray-800/50 rounded-lg p-2 border border-gray-600/30 hover:border-gray-500/50 transition-colors">
                          <div className="aspect-video bg-gray-700/50 rounded mb-2 overflow-hidden relative">
                            <img 
                              src={item.path} 
                              alt={item.description}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xs text-gray-400">🏢 ${item.filename}</div>`;
                                }
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-300 mb-1 line-clamp-2">{item.description}</div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            <span className="px-1 py-0.5 bg-indigo-600/20 border border-indigo-400/40 rounded text-xs text-indigo-300">
                              {item.mood}
                            </span>
                            <span className="px-1 py-0.5 bg-orange-600/20 border border-orange-400/40 rounded text-xs text-orange-300">
                              {item.context}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {org.tags && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Tags para detección:</div>
                    <div className="flex flex-wrap gap-1">
                      {org.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-600/30 border border-orange-400/50 rounded text-xs text-orange-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ChapterData({ 
  chapter, 
  loading, 
  error, 
  properNouns 
}: { 
  chapter: Chapter | null
  loading: boolean
  error: string | null
  properNouns: string[]
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Cargando capítulo...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <p className="text-gray-400">No se pudo cargar el capítulo</p>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No hay datos del capítulo disponibles</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6" />
        Datos del Capítulo
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <InfoCard label="Título" value={chapter.title} />
          <InfoCard label="Estado" value={chapter.status} />
          <InfoCard label="Palabras (Real)" value={countWords(chapter.content).toLocaleString()} />
          <InfoCard label="Ambiente" value={chapter.mood} />
        </div>
        <div className="space-y-4">
          <InfoCard label="Temas" value={chapter.themes.join(', ')} />
          <InfoCard label="Última modificación" value={new Date(chapter.lastModified).toLocaleDateString()} />
          <InfoCard label="Nombres propios encontrados" value={properNouns.length.toString()} />
        </div>
      </div>

      {/* Synopsis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Sinopsis</h3>
        <p className="text-gray-300 bg-black/20 rounded-lg p-4">{chapter.synopsis}</p>
      </div>



      {/* Nombres Propios Detectados en este Capítulo */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Nombres Propios Detectados en este Capítulo
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {properNouns.map((noun, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-600/30 border border-purple-400/50 rounded-full text-sm text-purple-200"
            >
              {noun}
            </span>
          ))}
        </div>
        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-2">Cómo funciona la detección:</h4>
          <p className="text-sm text-gray-300 mb-2">
            El sistema busca en el contenido del capítulo las entidades definidas a <strong>nivel de proyecto</strong> usando sus tags.
          </p>
          <p className="text-xs text-gray-400">
            Ejemplo: "Maya" se detecta porque está en los tags del personaje Maya Chen del proyecto.
          </p>
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Contenido del Capítulo</h3>
        <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="text-gray-300 whitespace-pre-line text-sm leading-relaxed">
            {chapter.content}
          </div>
        </div>
      </div>

      {/* Key Events */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Eventos Clave</h3>
        <ul className="space-y-2">
          {chapter.keyEvents.map((event, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-300">
              <Clock className="h-4 w-4 mt-1 text-purple-400 flex-shrink-0" />
              {event}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/5">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-white font-medium">{value}</div>
    </div>
  )
}
