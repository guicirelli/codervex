'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Mail, ArrowLeft, AlertCircle } from 'lucide-react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar solicitação')
      }

      toast.success('Se o email existir, você receberá instruções para redefinir sua senha')
      setSent(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar Senha</h1>
              <p className="text-gray-600">
                {sent 
                  ? 'Verifique seu email para instruções'
                  : 'Digite seu email para receber instruções de recuperação'
                }
              </p>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  Enviamos um email com instruções para redefinir sua senha.
                  Verifique sua caixa de entrada e spam.
                </p>
                <Link href="/auth/login" className="btn-primary inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-10"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar Instruções'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

