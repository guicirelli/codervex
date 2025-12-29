'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import LoginModal from '@/components/shared/ui/LoginModal'
import toast from 'react-hot-toast'
import { Plus, Upload, Wand2, X, Loader2, Github, Copy, Download, Hand, FileText, Clock, ExternalLink } from 'lucide-react'


export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  // Estados para demonstração
  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link')
  const [link, setLink] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [enableCustomization, setEnableCustomization] = useState(false)
  const [customInstructions, setCustomInstructions] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [linkError, setLinkError] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<{ markdown: string; promptId: string; source: string; type: 'repository' | 'file'; fileCount?: number } | null>(null)
  const [history, setHistory] = useState<Array<{ id: string; title: string; createdAt: string; projectType?: string; stack?: string }>>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyStorageAvailable, setHistoryStorageAvailable] = useState(true)
  const [historyWarning, setHistoryWarning] = useState<string>('')


  // Carregar histórico de análises
  const loadHistory = useCallback(async () => {
    if (!user) return
    
    setLoadingHistory(true)
    try {
      const response = await fetch('/api/prompt/history', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setHistory(data.prompts || [])
        setHistoryStorageAvailable(data.storageAvailable !== false)
        setHistoryWarning(typeof data.warning === 'string' ? data.warning : '')
      } else {
        // Do not show as a crash; just mark history as temporarily unavailable.
        setHistoryStorageAvailable(false)
        setHistoryWarning('Prompt history is temporarily unavailable.')
      }
    } catch (error) {
      console.error('Error loading history:', error)
      setHistoryStorageAvailable(false)
      setHistoryWarning('Prompt history is temporarily unavailable.')
    } finally {
      setLoadingHistory(false)
    }
  }, [user])

  // Carregar histórico quando usuário estiver logado
  useEffect(() => {
    if (user && isLoaded) {
      loadHistory()
    }
  }, [user, isLoaded, loadHistory])

  const validateGitHubLink = (url: string): boolean => {
    if (!url.trim()) return false
    try {
      // Adicionar https:// se não tiver protocolo
      const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
        ? url 
        : `https://${url}`
      
      const urlObj = new URL(urlWithProtocol)
      const isValidHost = urlObj.hostname === 'github.com' || urlObj.hostname === 'www.github.com'
      
      // Verificar se tem pelo menos username/repository no path
      const pathParts = urlObj.pathname.split('/').filter(p => p)
      const hasValidPath = pathParts.length >= 2
      
      return isValidHost && hasValidPath
    } catch {
      return false
    }
  }

  const handleLinkChange = (value: string) => {
    setLink(value)
    if (value.trim() && !validateGitHubLink(value)) {
      setLinkError('Please enter a valid GitHub repository URL')
    } else {
      setLinkError('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    // Validar baseado na aba ativa
    if (activeTab === 'link') {
      if (!link.trim()) {
        toast.error('Please enter a GitHub repository URL')
        setLinkError('GitHub repository URL is required')
        return
      }
      if (!validateGitHubLink(link)) {
        toast.error('Please enter a valid GitHub repository URL')
        setLinkError('Please enter a valid GitHub repository URL')
        return
      }
    }
    
    if (activeTab === 'upload' && files.length === 0) {
      toast.error('Add at least one file')
      return
    }

    if (!user) {
      router.push('/auth/login?redirect=/dashboard')
      return
    }

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      
      // Adicionar link GitHub
      if (activeTab === 'link' && link.trim()) {
        formData.append('githubUrl', link.trim())
      }
      
      // Adicionar arquivos (apenas ZIP)
      if (activeTab === 'upload' && files.length > 0) {
        const zipFile = files.find(f => f.name.endsWith('.zip'))
        if (zipFile) {
          formData.append('files', zipFile)
        } else {
          toast.error('Please upload a ZIP file')
          setIsProcessing(false)
          return
        }
      }
      
      // Adicionar customização se habilitada (opcional para MVP)
      if (enableCustomization && customInstructions.trim()) {
        formData.append('customInstructions', customInstructions)
      }

      const response = await fetch('/api/prompt/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error processing project')
      }

      // Verificar se o prompt foi retornado
      if (!data.prompt) {
        throw new Error('No prompt received from server')
      }

      toast.success('Project analyzed successfully!')
      
      // Extrair nome do repositório ou arquivos
      let source = ''
      let type: 'repository' | 'file' = 'repository'
      let fileNames: string[] = []
      
      if (activeTab === 'link' && link.trim()) {
        // Extrair nome do repositório da URL
        try {
          const url = new URL(link.startsWith('http') ? link : `https://${link}`)
          const pathParts = url.pathname.split('/').filter(p => p)
          if (pathParts.length >= 2) {
            source = pathParts[pathParts.length - 1] // Nome do repositório
          } else {
            source = link
          }
          type = 'repository'
        } catch {
          source = link
          type = 'repository'
        }
      } else if (activeTab === 'upload' && files.length > 0) {
        // Guardar nomes dos arquivos para exibição limitada
        fileNames = files.map(f => f.name)
        // Para exibição, mostrar apenas os primeiros 2 nomes + contador
        if (files.length === 1) {
          source = fileNames[0]
        } else if (files.length <= 2) {
          source = fileNames.join(', ')
        } else {
          source = fileNames.slice(0, 2).join(', ') + `, and ${files.length - 2} more`
        }
        type = 'file'
      }
      
      // Atualizar estado com o resultado
      setAnalysisResult({
        markdown: data.prompt,
        promptId: data.promptId || `temp-${Date.now()}`,
        source: source || 'Project',
        type,
        fileCount: type === 'file' ? files.length : undefined
      })
      
      // Limpar formulário
      setLink('')
      setFiles([])
      setCustomInstructions('')
      setEnableCustomization(false)
      
      // Recarregar histórico após nova análise (com delay para garantir que foi salvo)
      if (user) {
        setTimeout(() => {
          loadHistory()
        }, 1000)
      }
      
      // Atualizar a página para mostrar o resultado
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      toast.error(error.message || 'Error processing project')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-[150vh] flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        title="Login Required"
        message="Please log in to create and manage your projects"
      />
      
      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Header - só aparece quando não há resultado */}
          {!analysisResult && (
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
                {user ? (
                  <>
                    <Hand className="w-8 h-8 text-primary-500" />
                    Hello, {user.firstName || user.emailAddresses[0]?.emailAddress}
                  </>
                ) : (
                  <>
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
          )}

          {/* Mostrar resultado da análise ou formulário */}
          {analysisResult ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-10 shadow-lg p-8">
              {/* Título e botões na mesma linha */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analysisResult.source}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {analysisResult.type === 'repository' ? 'Repository' : analysisResult.fileCount && analysisResult.fileCount > 1 ? `${analysisResult.fileCount} Files` : 'File'}
                  </p>
                </div>
                
                {/* Botões de ação */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(analysisResult.markdown)
                      toast.success('Copied to clipboard!')
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([analysisResult.markdown], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `project-context-${analysisResult.promptId}.md`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                      toast.success('Downloaded!')
                    }}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              
              {/* Prompt - sem scroll interno, cresce com o conteúdo */}
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 border border-gray-700">
                <pre className="text-sm text-gray-300 dark:text-gray-400 font-mono whitespace-pre-wrap">
                  {analysisResult.markdown}
                </pre>
              </div>
              
              <button
                onClick={() => {
                  setAnalysisResult(null)
                  setLink('')
                  setFiles([])
                  setActiveTab('link')
                  setLinkError('')
                  setCustomInstructions('')
                  setEnableCustomization(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="mt-6 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Analyze Another Project
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-10 shadow-lg overflow-hidden">
              {/* Tabs - Estilo navegador - Preenche toda a largura sem margens */}
              <div className="flex bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setActiveTab('link')
                    setAnalysisResult(null)
                  }}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition-all ${
                    activeTab === 'link'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b-2 border-primary-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Github className="w-4 h-4" />
                    Link
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('upload')
                    setAnalysisResult(null)
                  }}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-b-2 border-primary-500'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </div>
                </button>
              </div>
              
              {/* Conteúdo das tabs */}
              <div className="p-8">
                {/* Conteúdo da Tab Link */}
                {activeTab === 'link' && (
                  <div className="mb-8">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleLinkChange(e.target.value)}
                      placeholder="https://github.com/username/repository"
                      className={`w-full px-6 py-4 text-base border-2 ${
                        linkError 
                          ? 'border-red-500 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    />
                    {linkError && (
                      <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                        {linkError}
                      </p>
                    )}
                  </div>
                )}

                {/* Conteúdo da Tab Upload */}
                {activeTab === 'upload' && (
                  <div className="mb-8">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to select files or drag them here
                        </span>
                        <span className="text-xs text-gray-500">
                          ZIP, code files, etc.
                        </span>
                      </label>
                    </div>
                    
                    {/* Lista de arquivos selecionados */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024).toFixed(2)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Customização do Prompt */}
                <div className="mb-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableCustomization}
                      onChange={(e) => setEnableCustomization(e.target.checked)}
                      className="w-6 h-6 text-primary-500 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-6 h-6 text-primary-500" />
                      <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Customize the generated prompt (optional)
                      </span>
                    </div>
                  </label>
                  
                  {enableCustomization && (
                    <div className="mt-4">
                      <textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="E.g.: Remove authentication, apply corporate layout, keep dashboard structure..."
                        className="w-full px-6 py-4 text-base border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Specify how you want to customize the generated prompt. Leave empty to use default settings.
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão de Análise */}
                {!user ? (
                  <Link
                    href="/auth/login?redirect=/dashboard"
                    className="w-full px-10 py-5 bg-primary-500 text-white rounded-lg font-bold text-xl hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Plus className="w-7 h-7" />
                    Sign in to Analyze
                  </Link>
                ) : (
                  <button
                    onClick={handleAnalyze}
                    disabled={isProcessing || (activeTab === 'link' && (!link.trim() || !!linkError)) || (activeTab === 'upload' && files.length === 0)}
                    className="w-full px-10 py-5 bg-primary-500 text-white rounded-lg font-bold text-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-7 h-7" />
                        <span>Analyze Project</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Latest Analyses - Histórico (only show on dashboard input mode, not when the prompt result is visible) */}
          {user && !analysisResult && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-8 mt-10">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Analyses</h2>
              </div>
              
              {loadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading history...</span>
                </div>
              ) : !historyStorageAvailable ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {historyWarning || 'Prompt history is disabled.'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    To enable it, set <span className="font-mono">DATABASE_URL</span> and run Prisma migrations.
                  </p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No analyses yet. Create your first one above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 10).map((prompt, index) => (
                    <Link
                      key={prompt.id}
                      href={`/dashboard/result/${prompt.id}`}
                      className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                              #{history.length - index}
                            </span>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {prompt.title || 'Untitled Analysis'}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {prompt.projectType && (
                              <span className="capitalize">{prompt.projectType}</span>
                            )}
                            {prompt.stack && (
                              <span className="truncate">{prompt.stack}</span>
                            )}
                            <span>
                              {new Date(prompt.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
