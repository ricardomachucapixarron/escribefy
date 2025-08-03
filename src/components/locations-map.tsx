"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Focus } from "lucide-react"
import type { Location } from "@/hooks/use-projects"

interface LocationsMapProps {
  locations: Location[]
}

interface Position {
  x: number
  y: number
}

interface MapLocation {
  id: string
  location: Location
  position: Position
}

interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

export function LocationsMap({ locations }: LocationsMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [draggedLocation, setDraggedLocation] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [viewBox, setViewBox] = useState<ViewBox>({ x: 0, y: 0, width: 800, height: 500 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const getLocationImage = (locationId: string) => {
    const imageMap: Record<string, string> = {
      "loc-1": "/location-images/umbraluna-city.png",
      "loc-2": "/location-images/voidheart-ruins.png",
      "loc-sci-1": "/location-images/neo-tokyo.png",
    }
    return imageMap[locationId] || "/location-images/fantasy-location.png"
  }

  const getLocationTypeColor = (location: Location) => {
    if (
      location.plotRelevance?.toLowerCase().includes("final") ||
      location.plotRelevance?.toLowerCase().includes("crucial")
    ) {
      return "#dc2626" // red - crucial locations
    }
    if (
      location.plotRelevance?.toLowerCase().includes("centro") ||
      location.plotRelevance?.toLowerCase().includes("capital")
    ) {
      return "#7c3aed" // purple - major cities
    }
    if (
      location.atmosphere?.toLowerCase().includes("siniestra") ||
      location.atmosphere?.toLowerCase().includes("peligrosa")
    ) {
      return "#374151" // dark gray - dangerous places
    }
    return "#059669" // green - normal locations
  }

  // Initialize locations with positions
  useEffect(() => {
    const initialLocations: MapLocation[] = locations.map((location, index) => ({
      id: location.id,
      location,
      position: {
        x: 150 + (index % 4) * 200 + Math.random() * 50,
        y: 100 + Math.floor(index / 4) * 180 + Math.random() * 50,
      },
    }))
    setMapLocations(initialLocations)
  }, [locations])

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = (screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }

    const rect = svgRef.current.getBoundingClientRect()
    const svgX = ((screenX - rect.left) / rect.width) * viewBox.width + viewBox.x
    const svgY = ((screenY - rect.top) / rect.height) * viewBox.height + viewBox.y

    return { x: svgX, y: svgY }
  }

  const handleMouseDown = (e: React.MouseEvent, locationId?: string) => {
    const svgCoords = screenToSVG(e.clientX, e.clientY)

    if (locationId) {
      // Dragging a location
      const location = mapLocations.find((l) => l.id === locationId)
      if (!location) return

      setDraggedLocation(locationId)
      setDragOffset({
        x: svgCoords.x - location.position.x,
        y: svgCoords.y - location.position.y,
      })
    } else {
      // Panning the map
      setIsPanning(true)
      setPanStart(svgCoords)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const svgCoords = screenToSVG(e.clientX, e.clientY)

    if (draggedLocation) {
      // Move location
      const newX = svgCoords.x - dragOffset.x
      const newY = svgCoords.y - dragOffset.y

      setMapLocations((prev) =>
        prev.map((loc) => (loc.id === draggedLocation ? { ...loc, position: { x: newX, y: newY } } : loc)),
      )
    } else if (isPanning) {
      // Pan the map
      const deltaX = panStart.x - svgCoords.x
      const deltaY = panStart.y - svgCoords.y

      setViewBox((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }))
    }
  }

  const handleMouseUp = () => {
    setDraggedLocation(null)
    setIsPanning(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleLocationClick = (locationId: string) => {
    const location = mapLocations.find((l) => l.id === locationId)
    if (!location) return

    setSelectedLocation(locationId)

    // Center the view on the clicked location with zoom
    const targetZoom = 1.8
    const newWidth = 800 / targetZoom
    const newHeight = 500 / targetZoom

    setZoom(targetZoom)
    setViewBox({
      x: location.position.x - newWidth / 2,
      y: location.position.y - newHeight / 2,
      width: newWidth,
      height: newHeight,
    })

    // Clear selection after animation
    setTimeout(() => setSelectedLocation(null), 2000)
  }

  const handleZoom = (direction: "in" | "out") => {
    const factor = direction === "in" ? 0.8 : 1.25
    const newZoom = Math.max(0.5, Math.min(3, zoom * factor))

    setZoom(newZoom)
    setViewBox((prev) => {
      const centerX = prev.x + prev.width / 2
      const centerY = prev.y + prev.height / 2
      const newWidth = 800 / newZoom
      const newHeight = 500 / newZoom

      return {
        x: centerX - newWidth / 2,
        y: centerY - newHeight / 2,
        width: newWidth,
        height: newHeight,
      }
    })
  }

  const resetView = () => {
    setViewBox({ x: 0, y: 0, width: 800, height: 500 })
    setZoom(1)
    setSelectedLocation(null)

    // Reset locations to grid
    const resetLocations: MapLocation[] = locations.map((location, index) => ({
      id: location.id,
      location,
      position: {
        x: 150 + (index % 4) * 200,
        y: 100 + Math.floor(index / 4) * 180,
      },
    }))
    setMapLocations(resetLocations)
  }

  const focusOnLocation = (locationId: string) => {
    handleLocationClick(locationId)
  }

  const getConnections = () => {
    // Create some logical connections between locations
    const connections: Array<{ from: Position; to: Position; type: string }> = []

    // Connect cities to nearby locations
    mapLocations.forEach((loc, index) => {
      if (index < mapLocations.length - 1) {
        const nextLoc = mapLocations[index + 1]
        if (nextLoc) {
          connections.push({
            from: loc.position,
            to: nextLoc.position,
            type: "path",
          })
        }
      }
    })

    return connections
  }

  return (
    <div className="w-full border rounded-lg bg-gray-50">
      <div className="p-4 bg-white border-b flex justify-between items-center">
        <div>
          <h3 className="font-medium">Mapa de Ubicaciones</h3>
          <p className="text-sm text-gray-500">
            Click en ubicaciones para centrar • Arrastra para mover • Click y arrastra el fondo para navegar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleZoom("in")}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleZoom("out")}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="text-xs">
            Zoom: {Math.round(zoom * 100)}%
          </Badge>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Background pattern */}
          <defs>
            <pattern id="mapDots" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="2" cy="2" r="1" fill="#e5e7eb" />
            </pattern>
            {/* Glow filter for selected location */}
            <filter id="locationGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapDots)" />

          {/* Connection paths */}
          {getConnections().map((connection, index) => (
            <line
              key={index}
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="#d1d5db"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          ))}

          {/* Location cards */}
          {mapLocations.map((mapLoc) => (
            <g
              key={mapLoc.id}
              transform={`translate(${mapLoc.position.x - 75}, ${mapLoc.position.y - 60})`}
              className="cursor-pointer"
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e, mapLoc.id)
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleLocationClick(mapLoc.id)
              }}
              filter={selectedLocation === mapLoc.id ? "url(#locationGlow)" : undefined}
            >
              {/* Card shadow */}
              <rect x="2" y="2" width="150" height="120" rx="8" fill="rgba(0,0,0,0.1)" />

              {/* Card background */}
              <rect
                width="150"
                height="120"
                rx="8"
                fill="white"
                stroke={getLocationTypeColor(mapLoc.location)}
                strokeWidth={selectedLocation === mapLoc.id ? "4" : "2"}
                className="transition-all duration-300"
              />

              {/* Selection highlight */}
              {selectedLocation === mapLoc.id && (
                <rect
                  width="150"
                  height="120"
                  rx="8"
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              )}

              {/* Location image */}
              <foreignObject x="8" y="8" width="134" height="70">
                <div className="w-full h-full rounded overflow-hidden">
                  <img
                    src={getLocationImage(mapLoc.location.id) || "/placeholder.svg"}
                    alt={mapLoc.location.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </foreignObject>

              {/* Location name */}
              <text
                x="75"
                y="95"
                textAnchor="middle"
                className="text-sm font-semibold fill-gray-900"
                style={{ fontSize: "12px" }}
              >
                {mapLoc.location.name.length > 18
                  ? `${mapLoc.location.name.substring(0, 18)}...`
                  : mapLoc.location.name}
              </text>

              {/* Location type indicator */}
              <circle cx="135" cy="15" r="6" fill={getLocationTypeColor(mapLoc.location)} />

              {/* Focus icon for selected location */}
              {selectedLocation === mapLoc.id && (
                <foreignObject x="125" y="5" width="15" height="15">
                  <Focus className="h-3 w-3 text-blue-500" />
                </foreignObject>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Quick focus buttons */}
      <div className="p-4 bg-white border-t">
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2">Enfocar Ubicación:</h4>
          <div className="flex flex-wrap gap-1">
            {locations.map((location) => (
              <Button
                key={location.id}
                size="sm"
                variant="outline"
                onClick={() => focusOnLocation(location.id)}
                className="text-xs h-7"
              >
                <Focus className="h-3 w-3 mr-1" />
                {location.name.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>Ubicación Crucial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span>Ciudad Principal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span>Lugar Peligroso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Ubicación Normal</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-4 h-0.5 bg-gray-400 border-dashed"></div>
            <span>Conexión</span>
          </div>
          <div className="text-xs text-gray-500 ml-4">💡 Click en ubicaciones para centrar y hacer zoom</div>
        </div>
      </div>
    </div>
  )
}
