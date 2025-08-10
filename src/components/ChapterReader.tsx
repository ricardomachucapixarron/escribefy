'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ChevronDown, MousePointer } from 'lucide-react'
import { gsap } from 'gsap'
import { parseCues as parseCuesUtil } from '../utils/cues'
import ViewportText from './ViewportText'
import { flash as fxFlash, vignette as fxVignette, particlesBurst as fxParticlesBurst, rippleGlobal as fxRippleGlobal, confettiBurst as fxConfettiBurst, zoomPulse as fxZoomPulse, scream as fxScream } from '../effects/global'
import { breeze5s as wxBreeze5s, sandstorm5s as wxSandstorm5s, rain5s as wxRain5s } from '../effects/weather'
import type { BreezeOptions as WxBreezeOptions, SandstormOptions as WxSandstormOptions, RainOptions as WxRainOptions } from '../effects/weather'
import { motoRide5s as fxMotoRide5s } from '../effects/moto'
import type { MotoRideOptions as FxMotoRideOptions } from '../effects/moto'

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
  
  // Global cues positions (in raw content) and triggers
  const [allCues, setAllCues] = useState<Array<{ start: number; end: number; cue: CueInfo }>>([])
  const triggeredCuesRef = useRef<Set<number>>(new Set())

  // Mapping to ignore cues during reveal
  const nonCueSegmentsRef = useRef<Array<{ start: number; end: number; prefix: number }>>([])
  const totalVisibleCharsRef = useRef<number>(0)
  const lineStartOffsetsRef = useRef<number[]>([])
  const prevTargetRawIndexRef = useRef<number | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<HTMLDivElement>(null)
  const isEffectRunningRef = useRef<boolean>(false)
  const globalFxRef = useRef<HTMLDivElement>(null)
  const [selectedFx, setSelectedFx] = useState<string>('shake')
  const [fxParams, setFxParams] = useState<{ duration: number; opacity: number; intensity: number; count: number }>({
    duration: 0.5,
    opacity: 0.25,
    intensity: 0.2,
    count: 80,
  })
  const [fxMenuOpen, setFxMenuOpen] = useState(false)
  const [hoveredFxKey, setHoveredFxKey] = useState<string | null>(null)
  const fxMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fxMenuRef.current && !fxMenuRef.current.contains(e.target as Node)) {
        setFxMenuOpen(false)
        setHoveredFxKey(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        const response = await fetch(`/api/entities/chapter/${chapter.id}`)
        if (response.ok) {
          const result = await response.json()
          const rawContent = result.data?.content || 'Contenido no disponible'
          // Normalize escaped newlines ("\n") to real newlines so they render correctly
          const normalizedContent = rawContent.replace(/\\n/g, '\n')
          setContent(normalizedContent)
          
          // Split content into lines for viewport management
          const lines = normalizedContent.split('\n')
          setTextLines(lines)
          console.log('📄 Content loaded:', { totalLines: lines.length, totalChars: normalizedContent.length })

          // Compute all cues (global positions over the raw content)
          try {
            const found = parseCuesUtil(normalizedContent)
            const mapped = found.map(({ index, cue }) => ({
              start: index,
              end: index + cue.originalCode.length,
              cue
            }))
            setAllCues(mapped)
            triggeredCuesRef.current.clear()
            console.log('🎯 Cues detected:', mapped.length)

            // Build non-cue segments for reveal mapping (skip cue code during scroll)
            const ranges = [...mapped].sort((a, b) => a.start - b.start)
            const merged: Array<{ start: number; end: number }> = []
            for (const r of ranges) {
              if (merged.length === 0 || r.start > merged[merged.length - 1].end) {
                merged.push({ start: r.start, end: r.end })
              } else {
                merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, r.end)
              }
            }
            const nonCueSegments: Array<{ start: number; end: number; prefix: number }> = []
            let last = 0
            let prefix = 0
            for (const m of merged) {
              if (last < m.start) {
                const segLen = m.start - last
                nonCueSegments.push({ start: last, end: m.start, prefix })
                prefix += segLen
              }
              last = m.end
            }
            if (last < normalizedContent.length) {
              const segLen = normalizedContent.length - last
              nonCueSegments.push({ start: last, end: normalizedContent.length, prefix })
              prefix += segLen
            }
            nonCueSegmentsRef.current = nonCueSegments
            totalVisibleCharsRef.current = prefix

            // Precompute line start offsets for raw-index → (line,char) mapping
            const lineStarts: number[] = []
            let off = 0
            for (let i = 0; i < lines.length; i++) {
              lineStarts.push(off)
              off += lines[i].length + 1 // +1 for newline
            }
            lineStartOffsetsRef.current = lineStarts
          } catch (e) {
            console.warn('Cue parsing error:', e)
            setAllCues([])
            // Fallback mapping when parsing fails: treat entire content as visible
            nonCueSegmentsRef.current = [{ start: 0, end: normalizedContent.length, prefix: 0 }]
            totalVisibleCharsRef.current = normalizedContent.length
            const lineStarts: number[] = []
            let off = 0
            for (let i = 0; i < lines.length; i++) { lineStarts.push(off); off += lines[i].length + 1 }
            lineStartOffsetsRef.current = lineStarts
          }
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
      // Calculate target VISIBLE characters (ignoring cue codes)
      const totalVisible = totalVisibleCharsRef.current || content.length
      const clampedProgress = Math.max(0, Math.min(1, progress))
      const targetVisibleIndex = Math.floor(clampedProgress * totalVisible)

      // Map visible index → raw index using non-cue segments
      const segments = nonCueSegmentsRef.current
      let targetRawIndex = 0
      if (segments.length === 0) {
        targetRawIndex = Math.floor(clampedProgress * content.length)
      } else {
        // Find segment containing this visible index
        let seg = segments[segments.length - 1]
        for (let i = 0; i < segments.length; i++) {
          if (targetVisibleIndex < segments[i].prefix + (segments[i].end - segments[i].start)) {
            seg = segments[i]
            break
          }
        }
        const withinSeg = targetVisibleIndex - seg.prefix
        targetRawIndex = seg.start + Math.max(0, Math.min(withinSeg, seg.end - seg.start))
      }

      // Find which line and character we should reveal up to
      const lineStarts = lineStartOffsetsRef.current.length ? lineStartOffsetsRef.current : (() => {
        const ls: number[] = []
        let o = 0
        for (let i = 0; i < textLines.length; i++) { ls.push(o); o += textLines[i].length + 1 }
        return ls
      })()
      let targetLine = textLines.length - 1
      let targetCharInLine = textLines[targetLine]?.length || 0
      for (let i = 0; i < lineStarts.length; i++) {
        const start = lineStarts[i]
        const end = start + (textLines[i]?.length || 0) + 1
        if (targetRawIndex < end) {
          targetLine = i
          targetCharInLine = Math.min(textLines[i].length, targetRawIndex - start)
          break
        }
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
      
      // Trigger effects for cues that just became fully revealed (once)
      // Only when crossing their raw end index, and not on the very first update
      if (allCues.length > 0) {
        const prev = prevTargetRawIndexRef.current
        // Initialize without triggering at progress 0
        if (prev === null) {
          prevTargetRawIndexRef.current = targetRawIndex
        } else {
          for (const c of allCues) {
            if (prev < c.end && c.end <= targetRawIndex && !triggeredCuesRef.current.has(c.start)) {
              triggeredCuesRef.current.add(c.start)
              triggerCueEffect(c.cue)
            }
          }
          prevTargetRawIndexRef.current = targetRawIndex
        }
      }
      
      console.log('🔄 Viewport update:', {
        progress: progress.toFixed(3),
        targetLine,
        targetChar: targetCharInLine,
        targetRawIndex,
        targetVisibleIndex,
        currentRevealedLine: targetLine,
        visibleRange: `${startLine}-${endLine}`,
        visibleLinesCount: newVisibleLines.length,
        direction: progress > 0.5 ? '⬇️ down' : '⬆️ up'
      })
    })
    return unsubscribe
  }, [textProgress, content, loading, isMounted, textLines, maxRevealedLine, maxRevealedChar, allCues])

  // Motorcycle ride (duration param) - delegates to effects/moto.ts
  const motoRide = (opts?: FxMotoRideOptions) => {
    fxMotoRide5s(globalFxRef.current, effectRef.current, opts)
  }

  // --- Effects: Minimal screen shake test ---
  const screenShake = () => {
    const el = effectRef.current
    if (!el || isEffectRunningRef.current) return
    isEffectRunningRef.current = true
    gsap.killTweensOf(el)
    gsap.timeline({
      onComplete: () => {
        // Reset transform to avoid any lingering offsets and allow reading to continue
        gsap.set(el, { clearProps: 'transform' })
        isEffectRunningRef.current = false
      }
    })
      .to(el, { x: -8, rotate: -0.4, duration: 0.06, ease: 'power2.out' })
      .to(el, { x: 8, rotate: 0.4, duration: 0.08, ease: 'power2.out' })
      .to(el, { x: -5, rotate: -0.25, duration: 0.06, ease: 'power2.out' })
      .to(el, { x: 0, rotate: 0, duration: 0.12, ease: 'power2.out' })
  }

  const triggerCueEffect = (cue: CueInfo) => {
    const effectName = (cue.effect || '').toLowerCase()
    if (cue.type === 'vfx') {
      if (/(moto|motorbike|motorcycle)/.test(effectName)) {
        const d = Number(cue.params?.duration)
        const i = Number(cue.params?.intensity)
        const s = Number(cue.params?.speed)
        const night = String(cue.params?.night || '').toLowerCase() === 'true'
        motoRide({
          duration: isNaN(d) ? 5 : d,
          intensity: isNaN(i) ? 0.7 : Math.max(0, Math.min(1, i)),
          speed: isNaN(s) ? 1.0 : Math.max(0.4, Math.min(2.5, s)),
          night,
        })
        return
      }
      if (effectName === 'scream' || effectName === 'grito' || effectName === 'shout' || effectName === 'scream2s') {
        const d = Number(cue.params?.duration)
        const i = Number(cue.params?.intensity)
        scream({
          duration: isNaN(d) ? 2 : d,
          intensity: isNaN(i) ? 0.8 : Math.max(0, Math.min(1, i))
        })
        return
      }
      if (effectName === 'sandstorm' || effectName === 'tormenta' || effectName === 'arena' || effectName === 'sandstorm5s') {
        const d = Number(cue.params?.duration)
        const i = Number(cue.params?.intensity)
        sandstorm({
          duration: isNaN(d) ? 5 : d,
          intensity: isNaN(i) ? 0.7 : Math.max(0, Math.min(1, i))
        })
        return
      }
      if (effectName === 'breeze' || effectName === 'brisa' || effectName === 'breeze5s') {
        const d = Number(cue.params?.duration)
        const o = Number(cue.params?.opacity)
        breeze({
          duration: isNaN(d) ? 5 : d,
          opacity: isNaN(o) ? fxParams.opacity : Math.max(0, Math.min(1, o))
        })
        return
      }
      if (effectName === 'rain' || effectName === 'lluvia' || effectName === 'rain5s') {
        const d = Number(cue.params?.duration)
        const i = Number(cue.params?.intensity)
        const w = Number(cue.params?.wind)
        const a = Number((cue.params?.angledeg ?? cue.params?.angleDeg))
        const variant = (cue.params?.variant as WxRainOptions['variant']) || undefined
        rain({
          duration: isNaN(d) ? 5 : d,
          intensity: isNaN(i) ? 0.5 : Math.max(0, Math.min(1, i)),
          wind: isNaN(w) ? 0.4 : Math.max(0, Math.min(2, w)),
          angleDeg: isNaN(a) ? 12 : Math.max(0, Math.min(25, a)),
          variant
        })
        return
      }
      if (effectName === 'flash') {
        const color = cue.params?.color || '#ffffff'
        const o = Number(cue.params?.opacity)
        const d = Number(cue.params?.duration)
        flash({ color, opacity: isNaN(o) ? 0.2 : Math.max(0, Math.min(1, o)), duration: isNaN(d) ? 0.25 : Math.max(0.05, d) })
        return
      }
      if (effectName === 'vignette') {
        const o = Number(cue.params?.opacity)
        const d = Number(cue.params?.duration)
        vignette({ opacity: isNaN(o) ? 0.25 : Math.max(0, Math.min(1, o)), duration: isNaN(d) ? 0.3 : Math.max(0.05, d) })
        return
      }
      if (effectName === 'ripple' || effectName === 'rippleglobal') {
        const d = Number(cue.params?.duration)
        const i = Number(cue.params?.intensity)
        rippleGlobal({ duration: isNaN(d) ? 0.6 : Math.max(0.05, d), intensity: isNaN(i) ? 0.3 : Math.max(0, Math.min(1, i)) })
        return
      }
      if (effectName === 'particlesburst' || effectName === 'particles' || effectName === 'burst') {
        const c = Number(cue.params?.count)
        particlesBurst(isNaN(c) ? 40 : Math.max(1, Math.min(500, c)))
        return
      }
      if (effectName === 'zoompulse' || effectName === 'pulse') {
        // scale param is currently ignored; zoomPulse is a fixed local pulse
        zoomPulse()
        return
      }
      // fallback for other vfx cues
      screenShake()
      return
    }
    // Non-vfx cues: placeholder gentle feedback
    screenShake()
  }


  // --- Global overlay effects (full window) ---
  const flash = (opts?: { color?: string; opacity?: number; duration?: number }) => {
    fxFlash(globalFxRef.current, opts)
  }

  const zoomPulse = () => {
    fxZoomPulse(effectRef.current)
  }

  const glitchLocal = () => {
    const el = effectRef.current
    if (!el) return
    gsap.killTweensOf(el)
    gsap.timeline({ onComplete: () => { gsap.set(el, { clearProps: 'transform,filter' }) } })
     .to(el, { filter: 'saturate(1.5) hue-rotate(20deg) blur(1px)', skewX: 2, duration: 0.06, ease: 'power2.out' })
     .to(el, { filter: 'none', skewX: 0, duration: 0.08, ease: 'power2.in' })
  }

  // Breeze: Global sweep + Local sway (delegates to effects/weather.ts)
  const breeze = (opts?: WxBreezeOptions) => {
    wxBreeze5s(globalFxRef.current, effectRef.current, { opacity: fxParams.opacity, ...(opts || {}) })
  }

  // Heartbeat sequence using zoomPulse in lub-dub rhythm
  const heartbeat = () => {
    const el = effectRef.current
    if (!el) return
    const totalMs = Math.max(0.5, fxParams.duration) * 1000
    const dubGap = 0.12 // seconds between lub and dub
    const restGap = 0.4  // rest between cycles
    const start = performance.now()

    // Ensure no lingering transforms
    gsap.killTweensOf(el)
    const loop = () => {
      if (performance.now() - start >= totalMs) {
        gsap.set(el, { clearProps: 'transform,filter' })
        return
      }
      // Lub
      zoomPulse()
      // Dub shortly after
      gsap.delayedCall(dubGap, () => {
        if (performance.now() - start >= totalMs) return
        zoomPulse()
        // Rest, then next cycle
        gsap.delayedCall(restGap, loop)
      })
    }
    loop()
  }

  // Scream combo: flash + shockwave + vignette pulse + camera shake + local jitter/skew
  const scream = (opts?: { duration?: number; intensity?: number }) => {
    fxScream(globalFxRef.current, effectRef.current, opts)
  }

  // Sandstorm (delegates to effects/weather.ts)
  const sandstorm = (opts?: WxSandstormOptions) => {
    wxSandstorm5s(globalFxRef.current, effectRef.current, opts)
  }

  // Rain variants (delegates to effects/weather.ts)
  const rain = (opts?: WxRainOptions) => {
    wxRain5s(globalFxRef.current, effectRef.current, opts)
  }

  const triggerSelectedFx = () => {
    switch (selectedFx) {
      case 'shake':
        screenShake(); break
      case 'flashWhite':
        flash({ color: '#ffffff', opacity: fxParams.opacity, duration: fxParams.duration }); break
      case 'flashDark':
        flash({ color: '#000000', opacity: fxParams.opacity, duration: fxParams.duration }); break
      case 'zoomPulse':
        zoomPulse(); break
      case 'heartbeat':
        heartbeat(); break
      case 'breeze':
        breeze({ duration: fxParams.duration }); break
      case 'glitch':
        glitchLocal(); break
      case 'vignette':
        vignette({ opacity: fxParams.opacity, duration: fxParams.duration }); break
      case 'particles':
        particlesBurst(fxParams.count); break
      case 'ripple':
        rippleGlobal({ duration: fxParams.duration, intensity: fxParams.intensity }); break
      case 'confetti':
        confettiBurst(fxParams.count); break
      case 'scream':
        scream({ duration: fxParams.duration, intensity: fxParams.intensity }); break
      case 'sandstorm':
        sandstorm({ duration: fxParams.duration, intensity: fxParams.intensity }); break
      case 'rainDrizzle':
        rain({ duration: fxParams.duration, intensity: fxParams.intensity, wind: 0.3, angleDeg: 8, variant: 'drizzle' }); break
      case 'rainDownpour':
        rain({ duration: fxParams.duration, intensity: fxParams.intensity, wind: 0.5, angleDeg: 12, variant: 'downpour' }); break
      case 'rainStorm':
        rain({ duration: fxParams.duration, intensity: fxParams.intensity, wind: 0.7, angleDeg: 15, variant: 'storm' }); break
      case 'motoRide':
        motoRide({ duration: fxParams.duration, intensity: fxParams.intensity, speed: 1 + (fxParams.intensity ?? 0.2) }); break
      default:
        screenShake(); break
    }
  }

  // Global vignette (radial darkening) overlay
  const vignette = (opts?: { opacity?: number; duration?: number }) => {
    fxVignette(globalFxRef.current, opts)
  }

  // Spawn simple colored particles across the screen (no external deps)
  const particlesBurst = (count: number = 50) => {
    fxParticlesBurst(globalFxRef.current, count)
  }

  // Global ripple: centered radial pulse on overlay
  const rippleGlobal = (opts?: { duration?: number; intensity?: number }) => {
    fxRippleGlobal(globalFxRef.current, opts)
  }

  // Canvas-based confetti burst without external deps
  const confettiBurst = (count: number = 120) => {
    fxConfettiBurst(globalFxRef.current, count)
  }

  // Stop all running FX: kill tweens, clear transforms, remove overlays
  const stopAllFx = () => {
    const root = globalFxRef.current
    const card = effectRef.current
    isEffectRunningRef.current = false
    // Stop local card animations
    if (card) {
      gsap.killTweensOf(card)
      gsap.set(card, { clearProps: 'transform,filter' })
    }
    // Stop and cleanup global overlays
    if (root) {
      try { gsap.killTweensOf(root) } catch {}
      // Remove any children/overlays appended by effects
      Array.from(root.querySelectorAll('*')).forEach((n) => {
        try { gsap.killTweensOf(n as any) } catch {}
        ;(n as HTMLElement).remove()
      })
      // Final reset of the overlay root
      gsap.set(root, { display: 'none', clearProps: 'opacity,backgroundColor,backgroundImage' })
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

  // Parsing helpers are provided by src/utils/cues.ts

  

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

        {/* Background Image (consistent with Dashboard) */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{ opacity: backgroundOpacity }}
        >
          <img
            src="/story-images/aethermoor-world-background.png"
            alt="El mundo de Aethermoor"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Spacer to create ultra-long scroll height for letter-by-letter reading */}
        <div className="h-[2000vh]" />
        
        {/* Fixed Text Container - Growing Upward */}
        <div className="fixed inset-x-0 bottom-20 z-10 flex justify-center pointer-events-none">
          <div className="w-full max-w-4xl mx-auto px-6 pointer-events-auto">
            <motion.div 
              ref={effectRef}
              className="w-full bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
              style={{
                minHeight: '200px',
                maxHeight: '70vh',
                willChange: 'transform, filter'
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
                  <ViewportText
                    visibleLines={visibleLines}
                    maxRevealedLine={maxRevealedLine}
                    onCueHover={(cues, e) => {
                      setHoveredCue(cues)
                      setMousePosition({ x: e.clientX, y: e.clientY })
                    }}
                    onCueLeave={() => setHoveredCue(null)}
                  />
                </div>
              </div>
            </motion.div>
            {hoveredCue && (
              <div
                className="fixed z-50 pointer-events-none"
                style={{ left: mousePosition.x + 12, top: mousePosition.y + 12 }}
              >
                <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-md border border-white/20 shadow-lg whitespace-nowrap">
                  {hoveredCue.length === 1
                    ? `${hoveredCue[0].type.toUpperCase()}: ${hoveredCue[0].effect}`
                    : hoveredCue.map(c => `${c.type.toUpperCase()}: ${c.effect}`).join(' • ')}
                </div>
              </div>
            )}
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

        {/* FX Selector (Dev Tool) */}
        <div className="fixed bottom-20 right-6 z-[60] pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-md rounded-xl px-3 py-2 border border-white/30 flex items-center gap-3 text-white shadow-lg">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/80">FX</span>
            {/* Dropdown compacto con submenú (click abre hacia arriba) */}
            <div ref={fxMenuRef} className="relative">
              <button
                onClick={() => setFxMenuOpen(v => !v)}
                className="px-2 py-1 rounded-md border border-white/20 bg-black/40 hover:bg-white/10 text-xs"
              >
                {selectedFx ? `FX: ${selectedFx}` : 'Elegir FX'}
              </button>
              {fxMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 z-[61]">
                  <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-md shadow-lg p-2 min-w-[220px]">
                    <ul className="flex flex-col gap-1">
                      {[
                        { key: 'heartbeat', label: 'Pulsación' },
                        { key: 'breeze', label: 'Brisa' },
                        { key: 'scream', label: 'Grito' },
                        { key: 'sandstorm', label: 'Tormenta de Arena' },
                        { key: 'rainDrizzle', label: 'Lluvia Llovizna' },
                        { key: 'rainDownpour', label: 'Lluvia Aguacero' },
                        { key: 'rainStorm', label: 'Lluvia Tormenta' },
                        { key: 'motoRide', label: 'Moto Ride' },
                      ].map(item => (
                        <li key={item.key} className="relative">
                          <div className="flex items-center">
                            <button
                              onMouseEnter={() => setHoveredFxKey(item.key)}
                              onFocus={() => setHoveredFxKey(item.key)}
                              onClick={() => setSelectedFx(item.key)}
                              className={`flex-1 text-left px-2 py-1 text-xs rounded hover:bg-white/10 ${selectedFx === item.key ? 'ring-1 ring-purple-500' : ''}`}
                            >
                              {item.label}
                            </button>
                            <span className="ml-2 text-xs opacity-60">▶</span>
                          </div>
                          {hoveredFxKey === item.key && (
                            <div className="absolute right-full top-0 mr-2 z-[62]">
                              <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-md shadow-lg p-2 flex flex-col gap-1 min-w-[150px]">
                                <button
                                  className="px-2 py-1 text-xs rounded hover:bg-white/10"
                                  onClick={() => setFxParams(p => ({ ...p, duration: 5 }))}
                                >
                                  5s
                                </button>
                                <button
                                  className="px-2 py-1 text-xs rounded hover:bg-white/10"
                                  onClick={() => setFxParams(p => ({ ...p, duration: 30 }))}
                                >
                                  30s
                                </button>
                                <button
                                  className="px-2 py-1 text-xs rounded hover:bg-white/10"
                                  onClick={() => setFxParams(p => ({ ...p, duration: 600 }))}
                                >
                                  Todo el cap.
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            {/* Params: removidos */}
            <button
              onClick={triggerSelectedFx}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-md border border-white/10"
            >
              Probar
            </button>
            <button
              onClick={stopAllFx}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-sm rounded-md border border-white/10"
              aria-label="Detener efectos"
            >
              Detener
            </button>
          </div>
        </div>

        {/* Global FX Overlay */}
        <div
          ref={globalFxRef}
          className="fixed inset-0 z-[80] pointer-events-none"
          style={{ display: 'none', opacity: 0 }}
        />

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
