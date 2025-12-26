/**
 * CAMADA 3: ENGINE DE INTENÇÃO
 * 
 * Responde: O que esse projeto TENTA ser?
 * Detecta decisões arquiteturais, trade-offs e intenções do desenvolvedor.
 */

import { NormalizedProject } from './ingestion.service'
import { SemanticAnalysis } from './semantic-analysis.service'

export interface ProjectIntention {
  primaryGoal: string
  architecturalDecisions: Array<{
    decision: string
    rationale: string
    tradeOff: string
  }>
  priorities: {
    speed: number // 0-10
    scalability: number // 0-10
    maintainability: number // 0-10
    userExperience: number // 0-10
  }
  technicalDebt: {
    level: 'none' | 'low' | 'medium' | 'high'
    areas: string[]
    intentional: boolean
  }
  maturity: {
    level: 'prototype' | 'mvp' | 'production' | 'enterprise'
    indicators: string[]
  }
  recommendations: {
    keep: string[]
    improve: string[]
    remove: string[]
    add: string[]
  }
}

export function analyzeIntention(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis
): ProjectIntention {
  const primaryGoal = inferPrimaryGoal(normalized, semantic)
  const architecturalDecisions = inferDecisions(normalized, semantic)
  const priorities = inferPriorities(normalized, semantic)
  const technicalDebt = assessTechnicalDebt(normalized, semantic)
  const maturity = assessMaturity(normalized, semantic)
  const recommendations = generateRecommendations(normalized, semantic, technicalDebt)

  return {
    primaryGoal,
    architecturalDecisions,
    priorities,
    technicalDebt,
    maturity,
    recommendations,
  }
}

function inferPrimaryGoal(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis
): string {
  const { projectType, complexity, maturity } = normalized

  if (projectType === 'SaaS' && complexity === 'high') {
    return 'Build a scalable, production-ready SaaS platform with multiple features and user management'
  }

  if (projectType === 'MVP' || maturity === 'prototype') {
    return 'Quickly validate a product idea with minimal viable features, prioritizing speed over perfection'
  }

  if (projectType === 'Landing') {
    return 'Create a high-converting landing page focused on user acquisition and conversion'
  }

  if (projectType === 'Dashboard') {
    return 'Build an internal tool for data visualization and management'
  }

  if (projectType === 'E-commerce') {
    return 'Create an online store with product management and checkout functionality'
  }

  return 'Build a web application with modern best practices'
}

function inferDecisions(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis
): ProjectIntention['architecturalDecisions'] {
  const decisions: ProjectIntention['architecturalDecisions'] = []

  // Stack decisions
  if (normalized.stack.includes('Next.js')) {
    decisions.push({
      decision: 'Using Next.js for SSR/SSG capabilities',
      rationale: 'Enables SEO optimization and improved performance through server-side rendering',
      tradeOff: 'Trades simplicity for better SEO and performance',
    })
  }

  if (normalized.stack.includes('TypeScript')) {
    decisions.push({
      decision: 'TypeScript for type safety',
      rationale: 'Reduces runtime errors and improves developer experience',
      tradeOff: 'Trades initial setup time for long-term maintainability',
    })
  }

  // Architecture decisions
  if (normalized.architecture === 'App Router') {
    decisions.push({
      decision: 'Next.js App Router architecture',
      rationale: 'Modern routing with better performance and developer experience',
      tradeOff: 'Trades familiarity for cutting-edge features',
    })
  }

  // State management decisions
  if (semantic.patterns.stateManagement.includes('Local State')) {
    decisions.push({
      decision: 'Local state management with useState',
      rationale: 'Simple state needs, avoiding over-engineering',
      tradeOff: 'Trades global state capabilities for simplicity',
    })
  }

  if (semantic.patterns.stateManagement.includes('Zustand')) {
    decisions.push({
      decision: 'Zustand for global state',
      rationale: 'Lightweight alternative to Redux with better DX',
      tradeOff: 'Trades ecosystem size for simplicity',
    })
  }

  // Data fetching decisions
  if (semantic.patterns.dataFlow.includes('React Query')) {
    decisions.push({
      decision: 'React Query for data fetching',
      rationale: 'Automatic caching, background updates, and error handling',
      tradeOff: 'Trades manual control for developer productivity',
    })
  }

  return decisions
}

function inferPriorities(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis
): ProjectIntention['priorities'] {
  const priorities = {
    speed: 5,
    scalability: 5,
    maintainability: 5,
    userExperience: 5,
  }

  // Speed indicators
  if (normalized.projectType === 'MVP' || normalized.maturity === 'prototype') {
    priorities.speed = 9
    priorities.scalability = 3
  }

  // Scalability indicators
  if (normalized.complexity === 'high' && normalized.stack.includes('Next.js')) {
    priorities.scalability = 8
  }

  if (semantic.patterns.architectural.includes('SSR/SSG')) {
    priorities.userExperience = 8
  }

  // Maintainability indicators
  if (normalized.stack.includes('TypeScript')) {
    priorities.maintainability = 8
  }

  if (semantic.quality.codeOrganization === 'excellent') {
    priorities.maintainability = 9
  }

  // User experience indicators
  if (semantic.patterns.design.includes('Memoization')) {
    priorities.userExperience = 7
  }

  if (normalized.stack.includes('Tailwind CSS')) {
    priorities.userExperience = 7
  }

  return priorities
}

function upgradeLevel(current: 'none' | 'low' | 'medium' | 'high'): 'none' | 'low' | 'medium' | 'high' {
  if (current === 'none') return 'low'
  if (current === 'low') return 'medium'
  if (current === 'medium') return 'high'
  return current
}

function assessTechnicalDebt(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis
): ProjectIntention['technicalDebt'] {
  const areas: string[] = []
  let level: 'none' | 'low' | 'medium' | 'high' = 'none'
  let intentional = false

  // Check for intentional shortcuts (MVP/prototype)
  if (normalized.projectType === 'MVP' || normalized.maturity === 'prototype') {
    intentional = true
    level = 'medium'
    areas.push('Quick implementation for validation')
  }

  // Code quality issues
  if (semantic.quality.codeOrganization === 'poor') {
    areas.push('Poor code organization')
    level = upgradeLevel(level)
  }

  if (semantic.quality.separationOfConcerns === 'poor') {
    areas.push('Mixed concerns in components')
    level = upgradeLevel(level)
  }

  // Missing patterns
  if (!semantic.patterns.design.includes('Custom Hooks') && normalized.structure.components.length > 10) {
    areas.push('Lack of reusable hooks')
    level = upgradeLevel(level)
  }

  // No testing
  if (normalized.maturity === 'prototype') {
    areas.push('No test coverage')
    intentional = true
  }

  return { level, areas, intentional }
}

function assessMaturity(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis
): ProjectIntention['maturity'] {
  const indicators: string[] = []
  let level: 'prototype' | 'mvp' | 'production' | 'enterprise' = 'mvp'

  // Prototype indicators
  if (normalized.complexity === 'low' && normalized.maturity === 'prototype') {
    level = 'prototype'
    indicators.push('Minimal file structure')
    indicators.push('Basic functionality')
  }

  // MVP indicators
  if (normalized.complexity === 'medium' && normalized.maturity === 'prototype') {
    level = 'mvp'
    indicators.push('Core features implemented')
    indicators.push('Ready for user validation')
  }

  // Production indicators
  if (normalized.maturity === 'mature' && semantic.quality.maintainability !== 'poor') {
    level = 'production'
    indicators.push('Well-structured codebase')
    indicators.push('Good separation of concerns')
  }

  // Enterprise indicators
  if (
    normalized.complexity === 'high' &&
    normalized.maturity === 'mature' &&
    semantic.quality.maintainability === 'excellent' &&
    semantic.quality.codeOrganization === 'excellent'
  ) {
    level = 'enterprise'
    indicators.push('Enterprise-grade architecture')
    indicators.push('Comprehensive code organization')
    indicators.push('High maintainability')
  }

  return { level, indicators }
}

function generateRecommendations(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  technicalDebt: ProjectIntention['technicalDebt']
): ProjectIntention['recommendations'] {
  const recommendations: ProjectIntention['recommendations'] = {
    keep: [],
    improve: [],
    remove: [],
    add: [],
  }

  // Keep good patterns
  if (semantic.patterns.design.includes('Custom Hooks')) {
    recommendations.keep.push('Custom hooks pattern')
  }

  if (normalized.stack.includes('TypeScript')) {
    recommendations.keep.push('TypeScript for type safety')
  }

  // Improve areas
  if (semantic.quality.separationOfConcerns === 'poor') {
    recommendations.improve.push('Extract business logic to services')
  }

  if (semantic.quality.reusability === 'poor') {
    recommendations.improve.push('Create reusable components and hooks')
  }

  // Remove technical debt
  if (technicalDebt.areas.includes('Poor code organization')) {
    recommendations.remove.push('Unorganized code structure')
    recommendations.add.push('Organized folder structure with clear separation')
  }

  // Add missing patterns
  if (!semantic.patterns.dataFlow.includes('React Query') && normalized.structure.apis.length > 0) {
    recommendations.add.push('React Query for better data fetching')
  }

  if (!semantic.patterns.design.includes('Memoization') && semantic.quality.reusability === 'poor') {
    recommendations.add.push('Memoization for performance optimization')
  }

  return recommendations
}

