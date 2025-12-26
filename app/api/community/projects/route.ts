import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    // Buscar projetos públicos da comunidade
    const prompts = await prisma.prompt.findMany({
      where: {
        // Adicionar campo 'public' no schema futuramente
        // Por enquanto, retornar projetos recentes
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        content: true,
        stack: true,
        projectType: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    })

    // Transformar em formato de projeto da comunidade
    const projects = prompts.map((prompt) => {
      // Extrair funcionalidades do conteúdo
      const features = prompt.content
        .split('FUNCIONALIDADES')[1]
        ?.split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace('-', '').trim())
        .slice(0, 5) || []

      return {
        id: prompt.id,
        title: prompt.title || 'Projeto sem título',
        description: prompt.content.substring(0, 200) + '...',
        stack: prompt.stack?.split(', ') || [],
        features,
        author: prompt.user?.name || 'Anônimo',
        stars: Math.floor(Math.random() * 50) + 5, // Simulado
        uses: Math.floor(Math.random() * 100) + 10, // Simulado
      }
    })

    // Filtrar por busca se necessário
    const filteredProjects = search
      ? projects.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.stack.some((tech) => tech.toLowerCase().includes(search.toLowerCase()))
        )
      : projects

    return NextResponse.json({ projects: filteredProjects })
  } catch (error: any) {
    console.error('Erro ao buscar projetos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar projetos' },
      { status: 500 }
    )
  }
}

