"use client"

export interface Character {
  id: string
  name: string
  age?: number
  physicalDescription?: string
  narrative_arc?: string
  motivations?: string
  fears?: string
  relationships?: string[]
  biography?: string
  [key: string]: any
}

export interface Location {
  id: string
  name: string
  description?: string
  history?: string
  atmosphere?: string
  plotRelevance?: string
  imageUrl?: string
}

export interface Chapter {
  id: string
  title: string
  summary?: string
  content?: string
  pulses?: ChapterPulse[]
  order: number
}

export interface ChapterPulse {
  id: string
  objective: string
  conflict: string
  result: string
}

export interface NovelProject {
  id: string
  title: string
  genre?: string
  description?: string
  narratorType?: string
  narratorVoice?: string
  characters: Character[]
  locations: Location[]
  chapters: Chapter[]
  worldBuilding?: {
    magicSystems?: string
    technology?: string
    politicalStructures?: string
    cultures?: string
    timeline?: string
    lore?: string
  }
  wordCount: number
  structure?: string
  createdAt: Date
  lastModified: Date
}
