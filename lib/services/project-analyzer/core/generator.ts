import { AnalysisResult } from './analyzer'
import { ScanResult } from './scanner'
import { classifyProject } from './classifier'
import { selectBlueprint, getBlueprint } from './blueprint-selector'
import { NormalizedProject } from './normalizer'
import { detectIntent, collectSignals } from './intent-detector'
import { validateDominantStructure, shouldOverrideIntent } from './structure-validator'
import { calculateConfidence } from './confidence-calculator'
import { buildEvidenceGraph } from './evidence-graph'
import { applyRules } from './rule-engine'
import { generateScopeDefinition } from './scope-definition'
import { generateProposal } from './proposal-generator'
import { assembleContext } from './context-assembler'
import { generateCanonicalOutputs } from './canonical-output'
import { CanonicalContext } from './canonical-schema'
import { generateUserFacingMarkdown } from './public-output'

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
  // Engine (internal): classification + intent + structure + blueprint selection
  const classification = classifyProject(scan, normalized)
  const intentResult = detectIntent(scan, normalized, repoName)
  const signals = collectSignals(scan, normalized, repoName)
  const structureValidation = validateDominantStructure(signals, intentResult)

  let finalIntent = intentResult.primaryIntent
  let finalDomain = classification.domain
  let finalType = classification.projectType

  if (shouldOverrideIntent(structureValidation, intentResult)) {
    if (structureValidation.overrides.intent) finalIntent = structureValidation.overrides.intent
    if (structureValidation.overrides.domain) finalDomain = structureValidation.overrides.domain
    if (structureValidation.overrides.type) finalType = structureValidation.overrides.type
  }

  const blueprintSelection = selectBlueprint(
    { ...classification, domain: finalDomain, projectType: finalType },
    { ...intentResult, primaryIntent: finalIntent },
    signals,
    structureValidation
  )

  const finalConfidence = calculateConfidence(structureValidation, intentResult, signals, blueprintSelection)
  const primaryBlueprint = getBlueprint(blueprintSelection.primaryBlueprint)

  // Public summary (user-facing): MUST NOT leak engine internals
  const summary = analysis.description

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
  const markdown = generateUserFacingMarkdown(canonicalContext)

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

