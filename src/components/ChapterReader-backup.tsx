"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Clock, BookOpen, ChevronDown, MousePointer, Eye, Volume2, Image, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CueInfo {
  type: 'vfx' | 'sound' | 'image'
  effect: string
  params: Record<string, string>
  fullText: string
  startIndex: number
  endIndex: number
}

interface ChapterReaderProps {
  chapter: {
    id: string
    title: string
    synopsis: string
    duration: string
    image?: string
  }
  onBack: () => void
}

// Lista de efectos especiales para resaltar
const specialEffects = [
  'blur', 'fade', 'glow', 'shake', 'zoom', 'rotate', 'pulse',
  'viento', 'lluvia', 'trueno', 'susurro', 'rugido', 'eco',
  'cristales', 'runas', 'magia', 'luz', 'sombra', 'fuego'
]

// Componente para texto con cues resaltados
const HighlightedText: React.FC<{ text: string; onCueHover: (cues: CueInfo[], event: React.MouseEvent) => void; onCueLeave: () => void }> = ({ 
  text, 
  onCueHover, 
  onCueLeave 
}) => {
  const [hoveredCue, setHoveredCue] = useState<string | null>(null)

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
      
      const textBetween = text.substring(prevCue.endIndex, currentCue.startIndex).trim()
      
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

  // Resaltar efectos especiales en el texto
  const highlightSpecialEffects = (text: string) => {
    let highlightedText = text

    specialEffects.forEach((effect, index) => {
      const regex = new RegExp(`\\b${effect}\\b`, "gi")
      highlightedText = highlightedText.replace(regex, `<EFFECT_${index}>${effect}</EFFECT_${index}>`)
    })

    return highlightedText
  }

  // Renderizar texto con cues y efectos resaltados
  const renderTextWithCues = () => {
    if (!text) return null

    const cues = parseCues(text)
    if (cues.length === 0) {
      // Si no hay cues, solo resaltar efectos especiales
      const processedText = highlightSpecialEffects(text)
      const parts = processedText.split(/(<EFFECT_\d+>.*?<\/EFFECT_\d+>)/)

      return (
        <span>
          {parts.map((part, index) => {
            const effectMatch = part.match(/<EFFECT_(\d+)>(.*?)<\/EFFECT_\d+>/)

            if (effectMatch) {
              const effectText = effectMatch[2]
              return (
                <motion.span
                  key={index}
                  className="relative inline-block cursor-pointer"
                  onMouseEnter={() => setHoveredCue(effectText)}
                  onMouseLeave={() => setHoveredCue(null)}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-md blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoveredCue === effectText ? 1 : 0,
                      scale: hoveredCue === effectText ? 1.2 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <span
                    className="relative z-10 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent font-semibold"
                    style={{
                      textShadow: hoveredCue === effectText ? "0 0 20px rgba(139, 92, 246, 0.5)" : "none",
                      filter: hoveredCue === effectText ? "brightness(1.3)" : "brightness(1)",
                    }}
                  >
                    {effectText}
                  </span>
                </motion.span>
              )
            }

            return <span key={index}>{part}</span>
          })}
        </span>
      )
    }

    const groupedCues = groupConsecutiveCues(cues)
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    groupedCues.forEach((group, index) => {
      const firstCue = group[0]
      const lastCue = group[group.length - 1]
      
      // Agregar texto antes del grupo de cues (con efectos resaltados)
      if (firstCue.startIndex > lastIndex) {
        const textBefore = text.substring(lastIndex, firstCue.startIndex)
        const processedText = highlightSpecialEffects(textBefore)
        const textParts = processedText.split(/(<EFFECT_\d+>.*?<\/EFFECT_\d+>)/)

        parts.push(
          <span key={`text-${index}`}>
            {textParts.map((part, partIndex) => {
              const effectMatch = part.match(/<EFFECT_(\d+)>(.*?)<\/EFFECT_\d+>/)
              if (effectMatch) {
                const effectText = effectMatch[2]
                return (
                  <motion.span
                    key={partIndex}
                    className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent font-semibold"
                    whileHover={{ scale: 1.05 }}
                  >
                    {effectText}
                  </motion.span>
                )
              }
              return <span key={partIndex}>{part}</span>
            })}
          </span>
        )
      }

      // Agregar triángulo rojo para el grupo
      parts.push(
        <RedTriangle
          key={`cue-group-${index}`}
          cues={group}
          onHover={onCueHover}
          onLeave={onCueLeave}
        />
      )

      lastIndex = lastCue.endIndex
    })

    // Agregar texto después del último cue (con efectos resaltados)
    if (lastIndex < text.length) {
      const textAfter = text.substring(lastIndex)
      const processedText = highlightSpecialEffects(textAfter)
      const textParts = processedText.split(/(<EFFECT_\d+>.*?<\/EFFECT_\d+>)/)

      parts.push(
        <span key="text-final">
          {textParts.map((part, partIndex) => {
            const effectMatch = part.match(/<EFFECT_(\d+)>(.*?)<\/EFFECT_\d+>/)
            if (effectMatch) {
              const effectText = effectMatch[2]
              return (
                <motion.span
                  key={partIndex}
                  className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  {effectText}
                </motion.span>
              )
            }
            return <span key={partIndex}>{part}</span>
          })}
        </span>
      )
    }

    return <span>{parts}</span>
  }

  return renderTextWithCues()
}

// Componente para triángulo rojo
const RedTriangle: React.FC<{
  cues: CueInfo[]
  onHover: (cues: CueInfo[], event: React.MouseEvent) => void
  onLeave: () => void
}> = ({ cues, onHover, onLeave }) => {
  return (
    <motion.span
      className="inline-block cursor-help transition-colors duration-200 font-bold text-lg text-red-500 hover:text-red-400 mx-1"
      onMouseEnter={(e) => onHover(cues, e)}
      onMouseLeave={onLeave}
      onMouseMove={(e) => onHover(cues, e)}
      whileHover={{ scale: 1.2, rotate: 5 }}
      transition={{ duration: 0.2 }}
      title={`${cues.length} efecto${cues.length > 1 ? 's' : ''}`}
    >
      ▲
    </motion.span>
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
      case 'vfx': return <Sparkles className="h-4 w-4" />
      case 'sound': return <Volume2 className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  const getTooltipColor = () => {
    const types = [...new Set(cues.map(cue => cue.type))]
    if (types.length > 1) {
      return 'border-yellow-500 bg-yellow-900/90'
    }
    
    switch (types[0]) {
      case 'vfx': return 'border-purple-500 bg-purple-900/90'
      case 'sound': return 'border-green-500 bg-green-900/90'
      case 'image': return 'border-blue-500 bg-blue-900/90'
      default: return 'border-gray-500 bg-gray-900/90'
    }
  }

  return (
    <motion.div
      className={`fixed z-50 max-w-sm p-4 rounded-xl border shadow-2xl backdrop-blur-md ${getTooltipColor()}`}
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-3">
        {cues.map((cue, index) => (
          <div key={index} className="border-b border-gray-600 last:border-b-0 pb-3 last:pb-0">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(cue.type)}
              <span className="text-sm font-bold text-white">{getTypeLabel(cue.type)}</span>
            </div>
            
            <div className="ml-6">
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-300">Efecto:</span>
                <span className="text-sm text-white ml-2 font-semibold">{cue.effect}</span>
              </div>

              {Object.keys(cue.params).length > 0 && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-400">Parámetros:</span>
                  <div className="text-xs space-y-1 ml-2 mt-1">
                    {Object.entries(cue.params).map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-2 bg-black/30 rounded px-2 py-1">
                        <span className="text-gray-300">{key}:</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400 font-mono bg-black/30 rounded px-2 py-1">
                {cue.fullText}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {cues.length > 1 && (
        <div className="mt-3 pt-3 border-t border-gray-600 text-xs text-gray-400 text-center font-medium">
          {cues.length} efectos en este punto
        </div>
      )}
    </motion.div>
  )
}

const ChapterReader: React.FC<ChapterReaderProps> = ({ chapter, onBack }) => {
  const [content, setContent] = useState<string>('')
  const [displayedText, setDisplayedText] = useState('')
  const [showScrollMessage, setShowScrollMessage] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hoveredCue, setHoveredCue] = useState<CueInfo[] | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)

  // Always call hooks in the same order
  const { scrollYProgress } = useScroll()
  const textProgress = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  const backgroundOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  // Fix hydration issue
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Cargar contenido del capítulo
  useEffect(() => {
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

    loadChapterContent()
  }, [chapter.id])

  // Update displayed text based on scroll progress
  useEffect(() => {
    if (!content || loading || !isMounted) return

    const unsubscribe = textProgress.on("change", (progress) => {
      const targetIndex = Math.floor(progress * content.length)
      setDisplayedText(content.slice(0, targetIndex))
    })
    return unsubscribe
  }, [textProgress, content, loading, isMounted])

  // Show scroll message after 4 seconds
  useEffect(() => {
    if (loading || !isMounted) return
    
    const timer = setTimeout(() => {
      if (!hasScrolled) setShowScrollMessage(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hasScrolled, loading, isMounted])

  // Track if user has scrolled
  useEffect(() => {
    if (!isMounted) return
    
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress > 0.01 && !hasScrolled) {
        setHasScrolled(true)
        setShowScrollMessage(false)
      }
    })
    return unsubscribe
  }, [scrollYProgress, hasScrolled, isMounted])

  const handleCueHover = (cues: CueInfo[], event: React.MouseEvent) => {
    setHoveredCue(cues)
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleCueLeave = () => {
    setHoveredCue(null)
  }

  // Render different states without early returns to maintain hook order
  const renderLoadingScreen = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-gray-400">Cargando...</p>
      </div>
    </div>
  )

  const renderChapterLoadingScreen = () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-400">Cargando capítulo...</p>
      </div>
    </div>
  )

  // Conditional rendering without early returns
  if (!isMounted) {
    return renderLoadingScreen()
  }

  if (loading) {
    return renderChapterLoadingScreen()
  }

  return (
    <div ref={containerRef} className="min-h-[800vh] bg-black text-white overflow-hidden">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:text-purple-400 hover:bg-white/5 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                <img
                  src={chapter.image || "/placeholder.svg"}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-xl font-bold">{chapter.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
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
            </motion.div>

            <motion.div
              className="hidden md:block text-sm text-gray-400"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {chapter.synopsis}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Background */}
      <motion.div className="fixed inset-0 z-0" style={{ opacity: backgroundOpacity }}>
        <img
          src={chapter.image || "/placeholder.svg"}
          alt={chapter.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </motion.div>

      {/* Main Content */}
      <div className="fixed inset-0 flex items-center justify-center z-10 pt-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {/* Contenedor para el texto */}
            <motion.div
              className="h-[60vh] w-full max-w-4xl p-8 mx-auto overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="h-full flex items-center justify-center overflow-hidden">
                {displayedText ? (
                  <div className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white/90 text-left max-w-3xl">
                    <HighlightedText 
                      text={displayedText} 
                      onCueHover={handleCueHover}
                      onCueLeave={handleCueLeave}
                    />
                    <motion.span
                      className="inline-block w-1 h-6 bg-purple-400 ml-2"
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                ) : (
                  <motion.div
                    className="text-gray-400 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                  >
                    {chapter.title} está por comenzar...
                    <motion.span
                      className="inline-block w-1 h-6 bg-purple-400 ml-2"
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
        style={{ opacity: scrollIndicatorOpacity }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 mb-4"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showScrollMessage && !hasScrolled ? 1 : 0,
            y: showScrollMessage && !hasScrolled ? 0 : 20,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <MousePointer className="h-4 w-4" />
              <span>Desplázate para continuar leyendo</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="fixed top-20 right-6 z-50"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
              />
            </div>
            <span>{Math.round(scrollYProgress.get() * 100)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Completion Message */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.95, 1], [0, 1]) }}
      >
        <motion.div
          className="text-center pointer-events-auto bg-black/90 backdrop-blur-lg rounded-3xl p-12 border-2 border-white/30 shadow-2xl max-w-4xl mx-4"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.3)",
            borderColor: "rgba(139, 92, 246, 0.5)",
            transition: { duration: 0.3 },
          }}
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ¡Capítulo Completado!
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Has terminado de leer "{chapter.title}". ¿Qué te pareció esta aventura?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onBack}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver a la Biblioteca
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tooltip para cues */}
      {hoveredCue && (
        <CueTooltip
          cues={hoveredCue}
          position={mousePosition}
        />
      )}
    </div>
  )
}

export default ChapterReader
