/**
 * Scope Definition
 * Motor de escopo - O que É / NÃO É
 * Obrigatório em todo output
 * Blinda completamente o contexto
 */

import { EvidenceGraph } from './evidence-graph'
import { Blueprint } from './blueprints'

export interface ScopeDefinition {
  what_it_is: string[]
  what_it_does: string[]
  what_it_does_not_do: string[]
  excluded_concepts: string[]
}

/**
 * Generates scope definition based on evidence and blueprint
 * Pure deterministic rules, no inference
 */
export function generateScopeDefinition(
  evidence: EvidenceGraph,
  blueprint: Blueprint,
  repositoryType: 'frontend' | 'backend' | 'fullstack' | 'static'
): ScopeDefinition {
  const what_it_is: string[] = []
  const what_it_does: string[] = []
  const what_it_does_not_do: string[] = []
  const excluded_concepts: string[] = []
  
  // What it IS (based on evidence)
  if (repositoryType === 'static') {
    what_it_is.push('Static website')
    what_it_is.push('Client-side rendered application')
  } else if (repositoryType === 'frontend') {
    what_it_is.push('Frontend application')
    what_it_is.push('Client-side application')
  } else if (repositoryType === 'backend') {
    what_it_is.push('Backend service')
    what_it_is.push('Server-side application')
  } else {
    what_it_is.push('Full-stack application')
    what_it_is.push('Client and server application')
  }
  
  if (evidence.has_nextjs) {
    what_it_is.push('Next.js application')
  }
  if (evidence.has_react) {
    what_it_is.push('React-based application')
  }
  if (evidence.has_static_export) {
    what_it_is.push('Statically exported application')
  }
  if (evidence.has_blog_structure) {
    what_it_is.push('Content-focused website')
  }
  if (evidence.has_seo_files) {
    what_it_is.push('SEO-optimized website')
  }
  
  // What it DOES (based on capabilities detected)
  if (evidence.has_seo_files) {
    what_it_does.push('SEO optimization')
    what_it_does.push('Search engine indexing')
  }
  if (evidence.has_blog_structure) {
    what_it_does.push('Content publishing')
    what_it_does.push('Blog/article management')
  }
  if (evidence.has_dynamic_routes) {
    what_it_does.push('Dynamic routing')
  }
  if (evidence.has_cms) {
    what_it_does.push('Content management')
  }
  if (evidence.has_checkout) {
    what_it_does.push('E-commerce transactions')
    what_it_does.push('Payment processing')
  }
  if (evidence.has_dashboard) {
    what_it_does.push('Data visualization')
    what_it_does.push('User dashboard')
  }
  if (evidence.has_auth) {
    what_it_does.push('User authentication')
    what_it_does.push('User management')
  }
  if (evidence.has_state_management) {
    what_it_does.push('State management')
  }
  
  // What it DOES NOT DO (based on absence of evidence)
  if (!evidence.has_backend) {
    what_it_does_not_do.push('Backend business logic')
    what_it_does_not_do.push('Server-side processing')
    excluded_concepts.push('Backend APIs')
    excluded_concepts.push('Server-side rendering (beyond static generation)')
  }
  
  if (!evidence.has_database) {
    what_it_does_not_do.push('Database operations')
    what_it_does_not_do.push('Persistent data storage')
    excluded_concepts.push('Database queries')
    excluded_concepts.push('Data persistence')
  }
  
  if (!evidence.has_auth) {
    what_it_does_not_do.push('User authentication')
    what_it_does_not_do.push('User sessions')
    what_it_does_not_do.push('Protected routes')
    excluded_concepts.push('Authentication flows')
    excluded_concepts.push('User accounts')
    excluded_concepts.push('Login/logout')
  }
  
  if (!evidence.has_dashboard) {
    what_it_does_not_do.push('User dashboards')
    what_it_does_not_do.push('Admin panels')
    excluded_concepts.push('Dashboard UI')
    excluded_concepts.push('Admin interfaces')
  }
  
  if (!evidence.has_checkout) {
    what_it_does_not_do.push('E-commerce transactions')
    what_it_does_not_do.push('Payment processing')
    excluded_concepts.push('Checkout flows')
    excluded_concepts.push('Payment systems')
  }
  
  if (!evidence.has_state_management && !evidence.has_database) {
    what_it_does_not_do.push('Persistent user sessions')
    what_it_does_not_do.push('Global state management')
  }
  
  if (evidence.has_static_export) {
    what_it_does_not_do.push('Real-time features')
    what_it_does_not_do.push('Dynamic server-side rendering')
    excluded_concepts.push('WebSockets')
    excluded_concepts.push('Real-time updates')
  }
  
  if (!evidence.has_api_routes) {
    what_it_does_not_do.push('API endpoints')
    excluded_concepts.push('REST APIs')
    excluded_concepts.push('GraphQL')
  }
  
  // Blueprint-specific exclusions
  if (blueprint.output.noUI) {
    what_it_does_not_do.push('User interfaces')
    excluded_concepts.push('Frontend components')
  }
  
  if (blueprint.output.seoIrrelevant) {
    what_it_does_not_do.push('SEO optimization')
    excluded_concepts.push('Metadata management')
  }
  
  // Always exclude these (never assume)
  excluded_concepts.push('Microservices architecture')
  excluded_concepts.push('Serverless functions (unless explicitly detected)')
  excluded_concepts.push('Background jobs (unless explicitly detected)')
  excluded_concepts.push('Message queues (unless explicitly detected)')
  
  return {
    what_it_is,
    what_it_does,
    what_it_does_not_do,
    excluded_concepts: Array.from(new Set(excluded_concepts)) // Remove duplicates
  }
}

