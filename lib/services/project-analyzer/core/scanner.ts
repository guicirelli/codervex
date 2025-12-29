import { NormalizedProject } from './normalizer'

export interface ScanResult {
  languages: string[]
  frameworks: string[]
  entryPoints: string[]
  configFiles: string[]
  dependencies: Record<string, string>
  structure: {
    hasSrc: boolean
    hasPublic: boolean
    hasComponents: boolean
    hasPages: boolean
    hasServices: boolean
    hasControllers: boolean
    hasModels: boolean
  }
}

export function scanProject(normalized: NormalizedProject): ScanResult {
  const languages: string[] = []
  const frameworks: string[] = []
  const entryPoints: string[] = []
  const configFiles: string[] = []
  const dependencies: Record<string, string> = {}
  const structure = {
    hasSrc: false,
    hasPublic: false,
    hasComponents: false,
    hasPages: false,
    hasServices: false,
    hasControllers: false,
    hasModels: false
  }

  // Detect languages by extension
  const fileExtensions = new Set<string>()
  normalized.files.forEach(file => {
    const ext = file.substring(file.lastIndexOf('.'))
    if (ext) fileExtensions.add(ext.toLowerCase())
  })

  // Map extensions to languages
  const langMap: Record<string, string> = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'JavaScript (React)',
    '.tsx': 'TypeScript (React)',
    '.py': 'Python',
    '.java': 'Java',
    '.go': 'Go',
    '.rs': 'Rust',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.cs': 'C#',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.dart': 'Dart'
  }

  fileExtensions.forEach(ext => {
    if (langMap[ext]) {
      languages.push(langMap[ext])
    }
  })

  // Detect frameworks and configs
  normalized.files.forEach(file => {
    const lower = file.toLowerCase()
    
    // Frameworks
    if (lower.includes('next.config')) frameworks.push('Next.js')
    if (lower.includes('vite.config')) frameworks.push('Vite')
    if (lower.includes('webpack.config')) frameworks.push('Webpack')
    if (lower.includes('angular.json')) frameworks.push('Angular')
    if (lower.includes('vue.config')) frameworks.push('Vue.js')
    if (lower.includes('svelte.config')) frameworks.push('Svelte')
    if (lower.includes('pom.xml')) frameworks.push('Maven')
    if (lower.includes('build.gradle')) frameworks.push('Gradle')
    if (lower.includes('requirements.txt')) frameworks.push('Python (pip)')
    if (lower.includes('go.mod')) frameworks.push('Go Modules')
    if (lower.includes('cargo.toml')) frameworks.push('Cargo')
    
    // Entry points
    if (lower === 'index.js' || lower === 'index.ts' || 
        lower === 'main.js' || lower === 'main.ts' ||
        lower === 'app.jsx' || lower === 'app.tsx' ||
        lower === 'server.js' || lower === 'server.ts' ||
        lower.endsWith('/index.js') || lower.endsWith('/index.ts') ||
        lower.endsWith('/main.js') || lower.endsWith('/main.ts')) {
      entryPoints.push(file)
    }
    
    // Config files
    if (lower.includes('package.json') || 
        lower.includes('tsconfig.json') ||
        lower.includes('jsconfig.json') ||
        lower.includes('pom.xml') ||
        lower.includes('build.gradle') ||
        lower.includes('requirements.txt') ||
        lower.includes('go.mod') ||
        lower.includes('cargo.toml') ||
        lower.includes('composer.json') ||
        lower.includes('dockerfile') ||
        lower.includes('docker-compose')) {
      configFiles.push(file)
    }
  })

         // Read package.json for dependencies
         const packageJson = normalized.files.find(f => f.toLowerCase().includes('package.json'))
         if (packageJson && normalized.fileMap.has(packageJson)) {
           try {
             const content = normalized.fileMap.get(packageJson)!
             const pkg = JSON.parse(content)
             if (pkg.dependencies) {
               Object.assign(dependencies, pkg.dependencies)
             }
             if (pkg.devDependencies) {
               Object.assign(dependencies, pkg.devDependencies)
             }
           } catch {
             // Ignore if cannot parse
           }
         }

         // Analyze folder structure
         normalized.folders.forEach(folder => {
           const lower = folder.toLowerCase()
           if (lower.includes('src')) structure.hasSrc = true
           if (lower.includes('public')) structure.hasPublic = true
           if (lower.includes('component')) structure.hasComponents = true
           if (lower.includes('page')) structure.hasPages = true
           if (lower.includes('service')) structure.hasServices = true
           if (lower.includes('controller')) structure.hasControllers = true
           if (lower.includes('model')) structure.hasModels = true
         })

         // Remove duplicates
  return {
    languages: [...new Set(languages)],
    frameworks: [...new Set(frameworks)],
    entryPoints: [...new Set(entryPoints)],
    configFiles: [...new Set(configFiles)],
    dependencies,
    structure
  }
}

