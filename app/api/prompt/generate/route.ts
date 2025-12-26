import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { analyzeFiles, extractZipFiles } from '@/lib/services/file-analyzer.service'
import { generateSuperPrompt } from '@/lib/services/prompt-generator.service'
import { rateLimit } from '@/lib/core/rate-limiter'
import { logger } from '@/lib/core/logger'
import { sendPromptReadyEmail } from '@/lib/services/email.service'

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

    // Rate limiting
    const rateLimitResult = rateLimit(payload.userId, {
      windowMs: 60000, // 1 minuto
      maxRequests: 5, // 5 requisições por minuto
    })

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { userId: payload.userId })
      return NextResponse.json(
        {
          error: 'Muitas requisições. Tente novamente em alguns instantes.',
          resetTime: rateLimitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
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

    // Verificar créditos (permitir 1 prompt gratuito para novos usuários)
    const isFirstPrompt = user.credits === 0 && user.subscription === 'free'
    const hasCredits = user.subscription === 'monthly' || user.credits > 0
    
    if (!isFirstPrompt && !hasCredits) {
      return NextResponse.json(
        { 
          error: 'Créditos insuficientes. Você tem direito a 1 prompt gratuito! Use-o agora ou adquira um plano.',
          code: 'INSUFFICIENT_CREDITS'
        },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const githubUrl = formData.get('githubUrl') as string | null

    let allFiles: File[] = []

    // Processar upload de arquivos
    if (files && files.length > 0) {
      // Verificar se é ZIP
      const zipFile = files.find(f => f.name.endsWith('.zip'))
      if (zipFile) {
        try {
          const extractedFiles = await extractZipFiles(zipFile)
          allFiles = [...files.filter(f => !f.name.endsWith('.zip')), ...extractedFiles]
          logger.info('ZIP extracted', { fileCount: extractedFiles.length })
        } catch (error) {
          logger.error('Error extracting ZIP', { error })
          return NextResponse.json(
            { error: 'Erro ao extrair arquivo ZIP' },
            { status: 400 }
          )
        }
      } else {
        allFiles = Array.from(files)
      }
    }

    // GitHub será implementado em breve
    if (githubUrl) {
      return NextResponse.json(
        { 
          error: 'Integração com GitHub será lançada em breve. Por enquanto, faça upload de arquivos ou ZIP.',
          code: 'GITHUB_NOT_AVAILABLE'
        },
        { status: 501 }
      )
    }

    if (allFiles.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      )
    }

    // Validar tamanho total dos arquivos (max 50MB)
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (totalSize > maxSize) {
      return NextResponse.json(
        { 
          error: `Tamanho total dos arquivos (${(totalSize / 1024 / 1024).toFixed(2)}MB) excede o limite de 50MB. Tente enviar apenas os arquivos principais ou divida em partes menores.`,
          code: 'FILE_SIZE_EXCEEDED',
          currentSize: totalSize,
          maxSize: maxSize
        },
        { status: 400 }
      )
    }

    logger.info('Analyzing files', { fileCount: allFiles.length, userId: payload.userId })

    // Analisar arquivos
    const analysis = await analyzeFiles(allFiles)

    // Ler conteúdo de arquivos importantes para contexto
    const fileContents: string[] = []
    
    // Priorizar arquivos importantes
    const importantFiles = allFiles.filter(f => {
      const name = f.name.toLowerCase()
      return name.includes('package.json') || 
             name.includes('component') || 
             name.includes('page') || 
             name.endsWith('.tsx') || 
             name.endsWith('.jsx') ||
             name.includes('app/') ||
             name.includes('pages/')
    })
    
    // Ler até 10 arquivos importantes + 5 outros
    const filesToRead = [
      ...importantFiles.slice(0, 10),
      ...allFiles.filter(f => !importantFiles.includes(f)).slice(0, 5)
    ]
    
    for (const file of filesToRead) {
      try {
        const content = await file.text()
        // Limitar tamanho de cada arquivo a 50KB para não sobrecarregar
        const limitedContent = content.length > 50000 ? content.substring(0, 50000) + '\n// ... (arquivo truncado) ...' : content
        fileContents.push(`// ${file.name}\n${limitedContent}`)
      } catch (e) {
        // Ignorar arquivos binários
        logger.debug('Skipping binary file', { fileName: file.name })
      }
    }

    logger.info('Generating prompt', { userId: payload.userId })

    // Gerar superprompt
    const prompt = await generateSuperPrompt(analysis, fileContents)

    // Salvar prompt no histórico
    const savedPrompt = await prisma.prompt.create({
      data: {
        userId: user.id,
        title: `Projeto ${new Date().toLocaleDateString('pt-BR')}`,
        content: prompt,
        projectType: analysis.stack.join(', ') || 'Desconhecido',
        stack: analysis.stack.join(', '),
      },
    })

    logger.info('Prompt generated', { promptId: savedPrompt.id, userId: payload.userId })

    // Enviar email de notificação (assíncrono, não bloqueia resposta)
    sendPromptReadyEmail(user.email, savedPrompt.title || 'Novo Prompt', savedPrompt.id).catch(
      (error) => logger.error('Erro ao enviar email', { error })
    )

    // Deduzir crédito se não for assinatura mensal e não for o primeiro prompt gratuito
    if (user.subscription !== 'monthly') {
      if (isFirstPrompt) {
        // Primeiro prompt é gratuito, não deduzir crédito
        logger.info('First free prompt used', { userId: user.id })
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: {
              decrement: 1,
            },
          },
        })
      }
    }

    return NextResponse.json({
      prompt,
      promptId: savedPrompt.id,
      analysis,
    })
  } catch (error: any) {
    logger.error('Error generating prompt', { error: error.message, stack: error.stack })
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao processar projeto'
    let errorCode = 'UNKNOWN_ERROR'
    
    if (error.message?.includes('ZIP')) {
      errorMessage = 'Erro ao extrair arquivo ZIP. Verifique se o arquivo não está corrompido.'
      errorCode = 'ZIP_EXTRACTION_ERROR'
    } else if (error.message?.includes('size') || error.message?.includes('tamanho')) {
      errorMessage = 'Arquivo muito grande. Tente enviar arquivos menores ou divida o projeto.'
      errorCode = 'FILE_TOO_LARGE'
    } else if (error.message?.includes('parse') || error.message?.includes('JSON')) {
      errorMessage = 'Erro ao analisar arquivos. Verifique se os arquivos estão em formato válido.'
      errorCode = 'PARSE_ERROR'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        suggestion: 'Tente novamente com arquivos menores ou entre em contato com o suporte se o problema persistir.'
      },
      { status: 500 }
    )
  }
}
