/**
 * Intent Detection Engine
 * Determines project intent based on deterministic scoring
 */

import { ScanResult } from './scanner'
import { NormalizedProject } from './normalizer'

export type PrimaryIntent = 'INFORM' | 'PRESENT' | 'CONVERT' | 'OPERATE'

export interface ProjectSignals {
  repoName: string
  routes: string[]
  dynamicRoutes: boolean
  authLibPresent: boolean
  authUsageDetected: boolean
  hasPrimaryCTA: boolean
  hasDashboardUI: boolean
  hasEditorialFlow: boolean
  hasCheckout: boolean
  hasProjects: boolean
  hasBlogPosts: boolean
  pageCount: number
  contentMutationFrequency: 'low' | 'medium' | 'high'
  seoHeavy: boolean
  appState: boolean
  onePage: boolean
  personalIdentity: boolean
}

export interface IntentScores {
  INFORM: number
  PRESENT: number
  CONVERT: number
  OPERATE: number
}

export interface IntentResult {
  primaryIntent: PrimaryIntent
  secondaryIntent: PrimaryIntent | null
  scores: IntentScores
  confidence: number
}

/**
 * Collects all detectable signals from the project
 */
export function collectSignals(
  scan: ScanResult,
  normalized: NormalizedProject,
  repoName?: string
): ProjectSignals {
  const files = normalized.files
  const folders = normalized.folders
  
  // Detect routes
  const routes: string[] = []
  files.forEach(file => {
    if (file.includes('page.tsx') || file.includes('page.ts') || 
        file.includes('index.tsx') || file.includes('index.ts') ||
        file.includes('route.ts') || file.includes('route.tsx')) {
      const route = extractRoute(file)
      if (route) routes.push(route)
    }
  })
  
  // Detect dynamic routes
  const dynamicRoutes = files.some(f => 
    f.includes('[') && f.includes(']') && 
    (f.includes('page') || f.includes('route'))
  )
  
  // Detect auth
  const authLibPresent = !!(
    scan.dependencies['next-auth'] ||
    scan.dependencies['@clerk'] ||
    scan.dependencies['firebase'] ||
    scan.dependencies['auth0'] ||
    folders.some(f => f.includes('auth'))
  )
  
  const authUsageDetected = !!(
    files.some(f => f.includes('auth') && (f.includes('api') || f.includes('middleware'))) ||
    files.some(f => f.includes('login') || f.includes('signin') || f.includes('signup'))
  )
  
  // Detect CTA
  const hasPrimaryCTA = !!(
    files.some(f => f.includes('cta') || f.includes('button') || f.includes('call-to-action')) ||
    folders.some(f => f.includes('cta')) ||
    files.some(f => f.includes('contact') || f.includes('form'))
  )
  
  // Detect Dashboard UI
  const hasDashboardUI = !!(
    folders.some(f => f.includes('dashboard')) ||
    files.some(f => f.includes('dashboard')) ||
    scan.structure.hasServices && scan.structure.hasControllers
  )
  
  // Detect Editorial Flow
  const hasEditorialFlow = !!(
    dynamicRoutes &&
    (folders.some(f => f.includes('post') || f.includes('article') || f.includes('blog')) ||
     files.some(f => f.includes('post') || f.includes('article') || f.includes('blog'))) &&
    files.some(f => f.includes('slug') || f.includes('[id]') || f.includes('[slug]'))
  )
  
  // Detect Checkout
  const hasCheckout = !!(
    folders.some(f => f.includes('checkout') || f.includes('cart') || f.includes('payment')) ||
    files.some(f => f.includes('checkout') || f.includes('cart') || f.includes('stripe') || f.includes('paypal'))
  )
  
  // Detect Projects
  const hasProjects = !!(
    folders.some(f => f.includes('project') || f.includes('portfolio') || f.includes('work')) ||
    files.some(f => f.includes('project') || f.includes('portfolio'))
  )
  
  // Detect Blog Posts
  const hasBlogPosts = !!(
    folders.some(f => f.includes('post') || f.includes('article') || f.includes('blog')) &&
    files.some(f => f.includes('md') || f.includes('mdx') || f.includes('content'))
  )
  
  // Page count
  const pageCount = routes.length || 
    (files.filter(f => f.includes('page.') || f.includes('index.')).length)
  
  // Content mutation frequency
  let contentMutationFrequency: 'low' | 'medium' | 'high' = 'low'
  if (hasEditorialFlow && hasBlogPosts) {
    contentMutationFrequency = 'high'
  } else if (hasBlogPosts || folders.some(f => f.includes('content'))) {
    contentMutationFrequency = 'medium'
  }
  
  // SEO heavy (detected by dependencies/config, not just editorial flow)
  const seoHeavy = !!(
    scan.dependencies['next-seo'] ||
    scan.dependencies['react-helmet'] ||
    files.some(f => f.includes('sitemap') || f.includes('robots') || f.includes('metadata'))
  )
  
  // App state
  const appState = !!(
    scan.dependencies['redux'] ||
    scan.dependencies['zustand'] ||
    scan.dependencies['recoil'] ||
    folders.some(f => f.includes('store') || f.includes('state'))
  )
  
  // One page
  const onePage = pageCount <= 3 && !dynamicRoutes
  
  // Personal identity
  const personalIdentity = !!(
    repoName?.toLowerCase().includes('portfolio') ||
    repoName?.toLowerCase().includes('personal') ||
    repoName?.toLowerCase().includes('landing') ||
    folders.some(f => f.includes('about') || f.includes('bio')) ||
    files.some(f => f.includes('about') || f.includes('bio'))
  )
  
  return {
    repoName: repoName || 'unknown',
    routes,
    dynamicRoutes,
    authLibPresent,
    authUsageDetected,
    hasPrimaryCTA,
    hasDashboardUI,
    hasEditorialFlow,
    hasCheckout,
    hasProjects,
    hasBlogPosts,
    pageCount,
    contentMutationFrequency,
    seoHeavy,
    appState,
    onePage,
    personalIdentity
  }
}

/**
 * Calculates intent scores based on signals
 * Following deterministic scoring matrix
 */
export function calculateIntentScores(signals: ProjectSignals): IntentScores {
  const scores: IntentScores = {
    INFORM: 0,
    PRESENT: 0,
    CONVERT: 0,
    OPERATE: 0
  }
  
  // INFORM scoring (exact matrix from spec)
  if (signals.hasBlogPosts) scores.INFORM += 3  // hasBlogStructure
  if (signals.seoHeavy) scores.INFORM += 3       // seoConfigurationDetected
  if (signals.dynamicRoutes) scores.INFORM += 1 // hasDynamicRoutes
  
  // PRESENT scoring (exact matrix from spec)
  if (signals.onePage) scores.PRESENT += 2
  if (signals.seoHeavy) scores.PRESENT += 1     // seoConfigurationDetected
  if (signals.hasPrimaryCTA) scores.PRESENT += 1
  if (signals.personalIdentity) scores.PRESENT += 2  // bonus for personal identity
  if (signals.hasProjects) scores.PRESENT += 2  // bonus for projects
  
  // CONVERT scoring (exact matrix from spec)
  if (signals.onePage) scores.CONVERT += 2
  if (signals.hasPrimaryCTA) scores.CONVERT += 3
  if (signals.hasCheckout) scores.CONVERT += 4
  
  // OPERATE scoring (exact matrix from spec)
  if (signals.authLibPresent) scores.OPERATE += 1  // hasAuthLibrary
  if (signals.authUsageDetected) scores.OPERATE += 3
  if (signals.hasDashboardUI) scores.OPERATE += 4
  if (signals.appState) scores.OPERATE += 2  // bonus for app state
  if (signals.dynamicRoutes) scores.OPERATE += 1
  
  return scores
}

/**
 * Determines primary and secondary intent from scores
 * FIXED: Priority rule only applies on tie (within 1 point)
 * Score dominance takes precedence over priority
 */
export function determineIntent(scores: IntentScores): IntentResult {
  // Sort by score first
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]) as [PrimaryIntent, number][]
  
  const primaryScore = sorted[0][1]
  const secondaryScore = sorted[1]?.[1] || 0
  
  // FIXED: Priority only applies on tie (within 1 point)
  let primaryIntent: PrimaryIntent
  let secondaryIntent: PrimaryIntent | null = null
  
  if (primaryScore - secondaryScore > 1) {
    // Clear winner - no priority needed
    primaryIntent = sorted[0][0]
    // Secondary intent only if close to primary (within 3 points) and score > 0
    if (primaryScore - secondaryScore < 3 && secondaryScore > 0) {
      secondaryIntent = sorted[1][0]
    }
  } else {
    // Tie (within 1 point) - apply priority rule
    const priority: Record<PrimaryIntent, number> = {
      OPERATE: 4,
      CONVERT: 3,
      PRESENT: 2,
      INFORM: 1
    }
    
    // Get all intents within 1 point of primary
    const tied = sorted.filter(([, score]) => Math.abs(score - primaryScore) <= 1)
    
    // Sort by priority
    const winner = tied.sort((a, b) => priority[b[0]] - priority[a[0]])[0]
    
    primaryIntent = winner[0]
    secondaryIntent = tied.length > 1 && tied[1][1] > 0 ? tied[1][0] : null
  }
  
  // IMPROVED: Better confidence calculation
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const scoreDominance = totalScore > 0 ? primaryScore / totalScore : 0.5
  const gapDominance = sorted.length > 1 
    ? Math.min((primaryScore - secondaryScore) / Math.max(primaryScore, 1), 1)
    : 1
  
  // Combined confidence: score dominance (60%) + gap dominance (40%)
  const confidence = Math.min(
    (scoreDominance * 0.6) + (gapDominance * 0.4),
    0.95
  )
  
  return {
    primaryIntent,
    secondaryIntent,
    scores,
    confidence
  }
}

/**
 * Main function to detect intent
 */
export function detectIntent(
  scan: ScanResult,
  normalized: NormalizedProject,
  repoName?: string
): IntentResult {
  const signals = collectSignals(scan, normalized, repoName)
  const scores = calculateIntentScores(signals)
  return determineIntent(scores)
}

function extractRoute(file: string): string | null {
  // Extract route from file path
  const match = file.match(/(?:app|pages|src)\/([^\/]+)/)
  if (match) return match[1]
  
  // Check for index files
  if (file.includes('index')) {
    const dirMatch = file.match(/(?:app|pages|src)\/([^\/]+)\/index/)
    if (dirMatch) return dirMatch[1]
    return 'index'
  }
  
  return null
}

