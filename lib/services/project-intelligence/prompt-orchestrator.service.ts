/**
 * CAMADA 5: PROMPT ORCHESTRATOR
 * 
 * Gera prompts modulares e executáveis, não um texto único.
 * Cada parte pode ser enviada separadamente para o Cursor.
 */

import { NormalizedProject } from './ingestion.service'
import { SemanticAnalysis } from './semantic-analysis.service'
import { ProjectIntention } from './intention-engine.service'
import { ReconstructionModel } from './reconstruction-model.service'

export interface OrchestratedPrompt {
  architecture: {
    prompt: string
    context: string
    executionOrder: number
  }
  pages: {
    prompt: string
    context: string
    executionOrder: number
    pages: Array<{ name: string; prompt: string }>
  }
  components: {
    prompt: string
    context: string
    executionOrder: number
    components: Array<{ name: string; prompt: string }>
  }
  logic: {
    prompt: string
    context: string
    executionOrder: number
    services: Array<{ name: string; prompt: string }>
  }
  styles: {
    prompt: string
    context: string
    executionOrder: number
  }
  fullPrompt: string // Para quem quiser tudo de uma vez
}

export function orchestratePrompts(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention,
  reconstruction: ReconstructionModel
): OrchestratedPrompt {
  const architecture = generateArchitecturePrompt(normalized, semantic, intention, reconstruction)
  const pages = generatePagesPrompt(normalized, semantic, intention)
  const components = generateComponentsPrompt(normalized, semantic, intention)
  const logic = generateLogicPrompt(normalized, semantic, intention)
  const styles = generateStylesPrompt(normalized, semantic, intention)
  const fullPrompt = generateFullPrompt(architecture, pages, components, logic, styles)

  return {
    architecture,
    pages,
    components,
    logic,
    styles,
    fullPrompt,
  }
}

function generateArchitecturePrompt(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention,
  reconstruction: ReconstructionModel
): OrchestratedPrompt['architecture'] {
  const context = `Project Type: ${normalized.projectType}\nComplexity: ${normalized.complexity}\nMaturity: ${normalized.maturity}\nStack: ${normalized.stack.join(', ')}\nArchitecture: ${normalized.architecture}`

  const prompt = `# ARQUITETURA DO PROJETO

## CONTEXTO
${context}

## OBJETIVO PRINCIPAL
${intention.primaryGoal}

## DECISÕES ARQUITETURAIS
${intention.architecturalDecisions.map(d => `- **${d.decision}**: ${d.rationale} (Trade-off: ${d.tradeOff})`).join('\n')}

## ARQUITETURA IDEAL
${reconstruction.idealArchitecture.structure.map(s => `- ${s}`).join('\n')}

## PADRÕES RECOMENDADOS
${reconstruction.idealArchitecture.patterns.map(p => `- ${p}`).join('\n')}

## TECNOLOGIAS
${reconstruction.idealArchitecture.technologies.map(t => `- ${t}`).join('\n')}

## RACIONAL
${reconstruction.idealArchitecture.rationale}

## INSTRUÇÕES
1. Crie a estrutura de pastas conforme a arquitetura ideal
2. Configure as tecnologias recomendadas
3. Implemente os padrões arquiteturais definidos
4. Mantenha a separação de concerns desde o início`

  return {
    prompt,
    context,
    executionOrder: 1,
  }
}

function generatePagesPrompt(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): OrchestratedPrompt['pages'] {
  const context = `Pages detected: ${normalized.structure.pages.length}\nNavigation flows: ${semantic.flows.navigation.join(', ')}\nAuthentication: ${semantic.flows.authentication.join(', ')}`

  const pagePrompts = normalized.structure.pages.map(page => {
    const responsibilities = semantic.responsibilities.pages[page] || []
    return {
      name: page,
      prompt: `## PÁGINA: ${page}

### Responsabilidades
${responsibilities.map(r => `- ${r}`).join('\n')}

### Funcionalidades
- Implementar todas as responsabilidades listadas
- Seguir os padrões de navegação do projeto
- Manter consistência com outras páginas`,
    }
  })

  const prompt = `# PÁGINAS DO PROJETO

## CONTEXTO
${context}

## PÁGINAS IDENTIFICADAS
${normalized.structure.pages.map(p => `- ${p}`).join('\n')}

## FLUXOS DE NAVEGAÇÃO
${semantic.flows.navigation.map(f => `- ${f}`).join('\n')}

## AUTENTICAÇÃO
${semantic.flows.authentication.map(f => `- ${f}`).join('\n')}

## INSTRUÇÕES
1. Crie todas as páginas identificadas
2. Implemente os fluxos de navegação
3. Configure autenticação se necessário
4. Mantenha consistência entre páginas`

  return {
    prompt,
    context,
    executionOrder: 2,
    pages: pagePrompts,
  }
}

function generateComponentsPrompt(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): OrchestratedPrompt['components'] {
  const context = `Components detected: ${normalized.structure.components.length}\nDesign patterns: ${semantic.patterns.design.join(', ')}\nReusability: ${semantic.quality.reusability}`

  const componentPrompts = normalized.structure.components.slice(0, 10).map(component => {
    const responsibilities = semantic.responsibilities.components[component] || []
    return {
      name: component,
      prompt: `## COMPONENTE: ${component}

### Responsabilidades
${responsibilities.map(r => `- ${r}`).join('\n')}

### Padrões a Seguir
${semantic.patterns.design.map(p => `- ${p}`).join('\n')}

### Instruções
- Criar componente reutilizável
- Seguir padrões de design identificados
- Manter responsabilidades claras`,
    }
  })

  const prompt = `# COMPONENTES DO PROJETO

## CONTEXTO
${context}

## COMPONENTES IDENTIFICADOS
${normalized.structure.components.length} componentes encontrados

## PADRÕES DE DESIGN
${semantic.patterns.design.map(p => `- ${p}`).join('\n')}

## QUALIDADE DE REUSABILIDADE
${semantic.quality.reusability}

## INSTRUÇÕES
1. Crie componentes reutilizáveis
2. Siga os padrões de design identificados
3. Mantenha responsabilidades claras
4. Priorize composição sobre complexidade`

  return {
    prompt,
    context,
    executionOrder: 3,
    components: componentPrompts,
  }
}

function generateLogicPrompt(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): OrchestratedPrompt['logic'] {
  const context = `Services detected: ${normalized.structure.services.length}\nAPIs: ${normalized.structure.apis.length}\nData flow: ${semantic.patterns.dataFlow.join(', ')}\nState management: ${semantic.patterns.stateManagement.join(', ')}`

  const servicePrompts = normalized.structure.services.map(service => {
    const responsibilities = semantic.responsibilities.services[service] || []
    return {
      name: service,
      prompt: `## SERVIÇO: ${service}

### Responsabilidades
${responsibilities.map(r => `- ${r}`).join('\n')}

### Instruções
- Implementar lógica de negócio
- Separar concerns de UI
- Manter serviços testáveis`,
    }
  })

  const prompt = `# LÓGICA E SERVIÇOS DO PROJETO

## CONTEXTO
${context}

## SERVIÇOS IDENTIFICADOS
${normalized.structure.services.length} serviços encontrados

## FLUXO DE DADOS
${semantic.patterns.dataFlow.map(f => `- ${f}`).join('\n')}

## GERENCIAMENTO DE ESTADO
${semantic.patterns.stateManagement.map(s => `- ${s}`).join('\n')}

## INSTRUÇÕES
1. Implemente serviços para lógica de negócio
2. Configure fluxo de dados adequado
3. Separe concerns de UI
4. Mantenha código testável`

  return {
    prompt,
    context,
    executionOrder: 4,
    services: servicePrompts,
  }
}

function generateStylesPrompt(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): OrchestratedPrompt['styles'] {
  const context = `Styling: ${normalized.stack.filter(s => s.includes('CSS') || s.includes('Tailwind') || s.includes('Styled')).join(', ') || 'Standard CSS'}\nDesign system: ${semantic.quality.maintainability || 'Standard'}`

  const prompt = `# ESTILOS E DESIGN DO PROJETO

## CONTEXTO
${context}

## TECNOLOGIAS DE ESTILO
${normalized.stack.filter(s => s.includes('CSS') || s.includes('Tailwind') || s.includes('Styled')).join(', ') || 'CSS padrão'}

## EXPERIÊNCIA DO USUÁRIO
Prioridade: ${intention.priorities.userExperience}/10

## INSTRUÇÕES
1. Implemente sistema de design consistente
2. Use as tecnologias de estilo identificadas
3. Mantenha responsividade
4. Priorize acessibilidade`

  return {
    prompt,
    context,
    executionOrder: 5,
  }
}

function generateFullPrompt(
  architecture: OrchestratedPrompt['architecture'],
  pages: OrchestratedPrompt['pages'],
  components: OrchestratedPrompt['components'],
  logic: OrchestratedPrompt['logic'],
  styles: OrchestratedPrompt['styles']
): string {
  return `# SUPERPROMPT COMPLETO - RECONSTRUÇÃO DE PROJETO

${architecture.prompt}

---

${pages.prompt}

---

${components.prompt}

---

${logic.prompt}

---

${styles.prompt}

---

## ORDEM DE EXECUÇÃO RECOMENDADA
1. Arquitetura (estrutura base)
2. Páginas (rotas principais)
3. Componentes (UI reutilizável)
4. Lógica (serviços e estado)
5. Estilos (design system)

## NOTA IMPORTANTE
Este prompt foi gerado de forma modular. Você pode executar cada seção separadamente no Cursor, ou usar o prompt completo para uma reconstrução total.`
}

