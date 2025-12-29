import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { analyzeFiles, extractZipFiles } from '@/lib/services/file-analyzer.service'
import { generateSuperPrompt } from '@/lib/services/prompt-generator.service'
import { rateLimit } from '@/lib/core/rate-limiter'
import { logger } from '@/lib/core/logger'
import { sendPromptReadyEmail } from '@/lib/services/email.service'
import { runAnalysis } from '@/lib/services/project-analyzer'

export async function POST(request: NextRequest) {
  try {
    // Tentar obter do Clerk primeiro
    let userId: string | null = null
    
    try {
      const { userId: clerkUserId } = await auth()
      if (clerkUserId) {
        userId = clerkUserId
      }
    } catch {
      // Se falhar, tentar pelo token JWT
    }

    // Se não tiver Clerk, usar token JWT
    if (!userId) {
      const token = getTokenFromRequest(request)
      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in to continue.' },
        { status: 401 }
      )
    }

    // Rate limiting
    const rateLimitResult = rateLimit(userId, {
      windowMs: 60000, // 1 minuto
      maxRequests: 5, // 5 requisições por minuto
    })

    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded', { userId })
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again in a few moments.',
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

    // Buscar usuário no banco (por clerkId ou id)
    let user
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { clerkId: userId },
            { id: userId },
          ],
        },
      })
    } catch (dbError: any) {
      // Se houver erro de banco (ex: DATABASE_URL não configurado), continuar sem salvar
      logger.warn('Database error, continuing without saving to history', { error: dbError.message })
      user = null
    }

    // Se não encontrar usuário, ainda permitir análise mas não salvar no histórico
    if (!user) {
      logger.warn('User not found in database, continuing without saving to history', { userId })
    }

    // Verificar créditos (permitir 1 prompt gratuito para novos usuários) - apenas se usuário existir
    if (user) {
      const isFirstPrompt = user.credits === 0 && user.subscription === 'free'
      const hasCredits = user.subscription === 'monthly' || user.credits > 0
      
      if (!isFirstPrompt && !hasCredits) {
        return NextResponse.json(
          { 
            error: 'Insufficient credits. You have 1 free prompt available! Use it now or upgrade your plan.',
            code: 'INSUFFICIENT_CREDITS'
          },
          { status: 403 }
        )
      }
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const githubUrl = formData.get('githubUrl') as string | null
    const links = formData.get('links') as string | null

    // Processar GitHub Repo (prioridade)
    if (githubUrl || links) {
      const repoUrl = githubUrl || links
      if (repoUrl) {
        try {
          logger.info('Analyzing GitHub repository', { url: repoUrl, userId })
          
          const analysis = await runAnalysis({
            type: 'github',
            value: repoUrl
          })

          // Extrair nome do repositório para título
          let repoTitle = 'GitHub Project'
          if (analysis.repoName) {
            repoTitle = analysis.repoName
          } else {
            // Tentar extrair da URL
            try {
              const url = new URL(repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`)
              const pathParts = url.pathname.split('/').filter(p => p)
              if (pathParts.length >= 2) {
                repoTitle = pathParts[pathParts.length - 1]
              }
            } catch {
              repoTitle = 'GitHub Project'
            }
          }

          // Salvar prompt no histórico (se usuário existir)
          let savedPromptId = `temp-${Date.now()}`
          if (user) {
            try {
              const savedPrompt = await prisma.prompt.create({
                data: {
                  userId: user.id,
                  title: repoTitle,
                  content: analysis.markdown,
                  projectType: analysis.analysis.projectType,
                  stack: analysis.analysis.stack,
                },
              })
              savedPromptId = savedPrompt.id
              logger.info('GitHub analysis completed', { promptId: savedPrompt.id, userId })

              // Enviar email de notificação (assíncrono)
              sendPromptReadyEmail(user.email, `GitHub Project - ${new Date().toLocaleDateString('en-US')}`, savedPrompt.id).catch(
                (error) => logger.error('Error sending email', { error })
              )

              // Deduzir crédito se não for assinatura mensal e não for o primeiro prompt gratuito
              try {
                if (user.subscription !== 'monthly') {
                  const isFirstPrompt = user.credits === 0 && user.subscription === 'free'
                  if (isFirstPrompt) {
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
              } catch (creditError: any) {
                logger.warn('Error updating credits', { error: creditError.message })
              }
            } catch (saveError: any) {
              logger.warn('Error saving prompt to database, continuing with temp ID', { error: saveError.message })
            }
          }

          return NextResponse.json({
            prompt: analysis.markdown,
            promptId: savedPromptId,
            analysis: {
              stack: analysis.analysis.stack,
              framework: analysis.analysis.framework,
              projectType: analysis.analysis.projectType
            }
          })
        } catch (error: any) {
          logger.error('Error analyzing GitHub repo', { error: error.message, userId, stack: error.stack })
          
          // Mensagem mais específica para erro de tmp
          if (error.message?.includes('ENOENT') || error.message?.includes('tmp') || error.message?.includes('mkdir')) {
            logger.error('Temporary directory error - server configuration issue', { error: error.message })
            return NextResponse.json(
              { 
                error: 'Server configuration error. Please contact support or try again.',
                code: 'SERVER_CONFIG_ERROR'
              },
              { status: 500 }
            )
          }
          
          return NextResponse.json(
            { 
              error: error.message || 'Error analyzing GitHub repository. Please check if the repository is public and accessible.',
              code: 'GITHUB_ANALYSIS_ERROR'
            },
            { status: 400 }
          )
        }
      }
    }

    // Processar upload de arquivos (ZIP)
    let allFiles: File[] = []
    if (files && files.length > 0) {
      // Verificar se é ZIP
      const zipFile = files.find(f => f.name.endsWith('.zip'))
      if (zipFile) {
        try {
          logger.info('Analyzing uploaded ZIP file', { fileName: zipFile.name, userId })
          
          const analysis = await runAnalysis({
            type: 'upload',
            value: zipFile
          })

          // Salvar prompt no histórico (se usuário existir)
          let savedPromptId = `temp-${Date.now()}`
          if (user) {
            try {
              // Usar nome do arquivo ou repoName como título
              let uploadTitle = 'Uploaded Project'
              if (analysis.repoName) {
                uploadTitle = analysis.repoName
              } else if (zipFile.name) {
                uploadTitle = zipFile.name.replace('.zip', '')
              }
              
              const savedPrompt = await prisma.prompt.create({
                data: {
                  userId: user.id,
                  title: uploadTitle,
                  content: analysis.markdown,
                  projectType: analysis.analysis.projectType,
                  stack: analysis.analysis.stack,
                },
              })
              savedPromptId = savedPrompt.id
              logger.info('Upload analysis completed', { promptId: savedPrompt.id, userId })
            } catch (saveError: any) {
              logger.warn('Error saving prompt to database, continuing with temp ID', { error: saveError.message })
            }
          }

          // Enviar email de notificação (assíncrono) - apenas se usuário existir
          if (user) {
            sendPromptReadyEmail(user.email, `Uploaded Project - ${new Date().toLocaleDateString('en-US')}`, savedPromptId).catch(
              (error) => logger.error('Error sending email', { error })
            )

            // Deduzir crédito se não for assinatura mensal e não for o primeiro prompt gratuito
            try {
              if (user.subscription !== 'monthly') {
                const isFirstPrompt = user.credits === 0 && user.subscription === 'free'
                if (isFirstPrompt) {
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
            } catch (creditError: any) {
              logger.warn('Error updating credits', { error: creditError.message })
            }
          }

          return NextResponse.json({
            prompt: analysis.markdown,
            promptId: savedPromptId,
            analysis: {
              stack: analysis.analysis.stack,
              framework: analysis.analysis.framework,
              projectType: analysis.analysis.projectType
            }
          })
        } catch (error: any) {
          logger.error('Error analyzing upload', { error: error.message, userId, stack: error.stack })
          
          // Mensagem mais específica para erro de tmp
          if (error.message?.includes('ENOENT') || error.message?.includes('tmp') || error.message?.includes('mkdir')) {
            logger.error('Temporary directory error - server configuration issue', { error: error.message })
            return NextResponse.json(
              { 
                error: 'Server configuration error. Please contact support or try again.',
                code: 'SERVER_CONFIG_ERROR'
              },
              { status: 500 }
            )
          }
          
          return NextResponse.json(
            { 
              error: error.message || 'Error analyzing uploaded files. Please check if the ZIP file is valid.',
              code: 'UPLOAD_ANALYSIS_ERROR'
            },
            { status: 400 }
          )
        }
      } else {
        // Fallback para sistema antigo se não for ZIP
        allFiles = Array.from(files)
      }
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

    logger.info('Analyzing files', { fileCount: allFiles.length, userId })

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

    logger.info('Generating prompt', { userId })

    // Gerar superprompt
    const prompt = await generateSuperPrompt(analysis, fileContents)

    // Salvar prompt no histórico (se usuário existir)
    let savedPromptId = `temp-${Date.now()}`
    if (user) {
      try {
        const savedPrompt = await prisma.prompt.create({
          data: {
            userId: user.id,
            title: `Project ${new Date().toLocaleDateString('en-US')}`,
            content: prompt,
            projectType: analysis.stack.join(', ') || 'Unknown',
            stack: analysis.stack.join(', '),
          },
        })
        savedPromptId = savedPrompt.id
        logger.info('Prompt generated', { promptId: savedPrompt.id, userId })

        // Enviar email de notificação (assíncrono, não bloqueia resposta)
        sendPromptReadyEmail(user.email, `Project ${new Date().toLocaleDateString('en-US')}`, savedPrompt.id).catch(
          (error) => logger.error('Error sending email', { error })
        )

        // Deduzir crédito se não for assinatura mensal e não for o primeiro prompt gratuito
        try {
          if (user.subscription !== 'monthly') {
            const isFirstPrompt = user.credits === 0 && user.subscription === 'free'
            if (isFirstPrompt) {
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
        } catch (creditError: any) {
          logger.warn('Error updating credits', { error: creditError.message })
        }
      } catch (saveError: any) {
        logger.warn('Error saving prompt to database, continuing with temp ID', { error: saveError.message })
      }
    }

    return NextResponse.json({
      prompt,
      promptId: savedPromptId,
      analysis,
    })
  } catch (error: any) {
    logger.error('Error generating prompt', { error: error.message, stack: error.stack })
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Error processing project. Please try again.'
    let errorCode = 'UNKNOWN_ERROR'
    
    if (error.message?.includes('ZIP')) {
      errorMessage = 'Error extracting ZIP file. Please check if the file is not corrupted.'
      errorCode = 'ZIP_EXTRACTION_ERROR'
    } else if (error.message?.includes('size') || error.message?.includes('tamanho')) {
      errorMessage = 'File is too large. Please try uploading smaller files or split the project.'
      errorCode = 'FILE_TOO_LARGE'
    } else if (error.message?.includes('parse') || error.message?.includes('JSON')) {
      errorMessage = 'Error analyzing files. Please check if the files are in a valid format.'
      errorCode = 'PARSE_ERROR'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        code: errorCode,
        suggestion: 'Please try again with smaller files or contact support if the problem persists.'
      },
      { status: 500 }
    )
  }
}
