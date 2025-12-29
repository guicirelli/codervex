import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { normalizeEmail } from '@/lib/utils/validation'
import { generateUsernameSuggestions } from '@/lib/utils/username-validation'

/**
 * POST /api/auth/sync-identity
 * Sincroniza identidade após OAuth ou criação de conta
 * Resolve todos os casos de erro de sincronização
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Buscar dados do Clerk
    const clerkClientInstance = await clerkClient()
    const clerkUser = await clerkClientInstance.users.getUser(userId)
    const email = clerkUser.emailAddresses?.[0]?.emailAddress
    const emailVerified = clerkUser.emailAddresses?.[0]?.verification?.status === 'verified'

    if (!email) {
      return NextResponse.json(
        { error: 'Email não encontrado no Clerk' },
        { status: 400 }
      )
    }

    // Verificar se email está verificado (proteção contra account takeover)
    if (!emailVerified) {
      return NextResponse.json(
        { 
          error: 'Email não verificado',
          requiresVerification: true 
        },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)

    // Buscar usuário existente por email OU clerkId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { clerkId: userId },
        ],
      },
    })

    // Verificar providers do Clerk
    const externalAccounts = clerkUser.externalAccounts || []
    const hasGoogle = externalAccounts.some(acc => acc.provider === 'oauth_google')
    const hasGithub = externalAccounts.some(acc => acc.provider === 'oauth_github')
    const hasPassword = !!clerkUser.passwordEnabled

    if (user) {
      // CASO 1: Usuário existe - atualizar/sincronizar
      
      // Verificar se email já está em outra conta (proteção contra duplicação)
      const emailConflict = await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id: user.id },
        },
      })

      if (emailConflict) {
        return NextResponse.json(
          { 
            error: 'Este email já está vinculado a outra conta',
            conflict: true 
          },
          { status: 409 }
        )
      }

      // Atualizar dados
      const updateData: any = {
        email: normalizedEmail,
        clerkId: userId,
        hasGoogle,
        hasGithub,
        hasPassword,
        identityStatus: user.identityStatus === 'pending' ? 'pending' : 'active',
      }

      // Atualizar nome/avatar se vier do OAuth e não existir
      if (!user.displayName && clerkUser.firstName) {
        updateData.displayName = clerkUser.firstName + (clerkUser.lastName ? ` ${clerkUser.lastName}` : '')
      }

      if (!user.avatar && clerkUser.imageUrl) {
        updateData.avatar = clerkUser.imageUrl
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      })

      return NextResponse.json({
        message: 'Identidade sincronizada',
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          identityStatus: user.identityStatus,
        },
        needsUsername: !user.username,
        suggestions: user.username ? [] : generateUsernameSuggestions(
          user.displayName || user.name || undefined,
          user.email || undefined
        ),
      })

    } else {
      // CASO 2: Usuário não existe - criar nova conta
      
      // Verificar se email já existe (proteção dupla)
      const existingEmail = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      })

      if (existingEmail) {
        // Email existe mas clerkId diferente - vincular
        const updated = await prisma.user.update({
          where: { id: existingEmail.id },
          data: {
            clerkId: userId,
            hasGoogle: hasGoogle || existingEmail.hasGoogle,
            hasGithub: hasGithub || existingEmail.hasGithub,
            hasPassword: hasPassword || existingEmail.hasPassword,
            identityStatus: existingEmail.identityStatus === 'pending' ? 'pending' : 'active',
          },
        })

        return NextResponse.json({
          message: 'Conta vinculada com sucesso',
          user: {
            id: updated.id,
            username: updated.username,
            displayName: updated.displayName,
            email: updated.email,
            identityStatus: updated.identityStatus,
          },
          needsUsername: !updated.username,
          suggestions: updated.username ? [] : generateUsernameSuggestions(
            updated.displayName || updated.name || undefined,
            updated.email || undefined
          ),
        })
      }

      // Criar nova conta
      const newUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          clerkId: userId,
          displayName: clerkUser.firstName 
            ? `${clerkUser.firstName}${clerkUser.lastName ? ` ${clerkUser.lastName}` : ''}`
            : null,
          avatar: clerkUser.imageUrl || null,
          hasGoogle,
          hasGithub,
          hasPassword,
          identityStatus: 'pending', // Precisa definir username
          credits: 0,
          subscription: 'free',
        },
      })

      return NextResponse.json({
        message: 'Conta criada com sucesso',
        user: {
          id: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
          email: newUser.email,
          identityStatus: newUser.identityStatus,
        },
        needsUsername: true,
        suggestions: generateUsernameSuggestions(
          newUser.displayName || newUser.name || undefined,
          newUser.email || undefined
        ),
      })
    }

  } catch (error: any) {
    console.error('Erro ao sincronizar identidade:', error)
    
    // Tratar erro de constraint única
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Conflito de dados. Tente novamente.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao sincronizar identidade' },
      { status: 500 }
    )
  }
}

