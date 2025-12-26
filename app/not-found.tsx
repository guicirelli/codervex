import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Página não encontrada</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center justify-center">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Link>
            <Link href="/dashboard" className="btn-secondary inline-flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

