"use client"

import { motion } from 'framer-motion'
import { 
  User,
  Image,
  Plus,
  Trash2,
  Target,
  Calendar
} from 'lucide-react'

interface UserProfileFormProps {
  currentData: any
  updateProfileField: (path: string[], value: any) => void
  addPortfolioItem: () => void
  removePortfolioItem: (index: number) => void
}

export default function UserProfileForm({ 
  currentData, 
  updateProfileField, 
  addPortfolioItem, 
  removePortfolioItem 
}: UserProfileFormProps) {
  if (!currentData.user) return <div className="text-gray-400">Cargando perfil...</div>

  const user = currentData.user

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Información Básica</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ID de Usuario</label>
            <input
              type="text"
              value={user.id || ''}
              onChange={(e) => updateProfileField(['user', 'id'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
            <input
              type="text"
              value={user.username || ''}
              onChange={(e) => updateProfileField(['user', 'username'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
            <input
              type="text"
              value={user.displayName || ''}
              onChange={(e) => updateProfileField(['user', 'displayName'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              onChange={(e) => updateProfileField(['user', 'email'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
            <input
              type="text"
              value={user.avatar || ''}
              onChange={(e) => updateProfileField(['user', 'avatar'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="/user-avatars/usuario-avatar.png"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Biografía</label>
            <textarea
              value={user.bio || ''}
              onChange={(e) => updateProfileField(['user', 'bio'], e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Describe tu experiencia como escritor..."
            />
          </div>
        </div>
      </motion.div>

      {/* Portfolio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Image className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Portfolio de Imágenes</h3>
          </div>
          <button
            onClick={addPortfolioItem}
            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Imagen
          </button>
        </div>
        
        <div className="space-y-4">
          {(user.portfolio || []).map((item: any, index: number) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Imagen {index + 1}</h4>
                <button
                  onClick={() => removePortfolioItem(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre del Archivo</label>
                  <input
                    type="text"
                    value={item.filename || ''}
                    onChange={(e) => {
                      const portfolio = [...(user.portfolio || [])]
                      portfolio[index] = { ...portfolio[index], filename: e.target.value }
                      updateProfileField(['user', 'portfolio'], portfolio)
                    }}
                    className="w-full px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Ruta de la Imagen</label>
                  <input
                    type="text"
                    value={item.path || ''}
                    onChange={(e) => {
                      const portfolio = [...(user.portfolio || [])]
                      portfolio[index] = { ...portfolio[index], path: e.target.value }
                      updateProfileField(['user', 'portfolio'], portfolio)
                    }}
                    className="w-full px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Descripción</label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => {
                      const portfolio = [...(user.portfolio || [])]
                      portfolio[index] = { ...portfolio[index], description: e.target.value }
                      updateProfileField(['user', 'portfolio'], portfolio)
                    }}
                    rows={2}
                    className="w-full px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm resize-none"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1">Tags (separados por comas)</label>
                  <input
                    type="text"
                    value={(item.tags || []).join(', ')}
                    onChange={(e) => {
                      const portfolio = [...(user.portfolio || [])]
                      portfolio[index] = { ...portfolio[index], tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }
                      updateProfileField(['user', 'portfolio'], portfolio)
                    }}
                    className="w-full px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                    placeholder="portrait, profile, character"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {(!user.portfolio || user.portfolio.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay imágenes en el portfolio</p>
              <p className="text-sm">Haz clic en "Agregar Imagen" para comenzar</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Subscription Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Suscripción</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
            <select
              value={user.subscription?.plan || 'free'}
              onChange={(e) => updateProfileField(['user', 'subscription', 'plan'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="free">Gratuito</option>
              <option value="premium">Premium</option>
              <option value="pro">Profesional</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={user.subscription?.status || 'active'}
              onChange={(e) => updateProfileField(['user', 'subscription', 'status'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/50 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Preferencias</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tema</label>
            <select
              value={user.preferences?.theme || 'dark'}
              onChange={(e) => updateProfileField(['user', 'preferences', 'theme'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
            <select
              value={user.preferences?.language || 'es'}
              onChange={(e) => updateProfileField(['user', 'preferences', 'language'], e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoSave"
              checked={user.preferences?.autoSave || false}
              onChange={(e) => updateProfileField(['user', 'preferences', 'autoSave'], e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoSave" className="text-sm text-gray-300">Guardado automático</label>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="cinematicMode"
              checked={user.preferences?.cinematicMode || false}
              onChange={(e) => updateProfileField(['user', 'preferences', 'cinematicMode'], e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="cinematicMode" className="text-sm text-gray-300">Modo cinemático</label>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
