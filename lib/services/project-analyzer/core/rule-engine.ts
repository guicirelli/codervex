/**
 * Rule Engine
 * O coração do produto
 * Nenhuma saída pode existir sem regra
 * Regras explícitas, determinísticas, sem IA
 */

import { EvidenceGraph } from './evidence-graph'
import { PrimaryIntent } from './intent-detector'

export interface RuleResult {
  repository_type: 'frontend' | 'backend' | 'fullstack' | 'static'
  intent: PrimaryIntent
  complexity: 'low' | 'medium' | 'high'
  statefulness: 'stateless' | 'stateful'
  seo_relevant: boolean
  auth_required: boolean
  reasoning: string[]
}

/**
 * Rule: Repository Type
 * IF has_backend = false AND has_database = false AND has_pages_router = true
 * THEN project_type = "static"
 */
function determineRepositoryType(evidence: EvidenceGraph): 'frontend' | 'backend' | 'fullstack' | 'static' {
  if (evidence.has_backend && evidence.has_database) {
    return 'fullstack'
  }
  if (evidence.has_backend && !evidence.has_database) {
    return 'backend'
  }
  if (!evidence.has_backend && (evidence.has_nextjs || evidence.has_react || evidence.has_vue)) {
    if (evidence.has_static_export || (!evidence.has_api_routes && !evidence.has_database)) {
      return 'static'
    }
    return 'frontend'
  }
  return 'static'
}

/**
 * Rule: Intent (determinístico)
 * IF has_checkout OR pricing_section → CONVERT
 * ELSE IF has_dashboard → OPERATE
 * ELSE IF seo_files AND blog_structure → INFORM
 * ELSE → PRESENT
 */
function determineIntent(evidence: EvidenceGraph): PrimaryIntent {
  if (evidence.has_checkout || evidence.has_products) {
    return 'CONVERT'
  }
  if (evidence.has_dashboard && evidence.has_auth) {
    return 'OPERATE'
  }
  if (evidence.has_seo_files && evidence.has_blog_structure) {
    return 'INFORM'
  }
  return 'PRESENT'
}

/**
 * Rule: Complexity (sem opinião)
 * complexity_score = routes + integrations + external_services
 * <= 5 → LOW
 * <= 10 → MEDIUM
 * > 10 → HIGH
 */
function determineComplexity(evidence: EvidenceGraph): 'low' | 'medium' | 'high' {
  const score = evidence.number_of_routes + 
    evidence.number_of_integrations + 
    evidence.number_of_external_services
  
  if (score <= 5) return 'low'
  if (score <= 10) return 'medium'
  return 'high'
}

/**
 * Rule: SEO Relevance
 * IF has_head_metadata = true AND has_open_graph = true
 * THEN seo_relevant = true
 * ELSE seo_relevant = false
 */
function determineSEORelevance(evidence: EvidenceGraph): boolean {
  return evidence.has_head_metadata && evidence.has_open_graph
}

/**
 * Rule: Auth Required
 * IF auth_library_detected → auth_required = true
 * ELSE → false
 */
function determineAuthRequired(evidence: EvidenceGraph): boolean {
  return evidence.auth_library_detected || evidence.auth_usage_detected
}

/**
 * Rule: Statefulness
 * IF database OR global_state → stateful
 * ELSE → stateless
 */
function determineStatefulness(evidence: EvidenceGraph): 'stateless' | 'stateful' {
  if (evidence.has_database || evidence.has_global_state) {
    return 'stateful'
  }
  return 'stateless'
}

/**
 * Main rule engine
 * Applies all rules deterministically
 */
export function applyRules(evidence: EvidenceGraph): RuleResult {
  const reasoning: string[] = []
  
  const repository_type = determineRepositoryType(evidence)
  reasoning.push(`Repository type: ${repository_type} (backend: ${evidence.has_backend}, database: ${evidence.has_database}, static_export: ${evidence.has_static_export})`)
  
  const intent = determineIntent(evidence)
  reasoning.push(`Intent: ${intent} (checkout: ${evidence.has_checkout}, dashboard: ${evidence.has_dashboard}, seo+blog: ${evidence.has_seo_files && evidence.has_blog_structure})`)
  
  const complexity = determineComplexity(evidence)
  const complexityScore = evidence.number_of_routes + evidence.number_of_integrations + evidence.number_of_external_services
  reasoning.push(`Complexity: ${complexity} (score: ${complexityScore} = routes: ${evidence.number_of_routes} + integrations: ${evidence.number_of_integrations} + services: ${evidence.number_of_external_services})`)
  
  const statefulness = determineStatefulness(evidence)
  reasoning.push(`Statefulness: ${statefulness} (database: ${evidence.has_database}, global_state: ${evidence.has_global_state})`)
  
  const seo_relevant = determineSEORelevance(evidence)
  reasoning.push(`SEO relevant: ${seo_relevant} (head_metadata: ${evidence.has_head_metadata}, open_graph: ${evidence.has_open_graph})`)
  
  const auth_required = determineAuthRequired(evidence)
  reasoning.push(`Auth required: ${auth_required} (auth_library: ${evidence.auth_library_detected}, auth_usage: ${evidence.auth_usage_detected})`)
  
  return {
    repository_type,
    intent,
    complexity,
    statefulness,
    seo_relevant,
    auth_required,
    reasoning
  }
}

