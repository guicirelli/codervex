'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { User, Save, Key, Mail, CreditCard, AlertCircle, Shield, CheckCircle2, X, Plus } from 'lucide-react'
import { useSignIn } from '@clerk/nextjs'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/features/use-auth'
import { validateEmail, validatePassword } from '@/lib/utils/common'

export default function SettingsPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'security' | 'billing'>('profile')
  const { signIn, isLoaded: clerkLoaded } = useSignIn()
  
  // Estados para gerenciamento de métodos de login
  const [providers, setProviders] = useState<{
    email: boolean
    google: boolean
    github: boolean
  }>({
    email: false,
    google: false,
    github: false,
  })
  const [canRemove, setCanRemove] = useState(false)
  const [loadingProviders, setLoadingProviders] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email,
      })
    }
  }, [user])

  // Carregar métodos de login vinculados
  useEffect(() => {
    if (user) {
      loadProviders()
    }
  }, [user])

  const loadProviders = async () => {
    setLoadingProviders(true)
    try {
      const response = await fetch('/api/auth/providers')
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers)
        setCanRemove(data.canRemove)
      }
    } catch (error) {
      console.error('Erro ao carregar providers:', error)
    } finally {
      setLoadingProviders(false)
    }
  }

  const handleLinkProvider = async (provider: 'google' | 'github') => {
    try {
      // Usar Clerk para iniciar OAuth
      if (!clerkLoaded || !signIn) {
        toast.error('Serviço de autenticação não disponível')
        return
      }

      const redirectUrl = window.location.origin + '/sso-callback'
      const redirectUrlComplete = window.location.origin + '/dashboard/settings?tab=security'

      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: redirectUrl,
        redirectUrlComplete: redirectUrlComplete,
      })
    } catch (error: any) {
      console.error('Erro ao vincular provider:', error)
      toast.error(`Erro ao vincular ${provider === 'google' ? 'Google' : 'GitHub'}`)
    }
  }

  const handleUnlinkProvider = async (provider: 'google' | 'github' | 'password') => {
    if (!canRemove) {
      toast.error('Você precisa ter pelo menos um método de login ativo')
      return
    }

    const activeCount = Object.values(providers).filter(Boolean).length
    if (activeCount <= 1) {
      toast.error('Você precisa ter pelo menos um método de login ativo')
      return
    }

    if (!confirm(`Tem certeza que deseja remover o método de login ${provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'Email e Senha'}?`)) {
      return
    }

    setLoadingProviders(true)
    try {
      const response = await fetch(`/api/auth/providers?provider=${provider}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao remover método')
      }

      toast.success('Método de login removido com sucesso')
      await loadProviders()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover método de login')
    } finally {
      setLoadingProviders(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!validateEmail(profileData.email)) {
      toast.error('Email inválido')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil')
      }

      toast.success('Perfil atualizado com sucesso!')
      await refreshUser()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem')
      setLoading(false)
      return
    }

    const validation = validatePassword(passwordData.newPassword)
    if (!validation.valid) {
      toast.error(validation.errors[0])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar senha')
      }

      toast.success('Senha atualizada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-4 font-medium transition-colors flex items-center ${
                activeTab === 'profile'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-3 px-4 font-medium transition-colors flex items-center ${
                activeTab === 'password'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Key className="w-4 h-4 mr-2" />
              Senha
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-4 font-medium transition-colors flex items-center ${
                activeTab === 'security'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-3 px-4 font-medium transition-colors flex items-center ${
                activeTab === 'billing'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Cobrança
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Perfil</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input-field"
                    placeholder="Seu nome"
                  />
                </div>

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
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input-field pl-10"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Alterar Senha</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha Atual
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                  />
                  {passwordData.newPassword && (
                    <div className="mt-2 text-sm text-gray-500">
                      <p>A senha deve conter:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>Pelo menos 6 caracteres</li>
                        <li>Uma letra maiúscula</li>
                        <li>Uma letra minúscula</li>
                        <li>Um número</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center disabled:opacity-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  {loading ? 'Atualizando...' : 'Atualizar Senha'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Métodos de Login</h2>
              <p className="text-sm text-gray-600 mb-6">
                Gerencie como você acessa sua conta. Você pode vincular múltiplos métodos para facilitar o login.
              </p>

              {loadingProviders ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Email e Senha */}
                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Email e Senha</h3>
                          <p className="text-sm text-gray-600">Login tradicional com email e senha</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {providers.email ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Vinculado</span>
                            </div>
                            {canRemove && (
                              <button
                                onClick={() => handleUnlinkProvider('password')}
                                disabled={loadingProviders}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Remover
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => router.push('/dashboard/settings?tab=password')}
                            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Adicionar Senha
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Google */}
                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Google</h3>
                          <p className="text-sm text-gray-600">Login rápido com sua conta Google</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {providers.google ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Vinculado</span>
                            </div>
                            {canRemove && (
                              <button
                                onClick={() => handleUnlinkProvider('google')}
                                disabled={loadingProviders}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Remover
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => handleLinkProvider('google')}
                            disabled={loadingProviders}
                            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Vincular
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="p-4 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">GitHub</h3>
                          <p className="text-sm text-gray-600">Login rápido com sua conta GitHub</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {providers.github ? (
                          <>
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">Vinculado</span>
                            </div>
                            {canRemove && (
                              <button
                                onClick={() => handleUnlinkProvider('github')}
                                disabled={loadingProviders}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Remover
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => handleLinkProvider('github')}
                            disabled={loadingProviders}
                            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Vincular
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Aviso de segurança */}
                  {!canRemove && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-900 mb-1">Proteção de Conta</h4>
                          <p className="text-sm text-yellow-800">
                            Você precisa ter pelo menos um método de login ativo. Adicione outro método antes de remover este.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informação adicional */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Como funciona?</h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Sua conta está vinculada ao seu email: <strong>{user.email}</strong></li>
                      <li>Você pode usar qualquer método vinculado para fazer login</li>
                      <li>Vincular múltiplos métodos facilita o acesso à sua conta</li>
                      <li>Pelo menos um método deve permanecer ativo</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Cobrança e Assinatura</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Plano Atual</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold">
                      {user.subscription === 'monthly' ? 'Assinatura Mensal' : 'Por Projeto'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {user.subscription === 'monthly' 
                      ? 'Você tem acesso ilimitado a todos os recursos.'
                      : `Você tem ${user.credits} crédito${user.credits !== 1 ? 's' : ''} disponível${user.credits !== 1 ? 'eis' : ''}.`
                    }
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Histórico de Pagamentos</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Seus pagamentos recentes aparecerão aqui.
                  </p>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="btn-primary"
                  >
                    Gerenciar Assinatura
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

