'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useClerk } from '@clerk/nextjs'
import toast from 'react-hot-toast'

export default function SSOCallbackPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { session } = useClerk()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return

    // Verificar se há erro na URL (Clerk pode passar erros via query params)
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    if (errorParam) {
      let errorMessage = 'Authentication failed'
      
      // Tratar erros específicos do Clerk
      if (errorDescription) {
        if (errorDescription.includes('already exists') || errorDescription.includes('already registered')) {
          errorMessage = 'This account is already registered. Please sign in instead.'
        } else if (errorDescription.includes('email') && errorDescription.includes('exists')) {
          errorMessage = 'An account with this email already exists. Please sign in.'
        } else {
          errorMessage = errorDescription
        }
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      
      // Redirecionar para login após mostrar erro
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
      return
    }

    if (isSignedIn) {
      // Redirecionar para dashboard após autenticação bem-sucedida
      toast.success('Authentication successful!')
      router.push('/dashboard')
    } else {
      // Se não estiver autenticado após o callback, pode ter havido um erro
      // Aguardar um pouco antes de redirecionar para login
      const timer = setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isSignedIn, isLoaded, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Completing authentication...</p>
      </div>
    </div>
  )
}

