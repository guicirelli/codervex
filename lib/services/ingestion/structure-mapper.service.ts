/**
 * Mapeador de Estrutura - FASE 1
 * 
 * Responsável por:
 * - Identificar páginas/rotas
 * - Identificar componentes
 * - Identificar serviços/utils
 * - Mapear estrutura de pastas
 */

import { ParsedFile, ProjectStructure } from './parser.service'

export interface MappedStructure {
  pages: string[]
  components: string[]
  services: string[]
  utils: string[]
  hooks: string[]
  apis: string[]
  config: string[]
  styles: string[]
  other: string[]
}

/**
 * Map project structure
 */
export function mapStructure(
  structure: ProjectStructure,
  stack: { framework: string[] }
): MappedStructure {
  const mapped: MappedStructure = {
    pages: [],
    components: [],
    services: [],
    utils: [],
    hooks: [],
    apis: [],
    config: [],
    styles: [],
    other: [],
  }

  const isNextJs = stack.framework.includes('Next.js')

  for (const file of structure.files) {
    const path = file.path.toLowerCase()

    // Pages/Routes
    if (isNextJs) {
      // Next.js App Router
      if (path.includes('/app/') && (path.includes('/page.') || path.includes('/route.'))) {
        mapped.pages.push(file.path)
      }
      // Next.js Pages Router
      else if (path.includes('/pages/') && !path.includes('/api/')) {
        mapped.pages.push(file.path)
      }
    } else {
      // React Router ou similar
      if (path.includes('page') || path.includes('route') || path.includes('view')) {
        mapped.pages.push(file.path)
      }
    }

    // Components
    if (
      path.includes('component') ||
      (path.includes('/components/') && file.type === 'code') ||
      (path.includes('/ui/') && file.type === 'code')
    ) {
      mapped.components.push(file.path)
    }

    // Services
    if (
      path.includes('service') ||
      path.includes('/services/') ||
      path.includes('/api/') && !path.includes('/pages/')
    ) {
      if (path.includes('/api/') || path.includes('/routes/api/')) {
        mapped.apis.push(file.path)
      } else {
        mapped.services.push(file.path)
      }
    }

    // Utils
    if (
      path.includes('util') ||
      path.includes('helper') ||
      path.includes('/utils/') ||
      path.includes('/helpers/') ||
      path.includes('/lib/')
    ) {
      mapped.utils.push(file.path)
    }

    // Hooks
    if (
      path.includes('hook') ||
      path.includes('/hooks/') ||
      (path.startsWith('use') && file.type === 'code')
    ) {
      mapped.hooks.push(file.path)
    }

    // Config files
    if (file.type === 'config') {
      mapped.config.push(file.path)
    }

    // Styles
    if (file.type === 'style') {
      mapped.styles.push(file.path)
    }

    // Other code files not categorized
    if (file.type === 'code' && !isCategorized(file.path, mapped)) {
      mapped.other.push(file.path)
    }
  }

  return mapped
}

function isCategorized(path: string, mapped: MappedStructure): boolean {
  return (
    mapped.pages.includes(path) ||
    mapped.components.includes(path) ||
    mapped.services.includes(path) ||
    mapped.utils.includes(path) ||
    mapped.hooks.includes(path) ||
    mapped.apis.includes(path)
  )
}

