import Hypher from 'hypher'
import spanish from 'hyphenation.es'

let hypherInstance: any | null = null

export const getSpanishHypher = () => {
  if (!hypherInstance) {
    try {
      hypherInstance = new Hypher(spanish)
    } catch {
      hypherInstance = null
    }
  }
  return hypherInstance
}

export const applyHyphenation = (text: string): string => {
  if (!text) return text
  const h = getSpanishHypher()
  try {
    return h && typeof (h as any).hyphenateText === 'function' ? (h as any).hyphenateText(text) : text
  } catch {
    return text
  }
}
