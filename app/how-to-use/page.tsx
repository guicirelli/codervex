import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import Link from 'next/link'
import { ArrowRight, Play, Copy, Sparkles, CheckCircle, Lightbulb } from 'lucide-react'

export default function HowToUsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Como Usar o Superprompt
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Guia passo a passo para usar seus superprompts em ferramentas de IA
            </p>
          </div>

          {/* Passo 1 */}
          <section className="card mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Gere seu Superprompt
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No dashboard, faça upload do seu projeto ou descreva sua ideia. Em poucos segundos, você receberá um superprompt completo e detalhado.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Dica:</strong> Quanto mais arquivos você enviar, mais detalhado será o prompt gerado.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Passo 2 */}
          <section className="card mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Copie o Prompt
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Clique no botão &quot;Copiar&quot; no editor de prompt. O superprompt completo será copiado para sua área de transferência.
                </p>
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Copy className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="font-semibold text-primary-900 dark:text-primary-100">
                      Botão de Copiar
                    </span>
                  </div>
                  <p className="text-sm text-primary-800 dark:text-primary-200">
                    Você também pode editar o prompt antes de copiar, personalizando-o com suas preferências.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Passo 3 - Cursor */}
          <section className="card mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Use no Cursor
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Abra o Cursor e cole o superprompt no chat. A IA do Cursor irá gerar todo o código do projeto automaticamente.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-900 dark:bg-black p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-sm">Cursor AI Chat</span>
                    </div>
                    <p className="text-gray-300 text-sm font-mono">
                      {`1. Abra o Cursor
2. Pressione Cmd/Ctrl + L para abrir o chat
3. Cole o superprompt
4. Pressione Enter
5. Aguarde a IA gerar o código`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Passo 4 - ChatGPT */}
          <section className="card mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Ou use no ChatGPT/Claude
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  O superprompt também funciona perfeitamente no ChatGPT, Claude ou qualquer outra ferramenta de IA.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">ChatGPT</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cole o prompt no chat e peça para gerar o projeto completo.
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Claude</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Funciona da mesma forma. Cole e aguarde a geração.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dicas */}
          <section className="card bg-gradient-to-br from-primary-50 dark:from-primary-900/20 to-secondary-50 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-500 inline-block mr-2" />
              Dicas para Melhores Resultados
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Seja Específico
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Edite o prompt antes de usar, adicionando detalhes específicos sobre cores, layout ou funcionalidades extras.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Use o Histórico
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Todos os seus prompts ficam salvos. Você pode reutilizar, editar ou comparar versões anteriores.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Itere e Melhore
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Se o resultado não ficar perfeito, edite o prompt e gere novamente. A IA aprende com suas iterações.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Gere seu primeiro superprompt gratuitamente
            </p>
            <Link
              href="/auth/register"
              className="btn-primary text-lg px-8 py-3 inline-flex items-center"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

