'use client'

import React, { useState } from 'react'
import { User, Lock, LogIn } from 'lucide-react'

interface Author {
  id: string
  name: string
  email: string
  avatar: string
  description: string
}

interface LoginScreenProps {
  onLogin: (author: Author) => void
}

const AUTHORS: Author[] = [
  {
    id: 'ricardo-machuca',
    name: 'Ricardo Machuca',
    email: 'ricardo@pixarron.com',
    avatar: '/user-avatars/ricardo-machuca-avatar.png',
    description: 'Escritor de fantasía épica y desarrollador de experiencias narrativas inmersivas.'
  },
  {
    id: 'solange-gongora',
    name: 'Solange Góngora',
    email: 'solange.gongora@escritora.com',
    avatar: '/user-avatars/solange-gongora-avatar.png',
    description: 'Autora reconocida de novelas de misterio y suspenso psicológico.'
  },
  {
    id: 'maite-cantillana',
    name: 'Maite Cantillana',
    email: 'maite.cantillana@literatura.com',
    avatar: '/user-avatars/maite-cantillana-avatar.png',
    description: 'Escritora contemporánea especializada en ficción histórica y realismo mágico.'
  }
]

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickLogin = async (author: Author) => {
    setIsLoading(true)
    setSelectedAuthor(author)
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      onLogin(author)
      setIsLoading(false)
    }, 800)
  }

  const handleManualLogin = () => {
    if (selectedAuthor) {
      handleQuickLogin(selectedAuthor)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">NovelCraft</h1>
          <p className="text-xl text-gray-300 mb-2">Sistema de Gestión Narrativa</p>
          <p className="text-gray-400">Selecciona un autor para acceder al sistema</p>
        </div>

        {/* Authors Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {AUTHORS.map((author) => (
            <div
              key={author.id}
              className={`bg-slate-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-slate-700 hover:scale-105 border-2 ${
                selectedAuthor?.id === author.id 
                  ? 'border-purple-500 bg-slate-700' 
                  : 'border-slate-600 hover:border-purple-400'
              }`}
              onClick={() => setSelectedAuthor(author)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center mb-4 text-white text-2xl font-bold">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{author.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{author.email}</p>
                <p className="text-gray-300 text-xs leading-relaxed">{author.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Login Actions */}
        <div className="flex flex-col items-center space-y-4">
          {/* Quick Login Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {AUTHORS.map((author) => (
              <button
                key={`quick-${author.id}`}
                onClick={() => handleQuickLogin(author)}
                disabled={isLoading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                <LogIn className="h-4 w-4" />
                <span className="font-medium">Acceso como {author.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Manual Login */}
          {selectedAuthor && (
            <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">Acceso Seleccionado</span>
              </div>
              <div className="text-center mb-4">
                <p className="text-gray-300">Iniciar sesión como:</p>
                <p className="text-white font-semibold text-lg">{selectedAuthor.name}</p>
              </div>
              <button
                onClick={handleManualLogin}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Sistema de prueba - Acceso directo disponible para todos los autores
          </p>
        </div>
      </div>
    </div>
  )
}
