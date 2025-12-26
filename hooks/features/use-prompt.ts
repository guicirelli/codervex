'use client'

import { useState } from 'react'
import { Prompt, ProjectAnalysis } from '@/types/shared'
import toast from 'react-hot-toast'

interface UsePromptReturn {
  generatePrompt: (files: File[] | null, githubUrl?: string) => Promise<string | null>
  loading: boolean
  error: string | null
}

export function usePrompt(): UsePromptReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePrompt = async (files: File[] | null, githubUrl?: string): Promise<string | null> => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file)
        })
      } else if (githubUrl) {
        formData.append('githubUrl', githubUrl)
      } else {
        throw new Error('Por favor, selecione arquivos ou informe uma URL do GitHub')
      }

      const response = await fetch('/api/prompt/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar prompt')
      }

      toast.success('Superprompt gerado com sucesso!')
      return data.prompt
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao processar projeto'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    generatePrompt,
    loading,
    error,
  }
}

