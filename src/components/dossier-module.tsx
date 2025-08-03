"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, PlusCircle, List, Map } from "lucide-react"
import { CharactersList } from "@/components/characters-list"
import { CharactersDiagram } from "@/components/characters-diagram"
import { CharacterSearchFilters } from "@/components/character-search-filters"
import { LocationsList } from "@/components/locations-list"
import { LocationsMap } from "@/components/locations-map"
import { NetworkIcon as Network2 } from "lucide-react"
import type { Character, Location } from "@/hooks/use-projects"

interface DossierModuleProps {
  characters: Character[]
  locations: Location[]
  onSuggestDetail: (item: Character | Location, field: string) => void
}

export function DossierModule({ characters, locations, onSuggestDetail }: DossierModuleProps) {
  const [activeTab, setActiveTab] = useState("characters")
  const [charactersView, setCharactersView] = useState<"list" | "diagram">("list")
  const [locationsView, setLocationsView] = useState<"list" | "map">("list")
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>(characters)
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({})
  const [newLocation, setNewLocation] = useState<Partial<Location>>({})
  const [isCharacterDialogOpen, setIsCharacterDialogOpen] = useState(false)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)

  useEffect(() => {
    setFilteredCharacters(characters)
  }, [characters])

  const addCharacter = () => {
    if (!newCharacter.name) return

    const character: Character = {
      id: Date.now().toString(),
      name: newCharacter.name,
      age: newCharacter.age,
      physicalDescription: newCharacter.physicalDescription,
      narrative_arc: newCharacter.narrative_arc,
      motivations: newCharacter.motivations,
      fears: newCharacter.fears,
      biography: newCharacter.biography,
      relationships: [],
      developmentLevel: "basic",
      faction: newCharacter.faction,
      religion: newCharacter.religion,
      location: newCharacter.location,
      dynasty: newCharacter.dynasty,
      role: newCharacter.role,
      status: newCharacter.status || "alive",
    }

    // Placeholder for updateProject function call
    console.log("Adding character:", character)

    setNewCharacter({})
    setIsCharacterDialogOpen(false)
  }

  const addLocation = () => {
    if (!newLocation.name) return

    const location: Location = {
      id: Date.now().toString(),
      name: newLocation.name,
      description: newLocation.description,
      history: newLocation.history,
      atmosphere: newLocation.atmosphere,
      plotRelevance: newLocation.plotRelevance,
    }

    // Placeholder for updateProject function call
    console.log("Adding location:", location)

    setNewLocation({})
    setIsLocationDialogOpen(false)
  }

  const handleSuggestCharacterDetail = (character: Character, field: string) => {
    onSuggestDetail(character, field)
  }

  const handleSuggestLocationDetail = (location: Location, field: string) => {
    onSuggestDetail(location, field)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">El Dossier</h1>
        <p className="text-gray-600">
          La Biblia completa de tu historia. Aquí vive toda la información esencial sobre tu mundo narrativo.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <span>👥</span>
            Personajes ({characters.length})
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <span>🏰</span>
            Ubicaciones ({locations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Personajes</h2>
            <div className="flex gap-2">
              <Button
                variant={charactersView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setCharactersView("list")}
              >
                <List className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={charactersView === "diagram" ? "default" : "outline"}
                size="sm"
                onClick={() => setCharactersView("diagram")}
              >
                <Network2 className="h-4 w-4 mr-2" />
                Diagrama
              </Button>
            </div>
          </div>

          {charactersView === "list" && (
            <>
              <CharacterSearchFilters characters={characters} onFilteredCharacters={setFilteredCharacters} />
              <CharactersList characters={filteredCharacters} onSuggestDetail={handleSuggestCharacterDetail} />
            </>
          )}

          {charactersView === "diagram" && <CharactersDiagram characters={characters} />}

          <Dialog open={isCharacterDialogOpen} onOpenChange={setIsCharacterDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo Personaje
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Personaje</DialogTitle>
                <DialogDescription>Define todos los aspectos importantes de tu personaje.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={newCharacter.name || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      placeholder="Nombre del personaje"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newCharacter.age || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, age: Number.parseInt(e.target.value) })}
                      placeholder="Edad"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="faction">Bando</Label>
                    <Input
                      id="faction"
                      value={newCharacter.faction || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, faction: e.target.value })}
                      placeholder="Ej: Guardia Real"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Input
                      id="role"
                      value={newCharacter.role || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
                      placeholder="Ej: Capitán, Mago, Espía"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="religion">Religión</Label>
                    <Input
                      id="religion"
                      value={newCharacter.religion || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, religion: e.target.value })}
                      placeholder="Ej: Culto Lunar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dynasty">Dinastía</Label>
                    <Input
                      id="dynasty"
                      value={newCharacter.dynasty || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, dynasty: e.target.value })}
                      placeholder="Ej: Casa Goldenheart"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="characterLocation">Ubicación</Label>
                  <Input
                    id="characterLocation"
                    value={newCharacter.location || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, location: e.target.value })}
                    placeholder="Lugar de origen o residencia"
                  />
                </div>

                <div>
                  <Label htmlFor="physicalDescription">Descripción Física</Label>
                  <Textarea
                    id="physicalDescription"
                    value={newCharacter.physicalDescription || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, physicalDescription: e.target.value })}
                    placeholder="Describe la apariencia física del personaje..."
                  />
                </div>
                <div>
                  <Label htmlFor="motivations">Motivaciones</Label>
                  <Textarea
                    id="motivations"
                    value={newCharacter.motivations || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, motivations: e.target.value })}
                    placeholder="¿Qué impulsa a este personaje?"
                  />
                </div>
                <div>
                  <Label htmlFor="fears">Miedos</Label>
                  <Textarea
                    id="fears"
                    value={newCharacter.fears || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, fears: e.target.value })}
                    placeholder="¿Cuáles son sus temores más profundos?"
                  />
                </div>
                <div>
                  <Label htmlFor="narrativeArc">Arco Narrativo</Label>
                  <Textarea
                    id="narrativeArc"
                    value={newCharacter.narrative_arc || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, narrative_arc: e.target.value })}
                    placeholder="¿Cómo evoluciona este personaje a lo largo de la historia?"
                  />
                </div>
                <div>
                  <Label htmlFor="biography">Biografía</Label>
                  <Textarea
                    id="biography"
                    value={newCharacter.biography || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, biography: e.target.value })}
                    placeholder="Historia personal del personaje..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCharacterDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addCharacter}>Crear Personaje</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Ubicaciones</h2>
            <div className="flex gap-2">
              <Button
                variant={locationsView === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocationsView("list")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={locationsView === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocationsView("map")}
              >
                <Map className="h-4 w-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>

          {locationsView === "list" && (
            <LocationsList locations={locations} onSuggestDetail={handleSuggestLocationDetail} />
          )}

          {locationsView === "map" && <LocationsMap locations={locations} />}

          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo Lugar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Localización</DialogTitle>
                <DialogDescription>Define un lugar importante en tu historia.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="locationName">Nombre *</Label>
                  <Input
                    id="locationName"
                    value={newLocation.name || ""}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    placeholder="Nombre del lugar"
                  />
                </div>
                <div>
                  <Label htmlFor="locationDescription">Descripción</Label>
                  <Textarea
                    id="locationDescription"
                    value={newLocation.description || ""}
                    onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                    placeholder="Describe cómo se ve y se siente este lugar..."
                  />
                </div>
                <div>
                  <Label htmlFor="locationHistory">Historia</Label>
                  <Textarea
                    id="locationHistory"
                    value={newLocation.history || ""}
                    onChange={(e) => setNewLocation({ ...newLocation, history: e.target.value })}
                    placeholder="¿Qué eventos importantes ocurrieron aquí?"
                  />
                </div>
                <div>
                  <Label htmlFor="locationAtmosphere">Atmósfera</Label>
                  <Textarea
                    id="locationAtmosphere"
                    value={newLocation.atmosphere || ""}
                    onChange={(e) => setNewLocation({ ...newLocation, atmosphere: e.target.value })}
                    placeholder="¿Qué se siente estar en este lugar?"
                  />
                </div>
                <div>
                  <Label htmlFor="plotRelevance">Relevancia en la Trama</Label>
                  <Textarea
                    id="plotRelevance"
                    value={newLocation.plotRelevance || ""}
                    onChange={(e) => setNewLocation({ ...newLocation, plotRelevance: e.target.value })}
                    placeholder="¿Por qué es importante este lugar para la historia?"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={addLocation}>Crear Lugar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
