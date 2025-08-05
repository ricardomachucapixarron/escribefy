// Hook personalizado para manejar datos de NovelCraft
import { useState, useEffect, useCallback } from 'react'
import type { 
  User, 
  UserProfile, 
  Project, 
  Chapter, 
  UsersIndex,
  DataResponse 
} from '@/types/data'
import {
  loadUsersIndex,
  loadUserProfile,
  loadProject,
  loadChapter,
  loadProjectChapters,
  getProjectStats,
  extractProperNouns,
  formatChapterContent
} from '@/utils/dataLoader'

interface UseNovelDataState {
  // Estado de carga
  loading: boolean
  error: string | null
  
  // Datos
  usersIndex: UsersIndex | null
  currentUser: User | null
  userProfile: UserProfile | null
  currentProject: Project | null
  currentChapter: Chapter | null
  chapters: Chapter[]
  
  // Estadísticas
  projectStats: {
    totalWords: number
    totalChapters: number
    completedChapters: number
    averageWordsPerChapter: number
    lastModified: string
  } | null
}

interface UseNovelDataActions {
  // Acciones de carga
  loadUsers: () => Promise<void>
  loadUser: (userId: string) => Promise<void>
  loadUserProjects: (userId: string) => Promise<void>
  selectProject: (userId: string, projectId: string) => Promise<void>
  selectChapter: (userId: string, projectId: string, chapterId: string) => Promise<void>
  loadAllChapters: (userId: string, projectId: string) => Promise<void>
  refreshProjectStats: (userId: string, projectId: string) => Promise<void>
  
  // Utilidades
  getProperNounsFromChapter: (chapterId: string) => string[]
  getFormattedChapterContent: (chapterId: string) => string
  searchInProject: (userId: string, projectId: string, query: string) => Promise<any[]>
  
  // Estado
  clearError: () => void
  reset: () => void
}

const initialState: UseNovelDataState = {
  loading: false,
  error: null,
  usersIndex: null,
  currentUser: null,
  userProfile: null,
  currentProject: null,
  currentChapter: null,
  chapters: [],
  projectStats: null
}

export function useNovelData(): UseNovelDataState & UseNovelDataActions {
  const [state, setState] = useState<UseNovelDataState>(initialState)

  // Función helper para manejar respuestas
  const handleResponse = useCallback(<T,>(
    response: DataResponse<T>,
    onSuccess: (data: T) => void
  ) => {
    if (response.success && response.data) {
      onSuccess(response.data)
      setState(prev => ({ ...prev, error: null }))
    } else {
      setState(prev => ({ ...prev, error: response.error || 'Error desconocido' }))
    }
  }, [])

  // Función helper para manejar loading
  const withLoading = useCallback(async (asyncFn: () => Promise<void>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      await asyncFn()
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  // Cargar índice de usuarios
  const loadUsers = useCallback(async () => {
    await withLoading(async () => {
      const response = await loadUsersIndex()
      handleResponse(response, (data) => {
        setState(prev => ({ ...prev, usersIndex: data }))
      })
    })
  }, [withLoading, handleResponse])

  // Cargar usuario específico
  const loadUser = useCallback(async (userId: string) => {
    await withLoading(async () => {
      const response = await loadUserProfile(userId)
      handleResponse(response, (data) => {
        setState(prev => ({ 
          ...prev, 
          userProfile: data,
          currentUser: data.user 
        }))
      })
    })
  }, [withLoading, handleResponse])

  // Placeholder para cargar proyectos de usuario
  const loadUserProjects = useCallback(async (userId: string) => {
    // Esta función se implementaría para cargar la lista de proyectos
    console.log(`Loading projects for user: ${userId}`)
  }, [])

  // Seleccionar proyecto
  const selectProject = useCallback(async (userId: string, projectId: string) => {
    await withLoading(async () => {
      const response = await loadProject(userId, projectId)
      handleResponse(response, (data) => {
        setState(prev => ({ ...prev, currentProject: data }))
      })
    })
  }, [withLoading, handleResponse])

  // Seleccionar capítulo
  const selectChapter = useCallback(async (userId: string, projectId: string, chapterId: string) => {
    await withLoading(async () => {
      const response = await loadChapter(userId, projectId, chapterId)
      handleResponse(response, (data) => {
        setState(prev => ({ ...prev, currentChapter: data }))
      })
    })
  }, [withLoading, handleResponse])

  // Cargar todos los capítulos
  const loadAllChapters = useCallback(async (userId: string, projectId: string) => {
    await withLoading(async () => {
      const response = await loadProjectChapters(userId, projectId)
      handleResponse(response, (data) => {
        setState(prev => ({ ...prev, chapters: data }))
      })
    })
  }, [withLoading, handleResponse])

  // Refrescar estadísticas del proyecto
  const refreshProjectStats = useCallback(async (userId: string, projectId: string) => {
    await withLoading(async () => {
      const response = await getProjectStats(userId, projectId)
      handleResponse(response, (data) => {
        setState(prev => ({ ...prev, projectStats: data }))
      })
    })
  }, [withLoading, handleResponse])

  // Obtener nombres propios de un capítulo
  const getProperNounsFromChapter = useCallback((chapterId: string): string[] => {
    const chapter = state.chapters.find(ch => ch.id === chapterId) || state.currentChapter
    if (!chapter) return []
    
    return extractProperNouns(chapter.content)
  }, [state.chapters, state.currentChapter])

  // Obtener contenido formateado de un capítulo
  const getFormattedChapterContent = useCallback((chapterId: string): string => {
    const chapter = state.chapters.find(ch => ch.id === chapterId) || state.currentChapter
    if (!chapter) return ''
    
    return formatChapterContent(chapter.content)
  }, [state.chapters, state.currentChapter])

  // Buscar en proyecto
  const searchInProject = useCallback(async (userId: string, projectId: string, query: string) => {
    // Implementar búsqueda
    return []
  }, [])

  // Limpiar error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Reset completo
  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return {
    // Estado
    ...state,
    
    // Acciones
    loadUsers,
    loadUser,
    loadUserProjects,
    selectProject,
    selectChapter,
    loadAllChapters,
    refreshProjectStats,
    getProperNounsFromChapter,
    getFormattedChapterContent,
    searchInProject,
    clearError,
    reset
  }
}

// Hook específico para un capítulo
export function useChapter(userId: string, projectId: string, chapterId: string) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadChapterData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await loadChapter(userId, projectId, chapterId)
      if (response.success && response.data) {
        setChapter(response.data)
      } else {
        setError(response.error || 'Error al cargar capítulo')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [userId, projectId, chapterId])

  useEffect(() => {
    if (userId && projectId && chapterId) {
      loadChapterData()
    }
  }, [loadChapterData, userId, projectId, chapterId])

  const properNouns = chapter ? extractProperNouns(chapter.content) : []
  const formattedContent = chapter ? formatChapterContent(chapter.content) : ''

  return {
    chapter,
    loading,
    error,
    properNouns,
    formattedContent,
    reload: loadChapterData
  }
}

export default useNovelData
