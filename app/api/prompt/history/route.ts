import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    // Buscar histórico de prompts
    const prompts = await prisma.prompt.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
      select: {
        id: true,
        title: true,
        content: true,
        projectType: true,
        stack: true,
        isFavorite: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ prompts })
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}

