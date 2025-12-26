'use client'

import { useState, useEffect } from 'react'
import { History, Search, Star, Copy, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import toast from 'react-hot-toast'
import React from 'react'
import { cn } from '@/lib/utils/common'

interface Prompt {
  id: string
  title: string
  content: string
  stack?: string
  projectType?: string
  createdAt: string
  isFavorite?: boolean
}

export default function PromptHistory({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStack, setFilterStack] = useState<string>('all')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/prompt/history')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts || [])
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (prompt: Prompt): Promise<void> => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      toast.success('Prompt copiado!')
    } catch (error) {
      toast.error('Erro ao copiar prompt')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este prompt?')) return

    try {
      const response = await fetch(`/api/prompt/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Prompt excluído!')
        fetchHistory()
      }
    } catch (error) {
      toast.error('Erro ao excluir prompt')
    }
  }

  const handleToggleFavorite = async (id: string, currentFavorite: boolean): Promise<void> => {
    try {
      const response = await fetch(`/api/prompt/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentFavorite }),
      })
      if (response.ok) {
        setPrompts(prompts.map((p: Prompt) => 
          p.id === id ? { ...p, isFavorite: !currentFavorite } : p
        ))
        toast.success(currentFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
      }
    } catch (error) {
      toast.error('Erro ao atualizar favorito')
    }
  }

  // Filtrar prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = !searchTerm || 
      prompt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.stack?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStack = filterStack === 'all' || prompt.stack?.includes(filterStack)
    const matchesFavorites = !favoritesOnly || prompt.isFavorite

    return matchesSearch && matchesStack && matchesFavorites
  })

  // Obter stacks únicas
  const uniqueStacks = Array.from(new Set(
    prompts
      .map((p: Prompt) => p.stack?.split(', '))
      .flat()
      .filter(Boolean) as string[]
  ))

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <History className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Histórico de Prompts
        </h3>
      </div>

      {/* Busca e Filtros */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
            placeholder="Buscar por título, conteúdo ou stack..."
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <select
            value={filterStack}
            onChange={(e) => setFilterStack(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">Todas as stacks</option>
            {uniqueStacks.map(stack => (
              <option key={stack} value={stack}>{stack}</option>
            ))}
          </select>

          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center',
              favoritesOnly
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            )}
          >
            <Star className={cn('w-4 h-4 mr-1', favoritesOnly && 'fill-current')} />
            Favoritos
          </button>
        </div>
      </div>

      {/* Lista de Prompts */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterStack !== 'all' || favoritesOnly
                ? 'Nenhum prompt encontrado com os filtros selecionados'
                : 'Nenhum prompt gerado ainda'}
            </p>
          </div>
        ) : (
          filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                    {prompt.title || 'Prompt sem título'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {format(new Date(prompt.createdAt), "dd 'de' MMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  {prompt.stack && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {prompt.stack.split(', ').slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleToggleFavorite(prompt.id, prompt.isFavorite || false)}
                  className={cn(
                    'ml-2 p-1 rounded transition-colors flex-shrink-0',
                    prompt.isFavorite
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500'
                  )}
                  title={prompt.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star className={cn('w-4 h-4', prompt.isFavorite && 'fill-current')} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {prompt.content.substring(0, 150)}...
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSelectPrompt(prompt.content)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Ver completo
                </button>
                <button
                  onClick={() => handleCopy(prompt)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copiar
                </button>
                <button
                  onClick={() => handleDelete(prompt.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 flex items-center ml-auto"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
