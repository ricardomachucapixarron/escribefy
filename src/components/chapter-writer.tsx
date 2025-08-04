"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BookOpen, 
  Save, 
  Eye, 
  EyeOff, 
  Type, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  Clock,
  FileText,
  Target
} from "lucide-react"
import type { Project } from "@/hooks/use-projects"

interface Chapter {
  id: number
  title: string
  status: "completed" | "in-progress" | "draft" | "planned"
  wordCount: number
  content?: string
  synopsis?: string
  image?: string
}

interface ChapterWriterProps {
  project: Project
  selectedChapterId?: number
  onChapterSelect: (chapterId: number) => void
  onSave: (chapterId: number, content: string, wordCount: number) => void
}

export function ChapterWriter({ project, selectedChapterId, onChapterSelect, onSave }: ChapterWriterProps) {
  const [chapters] = useState<Chapter[]>([
    { 
      id: 1, 
      title: "El Despertar", 
      status: "completed", 
      wordCount: 2500,
      synopsis: "Lyra descubre sus poderes mágicos en una noche tormentosa que cambiará su destino para siempre.",
      image: "/chapter-images/el-despertar.png",
      content: "La tormenta rugía sobre el pequeño pueblo de Valdris cuando Lyra sintió por primera vez el poder corriendo por sus venas..."
    },
    { 
      id: 2, 
      title: "Sombras del Pasado", 
      status: "in-progress", 
      wordCount: 1800,
      synopsis: "Los secretos familiares salen a la luz mientras Lyra busca respuestas sobre su verdadero origen.",
      image: "/chapter-images/sombras-pasado.png",
      content: "El diario de su abuela revelaba verdades que Lyra nunca había imaginado. Cada página era una puerta a un pasado oculto..."
    },
    { 
      id: 3, 
      title: "El Primer Encuentro", 
      status: "draft", 
      wordCount: 0,
      synopsis: "Lyra conoce a Kael, el misterioso extraño que la ayudará en su búsqueda, pero ¿puede confiar en él?",
      image: "/chapter-images/primer-encuentro.png",
      content: ""
    },
    { 
      id: 4, 
      title: "Revelaciones", 
      status: "planned", 
      wordCount: 0,
      synopsis: "La verdad sobre el Reino de las Sombras se revela, y Lyra debe tomar una decisión que cambiará todo.",
      image: "/chapter-images/revelaciones.png",
      content: ""
    },
    { 
      id: 5, 
      title: "La Batalla Final", 
      status: "planned", 
      wordCount: 0,
      synopsis: "El enfrentamiento definitivo entre la luz y la oscuridad. El destino de ambos mundos está en juego.",
      image: "/chapter-images/batalla-final.png",
      content: ""
    }
  ])

  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(
    selectedChapterId ? chapters.find(ch => ch.id === selectedChapterId) || chapters[0] : chapters[0]
  )
  const [content, setContent] = useState(currentChapter?.content || "")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter)
    setContent(chapter.content || "")
    onChapterSelect(chapter.id)
    updateWordCount(chapter.content || "")
  }

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    updateWordCount(newContent)
  }

  const handleSave = () => {
    if (currentChapter) {
      onSave(currentChapter.id, content, wordCount)
      // Update local chapter data
      const updatedChapter = { ...currentChapter, content, wordCount }
      setCurrentChapter(updatedChapter)
    }
  }

  const insertFormatting = (before: string, after: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newContent)
    handleContentChange(newContent)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const getChapterBackground = (chapterId: number) => {
    const backgrounds: Record<number, string> = {
      1: "/chapter-images/el-despertar.png",
      2: "/chapter-images/sombras-pasado.png", 
      3: "/chapter-images/primer-encuentro.png",
      4: "/chapter-images/revelaciones.png",
      5: "/chapter-images/batalla-final.png"
    }
    return backgrounds[chapterId] || "/placeholder.svg?height=400&width=600&text=Capítulo"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'draft': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado'
      case 'in-progress': return 'En Progreso'
      case 'draft': return 'Borrador'
      default: return 'Planeado'
    }
  }

  if (!currentChapter) return null

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section with Chapter Background */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${getChapterBackground(currentChapter.id)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Navigation Header */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{currentChapter.title}</h1>
                <p className="text-sm text-gray-300">Editor de Capítulo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className={`text-white border-white/30 ${getStatusColor(currentChapter.status)}/20`}>
                {getStatusText(currentChapter.status)}
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400 bg-green-500/10">
                {wordCount} palabras
              </Badge>
              <Button 
                onClick={handleSave}
                className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30"
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 pt-24 max-w-7xl mx-auto w-full flex gap-6">


          {/* Main Editor */}
          <div className="flex-1">
            <Card className="bg-black/40 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Editor de Texto
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="text-white hover:bg-white/10"
                    >
                      {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isPreviewMode ? 'Editar' : 'Vista Previa'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isPreviewMode && (
                  <>
                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-white/5 rounded-lg mb-4 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('**', '**')}
                        className="text-white hover:bg-white/10"
                        title="Negrita"
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('*', '*')}
                        className="text-white hover:bg-white/10"
                        title="Cursiva"
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('_', '_')}
                        className="text-white hover:bg-white/10"
                        title="Subrayado"
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                      <div className="w-px h-6 bg-white/20 mx-2" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('> ', '')}
                        className="text-white hover:bg-white/10"
                        title="Cita"
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('- ', '')}
                        className="text-white hover:bg-white/10"
                        title="Lista"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertFormatting('1. ', '')}
                        className="text-white hover:bg-white/10"
                        title="Lista numerada"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Text Editor */}
                    <Textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Comienza a escribir tu capítulo aquí..."
                      className="min-h-[500px] bg-black/20 border-white/20 text-white placeholder:text-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </>
                )}

                {isPreviewMode && (
                  <div className="min-h-[500px] p-4 bg-black/20 rounded-lg border border-white/20">
                    <div className="prose prose-invert max-w-none">
                      {content ? (
                        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                          {content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4">
                              {paragraph || '\u00A0'}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No hay contenido para mostrar...</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>Palabras: {wordCount}</span>
                    <span>Caracteres: {content.length}</span>
                    <span>Párrafos: {content.split('\n\n').filter(p => p.trim()).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Guardado automáticamente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
