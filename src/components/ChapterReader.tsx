'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ChevronDown, MousePointer } from 'lucide-react'
import Hypher from 'hypher'
import spanish from 'hyphenation.es'

interface CueInfo {
  type: 'vfx' | 'sound' | 'image'
  effect: string
  params: Record<string, string>
  originalCode: string
}

interface Chapter {
  id: string
  title: string
  synopsis: string
  image: string
  duration: string
  episode: number
  status: 'published' | 'in-construction' | 'upcoming'
}

interface ChapterReaderProps {
  chapter: Chapter
  onBack: () => void
}

const RedTriangle: React.FC<{
  cues: CueInfo[]
  onHover: (cues: CueInfo[], event: React.MouseEvent) => void
  onLeave: () => void
}> = ({ cues, onHover, onLeave }) => {
  const getTriangleColor = () => {
    if (cues.length === 1) {
      switch (cues[0].type) {
        case 'vfx': return 'text-purple-500 hover:text-purple-400'
        case 'sound': return 'text-green-500 hover:text-green-400'
        case 'image': return 'text-blue-500 hover:text-blue-400'
        default: return 'text-red-500 hover:text-red-400'
      }
    }
    return 'text-yellow-500 hover:text-yellow-400'
  }

  return (
    <span
      className={`inline-block mx-0.5 cursor-pointer transition-all duration-200 transform hover:scale-110 ${getTriangleColor()}`}
      onMouseEnter={(e) => onHover(cues, e)}
      onMouseLeave={onLeave}
    >
      ▲
    </span>
  )
}

const ChapterReader: React.FC<ChapterReaderProps> = ({ chapter, onBack }) => {
  // All hooks must be called in the same order every time
  const [content, setContent] = useState<string>('')
  const [showScrollMessage, setShowScrollMessage] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hoveredCue, setHoveredCue] = useState<CueInfo[] | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  
  // Viewport-based text management
  const [textLines, setTextLines] = useState<string[]>([])
  const [maxRevealedLine, setMaxRevealedLine] = useState(0)
  const [maxRevealedChar, setMaxRevealedChar] = useState(0)
  const [visibleLines, setVisibleLines] = useState<{lineIndex: number, text: string, revealedChars: number}[]>([])
  const [viewportStartLine, setViewportStartLine] = useState(0)
  
  // Hypher initialization
  const [hypher, setHypher] = useState<any>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)

  // Always call these hooks - they must be called every render
  const { scrollYProgress } = useScroll()
  // Ultra slow scroll for letter-by-letter reveal
  const textProgress = useTransform(scrollYProgress, [0, 0.99], [0, 1])
  const backgroundOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.01], [1, 0])

  // All useEffect hooks
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const loadChapterContent = async () => {
      setLoading(true)
      try {
        // Initialize Hypher with Spanish patterns
        const hypherInstance = new Hypher(spanish)
        setHypher(hypherInstance)
        console.log('🔤 Hypher initialized for Spanish')
        
        const response = await fetch(`/api/entities/chapter/${chapter.id}`)
        if (response.ok) {
          const result = await response.json()
          const rawContent = result.data?.content || 'Contenido no disponible'
          setContent(rawContent)
          
          // Split content into lines for viewport management
          const lines = rawContent.replace(/\\n\\n/g, '\n\n').split('\n')
          setTextLines(lines)
          console.log('📄 Content loaded:', { totalLines: lines.length, totalChars: rawContent.length })
        } else {
          setContent('Error al cargar el contenido del capítulo')
          setTextLines(['Error al cargar el contenido del capítulo'])
        }
      } catch (error) {
        console.error('Error loading chapter content:', error)
        setContent('Error al cargar el contenido del capítulo')
        setTextLines(['Error al cargar el contenido del capítulo'])
      } finally {
        setLoading(false)
      }
    }

    loadChapterContent()
  }, [chapter.id])

  useEffect(() => {
    if (!content || loading || !isMounted || textLines.length === 0) return

    const unsubscribe = textProgress.on("change", (progress) => {
      // Calculate total characters revealed based on progress
      const totalChars = content.length
      const targetCharIndex = Math.floor(progress * totalChars)
      
      // Find which line and character we should reveal up to
      let charCount = 0
      let targetLine = 0
      let targetCharInLine = 0
      
      for (let i = 0; i < textLines.length; i++) {
        const lineLength = textLines[i].length + 1 // +1 for newline
        if (charCount + lineLength > targetCharIndex) {
          targetLine = i
          targetCharInLine = targetCharIndex - charCount
          break
        }
        charCount += lineLength
      }
      
      // Allow scroll up to retract text (bidirectional reveal)
      setMaxRevealedLine(targetLine)
      setMaxRevealedChar(targetCharInLine)
      
      // Calculate visible lines (viewport culling)
      const linesPerViewport = 5 // Show ~5 lines at a time
      const currentRevealedLine = targetLine
      const startLine = Math.max(0, currentRevealedLine - linesPerViewport + 1)
      const endLine = Math.min(textLines.length - 1, currentRevealedLine)
      
      setViewportStartLine(startLine)
      
      // Build visible lines with their reveal state
      const newVisibleLines = []
      for (let i = startLine; i <= endLine; i++) {
        const line = textLines[i]
        let revealedChars = 0
        
        if (i < targetLine) {
          // Fully revealed line
          revealedChars = line.length
        } else if (i === targetLine) {
          // Partially revealed line (current reveal position)
          revealedChars = Math.min(targetCharInLine, line.length)
        }
        // else: not revealed yet (revealedChars = 0)
        
        newVisibleLines.push({
          lineIndex: i,
          text: line,
          revealedChars
        })
      }
      
      setVisibleLines(newVisibleLines)
      
      console.log('🔄 Viewport update:', {
        progress: progress.toFixed(3),
        targetLine,
        targetChar: targetCharInLine,
        currentRevealedLine: targetLine,
        visibleRange: `${startLine}-${endLine}`,
        visibleLinesCount: newVisibleLines.length,
        direction: progress > 0.5 ? '⬇️ down' : '⬆️ up'
      })
    })
    return unsubscribe
  }, [textProgress, content, loading, isMounted, textLines, maxRevealedLine, maxRevealedChar])

  // Hyphenation function for natural syllable breaks (without visual dots)
  const applyHyphenation = (text: string): string => {
    if (!hypher || !text) return text
    
    try {
      // Use Hypher to get hyphenated text with soft hyphens for natural breaks
      return hypher.hyphenateText(text)
    } catch (error) {
      console.warn('Hyphenation error:', error)
      return text
    }
  }

  // No auto-scroll - let the user control text reveal with scroll direction
  // Scroll down = reveal more text, Scroll up = hide text (retrocede)

  useEffect(() => {
    if (loading || !isMounted) return
    
    const timer = setTimeout(() => {
      if (!hasScrolled) setShowScrollMessage(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hasScrolled, loading, isMounted])

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

  // Event handlers
  const handleCueHover = (cues: CueInfo[], event: React.MouseEvent) => {
    setHoveredCue(cues)
    setMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleCueLeave = () => {
    setHoveredCue(null)
  }

  // Parsing functions
  const parseCues = (text: string) => {
    const cueRegex = /\[cue:([^|]+)\|([^|]+)(?:\|([^\]]+))?\]/g
    const cues: Array<{ index: number; cue: CueInfo }> = []
    let match

    while ((match = cueRegex.exec(text)) !== null) {
      const [fullMatch, type, effect, params = ''] = match
      const cueInfo: CueInfo = {
        type: type as 'vfx' | 'sound' | 'image',
        effect,
        params: {},
        originalCode: fullMatch
      }

      if (params) {
        params.split('|').forEach(param => {
          const [key, value] = param.split('=')
          if (key && value) {
            cueInfo.params[key.trim()] = value.trim()
          }
        })
      }

      cues.push({ index: match.index, cue: cueInfo })
    }

    return cues
  }

  const groupConsecutiveCues = (cues: Array<{ index: number; cue: CueInfo }>) => {
    if (cues.length === 0) return []

    const groups: Array<{ index: number; cues: CueInfo[] }> = []
    let currentGroup: CueInfo[] = [cues[0].cue]
    let currentIndex = cues[0].index

    for (let i = 1; i < cues.length; i++) {
      const prevCueEnd = cues[i - 1].index + cues[i - 1].cue.originalCode.length
      const currentCueStart = cues[i].index
      const textBetween = content.slice(prevCueEnd, currentCueStart).trim()

      if (textBetween === '') {
        currentGroup.push(cues[i].cue)
      } else {
        groups.push({ index: currentIndex, cues: [...currentGroup] })
        currentGroup = [cues[i].cue]
        currentIndex = cues[i].index
      }
    }

    groups.push({ index: currentIndex, cues: currentGroup })
    return groups
  }

  // Viewport-based text display - only renders visible lines for performance
  const ViewportText = () => {
    return (
      <div className="space-y-4">
        {visibleLines.map((lineData, index) => {
          const { lineIndex, text, revealedChars } = lineData
          const revealedText = text.slice(0, revealedChars)
          const isCurrentRevealLine = lineIndex === maxRevealedLine
          const hasRevealedText = revealedChars > 0
          
          return (
            <div key={lineIndex} className="leading-relaxed">
              {/* Apply hyphenation to the entire revealed text for natural breaks */}
              <span>
                {applyHyphenation(revealedText)}
              </span>
              
              {/* Show cursor on the current reveal line at the end of revealed text */}
              {isCurrentRevealLine && hasRevealedText && (
                <motion.span
                  className="inline-block w-1 h-8 bg-purple-400"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{ marginLeft: '1px' }}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }
  
  // Enhanced cue rendering that works with letter-by-letter
  const renderTextWithCues = (text: string) => {
    const cues = parseCues(text)
    const groupedCues = groupConsecutiveCues(cues)
    
    if (groupedCues.length === 0) {
      return <span>{text}</span>
    }

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // Remove all cue codes first
    let cleanText = text.replace(/\[cue:[^\]]+\]/g, '')
    
    // Calculate positions in clean text
    const cleanCuePositions: Array<{ index: number; cues: CueInfo[] }> = []
    let offset = 0
    
    groupedCues.forEach(group => {
      // Find where this group should be in the clean text
      const beforeCue = text.slice(0, group.index)
      const cleanBeforeCue = beforeCue.replace(/\[cue:[^\]]+\]/g, '')
      cleanCuePositions.push({
        index: cleanBeforeCue.length,
        cues: group.cues
      })
    })

    cleanCuePositions.forEach((group, i) => {
      // Add text before this cue group
      if (group.index > lastIndex) {
        parts.push(cleanText.slice(lastIndex, group.index))
      }
      
      // Add the cue marker
      parts.push(
        <RedTriangle
          key={`cue-${i}`}
          cues={group.cues}
          onHover={handleCueHover}
          onLeave={handleCueLeave}
        />
      )
      
      lastIndex = group.index
    })

    // Add remaining text
    if (lastIndex < cleanText.length) {
      parts.push(cleanText.slice(lastIndex))
    }

    return <>{parts}</>
  }

  // Render logic - no early returns after hooks
  let content_to_render

  if (!isMounted) {
    content_to_render = (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  } else if (loading) {
    content_to_render = (
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
  } else {
    content_to_render = (
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
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="hidden sm:inline">Volver a la Biblioteca</span>
                </button>
                
                <div className="flex items-center gap-3">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h1 className="text-lg font-bold">{chapter.title}</h1>
                    <p className="text-sm text-gray-400">Episodio {chapter.episode} • {chapter.duration}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="hidden md:block max-w-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-sm text-gray-300 line-clamp-2">{chapter.synopsis}</p>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Background Image */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{ opacity: backgroundOpacity }}
        >
          <img
            src={chapter.image}
            alt={chapter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        {/* Spacer to create ultra-long scroll height for letter-by-letter reading */}
        <div className="h-[2000vh]" />
        
        {/* Fixed Text Container - Growing Upward */}
        <div className="fixed inset-x-0 bottom-20 z-10 flex justify-center pointer-events-none">
          <div className="w-full max-w-4xl mx-auto px-6 pointer-events-auto">
            <motion.div 
              className="w-full bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
              style={{
                minHeight: '200px',
                maxHeight: '70vh'
              }}
              animate={{
                height: 'auto'
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut'
              }}
            >
              <div 
                ref={textContainerRef}
                className="prose prose-xl prose-invert max-w-none overflow-hidden" 
                style={{ 
                  maxHeight: 'calc(70vh - 4rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
              >
                <div 
                  className="text-white text-2xl md:text-3xl lg:text-4xl leading-relaxed"
                  style={{
                    hyphens: 'auto',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    textAlign: 'justify'
                  }}
                  lang="es"
                >
                  <ViewportText />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicators */}
        <motion.div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 mb-4"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 text-white" />
          </motion.div>
          
          {showScrollMessage && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <MousePointer className="h-4 w-4" />
                  <span>Desplázate para continuar la historia</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Indicator */}
        <div className="fixed top-20 right-6 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                  style={{ scaleX: textProgress, transformOrigin: "left" }}
                />
              </div>
              <motion.span>
                {Math.round(textProgress.get() * 100)}%
              </motion.span>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {textProgress.get() > 0.95 && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center pointer-events-auto bg-black/90 backdrop-blur-lg rounded-3xl p-12 border-2 border-white/30 shadow-2xl max-w-2xl mx-4">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ¡Capítulo Completado!
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Has terminado de leer "{chapter.title}"
                </p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  Volver a la Biblioteca
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tooltip */}
        {hoveredCue && (
          <div
            className="fixed z-[100] bg-black/90 backdrop-blur-md text-white p-4 rounded-lg border border-white/20 shadow-xl max-w-sm pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 10,
              transform: 'translateY(-100%)'
            }}
          >
            {hoveredCue.length === 1 ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                    {hoveredCue[0].type}
                  </span>
                </div>
                <div className="text-sm font-medium mb-1">{hoveredCue[0].effect}</div>
                {Object.keys(hoveredCue[0].params).length > 0 && (
                  <div className="text-xs text-gray-400 mb-2">
                    {Object.entries(hoveredCue[0].params).map(([key, value]) => (
                      <div key={key}>{key}: {value}</div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 font-mono">
                  {hoveredCue[0].originalCode}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium mb-3">
                  {hoveredCue.length} efectos en este punto
                </div>
                <div className="space-y-3">
                  {hoveredCue.map((cue, index) => (
                    <div key={index} className="border-l-2 border-purple-400 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wide">
                          {cue.type}
                        </span>
                      </div>
                      <div className="text-sm font-medium mb-1">{cue.effect}</div>
                      {Object.keys(cue.params).length > 0 && (
                        <div className="text-xs text-gray-400 mb-1">
                          {Object.entries(cue.params).map(([key, value]) => (
                            <div key={key}>{key}: {value}</div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 font-mono">
                        {cue.originalCode}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return content_to_render
}

export default ChapterReader
