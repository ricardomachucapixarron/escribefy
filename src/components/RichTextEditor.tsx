import React, { useState, useRef, useEffect } from 'react'
import { Info, Eye, Volume2, Image, Sparkles, X } from 'lucide-react'

interface CueInfo {
  type: 'vfx' | 'sound' | 'image'
  effect: string
  params: Record<string, string>
  fullText: string
  startIndex: number
  endIndex: number
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = ''
}) => {
  const [hoveredCue, setHoveredCue] = useState<CueInfo | CueInfo[] | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Parsear cues del texto
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

  // Renderizar texto limpio con asteriscos para cues
  const renderTextWithCues = () => {
    if (!value) return null

    const cues = parseCues(value)
    if (cues.length === 0) {
      return <div className="whitespace-pre-wrap">{value}</div>
    }

    // Agrupar cues que están consecutivos
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
            {value.substring(lastIndex, firstCue.startIndex)}
          </span>
        )
      }

      // Agregar asterisco con tooltip para el grupo
      parts.push(
        <CueAsterisk
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
    if (lastIndex < value.length) {
      parts.push(
        <span key="text-final">
          {value.substring(lastIndex)}
        </span>
      )
    }

    return <div className="whitespace-pre-wrap">{parts}</div>
  }

  // Agrupar cues consecutivos (que están uno tras otro sin texto entre ellos)
  const groupConsecutiveCues = (cues: CueInfo[]): CueInfo[][] => {
    if (cues.length === 0) return []
    
    const groups: CueInfo[][] = []
    let currentGroup: CueInfo[] = [cues[0]]
    
    for (let i = 1; i < cues.length; i++) {
      const prevCue = cues[i - 1]
      const currentCue = cues[i]
      
      // Si el cue actual está inmediatamente después del anterior (sin texto entre ellos)
      const textBetween = value.substring(prevCue.endIndex, currentCue.startIndex).trim()
      
      if (textBetween === '' || textBetween.match(/^\s*$/)) {
        // Agregar al grupo actual
        currentGroup.push(currentCue)
      } else {
        // Iniciar nuevo grupo
        groups.push(currentGroup)
        currentGroup = [currentCue]
      }
    }
    
    groups.push(currentGroup)
    return groups
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={`relative ${className}`}>
      {readOnly ? (
        // Vista de solo lectura - texto plano
        <div className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-3 text-white min-h-[200px] leading-relaxed whitespace-pre-wrap">
          {value}
        </div>
      ) : (
        // Editor de texto con botón de previsualización
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder}
            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-3 text-white min-h-[200px] resize-vertical focus:border-blue-500 focus:outline-none leading-relaxed font-mono text-sm pr-12"
            readOnly={readOnly}
          />
          
          {/* Botón de previsualización */}
          <button
            onClick={() => setShowPreview(true)}
            className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors duration-200 flex items-center gap-1"
            title="Vista previa con efectos"
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Preview</span>
          </button>
        </div>
      )}

      {/* Modal de previsualización */}
      {showPreview && (
        <PreviewModal
          content={value}
          onClose={() => setShowPreview(false)}
          onHover={(cues: CueInfo[], event: React.MouseEvent) => {
            setHoveredCue(cues)
            setMousePosition({ x: event.clientX, y: event.clientY })
          }}
          onLeave={() => setHoveredCue(null)}
        />
      )}

      {/* Tooltip para cues */}
      {hoveredCue && (
        <CueTooltip
          cues={Array.isArray(hoveredCue) ? hoveredCue : [hoveredCue]}
          position={mousePosition}
        />
      )}
    </div>
  )
}

// Componente para asterisco que representa cues
const CueAsterisk: React.FC<{
  cues: CueInfo[]
  onHover: (cues: CueInfo[], event: React.MouseEvent) => void
  onLeave: () => void
}> = ({ cues, onHover, onLeave }) => {
  const getColor = () => {
    // Si hay múltiples tipos, usar color mixto
    const types = [...new Set(cues.map(cue => cue.type))]
    if (types.length > 1) {
      return 'text-yellow-400 hover:text-yellow-300'
    }
    
    // Color según el tipo único
    switch (types[0]) {
      case 'vfx': return 'text-purple-400 hover:text-purple-300'
      case 'sound': return 'text-green-400 hover:text-green-300'
      case 'image': return 'text-blue-400 hover:text-blue-300'
      default: return 'text-gray-400 hover:text-gray-300'
    }
  }

  return (
    <span
      className={`inline-block cursor-help transition-colors duration-200 font-bold text-sm ${getColor()}`}
      onMouseEnter={(e) => onHover(cues, e)}
      onMouseLeave={onLeave}
      onMouseMove={(e) => onHover(cues, e)}
      title={`${cues.length} efecto${cues.length > 1 ? 's' : ''}`}
    >
      *
    </span>
  )
}

// Componente para elementos cue individuales (mantenido para compatibilidad)
const CueElement: React.FC<{
  cue: CueInfo
  onHover: (cue: CueInfo, event: React.MouseEvent) => void
  onLeave: () => void
}> = ({ cue, onHover, onLeave }) => {
  const getIcon = () => {
    switch (cue.type) {
      case 'vfx': return <Sparkles className="h-3 w-3" />
      case 'sound': return <Volume2 className="h-3 w-3" />
      case 'image': return <Image className="h-3 w-3" />
      default: return <Info className="h-3 w-3" />
    }
  }

  const getColor = () => {
    switch (cue.type) {
      case 'vfx': return 'text-purple-400 bg-purple-900/30 border-purple-500/50'
      case 'sound': return 'text-green-400 bg-green-900/30 border-green-500/50'
      case 'image': return 'text-blue-400 bg-blue-900/30 border-blue-500/50'
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50'
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border cursor-help transition-all duration-200 hover:scale-105 ${getColor()}`}
      onMouseEnter={(e) => onHover(cue, e)}
      onMouseLeave={onLeave}
      onMouseMove={(e) => onHover(cue, e)}
    >
      {getIcon()}
      <span className="text-xs font-medium">{cue.effect}</span>
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
      case 'vfx': return <Sparkles className="h-3 w-3 text-purple-400" />
      case 'sound': return <Volume2 className="h-3 w-3 text-green-400" />
      case 'image': return <Image className="h-3 w-3 text-blue-400" />
      default: return <Info className="h-3 w-3 text-gray-400" />
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
              {getTypeIcon(cue.type)}
              <span className="text-sm font-bold text-white">{getTypeLabel(cue.type)}</span>
            </div>
            
            <div className="ml-5">
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

// Modal de previsualización con triángulos rojos
const PreviewModal: React.FC<{
  content: string
  onClose: () => void
  onHover: (cues: CueInfo[], event: React.MouseEvent) => void
  onLeave: () => void
}> = ({ content, onClose, onHover, onLeave }) => {
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
  const renderPreviewText = () => {
    if (!content) return null

    const cues = parseCues(content)
    if (cues.length === 0) {
      return <div className="whitespace-pre-wrap">{content}</div>
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
            onHover(cueGroup, event)
          }}
          onLeave={onLeave}
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

    return <div className="whitespace-pre-wrap">{parts}</div>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-600 w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa con Efectos
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Contenido del modal */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-slate-700 rounded-lg p-4 text-white leading-relaxed text-base">
            {renderPreviewText()}
          </div>
        </div>
        
        {/* Footer con información */}
        <div className="p-4 border-t border-slate-600 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-red-500 font-bold">▲</span>
              <span>Triángulo rojo = Efectos (hover para detalles)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      className="inline-block cursor-help transition-colors duration-200 font-bold text-base text-red-500 hover:text-red-400 mx-0.5"
      onMouseEnter={(e) => onHover(cues, e)}
      onMouseLeave={onLeave}
      onMouseMove={(e) => onHover(cues, e)}
      title={`${cues.length} efecto${cues.length > 1 ? 's' : ''}`}
    >
      ▲
    </span>
  )
}

export default RichTextEditor
