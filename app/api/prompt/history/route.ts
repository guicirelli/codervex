import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'

export const dynamic = 'force-dynamic'

async function ensureDbUserFromClerk(clerkUserId: string) {
  // If DB is not configured, history cannot be stored.
  if (!process.env.DATABASE_URL) return null

  const { clerkClient } = await import('@clerk/nextjs/server')
  const clerkClientInstance = await clerkClient()
  const clerkUser = await clerkClientInstance.users.getUser(clerkUserId)
  const email = clerkUser.emailAddresses?.[0]?.emailAddress?.toLowerCase().trim()
  if (!email) return null

  const hasGoogle = clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_google') || false
  const hasGithub = clerkUser.externalAccounts?.some(acc => acc.provider === 'oauth_github') || false
  const hasPassword = !!clerkUser.passwordEnabled

  // Find by clerkId OR email, then link/insert deterministically
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ clerkId: clerkUserId }, { email }],
    },
    select: { id: true },
  })

  if (existing) {
    return await prisma.user.update({
      where: { id: existing.id },
      data: {
        clerkId: clerkUserId,
        email,
        hasGoogle,
        hasGithub,
        hasPassword,
        identityStatus: 'active',
        displayName:
          clerkUser.firstName || clerkUser.lastName
            ? `${clerkUser.firstName || ''}${clerkUser.lastName ? ` ${clerkUser.lastName}` : ''}`.trim()
            : undefined,
        avatar: clerkUser.imageUrl || undefined,
      },
      select: { id: true },
    })
  }

  return await prisma.user.create({
    data: {
      email,
      clerkId: clerkUserId,
      hasGoogle,
      hasGithub,
      hasPassword,
      credits: 0,
      subscription: 'free',
      identityStatus: 'active',
      displayName:
        clerkUser.firstName || clerkUser.lastName
          ? `${clerkUser.firstName || ''}${clerkUser.lastName ? ` ${clerkUser.lastName}` : ''}`.trim()
          : null,
      avatar: clerkUser.imageUrl || null,
    },
    select: { id: true },
  })
}

export async function GET(request: NextRequest) {
  try {
    // If the DB isn't configured (common in local dev), do not throw 500.
    // Return an empty history with an explicit flag so the UI can show a friendly message.
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        prompts: [],
        storageAvailable: false,
        warning: 'Prompt history is disabled because DATABASE_URL is not configured.',
      })
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

    // Buscar usuário no banco para obter o ID interno
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { id: userId },
        ],
      },
      select: {
        id: true,
      },
    })

    if (!user) {
      // If authenticated via Clerk but missing from DB, create/link automatically
      try {
        user = await ensureDbUserFromClerk(userId)
      } catch (e) {
        // fall through
      }
      if (!user) {
        return NextResponse.json(
          { error: 'User not found. Please try signing in again.' },
          { status: 404 }
        )
      }
    }

    // Buscar histórico de prompts
    const prompts = await prisma.prompt.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
      select: {
        id: true,
        title: true,
        content: true,
        projectType: true,
        stack: true,
        isFavorite: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ prompts })
  } catch (error: any) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Error fetching prompt history. Please try again.' },
      { status: 500 }
    )
  }
}

