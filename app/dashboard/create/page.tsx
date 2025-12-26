'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { Upload, Github, Loader2, X, ArrowLeft, FileText, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export const dynamic = 'force-dynamic'

export default function CreateProjectPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [processing, setProcessing] = useState(false)
  const [method, setMethod] = useState<'upload' | 'github'>('upload')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    toast.success(`${acceptedFiles.length} arquivo(s) selecionado(s)`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/javascript': ['.js', '.jsx'],
      'application/typescript': ['.ts', '.tsx'],
      'application/json': ['.json'],
      'text/css': ['.css'],
      'text/html': ['.html'],
    },
    multiple: true,
  })

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (method === 'upload' && files.length === 0) {
      toast.error('Selecione pelo menos um arquivo')
      return
    }

    if (method === 'github' && !githubUrl) {
      toast.error('Cole o link do GitHub')
      return
    }

    setProcessing(true)

    try {
      const formData = new FormData()
      
      if (method === 'upload') {
        files.forEach((file) => {
          formData.append('files', file)
        })
      } else {
        formData.append('githubUrl', githubUrl)
      }

      const response = await fetch('/api/prompt/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar projeto')
      }

      toast.success('Projeto analisado com sucesso!')
      router.push(`/dashboard/result/${data.promptId}`)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar projeto')
    } finally {
      setProcessing(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <div className="flex-1 py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Dashboard
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Novo Projeto
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Escolha como enviar seu projeto. Zero dúvida. Zero termo técnico.
          </p>

          {/* Método de Envio */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setMethod('upload')}
              className={`p-8 border-2 rounded-xl text-left transition-all ${
                method === 'upload'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  method === 'upload' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Upload className={`w-6 h-6 ${method === 'upload' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Upload de arquivos
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aceita .zip ou múltiplos arquivos
              </p>
            </button>

            <button
              onClick={() => setMethod('github')}
              className={`p-8 border-2 rounded-xl text-left transition-all ${
                method === 'github'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  method === 'github' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Github className={`w-6 h-6 ${method === 'github' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Link do GitHub
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cole o link do repositório
              </p>
            </button>
          </div>

          {/* Upload de Arquivos */}
          {method === 'upload' && (
            <div className="mb-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                    : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isDragActive
                    ? 'Solte os arquivos aqui'
                    : 'Arraste arquivos aqui ou clique para selecionar'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Formatos: .js, .ts, .jsx, .tsx, .json, .css, .html, .zip
                </p>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Arquivos selecionados ({files.length}):
                  </p>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Link do GitHub */}
          {method === 'github' && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Cole o link do GitHub
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/usuario/projeto"
                className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
              />
              {githubUrl && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Link válido</span>
                </div>
              )}
            </div>
          )}

          {/* Botão Analisar */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={processing || (method === 'upload' && files.length === 0) || (method === 'github' && !githubUrl)}
              className="flex-1 sm:flex-none px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold text-lg hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando projeto...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Analisar Projeto
                </>
              )}
            </button>
          </div>

          {/* Estados de UX */}
          {processing && (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-200">Analisando projeto...</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Lendo estrutura • Identificando tecnologias • Organizando contexto</p>
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
