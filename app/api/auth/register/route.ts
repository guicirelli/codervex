import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { hashPassword, generateToken } from '@/lib/core/auth'
import { validateRegisterForm, normalizeEmail } from '@/lib/utils/validation'
import { normalizeUsername, normalizeUsernameForDB } from '@/lib/utils/username-validation'
import { checkRateLimit, getClientIP, RATE_LIMIT_CONFIGS } from '@/lib/utils/rate-limit'
import { sendWelcomeEmail } from '@/lib/services/email.service'

/**
 * Rota de registro com validações completas e tratamento de todos os casos de erro
 */
export async function POST(request: NextRequest) {
  try {
    // Obter IP do cliente para rate limiting
    const clientIP = getClientIP(request)
    
    // Verificar rate limit
    const rateLimitResult = checkRateLimit(clientIP, RATE_LIMIT_CONFIGS.register)
    
    if (!rateLimitResult.allowed) {
      const message = rateLimitResult.blocked
        ? `Muitas tentativas de cadastro. Tente novamente em ${Math.ceil((rateLimitResult.blockUntil! - Date.now()) / 60000)} minutos.`
        : 'Muitas tentativas de cadastro. Tente novamente mais tarde.'
      
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

    const { name, email, password } = body

    // Validação básica de campos obrigatórios
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      )
    }

    // Validação completa do formulário
    const validation = validateRegisterForm({
      email,
      password,
      confirmPassword: password, // Não usado mais, mas mantido para compatibilidade
      name: name || undefined,
    })

    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Invalid data provided',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    // Normalizar e sanitizar dados
    const normalizedEmail = normalizeEmail(email)
    const normalizedUsername = normalizeUsernameForDB(name.trim())

    // Verificar se email já existe
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Verificar se username já existe
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: normalizedUsername },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { 
          error: 'An account with this email already exists. Please sign in instead.',
          suggestion: 'Tente fazer login ou recuperar sua senha'
        },
        { status: 409 } // Conflict
      )
    }

    if (existingUserByUsername) {
      return NextResponse.json(
        { 
          error: 'This username is already in use',
          suggestion: 'Please choose a different username'
        },
        { status: 409 } // Conflict
      )
    }


    // Hash da senha
    let hashedPassword: string
    try {
      hashedPassword = await hashPassword(password)
    } catch (error) {
      console.error('Erro ao fazer hash da senha:', error)
      return NextResponse.json(
        { error: 'Error processing password. Please try again.' },
        { status: 500 }
      )
    }

    // Criar usuário
    let user
    try {
      user = await prisma.user.create({
        data: {
          name: normalizedUsername, // Nome completo (legado)
          username: normalizedUsername, // Nome de usuário (identidade pública)
          email: normalizedEmail,
          password: hashedPassword,
          hasPassword: true,
          credits: 0,
          subscription: 'free',
        },
      })
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error)
      
      // Verificar se é erro de duplicação (race condition)
      if (error.code === 'P2002') {
        return NextResponse.json(
          { 
            error: 'This email is already registered. Please sign in instead.',
            suggestion: 'Tente fazer login'
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: 'Error creating account. Please try again.' },
        { status: 500 }
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
      // Tentar limpar usuário criado (rollback)
      try {
        await prisma.user.delete({ where: { id: user.id } })
      } catch (deleteError) {
        console.error('Erro ao fazer rollback:', deleteError)
      }
      
      return NextResponse.json(
        { error: 'Error creating session. Please try again.' },
        { status: 500 }
      )
    }

    // Criar resposta de sucesso
    const response = NextResponse.json({
      message: 'Conta criada com sucesso',
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

    // Enviar email de boas-vindas (assíncrono, não bloqueia resposta)
    sendWelcomeEmail(user.email, user.name || user.email.split('@')[0]).catch(
      (error) => {
        console.error('Erro ao enviar email de boas-vindas:', error)
        // Não falhar o registro se email falhar
      }
    )

    return response

  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error)
    
    // Não expor detalhes internos do erro
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    )
  }
}
