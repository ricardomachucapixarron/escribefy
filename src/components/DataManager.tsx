"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Edit } from 'lucide-react'

// Import users index to get all users
import usersIndex from '@/data/users-index.json'

// Import sub-components
import UsersList from './data-manager/UsersList'
import UserProfileForm from './data-manager/UserProfileForm'
import ProjectsList from './data-manager/ProjectsList'
import ChaptersList from './data-manager/ChaptersList'
import JsonEditor from './data-manager/JsonEditor'
import Breadcrumb from './data-manager/Breadcrumb'

interface DataManagerProps {
  onClose?: () => void
}

interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  status: string
  plan: string
  projectsCount: number
  totalWords: number
}

interface Project {
  id: string
  title: string
  author: string
  genre: string
  status: string
  synopsis?: string
  wordCount?: number
  lastModified?: Date
}

interface Chapter {
  id: string
  title: string
  synopsis?: string
  wordCount?: number
  order?: number
  lastModified?: Date
  status: string
}

export default function DataManager({ onClose }: DataManagerProps) {
  const [currentView, setCurrentView] = useState<'users' | 'user-profile' | 'projects' | 'project' | 'chapters' | 'chapter'>('users')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  
  const [users, setUsers] = useState<User[]>(usersIndex.users)
  const [userProjects, setUserProjects] = useState<Project[]>([])
  const [projectChapters, setProjectChapters] = useState<Chapter[]>([])
  
  const [currentData, setCurrentData] = useState<any>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))
  const [message, setMessage] = useState('')
  const [jsonData, setJsonData] = useState('')
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Usuarios'])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  // Save JSON data
  const saveJsonData = async (type: 'project' | 'chapter' | 'profile') => {
    if (!selectedUser) return
    
    try {
      let filePath = ''
      if (type === 'profile') {
        filePath = `users/${selectedUser.id}/profile.json`
      } else if (type === 'project' && selectedProject) {
        filePath = `users/${selectedUser.id}/projects/${selectedProject.id}/project.json`
      } else if (type === 'chapter' && selectedProject && selectedChapter) {
        filePath = `users/${selectedUser.id}/projects/${selectedProject.id}/chapters/${selectedChapter.id}.json`
      }
      
      if (!filePath) {
        showMessage('Error: No se pudo determinar la ruta del archivo')
        return
      }
      
      const response = await fetch('/api/save-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath,
          data: JSON.parse(jsonData)
        })
      })
      
      if (response.ok) {
        showMessage('Datos guardados exitosamente')
      } else {
        showMessage('Error al guardar los datos')
      }
    } catch (error) {
      console.error('Error saving data:', error)
      showMessage('Error al procesar los datos JSON')
    }
  }

  // Load user profile data
  const loadUserProfile = async (userId: string) => {
    try {
      showMessage('Cargando perfil de usuario...')
      
      const response = await fetch(`/api/load-json?file=users/${userId}/profile.json`)
      if (response.ok) {
        const data = await response.json()
        setCurrentData(data)
        setJsonData(JSON.stringify(data, null, 2))
        showMessage('')
      } else {
        throw new Error('Error al cargar el perfil')
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      showMessage('Error al cargar el perfil del usuario')
      setCurrentData({})
      setJsonData('{}')
    }
  }

  // Navigate to user profile
  const navigateToUserProfile = async (user: any) => {
    setSelectedUser(user)
    await loadUserProfile(user.id)
    setCurrentView('user-profile')
  }

  // Load user projects
  const loadUserProjects = async (userId: string) => {
    try {
      const response = await fetch(`/api/list-projects?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserProjects(data.projects)
      } else {
        showMessage('Error al cargar los proyectos del usuario')
      }
    } catch (error) {
      console.error('Error loading user projects:', error)
      showMessage('Error al cargar los proyectos del usuario')
    }
  }

  // Load project data
  const loadProject = async (userId: string, projectId: string) => {
    try {
      const response = await fetch(`/api/load-json?file=users/${userId}/projects/${projectId}/project.json`)
      if (response.ok) {
        const data = await response.json()
        setCurrentData(data)
        setExpandedSections(new Set(['basic', 'characters', 'locations']))
      }
    } catch (error) {
      console.error('Error loading project:', error)
      showMessage('Error al cargar el proyecto')
    }
  }

  // Load project chapters
  const loadProjectChapters = async (userId: string, projectId: string) => {
    try {
      const response = await fetch(`/api/list-chapters?userId=${userId}&projectId=${projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProjectChapters(data.chapters)
      } else {
        showMessage('Error al cargar los capítulos del proyecto')
      }
    } catch (error) {
      console.error('Error loading project chapters:', error)
      showMessage('Error al cargar los capítulos del proyecto')
    }
  }

  // Load chapter data
  const loadChapter = async (userId: string, projectId: string, chapterId: string) => {
    try {
      const response = await fetch(`/api/load-json?file=users/${userId}/projects/${projectId}/chapters/${chapterId}.json`)
      if (response.ok) {
        const data = await response.json()
        setCurrentData(data)
        setExpandedSections(new Set(['basic', 'content', 'metadata']))
      }
    } catch (error) {
      console.error('Error loading chapter:', error)
      showMessage('Error al cargar el capítulo')
    }
  }

  // Save current data
  const saveData = async () => {
    try {
      let filePath = ''
      
      if (currentView === 'user-profile' && selectedUser) {
        filePath = `users/${selectedUser.id}/profile.json`
      } else if (currentView === 'project' && selectedUser && selectedProject) {
        filePath = `users/${selectedUser.id}/projects/${selectedProject.id}/project.json`
      } else if (currentView === 'chapter' && selectedUser && selectedProject && selectedChapter) {
        filePath = `users/${selectedUser.id}/projects/${selectedProject.id}/chapters/${selectedChapter.id}.json`
      }

      if (filePath) {
        const response = await fetch('/api/save-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: filePath,
            data: currentData
          })
        })

        if (response.ok) {
          showMessage('¡Datos guardados exitosamente!')
        } else {
          showMessage('Error al guardar los datos')
        }
      }
    } catch (error) {
      console.error('Error saving data:', error)
      showMessage('Error al guardar los datos')
    }
  }

  // Navigation functions
  const selectUser = (user: User) => {
    setSelectedUser(user)
    setCurrentView('projects')
    setBreadcrumb(['Usuarios', user.displayName, 'Proyectos'])
    loadUserProjects(user.id)
  }

  // View user profile
  const viewUserProfile = async (user: User) => {
    setSelectedUser(user)
    setCurrentView('user-profile')
    setBreadcrumb(['Usuarios', user.displayName, 'Perfil'])
    try {
      const response = await fetch(`/api/load-json?filePath=users/${user.id}/profile.json`)
      if (response.ok) {
        const data = await response.json()
        setJsonData(JSON.stringify(data, null, 2))
        setCurrentData(data)
      } else {
        showMessage('Error al cargar el perfil del usuario')
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      showMessage('Error al cargar el perfil del usuario')
    }
  }

  const viewUserProjects = (user: User) => {
    setSelectedUser(user)
    setCurrentView('projects')
    setBreadcrumb(['Usuarios', user.displayName, 'Proyectos'])
    loadUserProjects(user.id)
  }

  const selectProject = async (project: Project) => {
    setSelectedProject(project)
    setCurrentView('project')
    if (selectedUser) {
      try {
        const response = await fetch(`/api/load-json?filePath=users/${selectedUser.id}/projects/${project.id}/project.json`)
        if (response.ok) {
          const data = await response.json()
          setJsonData(JSON.stringify(data, null, 2))
        } else {
          showMessage('Error al cargar los datos del proyecto')
        }
      } catch (error) {
        console.error('Error loading project data:', error)
        showMessage('Error al cargar los datos del proyecto')
      }
    }
  }

  const viewProjectChapters = (project: Project) => {
    setSelectedProject(project)
    setCurrentView('chapters')
    setBreadcrumb(['Usuarios', selectedUser?.displayName || '', 'Proyectos', project.title, 'Capítulos'])
    if (selectedUser) {
      loadProjectChapters(selectedUser.id, project.id)
    }
  }

  const selectChapter = async (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setCurrentView('chapter')
    setBreadcrumb(['Usuarios', selectedUser?.displayName || '', 'Proyectos', selectedProject?.title || '', 'Capítulos', chapter.title])
    // Load chapter data for editing
    if (selectedUser && selectedProject) {
      try {
        const response = await fetch(`/api/load-json?filePath=users/${selectedUser.id}/projects/${selectedProject.id}/chapters/${chapter.id}.json`)
        if (response.ok) {
          const data = await response.json()
          setJsonData(JSON.stringify(data, null, 2))
        } else {
          showMessage('Error al cargar los datos del capítulo')
        }
      } catch (error) {
        console.error('Error loading chapter data:', error)
        showMessage('Error al cargar los datos del capítulo')
      }
    }
  }

  const goBack = () => {
    switch (currentView) {
      case 'user-profile':
      case 'projects':
        setCurrentView('users')
        setSelectedUser(null)
        break
      case 'project':
      case 'chapters':
        setCurrentView('projects')
        setSelectedProject(null)
        break
      case 'chapter':
        setCurrentView('chapters')
        setSelectedChapter(null)
        break
      default:
        setCurrentView('users')
    }
  }

  // Render breadcrumb navigation
  const renderBreadcrumb = () => {
    const items = []
    
    if (currentView !== 'users') {
      items.push({ label: 'Usuarios', onClick: () => setCurrentView('users') })
    }
    
    if (selectedUser && (currentView === 'user-profile' || currentView === 'projects' || currentView === 'project' || currentView === 'chapters' || currentView === 'chapter')) {
      items.push({ label: selectedUser.displayName, onClick: () => viewUserProjects(selectedUser) })
    }
    
    if (selectedProject && (currentView === 'project' || currentView === 'chapters' || currentView === 'chapter')) {
      items.push({ label: selectedProject.title, onClick: () => viewProjectChapters(selectedProject) })
    }
    
    if (selectedChapter && currentView === 'chapter') {
      items.push({ label: selectedChapter.title, isActive: true })
    }
    
    return <Breadcrumb items={items} />
  }

  // Render users list
  const renderUsersList = () => (
    <UsersList 
      users={users}
      onSelectProfile={navigateToUserProfile}
      onSelectProjects={viewUserProjects}
    />
  )

  // Update profile field
  const updateProfileField = (path: string[], value: any) => {
    const updatedData = { ...currentData }
    let current = updatedData
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {}
      current = current[path[i]]
    }
    
    current[path[path.length - 1]] = value
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  // Add portfolio item
  const addPortfolioItem = () => {
    const newItem = {
      id: `img-${Date.now()}`,
      filename: 'nueva-imagen.png',
      path: '/user-avatars/nueva-imagen.png',
      description: 'Nueva imagen del portfolio',
      tags: ['portfolio'],
      createdAt: new Date().toISOString()
    }
    
    const portfolio = currentData.user?.portfolio || []
    updateProfileField(['user', 'portfolio'], [...portfolio, newItem])
  }

  // Remove portfolio item
  const removePortfolioItem = (index: number) => {
    const portfolio = currentData.user?.portfolio || []
    const updatedPortfolio = portfolio.filter((_: any, i: number) => i !== index)
    updateProfileField(['user', 'portfolio'], updatedPortfolio)
  }

  // Render user profile form
  const renderUserProfileForm = () => (
    <UserProfileForm 
      currentData={currentData}
      updateProfileField={updateProfileField}
      addPortfolioItem={addPortfolioItem}
      removePortfolioItem={removePortfolioItem}
    />
  )

  // Render current view content
  const renderContent = () => {
    switch (currentView) {
      case 'user-profile':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Perfil de {selectedUser?.displayName}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => saveJsonData('profile')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar Perfil
                </button>
                <button
                  onClick={() => setCurrentView('users')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
            
            {renderUserProfileForm()}
          </div>
        )
      case 'users':
        return renderUsersList()
      case 'projects':
        return (
          <ProjectsList 
            projects={userProjects}
            selectedUser={selectedUser}
            onEditProject={selectProject}
            onViewChapters={viewProjectChapters}
          />
        )
      case 'project':
        return (
          <JsonEditor 
            title={`Editando: ${selectedProject?.title}`}
            jsonData={jsonData}
            onJsonChange={setJsonData}
            onSave={() => saveJsonData('project')}
            onBack={() => setCurrentView('projects')}
          />
        )
      case 'chapters':
        return (
          <ChaptersList 
            chapters={projectChapters}
            selectedProject={selectedProject}
            onEditChapter={selectChapter}
          />
        )
      case 'chapter':
        return (
          <JsonEditor 
            title={`Editando: ${selectedChapter?.title}`}
            jsonData={jsonData}
            onJsonChange={setJsonData}
            onSave={() => saveJsonData('chapter')}
            onBack={() => setCurrentView('chapters')}
          />
        )
      default:
        return renderUsersList()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-slate-900 z-50 overflow-auto"
    >
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              {currentView !== 'users' && (
                <button
                  onClick={goBack}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <Edit className="h-6 w-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Editor JSON Escalable</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {currentView !== 'users' && (
                <button
                  onClick={saveData}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </button>
              )}
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
          
          {renderBreadcrumb()}
        </div>

        {/* Content */}
        <div className="p-6">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
            >
              {message}
            </motion.div>
          )}
          
          {renderContent()}
        
        {/* Message Display */}
        {message && (
          <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  </motion.div>
)
}
