import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'

/**
 * GET /api/auth/providers
 * Retorna os métodos de login vinculados à conta do usuário
 */
export async function GET(request: NextRequest) {
  try {
    // Tentar obter do Clerk primeiro
    let clerkUserId: string | null = null
    try {
      const { userId } = await auth()
      clerkUserId = userId
    } catch {
      // Se falhar, tentar pelo token JWT
    }

    // Se não tiver Clerk, usar token JWT
    let userId: string | null = null
    if (!clerkUserId) {
      const token = getTokenFromRequest(request)
      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    } else {
      userId = clerkUserId
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Buscar usuário no banco (por clerkId ou id)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { id: userId },
        ],
      },
      select: {
        id: true,
        email: true,
        hasPassword: true,
        hasGoogle: true,
        hasGithub: true,
        clerkId: true,
      },
    })

    if (!user) {
      // Se usuário não existe no banco, criar com dados do Clerk
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const clerkClientInstance = await clerkClient()
        const clerkUser = await clerkClientInstance.users.getUser(userId)
        const email = clerkUser.emailAddresses?.[0]?.emailAddress
        
        if (!email) {
          return NextResponse.json(
            { error: 'Email não encontrado' },
            { status: 404 }
          )
        }

        // Criar usuário no banco
        const newUser = await prisma.user.create({
          data: {
            email: email.toLowerCase().trim(),
            clerkId: userId,
            hasGoogle: clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_google') || false,
            hasGithub: clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_github') || false,
            hasPassword: !!clerkUser.passwordEnabled,
            credits: 0,
            subscription: 'free',
            identityStatus: 'pending',
          },
        })

        return NextResponse.json({
          providers: {
            email: newUser.hasPassword,
            google: newUser.hasGoogle,
            github: newUser.hasGithub,
          },
          activeMethods: [
            newUser.hasPassword,
            newUser.hasGoogle,
            newUser.hasGithub,
          ].filter(Boolean).length,
          canRemove: false, // Não pode remover se só tem 1 método
        })
      } catch (createError: any) {
        console.error('Erro ao criar usuário:', createError)
        
        // Se for erro de constraint única, tentar buscar o usuário existente
        if (createError.code === 'P2002') {
          try {
            const existingUser = await prisma.user.findFirst({
              where: {
                OR: [
                  { clerkId: userId },
                  { email: email.toLowerCase().trim() },
                ],
              },
              select: {
                id: true,
                email: true,
                hasPassword: true,
                hasGoogle: true,
                hasGithub: true,
                clerkId: true,
              },
            })
            
            if (existingUser) {
              return NextResponse.json({
                providers: {
                  email: existingUser.hasPassword,
                  google: existingUser.hasGoogle,
                  github: existingUser.hasGithub,
                },
                activeMethods: [
                  existingUser.hasPassword,
                  existingUser.hasGoogle,
                  existingUser.hasGithub,
                ].filter(Boolean).length,
                canRemove: false,
              })
            }
          } catch (lookupError) {
            console.error('Error looking up existing user:', lookupError)
          }
        }
        
        return NextResponse.json(
          { error: 'Error fetching authentication methods. Please try again.' },
          { status: 500 }
        )
      }
    }

    // Se tiver Clerk ID, buscar informações do Clerk
    let clerkProviders = {
      google: user.hasGoogle,
      github: user.hasGithub,
    }

    if (user.clerkId) {
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const clerkClientInstance = await clerkClient()
        const clerkUser = await clerkClientInstance.users.getUser(user.clerkId)
        
        // Verificar quais providers estão vinculados no Clerk
        clerkProviders = {
          google: clerkUser.externalAccounts?.some(
            (account) => account.provider === 'oauth_google'
          ) || false,
          github: clerkUser.externalAccounts?.some(
            (account) => account.provider === 'oauth_github'
          ) || false,
        }

        // Sincronizar com banco de dados
        if (
          clerkProviders.google !== user.hasGoogle ||
          clerkProviders.github !== user.hasGithub
        ) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              hasGoogle: clerkProviders.google,
              hasGithub: clerkProviders.github,
            },
          })
        }
      } catch (clerkError) {
        console.error('Erro ao buscar do Clerk:', clerkError)
        // Continuar com dados do banco
      }
    }

    // Montar resposta
    const providers = {
      email: user.hasPassword,
      google: clerkProviders.google,
      github: clerkProviders.github,
    }

    // Contar métodos ativos
    const activeMethods = Object.values(providers).filter(Boolean).length

    return NextResponse.json({
      providers,
      activeMethods,
      canRemove: activeMethods > 1, // Só pode remover se tiver mais de 1 método
    })

  } catch (error: any) {
    console.error('Erro ao buscar providers:', error)
    
    // Melhorar mensagens de erro
    let errorMessage = 'Error fetching authentication providers'
    let statusCode = 500
    
    if (error.message?.includes('prisma') || error.message?.includes('database') || error.code === 'P1001') {
      errorMessage = 'Database connection error. Please try again later.'
      statusCode = 503
    } else if (error.message?.includes('clerk') || error.message?.includes('authentication')) {
      errorMessage = 'Authentication service error. Please try signing in again.'
      statusCode = 503
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

/**
 * DELETE /api/auth/providers?provider=google|github|password
 * Remove um provider vinculado
 */
export async function DELETE(request: NextRequest) {
  try {
    // Tentar obter do Clerk primeiro
    let clerkUserId: string | null = null
    try {
      const { userId } = await auth()
      clerkUserId = userId
    } catch {
      // Se falhar, tentar pelo token JWT
    }

    // Se não tiver Clerk, usar token JWT
    let userId: string | null = null
    if (!clerkUserId) {
      const token = getTokenFromRequest(request)
      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    } else {
      userId = clerkUserId
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const provider = url.searchParams.get('provider')

    if (!provider || !['google', 'github', 'password'].includes(provider)) {
      return NextResponse.json(
        { error: 'Provider inválido' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { id: userId },
        ],
      },
      select: {
        id: true,
        hasPassword: true,
        hasGoogle: true,
        hasGithub: true,
        clerkId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Contar métodos ativos
    const activeMethods = [
      user.hasPassword,
      user.hasGoogle,
      user.hasGithub,
    ].filter(Boolean).length

    // Não permitir remover se for o último método
    if (activeMethods <= 1) {
      return NextResponse.json(
        { 
          error: 'Você precisa ter pelo menos um método de login ativo',
          requiresAnotherMethod: true
        },
        { status: 400 }
      )
    }

    // Verificar se o método está vinculado
    const isLinked = 
      (provider === 'password' && user.hasPassword) ||
      (provider === 'google' && user.hasGoogle) ||
      (provider === 'github' && user.hasGithub)

    if (!isLinked) {
      return NextResponse.json(
        { error: 'Este método não está vinculado' },
        { status: 400 }
      )
    }

    // Remover do banco
    const updateData: any = {}
    if (provider === 'password') {
      updateData.hasPassword = false
      updateData.password = null
    } else if (provider === 'google') {
      updateData.hasGoogle = false
    } else if (provider === 'github') {
      updateData.hasGithub = false
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    // Se for OAuth e tiver Clerk ID, também remover do Clerk
    if ((provider === 'google' || provider === 'github') && user.clerkId) {
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const clerkClientInstance = await clerkClient()
        const clerkUser = await clerkClientInstance.users.getUser(user.clerkId)
        const externalAccount = clerkUser.externalAccounts?.find(
          (account) => account.provider === `oauth_${provider}`
        )

        if (externalAccount) {
          const { clerkClient } = await import('@clerk/nextjs/server')
          const clerkClientInstance = await clerkClient()
          await clerkClientInstance.users.deleteUserExternalAccount({
            userId: user.clerkId,
            externalAccountId: externalAccount.id,
          })
        }
      } catch (clerkError) {
        console.error('Erro ao remover do Clerk:', clerkError)
        // Continuar mesmo se falhar no Clerk
      }
    }

    return NextResponse.json({
      message: 'Método de login removido com sucesso',
    })

  } catch (error: any) {
    console.error('Erro ao remover provider:', error)
    return NextResponse.json(
      { error: 'Erro ao remover método de login' },
      { status: 500 }
    )
  }
}
