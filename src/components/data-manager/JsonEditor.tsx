"use client"

import { motion } from 'framer-motion'
import { Save, ArrowLeft } from 'lucide-react'

interface JsonEditorProps {
  title: string
  jsonData: string
  onJsonChange: (value: string) => void
  onSave: () => void
  onBack: () => void
  saveButtonText?: string
}

export default function JsonEditor({ 
  title, 
  jsonData, 
  onJsonChange, 
  onSave, 
  onBack,
  saveButtonText = "Guardar Cambios"
}: JsonEditorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveButtonText}
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <textarea
          value={jsonData}
          onChange={(e) => onJsonChange(e.target.value)}
          className="w-full h-96 bg-slate-900 text-white font-mono text-sm p-4 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Datos JSON..."
        />
      </motion.div>
    </div>
  )
}
