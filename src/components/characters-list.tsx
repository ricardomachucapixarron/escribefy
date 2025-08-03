"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Edit, Sparkles, Crown, Skull, Heart, BookOpen } from "lucide-react"
import type { Character } from "@/hooks/use-projects"

interface CharactersListProps {
  characters: Character[]
  onSuggestDetail: (character: Character, field: string) => void
}

export function CharactersList({ characters, onSuggestDetail }: CharactersListProps) {
  const getCharacterImage = (characterId: string, developmentLevel?: string) => {
    const imageMap: Record<string, string> = {
      "char-1": "/character-portraits/lyra-nightwhisper.png",
      "char-2": "/character-portraits/kael-stormforge.png",
      "char-3": "/character-portraits/shadow-character.png",
      "char-4": "/character-portraits/shadow-character.png",
      "char-5": "/character-portraits/elder-mage.png",
      "char-6": "/character-portraits/shadow-character.png",
      "char-7": "/character-portraits/villain-detailed.png",
      "char-8": "/character-portraits/queen-seraphina.png",
    }
    return imageMap[characterId] || "/character-portraits/shadow-character.png"
  }

  const getDevelopmentBadge = (character: Character) => {
    if (character.physicalDescription && character.motivations && character.fears && character.biography) {
      return { label: "Completo", color: "bg-green-100 text-green-700 border-green-200" }
    }
    if (character.physicalDescription && (character.motivations || character.fears)) {
      return { label: "En Desarrollo", color: "bg-yellow-100 text-yellow-700 border-yellow-200" }
    }
    return { label: "Básico", color: "bg-gray-100 text-gray-700 border-gray-200" }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "alive":
        return <Heart className="h-3 w-3 text-green-600" />
      case "dead":
        return <Skull className="h-3 w-3 text-red-600" />
      case "missing":
        return <span className="text-yellow-600">?</span>
      default:
        return null
    }
  }

  const getFactionColor = (faction?: string) => {
    const colors: Record<string, string> = {
      "Guardianes de la Sombra": "bg-purple-100 text-purple-700 border-purple-200",
      "Guardia Real": "bg-blue-100 text-blue-700 border-blue-200",
      "Corona Real": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Fuerzas del Vacío": "bg-red-100 text-red-700 border-red-200",
      "Orden del Escudo Dorado": "bg-orange-100 text-orange-700 border-orange-200",
      "Templo de la Luz": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Círculo Druídico": "bg-green-100 text-green-700 border-green-200",
      "Hermandad Pirata": "bg-gray-100 text-gray-700 border-gray-200",
    }
    return colors[faction || ""] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="grid gap-4">
      {characters.map((character) => {
        const development = getDevelopmentBadge(character)
        const factionColor = getFactionColor(character.faction)
        return (
          <Card key={character.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {/* Character Portrait */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={getCharacterImage(character.id, character.developmentLevel) || "/placeholder.svg"}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {character.name}
                      {character.age && <Badge variant="secondary">{character.age} años</Badge>}
                      {getStatusIcon(character.status)}
                    </CardTitle>

                    {/* Etiquetas principales */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge className={development.color}>{development.label}</Badge>
                      {character.faction && <Badge className={factionColor}>{character.faction}</Badge>}
                      {character.role && <Badge variant="outline">{character.role}</Badge>}
                    </div>

                    {/* Información adicional */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {character.dynasty && character.dynasty !== "Sin linaje" && (
                        <div className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          <span>{character.dynasty}</span>
                        </div>
                      )}
                      {character.location && character.location !== "Desconocido" && <div>📍 {character.location}</div>}
                      {character.religion &&
                        character.religion !== "Sin religión" &&
                        character.religion !== "Desconocido" && <div>⛪ {character.religion}</div>}
                      {/* Nueva estadística de apariciones */}
                      {character.appearances && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{character.appearances} páginas</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      {character.physicalDescription && character.physicalDescription.substring(0, 100)}
                      {character.physicalDescription && character.physicalDescription.length > 100 && "..."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onSuggestDetail(character, "general")}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Sugerir Detalle
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {character.motivations && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Motivaciones</Label>
                    <p className="text-sm text-gray-600">{character.motivations}</p>
                  </div>
                )}
                {character.fears && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Miedos</Label>
                    <p className="text-sm text-gray-600">{character.fears}</p>
                  </div>
                )}
                {character.narrative_arc && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Arco Narrativo</Label>
                    <p className="text-sm text-gray-600">{character.narrative_arc}</p>
                  </div>
                )}
                {!character.motivations && !character.fears && !character.narrative_arc && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Este personaje necesita más desarrollo</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-transparent"
                      onClick={() => onSuggestDetail(character, "general")}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Desarrollar Personaje
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
