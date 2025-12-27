import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/core/database'

// Seed de projetos exemplo para a comunidade
const exampleProjects = [
  {
    title: 'E-commerce Moderno',
    description: 'Loja online completa com carrinho, checkout e integração com Stripe. Design moderno e responsivo.',
    stack: 'Next.js, TypeScript, Tailwind CSS, Stripe, Prisma',
    features: ['Carrinho de compras', 'Checkout', 'Perfil de usuário', 'Histórico de pedidos'],
    content: `Crie um e-commerce completo usando Next.js 14, TypeScript e Tailwind CSS.

STACK TECNOLÓGICA:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Stripe (pagamentos)
- Prisma + PostgreSQL
- NextAuth.js (autenticação)

FUNCIONALIDADES PRINCIPAIS:
- Catálogo de produtos com busca e filtros
- Carrinho de compras persistente
- Checkout completo com Stripe
- Perfil de usuário
- Histórico de pedidos
- Dashboard administrativo

ESTRUTURA:
/app
  /products (listagem e detalhes)
  /cart (carrinho)
  /checkout (finalização)
  /dashboard (admin)
/components
  ProductCard, CartItem, CheckoutForm
/lib
  stripe.ts, db.ts

Gere o projeto completo agora:`,
    isPublic: true,
  },
  {
    title: 'Landing Page CRO Otimizada',
    description: 'Landing page otimizada para conversão com seções estratégicas, CTAs e formulários.',
    stack: 'Next.js, TypeScript, Tailwind CSS, Framer Motion',
    features: ['Hero section', 'Features', 'Testimonials', 'Pricing', 'CTA'],
    content: `Crie uma landing page otimizada para conversão usando Next.js e Tailwind CSS.

STACK TECNOLÓGICA:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animações)

SEÇÕES:
- Hero com CTA principal
- Features/Benefícios
- Social Proof (testimonials)
- Pricing
- FAQ
- CTA final

OTIMIZAÇÕES CRO:
- CTAs estratégicos
- Formulários otimizados
- Loading rápido
- Mobile-first

Gere o projeto completo agora:`,
    isPublic: true,
  },
  {
    title: 'Dashboard Admin Completo',
    description: 'Painel administrativo com gráficos, tabelas, autenticação e gerenciamento de usuários.',
    stack: 'Next.js, TypeScript, Tailwind CSS, Chart.js, Prisma',
    features: ['Dashboard com métricas', 'Tabelas de dados', 'Gráficos', 'CRUD completo'],
    content: `Crie um dashboard administrativo completo usando Next.js e TypeScript.

STACK TECNOLÓGICA:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js (gráficos)
- Prisma + PostgreSQL
- NextAuth.js

FUNCIONALIDADES:
- Dashboard com métricas e gráficos
- Tabelas de dados com paginação
- CRUD completo (Create, Read, Update, Delete)
- Filtros e busca
- Export de dados
- Autenticação e autorização

COMPONENTES:
- DataTable
- ChartCard
- MetricCard
- Modal
- Form components

Gere o projeto completo agora:`,
    isPublic: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe seed
    const existing = await prisma.prompt.findFirst({
      where: { title: 'E-commerce Moderno', isPublic: true },
    })

    if (existing) {
      return NextResponse.json({ message: 'Seed já executado' })
    }

    // Criar usuário admin se não existir
    let adminUser = await prisma.user.findFirst({
      where: { email: 'admin@codervex.com' },
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@codervex.com',
          name: 'Admin',
          password: 'hashed_password_here', // Em produção, usar hash real
          subscription: 'monthly',
        },
      })
    }

    // Criar projetos exemplo
    const created = await Promise.all(
      exampleProjects.map(project =>
        prisma.prompt.create({
          data: {
            userId: adminUser.id,
            title: project.title,
            content: project.content,
            stack: project.stack,
            projectType: 'Exemplo da Comunidade',
            isPublic: true,
            sourceType: 'idea',
          },
        })
      )
    )

    return NextResponse.json({
      message: 'Seed executado com sucesso',
      created: created.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao executar seed' },
      { status: 500 }
    )
  }
}

