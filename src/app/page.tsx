"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import LoginScreen from "@/components/LoginScreen"
import UserHeader from "@/components/UserHeader"
import { LandingPage } from "@/components/landing-page"
import { ProjectManager } from "@/components/project-manager"
import { NovelWritingSuite } from "@/components/novel-writing-suite"
import { useProjects, type Project } from "@/hooks/use-projects"

function AppContent() {
  const { currentUser, login } = useAuth()
  const { projects, currentProject, setCurrentProject } = useProjects()
  const [currentView, setCurrentView] = useState<"landing" | "projects" | "suite">("landing")

  // Si no hay usuario autenticado, mostrar pantalla de login
  if (!currentUser) {
    return <LoginScreen onLogin={login} />
  }

  const handleGetStarted = () => {
    setCurrentView("projects")
  }

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project)
    setCurrentView("suite")
  }

  const handleBackToProjects = () => {
    setCurrentView("projects")
  }

  const handleBackToLanding = () => {
    setCurrentView("landing")
    setCurrentProject(null)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <UserHeader />
      
      {currentView === "landing" && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {currentView === "projects" && (
        <ProjectManager 
          projects={projects}
          onProjectSelect={handleProjectSelect}
        />
      )}
      
      {currentView === "suite" && currentProject && (
        <NovelWritingSuite 
          project={currentProject} 
          onBackToProjects={handleBackToProjects}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
