'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { ArrowLeft } from 'lucide-react'

export default function WhyCodervexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block px-8 py-3 bg-primary-500/10 dark:bg-primary-500/20 rounded-full border border-primary-500/30">
              <p className="text-lg sm:text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">
                The story behind the product
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-8 md:p-12 shadow-xl">
            {/* Small label */}
            <div className="mb-8">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Built in real production environments
              </span>
            </div>

            {/* Headline with photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-primary-500/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-28 h-28 rounded-full border-3 border-primary-500/50 overflow-hidden flex-shrink-0 shadow-xl ring-2 ring-primary-500/20">
                  <Image
                    src="/images/foto minha.jpg"
                    alt="Developer"
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  Built by a developer, for developers
                </h2>
              </div>
            </div>

            {/* Main paragraph */}
            <div className="mb-10">
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Codervex was created to solve a real problem I faced in production: understanding complex and legacy codebases quickly under real deadlines.
              </p>
            </div>

            {/* Bottom text */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Built and tested on real systems, not demos. The same analytical thinking behind Codervex is what I apply when building features, maintaining legacy systems, and working with existing architectures.
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white italic">
                Codervex exists because understanding comes before writing code.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

