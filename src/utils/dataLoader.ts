// Utilidades para cargar datos de NovelCraft
import type { 
  User, 
  UserProfile, 
  Project, 
  Chapter, 
  UsersIndex, 
  DataResponse 
} from '@/types/data'

const DATA_BASE_PATH = '/src/data'

/**
 * Carga el índice de usuarios
 */
export async function loadUsersIndex(): Promise<DataResponse<UsersIndex>> {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/users-index.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Carga el perfil de un usuario específico
 */
export async function loadUserProfile(userId: string): Promise<DataResponse<UserProfile>> {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/users/${userId}/profile.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Carga los proyectos de un usuario
 */
export async function loadUserProjects(userId: string): Promise<DataResponse<string[]>> {
  try {
    // Primero obtenemos la lista de directorios de proyectos
    // En un entorno real, esto vendría de una API
    const projectDirs = ['ecos-manana', 'reino-sombras', 'susurros-viento']
    
    return {
      success: true,
      data: projectDirs,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Carga un proyecto específico
 */
export async function loadProject(userId: string, projectId: string): Promise<DataResponse<Project>> {
  try {
    const response = await fetch(`${DATA_BASE_PATH}/users/${userId}/projects/${projectId}/project.json`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Carga un capítulo específico
 */
export async function loadChapter(
  userId: string, 
  projectId: string, 
  chapterId: string
): Promise<DataResponse<Chapter>> {
  try {
    const response = await fetch(
      `${DATA_BASE_PATH}/users/${userId}/projects/${projectId}/chapters/${chapterId}.json`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return {
      success: true,
      data: data.chapter ? { ...data.chapter, content: data.content } : data,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Carga todos los capítulos de un proyecto
 */
export async function loadProjectChapters(
  userId: string, 
  projectId: string
): Promise<DataResponse<Chapter[]>> {
  try {
    // En un entorno real, esto vendría de una API que liste los archivos
    const chapterIds = ['chapter-1', 'chapter-2', 'chapter-3'] // Ejemplo
    
    const chapterPromises = chapterIds.map(chapterId => 
      loadChapter(userId, projectId, chapterId)
    )
    
    const chapterResults = await Promise.all(chapterPromises)
    const chapters = chapterResults
      .filter(result => result.success && result.data)
      .map(result => result.data!)
    
    return {
      success: true,
      data: chapters,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Busca en el contenido de los capítulos
 */
export async function searchChapterContent(
  userId: string,
  projectId: string,
  query: string
): Promise<DataResponse<Array<{ chapter: Chapter; matches: string[] }>>> {
  try {
    const chaptersResult = await loadProjectChapters(userId, projectId)
    
    if (!chaptersResult.success || !chaptersResult.data) {
      throw new Error('No se pudieron cargar los capítulos')
    }
    
    const results = chaptersResult.data
      .map(chapter => {
        const content = chapter.content.toLowerCase()
        const queryLower = query.toLowerCase()
        
        if (content.includes(queryLower)) {
          // Encontrar contexto alrededor de las coincidencias
          const matches: string[] = []
          let index = content.indexOf(queryLower)
          
          while (index !== -1) {
            const start = Math.max(0, index - 50)
            const end = Math.min(content.length, index + query.length + 50)
            matches.push(content.substring(start, end))
            index = content.indexOf(queryLower, index + 1)
          }
          
          return { chapter, matches }
        }
        
        return null
      })
      .filter(result => result !== null) as Array<{ chapter: Chapter; matches: string[] }>
    
    return {
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Obtiene estadísticas de un proyecto
 */
export async function getProjectStats(
  userId: string, 
  projectId: string
): Promise<DataResponse<{
  totalWords: number
  totalChapters: number
  completedChapters: number
  averageWordsPerChapter: number
  lastModified: string
}>> {
  try {
    const chaptersResult = await loadProjectChapters(userId, projectId)
    
    if (!chaptersResult.success || !chaptersResult.data) {
      throw new Error('No se pudieron cargar los capítulos')
    }
    
    const chapters = chaptersResult.data
    const totalWords = chapters.reduce((sum, chapter) => sum + chapter.wordCount, 0)
    const completedChapters = chapters.filter(chapter => chapter.status === 'completed').length
    const lastModified = chapters
      .map(chapter => new Date(chapter.lastModified))
      .sort((a, b) => b.getTime() - a.getTime())[0]?.toISOString() || new Date().toISOString()
    
    return {
      success: true,
      data: {
        totalWords,
        totalChapters: chapters.length,
        completedChapters,
        averageWordsPerChapter: chapters.length > 0 ? Math.round(totalWords / chapters.length) : 0,
        lastModified
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Extrae nombres propios del contenido de un capítulo
 */
export function extractProperNouns(content: string): string[] {
  // Regex para encontrar palabras que empiecen con mayúscula
  const properNounRegex = /\b[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*\b/g
  const matches = content.match(properNounRegex) || []
  
  // Filtrar palabras comunes que no son nombres propios
  const commonWords = ['El', 'La', 'Los', 'Las', 'Un', 'Una', 'Unos', 'Unas', 'De', 'Del', 'En', 'Con', 'Por', 'Para', 'Sin', 'Sobre', 'Desde', 'Hasta', 'Hacia', 'Ante', 'Bajo', 'Tras', 'Durante', 'Mediante', 'Según', 'Contra', 'Entre', 'Hacia', 'Pero', 'Sino', 'Aunque', 'Porque', 'Cuando', 'Donde', 'Como', 'Que', 'Quien', 'Cual', 'Cuyo']
  
  const properNouns = matches
    .filter(word => !commonWords.includes(word))
    .filter((word, index, array) => array.indexOf(word) === index) // Eliminar duplicados
    .sort()
  
  return properNouns
}

/**
 * Formatea el contenido de un capítulo para mostrar
 */
export function formatChapterContent(content: string): string {
  return content
    .replace(/\*\[MARKER:.*?\]\*/g, '') // Eliminar marcadores
    .replace(/^#\s+.*$/gm, '') // Eliminar títulos markdown
    .replace(/\n{3,}/g, '\n\n') // Reducir saltos de línea múltiples
    .trim()
}
