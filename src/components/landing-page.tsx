"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { LogIn, UserPlus, BookOpen, Sparkles, Eye, HelpCircle, ChevronDown, MousePointer } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

const story = `En el reino de Aethermoor, donde las montañas tocaban las estrellas y los dragones aún surcaban los cielos, vivía una joven llamada Lyra.

Sus ojos brillaban con la magia ancestral de los Tejedores de Sueños, una orden perdida en las brumas del tiempo.

Una mañana, mientras exploraba las ruinas del Templo Cristalino, encontró un pergamino que cambiaría su destino para siempre.

El pergamino hablaba de la Llave de los Mundos, un artefacto capaz de abrir portales entre realidades.

Pero Lyra no estaba sola en su búsqueda. Las sombras del Reino Oscuro habían despertado, y su líder, el temible Señor de la Noche, también buscaba la llave.

La batalla final se libraría en el Nexo de las Realidades, donde el tiempo y el espacio se entrelazan en una danza eterna.

¿Podrá Lyra dominar sus poderes a tiempo para salvar no solo su mundo, sino todos los mundos posibles?

La aventura apenas comienza...`

// Lista de nombres propios para resaltar
const properNouns = [
  "Aethermoor",
  "Lyra",
  "Tejedores de Sueños",
  "Templo Cristalino",
  "Llave de los Mundos",
  "Reino Oscuro",
  "Señor de la Noche",
  "Nexo de las Realidades",
]

// Componente para texto con nombres propios resaltados
const HighlightedText = ({ text }: { text: string }) => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)

  // Función para resaltar nombres propios
  const highlightProperNouns = (text: string) => {
    let highlightedText = text

    properNouns.forEach((noun, index) => {
      const regex = new RegExp(`\\b${noun}\\b`, "gi")
      highlightedText = highlightedText.replace(regex, `<HIGHLIGHT_${index}>${noun}</HIGHLIGHT_${index}>`)
    })

    return highlightedText
  }

  const processedText = highlightProperNouns(text)
  const parts = processedText.split(/(<HIGHLIGHT_\d+>.*?<\/HIGHLIGHT_\d+>)/)

  return (
    <span>
      {parts.map((part, index) => {
        const highlightMatch = part.match(/<HIGHLIGHT_(\d+)>(.*?)<\/HIGHLIGHT_\d+>/)

        if (highlightMatch) {
          const nounIndex = Number.parseInt(highlightMatch[1])
          const nounText = highlightMatch[2]

          return (
            <motion.span
              key={index}
              className="relative inline-block cursor-pointer"
              onMouseEnter={() => setHoveredWord(nounText)}
              onMouseLeave={() => setHoveredWord(null)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* Efecto de brillo de fondo */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-md blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: hoveredWord === nounText ? 1 : 0,
                  scale: hoveredWord === nounText ? 1.2 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Texto principal con gradiente */}
              <span
                className="relative z-10 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent font-semibold"
                style={{
                  textShadow: hoveredWord === nounText ? "0 0 20px rgba(139, 92, 246, 0.5)" : "none",
                  filter: hoveredWord === nounText ? "brightness(1.3)" : "brightness(1)",
                }}
              >
                {nounText}
              </span>

              {/* Partículas brillantes al hacer hover */}
              {hoveredWord === nounText && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-purple-400 rounded-full pointer-events-none"
                      initial={{
                        x: Math.random() * 40 - 20,
                        y: Math.random() * 20 - 10,
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        y: -30,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.2,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}

              {/* Subrayado animado */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ width: 0 }}
                animate={{ width: hoveredWord === nounText ? "100%" : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.span>
          )
        }

        return <span key={index}>{part}</span>
      })}
    </span>
  )
}

// Componente para animar letras individuales
const AnimatedText = ({ text }: { text: string }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <span className="inline-block">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className="inline-block cursor-pointer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            scale: hoveredIndex === index ? 1.2 : 1,
            rotateZ: hoveredIndex === index ? [-2, 2, -2, 0] : 0,
            color: hoveredIndex === index ? "#a855f7" : undefined,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            rotateZ: {
              duration: 0.6,
              ease: "easeInOut",
            },
          }}
          style={{
            display: char === " " ? "inline" : "inline-block",
            marginRight: char === " " ? "0.25em" : "0",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

// Componente para botón moderno con efectos
const ModernButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-xl px-12 py-6 rounded-2xl shadow-lg text-white font-semibold"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Fondo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Efecto de brillo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%", skewX: -15 }}
        animate={{ x: isHovered ? "200%" : "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Partículas flotantes */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 60 - 30,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: -50,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  )
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [showScrollMessage, setShowScrollMessage] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const textProgress = useTransform(scrollYProgress, [0, 0.95], [0, 1])
  const backgroundOpacity = useTransform(scrollYProgress, [0.2, 0.7], [0, 1])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  // Update displayed text based on scroll progress
  useEffect(() => {
    const unsubscribe = textProgress.on("change", (progress) => {
      const targetIndex = Math.floor(progress * story.length)
      setDisplayedText(story.slice(0, targetIndex))
    })
    return unsubscribe
  }, [textProgress])

  // Show scroll message after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasScrolled) setShowScrollMessage(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hasScrolled])

  // Track if user has scrolled
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress > 0.01 && !hasScrolled) {
        setHasScrolled(true)
        setShowScrollMessage(false)
      }
    })
    return unsubscribe
  }, [scrollYProgress, hasScrolled])

  return (
    <div ref={containerRef} className="min-h-[800vh] bg-black text-white overflow-hidden">
      {/* Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">NovelCraft AI</span>
            </motion.div>

            <motion.nav
              className="hidden md:flex items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Button variant="ghost" className="text-white hover:text-purple-400 hover:bg-white/5">
                <BookOpen className="h-4 w-4 mr-2" />
                Ejemplos
              </Button>
              <Button variant="ghost" className="text-white hover:text-purple-400 hover:bg-white/5">
                <Eye className="h-4 w-4 mr-2" />
                Demo
              </Button>
              <Button variant="ghost" className="text-white hover:text-purple-400 hover:bg-white/5">
                <HelpCircle className="h-4 w-4 mr-2" />
                Ayuda
              </Button>
            </motion.nav>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Background */}
      <motion.div className="fixed inset-0 z-0" style={{ opacity: backgroundOpacity }}>
        <img
          src="/story-images/aethermoor-world-background.png"
          alt="El mundo de Aethermoor"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Main Content */}
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            {/* Contenedor transparente para el texto */}
            <motion.div
              className="h-[50vh] w-[800px] p-8 mx-auto overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="h-full flex items-end justify-center">
                {displayedText ? (
                  <div className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/90 font-mono text-center">
                    <HighlightedText text={displayedText} />
                    <motion.span
                      className="inline-block w-1 h-6 bg-purple-400 ml-2"
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                ) : (
                  <motion.div
                    className="text-gray-400 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.8 }}
                  >
                    Una nueva historia está por comenzar...
                    <motion.span
                      className="inline-block w-1 h-6 bg-purple-400 ml-2"
                      animate={{ opacity: [1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
        style={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-full p-4 border border-white/20 mb-4"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showScrollMessage && !hasScrolled ? 1 : 0,
            y: showScrollMessage && !hasScrolled ? 0 : 20,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <MousePointer className="h-4 w-4" />
              <span>Desplázate para continuar la historia</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="fixed top-20 right-6 z-50"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}
      >
        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                style={{ scaleX: scrollYProgress }}
                transformOrigin="left"
              />
            </div>
            <span>{Math.round(scrollYProgress.get() * 100)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.95, 1], [0, 1]) }}
      >
        <motion.div
          className="text-center pointer-events-auto bg-black/90 backdrop-blur-lg rounded-3xl p-12 border-2 border-white/30 shadow-2xl max-w-4xl mx-4"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.3)",
            borderColor: "rgba(139, 92, 246, 0.5)",
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              <AnimatedText text="Tu Historia Espera" />
            </h2>
            <p className="text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              <AnimatedText text="Comienza a escribir tu próxima gran novela con la ayuda de IA. Descubre mundos infinitos de posibilidades creativas." />
            </p>
            <ModernButton onClick={onGetStarted}>
              <Sparkles className="h-6 w-6 mr-3" />
              Comenzar Ahora
            </ModernButton>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
