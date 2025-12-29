/**
 * Canonical Schema
 * Contrato imutável do produto
 * Tudo que o motor gera tem que caber aqui
 * Se não cabe → não é permitido
 */

export interface CanonicalContext {
  engine: {
    name: string
    version: string
    mode: 'deterministic'
    confidence_level: 'high' | 'medium' | 'low'
    analysis_type: 'static'
  }
  
  project: {
    name: string
    repository_type: 'frontend' | 'backend' | 'fullstack' | 'static'
    blueprint: string
    intent: 'inform' | 'present' | 'convert' | 'operate'
    complexity: 'low' | 'medium' | 'high'
    statefulness: 'stateless' | 'stateful'
    seo_relevant: boolean
    auth_required: boolean
  }
  
  audience: {
    primary: 'developers' | 'end-users' | 'customers' | 'internal'
    technical_level: 'low' | 'medium' | 'high'
  }
  
  proposal: {
    what_it_is: string[]
    what_it_does: string[]
    what_it_does_not_do: string[]
    core_value_proposition: string
  }
  
  technical_stack: {
    framework: {
      name: string
      version: string | null
    }
    language: string[]
    styling: string[]
    ui_libraries: string[]
    animation: string[]
    state_management: string[]
    auth: {
      provider: string | null
      library: string | null
    } | null
    database: {
      name: string | null
      orm: string | null
    } | null
    cms: {
      name: string | null
      type: string | null
    } | null
    deployment: string | null
  }
  
  structure: {
    routing_model: 'one-page' | 'multi-page' | 'hybrid'
    folder_structure: string[]
    entry_point: string
  }
  
  capabilities: string[]
  limitations: string[]
  excluded_concepts: string[]
  risk_flags: string[]
  
  source: {
    method: 'static-analysis'
    confidence: 'high' | 'medium' | 'low'
  }
}

