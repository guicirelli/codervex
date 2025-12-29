/**
 * Confidence Calculator
 * Calculates final confidence using multiple factors
 * Formula: structuralMatch * 0.6 + intentDominance * 0.3 + signalCompleteness * 0.1
 */

import { StructureValidation } from './structure-validator'
import { IntentResult, ProjectSignals } from './intent-detector'
import { BlueprintSelection } from './blueprint-selector'

export interface ConfidenceFactors {
  structuralMatch: number      // 0.6 weight
  intentDominance: number       // 0.3 weight
  signalCompleteness: number    // 0.1 weight
}

/**
 * Calculates final confidence score
 */
export function calculateConfidence(
  structuralValidation: StructureValidation,
  intentResult: IntentResult,
  signals: ProjectSignals,
  blueprintSelection: BlueprintSelection
): number {
  // Structural match (60%)
  const structuralMatch = structuralValidation.structuralConfidence
  
  // Intent dominance (30%)
  const sorted = Object.entries(intentResult.scores).sort((a, b) => b[1] - a[1])
  const primaryScore = sorted[0][1]
  const totalScore = Object.values(intentResult.scores).reduce((a, b) => a + b, 0)
  const intentDominance = totalScore > 0 ? primaryScore / totalScore : 0.5
  
  // Signal completeness (10%)
  const requiredSignals = [
    signals.onePage !== undefined,
    signals.hasPrimaryCTA !== undefined,
    signals.hasCheckout !== undefined,
    signals.authLibPresent !== undefined,
    signals.hasDashboardUI !== undefined,
    signals.hasBlogPosts !== undefined,
    signals.dynamicRoutes !== undefined,
    signals.hasEditorialFlow !== undefined,
    signals.contentMutationFrequency !== undefined
  ]
  const signalCompleteness = requiredSignals.filter(Boolean).length / requiredSignals.length
  
  // Final confidence
  const confidence = (
    structuralMatch * 0.6 +
    intentDominance * 0.3 +
    signalCompleteness * 0.1
  )
  
  return Math.min(confidence, 0.95)
}

/**
 * Gets confidence factors for debugging/transparency
 */
export function getConfidenceFactors(
  structuralValidation: StructureValidation,
  intentResult: IntentResult,
  signals: ProjectSignals
): ConfidenceFactors {
  const sorted = Object.entries(intentResult.scores).sort((a, b) => b[1] - a[1])
  const primaryScore = sorted[0][1]
  const totalScore = Object.values(intentResult.scores).reduce((a, b) => a + b, 0)
  const intentDominance = totalScore > 0 ? primaryScore / totalScore : 0.5
  
  const requiredSignals = [
    signals.onePage !== undefined,
    signals.hasPrimaryCTA !== undefined,
    signals.hasCheckout !== undefined,
    signals.authLibPresent !== undefined,
    signals.hasDashboardUI !== undefined,
    signals.hasBlogPosts !== undefined,
    signals.dynamicRoutes !== undefined,
    signals.hasEditorialFlow !== undefined,
    signals.contentMutationFrequency !== undefined
  ]
  const signalCompleteness = requiredSignals.filter(Boolean).length / requiredSignals.length
  
  return {
    structuralMatch: structuralValidation.structuralConfidence,
    intentDominance,
    signalCompleteness
  }
}

