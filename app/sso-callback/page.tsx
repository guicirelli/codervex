'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useClerk } from '@clerk/nextjs'
import toast from 'react-hot-toast'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

export default function SSOCallbackPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { session } = useClerk()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'info'>('loading')
  const [isUserNotFound, setIsUserNotFound] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    // Verificar se há erro na URL (Clerk pode passar erros via query params)
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    if (errorParam) {
      let errorMessage = 'Authentication failed'
      let userNotFound = false
      let isInfo = false
      
      // Tratar erros específicos do Clerk
      if (errorDescription) {
        const descLower = errorDescription.toLowerCase()
        
        if (descLower.includes('not found') || descLower.includes('does not exist') || descLower.includes('no account')) {
          // Usuário não encontrado - mostrar aviso amigável
          userNotFound = true
          isInfo = true
          errorMessage = 'No account found with this account. You need to sign up first to create an account. Click "Sign Up" to register.'
        } else if (descLower.includes('already exists') || descLower.includes('already registered')) {
          // Conta já existe - mostrar aviso amigável
          isInfo = true
          errorMessage = 'This account is already registered. Please sign in instead.'
        } else if (descLower.includes('email') && descLower.includes('exists')) {
          isInfo = true
          errorMessage = 'An account with this email already exists. Please sign in instead.'
        } else if (descLower.includes('access denied') || descLower.includes('denied')) {
          errorMessage = 'Access denied. You cancelled the authentication.'
        } else if (descLower.includes('invalid') || descLower.includes('invalid_request')) {
          errorMessage = 'Invalid request. Please try again.'
        } else if (descLower.includes('server_error') || descLower.includes('temporarily unavailable')) {
          errorMessage = 'Service temporarily unavailable. Please try again in a moment.'
        } else {
          errorMessage = errorDescription
        }
      } else {
        // Mapear códigos de erro comuns
        switch (errorParam) {
          case 'access_denied':
            errorMessage = 'Access denied. You cancelled the authentication.'
            break
          case 'invalid_request':
            errorMessage = 'Invalid request. Please try again.'
            break
          case 'server_error':
            errorMessage = 'Server error. Please try again later.'
            break
          case 'temporarily_unavailable':
            errorMessage = 'Service temporarily unavailable. Please try again in a moment.'
            break
          default:
            errorMessage = 'Unknown error during authentication.'
        }
      }
      
      setIsUserNotFound(userNotFound)
      setError(errorMessage)
      setStatus(isInfo ? 'info' : 'error')
      
      // Mostrar toast apropriado
      if (isInfo) {
        toast(errorMessage, {
          icon: 'ℹ️',
          duration: 6000,
          style: {
            background: '#1e40af',
            color: '#fff',
          },
        })
      } else {
        toast.error(errorMessage)
      }
      
      // Redirecionar para login após mostrar aviso/erro
      setTimeout(() => {
        router.push('/auth/login')
      }, isInfo ? 6000 : 5000)
      return
    }

    // Verificar autenticação bem-sucedida
    if (isSignedIn && session) {
      setStatus('success')
      toast.success('Authentication successful!')
      
      // Redirecionar para dashboard após breve delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else if (isLoaded && !isSignedIn) {
      // Se não estiver autenticado após o callback, pode ser usuário não encontrado
      // Verificar se há indicação de usuário não encontrado na URL
      const urlParams = new URLSearchParams(window.location.search)
      const errorDesc = urlParams.get('error_description') || ''
      const descLower = errorDesc.toLowerCase()
      
      if (descLower.includes('not found') || descLower.includes('does not exist') || descLower.includes('no account')) {
        setIsUserNotFound(true)
        setError('No account found. You need to sign up first to create an account. Click "Sign Up" to register.')
        setStatus('info')
        toast('No account found. You need to sign up first to create an account. Click "Sign Up" to register.', {
          icon: 'ℹ️',
          duration: 6000,
          style: {
            background: '#1e40af',
            color: '#fff',
          },
        })
      } else {
        setError('Could not complete authentication. Please try again.')
        setStatus('error')
        toast.error('Could not complete authentication.')
      }
      
      setTimeout(() => {
        router.push('/auth/login')
      }, isUserNotFound ? 6000 : 3000)
    }
  }, [isSignedIn, isLoaded, session, router, isUserNotFound])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
          <p className="text-red-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            Back to Login
          </button>
          <p className="text-sm text-gray-400 mt-4">
            Redirecting automatically in a few seconds...
          </p>
        </div>
      </div>
    )
  }

  if (status === 'info') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Info className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Account Not Found</h1>
          <p className="text-blue-300 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/auth/register')}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Back to Login
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Redirecting automatically in a few seconds...
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
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Successful!</h1>
          <p className="text-gray-400 mb-6">Redirecting to dashboard...</p>
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
      </div>
    </div>
  )
}
