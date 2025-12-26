/**
 * Parser Básico - FASE 1
 * 
 * Responsável por:
 * - Extrair arquivos do ZIP
 * - Ler conteúdo de arquivos
 * - Ignorar arquivos desnecessários
 * - Mapear estrutura básica
 */

import JSZip from 'jszip'

export interface ParsedFile {
  path: string
  content: string
  type: 'code' | 'config' | 'markup' | 'style' | 'other'
  extension: string
}

export interface ProjectStructure {
  files: ParsedFile[]
  rootFiles: string[]
  directories: string[]
  hasPackageJson: boolean
  hasConfigFiles: boolean
}

const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  '.cache',
  'coverage',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env.local',
  '.env.production',
]

const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const CONFIG_EXTENSIONS = ['.json', '.yaml', '.yml', '.toml', '.config.js', '.config.ts']
const MARKUP_EXTENSIONS = ['.html', '.md', '.mdx']
const STYLE_EXTENSIONS = ['.css', '.scss', '.sass', '.less']

/**
 * Parse ZIP file
 */
export async function parseZipFile(zipFile: File): Promise<ProjectStructure> {
  const zip = new JSZip()
  const zipData = await zip.loadAsync(zipFile)
  const files: ParsedFile[] = []
  const rootFiles: string[] = []
  const directories = new Set<string>()

  let hasPackageJson = false
  let hasConfigFiles = false

  for (const [relativePath, file] of Object.entries(zipData.files)) {
    // Ignorar diretórios e arquivos desnecessários
    if (file.dir) {
      const dirPath = relativePath.replace(/\/$/, '')
      if (dirPath && !shouldIgnore(dirPath)) {
        directories.add(dirPath)
      }
      continue
    }

    if (shouldIgnore(relativePath)) {
      continue
    }

    try {
      const content = await file.async('text')
      const extension = getExtension(relativePath)
      const type = getFileType(relativePath, extension)

      if (relativePath === 'package.json') {
        hasPackageJson = true
        hasConfigFiles = true
      }

      if (CONFIG_EXTENSIONS.some(ext => relativePath.endsWith(ext))) {
        hasConfigFiles = true
      }

      // Detectar arquivos na raiz
      if (!relativePath.includes('/')) {
        rootFiles.push(relativePath)
      }

      files.push({
        path: relativePath,
        content,
        type,
        extension,
      })
    } catch (error) {
      // Ignorar arquivos binários ou muito grandes
      continue
    }
  }

  return {
    files,
    rootFiles,
    directories: Array.from(directories),
    hasPackageJson,
    hasConfigFiles,
  }
}

/**
 * Parse individual files
 */
export async function parseFiles(fileList: File[]): Promise<ProjectStructure> {
  const files: ParsedFile[] = []
  const rootFiles: string[] = []
  const directories = new Set<string>()

  let hasPackageJson = false
  let hasConfigFiles = false

  for (const file of fileList) {
    if (shouldIgnore(file.name)) {
      continue
    }

    try {
      const content = await file.text()
      const extension = getExtension(file.name)
      const type = getFileType(file.name, extension)

      if (file.name === 'package.json') {
        hasPackageJson = true
        hasConfigFiles = true
      }

      if (CONFIG_EXTENSIONS.some(ext => file.name.endsWith(ext))) {
        hasConfigFiles = true
      }

      // Detectar diretórios (arquivos sem / são da raiz)
      const pathParts = file.name.split('/')
      if (pathParts.length === 1) {
        rootFiles.push(file.name)
      } else {
        pathParts.slice(0, -1).forEach(part => {
          if (part && !shouldIgnore(part)) {
            directories.add(part)
          }
        })
      }

      files.push({
        path: file.name,
        content,
        type,
        extension,
      })
    } catch (error) {
      // Ignorar arquivos binários
      continue
    }
  }

  return {
    files,
    rootFiles,
    directories: Array.from(directories),
    hasPackageJson,
    hasConfigFiles,
  }
}

function shouldIgnore(path: string): boolean {
  const lowerPath = path.toLowerCase()
  return IGNORE_PATTERNS.some(pattern => lowerPath.includes(pattern.toLowerCase()))
}

function getExtension(filename: string): string {
  const parts = filename.split('.')
  if (parts.length < 2) return ''
  return '.' + parts[parts.length - 1]
}

function getFileType(path: string, extension: string): ParsedFile['type'] {
  if (CODE_EXTENSIONS.includes(extension)) return 'code'
  if (CONFIG_EXTENSIONS.includes(extension)) return 'config'
  if (MARKUP_EXTENSIONS.includes(extension)) return 'markup'
  if (STYLE_EXTENSIONS.includes(extension)) return 'style'
  return 'other'
}

