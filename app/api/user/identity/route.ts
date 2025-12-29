import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { validateUsernameFormat, normalizeUsername, normalizeUsernameForDB, canChangeUsername } from '@/lib/utils/username-validation'

/**
 * GET /api/user/identity
 * Retorna informações da identidade do usuário
 */
export async function GET(request: NextRequest) {
  try {
    // Tentar obter do Clerk primeiro
    let userId: string | null = null
    
    try {
      const { userId: clerkUserId } = await auth()
      if (clerkUserId) {
        userId = clerkUserId
      }
    } catch {
      // Se falhar, tentar pelo token JWT
    }

    // Se não tiver Clerk, usar token JWT
    if (!userId) {
      const token = getTokenFromRequest(request)
      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in to continue.' },
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
        username: true,
        displayName: true,
        avatar: true,
        email: true,
        dataNascimento: true,
        localizacao: true,
        identityStatus: true,
        lastUsernameChange: true,
        hasGoogle: true,
        hasGithub: true,
        hasPassword: true,
      },
    })

    if (!user) {
      // Se usuário não existe no banco, tentar criar com dados do Clerk
      try {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const clerkClientInstance = await clerkClient()
        const clerkUser = await clerkClientInstance.users.getUser(userId)
        const email = clerkUser.emailAddresses?.[0]?.emailAddress

        if (!email) {
          return NextResponse.json(
            { error: 'Email not found in authentication system. Please contact support.' },
            { status: 404 }
          )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Verificar se email já existe
        const existingUserByEmail = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        })

        let newUser
        if (existingUserByEmail) {
          // Se existe, atualizar com clerkId
          newUser = await prisma.user.update({
            where: { id: existingUserByEmail.id },
            data: {
              clerkId: userId,
              hasGoogle: clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_google') || existingUserByEmail.hasGoogle,
              hasGithub: clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_github') || existingUserByEmail.hasGithub,
              hasPassword: !!clerkUser.passwordEnabled || existingUserByEmail.hasPassword,
            },
          })
        } else {
          // Criar usuário no banco
          newUser = await prisma.user.create({
            data: {
              email: normalizedEmail,
              clerkId: userId,
              hasGoogle: clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_google') || false,
              hasGithub: clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_github') || false,
              hasPassword: !!clerkUser.passwordEnabled,
              credits: 0,
              subscription: 'free',
              identityStatus: 'pending',
            },
          })
        }

        return NextResponse.json({
          identity: {
            username: newUser.username,
            displayName: newUser.displayName,
            avatar: newUser.avatar,
            email: newUser.email,
            dataNascimento: newUser.dataNascimento,
            localizacao: newUser.localizacao,
            status: newUser.identityStatus,
            hasGoogle: newUser.hasGoogle,
            hasGithub: newUser.hasGithub,
            hasPassword: newUser.hasPassword,
          },
          canChangeUsername: true,
          nextUsernameChangeDate: null,
        })
      } catch (createError: any) {
        console.error('Error creating user:', createError)
        // Se for erro de constraint única, tentar buscar o usuário existente
        if (createError.code === 'P2002') {
          try {
            const existingUser = await prisma.user.findFirst({
              where: {
                OR: [
                  { clerkId: userId },
                ],
              },
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                email: true,
                dataNascimento: true,
                localizacao: true,
                identityStatus: true,
                hasGoogle: true,
                hasGithub: true,
                hasPassword: true,
              },
            })

            if (existingUser) {
              return NextResponse.json({
                identity: {
                  username: existingUser.username,
                  displayName: existingUser.displayName,
                  avatar: existingUser.avatar,
                  email: existingUser.email,
                  dataNascimento: existingUser.dataNascimento,
                  localizacao: existingUser.localizacao,
                  status: existingUser.identityStatus,
                  hasGoogle: existingUser.hasGoogle,
                  hasGithub: existingUser.hasGithub,
                  hasPassword: existingUser.hasPassword,
                },
                canChangeUsername: true,
                nextUsernameChangeDate: null,
              })
            }
          } catch (lookupError) {
            console.error('Error looking up existing user:', lookupError)
          }
        }
        return NextResponse.json(
          { error: 'Error creating user account. Please try signing in again.' },
          { status: 500 }
        )
      }
    }

    // Verificar se pode alterar username
    const canChange = canChangeUsername(user.lastUsernameChange)
    const nextChangeDate = user.lastUsernameChange
      ? new Date(user.lastUsernameChange.getTime() + 30 * 24 * 60 * 60 * 1000)
      : null

    return NextResponse.json({
      identity: {
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
        dataNascimento: user.dataNascimento,
        localizacao: user.localizacao,
        status: user.identityStatus,
        hasGoogle: user.hasGoogle,
        hasGithub: user.hasGithub,
        hasPassword: user.hasPassword,
      },
      canChangeUsername: canChange,
      nextUsernameChangeDate: nextChangeDate,
    })

  } catch (error: any) {
    console.error('Erro ao buscar identidade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar identidade' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/user/identity
 * Atualiza identidade do usuário (username, displayName, avatar)
 */
export async function PUT(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in to continue.' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token. Please sign in again.' },
        { status: 401 }
      )
    }

    // Tentar obter do Clerk primeiro
    let userId: string | null = null
    
    try {
      const { userId: clerkUserId } = await auth()
      if (clerkUserId) {
        userId = clerkUserId
      }
    } catch {
      // Se falhar, tentar pelo token JWT
    }

    // Se não tiver Clerk, usar token JWT
    if (!userId) {
      const token = getTokenFromRequest(request)
      if (token) {
        const payload = verifyToken(token)
        if (payload) {
          userId = payload.userId
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in to continue.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { username, displayName, avatar } = body

    // Buscar usuário atual
    const currentUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { id: userId },
        ],
      },
      select: {
        id: true,
        username: true,
        lastUsernameChange: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Atualizar username (se fornecido e diferente)
    if (username && username !== currentUser.username) {
      // Validar formato
      const validation = validateUsernameFormat(username)
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        )
      }

      // Verificar se pode alterar
      if (!canChangeUsername(currentUser.lastUsernameChange)) {
        const nextChange = new Date(currentUser.lastUsernameChange!.getTime() + 30 * 24 * 60 * 60 * 1000)
        return NextResponse.json(
          {
            error: 'You can only change your username once every 30 days',
            nextChangeDate: nextChange,
          },
          { status: 400 }
        )
      }

      const normalizedUsername = normalizeUsernameForDB(username)

      // Verificar se já existe
      const existingUser = await prisma.user.findUnique({
        where: { username: normalizedUsername },
      })

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'This username is already in use' },
          { status: 409 }
        )
      }

      updateData.username = normalizedUsername
      updateData.lastUsernameChange = new Date()
    }

    // Atualizar displayName
    if (displayName !== undefined) {
      const trimmed = displayName?.trim() || null
      if (trimmed && trimmed.length > 100) {
        return NextResponse.json(
          { error: 'Display name is too long. Maximum length is 100 characters' },
          { status: 400 }
        )
      }
      updateData.displayName = trimmed
    }

    // Atualizar avatar
    if (avatar !== undefined) {
      // Validar URL (básico)
      if (avatar && avatar.length > 500) {
        return NextResponse.json(
          { error: 'Avatar URL is too long. Please use a shorter URL' },
          { status: 400 }
        )
      }
      updateData.avatar = avatar || null
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        email: true,
        identityStatus: true,
        lastUsernameChange: true,
      },
    })

    return NextResponse.json({
      message: 'Identidade atualizada com sucesso',
      identity: {
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
        status: updatedUser.identityStatus,
      },
    })

  } catch (error: any) {
    console.error('Erro ao atualizar identidade:', error)
    
    // Tratar erro de constraint única
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This username is already in use' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error updating identity. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/identity/check-username
 * Verifica disponibilidade de username
 */
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Validar formato
    const validation = validateUsernameFormat(username)
    if (!validation.valid) {
      return NextResponse.json({
        available: false,
        error: validation.error,
      })
    }

    const normalizedUsername = normalizeUsernameForDB(username)

    // Verificar se existe
    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername },
      select: { id: true },
    })

    return NextResponse.json({
      available: !existingUser,
      username: normalizedUsername,
    })

  } catch (error: any) {
    console.error('Erro ao verificar username:', error)
    return NextResponse.json(
      { error: 'Error checking username availability. Please try again.' },
      { status: 500 }
    )
  }
}

