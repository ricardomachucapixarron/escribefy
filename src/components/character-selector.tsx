"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Character } from "@/hooks/use-projects"

interface CharacterSelectorProps {
  characters: Character[]
  selectedCharacters: Character[]
  onCharacterSelect: (character: Character) => void
  onCharacterRemove: (characterId: string) => void
}

export function CharacterSelector({
  characters,
  selectedCharacters,
  onCharacterSelect,
  onCharacterRemove,
}: CharacterSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null)

  // Agrupar personajes por afiliación
  const groupedCharacters = characters.reduce(
    (groups, character) => {
      const affiliation = character.faction || "Sin Afiliación"
      if (!groups[affiliation]) {
        groups[affiliation] = []
      }
      groups[affiliation].push(character)
      return groups
    },
    {} as Record<string, Character[]>,
  )

  // Filtrar personajes disponibles (no seleccionados)
  const availableCharacters = characters.filter(
    (char) => !selectedCharacters.some((selected) => selected.id === char.id),
  )

  // Filtrar por término de búsqueda
  const filteredGroups = Object.entries(groupedCharacters).reduce(
    (filtered, [affiliation, chars]) => {
      const filteredChars = chars.filter(
        (char) => char.name.toLowerCase().includes(searchTerm.toLowerCase()) && availableCharacters.includes(char),
      )
      if (filteredChars.length > 0) {
        filtered[affiliation] = filteredChars
      }
      return filtered
    },
    {} as Record<string, Character[]>,
  )

  const handleCharacterSelect = (character: Character) => {
    onCharacterSelect(character)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <div className="space-y-3">
      {/* Selector de personajes */}
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-400 hover:text-white bg-transparent hover:bg-gray-800/80 hover:border-gray-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Agregar Personaje
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700" align="start">
            <Command className="bg-gray-900">
              <CommandInput
                placeholder="Buscar personajes..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <CommandList>
                <ScrollArea className="h-64">
                  {Object.keys(filteredGroups).length === 0 ? (
                    <CommandEmpty className="text-gray-400 py-6">
                      No se encontraron personajes disponibles.
                    </CommandEmpty>
                  ) : (
                    Object.entries(filteredGroups).map(([affiliation, chars]) => (
                      <CommandGroup key={affiliation} heading={affiliation} className="text-gray-300">
                        {chars.map((character) => (
                          <CommandItem
                            key={character.id}
                            value={character.name}
                            onSelect={() => handleCharacterSelect(character)}
                            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800/80 data-[selected]:bg-gray-700/60 transition-all duration-200 border-l-2 border-transparent hover:border-purple-400 data-[selected]:border-purple-500 text-white hover:text-white data-[selected]:text-white"
                          >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 ring-2 ring-transparent group-hover:ring-purple-400/50 transition-all">
                              <img
                                src={character.image || "/placeholder.svg?height=32&width=32"}
                                alt={character.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <motion.div
                                className="text-sm font-medium text-white truncate"
                                animate={{ x: 0 }}
                                whileHover={{ x: 8 }}
                                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                              >
                                {character.name}
                              </motion.div>
                              <div className="text-xs text-gray-300 truncate">{character.role || "Sin arquetipo"}</div>
                            </div>
                            <motion.div
                              className="w-2 h-2 rounded-full bg-purple-400 opacity-0"
                              whileHover={{ opacity: 1, scale: 1.2 }}
                              transition={{ duration: 0.2 }}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))
                  )}
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Personajes seleccionados */}
      <AnimatePresence>
        {selectedCharacters.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedCharacters.map((character) => (
              <motion.div
                key={character.id}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setHoveredCharacter(character.id)}
                onHoverEnd={() => setHoveredCharacter(null)}
              >
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 border-2 border-purple-500/30 group-hover:border-purple-400 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={character.image || "/placeholder.svg?height=40&width=40"}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Botón de eliminar */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCharacterRemove(character.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </Button>

                  {/* Tooltip con información del personaje - Solo aparece al hacer hover sobre la imagen */}
                  <AnimatePresence>
                    {hoveredCharacter === character.id && (
                      <motion.div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg pointer-events-none z-20 whitespace-nowrap"
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="text-sm font-medium text-white">{character.name}</div>
                        <div className="text-xs text-gray-400">{character.role || "Sin arquetipo"}</div>
                        {/* Flecha del tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contador de personajes seleccionados */}
      {selectedCharacters.length > 0 && (
        <motion.div
          className="text-xs text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {selectedCharacters.length} personaje{selectedCharacters.length !== 1 ? "s" : ""} seleccionado
          {selectedCharacters.length !== 1 ? "s" : ""}
        </motion.div>
      )}
    </div>
  )
}
