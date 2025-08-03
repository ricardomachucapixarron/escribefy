"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Focus, BookOpen } from "lucide-react"
import { RelationshipPopup } from "@/components/relationship-popup"
import { motion, AnimatePresence } from "framer-motion"
import type { Character } from "@/hooks/use-projects"

interface CharactersDiagramProps {
  characters: Character[]
}

interface Position {
  x: number
  y: number
}

interface DiagramNode {
  id: string
  character: Character
  position: Position
}

interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

interface Connection {
  from: Position
  to: Position
  fromCharacter: Character
  toCharacter: Character
}

export function CharactersDiagram({ characters }: CharactersDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<DiagramNode[]>([])
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })
  const [viewBox, setViewBox] = useState<ViewBox>({ x: 0, y: 0, width: 800, height: 500 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null)
  const [relationshipPopup, setRelationshipPopup] = useState<{
    isOpen: boolean
    character1: Character | null
    character2: Character | null
  }>({
    isOpen: false,
    character1: null,
    character2: null,
  })

  const getCharacterImage = (characterId: string) => {
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

  const getDevelopmentColor = (character: Character) => {
    if (character.physicalDescription && character.motivations && character.fears && character.biography) {
      return "#059669" // emerald-600
    }
    if (character.physicalDescription && (character.motivations || character.fears)) {
      return "#d97706" // amber-600
    }
    return "#6b7280" // gray-500
  }

  // Initialize nodes with positions
  useEffect(() => {
    const initialNodes: DiagramNode[] = characters.map((character, index) => ({
      id: character.id,
      character,
      position: {
        x: (index % 4) * 200 + 150,
        y: Math.floor(index / 4) * 180 + 100,
      },
    }))
    setNodes(initialNodes)
  }, [characters])

  // Convert screen coordinates to SVG coordinates
  const screenToSVG = (screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 }

    const rect = svgRef.current.getBoundingClientRect()
    const svgX = ((screenX - rect.left) / rect.width) * viewBox.width + viewBox.x
    const svgY = ((screenY - rect.top) / rect.height) * viewBox.height + viewBox.y

    return { x: svgX, y: svgY }
  }

  const handleMouseDown = (e: React.MouseEvent, nodeId?: string) => {
    const svgCoords = screenToSVG(e.clientX, e.clientY)

    if (nodeId) {
      // Dragging a character
      const node = nodes.find((n) => n.id === nodeId)
      if (!node) return

      setDraggedNode(nodeId)
      setDragOffset({
        x: svgCoords.x - node.position.x,
        y: svgCoords.y - node.position.y,
      })
    } else {
      // Panning the diagram
      setIsPanning(true)
      setPanStart(svgCoords)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const svgCoords = screenToSVG(e.clientX, e.clientY)

    if (draggedNode) {
      // Move character
      const newX = svgCoords.x - dragOffset.x
      const newY = svgCoords.y - dragOffset.y

      setNodes((prev) =>
        prev.map((node) => (node.id === draggedNode ? { ...node, position: { x: newX, y: newY } } : node)),
      )
    } else if (isPanning) {
      // Pan the diagram
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
    setDraggedNode(null)
    setIsPanning(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    setSelectedNode(nodeId)

    // Center the view on the clicked node with zoom
    const targetZoom = 1.5
    const newWidth = 800 / targetZoom
    const newHeight = 500 / targetZoom

    setZoom(targetZoom)
    setViewBox({
      x: node.position.x - newWidth / 2,
      y: node.position.y - newHeight / 2,
      width: newWidth,
      height: newHeight,
    })

    // Clear selection after animation
    setTimeout(() => setSelectedNode(null), 2000)
  }

  const handleConnectionDoubleClick = (connection: Connection) => {
    setRelationshipPopup({
      isOpen: true,
      character1: connection.fromCharacter,
      character2: connection.toCharacter,
    })
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
    setSelectedNode(null)

    // Reset nodes to grid
    const resetNodes: DiagramNode[] = characters.map((character, index) => ({
      id: character.id,
      character,
      position: {
        x: (index % 4) * 200 + 150,
        y: Math.floor(index / 4) * 180 + 100,
      },
    }))
    setNodes(resetNodes)
  }

  const focusOnCharacter = (characterId: string) => {
    handleNodeClick(characterId)
  }

  const getConnections = (): Connection[] => {
    const connections: Connection[] = []

    nodes.forEach((node) => {
      if (node.character.relationships) {
        node.character.relationships.forEach((relationshipId) => {
          const targetNode = nodes.find((n) => n.id === relationshipId)
          if (targetNode) {
            connections.push({
              from: node.position,
              to: targetNode.position,
              fromCharacter: node.character,
              toCharacter: targetNode.character,
            })
          }
        })
      }
    })

    return connections
  }

  return (
    <div className="w-full border rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden shadow-sm">
      <motion.div
        className="p-6 bg-white/80 backdrop-blur-sm border-b border-amber-200 flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h3 className="font-serif font-semibold text-gray-800 text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-700" />
            Diagrama de Relaciones Narrativas
          </h3>
          <p className="text-sm text-gray-600 font-serif mt-1">
            Explora las conexiones entre personajes • Doble click en líneas para análisis detallado
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleZoom("in")}
              className="border-amber-300 hover:bg-amber-50"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleZoom("out")}
              className="border-amber-300 hover:bg-amber-50"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={resetView}
              className="border-amber-300 hover:bg-amber-50 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </motion.div>
          <Badge variant="outline" className="text-xs font-serif border-amber-300 text-amber-700">
            Zoom: {Math.round(zoom * 100)}%
          </Badge>
        </div>
      </motion.div>

      <div className="relative overflow-hidden bg-white/50">
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
          {/* Background pattern más elegante */}
          <defs>
            <pattern id="editorialDots" patternUnits="userSpaceOnUse" width="30" height="30">
              <circle cx="3" cy="3" r="1" fill="#f3f4f6" opacity="0.5" />
            </pattern>
            {/* Glow filter for selected node */}
            <filter id="editorialGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Elegant gradient for connections */}
            <linearGradient id="editorialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#editorialDots)" />

          {/* Connection lines con estilo editorial */}
          {getConnections().map((connection, index) => (
            <g key={index}>
              <line
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke={hoveredConnection === index ? "url(#editorialGradient)" : "#d97706"}
                strokeWidth={hoveredConnection === index ? "3" : "2"}
                strokeDasharray={hoveredConnection === index ? "none" : "5,5"}
                className="cursor-pointer transition-all duration-300"
                markerEnd="url(#editorialArrow)"
                onDoubleClick={() => handleConnectionDoubleClick(connection)}
                onMouseEnter={() => setHoveredConnection(index)}
                onMouseLeave={() => setHoveredConnection(null)}
                style={{
                  filter: hoveredConnection === index ? "drop-shadow(0 0 6px rgba(217, 119, 6, 0.4))" : "none",
                }}
              />
              {/* Invisible thicker line for easier clicking */}
              <line
                x1={connection.from.x}
                y1={connection.from.y}
                x2={connection.to.x}
                y2={connection.to.y}
                stroke="transparent"
                strokeWidth="12"
                className="cursor-pointer"
                onDoubleClick={() => handleConnectionDoubleClick(connection)}
                onMouseEnter={() => setHoveredConnection(index)}
                onMouseLeave={() => setHoveredConnection(null)}
              />
            </g>
          ))}

          {/* Arrow marker más elegante */}
          <defs>
            <marker id="editorialArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#d97706" />
            </marker>
          </defs>

          {/* Character nodes con estilo editorial */}
          <AnimatePresence>
            {nodes.map((node, index) => (
              <g
                key={node.id}
                transform={`translate(${node.position.x - 60}, ${node.position.y - 50})`}
                className="cursor-pointer"
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleMouseDown(e, node.id)
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNodeClick(node.id)
                }}
                filter={selectedNode === node.id ? "url(#editorialGlow)" : undefined}
              >
                {/* Node background con estilo libro */}
                <rect
                  width="120"
                  height="100"
                  rx="8"
                  fill="white"
                  stroke={getDevelopmentColor(node.character)}
                  strokeWidth={selectedNode === node.id ? "3" : "2"}
                  className="drop-shadow-sm transition-all duration-300 hover:drop-shadow-md"
                  style={{
                    filter: selectedNode === node.id ? "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))" : "none",
                  }}
                />

                {/* Decorative corner */}
                <polygon points="100,20 120,20 120,40" fill={getDevelopmentColor(node.character)} opacity="0.1" />

                {/* Selection highlight más sutil */}
                {selectedNode === node.id && (
                  <rect
                    width="120"
                    height="100"
                    rx="8"
                    fill="rgba(217, 119, 6, 0.05)"
                    stroke="#d97706"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    opacity="0.8"
                  />
                )}

                {/* Character image con marco elegante */}
                <foreignObject x="15" y="15" width="60" height="60">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 mx-auto transition-transform duration-300 hover:scale-105 shadow-sm">
                    <img
                      src={getCharacterImage(node.character.id) || "/placeholder.svg"}
                      alt={node.character.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </foreignObject>

                {/* Character name con tipografía serif */}
                <text
                  x="60"
                  y="88"
                  textAnchor="middle"
                  className="text-xs font-serif font-medium fill-gray-800"
                  style={{ fontSize: "11px" }}
                >
                  {node.character.name.length > 14 ? `${node.character.name.substring(0, 14)}...` : node.character.name}
                </text>

                {/* Development indicator más discreto */}
                <circle cx="105" cy="25" r="4" fill={getDevelopmentColor(node.character)} opacity="0.8" />

                {/* Focus icon para nodo seleccionado */}
                {selectedNode === node.id && (
                  <foreignObject x="95" y="10" width="15" height="15">
                    <Focus className="h-3 w-3 text-amber-600" />
                  </foreignObject>
                )}
              </g>
            ))}
          </AnimatePresence>
        </svg>
      </div>

      {/* Quick focus buttons con estilo editorial */}
      <motion.div
        className="p-6 bg-white/80 backdrop-blur-sm border-t border-amber-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-4">
          <h4 className="text-sm font-serif font-medium mb-3 text-gray-800">Enfocar Personaje:</h4>
          <div className="flex flex-wrap gap-2">
            {characters.slice(0, 8).map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => focusOnCharacter(character.id)}
                  className="text-xs h-8 font-serif border-amber-300 hover:bg-amber-50 hover:border-amber-400"
                >
                  <Focus className="h-3 w-3 mr-1" />
                  {character.name.split(" ")[0]}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend con estilo editorial */}
        <motion.div
          className="flex items-center gap-6 text-sm font-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
            <span className="text-gray-700">Desarrollo Completo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
            <span className="text-gray-700">En Desarrollo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-gray-700">Desarrollo Básico</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-4 h-0.5 bg-amber-600 border-dashed"></div>
            <span className="text-gray-700">Relación Narrativa</span>
          </div>
          <div className="text-xs text-gray-500 ml-4 italic">
            💡 Doble click en las conexiones para análisis detallado
          </div>
        </motion.div>
      </motion.div>

      {/* Relationship Popup */}
      {relationshipPopup.character1 && relationshipPopup.character2 && (
        <RelationshipPopup
          isOpen={relationshipPopup.isOpen}
          onClose={() =>
            setRelationshipPopup({
              isOpen: false,
              character1: null,
              character2: null,
            })
          }
          character1={relationshipPopup.character1}
          character2={relationshipPopup.character2}
        />
      )}
    </div>
  )
}
