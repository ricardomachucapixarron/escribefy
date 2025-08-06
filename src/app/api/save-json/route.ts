import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { fileType, data } = await request.json()
    
    if (!fileType || !data) {
      return NextResponse.json(
        { error: 'Missing fileType or data' },
        { status: 400 }
      )
    }

    let filePath: string
    
    if (fileType === 'profile') {
      filePath = path.join(process.cwd(), 'src/data/users/ricardo-machuca/profile.json')
    } else if (fileType === 'project') {
      filePath = path.join(process.cwd(), 'src/data/users/ricardo-machuca/projects/ecos-manana/project.json')
    } else {
      return NextResponse.json(
        { error: 'Invalid fileType. Must be "profile" or "project"' },
        { status: 400 }
      )
    }

    // Verificar que el directorio existe
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Crear backup del archivo actual
    if (fs.existsSync(filePath)) {
      const backupPath = filePath.replace('.json', `.backup.${Date.now()}.json`)
      fs.copyFileSync(filePath, backupPath)
      
      // Mantener solo los últimos 5 backups
      const backupFiles = fs.readdirSync(dir)
        .filter(file => file.includes('.backup.') && file.endsWith('.json'))
        .sort()
        .reverse()
      
      if (backupFiles.length > 5) {
        backupFiles.slice(5).forEach(file => {
          fs.unlinkSync(path.join(dir, file))
        })
      }
    }

    // Validar que los datos son JSON válidos
    try {
      JSON.parse(JSON.stringify(data))
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400 }
      )
    }

    // Escribir el archivo con formato bonito
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ 
      success: true, 
      message: `${fileType}.json saved successfully`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error saving JSON:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'JSON Save API is running',
    endpoints: {
      POST: 'Save JSON data',
      body: {
        fileType: '"profile" or "project"',
        data: 'JSON object to save'
      }
    }
  })
}
