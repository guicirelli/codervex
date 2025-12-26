'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { Plus, FileText, Loader2, Calendar, ArrowRight, Hand } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Project {
  id: string
  name: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/login')
    }
  }, [isLoaded, user, router])

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/prompt/history')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.prompts || [])
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
              <Hand className="w-8 h-8 text-primary-600" />
              Olá, {user.firstName || user.emailAddresses[0]?.emailAddress}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Gerencie seus projetos e superprompts
            </p>
          </div>

          {/* Botão Novo Projeto */}
          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-10"
          >
            <Plus className="w-6 h-6" />
            Novo Projeto
          </Link>

          {/* Lista de Projetos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Seus projetos
            </h2>

            {projects.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Você ainda não tem projetos analisados
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comece analisando seu primeiro projeto para ver o resultado aqui
                </p>
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Criar primeiro projeto
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/result/${project.id}`}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-600 dark:group-hover:bg-primary-600 transition-colors">
                        <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {project.name || 'Projeto sem nome'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Analisado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
