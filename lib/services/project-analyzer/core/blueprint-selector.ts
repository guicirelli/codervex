/**
 * Blueprint Selector
 * Selects the most appropriate blueprint based on deterministic scoring
 */

import { ProjectClassification, ProjectType } from './blueprints'
import { BLUEPRINTS } from './blueprints'
import { IntentResult, ProjectSignals } from './intent-detector'
import { StructureValidation } from './structure-validator'

export interface BlueprintSelection {
  primaryBlueprint: string
  secondaryBlueprint: string | null
  confidence: number
  excludedBlueprints: string[]
}

/**
 * Excludes impossible blueprints based on signals
 */
function excludeImpossibleBlueprints(signals: ProjectSignals): string[] {
  const excluded: string[] = []
  
  // ContentSiteBlueprint exclusion rules
  if (!signals.hasEditorialFlow && 
      !signals.dynamicRoutes && 
      signals.contentMutationFrequency === 'low') {
    excluded.push('ContentSiteBlueprint')
  }
  
  // SaaSAppBlueprint exclusion rules
  if (!signals.authUsageDetected && !signals.hasDashboardUI) {
    excluded.push('SaaSAppBlueprint')
  }
  
  // EcommerceBlueprint exclusion rules
  if (!signals.hasCheckout) {
    excluded.push('EcommerceBlueprint')
  }
  
  // PortfolioBlueprint exclusion rules (hard rules)
  if (signals.hasCheckout) {
    excluded.push('PortfolioBlueprint') // Portfolios don't have checkout
  }
  if (signals.hasDashboardUI && signals.authUsageDetected) {
    excluded.push('PortfolioBlueprint') // Portfolios don't have multi-tenant auth
  }
  
  // DashboardBlueprint exclusion rules
  if (!signals.hasDashboardUI && !signals.appState) {
    excluded.push('DashboardBlueprint')
  }
  
  // APIServiceBlueprint exclusion rules
  if (signals.hasDashboardUI || signals.onePage) {
    excluded.push('APIServiceBlueprint')
  }
  
  // AutomationScriptBlueprint exclusion rules
  if (signals.pageCount > 5 || signals.hasDashboardUI) {
    excluded.push('AutomationScriptBlueprint')
  }
  
  return excluded
}

/**
 * Calculates blueprint scores based on feature weights
 */
function calculateBlueprintScores(
  signals: ProjectSignals,
  intentResult: IntentResult
): Record<string, number> {
  const scores: Record<string, number> = {
    LandingCROBlueprint: 0,
    PortfolioBlueprint: 0,
    ContentSiteBlueprint: 0,
    SaaSAppBlueprint: 0,
    DashboardBlueprint: 0,
    EcommerceBlueprint: 0,
    DocumentationBlueprint: 0,
    InternalToolBlueprint: 0,
    APIServiceBlueprint: 0,
    AutomationScriptBlueprint: 0
  }
  
  // Feature → Blueprint Weight Matrix
  // LandingCROBlueprint
  if (signals.onePage) scores.LandingCROBlueprint += 3
  if (signals.hasPrimaryCTA) scores.LandingCROBlueprint += 4
  if (signals.personalIdentity) scores.LandingCROBlueprint += 1
  if (signals.seoHeavy) scores.LandingCROBlueprint += 1
  if (signals.hasBlogPosts) scores.LandingCROBlueprint -= 2
  if (signals.hasEditorialFlow) scores.LandingCROBlueprint -= 2
  if (signals.authUsageDetected) scores.LandingCROBlueprint -= 3
  
  // PortfolioBlueprint (enhanced scoring)
  if (signals.hasProjects) scores.PortfolioBlueprint += 6 // Strong signal
  if (signals.personalIdentity) scores.PortfolioBlueprint += 4
  if (signals.seoHeavy) scores.PortfolioBlueprint += 2 // SEO is important for portfolios
  if (signals.onePage) scores.PortfolioBlueprint += 1
  if (signals.hasPrimaryCTA) scores.PortfolioBlueprint += 1
  // Exclusions applied above
  
  // ContentSiteBlueprint
  if (signals.hasBlogPosts) scores.ContentSiteBlueprint += 5
  if (signals.hasEditorialFlow) scores.ContentSiteBlueprint += 4
  if (signals.seoHeavy) scores.ContentSiteBlueprint += 4
  if (signals.dynamicRoutes) scores.ContentSiteBlueprint += 3
  if (signals.onePage) scores.ContentSiteBlueprint -= 1
  if (signals.hasPrimaryCTA && !signals.hasEditorialFlow) scores.ContentSiteBlueprint -= 2
  
  // SaaSAppBlueprint
  if (signals.authUsageDetected) scores.SaaSAppBlueprint += 5
  if (signals.hasDashboardUI) scores.SaaSAppBlueprint += 5
  if (signals.appState) scores.SaaSAppBlueprint += 3
  if (signals.onePage) scores.SaaSAppBlueprint -= 2
  if (!signals.authUsageDetected) scores.SaaSAppBlueprint -= 4
  
  // DashboardBlueprint
  if (signals.hasDashboardUI) scores.DashboardBlueprint += 5
  if (signals.appState) scores.DashboardBlueprint += 4
  if (signals.authUsageDetected) scores.DashboardBlueprint += 4
  if (signals.onePage) scores.DashboardBlueprint -= 3
  if (signals.seoHeavy) scores.DashboardBlueprint -= 3
  
  // EcommerceBlueprint
  if (signals.hasCheckout) scores.EcommerceBlueprint += 5
  if (signals.hasPrimaryCTA) scores.EcommerceBlueprint += 2
  if (!signals.hasCheckout) scores.EcommerceBlueprint -= 5
  
  // Apply intent bonuses
  if (intentResult.primaryIntent === 'CONVERT') {
    scores.LandingCROBlueprint += 2
    scores.EcommerceBlueprint += 1
  }
  if (intentResult.primaryIntent === 'PRESENT') {
    scores.PortfolioBlueprint += 2
    scores.LandingCROBlueprint += 1
  }
  if (intentResult.primaryIntent === 'INFORM') {
    scores.ContentSiteBlueprint += 2
  }
  if (intentResult.primaryIntent === 'OPERATE') {
    scores.SaaSAppBlueprint += 2
    scores.DashboardBlueprint += 2
  }
  
  return scores
}

/**
 * Maps project type to blueprint name
 */
function getBlueprintForType(type: ProjectType): string | null {
  const typeMap: Record<ProjectType, string> = {
    'blog': 'ContentSiteBlueprint',
    'landing': 'LandingCROBlueprint',
    'saas': 'SaaSAppBlueprint',
    'dashboard': 'DashboardBlueprint',
    'portfolio': 'PortfolioBlueprint',
    'docs': 'DocumentationBlueprint',
    'ecommerce': 'EcommerceBlueprint',
    'api': 'APIServiceBlueprint',
    'script': 'AutomationScriptBlueprint'
  }
  return typeMap[type] || null
}

/**
 * Selects blueprint using deterministic scoring
 * Now supports structure validation overrides
 */
export function selectBlueprint(
  classification: ProjectClassification,
  intentResult: IntentResult,
  signals: ProjectSignals,
  structureValidation?: StructureValidation
): BlueprintSelection {
  // Exclude impossible blueprints
  const excluded = excludeImpossibleBlueprints(signals)
  
  // If structure validation overrides type, respect it
  if (structureValidation && structureValidation.overrides.type) {
    const forcedType = structureValidation.overrides.type
    const forcedBlueprint = getBlueprintForType(forcedType)
    
    if (forcedBlueprint && !excluded.includes(forcedBlueprint)) {
      return {
        primaryBlueprint: forcedBlueprint,
        secondaryBlueprint: null,
        confidence: structureValidation.structuralConfidence,
        excludedBlueprints: excluded
      }
    }
  }
  
  // Calculate scores
  const scores = calculateBlueprintScores(signals, intentResult)
  
  // Remove excluded blueprints from scores
  excluded.forEach(blueprint => {
    delete scores[blueprint]
  })
  
  // Sort by score
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([name]) => !excluded.includes(name))
  
  if (sorted.length === 0) {
    // Fallback
    return {
      primaryBlueprint: 'LandingCROBlueprint',
      secondaryBlueprint: null,
      confidence: 0.5,
      excludedBlueprints: excluded
    }
  }
  
  const primaryBlueprint = sorted[0][0]
  const primaryScore = sorted[0][1]
  const secondaryBlueprint = sorted.length > 1 && (primaryScore - sorted[1][1]) < 3
    ? sorted[1][0]
    : null
  
  // Calculate confidence
  const totalScore = sorted.reduce((sum, [, score]) => sum + score, 0)
  const confidence = totalScore > 0 ? primaryScore / totalScore : 0.7
  
  return {
    primaryBlueprint,
    secondaryBlueprint,
    confidence: Math.min(confidence, 0.95),
    excludedBlueprints: excluded
  }
}

export function getBlueprint(blueprintName: string) {
  return BLUEPRINTS[blueprintName] || BLUEPRINTS['LandingCROBlueprint']
}

