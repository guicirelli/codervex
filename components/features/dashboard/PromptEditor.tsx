'use client'

import { useState, useEffect } from 'react'
import { Save, Copy, Sparkles, Wand2, FileText, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/common'
import toast from 'react-hot-toast'

interface PromptEditorProps {
  initialPrompt: string
  onSave?: (prompt: string) => void
  onCopy?: (prompt: string) => void
  editable?: boolean
}

export default function PromptEditor({
  initialPrompt,
  onSave,
  onCopy,
  editable = true,
}: PromptEditorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isEditing, setIsEditing] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  
  // Auto-save quando prompt muda
  useEffect(() => {
    if (isEditing && prompt !== initialPrompt) {
      setAutoSaveStatus('unsaved')
      
      const timeoutId = setTimeout(() => {
        if (onSave) {
          setAutoSaveStatus('saving')
          onSave(prompt)
          setAutoSaveStatus('saved')
        }
      }, 2000) // Salva após 2 segundos de inatividade
      
      return () => clearTimeout(timeoutId)
    }
  }, [prompt, isEditing, initialPrompt, onSave])

  const handleSave = () => {
    if (onSave) {
      onSave(prompt)
      toast.success('Prompt salvo com sucesso!')
    }
    setIsEditing(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      toast.success('Prompt copiado para a área de transferência!')
      if (onCopy) onCopy(prompt)
    } catch (error) {
      toast.error('Erro ao copiar prompt')
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editor de Prompt
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {editable && (
            <>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSave()
                  } else {
                    setIsEditing(true)
                  }
                }}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors flex items-center',
                  isEditing
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Salvar' : 'Editar'}
              </button>
              {isEditing && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      <span>Salvo automaticamente</span>
                    </>
                  )}
                  {autoSaveStatus === 'unsaved' && (
                    <span>Alterações não salvas</span>
                  )}
                </div>
              )}
            </>
          )}
          <button
            onClick={handleCopy}
            className="btn-primary inline-flex items-center"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar
          </button>
        </div>
      </div>

      {isEditing && editable ? (
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm rounded-lg border border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          placeholder="Edite o prompt aqui..."
        />
      ) : (
        <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
            {prompt}
          </pre>
        </div>
      )}

      <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-primary-800 dark:text-primary-200">
            <p className="font-semibold mb-1">💡 Dica:</p>
            <p>
              {isEditing
                ? 'Personalize o prompt adicionando suas preferências, mudando a estrutura ou incluindo funcionalidades específicas. O prompt será usado para gerar ou melhorar seu projeto.'
                : 'Este prompt foi gerado automaticamente. Clique em "Editar" para personalizá-lo antes de usar em ferramentas de IA.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

