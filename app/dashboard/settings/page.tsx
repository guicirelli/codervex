'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { User, Save, Key, Mail, CreditCard, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/features/use-auth'
import { validateEmail, validatePassword } from '@/lib/utils/common'

export default function SettingsPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'billing'>('profile')
  
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

