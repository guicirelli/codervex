'use client'

import { useState, useEffect } from 'react'
import { Search, ExternalLink, Star, Code, Users } from 'lucide-react'
import { cn } from '@/lib/utils/common'
import Link from 'next/link'

interface ReferenceProject {
  id: string
  title: string
  description: string
  stack: string[]
  features: string[]
  author: string
  stars: number
  uses: number
  preview?: string
}

interface ReferenceProjectSelectorProps {
  onSelect: (project: ReferenceProject) => void
  selectedId?: string
}

export default function ReferenceProjectSelector({
  onSelect,
  selectedId,
}: ReferenceProjectSelectorProps) {
  const [projects, setProjects] = useState<ReferenceProject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/community/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.stack.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Projetos da Comunidade
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use como referência para melhorar seu projeto
          </p>
        </div>
        <Link
          href="/community"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center"
        >
          Ver Todos
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
          placeholder="Buscar por nome, stack ou funcionalidade..."
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <Code className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto disponível'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelect(project)}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition-all',
                selectedId === project.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h4>
                {selectedId === project.id && (
                  <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                    Selecionado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {project.stars}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {project.uses}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

