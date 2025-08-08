"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/contexts/AuthContext'

export interface Character {
  id: string
  name: string
  age?: number
  physicalDescription?: string
  motivations?: string
  fears?: string
  biography?: string
  narrative_arc?: string
  relationships?: string[]
  developmentLevel?: string
  faction?: string
  religion?: string
  location?: string
  dynasty?: string
  role?: string
  status?: "alive" | "dead" | "missing" | "unknown"
  appearances?: number // Páginas en las que aparece
  image?: string
}

export interface Location {
  id: string
  name: string
  description?: string
  atmosphere?: string
  history?: string
  plotRelevance?: string
}

export interface Project {
  id: string
  title: string
  author: string
  genre: string
  description: string
  coverImage: string
  progress: number
  charactersCount: number
  chaptersCount: number
  lastModified: string
  characters: Character[]
  locations: Location[]
  wordCount: number
}

const dummyProjects: Project[] = [
  {
    id: "reino-sombras",
    title: "El Reino de las Sombras Perdidas",
    author: "Elena Martínez",
    genre: "Fantasía Épica",
    description:
      "En un reino donde las sombras cobran vida propia y los antiguos secretos amenazan con destruir el equilibrio entre la luz y la oscuridad, Lyra Nightwhisper debe dominar poderes que no comprende completamente. Acompañada por el valiente guerrero Kael Stormforge, se embarca en una épica aventura que la llevará desde las torres de cristal de Umbraluna hasta las ruinas malditas de Corazón del Vacío. Mientras las fuerzas del mal se alzan bajo el liderazgo del corrupto Lord Malachar, nuestra heroína descubrirá que su destino está entrelazado con la supervivencia misma del reino. Una historia de magia ancestral, sacrificio y el poder redentor del amor verdadero.",
    coverImage: "/book-covers/reino-sombras.png",
    progress: 65,
    charactersCount: 16,
    chaptersCount: 24,
    lastModified: "2024-01-15",
    wordCount: 89500,
    characters: [
      {
        id: "char-1",
        name: "Lyra Nightwhisper",
        age: 24,
        physicalDescription:
          "Una joven hechicera de cabello negro azulado y ojos violetas que brillan con magia ancestral. Lleva túnicas oscuras bordadas con runas plateadas.",
        motivations: "Proteger el equilibrio entre luz y sombra, vengar la muerte de su mentor",
        fears: "Perder el control de sus poderes de sombra, fallar en su misión",
        biography: "Huérfana criada por el Círculo de Magos de Sombra, descubrió sus poderes a los 16 años",
        narrative_arc: "De aprendiz insegura a maestra de las sombras",
        relationships: ["char-2", "char-5"],
        developmentLevel: "complete",
        faction: "Guardianes de la Sombra",
        religion: "Culto Lunar",
        location: "Monasterio Lunar",
        dynasty: "Linaje Nightwhisper",
        role: "Hechicera de Sombras",
        status: "alive",
        appearances: 156,
        image: "/character-portraits/lyra-nightwhisper.png",
      },
      {
        id: "char-2",
        name: "Kael Stormforge",
        age: 28,
        physicalDescription:
          "Un guerrero alto y musculoso con cicatrices de batalla. Cabello rubio y barba, ojos azul acero. Porta una armadura de placas encantada.",
        motivations: "Redimir su pasado como mercenario, proteger a los inocentes",
        fears: "Repetir los errores de su pasado, perder a sus nuevos compañeros",
        biography: "Ex-mercenario que encontró la redención al salvar una aldea",
        narrative_arc: "De mercenario sin honor a paladín de la justicia",
        relationships: ["char-1", "char-3"],
        developmentLevel: "complete",
        faction: "Guardia Real",
        religion: "Fe de la Luz Dorada",
        location: "Fortaleza de Acero",
        dynasty: "Casa Stormforge",
        role: "Capitán de la Guardia",
        status: "alive",
        appearances: 142,
        image: "/character-portraits/kael-stormforge.png",
      },
      {
        id: "char-3",
        name: "Zara la Sombra",
        age: 22,
        physicalDescription: "Figura esbelta vestida completamente de negro, rostro oculto tras una máscara de seda.",
        motivations: "Desconocidas",
        fears: "Desconocidos",
        biography: "Misteriosa asesina que aparece en momentos cruciales",
        narrative_arc: "Revelación gradual de su verdadera identidad",
        relationships: ["char-7"],
        developmentLevel: "basic",
        faction: "Guardianes de la Sombra",
        religion: "Culto de las Sombras",
        location: "Desconocido",
        dynasty: "Sin linaje",
        role: "Asesina",
        status: "alive",
        appearances: 67,
        image: "/character-portraits/shadow-character.png",
      },
      {
        id: "char-4",
        name: "Finn el Explorador",
        age: 19,
        physicalDescription: "Joven aventurero con equipo de exploración y mapas antiguos.",
        motivations: "Descubrir tierras perdidas",
        fears: "Perderse para siempre",
        biography: "Cartógrafo novato con gran potencial",
        narrative_arc: "De novato a explorador legendario",
        relationships: ["char-1"],
        developmentLevel: "basic",
        faction: "Gremio de Exploradores",
        religion: "Sin religión",
        location: "Puerto de los Vientos",
        dynasty: "Sin linaje",
        role: "Explorador",
        status: "alive",
        appearances: 34,
        image: "/character-portraits/elder-mage.png",
      },
      {
        id: "char-5",
        name: "Maestro Aldric",
        age: 67,
        physicalDescription:
          "Anciano mago de barba blanca y túnicas azules, ojos sabios que han visto siglos de historia.",
        motivations: "Preservar el conocimiento ancestral, guiar a la nueva generación",
        fears: "Que se pierda la sabiduría antigua",
        biography: "Archimago del Consejo de Sabios, mentor de Lyra",
        narrative_arc: "Maestro sabio que debe enfrentar su mortalidad",
        relationships: ["char-1", "char-8"],
        developmentLevel: "intermediate",
        faction: "Guardianes de la Sombra",
        religion: "Culto Lunar",
        location: "Torre de los Sabios",
        dynasty: "Linaje de los Archimagos",
        role: "Archimago",
        status: "alive",
        appearances: 89,
        image: "/character-portraits/elder-mage.png",
      },
      {
        id: "char-6",
        name: "La Sombra del Norte",
        age: 45,
        physicalDescription: "Figura encapuchada de presencia intimidante.",
        motivations: "Desconocidas",
        fears: "Desconocidos",
        biography: "Líder misterioso de una facción oscura",
        narrative_arc: "Antagonista principal con motivaciones complejas",
        relationships: ["char-7"],
        developmentLevel: "basic",
        faction: "Fuerzas del Vacío",
        religion: "Culto del Vacío",
        location: "Fortaleza del Norte",
        dynasty: "Casa Sombría",
        role: "Señor de la Guerra",
        status: "alive",
        appearances: 23,
        image: "/character-portraits/villain-detailed.png",
      },
      {
        id: "char-7",
        name: "Lord Malachar",
        age: 52,
        physicalDescription:
          "Noble caído con armadura negra ornamentada, ojos rojos como brasas y una sonrisa cruel que revela su naturaleza corrupta.",
        motivations: "Conquistar el reino, obtener poder absoluto sobre las sombras",
        fears: "Ser derrotado y perder su inmortalidad",
        biography: "Antiguo noble que hizo un pacto con fuerzas oscuras para obtener poder",
        narrative_arc: "Villano principal cuya corrupción amenaza todo el reino",
        relationships: ["char-6", "char-3"],
        developmentLevel: "complete",
        faction: "Fuerzas del Vacío",
        religion: "Culto del Vacío",
        location: "Castillo de las Almas Perdidas",
        dynasty: "Casa Malachar (Caída)",
        role: "Señor Oscuro",
        status: "alive",
        appearances: 78,
        image: "/character-portraits/villain-detailed.png",
      },
      {
        id: "char-8",
        name: "Reina Seraphina Goldenheart",
        age: 42,
        physicalDescription:
          "Majestuosa soberana de cabello dorado y corona de cristales luminosos. Viste túnicas reales bordadas con hilos de oro.",
        motivations: "Proteger su reino y su pueblo, mantener la paz",
        fears: "Fallar como líder, perder a su familia",
        biography: "Tercera generación de la dinastía Goldenheart, conocida por su sabiduría y compasión",
        narrative_arc: "Líder que debe tomar decisiones difíciles en tiempos oscuros",
        relationships: ["char-9", "char-5"],
        developmentLevel: "complete",
        faction: "Corona Real",
        religion: "Fe de la Luz Dorada",
        location: "Palacio Real de Umbraluna",
        dynasty: "Casa Goldenheart",
        role: "Reina",
        status: "alive",
        appearances: 95,
        image: "/character-portraits/queen-seraphina.png",
      },
    ],
    locations: [
      {
        id: "loc-1",
        name: "Ciudad de Umbraluna",
        description:
          "La capital del reino, una metrópolis donde la arquitectura clásica se mezcla con torres de cristal que canalizan la magia lunar.",
        atmosphere: "Majestuosa pero con un aire de tensión creciente",
        history: "Fundada hace 800 años por el primer Rey Goldenheart",
        plotRelevance: "Centro político y mágico del reino, donde se toman las decisiones cruciales",
      },
      {
        id: "loc-2",
        name: "Las Ruinas de Corazón del Vacío",
        description: "Antigua fortaleza en ruinas donde la realidad se distorsiona y las sombras cobran vida propia.",
        atmosphere: "Siniestra y peligrosa, llena de ecos del pasado",
        history: "Fue el bastión de un antiguo culto que intentó invocar entidades del vacío",
        plotRelevance: "Lugar donde se librará la batalla final contra las fuerzas oscuras",
      },
      {
        id: "loc-3",
        name: "El Bosque Susurrante",
        description:
          "Bosque encantado donde los árboles guardan memorias ancestrales y los espíritus de la naturaleza aún caminan.",
        atmosphere: "Mística y ancestral, llena de magia natural",
        history: "Bosque sagrado protegido por los druidas durante milenios",
        plotRelevance: "Refugio de sabiduría ancestral y hogar de aliados poderosos",
      },
    ],
  },
  {
    id: "ecos-manana",
    title: "Ecos del Mañana",
    author: "Carlos Mendoza",
    genre: "Ciencia Ficción",
    description:
      "La brillante física cuántica Dr. Elena Vásquez creía que había logrado el mayor avance científico de la humanidad: un dispositivo capaz de permitir viajes entre realidades paralelas. Sin embargo, su primer experimento desata una cascada de consecuencias imprevistas que amenazan con destruir no solo su realidad, sino todo el multiverso. Mientras navega entre mundos alternativos donde las decisiones tomadas llevaron a futuros radicalmente diferentes, Elena debe enfrentar versiones de sí misma que tomaron caminos distintos. Con el tiempo agotándose y la realidad fragmentándose, deberá encontrar una manera de reparar el daño antes de que todas las dimensiones colapsen en una singularidad destructiva.",
    coverImage: "/book-covers/ecos-manana.png",
    progress: 40,
    charactersCount: 8,
    chaptersCount: 18,
    lastModified: "2024-01-10",
    wordCount: 45200,
    characters: [
      {
        id: "sci-char-1",
        name: "Dr. Elena Vasquez",
        age: 38,
        physicalDescription:
          "Científica brillante con cabello castaño recogido y gafas, siempre lleva una bata de laboratorio",
        motivations: "Salvar el multiverso de su propia creación",
        fears: "Haber condenado todas las realidades",
        biography: "Física cuántica que inventó el dispositivo de salto dimensional",
        narrative_arc: "De científica orgullosa a heroína redentora",
        developmentLevel: "complete",
        faction: "Instituto de Física Cuántica",
        religion: "Agnóstica",
        location: "Laboratorio Dimensional",
        dynasty: "Sin linaje",
        role: "Científica Jefe",
        status: "alive",
        appearances: 89,
        image: "/character-portraits/lyra-nightwhisper.png",
      },
    ],
    locations: [],
  },
  {
    id: "corazones-conflicto",
    title: "Corazones en Conflicto",
    author: "Isabella Torres",
    genre: "Romance Contemporáneo",
    description:
      "Sofia Herrera ha construido una carrera exitosa como abogada corporativa, sacrificando su vida personal en el altar del éxito profesional. Su mundo perfectamente ordenado se tambalea cuando se reencuentra con Diego Morales, su primer amor de la universidad, en el caso legal más importante de su carrera. Él ahora es el abogado defensor del lado opuesto, representando a una comunidad que lucha contra la corporación de Sofia. Entre alegatos legales y tensiones no resueltas, ambos deben navegar no solo las complejidades del caso, sino también los sentimientos que creían enterrados. Una historia sobre segundas oportunidades, el precio del éxito y la valentía necesaria para elegir el amor por encima de la ambición.",
    coverImage: "/book-covers/corazones-conflicto.png",
    progress: 80,
    charactersCount: 6,
    chaptersCount: 15,
    lastModified: "2024-01-12",
    wordCount: 67800,
    characters: [
      {
        id: "rom-char-1",
        name: "Sofia Herrera",
        age: 32,
        physicalDescription: "Abogada elegante con trajes profesionales y cabello negro siempre perfectamente peinado",
        motivations: "Equilibrar éxito profesional con felicidad personal",
        fears: "Perder todo por lo que ha trabajado",
        biography: "Abogada corporativa que sacrificó el amor por su carrera",
        narrative_arc: "De workaholic a mujer que encuentra el equilibrio",
        developmentLevel: "complete",
        faction: "Bufete Legal",
        religion: "Católica",
        location: "Ciudad de México",
        dynasty: "Sin linaje",
        role: "Abogada Senior",
        status: "alive",
        appearances: 78,
        image: "/character-portraits/queen-seraphina.png",
      },
    ],
    locations: [],
  },
]

// Función eliminada - ahora se usan datos de la API

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  useEffect(() => {
    const loadProjects = async () => {
      if (!currentUser?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/list-projects?userId=${encodeURIComponent(currentUser.id)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        const formattedProjects = data.projects.map((project: any) => ({
          id: project.id,
          title: project.title,
          author: project.author,
          genre: project.genre,
          description: project.synopsis,
          coverImage: project.coverImage || `/book-covers/${project.id}.png`,
          progress: 0, // Will be calculated later
          charactersCount: 0, // Will be calculated later
          chaptersCount: 0, // Will be calculated later
          lastModified: new Date(project.lastModified).toISOString().split('T')[0],
          wordCount: project.wordCount,
          characters: [],
          locations: []
        }))
        
        setProjects(formattedProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [currentUser?.id])

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects)
    localStorage.setItem("novel-projects", JSON.stringify(updatedProjects))
  }

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map((project) => (project.id === projectId ? { ...project, ...updates } : project))
    saveProjects(updatedProjects)

    if (currentProject?.id === projectId) {
      setCurrentProject({ ...currentProject, ...updates })
    }
  }

  const addCharacter = (projectId: string, character: Character) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            characters: [...project.characters, character],
            charactersCount: project.characters.length + 1,
          }
        : project,
    )
    saveProjects(updatedProjects)
  }

  const updateCharacter = (projectId: string, characterId: string, updates: Partial<Character>) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            characters: project.characters.map((char) => (char.id === characterId ? { ...char, ...updates } : char)),
          }
        : project,
    )
    saveProjects(updatedProjects)
  }

  const addLocation = (projectId: string, location: Location) => {
    const updatedProjects = projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            locations: [...project.locations, location],
          }
        : project,
    )
    saveProjects(updatedProjects)
  }

  return {
    projects,
    currentProject,
    setCurrentProject,
    updateProject,
    addCharacter,
    updateCharacter,
    addLocation,
    loading,
  }
}
