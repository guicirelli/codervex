import OpenAI from 'openai'
import { ProjectAnalysis } from './file-analyzer.service'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function generateSuperPrompt(
  analysis: ProjectAnalysis, 
  fileContents: string[],
  options?: {
    isFromIdea?: boolean
    idea?: string
    customizations?: string
    referenceContent?: string
  }
): Promise<string> {
  const stackText = analysis.stack.length > 0 
    ? analysis.stack.join(', ')
    : 'Tecnologias não identificadas'

  const structureText = analysis.structure.length > 0
    ? analysis.structure.join(', ')
    : 'Estrutura padrão'

  const componentsText = analysis.components.length > 0
    ? analysis.components.join(', ')
    : 'Componentes não identificados'

  const pagesText = analysis.pages.length > 0
    ? analysis.pages.join(', ')
    : 'Páginas não identificadas'

  const functionalitiesText = analysis.functionalities.length > 0
    ? analysis.functionalities.join(', ')
    : 'Funcionalidades não identificadas'

  // Criar prompt base estruturado
  let basePrompt = ''
  
  if (options?.isFromIdea) {
    // Prompt para criação do zero
    basePrompt = `Crie um projeto completo do zero com as seguintes especificações:

${options.idea || 'Projeto baseado em ideia do usuário'}

STACK TECNOLÓGICA:
${analysis.stack.map(tech => `- ${tech}`).join('\n')}

ESTRUTURA DE PASTAS:
${analysis.structure.map(folder => `- ${folder}/`).join('\n')}

COMPONENTES PRINCIPAIS:
${analysis.components.map(comp => `- ${comp}`).join('\n')}

PÁGINAS/ROTAS:
${analysis.pages.map(page => `- ${page}`).join('\n')}

FUNCIONALIDADES PRINCIPAIS:
${analysis.functionalities.map(func => `- ${func}`).join('\n')}

${options.customizations ? `CUSTOMIZAÇÕES ESPECÍFICAS:\n${options.customizations}\n` : ''}

${options.referenceContent ? `\nPROJETO DE REFERÊNCIA:\nUse este projeto como inspiração, mas crie algo único e melhorado:\n${options.referenceContent}\n` : ''}

LAYOUT E SEÇÕES:
- Header com navegação responsiva
- Footer com links importantes
- Layout responsivo e moderno
- Design consistente em todas as páginas

INSTRUÇÕES:
1. Crie o projeto COMPLETO do zero, não apenas um resumo
2. Use as tecnologias identificadas acima
3. Mantenha a estrutura de pastas similar
4. Implemente todas as funcionalidades listadas
5. Código deve estar pronto para deploy
6. Sem instruções intermediárias, apenas código completo
7. Inclua todos os arquivos necessários (package.json, configurações, etc.)
8. ${options.referenceContent ? 'Use o projeto de referência como inspiração, mas crie algo único e melhorado. ' : ''}Seja criativo e adicione boas práticas modernas

Gere o projeto completo agora:`
  } else {
    // Prompt para análise de projeto existente
    basePrompt = `Recrie este projeto completo usando ${stackText}.

STACK TECNOLÓGICA:
${analysis.stack.map(tech => `- ${tech}`).join('\n')}

ESTRUTURA DE PASTAS:
${analysis.structure.map(folder => `- ${folder}/`).join('\n')}

COMPONENTES PRINCIPAIS:
${analysis.components.map(comp => `- ${comp}`).join('\n')}

PÁGINAS/ROTAS:
${analysis.pages.map(page => `- ${page}`).join('\n')}

FUNCIONALIDADES PRINCIPAIS:
${analysis.functionalities.map(func => `- ${func}`).join('\n')}

LAYOUT E SEÇÕES:
- Header com navegação responsiva
- Footer com links importantes
- Layout responsivo e moderno
- Design consistente em todas as páginas

INSTRUÇÕES:
1. Gere o código completo e funcional
2. Use as tecnologias identificadas acima
3. Mantenha a estrutura de pastas similar
4. Implemente todas as funcionalidades listadas
5. Código deve estar pronto para deploy
6. Sem instruções intermediárias, apenas código completo
7. Inclua todos os arquivos necessários (package.json, configurações, etc.)

Gere o projeto completo agora:`
  }

  // Se temos conteúdo de arquivos, adicionar ao prompt
  if (fileContents.length > 0) {
    const sampleContent = fileContents.slice(0, 5).join('\n\n---\n\n')
    basePrompt += `\n\nCÓDIGO DE REFERÊNCIA:\n\`\`\`\n${sampleContent}\n\`\`\``
  }

  // Tentar usar OpenAI para melhorar o prompt (opcional)
  try {
    if (openai && process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em gerar prompts detalhados para recriar projetos web completos. Crie prompts estruturados e completos que permitam recriar projetos inteiros usando IA.',
          },
          {
            role: 'user',
            content: `Melhore e expanda este prompt para recriar um projeto web:\n\n${basePrompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      return completion.choices[0]?.message?.content || basePrompt
    }
  } catch (error) {
    console.error('Erro ao usar OpenAI para melhorar prompt:', error)
    // Retornar prompt base se OpenAI falhar
  }

  return basePrompt
}

