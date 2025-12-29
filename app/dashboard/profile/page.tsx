'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { User, Save, AtSign, Mail, Calendar, MapPin, CheckCircle2, AlertCircle, Plus, X, Github } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useSignIn, useUser } from '@clerk/nextjs'
import { validateUsernameFormat, normalizeUsername } from '@/lib/utils/username-validation'

interface Identity {
  username?: string | null
  displayName?: string | null
  avatar?: string | null
  email: string
  status: string
  dataNascimento?: string | null
  localizacao?: string | null
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
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [providers, setProviders] = useState<Providers>({
    email: false,
    google: false,
    github: false,
  })
  const [canRemove, setCanRemove] = useState(false)
  
  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    avatar: '',
    dataNascimento: '',
    localizacao: '',
  })

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)

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
          username: data.identity.username || '',
          displayName: data.identity.displayName || '',
          avatar: data.identity.avatar || '',
          dataNascimento: data.identity.dataNascimento 
            ? new Date(data.identity.dataNascimento).toISOString().split('T')[0]
            : '',
          localizacao: data.identity.localizacao || '',
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        if (response.status === 401) {
          router.push('/auth/login')
        } else {
          // Se não conseguir carregar, criar identidade básica do Clerk
          if (clerkUser) {
            setIdentity({
              username: null,
              displayName: clerkUser.firstName || null,
              avatar: clerkUser.imageUrl || null,
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              status: 'active',
              dataNascimento: null,
              localizacao: null,
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
          username: null,
          displayName: clerkUser.firstName || null,
          avatar: clerkUser.imageUrl || null,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          status: 'active',
          dataNascimento: null,
          localizacao: null,
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

  const checkUsername = async (username: string) => {
    if (!username || username.trim().length === 0) {
      setUsernameAvailable(null)
      setUsernameError(null)
      return
    }

    const validation = validateUsernameFormat(username)
    if (!validation.valid) {
      setUsernameAvailable(false)
        setUsernameError(validation.error || 'Invalid username')
      return
    }

    setCheckingUsername(true)
    setUsernameError(null)

    try {
      const response = await fetch('/api/user/identity/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (response.ok) {
        setUsernameAvailable(data.available)
        if (!data.available) {
          setUsernameError('This username is already in use')
        }
      } else {
        setUsernameAvailable(false)
        setUsernameError(data.error || 'Error checking username')
      }
    } catch (error) {
      setUsernameAvailable(false)
        setUsernameError('Error checking availability')
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    // Bloquear caracteres inválidos em tempo real
    // Apenas letras (maiúsculas/minúsculas) e números
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '')
    
    // Limitar comprimento
    const limitedValue = filteredValue.slice(0, 30)
    
    // Validar formato primeiro em tempo real
    const validation = validateUsernameFormat(limitedValue)
    if (!validation.valid) {
      setUsernameAvailable(false)
      setUsernameError(validation.error || 'Invalid username')
      setFormData(prev => ({ ...prev, username: limitedValue }))
      return
    }
    
    // Limpar erro se válido
    setUsernameError(null)
    
    const normalized = normalizeUsername(limitedValue)
    setFormData(prev => ({ ...prev, username: normalized }))
    
    // Verificar disponibilidade apenas se mudou e formato é válido
    if (normalized !== identity?.username) {
      checkUsername(normalized)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validar username se foi alterado
      if (formData.username !== identity?.username) {
        const validation = validateUsernameFormat(formData.username)
        if (!validation.valid) {
          toast.error(validation.error || 'Invalid username')
          setLoading(false)
          return
        }

        if (usernameAvailable === false) {
          toast.error('This username is already in use')
          setLoading(false)
          return
        }
      }

      const updateData: any = {
        username: formData.username || null,
        displayName: formData.displayName || null,
        avatar: formData.avatar || null,
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento) : null,
        localizacao: formData.localizacao || null,
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
              Personal Information
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
                    <p className="text-xs text-gray-500 mt-1">Avatar image URL</p>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <AtSign className="w-4 h-4" />
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`w-full px-4 py-2 border-2 ${
                      usernameError
                        ? 'border-red-500 bg-red-500/10'
                        : usernameAvailable === true
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-700 bg-gray-800'
                    } text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    placeholder="YourUsername"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {checkingUsername ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : usernameAvailable === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : usernameError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                </div>
                {usernameError && (
                  <p className="mt-1 text-sm text-red-400">{usernameError}</p>
                )}
                {usernameAvailable === true && (
                  <p className="mt-1 text-sm text-green-400">Username available!</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Your username appears as @{formData.username || 'username'} on Codervex
                </p>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
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

              {/* Data de Nascimento */}
              <div>
                <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date of Birth
                </label>
                <input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataNascimento: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              {/* Localização */}
              <div>
                <label htmlFor="localizacao" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  id="localizacao"
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                  maxLength={100}
                  className="w-full px-4 py-2 border-2 border-gray-700 bg-gray-800 text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="City, Country"
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
              </div>

              <button
                type="submit"
                disabled={loading || checkingUsername || (usernameAvailable === false && formData.username !== identity.username)}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Métodos de Login Vinculados */}
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Login Methods</h2>
            <p className="text-sm text-gray-400 mb-6">
              Link multiple methods to make accessing your account easier
            </p>

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

            {/* Aviso de segurança */}
            {!canRemove && (
              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-1">Account Protection</h4>
                    <p className="text-sm text-yellow-300">
                      You need to have at least one active login method. Add another method before removing this one.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
