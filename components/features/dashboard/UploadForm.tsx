'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, Github, X, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import React from 'react'
import { isValidFileType, formatBytes } from '@/lib/utils/common'
import Alert from '@/components/shared/ui/Alert'
import ProgressBar from '@/components/shared/ui/ProgressBar'

interface UploadFormProps {
  onPromptGenerated: (prompt: string) => void
  user: any
}

export default function UploadForm({ onPromptGenerated, user }: UploadFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    acceptedFiles.forEach(file => {
      if (isValidFileType(file.name) || file.name.endsWith('.zip')) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    })

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} arquivo(s) inválido(s) foram ignorados`)
    }

    if (validFiles.length > 0) {
      setFiles((prev: File[]) => [...prev, ...validFiles])
      toast.success(`${validFiles.length} arquivo(s) adicionado(s)`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/javascript': ['.js', '.jsx'],
      'application/typescript': ['.ts', '.tsx'],
      'application/json': ['.json'],
      'text/css': ['.css'],
      'text/html': ['.html'],
      'application/zip': ['.zip'],
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB por arquivo
  })

  const removeFile = (index: number) => {
    setFiles((prev: File[]) => prev.filter((_: File, i: number) => i !== index))
    toast.success('Arquivo removido')
  }

  const calculateTotalSize = () => {
    return files.reduce((sum: number, file: File) => sum + file.size, 0)
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo')
      return
    }

    // Verificar créditos (permitir 1 prompt gratuito para novos usuários)
    const isFirstPrompt = user?.credits === 0 && user?.subscription === 'free'
    const hasCredits = user?.subscription === 'monthly' || (user?.credits && user.credits > 0)
    
    if (!isFirstPrompt && !hasCredits) {
      setError('Você não tem créditos suficientes. Você tem direito a 1 prompt gratuito! Use-o agora ou adquira um plano.')
      return
    }

    setProcessing(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      files.forEach((file: File) => {
        formData.append('files', file)
      })

      // Usar nova API de análise (FASE 1)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      // Progresso baseado em etapas reais
      const progressSteps = [
        { progress: 10, message: 'Enviando arquivos...' },
        { progress: 30, message: 'Processando arquivos...' },
        { progress: 50, message: 'Analisando estrutura e tecnologias...' },
        { progress: 70, message: 'Lendo conteúdo dos arquivos...' },
        { progress: 90, message: 'Gerando superprompt com IA...' },
      ]

      let currentStep = 0
      const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          const step = progressSteps[currentStep]
          setProgress(step.progress)
          currentStep++
        }
      }, 800)

      const data = await response.json()

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar prompt')
      }

      toast.success('Análise concluída com sucesso!')
      onPromptGenerated(data.prompt.content || data.prompt)
      setFiles([])
      setProgress(0)
    } catch (error: any) {
      setProgress(0)
      const errorMessage = error.message || 'Erro ao processar projeto'
      setError(errorMessage)
      toast.error(errorMessage, { id: 'processing' })
    } finally {
      setProcessing(false)
    }
  }

  const totalSize = calculateTotalSize()

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-black mb-6">Analisar Projeto</h2>

      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Info */}
      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">📦 Como funciona</p>
            <p>Faça upload de arquivos do seu projeto ou um arquivo ZIP. O sistema analisará a estrutura, detectará a stack tecnológica e gerará um prompt completo.</p>
          </div>
        </div>
      </div>

      {/* Upload Files */}
      <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-gray-700 mb-2">
              {isDragActive
                ? 'Solte os arquivos aqui'
                : 'Arraste arquivos aqui ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500 text-gray-700">
              Formatos: .js, .ts, .jsx, .tsx, .json, .css, .html, .zip (máx. 50MB total)
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-700 text-gray-700">
                  Arquivos selecionados ({files.length}):
                </h3>
                <span className="text-sm text-gray-500 text-gray-700">
                  Total: {formatBytes(totalSize)}
                </span>
              </div>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 bg-gray-100 rounded-lg"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 text-gray-700 flex-shrink-0">
                      ({formatBytes(file.size)})
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Progress Bar */}
      {processing && (
        <div className="mt-6 space-y-2">
          <ProgressBar progress={progress} label="Processando projeto..." />
          <div className="text-sm text-gray-600 text-gray-700 text-center">
            {progress < 20 && '📤 Recebendo arquivos...'}
            {progress >= 20 && progress < 40 && '🔍 Analisando estrutura e tecnologias...'}
            {progress >= 40 && progress < 60 && '📄 Lendo conteúdo dos arquivos...'}
            {progress >= 60 && progress < 80 && '🤖 Gerando superprompt com IA...'}
            {progress >= 80 && progress < 100 && '💾 Salvando no histórico...'}
            {progress === 100 && '✅ Concluído!'}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={processing || files.length === 0}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Gerar Superprompt
          </>
        )}
      </button>
    </div>
  )
}
