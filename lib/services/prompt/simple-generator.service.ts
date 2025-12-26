/**
 * Gerador de Prompt Simples - FASE 1
 * 
 * Gera prompt básico mas útil.
 * Foco: Funcional, não perfeito.
 */

import { DetectedStack } from '../ingestion/stack-detector.service'
import { MappedStructure } from '../ingestion/structure-mapper.service'
import { ProjectStructure } from '../ingestion/parser.service'

export interface SimplePrompt {
  prompt: string
  metadata: {
    stack: string[]
    fileCount: number
    hasPackageJson: boolean
  }
}

/**
 * Generate simple but useful prompt
 */
export function generateSimplePrompt(
  stack: DetectedStack,
  structure: MappedStructure,
  projectStructure: ProjectStructure
): SimplePrompt {
  const allStack = [
    ...stack.framework,
    ...stack.language,
    ...stack.styling,
    ...stack.stateManagement,
    ...stack.other,
  ].filter(Boolean)

  const stackText = allStack.length > 0
    ? allStack.join(' + ')
    : 'Tecnologias não identificadas'

  let prompt = `# RECRIAR PROJETO COMPLETO

## STACK TECNOLÓGICA
${allStack.map(tech => `- ${tech}`).join('\n')}

${stack.buildTool ? `## BUILD TOOL\n- ${stack.buildTool}\n` : ''}

## ESTRUTURA DE PASTAS
${projectStructure.directories.slice(0, 20).map(dir => `- ${dir}/`).join('\n')}

## PÁGINAS/ROTAS IDENTIFICADAS
${structure.pages.length > 0
    ? structure.pages.slice(0, 10).map(page => `- ${page}`).join('\n')
    : 'Nenhuma página identificada'}

## COMPONENTES IDENTIFICADOS
${structure.components.length > 0
    ? `${structure.components.length} componentes encontrados\n${structure.components.slice(0, 10).map(comp => `- ${comp}`).join('\n')}`
    : 'Nenhum componente identificado'}

${structure.services.length > 0 ? `## SERVIÇOS/UTILS\n${structure.services.slice(0, 10).map(s => `- ${s}`).join('\n')}\n` : ''}

${structure.hooks.length > 0 ? `## HOOKS\n${structure.hooks.slice(0, 10).map(h => `- ${h}`).join('\n')}\n` : ''}

${structure.apis.length > 0 ? `## API ROUTES\n${structure.apis.slice(0, 10).map(api => `- ${api}`).join('\n')}\n` : ''}

## INSTRUÇÕES
1. Recrie este projeto usando ${stackText}
2. Mantenha a estrutura de pastas similar
3. Implemente todas as páginas identificadas
4. Crie os componentes principais
5. Configure as dependências necessárias
6. Código deve estar pronto para deploy
7. Use as melhores práticas para ${stackText}

## ARQUIVOS IMPORTANTES
${projectStructure.rootFiles.filter(f => !f.includes('lock')).slice(0, 10).map(f => `- ${f}`).join('\n')}

Gere o projeto completo agora:`

  return {
    prompt,
    metadata: {
      stack: allStack,
      fileCount: projectStructure.files.length,
      hasPackageJson: projectStructure.hasPackageJson,
    },
  }
}

