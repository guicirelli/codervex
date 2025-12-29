/**
 * Prompt Builder
 * Builds confinement, validation, and output contract prompts
 * Ensures AI operates strictly within detected boundaries
 */

import { Blueprint } from './blueprints'
import { DominantStructure } from './structure-validator'
import { ProjectSignals } from './intent-detector'

export interface PromptConstraints {
  excludedConcepts: string[]
  allowedScope: string[]
  confidenceLevel: 'high' | 'medium' | 'low'
  structuralDominance: DominantStructure
  blueprint: Blueprint
  signals: ProjectSignals
}

/**
 * Builds confinement prompt (sandbox rules)
 * This comes BEFORE everything else
 */
export function buildConfinementPrompt(constraints: PromptConstraints): string {
  const exclusions = constraints.excludedConcepts.map(c => `- ${c}`).join('\n')
  const allowed = constraints.allowedScope.map(s => `- ${s}`).join('\n')
  
  return `You are operating inside a constrained reasoning environment.

HARD RULES:
- Do NOT infer features that were not detected
- Do NOT introduce systems, flows or components that are not explicitly classified
- Do NOT assume user intent beyond what is declared
- If information is missing, respond with "Not detected"
- If confidence is below 70%, avoid prescriptive decisions

EXPLICITLY EXCLUDED CONCEPTS:
${exclusions}

ALLOWED SCOPE:
${allowed}

CONFIDENCE LEVEL: ${constraints.confidenceLevel.toUpperCase()}
STRUCTURAL DOMINANCE: ${constraints.structuralDominance}

You must operate strictly inside the provided blueprint and signals.
Creativity is limited to explanation clarity only.`
}

/**
 * Builds internal validation prompt (self-check)
 */
export function buildValidationPrompt(): string {
  return `Before producing the final answer, perform an internal validation:

CHECKLIST:
- Does this output introduce features not listed in signals?
- Does this output contradict the primary intent?
- Does this output assume backend or authentication when not detected?
- Does this output exceed the declared complexity or domain?

If any answer is YES:
- Remove the conflicting part
- Or explicitly mark it as "Out of scope"`
}

/**
 * Builds output contract prompt (format rules)
 */
export function buildOutputContract(): string {
  return `OUTPUT FORMAT RULES:
- Use declarative language, not speculative
- Avoid words like "could", "might", "maybe"
- Clearly separate detected facts from assumptions
- When uncertain, label as "Low confidence"
- Never recommend architectural changes unless explicitly requested`
}

/**
 * Generates excluded concepts based on blueprint and signals
 */
export function generateExcludedConcepts(
  blueprint: Blueprint,
  signals: ProjectSignals
): string[] {
  const excluded: string[] = []
  
  // Always exclude these unless explicitly detected
  if (!signals.authUsageDetected && !signals.authLibPresent) {
    excluded.push('SaaS platforms')
    excluded.push('Multi-tenant systems')
    excluded.push('User dashboards')
    excluded.push('Authentication flows')
  }
  
  if (!signals.hasCheckout) {
    excluded.push('Payment systems')
    excluded.push('E-commerce checkout flows')
  }
  
  if (!signals.hasDashboardUI) {
    excluded.push('Admin panels')
    excluded.push('Data visualization dashboards')
  }
  
  // Blueprint-specific exclusions
  if (blueprint.output.noUI) {
    excluded.push('User interfaces')
    excluded.push('Frontend components')
  }
  
  if (!blueprint.output.stateful) {
    excluded.push('State management systems')
    excluded.push('User sessions')
  }
  
  if (blueprint.output.seoIrrelevant) {
    excluded.push('SEO optimization')
    excluded.push('Metadata management')
  }
  
  // Always exclude these (never assume)
  excluded.push('Databases or APIs unless explicitly detected')
  excluded.push('Background jobs or queues')
  excluded.push('Microservices architecture')
  excluded.push('Serverless functions')
  
  return Array.from(new Set(excluded)) // Remove duplicates
}

/**
 * Generates allowed scope based on blueprint
 */
export function generateAllowedScope(blueprint: Blueprint): string[] {
  const allowed: string[] = []
  
  if (blueprint.output.contentDriven) {
    allowed.push('Content management')
    allowed.push('Content rendering')
  }
  
  if (blueprint.output.seoCritical) {
    allowed.push('SEO optimization')
    allowed.push('Metadata management')
  }
  
  if (blueprint.output.ctaDriven) {
    allowed.push('Call-to-action elements')
    allowed.push('Conversion tracking')
  }
  
  if (blueprint.output.stateful) {
    allowed.push('State management')
    allowed.push('User sessions')
  }
  
  if (blueprint.output.authRequired) {
    allowed.push('Authentication')
    allowed.push('User management')
  }
  
  if (blueprint.output.dataHeavy) {
    allowed.push('Data visualization')
    allowed.push('Analytics')
  }
  
  if (blueprint.output.searchCritical) {
    allowed.push('Search functionality')
    allowed.push('Content indexing')
  }
  
  return allowed.length > 0 ? allowed : ['Basic project structure']
}

/**
 * Builds complete prompt stack (all layers)
 */
export function buildCompletePromptStack(
  blueprint: Blueprint,
  signals: ProjectSignals,
  structuralDominance: DominantStructure,
  confidenceLevel: 'high' | 'medium' | 'low'
): string {
  const constraints: PromptConstraints = {
    excludedConcepts: generateExcludedConcepts(blueprint, signals),
    allowedScope: generateAllowedScope(blueprint),
    confidenceLevel,
    structuralDominance,
    blueprint,
    signals
  }
  
  const confinement = buildConfinementPrompt(constraints)
  const validation = buildValidationPrompt()
  const contract = buildOutputContract()
  
  return `${confinement}

---

${validation}

---

${contract}`
}

