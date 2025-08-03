"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Gavel, Users, Atom, Eye, AlertTriangle, Send, Bot } from "lucide-react"
import type { NovelProject } from "@/hooks/use-novel-project"

interface AIAgentsModuleProps {
  project: NovelProject
}

interface AgentAnalysis {
  id: string
  agentType: string
  content: string
  analysis: string
  timestamp: Date
}

export function AIAgentsModule({ project }: AIAgentsModuleProps) {
  const [selectedText, setSelectedText] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<string>("")
  const [analyses, setAnalyses] = useState<AgentAnalysis[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<string>("")
  const [readerProfile, setReaderProfile] = useState<string>("")

  const agents = [
    {
      id: "arquitecto",
      name: "Arquitecto Narrativo",
      description: "Analiza coherencia global y estructura narrativa",
      icon: Brain,
      color: "bg-purple-500",
      prompt:
        "Actúa como un arquitecto narrativo experto. Analiza la coherencia de la trama, la consistencia de los personajes y la estructura narrativa de este fragmento.",
    },
    {
      id: "politico",
      name: "Cientista Político",
      description: "Evalúa sistemas de gobierno y conflictos políticos",
      icon: Users,
      color: "bg-blue-500",
      prompt:
        "Actúa como un cientista político experto y analiza si la estructura de poder y los conflictos políticos descritos en este texto son creíbles y coherentes.",
    },
    {
      id: "abogado",
      name: "Abogado",
      description: "Revisa procedimientos legales y terminología jurídica",
      icon: Gavel,
      color: "bg-green-500",
      prompt:
        "Actúa como un abogado penalista experto y revisa si los procedimientos legales, crímenes, investigaciones y terminología jurídica en este texto son precisos.",
    },
    {
      id: "fisico",
      name: "Físico Teórico",
      description: "Analiza plausibilidad científica y tecnológica",
      icon: Atom,
      color: "bg-cyan-500",
      prompt:
        "Actúa como un físico teórico y divulgador científico. Analiza la plausibilidad de la tecnología, conceptos de física y su consistencia con las reglas establecidas.",
    },
    {
      id: "critico",
      name: "Crítico Estricto",
      description: "Señala debilidades narrativas sin contemplaciones",
      icon: AlertTriangle,
      color: "bg-red-500",
      prompt:
        "Actúa como el crítico literario más severo y exigente. Analiza este texto y señala cada una de sus fallas: clichés, ritmo lento, diálogos débiles, inconsistencias.",
    },
  ]

  const readerProfiles = [
    {
      id: "romance",
      label: "Lector de Romance",
      description: "Busca desarrollo de relaciones y química entre personajes",
    },
    {
      id: "scifi",
      label: "Fan del Hard Sci-Fi",
      description: "Valora la precisión científica y worldbuilding detallado",
    },
    {
      id: "fantasy",
      label: "Lector de Fantasía Épica",
      description: "Disfruta de sistemas de magia complejos y aventuras épicas",
    },
    {
      id: "thriller",
      label: "Lector de Thriller",
      description: "Busca tensión constante y giros argumentales",
    },
    {
      id: "casual",
      label: "Lector Casual",
      description: "Busca entretenimiento fácil de seguir",
    },
    {
      id: "young_adult",
      label: "Lector Joven Adulto",
      description: "Busca protagonistas relacionables y coming-of-age",
    },
  ]

  const analyzeWithAgent = async () => {
    if (!selectedText || !selectedAgent) return

    setIsAnalyzing(true)

    // Simular análisis de IA
    const agent = agents.find((a) => a.id === selectedAgent)
    if (!agent) return

    // Simular respuesta del agente
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(selectedAgent, selectedText)

      const newAnalysis: AgentAnalysis = {
        id: Date.now().toString(),
        agentType: agent.name,
        content: selectedText,
        analysis: mockAnalysis,
        timestamp: new Date(),
      }

      setAnalyses([newAnalysis, ...analyses])
      setIsAnalyzing(false)
    }, 2000)
  }

  const analyzeWithReader = async () => {
    if (!selectedChapter || !readerProfile) return

    setIsAnalyzing(true)

    const chapter = project.chapters.find((c) => c.id === selectedChapter)
    if (!chapter) return

    const profile = readerProfiles.find((p) => p.id === readerProfile)
    if (!profile) return

    // Simular análisis del lector
    setTimeout(() => {
      const mockReaderAnalysis = generateMockReaderAnalysis(readerProfile, chapter.title)

      const newAnalysis: AgentAnalysis = {
        id: Date.now().toString(),
        agentType: `Lector: ${profile.label}`,
        content: `Capítulo: ${chapter.title}`,
        analysis: mockReaderAnalysis,
        timestamp: new Date(),
      }

      setAnalyses([newAnalysis, ...analyses])
      setIsAnalyzing(false)
    }, 2000)
  }

  const generateMockAnalysis = (agentType: string, text: string): string => {
    switch (agentType) {
      case "arquitecto":
        return "ANÁLISIS ARQUITECTÓNICO:\n\n✅ FORTALEZAS:\n- La progresión del conflicto es coherente\n- Los personajes mantienen sus motivaciones establecidas\n- El ritmo narrativo es adecuado\n\n⚠️ OBSERVACIONES:\n- Considera reforzar la conexión entre esta escena y el arco principal\n- El diálogo podría revelar más subtexto\n\n💡 SUGERENCIAS:\n- Añade una referencia sutil al sistema de magia establecido\n- El momento de revelación podría tener mayor impacto emocional"

      case "politico":
        return "ANÁLISIS POLÍTICO:\n\n✅ REALISMO POLÍTICO:\n- La estructura de poder descrita es creíble\n- Las motivaciones políticas son consistentes\n- Los conflictos de interés están bien planteados\n\n⚠️ CONSIDERACIONES:\n- La reacción del pueblo ante estas decisiones podría ser más realista\n- Falta considerar las consecuencias económicas\n\n💡 RECOMENDACIONES:\n- Incluye más matices en las alianzas políticas\n- Los personajes políticos necesitan motivaciones más complejas"

      case "abogado":
        return "ANÁLISIS LEGAL:\n\n✅ PRECISIÓN JURÍDICA:\n- Los procedimientos descritos son generalmente correctos\n- La terminología legal es apropiada\n\n⚠️ INCONSISTENCIAS:\n- El proceso de interrogatorio omite derechos fundamentales\n- La evidencia presentada no seguiría la cadena de custodia\n- Los tiempos procesales son irreales\n\n💡 CORRECCIONES SUGERIDAS:\n- Incluye la lectura de derechos Miranda\n- Especifica quién encontró la evidencia y cómo\n- Los juicios no se resuelven tan rápidamente"

      case "fisico":
        return "ANÁLISIS CIENTÍFICO:\n\n✅ PLAUSIBILIDAD:\n- Los conceptos básicos son sólidos\n- La tecnología es internamente consistente\n\n⚠️ PROBLEMAS CIENTÍFICOS:\n- La velocidad superlumínica viola la relatividad especial\n- No se explica cómo se evita la paradoja de la información\n- La energía requerida sería astronómica\n\n💡 SOLUCIONES POSIBLES:\n- Considera usar agujeros de gusano en lugar de velocidad FTL\n- Establece limitaciones energéticas claras\n- Explica el mecanismo de navegación cuántica"

      case "critico":
        return "CRÍTICA DESPIADADA:\n\n❌ FALLAS GRAVES:\n- Cliché predecible: el mentor muere justo cuando más se necesita\n- Diálogo expositivo forzado: los personajes explican cosas que ya saben\n- Deus ex machina flagrante: la solución aparece de la nada\n- Ritmo inconsistente: acelera sin justificación\n\n❌ PROBLEMAS TÉCNICOS:\n- Cambios de POV sin transición\n- Descripción excesiva que ralentiza la acción\n- Personajes actúan fuera de carácter\n\n❌ VEREDICTO:\n- Este capítulo necesita una reescritura completa\n- La tensión dramática es artificial\n- Los lectores predecirán cada giro"

      default:
        return "Análisis no disponible para este agente."
    }
  }

  const generateMockReaderAnalysis = (profile: string, chapterTitle: string): string => {
    switch (profile) {
      case "romance":
        return `REACCIÓN COMO LECTORA DE ROMANCE:\n\n💕 ME ENCANTÓ:\n- La tensión sexual entre los protagonistas está perfecta\n- Ese momento cuando se rozan las manos... ¡Mi corazón!\n- El conflicto interno de ella es muy realista\n\n😔 ME FRUSTRÓ:\n- ¿Por qué no se besan YA? La tensión me mata\n- Él es demasiado obtuso con las señales\n- Necesito más momentos íntimos\n\n🔥 QUIERO MÁS:\n- Sus diálogos cargados de subtexto son adictivos\n- La química es palpable\n- Espero que el próximo capítulo tenga MUCHA más interacción romántica`

      case "scifi":
        return `ANÁLISIS COMO FAN DEL HARD SCI-FI:\n\n⭐ EXCELENTE:\n- El worldbuilding tecnológico es sólido\n- Las implicaciones sociales de la IA están bien exploradas\n- Los detalles técnicos no son abrumadores pero sí convincentes\n\n🤔 DUDAS TÉCNICAS:\n- ¿Cómo exactamente funciona la interfaz neural?\n- La paradoja temporal necesita más explicación\n- Los efectos secundarios de la modificación genética son vagos\n\n💡 EXPECTATIVAS:\n- Espero más exploración de las consecuencias éticas\n- La ciencia debe mantenerse consistente\n- Necesito entender mejor las limitaciones tecnológicas`

      case "fantasy":
        return `REACCIÓN COMO LECTOR DE FANTASÍA ÉPICA:\n\n⚔️ ¡ÉPICO!\n- La batalla fue increíblemente visual\n- El sistema de magia tiene reglas claras\n- Los dragones se sienten reales y amenazantes\n\n🏰 WORLDBUILDING:\n- La política entre reinos es compleja e interesante\n- Las diferentes razas tienen culturas distintivas\n- La historia antigua añade profundidad\n\n🔮 QUIERO SABER MÁS:\n- ¿Qué otros poderes mágicos existen?\n- ¿Cómo se relacionan los dioses con los mortales?\n- ¿Qué secretos oculta la profecía antigua?`

      default:
        return "Análisis de lector no disponible para este perfil."
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agentes de IA Especializados</h1>
        <p className="text-gray-600">Recibe feedback profesional desde múltiples perspectivas especializadas.</p>
      </div>

      <Tabs defaultValue="critics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="critics">Agentes Críticos</TabsTrigger>
          <TabsTrigger value="readers">Simulador de Lectores</TabsTrigger>
        </TabsList>

        <TabsContent value="critics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Panel de Análisis */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Texto</CardTitle>
                <CardDescription>Selecciona un fragmento y elige un agente para analizarlo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Texto a Analizar</label>
                  <Textarea
                    placeholder="Pega aquí el fragmento de texto que quieres que analice..."
                    value={selectedText}
                    onChange={(e) => setSelectedText(e.target.value)}
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Agente Especializado</label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un agente crítico" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          <div className="flex items-center gap-2">
                            <agent.icon className="h-4 w-4" />
                            {agent.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={analyzeWithAgent}
                  disabled={!selectedText || !selectedAgent || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Bot className="h-4 w-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar para Análisis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Agentes Disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Agentes Especializados</CardTitle>
                <CardDescription>Cada agente ofrece una perspectiva única</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents.map((agent) => {
                    const Icon = agent.icon
                    return (
                      <div
                        key={agent.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedAgent === agent.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-md ${agent.color}`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="readers" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Simulador de Audiencia */}
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Lectores</CardTitle>
                <CardDescription>Simula la reacción de diferentes tipos de lectores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Capítulo a Evaluar</label>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un capítulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {project.chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          Cap. {chapter.order}: {chapter.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Perfil de Lector</label>
                  <Select value={readerProfile} onValueChange={setReaderProfile}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un perfil de lector" />
                    </SelectTrigger>
                    <SelectContent>
                      {readerProfiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {readerProfile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      {readerProfiles.find((p) => p.id === readerProfile)?.description}
                    </p>
                  </div>
                )}
                <Button
                  onClick={analyzeWithReader}
                  disabled={!selectedChapter || !readerProfile || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Eye className="h-4 w-4 mr-2 animate-spin" />
                      Leyendo...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Simular Lectura
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Perfiles de Lectores */}
            <Card>
              <CardHeader>
                <CardTitle>Perfiles de Lectores</CardTitle>
                <CardDescription>Diferentes audiencias, diferentes perspectivas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readerProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        readerProfile === profile.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setReaderProfile(profile.id)}
                    >
                      <h3 className="font-medium">{profile.label}</h3>
                      <p className="text-sm text-gray-600">{profile.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Historial de Análisis */}
      {analyses.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Historial de Análisis ({analyses.length})</CardTitle>
            <CardDescription>Todos los análisis realizados por los agentes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            {analysis.agentType}
                          </CardTitle>
                          <CardDescription>{analysis.timestamp.toLocaleString()}</CardDescription>
                        </div>
                        <Badge variant="outline">Completado</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Texto Analizado:</h4>
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            {analysis.content.length > 150
                              ? `${analysis.content.substring(0, 150)}...`
                              : analysis.content}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Análisis:</h4>
                          <div className="bg-white border p-3 rounded text-sm whitespace-pre-line">
                            {analysis.analysis}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
