// Script para popular a comunidade com projetos exemplo
// Execute: npx tsx scripts/seed-community.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const exampleProjects = [
  {
    title: 'E-commerce Moderno',
    description: 'Loja online completa com carrinho, checkout e integração com Stripe',
    stack: 'Next.js, TypeScript, Tailwind CSS, Stripe, Prisma',
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

Gere o projeto completo agora:`,
  },
  {
    title: 'Landing Page CRO',
    description: 'Landing page otimizada para conversão com seções estratégicas',
    stack: 'Next.js, TypeScript, Tailwind CSS, Framer Motion',
    content: `Crie uma landing page otimizada para conversão.

STACK TECNOLÓGICA:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animações)

SEÇÕES:
- Hero com CTA principal
- Features/Benefícios
- Social Proof
- Pricing
- FAQ
- CTA final

Gere o projeto completo agora:`,
  },
  {
    title: 'Dashboard Admin',
    description: 'Painel administrativo com gráficos e tabelas',
    stack: 'Next.js, TypeScript, Tailwind CSS, Chart.js',
    content: `Crie um dashboard administrativo completo.

STACK TECNOLÓGICA:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js (gráficos)
- Prisma + PostgreSQL

FUNCIONALIDADES:
- Dashboard com métricas
- Gráficos interativos
- Tabelas com paginação
- CRUD completo

Gere o projeto completo agora:`,
  },
]

async function main() {
  console.log('🌱 Iniciando seed da comunidade...')

  // Criar ou buscar usuário admin
  let adminUser = await prisma.user.findFirst({
    where: { email: 'admin@codervex.com' },
  })

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@codervex.com',
        name: 'Admin',
        password: 'placeholder', // Em produção, usar hash real
        subscription: 'monthly',
      },
    })
    console.log('✅ Usuário admin criado')
  }

  // Verificar se já existe seed
  const existing = await prisma.prompt.findFirst({
    where: { title: 'E-commerce Moderno', isPublic: true },
  })

  if (existing) {
    console.log('⚠️ Seed já foi executado anteriormente')
    return
  }

  // Criar projetos exemplo
  for (const project of exampleProjects) {
    await prisma.prompt.create({
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
    console.log(`✅ Projeto "${project.title}" criado`)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

