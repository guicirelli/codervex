import { ScanResult } from './scanner'
import { NormalizedProject } from './normalizer'

export interface AnalysisResult {
  stack: string
  framework: string
  entryPoint: string
  projectType: string
  description: string
  folderStructure: string[]
  keyDependencies: string[]
}

export function analyzeProject(scan: ScanResult, normalized: NormalizedProject): AnalysisResult {
  // Determine main stack
  let stack = 'Unknown'
  if (scan.languages.includes('TypeScript') || scan.languages.includes('JavaScript')) {
    stack = 'JavaScript/TypeScript'
  } else if (scan.languages.length > 0) {
    stack = scan.languages[0]
  }

  // Determine framework
  let framework = 'Not detected'
  if (scan.frameworks.length > 0) {
    framework = scan.frameworks[0]
  } else if (scan.dependencies['react']) {
    framework = 'React'
  } else if (scan.dependencies['vue']) {
    framework = 'Vue.js'
  } else if (scan.dependencies['angular']) {
    framework = 'Angular'
  } else if (scan.dependencies['express']) {
    framework = 'Express.js'
  }

  // Entry point
  const entryPoint = scan.entryPoints.length > 0 
    ? scan.entryPoints[0] 
    : 'Not identified'

  // Project type
  let projectType = 'Application'
  if (scan.structure.hasComponents && scan.structure.hasPages) {
    projectType = 'Web Application'
  } else if (scan.structure.hasControllers && scan.structure.hasServices) {
    projectType = 'Backend API'
  } else if (scan.structure.hasComponents) {
    projectType = 'Frontend Library'
  } else if (scan.dependencies['express'] || scan.dependencies['fastify']) {
    projectType = 'Backend Service'
  }

  // Description
  const description = generateDescription(scan, projectType, framework)

  // Relevant folder structure
  const folderStructure = normalized.folders
    .filter(f => {
      const lower = f.toLowerCase()
      return !lower.includes('node_modules') && 
             !lower.includes('.git') &&
             !lower.includes('dist') &&
             !lower.includes('build')
    })
    .slice(0, 20) // Limit to 20 folders

  // Key dependencies (top 10)
  const keyDependencies = Object.keys(scan.dependencies)
    .filter(dep => {
      // Filter build/dev dependencies
      const devDeps = ['webpack', 'vite', 'eslint', 'prettier', 'typescript', '@types']
      return !devDeps.some(dev => dep.toLowerCase().includes(dev))
    })
    .slice(0, 10)

  return {
    stack,
    framework,
    entryPoint,
    projectType,
    description,
    folderStructure,
    keyDependencies
  }
}

function generateDescription(scan: ScanResult, projectType: string, framework: string): string {
  const parts: string[] = []
  
  parts.push(`This appears to be a ${projectType.toLowerCase()}`)
  
  if (framework !== 'Not detected') {
    parts.push(`built with ${framework}`)
  }
  
  if (scan.languages.length > 0) {
    parts.push(`using ${scan.languages.join(' and ')}`)
  }
  
  if (scan.structure.hasComponents) {
    parts.push('with a component-based architecture')
  }
  
  if (scan.structure.hasServices) {
    parts.push('including service layer')
  }
  
  return parts.join(', ') + '.'
}

