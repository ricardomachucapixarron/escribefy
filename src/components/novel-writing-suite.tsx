"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Brain, Download, Settings, Sparkles, ArrowLeft, Home, Menu, X } from "lucide-react"
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
      description: "Redacción y Edición",
      icon: Settings,
      color: "bg-orange-500",
    },
    {
      id: "export",
      name: "Exportación",
      description: "Formatos Profesionales",
      icon: Download,
      color: "bg-red-500",
    },
  ]

  const handleUpdateProject = (updates: Partial<Project>) => {
    updateProject(project.id, updates)
  }

  const handleNavigateToModule = (moduleId: string) => {
    setActiveModule(moduleId)
  }

  const handleSuggestDetail = (item: any, field: string) => {
    console.log(`Suggesting detail for ${item.name} in field ${field}`)
    alert(
      "El Arquitecto Narrativo sugiere: 'Considera agregar más detalles específicos para enriquecer este elemento.'",
    )
  }

  // Safe access to project properties with defaults
  const safeProject = {
    ...project,
    wordCount: project.wordCount || 0,
    characters: project.characters || [],
    locations: project.locations || [],
    chaptersCount: project.chaptersCount || 0,
    charactersCount: project.charactersCount || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBackToProjects}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Mis Proyectos
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{safeProject.title}</h1>
                <p className="text-sm text-gray-500">Suite Profesional de Escritura</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {safeProject.genre && (
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                {safeProject.genre}
              </Badge>
            )}
            <Badge variant="outline" className="text-green-600 border-green-600">
              {safeProject.wordCount.toLocaleString()} palabras
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <nav
          className={`${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-gray-200 p-4 transition-all duration-300 relative`}
        >
          {/* Collapse Toggle */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeModule === module.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                  title={sidebarCollapsed ? module.name : undefined}
                >
                  <div className={`p-2 rounded-md ${module.color} flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <div className="font-medium">{module.name}</div>
                      <div className="text-xs text-gray-500">{module.description}</div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Project Stats */}
          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Estadísticas del Proyecto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Personajes:</span>
                  <span className="font-medium">{safeProject.charactersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capítulos:</span>
                  <span className="font-medium">{safeProject.chaptersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Palabras:</span>
                  <span className="font-medium">{safeProject.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lugares:</span>
                  <span className="font-medium">{safeProject.locations.length}</span>
                </div>
              </div>
            </div>
          )}
        </nav>

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
      </div>
    </div>
  )
}
