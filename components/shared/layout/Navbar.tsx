'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import React from 'react'
import { motion } from 'framer-motion'
import CtaButton from '@/components/shared/ui/CtaButton'
import { cn } from '@/lib/utils/common'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b gpu-accelerated',
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg border-gray-200'
          : 'bg-white shadow-sm border-gray-200'
      )}
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center h-14 xs:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1.5 xs:space-x-2">
            <div className="w-8 h-8 xs:w-10 xs:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 xs:w-6 xs:h-6 text-white" />
            </div>
            <span className="text-lg xs:text-xl font-bold text-black">Codervex</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
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
              href="/projects/codervex" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/projects/codervex') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Case Study
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/community" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/community') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Comunidade
            </Link>
            <Link 
              href="/pricing" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/pricing') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Preços
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link 
              href="/auth/login" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
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
              href="/projects/codervex"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/projects/codervex')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Case Study
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
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
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

