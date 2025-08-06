"use client"

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface UsersListProps {
  users: any[]
  onSelectProfile: (user: any) => void
  onSelectProjects: (user: any) => void
}

export default function UsersList({ users, onSelectProfile, onSelectProjects }: UsersListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Usuarios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{user.displayName}</h3>
                <p className="text-sm text-gray-400">@{user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>{user.projectsCount} proyectos</span>
              <span className={`px-2 py-1 rounded text-xs ${
                user.plan === 'premium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {user.plan}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => onSelectProfile(user)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ver Perfil
              </button>
              <button
                onClick={() => onSelectProjects(user)}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Proyectos
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
