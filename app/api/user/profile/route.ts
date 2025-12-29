import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { validateUsernameFormat, normalizeUsername, normalizeUsernameForDB } from '@/lib/utils/username-validation'

/**
 * PUT /api/user/profile
 * Atualiza perfil do usuário (username, displayName, avatar, dataNascimento, localizacao)
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { username, displayName, avatar, dataNascimento, localizacao } = body

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
        { error: 'User not found. Please try signing in again.' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Atualizar username (se fornecido e diferente)
    if (username !== undefined && username !== currentUser.username) {
      if (username && username.trim().length > 0) {
        // Validar formato
        const validation = validateUsernameFormat(username)
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
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
      } else {
        updateData.username = null
      }
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
      // Se for base64, pode ser muito longo - permitir até 1MB (base64)
      if (avatar && avatar.length > 1000000) {
        return NextResponse.json(
          { error: 'Avatar image is too large. Please use a smaller image.' },
          { status: 400 }
        )
      }
      updateData.avatar = avatar || null
    }

    // Atualizar data de nascimento
    if (dataNascimento !== undefined) {
      updateData.dataNascimento = dataNascimento 
        ? new Date(dataNascimento)
        : null
    }

    // Atualizar localização
    if (localizacao !== undefined) {
      const trimmed = localizacao?.trim() || null
      if (trimmed && trimmed.length > 100) {
        return NextResponse.json(
          { error: 'Location is too long. Maximum length is 100 characters' },
          { status: 400 }
        )
      }
      updateData.localizacao = trimmed
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
        dataNascimento: true,
        localizacao: true,
        identityStatus: true,
      },
    })

    return NextResponse.json({
      message: 'Perfil atualizado com sucesso',
      identity: {
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
        dataNascimento: updatedUser.dataNascimento,
        localizacao: updatedUser.localizacao,
        status: updatedUser.identityStatus,
      },
    })

  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error)
    
    // Tratar erro de constraint única
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This username is already in use' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error updating profile. Please try again.' },
      { status: 500 }
    )
  }
}

