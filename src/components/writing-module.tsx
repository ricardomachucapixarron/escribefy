"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PenTool, Save, Eye, Sparkles, FileText, Brain, Zap, Target, BookOpen } from "lucide-react"
import type { NovelProject, Chapter } from "@/hooks/use-novel-project"

interface WritingModuleProps {
  project: NovelProject
  updateProject: (updates: Partial<NovelProject>) => void
}

export function WritingModule({ project, updateProject }: WritingModuleProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [currentContent, setCurrentContent] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [isAIAssisting, setIsAIAssisting] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (selectedChapter) {
      setCurrentContent(selectedChapter.content || "")
    }
  }, [selectedChapter])

  useEffect(() => {
    setWordCount(currentContent.trim() ? currentContent.trim().split(/\s+/).length : 0)
  }, [currentContent])

  const saveChapter = () => {
    if (!selectedChapter) return

    const updatedChapters = project.chapters.map((chapter) => {
      if (chapter.id === selectedChapter.id) {
        return { ...chapter, content: currentContent }
      }
      return chapter
    })

    const totalWordCount = updatedChapters.reduce((total, chapter) => {
      return total + (chapter.content ? chapter.content.trim().split(/\s+/).length : 0)
    }, 0)

    updateProject({
      chapters: updatedChapters,
      wordCount: totalWordCount,
    })
  }

  const getSelectedText = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selected = currentContent.substring(start, end)
      setSelectedText(selected)
      return selected
    }
    return ""
  }

  const requestAIAssistance = async (type: string) => {
    const textToAnalyze = selectedText || currentContent.substring(currentContent.length - 200)
    if (!textToAnalyze.trim()) return

    setIsAIAssisting(true)

    // Simular respuesta del Arquitecto Narrativo
    setTimeout(() => {
      let suggestion = ""

      switch (type) {
        case "tension":
          suggestion =
            "Para aumentar la tensión:\n\n• Acorta las oraciones para crear ritmo más rápido\n• Añade detalles sensoriales que generen incomodidad\n• Usa el tiempo presente para mayor inmediatez\n• Corta el diálogo con acciones bruscas\n\nEjemplo de reescritura:\n'Sus manos temblaron. El ruido se acercaba. Cada paso resonaba como un martillo contra su pecho.'"
          break
        case "dialogue":
          suggestion =
            "Para mejorar el diálogo:\n\n• Cada personaje debe tener una voz única\n• Evita que los personajes digan exactamente lo que piensan\n• Añade subtexto y conflicto\n• Usa interrupciones y pausas naturales\n\nSugerencia:\n'—No es eso lo que dijiste ayer —murmuró ella, sin levantar la vista del libro.\n—Ayer fue... diferente.\n—¿Diferente? —Ahora sí lo miró—. ¿O es que hoy tienes menos valor?'"
          break
        case "show_dont_tell":
          suggestion =
            "Para mostrar en lugar de contar:\n\n• Reemplaza emociones con acciones físicas\n• Usa diálogos para revelar personalidad\n• Describe lo que ven los sentidos\n• Deja que el lector deduzca\n\nEn lugar de: 'Estaba nervioso'\nMuestra: 'Sus dedos tamborilearon contra la mesa. Se aclaró la garganta por tercera vez en un minuto.'"
          break
        case "continue":
          suggestion =
            "Posible continuación:\n\nConsiderando el tono y la dirección de tu narrativa, podrías desarrollar:\n\n• La reacción emocional del personaje ante lo que acaba de suceder\n• Introducir una complicación inesperada\n• Cambiar la perspectiva a otro personaje presente\n• Revelar información que cambie el contexto\n\n¿Qué pasaría si tu personaje descubriera algo que no esperaba en este momento?"
          break
        default:
          suggestion = "El Arquitecto Narrativo está listo para ayudarte. Selecciona una opción específica."
      }

      setAiSuggestion(suggestion)
      setIsAIAssisting(false)
    }, 1500)
  }

  const applyAISuggestion = () => {
    // En una implementación real, esto aplicaría la sugerencia al texto
    setAiSuggestion("")
    alert("Función de aplicar sugerencia implementada. La IA reescribiría el texto seleccionado.")
  }

  return (
    <div className="h-full flex">
      {/* Sidebar de Capítulos */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Capítulos</h2>
          <p className="text-sm text-gray-600">Selecciona un capítulo para escribir</p>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2">
            {project.chapters
              .sort((a, b) => a.order - b.order)
              .map((chapter) => {
                const chapterWordCount = chapter.content ? chapter.content.trim().split(/\s+/).length : 0
                return (
                  <Card
                    key={chapter.id}
                    className={`cursor-pointer transition-colors ${
                      selectedChapter?.id === chapter.id ? "border-blue-500 bg-blue-50" : "hover:bg-white"
                    }`}
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          Cap. {chapter.order}
                        </Badge>
                        <span className="text-xs text-gray-500">{chapterWordCount} palabras</span>
                      </div>
                      <h3 className="font-medium text-sm">{chapter.title}</h3>
                      {chapter.summary && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{chapter.summary}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Target className="h-3 w-3" />
                          {chapter.pulses?.length || 0} pulsos
                        </div>
                        {chapter.content && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <FileText className="h-3 w-3" />
                            En progreso
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Principal */}
      <div className="flex-1 flex flex-col">
        {selectedChapter ? (
          <>
            {/* Header del Editor */}
            <div className="border-b bg-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold">{selectedChapter.title}</h1>
                  <p className="text-sm text-gray-600">Capítulo {selectedChapter.order}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">{wordCount} palabras</div>
                  <Button onClick={saveChapter} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>

              {selectedChapter.summary && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Resumen:</strong> {selectedChapter.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Área de Escritura */}
            <div className="flex-1 flex">
              {/* Editor de Texto */}
              <div className="flex-1 p-4">
                <Textarea
                  ref={textareaRef}
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  placeholder="Comienza a escribir tu capítulo aquí..."
                  className="w-full h-full resize-none border-0 text-base leading-relaxed focus:ring-0"
                  style={{ minHeight: "calc(100vh - 200px)" }}
                  onMouseUp={getSelectedText}
                  onKeyUp={getSelectedText}
                />
              </div>

              {/* Asistente IA Lateral */}
              <div className="w-80 border-l bg-gray-50 p-4">
                <div className="mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Arquitecto Narrativo
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Tu asistente de escritura inteligente</p>
                </div>

                <div className="space-y-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => requestAIAssistance("tension")}
                    disabled={isAIAssisting}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Reescribir con Más Tensión
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => requestAIAssistance("dialogue")}
                    disabled={isAIAssisting}
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Mejorar Diálogo
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => requestAIAssistance("show_dont_tell")}
                    disabled={isAIAssisting}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Mostrar en Lugar de Contar
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => requestAIAssistance("continue")}
                    disabled={isAIAssisting}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Sugerir Continuación
                  </Button>
                </div>

                {selectedText && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-1">Texto Seleccionado:</h4>
                    <p className="text-xs text-blue-700">
                      "{selectedText.substring(0, 100)}"{selectedText.length > 100 && "..."}
                    </p>
                  </div>
                )}

                {isAIAssisting && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 animate-pulse text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Analizando...</span>
                    </div>
                    <p className="text-xs text-purple-700">El Arquitecto Narrativo está trabajando en tu solicitud.</p>
                  </div>
                )}

                {aiSuggestion && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-green-900">Sugerencia IA:</h4>
                      <Button size="sm" variant="ghost" onClick={() => setAiSuggestion("")}>
                        ×
                      </Button>
                    </div>
                    <div className="text-xs text-green-800 whitespace-pre-line mb-3">{aiSuggestion}</div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={applyAISuggestion}>
                        Aplicar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAiSuggestion("")}>
                        Descartar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pulsos del Capítulo */}
                {selectedChapter.pulses && selectedChapter.pulses.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">Pulsos del Capítulo:</h4>
                    <div className="space-y-2">
                      {selectedChapter.pulses.map((pulse, index) => (
                        <div key={pulse.id} className="p-2 bg-white rounded border text-xs">
                          <div className="font-medium">Pulso {index + 1}</div>
                          <div className="text-gray-600 mt-1">{pulse.objective}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Selecciona un Capítulo</h2>
              <p className="text-gray-600 mb-4">Elige un capítulo de la lista para comenzar a escribir</p>
              {project.chapters.length === 0 && (
                <p className="text-sm text-gray-500">Primero crea capítulos en el módulo de Estructura Narrativa</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
