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

    // TODO: Verificar se usuário é admin
    // Por enquanto, qualquer usuário autenticado pode acessar
    // Adicione verificação de role/admin no schema do Prisma

    // Buscar estatísticas
    const [totalUsers, totalPrompts, payments, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.prompt.count(),
      prisma.payment.findMany({
        where: { status: 'succeeded' },
      }),
      prisma.user.count({
        where: { subscription: 'monthly' },
      }),
    ])

    const totalRevenue = payments.reduce((sum: number, payment: { amount: number }) => {
      // Converter centavos para reais
      return sum + (payment.amount / 100)
    }, 0)

    return NextResponse.json({
      totalUsers,
      totalPrompts,
      totalRevenue,
      activeSubscriptions,
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

