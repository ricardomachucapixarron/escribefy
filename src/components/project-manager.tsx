"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusCircle,
  BookOpen,
  Play,
  Info,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Palette,
  Loader2,
  Wrench,
  Calendar,
} from "lucide-react"
import { motion, useScroll, AnimatePresence } from "framer-motion"
import { CharacterSelector } from "./character-selector"
import type { Project, Character } from "@/hooks/use-projects"

interface ProjectManagerProps {
  projects: Project[]
  onProjectSelect: (project: Project) => void
}

interface Chapter {
  id: string
  title: string
  synopsis: string
  image: string
  duration: string
  episode: number
  status?: "published" | "in-construction" | "upcoming"
  isGenerating?: boolean
}

interface NewChapter {
  title: string
  synopsis: string
  characters: Character[]
  image?: string
  isGenerating?: boolean
}

// Componente para animación de escritura mejorado
const TypewriterText = ({
  text,
  delay = 0,
  className = "",
  speed = 0.02,
  skipAnimation = false,
  onScrollAccelerate = false,
  onComplete,
}: {
  text: string
  delay?: number
  className?: string
  speed?: number
  skipAnimation?: boolean
  onScrollAccelerate?: boolean
  onComplete?: () => void
}) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentSpeed, setCurrentSpeed] = useState(speed)
  const [hasStarted, setHasStarted] = useState(false)

  // Si skipAnimation es true, mostrar todo el texto inmediatamente
  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(text)
      setCurrentIndex(text.length)
      setIsComplete(true)
      setHasStarted(true)
      return
    }

    // Reset cuando cambia el texto y no se debe saltar la animación
    setDisplayedText("")
    setCurrentIndex(0)
    setIsComplete(false)
    setCurrentSpeed(speed)
    setHasStarted(false)
  }, [text, skipAnimation, speed])

  // Acelerar cuando se hace scroll
  useEffect(() => {
    if (onScrollAccelerate && !isComplete && hasStarted) {
      setCurrentSpeed(0.003) // Muy rápido cuando se hace scroll
    }
  }, [onScrollAccelerate, isComplete, hasStarted])

  // Iniciar la animación después del delay
  useEffect(() => {
    if (skipAnimation) return

    const startTimeout = setTimeout(() => {
      setHasStarted(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay, skipAnimation])

  // Animación de escritura
  useEffect(() => {
    if (skipAnimation || !hasStarted) return

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, currentSpeed * 1000)

      return () => clearTimeout(timeout)
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [currentIndex, text, currentSpeed, skipAnimation, hasStarted, isComplete, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && hasStarted && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          className="inline-block w-0.5 h-6 bg-current ml-1"
        />
      )}
    </span>
  )
}

// Las descripciones ahora se obtienen directamente del profile.json a través del hook useProjects

// Función para cargar datos del proyecto desde JSON
const loadProjectData = async (projectId: string) => {
  try {
    const response = await fetch(`/api/project-data/${projectId}`)
    if (response.ok) {
      const data = await response.json()
      console.log('Loaded project data:', data)
      return data
    } else {
      console.error('Failed to load project data:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Error loading project data:', error)
  }
  return null
}

// Prompts prediseñados para generar imágenes de capítulos
const getChapterImagePrompt = (projectId: string, chapterTitle: string, synopsis: string, characters: Character[]) => {
  const basePrompts: Record<string, string> = {
    "reino-sombras":
      "Cinematic fantasy scene in dark mystical style, magical shadows and ethereal lighting, epic fantasy artwork, detailed digital painting",
    "ecos-manana":
      "Futuristic sci-fi scene with quantum effects, dimensional rifts, cyberpunk aesthetic, high-tech laboratory, digital art style",
    "corazones-conflicto":
      "Modern romantic scene, contemporary urban setting, warm lighting, professional photography style, emotional atmosphere",
  }

  const basePrompt = basePrompts[projectId] || "Cinematic scene, professional digital artwork"
  const characterNames = characters.map((char) => char.name).join(", ")
  const characterPrompt = characters.length > 0 ? `, featuring characters: ${characterNames}` : ""

  return `${basePrompt}, depicting: ${chapterTitle} - ${synopsis.substring(0, 100)}...${characterPrompt}`
}

// Pool de imágenes disponibles para generar capítulos
const availableGeneratedImages = [
  "/chapter-images/generated-1704067200000.png",
  "/chapter-images/generated-1704067260000.png",
  "/chapter-images/generated-1704067320000.png",
]

let imageIndex = 0

// Función para determinar el estado correcto de un capítulo basado en la regla de negocio
const determineChapterStatus = (chapters: Chapter[], newEpisode: number): Chapter["status"] => {
  // Encontrar el capítulo con menor número que no esté publicado
  const unpublishedChapters = chapters.filter((ch) => ch.status !== "published")
  const minUnpublishedEpisode =
    unpublishedChapters.length > 0 ? Math.min(...unpublishedChapters.map((ch) => ch.episode)) : newEpisode

  // Si el nuevo capítulo tiene el número menor, será "in-construction"
  // Si no, será "upcoming"
  return newEpisode <= minUnpublishedEpisode ? "in-construction" : "upcoming"
}

export function ProjectManager({ projects, onProjectSelect }: ProjectManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [expandedChapters, setExpandedChapters] = useState(false)
  const [viewedProjects, setViewedProjects] = useState<Set<string>>(new Set())
  const [isScrolling, setIsScrolling] = useState(false)
  const [isCreatingChapter, setIsCreatingChapter] = useState(false)
  const [showImagePrompt, setShowImagePrompt] = useState(false)
  const [newChapter, setNewChapter] = useState<NewChapter>({ title: "", synopsis: "", characters: [] })
  const [imagePrompt, setImagePrompt] = useState("")
  const [newProject, setNewProject] = useState({
    title: "",
    genre: "",
    description: "",
  })
  const [projectData, setProjectData] = useState<any>(null)
  const [chaptersData, setChaptersData] = useState<Record<string, Chapter[]>>({
    "reino-sombras": [
      {
        id: "ch-1",
        title: "El Despertar de las Sombras",
        synopsis:
          "Lyra descubre sus poderes oscuros cuando las fuerzas del mal atacan su aldea natal. Un mentor misterioso le revela su verdadero destino.",
        image: "/chapter-images/reino-ch1.png",
        duration: "45 min lectura",
        episode: 1,
        status: "published",
      },
      {
        id: "ch-2",
        title: "La Primera Prueba",
        synopsis:
          "Kael se une a la misión de Lyra después de presenciar su increíble poder. Juntos enfrentan su primera batalla contra las criaturas de las sombras.",
        image: "/chapter-images/reino-ch2.png",
        duration: "52 min lectura",
        episode: 2,
        status: "published",
      },
      {
        id: "ch-3",
        title: "Secretos del Bosque Susurrante",
        synopsis:
          "Los protagonistas buscan respuestas en el bosque ancestral, donde los espíritus guardan secretos que cambiarán el destino del reino para siempre.",
        image: "/chapter-images/reino-ch3.png",
        duration: "38 min lectura",
        episode: 3,
        status: "published",
      },
    ],
    "ecos-manana": [
      {
        id: "chapter-1",
        title: "Ecos del Pasaoh",
        synopsis:
          "Maya Chen recibe el primer mensaje temporal anómalo que cambiará su vida para siempre. Mientras analiza las ondas cuánticas en su laboratorio, descubre patrones que no deberían existir: alguien del futuro está enviando información al pasado.",
        image: "/chapter-images/ecos-manana/chapter-1/maya-first-message.png",
        duration: "26 min lectura",
        episode: 1,
        status: "published",
      },
      {
        id: "chapter-2",
        title: "Fragmentos de Realidad",
        synopsis:
          "Maya comienza a experimentar visiones de líneas temporales alternativas. Cada eco temporal le muestra versiones diferentes de la historia, revelando que alguien está alterando eventos clave del pasado.",
        image: "/chapter-images/ecos-manana/chapter-2/temporal-visions.png",
        duration: "24 min lectura",
        episode: 2,
        status: "published",
      },
    ],
    "corazones-conflicto": [
      {
        id: "ch-1",
        title: "El Reencuentro",
        synopsis:
          "Sofia se enfrenta cara a cara con su primer amor en la sala del tribunal, reavivando sentimientos que creía enterrados para siempre.",
        image: "/chapter-images/corazones-ch1.png",
        duration: "28 min lectura",
        episode: 1,
        status: "published",
      },
    ],
  })

  const heroRef = useRef<HTMLElement>(null)
  const chaptersRef = useRef<HTMLElement>(null)
  const projectsListRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Detectar scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const unsubscribe = scrollY.on("change", () => {
      setIsScrolling(true)

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    })

    return () => {
      unsubscribe()
      clearTimeout(scrollTimeout)
    }
  }, [scrollY])

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Ordenar proyectos por fecha de modificación (más reciente primero)
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
  )

  const currentProject = sortedProjects[currentProjectIndex] || sortedProjects[0]
  
  // Cargar datos del proyecto cuando cambie el proyecto actual
  useEffect(() => {
    console.log('useEffect triggered - currentProject:', currentProject)
    console.log('projectData state:', projectData)
    if (currentProject && currentProject.id === 'ecos-manana') {
      console.log('Loading project data for ecos-manana')
      loadProjectData(currentProject.id).then(data => {
        console.log('API response:', data)
        if (data) {
          setProjectData(data)
          console.log('projectData updated to:', data)
        }
      }).catch(error => {
        console.error('Error loading project data:', error)
      })
    }
  }, [currentProject?.id])

  // Obtener capítulos del JSON o usar fallback hardcodeado
  const getChaptersFromProject = (): Chapter[] => {
    console.log('getChaptersFromProject called')
    console.log('projectData:', projectData)
    console.log('currentProject.id:', currentProject?.id)
    
    if (projectData && projectData.chapters) {
      console.log('Using JSON data - chapters:', projectData.chapters)
      const mappedChapters = projectData.chapters.map((chapter: any, index: number) => ({
        id: chapter.id,
        title: chapter.title,
        synopsis: chapter.synopsis,
        image: chapter.portfolio?.[0]?.path || `/chapter-images/${currentProject.id}-ch${index + 1}.png`,
        duration: `${Math.ceil(chapter.wordCount / 200)} min lectura`,
        episode: index + 1,
        status: chapter.status === 'completed' ? 'published' : 'in-construction'
      }))
      console.log('Mapped chapters:', mappedChapters)
      return mappedChapters
    }
    
    console.log('Using fallback hardcoded data')
    const fallbackChapters = chaptersData[currentProject?.id] || []
    console.log('Fallback chapters:', fallbackChapters)
    return fallbackChapters
  }
  
  const currentChapters = currentProject ? getChaptersFromProject() : []

  // Función para marcar proyecto como visto (solo cuando termine la animación)
  const handleAnimationComplete = () => {
    if (currentProject) {
      setViewedProjects((prev) => new Set([...prev, currentProject.id]))
    }
  }

  const getProjectBackground = (projectId: string) => {
    const backgrounds: Record<string, string> = {
      "reino-sombras": "/book-backgrounds/reino-sombras-bg.png",
      "ecos-manana": "/book-backgrounds/ecos-manana-bg.png",
      "corazones-conflicto": "/book-backgrounds/corazones-conflicto-bg.png",
    }
    return backgrounds[projectId] || "/book-backgrounds/reino-sombras-bg.png"
  }

  const genres = [
    "Fantasía",
    "Ciencia Ficción",
    "Romance",
    "Thriller",
    "Misterio",
    "Terror",
    "Aventura",
    "Drama",
    "Histórica",
    "Contemporánea",
    "Distopía",
    "Paranormal",
    "Otro",
  ]

  const handleCreateProject = () => {
    if (!newProject.title.trim()) return

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      author: "Autor",
      genre: newProject.genre,
      description: newProject.description,
      coverImage: "/placeholder.svg?height=400&width=300&text=Nueva+Novela",
      progress: 0,
      charactersCount: 0,
      chaptersCount: 0,
      lastModified: new Date().toISOString().split("T")[0],
      characters: [],
      locations: [],
      wordCount: 0,
    }

    setNewProject({ title: "", genre: "", description: "" })
    setIsCreateDialogOpen(false)
    onProjectSelect(project)
  }

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % sortedProjects.length)
    setExpandedChapters(false) // Cerrar capítulos al cambiar de proyecto
  }

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + sortedProjects.length) % sortedProjects.length)
    setExpandedChapters(false) // Cerrar capítulos al cambiar de proyecto
  }

  const handleExpandChapters = () => {
    const wasExpanded = expandedChapters
    setExpandedChapters(!expandedChapters)

    if (!wasExpanded) {
      // Si se está expandiendo, hacer scroll hacia abajo
      setTimeout(() => {
        const viewportHeight = window.innerHeight
        const currentScrollY = window.scrollY
        const targetScrollY = currentScrollY + viewportHeight * 0.8

        window.scrollTo({
          top: targetScrollY,
          behavior: "smooth",
        })
      }, 200)
    } else {
      // Si se está colapsando, hacer scroll hacia arriba (al hero section)
      setTimeout(() => {
        if (heroRef.current) {
          heroRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 100) // Delay más corto para el scroll hacia arriba
    }
  }

  const handleStartNewChapter = () => {
    setIsCreatingChapter(true)
    setNewChapter({ title: "", synopsis: "", characters: [] })
  }

  const handleImageClick = () => {
    if (!newChapter.title.trim() || !newChapter.synopsis.trim()) return

    const prompt = getChapterImagePrompt(
      currentProject.id,
      newChapter.title,
      newChapter.synopsis,
      newChapter.characters,
    )
    setImagePrompt(prompt)
    setShowImagePrompt(true)
  }

  const handleGenerateImage = async () => {
    setNewChapter((prev) => ({ ...prev, isGenerating: true }))
    setShowImagePrompt(false)

    // Simular generación de imagen
    setTimeout(() => {
      const newEpisode = currentChapters.length + 1

      // Aplicar regla de negocio: actualizar estados de capítulos existentes
      const updatedChaptersData = { ...chaptersData }
      if (updatedChaptersData[currentProject.id]) {
        updatedChaptersData[currentProject.id] = updatedChaptersData[currentProject.id].map((ch) => {
          // Si hay un capítulo "in-construction" y el nuevo capítulo tiene menor número,
          // cambiar el existente a "upcoming"
          if (ch.status === "in-construction" && newEpisode < ch.episode) {
            return { ...ch, status: "upcoming" as const }
          }
          return ch
        })
      }

      // Determinar el estado del nuevo capítulo
      const newStatus = determineChapterStatus(updatedChaptersData[currentProject.id] || [], newEpisode)

      // Usar la siguiente imagen disponible del pool
      const selectedImage = availableGeneratedImages[imageIndex % availableGeneratedImages.length]
      imageIndex++

      const newChapterData: Chapter = {
        id: `ch-${Date.now()}`,
        title: newChapter.title,
        synopsis: newChapter.synopsis,
        image: selectedImage,
        duration: "40 min lectura",
        episode: newEpisode,
        status: newStatus,
      }

      // Actualizar la lista de capítulos
      setChaptersData({
        ...updatedChaptersData,
        [currentProject.id]: [...(updatedChaptersData[currentProject.id] || []), newChapterData],
      })

      setNewChapter({ title: "", synopsis: "", characters: [] })
      setIsCreatingChapter(false)
    }, 3000)
  }

  const handleCancelChapter = () => {
    setIsCreatingChapter(false)
    setShowImagePrompt(false)
    setNewChapter({ title: "", synopsis: "", characters: [] })
  }

  const handleCharacterSelect = (character: Character) => {
    setNewChapter((prev) => ({
      ...prev,
      characters: [...prev.characters, character],
    }))
  }

  const handleCharacterRemove = (characterId: string) => {
    setNewChapter((prev) => ({
      ...prev,
      characters: prev.characters.filter((char) => char.id !== characterId),
    }))
  }

  const getChapterStatusBadge = (status: Chapter["status"]) => {
    switch (status) {
      case "in-construction":
        return (
          <Badge className="bg-orange-600/20 text-orange-300 border-orange-500/30 text-xs">
            <Wrench className="h-3 w-3 mr-1" />
            En Construcción
          </Badge>
        )
      case "upcoming":
        return (
          <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Próximamente
          </Badge>
        )
      default:
        return null
    }
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md w-40 h-48 rounded-2xl flex items-center justify-center mx-auto mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <BookOpen className="h-20 w-20 text-purple-400" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">¡Crea tu Primera Historia!</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Comienza tu biblioteca personal y descubre cómo NovelCraft AI puede transformar tu proceso creativo.
          </p>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                <PlusCircle className="h-5 w-5 mr-2" />
                Crear Mi Primera Historia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl">Crear Nueva Historia</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Define los elementos básicos de tu nueva obra maestra.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div>
                  <Label htmlFor="title">Título de la Historia *</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Género</Label>
                  <Select onValueChange={(value) => setNewProject({ ...newProject, genre: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Selecciona un género" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={4}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProject} disabled={!newProject.title.trim()}>
                  Crear Historia
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  const hasBeenViewed = viewedProjects.has(currentProject.id)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section - Estilo Netflix */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center"
        style={{
          backgroundImage: `url(${getProjectBackground(currentProject.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Navigation Header - Hidden to use global header */}
        <div className="hidden absolute top-0 left-0 right-0 z-30 p-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">NovelCraft AI</h1>
                <p className="text-sm text-gray-300">Mi Biblioteca</p>
              </div>
            </motion.div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nueva Historia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Historia</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Define los elementos básicos de tu nueva obra maestra.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div>
                    <Label htmlFor="title">Título de la Historia *</Label>
                    <Input
                      id="title"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="genre">Género</Label>
                    <Select onValueChange={(value) => setNewProject({ ...newProject, genre: value })}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Selecciona un género" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows={4}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!newProject.title.trim()}>
                    Crear Historia
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Navigation Arrows */}
        {sortedProjects.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={prevProject}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={nextProject}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Book Cover */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            key={currentProject.id}
          >
            <div className="relative">
              <motion.div
                className="w-80 h-[480px] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={currentProject.coverImage || "/placeholder.svg"}
                  alt={currentProject.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-500/20 to-blue-500/20 blur-xl scale-110 -z-10" />
            </div>
          </motion.div>

          {/* Right Side - Project Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            key={`${currentProject.id}-info`}
          >
            <div>
              <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 mb-4">
                {currentProject.genre}
              </Badge>
              <h2 className="text-5xl font-bold mb-4 leading-tight">{currentProject.title}</h2>

              {/* Progress badge */}
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {currentProject.progress}% Completado
                </Badge>
              </div>

              {/* Descripción con efecto de escritura */}
              <div className="text-lg text-gray-300 leading-relaxed mb-6 max-w-lg min-h-[200px]">
                <TypewriterText
                  key={currentProject.id} // Forzar re-render cuando cambia el proyecto
                  text={currentProject.description}
                  delay={hasBeenViewed ? 0 : 800}
                  speed={hasBeenViewed ? 0 : 0.015}
                  skipAnimation={hasBeenViewed}
                  onScrollAccelerate={isScrolling && !hasBeenViewed}
                  onComplete={handleAnimationComplete}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={() => onProjectSelect(currentProject)}
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
              >
                <Play className="h-5 w-5 mr-2" />
                Continuar Escribiendo
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleExpandChapters}
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-white/5 px-8"
              >
                <Info className="h-5 w-5 mr-2" />
                Ver Capítulos
                {expandedChapters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            {/* Project Stats */}
            <div className="flex gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{currentProject.charactersCount}</div>
                <div className="text-sm text-gray-400">Personajes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{currentProject.chaptersCount}</div>
                <div className="text-sm text-gray-400">Capítulos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{currentProject.wordCount.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Palabras</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Project Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {sortedProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProjectIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentProjectIndex ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Chapters Section */}
      <AnimatePresence>
        {expandedChapters && currentChapters.length > 0 && (
          <motion.section
            ref={chaptersRef}
            className="bg-black/95 backdrop-blur-sm border-t border-white/10 px-6 py-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Capítulos</h3>
                <Button
                  variant="ghost"
                  onClick={() => setExpandedChapters(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid gap-4">
                {currentChapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    className="group flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Episode Number */}
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-xl font-bold text-gray-400 group-hover:text-white transition-colors">
                        {chapter.episode}
                      </span>
                    </div>

                    {/* Chapter Thumbnail */}
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 relative">
                      {chapter.isGenerating ? (
                        <motion.div
                          className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, ease: "linear" }}
                          onAnimationComplete={() => {
                            // Actualizar el capítulo para mostrar la imagen
                            setChaptersData((prev) => ({
                              ...prev,
                              [currentProject.id]: prev[currentProject.id].map((ch) =>
                                ch.id === chapter.id ? { ...ch, isGenerating: false } : ch,
                              ),
                            }))
                          }}
                        >
                          <Sparkles className="h-8 w-8 text-white" />
                        </motion.div>
                      ) : (
                        <img
                          src={chapter.image || "/placeholder.svg"}
                          alt={chapter.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {chapter.title}
                          </h4>
                          {getChapterStatusBadge(chapter.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{chapter.duration}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{chapter.synopsis}</p>
                    </div>

                    {/* Play Button */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}

                {/* New Chapter Creator */}
                <AnimatePresence>
                  {!isCreatingChapter ? (
                    <motion.div
                      className="group flex gap-4 p-4 rounded-xl border-2 border-dashed border-gray-600 hover:border-purple-400 transition-all duration-300 cursor-pointer"
                      onClick={handleStartNewChapter}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, borderColor: "#a855f7" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex-shrink-0 w-8 text-center">
                        <span className="text-xl font-bold text-gray-400 group-hover:text-purple-400 transition-colors">
                          {currentChapters.length + 1}
                        </span>
                      </div>

                      <div className="w-32 h-20 rounded-lg bg-gray-800/50 border-2 border-dashed border-gray-600 group-hover:border-purple-400 flex items-center justify-center transition-all duration-300">
                        <PlusCircle className="h-8 w-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
                      </div>

                      <div className="flex-1 min-w-0 flex items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-400 group-hover:text-purple-300 transition-colors">
                            Crear Nuevo Capítulo
                          </h4>
                          <p className="text-gray-500 text-sm">Haz clic para agregar un nuevo capítulo a tu historia</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="group flex gap-4 p-4 rounded-xl bg-white/5 border border-purple-500/30"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex-shrink-0 w-8 text-center">
                        <span className="text-xl font-bold text-purple-400">{currentChapters.length + 1}</span>
                      </div>

                      {/* Chapter Thumbnail - Clickable for image generation */}
                      <div
                        className="w-32 h-20 rounded-lg bg-gray-800 border-2 border-dashed border-purple-400 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300"
                        onClick={handleImageClick}
                      >
                        {newChapter.isGenerating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Loader2 className="h-6 w-6 text-purple-400" />
                          </motion.div>
                        ) : (
                          <Palette className="h-6 w-6 text-purple-400" />
                        )}
                      </div>

                      {/* Chapter Info - Editable */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <Input
                          placeholder="Título del capítulo..."
                          value={newChapter.title}
                          onChange={(e) => setNewChapter((prev) => ({ ...prev, title: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Textarea
                          placeholder="Descripción del capítulo..."
                          value={newChapter.synopsis}
                          onChange={(e) => setNewChapter((prev) => ({ ...prev, synopsis: e.target.value }))}
                          rows={2}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                        />

                        {/* Character Selector */}
                        <CharacterSelector
                          characters={currentProject.characters || []}
                          selectedCharacters={newChapter.characters}
                          onCharacterSelect={handleCharacterSelect}
                          onCharacterRemove={handleCharacterRemove}
                        />

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleCancelChapter}
                            variant="outline"
                            className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                          >
                            Cancelar
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleImageClick}
                            disabled={!newChapter.title.trim() || !newChapter.synopsis.trim()}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Crear Imagen
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* AI Image Prompt Panel */}
      <AnimatePresence>
        {showImagePrompt && (
          <motion.section
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-purple-500/30"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Generador de Imágenes IA</h3>
                  <p className="text-gray-400 text-sm">Personaliza el prompt para crear la imagen perfecta</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Prompt para la imagen:</Label>
                  <Textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={4}
                    className="bg-gray-800 border-gray-600 text-white resize-none"
                    placeholder="Describe la imagen que quieres generar..."
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowImagePrompt(false)}
                    className="border-gray-600 text-gray-400 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGenerateImage}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar Imagen
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Other Projects List - Hidden when creating chapter image */}
      <AnimatePresence>
        {!showImagePrompt && (
          <motion.section
            ref={projectsListRef}
            className="bg-black px-6 py-12"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: -15,
              filter: "blur(10px)",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold mb-8">Más Historias en tu Biblioteca</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {sortedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className={`group cursor-pointer transition-all duration-300 ${
                      index === currentProjectIndex ? "opacity-50 scale-95" : "hover:scale-105"
                    }`}
                    onClick={() => setCurrentProjectIndex(index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={index !== currentProjectIndex ? { y: -5 } : {}}
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={project.coverImage || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-white group-hover:text-purple-300 line-clamp-2 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">{project.genre}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Add New Project Card */}
                <motion.div
                  className="group cursor-pointer"
                  onClick={() => setIsCreateDialogOpen(true)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sortedProjects.length * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-600 group-hover:border-purple-400 transition-colors flex flex-col items-center justify-center bg-gray-900/50 group-hover:bg-purple-900/20">
                    <PlusCircle className="h-8 w-8 text-gray-400 group-hover:text-purple-400 transition-colors mb-2" />
                    <span className="text-xs text-gray-400 group-hover:text-purple-400 transition-colors text-center">
                      Nueva
                      <br />
                      Historia
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
