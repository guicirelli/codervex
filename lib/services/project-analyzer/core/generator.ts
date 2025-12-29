import { AnalysisResult } from './analyzer'
import { ScanResult } from './scanner'
import { classifyProject } from './classifier'
import { selectBlueprint, getBlueprint } from './blueprint-selector'
import { NormalizedProject } from './normalizer'
import { detectIntent, collectSignals } from './intent-detector'
import { formatClassificationOutput } from './classification-output'
import { validateDominantStructure, shouldOverrideIntent } from './structure-validator'
import { calculateConfidence, getConfidenceFactors } from './confidence-calculator'
import { buildCompletePromptStack } from './prompt-builder'
import { buildEvidenceGraph } from './evidence-graph'
import { applyRules } from './rule-engine'
import { generateScopeDefinition } from './scope-definition'
import { generateProposal } from './proposal-generator'
import { assembleContext } from './context-assembler'
import { generateCanonicalOutputs } from './canonical-output'
import { CanonicalContext } from './canonical-schema'

export interface GeneratedDocument {
  markdown: string
  summary: string
  canonical?: {
    context: CanonicalContext
    json: string
    markdown: string
    prompt: string
  }
}

export function generateMarkdown(
  analysis: AnalysisResult,
  scan: ScanResult,
  normalized: NormalizedProject,
  repoName?: string
): GeneratedDocument {
  // Classify project
  const classification = classifyProject(scan, normalized)
  
  // Detect intent using deterministic scoring
  const intentResult = detectIntent(scan, normalized, repoName)
  const signals = collectSignals(scan, normalized, repoName)
  
  // NEW: Validate dominant structure
  const structureValidation = validateDominantStructure(signals, intentResult)
  
  // Apply structure overrides if needed
  let finalIntent = intentResult.primaryIntent
  let finalDomain = classification.domain
  let finalType = classification.projectType
  
  if (shouldOverrideIntent(structureValidation, intentResult)) {
    if (structureValidation.overrides.intent) {
      finalIntent = structureValidation.overrides.intent
    }
    if (structureValidation.overrides.domain) {
      finalDomain = structureValidation.overrides.domain
    }
    if (structureValidation.overrides.type) {
      finalType = structureValidation.overrides.type
    }
  }
  
  // Select blueprint with structure validation
  const blueprintSelection = selectBlueprint(
    { ...classification, domain: finalDomain, projectType: finalType },
    { ...intentResult, primaryIntent: finalIntent },
    signals,
    structureValidation
  )
  
  // Calculate improved confidence
  const finalConfidence = calculateConfidence(
    structureValidation,
    intentResult,
    signals,
    blueprintSelection
  )
  
  const primaryBlueprint = getBlueprint(blueprintSelection.primaryBlueprint)
  const secondaryBlueprint = blueprintSelection.secondaryBlueprint 
    ? getBlueprint(blueprintSelection.secondaryBlueprint)
    : null
  
  const lines: string[] = []

  // Header with Blueprint
  lines.push('# Project Overview')
  lines.push('')
  lines.push(`**Primary Blueprint:** ${primaryBlueprint.name}`)
  if (secondaryBlueprint) {
    lines.push(`**Secondary Blueprint:** ${secondaryBlueprint.name}`)
  }
  lines.push(`*${primaryBlueprint.description}*`)
  lines.push('')
  lines.push(`*Confidence: ${(finalConfidence * 100).toFixed(0)}%*`)
  lines.push('')
  lines.push(`*Structural Dominance: ${structureValidation.dominantStructure}*`)
  if (structureValidation.reasoning.length > 0) {
    lines.push(`*Reasoning: ${structureValidation.reasoning.join('; ')}*`)
  }
  lines.push('')
  lines.push('*Generated automatically via static analysis*')
  lines.push('')

  // Intent Detection (Deterministic)
  lines.push('## Intent Detection (Deterministic)')
  lines.push(`- **Primary Intent:** ${finalIntent}${finalIntent !== intentResult.primaryIntent ? ` (overridden from ${intentResult.primaryIntent})` : ''}`)
  if (intentResult.secondaryIntent) {
    lines.push(`- **Secondary Intent:** ${intentResult.secondaryIntent}`)
  }
  lines.push(`- **Raw Confidence:** ${(intentResult.confidence * 100).toFixed(0)}%`)
  lines.push(`- **Final Confidence:** ${(finalConfidence * 100).toFixed(0)}%`)
  lines.push('')
  lines.push('### Intent Scores (Deterministic Matrix)')
  lines.push(`- **INFORM:** ${intentResult.scores.INFORM} points`)
  lines.push(`- **PRESENT:** ${intentResult.scores.PRESENT} points`)
  lines.push(`- **CONVERT:** ${intentResult.scores.CONVERT} points`)
  lines.push(`- **OPERATE:** ${intentResult.scores.OPERATE} points`)
  lines.push('')
  lines.push('*Priority rule: OPERATE > CONVERT > PRESENT > INFORM (applies only on tie)*')
  lines.push('')
  
  // Structure Validation
  lines.push('## Structure Validation')
  lines.push(`- **Dominant Structure:** ${structureValidation.dominantStructure}`)
  lines.push(`- **Structural Confidence:** ${(structureValidation.structuralConfidence * 100).toFixed(0)}%`)
  if (structureValidation.reasoning.length > 0) {
    lines.push('### Reasoning')
    structureValidation.reasoning.forEach(reason => {
      lines.push(`- ${reason}`)
    })
  }
  if (Object.keys(structureValidation.overrides).length > 0) {
    lines.push('### Applied Overrides')
    if (structureValidation.overrides.intent) {
      lines.push(`- Intent: ${structureValidation.overrides.intent}`)
    }
    if (structureValidation.overrides.domain) {
      lines.push(`- Domain: ${structureValidation.overrides.domain}`)
    }
    if (structureValidation.overrides.type) {
      lines.push(`- Type: ${structureValidation.overrides.type}`)
    }
  }
  lines.push('')

  // Classification
  lines.push('## Classification')
  const intentOverridden = structureValidation.overrides.intent !== undefined
  const domainOverridden = structureValidation.overrides.domain !== undefined
  const typeOverridden = structureValidation.overrides.type !== undefined
  lines.push(`- **Intent:** ${finalIntent}${intentOverridden ? ` (overridden from ${intentResult.primaryIntent})` : ''}`)
  lines.push(`- **Domain:** ${finalDomain}${domainOverridden ? ` (overridden from ${classification.domain})` : ''}`)
  lines.push(`- **Type:** ${finalType}${typeOverridden ? ` (overridden from ${classification.projectType})` : ''}`)
  lines.push(`- **Complexity:** ${classification.complexity}`)
  lines.push(`- **Statefulness:** ${classification.statefulness}`)
  lines.push(`- **Auth Required:** ${classification.authRequired ? 'Yes' : 'No'}`)
  lines.push(`- **SEO Relevant:** ${classification.seoRelevant ? 'Yes' : 'No'}`)
  lines.push('')

  // Source
  lines.push('## Source')
  lines.push('- Type: Static Analysis')
  lines.push('- Method: Project structure and configuration files')
  lines.push('')

  // Stack
  lines.push('## Stack')
  lines.push(`- Language: ${analysis.stack}`)
  lines.push(`- Framework: ${analysis.framework}`)
  if (scan.languages.length > 1) {
    lines.push(`- Additional Languages: ${scan.languages.slice(1).join(', ')}`)
  }
  lines.push('')

  // Entry Point
  lines.push('## Entry Point')
  lines.push(`- File: ${analysis.entryPoint}`)
  lines.push('')

  // Project Structure (from Primary Blueprint)
  if (primaryBlueprint.structure.pages && primaryBlueprint.structure.pages.length > 0) {
    lines.push('## Expected Structure')
    lines.push('### Pages/Components')
    primaryBlueprint.structure.pages.forEach(page => {
      lines.push(`- ${page}`)
    })
    if (secondaryBlueprint?.structure.pages) {
      secondaryBlueprint.structure.pages.forEach(page => {
        lines.push(`- ${page} (secondary)`)
      })
    }
    lines.push('')
  }

  if (primaryBlueprint.structure.entities && primaryBlueprint.structure.entities.length > 0) {
    lines.push('### Entities')
    primaryBlueprint.structure.entities.forEach(entity => {
      lines.push(`- ${entity}`)
    })
    if (secondaryBlueprint?.structure.entities) {
      secondaryBlueprint.structure.entities.forEach(entity => {
        lines.push(`- ${entity} (secondary)`)
      })
    }
    lines.push('')
  }

  if (primaryBlueprint.structure.systems && primaryBlueprint.structure.systems.length > 0) {
    lines.push('### Systems')
    primaryBlueprint.structure.systems.forEach(system => {
      lines.push(`- ${system}`)
    })
    if (secondaryBlueprint?.structure.systems) {
      secondaryBlueprint.structure.systems.forEach(system => {
        lines.push(`- ${system} (secondary)`)
      })
    }
    lines.push('')
  }

  // Core Flows
  if (primaryBlueprint.coreFlows.length > 0) {
    lines.push('## Core Flows')
    primaryBlueprint.coreFlows.forEach(flow => {
      lines.push(`- ${flow}`)
    })
    if (secondaryBlueprint?.coreFlows) {
      secondaryBlueprint.coreFlows.forEach(flow => {
        lines.push(`- ${flow} (secondary)`)
      })
    }
    lines.push('')
  }

  // Actual Folder Structure
  if (analysis.folderStructure.length > 0) {
    lines.push('## Current Folder Structure')
    analysis.folderStructure.forEach(folder => {
      lines.push(`- ${folder}`)
    })
    lines.push('')
  }

  // Key Dependencies
  if (analysis.keyDependencies.length > 0) {
    lines.push('## Key Dependencies')
    analysis.keyDependencies.forEach(dep => {
      const version = scan.dependencies[dep] || 'unknown'
      lines.push(`- ${dep}: ${version}`)
    })
    lines.push('')
  }

  // Configuration Files
  if (scan.configFiles.length > 0) {
    lines.push('## Configuration Files')
    scan.configFiles.forEach(config => {
      lines.push(`- ${config}`)
    })
    lines.push('')
  }

  // Classification Output (JSON format for audit)
  const classificationOutput = formatClassificationOutput(
    intentResult,
    signals,
    classification,
    blueprintSelection,
    structureValidation,
    finalConfidence
  )
  lines.push('## Classification Output (JSON)')
  lines.push('```json')
  lines.push(JSON.stringify(classificationOutput, null, 2))
  lines.push('```')
  lines.push('')

  // Confidence Factors (for transparency)
  const confidenceFactors = getConfidenceFactors(structureValidation, intentResult, signals)
  lines.push('## Confidence Factors')
  lines.push(`- **Structural Match:** ${(confidenceFactors.structuralMatch * 100).toFixed(0)}% (weight: 60%)`)
  lines.push(`- **Intent Dominance:** ${(confidenceFactors.intentDominance * 100).toFixed(0)}% (weight: 30%)`)
  lines.push(`- **Signal Completeness:** ${(confidenceFactors.signalCompleteness * 100).toFixed(0)}% (weight: 10%)`)
  lines.push('')
  
  // Prompt Constraints (for AI usage)
  const confidenceLevel: 'high' | 'medium' | 'low' = 
    finalConfidence >= 0.8 ? 'high' : 
    finalConfidence >= 0.6 ? 'medium' : 'low'
  
  lines.push('## Prompt Constraints (For AI Usage)')
  lines.push('```')
  lines.push(buildCompletePromptStack(primaryBlueprint, signals, structureValidation.dominantStructure, confidenceLevel))
  lines.push('```')
  lines.push('')
  
  // Notes
  lines.push('## Notes')
  lines.push('This document was generated automatically based on project structure and configuration files.')
  lines.push('It provides a structural overview and does not include semantic code analysis.')
  lines.push('')
  lines.push('**Classification Priority:** Structure > Intent > Score')
  lines.push('')
  lines.push(`**Primary Blueprint Objective:** ${primaryBlueprint.objective}`)
  if (secondaryBlueprint) {
    lines.push(`**Secondary Blueprint Objective:** ${secondaryBlueprint.objective}`)
  }
  lines.push('')

  const markdown = lines.join('\n')
  
  // Summary with blueprint
  const summary = `${primaryBlueprint.name}${secondaryBlueprint ? ` + ${secondaryBlueprint.name}` : ''}: ${primaryBlueprint.objective}. ${analysis.description}`

  // NEW: Generate canonical context using new architecture
  const evidence = buildEvidenceGraph(scan, normalized, signals)
  const ruleResult = applyRules(evidence)
  const scope = generateScopeDefinition(evidence, primaryBlueprint, ruleResult.repository_type)
  const proposal = generateProposal(evidence, primaryBlueprint, finalIntent, ruleResult)
  
  const canonicalContext = assembleContext({
    evidence,
    ruleResult,
    blueprint: primaryBlueprint,
    scope,
    proposal,
    analysis,
    scan,
    normalized,
    repoName,
    confidence: finalConfidence
  })
  
  const canonicalOutputs = generateCanonicalOutputs(canonicalContext)

  return {
    markdown,
    summary,
    canonical: {
      context: canonicalContext,
      json: canonicalOutputs.json,
      markdown: canonicalOutputs.markdown,
      prompt: canonicalOutputs.prompt
    }
  }
}

