import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Code, 
  Network, 
  Zap, 
  Target, 
  CheckCircle,
  FileText,
  Github,
  ExternalLink,
  Layers,
  Cpu,
  Database
} from 'lucide-react'

export default function CodervexCaseStudyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 text-xs font-medium text-primary-700 dark:text-primary-300">
              <FileText className="w-3 h-3" />
              Personal Case Study
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Codervex
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Understanding Complex Software Systems
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              A personal SaaS case study designed to demonstrate my ability to architect, build, and reason about complex web applications.
            </p>
          </div>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Context</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Codervex is a personal SaaS case study created to demonstrate my ability to design and implement a complete web application focused on real-world problems.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Many developers and teams struggle when working with inherited or complex codebases. Codervex explores how structured analysis and AI-assisted workflows can help reconstruct system context in a reliable way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">The Problem</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Codebases grow faster than documentation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Architecture exists only implicitly in the code</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Onboarding is slow and risky</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">New team members struggle to understand system context</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI tools lack system-level context</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generic prompts produce generic results</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fear of breaking things</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Developers hesitate to refactor without understanding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">The Solution</h2>
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Codervex analyzes project structure and source files to infer:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>System purpose and core responsibilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Architecture and component relationships</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Key components and data flows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                  <span>Technical constraints and dependencies</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-lg p-6">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">Output:</strong> A System Understanding Artifact, which can be used as documentation, onboarding material, or as context for AI-assisted development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Layers className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Frontend</h3>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• React</li>
                  <li>• Next.js (App Router)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Backend</h3>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• API-based architecture</li>
                  <li>• Async processing</li>
                  <li>• File analysis pipeline</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Infrastructure</h3>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Prisma ORM</li>
                  <li>• PostgreSQL</li>
                  <li>• Stripe-ready structure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Demonstrates Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Network className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">What This Project Demonstrates</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product Thinking</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Focus on real problems, not just features</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">SaaS Architecture</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end system design</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Trade-off Decisions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Clear scope definition and priorities</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Value Over Features</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Focus on what matters, not what&apos;s cool</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-gray-900 dark:text-white">Note:</strong> Codervex is a case study project created for portfolio and learning purposes. It is not positioned as a commercial product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Explore the Project
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              See the code, architecture decisions, and implementation details
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                View Live Demo
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

