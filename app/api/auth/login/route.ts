import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { verifyPassword, generateToken } from '@/lib/core/auth'
import { validateLoginForm, normalizeEmail } from '@/lib/utils/validation'
import { checkRateLimit, getClientIP, RATE_LIMIT_CONFIGS } from '@/lib/utils/rate-limit'

/**
 * Rota de login com validações completas e tratamento de todos os casos de erro
 */
export async function POST(request: NextRequest) {
  try {
    // Obter IP do cliente para rate limiting
    const clientIP = getClientIP(request)
    
    // Verificar rate limit
    const rateLimitResult = checkRateLimit(clientIP, RATE_LIMIT_CONFIGS.login)
    
    if (!rateLimitResult.allowed) {
      const message = rateLimitResult.blocked
        ? `Muitas tentativas de login. Tente novamente em ${Math.ceil((rateLimitResult.blockUntil! - Date.now()) / 60000)} minutos.`
        : 'Muitas tentativas de login. Tente novamente mais tarde.'
      
      return NextResponse.json(
        { 
          error: message,
          rateLimit: {
            remaining: rateLimitResult.remaining,
            resetAt: rateLimitResult.resetAt,
          }
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
          }
        }
      )
    }

    // Parse do body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request format. Please send JSON data.' },
        { status: 400 }
      )
    }

    const { email, password } = body

    // Validação básica de campos
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validação completa do formulário
    const validation = validateLoginForm({ email, password })
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid data provided',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    // Normalizar email
    const normalizedEmail = normalizeEmail(email)

    // Buscar usuário (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Sempre retornar mensagem genérica para segurança (não revelar se email existe)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials and try again.' },
        { status: 401 }
      )
    }

    // Verificar se usuário tem senha (pode ter criado via OAuth)
    if (!user.password) {
      return NextResponse.json(
        { 
          error: 'This account was created with Google or GitHub. Please use social login instead.',
          requiresOAuth: true
        },
        { status: 401 }
      )
    }

    // Verificar senha
    let isValidPassword = false
    try {
      isValidPassword = await verifyPassword(password, user.password)
    } catch (error) {
      console.error('Erro ao verificar senha:', error)
      return NextResponse.json(
        { error: 'Error verifying credentials. Please try again.' },
        { status: 500 }
      )
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials and try again.' },
        { status: 401 }
      )
    }

    // Gerar token
    let token: string
    try {
      token = generateToken({
        userId: user.id,
        email: user.email,
      })
    } catch (error) {
      console.error('Erro ao gerar token:', error)
      return NextResponse.json(
        { error: 'Error creating session. Please try again.' },
        { status: 500 }
      )
    }

    // Criar resposta de sucesso
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        subscription: user.subscription,
      },
    })

    // Set cookie seguro
    const isProduction = process.env.NODE_ENV === 'production'
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (error: any) {
    console.error('Erro ao fazer login:', error)
    
    // Não expor detalhes internos do erro
    return NextResponse.json(
      { error: 'Error signing in. Please try again.' },
      { status: 500 }
    )
  }
}
