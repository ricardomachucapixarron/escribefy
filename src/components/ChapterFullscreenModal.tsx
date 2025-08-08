import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, Clock, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CueInfo {
  type: 'vfx' | 'sound' | 'image'
  effect: string
  params: Record<string, string>
  fullText: string
  startIndex: number
  endIndex: number
}

interface ChapterFullscreenModalProps {
  chapter: {
    id: string
    title: string
    synopsis: string
    duration: string
    image?: string
  }
  isOpen: boolean
  onClose: () => void
}

const ChapterFullscreenModal: React.FC<ChapterFullscreenModalProps> = ({
  chapter,
  isOpen,
  onClose
}) => {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [hoveredCue, setHoveredCue] = useState<CueInfo[] | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Cargar contenido del capítulo
  useEffect(() => {
    if (isOpen && chapter.id) {
      loadChapterContent()
    }
  }, [isOpen, chapter.id])

  const loadChapterContent = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/entities/chapter/${chapter.id}`)
      if (response.ok) {
        const result = await response.json()
        setContent(result.data?.content || 'Contenido no disponible')
      } else {
        setContent('Error al cargar el contenido del capítulo')
      }
    } catch (error) {
      console.error('Error loading chapter content:', error)
      setContent('Error al cargar el contenido del capítulo')
    } finally {
      setLoading(false)
    }
  }

  // Parsear cues del contenido
  const parseCues = (text: string): CueInfo[] => {
    const cueRegex = /\[cue:(vfx|sound|image)\|([^|\]]+)(?:\|([^\]]+))?\]/g
    const cues: CueInfo[] = []
    let match

    while ((match = cueRegex.exec(text)) !== null) {
      const [fullMatch, type, effect, paramsString] = match
      const params: Record<string, string> = {}
      
      if (paramsString) {
        paramsString.split('|').forEach(param => {
          const [key, val] = param.split('=')
          if (key && val) {
            params[key] = val
          }
        })
      }

      cues.push({
        type: type as 'vfx' | 'sound' | 'image',
        effect,
        params,
        fullText: fullMatch,
        startIndex: match.index,
        endIndex: match.index + fullMatch.length
      })
    }

    return cues
  }

  // Agrupar cues consecutivos
  const groupConsecutiveCues = (cues: CueInfo[]): CueInfo[][] => {
    if (cues.length === 0) return []
    
    const groups: CueInfo[][] = []
    let currentGroup: CueInfo[] = [cues[0]]
    
    for (let i = 1; i < cues.length; i++) {
      const prevCue = cues[i - 1]
      const currentCue = cues[i]
      
      const textBetween = content.substring(prevCue.endIndex, currentCue.startIndex).trim()
      
      if (textBetween === '' || textBetween.match(/^\s*$/)) {
        currentGroup.push(currentCue)
      } else {
        groups.push(currentGroup)
        currentGroup = [currentCue]
      }
    }
    
    groups.push(currentGroup)
    return groups
  }

  // Renderizar texto con triángulos rojos
  const renderContentWithCues = () => {
    if (!content || loading) return null

    const cues = parseCues(content)
    if (cues.length === 0) {
      return <div className="whitespace-pre-wrap text-lg leading-relaxed">{content}</div>
    }

    const groupedCues = groupConsecutiveCues(cues)
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    groupedCues.forEach((group, index) => {
      const firstCue = group[0]
      const lastCue = group[group.length - 1]
      
      // Agregar texto antes del grupo de cues
      if (firstCue.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {content.substring(lastIndex, firstCue.startIndex)}
          </span>
        )
      }

      // Agregar triángulo rojo para el grupo
      parts.push(
        <RedTriangle
          key={`cue-group-${index}`}
          cues={group}
          onHover={(cueGroup: CueInfo[], event: React.MouseEvent) => {
            setHoveredCue(cueGroup)
            setMousePosition({ x: event.clientX, y: event.clientY })
          }}
          onLeave={() => setHoveredCue(null)}
        />
      )

      lastIndex = lastCue.endIndex
    })

    // Agregar texto después del último cue
    if (lastIndex < content.length) {
      parts.push(
        <span key="text-final">
          {content.substring(lastIndex)}
        </span>
      )
    }

    return <div className="whitespace-pre-wrap text-lg leading-relaxed">{parts}</div>
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ duration: 0.3, type: "spring" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                <img
                  src={chapter.image || "/placeholder.svg"}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{chapter.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{chapter.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>Capítulo</span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Synopsis */}
          <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-700">
            <p className="text-gray-300 text-sm leading-relaxed">{chapter.synopsis}</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-400">Cargando contenido...</span>
              </div>
            ) : (
              <div className="prose prose-invert prose-lg max-w-none">
                {renderContentWithCues()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/30 text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-red-500 font-bold">▲</span>
                <span>Triángulo rojo = Efectos (hover para detalles)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tooltip para cues */}
        {hoveredCue && (
          <CueTooltip
            cues={hoveredCue}
            position={mousePosition}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Componente para triángulo rojo
const RedTriangle: React.FC<{
  cues: CueInfo[]
  onHover: (cues: CueInfo[], event: React.MouseEvent) => void
  onLeave: () => void
}> = ({ cues, onHover, onLeave }) => {
  return (
    <span
      className="inline-block cursor-help transition-colors duration-200 font-bold text-lg text-red-500 hover:text-red-400 mx-1"
      onMouseEnter={(e) => onHover(cues, e)}
      onMouseLeave={onLeave}
      onMouseMove={(e) => onHover(cues, e)}
      title={`${cues.length} efecto${cues.length > 1 ? 's' : ''}`}
    >
      ▲
    </span>
  )
}

// Tooltip para mostrar información detallada de cues
const CueTooltip: React.FC<{
  cues: CueInfo[]
  position: { x: number; y: number }
}> = ({ cues, position }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vfx': return 'Efecto Visual'
      case 'sound': return 'Efecto de Sonido'
      case 'image': return 'Imagen/Recuerdo'
      default: return 'Cue'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vfx': return '✨'
      case 'sound': return '🔊'
      case 'image': return '🖼️'
      default: return 'ℹ️'
    }
  }

  const getTooltipColor = () => {
    const types = [...new Set(cues.map(cue => cue.type))]
    if (types.length > 1) {
      return 'border-yellow-500 bg-yellow-900'
    }
    
    switch (types[0]) {
      case 'vfx': return 'border-purple-500 bg-purple-900'
      case 'sound': return 'border-green-500 bg-green-900'
      case 'image': return 'border-blue-500 bg-blue-900'
      default: return 'border-gray-500 bg-gray-900'
    }
  }

  return (
    <div
      className={`fixed z-50 max-w-sm p-3 rounded-lg border shadow-xl ${getTooltipColor()}`}
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="space-y-2">
        {cues.map((cue, index) => (
          <div key={index} className="border-b border-gray-600 last:border-b-0 pb-2 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <span>{getTypeIcon(cue.type)}</span>
              <span className="text-sm font-bold text-white">{getTypeLabel(cue.type)}</span>
            </div>
            
            <div className="ml-6">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-300">Efecto:</span>
                <span className="text-xs text-white ml-2">{cue.effect}</span>
              </div>

              {Object.keys(cue.params).length > 0 && (
                <div className="mb-1">
                  <span className="text-xs font-medium text-gray-400">Parámetros:</span>
                  <div className="text-xs space-y-0.5 ml-2">
                    {Object.entries(cue.params).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-2">
                        <span className="text-gray-300">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400 font-mono">{cue.fullText}</div>
            </div>
          </div>
        ))}
      </div>
      
      {cues.length > 1 && (
        <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400 text-center">
          {cues.length} efectos en este punto
        </div>
      )}
    </div>
  )
}

export default ChapterFullscreenModal
