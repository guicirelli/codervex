import React from 'react'
import Link from 'next/link'
import { CheckCircle, Sparkles, DollarSign } from 'lucide-react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-12 xs:py-14 sm:py-16 md:py-20 lg:py-24 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3 xs:mb-4 leading-tight">
              O custo de adivinhar software
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-gray-800 dark:text-gray-200 max-w-2xl mx-auto px-3 xs:px-4 sm:px-0">
              Codervex não é barato porque resolve problema caro. Reduz risco, tempo e incerteza.
            </p>
            <div className="mt-5 xs:mt-6 inline-flex items-center gap-2 px-5 xs:px-6 py-2.5 xs:py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-xs xs:text-sm font-semibold border border-primary-200 dark:border-primary-800">
              <DollarSign className="w-4 h-4 xs:w-5 xs:h-5" />
              <span>Valor: Clareza, Segurança e Velocidade Responsável</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5 xs:gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Plano Gratuito */}
            <div className="card border-2 border-dashed border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800">
              <div className="text-center mb-6 xs:mb-8">
                <h3 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white mb-2">Gratuito</h3>
                <div className="mb-4">
                  <span className="text-4xl xs:text-5xl font-bold text-primary-600 dark:text-primary-500">R$ 0</span>
                </div>
                <p className="text-base xs:text-lg text-gray-800 dark:text-gray-200 font-medium">Ideal para testar</p>
                <div className="mt-2 text-xs xs:text-sm text-gray-700 dark:text-gray-300 font-semibold">
                  Economize 4-6 horas de análise
                </div>
              </div>

              <ul className="space-y-3 xs:space-y-4 mb-6 xs:mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">1 superprompt gratuito</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Análise completa do projeto</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Histórico de prompts</span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="btn-secondary w-full text-center block text-sm xs:text-base"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Plano Por Projeto */}
            <div className="card bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700">
              <div className="text-center mb-6 xs:mb-8">
                <h3 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white mb-2">Por Projeto</h3>
                <div className="mb-4">
                  <span className="text-4xl xs:text-5xl font-bold text-primary-600 dark:text-primary-500">R$ 4,90</span>
                  <span className="text-base xs:text-lg text-gray-700 dark:text-gray-300">/projeto</span>
                </div>
                <p className="text-base xs:text-lg text-gray-800 dark:text-gray-200 font-medium">Ideal para uso ocasional</p>
                <div className="mt-2 text-xs xs:text-sm text-primary-700 dark:text-primary-400 font-bold">
                  Economize R$ 200-300 em tempo por projeto
                </div>
              </div>

              <ul className="space-y-3 xs:space-y-4 mb-6 xs:mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">1 superprompt gerado</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Análise completa do projeto</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Detecção de stack tecnológica</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Mapeamento de componentes e funcionalidades</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Histórico de prompts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Suporte por email</span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="btn-secondary w-full text-center block text-sm xs:text-base"
              >
                Começar Agora
              </Link>
            </div>

            {/* Plano Mensal */}
            <div className="card bg-white dark:bg-gray-800 border-2 border-primary-600 dark:border-primary-500 relative shadow-xl">
              <div className="absolute -top-3 xs:-top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 dark:bg-primary-500 text-white px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-bold shadow-lg">
                Mais Popular
              </div>
              
              <div className="text-center mb-6 xs:mb-8">
                <h3 className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white mb-2">Assinatura Mensal</h3>
                <div className="mb-4">
                  <span className="text-4xl xs:text-5xl font-bold text-primary-600 dark:text-primary-500">R$ 19,90</span>
                  <span className="text-base xs:text-lg text-gray-700 dark:text-gray-300">/mês</span>
                </div>
                <p className="text-base xs:text-lg text-gray-800 dark:text-gray-200 font-medium mb-2">Ideal para uso frequente</p>
                <p className="text-xs xs:text-sm text-primary-700 dark:text-primary-400 font-bold mb-2">7 dias grátis para testar!</p>
                <div className="mt-2 text-xs xs:text-sm text-primary-700 dark:text-primary-400 font-semibold">
                  Entendimento sistemático de sistemas complexos
                </div>
              </div>

              <ul className="space-y-3 xs:space-y-4 mb-6 xs:mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-900 dark:text-white font-semibold">Prompts ilimitados</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Análise completa do projeto</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Detecção de stack tecnológica</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Mapeamento de componentes e funcionalidades</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Histórico completo</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">Suporte prioritário</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm xs:text-base text-gray-800 dark:text-gray-200">API access (em breve)</span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="btn-primary w-full text-center block text-sm xs:text-base"
              >
                Assinar Agora
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12 xs:mt-14 sm:mt-16 md:mt-20 max-w-3xl mx-auto">
            <h2 className="text-2xl xs:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8 xs:mb-10 sm:mb-12">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="card bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-base xs:text-lg text-gray-900 dark:text-white mb-2">
                  Como funciona o pagamento por projeto?
                </h3>
                <p className="text-sm xs:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  Você paga R$ 4,90 cada vez que gerar um superprompt. Cada pagamento dá direito a gerar 1 prompt completo.
                </p>
              </div>

              <div className="card bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-base xs:text-lg text-gray-900 dark:text-white mb-2">
                  Posso cancelar a assinatura mensal a qualquer momento?
                </h3>
                <p className="text-sm xs:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento. Você também tem 7 dias grátis para testar.
                </p>
              </div>

              <div className="card bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-base xs:text-lg text-gray-900 dark:text-white mb-2">
                  Os créditos expiram?
                </h3>
                <p className="text-sm xs:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  Créditos de pagamento único não expiram. Você pode usá-los quando quiser.
                </p>
              </div>

              <div className="card bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-base xs:text-lg text-gray-900 dark:text-white mb-2">
                  Que formatos de arquivo são suportados?
                </h3>
                <p className="text-sm xs:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                  Suportamos arquivos .js, .ts, .jsx, .tsx, .json, .css, .html e arquivos ZIP contendo projetos completos. Limite de 50MB total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
