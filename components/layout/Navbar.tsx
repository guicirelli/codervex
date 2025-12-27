'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CtaButton from '@/components/shared/ui/CtaButton'
import { cn } from '@/lib/utils/common'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-gray-200 dark:border-gray-800'
          : 'bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0">
              <Image
                src="/images/logo codervex pronto.png"
                alt="Codervex Logo"
                fill
                className="object-contain object-center"
                priority
                sizes="(max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Codervex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Início
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/community" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/community') 
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Comunidade
            </Link>
            <Link 
              href="/pricing" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/pricing') 
                  ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Preços
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium transition-colors"
            >
              Entrar
            </Link>
            <CtaButton href="/auth/register" variant="primary" size="sm">
              <span>Criar Conta</span>
            </CtaButton>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/pricing')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Preços
            </Link>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <div className="px-3 py-2">
              </div>
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <div className="px-3" onClick={() => setMobileMenuOpen(false)}>
                <CtaButton href="/auth/register" variant="primary" className="w-full">
                  <span>Criar Conta</span>
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  )
}

