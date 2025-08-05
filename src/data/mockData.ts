// Datos mock para desarrollo y demostración
import { useState, useEffect } from 'react'
import type { Chapter, User, Project, Character, Location, Organization } from '@/types/data'

export const mockUser: User = {
  id: 'ricardo-machuca',
  username: 'ricardo-machuca',
  displayName: 'Ricardo Machuca',
  avatar: '/avatars/ricardo-machuca.png',
  profilePath: '/users/ricardo-machuca',
  plan: 'premium',
  status: 'active',
  projectsCount: 3,
  totalWords: 45230,
  joinedAt: '2023-01-15T10:00:00Z',
  lastActive: '2023-11-25T18:30:00Z'
}

// Contenido completo del capítulo
const chapterContent = `El laboratorio estaba sumido en un silencio antinatural cuando Maya Chen llegó esa mañana. Los equipos cuánticos zumbaban con su ritmo habitual, pero algo en el aire se sentía... diferente.

Maya se acercó a la consola principal, donde los datos de la noche anterior esperaban su revisión. Lo que vio la dejó sin aliento: las lecturas mostraban fluctuaciones temporales imposibles, como si el tiempo mismo hubiera comenzado a desdoblarse.

"Esto no puede ser correcto", murmuró, ajustando los parámetros de calibración. Pero los números no mentían. Algo estaba alterando la estructura fundamental del espacio-tiempo, y todo apuntaba a que el origen estaba en Neo-Tokio.

Dr. Kenji Nakamura entró al laboratorio con su habitual taza de café, pero se detuvo al ver la expresión de Maya. "¿Qué has encontrado?", preguntó, acercándose a la pantalla.

"Anomalías temporales", respondió Maya, señalando los gráficos. "Y no son naturales. Alguien está experimentando con el tiempo, Kenji. Y creo que sabemos quién."

El nombre de Dr. Marcus Webb flotaba en el aire entre ellos, no pronunciado pero presente. Su antiguo colega, ahora líder de Los Alteradores, había desaparecido meses atrás con investigaciones clasificadas sobre manipulación temporal.

"Tenemos que informar esto", dijo Kenji, pero Maya ya estaba pensando más allá.

"No", respondió firmemente. "Primero necesitamos entender qué está haciendo. Si Webb realmente está alterando el tiempo, las consecuencias podrían ser catastróficas."

Mientras hablaba, una nueva alerta apareció en la pantalla. Las anomalías se estaban intensificando, y ahora podían detectar ecos de eventos que aún no habían ocurrido.

El futuro estaba sangrando hacia el presente, y Maya Chen se encontraba en el epicentro de una guerra temporal que apenas comenzaba a comprender.

Los días siguientes fueron un torbellino de investigación y descubrimientos perturbadores. Maya trabajaba incansablemente, analizando cada fragmento de datos, cada anomalía temporal que aparecía en sus instrumentos. Kenji la acompañaba en largas jornadas, trayendo café y proporcionando una segunda opinión cuando los números se volvían demasiado abstractos.

Fue durante una de estas sesiones nocturnas cuando Maya hizo el descubrimiento que cambiaría todo. Mientras calibraba los sensores cuánticos para detectar fluctuaciones más sutiles, notó un patrón en las anomalías. No eran aleatorias, como había asumido inicialmente. Había una intención detrás de ellas, una metodología que reconoció inmediatamente.

"Es la firma de Webb", susurró, mirando los datos con una mezcla de admiración y horror. "Está usando la teoría de cascadas temporales que desarrollamos juntos hace cinco años."

Kenji se acercó para ver mejor la pantalla. "¿Estás segura?"

"Completamente", respondió Maya, señalando las ondas sinusoidales que se repetían en los datos. "Mira este patrón. Es exactamente como predecíamos que se vería una alteración controlada del continuo espacio-tiempo. Pero Webb lo está llevando mucho más lejos de lo que jamás imaginamos."

La realización la golpeó como un rayo. Si Webb estaba usando su investigación conjunta, entonces conocía todas las variables, todos los riesgos. Y si había decidido proceder de todas formas, significaba que creía que los beneficios superaban las consecuencias potencialmente catastróficas.

"Tenemos que detenerlo", dijo Maya, levantándose de su silla con determinación renovada. "No importa cuáles sean sus intenciones, está jugando con fuerzas que podrían destruir la realidad tal como la conocemos."

Pero incluso mientras pronunciaba estas palabras, Maya sabía que detener a Marcus Webb no sería tan simple. Él tenía recursos, seguidores, y lo más peligroso de todo: tenía razón en algunas de sus teorías sobre las posibilidades de la manipulación temporal.

La guerra por el futuro había comenzado, y Maya Chen se encontraba en la primera línea de batalla, armada únicamente con su conocimiento científico y la determinación de proteger la integridad del tiempo mismo.`

export const mockChapter: Chapter = {
  id: 'chapter-001',
  title: 'El Despertar',
  synopsis: 'Maya Chen descubre las primeras anomalías temporales en su laboratorio.',
  status: 'completed',
  wordCount: 580, // Este será calculado dinámicamente
  mood: 'mysterious',
  themes: ['discovery', 'science', 'mystery'],
  keyEvents: ['Descubrimiento de anomalías', 'Primer contacto con alteraciones temporales'],
  lastModified: '2023-11-20T14:30:00Z',
  content: chapterContent,
  notes: 'Primer capítulo que establece el conflicto principal y presenta a los personajes clave.',
  scenes: [],
  imageAssets: [],
  audioAssets: [],
  mediaMarkers: []
}

// Datos de personajes
export const mockCharacters: Character[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    age: 28,
    role: 'protagonist',
    occupation: 'Científica Cuántica',
    description: 'Brillante física especializada en mecánica cuántica y anomalías temporales. Trabaja en el laboratorio de investigación avanzada.',
    personality: ['analítica', 'determinada', 'curiosa', 'valiente'],
    groupings: ['Preservadores', 'Científicos'],
    tags: ['Maya', 'Maya Chen', 'Chen', 'Dra. Chen'],
    portfolio: [
      {
        id: 'maya-lab-001',
        filename: 'maya-chen-lab.png',
        path: '/users/ricardo-machuca/projects/ecos-manana/characters/maya-chen-lab.png',
        description: 'Maya Chen trabajando en su laboratorio con equipos cuánticos',
        createdAt: '2023-11-20T10:30:00Z',
        tags: ['scientist', 'laboratory', 'professional', 'focused'],
        mood: 'determined',
        context: 'work environment',
        shotType: 'medium-shot',
        angle: 'three-quarter',
        composition: 'portrait',
        lighting: 'studio'
      }
    ]
  },
  {
    id: 'marcus-webb',
    name: 'Dr. Marcus Webb',
    age: 45,
    role: 'antagonist',
    occupation: 'Ex-Científico, Líder de Los Alteradores',
    description: 'Antiguo colega de Maya que ahora lidera una organización dedicada a alterar el tiempo.',
    personality: ['ambicioso', 'manipulador', 'brillante', 'obsesivo'],
    groupings: ['Alteradores'],
    tags: ['Webb', 'Marcus Webb', 'Dr. Webb', 'Marcus'],
    portfolio: [
      {
        id: 'webb-portrait-001',
        filename: 'marcus-webb-villain.png',
        path: '/users/ricardo-machuca/projects/ecos-manana/characters/marcus-webb-villain.png',
        description: 'Retrato dramático de Marcus Webb con expresión siniestra',
        createdAt: '2023-11-18T15:45:00Z',
        tags: ['villain', 'antagonist', 'dramatic', 'menacing'],
        mood: 'sinister',
        context: 'character portrait',
        shotType: 'close-up',
        angle: 'front',
        composition: 'portrait',
        lighting: 'dramatic'
      }
    ]
  }
]

// Datos de locaciones
export const mockLocations: Location[] = [
  {
    id: 'neo-tokyo',
    name: 'Neo-Tokio',
    type: 'city',
    description: 'Metrópolis futurista donde se desarrolla la historia, con rascacielos que tocan las nubes y tecnología avanzada.',
    tags: ['Neo-Tokio', 'Neo-Tokyo', 'ciudad', 'metrópolis'],
    portfolio: [
      {
        id: 'neo-tokyo-001',
        filename: 'neo-tokyo.png',
        path: '/users/ricardo-machuca/projects/ecos-manana/locations/neo-tokyo.png',
        description: 'Vista panorámica de Neo-Tokio con sus rascacielos futuristas',
        createdAt: '2023-11-25T10:30:00Z',
        tags: ['cityscape', 'futuristic', 'skyline', 'cyberpunk', 'neon'],
        mood: 'epic',
        context: 'establishing shot',
        shotType: 'establishing-shot',
        angle: 'high-angle',
        composition: 'panoramic',
        lighting: 'natural'
      }
    ]
  },
  {
    id: 'quantum-lab',
    name: 'Laboratorio Cuántico',
    type: 'building',
    description: 'Complejo de investigación de alta tecnología donde Maya realiza sus experimentos temporales.',
    tags: ['laboratorio', 'lab', 'complejo científico'],
    portfolio: [
      {
        id: 'lab-001',
        filename: 'steel-fortress-bg.png',
        path: '/users/ricardo-machuca/projects/ecos-manana/locations/steel-fortress-bg.png',
        description: 'Exterior del complejo de laboratorios con arquitectura de acero',
        createdAt: '2023-11-22T14:15:00Z',
        tags: ['laboratory', 'fortress', 'steel', 'technology', 'secure'],
        mood: 'imposing',
        context: 'exterior view',
        shotType: 'establishing-shot',
        angle: 'low-angle',
        composition: 'landscape',
        lighting: 'dramatic'
      }
    ]
  }
]

// Datos de organizaciones
export const mockOrganizations: Organization[] = [
  {
    id: 'alteradores',
    name: 'Los Alteradores',
    type: 'faction',
    description: 'Organización secreta liderada por Marcus Webb que busca alterar el pasado para cambiar el presente.',
    tags: ['Alteradores', 'Los Alteradores', 'organización'],
    portfolio: [
      {
        id: 'alteradores-symbol-001',
        filename: 'alteradores-logo.png',
        path: '/users/ricardo-machuca/projects/ecos-manana/organizations/alteradores-logo.png',
        description: 'Símbolo oficial de Los Alteradores con motivos temporales',
        createdAt: '2023-11-15T09:20:00Z',
        tags: ['logo', 'symbol', 'organization', 'temporal', 'faction'],
        mood: 'mysterious',
        context: 'organizational branding',
        shotType: 'close-up',
        angle: 'front',
        composition: 'square',
        lighting: 'dramatic'
      }
    ]
  },
  {
    id: 'preservadores',
    name: 'Los Preservadores',
    type: 'faction',
    description: 'Grupo de científicos y guardianes dedicados a proteger la integridad del tiempo.',
    tags: ['Preservadores', 'Los Preservadores', 'guardianes'],
    portfolio: [
      {
        id: 'preservadores-emblem-001',
        filename: 'preservadores-emblem.png',
        path: '/users/ricardo-machuca/projects/ecos-manana/organizations/preservadores-emblem.png',
        description: 'Emblema de Los Preservadores con símbolos de protección temporal',
        createdAt: '2023-11-16T11:30:00Z',
        tags: ['emblem', 'protection', 'time', 'guardians', 'noble'],
        mood: 'heroic',
        context: 'organizational identity',
        shotType: 'medium-shot',
        angle: 'front',
        composition: 'square',
        lighting: 'soft'
      }
    ]
  }
]

export const mockProject: Project = {
  id: 'ecos-manana',
  title: 'Ecos del Mañana',
  description: 'Una novela de ciencia ficción sobre manipulación temporal y las consecuencias de alterar el pasado.',
  genre: 'Ciencia Ficción',
  status: 'writing',
  targetWordCount: 80000,
  currentWordCount: 15420,
  themes: ['tiempo', 'ciencia', 'consecuencias', 'moralidad'],
  tags: ['sci-fi', 'temporal', 'thriller'],
  plotlines: [],
  settings: {
    autoSave: true,
    backupFrequency: 300,
    collaborationEnabled: false
  },
  createdAt: '2023-10-01T10:00:00Z',
  lastModified: '2023-11-25T16:45:00Z',
  chapters: [mockChapter],
  characters: mockCharacters,
  locations: mockLocations,
  organizations: mockOrganizations
}



// Hook para simular carga asíncrona del capítulo
export function useMockChapter() {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [properNouns, setProperNouns] = useState<string[]>([])

  useEffect(() => {
    simulateAsyncLoad(mockChapter, 1500)
      .then((data) => {
        setChapter(data)
        // Simular extracción de nombres propios
        const extractedNouns = ['Maya Chen', 'Neo-Tokio', 'Dr. Kenji Nakamura', 'Dr. Marcus Webb', 'Los Alteradores']
        setProperNouns(extractedNouns)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { chapter, loading, error, properNouns }
}

// Función para simular carga asíncrona
function simulateAsyncLoad<T>(data: T, delay: number = 1000): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}
