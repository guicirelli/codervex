import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { extractZipFiles } from '@/lib/services/file-analyzer.service'
import { generateSuperPromptV2 } from '@/lib/services/prompt-generator-v2.service'
import { rateLimit } from '@/lib/core/rate-limiter'
import { logger } from '@/lib/core/logger'
import { sendPromptReadyEmail } from '@/lib/services/email.service'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = rateLimit(payload.userId, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em alguns instantes.' },
        { status: 429 }
      )
    }

    // Verificar créditos
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Créditos insuficientes. Adquira mais créditos para continuar.' },
        { status: 403 }
      )
    }

    // Obter dados do request
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const isFromIdea = formData.get('isFromIdea') === 'true'
    const idea = formData.get('idea') as string | null
    const customizations = formData.get('customizations') as string | null
    const useModularPrompts = formData.get('useModularPrompts') === 'true'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Processar arquivos
    let processedFiles: File[] = []

    for (const file of files) {
      if (file.name.endsWith('.zip')) {
        const extracted = await extractZipFiles(file)
        processedFiles.push(...extracted)
      } else {
        processedFiles.push(file)
      }
    }

    // Gerar prompt usando Project Intelligence Engine
    const result = await generateSuperPromptV2(processedFiles, {
      isFromIdea,
      idea: idea || undefined,
      customizations: customizations || undefined,
      useModularPrompts,
    })

    // Debitar crédito
    await prisma.user.update({
      where: { id: payload.userId },
      data: { credits: { decrement: 1 } },
    })

    // Salvar prompt no histórico
    const prompt = await prisma.prompt.create({
      data: {
        userId: payload.userId,
        content: result.prompt,
        stack: result.intelligence.normalized.stack.join(', '),
        sourceType: isFromIdea ? 'idea' : 'upload',
      },
    })

    // Enviar email (opcional)
    try {
      // await sendPromptReadyEmail(user.email, prompt.id) // TODO: Implementar quando necessário
    } catch (emailError) {
      logger.error('Erro ao enviar email', { error: emailError })
    }

    logger.info('Prompt gerado com sucesso', {
      userId: payload.userId,
      promptId: prompt.id,
      stack: result.intelligence.normalized.stack,
      score: result.intelligence.diagnostic.overallScore,
    })

    return NextResponse.json({
      success: true,
      prompt: {
        id: prompt.id,
        content: result.prompt,
        modularPrompts: result.modularPrompts,
      },
      intelligence: {
        diagnostic: result.intelligence.diagnostic,
        normalized: {
          projectType: result.intelligence.normalized.projectType,
          complexity: result.intelligence.normalized.complexity,
          stack: result.intelligence.normalized.stack,
        },
        intention: {
          primaryGoal: result.intelligence.intention.primaryGoal,
          priorities: result.intelligence.intention.priorities,
        },
        reconstruction: {
          idealArchitecture: result.intelligence.reconstruction.idealArchitecture,
          improvements: result.intelligence.reconstruction.improvements,
        },
      },
      credits: user.credits - 1,
    })
  } catch (error) {
    logger.error('Erro ao gerar prompt v2', { error })
    return NextResponse.json(
      { error: 'Erro ao processar projeto. Tente novamente.' },
      { status: 500 }
    )
  }
}

