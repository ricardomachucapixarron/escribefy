"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Clock, TrendingUp, BookOpen, Users, MapPin, FileText } from "lucide-react"
import type { Project } from "@/hooks/use-projects"

interface ProjectDashboardProps {
  project: Project
  onNavigateToModule: (moduleId: string) => void
}

interface AgentConversation {
  id: string
  agentId: string
  agentName: string
  agentAvatar: string
  agentRole: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  tone: "professional" | "critical" | "encouraging" | "analytical" | "creative"
}

export function ProjectDashboard({ project, onNavigateToModule }: ProjectDashboardProps) {
  // Safe access to project properties with defaults
  const safeProject = {
    ...project,
    wordCount: project.wordCount || 0,
    characters: project.characters || [],
    locations: project.locations || [],
    chaptersCount: project.chaptersCount || 0,
    charactersCount: project.charactersCount || 0,
    progress: project.progress || 0,
  }

  const getCoverImage = (projectId: string) => {
    const coverMap: Record<string, string> = {
      "reino-sombras": "/book-covers/reino-sombras.png",
      "ecos-manana": "/book-covers/ecos-manana.png",
      "corazones-conflicto": "/book-covers/corazones-conflicto.png",
    }
    return coverMap[projectId] || "/placeholder.svg?height=400&width=300&text=Portada"
  }

  // Conversaciones dummy con personalidad de cada agente
  const recentConversations: AgentConversation[] = [
    {
      id: "conv-1",
      agentId: "arquitecto",
      agentName: "Arquitecto Narrativo",
      agentAvatar: "/agent-avatars/arquitecto-narrativo.png",
      agentRole: "Guía Narrativo Principal",
      lastMessage:
        "He notado que el arco de Lyra en el capítulo 3 necesita más desarrollo emocional. Su transformación se siente apresurada. Te sugiero explorar más su conflicto interno antes del momento de revelación. ¿Qué opinas de añadir una escena donde dude de sus nuevos poderes?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      messageCount: 23,
      tone: "professional",
    },
    {
      id: "conv-2",
      agentId: "critico",
      agentName: "Crítico Despiadado",
      agentAvatar: "/agent-avatars/critico-despiadado.png",
      agentRole: "Análisis Sin Contemplaciones",
      lastMessage:
        "Seamos honestos: ese diálogo en la página 47 es puro relleno. 'Tenemos que salvar el reino' - ¿en serio? Es el cliché más trillado del género. Los lectores merecen algo más original. Reescríbelo con subtexto real o elimínalo completamente.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      messageCount: 8,
      tone: "critical",
    },
    {
      id: "conv-3",
      agentId: "fisico",
      agentName: "Dr. Físico Teórico",
      agentAvatar: "/agent-avatars/fisico-teorico.png",
      agentRole: "Consultor Científico",
      lastMessage:
        "Fascinante tu sistema de magia basado en líneas ley. Sin embargo, la transferencia de energía que describes violaría la conservación. Te propongo una solución: ¿y si la magia extrae energía del vacío cuántico? Esto explicaría las limitaciones y el agotamiento de los magos.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
      messageCount: 15,
      tone: "analytical",
    },
  ]

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "critical":
        return "text-red-600"
      case "encouraging":
        return "text-green-600"
      case "analytical":
        return "text-blue-600"
      case "creative":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getToneBadge = (tone: string) => {
    switch (tone) {
      case "critical":
        return "Crítico"
      case "encouraging":
        return "Motivador"
      case "analytical":
        return "Analítico"
      case "creative":
        return "Creativo"
      default:
        return "Profesional"
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Book Cover and Synopsis Section */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Book Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl mb-4">
              <img
                src={getCoverImage(safeProject.id) || "/placeholder.svg"}
                alt={`Portada de ${safeProject.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{safeProject.title}</h2>
              {safeProject.genre && (
                <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">{safeProject.genre}</Badge>
              )}
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <span className="text-sm font-bold text-purple-600">{safeProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${safeProject.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Synopsis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Sinopsis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {safeProject.description ||
                  "Una historia épica que transportará a los lectores a un mundo lleno de magia, aventura y personajes inolvidables. Cada página revela nuevos secretos y desafíos que pondrán a prueba el coraje y la determinación de nuestros protagonistas."}
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigateToModule("dossier")}
            >
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{safeProject.charactersCount}</div>
                <div className="text-sm text-gray-600">Personajes</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigateToModule("structure")}
            >
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{safeProject.chaptersCount}</div>
                <div className="text-sm text-gray-600">Capítulos</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigateToModule("dossier")}
            >
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{safeProject.locations.length}</div>
                <div className="text-sm text-gray-600">Lugares</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigateToModule("writing")}
            >
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{safeProject.wordCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Palabras</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversaciones Recientes con Agentes IA
          </CardTitle>
          <CardDescription>Últimas interacciones con tu equipo de expertos virtuales</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <div key={conversation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Agent Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={conversation.agentAvatar || "/placeholder.svg"}
                        alt={conversation.agentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>

                    {/* Conversation Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{conversation.agentName}</h4>
                          <Badge variant="outline" className={getToneColor(conversation.tone)}>
                            {getToneBadge(conversation.tone)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {conversation.timestamp.toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{conversation.agentRole}</p>

                      <p className="text-gray-800 leading-relaxed mb-3">{conversation.lastMessage}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{conversation.messageCount} mensajes en total</span>
                        <Button size="sm" variant="outline">
                          Continuar Conversación
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
