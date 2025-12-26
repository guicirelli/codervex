import JSZip from 'jszip'

export interface ProjectAnalysis {
  stack: string[]
  structure: string[]
  components: string[]
  pages: string[]
  functionalities: string[]
  dependencies: Record<string, string>
  architecture?: string
  styling?: string[]
}

export async function analyzeFiles(files: File[]): Promise<ProjectAnalysis> {
  const analysis: ProjectAnalysis = {
    stack: [],
    structure: [],
    components: [],
    pages: [],
    functionalities: [],
    dependencies: {},
    architecture: undefined,
    styling: [],
  }

  const stackSet = new Set<string>()
  const structureSet = new Set<string>()
  const componentsSet = new Set<string>()
  const pagesSet = new Set<string>()
  const functionalitiesSet = new Set<string>()
  const stylingSet = new Set<string>()
  const dependenciesMap: Record<string, string> = {}

  let packageJsonContent = ''
  let hasAppRouter = false
  let hasPagesRouter = false

  for (const file of files) {
    const fileName = file.name.toLowerCase()
    let content = ''
    
    try {
      content = await file.text()
    } catch (e) {
      // Ignorar arquivos binários
      continue
    }

    // Detectar stack tecnológica do package.json
    if (fileName.includes('package.json')) {
      packageJsonContent = content
      try {
        const pkg = JSON.parse(content)
        
        // Analisar dependências
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
        
        Object.keys(allDeps).forEach(dep => {
          const depLower = dep.toLowerCase()
          
          // Framework principal
          if (depLower.includes('next')) {
            stackSet.add('Next.js')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('react')) {
            stackSet.add('React')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('vue')) {
            stackSet.add('Vue.js')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('angular')) {
            stackSet.add('Angular')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('svelte')) {
            stackSet.add('Svelte')
            dependenciesMap[dep] = allDeps[dep]
          }
          
          // Linguagem
          if (depLower.includes('typescript')) {
            stackSet.add('TypeScript')
            dependenciesMap[dep] = allDeps[dep]
          }
          
          // Estilização
          if (depLower.includes('tailwind')) {
            stackSet.add('Tailwind CSS')
            stylingSet.add('Tailwind CSS')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('styled-components')) {
            stackSet.add('Styled Components')
            stylingSet.add('Styled Components')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('emotion')) {
            stackSet.add('Emotion')
            stylingSet.add('Emotion')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('sass') || depLower.includes('scss')) {
            stylingSet.add('SASS/SCSS')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('less')) {
            stylingSet.add('Less')
            dependenciesMap[dep] = allDeps[dep]
          }
          
          // Banco de dados
          if (depLower.includes('prisma')) {
            stackSet.add('Prisma')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('mongoose') || depLower.includes('mongodb')) {
            stackSet.add('MongoDB')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('postgres') || depLower.includes('pg')) {
            stackSet.add('PostgreSQL')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('mysql')) {
            stackSet.add('MySQL')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('sqlite')) {
            stackSet.add('SQLite')
            dependenciesMap[dep] = allDeps[dep]
          }
          
          // Autenticação
          if (depLower.includes('next-auth') || depLower.includes('nextauth')) {
            stackSet.add('NextAuth.js')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('auth0')) {
            stackSet.add('Auth0')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('firebase-auth') || depLower.includes('firebase')) {
            stackSet.add('Firebase')
            dependenciesMap[dep] = allDeps[dep]
          }
          
          // Outras bibliotecas importantes
          if (depLower.includes('zustand') || depLower.includes('redux') || depLower.includes('mobx')) {
            stackSet.add('State Management')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('axios') || depLower.includes('fetch')) {
            stackSet.add('HTTP Client')
            dependenciesMap[dep] = allDeps[dep]
          }
          if (depLower.includes('stripe')) {
            stackSet.add('Stripe')
            dependenciesMap[dep] = allDeps[dep]
          }
        })
      } catch (e) {
        // Ignorar erros de parsing
      }
    }

    // Detectar estrutura de pastas
    const pathParts = file.name.split('/')
    if (pathParts.length > 1) {
      const rootFolder = pathParts[0]
      structureSet.add(rootFolder)
      
      // Detectar App Router vs Pages Router
      if (rootFolder === 'app' || file.name.includes('/app/')) {
        hasAppRouter = true
      }
      if (rootFolder === 'pages' || file.name.includes('/pages/')) {
        hasPagesRouter = true
      }
    }

    // Detectar componentes React/Vue
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx') || 
        fileName.endsWith('.vue') || fileName.includes('component')) {
      const componentName = file.name.split('/').pop()?.replace(/\.(tsx|jsx|vue)$/, '') || ''
      if (componentName && componentName[0] === componentName[0].toUpperCase()) {
        componentsSet.add(componentName)
      }
    }

    // Detectar páginas/rotas
    if (fileName.includes('page.') || fileName.includes('route.') || 
        fileName.includes('index.') ||
        file.name.includes('/pages/') || file.name.includes('/app/')) {
      const pageName = file.name.split('/').pop()?.replace(/\.(tsx|jsx|ts|js|vue)$/, '') || ''
      if (pageName && pageName !== 'index') {
        pagesSet.add(pageName)
      }
    }

    // Análise mais profunda de funcionalidades
    const lowerContent = content.toLowerCase()
    
    // Autenticação
    if (lowerContent.includes('login') || lowerContent.includes('signin') || 
        lowerContent.includes('signup') || lowerContent.includes('register') ||
        lowerContent.includes('useauth') || lowerContent.includes('getsession')) {
      functionalitiesSet.add('Autenticação/Login')
    }
    
    // Dashboard/Admin
    if (lowerContent.includes('dashboard') || lowerContent.includes('admin') ||
        lowerContent.includes('panel')) {
      functionalitiesSet.add('Dashboard/Admin')
    }
    
    // CRUD
    if (lowerContent.includes('crud') || 
        (lowerContent.includes('create') && lowerContent.includes('delete')) ||
        lowerContent.includes('createpost') || lowerContent.includes('deletepost')) {
      functionalitiesSet.add('CRUD')
    }
    
    // Formulários
    if (lowerContent.includes('form') || lowerContent.includes('input') ||
        lowerContent.includes('textarea') || lowerContent.includes('select')) {
      functionalitiesSet.add('Formulários')
    }
    
    // API/Integração
    if (lowerContent.includes('api') || lowerContent.includes('fetch') || 
        lowerContent.includes('axios') || lowerContent.includes('usequery') ||
        lowerContent.includes('useswr')) {
      functionalitiesSet.add('Integração API')
    }
    
    // Pagamentos
    if (lowerContent.includes('payment') || lowerContent.includes('stripe') || 
        lowerContent.includes('pagamento') || lowerContent.includes('checkout')) {
      functionalitiesSet.add('Pagamentos')
    }
    
    // Blog/Posts
    if (lowerContent.includes('blog') || lowerContent.includes('post') ||
        lowerContent.includes('article')) {
      functionalitiesSet.add('Blog/Posts')
    }
    
    // E-commerce
    if (lowerContent.includes('cart') || lowerContent.includes('carrinho') ||
        lowerContent.includes('product') || lowerContent.includes('produto')) {
      functionalitiesSet.add('E-commerce')
    }
    
    // Busca
    if (lowerContent.includes('search') || lowerContent.includes('busca') ||
        lowerContent.includes('filter')) {
      functionalitiesSet.add('Busca/Filtros')
    }
    
    // Upload de arquivos
    if (lowerContent.includes('upload') || lowerContent.includes('file') ||
        lowerContent.includes('image')) {
      functionalitiesSet.add('Upload de Arquivos')
    }
    
    // Notificações
    if (lowerContent.includes('notification') || lowerContent.includes('toast') ||
        lowerContent.includes('alert')) {
      functionalitiesSet.add('Notificações')
    }
  }

  // Determinar arquitetura
  if (hasAppRouter && hasPagesRouter) {
    analysis.architecture = 'Next.js (App Router + Pages Router)'
  } else if (hasAppRouter) {
    analysis.architecture = 'Next.js (App Router)'
  } else if (hasPagesRouter) {
    analysis.architecture = 'Next.js (Pages Router)'
  } else if (stackSet.has('React')) {
    analysis.architecture = 'React SPA'
  } else if (stackSet.has('Vue.js')) {
    analysis.architecture = 'Vue.js'
  } else if (stackSet.has('Angular')) {
    analysis.architecture = 'Angular'
  }

  analysis.stack = Array.from(stackSet)
  analysis.structure = Array.from(structureSet)
  analysis.components = Array.from(componentsSet).slice(0, 30) // Aumentado para 30
  analysis.pages = Array.from(pagesSet).slice(0, 30)
  analysis.functionalities = Array.from(functionalitiesSet)
  analysis.styling = Array.from(stylingSet)
  analysis.dependencies = dependenciesMap

  return analysis
}

export async function extractZipFiles(zipFile: File): Promise<File[]> {
  const zip = new JSZip()
  const zipData = await zip.loadAsync(zipFile)
  const files: File[] = []

  const filePromises: Promise<File>[] = []

  zipData.forEach((relativePath, file) => {
    if (!file.dir) {
      const filePromise = file.async('blob').then((content) => {
        return new File([content], relativePath, { type: 'application/octet-stream' })
      })
      filePromises.push(filePromise)
    }
  })

  const extractedFiles = await Promise.all(filePromises)
  files.push(...extractedFiles)

  return files
}
