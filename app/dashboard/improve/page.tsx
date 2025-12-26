'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import ReferenceProjectSelector from '@/components/features/dashboard/ReferenceProjectSelector'
import ProjectIdeaForm, { ProjectIdea } from '@/components/features/dashboard/ProjectIdeaForm'
import PromptEditor from '@/components/features/dashboard/PromptEditor'
import CreditsDisplay from '@/components/features/dashboard/CreditsDisplay'
import { useAuth } from '@/hooks/features/use-auth'
import toast from 'react-hot-toast'
import { ArrowLeft, Sparkles, Lightbulb } from 'lucide-react'
import Link from 'next/link'

export default function ImprovePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referenceId = searchParams.get('ref')
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState<'reference' | 'customize' | 'editor'>('reference')
  const [selectedReference, setSelectedReference] = useState<any>(null)
  const [customizations, setCustomizations] = useState<ProjectIdea | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('')
  const [loading, setLoading] = useState(false)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const handleReferenceSelect = (project: any) => {
    setSelectedReference(project)
    setStep('customize')
  }

  const handleCustomizationsSubmit = async (idea: ProjectIdea) => {
    setCustomizations(idea)
    await generateImprovedPrompt(idea)
  }

  const generateImprovedPrompt = async (idea: ProjectIdea) => {
    setLoading(true)
    try {
      const response = await fetch('/api/prompt/generate-from-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...idea,
          referenceProject: selectedReference?.id,
          description: `Melhore este projeto usando como referência: ${selectedReference?.title}\n\n${idea.description}`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar prompt')
      }

      setGeneratedPrompt(data.prompt)
      setStep('editor')
      toast.success('Prompt de melhoria gerado com sucesso!')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao gerar prompt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Melhorar Projeto com Referência
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Use um projeto da comunidade como inspiração para melhorar seu projeto
            </p>
          </div>

          <CreditsDisplay user={user} />

          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${step === 'reference' ? 'text-primary-600' : step === 'customize' || step === 'editor' ? 'text-gray-400' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'reference' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Referência</span>
              </div>
              <div className={`w-16 h-1 ${step === 'customize' || step === 'editor' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`flex items-center ${step === 'customize' ? 'text-primary-600' : step === 'editor' ? 'text-gray-400' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'customize' ? 'bg-primary-600 text-white' : step === 'editor' ? 'bg-gray-400 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Customizar</span>
              </div>
              <div className={`w-16 h-1 ${step === 'editor' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              <div className={`flex items-center ${step === 'editor' ? 'text-primary-600' : 'text-gray-300'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'editor' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Prompt</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 'reference' && (
                <ReferenceProjectSelector
                  onSelect={handleReferenceSelect}
                  selectedId={selectedReference?.id}
                />
              )}

              {step === 'customize' && selectedReference && (
                <div className="space-y-6">
                  <div className="card bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <h3 className="font-semibold mb-2 text-primary-900 dark:text-primary-100">
                      Projeto de Referência Selecionado
                    </h3>
                    <p className="text-sm text-primary-800 dark:text-primary-200">
                      {selectedReference.title}
                    </p>
                    <p className="text-xs text-primary-700 dark:text-primary-300 mt-2">
                      {selectedReference.description}
                    </p>
                  </div>
                  <ProjectIdeaForm
                    onGenerate={handleCustomizationsSubmit}
                    loading={loading}
                  />
                </div>
              )}

              {step === 'editor' && generatedPrompt && (
                <PromptEditor
                  initialPrompt={generatedPrompt}
                  onSave={(prompt) => {
                    setGeneratedPrompt(prompt)
                    toast.success('Prompt salvo!')
                  }}
                  onCopy={() => router.push('/dashboard')}
                  editable={true}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-secondary-800 dark:text-secondary-200">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Dica:
                    </p>
                    <p>
                      Use projetos da comunidade como inspiração para melhorar seu próprio projeto.
                      O sistema criará algo novo e único, não uma cópia.
                    </p>
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

