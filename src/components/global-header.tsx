"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Settings, FileText, User } from "lucide-react"

interface GlobalHeaderProps {
  currentView: 'projects' | 'suite'
  projectTitle?: string
  onNavigateToProjects?: () => void
}

export function GlobalHeader({ currentView, projectTitle, onNavigateToProjects }: GlobalHeaderProps) {
  return (
    <motion.header
      className="sticky top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-full mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Navigation Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <button
              onClick={onNavigateToProjects}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Mi Biblioteca
            </button>
            
            {currentView === 'suite' && projectTitle && (
              <>
                <ChevronRight className="h-4 w-4 text-gray-500" />
                <span className="text-white font-medium">{projectTitle}</span>
              </>
            )}
          </motion.div>

          {/* Right Side - User Actions */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
              title="Documentación"
            >
              <FileText className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
              title="Configuración"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10 p-1"
              title="Mi Perfil"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
