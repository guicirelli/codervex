'use client'

import { useState } from 'react'
import { Copy, Download, FileText, X, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import PromptEditor from './PromptEditor'
import Link from 'next/link'

interface PromptDisplayProps {
  prompt: string
  onNewUpload: () => void
}

export default function PromptDisplay({ prompt, onNewUpload }: PromptDisplayProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      toast.success('Prompt copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar prompt')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `superprompt-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Prompt baixado com sucesso!')
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Superprompt Gerado
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewUpload}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Novo Upload
            </button>
          </div>
        </div>

        <PromptEditor
          initialPrompt={prompt}
          onSave={(updatedPrompt) => {
            toast.success('Prompt atualizado!')
          }}
          onCopy={handleCopy}
          editable={true}
        />

        <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCopy}
              className="btn-primary inline-flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Prompt
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary inline-flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar .txt
            </button>
          </div>
          <Link
            href="/how-to-use"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Como usar este prompt?
          </Link>
        </div>
      </div>

      <div className="card bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-primary-800 dark:text-primary-200">
            <p className="font-semibold mb-1">💡 Próximos Passos:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copie o prompt acima</li>
              <li>Abra o Cursor (Cmd/Ctrl + L) ou ChatGPT</li>
              <li>Cole o prompt e pressione Enter</li>
              <li>A IA gerará o projeto completo!</li>
            </ol>
            <Link
              href="/how-to-use"
              className="text-primary-600 dark:text-primary-400 hover:underline mt-2 inline-block"
            >
              Ver tutorial completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
