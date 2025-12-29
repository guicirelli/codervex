import { readdir, stat, readFile } from 'fs/promises'
import { join } from 'path'
import { isDirectory } from '../../utils/fs-helpers'

export interface NormalizedProject {
  files: string[]
  folders: string[]
  fileMap: Map<string, string> // path -> content (apenas arquivos pequenos)
}

const IGNORED_PATTERNS = [
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.env',
  '.idea',
  '.vscode',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
]

const MAX_FILE_SIZE = 300 * 1024 // 300KB
const MAX_FILES = 5000

export async function normalizeProject(projectPath: string): Promise<NormalizedProject> {
  const files: string[] = []
  const folders: string[] = []
  const fileMap = new Map<string, string>()

         async function walk(currentPath: string, relativePath: string = ''): Promise<void> {
           if (files.length > MAX_FILES) {
             return // Safety limit
           }

           try {
             const entries = await readdir(currentPath)
             
             for (const entry of entries) {
               const fullPath = join(currentPath, entry)
               const relativeEntryPath = relativePath ? join(relativePath, entry) : entry

               // Check if should ignore
               if (shouldIgnore(relativeEntryPath)) {
                 continue
               }

               const isDir = await isDirectory(fullPath)
               
               if (isDir) {
                 folders.push(relativeEntryPath)
                 await walk(fullPath, relativeEntryPath)
               } else {
                 // Check size
                 const stats = await stat(fullPath)
                 if (stats.size <= MAX_FILE_SIZE) {
                   files.push(relativeEntryPath)
                   
                   // Read content of small text files
                   if (isTextFile(entry)) {
                     try {
                       const content = await readFile(fullPath, 'utf-8')
                       fileMap.set(relativeEntryPath, content)
                     } catch {
                       // Ignore if cannot read
                     }
                   }
                 }
               }
             }
           } catch (error) {
             // Ignore permission errors
             console.warn(`Error reading ${currentPath}:`, error)
           }
         }

  await walk(projectPath)

  return {
    files,
    folders,
    fileMap
  }
}

function shouldIgnore(path: string): boolean {
  const normalized = path.toLowerCase()
  return IGNORED_PATTERNS.some(pattern => 
    normalized.includes(pattern.toLowerCase())
  )
}

function isTextFile(filename: string): boolean {
  const textExtensions = [
    '.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.txt',
    '.css', '.scss', '.html', '.xml', '.yaml', '.yml',
    '.py', '.java', '.go', '.rs', '.php', '.rb', '.sh',
    '.vue', '.svelte', '.dart', '.kt', '.swift'
  ]
  
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return textExtensions.includes(ext) || !ext.includes('.')
}

