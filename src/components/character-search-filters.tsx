"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Character } from "@/hooks/use-projects"

interface CharacterSearchFiltersProps {
  characters: Character[]
  onFilteredCharacters: (filtered: Character[]) => void
}

interface Filters {
  search: string
  affiliation: string
  beliefSystem: string
  location: string
  dynasty: string
  archetype: string
  status: string
  development: string
}

// Lista extensa de arquetipos
const archetypes = [
  "Héroe/Heroína",
  "Mentor",
  "Guardián del Umbral",
  "Heraldo",
  "Cambiante",
  "Sombra",
  "Embaucador",
  "Aliado",
  "Enemigo",
  "Amor Romántico",
  "Figura Paterna/Materna",
  "Niño Divino",
  "Sabio",
  "Inocente",
  "Explorador",
  "Rebelde",
  "Mago",
  "Persona Corriente",
  "Amante",
  "Bufón",
  "Cuidador",
  "Creador",
  "Gobernante",
  "Villano",
  "Antihéroe",
  "Víctima",
  "Superviviente",
  "Vengador",
  "Redentor",
  "Traidor",
  "Espía",
  "Asesino",
  "Guerrero",
  "Sanador",
  "Erudito",
  "Artista",
  "Comerciante",
  "Noble",
  "Plebeyo",
  "Forastero",
  "Místico",
  "Profeta",
  "Oráculo",
  "Guardián",
  "Destructor",
  "Transformador",
  "Mediador",
  "Líder",
  "Seguidor",
  "Solitario",
]

export function CharacterSearchFilters({ characters, onFilteredCharacters }: CharacterSearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    affiliation: "all",
    beliefSystem: "all",
    location: "all",
    dynasty: "all",
    archetype: "all",
    status: "all",
    development: "all",
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [archetypeOpen, setArchetypeOpen] = useState(false)

  // Obtener valores únicos para los filtros
  const getUniqueValues = (field: keyof Character) => {
    const values = characters
      .map((char) => char[field])
      .filter(
        (value): value is string =>
          Boolean(value) && value !== "Sin linaje" && value !== "Desconocido" && value !== "Sin religión",
      )
    return [...new Set(values)].sort()
  }

  const getDevelopmentValues = () => {
    return characters
      .map((char) => {
        if (char.physicalDescription && char.motivations && char.fears && char.biography) {
          return "Completo"
        }
        if (char.physicalDescription && (char.motivations || char.fears)) {
          return "En Desarrollo"
        }
        return "Básico"
      })
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()
  }

  // Aplicar filtros
  const applyFilters = (newFilters: Filters) => {
    let filtered = characters

    if (newFilters.search) {
      filtered = filtered.filter((char) => char.name.toLowerCase().includes(newFilters.search.toLowerCase()))
    }

    if (newFilters.affiliation !== "all") {
      filtered = filtered.filter((char) => char.faction === newFilters.affiliation)
    }

    if (newFilters.beliefSystem !== "all") {
      filtered = filtered.filter((char) => char.religion === newFilters.beliefSystem)
    }

    if (newFilters.location !== "all") {
      filtered = filtered.filter((char) => char.location === newFilters.location)
    }

    if (newFilters.dynasty !== "all") {
      filtered = filtered.filter((char) => char.dynasty === newFilters.dynasty)
    }

    if (newFilters.archetype !== "all") {
      filtered = filtered.filter((char) => char.role === newFilters.archetype)
    }

    if (newFilters.status !== "all") {
      filtered = filtered.filter((char) => char.status === newFilters.status)
    }

    if (newFilters.development !== "all") {
      filtered = filtered.filter((char) => {
        const development =
          char.physicalDescription && char.motivations && char.fears && char.biography
            ? "Completo"
            : char.physicalDescription && (char.motivations || char.fears)
              ? "En Desarrollo"
              : "Básico"
        return development === newFilters.development
      })
    }

    onFilteredCharacters(filtered)
  }

  const updateFilter = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const clearFilter = (key: keyof Filters) => {
    updateFilter(key, "all")
  }

  const clearAllFilters = () => {
    const clearedFilters: Filters = {
      search: "",
      affiliation: "all",
      beliefSystem: "all",
      location: "all",
      dynasty: "all",
      archetype: "all",
      status: "all",
      development: "all",
    }
    setFilters(clearedFilters)
    applyFilters(clearedFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "all").length
  }

  const getActiveFilters = () => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== "all")
      .map(([key, value]) => ({ key: key as keyof Filters, value }))
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar personajes por nombre..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Botón de filtros */}
      <div className="flex items-center justify-between">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtros Avanzados
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
              {/* Filtro por Afiliación */}
              <div>
                <Label className="text-sm font-medium">Afiliación</Label>
                <Select value={filters.affiliation} onValueChange={(value) => updateFilter("affiliation", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las afiliaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las afiliaciones</SelectItem>
                    {getUniqueValues("faction").map((faction) => (
                      <SelectItem key={faction} value={faction}>
                        {faction}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Sistema de Creencia */}
              <div>
                <Label className="text-sm font-medium">Sistema de Creencia</Label>
                <Select value={filters.beliefSystem} onValueChange={(value) => updateFilter("beliefSystem", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los sistemas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los sistemas</SelectItem>
                    {getUniqueValues("religion").map((religion) => (
                      <SelectItem key={religion} value={religion}>
                        {religion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Ubicación */}
              <div>
                <Label className="text-sm font-medium">Ubicación</Label>
                <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    {getUniqueValues("location").map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Dinastía */}
              <div>
                <Label className="text-sm font-medium">Dinastía</Label>
                <Select value={filters.dynasty} onValueChange={(value) => updateFilter("dynasty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las dinastías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las dinastías</SelectItem>
                    {getUniqueValues("dynasty").map((dynasty) => (
                      <SelectItem key={dynasty} value={dynasty}>
                        {dynasty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Arquetipo con buscador */}
              <div>
                <Label className="text-sm font-medium">Arquetipo</Label>
                <Popover open={archetypeOpen} onOpenChange={setArchetypeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={archetypeOpen}
                      className="w-full justify-between bg-transparent"
                    >
                      {filters.archetype !== "all"
                        ? archetypes.find((archetype) => archetype === filters.archetype)
                        : "Todos los arquetipos"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar arquetipo..." />
                      <CommandList>
                        <CommandEmpty>No se encontró ningún arquetipo.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="all"
                            onSelect={() => {
                              updateFilter("archetype", "all")
                              setArchetypeOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", filters.archetype === "all" ? "opacity-100" : "opacity-0")}
                            />
                            Todos los arquetipos
                          </CommandItem>
                          {archetypes.map((archetype) => (
                            <CommandItem
                              key={archetype}
                              value={archetype}
                              onSelect={(currentValue) => {
                                updateFilter("archetype", currentValue)
                                setArchetypeOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filters.archetype === archetype ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {archetype}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filtro por Estado */}
              <div>
                <Label className="text-sm font-medium">Estado</Label>
                <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="alive">Vivo</SelectItem>
                    <SelectItem value="dead">Muerto</SelectItem>
                    <SelectItem value="missing">Desaparecido</SelectItem>
                    <SelectItem value="unknown">Desconocido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Desarrollo */}
              <div>
                <Label className="text-sm font-medium">Desarrollo</Label>
                <Select value={filters.development} onValueChange={(value) => updateFilter("development", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los niveles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los niveles</SelectItem>
                    {getDevelopmentValues().map((dev) => (
                      <SelectItem key={dev} value={dev}>
                        {dev}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botón limpiar filtros */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  disabled={getActiveFiltersCount() === 0}
                  className="w-full bg-transparent"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="text-sm text-gray-500">
          {onFilteredCharacters.length !== undefined
            ? `${
                characters.filter((char) => {
                  let filtered = characters
                  if (filters.search)
                    filtered = filtered.filter((c) => c.name.toLowerCase().includes(filters.search.toLowerCase()))
                  if (filters.affiliation !== "all")
                    filtered = filtered.filter((c) => c.faction === filters.affiliation)
                  if (filters.beliefSystem !== "all")
                    filtered = filtered.filter((c) => c.religion === filters.beliefSystem)
                  if (filters.location !== "all") filtered = filtered.filter((c) => c.location === filters.location)
                  if (filters.dynasty !== "all") filtered = filtered.filter((c) => c.dynasty === filters.dynasty)
                  if (filters.archetype !== "all") filtered = filtered.filter((c) => c.role === filters.archetype)
                  if (filters.status !== "all") filtered = filtered.filter((c) => c.status === filters.status)
                  if (filters.development !== "all") {
                    filtered = filtered.filter((c) => {
                      const development =
                        c.physicalDescription && c.motivations && c.fears && c.biography
                          ? "Completo"
                          : c.physicalDescription && (c.motivations || c.fears)
                            ? "En Desarrollo"
                            : "Básico"
                      return development === filters.development
                    })
                  }
                  return filtered.includes(char)
                }).length
              } de ${characters.length} personajes`
            : `${characters.length} personajes`}
        </div>
      </div>

      {/* Filtros activos */}
      {getActiveFilters().length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getActiveFilters().map(({ key, value }) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              <span className="capitalize">
                {key === "affiliation"
                  ? "Afiliación"
                  : key === "beliefSystem"
                    ? "Sistema de creencia"
                    : key === "archetype"
                      ? "Arquetipo"
                      : key}
                :
              </span>
              <span>{value}</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 ml-1" onClick={() => clearFilter(key)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
