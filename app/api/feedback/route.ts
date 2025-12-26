import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { logger } from '@/lib/core/logger'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { rating, feedback } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Avaliação inválida' }, { status: 400 })
    }

    // Salvar feedback (você pode criar uma tabela Feedback no Prisma se quiser)
    // Por enquanto, apenas logamos
    logger.info('Feedback recebido', {
      userId: decoded.userId,
      rating,
      feedback: feedback || 'Sem comentário',
    })

    // Aqui você pode salvar no banco de dados se criar a tabela
    // await prisma.feedback.create({
    //   data: {
    //     userId: decoded.userId,
    //     rating,
    //     feedback: feedback || null,
    //   },
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Erro ao processar feedback', { error })
    return NextResponse.json(
      { error: 'Erro ao processar feedback' },
      { status: 500 }
    )
  }
}

