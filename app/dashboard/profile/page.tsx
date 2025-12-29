'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { User, Save, Mail, CheckCircle2, AlertCircle, Plus, X, Github } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useSignIn, useUser } from '@clerk/nextjs'

interface Identity {
  displayName?: string | null
  avatar?: string | null
  email: string
  status: string
  hasGoogle?: boolean
  hasGithub?: boolean
  hasPassword?: boolean
}

interface Providers {
  email: boolean
  google: boolean
  github: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { signIn, isLoaded: clerkLoaded } = useSignIn()
  const { user: clerkUser, isLoaded: userLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [providers, setProviders] = useState<Providers>({
    email: false,
    google: false,
    github: false,
  })
  const [canRemove, setCanRemove] = useState(false)
  
  const [formData, setFormData] = useState({
    displayName: '',
    avatar: '',
  })

  useEffect(() => {
    if (!userLoaded) {
      return // Aguardar Clerk carregar
    }
    
    if (!clerkUser) {
      router.push('/auth/login')
      return
    }
    
    // Carregar dados quando usuário estiver autenticado
    loadIdentity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoaded, clerkUser])

  // Carregar providers após identity estar disponível
  useEffect(() => {
    if (identity) {
      loadProviders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity])

  const loadIdentity = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/identity')
      if (response.ok) {
        const data = await response.json()
        setIdentity(data.identity)
        setFormData({
          displayName: data.identity.displayName || '',
          avatar: data.identity.avatar || '',
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        if (response.status === 401) {
          router.push('/auth/login')
        } else {
          // Se não conseguir carregar, criar identidade básica do Clerk
          if (clerkUser) {
            setIdentity({
              displayName: clerkUser.firstName || null,
              avatar: clerkUser.imageUrl || null,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              status: 'active',
            })
            toast.error(errorData.error || 'Error loading profile. Using basic information.')
          } else {
            router.push('/auth/login')
          }
        }
      }
    } catch (error) {
      console.error('Error loading identity:', error)
      // Se houver erro de rede, usar dados básicos do Clerk
      if (clerkUser) {
        setIdentity({
          displayName: clerkUser.firstName || null,
          avatar: clerkUser.imageUrl || null,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          status: 'active',
        })
        toast.error('Network error. Using basic information.')
      } else {
        router.push('/auth/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadProviders = async () => {
    try {
      const response = await fetch('/api/auth/providers')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers)
        setCanRemove(data.canRemove)
      }
    } catch (error) {
      console.error('Erro ao carregar providers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData: any = {
        displayName: formData.displayName || null,
        avatar: formData.avatar || null,
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error updating profile')
      }

      toast.success('Profile updated successfully!')
      await loadIdentity()
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkProvider = async (provider: 'google' | 'github') => {
    try {
      if (!clerkLoaded || !signIn) {
        toast.error('Authentication service not available')
        return
      }

      const redirectUrl = window.location.origin + '/sso-callback'
      const redirectUrlComplete = window.location.origin + '/dashboard/profile'

      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: redirectUrl,
        redirectUrlComplete: redirectUrlComplete,
      })
    } catch (error: any) {
      console.error('Erro ao vincular provider:', error)
      toast.error(`Error linking ${provider === 'google' ? 'Google' : 'GitHub'}`)
    }
  }

  const handleUnlinkProvider = async (provider: 'google' | 'github' | 'password') => {
    if (!canRemove) {
      toast.error('You need to have at least one active login method')
      return
    }

    const activeCount = Object.values(providers).filter(Boolean).length
    if (activeCount <= 1) {
      toast.error('You need to have at least one active login method')
      return
    }

    if (!confirm(`Are you sure you want to remove the ${provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'Email and Password'} login method?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/auth/providers?provider=${provider}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error removing method')
      }

      toast.success('Login method removed successfully')
      await loadProviders()
    } catch (error: any) {
      toast.error(error.message || 'Error removing login method')
    } finally {
      setLoading(false)
    }
  }

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

          {/* Informações Pessoais */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {formData.avatar ? (
                    <Image
                      src={formData.avatar}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-primary-500/50 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-2 border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: Image URL</p>
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  maxLength={100}
                  className="w-full px-4 py-2 border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={identity.email}
                  disabled
                  className="w-full px-4 py-2 border-2 border-gray-700 bg-gray-800/50 text-gray-400 rounded-lg cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Métodos de Login Vinculados */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Login Methods</h2>

            <div className="space-y-4">
              {/* Email e Senha */}
              <div className="p-4 border-2 border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-white">Email and Password</h3>
                      <p className="text-sm text-gray-400">{identity.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {providers.email ? (
                      <>
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Vinculado</span>
                        </div>
                        {canRemove && (
                          <button
                            onClick={() => handleUnlinkProvider('password')}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Remover
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not linked</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Google */}
              <div className="p-4 border-2 border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold text-white">Google</h3>
                      <p className="text-sm text-gray-400">Quick login with Google</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {providers.google ? (
                      <>
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Vinculado</span>
                        </div>
                        {canRemove && (
                          <button
                            onClick={() => handleUnlinkProvider('google')}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Remover
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleLinkProvider('google')}
                        disabled={loading || !clerkLoaded}
                        className="px-4 py-2 text-sm font-medium text-primary-500 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Link
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub */}
              <div className="p-4 border-2 border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-white">GitHub</h3>
                      <p className="text-sm text-gray-400">Quick login with GitHub</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {providers.github ? (
                      <>
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Vinculado</span>
                        </div>
                        {canRemove && (
                          <button
                            onClick={() => handleUnlinkProvider('github')}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Remover
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleLinkProvider('github')}
                        disabled={loading || !clerkLoaded}
                        className="px-4 py-2 text-sm font-medium text-primary-500 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
