"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Database } from 'lucide-react'
import Link from 'next/link'
import GenericEntityManager from '@/components/GenericEntityManager'

export default function DataManagerPage() {
  const [showGenericEditor, setShowGenericEditor] = useState(false)

  if (showGenericEditor) {
    return <GenericEntityManager onClose={() => setShowGenericEditor(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
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

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-8">
            Gestor de Datos NovelCraft
          </h1>
          
          <div className="mb-8">
            <button
              onClick={() => setShowGenericEditor(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              <Database className="h-5 w-5" />
              Editor Genérico
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <p className="text-blue-200">
              💡 Haz clic en "Editor Genérico" para ver el componente funcionando.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}