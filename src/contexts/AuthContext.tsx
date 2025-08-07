'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Author {
  id: string
  name: string
  email: string
  avatar: string
  description: string
}

interface AuthContextType {
  currentUser: Author | null
  login: (author: Author) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Author | null>(null)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('novelcraft-current-user')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading saved user:', error)
        localStorage.removeItem('novelcraft-current-user')
      }
    }
  }, [])

  const login = (author: Author) => {
    setCurrentUser(author)
    localStorage.setItem('novelcraft-current-user', JSON.stringify(author))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('novelcraft-current-user')
  }

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
