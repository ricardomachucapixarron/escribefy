"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, PlusCircle, Edit, Sparkles, FileText, Target, Zap, CheckCircle } from "lucide-react"
import type { NovelProject, Chapter, ChapterPulse } from "@/hooks/use-novel-project"

interface StructureModuleProps {
  project: NovelProject
  updateProject: (updates: Partial<NovelProject>) => void
}

export function StructureModule({ project, updateProject }: StructureModuleProps) {
  const [newChapter, setNewChapter] = useState<Partial<Chapter>>({})
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [newPulse, setNewPulse] = useState<Partial<ChapterPulse>>({})
  const [isPulseDialogOpen, setIsPulseDialogOpen] = useState(false)

  const narrativeStructures = [
    "El Viaje del Héroe",
    "Estructura de Tres Actos",
    "Estructura de Cinco Actos",
    "Estructura de Siete Actos",
    "Estructura No Lineal",
    "Estructura Personalizada",
  ]

  const narratorTypes = [
    "Primera Persona",
    "Tercera Persona Omnisciente",
    "Tercera Persona Limitada",
    "Segunda Persona",
    "Múltiples Narradores",
  ]

  const addChapter = () => {
    if (!newChapter.title) return

    const chapter: Chapter = {
      id: Date.now().toString(),
      title: newChapter.title,
      summary: newChapter.summary,
      content: "",
      pulses: [],
      order: project.chapters.length + 1,
    }

    updateProject({
      chapters: [...project.chapters, chapter],
    })

    setNewChapter({})
    setIsChapterDialogOpen(false)
  }

  const addPulse = () => {
    if (!selectedChapter || !newPulse.objective) return

    const pulse: ChapterPulse = {
      id: Date.now().toString(),
      objective: newPulse.objective,
      conflict: newPulse.conflict || "",
      result: newPulse.result || "",
    }

    const updatedChapters = project.chapters.map((chapter) => {
      if (chapter.id === selectedChapter.id) {
        return {
          ...chapter,
          pulses: [...(chapter.pulses || []), pulse],
        }
      }
      return chapter
    })

    updateProject({ chapters: updatedChapters })
    setNewPulse({})
    setIsPulseDialogOpen(false)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(project.chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const reorderedChapters = items.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
    }))

    updateProject({ chapters: reorderedChapters })
  }

  const suggestChapterStructure = async () => {
    // Aquí implementaríamos la llamada al Arquitecto Narrativo
    alert(
      "El Arquitecto Narrativo sugiere: 'Considera dividir el capítulo 3 en dos partes para mejorar el ritmo narrativo.'",
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Estructura Narrativa</h1>
        <p className="text-gray-600">Planifica y organiza la arquitectura de tu historia.</p>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Configuración del Narrador */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Narrador</CardTitle>
            <CardDescription>Define el tipo de narrador y su voz única</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="narratorType">Tipo de Narrador</Label>
                <Select
                  value={project.narratorType || ""}
                  onValueChange={(value) => updateProject({ narratorType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de narrador" />
                  </SelectTrigger>
                  <SelectContent>
                    {narratorTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="structure">Estructura Narrativa</Label>
                <Select value={project.structure || ""} onValueChange={(value) => updateProject({ structure: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la estructura" />
                  </SelectTrigger>
                  <SelectContent>
                    {narrativeStructures.map((structure) => (
                      <SelectItem key={structure} value={structure}>
                        {structure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="narratorVoice">Voz del Narrador</Label>
              <Textarea
                id="narratorVoice"
                placeholder="Describe el tono, estilo y personalidad del narrador..."
                value={project.narratorVoice || ""}
                onChange={(e) => updateProject({ narratorVoice: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vista de Capítulos */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Capítulos ({project.chapters.length})</CardTitle>
                <CardDescription>Organiza tu historia capítulo a capítulo</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={suggestChapterStructure} variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sugerir Estructura
                </Button>
                <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nuevo Capítulo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Capítulo</DialogTitle>
                      <DialogDescription>Define los elementos básicos del capítulo.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="chapterTitle">Título del Capítulo *</Label>
                        <Input
                          id="chapterTitle"
                          value={newChapter.title || ""}
                          onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                          placeholder="Ej: La Llamada a la Aventura"
                        />
                      </div>
                      <div>
                        <Label htmlFor="chapterSummary">Resumen</Label>
                        <Textarea
                          id="chapterSummary"
                          value={newChapter.summary || ""}
                          onChange={(e) => setNewChapter({ ...newChapter, summary: e.target.value })}
                          placeholder="¿Qué sucede en este capítulo?"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={addChapter}>Crear Capítulo</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="chapters">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {project.chapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter, index) => (
                        <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-shadow ${snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"}`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <Badge variant="outline">Cap. {chapter.order}</Badge>
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{chapter.title}</h3>
                                    {chapter.summary && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {chapter.summary.substring(0, 120)}
                                        {chapter.summary.length > 120 && "..."}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {chapter.pulses?.length || 0} pulsos
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        ~{chapter.content?.split(" ").length || 0} palabras
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => setSelectedChapter(chapter)}>
                                      Ver Pulsos
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {/* Panel de Pulsos del Capítulo */}
        {selectedChapter && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pulsos del Capítulo: {selectedChapter.title}</CardTitle>
                  <CardDescription>Escenas clave y momentos de tensión</CardDescription>
                </div>
                <Dialog open={isPulseDialogOpen} onOpenChange={setIsPulseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Nuevo Pulso
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Pulso</DialogTitle>
                      <DialogDescription>Define un momento clave en el capítulo.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="pulseObjective">Objetivo *</Label>
                        <Input
                          id="pulseObjective"
                          value={newPulse.objective || ""}
                          onChange={(e) => setNewPulse({ ...newPulse, objective: e.target.value })}
                          placeholder="¿Qué se busca lograr en esta escena?"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pulseConflict">Conflicto</Label>
                        <Textarea
                          id="pulseConflict"
                          value={newPulse.conflict || ""}
                          onChange={(e) => setNewPulse({ ...newPulse, conflict: e.target.value })}
                          placeholder="¿Qué obstáculo o tensión surge?"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pulseResult">Resultado</Label>
                        <Textarea
                          id="pulseResult"
                          value={newPulse.result || ""}
                          onChange={(e) => setNewPulse({ ...newPulse, result: e.target.value })}
                          placeholder="¿Cómo se resuelve o qué consecuencias tiene?"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsPulseDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={addPulse}>Crear Pulso</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedChapter.pulses?.map((pulse, index) => (
                  <Card key={pulse.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Pulso {index + 1}</h4>
                          <div className="mt-2 space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Objetivo:</span>
                              <p className="text-sm text-gray-600">{pulse.objective}</p>
                            </div>
                            {pulse.conflict && (
                              <div>
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  Conflicto:
                                </span>
                                <p className="text-sm text-gray-600">{pulse.conflict}</p>
                              </div>
                            )}
                            {pulse.result && (
                              <div>
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Resultado:
                                </span>
                                <p className="text-sm text-gray-600">{pulse.result}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay pulsos definidos para este capítulo.</p>
                    <p className="text-sm">Agrega pulsos para estructurar las escenas clave.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
