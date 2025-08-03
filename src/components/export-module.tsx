"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, BookOpen, CheckCircle, AlertCircle, Loader2, Archive } from "lucide-react"
import type { NovelProject } from "@/hooks/use-novel-project"

interface ExportModuleProps {
  project: NovelProject
}

export function ExportModule({ project }: ExportModuleProps) {
  const [exportFormat, setExportFormat] = useState<string>("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [manuscriptMetadata, setManuscriptMetadata] = useState({
    authorName: "",
    authorAddress: "",
    authorPhone: "",
    authorEmail: "",
    wordCount: project.wordCount,
    genre: project.genre || "",
    synopsis: "",
  })

  const exportFormats = [
    {
      id: "docx",
      name: "Formato Editorial Profesional (.docx)",
      description: "Manuscrito estándar para envío a editoriales",
      icon: FileText,
      requirements: [
        "Fuente Courier New, 12pt",
        "Doble espacio entre líneas",
        "Márgenes de 1 pulgada",
        "Información de contacto en primera página",
        "Numeración de páginas",
        "Encabezados de capítulo estandarizados",
      ],
    },
    {
      id: "epub",
      name: "Formato Kindle (.epub)",
      description: "Listo para Kindle Direct Publishing (KDP)",
      icon: BookOpen,
      requirements: [
        "Tabla de contenidos automática",
        "Metadatos de publicación",
        "Formato responsive para diferentes pantallas",
        "Saltos de página entre capítulos",
        "Imágenes optimizadas (si las hay)",
      ],
    },
    {
      id: "backup",
      name: "Copia de Seguridad Completa (.zip)",
      description: "Todo el proyecto para portabilidad y seguridad",
      icon: Archive,
      requirements: [
        "Todos los datos del proyecto",
        "Dossier completo (personajes, lugares, lore)",
        "Estructura narrativa y pulsos",
        "Manuscrito completo",
        "Historial de análisis de IA",
        "Formato JSON legible",
      ],
    },
  ]

  const exportProject = async (format: string) => {
    setIsExporting(true)
    setExportProgress(0)
    setExportFormat(format)

    // Simular proceso de exportación
    const steps = [
      "Validando proyecto...",
      "Preparando contenido...",
      "Aplicando formato...",
      "Generando archivo...",
      "Finalizando exportación...",
    ]

    for (let i = 0; i < steps.length; i++) {
      setExportProgress((i + 1) * 20)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Simular descarga
    const formatData = exportFormats.find((f) => f.id === format)
    if (formatData) {
      alert(
        `¡Exportación completada!\n\nArchivo: ${project.title || "Mi Novela"}.${format}\nFormato: ${formatData.name}\n\nEn una implementación real, el archivo se descargaría automáticamente.`,
      )
    }

    setIsExporting(false)
    setExportProgress(0)
  }

  const validateProject = () => {
    const issues = []

    if (!project.title) issues.push("Falta título del proyecto")
    if (project.chapters.length === 0) issues.push("No hay capítulos creados")
    if (project.wordCount < 1000) issues.push("Contenido insuficiente para exportación")
    if (!manuscriptMetadata.authorName) issues.push("Falta información del autor")

    return issues
  }

  const validationIssues = validateProject()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exportación Final</h1>
        <p className="text-gray-600">Prepara tu novela para publicación en formatos profesionales.</p>
      </div>

      <div className="grid gap-6">
        {/* Estado del Proyecto */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Proyecto</CardTitle>
            <CardDescription>Verifica que tu proyecto esté listo para exportar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{project.chapters.length}</div>
                <div className="text-sm text-gray-600">Capítulos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{project.wordCount.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Palabras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{project.characters.length}</div>
                <div className="text-sm text-gray-600">Personajes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{project.locations.length}</div>
                <div className="text-sm text-gray-600">Lugares</div>
              </div>
            </div>

            {validationIssues.length > 0 ? (
              <div className="border-l-4 border-l-yellow-500 bg-yellow-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Advertencias de Validación</span>
                </div>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  {validationIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border-l-4 border-l-green-500 bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">Proyecto listo para exportación</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Tu novela cumple con todos los requisitos básicos para exportación.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metadatos del Manuscrito */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Autor</CardTitle>
            <CardDescription>Datos necesarios para la exportación profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Nombre del Autor *</Label>
                <Input
                  id="authorName"
                  value={manuscriptMetadata.authorName}
                  onChange={(e) =>
                    setManuscriptMetadata({
                      ...manuscriptMetadata,
                      authorName: e.target.value,
                    })
                  }
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="authorEmail">Email</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={manuscriptMetadata.authorEmail}
                  onChange={(e) =>
                    setManuscriptMetadata({
                      ...manuscriptMetadata,
                      authorEmail: e.target.value,
                    })
                  }
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="authorAddress">Dirección</Label>
              <Textarea
                id="authorAddress"
                value={manuscriptMetadata.authorAddress}
                onChange={(e) =>
                  setManuscriptMetadata({
                    ...manuscriptMetadata,
                    authorAddress: e.target.value,
                  })
                }
                placeholder="Dirección completa para correspondencia editorial"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="synopsis">Sinopsis</Label>
              <Textarea
                id="synopsis"
                value={manuscriptMetadata.synopsis}
                onChange={(e) =>
                  setManuscriptMetadata({
                    ...manuscriptMetadata,
                    synopsis: e.target.value,
                  })
                }
                placeholder="Resumen breve de la novela (250-500 palabras)"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Formatos de Exportación */}
        <div className="grid gap-4">
          {exportFormats.map((format) => {
            const Icon = format.icon
            return (
              <Card key={format.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{format.name}</CardTitle>
                        <CardDescription>{format.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={() => exportProject(format.id)}
                      disabled={isExporting || (validationIssues.length > 0 && format.id !== "backup")}
                    >
                      {isExporting && exportFormat === format.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Exportando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2">Incluye:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-gray-600">
                      {format.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isExporting && exportFormat === format.id && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progreso de Exportación</span>
                        <span className="text-sm text-gray-600">{exportProgress}%</span>
                      </div>
                      <Progress value={exportProgress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Ayuda y Consejos */}
        <Card>
          <CardHeader>
            <CardTitle>Consejos para la Exportación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Formato Editorial (.docx)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ideal para envío a agentes literarios y editoriales</li>
                  <li>• Sigue estándares de la industria editorial</li>
                  <li>• Incluye página de título con información completa</li>
                  <li>• Numeración automática de páginas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Formato Kindle (.epub)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Perfecto para autopublicación en Amazon KDP</li>
                  <li>• Formato responsive para todos los dispositivos</li>
                  <li>• Tabla de contenidos interactiva</li>
                  <li>• Metadatos optimizados para búsqueda</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
