'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Sparkles, Upload, History, Settings } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface Step {
  id: string
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const steps: Step[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Codervex! 👋',
    description: 'Vamos te mostrar como transformar seus projetos em superprompts de IA em poucos passos.',
  },
  {
    id: 'credits',
    title: 'Seus Créditos',
    description: 'Você tem direito a 1 prompt gratuito! Use-o para testar. Depois, adquira créditos ou uma assinatura.',
    target: '[data-tour="credits"]',
    position: 'bottom',
  },
  {
    id: 'create',
    title: 'Criar do Zero',
    description: 'Descreva sua ideia e gere um projeto completo do zero. Perfeito para começar novos projetos!',
    target: '[data-tour="create"]',
    position: 'right',
  },
  {
    id: 'upload',
    title: 'Analisar Projeto',
    description: 'Faça upload de arquivos do seu projeto existente e receba um superprompt detalhado.',
    target: '[data-tour="upload"]',
    position: 'right',
  },
  {
    id: 'history',
    title: 'Histórico',
    description: 'Todos os seus prompts ficam salvos aqui. Você pode copiar, editar ou usar novamente.',
    target: '[data-tour="history"]',
    position: 'left',
  },
  {
    id: 'complete',
    title: 'Pronto! 🎉',
    description: 'Agora você está pronto para usar o Codervex. Gere seu primeiro superprompt!',
  },
]

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Verificar se já completou o onboarding
    const hasCompleted = localStorage.getItem('onboarding_completed')
    if (!hasCompleted) {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const step = steps[currentStep]
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement
      if (element) {
        setTargetElement(element)
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        setTargetElement(null)
      }
    } else {
      setTargetElement(null)
    }
  }, [currentStep, isVisible])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true')
    setIsVisible(false)
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleSkip} />

      {/* Highlight */}
      {targetElement && (
        <div
          className="fixed z-50 border-4 border-primary-500 rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: targetElement.offsetTop - 4,
            left: targetElement.offsetLeft - 4,
            width: targetElement.offsetWidth + 8,
            height: targetElement.offsetHeight + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          'fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm',
          !targetElement && 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
        )}
        style={
          targetElement
            ? step.position === 'right'
              ? {
                  top: `${targetElement.offsetTop}px`,
                  left: `${targetElement.offsetLeft + targetElement.offsetWidth + 20}px`,
                }
              : step.position === 'left'
              ? {
                  top: `${targetElement.offsetTop}px`,
                  right: `${window.innerWidth - targetElement.offsetLeft + 20}px`,
                }
              : step.position === 'top'
              ? {
                  bottom: `${window.innerHeight - targetElement.offsetTop + 20}px`,
                  left: `${targetElement.offsetLeft}px`,
                }
              : {
                  top: `${targetElement.offsetTop + targetElement.offsetHeight + 20}px`,
                  left: `${targetElement.offsetLeft}px`,
                }
            : undefined
        }
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              {currentStep + 1} de {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {step.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center',
              isFirst
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </button>

          <div className="flex space-x-2">
            {!isLast && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Pular
              </button>
            )}
            <button
              onClick={isLast ? handleComplete : handleNext}
              className="btn-primary inline-flex items-center"
            >
              {isLast ? 'Começar!' : 'Próximo'}
              {!isLast && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

