'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useClerk } from '@clerk/nextjs'
import toast from 'react-hot-toast'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SSOCallbackPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { session } = useClerk()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!isLoaded) return

    // Verificar se há erro na URL (Clerk pode passar erros via query params)
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    if (errorParam) {
      let errorMessage = 'Falha na autenticação'
      
      // Tratar erros específicos do Clerk
      if (errorDescription) {
        const descLower = errorDescription.toLowerCase()
        
        if (descLower.includes('already exists') || descLower.includes('already registered')) {
          errorMessage = 'Esta conta já está cadastrada. Faça login em vez de cadastrar.'
        } else if (descLower.includes('email') && descLower.includes('exists')) {
          errorMessage = 'Uma conta com este email já existe. Faça login.'
        } else if (descLower.includes('not found') || descLower.includes('does not exist')) {
          errorMessage = 'Nenhuma conta encontrada. Faça o cadastro primeiro.'
        } else if (descLower.includes('access denied') || descLower.includes('denied')) {
          errorMessage = 'Acesso negado. Você cancelou a autenticação.'
        } else if (descLower.includes('invalid') || descLower.includes('invalid_request')) {
          errorMessage = 'Requisição inválida. Tente novamente.'
        } else if (descLower.includes('server_error') || descLower.includes('temporarily unavailable')) {
          errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.'
        } else {
          errorMessage = errorDescription
        }
      } else {
        // Mapear códigos de erro comuns
        switch (errorParam) {
          case 'access_denied':
            errorMessage = 'Acesso negado. Você cancelou a autenticação.'
            break
          case 'invalid_request':
            errorMessage = 'Requisição inválida. Tente novamente.'
            break
          case 'server_error':
            errorMessage = 'Erro no servidor. Tente novamente mais tarde.'
            break
          case 'temporarily_unavailable':
            errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.'
            break
          default:
            errorMessage = 'Erro desconhecido durante a autenticação.'
        }
      }
      
      setError(errorMessage)
      setStatus('error')
      toast.error(errorMessage)
      
      // Redirecionar para login após mostrar erro
      setTimeout(() => {
        router.push('/auth/login')
      }, 5000)
      return
    }

    // Verificar autenticação bem-sucedida
    if (isSignedIn && session) {
      setStatus('success')
      toast.success('Autenticação realizada com sucesso!')
      
      // Redirecionar para dashboard após breve delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else if (isLoaded && !isSignedIn) {
      // Se não estiver autenticado após o callback, pode ter havido um erro silencioso
      setError('Não foi possível completar a autenticação. Tente novamente.')
      setStatus('error')
      toast.error('Não foi possível completar a autenticação.')
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    }
  }, [isSignedIn, isLoaded, session, router])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Erro na Autenticação</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            Voltar para Login
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Redirecionando automaticamente em alguns segundos...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Autenticação Bem-Sucedida!</h1>
          <p className="text-gray-400 mb-6">Redirecionando para o dashboard...</p>
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completando autenticação...</p>
        <p className="text-gray-400 text-sm mt-2">Aguarde um momento</p>
      </div>
    </div>
  )
}
