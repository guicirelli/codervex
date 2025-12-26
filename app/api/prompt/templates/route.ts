import { NextRequest, NextResponse } from 'next/server'

// Templates de projetos por categoria
const projectTemplates = {
  'e-commerce': {
    title: 'E-commerce Completo',
    description: 'Loja online com carrinho, checkout e pagamentos',
    features: ['Carrinho', 'Checkout', 'Stripe', 'Perfil de usuário'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Prisma'],
  },
  'landing-page': {
    title: 'Landing Page CRO',
    description: 'Landing page otimizada para conversão',
    features: ['Hero', 'Features', 'Testimonials', 'Pricing', 'CTA'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  'dashboard': {
    title: 'Dashboard Admin',
    description: 'Painel administrativo com gráficos e tabelas',
    features: ['Métricas', 'Gráficos', 'Tabelas', 'CRUD'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Chart.js'],
  },
  'blog': {
    title: 'Blog Moderno',
    description: 'Blog com CMS e sistema de comentários',
    features: ['Posts', 'Categorias', 'Comentários', 'Busca'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX'],
  },
  'saas': {
    title: 'SaaS App',
    description: 'Aplicação SaaS completa com assinaturas',
    features: ['Autenticação', 'Assinaturas', 'Dashboard', 'Billing'],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (category && projectTemplates[category as keyof typeof projectTemplates]) {
    return NextResponse.json({
      template: projectTemplates[category as keyof typeof projectTemplates],
    })
  }

  return NextResponse.json({ templates: projectTemplates })
}

