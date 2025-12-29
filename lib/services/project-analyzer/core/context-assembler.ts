/**
 * Context Assembler
 * Monta o output canônico
 * Produto final estruturado
 */

import { CanonicalContext } from './canonical-schema'
import { EvidenceGraph } from './evidence-graph'
import { RuleResult } from './rule-engine'
import { Blueprint } from './blueprints'
import { ScopeDefinition } from './scope-definition'
import { Proposal } from './proposal-generator'
import { AnalysisResult } from './analyzer'
import { ScanResult } from './scanner'
import { NormalizedProject } from './normalizer'

export interface AssemblerInput {
  evidence: EvidenceGraph
  ruleResult: RuleResult
  blueprint: Blueprint
  scope: ScopeDefinition
  proposal: Proposal
  analysis: AnalysisResult
  scan: ScanResult
  normalized: NormalizedProject
  repoName?: string
  confidence: number
}

/**
 * Assembles canonical context from all inputs
 * Output canônico, sempre igual
 */
export function assembleContext(input: AssemblerInput): CanonicalContext {
  const { evidence, ruleResult, blueprint, scope, proposal, analysis, scan, confidence, repoName } = input
  
  // Determine confidence level
  let confidence_level: 'high' | 'medium' | 'low' = 'medium'
  if (confidence >= 0.8) {
    confidence_level = 'high'
  } else if (confidence < 0.6) {
    confidence_level = 'low'
  }
  
  // Extract framework version
  let frameworkVersion: string | null = null
  if (evidence.has_nextjs && scan.dependencies['next']) {
    frameworkVersion = scan.dependencies['next']
  } else if (evidence.has_react && scan.dependencies['react']) {
    frameworkVersion = scan.dependencies['react']
  }
  
  // Build technical stack
  const languages: string[] = []
  if (evidence.has_typescript) languages.push('TypeScript')
  if (scan.languages.includes('JavaScript')) languages.push('JavaScript')
  scan.languages.forEach(lang => {
    if (!languages.includes(lang) && !lang.includes('React')) {
      languages.push(lang)
    }
  })
  
  const styling: string[] = []
  if (evidence.has_tailwind) styling.push('Tailwind CSS')
  if (evidence.has_css_modules) styling.push('CSS Modules')
  if (evidence.has_styled_components) styling.push('Styled Components')
  
  const ui_libraries: string[] = []
  if (scan.dependencies['@radix-ui']) ui_libraries.push('Radix UI')
  if (scan.dependencies['@headlessui']) ui_libraries.push('Headless UI')
  if (scan.dependencies['material-ui'] || scan.dependencies['@mui']) ui_libraries.push('Material UI')
  if (scan.dependencies['antd']) ui_libraries.push('Ant Design')
  
  const animation: string[] = []
  if (scan.dependencies['framer-motion']) animation.push('Framer Motion')
  if (scan.dependencies['gsap']) animation.push('GSAP')
  if (scan.dependencies['react-spring']) animation.push('React Spring')
  
  const state_management: string[] = []
  if (evidence.state_library) {
    state_management.push(evidence.state_library)
  }
  
  // Build capabilities
  const capabilities: string[] = []
  if (evidence.has_seo_files) capabilities.push('SEO-optimized pages')
  if (evidence.has_blog_structure) capabilities.push('Content publishing')
  if (evidence.has_dynamic_routes) capabilities.push('Dynamic routing')
  if (evidence.has_cms) capabilities.push('Content management')
  if (evidence.has_checkout) capabilities.push('E-commerce transactions')
  if (evidence.has_dashboard) capabilities.push('Data visualization')
  if (evidence.has_auth) capabilities.push('User authentication')
  if (evidence.has_state_management) capabilities.push('State management')
  if (scan.dependencies['next-intl'] || scan.dependencies['react-i18next'] || scan.dependencies['i18n']) {
    capabilities.push('Internationalization')
  }
  if (evidence.has_static_export) capabilities.push('Static site generation')
  if (evidence.has_app_router) capabilities.push('Server components')
  
  // Build limitations
  const limitations: string[] = []
  if (!evidence.has_backend) limitations.push('No backend logic')
  if (!evidence.has_database) limitations.push('No persistent data storage')
  if (!evidence.has_auth) limitations.push('No user authentication')
  if (evidence.has_static_export) limitations.push('No real-time features')
  if (!evidence.has_api_routes) limitations.push('No API endpoints')
  
  // Build risk flags
  const risk_flags: string[] = []
  if (ruleResult.complexity === 'high' && !evidence.has_tests) {
    risk_flags.push('High complexity without test coverage')
  }
  if (evidence.has_auth && !evidence.auth_usage_detected) {
    risk_flags.push('Auth library present but not actively used')
  }
  if (evidence.has_database && !evidence.has_backend) {
    risk_flags.push('Database detected without backend infrastructure')
  }
  if (evidence.has_checkout && !evidence.payment_provider) {
    risk_flags.push('Checkout flow without payment provider detected')
  }
  
  return {
    engine: {
      name: 'Codebase Context Engine',
      version: '1.0.0',
      mode: 'deterministic',
      confidence_level: confidence_level,
      analysis_type: 'static'
    },
    project: {
      name: repoName || 'unknown',
      repository_type: ruleResult.repository_type,
      blueprint: blueprint.name,
      intent: ruleResult.intent.toLowerCase() as 'inform' | 'present' | 'convert' | 'operate',
      complexity: ruleResult.complexity,
      statefulness: ruleResult.statefulness,
      seo_relevant: ruleResult.seo_relevant,
      auth_required: ruleResult.auth_required
    },
    audience: {
      primary: proposal.target_audience,
      technical_level: proposal.technical_level
    },
    proposal: {
      what_it_is: scope.what_it_is,
      what_it_does: scope.what_it_does,
      what_it_does_not_do: scope.what_it_does_not_do,
      core_value_proposition: proposal.core_value_proposition
    },
    technical_stack: {
      framework: {
        name: analysis.framework,
        version: frameworkVersion
      },
      language: languages,
      styling: styling,
      ui_libraries: ui_libraries,
      animation: animation,
      state_management: state_management,
      auth: evidence.has_auth ? {
        provider: evidence.auth_provider,
        library: evidence.auth_provider
      } : null,
      database: evidence.has_database ? {
        name: scan.dependencies['prisma'] ? 'Prisma' :
          scan.dependencies['mongoose'] ? 'MongoDB' :
          scan.dependencies['typeorm'] ? 'TypeORM' : null,
        orm: scan.dependencies['prisma'] ? 'Prisma' :
          scan.dependencies['typeorm'] ? 'TypeORM' :
          scan.dependencies['sequelize'] ? 'Sequelize' : null
      } : null,
      cms: evidence.has_cms ? {
        name: evidence.cms_type,
        type: evidence.cms_type
      } : null,
      deployment: evidence.deployment_platform
    },
    structure: {
      routing_model: evidence.navigation_model,
      folder_structure: analysis.folderStructure,
      entry_point: analysis.entryPoint
    },
    capabilities: capabilities,
    limitations: limitations,
    excluded_concepts: scope.excluded_concepts,
    risk_flags: risk_flags,
    source: {
      method: 'static-analysis',
      confidence: confidence_level
    }
  }
}

