import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Política de Privacidade
          </h1>
          
          <div className="card space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Informações que Coletamos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Coletamos informações que você nos fornece diretamente, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Nome e endereço de e-mail ao criar uma conta</li>
                <li>Arquivos de projeto que você faz upload (processados e deletados após análise)</li>
                <li>Informações de pagamento processadas através do Stripe</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Como Usamos suas Informações
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Usamos suas informações para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Processar e analisar seus projetos para gerar superprompts</li>
                <li>Melhorar nossos serviços e funcionalidades</li>
                <li>Enviar notificações sobre seu uso do serviço</li>
                <li>Processar pagamentos e gerenciar sua assinatura</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Segurança dos Dados
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4 mt-4">
                <li>Arquivos enviados são processados e deletados após a análise</li>
                <li>Senhas são criptografadas usando hash seguro</li>
                <li>Dados de pagamento são processados pelo Stripe (PCI DSS compliant)</li>
                <li>Conexões são criptografadas usando HTTPS</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Compartilhamento de Informações
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Não vendemos suas informações. Compartilhamos apenas quando necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4 mt-4">
                <li>Processar pagamentos (Stripe)</li>
                <li>Melhorar prompts usando OpenAI (conteúdo anonimizado)</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Seus Direitos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Você tem o direito de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de sua conta</li>
                <li>Exportar seus dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Cookies
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Usamos cookies apenas para autenticação e funcionalidades essenciais. Não usamos cookies de rastreamento de terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Alterações nesta Política
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Podemos atualizar esta política ocasionalmente. Notificaremos você sobre mudanças significativas por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Contato
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Para questões sobre privacidade, entre em contato: <a href="mailto:privacy@codervex.com" className="text-primary-600 hover:underline">privacy@codervex.com</a>
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

