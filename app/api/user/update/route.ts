import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { validateEmail } from '@/lib/utils/common'

export async function PUT(request: NextRequest) {
  try {
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

    const { name, email } = await request.json()

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Verificar se email já está em uso por outro usuário
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: payload.userId },
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já está em uso' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name: name || null,
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        subscription: true,
      },
    })

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      user,
    })
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil' },
      { status: 500 }
    )
  }
}

