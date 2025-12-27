'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import LoginModal from '@/components/shared/ui/LoginModal'
import { Plus, FileText, Loader2, Calendar, ArrowRight, Hand, Lock, Sparkles } from 'lucide-react'

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
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (user && isLoaded) {
      fetchProjects()
    } else {
      setLoading(false)
      }
  }, [user, isLoaded])

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

  const handleAction = (action: () => void) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    action()
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="Please log in to create and manage your projects"
      />
      
      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
              {user ? (
                <>
                  <Hand className="w-8 h-8 text-primary-500" />
                  Hello, {user.firstName || user.emailAddresses[0]?.emailAddress}
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 text-primary-500" />
                  Dashboard
                </>
              )}
              </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {user 
                ? 'Manage your projects and superprompts'
                : 'View the dashboard. Log in to create and manage projects.'
              }
            </p>
          </div>

          {/* Botão Novo Projeto */}
          <div
            onClick={() => handleAction(() => router.push('/dashboard/create'))}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold text-lg hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-10 cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            {user ? 'New Project' : 'Create Project (Login required)'}
            {!user && <Lock className="w-5 h-5" />}
          </div>

          {/* Lista de Projetos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {user ? 'Your Projects' : 'Projects (example)'}
                </h2>

            {!user ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <div className="w-20 h-20 bg-primary-500/10 dark:bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Log in to see your projects
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Create a free account to start analyzing projects and generating superprompts in minutes
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-md hover:shadow-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-500 text-primary-500 rounded-lg font-semibold hover:bg-primary-500/10 dark:hover:bg-primary-500/20 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  You don&apos;t have any analyzed projects yet
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start by analyzing your first project to see the results here
                </p>
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-500 transition-colors shadow-md hover:shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create first project
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/result/${project.id}`}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary-500/20 dark:bg-primary-500/20 rounded-lg flex items-center justify-center group-hover:bg-primary-500 dark:group-hover:bg-primary-500 transition-colors">
                        <FileText className="w-6 h-6 text-primary-500 dark:text-primary-500 group-hover:text-white transition-colors" />
            </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-500 transition-colors" />
          </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-500 transition-colors">
                      {project.name || 'Unnamed Project'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Analyzed on {new Date(project.createdAt).toLocaleDateString('en-US')}</span>
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
