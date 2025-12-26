import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { hashPassword, generateToken } from '@/lib/core/auth'
import { sendWelcomeEmail } from '@/lib/services/email.service'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Criar usuário
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0],
        email,
        password: hashedPassword,
        credits: 0, // Começa com 0, mas tem direito a 1 prompt gratuito
        subscription: 'free',
      },
    })

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    })

    const response = NextResponse.json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        subscription: user.subscription,
      },
    })

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Enviar email de boas-vindas (assíncrono)
    sendWelcomeEmail(user.email, user.name || user.email.split('@')[0]).catch(
      (error) => console.error('Erro ao enviar email de boas-vindas:', error)
    )

    return response
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    )
  }
}

