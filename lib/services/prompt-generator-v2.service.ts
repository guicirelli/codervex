/**
 * PROMPT GENERATOR V2 - Project Intelligence Engine
 * 
 * Versão completamente refatorada que usa a Project Intelligence Engine
 * ao invés de análise simples.
 */

import { processProjectIntelligence, ProjectIntelligence } from './project-intelligence'

export interface PromptGenerationOptions {
  isFromIdea?: boolean
  idea?: string
  customizations?: string
  referenceContent?: string
  useModularPrompts?: boolean // Se true, retorna prompts modulares
}

export async function generateSuperPromptV2(
  files: File[],
  options?: PromptGenerationOptions
): Promise<{
  intelligence: ProjectIntelligence
  prompt: string
  modularPrompts?: {
    architecture: string
    pages: string
    components: string
    logic: string
    styles: string
  }
}> {
  // Processar através da Project Intelligence Engine
  const intelligence = await processProjectIntelligence(files)

  // Se for de uma ideia, adaptar
  if (options?.isFromIdea && options?.idea) {
    return generateFromIdea(intelligence, options)
  }

  // Retornar prompt orquestrado
  if (options?.useModularPrompts) {
    return {
      intelligence,
      prompt: intelligence.prompts.fullPrompt,
      modularPrompts: {
        architecture: intelligence.prompts.architecture.prompt,
        pages: intelligence.prompts.pages.prompt,
        components: intelligence.prompts.components.prompt,
        logic: intelligence.prompts.logic.prompt,
        styles: intelligence.prompts.styles.prompt,
      },
    }
  }

  return {
    intelligence,
    prompt: intelligence.prompts.fullPrompt,
  }
}

function generateFromIdea(
  intelligence: ProjectIntelligence,
  options: PromptGenerationOptions
): {
  intelligence: ProjectIntelligence
  prompt: string
} {
  const { idea, customizations, referenceContent } = options

  let prompt = `# CRIAR PROJETO DO ZERO

## IDEIA DO PROJETO
${idea || 'Projeto baseado em ideia do usuário'}

## STACK TECNOLÓGICA RECOMENDADA
${intelligence.normalized.stack.map(tech => `- ${tech}`).join('\n')}

## ARQUITETURA RECOMENDADA
${intelligence.reconstruction.idealArchitecture.structure.map(s => `- ${s}`).join('\n')}

## PADRÕES RECOMENDADOS
${intelligence.reconstruction.idealArchitecture.patterns.map(p => `- ${p}`).join('\n')}

${customizations ? `\n## CUSTOMIZAÇÕES\n${customizations}\n` : ''}

${referenceContent ? `\n## PROJETO DE REFERÊNCIA\nUse este projeto como inspiração:\n${referenceContent}\n` : ''}

## DECISÕES ARQUITETURAIS
${intelligence.intention.architecturalDecisions.map(d => `- **${d.decision}**: ${d.rationale}`).join('\n')}

## INSTRUÇÕES
1. Crie o projeto COMPLETO do zero
2. Use as tecnologias recomendadas acima
3. Siga a arquitetura ideal definida
4. Implemente os padrões recomendados
5. Código deve estar pronto para deploy
6. Sem instruções intermediárias, apenas código completo
7. Inclua todos os arquivos necessários (package.json, configurações, etc.)

Gere o projeto completo agora:`

  return {
    intelligence,
    prompt,
  }
}

