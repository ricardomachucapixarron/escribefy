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
            
            projects.push({
              id: folder,
              title: projectData.project?.title || folder,
              author: projectData.project?.author || 'Unknown',
              genre: projectData.project?.genre || 'Unknown',
              status: projectData.project?.status || 'draft',
              synopsis: projectData.project?.synopsis || '',
              wordCount: projectData.project?.wordCount || 0,
              lastModified: stat.mtime
            })
          } catch (error) {
            console.error(`Error reading project ${folder}:`, error)
            // Include folder even if project.json is missing or corrupted
            projects.push({
              id: folder,
              title: folder,
              author: 'Unknown',
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
