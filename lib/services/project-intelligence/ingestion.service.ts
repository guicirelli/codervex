/**
 * CAMADA 1: INGESTÃO & NORMALIZAÇÃO
 * 
 * Responsável por entender qualquer projeto, independente de stack.
 * Normaliza a estrutura e identifica o tipo de projeto.
 */

import JSZip from 'jszip'
import { ProjectAnalysis } from '../file-analyzer.service'

export interface NormalizedProject {
  stack: string[]
  architecture: string
  projectType: 'SaaS' | 'MVP' | 'Landing' | 'Dashboard' | 'E-commerce' | 'Blog' | 'Portfolio' | 'Unknown'
  complexity: 'low' | 'medium' | 'high'
  maturity: 'prototype' | 'mature' | 'legacy'
  structure: {
    pages: string[]
    components: string[]
    services: string[]
    hooks: string[]
    apis: string[]
    utils: string[]
  }
  dependencies: Record<string, string>
  configFiles: string[]
  buildSystem: string | null
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
]

const PROJECT_TYPE_INDICATORS = {
  SaaS: ['auth', 'subscription', 'payment', 'stripe', 'billing', 'user', 'dashboard'],
  MVP: ['prototype', 'demo', 'test', 'experiment'],
  Landing: ['landing', 'home', 'hero', 'cta', 'pricing'],
  Dashboard: ['dashboard', 'admin', 'analytics', 'metrics', 'stats'],
  'E-commerce': ['cart', 'checkout', 'product', 'shop', 'store'],
  Blog: ['blog', 'post', 'article', 'cms', 'content'],
  Portfolio: ['portfolio', 'about', 'contact', 'projects'],
}

export async function ingestProject(files: File[]): Promise<NormalizedProject> {
  const fileMap = new Map<string, string>()
  const fileContents: string[] = []

  // Processar arquivos
  for (const file of files) {
    const path = file.name.toLowerCase()
    
    // Ignorar arquivos desnecessários
    if (IGNORE_PATTERNS.some(pattern => path.includes(pattern))) {
      continue
    }

    try {
      const content = await file.text()
      fileMap.set(path, content)
      fileContents.push(content)
    } catch (error) {
      // Ignorar arquivos binários ou muito grandes
      continue
    }
  }

  // Detectar stack
  const stack = detectStack(fileMap, fileContents)
  
  // Detectar arquitetura
  const architecture = detectArchitecture(fileMap, stack)
  
  // Detectar tipo de projeto
  const projectType = detectProjectType(fileMap, fileContents)
  
  // Detectar complexidade
  const complexity = detectComplexity(fileMap, fileContents)
  
  // Detectar maturidade
  const maturity = detectMaturity(fileMap, fileContents)
  
  // Mapear estrutura
  const structure = mapStructure(fileMap)
  
  // Detectar dependências
  const dependencies = detectDependencies(fileMap)
  
  // Detectar arquivos de configuração
  const configFiles = detectConfigFiles(fileMap)
  
  // Detectar sistema de build
  const buildSystem = detectBuildSystem(fileMap)

  return {
    stack,
    architecture,
    projectType,
    complexity,
    maturity,
    structure,
    dependencies,
    configFiles,
    buildSystem,
  }
}

function detectStack(fileMap: Map<string, string>, contents: string[]): string[] {
  const stack: Set<string> = new Set()
  const allContent = Array.from(fileMap.values()).join('\n').toLowerCase()

  // Framework detection
  if (fileMap.has('package.json') || allContent.includes('package.json')) {
    const packageJson = Array.from(fileMap.entries()).find(([path]) => 
      path.includes('package.json')
    )?.[1]
    
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson)
        const deps = { ...pkg.dependencies, ...pkg.devDependencies }
        
        // React ecosystem
        if (deps.react) stack.add('React')
        if (deps['next']) stack.add('Next.js')
        if (deps['remix']) stack.add('Remix')
        if (deps['gatsby']) stack.add('Gatsby')
        
        // Vue ecosystem
        if (deps.vue) stack.add('Vue')
        if (deps['nuxt']) stack.add('Nuxt')
        
        // Angular
        if (deps['@angular/core']) stack.add('Angular')
        
        // Backend
        if (deps.express) stack.add('Express')
        if (deps.fastify) stack.add('Fastify')
        if (deps.koa) stack.add('Koa')
        
        // Database
        if (deps.prisma) stack.add('Prisma')
        if (deps.mongoose) stack.add('MongoDB')
        if (deps.typeorm) stack.add('TypeORM')
        if (deps['pg'] || deps['mysql2']) stack.add('SQL')
        
        // Styling
        if (deps.tailwindcss) stack.add('Tailwind CSS')
        if (deps['styled-components']) stack.add('Styled Components')
        if (deps['@emotion/react']) stack.add('Emotion')
        if (deps['@mui/material']) stack.add('Material UI')
        
        // State management
        if (deps.redux) stack.add('Redux')
        if (deps.zustand) stack.add('Zustand')
        if (deps.recoil) stack.add('Recoil')
        
        // TypeScript
        if (deps.typescript || pkg.devDependencies?.typescript) {
          stack.add('TypeScript')
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  // File extension detection
  const extensions = new Set<string>()
  for (const path of fileMap.keys()) {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) extensions.add('TypeScript')
    if (path.endsWith('.jsx') || path.endsWith('.js')) extensions.add('JavaScript')
    if (path.endsWith('.vue')) extensions.add('Vue')
    if (path.endsWith('.svelte')) extensions.add('Svelte')
  }
  extensions.forEach(ext => stack.add(ext))

  return Array.from(stack)
}

function detectArchitecture(fileMap: Map<string, string>, stack: string[]): string {
  const paths = Array.from(fileMap.keys())
  const allContent = Array.from(fileMap.values()).join('\n').toLowerCase()

  // Next.js App Router
  if (stack.includes('Next.js') && (paths.some(p => p.includes('app/')) || allContent.includes('app router'))) {
    return 'App Router'
  }

  // Next.js Pages Router
  if (stack.includes('Next.js') && paths.some(p => p.includes('pages/'))) {
    return 'Pages Router'
  }

  // React SPA
  if (stack.includes('React') && !stack.includes('Next.js')) {
    return 'SPA'
  }

  // MVC
  if (paths.some(p => p.includes('controllers/')) || paths.some(p => p.includes('models/'))) {
    return 'MVC'
  }

  // Microservices
  if (paths.some(p => p.includes('services/')) && paths.some(p => p.includes('api/'))) {
    return 'Microservices'
  }

  return 'Monolithic'
}

function detectProjectType(fileMap: Map<string, string>, contents: string[]): NormalizedProject['projectType'] {
  const paths = Array.from(fileMap.keys()).join(' ').toLowerCase()
  const allContent = contents.join(' ').toLowerCase()

  // Check for type indicators
  for (const [type, indicators] of Object.entries(PROJECT_TYPE_INDICATORS)) {
    if (indicators.some(indicator => paths.includes(indicator) || allContent.includes(indicator))) {
      return type as NormalizedProject['projectType']
    }
  }

  // Heuristic: Check structure
  if (paths.includes('dashboard') || paths.includes('admin')) return 'Dashboard'
  if (paths.includes('product') || paths.includes('cart')) return 'E-commerce'
  if (paths.includes('blog') || paths.includes('post')) return 'Blog'
  if (paths.includes('landing') || paths.includes('hero')) return 'Landing'

  return 'Unknown'
}

function detectComplexity(fileMap: Map<string, string>, contents: string[]): NormalizedProject['complexity'] {
  const fileCount = fileMap.size
  const totalLines = contents.reduce((sum, content) => sum + content.split('\n').length, 0)
  const hasTests = Array.from(fileMap.keys()).some(p => p.includes('test') || p.includes('spec'))
  const hasDocs = Array.from(fileMap.keys()).some(p => p.includes('readme') || p.includes('docs'))

  if (fileCount < 10 && totalLines < 1000) return 'low'
  if (fileCount > 50 || totalLines > 10000 || hasTests || hasDocs) return 'high'
  return 'medium'
}

function detectMaturity(fileMap: Map<string, string>, contents: string[]): NormalizedProject['maturity'] {
  const paths = Array.from(fileMap.keys()).join(' ').toLowerCase()
  const hasTests = paths.includes('test') || paths.includes('spec')
  const hasCI = paths.includes('github') || paths.includes('ci') || paths.includes('workflow')
  const hasDocs = paths.includes('readme') || paths.includes('docs')
  const hasLinting = paths.includes('eslint') || paths.includes('prettier')

  if (hasTests && hasCI && hasDocs && hasLinting) return 'mature'
  if (!hasTests && !hasCI) return 'prototype'
  return 'mature'
}

function mapStructure(fileMap: Map<string, string>): NormalizedProject['structure'] {
  const structure: NormalizedProject['structure'] = {
    pages: [],
    components: [],
    services: [],
    hooks: [],
    apis: [],
    utils: [],
  }

  for (const path of fileMap.keys()) {
    const lowerPath = path.toLowerCase()
    
    if (lowerPath.includes('page') || lowerPath.includes('route')) {
      structure.pages.push(path)
    } else if (lowerPath.includes('component')) {
      structure.components.push(path)
    } else if (lowerPath.includes('service') || lowerPath.includes('api') && !lowerPath.includes('route')) {
      structure.services.push(path)
    } else if (lowerPath.includes('hook') || lowerPath.includes('use')) {
      structure.hooks.push(path)
    } else if (lowerPath.includes('api/') || lowerPath.includes('route')) {
      structure.apis.push(path)
    } else if (lowerPath.includes('util') || lowerPath.includes('helper') || lowerPath.includes('lib')) {
      structure.utils.push(path)
    }
  }

  return structure
}

function detectDependencies(fileMap: Map<string, string>): Record<string, string> {
  const packageJson = Array.from(fileMap.entries()).find(([path]) => 
    path.includes('package.json')
  )?.[1]

  if (!packageJson) return {}

  try {
    const pkg = JSON.parse(packageJson)
    return { ...pkg.dependencies, ...pkg.devDependencies }
  } catch {
    return {}
  }
}

function detectConfigFiles(fileMap: Map<string, string>): string[] {
  const configs: string[] = []
  const configPatterns = [
    'tsconfig',
    'next.config',
    'tailwind.config',
    'eslint',
    'prettier',
    'jest.config',
    'vitest.config',
    '.env',
    'vercel.json',
    'netlify.toml',
  ]

  for (const path of fileMap.keys()) {
    if (configPatterns.some(pattern => path.includes(pattern))) {
      configs.push(path)
    }
  }

  return configs
}

function detectBuildSystem(fileMap: Map<string, string>): string | null {
  const paths = Array.from(fileMap.keys()).join(' ').toLowerCase()

  if (paths.includes('vite')) return 'Vite'
  if (paths.includes('webpack')) return 'Webpack'
  if (paths.includes('rollup')) return 'Rollup'
  if (paths.includes('next')) return 'Next.js'
  if (paths.includes('turbo')) return 'Turborepo'

  return null
}

