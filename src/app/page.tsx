"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { ProjectManager } from "@/components/project-manager"
import { NovelWritingSuite } from "@/components/novel-writing-suite"
import { GlobalHeader } from "@/components/global-header"
import { useProjects, type Project } from "@/hooks/use-projects"

export default function App() {
  const { projects, currentProject, setCurrentProject } = useProjects()
  const [currentView, setCurrentView] = useState<"landing" | "projects" | "suite">("landing")

  useEffect(() => {
    // Si hay un proyecto actual, ir directo a la suite
    if (currentProject) {
      setCurrentView("suite")
    }
  }, [currentProject])

  const handleGetStarted = () => {
    setCurrentView("projects")
  }

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project)
    setCurrentView("suite")
  }

  const handleBackToProjects = () => {
    setCurrentProject(null)
    setCurrentView("projects")
  }

  return (
    <>
      {/* Global Header - shown in all views except landing */}
      {currentView !== "landing" && (
        <GlobalHeader 
          currentView={currentView as 'projects' | 'suite'}
          projectTitle={currentProject?.title}
          onNavigateToProjects={handleBackToProjects}
        />
      )}
      
      {/* Main Content */}
      <div>
        {currentView === "landing" && <LandingPage onGetStarted={handleGetStarted} />}
        {currentView === "projects" && <ProjectManager projects={projects} onProjectSelect={handleProjectSelect} />}
        {currentView === "suite" && currentProject && (
          <NovelWritingSuite project={currentProject} onBackToProjects={handleBackToProjects} />
        )}
        {currentView !== "landing" && currentView !== "projects" && currentView !== "suite" && (
          <LandingPage onGetStarted={handleGetStarted} />
        )}
      </div>
    </>
  )
}
