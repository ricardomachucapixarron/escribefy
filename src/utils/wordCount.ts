// Utilidades para contar palabras en el contenido

/**
 * Cuenta las palabras en un texto, excluyendo espacios en blanco y caracteres especiales
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0
  }

  // Limpiar el texto: remover HTML tags, caracteres especiales, etc.
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remover HTML tags
    .replace(/[^\w\s\u00C0-\u017F\u0100-\u024F]/g, ' ') // Mantener solo letras, números y acentos
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim()

  if (!cleanText) {
    return 0
  }

  // Dividir por espacios y filtrar palabras vacías
  const words = cleanText.split(' ').filter(word => word.length > 0)
  return words.length
}

/**
 * Cuenta las palabras en múltiples textos y devuelve el total
 */
export function countWordsInTexts(texts: string[]): number {
  return texts.reduce((total, text) => total + countWords(text), 0)
}

/**
 * Cuenta caracteres sin espacios
 */
export function countCharacters(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0
  }

  return text.replace(/\s/g, '').length
}

/**
 * Estadísticas completas de texto
 */
export interface TextStats {
  words: number
  characters: number
  charactersWithSpaces: number
  paragraphs: number
  sentences: number
}

export function getTextStats(text: string): TextStats {
  if (!text || typeof text !== 'string') {
    return {
      words: 0,
      characters: 0,
      charactersWithSpaces: 0,
      paragraphs: 0,
      sentences: 0
    }
  }

  const cleanText = text.replace(/<[^>]*>/g, '')
  
  return {
    words: countWords(text),
    characters: countCharacters(text),
    charactersWithSpaces: cleanText.length,
    paragraphs: cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
    sentences: cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  }
}
