/**
 * CAMADA 4: MODELO DE RECONSTRUÇÃO
 * 
 * Pensa: "Se eu fosse refazer isso do zero, o que manteria?"
 * Gera arquitetura idealizada e guia de rebuild/refactor.
 */

import { NormalizedProject } from './ingestion.service'
import { SemanticAnalysis } from './semantic-analysis.service'
import { ProjectIntention } from './intention-engine.service'

export interface ReconstructionModel {
  idealArchitecture: {
    structure: string[]
    patterns: string[]
    technologies: string[]
    rationale: string
  }
  preservation: {
    keep: Array<{ what: string; why: string }>
    enhance: Array<{ what: string; how: string }>
  }
  elimination: {
    remove: Array<{ what: string; why: string }>
    replace: Array<{ from: string; to: string; why: string }>
  }
  improvements: {
    architectural: string[]
    performance: string[]
    maintainability: string[]
    userExperience: string[]
  }
  migrationPath: {
    steps: Array<{ step: number; action: string; priority: 'high' | 'medium' | 'low' }>
    estimatedEffort: string
  }
}

export function generateReconstructionModel(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): ReconstructionModel {
  const idealArchitecture = designIdealArchitecture(normalized, semantic, intention)
  const preservation = identifyPreservation(normalized, semantic, intention)
  const elimination = identifyElimination(normalized, semantic, intention)
  const improvements = identifyImprovements(normalized, semantic, intention)
  const migrationPath = createMigrationPath(normalized, semantic, intention, improvements)

  return {
    idealArchitecture,
    preservation,
    elimination,
    improvements,
    migrationPath,
  }
}

function designIdealArchitecture(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): ReconstructionModel['idealArchitecture'] {
  const structure: string[] = []
  const patterns: string[] = []
  const technologies: string[] = []

  // Base structure
  structure.push('app/ (or pages/) - Route definitions')
  structure.push('components/ - Reusable UI components')
  structure.push('lib/ or utils/ - Utility functions')
  structure.push('hooks/ - Custom React hooks')
  structure.push('services/ or api/ - Business logic and API calls')
  structure.push('types/ - TypeScript type definitions')

  // Add stack-specific structure
  if (normalized.stack.includes('Next.js')) {
    if (normalized.architecture === 'App Router') {
      structure.push('app/api/ - API routes')
      structure.push('app/[dynamic]/ - Dynamic routes')
    } else {
      structure.push('pages/api/ - API routes')
    }
  }

  // Recommended patterns
  if (semantic.quality.separationOfConcerns === 'poor') {
    patterns.push('Service Layer Pattern - Separate business logic from UI')
  }

  if (!semantic.patterns.design.includes('Custom Hooks')) {
    patterns.push('Custom Hooks Pattern - Extract reusable logic')
  }

  if (semantic.quality.reusability === 'poor') {
    patterns.push('Component Composition - Build complex UIs from simple components')
  }

  // Recommended technologies
  technologies.push(...normalized.stack.filter(s => s !== 'JavaScript')) // Keep TypeScript if present

  if (!normalized.stack.includes('TypeScript') && normalized.complexity !== 'low') {
    technologies.push('TypeScript - For better type safety')
  }

  if (!semantic.patterns.dataFlow.includes('React Query') && normalized.structure.apis.length > 0) {
    technologies.push('React Query - For efficient data fetching')
  }

  const rationale = `Based on the project's ${intention.primaryGoal.toLowerCase()}, the ideal architecture prioritizes ${intention.priorities.maintainability > 7 ? 'maintainability' : intention.priorities.speed > 7 ? 'speed of development' : 'balanced approach'}. The structure supports ${normalized.complexity === 'high' ? 'scalable growth' : 'rapid iteration'}.`

  return {
    structure,
    patterns,
    technologies,
    rationale,
  }
}

function identifyPreservation(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): ReconstructionModel['preservation'] {
  const keep: Array<{ what: string; why: string }> = []
  const enhance: Array<{ what: string; how: string }> = []

  // Keep good decisions
  if (normalized.stack.includes('TypeScript')) {
    keep.push({
      what: 'TypeScript usage',
      why: 'Provides type safety and better developer experience',
    })
  }

  if (semantic.patterns.design.includes('Custom Hooks')) {
    keep.push({
      what: 'Custom hooks pattern',
      why: 'Promotes code reusability and separation of concerns',
    })
  }

  if (normalized.architecture === 'App Router' && normalized.stack.includes('Next.js')) {
    keep.push({
      what: 'Next.js App Router',
      why: 'Modern routing with excellent performance characteristics',
    })
  }

  // Enhance existing patterns
  if (semantic.quality.separationOfConcerns === 'fair' || semantic.quality.separationOfConcerns === 'good') {
    enhance.push({
      what: 'Service layer',
      how: 'Extract business logic from components into dedicated service files',
    })
  }

  if (semantic.patterns.stateManagement.includes('Local State') && normalized.complexity === 'high') {
    enhance.push({
      what: 'State management',
      how: 'Consider Zustand or React Query for global state and server state',
    })
  }

  return { keep, enhance }
}

function identifyElimination(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): ReconstructionModel['elimination'] {
  const remove: Array<{ what: string; why: string }> = []
  const replace: Array<{ from: string; to: string; why: string }> = []

  // Remove technical debt
  if (intention.technicalDebt.areas.includes('Poor code organization')) {
    remove.push({
      what: 'Unorganized file structure',
      why: 'Hinders maintainability and developer onboarding',
    })
  }

  if (semantic.quality.separationOfConcerns === 'poor') {
    remove.push({
      what: 'Mixed concerns in components',
      why: 'Makes code harder to test and maintain',
    })
  }

  // Replace outdated patterns
  if (semantic.patterns.dataFlow.includes('REST API') && !semantic.patterns.dataFlow.includes('React Query')) {
    replace.push({
      from: 'Manual fetch calls in components',
      to: 'React Query for data fetching',
      why: 'Provides caching, background updates, and better error handling',
    })
  }

  if (semantic.patterns.stateManagement.includes('Local State') && normalized.complexity === 'high') {
    replace.push({
      from: 'Prop drilling',
      to: 'Zustand or Context API',
      why: 'Reduces prop drilling and improves component reusability',
    })
  }

  return { remove, replace }
}

function identifyImprovements(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): ReconstructionModel['improvements'] {
  const improvements: ReconstructionModel['improvements'] = {
    architectural: [],
    performance: [],
    maintainability: [],
    userExperience: [],
  }

  // Architectural improvements
  if (semantic.quality.codeOrganization === 'poor' || semantic.quality.codeOrganization === 'fair') {
    improvements.architectural.push('Implement clear folder structure with separation of concerns')
  }

  if (!semantic.patterns.design.includes('Custom Hooks')) {
    improvements.architectural.push('Extract reusable logic into custom hooks')
  }

  // Performance improvements
  if (!semantic.patterns.design.includes('Memoization') && normalized.structure.components.length > 10) {
    improvements.performance.push('Add React.memo and useMemo for expensive computations')
  }

  if (semantic.patterns.dataFlow.includes('REST API') && !semantic.patterns.dataFlow.includes('React Query')) {
    improvements.performance.push('Implement React Query for automatic caching and background updates')
  }

  // Maintainability improvements
  if (!normalized.stack.includes('TypeScript') && normalized.complexity !== 'low') {
    improvements.maintainability.push('Migrate to TypeScript for better type safety')
  }

  if (semantic.quality.separationOfConcerns === 'poor') {
    improvements.maintainability.push('Separate business logic from UI components')
  }

  // User experience improvements
  if (!semantic.patterns.architectural.includes('SSR/SSG') && normalized.stack.includes('Next.js')) {
    improvements.userExperience.push('Implement SSR/SSG for faster initial page loads')
  }

  if (normalized.stack.includes('Tailwind CSS') && semantic.quality.reusability === 'poor') {
    improvements.userExperience.push('Create reusable component library with consistent design system')
  }

  return improvements
}

function createMigrationPath(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention,
  improvements: ReconstructionModel['improvements']
): ReconstructionModel['migrationPath'] {
  const steps: Array<{ step: number; action: string; priority: 'high' | 'medium' | 'low' }> = []
  let stepNumber = 1

  // High priority: Fix critical issues
  if (semantic.quality.codeOrganization === 'poor') {
    steps.push({
      step: stepNumber++,
      action: 'Reorganize file structure following best practices',
      priority: 'high',
    })
  }

  if (semantic.quality.separationOfConcerns === 'poor') {
    steps.push({
      step: stepNumber++,
      action: 'Extract business logic from components to services',
      priority: 'high',
    })
  }

  // Medium priority: Add missing patterns
  if (!semantic.patterns.design.includes('Custom Hooks') && normalized.structure.components.length > 5) {
    steps.push({
      step: stepNumber++,
      action: 'Create custom hooks for reusable logic',
      priority: 'medium',
    })
  }

  if (!semantic.patterns.dataFlow.includes('React Query') && normalized.structure.apis.length > 0) {
    steps.push({
      step: stepNumber++,
      action: 'Implement React Query for data fetching',
      priority: 'medium',
    })
  }

  // Low priority: Enhancements
  if (!normalized.stack.includes('TypeScript') && normalized.complexity !== 'low') {
    steps.push({
      step: stepNumber++,
      action: 'Gradually migrate to TypeScript',
      priority: 'low',
    })
  }

  if (!semantic.patterns.design.includes('Memoization')) {
    steps.push({
      step: stepNumber++,
      action: 'Add memoization for performance optimization',
      priority: 'low',
    })
  }

  const estimatedEffort = calculateEffort(steps, normalized.complexity)

  return { steps, estimatedEffort }
}

function calculateEffort(
  steps: Array<{ step: number; action: string; priority: 'high' | 'medium' | 'low' }>,
  complexity: NormalizedProject['complexity']
): string {
  const highPrioritySteps = steps.filter(s => s.priority === 'high').length
  const mediumPrioritySteps = steps.filter(s => s.priority === 'medium').length
  const lowPrioritySteps = steps.filter(s => s.priority === 'low').length

  let totalDays = 0
  totalDays += highPrioritySteps * (complexity === 'high' ? 3 : complexity === 'medium' ? 2 : 1)
  totalDays += mediumPrioritySteps * (complexity === 'high' ? 2 : complexity === 'medium' ? 1 : 0.5)
  totalDays += lowPrioritySteps * (complexity === 'high' ? 1 : complexity === 'medium' ? 0.5 : 0.25)

  if (totalDays < 1) return 'Less than 1 day'
  if (totalDays < 5) return `${Math.ceil(totalDays)} days`
  if (totalDays < 20) return `${Math.ceil(totalDays / 5)} weeks`
  return `${Math.ceil(totalDays / 20)} months`
}

