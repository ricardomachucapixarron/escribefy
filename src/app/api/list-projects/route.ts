import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Load user profile to get display name
    let userDisplayName = 'Unknown'
    try {
      const profilePath = path.join(process.cwd(), 'src', 'data', 'users', userId, 'profile.json')
      const profileData = JSON.parse(await fs.readFile(profilePath, 'utf-8'))
      userDisplayName = profileData.user?.displayName || profileData.user?.username || userId
    } catch (error) {
      console.error(`Error reading user profile for ${userId}:`, error)
    }

    const projectsDir = path.join(process.cwd(), 'src', 'data', 'users', userId, 'projects')
    
    try {
      const projectFolders = await fs.readdir(projectsDir)
      const projects = []

      for (const folder of projectFolders) {
        const projectPath = path.join(projectsDir, folder)
        const stat = await fs.stat(projectPath)
        
        if (stat.isDirectory()) {
          try {
            const projectJsonPath = path.join(projectPath, 'project.json')
            const projectData = JSON.parse(await fs.readFile(projectJsonPath, 'utf-8'))
            
            // Extract data from root of project.json (modern structure)
            projects.push({
              id: projectData.id || folder,
              title: projectData.title || folder,
              author: userDisplayName, // Use real display name from profile
              genre: projectData.genre || 'Unknown',
              status: projectData.status || 'draft',
              synopsis: projectData.synopsis || '',
              wordCount: projectData.wordCount || 0,
              lastModified: projectData.lastModified || stat.mtime
            })
          } catch (error) {
            console.error(`Error reading project ${folder}:`, error)
            // Include folder even if project.json is missing or corrupted
            projects.push({
              id: folder,
              title: folder,
              author: userDisplayName,
              genre: 'Unknown',
              status: 'draft',
              synopsis: 'Project data unavailable',
              wordCount: 0,
              lastModified: stat.mtime
            })
          }
        }
      }

      return NextResponse.json({ projects })
    } catch (error) {
      // If projects directory doesn't exist, return empty array
      return NextResponse.json({ projects: [] })
    }
  } catch (error) {
    console.error('Error listing projects:', error)
    return NextResponse.json(
      { error: 'Failed to list projects' },
      { status: 500 }
    )
  }
}
