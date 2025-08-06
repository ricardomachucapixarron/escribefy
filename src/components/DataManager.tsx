"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, Edit, Users, MapPin, Layers } from 'lucide-react'

// Import users index to get all users
import usersIndex from '@/data/users-index.json'

// Import sub-components
import UsersList from './data-manager/UsersList'
import UserProfileForm from './data-manager/UserProfileForm'
import ProjectsList from './data-manager/ProjectsList'
import ProjectForm from './data-manager/ProjectForm'
import ChaptersList from './data-manager/ChaptersList'
import ChapterForm from './data-manager/ChapterForm'
import ChapterDetail from './data-manager/ChapterDetail'
import CharactersForm from './data-manager/CharactersForm'
import LocationsForm from './data-manager/LocationsForm'
import JsonEditor from './data-manager/JsonEditor'
import Breadcrumb from './data-manager/Breadcrumb'
import GroupTypesList from './data-manager/GroupTypesList'
import GroupTypeDetail from './data-manager/GroupTypeDetail'
import GroupsList from './data-manager/GroupsList'
import GroupDetail from './data-manager/GroupDetail'


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
  const [currentView, setCurrentView] = useState<'users' | 'user-profile' | 'projects' | 'project' | 'chapters' | 'chapter' | 'characters' | 'locations' | 'groups' | 'groupTypeDetail' | 'groupsList' | 'groupDetail'>('users')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  // Estados auxiliares para navegación de grupos
  const [selectedGroupTypeId, setSelectedGroupTypeId] = useState<string | null>(null)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

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
    try {
      const response = await fetch('/api/save-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileType: type,
          data: currentData && Object.keys(currentData).length > 0 ? currentData : JSON.parse(jsonData)
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
      let fileType = ''
      
      if (currentView === 'user-profile') {
        fileType = 'profile'
      } else if (currentView === 'project') {
        fileType = 'project'
      } else if (currentView === 'chapter') {
        fileType = 'chapter'
      }

      if (fileType) {
        const response = await fetch('/api/save-json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileType,
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
      const response = await fetch(`/api/load-json?file=users/${user.id}/profile.json`)
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
    setBreadcrumb(['Usuarios', selectedUser?.displayName || '', 'Proyectos', project.title])
    if (selectedUser) {
      try {
        const response = await fetch(`/api/load-json?file=users/${selectedUser.id}/projects/${project.id}/project.json`)
        if (response.ok) {
          const data = await response.json()
          setJsonData(JSON.stringify(data, null, 2))
          setCurrentData(data)
        } else {
          showMessage('Error al cargar los datos del proyecto')
        }
      } catch (error) {
        console.error('Error loading project data:', error)
        showMessage('Error al cargar los datos del proyecto')
      }
    }
  }

  // Navigation functions for project sections
  const viewProjectCharacters = async (project?: Project) => {
    const targetProject = project || selectedProject
    if (!targetProject || !selectedUser) return
    
    setSelectedProject(targetProject)
    setCurrentView('characters')
    setBreadcrumb(['Usuarios', selectedUser.displayName, 'Proyectos', targetProject.title, 'Personajes'])
    
    try {
      const response = await fetch(`/api/load-json?file=users/${selectedUser.id}/projects/${targetProject.id}/project.json`)
      if (response.ok) {
        const data = await response.json()
        setJsonData(JSON.stringify(data, null, 2))
        setCurrentData(data)
      } else {
        showMessage('Error al cargar los datos del proyecto')
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      showMessage('Error al cargar los datos del proyecto')
    }
  }

  const viewProjectLocations = async (project?: Project) => {
    const targetProject = project || selectedProject
    if (!targetProject || !selectedUser) return
    
    setSelectedProject(targetProject)
    setCurrentView('locations')
    setBreadcrumb(['Usuarios', selectedUser.displayName, 'Proyectos', targetProject.title, 'Lugares'])
    
    try {
      const response = await fetch(`/api/load-json?file=users/${selectedUser.id}/projects/${targetProject.id}/project.json`)
      if (response.ok) {
        const data = await response.json()
        setJsonData(JSON.stringify(data, null, 2))
        setCurrentData(data)
      } else {
        showMessage('Error al cargar los datos del proyecto')
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      showMessage('Error al cargar los datos del proyecto')
    }
  }

  const viewProjectGroups = async (project?: Project) => {
    const targetProject = project || selectedProject
    if (!targetProject || !selectedUser) return
    
    setSelectedProject(targetProject)
    setCurrentView('groups')
    setBreadcrumb(['Usuarios', selectedUser.displayName, 'Proyectos', targetProject.title, 'Grupos'])
    
    try {
      const response = await fetch(`/api/load-json?file=users/${selectedUser.id}/projects/${targetProject.id}/project.json`)
      if (response.ok) {
        const data = await response.json()
        setJsonData(JSON.stringify(data, null, 2))
        setCurrentData(data)
      } else {
        showMessage('Error al cargar los datos del proyecto')
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      showMessage('Error al cargar los datos del proyecto')
    }
  }

  const viewProjectChaptersFromProject = async (project?: Project) => {
    const targetProject = project || selectedProject
    if (!targetProject || !selectedUser) return
    
    setSelectedProject(targetProject)
    setCurrentView('chapters')
    setBreadcrumb(['Usuarios', selectedUser.displayName, 'Proyectos', targetProject.title, 'Capítulos'])
    
    try {
      const response = await fetch(`/api/load-json?file=users/${selectedUser.id}/projects/${targetProject.id}/project.json`)
      if (response.ok) {
        const data = await response.json()
        setJsonData(JSON.stringify(data, null, 2))
        setCurrentData(data)
      } else {
        showMessage('Error al cargar los datos del proyecto')
      }
    } catch (error) {
      console.error('Error loading project data:', error)
      showMessage('Error al cargar los datos del proyecto')
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
        const response = await fetch(`/api/load-json?file=users/${selectedUser.id}/projects/${selectedProject.id}/chapters/${chapter.id}.json`)
        if (response.ok) {
          const data = await response.json()
          setJsonData(JSON.stringify(data, null, 2))
          setCurrentData(data)
        } else {
          showMessage('Error al cargar los datos del capítulo')
        }
      } catch (error) {
        console.error('Error loading chapter data:', error)
        showMessage('Error al cargar los datos del capítulo')
      }
    }
  }

  // Load project chapters
  const loadProjectChapters = async (userId: string, projectId: string) => {
    try {
      const response = await fetch(`/api/load-json?file=users/${userId}/projects/${projectId}/project.json`)
      if (response.ok) {
        const data = await response.json()
        setCurrentData(data)
        setJsonData(JSON.stringify(data, null, 2))
        
        // Load individual chapter files
        const chaptersDir = `users/${userId}/projects/${projectId}/chapters`
        const chaptersResponse = await fetch(`/api/list-files?directory=${chaptersDir}`)
        if (chaptersResponse.ok) {
          const filesData = await chaptersResponse.json()
          const chapterFiles = filesData.files?.filter((file: string) => 
            file.endsWith('.json')
          ) || []
          
          const chapters = []
          for (const file of chapterFiles) {
            try {
              const chapterResponse = await fetch(`/api/load-json?file=${chaptersDir}/${file}`)
              if (chapterResponse.ok) {
                const chapterData = await chapterResponse.json()
                chapters.push(chapterData.chapter)
              }
            } catch (error) {
              console.error(`Error loading chapter ${file}:`, error)
            }
          }
          
          setProjectChapters(chapters)
        }
      } else {
        showMessage('Error al cargar los capítulos del proyecto')
      }
    } catch (error) {
      console.error('Error loading project chapters:', error)
      showMessage('Error al cargar los capítulos del proyecto')
    }
  }

  // Save chapter data
  const saveChapterData = async (updatedChapter: any) => {
    if (!selectedUser || !selectedProject) return
    
    try {
      const response = await fetch('/api/save-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileType: 'chapter',
          userId: selectedUser.id,
          projectId: selectedProject.id,
          chapterId: updatedChapter.id,
          data: { chapter: updatedChapter }
        })
      })

      if (response.ok) {
        showMessage('¡Capítulo guardado exitosamente!')
        // Reload chapters list
        loadProjectChapters(selectedUser.id, selectedProject.id)
      } else {
        showMessage('Error al guardar el capítulo')
      }
    } catch (error) {
      console.error('Error saving chapter:', error)
      showMessage('Error al guardar el capítulo')
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
      case 'characters':
      case 'locations':
      case 'groups':
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

  // Update project field
  const updateProjectField = (field: string, value: any) => {
    const updatedData = { ...currentData }
    if (!updatedData.project) updatedData.project = {}
    updatedData.project[field] = value
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  // Add project portfolio item
  const addProjectPortfolioItem = () => {
    const newItem = {
      id: `proj-img-${Date.now()}`,
      filename: 'nueva-imagen.png',
      path: '/project-images/nueva-imagen.png',
      description: 'Nueva imagen del proyecto',
      tags: ['proyecto'],
      mood: 'neutral',
      prompt: 'Descripción del prompt para generar la imagen',
      createdAt: new Date().toISOString(),
      vector: [0.5, 0.5, 0.5, 0.5, 0.5]
    }
    
    const portfolio = currentData.project?.portfolio || []
    updateProjectField('portfolio', [...portfolio, newItem])
  }

  // Remove project portfolio item
  const removeProjectPortfolioItem = (index: number) => {
    const portfolio = currentData.project?.portfolio || []
    const updatedPortfolio = portfolio.filter((_: any, i: number) => i !== index)
    updateProjectField('portfolio', updatedPortfolio)
  }

  // Update chapter field
  const updateChapterField = (field: string, value: any) => {
    const updatedData = { ...currentData }
    if (!updatedData.chapter) updatedData.chapter = {}
    updatedData.chapter[field] = value
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  // Add chapter portfolio item
  const addChapterPortfolioItem = () => {
    const newItem = {
      id: `ch-img-${Date.now()}`,
      filename: 'nueva-imagen-capitulo.png',
      path: '/chapter-images/nueva-imagen-capitulo.png',
      description: 'Nueva imagen del capítulo',
      tags: ['capítulo'],
      mood: 'neutral',
      context: 'scene',
      createdAt: new Date().toISOString(),
      vector: [0.5, 0.5, 0.5, 0.5, 0.5]
    }
    
    const portfolio = currentData.chapter?.portfolio || []
    updateChapterField('portfolio', [...portfolio, newItem])
  }

  // Remove chapter portfolio item
  const removeChapterPortfolioItem = (index: number) => {
    const portfolio = currentData.chapter?.portfolio || []
    const updatedPortfolio = portfolio.filter((_: any, i: number) => i !== index)
    updateChapterField('portfolio', updatedPortfolio)
  }

  // Character management functions
  const updateCharacterField = (characterId: string, field: string, value: any) => {
    const updatedData = { ...currentData }
    if (!updatedData.characters) updatedData.characters = []
    
    const characterIndex = updatedData.characters.findIndex((char: any) => char.id === characterId)
    if (characterIndex !== -1) {
      updatedData.characters[characterIndex] = {
        ...updatedData.characters[characterIndex],
        [field]: value
      }
      setCurrentData(updatedData)
      setJsonData(JSON.stringify(updatedData, null, 2))
    }
  }

  const addCharacter = () => {
    const newCharacter = {
      id: `char-${Date.now()}`,
      name: 'Nuevo Personaje',
      role: '',
      age: 0,
      occupation: '',
      description: '',
      personality: [],
      groupings: [],
      portfolio: []
    }
    
    const updatedData = { ...currentData }
    if (!updatedData.characters) updatedData.characters = []
    updatedData.characters.push(newCharacter)
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  const removeCharacter = (characterId: string) => {
    const updatedData = { ...currentData }
    if (updatedData.characters) {
      updatedData.characters = updatedData.characters.filter((char: any) => char.id !== characterId)
      setCurrentData(updatedData)
      setJsonData(JSON.stringify(updatedData, null, 2))
    }
  }

  const addCharacterPortfolioItem = (characterId: string) => {
    const newItem = {
      id: `char-img-${Date.now()}`,
      filename: 'nueva-imagen-personaje.png',
      path: `/users/${selectedUser?.id}/projects/${selectedProject?.id}/characters/${characterId}-image.png`,
      description: 'Nueva imagen del personaje',
      tags: ['portrait', 'character'],
      mood: 'neutral',
      context: 'character portrait',
      prompt: 'Descripción del personaje para generar la imagen',
      createdAt: new Date().toISOString(),
      vector: [0.5, 0.5, 0.5, 0.5, 0.5]
    }
    
    const updatedData = { ...currentData }
    if (!updatedData.characters) updatedData.characters = []
    
    const characterIndex = updatedData.characters.findIndex((char: any) => char.id === characterId)
    if (characterIndex !== -1) {
      const character = updatedData.characters[characterIndex]
      if (!character.portfolio) character.portfolio = []
      character.portfolio.push(newItem)
      setCurrentData(updatedData)
      setJsonData(JSON.stringify(updatedData, null, 2))
    }
  }

  const removeCharacterPortfolioItem = (characterId: string, itemId: string) => {
    const updatedData = { ...currentData }
    if (!updatedData.characters) return
    
    const characterIndex = updatedData.characters.findIndex((char: any) => char.id === characterId)
    if (characterIndex !== -1) {
      const character = updatedData.characters[characterIndex]
      if (character.portfolio) {
        character.portfolio = character.portfolio.filter((item: any) => item.id !== itemId)
        setCurrentData(updatedData)
        setJsonData(JSON.stringify(updatedData, null, 2))
      }
    }
  }

  // Location management functions
  const updateLocationField = (locIndex: number, field: string, value: any) => {
    const updatedData = { ...currentData }
    if (!updatedData.locations) updatedData.locations = []
    const fields = field.split('.')
    if (fields.length === 1) {
      updatedData.locations[locIndex][field] = value
    } else if (fields.length === 3 && fields[0] === 'portfolio') {
      // e.g. portfolio.0.filename
      const [_, itemIndex, subfield] = fields
      updatedData.locations[locIndex].portfolio[parseInt(itemIndex)][subfield] = value
    } else if (fields.length === 2 && fields[0] === 'portfolio') {
      // e.g. portfolio.0
      updatedData.locations[locIndex].portfolio[parseInt(fields[1])] = value
    }
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  const addLocation = () => {
    const updatedData = { ...currentData }
    if (!updatedData.locations) updatedData.locations = []
    const newLocation = {
      id: `loc-${Date.now()}`,
      name: '',
      type: '',
      description: '',
      significance: '',
      portfolio: []
    }
    updatedData.locations.push(newLocation)
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  const removeLocation = (locIndex: number) => {
    const updatedData = { ...currentData }
    if (updatedData.locations) {
      updatedData.locations.splice(locIndex, 1)
      setCurrentData(updatedData)
      setJsonData(JSON.stringify(updatedData, null, 2))
    }
  }

  const addLocationPortfolioItem = (locIndex: number) => {
    const updatedData = { ...currentData }
    if (!updatedData.locations[locIndex].portfolio) updatedData.locations[locIndex].portfolio = []
    updatedData.locations[locIndex].portfolio.push({
      id: `loc-img-${Date.now()}`,
      filename: '',
      path: '',
      description: '',
      createdAt: new Date().toISOString(),
      tags: [],
      mood: '',
      context: ''
    })
    setCurrentData(updatedData)
    setJsonData(JSON.stringify(updatedData, null, 2))
  }

  const removeLocationPortfolioItem = (locIndex: number, itemIndex: number) => {
    const updatedData = { ...currentData }
    if (updatedData.locations[locIndex].portfolio) {
      updatedData.locations[locIndex].portfolio.splice(itemIndex, 1)
      setCurrentData(updatedData)
      setJsonData(JSON.stringify(updatedData, null, 2))
    }
  }

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
            onViewCharacters={viewProjectCharacters}
            onViewLocations={viewProjectLocations}
            onViewGroups={viewProjectGroups}
          />
        )
      case 'project':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Editando: {selectedProject?.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => saveJsonData('project')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setCurrentView('projects')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver
                </button>
              </div>
            </div>
            <ProjectForm 
              currentData={currentData}
              updateProjectField={updateProjectField}
              addPortfolioItem={addProjectPortfolioItem}
              removePortfolioItem={removeProjectPortfolioItem}
              onViewChapters={viewProjectChaptersFromProject}
              onViewCharacters={viewProjectCharacters}
              onViewLocations={viewProjectLocations}
              onViewGroups={viewProjectGroups}
            />
          </div>
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
          <ChapterForm 
            currentData={currentData}
            updateChapterField={updateChapterField}
            addPortfolioItem={addChapterPortfolioItem}
            removePortfolioItem={removeChapterPortfolioItem}
          />
        )
      case 'characters':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Personajes: {selectedProject?.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => saveJsonData('project')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setCurrentView('projects')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
            
            <CharactersForm 
              currentData={currentData}
              updateCharacterField={updateCharacterField}
              addCharacter={addCharacter}
              removeCharacter={removeCharacter}
              addCharacterPortfolioItem={addCharacterPortfolioItem}
              removeCharacterPortfolioItem={removeCharacterPortfolioItem}
            />
          </div>
        )
      case 'locations':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Lugares: {selectedProject?.title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => saveJsonData('project')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </button>
                <button
                  onClick={() => setCurrentView('projects')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
            <LocationsForm
              currentData={currentData}
              updateLocationField={updateLocationField}
              addLocation={addLocation}
              removeLocation={removeLocation}
              addLocationPortfolioItem={addLocationPortfolioItem}
              removeLocationPortfolioItem={removeLocationPortfolioItem}
            />
          </div>
        )
      case 'groups':
        return (
          <div className="p-6">
            <GroupTypesList
              groupingTypes={currentData.groupingTypes || []}
              onSelect={(typeId) => {
                setSelectedGroupTypeId(typeId);
                setCurrentView('groupTypeDetail');
              }}
              onEdit={(typeId) => {
                setSelectedGroupTypeId(typeId);
                alert('Edición de tipo de grupo próximamente');
              }}
              onAdd={() => {
                alert('Añadir tipo de grupo próximamente');
              }}
            />
          </div>
        )
      case 'groupTypeDetail':
        const selectedGroupType = currentData.groupingTypes?.find((type: any) => type.id === selectedGroupTypeId)
        if (!selectedGroupType) {
          return (
            <div className="p-6 text-center">
              <p className="text-gray-400">Tipo de grupo no encontrado</p>
              <button
                onClick={() => setCurrentView('groups')}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Volver a tipos
              </button>
            </div>
          )
        }
        return (
          <div className="p-6">
            <GroupTypeDetail
              groupType={selectedGroupType}
              groups={currentData.groups || []}
              onBack={() => setCurrentView('groups')}
              onEditType={() => {
                alert('Edición de tipo de grupo próximamente');
              }}
              onSelectGroup={(groupId) => {
                setSelectedGroupId(groupId);
                setCurrentView('groupDetail');
              }}
              onEditGroup={(groupId) => {
                setSelectedGroupId(groupId);
                alert('Edición de grupo próximamente');
              }}
              onAddGroup={() => {
                alert('Añadir grupo próximamente');
              }}
            />
          </div>
        )
      case 'groupsList':
        const groupTypeForList = currentData.groupingTypes?.find((type: any) => type.id === selectedGroupTypeId)
        if (!groupTypeForList) {
          return (
            <div className="p-6 text-center">
              <p className="text-gray-400">Tipo de grupo no encontrado</p>
              <button
                onClick={() => setCurrentView('groups')}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Volver a tipos
              </button>
            </div>
          )
        }
        return (
          <div className="p-6">
            <GroupsList
              groupType={groupTypeForList}
              groups={currentData.groups || []}
              onBack={() => setCurrentView('groupTypeDetail')}
              onSelectGroup={(groupId) => {
                setSelectedGroupId(groupId);
                setCurrentView('groupDetail');
              }}
              onEditGroup={(groupId) => {
                setSelectedGroupId(groupId);
                alert('Edición de grupo próximamente');
              }}
              onAddGroup={() => {
                alert('Añadir grupo próximamente');
              }}
            />
          </div>
        )
      case 'groupDetail':
        const selectedGroup = currentData.groups?.find((group: any) => group.id === selectedGroupId)
        if (!selectedGroup) {
          return (
            <div className="p-6 text-center">
              <p className="text-gray-400">Grupo no encontrado</p>
              <button
                onClick={() => setCurrentView('groups')}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Volver a grupos
              </button>
            </div>
          )
        }
        return (
          <div className="p-6">
            <GroupDetail
              group={selectedGroup}
              characters={currentData.characters || []}
              onBack={() => setCurrentView('groupTypeDetail')}
              onEditGroup={() => {
                alert('Edición de grupo próximamente');
              }}
              onSelectCharacter={(characterId) => {
                // TODO: Navegar a detalle de personaje
                alert(`Ver personaje: ${characterId}`);
              }}
            />
          </div>
        )
      case 'chapters':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Capítulos: {selectedProject?.title}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => saveJsonData('project')} 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Guardar Cambios
                </button>
                <button 
                  onClick={() => setCurrentView('projects')} 
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Volver
                </button>
              </div>
            </div>
            <ChaptersList
              chapters={projectChapters}
              selectedProject={selectedProject}
              onEditChapter={(chapter) => {
                setSelectedChapter(chapter);
                setCurrentView('chapter');
                if (selectedUser && selectedProject) {
                  loadChapter(selectedUser.id, selectedProject.id, chapter.id);
                }
              }}
            />
          </div>
        )
      case 'chapter':
        if (!selectedChapter) {
          return (
            <div className="p-6 text-center">
              <p className="text-gray-400">Capítulo no encontrado</p>
              <button
                onClick={() => setCurrentView('chapters')}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Volver a capítulos
              </button>
            </div>
          )
        }
        return (
          <div className="p-6">
            <ChapterDetail
              chapter={currentData.chapter || selectedChapter}
              onBack={() => setCurrentView('chapters')}
              onSave={(updatedChapter) => {
                saveChapterData(updatedChapter);
              }}
            />
          </div>
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
