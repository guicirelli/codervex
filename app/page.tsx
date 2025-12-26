import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import {
  ArrowRight,
  Upload,
  FileText,
  Bot,
  Sparkles,
  CheckCircle,
  Code,
  Wand2,
  X,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  Copy,
  Layers,
  Target,
  Rocket,
  Star,
  DollarSign,
  Check,
  Users,
  BarChart3,
  Lightbulb,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* SEÇÃO 1 — HERO (Impacto Visual Máximo) */}
      <section className="relative py-20 sm:py-24 md:py-32 lg:py-40 px-4 overflow-hidden">
        {/* Background com gradiente e padrão */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHptMTYgMTZjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTQgMS43OTEtNCA0LTQgNCAxLjc5MSA0IDR6IiBmaWxsPSIjZGRkIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20 dark:opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center space-y-8 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300 shadow-lg border border-primary-200 dark:border-primary-800 mb-6">
            <Sparkles className="w-4 h-4" />
            Intermediador entre código real e prompt bom
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            Codervex transforma{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              projetos reais
            </span>{' '}
            em instruções claras para criar, adaptar ou evoluir código com IA.
          </h1>

          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Envie um projeto. Receba contexto. Gere prompts melhores.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/dashboard/create"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Rocket className="w-5 h-5" />
              Analisar um projeto
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Star className="w-5 h-5" />
              Começar agora
            </Link>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-sm sm:text-base">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Zap className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">Economize 8+ horas</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Shield className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">100% Privado</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Clock className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">Resultado em minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — PROBLEMA REAL (Dor Concreta) */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent dark:via-gray-800/50"></div>
        <div className="relative max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-sm font-semibold text-red-700 dark:text-red-400">
              <X className="w-4 h-4" />
              O Problema
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              IA é poderosa, mas sem contexto ela erra.
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Código sem explicação vira prompt ruim.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Layers className="w-6 h-6" />, text: 'Projetos grandes' },
              { icon: <FileText className="w-6 h-6" />, text: 'Código espalhado' },
              { icon: <Clock className="w-6 h-6" />, text: 'Prompt manual cansa' },
              { icon: <X className="w-6 h-6" />, text: 'Resultado inconsistente' },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 hover:border-red-400 dark:hover:border-red-600 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-center">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — SOLUÇÃO (O Que o Codervex Faz) */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9IiM3YzNhZWQiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30 dark:opacity-20"></div>
        <div className="relative max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300">
              <Wand2 className="w-4 h-4" />
              A Solução
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Codervex lê o código para você e explica o que ele faz em forma de instrução.
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Tradutor, não criador. Transformamos código complexo em contexto claro.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-10 h-10" />,
                title: 'Entende estrutura',
                desc: 'Mapeia componentes, rotas e dependências do projeto',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: <FileText className="w-10 h-10" />,
                title: 'Entende funcionalidades',
                desc: 'Extrai o propósito e lógica de cada parte do sistema',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: <Bot className="w-10 h-10" />,
                title: 'Transforma em prompt',
                desc: 'Gera instruções claras e reutilizáveis para sua IA',
                color: 'from-primary-500 to-primary-600',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 space-y-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — COMO FUNCIONA (3 Passos Simples) */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300">
              <Target className="w-4 h-4" />
              Processo Simples
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Como funciona
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Sem palavras técnicas. Sem prometer mágica. Apenas resultados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '1',
                icon: <Upload className="w-12 h-12" />,
                title: 'Envie o projeto',
                desc: 'Upload de arquivos ou link do GitHub. Simples e rápido.',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                step: '2',
                icon: <FileText className="w-12 h-12" />,
                title: 'Codervex interpreta',
                desc: 'Lê stack, estrutura e funcionalidades automaticamente.',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                step: '3',
                icon: <Bot className="w-12 h-12" />,
                title: 'Receba o prompt',
                desc: 'Contexto pronto, organizado e copiável em segundos.',
                gradient: 'from-primary-500 to-primary-600',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative group"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-xl z-10">
                  {item.step}
                </div>
                <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-10 pt-16 space-y-6 text-center hover:border-primary-300 dark:hover:border-primary-700 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-2">
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — O RESULTADO (O Que o Usuário Ganha) */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-semibold text-green-700 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              O Resultado
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              O que você recebe
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              O usuário compra o resultado, não o processo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Resumo do Projeto */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 lg:p-10 space-y-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Resumo do Projeto</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary-600" />
                    Tecnologias
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js', 'TypeScript', 'Tailwind'].map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary-600" />
                    Estrutura
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">Landing Page, Dashboard, Auth</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary-600" />
                    Funcionalidades
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Login/Registro
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      CRUD completo
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Formulários com validação
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prompt Final */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 lg:p-10 space-y-6 shadow-xl hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Final</h3>
                </div>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-xl p-6 text-sm font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap leading-relaxed border border-gray-700">
{`Crie um projeto Next.js usando TypeScript.

Estrutura:
- Landing Page
- Dashboard
- Auth

Stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Funcionalidades:
- Login/Registro
- CRUD completo
- Formulários com validação`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — CUSTOMIZAÇÃO (Diferencial Real) */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-semibold text-purple-700 dark:text-purple-400">
              <Wand2 className="w-4 h-4" />
              Diferencial
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Ajuste o prompt ao seu objetivo
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Transforme o Codervex em copiloto. É texto, é regra, é concatenação — não é IA paga.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Formulário de Customização */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 lg:p-10 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Personalize seu prompt</h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary-600" />
                  O que você quer criar agora?
                </label>
                <input
                  type="text"
                  defaultValue="um SaaS financeiro"
                  className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" />
                  O que deve mudar?
                </label>
                <textarea
                  defaultValue="remover auth, novo layout"
                  rows={3}
                  className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary-600" />
                  Tecnologias preferidas
                </label>
                <input
                  type="text"
                  defaultValue="Tailwind, App Router"
                  className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600" />
                  Estilo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Clean', 'Corporativo', 'Moderno'].map((style) => (
                    <button
                      key={style}
                      className="px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl">
                <Wand2 className="w-5 h-5" />
                Gerar prompt customizado
              </button>
            </div>

            {/* Resultado Customizado */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 lg:p-10 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Customizado</h3>
                </div>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg">
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-xl p-6 text-sm font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap leading-relaxed min-h-[350px] border border-gray-700">
{`Adapte o projeto para um SaaS financeiro.

Mudanças:
- Remover sistema de auth
- Implementar novo layout corporativo
- Usar Tailwind CSS e App Router

Mantenha:
- Estrutura de dashboard
- Sistema de formulários
- Funcionalidades CRUD

Stack preferida:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Estilo: Corporativo`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 — PRICING (Planos e Valores) */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-semibold text-primary-700 dark:text-primary-300">
              <DollarSign className="w-4 h-4" />
              Planos e Valores
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              O custo de adivinhar software
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Codervex não é barato porque resolve problema caro. Reduz risco, tempo e incerteza.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Plano Gratuito */}
            <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Gratuito</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-primary-600 dark:text-primary-500">R$ 0</span>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">Ideal para testar</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                  Economize 4-6 horas de análise
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '1 superprompt gratuito',
                  'Análise completa do projeto',
                  'Histórico de prompts',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-base text-gray-800 dark:text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Plano Por Projeto */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Por Projeto</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-primary-600 dark:text-primary-500">R$ 4,90</span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">/projeto</span>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">Ideal para uso ocasional</p>
                <p className="mt-2 text-sm text-primary-700 dark:text-primary-400 font-bold">
                  Economize R$ 200-300 em tempo por projeto
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '1 superprompt gerado',
                  'Análise completa do projeto',
                  'Detecção de stack tecnológica',
                  'Mapeamento de componentes',
                  'Histórico de prompts',
                  'Suporte por email',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-base text-gray-800 dark:text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                Começar Agora
              </Link>
            </div>

            {/* Plano Mensal */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-600 dark:border-primary-500 rounded-2xl p-8 shadow-2xl relative hover:shadow-3xl transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                Mais Popular
              </div>

              <div className="text-center mb-8 pt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Assinatura Mensal</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-primary-600 dark:text-primary-500">R$ 19,90</span>
                  <span className="text-lg text-gray-700 dark:text-gray-300">/mês</span>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 font-medium mb-2">Ideal para uso frequente</p>
                <p className="text-sm text-primary-700 dark:text-primary-400 font-bold mb-2">7 dias grátis para testar!</p>
                <p className="text-sm text-primary-700 dark:text-primary-400 font-semibold">
                  Entendimento sistemático de sistemas complexos
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  { text: 'Prompts ilimitados', highlight: true },
                  'Análise completa do projeto',
                  'Detecção de stack tecnológica',
                  'Mapeamento de componentes',
                  'Histórico completo',
                  'Suporte prioritário',
                  'API access (em breve)',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className={`text-base ${typeof feature === 'object' && feature.highlight ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-800 dark:text-gray-200'}`}>
                      {typeof feature === 'object' ? feature.text : feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-xl"
              >
                Assinar Agora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-20 sm:py-24 md:py-28 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNHptMTYgMTZjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTQgMS43OTEtNCA0LTQgNCAxLjc5MSA0IDR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-10 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold text-white border border-white/20">
            <Rocket className="w-4 h-4" />
            Pronto para começar?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Envie um projeto, veja o resumo e copie um prompt pronto.
          </h2>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            Fluxo simples. Contexto real. Pronto para IA trabalhar direito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/dashboard/create"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Rocket className="w-5 h-5" />
              Analisar um projeto
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
            >
              <Users className="w-5 h-5" />
              Começar agora
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
