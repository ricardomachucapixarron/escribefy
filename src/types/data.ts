// Tipos para la estructura de datos de NovelCraft

export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  status: 'active' | 'inactive'
  plan: 'free' | 'premium' | 'pro'
  joinedAt: string
  lastActive: string
  projectsCount: number
  totalWords: number
  profilePath: string
}

export interface UserProfile {
  user: User
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      reminders: boolean
    }
  }
  writingStats: {
    dailyGoal: number
    currentStreak: number
    longestStreak: number
    totalSessions: number
    averageWordsPerSession: number
    favoriteWritingTime: string
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    unlockedAt: string
    icon: string
  }>
}

export interface Organization {
  id: string
  name: string
  type: 'corporation' | 'government' | 'faction' | 'guild' | 'other'
  description?: string
  portfolio?: PortfolioItem[]
  leadership?: {
    leader?: string
    structure?: string
  }
  goals?: string[]
  resources?: string[]
  influence?: string
  relationships?: Array<{
    organizationId: string
    relationship: 'ally' | 'enemy' | 'neutral' | 'rival'
    description: string
  }>
  tags?: string[]
}

export interface Project {
  id: string
  title: string
  genre: string
  status: 'planning' | 'writing' | 'editing' | 'completed' | 'published'
  description: string
  targetWordCount: number
  currentWordCount: number
  createdAt: string
  lastModified: string
  coverImage?: string
  tags: string[]
  chapters: Chapter[]
  characters: Character[]
  locations: Location[]
  plotlines: Plotline[]
  organizations?: Organization[]
  themes: string[]
  settings: {
    autoSave: boolean
    backupFrequency: number
    collaborationEnabled: boolean
  }
}

export interface Chapter {
  id: string
  title: string
  synopsis: string
  status: 'planned' | 'writing' | 'completed' | 'editing'
  wordCount: number
  mood: string
  themes: string[]
  keyEvents: string[]
  lastModified: string
  content: string
  notes?: string
  scenes: Scene[]
  imageAssets: ImageAsset[]
  audioAssets: AudioAsset[]
  mediaMarkers: MediaMarker[]
}

export interface Scene {
  id: string
  title: string
  description: string
  location: string
  characters: string[]
  mood: string
  purpose: string
  conflict: string
  outcome: string
  wordCount: number
  status: 'planned' | 'writing' | 'completed'
  notes?: string
}

export interface PortfolioItem {
  id: string
  filename: string
  path: string
  description: string
  createdAt: string
  tags: string[]
  mood: string
  context: string
  shotType?: 'close-up' | 'medium-shot' | 'full-body' | 'wide-shot' | 'extreme-close-up' | 'establishing-shot'
  angle?: 'front' | 'profile' | 'three-quarter' | 'back' | 'high-angle' | 'low-angle' | 'bird-eye' | 'worm-eye'
  composition?: 'portrait' | 'landscape' | 'square' | 'panoramic'
  lighting?: 'natural' | 'dramatic' | 'soft' | 'harsh' | 'backlit' | 'studio' | 'ambient'
}

export interface Character {
  id: string
  name: string
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor'
  description?: string
  age?: number
  occupation?: string
  personality?: string[]
  groupings?: string[]
  portfolio?: PortfolioItem[]
  appearance?: {
    height?: string
    build?: string
    hairColor?: string
    eyeColor?: string
    distinctiveFeatures?: string[]
  }
  background?: string
  motivations?: string[]
  relationships?: Array<{
    characterId: string
    relationship: string
    description: string
  }>
  arc?: {
    startingPoint: string
    development: string
    climax: string
    resolution: string
  }
  avatar?: string
  voiceNotes?: string[]
  tags?: string[]
}

export interface Location {
  id: string
  name: string
  type: 'city' | 'building' | 'room' | 'landscape' | 'other'
  description?: string
  portfolio?: PortfolioItem[]
  geography?: {
    coordinates?: { lat: number; lng: number }
    climate?: string
    terrain?: string
  }
  culture?: {
    population?: number
    language?: string[]
    customs?: string[]
  }
  significance?: string
  atmosphere?: string
  keyFeatures?: string[]
  connectedLocations?: string[]
  image?: string
  mapCoordinates?: {
    x: number
    y: number
  }
  tags?: string[]
}



export interface Plotline {
  id: string
  title: string
  type: 'main' | 'subplot' | 'character-arc' | 'mystery' | 'romance'
  description: string
  status: 'active' | 'resolved' | 'abandoned'
  keyEvents: Array<{
    chapterId: string
    event: string
    importance: 'high' | 'medium' | 'low'
  }>
  characters: string[]
  resolution?: string
}

export interface ImageAsset {
  id: string
  filename: string
  path: string
  description: string
  tags: string[]
  usedInChapters: string[]
  createdAt: string
  size: {
    width: number
    height: number
    fileSize: number
  }
}

export interface AudioAsset {
  id: string
  filename: string
  path: string
  description: string
  type: 'music' | 'sfx' | 'voice' | 'ambient'
  duration: number
  tags: string[]
  usedInChapters: string[]
  createdAt: string
}

export interface MediaMarker {
  id: string
  position: string
  trigger: 'scroll' | 'click' | 'time' | 'auto'
  name: string
  description: string
  mediaType: 'image' | 'audio' | 'video' | 'effect'
  mediaId?: string
  settings: {
    autoplay?: boolean
    loop?: boolean
    volume?: number
    fadeIn?: number
    fadeOut?: number
    delay?: number
  }
  conditions?: Array<{
    type: 'user-choice' | 'story-state' | 'time-of-day'
    value: string
  }>
}

export interface UsersIndex {
  users: User[]
  stats: {
    totalUsers: number
    activeUsers: number
    premiumUsers: number
    freeUsers: number
    totalProjects: number
    totalWords: number
    lastUpdated: string
  }
}

// Tipos para respuestas de API
export interface DataResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

// Tipos para filtros y búsquedas
export interface ProjectFilter {
  status?: Project['status'][]
  genre?: string[]
  tags?: string[]
  wordCountRange?: {
    min: number
    max: number
  }
  dateRange?: {
    from: string
    to: string
  }
}

export interface ChapterFilter {
  status?: Chapter['status'][]
  mood?: string[]
  themes?: string[]
  wordCountRange?: {
    min: number
    max: number
  }
}
