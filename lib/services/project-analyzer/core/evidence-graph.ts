/**
 * Evidence Graph
 * Base lógica - tudo vira evidência, nunca opinião
 * Zero inferência, apenas fatos coletados
 */

import { ScanResult } from './scanner'
import { NormalizedProject } from './normalizer'
import { ProjectSignals } from './intent-detector'

export interface EvidenceGraph {
  // Framework & Stack
  has_nextjs: boolean
  has_react: boolean
  has_vue: boolean
  has_angular: boolean
  has_svelte: boolean
  has_pages_router: boolean
  has_app_router: boolean
  has_static_export: boolean
  
  // Architecture
  has_backend: boolean
  has_database: boolean
  has_api_routes: boolean
  has_server_components: boolean
  has_client_components: boolean
  
  // Auth
  has_auth: boolean
  auth_provider: string | null
  auth_library_detected: boolean
  auth_usage_detected: boolean
  
  // State & Data
  has_state_management: boolean
  state_library: string | null
  has_global_state: boolean
  has_local_storage: boolean
  
  // Content & CMS
  has_cms: boolean
  cms_type: string | null
  has_blog_structure: boolean
  has_content_folder: boolean
  has_markdown_files: boolean
  
  // SEO & Metadata
  has_seo_files: boolean
  has_head_metadata: boolean
  has_open_graph: boolean
  has_sitemap: boolean
  has_robots_txt: boolean
  
  // Routing
  navigation_model: 'one-page' | 'multi-page' | 'hybrid'
  has_dynamic_routes: boolean
  route_count: number
  
  // UI & Styling
  styling_framework: string | null
  has_tailwind: boolean
  has_css_modules: boolean
  has_styled_components: boolean
  
  // Deployment
  deployment_platform: string | null
  has_netlify_config: boolean
  has_vercel_config: boolean
  has_docker: boolean
  
  // E-commerce
  has_checkout: boolean
  has_cart: boolean
  has_products: boolean
  payment_provider: string | null
  
  // Dashboard & Admin
  has_dashboard: boolean
  has_admin_panel: boolean
  has_crud: boolean
  
  // Developer Tools
  has_typescript: boolean
  has_tests: boolean
  has_linting: boolean
  has_build_tools: boolean
  
  // Complexity Indicators
  number_of_routes: number
  number_of_integrations: number
  number_of_external_services: number
  dependency_count: number
}

/**
 * Builds evidence graph from scan results and signals
 * Pure facts, no interpretation
 */
export function buildEvidenceGraph(
  scan: ScanResult,
  normalized: NormalizedProject,
  signals: ProjectSignals
): EvidenceGraph {
  const files = normalized.files
  const folders = normalized.folders
  const deps = scan.dependencies
  
  // Framework detection
  const has_nextjs = scan.frameworks.includes('Next.js') || !!deps['next']
  const has_react = !!deps['react'] || scan.languages.some(l => l.includes('React'))
  const has_vue = !!deps['vue'] || scan.frameworks.includes('Vue.js')
  const has_angular = !!deps['angular'] || scan.frameworks.includes('Angular')
  const has_svelte = !!deps['svelte'] || scan.frameworks.includes('Svelte')
  
  // Router detection
  const has_pages_router = files.some(f => f.includes('pages/') && (f.includes('index') || f.includes('_app')))
  const has_app_router = files.some(f => f.includes('app/') && f.includes('page.'))
  
  // Check for static export in next.config
  let has_static_export = false
  const nextConfig = files.find(f => f.includes('next.config'))
  if (nextConfig && normalized.fileMap.has(nextConfig)) {
    const configContent = normalized.fileMap.get(nextConfig) || ''
    has_static_export = configContent.includes('output:') && 
      (configContent.includes('export') || configContent.includes('"export"'))
  }
  
  // Backend detection
  const has_backend = scan.structure.hasControllers || scan.structure.hasServices || 
    !!deps['express'] || !!deps['fastify'] || !!deps['koa']
  const has_database = !!deps['prisma'] || !!deps['mongoose'] || !!deps['typeorm'] || 
    !!deps['sequelize'] || files.some(f => f.includes('database') || f.includes('db'))
  const has_api_routes = files.some(f => f.includes('api/') || f.includes('routes/'))
  const has_server_components = has_app_router && files.some(f => f.includes('app/') && !f.includes('use client'))
  const has_client_components = files.some(f => f.includes('use client') || f.includes('client'))
  
  // Auth detection
  const auth_provider = deps['@clerk/nextjs'] || deps['@clerk/clerk-sdk-node'] ? 'clerk' :
    deps['next-auth'] ? 'next-auth' :
    deps['firebase'] || deps['firebase/auth'] ? 'firebase' :
    deps['auth0'] || deps['auth0-react'] ? 'auth0' : null
  const has_auth = !!auth_provider || signals.authLibPresent
  const auth_library_detected = signals.authLibPresent
  const auth_usage_detected = signals.authUsageDetected
  
  // State management
  const state_library = deps['redux'] ? 'redux' :
    deps['zustand'] ? 'zustand' :
    deps['recoil'] ? 'recoil' :
    deps['jotai'] ? 'jotai' :
    deps['mobx'] ? 'mobx' : null
  const has_state_management = !!state_library || signals.appState
  const has_global_state = has_state_management
  const has_local_storage = files.some(f => {
    const content = normalized.fileMap.get(f) || ''
    return content.includes('localStorage') || content.includes('sessionStorage')
  })
  
  // CMS detection
  const cms_type = deps['contentful'] ? 'contentful' :
    deps['@sanity/client'] || deps['sanity'] ? 'sanity' :
    deps['strapi'] ? 'strapi' :
    deps['ghost'] ? 'ghost' :
    deps['@prismicio/client'] ? 'prismic' : null
  const has_cms = !!cms_type || signals.hasBlogPosts
  const has_blog_structure = signals.hasBlogPosts || signals.hasEditorialFlow
  const has_content_folder = folders.some(f => f.includes('content') || f.includes('posts') || f.includes('blog'))
  const has_markdown_files = files.some(f => f.endsWith('.md') || f.endsWith('.mdx'))
  
  // SEO detection
  const has_seo_files = signals.seoHeavy || files.some(f => f.includes('sitemap') || f.includes('robots'))
  const has_head_metadata = !!(files.some(f => {
    const content = normalized.fileMap.get(f) || ''
    return content.includes('metadata') || content.includes('<head') || content.includes('Head')
  }) || deps['next-seo'] || deps['react-helmet'])
  const has_open_graph = !!(files.some(f => {
    const content = normalized.fileMap.get(f) || ''
    return content.includes('opengraph') || content.includes('og:')
  }) || deps['next-seo'] || deps['react-helmet'])
  const has_sitemap = files.some(f => f.includes('sitemap'))
  const has_robots_txt = files.some(f => f.includes('robots'))
  
  // Routing
  const navigation_model: 'one-page' | 'multi-page' | 'hybrid' = 
    signals.onePage ? 'one-page' :
    signals.dynamicRoutes ? 'hybrid' : 'multi-page'
  const has_dynamic_routes = signals.dynamicRoutes
  const route_count = signals.pageCount
  
  // Styling
  const has_tailwind = !!deps['tailwindcss'] || files.some(f => f.includes('tailwind.config'))
  const has_css_modules = files.some(f => f.endsWith('.module.css'))
  const has_styled_components = !!deps['styled-components']
  const styling_framework = has_tailwind ? 'tailwindcss' :
    has_styled_components ? 'styled-components' :
    has_css_modules ? 'css-modules' : null
  
  // Deployment
  const has_netlify_config = files.some(f => f.includes('netlify.toml') || f.includes('netlify'))
  const has_vercel_config = files.some(f => f.includes('vercel.json'))
  const has_docker = files.some(f => f.toLowerCase().includes('dockerfile') || f.includes('docker-compose'))
  const deployment_platform = has_netlify_config ? 'netlify' :
    has_vercel_config ? 'vercel' :
    has_docker ? 'docker' : null
  
  // E-commerce
  const has_checkout = signals.hasCheckout
  const has_cart = folders.some(f => f.includes('cart')) || files.some(f => f.includes('cart'))
  const has_products = folders.some(f => f.includes('product')) || files.some(f => f.includes('product'))
  const payment_provider = deps['stripe'] || deps['@stripe/stripe-js'] ? 'stripe' :
    deps['paypal'] ? 'paypal' : null
  
  // Dashboard
  const has_dashboard = signals.hasDashboardUI
  const has_admin_panel = folders.some(f => f.includes('admin')) || files.some(f => f.includes('admin'))
  const has_crud = folders.some(f => f.includes('crud')) || scan.structure.hasControllers
  
  // Developer tools
  const has_typescript = scan.languages.includes('TypeScript')
  const has_tests = !!deps['jest'] || !!deps['vitest'] || !!deps['@testing-library'] || 
    files.some(f => f.includes('test') || f.includes('spec'))
  const has_linting = !!deps['eslint'] || !!deps['prettier']
  const has_build_tools = !!deps['webpack'] || !!deps['vite'] || scan.frameworks.some(f => f.includes('Vite') || f.includes('Webpack'))
  
  // Complexity
  const number_of_routes = route_count
  const number_of_integrations = Object.keys(deps).filter(d => 
    d.includes('api') || d.includes('sdk') || d.includes('client') || d.includes('@')
  ).length
  const number_of_external_services = (auth_provider ? 1 : 0) + 
    (cms_type ? 1 : 0) + 
    (payment_provider ? 1 : 0) +
    (deployment_platform ? 1 : 0)
  const dependency_count = Object.keys(deps).length
  
  return {
    has_nextjs,
    has_react,
    has_vue,
    has_angular,
    has_svelte,
    has_pages_router,
    has_app_router,
    has_static_export,
    has_backend,
    has_database,
    has_api_routes,
    has_server_components,
    has_client_components,
    has_auth,
    auth_provider,
    auth_library_detected,
    auth_usage_detected,
    has_state_management,
    state_library,
    has_global_state,
    has_local_storage,
    has_cms,
    cms_type,
    has_blog_structure,
    has_content_folder,
    has_markdown_files,
    has_seo_files,
    has_head_metadata,
    has_open_graph,
    has_sitemap,
    has_robots_txt,
    navigation_model,
    has_dynamic_routes,
    route_count,
    styling_framework,
    has_tailwind,
    has_css_modules,
    has_styled_components,
    deployment_platform,
    has_netlify_config,
    has_vercel_config,
    has_docker,
    has_checkout,
    has_cart,
    has_products,
    payment_provider,
    has_dashboard,
    has_admin_panel,
    has_crud,
    has_typescript,
    has_tests,
    has_linting,
    has_build_tools,
    number_of_routes,
    number_of_integrations,
    number_of_external_services,
    dependency_count
  }
}

