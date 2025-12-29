/**
 * Classification Output Format
 * Standardized output format for classification results
 */

import { IntentResult, ProjectSignals } from './intent-detector'
import { ProjectClassification } from './blueprints'
import { BlueprintSelection } from './blueprint-selector'
import { StructureValidation } from './structure-validator'

export interface ClassificationOutput {
  classification: {
    primaryIntent: string
    secondaryIntent: string | null
    projectType: string
    confidence: number
  }
  signals: {
    onePage: boolean
    hasPrimaryCTA: boolean
    hasCheckout: boolean
    hasAuthLibrary: boolean
    authUsageDetected: boolean
    hasDashboardUI: boolean
    hasBlogStructure: boolean
    hasDynamicRoutes: boolean
    seoConfigurationDetected: boolean
    contentUpdateFrequency: 'low' | 'medium' | 'high' | 'unknown'
  }
  scores: {
    INFORM: number
    PRESENT: number
    CONVERT: number
    OPERATE: number
  }
  blueprint: {
    primary: string
    secondary: string | null
    confidence: number
    excluded: string[]
  }
  source: {
    method: 'static-analysis'
    confidenceLevel: 'high' | 'medium' | 'low'
  }
  structure: {
    dominantStructure: string
    structuralConfidence: number
    overridesApplied: boolean
  }
}

/**
 * Formats classification results into standardized output
 */
export function formatClassificationOutput(
  intentResult: IntentResult,
  signals: ProjectSignals,
  classification: ProjectClassification,
  blueprintSelection: BlueprintSelection,
  structureValidation: StructureValidation,
  finalConfidence: number
): ClassificationOutput {
  // Determine confidence level based on final confidence
  let confidenceLevel: 'high' | 'medium' | 'low' = 'medium'
  if (finalConfidence >= 0.8) {
    confidenceLevel = 'high'
  } else if (finalConfidence < 0.6) {
    confidenceLevel = 'low'
  }
  
  return {
    classification: {
      primaryIntent: intentResult.primaryIntent,
      secondaryIntent: intentResult.secondaryIntent,
      projectType: classification.projectType,
      confidence: finalConfidence
    },
    signals: {
      onePage: signals.onePage,
      hasPrimaryCTA: signals.hasPrimaryCTA,
      hasCheckout: signals.hasCheckout,
      hasAuthLibrary: signals.authLibPresent,
      authUsageDetected: signals.authUsageDetected,
      hasDashboardUI: signals.hasDashboardUI,
      hasBlogStructure: signals.hasBlogPosts || signals.hasEditorialFlow,
      hasDynamicRoutes: signals.dynamicRoutes,
      seoConfigurationDetected: signals.seoHeavy,
      contentUpdateFrequency: signals.contentMutationFrequency
    },
    scores: intentResult.scores,
    blueprint: {
      primary: blueprintSelection.primaryBlueprint,
      secondary: blueprintSelection.secondaryBlueprint,
      confidence: blueprintSelection.confidence,
      excluded: blueprintSelection.excludedBlueprints
    },
    source: {
      method: 'static-analysis',
      confidenceLevel
    },
    structure: {
      dominantStructure: structureValidation.dominantStructure,
      structuralConfidence: structureValidation.structuralConfidence,
      overridesApplied: Object.keys(structureValidation.overrides).length > 0
    }
  }
}

