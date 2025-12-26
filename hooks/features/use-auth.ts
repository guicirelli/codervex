'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/shared'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      setUser(data.user)
      toast.success('Login realizado com sucesso!')
      return { success: true, user: data.user }
    } catch (error: any) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      toast.success('Logout realizado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  }
}

