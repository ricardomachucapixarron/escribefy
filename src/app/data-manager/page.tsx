"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Shield, AlertTriangle, Edit } from 'lucide-react'
import Link from 'next/link'
import DataManager from '@/components/DataManager'

export default function DataManagerPage() {
  const [showFriendlyEditor, setShowFriendlyEditor] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Link>
              <div className="w-px h-6 bg-slate-600" />
              <div className="flex items-center gap-3">
                <Edit className="h-6 w-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Data Manager</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {!showFriendlyEditor ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-6"
              >
                <Edit className="h-10 w-10 text-blue-400" />
              </motion.div>
              
              <h1 className="text-4xl font-bold text-white mb-4">
                Gestor de Datos NovelCraft
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Editor avanzado para gestionar perfiles de usuario y proyectos de NovelCraft
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Validación JSON</h3>
                <p className="text-gray-400">
                  Validación automática de sintaxis y estructura de archivos JSON
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Edit className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Gestión de Proyectos</h3>
                <p className="text-gray-400">
                  Agregar, editar y eliminar proyectos, personajes y capítulos
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Modo Desarrollo</h3>
                <p className="text-gray-400">
                  Herramienta de desarrollo para testing y depuración de datos
                </p>
              </motion.div>
            </div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-8"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">
                    ⚠️ Herramienta de Desarrollo
                  </h3>
                  <p className="text-amber-200/80">
                    Este mantenedor está diseñado para desarrollo y testing. Los cambios realizados 
                    aquí modificarán los archivos JSON que usa la aplicación. Asegúrate de hacer 
                    respaldos antes de realizar cambios importantes.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="text-center space-y-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowFriendlyEditor(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 mr-4"
              >
                <Edit className="h-5 w-5" />
                Editor Amigable (Recomendado)
              </motion.button>
              

            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">2</div>
                <div className="text-sm text-gray-400">Archivos JSON</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">3</div>
                <div className="text-sm text-gray-400">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">15+</div>
                <div className="text-sm text-gray-400">Personajes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">20+</div>
                <div className="text-sm text-gray-400">Capítulos</div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <DataManager onClose={() => setShowFriendlyEditor(false)} />
        )}
      </div>
    </div>
  )
}
