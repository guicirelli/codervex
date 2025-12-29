/**
 * Project Classifier
 * Classifies projects based on structure and intent detection
 */

import { ProjectClassification, ProjectIntent, ProjectDomain, ProjectType, Complexity, Statefulness } from './blueprints'
import { ScanResult } from './scanner'
import { NormalizedProject } from './normalizer'

export function classifyProject(scan: ScanResult, normalized: NormalizedProject): ProjectClassification {
  // Detect intent
  const intent = detectIntent(scan, normalized)
  
  // Detect domain
  const domain = detectDomain(scan, normalized)
  
  // Detect project type
  const projectType = detectProjectType(scan, normalized)
  
  // Detect complexity
  const complexity = detectComplexity(scan, normalized)
  
  // Detect statefulness
  const statefulness = detectStatefulness(scan, normalized)
  
  // Detect auth requirement
  const authRequired = detectAuth(scan, normalized)
  
  // Detect SEO relevance
  const seoRelevant = detectSEORelevance(scan, normalized)
  
  return {
    intent,
    domain,
    projectType,
    complexity,
    statefulness,
    authRequired,
    seoRelevant
  }
}

function detectIntent(scan: ScanResult, normalized: NormalizedProject): ProjectIntent {
  // Check for automation/script patterns
  if (scan.frameworks.includes('Python (pip)') || 
      normalized.files.some(f => f.includes('script') || f.includes('bot'))) {
    return 'automate'
  }
  
  // Check for ecommerce patterns
  if (scan.dependencies['stripe'] || scan.dependencies['paypal'] || 
      normalized.folders.some(f => f.includes('cart') || f.includes('checkout'))) {
    return 'sell'
  }
  
  // Check for SaaS patterns
  if (scan.structure.hasServices || scan.structure.hasControllers || 
      normalized.folders.some(f => f.includes('api') || f.includes('service'))) {
    return 'operate'
  }
  
  // Check for content/blog patterns
  if (normalized.folders.some(f => f.includes('blog') || f.includes('post') || f.includes('article'))) {
    return 'inform'
  }
  
  // Check for landing page patterns
  if (normalized.files.some(f => f.includes('landing') || f.includes('hero')) ||
      scan.frameworks.includes('Next.js') && normalized.folders.length < 5) {
    return 'sell'
  }
  
  // Default
  return 'engage'
}

function detectDomain(scan: ScanResult, normalized: NormalizedProject): ProjectDomain {
  // Internal tools
  if (normalized.folders.some(f => f.includes('admin') || f.includes('internal'))) {
    return 'internal'
  }
  
  // API/Service
  if (scan.structure.hasControllers && !scan.structure.hasComponents) {
    return 'tool'
  }
  
  // Content
  if (normalized.folders.some(f => f.includes('content') || f.includes('blog'))) {
    return 'content'
  }
  
  // Product/Service
  if (scan.structure.hasComponents && scan.structure.hasPages) {
    return 'product'
  }
  
  return 'service'
}

function detectProjectType(scan: ScanResult, normalized: NormalizedProject): ProjectType {
  // API
  if (scan.structure.hasControllers && !scan.structure.hasComponents) {
    return 'api'
  }
  
  // Script
  if (normalized.files.length < 10 && 
      (scan.languages.includes('Python') || scan.languages.includes('JavaScript'))) {
    return 'script'
  }
  
  // Documentation
  if (normalized.folders.some(f => f.includes('docs') || f.includes('documentation')) ||
      scan.configFiles.some(f => f.includes('mkdocs') || f.includes('docusaurus'))) {
    return 'docs'
  }
  
  // Dashboard
  if (normalized.folders.some(f => f.includes('dashboard')) ||
      scan.structure.hasServices && scan.structure.hasComponents) {
    return 'dashboard'
  }
  
  // Ecommerce
  if (normalized.folders.some(f => f.includes('cart') || f.includes('checkout') || f.includes('product'))) {
    return 'ecommerce'
  }
  
  // Portfolio
  if (normalized.folders.some(f => f.includes('portfolio') || f.includes('project')) &&
      normalized.folders.length < 8) {
    return 'portfolio'
  }
  
  // Blog
  if (normalized.folders.some(f => f.includes('blog') || f.includes('post') || f.includes('article'))) {
    return 'blog'
  }
  
  // SaaS
  if (scan.structure.hasServices && scan.structure.hasControllers && scan.structure.hasComponents) {
    return 'saas'
  }
  
  // Landing (default for simple Next.js/React projects)
  if (scan.frameworks.includes('Next.js') || scan.frameworks.includes('React')) {
    return 'landing'
  }
  
  return 'landing'
}

function detectComplexity(scan: ScanResult, normalized: NormalizedProject): Complexity {
  const fileCount = normalized.files.length
  const folderCount = normalized.folders.length
  const dependencyCount = Object.keys(scan.dependencies).length
  
  // High complexity
  if (fileCount > 100 || folderCount > 20 || dependencyCount > 30) {
    return 'high'
  }
  
  // Low complexity
  if (fileCount < 20 || folderCount < 5 || dependencyCount < 5) {
    return 'low'
  }
  
  return 'medium'
}

function detectStatefulness(scan: ScanResult, normalized: NormalizedProject): Statefulness {
  // Check for realtime patterns
  if (scan.dependencies['socket.io'] || scan.dependencies['ws'] || 
      normalized.folders.some(f => f.includes('websocket') || f.includes('realtime'))) {
    return 'realtime'
  }
  
  // Check for dynamic patterns (API, database, state management)
  if (scan.structure.hasServices || scan.structure.hasControllers ||
      scan.dependencies['redux'] || scan.dependencies['zustand'] ||
      normalized.folders.some(f => f.includes('api') || f.includes('database'))) {
    return 'dynamic'
  }
  
  return 'static'
}

function detectAuth(scan: ScanResult, normalized: NormalizedProject): boolean {
  // Check for auth patterns
  if (scan.dependencies['next-auth'] || scan.dependencies['@clerk'] || 
      scan.dependencies['firebase'] || scan.dependencies['auth0'] ||
      normalized.folders.some(f => f.includes('auth') || f.includes('login') || f.includes('user'))) {
    return true
  }
  
  return false
}

function detectSEORelevance(scan: ScanResult, normalized: NormalizedProject): boolean {
  // SEO is relevant for content sites, landing pages, blogs
  if (normalized.folders.some(f => f.includes('blog') || f.includes('post') || f.includes('article'))) {
    return true
  }
  
  // Check for SEO-related dependencies
  if (scan.dependencies['next-seo'] || scan.dependencies['react-helmet'] ||
      normalized.files.some(f => f.includes('sitemap') || f.includes('robots'))) {
    return true
  }
  
  // Landing pages usually need SEO
  if (scan.frameworks.includes('Next.js') && normalized.folders.length < 8) {
    return true
  }
  
  return false
}

