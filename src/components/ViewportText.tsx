"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { applyHyphenation } from '../utils/hyphenation'
import type { CueInfo } from '../utils/cues'
import { parseCues, groupConsecutiveCues } from '../utils/cues'

export type VisibleLine = { lineIndex: number; text: string; revealedChars: number }

interface ViewportTextProps {
  visibleLines: VisibleLine[]
  maxRevealedLine: number
  onCueHover?: (cues: CueInfo[], event: React.MouseEvent) => void
  onCueLeave?: () => void
}

const ViewportText: React.FC<ViewportTextProps> = ({ visibleLines, maxRevealedLine, onCueHover, onCueLeave }) => {
  // Carry-over for cue groups that couldn't anchor in the previous line
  let carryCues: CueInfo[] | null = null
  const renderWithCueMarkers = (revealedText: string) => {
    // Before anything else, if we have a carry-over group from previous line, try anchoring now
    const isLetter = (ch: string) => /\p{L}/u.test(ch)
    const nodes: React.ReactNode[] = []

    let processed = revealedText
    // Hide partial trailing cue start (e.g., "[cue:..." without closing "]")
    const lastOpen = processed.lastIndexOf('[cue:')
    const lastClose = processed.lastIndexOf(']')
    processed = lastOpen > -1 && lastOpen > lastClose ? processed.slice(0, lastOpen) : processed

    if (carryCues) {
      // Skip leading stray brackets
      let i = 0
      while (i < processed.length && processed[i] === ']') i++
      // Find first alphabetic letter in this line
      let firstIdx = i
      while (firstIdx < processed.length && !isLetter(processed[firstIdx])) firstIdx++
      if (firstIdx < processed.length) {
        // Render any text before the anchor (sanitize spacing/punctuation)
        const preRaw = processed.slice(0, firstIdx)
        const pre = preRaw
          .replace(/\]/g, '')
          .replace(/\s+([.,;:!?…])/g, '$1')
          .replace(/[ \t]{2,}/g, ' ')
        if (pre) nodes.push(<span key={`carry-pre`}>{applyHyphenation(pre)}</span>)
        const title = carryCues.length === 1
          ? `${carryCues[0].type.toUpperCase()}: ${carryCues[0].effect}`
          : carryCues.map(c => `${c.type.toUpperCase()}: ${c.effect}`).join(' • ')
        const handleEnter = (e: React.MouseEvent) => { onCueHover?.(carryCues!, e) }
        const handleLeave = () => { onCueLeave?.() }
        // Anchor triangle over this first letter
        nodes.push(
          <span key={`carry-a`} className="relative inline-block" title={title} aria-label={title}
                onMouseEnter={handleEnter} onMouseMove={handleEnter} onMouseLeave={handleLeave}>
            <span
              className="absolute left-1/2 text-[9px] leading-none text-red-500/80 select-none"
              style={{ transform: 'translate(-50%, calc(-100% + 1px))' }}
            >
              ▼
            </span>
            <span>{processed[firstIdx]}</span>
          </span>
        )
        // Advance processed past the anchor char and clear carry
        processed = processed.slice(firstIdx + 1)
        carryCues = null
      }
      // If we couldn't place it (empty line), leave carryCues for next line
    }

    // Parse complete cues within this (possibly modified) segment
    const parsed = parseCues(processed)
    if (parsed.length === 0) {
      if (processed) nodes.push(<span key={0}>{applyHyphenation(processed)}</span>)
      return nodes
    }
    let cursor = 0
    const groups = groupConsecutiveCues(parsed, processed)

    groups.forEach(({ index, cues }, gIdx) => {
      // Determine end of cues first to peek the next visible character
      let scanPos = index
      cues.forEach(c => { scanPos += c.originalCode.length })
      let nextIdx = scanPos
      // Skip any stray ']' and whitespace after cues to inspect the next significant char
      while (nextIdx < processed.length && (processed[nextIdx] === ']' || /\s/.test(processed[nextIdx]))) nextIdx++
      const nextCharAfterCues = processed[nextIdx] || ''

      // Text before the group of cues (sanitize spacing/punctuation)
      const preRaw = processed.slice(cursor, index)
      let pre = preRaw
        .replace(/\]/g, '')
        .replace(/\s+([.,;:!?…])/g, '$1')
        .replace(/[ \t]{2,}/g, ' ')
      // If pre ends with space and the next char after cues is punctuation, trim trailing space
      if (/[\s\t]$/.test(pre) && /[.,;:!?…]/.test(nextCharAfterCues)) {
        pre = pre.replace(/\s+$/, '')
      }
      if (pre) nodes.push(<span key={`t-${gIdx}`}>{applyHyphenation(pre)}</span>)

      // Now advance cursor to just after the cues
      cursor = scanPos

      // Drop one redundant space after the cue group if pre already ended with space
      const preEndsWithSpace = pre.length > 0 && /\s$/.test(pre)
      if (preEndsWithSpace && processed[cursor] === ' ') {
        cursor += 1
      }

      // Remove any stray closing brackets that may remain after cue parsing
      while (cursor < processed.length && processed[cursor] === ']') {
        cursor++
      }

      // Find first alphabetical letter (skip spaces, newlines and punctuation like '.') after cues
      let anchorIdx = cursor
      while (anchorIdx < processed.length && !isLetter(processed[anchorIdx])) {
        anchorIdx++
      }

      // Render preserved spaces/punctuation between cue and anchor, but sanitize
      const betweenRaw = processed.slice(cursor, anchorIdx)
      const between = betweenRaw
        .replace(/\]/g, '') // drop stray closing brackets
        .replace(/\s+([.,;:!?…])/g, '$1') // no space before punctuation
        .replace(/[ \t]{2,}/g, ' ') // collapse multiple spaces
      if (between) nodes.push(<span key={`sp-${gIdx}`}>{applyHyphenation(between)}</span>)

      // Build title from grouped cues
      const title = cues.length === 1
        ? `${cues[0].type.toUpperCase()}: ${cues[0].effect}`
        : cues.map(c => `${c.type.toUpperCase()}: ${c.effect}`).join(' • ')

      const handleEnter = (e: React.MouseEvent) => { onCueHover?.(cues, e) }
      const handleLeave = () => { onCueLeave?.() }

      if (anchorIdx < processed.length) {
        // Wrap the anchor character and place a small triangle above it
        const anchorChar = processed[anchorIdx]
        nodes.push(
          <span key={`a-${gIdx}`} className="relative inline-block" title={title} aria-label={title}
                onMouseEnter={handleEnter} onMouseMove={handleEnter} onMouseLeave={handleLeave}>
            <span
              className="absolute left-1/2 text-[9px] leading-none text-red-500/80 select-none"
              style={{ transform: 'translate(-50%, calc(-100% + 1px))' }}
            >
              ▼
            </span>
            <span>{anchorChar}</span>
          </span>
        )
        cursor = anchorIdx + 1
      } else {
        // No character to anchor on (e.g., end of line) — carry to next line to honor cross-line rule
        // We've already rendered the 'between' segment up to anchorIdx; advance cursor to avoid duplicating in tail
        carryCues = cues
        cursor = anchorIdx
      }
    })

    // Tail after last group
    const tailRaw = processed.slice(cursor)
    const tail = tailRaw
      .replace(/\]/g, '')
      .replace(/\s+([.,;:!?…])/g, '$1')
      .replace(/[ \t]{2,}/g, ' ')
    if (tail) nodes.push(<span key={`t-end`}>{applyHyphenation(tail)}</span>)
    return nodes
  }

  return (
    <div className="space-y-4">
      {visibleLines.map(({ lineIndex, text, revealedChars }) => {
        const revealedText = text.slice(0, revealedChars)
        const isCurrentRevealLine = lineIndex === maxRevealedLine
        const hasRevealedText = revealedChars > 0

        return (
          <div key={lineIndex} className="leading-relaxed">
            <span>{renderWithCueMarkers(revealedText)}</span>
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

export default ViewportText
