import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'

export const dynamic = 'force-dynamic'

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

    // Buscar usuário no banco para obter o ID interno
    const user = await prisma.user.findFirst({
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
      return NextResponse.json(
        { error: 'User not found. Please try signing in again.' },
        { status: 404 }
      )
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

