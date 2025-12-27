'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { Copy, Check, ArrowLeft, Loader2, Wand2, FileText } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

interface ProjectResult {
  id: string
  summary: {
    technologies: string[]
    structure: string
    features: string[]
  }
  prompt: string
  createdAt: string
}

export default function ResultPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const params = useParams()
  const [result, setResult] = useState<ProjectResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [customForm, setCustomForm] = useState({
    objective: '',
    changes: '',
    technologies: '',
    style: '',
  })

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/auth/login')
    }
  }, [isLoaded, user, router])

  useEffect(() => {
    if (params.id && user) {
      fetchResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, user])

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/prompt/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        toast.error('Project not found')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Error loading result')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Prompt copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Error copying')
    }
  }

  const handleCustomize = () => {
    if (!result) return
    
    const basePrompt = result.prompt
    const custom = `Adapt the project for: ${customForm.objective || 'new objective'}

Desired changes:
${customForm.changes || 'No specific changes'}

Preferred technologies:
${customForm.technologies || 'Keep original technologies'}

Style:
${customForm.style || 'Keep original style'}

---

${basePrompt}`
    
    setCustomPrompt(custom)
    setCustomizing(true)
    toast.success('Custom prompt generated!')
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading result...</p>
        </div>
      </div>
    )
  }

  if (!user || !result) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Project Summary
          </h1>

          {/* Resumo */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-8 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.summary?.technologies?.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Features
                </h3>
                <ul className="space-y-2">
                  {result.summary?.features?.map((feature, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.summary?.structure && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Structure</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.summary.structure}</p>
              </div>
            )}
          </div>

          {/* Prompt Base */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-primary-600" />
                Generated Base Prompt
              </h2>
              <button
                onClick={() => handleCopy(result.prompt)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-6 border-2 border-gray-800 dark:border-gray-800">
              <pre className="text-sm text-gray-100 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                {result.prompt || 'Loading prompt...'}
              </pre>
            </div>
          </div>

          {/* Customização */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Wand2 className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Adjust prompt to your goal
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Formulário */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    What do you want to create now?
                  </label>
                  <input
                    type="text"
                    value={customForm.objective}
                    onChange={(e) => setCustomForm({ ...customForm, objective: e.target.value })}
                    placeholder="e.g: a financial SaaS"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    What should change?
                  </label>
                  <textarea
                    value={customForm.changes}
                    onChange={(e) => setCustomForm({ ...customForm, changes: e.target.value })}
                    placeholder="e.g: remove auth, new layout"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Preferred Technologies
                  </label>
                  <input
                    type="text"
                    value={customForm.technologies}
                    onChange={(e) => setCustomForm({ ...customForm, technologies: e.target.value })}
                    placeholder="e.g: Tailwind, App Router"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Clean', 'Corporate', 'Modern'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setCustomForm({ ...customForm, style })}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                          customForm.style === style
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCustomize}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate custom prompt
                </button>
              </div>

              {/* Resultado Customizado */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Custom Prompt</h3>
                  {customPrompt && (
                    <button
                      onClick={() => handleCopy(customPrompt)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  )}
                </div>
                <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 border-2 border-gray-800 dark:border-gray-800 min-h-[400px]">
                  {customPrompt ? (
                    <pre className="text-sm text-gray-100 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
                      {customPrompt}
                    </pre>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-20">
                      Fill out the form and click &quot;Generate custom prompt&quot;
                    </p>
                  )}
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
