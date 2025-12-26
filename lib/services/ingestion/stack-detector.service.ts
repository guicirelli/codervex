/**
 * Detector de Stack - FASE 1
 * 
 * Responsável por detectar:
 * - Framework (Next.js, React, Vue, etc)
 * - Linguagem (TypeScript, JavaScript)
 * - Styling (Tailwind, CSS Modules, etc)
 * - Build tool (Vite, Webpack, etc)
 */

import { ParsedFile } from './parser.service'

export interface DetectedStack {
  framework: string[]
  language: string[]
  styling: string[]
  buildTool: string | null
  stateManagement: string[]
  testing: string[]
  other: string[]
}

/**
 * Detect stack from parsed files
 */
export function detectStack(files: ParsedFile[]): DetectedStack {
  const stack: DetectedStack = {
    framework: [],
    language: [],
    styling: [],
    buildTool: null,
    stateManagement: [],
    testing: [],
    other: [],
  }

  // Encontrar package.json
  const packageJson = files.find(f => f.path === 'package.json' || f.path.endsWith('/package.json'))

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson.content)
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

      // Framework detection
      if (allDeps.next) stack.framework.push('Next.js')
      if (allDeps.react) stack.framework.push('React')
      if (allDeps.vue) stack.framework.push('Vue')
      if (allDeps['@angular/core']) stack.framework.push('Angular')
      if (allDeps.svelte) stack.framework.push('Svelte')
      if (allDeps.remix) stack.framework.push('Remix')
      if (allDeps.gatsby) stack.framework.push('Gatsby')

      // Language detection
      if (allDeps.typescript || pkg.devDependencies?.typescript) {
        stack.language.push('TypeScript')
      } else {
        stack.language.push('JavaScript')
      }

      // Styling detection
      if (allDeps.tailwindcss) stack.styling.push('Tailwind CSS')
      if (allDeps['styled-components']) stack.styling.push('Styled Components')
      if (allDeps['@emotion/react'] || allDeps['@emotion/styled']) stack.styling.push('Emotion')
      if (allDeps['@mui/material']) stack.styling.push('Material UI')
      if (allDeps['@chakra-ui/react']) stack.styling.push('Chakra UI')
      if (allDeps.bootstrap) stack.styling.push('Bootstrap')

      // Build tool detection
      if (allDeps.vite) stack.buildTool = 'Vite'
      else if (allDeps.webpack) stack.buildTool = 'Webpack'
      else if (allDeps.rollup) stack.buildTool = 'Rollup'
      else if (allDeps.next) stack.buildTool = 'Next.js'
      else if (allDeps.turbo) stack.buildTool = 'Turborepo'

      // State management
      if (allDeps.redux || allDeps['@reduxjs/toolkit']) stack.stateManagement.push('Redux')
      if (allDeps.zustand) stack.stateManagement.push('Zustand')
      if (allDeps.recoil) stack.stateManagement.push('Recoil')
      if (allDeps.mobx) stack.stateManagement.push('MobX')
      if (allDeps.jotai) stack.stateManagement.push('Jotai')

      // Testing
      if (allDeps.jest || allDeps['@jest/globals']) stack.testing.push('Jest')
      if (allDeps.vitest) stack.testing.push('Vitest')
      if (allDeps.cypress) stack.testing.push('Cypress')
      if (allDeps['@testing-library/react']) stack.testing.push('Testing Library')

      // Other important deps
      if (allDeps.prisma) stack.other.push('Prisma')
      if (allDeps.mongoose) stack.other.push('MongoDB')
      if (allDeps.typeorm) stack.other.push('TypeORM')
      if (allDeps.express) stack.other.push('Express')
      if (allDeps['@tanstack/react-query'] || allDeps['react-query']) {
        stack.other.push('TanStack Query')
      }
    } catch (error) {
      // Ignorar erros de parse
    }
  }

  // Detectar por extensões de arquivo
  const extensions = new Set<string>()
  files.forEach(file => {
    if (file.extension) {
      extensions.add(file.extension)
    }
  })

  if (extensions.has('.tsx') || extensions.has('.ts')) {
    if (!stack.language.includes('TypeScript')) {
      stack.language.push('TypeScript')
    }
  }

  if (extensions.has('.jsx') || extensions.has('.js')) {
    if (!stack.language.includes('JavaScript')) {
      stack.language.push('JavaScript')
    }
  }

  if (extensions.has('.vue')) {
    if (!stack.framework.includes('Vue')) {
      stack.framework.push('Vue')
    }
  }

  return stack
}

