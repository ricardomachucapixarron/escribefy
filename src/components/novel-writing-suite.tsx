"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Brain, Download, Settings, Sparkles, Home, Users, MapPin, ChevronDown, ChevronUp, MessageCircle, Play, Pause, GitBranch, Activity, Layers } from "lucide-react"
import { ProjectDashboard } from "@/components/project-dashboard"
import { DossierModule } from "@/components/dossier-module"
import { ChapterWriter } from "@/components/chapter-writer"
import { useProjects, type Project } from "@/hooks/use-projects"

interface NovelWritingSuiteProps {
  project: Project
  onBackToProjects: () => void
}

export function NovelWritingSuite({ project, onBackToProjects }: NovelWritingSuiteProps) {
  const { updateProject } = useProjects()
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Estado para controlar qué sidebar está visible
  const [activeSidebar, setActiveSidebar] = useState<'left' | 'none'>('left')
  
  // Estado para la navegación principal
  const [activeNavItem, setActiveNavItem] = useState('capitulos')
  
  // Estado para el acordeón del sidebar derecho (solo chat sessions)
  const [expandedSections, setExpandedSections] = useState({
    globalPlanning: false,
    actDevelopment: false,
    chapterWork: false,
    decisionHistory: false,
    architectAgent: false,
    criticAgent: false,
    scientistAgent: false
  })
  
  // Estado para el acordeón del sidebar izquierdo
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState({
    chapters: true,
    agents: false,
    characters: false,
    locations: false,
    factions: false
  })
  
  // Estado para el editor de capítulos
  const [selectedChapterId, setSelectedChapterId] = useState<number | undefined>()
  
  const toggleSection = (sectionId: keyof typeof expandedSections) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = prev[sectionId]
      
      if (isCurrentlyExpanded) {
        // Si está expandida, solo cerrarla
        return {
          ...prev,
          [sectionId]: false
        }
      } else {
        // Si está cerrada, cerrar todas las demás y abrir esta
        return {
          globalPlanning: false,
          actDevelopment: false,
          chapterWork: false,
          decisionHistory: false,
          architectAgent: false,
          criticAgent: false,
          scientistAgent: false,
          [sectionId]: true
        }
      }
    })
  }
  
  const toggleLeftSection = (sectionId: keyof typeof leftSidebarExpanded) => {
    setLeftSidebarExpanded(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }
  

  
  const handleChapterSelect = (chapterId: number) => {
    console.log('Capítulo seleccionado:', chapterId)
    setSelectedChapterId(chapterId)
    setActiveModule('writing')
  }
  
  const handleChapterSave = (chapterId: number, content: string, wordCount: number) => {
    // Aquí se podría actualizar el proyecto con el contenido del capítulo
    console.log(`Guardando capítulo ${chapterId}:`, { content, wordCount })
  }

  // Datos de capítulos
  const chaptersData = [
    { id: 1, title: "El Despertar", status: "completed", wordCount: 2500 },
    { id: 2, title: "Primeros Pasos", status: "in-progress", wordCount: 1800 },
    { id: 3, title: "El Encuentro", status: "draft", wordCount: 500 },
    { id: 4, title: "Revelaciones", status: "planned", wordCount: 0 },
    { id: 5, title: "La Batalla Final", status: "planned", wordCount: 0 }
  ]

  // Elementos de navegación principal
  const navigationItems = [
    {
      id: 'capitulos',
      name: 'Capítulos',
      icon: BookOpen,
      description: 'Gestión de capítulos'
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: MessageCircle,
      description: 'Sesiones de chat con IA'
    },
    {
      id: 'esquema',
      name: 'Esquema',
      icon: Layers,
      description: 'Estructura narrativa'
    },
    {
      id: 'dossier',
      name: 'Dossier',
      icon: Users,
      description: 'Personajes y ubicaciones'
    },
    {
      id: 'historia',
      name: 'Historia',
      icon: Activity,
      description: 'Historial y actividad del proyecto'
    }
  ]

  const modules = [
    {
      id: "dashboard",
      name: "Inicio",
      description: "Vista General del Proyecto",
      icon: Home,
      color: "bg-indigo-500",
    },
    {
      id: "dossier",
      name: "El Dossier",
      description: "La Biblia de tu Historia",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      id: "structure",
      name: "Estructura Narrativa",
      description: "Planificación y Organización",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      id: "agents",
      name: "Agentes IA",
      description: "Ecosistema de Críticos Especializados",
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      id: "writing",
      name: "Escritura",
      description: "Editor Inteligente",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      id: "export",
      name: "Exportación",
      description: "Formatos Profesionales",
      icon: Download,
      color: "bg-teal-500",
    },
  ]

  const handleNavigateToModule = (moduleId: string) => {
    setActiveModule(moduleId)
  }

  const handleSuggestDetail = (type: string, name: string) => {
    console.log(`Suggesting detail for ${type}: ${name}`)
  }

  // Ensure project has required properties with defaults
  const safeProject = {
    ...project,
    wordCount: project.wordCount || 0,
    characters: project.characters || [],
    locations: project.locations || [],
    chaptersCount: project.chaptersCount || 0,
    charactersCount: project.charactersCount || 0,
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Main Navigation Sidebar */}
      <aside className="w-20 bg-black/98 backdrop-blur-sm border-r border-white/10 flex flex-col items-center py-4 z-40">
        <div className="space-y-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNavItem === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveNavItem(item.id)}
                className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title={item.description}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-l-full" />
                )}
              </button>
            )
          })}
        </div>
      </aside>



      {/* Left Sidebar - Chapters */}
      {activeSidebar === 'left' && (
        <aside 
          className="w-96 bg-black/95 backdrop-blur-sm border-r border-white/10 overflow-y-auto scrollbar-hide relative group"
          onScroll={(e) => {
            const target = e.currentTarget;
            const scrollIndicator = target.querySelector('.scroll-indicator') as HTMLElement;
            if (scrollIndicator) {
              const hasMoreContent = target.scrollTop + target.clientHeight < target.scrollHeight - 10;
              scrollIndicator.style.opacity = hasMoreContent ? '1' : '0';
            }
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            const scrollIndicator = target.querySelector('.scroll-indicator') as HTMLElement;
            if (scrollIndicator) {
              const hasMoreContent = target.scrollTop + target.clientHeight < target.scrollHeight - 10;
              scrollIndicator.style.opacity = hasMoreContent ? '1' : '0';
            }
          }}
        >
        {/* Floating Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 pointer-events-none z-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 border border-white/20">
            <ChevronDown className="h-4 w-4 text-white/70 animate-bounce" />
          </div>
        </div>
        <div className="p-4">
          
          {/* Contenido dinámico según navegación principal */}
          {activeNavItem === 'capitulos' && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Capítulos</h3>
              <div className="space-y-2">
                {chaptersData.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter.id)}
                    className="w-full group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-8 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={`/chapter-images/ecos-ch${chapter.id}.png`}
                          alt={`Capítulo ${chapter.id}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                            Capítulo {chapter.id}
                          </h4>
                          <div className={`w-2 h-2 rounded-full ${
                            chapter.status === 'completed' ? 'bg-green-500' :
                            chapter.status === 'in-progress' ? 'bg-yellow-500' :
                            chapter.status === 'draft' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                        </div>
                        <p className="text-xs text-gray-300 mb-1 line-clamp-1">{chapter.title}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="capitalize">{chapter.status.split('-').join(' ')}</span>
                          <span>{chapter.wordCount} palabras</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeNavItem === 'chat' && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Sesiones de Chat</h3>
              
              {/* Chat Sessions Accordion */}
              <div className="space-y-3">
                {/* Global Planning Sessions */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('globalPlanning')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-semibold text-white">Planificación Global</span>
                      <span className="text-xs text-gray-400">(2)</span>
                    </div>
                    {expandedSections.globalPlanning ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.globalPlanning && (
                    <div className="p-3 space-y-2 bg-black/20">
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-green-400">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Play className="h-3 w-3 text-green-400" />
                              <span className="text-xs font-medium text-white">Worldbuilding</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">2</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex -space-x-1">
                            <img src="/agent-avatars/arquitecto.png" alt="Arquitecto" className="w-4 h-4 rounded-full border border-black" />
                            <img src="/agent-avatars/cientifico.png" alt="Científico" className="w-4 h-4 rounded-full border border-black" />
                          </div>
                          <span className="text-xs text-gray-400">12 decisiones</span>
                        </div>
                      </div>
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-yellow-400">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Pause className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs font-medium text-white">Arcos narrativos</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">1</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex -space-x-1">
                            <img src="/agent-avatars/arquitecto.png" alt="Arquitecto" className="w-4 h-4 rounded-full border border-black" />
                          </div>
                          <span className="text-xs text-gray-400">Esperando decisión</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Act Development Sessions */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('actDevelopment')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-semibold text-white">Desarrollo por Actos</span>
                      <span className="text-xs text-gray-400">(1)</span>
                    </div>
                    {expandedSections.actDevelopment ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.actDevelopment && (
                    <div className="p-3 space-y-2 bg-black/20">
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-green-400">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Play className="h-3 w-3 text-green-400" />
                              <span className="text-xs font-medium text-white">Acto I (Caps 1-3)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">1</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex -space-x-1">
                            <img src="/agent-avatars/arquitecto.png" alt="Arquitecto" className="w-4 h-4 rounded-full border border-black" />
                            <img src="/agent-avatars/critica.png" alt="Crítico" className="w-4 h-4 rounded-full border border-black" />
                          </div>
                          <span className="text-xs text-gray-400">Transiciones</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chapter Work Sessions */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('chapterWork')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-semibold text-white">Trabajo por Capítulos</span>
                      <span className="text-xs text-gray-400">(1)</span>
                    </div>
                    {expandedSections.chapterWork ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.chapterWork && (
                    <div className="p-3 space-y-2 bg-black/20">
                      <div className="group p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-green-400">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Play className="h-3 w-3 text-green-400" />
                                  <span className="text-xs font-medium text-white">Cap 3 - Primera batalla</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">2</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <div className="flex -space-x-1">
                                <img src="/agent-avatars/critica.png" alt="Crítico" className="w-4 h-4 rounded-full border border-black" />
                                <img src="/agent-avatars/editor.png" alt="Editor" className="w-4 h-4 rounded-full border border-black" />
                              </div>
                              <span className="text-xs text-gray-400">Refinando diálogos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decision History Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('decisionHistory')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-semibold text-white">Historial de Decisiones</span>
                      <span className="text-xs text-gray-400">(8)</span>
                    </div>
                    {expandedSections.decisionHistory ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.decisionHistory && (
                    <div className="p-3 space-y-2 bg-black/20">
                      {[
                        {
                          id: 1,
                          decision: "Sistema de magia basado en cristales",
                          date: "2024-01-15",
                          impact: "Worldbuilding",
                          status: "accepted"
                        },
                        {
                          id: 2,
                          decision: "Protagonista con amnesia parcial",
                          date: "2024-01-14",
                          impact: "Personaje principal",
                          status: "accepted"
                        },
                        {
                          id: 3,
                          decision: "Cambiar final del capítulo 2",
                          date: "2024-01-13",
                          impact: "Capítulo 2",
                          status: "pending"
                        }
                      ].map((decision) => (
                        <div key={decision.id} className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-medium text-white truncate">{decision.decision}</h5>
                              <p className="text-xs text-gray-400 truncate">{decision.impact} • {decision.date}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              decision.status === 'accepted' ? 'bg-green-500' :
                              decision.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* El Arquitecto Narrativo - Individual Agent Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('architectAgent')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src="/agent-avatars/arquitecto-narrativo.png"
                          alt="Arquitecto"
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black bg-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white">El Arquitecto Narrativo</span>
                        <p className="text-xs text-gray-400">Estructura y Coherencia</p>
                      </div>
                      <span className="text-xs text-gray-400">(3)</span>
                    </div>
                    {expandedSections.architectAgent ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.architectAgent && (
                    <div className="p-3 space-y-2 bg-black/20">
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-blue-400">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">Estructura general</span>
                          <span className="text-xs text-gray-400">Ayer</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Revisión de arcos narrativos</p>
                      </div>
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-green-400">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">Coherencia temporal</span>
                          <span className="text-xs text-gray-400">2 días</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Timeline de eventos</p>
                      </div>
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-purple-400">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">Worldbuilding</span>
                          <span className="text-xs text-gray-400">3 días</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Sistema de magia</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* La Crítica Literaria - Individual Agent Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('criticAgent')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src="/agent-avatars/critico-despiadado.png"
                          alt="Crítica"
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black bg-yellow-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white">La Crítica Literaria</span>
                        <p className="text-xs text-gray-400">Análisis y Mejora</p>
                      </div>
                      <span className="text-xs text-gray-400">(2)</span>
                    </div>
                    {expandedSections.criticAgent ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.criticAgent && (
                    <div className="p-3 space-y-2 bg-black/20">
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-red-400">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">Revisión de diálogos</span>
                          <span className="text-xs text-gray-400">Activo</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Capítulo 3 - Escena de confrontación</p>
                      </div>
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-orange-400">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">Análisis de personajes</span>
                          <span className="text-xs text-gray-400">1 día</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Desarrollo del protagonista</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* El Científico - Individual Agent Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleSection('scientistAgent')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src="/agent-avatars/fisico-teorico.png"
                          alt="Físico Teórico"
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black bg-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white">El Físico Teórico</span>
                        <p className="text-xs text-gray-400">Consistencia Científica</p>
                      </div>
                      <span className="text-xs text-gray-400">(1)</span>
                    </div>
                    {expandedSections.scientistAgent ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {expandedSections.scientistAgent && (
                    <div className="p-3 space-y-2 bg-black/20">
                      <div className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border-l-2 border-cyan-400">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-white">Física del mundo</span>
                          <span className="text-xs text-gray-400">2 días</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Leyes de la magia cristalina</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeNavItem === 'esquema' && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white mb-4">Esquema</h3>
              <div className="text-sm text-gray-400">
                Estructura narrativa se mostrará aquí
              </div>
            </div>
          )}
          
          {activeNavItem === 'dossier' && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Dossier</h3>
              
              <div className="space-y-3">
                {/* Agents Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleLeftSection('agents')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-semibold text-white">Agentes IA</span>
                      <span className="text-xs text-gray-400">(3)</span>
                    </div>
                    {leftSidebarExpanded.agents ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {leftSidebarExpanded.agents && (
                    <div className="p-3 space-y-2 bg-black/20">
                      {[
                        {
                          id: 1,
                          name: "El Arquitecto Narrativo",
                          role: "Estructura y Coherencia",
                          avatar: "/agent-avatars/arquitecto-narrativo.png",
                          status: "online"
                        },
                        {
                          id: 2,
                          name: "La Crítica Literaria",
                          role: "Análisis y Mejora",
                          avatar: "/agent-avatars/critico-despiadado.png",
                          status: "busy"
                        },
                        {
                          id: 3,
                          name: "El Físico Teórico",
                          role: "Consistencia Científica",
                          avatar: "/agent-avatars/fisico-teorico.png",
                          status: "online"
                        }
                      ].map((agent) => (
                        <div key={agent.id} className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <img
                                src={agent.avatar || "/placeholder.svg"}
                                alt={agent.name}
                                className="w-8 h-8 rounded-full object-cover border border-white/20"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                                agent.status === 'online' ? 'bg-green-500' :
                                agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-medium text-white truncate">{agent.name}</h5>
                              <p className="text-xs text-gray-400 truncate">{agent.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Characters Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleLeftSection('characters')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-semibold text-white">Personajes</span>
                      <span className="text-xs text-gray-400">({safeProject.characters.length})</span>
                    </div>
                    {leftSidebarExpanded.characters ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {leftSidebarExpanded.characters && (
                    <div className="p-3 space-y-2 bg-black/20">
                      {safeProject.characters.map((character) => (
                        <div key={character.id} className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <img
                              src={character.image || "/placeholder.svg"}
                              alt={character.name}
                              className="w-8 h-8 rounded-full object-cover border border-white/20"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-medium text-white truncate">{character.name}</h5>
                              <p className="text-xs text-gray-400 truncate">{character.role || character.faction || 'Personaje'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Locations Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleLeftSection('locations')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-semibold text-white">Lugares</span>
                      <span className="text-xs text-gray-400">(3)</span>
                    </div>
                    {leftSidebarExpanded.locations ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {leftSidebarExpanded.locations && (
                    <div className="p-3 space-y-2 bg-black/20">
                      {[
                        {
                          id: 1,
                          name: "Reino de las Sombras",
                          type: "Reino",
                          image: "/location-images/reino-sombras.png"
                        },
                        {
                          id: 2,
                          name: "Templo Cristalino",
                          type: "Templo",
                          image: "/location-images/templo-cristalino.png"
                        },
                        {
                          id: 3,
                          name: "Nexo de Realidades",
                          type: "Portal",
                          image: "/location-images/nexo-realidades.png"
                        }
                      ].map((location) => (
                        <div key={location.id} className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                              <img
                                src={location.image || "/placeholder.svg"}
                                alt={location.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-medium text-white truncate">{location.name}</h5>
                              <p className="text-xs text-gray-400 truncate">{location.type}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Factions Section */}
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm">
                  <button
                    onClick={() => toggleLeftSection('factions')}
                    className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">Facciones</span>
                      <span className="text-xs text-gray-400">(3)</span>
                    </div>
                    {leftSidebarExpanded.factions ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </button>
                  {leftSidebarExpanded.factions && (
                    <div className="p-3 space-y-2 bg-black/20">
                      {[
                        {
                          id: 1,
                          name: "Tejedores de Luz",
                          type: "Orden Antigua",
                          color: "bg-blue-500/20 text-blue-400",
                          members: 12
                        },
                        {
                          id: 2,
                          name: "Reino Oscuro",
                          type: "Imperio",
                          color: "bg-red-500/20 text-red-400",
                          members: 8
                        },
                        {
                          id: 3,
                          name: "Los Rebeldes",
                          type: "Resistencia",
                          color: "bg-green-500/20 text-green-400",
                          members: 15
                        }
                      ].map((faction) => (
                        <div key={faction.id} className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${faction.color}`}>
                              <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-medium text-white truncate">{faction.name}</h5>
                              <p className="text-xs text-gray-400 truncate">{faction.type} - {faction.members} miembros</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeNavItem === 'historia' && (
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Historia del Proyecto</h3>
              
              <div className="space-y-4">
                {/* Timeline de cambios */}
                <div className="relative">
                  {/* Línea vertical del timeline */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>
                  
                  <div className="space-y-6">
                    {/* Cambio reciente - Sistema de magia cristalina */}
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full border-2 border-black">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Sistema de Magia Definido</h4>
                          <span className="text-xs text-gray-400">Hace 2 horas</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">El Físico Teórico estableció las leyes de la magia cristalina: los cristales almacenan energía temporal y permiten manipular ecos del pasado</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">Magia</span>
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Worldbuilding</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/agent-avatars/fisico-teorico.png" alt="Físico Teórico" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">Físico Teórico</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Modificado:</strong> Dossier → Sistema de Magia, Capítulos 1-3 → Referencias actualizadas
                        </div>
                      </div>
                    </div>

                    {/* Cambio - Conflicto principal */}
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-red-500 rounded-full border-2 border-black">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Conflicto Central Establecido</h4>
                          <span className="text-xs text-gray-400">Hace 4 horas</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">El Arquitecto Narrativo definió el conflicto: los ecos del pasado están desapareciendo, amenazando la memoria colectiva de la humanidad</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">Conflicto</span>
                            <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded">Trama</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/agent-avatars/arquitecto-narrativo.png" alt="Arquitecto" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">Arquitecto</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Modificado:</strong> Esquema → Arco narrativo principal, Todos los capítulos → Motivaciones actualizadas
                        </div>
                      </div>
                    </div>

                    {/* Cambio - Personalidad del protagonista */}
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-green-500 rounded-full border-2 border-black">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Personalidad de Kira Refinada</h4>
                          <span className="text-xs text-gray-400">Hace 6 horas</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">La Crítica Literaria ajustó la personalidad de Kira: más introspectiva y con trauma por la pérdida de sus propios recuerdos</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Personaje</span>
                            <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">Psicología</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/agent-avatars/critico-despiadado.png" alt="Crítica" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">Crítica Literaria</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Modificado:</strong> Dossier → Perfil de Kira, Capítulos 1-2 → Diálogos internos
                        </div>
                      </div>
                    </div>

                    {/* Cambio - Nuevo personaje */}
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full border-2 border-black">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Nuevo Personaje: Dr. Thorne</h4>
                          <span className="text-xs text-gray-400">Hace 8 horas</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">El Arquitecto sugirió añadir al Dr. Thorne, científico que descubrió la tecnología de cristales pero ahora se opone a su uso</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">Personaje</span>
                            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">Antagonista</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/agent-avatars/arquitecto-narrativo.png" alt="Arquitecto" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">Arquitecto</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Modificado:</strong> Dossier → Nuevo personaje añadido, Capítulo 4 → Primera aparición planificada
                        </div>
                      </div>
                    </div>

                    {/* Cambio - Ubicación clave */}
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-teal-500 rounded-full border-2 border-black">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Laboratorio Subterráneo Añadido</h4>
                          <span className="text-xs text-gray-400">Hace 12 horas</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">El Físico Teórico diseñó un laboratorio oculto donde se realizaron los primeros experimentos con cristales temporales</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 text-xs bg-teal-500/20 text-teal-400 rounded">Ubicación</span>
                            <span className="px-2 py-1 text-xs bg-gray-500/20 text-gray-400 rounded">Historia</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/agent-avatars/fisico-teorico.png" alt="Físico" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">Físico Teórico</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Modificado:</strong> Dossier → Nueva ubicación, Capítulo 3 → Escena de descubrimiento
                        </div>
                      </div>
                    </div>

                    {/* Cambio - Tema central */}
                    <div className="relative flex items-start gap-4">
                      <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full border-2 border-black">
                        <Brain className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">Tema Central: Memoria e Identidad</h4>
                          <span className="text-xs text-gray-400">Hace 1 día</span>
                        </div>
                        <p className="text-xs text-gray-300 mb-2">La Crítica Literaria estableció el tema central: cómo nuestros recuerdos definen quiénes somos y qué pasa cuando los perdemos</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded">Tema</span>
                            <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-400 rounded">Filosofía</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img src="/agent-avatars/critico-despiadado.png" alt="Crítica" className="w-4 h-4 rounded-full" />
                            <span className="text-xs text-gray-400">Crítica Literaria</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          <strong>Modificado:</strong> Esquema → Temas principales, Todos los capítulos → Subtexto añadido
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas del proyecto */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-4">Estadísticas del Proyecto</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-lg font-bold text-purple-400">6</div>
                      <div className="text-xs text-gray-400">Decisiones narrativas</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-lg font-bold text-green-400">5</div>
                      <div className="text-xs text-gray-400">Capítulos planificados</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-lg font-bold text-blue-400">3</div>
                      <div className="text-xs text-gray-400">Agentes colaborando</div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <div className="text-lg font-bold text-orange-400">4,800</div>
                      <div className="text-xs text-gray-400">Palabras escritas</div>
                    </div>
                  </div>
                  
                  {/* Progreso del worldbuilding */}
                  <div className="mt-6">
                    <h5 className="text-xs font-semibold text-white mb-3">Progreso del Worldbuilding</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Sistema de Magia</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-400">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Personajes Principales</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-3/5 h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-400">60%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Conflicto Central</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-red-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-400">100%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">Ubicaciones</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-teal-500 rounded-full"></div>
                          </div>
                          <span className="text-xs text-gray-400">40%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          


        </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Background Image for Dashboard */}
        {activeModule === "dashboard" && selectedChapterId && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: `url('/chapter-images/ecos-ch${selectedChapterId}.png')`,
              filter: 'blur(1px)'
            }}
          />
        )}
        
        {activeModule === "dashboard" && (
          <div className="relative z-10">
            <ProjectDashboard project={safeProject} onNavigateToModule={handleNavigateToModule} />
          </div>
        )}
        {activeModule === "dossier" && (
          <DossierModule
            characters={safeProject.characters}
            locations={safeProject.locations}
            onSuggestDetail={handleSuggestDetail}
          />
        )}
        {activeModule === "structure" && (
          <div className="p-6 pt-24">
            <h2 className="text-2xl font-bold mb-4 text-white">Estructura Narrativa</h2>
            <p className="text-gray-300">Módulo en desarrollo...</p>
          </div>
        )}
        {activeModule === "agents" && (
          <div className="p-6 pt-24">
            <h2 className="text-2xl font-bold mb-4 text-white">Agentes IA</h2>
            <p className="text-gray-300">Módulo en desarrollo...</p>
          </div>
        )}
        {activeModule === "writing" && (
          <ChapterWriter
            project={safeProject}
            selectedChapterId={selectedChapterId}
            onChapterSelect={handleChapterSelect}
            onSave={handleChapterSave}
          />
        )}
        {activeModule === "export" && (
          <div className="p-6 pt-24">
            <h2 className="text-2xl font-bold mb-4 text-white">Exportación</h2>
            <p className="text-gray-300">Módulo en desarrollo...</p>
          </div>
        )}
      </main>


    </div>
  )
}
