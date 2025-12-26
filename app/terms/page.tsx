import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Termos de Uso
          </h1>
          
          <div className="card space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ao usar o Custom PE, você concorda com estes termos de uso. Se não concordar, não use o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Uso do Serviço
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você concorda em usar o serviço apenas para fins legítimos e de acordo com estes termos. Você não pode:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Usar o serviço para atividades ilegais</li>
                <li>Tentar acessar áreas restritas do sistema</li>
                <li>Interferir no funcionamento do serviço</li>
                <li>Compartilhar sua conta com terceiros</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Propriedade Intelectual
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Os prompts gerados são de sua propriedade. Você pode usá-los livremente. O serviço Custom PE e sua tecnologia são propriedade nossa.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Pagamentos e Reembolsos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Pagamentos são processados pelo Stripe. Política de reembolso:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Assinaturas mensais podem ser canceladas a qualquer momento</li>
                <li>Reembolsos são avaliados caso a caso</li>
                <li>Créditos não utilizados não são reembolsáveis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Limitação de Responsabilidade
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                O Custom PE é fornecido &quot;como está&quot;. Não garantimos resultados específicos dos prompts gerados. Não somos responsáveis por perdas decorrentes do uso do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Modificações do Serviço
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Reservamos o direito de modificar ou descontinuar o serviço a qualquer momento, com ou sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Cancelamento
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Você pode cancelar sua conta a qualquer momento através das configurações. Seus dados serão mantidos por 30 dias após o cancelamento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Lei Aplicável
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais competentes.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

