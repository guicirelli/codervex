import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Buscar prompt
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        projectType: true,
        stack: true,
        createdAt: true,
        userId: true,
      },
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Verificar se o prompt pertence ao usuário
    if (prompt.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied. This analysis does not belong to you.' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: prompt.id,
      prompt: prompt.content,
      summary: {
        technologies: prompt.stack ? prompt.stack.split(',').map(s => s.trim()) : [],
        structure: prompt.projectType || 'Unknown',
        features: [],
      },
      createdAt: prompt.createdAt.toISOString(),
    })
  } catch (error: any) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Error fetching analysis. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id },
    })

    if (!prompt || prompt.userId !== payload.userId) {
      return NextResponse.json({ error: 'Prompt não encontrado' }, { status: 404 })
    }

    await prisma.prompt.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Prompt excluído com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao excluir prompt' },
      { status: 500 }
    )
  }
}

