/**
 * Structure Validator
 * Validates dominant structural patterns and applies overrides when needed
 * This ensures structure dominates intent when there's a conflict
 */

import { ProjectSignals } from './intent-detector'
import { IntentResult, PrimaryIntent } from './intent-detector'
import { ProjectDomain, ProjectType } from './blueprints'

export type DominantStructure = 'EDITORIAL' | 'PRESENTATIONAL' | 'OPERATIONAL' | 'HYBRID'

export interface StructureValidation {
  dominantStructure: DominantStructure
  structuralConfidence: number
  overrides: {
    intent?: PrimaryIntent
    domain?: ProjectDomain
    type?: ProjectType
  }
  reasoning: string[]
}

/**
 * Validates dominant structure and determines if overrides are needed
 * Structure > Intent > Score (priority rule)
 */
export function validateDominantStructure(
  signals: ProjectSignals,
  intentResult: IntentResult
): StructureValidation {
  const reasoning: string[] = []
  
  // Rule 1: Editorial structure dominates
  // Strong signals: blog posts, editorial flow, high content mutation, dynamic routes
  if (
    signals.hasBlogPosts &&
    signals.hasEditorialFlow &&
    signals.contentMutationFrequency === 'high' &&
    signals.dynamicRoutes
  ) {
    reasoning.push('Editorial structure detected: blog posts + editorial flow + high content mutation + dynamic routes')
    return {
      dominantStructure: 'EDITORIAL',
      structuralConfidence: 0.9,
      overrides: {
        intent: 'INFORM', // Override PRESENT if detected
        domain: 'content',
        type: 'blog'
      },
      reasoning
    }
  }
  
  // Rule 2: Editorial structure (weaker signals but still dominant)
  if (
    signals.hasBlogPosts &&
    signals.hasEditorialFlow &&
    signals.contentMutationFrequency !== 'low'
  ) {
    reasoning.push('Editorial structure detected: blog posts + editorial flow + content mutation')
    return {
      dominantStructure: 'EDITORIAL',
      structuralConfidence: 0.85,
      overrides: {
        intent: 'INFORM',
        domain: 'content',
        type: 'blog'
      },
      reasoning
    }
  }
  
  // Rule 3: Presentational structure
  // Strong signals: one page, low content mutation, no editorial flow
  if (
    signals.onePage &&
    signals.contentMutationFrequency === 'low' &&
    !signals.hasEditorialFlow &&
    !signals.hasBlogPosts
  ) {
    reasoning.push('Presentational structure detected: one page + low content mutation + no editorial flow')
    return {
      dominantStructure: 'PRESENTATIONAL',
      structuralConfidence: 0.85,
      overrides: {
        intent: 'PRESENT',
        domain: 'product',
        type: 'landing'
      },
      reasoning
    }
  }
  
  // Rule 4: Operational structure
  // Strong signals: dashboard UI, auth usage, app state
  if (
    signals.hasDashboardUI &&
    signals.authUsageDetected &&
    signals.appState
  ) {
    reasoning.push('Operational structure detected: dashboard UI + auth usage + app state')
    return {
      dominantStructure: 'OPERATIONAL',
      structuralConfidence: 0.9,
      overrides: {
        intent: 'OPERATE',
        domain: 'service',
        type: 'saas'
      },
      reasoning
    }
  }
  
  // Rule 5: Operational structure (weaker signals)
  if (
    signals.hasDashboardUI &&
    signals.authUsageDetected
  ) {
    reasoning.push('Operational structure detected: dashboard UI + auth usage')
    return {
      dominantStructure: 'OPERATIONAL',
      structuralConfidence: 0.8,
      overrides: {
        intent: 'OPERATE',
        domain: 'service',
        type: 'saas'
      },
      reasoning
    }
  }
  
  // Rule 6: Hybrid (requires manual review or no clear dominance)
  reasoning.push('Hybrid structure: no single dominant pattern detected')
  return {
    dominantStructure: 'HYBRID',
    structuralConfidence: 0.6,
    overrides: {},
    reasoning
  }
}

/**
 * Checks if structure validation should override intent
 */
export function shouldOverrideIntent(
  structureValidation: StructureValidation,
  intentResult: IntentResult
): boolean {
  // Only override if structural confidence is high AND intent confidence is low
  if (structureValidation.structuralConfidence >= 0.8 && intentResult.confidence < 0.7) {
    return true
  }
  
  // Override if structure is very clear (EDITORIAL, OPERATIONAL) and intent contradicts
  if (
    (structureValidation.dominantStructure === 'EDITORIAL' && intentResult.primaryIntent !== 'INFORM') ||
    (structureValidation.dominantStructure === 'OPERATIONAL' && intentResult.primaryIntent !== 'OPERATE')
  ) {
    return true
  }
  
  return false
}

