'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Sparkles, ArrowRight, FileText, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ProjectIdeaFormProps {
  onGenerate: (idea: ProjectIdea) => void
  loading?: boolean
}

export interface ProjectIdea {
  title: string
  description: string
  features: string[]
  techStack: string[]
  style: string
  referenceProject?: string
  customizations?: string
}

export default function ProjectIdeaForm({ onGenerate, loading }: ProjectIdeaFormProps) {
  const [idea, setIdea] = useState<ProjectIdea>({
    title: '',
    description: '',
    features: [],
    techStack: [],
    style: '',
    customizations: '',
  })
  const [currentFeature, setCurrentFeature] = useState('')
  const [currentTech, setCurrentTech] = useState('')
  const [templates, setTemplates] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/prompt/templates')
      .then(res => res.json())
      .then(data => setTemplates(data.templates))
      .catch(() => {})
  }, [])

  const handleTemplateSelect = (templateKey: string) => {
    if (!templates) return
    
    const template = templates[templateKey]
    setSelectedTemplate(templateKey)
    setIdea({
      title: template.title,
      description: template.description,
      features: template.features,
      techStack: template.stack,
      style: '',
      customizations: '',
    })
    toast.success('Template carregado! Personalize conforme necessário.')
  }

  const addFeature = () => {
    if (currentFeature.trim()) {
      setIdea({
        ...idea,
        features: [...idea.features, currentFeature.trim()],
      })
      setCurrentFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setIdea({
      ...idea,
      features: idea.features.filter((_, i) => i !== index),
    })
  }

  const addTech = () => {
    if (currentTech.trim()) {
      setIdea({
        ...idea,
        techStack: [...idea.techStack, currentTech.trim()],
      })
      setCurrentTech('')
    }
  }

  const removeTech = (index: number) => {
    setIdea({
      ...idea,
      techStack: idea.techStack.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!idea.title || !idea.description) {
      toast.error('Preencha título e descrição do projeto')
      return
    }

    if (idea.features.length === 0) {
      toast.error('Adicione pelo menos uma funcionalidade')
      return
    }

    onGenerate(idea)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Criar Projeto do Zero
          </h2>
        </div>
        {templates && (
          <div className="relative">
            <select
              value={selectedTemplate || ''}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="input-field text-sm"
            >
              <option value="">Usar Template...</option>
              {Object.keys(templates).map(key => (
                <option key={key} value={key}>
                  {templates[key].title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título do Projeto *
          </label>
          <input
            type="text"
            value={idea.title}
            onChange={(e) => setIdea({ ...idea, title: e.target.value })}
            className="input-field"
            placeholder="Ex: E-commerce de produtos artesanais"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição do Projeto *
          </label>
          <textarea
            value={idea.description}
            onChange={(e) => setIdea({ ...idea, description: e.target.value })}
            className="input-field h-24 resize-none"
            placeholder="Descreva a ideia do seu projeto, objetivo, público-alvo..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Funcionalidades Principais *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="input-field flex-1"
              placeholder="Ex: Sistema de autenticação, Carrinho de compras..."
            />
            <button
              type="button"
              onClick={addFeature}
              className="btn-primary"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {idea.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stack Tecnológica (Opcional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="input-field flex-1"
              placeholder="Ex: React, Next.js, TypeScript, Tailwind..."
            />
            <button
              type="button"
              onClick={addTech}
              className="btn-secondary"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {idea.techStack.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(index)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estilo/Design (Opcional)
          </label>
          <input
            type="text"
            value={idea.style}
            onChange={(e) => setIdea({ ...idea, style: e.target.value })}
            className="input-field"
            placeholder="Ex: Moderno, Minimalista, Colorido, Escuro..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Projeto de Referência (Opcional)
          </label>
          <input
            type="text"
            value={idea.referenceProject || ''}
            onChange={(e) => setIdea({ ...idea, referenceProject: e.target.value })}
            className="input-field"
            placeholder="ID ou nome do projeto da comunidade para usar como referência"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use um projeto da comunidade como inspiração, mas crie algo único
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Customizações Específicas (Opcional)
          </label>
          <textarea
            value={idea.customizations || ''}
            onChange={(e) => setIdea({ ...idea, customizations: e.target.value })}
            className="input-field h-24 resize-none"
            placeholder="Descreva mudanças específicas que quer no prompt: cores diferentes, layout alternativo, funcionalidades extras..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Gerando Prompt...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Gerar Superprompt Personalizado
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

