import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { generateSuperPrompt } from '@/lib/services/prompt-generator.service'
import { logger } from '@/lib/core/logger'
import { sendPromptReadyEmail } from '@/lib/services/email.service'

interface ProjectIdea {
  title: string
  description: string
  features: string[]
  techStack: string[]
  style?: string
  referenceProject?: string
  customizations?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar créditos
    if (user.subscription !== 'monthly' && user.credits < 1) {
      return NextResponse.json(
        { error: 'Créditos insuficientes. Por favor, adquira um plano.' },
        { status: 403 }
      )
    }

    const idea: ProjectIdea = await request.json()

    if (!idea.title || !idea.description || !idea.features || idea.features.length === 0) {
      return NextResponse.json(
        { error: 'Título, descrição e funcionalidades são obrigatórios' },
        { status: 400 }
      )
    }

    logger.info('Generating prompt from idea', { userId: payload.userId, title: idea.title })

    // Buscar projeto de referência se especificado
    let referenceContent = ''
    if (idea.referenceProject) {
      try {
        const refProject = await prisma.prompt.findUnique({
          where: { id: idea.referenceProject },
          select: { content: true, stack: true },
        })
        if (refProject) {
          referenceContent = `\n\nPROJETO DE REFERÊNCIA:\nUse este projeto como inspiração, mas crie algo único:\n${refProject.content.substring(0, 1000)}`
        }
      } catch (error) {
        logger.warn('Reference project not found', { projectId: idea.referenceProject })
      }
    }

    // Criar análise simulada para o gerador de prompt
    const analysis = {
      stack: idea.techStack.length > 0 ? idea.techStack : ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      structure: ['app', 'components', 'lib'],
      components: [],
      pages: [],
      functionalities: idea.features,
      dependencies: {},
    }

    // Gerar prompt criativo baseado na ideia
    const basePrompt = `Crie um projeto completo do zero com as seguintes especificações:

TÍTULO: ${idea.title}

DESCRIÇÃO:
${idea.description}

STACK TECNOLÓGICA:
${idea.techStack.length > 0 ? idea.techStack.map(tech => `- ${tech}`).join('\n') : '- React\n- Next.js\n- TypeScript\n- Tailwind CSS'}

FUNCIONALIDADES PRINCIPAIS:
${idea.features.map(feature => `- ${feature}`).join('\n')}

${idea.style ? `ESTILO/DESIGN:\n${idea.style}\n` : ''}

ESTRUTURA SUGERIDA:
- /app (rotas e páginas)
- /components (componentes reutilizáveis)
- /lib (utilitários e helpers)
- Configuração moderna e escalável

${idea.customizations ? `CUSTOMIZAÇÕES ESPECÍFICAS:\n${idea.customizations}\n` : ''}

${referenceContent}

INSTRUÇÕES:
1. Crie o projeto COMPLETO do zero, não apenas um resumo
2. Use as tecnologias especificadas acima
3. Implemente TODAS as funcionalidades listadas
4. Código deve estar pronto para deploy
5. Inclua todos os arquivos necessários (package.json, configurações, etc.)
6. Se houver projeto de referência, use como inspiração mas crie algo único e melhorado
7. ${idea.customizations ? 'Aplique as customizações especificadas acima. ' : ''}Seja criativo e adicione boas práticas modernas

Gere o projeto completo agora:`

    // Melhorar prompt com OpenAI se disponível
    const enhancedPrompt = await generateSuperPrompt(analysis, [basePrompt], {
      isFromIdea: true,
      idea: `TÍTULO: ${idea.title}\n\nDESCRIÇÃO:\n${idea.description}\n\n${idea.style ? `ESTILO/DESIGN:\n${idea.style}\n` : ''}`,
      customizations: idea.customizations,
      referenceContent: referenceContent,
    })

    // Salvar prompt no histórico
    const savedPrompt = await prisma.prompt.create({
      data: {
        userId: user.id,
        title: idea.title,
        content: enhancedPrompt,
        projectType: 'Criação do Zero',
        stack: idea.techStack.join(', ') || 'React, Next.js, TypeScript',
      },
    })

    logger.info('Prompt generated from idea', { promptId: savedPrompt.id, userId: payload.userId })

    // Enviar email de notificação
    sendPromptReadyEmail(user.email, idea.title, savedPrompt.id).catch(
      (error) => logger.error('Erro ao enviar email', { error })
    )

    // Deduzir crédito se não for assinatura mensal
    if (user.subscription !== 'monthly') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      })
    }

    return NextResponse.json({
      prompt: enhancedPrompt,
      promptId: savedPrompt.id,
      analysis,
    })
  } catch (error: any) {
    logger.error('Error generating prompt from idea', { error: error.message })
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar prompt' },
      { status: 500 }
    )
  }
}

