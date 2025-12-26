/**
 * API de Análise - FASE 1
 * 
 * Endpoint simples que:
 * - Recebe upload
 * - Faz parsing
 * - Detecta stack
 * - Mapeia estrutura
 * - Gera prompt básico
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { extractZipFiles } from '@/lib/services/file-analyzer.service'
import { parseZipFile, parseFiles } from '@/lib/services/ingestion/parser.service'
import { detectStack } from '@/lib/services/ingestion/stack-detector.service'
import { mapStructure } from '@/lib/services/ingestion/structure-mapper.service'
import { generateSimplePrompt } from '@/lib/services/prompt/simple-generator.service'
import { trackAnalysisDuration, trackAnalysisResult, trackStackDetection } from '@/lib/core/metrics'
import { logger } from '@/lib/core/logger'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

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

    // Verificar créditos
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Créditos insuficientes' },
        { status: 403 }
      )
    }

    // Obter arquivos
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

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

    // FASE 1: Parsing
    let projectStructure
    if (files.some(f => f.name.endsWith('.zip'))) {
      const zipFile = files.find(f => f.name.endsWith('.zip'))!
      projectStructure = await parseZipFile(zipFile)
    } else {
      projectStructure = await parseFiles(processedFiles)
    }

    // FASE 2: Detecção de Stack
    const stack = detectStack(projectStructure.files)

    // FASE 3: Mapeamento de Estrutura
    const mappedStructure = mapStructure(projectStructure, stack)

    // FASE 4: Geração de Prompt
    const promptResult = generateSimplePrompt(stack, mappedStructure, projectStructure)

    // Debitar crédito
    await prisma.user.update({
      where: { id: payload.userId },
      data: { credits: { decrement: 1 } },
    })

    // Salvar no histórico
    const prompt = await prisma.prompt.create({
      data: {
        userId: payload.userId,
        content: promptResult.prompt,
        stack: promptResult.metadata.stack.join(', '),
        sourceType: 'upload',
      },
    })

    // Tracking
    const duration = Date.now() - startTime
    trackAnalysisDuration(duration, {
      stack: stack.framework.join(', ') || 'unknown',
      fileCount: projectStructure.files.length,
      projectType: 'unknown', // Fase 1 não detecta ainda
      success: true,
    })
    trackAnalysisResult(true)
    trackStackDetection(promptResult.metadata.stack)

    logger.info('Analysis completed', {
      userId: payload.userId,
      promptId: prompt.id,
      duration,
      stack: promptResult.metadata.stack,
      fileCount: projectStructure.files.length,
    })

    return NextResponse.json({
      success: true,
      prompt: {
        id: prompt.id,
        content: promptResult.prompt,
      },
      analysis: {
        stack: promptResult.metadata.stack,
        fileCount: promptResult.metadata.fileCount,
        structure: {
          pages: mappedStructure.pages.length,
          components: mappedStructure.components.length,
          services: mappedStructure.services.length,
        },
      },
      credits: user.credits - 1,
    })
  } catch (error) {
    const duration = Date.now() - startTime
    trackAnalysisDuration(duration, { success: false })
    trackAnalysisResult(false, error instanceof Error ? error.message : 'Unknown error')

    logger.error('Analysis failed', { error, duration })

    return NextResponse.json(
      { error: 'Erro ao processar projeto. Tente novamente.' },
      { status: 500 }
    )
  }
}

