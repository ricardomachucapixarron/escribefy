"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, PlusCircle, BookOpen, Heart, Zap, Users, Feather, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Character } from "@/hooks/use-projects"

interface RelationshipPopupProps {
  isOpen: boolean
  onClose: () => void
  character1: Character
  character2: Character
}

interface RelationshipData {
  type: string
  description: string
  sharedLocation: string
  keyMoments: Array<{
    page: number
    excerpt: string
    context: string
  }>
}

// Componente para animación de escritura
const TypewriterText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  return (
    <motion.span className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + index * 0.02,
            duration: 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

export function RelationshipPopup({ isOpen, onClose, character1, character2 }: RelationshipPopupProps) {
  const [newChapterTitle, setNewChapterTitle] = useState("")

  // Datos simulados de la relación
  const relationshipData: RelationshipData = {
    type: "Alianza Romántica",
    description:
      "Lyra y Kael comenzaron como extraños con objetivos diferentes, pero su destino los unió en una alianza que se ha convertido en algo más profundo. Ella representa la magia ancestral y él la fuerza de la justicia. Juntos equilibran luz y sombra, creando una conexión única que trasciende sus diferencias de origen.",
    sharedLocation: "Bosque Susurrante",
    keyMoments: [
      {
        page: 23,
        excerpt:
          "Kael observó cómo las sombras danzaban alrededor de Lyra, pero en lugar de temerle, sintió una extraña fascinación...",
        context: "Primer encuentro en las ruinas",
      },
      {
        page: 67,
        excerpt:
          "—No puedes hacer esto sola —murmuró Kael, tomando su mano. Las runas de Lyra brillaron más intensamente al contacto.",
        context: "Momento de confianza mutua",
      },
      {
        page: 89,
        excerpt:
          "Sus poderes se complementaron perfectamente: la luz de él purificando las sombras de ella, creando algo completamente nuevo.",
        context: "Primera colaboración mágica",
      },
      {
        page: 134,
        excerpt:
          "Lyra se acercó a Kael herido, sus ojos violetas llenos de lágrimas. 'No te atrevas a dejarme', susurró.",
        context: "Momento de vulnerabilidad",
      },
    ],
  }

  const getCharacterFullBodyImage = (characterId: string) => {
    const imageMap: Record<string, string> = {
      "char-1": "/character-fullbody/lyra-fullbody.png",
      "char-2": "/character-fullbody/kael-fullbody.png",
    }
    return imageMap[characterId] || "/placeholder.svg?height=400&width=200&text=Personaje"
  }

  const getSharedLocationBackground = (location: string) => {
    const backgroundMap: Record<string, string> = {
      "Bosque Susurrante": "/location-backgrounds/enchanted-forest-bg.png",
      "Ciudad de Umbraluna": "/location-backgrounds/moonlit-city-bg.png",
      "Fortaleza de Acero": "/location-backgrounds/steel-fortress-bg.png",
    }
    return backgroundMap[location] || "/location-backgrounds/mystical-landscape-bg.png"
  }

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case "Alianza Romántica":
        return <Heart className="h-5 w-5 text-amber-700" />
      case "Rivalidad":
        return <Zap className="h-5 w-5 text-red-800" />
      case "Amistad":
        return <Users className="h-5 w-5 text-blue-800" />
      default:
        return <Users className="h-5 w-5 text-gray-700" />
    }
  }

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) return
    alert(`Nuevo capítulo creado: "${newChapterTitle}" con ${character1.name} y ${character2.name}`)
    setNewChapterTitle("")
  }

  // Variantes de animación más elegantes y editoriales
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }

  const characterVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header con estilo editorial */}
            <motion.div
              className="relative z-10 px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-2 bg-amber-100 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {getRelationshipIcon(relationshipData.type)}
                  </motion.div>
                  <div>
                    <TypewriterText
                      text={`${character1.name} & ${character2.name}`}
                      className="text-2xl font-serif font-bold text-gray-800"
                      delay={0.3}
                    />
                    <motion.p
                      className="text-amber-700 font-medium mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      Análisis de Relación Narrativa
                    </motion.p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Character Portraits - Estilo más editorial */}
            <motion.div
              className="relative z-10 flex justify-between items-center px-12 py-8 bg-gradient-to-b from-gray-50 to-white"
              variants={characterVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Character 1 */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <img
                      src={getCharacterFullBodyImage(character1.id) || "/placeholder.svg"}
                      alt={character1.name}
                      className="h-64 w-auto object-contain"
                    />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 rounded-full shadow-sm"></div>
                  </div>
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 px-4 py-2 font-serif">
                      {character1.name}
                    </Badge>
                  </motion.div>
                </motion.div>
              </div>

              {/* Relationship Symbol - Más elegante */}
              <motion.div
                className="flex flex-col items-center mx-8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              >
                <div className="bg-white rounded-full p-6 shadow-lg border border-gray-200 mb-4">
                  <Feather className="h-12 w-12 text-amber-700" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-white text-gray-800 px-4 py-2 font-serif border-gray-300 shadow-sm"
                >
                  {relationshipData.type}
                </Badge>
              </motion.div>

              {/* Character 2 */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <img
                      src={getCharacterFullBodyImage(character2.id) || "/placeholder.svg"}
                      alt={character2.name}
                      className="h-64 w-auto object-contain"
                    />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full shadow-sm"></div>
                  </div>
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-4 py-2 font-serif">
                      {character2.name}
                    </Badge>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Scrollable Content */}
            <motion.div
              className="relative z-10 flex-1 overflow-hidden"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <ScrollArea className="h-full px-8 pb-8">
                <div className="space-y-6">
                  {/* Relationship Information */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="bg-white shadow-sm border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg font-serif text-gray-800">
                          <Quote className="h-5 w-5 text-amber-700" />
                          Análisis Narrativo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-serif font-semibold text-gray-800 mb-3">Descripción de la Relación:</h4>
                          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-400">
                            <TypewriterText
                              text={relationshipData.description}
                              className="text-gray-700 leading-relaxed font-serif"
                              delay={0.8}
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="font-serif font-semibold text-gray-800 mb-3">Escenario Principal:</h4>
                          <Badge variant="outline" className="text-green-700 border-green-300 px-4 py-2 font-serif">
                            📍 {relationshipData.sharedLocation}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* New Chapter Creation */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="bg-white shadow-sm border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg font-serif text-gray-800">
                          <PlusCircle className="h-5 w-5 text-green-700" />
                          Crear Nuevo Capítulo
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4">
                          <Textarea
                            placeholder={`Ej: "El Encuentro en ${relationshipData.sharedLocation}"`}
                            value={newChapterTitle}
                            onChange={(e) => setNewChapterTitle(e.target.value)}
                            className="flex-1 font-serif border-gray-300 focus:border-amber-400 focus:ring-amber-400"
                            rows={3}
                          />
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={handleCreateChapter}
                              disabled={!newChapterTitle.trim()}
                              className="h-full bg-amber-600 hover:bg-amber-700 text-white font-serif"
                            >
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Crear Capítulo
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Key Moments */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Card className="bg-white shadow-sm border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-lg font-serif text-gray-800">
                          <BookOpen className="h-5 w-5 text-blue-700" />
                          Momentos Clave en la Narrativa
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {relationshipData.keyMoments.map((moment, index) => (
                            <motion.div
                              key={index}
                              className="relative pl-6 py-4 bg-gray-50 rounded-lg border-l-4 border-amber-400"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.9 + index * 0.1 }}
                              whileHover={{ scale: 1.01, x: 2 }}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <Badge
                                  variant="outline"
                                  className="text-amber-700 border-amber-300 px-3 py-1 font-serif font-semibold"
                                >
                                  Página {moment.page}
                                </Badge>
                                <span className="text-sm text-gray-600 font-serif italic">{moment.context}</span>
                              </div>
                              <blockquote className="relative">
                                <Quote className="absolute -left-2 -top-2 h-4 w-4 text-amber-400" />
                                <TypewriterText
                                  text={moment.excerpt}
                                  className="text-gray-700 font-serif leading-relaxed pl-4 italic"
                                  delay={1.0 + index * 0.2}
                                />
                              </blockquote>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </ScrollArea>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-10">
              <Feather className="h-32 w-32 text-amber-600 transform rotate-12" />
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <BookOpen className="h-24 w-24 text-gray-400 transform -rotate-12" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
