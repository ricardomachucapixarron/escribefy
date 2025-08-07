'use client'

import React, { useState } from 'react'
import { User, LogOut, ChevronDown, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserHeader() {
  const { currentUser, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  if (!currentUser) return null

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NovelCraft</h1>
            <p className="text-xs text-gray-400">Sistema de Gestión Narrativa</p>
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-white text-sm font-medium">{currentUser.name}</p>
              <p className="text-gray-400 text-xs">{currentUser.email}</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-medium">{currentUser.name}</p>
                    <p className="text-gray-400 text-sm">{currentUser.email}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                  {currentUser.description}
                </p>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors duration-200"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-md transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
