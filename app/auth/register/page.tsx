'use client'

import { SignUp } from '@clerk/nextjs'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { Sparkles, ArrowRight, CheckCircle, Zap, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden md:block space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Get Started
                </h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Create your account and transform projects into superprompts in minutes
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Free to Start
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Try without commitment, no credit card required
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Save 8+ Hours
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Complete project analysis in minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Join Thousands
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Developers are already using Codervex
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="md:hidden mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Get Started
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your account for free
                </p>
              </div>

              <SignUp 
                appearance={{
                  elements: {
                    rootBox: 'mx-auto w-full',
                    card: 'shadow-none bg-transparent',
                    headerTitle: 'text-2xl font-bold text-gray-900 dark:text-white',
                    headerSubtitle: 'text-gray-600 dark:text-gray-400',
                    socialButtonsBlockButton: 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all',
                    formButtonPrimary: 'bg-primary-500 hover:bg-primary-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl',
                    formFieldInput: 'border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg',
                    footerActionLink: 'text-primary-500 hover:text-primary-500 font-semibold',
                    identityPreviewText: 'text-gray-900 dark:text-white',
                    identityPreviewEditButton: 'text-primary-500 hover:text-primary-500',
                  },
                }}
                routing="path"
                path="/auth/register"
                signInUrl="/auth/login"
                afterSignUpUrl="/dashboard"
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <a 
                  href="/auth/login" 
                  className="text-primary-500 hover:text-primary-500 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  Log in
                  <ArrowRight className="w-4 h-4" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
