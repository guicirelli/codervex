'use client'

import React, { memo, useMemo } from 'react'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import dynamicImport from 'next/dynamic'
import { useUser } from '@clerk/nextjs'
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
} from 'lucide-react'

// Lazy load componentes pesados
const Navbar = dynamicImport(() => import('@/components/shared/layout/Navbar'), {
  ssr: true,
  loading: () => <div className="h-16 bg-black" />,
})

const Footer = dynamicImport(() => import('@/components/shared/layout/Footer'), {
  ssr: true,
})

function HomePage() {
  const { user, isLoaded } = useUser()
  
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
      description: 'Upload your files (.zip or multiple files) or paste a GitHub repository link. Codervex accepts all common web development formats.',
      details: [
        'File Upload: .js, .ts, .jsx, .tsx, .json, .css, .html, .zip',
        'GitHub Link: Paste any public repository URL',
        'No size limits, no file count restrictions',
      ],
    },
    {
      step: '2',
      icon: <FileText className="w-10 h-10" />,
      title: 'Codervex interprets',
      description: 'Our system reads your project structure, detects technologies, maps dependencies, and understands the codebase architecture.',
      details: [
        'Analyzes folder structure and file organization',
        'Detects frameworks, libraries, and tools',
        'Maps components, routes, and features',
        'Identifies patterns and architecture decisions',
      ],
    },
    {
      step: '3',
      icon: <Bot className="w-10 h-10" />,
      title: 'Receive the prompt',
      description: 'Get a complete, ready-to-use prompt with project summary, technology stack, system structure, and base instructions for AI.',
      details: [
        'Project Summary: Clear explanation of what it does',
        'Technology Stack: All detected frameworks and tools',
        'System Structure: Pages, features, and modules',
        'Base Prompt: Ready to copy and use immediately',
      ],
    },
  ], [])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* SECTION 1 — HERO */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/background-home.png"
            alt="Purple and Blue Modern Company Meeting Zoom Virtual Background"
            fill
            className="object-cover w-full h-full"
            priority
            quality={85}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 dark:from-black/80 dark:via-black/70 dark:to-black/90"></div>
          <div className="absolute inset-0 bg-primary-500/20"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6 z-10 w-full py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            If the code doesn&apos;t speak, Codervex makes it speak.
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Transform real web projects into clear, reusable instructions for AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-500 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(146,141,246,0.5)] transform hover:scale-105 border-2 border-primary-400/50"
            >
              See Demo
            </a>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/80 text-gray-900 rounded-xl font-bold text-lg hover:bg-white transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:scale-105"
            >
              <Play className="w-5 h-5" />
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              AI without context makes mistakes
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Layers className="w-5 h-5" />, text: 'Large projects are hard to explain' },
              { icon: <Clock className="w-5 h-5" />, text: 'Manual prompts waste time' },
              { icon: <FileText className="w-5 h-5" />, text: 'Context gets lost' },
              { icon: <X className="w-5 h-5" />, text: 'Results become inconsistent' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 bg-white dark:bg-gray-900 border-2 border-primary-500/20 dark:border-primary-500/20 rounded-lg p-5 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-500/10 dark:bg-primary-500/10 text-primary-500 dark:text-primary-500">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white text-center leading-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — RESULT (VISUAL TEMPLATES) */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              What You Get
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              See both templates side by side — Base Prompt and Custom Prompt
            </p>
          </div>

          {/* Templates lado a lado */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Base Prompt */}
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Base Prompt</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Without customization</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Example
                </div>
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap leading-relaxed border border-gray-700 min-h-[350px]">
{`Create a Next.js project using TypeScript.

Structure:
- Landing Page
- Dashboard
- Auth

Stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Features:
- User authentication
- Dashboard with charts
- Responsive design
- Dark mode support`}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Custom Prompt</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">With customization</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary-500/20 dark:bg-primary-500/20 rounded-lg text-xs font-semibold text-primary-500 dark:text-primary-500">
                  Example
                </div>
              </div>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 text-xs font-mono text-gray-100 dark:text-gray-200 whitespace-pre-wrap leading-relaxed border border-gray-700 min-h-[350px]">
{`Adapt the project for a financial SaaS.

Changes:
- Remove auth system
- Implement new corporate layout
- Use Tailwind CSS and App Router
- Add financial dashboard widgets

Keep:
- Dashboard structure
- Form system
- CRUD functionality
- Responsive design

New Requirements:
- Financial charts integration
- Transaction history
- Account management
- Payment processing UI`}
              </div>
            </div>
          </div>

          {/* CTA para Dashboard */}
          <div className="text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-500 transition-all shadow-xl hover:shadow-2xl"
            >
              <Rocket className="w-5 h-5" />
              Try It Now in Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Full functionality available in the dashboard
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHAT CODERVEX DOES */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
              What Codervex actually does
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Codervex does */}
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Does</h3>
                <ul className="space-y-3">
                  {[
                    'Reads real project structure',
                    'Detects stack and patterns',
                    'Translates code into intent',
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

      {/* SECTION 5 — HOW IT WORKS (DEMONSTRATION) */}
      <section id="how-it-works" className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              How it works
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Three simple steps to transform your project into AI-ready instructions
            </p>
          </div>

          <div className="relative">
            {/* Linha conectora (desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-primary-500/30"></div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
              {howItWorksSteps.map((item, i) => (
                <div key={i} className="relative group">
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
                  <div className="relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 pt-16 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2 group-hover:scale-105">
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
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 text-left border border-gray-200 dark:border-gray-700">
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
              href="/auth/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-500 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(146,141,246,0.5)] transform hover:scale-105"
            >
              <Play className="w-6 h-6" />
              Try It Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CUSTOMIZATION (VISUAL ONLY) */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Don&apos;t just generate a prompt. Shape it.
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Adapt the generated context to your real goal.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-500" />
                  Customization Options
                </h3>
                <ul className="space-y-3">
                  {[
                    'Define your objective',
                    'Specify what should change',
                    'Choose preferred technologies',
                    'Select style preferences',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-base text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary-500" />
                  Result
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Receive a tailored prompt that perfectly aligns your project&apos;s structure with your specific objectives, ready to use with any AI tool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — CASE STUDY */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Real examples
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Codervex is built to help developers explain complex projects to AI without rewriting everything manually.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Exemplo 1 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    Analyzed a Next.js SaaS with 40+ files and generated a reusable prompt in seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Exemplo 2 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    Processed a React e-commerce platform with 60+ components and extracted complete architecture in minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Exemplo 3 */}
            <div className="bg-white dark:bg-gray-800 border-2 border-primary-500/30 dark:border-primary-500/30 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
                    Transformed a Vue.js admin dashboard with TypeScript into a clear, structured AI prompt ready to use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — DASHBOARD (Logged in users only) */}
      {isLoaded && user && (
        <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Your Dashboard
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Manage your projects and superprompts
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-500 transition-all shadow-xl hover:shadow-2xl"
            >
              <Rocket className="w-5 h-5" />
              Access Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* SECTION 9 — PRICING */}
      <section id="pricing" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              Free while in MVP
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              No credit card required
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border-2 border-primary-500 dark:border-primary-500 rounded-xl p-8 shadow-2xl max-w-md mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Free</h3>
              <ul className="space-y-3 mb-6 text-left">
                {[
                  'Unlimited tests',
                  'Full project summary',
                  'Stack detection',
                  'Prompt generation',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-500 dark:text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-base text-gray-800 dark:text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-6">MVP version</p>
              <Link
                href="/auth/register"
                className="block w-full text-center px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold text-base hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default memo(HomePage)
