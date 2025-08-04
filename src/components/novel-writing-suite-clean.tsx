"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Brain, Download, Settings, Sparkles, ArrowLeft, Home, Menu, X, Users, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { ProjectDashboard } from "@/components/project-dashboard"
import { DossierModule } from "@/components/dossier-module"
import { useProjects, type Project } from "@/hooks/use-projects"

interface NovelWritingSuiteProps {
  project: Project
  onBackToProjects: () => void
}

export function NovelWritingSuite({ project, onBackToProjects }: NovelWritingSuiteProps) {
  const { updateProject } = useProjects()
  const [activeModule, setActiveModule] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Estado para el acordeón del sidebar derecho
  const [expandedSections, setExpandedSections] = useState({
    agents: true,
    characters: false,
    locations: false,
    factions: false
  })
  
  const toggleSection = (sectionId: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

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
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Chapters */}
      <aside className="w-64 bg-black/95 backdrop-blur-sm border-r border-white/10 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToProjects}
              className="text-white hover:text-gray-300 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-white truncate">{project.title}</h1>
              <p className="text-xs text-gray-400">{project.author}</p>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-4">Capítulos</h3>
          
          <div className="space-y-2">
            {[
              { id: 1, title: "El Despertar", status: "completed", wordCount: 2500 },
              { id: 2, title: "Sombras del Pasado", status: "in-progress", wordCount: 1800 },
              { id: 3, title: "El Primer Encuentro", status: "draft", wordCount: 0 },
              { id: 4, title: "Revelaciones", status: "planned", wordCount: 0 },
              { id: 5, title: "La Batalla Final", status: "planned", wordCount: 0 }
            ].map((chapter) => (
              <div key={chapter.id} className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                    Capítulo {chapter.id}
                  </h4>
                  <div className={`w-2 h-2 rounded-full ${
                    chapter.status === 'completed' ? 'bg-green-500' :
                    chapter.status === 'in-progress' ? 'bg-yellow-500' :
                    chapter.status === 'draft' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                </div>
                <p className="text-xs text-gray-300 mb-2 line-clamp-1">{chapter.title}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="capitalize">{chapter.status.split('-').join(' ')}</span>
                  <span>{chapter.wordCount} palabras</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Modules */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-sm font-semibold text-white mb-3">Módulos</h4>
            <div className="space-y-1">
              {modules.map((module) => {
                const Icon = module.icon
                const isActive = activeModule === module.id
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium truncate">{module.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeModule === "dashboard" && (
          <ProjectDashboard project={safeProject} onNavigateToModule={handleNavigateToModule} />
        )}
        {activeModule === "dossier" && (
          <DossierModule
            characters={safeProject.characters}
            locations={safeProject.locations}
            onSuggestDetail={handleSuggestDetail}
          />
        )}
        {activeModule === "structure" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Estructura Narrativa</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        )}
        {activeModule === "agents" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Agentes IA</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        )}
        {activeModule === "writing" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Escritura</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        )}
        {activeModule === "export" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Exportación</h2>
            <p className="text-gray-600">Módulo en desarrollo...</p>
          </div>
        )}
      </main>

      {/* Right Sidebar - Accordion with Entities */}
      <aside className="w-80 bg-black/95 backdrop-blur-sm border-l border-white/10 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-4">Entidades</h3>
          
          {/* Accordion Sections */}
          <div className="space-y-2">
            {/* Agents Section */}
            <div className="border border-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('agents')}
                className="w-full flex items-center justify-between p-3 bg-black/40 hover:bg-black/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">Agentes IA</span>
                  <span className="text-xs text-gray-400">(3)</span>
                </div>
                {expandedSections.agents ? 
                  <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                }
              </button>
              {expandedSections.agents && (
                <div className="p-3 space-y-2 bg-black/20">
                  {[
                    {
                      id: 1,
                      name: "El Arquitecto Narrativo",
                      role: "Estructura y Coherencia",
                      avatar: "/agent-avatars/arquitecto.png",
                      status: "online"
                    },
                    {
                      id: 2,
                      name: "La Crítica Literaria",
                      role: "Análisis y Mejora",
                      avatar: "/agent-avatars/critica.png",
                      status: "busy"
                    },
                    {
                      id: 3,
                      name: "El Científico",
                      role: "Consistencia Técnica",
                      avatar: "/agent-avatars/cientifico.png",
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
            <div className="border border-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('characters')}
                className="w-full flex items-center justify-between p-3 bg-black/40 hover:bg-black/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-semibold text-white">Personajes</span>
                  <span className="text-xs text-gray-400">(3)</span>
                </div>
                {expandedSections.characters ? 
                  <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                }
              </button>
              {expandedSections.characters && (
                <div className="p-3 space-y-2 bg-black/20">
                  {[
                    {
                      id: 1,
                      name: "Lyra Shadowweaver",
                      role: "Protagonista",
                      avatar: "/character-portraits/lyra.png"
                    },
                    {
                      id: 2,
                      name: "Kael Nightbane",
                      role: "Antagonista",
                      avatar: "/character-portraits/kael.png"
                    },
                    {
                      id: 3,
                      name: "Aria Stormwind",
                      role: "Aliada",
                      avatar: "/character-portraits/aria.png"
                    }
                  ].map((character) => (
                    <div key={character.id} className="group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <img
                          src={character.avatar || "/placeholder.svg"}
                          alt={character.name}
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium text-white truncate">{character.name}</h5>
                          <p className="text-xs text-gray-400 truncate">{character.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Section */}
            <div className="border border-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('locations')}
                className="w-full flex items-center justify-between p-3 bg-black/40 hover:bg-black/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-semibold text-white">Lugares</span>
                  <span className="text-xs text-gray-400">(3)</span>
                </div>
                {expandedSections.locations ? 
                  <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                }
              </button>
              {expandedSections.locations && (
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
            <div className="border border-white/20 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('factions')}
                className="w-full flex items-center justify-between p-3 bg-black/40 hover:bg-black/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">Facciones</span>
                  <span className="text-xs text-gray-400">(3)</span>
                </div>
                {expandedSections.factions ? 
                  <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                }
              </button>
              {expandedSections.factions && (
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
      </aside>
    </div>
  )
}
