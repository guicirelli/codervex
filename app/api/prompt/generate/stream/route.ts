import { NextRequest } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { analyzeFiles, extractZipFiles } from '@/lib/services/file-analyzer.service'
import { generateSuperPrompt } from '@/lib/services/prompt-generator.service'
import { logger } from '@/lib/core/logger'

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendProgress = (progress: number, message: string) => {
        const data = JSON.stringify({ progress, message, type: 'progress' })
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      try {
        // Verificar autenticação
        const token = getTokenFromRequest(request)
        if (!token) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Não autenticado', type: 'error' })}\n\n`))
          controller.close()
          return
        }

        const payload = verifyToken(token)
        if (!payload) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Token inválido', type: 'error' })}\n\n`))
          controller.close()
          return
        }

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        })

        if (!user) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Usuário não encontrado', type: 'error' })}\n\n`))
          controller.close()
          return
        }

        // Verificar créditos
        const isFirstPrompt = user.credits === 0 && user.subscription === 'free'
        const hasCredits = user.subscription === 'monthly' || user.credits > 0
        
        if (!isFirstPrompt && !hasCredits) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Créditos insuficientes', type: 'error' })}\n\n`))
          controller.close()
          return
        }

        sendProgress(10, 'Recebendo arquivos...')

        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        let allFiles: File[] = []

        sendProgress(20, 'Processando arquivos...')

        if (files && files.length > 0) {
          const zipFile = files.find(f => f.name.endsWith('.zip'))
          if (zipFile) {
            try {
              sendProgress(30, 'Extraindo arquivo ZIP...')
              const extractedFiles = await extractZipFiles(zipFile)
              allFiles = [...files.filter(f => !f.name.endsWith('.zip')), ...extractedFiles]
              logger.info('ZIP extracted', { fileCount: extractedFiles.length })
            } catch (error) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Erro ao extrair ZIP', type: 'error' })}\n\n`))
              controller.close()
              return
            }
          } else {
            allFiles = Array.from(files)
          }
        }

        if (allFiles.length === 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Nenhum arquivo fornecido', type: 'error' })}\n\n`))
          controller.close()
          return
        }

        // Validar tamanho
        const totalSize = allFiles.reduce((sum: number, file: File) => sum + file.size, 0)
        const maxSize = 50 * 1024 * 1024
        if (totalSize > maxSize) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Tamanho excede 50MB', type: 'error' })}\n\n`))
          controller.close()
          return
        }

        sendProgress(40, 'Analisando arquivos...')

        // Analisar arquivos
        const analysis = await analyzeFiles(allFiles)

        sendProgress(60, 'Lendo conteúdo dos arquivos...')

        // Ler conteúdo
        const fileContents: string[] = []
        const importantFiles = allFiles.filter((f: File) => {
          const name = f.name.toLowerCase()
          return name.includes('package.json') || 
                 name.includes('component') || 
                 name.includes('page') || 
                 name.endsWith('.tsx') || 
                 name.endsWith('.jsx') ||
                 name.includes('app/') ||
                 name.includes('pages/')
        })
        
        const filesToRead = [
          ...importantFiles.slice(0, 10),
          ...allFiles.filter(f => !importantFiles.includes(f)).slice(0, 5)
        ]
        
        for (const file of filesToRead) {
          try {
            const content = await file.text()
            const limitedContent = content.length > 50000 ? content.substring(0, 50000) + '\n// ... (arquivo truncado) ...' : content
            fileContents.push(`// ${file.name}\n${limitedContent}`)
          } catch (e) {
            // Ignorar arquivos binários
          }
        }

        sendProgress(80, 'Gerando superprompt...')

        // Gerar superprompt
        const prompt = await generateSuperPrompt(analysis, fileContents)

        sendProgress(90, 'Salvando no histórico...')

        // Salvar prompt
        const savedPrompt = await prisma.prompt.create({
          data: {
            userId: user.id,
            title: `Projeto ${new Date().toLocaleDateString('pt-BR')}`,
            content: prompt,
            projectType: analysis.stack.join(', ') || 'Desconhecido',
            stack: analysis.stack.join(', '),
          },
        })

        // Deduzir crédito
        if (user.subscription !== 'monthly' && !isFirstPrompt) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              credits: {
                decrement: 1,
              },
            },
          })
        }

        sendProgress(100, 'Concluído!')

        // Enviar resultado final
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          prompt, 
          promptId: savedPrompt.id, 
          analysis,
          type: 'complete'
        })}\n\n`))

        controller.close()
      } catch (error: any) {
        logger.error('Error in stream', { error: error.message })
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          error: error.message || 'Erro ao processar', 
          type: 'error' 
        })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

