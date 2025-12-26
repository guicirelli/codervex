import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Buscar estatísticas do usuário
    const [totalPrompts, favoritePrompts, thisMonthPrompts, allPrompts] = await Promise.all([
      prisma.prompt.count({
        where: { userId: payload.userId },
      }),
      prisma.prompt.count({
        where: { 
          userId: payload.userId,
          isFavorite: true,
        },
      }),
      prisma.prompt.count({
        where: {
          userId: payload.userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.prompt.findMany({
        where: { userId: payload.userId },
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Calcular streak (dias consecutivos)
    let streak = 0
    if (allPrompts.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let currentDate = new Date(allPrompts[0].createdAt)
      currentDate.setHours(0, 0, 0, 0)
      
      if (currentDate.getTime() === today.getTime() || 
          currentDate.getTime() === today.getTime() - 86400000) {
        streak = 1
        for (let i = 1; i < allPrompts.length; i++) {
          const promptDate = new Date(allPrompts[i].createdAt)
          promptDate.setHours(0, 0, 0, 0)
          const expectedDate = new Date(currentDate)
          expectedDate.setDate(expectedDate.getDate() - 1)
          
          if (promptDate.getTime() === expectedDate.getTime()) {
            streak++
            currentDate = promptDate
          } else {
            break
          }
        }
      }
    }

    return NextResponse.json({
      totalPrompts,
      favoritePrompts,
      thisMonth: thisMonthPrompts,
      streak,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

