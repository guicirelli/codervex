/**
 * PROJECT INTELLIGENCE ENGINE (PIE)
 * 
 * Orquestra todas as camadas para transformar código bruto
 * em conhecimento estruturado e decisões executáveis.
 */

import { ingestProject, NormalizedProject } from './ingestion.service'
import { analyzeSemantics, SemanticAnalysis } from './semantic-analysis.service'
import { analyzeIntention, ProjectIntention } from './intention-engine.service'
import { generateReconstructionModel, ReconstructionModel } from './reconstruction-model.service'
import { orchestratePrompts, OrchestratedPrompt } from './prompt-orchestrator.service'

export interface ProjectIntelligence {
  normalized: NormalizedProject
  semantic: SemanticAnalysis
  intention: ProjectIntention
  reconstruction: ReconstructionModel
  prompts: OrchestratedPrompt
  diagnostic: TechnicalDiagnostic
}

export interface TechnicalDiagnostic {
  overallScore: number // 0-100
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

/**
 * Processa um projeto completo através de todas as camadas
 */
export async function processProjectIntelligence(files: File[]): Promise<ProjectIntelligence> {
  // CAMADA 1: Ingestão e Normalização
  const normalized = await ingestProject(files)

  // Criar fileMap para análises posteriores
  const fileMap = new Map<string, string>()
  for (const file of files) {
    try {
      const content = await file.text()
      fileMap.set(file.name.toLowerCase(), content)
    } catch {
      // Ignorar arquivos binários
    }
  }

  // CAMADA 2: Análise Semântica
  const semantic = await analyzeSemantics(normalized, fileMap)

  // CAMADA 3: Engine de Intenção
  const intention = analyzeIntention(normalized, semantic)

  // CAMADA 4: Modelo de Reconstrução
  const reconstruction = generateReconstructionModel(normalized, semantic, intention)

  // CAMADA 5: Prompt Orchestrator
  const prompts = orchestratePrompts(normalized, semantic, intention, reconstruction)

  // Diagnóstico Técnico
  const diagnostic = generateDiagnostic(normalized, semantic, intention)

  return {
    normalized,
    semantic,
    intention,
    reconstruction,
    prompts,
    diagnostic,
  }
}

function generateDiagnostic(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): TechnicalDiagnostic {
  // Calcular scores
  const architectureScore = calculateArchitectureScore(normalized, semantic)
  const codeQualityScore = calculateCodeQualityScore(semantic)
  const maintainabilityScore = calculateMaintainabilityScore(normalized, semantic, intention)
  const performanceScore = calculatePerformanceScore(semantic, intention)
  const userExperienceScore = calculateUserExperienceScore(normalized, semantic, intention)

  const overallScore = Math.round(
    (architectureScore + codeQualityScore + maintainabilityScore + performanceScore + userExperienceScore) / 5
  )

  // Identificar riscos
  const risks = identifyRisks(normalized, semantic, intention)

  // Identificar pontos fortes e fracos
  const strengths = identifyStrengths(normalized, semantic, intention)
  const weaknesses = identifyWeaknesses(normalized, semantic, intention)

  return {
    overallScore,
    scores: {
      architecture: architectureScore,
      codeQuality: codeQualityScore,
      maintainability: maintainabilityScore,
      performance: performanceScore,
      userExperience: userExperienceScore,
    },
    risks,
    strengths,
    weaknesses,
  }
}

function calculateArchitectureScore(normalized: NormalizedProject, semantic: SemanticAnalysis): number {
  let score = 50

  // Stack moderno
  if (normalized.stack.includes('TypeScript')) score += 10
  if (normalized.stack.includes('Next.js')) score += 10
  if (normalized.architecture === 'App Router') score += 10

  // Organização
  if (semantic.quality.codeOrganization === 'excellent') score += 15
  else if (semantic.quality.codeOrganization === 'good') score += 10
  else if (semantic.quality.codeOrganization === 'fair') score += 5

  // Separação de concerns
  if (semantic.quality.separationOfConcerns === 'excellent') score += 15
  else if (semantic.quality.separationOfConcerns === 'good') score += 10
  else if (semantic.quality.separationOfConcerns === 'fair') score += 5

  return Math.min(100, score)
}

function calculateCodeQualityScore(semantic: SemanticAnalysis): number {
  let score = 50

  // Qualidade geral
  const avgQuality = [
    semantic.quality.codeOrganization,
    semantic.quality.separationOfConcerns,
    semantic.quality.reusability,
    semantic.quality.maintainability,
  ].reduce((sum, q) => {
    const val = q === 'excellent' ? 25 : q === 'good' ? 15 : q === 'fair' ? 5 : 0
    return sum + val
  }, 0) / 4

  score = avgQuality

  // Padrões de design
  if (semantic.patterns.design.length > 2) score += 10
  if (semantic.patterns.architectural.length > 1) score += 10

  return Math.min(100, score)
}

function calculateMaintainabilityScore(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): number {
  let score = 50

  // TypeScript
  if (normalized.stack.includes('TypeScript')) score += 20

  // Maturidade
  if (normalized.maturity === 'mature') score += 15
  if (intention.maturity.level === 'production' || intention.maturity.level === 'enterprise') score += 15

  // Qualidade de código
  if (semantic.quality.maintainability === 'excellent') score += 20
  else if (semantic.quality.maintainability === 'good') score += 10

  // Débito técnico
  if (intention.technicalDebt.level === 'none') score += 10
  else if (intention.technicalDebt.level === 'low') score += 5
  else if (intention.technicalDebt.level === 'high') score -= 20

  return Math.min(100, Math.max(0, score))
}

function calculatePerformanceScore(semantic: SemanticAnalysis, intention: ProjectIntention): number {
  let score = 50

  // Padrões de performance
  if (semantic.patterns.design.includes('Memoization')) score += 15
  if (semantic.patterns.architectural.includes('SSR/SSG')) score += 20
  if (semantic.patterns.dataFlow.includes('React Query')) score += 15

  // Prioridade de UX
  if (intention.priorities.userExperience >= 7) score += 10

  return Math.min(100, score)
}

function calculateUserExperienceScore(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): number {
  let score = 50

  // Stack moderno
  if (normalized.stack.includes('Next.js')) score += 15
  if (normalized.stack.includes('Tailwind CSS')) score += 10

  // Padrões de UX
  if (semantic.patterns.architectural.includes('SSR/SSG')) score += 15
  if (semantic.patterns.design.includes('Memoization')) score += 10

  // Prioridade
  if (intention.priorities.userExperience >= 8) score += 10

  return Math.min(100, score)
}

function identifyRisks(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): TechnicalDiagnostic['risks'] {
  const risks: TechnicalDiagnostic['risks'] = []

  // Débito técnico alto
  if (intention.technicalDebt.level === 'high') {
    risks.push({
      level: 'high',
      area: 'Technical Debt',
      description: 'Projeto possui alto débito técnico que pode impactar manutenibilidade',
      recommendation: 'Priorize refatoração das áreas identificadas',
    })
  }

  // Baixa qualidade de código
  if (semantic.quality.codeOrganization === 'poor') {
    risks.push({
      level: 'high',
      area: 'Code Organization',
      description: 'Estrutura de código desorganizada dificulta manutenção',
      recommendation: 'Reorganize a estrutura de pastas seguindo best practices',
    })
  }

  // Falta de separação de concerns
  if (semantic.quality.separationOfConcerns === 'poor') {
    risks.push({
      level: 'medium',
      area: 'Separation of Concerns',
      description: 'Lógica de negócio misturada com UI',
      recommendation: 'Extraia lógica de negócio para serviços separados',
    })
  }

  // Sem TypeScript em projeto complexo
  if (!normalized.stack.includes('TypeScript') && normalized.complexity === 'high') {
    risks.push({
      level: 'medium',
      area: 'Type Safety',
      description: 'Projeto complexo sem type safety pode levar a bugs',
      recommendation: 'Considere migrar para TypeScript gradualmente',
    })
  }

  // Performance
  if (!semantic.patterns.design.includes('Memoization') && normalized.structure.components.length > 10) {
    risks.push({
      level: 'low',
      area: 'Performance',
      description: 'Falta de otimizações pode impactar performance',
      recommendation: 'Implemente memoização para componentes pesados',
    })
  }

  return risks
}

function identifyStrengths(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): string[] {
  const strengths: string[] = []

  if (normalized.stack.includes('TypeScript')) {
    strengths.push('TypeScript para type safety')
  }

  if (normalized.stack.includes('Next.js')) {
    strengths.push('Next.js para SSR/SSG')
  }

  if (semantic.quality.codeOrganization === 'excellent') {
    strengths.push('Excelente organização de código')
  }

  if (semantic.quality.separationOfConcerns === 'excellent') {
    strengths.push('Boa separação de concerns')
  }

  if (semantic.patterns.design.includes('Custom Hooks')) {
    strengths.push('Uso de custom hooks para reusabilidade')
  }

  if (semantic.patterns.dataFlow.includes('React Query')) {
    strengths.push('React Query para gerenciamento de estado servidor')
  }

  if (intention.maturity.level === 'production' || intention.maturity.level === 'enterprise') {
    strengths.push('Projeto em nível de produção')
  }

  return strengths
}

function identifyWeaknesses(
  normalized: NormalizedProject,
  semantic: SemanticAnalysis,
  intention: ProjectIntention
): string[] {
  const weaknesses: string[] = []

  if (semantic.quality.codeOrganization === 'poor') {
    weaknesses.push('Organização de código precisa melhorar')
  }

  if (semantic.quality.separationOfConcerns === 'poor') {
    weaknesses.push('Separação de concerns insuficiente')
  }

  if (semantic.quality.reusability === 'poor') {
    weaknesses.push('Baixa reusabilidade de componentes')
  }

  if (!normalized.stack.includes('TypeScript') && normalized.complexity !== 'low') {
    weaknesses.push('Falta de type safety em projeto complexo')
  }

  if (intention.technicalDebt.level === 'high') {
    weaknesses.push('Alto débito técnico acumulado')
  }

  if (!semantic.patterns.dataFlow.includes('React Query') && normalized.structure.apis.length > 0) {
    weaknesses.push('Gerenciamento de dados pode ser otimizado')
  }

  return weaknesses
}

