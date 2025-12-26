import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'
import { getTokenFromRequest, verifyToken } from '@/lib/core/auth'

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

