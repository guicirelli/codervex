import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import Link from 'next/link'
import { ArrowRight, Play, CheckCircle, Sparkles, Copy, X } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Veja o Codervex em{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                Ação
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Teste gratuitamente e veja como transformamos projetos em superprompts de IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Testar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                Ver Dashboard
              </Link>
            </div>
          </div>

          {/* O que é Superprompt */}
          <section className="mb-20">
            <div className="card max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                O que é um Superprompt?
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <X className="w-5 h-5 text-red-500 inline-block mr-2" />
                    Prompt Normal
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      &quot;Crie um site de e-commerce com React&quot;
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Resultado: Código genérico, sem estrutura, sem detalhes
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500 inline-block mr-2" />
                    Superprompt
                  </h3>
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
                    <p className="text-sm text-gray-900 dark:text-white font-mono">
                      Estrutura completa, stack tecnológica, componentes, funcionalidades, layout detalhado...
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Resultado: Projeto completo, estruturado, pronto para deploy
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Exemplo Interativo */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Exemplo Real de Superprompt
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Veja um prompt gerado a partir de um projeto real
              </p>
            </div>

            <div className="card max-w-5xl mx-auto">
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto mb-4">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
{`Recrie este projeto completo usando React + Next.js + TypeScript + Tailwind CSS.

STACK TECNOLÓGICA:
- Framework: Next.js 14 (App Router)
- Linguagem: TypeScript
- Estilização: Tailwind CSS
- Autenticação: NextAuth.js
- Banco de Dados: Prisma + PostgreSQL
- State Management: Zustand
- HTTP Client: Axios

ESTRUTURA DE PASTAS:
/app
  /api
    /auth
      route.ts
    /prompt
      /generate
        route.ts
  /auth
    /login
      page.tsx
    /register
      page.tsx
  /dashboard
    page.tsx
    /settings
      page.tsx
/components
  /layout
    Navbar.tsx
    Footer.tsx
  /dashboard
    UploadForm.tsx
    PromptDisplay.tsx
/lib
  db.ts
  auth.ts
  fileAnalyzer.ts
/prisma
  schema.prisma

COMPONENTES PRINCIPAIS:
- Navbar (navegação responsiva)
- Footer (links e informações)
- UploadForm (drag & drop de arquivos)
- PromptDisplay (exibição de prompt)
- CreditsDisplay (mostra créditos)
- PromptHistory (histórico de prompts)

PÁGINAS/ROTAS:
- / (Landing page)
- /auth/login (Login)
- /auth/register (Registro)
- /dashboard (Dashboard principal)
- /dashboard/settings (Configurações)
- /pricing (Planos e preços)

FUNCIONALIDADES PRINCIPAIS:
1. Sistema de autenticação completo (login/registro)
2. Upload de arquivos com drag & drop
3. Análise automática de projetos
4. Geração de superprompts via IA
5. Histórico de prompts gerados
6. Sistema de créditos
7. Integração com Stripe para pagamentos
8. Dashboard com estatísticas

LAYOUT E SEÇÕES:
- Header fixo com navegação responsiva
- Hero section com CTA principal
- Seção de funcionalidades em cards
- Exemplo de prompt gerado
- Seção de preços
- Footer com links importantes

ESTILO:
- Design moderno e minimalista
- Cores: Roxo (#9333ea) e Lilás (#a855f7)
- Tipografia: Inter
- Modo escuro suportado
- Totalmente responsivo

INSTRUÇÕES:
1. Gere o código completo e funcional
2. Use as tecnologias identificadas acima
3. Mantenha a estrutura de pastas similar
4. Implemente todas as funcionalidades listadas
5. Código deve estar pronto para deploy
6. Sem instruções intermediárias, apenas código completo
7. Inclua todos os arquivos necessários (package.json, configurações, etc.)
8. Use boas práticas modernas de React/Next.js

Gere o projeto completo agora:`}
                </pre>
              </div>
              <div className="flex justify-end">
                <button className="btn-primary inline-flex items-center">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Prompt
                </button>
              </div>
            </div>
          </section>

          {/* Como Funciona */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Como Usar o Superprompt
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Passo a passo para usar em ferramentas de IA
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Gere o Prompt
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Faça upload do seu projeto ou descreva sua ideia. Receba um superprompt completo e detalhado.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Copie e Cole
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Copie o superprompt gerado e cole em Cursor, ChatGPT, Claude ou qualquer ferramenta de IA.
                </p>
              </div>

              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Receba o Código
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  A IA gerará o projeto completo baseado no superprompt. Economize horas de trabalho!
                </p>
              </div>
            </div>
          </section>

          {/* Benefícios */}
          <section className="mb-20">
            <div className="card bg-gradient-to-br from-primary-600 to-secondary-500 text-white">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">
                  Por que usar Codervex?
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Economia de Tempo</h3>
                    <p className="text-primary-100">
                      Reduza de 8 horas para 15 minutos o tempo de análise e criação de projetos
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Prompts Detalhados</h3>
                    <p className="text-primary-100">
                      Superprompts completos com estrutura, stack, componentes e funcionalidades
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Resultados Melhores</h3>
                    <p className="text-primary-100">
                      IAs geram código mais preciso e completo com superprompts estruturados
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">1 Prompt Gratuito</h3>
                    <p className="text-primary-100">
                      Teste sem compromisso! Gere seu primeiro superprompt gratuitamente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center">
            <div className="card bg-gray-900 text-white max-w-3xl mx-auto">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary-400" />
              <h2 className="text-4xl font-bold mb-4">
                Pronto para começar?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Gere seu primeiro superprompt gratuitamente e veja a diferença
              </p>
              <Link
                href="/auth/register"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 inline-flex items-center"
              >
                Criar Conta Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

