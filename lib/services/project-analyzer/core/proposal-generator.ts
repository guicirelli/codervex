/**
 * Proposal Generator
 * Gera proposta central sem IA
 * Derivada exclusivamente de intent + blueprint + stack
 * Nunca marketing vazio, sempre descrição funcional
 */

import { EvidenceGraph } from './evidence-graph'
import { Blueprint } from './blueprints'
import { PrimaryIntent } from './intent-detector'
import { RuleResult } from './rule-engine'

export interface Proposal {
  core_value_proposition: string
  target_audience: 'developers' | 'end-users' | 'customers' | 'internal'
  technical_level: 'low' | 'medium' | 'high'
}

/**
 * Generates core value proposition deterministically
 * Based on intent + blueprint + technical stack
 */
export function generateProposal(
  evidence: EvidenceGraph,
  blueprint: Blueprint,
  intent: PrimaryIntent,
  ruleResult: RuleResult
): Proposal {
  let core_value_proposition = ''
  let target_audience: 'developers' | 'end-users' | 'customers' | 'internal' = 'end-users'
  let technical_level: 'low' | 'medium' | 'high' = 'medium'
  
  // Determine target audience
  if (blueprint.name === 'DocumentationBlueprint' || blueprint.name === 'APIServiceBlueprint') {
    target_audience = 'developers'
    technical_level = 'high'
  } else if (blueprint.name === 'InternalToolBlueprint') {
    target_audience = 'internal'
    technical_level = 'medium'
  } else if (blueprint.name === 'EcommerceBlueprint' || intent === 'CONVERT') {
    target_audience = 'customers'
    technical_level = 'low'
  } else {
    target_audience = 'end-users'
    technical_level = ruleResult.complexity === 'high' ? 'high' : ruleResult.complexity === 'low' ? 'low' : 'medium'
  }
  
  // Generate value proposition based on intent + blueprint + stack
  if (intent === 'INFORM') {
    if (evidence.has_blog_structure && evidence.has_seo_files) {
      core_value_proposition = `Deliver structured, indexable content using a ${ruleResult.statefulness} architecture, focused on discoverability, performance and clarity.`
    } else if (evidence.has_cms) {
      core_value_proposition = `Provide content management and delivery through a ${ruleResult.statefulness} system optimized for content creators and consumers.`
    } else {
      core_value_proposition = `Present information through a ${ruleResult.statefulness} architecture designed for clarity and accessibility.`
    }
  } else if (intent === 'PRESENT') {
    if (blueprint.name === 'PortfolioBlueprint') {
      // Portfolio-specific: Focus on what it says about the developer
      target_audience = 'developers' // Recruiters, hiring managers, technical reviewers
      technical_level = evidence.has_nextjs && evidence.has_typescript ? 'high' : 
                       evidence.has_react ? 'medium' : 'low'
      
      const stackSignals: string[] = []
      if (evidence.has_nextjs) stackSignals.push('Next.js')
      if (evidence.has_typescript) stackSignals.push('TypeScript')
      if (evidence.has_react) stackSignals.push('React')
      if (evidence.has_tailwind) stackSignals.push('Tailwind CSS')
      
      const stackInfo = stackSignals.length > 0 
        ? ` using ${stackSignals.join(', ')}`
        : ''
      
      core_value_proposition = `Position the developer as a competent ${evidence.has_nextjs ? 'frontend' : 'web'} professional through clear presentation of projects, code structure${stackInfo}, modern tooling and content clarity.`
    } else if (evidence.has_products && !evidence.has_checkout) {
      core_value_proposition = `Showcase products and services through a ${ruleResult.statefulness} presentation layer focused on visual appeal and information clarity.`
    } else {
      core_value_proposition = `Present value proposition through a ${ruleResult.statefulness} interface designed for immediate comprehension and engagement.`
    }
  } else if (intent === 'CONVERT') {
    if (evidence.has_checkout) {
      core_value_proposition = `Enable e-commerce transactions through a ${ruleResult.statefulness} platform focused on conversion, trust, and transaction completion.`
    } else {
      core_value_proposition = `Drive conversions through a ${ruleResult.statefulness} system optimized for lead capture, engagement, and action completion.`
    }
  } else if (intent === 'OPERATE') {
    if (evidence.has_dashboard && evidence.has_auth) {
      core_value_proposition = `Operate a ${ruleResult.statefulness} system with authenticated user workflows, data management, and interactive functionality.`
    } else if (evidence.has_backend && !evidence.has_dashboard) {
      core_value_proposition = `Provide backend functionality through a ${ruleResult.statefulness} service architecture focused on API delivery and business logic.`
    } else {
      core_value_proposition = `Deliver operational capabilities through a ${ruleResult.statefulness} application designed for user interaction and system management.`
    }
  }
  
  // Add technical details if relevant
  if (evidence.has_static_export) {
    core_value_proposition += ' Deployed as static assets for maximum performance and scalability.'
  } else if (evidence.has_nextjs && evidence.has_app_router) {
    core_value_proposition += ' Built with Next.js App Router for optimal performance and developer experience.'
  }
  
  return {
    core_value_proposition,
    target_audience,
    technical_level
  }
}

