"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Edit, MapPin, Sparkles } from "lucide-react"
import type { Location } from "@/hooks/use-projects"

interface LocationsListProps {
  locations: Location[]
  onSuggestDetail: (location: Location, field: string) => void
}

export function LocationsList({ locations, onSuggestDetail }: LocationsListProps) {
  const getLocationImage = (locationId: string) => {
    const imageMap: Record<string, string> = {
      "loc-1": "/location-images/umbraluna-city.png",
      "loc-2": "/location-images/voidheart-ruins.png",
      "loc-sci-1": "/location-images/neo-tokyo.png",
    }
    return imageMap[locationId] || "/location-images/fantasy-location.png"
  }

  const getLocationTypeBadge = (location: Location) => {
    if (
      location.plotRelevance?.toLowerCase().includes("final") ||
      location.plotRelevance?.toLowerCase().includes("crucial")
    ) {
      return { label: "Crucial", color: "bg-red-100 text-red-700 border-red-200" }
    }
    if (
      location.plotRelevance?.toLowerCase().includes("centro") ||
      location.plotRelevance?.toLowerCase().includes("capital")
    ) {
      return { label: "Principal", color: "bg-purple-100 text-purple-700 border-purple-200" }
    }
    if (
      location.atmosphere?.toLowerCase().includes("siniestra") ||
      location.atmosphere?.toLowerCase().includes("peligrosa")
    ) {
      return { label: "Peligroso", color: "bg-gray-100 text-gray-700 border-gray-200" }
    }
    return { label: "Normal", color: "bg-green-100 text-green-700 border-green-200" }
  }

  return (
    <div className="grid gap-4">
      {locations.map((location) => {
        const typeBadge = getLocationTypeBadge(location)
        return (
          <Card key={location.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {/* Location Image */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={getLocationImage(location.id) || "/placeholder.svg"}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {location.name}
                      <Badge className={typeBadge.color}>{typeBadge.label}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {location.description && location.description.substring(0, 120)}
                      {location.description && location.description.length > 120 && "..."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onSuggestDetail(location, "general")}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Expandir Lore
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {location.atmosphere && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Atmósfera</Label>
                    <p className="text-sm text-gray-600">{location.atmosphere}</p>
                  </div>
                )}
                {location.history && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Historia</Label>
                    <p className="text-sm text-gray-600">{location.history}</p>
                  </div>
                )}
                {location.plotRelevance && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Relevancia en la Trama</Label>
                    <p className="text-sm text-gray-600">{location.plotRelevance}</p>
                  </div>
                )}
                {!location.atmosphere && !location.history && !location.plotRelevance && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Esta ubicación necesita más desarrollo</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-transparent"
                      onClick={() => onSuggestDetail(location, "general")}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Desarrollar Ubicación
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
