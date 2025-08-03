"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { ProjectManager } from "@/components/project-manager"
import { NovelWritingSuite } from "@/components/novel-writing-suite"
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

  if (currentView === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (currentView === "projects") {
    return <ProjectManager projects={projects} onProjectSelect={handleProjectSelect} />
  }

  if (currentView === "suite" && currentProject) {
    return <NovelWritingSuite project={currentProject} onBackToProjects={handleBackToProjects} />
  }

  return <LandingPage onGetStarted={handleGetStarted} />
}
