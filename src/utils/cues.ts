export interface CueInfo {
  type: 'vfx' | 'sound' | 'image'
  effect: string
  params: Record<string, string>
  originalCode: string
}

// Parse cues of the form [cue:type|effect|key=value|key2=value2]
export function parseCues(text: string): Array<{ index: number; cue: CueInfo }> {
  const cueRegex = /\[cue:([^|]+)\|([^|]+)(?:\|([^\]]+))?\]/g
  const cues: Array<{ index: number; cue: CueInfo }> = []
  let match: RegExpExecArray | null

  while ((match = cueRegex.exec(text)) !== null) {
    const [fullMatch, rawType, rawEffect, params = ''] = match
    const normTypeRaw = String(rawType || '').trim().toLowerCase()
    const normalizedType = (normTypeRaw === 'fx' ? 'vfx' : normTypeRaw) as 'vfx' | 'sound' | 'image'
    const effect = String(rawEffect || '').trim()
    const cueInfo: CueInfo = {
      type: normalizedType,
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

// Group consecutive cues that have no text between them in the given text
export function groupConsecutiveCues(
  cues: Array<{ index: number; cue: CueInfo }>,
  text: string
): Array<{ index: number; cues: CueInfo[] }> {
  if (cues.length === 0) return []

  const groups: Array<{ index: number; cues: CueInfo[] }> = []
  let currentGroup: CueInfo[] = [cues[0].cue]
  let currentIndex = cues[0].index

  for (let i = 1; i < cues.length; i++) {
    const prevCueEnd = cues[i - 1].index + cues[i - 1].cue.originalCode.length
    const currentCueStart = cues[i].index
    const textBetween = text.slice(prevCueEnd, currentCueStart).trim()

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
