'use client'

import { useState } from 'react'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Building2,
  Code,
  Wrench,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  Copy,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils/common'
import toast from 'react-hot-toast'

interface TechnicalDiagnostic {
  overallScore: number
  scores: {
    architecture: number
    codeQuality: number
    maintainability: number
    performance: number
    userExperience: number
  }
  risks: Array<{
    level: 'low' | 'medium' | 'high'
    area: string
    description: string
    recommendation: string
  }>
  strengths: string[]
  weaknesses: string[]
}

interface ProjectIntelligence {
  diagnostic: TechnicalDiagnostic
  normalized: {
    projectType: string
    complexity: string
    stack: string[]
  }
  intention: {
    primaryGoal: string
    priorities: {
      speed: number
      scalability: number
      maintainability: number
      userExperience: number
    }
  }
  reconstruction: {
    idealArchitecture: {
      structure: string[]
      patterns: string[]
      technologies: string[]
    }
    improvements: {
      architectural: string[]
      performance: string[]
      maintainability: string[]
      userExperience: string[]
    }
  }
}

interface Props {
  intelligence: ProjectIntelligence
  onCopyPrompt?: (prompt: string) => void
}

export default function ProjectIntelligenceDisplay({ intelligence, onCopyPrompt }: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['diagnostic']))
  const [selectedPrompt, setSelectedPrompt] = useState<'full' | 'architecture' | 'pages' | 'components' | 'logic' | 'styles'>('full')

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getRiskColor = (level: string) => {
    if (level === 'high') return 'text-red-600 bg-red-50 border-red-200'
    if (level === 'medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Project Intelligence</h2>
              <p className="text-gray-700">Análise completa e diagnóstico técnico</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-500">
              {intelligence.diagnostic.overallScore}
            </div>
            <div className="text-sm text-gray-700">Score Geral</div>
          </div>
        </div>
      </div>

      {/* Diagnostic Scores */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('diagnostic')}
        >
          <h3 className="text-xl font-semibold text-black flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
            Diagnóstico Técnico
          </h3>
          {expandedSections.has('diagnostic') ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {expandedSections.has('diagnostic') && (
          <div className="mt-6 space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-lg border">
                <Building2 className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className={cn('text-2xl font-bold mb-1', getScoreColor(intelligence.diagnostic.scores.architecture))}>
                  {intelligence.diagnostic.scores.architecture}
                </div>
                <div className="text-xs text-gray-600">Arquitetura</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <Code className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className={cn('text-2xl font-bold mb-1', getScoreColor(intelligence.diagnostic.scores.codeQuality))}>
                  {intelligence.diagnostic.scores.codeQuality}
                </div>
                <div className="text-xs text-gray-600">Qualidade</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <Wrench className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className={cn('text-2xl font-bold mb-1', getScoreColor(intelligence.diagnostic.scores.maintainability))}>
                  {intelligence.diagnostic.scores.maintainability}
                </div>
                <div className="text-xs text-gray-600">Manutenção</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <Zap className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className={cn('text-2xl font-bold mb-1', getScoreColor(intelligence.diagnostic.scores.performance))}>
                  {intelligence.diagnostic.scores.performance}
                </div>
                <div className="text-xs text-gray-600">Performance</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                <div className={cn('text-2xl font-bold mb-1', getScoreColor(intelligence.diagnostic.scores.userExperience))}>
                  {intelligence.diagnostic.scores.userExperience}
                </div>
                <div className="text-xs text-gray-600">UX</div>
              </div>
            </div>

            {/* Risks */}
            {intelligence.diagnostic.risks.length > 0 && (
              <div>
                <h4 className="font-semibold text-black mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
                  Riscos Identificados
                </h4>
                <div className="space-y-3">
                  {intelligence.diagnostic.risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className={cn('p-4 rounded-lg border', getRiskColor(risk.level))}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold">{risk.area}</div>
                        <span className="text-xs px-2 py-1 rounded bg-white/50">
                          {risk.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{risk.description}</p>
                      <p className="text-xs font-medium">💡 {risk.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-black mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {intelligence.diagnostic.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-3 flex items-center">
                  <XCircle className="w-4 h-4 mr-2 text-red-600" />
                  Áreas de Melhoria
                </h4>
                <ul className="space-y-2">
                  {intelligence.diagnostic.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <XCircle className="w-4 h-4 mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Intention */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('intention')}
        >
          <h3 className="text-xl font-semibold text-black flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary-500" />
            Intenção do Projeto
          </h3>
          {expandedSections.has('intention') ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {expandedSections.has('intention') && (
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-semibold text-black mb-2">Objetivo Principal</h4>
              <p className="text-gray-700">{intelligence.intention.primaryGoal}</p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-3">Prioridades</h4>
              <div className="space-y-2">
                {Object.entries(intelligence.intention.priorities).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 capitalize">{key}</span>
                      <span className="text-sm font-semibold">{value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${value * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reconstruction Model */}
      <div className="card">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('reconstruction')}
        >
          <h3 className="text-xl font-semibold text-black flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary-500" />
            Modelo de Reconstrução
          </h3>
          {expandedSections.has('reconstruction') ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {expandedSections.has('reconstruction') && (
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="font-semibold text-black mb-3">Arquitetura Ideal</h4>
              <ul className="space-y-2">
                {intelligence.reconstruction.idealArchitecture.structure.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-primary-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-3">Padrões Recomendados</h4>
              <div className="flex flex-wrap gap-2">
                {intelligence.reconstruction.idealArchitecture.patterns.map((pattern, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                  >
                    {pattern}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-3">Melhorias Sugeridas</h4>
              <div className="space-y-4">
                {Object.entries(intelligence.reconstruction.improvements).map(([category, items]) => (
                  items.length > 0 && (
                    <div key={category}>
                      <h5 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <ul className="space-y-1">
                        {items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="card">
        <h3 className="text-xl font-semibold text-black mb-4">Informações do Projeto</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Tipo</div>
            <div className="font-semibold text-black">{intelligence.normalized.projectType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Complexidade</div>
            <div className="font-semibold text-black capitalize">{intelligence.normalized.complexity}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Stack</div>
            <div className="flex flex-wrap gap-1">
              {intelligence.normalized.stack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

