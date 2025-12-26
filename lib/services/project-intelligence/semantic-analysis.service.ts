/**
 * CAMADA 2: ANÁLISE SEMÂNTICA DE CÓDIGO
 * 
 * Entende padrões, responsabilidades e relações no código.
 * Vai além da leitura superficial.
 */

import { NormalizedProject } from './ingestion.service'

export interface SemanticAnalysis {
  patterns: {
    architectural: string[]
    design: string[]
    stateManagement: string[]
    dataFlow: string[]
  }
  responsibilities: {
    pages: Record<string, string[]>
    components: Record<string, string[]>
    services: Record<string, string[]>
  }
  relationships: {
    imports: Record<string, string[]>
    dependencies: Record<string, string[]>
    dataFlow: Array<{ from: string; to: string; type: string }>
  }
  flows: {
    authentication: string[]
    dataFetching: string[]
    stateUpdates: string[]
    navigation: string[]
  }
  quality: {
    codeOrganization: 'excellent' | 'good' | 'fair' | 'poor'
    separationOfConcerns: 'excellent' | 'good' | 'fair' | 'poor'
    reusability: 'excellent' | 'good' | 'fair' | 'poor'
    maintainability: 'excellent' | 'good' | 'fair' | 'poor'
  }
}

export async function analyzeSemantics(
  normalizedProject: NormalizedProject,
  fileMap: Map<string, string>
): Promise<SemanticAnalysis> {
  const patterns = detectPatterns(fileMap)
  const responsibilities = mapResponsibilities(fileMap, normalizedProject)
  const relationships = mapRelationships(fileMap)
  const flows = detectFlows(fileMap, normalizedProject)
  const quality = assessQuality(fileMap, normalizedProject, patterns, responsibilities)

  return {
    patterns,
    responsibilities,
    relationships,
    flows,
    quality,
  }
}

function detectPatterns(fileMap: Map<string, string>): SemanticAnalysis['patterns'] {
  const allContent = Array.from(fileMap.values()).join('\n')
  const patterns = {
    architectural: [] as string[],
    design: [] as string[],
    stateManagement: [] as string[],
    dataFlow: [] as string[],
  }

  // Architectural patterns
  if (allContent.includes('useContext') || allContent.includes('createContext')) {
    patterns.architectural.push('Context API')
  }
  if (allContent.includes('Provider') && allContent.includes('Context')) {
    patterns.architectural.push('Provider Pattern')
  }
  if (allContent.includes('getServerSideProps') || allContent.includes('getStaticProps')) {
    patterns.architectural.push('SSR/SSG')
  }
  if (allContent.includes('useQuery') || allContent.includes('useMutation')) {
    patterns.architectural.push('React Query')
  }
  if (allContent.includes('createSlice') || allContent.includes('configureStore')) {
    patterns.architectural.push('Redux Toolkit')
  }

  // Design patterns
  if (allContent.includes('useMemo') || allContent.includes('useCallback')) {
    patterns.design.push('Memoization')
  }
  if (allContent.includes('forwardRef')) {
    patterns.design.push('Ref Forwarding')
  }
  if (allContent.includes('custom hook') || allContent.match(/use[A-Z]\w+/g)) {
    patterns.design.push('Custom Hooks')
  }
  if (allContent.includes('Higher Order Component') || allContent.includes('HOC')) {
    patterns.design.push('HOC Pattern')
  }
  if (allContent.includes('render props')) {
    patterns.design.push('Render Props')
  }

  // State management
  if (allContent.includes('useState')) {
    patterns.stateManagement.push('Local State')
  }
  if (allContent.includes('useReducer')) {
    patterns.stateManagement.push('Reducer Pattern')
  }
  if (allContent.includes('Zustand') || allContent.includes('create(')) {
    patterns.stateManagement.push('Zustand')
  }
  if (allContent.includes('Recoil')) {
    patterns.stateManagement.push('Recoil')
  }
  if (allContent.includes('Jotai')) {
    patterns.stateManagement.push('Jotai')
  }

  // Data flow
  if (allContent.includes('fetch(') || allContent.includes('axios')) {
    patterns.dataFlow.push('REST API')
  }
  if (allContent.includes('useQuery') || allContent.includes('useMutation')) {
    patterns.dataFlow.push('React Query')
  }
  if (allContent.includes('graphql') || allContent.includes('gql`')) {
    patterns.dataFlow.push('GraphQL')
  }
  if (allContent.includes('socket') || allContent.includes('websocket')) {
    patterns.dataFlow.push('WebSocket')
  }

  return patterns
}

function mapResponsibilities(
  fileMap: Map<string, string>,
  project: NormalizedProject
): SemanticAnalysis['responsibilities'] {
  const responsibilities: SemanticAnalysis['responsibilities'] = {
    pages: {},
    components: {},
    services: {},
  }

  for (const [path, content] of fileMap.entries()) {
    const lowerPath = path.toLowerCase()
    const lowerContent = content.toLowerCase()

    // Page responsibilities
    if (project.structure.pages.some(p => p === path)) {
      const pageResponsibilities: string[] = []
      if (lowerContent.includes('auth') || lowerContent.includes('login')) pageResponsibilities.push('Authentication')
      if (lowerContent.includes('form') || lowerContent.includes('submit')) pageResponsibilities.push('Form Handling')
      if (lowerContent.includes('fetch') || lowerContent.includes('api')) pageResponsibilities.push('Data Fetching')
      if (lowerContent.includes('redirect') || lowerContent.includes('router')) pageResponsibilities.push('Navigation')
      responsibilities.pages[path] = pageResponsibilities
    }

    // Component responsibilities
    if (project.structure.components.some(c => c === path)) {
      const componentResponsibilities: string[] = []
      if (lowerContent.includes('props') || lowerContent.includes('interface')) {
        componentResponsibilities.push('UI Rendering')
      }
      if (lowerContent.includes('onclick') || lowerContent.includes('onchange')) {
        componentResponsibilities.push('Event Handling')
      }
      if (lowerContent.includes('usestate') || lowerContent.includes('usereducer')) {
        componentResponsibilities.push('Local State')
      }
      if (lowerContent.includes('useeffect')) {
        componentResponsibilities.push('Side Effects')
      }
      responsibilities.components[path] = componentResponsibilities
    }

    // Service responsibilities
    if (project.structure.services.some(s => s === path)) {
      const serviceResponsibilities: string[] = []
      if (lowerContent.includes('api') || lowerContent.includes('fetch')) {
        serviceResponsibilities.push('API Communication')
      }
      if (lowerContent.includes('database') || lowerContent.includes('db')) {
        serviceResponsibilities.push('Data Access')
      }
      if (lowerContent.includes('validation') || lowerContent.includes('validate')) {
        serviceResponsibilities.push('Validation')
      }
      if (lowerContent.includes('transform') || lowerContent.includes('map')) {
        serviceResponsibilities.push('Data Transformation')
      }
      responsibilities.services[path] = serviceResponsibilities
    }
  }

  return responsibilities
}

function mapRelationships(fileMap: Map<string, string>): SemanticAnalysis['relationships'] {
  const imports: Record<string, string[]> = {}
  const dependencies: Record<string, string[]> = {}
  const dataFlow: Array<{ from: string; to: string; type: string }> = []

  const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g
  const requireRegex = /require\(['"](.+?)['"]\)/g

  for (const [path, content] of fileMap.entries()) {
    const fileImports: string[] = []
    
    // Extract imports
    let match
    while ((match = importRegex.exec(content)) !== null) {
      fileImports.push(match[1])
    }
    while ((match = requireRegex.exec(content)) !== null) {
      fileImports.push(match[1])
    }

    imports[path] = fileImports

    // Map dependencies
    for (const imp of fileImports) {
      if (!dependencies[imp]) {
        dependencies[imp] = []
      }
      dependencies[imp].push(path)
    }

    // Detect data flow (simplified)
    if (content.includes('props') || content.includes('useContext')) {
      dataFlow.push({ from: 'parent', to: path, type: 'props' })
    }
    if (content.includes('fetch') || content.includes('api')) {
      dataFlow.push({ from: path, to: 'external', type: 'api' })
    }
  }

  return { imports, dependencies, dataFlow }
}

function detectFlows(
  fileMap: Map<string, string>,
  project: NormalizedProject
): SemanticAnalysis['flows'] {
  const allContent = Array.from(fileMap.values()).join('\n').toLowerCase()
  const flows: SemanticAnalysis['flows'] = {
    authentication: [],
    dataFetching: [],
    stateUpdates: [],
    navigation: [],
  }

  // Authentication flow
  if (allContent.includes('login') || allContent.includes('signin')) {
    flows.authentication.push('Login')
  }
  if (allContent.includes('logout') || allContent.includes('signout')) {
    flows.authentication.push('Logout')
  }
  if (allContent.includes('register') || allContent.includes('signup')) {
    flows.authentication.push('Registration')
  }
  if (allContent.includes('token') || allContent.includes('jwt')) {
    flows.authentication.push('Token Management')
  }

  // Data fetching flow
  if (allContent.includes('useeffect') && allContent.includes('fetch')) {
    flows.dataFetching.push('useEffect + Fetch')
  }
  if (allContent.includes('usequery') || allContent.includes('usemutation')) {
    flows.dataFetching.push('React Query')
  }
  if (allContent.includes('swr')) {
    flows.dataFetching.push('SWR')
  }

  // State updates
  if (allContent.includes('setstate') || allContent.includes('usestate')) {
    flows.stateUpdates.push('useState')
  }
  if (allContent.includes('dispatch') || allContent.includes('usereducer')) {
    flows.stateUpdates.push('useReducer')
  }
  if (allContent.includes('zustand') || allContent.includes('create(')) {
    flows.stateUpdates.push('Zustand')
  }

  // Navigation
  if (allContent.includes('router.push') || allContent.includes('navigate')) {
    flows.navigation.push('Programmatic Navigation')
  }
  if (allContent.includes('link') || allContent.includes('<a')) {
    flows.navigation.push('Link Navigation')
  }

  return flows
}

function assessQuality(
  fileMap: Map<string, string>,
  project: NormalizedProject,
  patterns: SemanticAnalysis['patterns'],
  responsibilities: SemanticAnalysis['responsibilities']
): SemanticAnalysis['quality'] {
  let codeOrganization = 0
  let separationOfConcerns = 0
  let reusability = 0
  let maintainability = 0

  // Code organization
  if (project.structure.pages.length > 0) codeOrganization += 1
  if (project.structure.components.length > 0) codeOrganization += 1
  if (project.structure.services.length > 0) codeOrganization += 1
  if (project.structure.utils.length > 0) codeOrganization += 1

  // Separation of concerns
  const hasServices = project.structure.services.length > 0
  const hasHooks = project.structure.hooks.length > 0
  const hasUtils = project.structure.utils.length > 0
  if (hasServices) separationOfConcerns += 1
  if (hasHooks) separationOfConcerns += 1
  if (hasUtils) separationOfConcerns += 1
  if (patterns.design.includes('Custom Hooks')) separationOfConcerns += 1

  // Reusability
  if (project.structure.components.length > 5) reusability += 1
  if (patterns.design.includes('Custom Hooks')) reusability += 1
  if (Object.keys(responsibilities.components).length > 0) reusability += 1

  // Maintainability
  if (project.maturity === 'mature') maintainability += 2
  if (project.complexity !== 'high') maintainability += 1
  if (patterns.architectural.length > 0) maintainability += 1

  const toQuality = (score: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (score >= 3) return 'excellent'
    if (score >= 2) return 'good'
    if (score >= 1) return 'fair'
    return 'poor'
  }

  return {
    codeOrganization: toQuality(codeOrganization),
    separationOfConcerns: toQuality(separationOfConcerns),
    reusability: toQuality(reusability),
    maintainability: toQuality(maintainability),
  }
}

