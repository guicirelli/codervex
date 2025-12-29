import { mkdir, rm, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const TMP_DIR = join(process.cwd(), 'tmp')

export async function createTempFolder(): Promise<string> {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const folderPath = join(TMP_DIR, `project-${timestamp}-${random}`)
  
  await mkdir(folderPath, { recursive: true })
  return folderPath
}

export async function cleanup(path: string): Promise<void> {
  try {
    if (existsSync(path)) {
      await rm(path, { recursive: true, force: true })
    }
  } catch (error) {
    console.error('Error cleaning up:', error)
  }
}

export async function ensureTmpDir(): Promise<void> {
  if (!existsSync(TMP_DIR)) {
    await mkdir(TMP_DIR, { recursive: true })
  }
}

export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await stat(filePath)
    return stats.size
  } catch {
    return 0
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isDirectory()
  } catch {
    return false
  }
}

