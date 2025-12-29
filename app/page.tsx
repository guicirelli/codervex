'use client'

import React, { useMemo } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Upload,
  FileText,
  Bot,
  CheckCircle,
  Wand2,
  X,
  Clock,
  Layers,
  Target,
  Rocket,
  Play,
  BarChart3,
  Lightbulb,
  TrendingUp,
  Copy,
  Code,
} from 'lucide-react'

// Importar Navbar diretamente para aparecer imediatamente
import Navbar from '@/components/shared/layout/Navbar'
// Footer é simples, não precisa de lazy loading
import Footer from '@/components/shared/layout/Footer'
import ScrollReveal from '@/components/shared/ui/ScrollReveal'

function HomePage() {
  // Não usar useUser aqui para evitar quebrar a página
  // Se precisar de autenticação, usar em componentes específicos
  
  // Memoizar dados estáticos
  const problemItems = useMemo(() => [
    { icon: <Layers className="w-5 h-5" />, text: 'Large projects are hard to explain' },
    { icon: <Clock className="w-5 h-5" />, text: 'Manual prompts waste time' },
    { icon: <FileText className="w-5 h-5" />, text: 'Context gets lost' },
    { icon: <X className="w-5 h-5" />, text: 'Results become inconsistent' },
  ], [])
  
  const howItWorksSteps = useMemo(() => [
    {
      step: '1',
      icon: <Upload className="w-10 h-10" />,
      title: 'Send the project',
      description: 'Upload files or paste a GitHub repository link.',
      details: [
        'Supported: .js .ts .jsx .tsx .json .css .html .zip',
        'GitHub Link: Paste any public repository URL',
        'No size limits, no file count restrictions',
      ],
    },
    {
      step: '2',
      icon: <FileText className="w-10 h-10" />,
      title: 'Codervex interprets',
      description: 'Analyzes your project structure and extracts technical context.',
      details: [
        'Analyzes folder structure',
        'Detects frameworks and tools',
        'Maps components, routes, and features',
      ],
    },
    {
      step: '3',
      icon: <Bot className="w-10 h-10" />,
      title: 'Receive the context',
      description: 'Get clear project summary, complete tech stack, and copy-ready project context.',
      details: [
        'Clear project summary',
        'Complete tech stack',
        'System structure',
        'Copy-ready project context',
      ],
    },
  ], [])

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section 
        className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          backgroundImage: 'url(/images/background-home.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
        }}
        suppressHydrationWarning
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-primary-500/10"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6 z-10 w-full pt-8 pb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            If the code doesn&apos;t speak, Codervex makes it speak.
            </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            No guessing. No manual explanations. Just structured understanding of real codebases.
            </p>

          {/* Before/After Mini Visual */}
          <div className="flex items-center justify-center gap-3 py-4 flex-wrap">
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 min-w-[140px]">
              <Code className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Your Codebase</span>
            </div>
            <span className="text-2xl font-bold text-white">+</span>
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-700 min-w-[140px]">
              <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">Codervex Engine</span>
            </div>
            <span className="text-2xl font-bold text-primary-500">=</span>
            <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500/20 backdrop-blur-sm rounded-lg border border-primary-500/50 min-w-[140px]">
              <FileText className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-white">Technical Context</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
                href="#how-it-works"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/95 backdrop-blur-sm border-2 border-white/80 text-gray-900 rounded-xl font-bold text-xl hover:bg-white transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:scale-105"
            >
              See Demo
              <Play className="w-6 h-6" />
            </a>
            <Link
              href="/dashboard"
              prefetch={true}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-xl font-bold text-xl hover:bg-primary-500 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(146,141,246,0.5)] transform hover:scale-105 border-2 border-primary-400/50"
            >
              Get Started
              <Rocket className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <ScrollReveal direction="up" distance={30}>
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-12">
                AI models fail without structured project context
              </h2>
            </div>

            {/* 4 Problemas em cima */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {[
                { icon: <Layers className="w-5 h-5" />, text: 'Large codebases are hard to explain' },
                { icon: <Clock className="w-5 h-5" />, text: 'Manual prompts waste time' },
                { icon: <FileText className="w-5 h-5" />, text: 'Context degrades as projects evolve' },
                { icon: <X className="w-5 h-5" />, text: 'Results become inconsistent' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-start gap-4 bg-white dark:bg-gray-800 border-2 border-primary-500/20 dark:border-primary-500/20 rounded-xl p-6 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-500/10 dark:bg-primary-500/10 text-primary-500 dark:text-primary-500">
                    {item.icon}
                  </div>
                  <span className="text-base font-semibold text-gray-900 dark:text-white leading-tight">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* 2 Before/After embaixo - cada um ocupa 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before - cores mínimas */}
              <div className="bg-white dark:bg-gray-800 border-2 border-red-200/30 dark:border-red-800/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400/40"></div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Before</div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Vague description</div>
                  <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">README confusion</div>
                  <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Generic output</div>
                </div>
              </div>

              {/* After - cores mínimas */}
              <div className="bg-white dark:bg-gray-800 border-2 border-green-200/30 dark:border-green-800/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-400/40"></div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">After</div>
                </div>
                <div className="space-y-2">
                  <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Deterministic technical context</div>
                  <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Clear project summary</div>
                  <div className="font-mono text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">Controlled, consistent output</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* SECTION 3 — RESULT (VISUAL TEMPLATES) */}
      <ScrollReveal direction="up" distance={30} delay={100}>
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              What Codervex Extracts From Your Project
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              A deterministic technical summary extracted directly from real files.
            </p>
              </div>
              
          {/* Templates lado a lado */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Project Context */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-lg flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Context</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Auto-extracted from real files</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Example
                </div>
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap leading-relaxed border border-gray-700 flex-1 flex flex-col">
                <div className="flex-1">
{`Project Context (Auto-extracted):

Type: Web application

Stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Structure:
- Landing page
- Dashboard
- Authentication

Main features:
- User authentication
- Dashboard layout
- CRUD forms
- Responsive design`}
                </div>
                <div className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-medium border border-primary-500/30 cursor-not-allowed">
                  <Copy className="w-3 h-3" />
                  Copy
                </div>
              </div>
              </div>
              
            {/* Custom Context */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-5 shadow-lg flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Custom Context</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Available after analysis</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary-500/20 dark:bg-primary-500/20 rounded-lg text-xs font-semibold text-primary-500 dark:text-primary-500">
                  Example
                </div>
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap leading-relaxed border border-gray-700 flex-1 flex flex-col">
                <div className="flex-1">
{`Custom Context (Available after analysis):
Controlled adaptations based on explicit technical goals.

Goal: Transform into financial SaaS interface
Scope: Frontend only
Constraints: Preserve routing and state logic

Changes:
- Remove authentication flows
- Apply corporate layout
- Add financial data visualization

Preserve:
- Dashboard structure
- Form patterns
- CRUD interfaces`}
                </div>
                <div className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-medium border border-primary-500/30 cursor-not-allowed">
                  <Copy className="w-3 h-3" />
                  Copy
                </div>
              </div>
              </div>
            </div>

          {/* Texto informativo */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Full functionality available in the dashboard
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">
              Built to reason about real-world codebases, not toy projects.
            </p>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* SECTION 4 — WHAT CODERVEX DOES */}
      <ScrollReveal direction="up" distance={30} delay={100}>
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Built to reason about real-world codebases
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 italic">
              Not a code generator. Not a refactoring tool. Pure context extraction.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Codervex does */}
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Does</h3>
                <ul className="space-y-3">
                  {[
                    'Parses real project structure',
                    'Detects stack and patterns',
                    'Derives technical intent from structure and patterns',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 dark:text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Codervex does not */}
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Does not</h3>
                <ul className="space-y-3">
                  {[
                    'Generate code',
                    'Guess logic',
                    'Replace developers',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* SECTION 5 — HOW IT WORKS (DEMONSTRATION) */}
      <ScrollReveal direction="up" distance={40} delay={150}>
        <section id="how-it-works" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Three simple steps to extract structured technical context from your codebase
            </p>
                  </div>
                  
          <div className="relative">
            {/* Linha conectora (desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-primary-500/30"></div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {howItWorksSteps.map((item, i) => (
                <div key={i} className="relative group flex flex-col">
                  {/* Número do passo */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-2xl z-20 border-4 border-white dark:border-gray-800">
                    {item.step}
                  </div>
                  
                  {/* Seta conectora (desktop) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 -right-6 lg:-right-12 w-12 lg:w-24 h-0.5 bg-primary-500/30 z-10">
                      <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-primary-500" />
                    </div>
                  )}

                  {/* Card principal */}
                  <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 pt-16 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2 group-hover:scale-105 flex flex-col h-full">
                    {/* Ícone */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {item.title}
                    </h3>

                    {/* Descrição */}
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Detalhes */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 text-left border border-gray-200 dark:border-gray-700 flex-1 flex flex-col justify-start">
                      <ul className="space-y-3">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center mt-16">
            <Link
              href="/dashboard"
              prefetch={true}
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-500 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(146,141,246,0.5)] transform hover:scale-105"
            >
              Access Dashboard
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* SECTION 6 — CUSTOMIZATION (VISUAL ONLY) */}
      <ScrollReveal direction="up" distance={30} delay={100}>
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Don&apos;t rewrite prompts. Control the context.
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Adapt the extracted structure to a specific technical goal without rewriting prompts.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  Customization controls
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">Remove or isolate authentication flows</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Modify layout and UI domain</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Reframe the project purpose (SaaS, admin, finance)</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Preserve existing architecture and patterns</div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary-500" />
                  Result
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Receive a scoped, customized context aligned with your project&apos;s real structure.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                  The output is a technical context block: concise, deterministic, and copy-ready.
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* SECTION 7 — CASE STUDY */}
      <ScrollReveal direction="up" distance={30} delay={100}>
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Real projects, real structure
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Reconstructed architecture and extracted reusable technical context.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Exemplo 1 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="white" className="dark:fill-black"/>
                    <path d="M9.2 7.5v9h1.2V9.5l4.6 7h1.2v-9h-1.2v7L9.2 7.5z" fill="black" className="dark:fill-white"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    Processed a production Next.js SaaS with 40+ files
                  </p>
                </div>
              </div>
            </div>

            {/* Exemplo 2 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#61DAFB] flex items-center justify-center flex-shrink-0 p-2">
                  <svg className="w-full h-full" viewBox="-11.5 -10.232 23 20.463" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="0" cy="0" r="2.05" fill="#282C34"/>
                    <g stroke="#282C34" strokeWidth="1" fill="none">
                      <ellipse rx="11" ry="4.2"/>
                      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                    </g>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    Analyzed a React e-commerce platform with 60+ components
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* SECTION 8 — PRICING */}
      <ScrollReveal direction="up" distance={30} delay={100}>
        <section id="pricing" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Pricing
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Free during MVP to validate context extraction accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plano 1: Free (MVP) - Destacado */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500 dark:border-primary-500 rounded-xl p-8 shadow-2xl flex flex-col">
              <div className="text-center flex flex-col h-full">
                {/* Badges */}
                <div className="flex justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold">
                    MVP
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free</h3>
                
                <ul className="space-y-3 mb-4 text-left">
                  {[
                    'Unlimited analyses (during MVP)',
                    'Full project summary',
                    'Stack detection',
                    'Project context generation',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 dark:text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-800 dark:text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-center mb-2">
                    Features and limits may change after MVP.
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed text-center font-medium">
                    Prompt customization available in paid plans
                  </p>
                </div>
                
                <div className="block w-full text-center px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold text-base mt-auto">
                  Current Plan
                </div>
              </div>
            </div>

            {/* Plano 2: $0.99 por prompt - Apagado */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-8 shadow-lg opacity-50 flex flex-col">
              <div className="text-center flex flex-col h-full">
                {/* Badges */}
                <div className="flex justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                    Planned
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2">Pay per Prompt</h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">$0.99</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500"> / prompt</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">For occasional or one-off projects</p>
                
                <ul className="space-y-3 mb-4 text-left">
                  {[
                    'Full project summary',
                    'Stack detection',
                    'Base + custom prompt output',
                    'Prompt version snapshot',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-400 dark:text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 mb-1">Best for:</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Single projects • Freelancers • Quick context extraction</p>
                </div>

                <div className="block w-full text-center px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-semibold text-base cursor-not-allowed mt-auto">
                  In Development
                </div>
              </div>
            </div>

            {/* Plano 3: $9.99 por mês - Apagado */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-8 shadow-lg opacity-50 flex flex-col">
              <div className="text-center flex flex-col h-full">
                {/* Badges */}
                <div className="flex justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
                    Planned
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2">Monthly</h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">$9.99</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500"> / month</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">Built for continuous development</p>
                
                <ul className="space-y-3 mb-4 text-left">
                  {[
                    'Unlimited prompt generations',
                    'Prompt history & versions',
                    'Saved custom prompt presets',
                    'Priority processing',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-400 dark:text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 mb-1">Best for:</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Active projects • Iterative AI workflows • Teams & solo builders</p>
                </div>

                <div className="block w-full text-center px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-semibold text-base cursor-not-allowed mt-auto">
                  In Development
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* SECTION 9 — FINAL CTA */}
      <ScrollReveal direction="up" distance={30} delay={100}>
        <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-8">
              Stop explaining code manually.
              <br />
              <span className="text-primary-400">Let your project speak for itself.</span>
            </h2>
          <Link
            href="/dashboard"
            prefetch={true}
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-500 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(146,141,246,0.5)] transform hover:scale-105"
          >
            Analyze real codebase
            <ArrowRight className="w-6 h-6" />
          </Link>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  )
}

export default HomePage
