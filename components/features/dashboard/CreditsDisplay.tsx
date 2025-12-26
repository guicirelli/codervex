'use client'

import { Zap, CreditCard, Gift } from 'lucide-react'
import Link from 'next/link'

interface CreditsDisplayProps {
  user: any
}

export default function CreditsDisplay({ user }: CreditsDisplayProps) {
  const isUnlimited = user?.subscription === 'monthly'

  return (
    <div className="card bg-gradient-to-br from-primary-600 to-secondary-500 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            {isUnlimited ? 'Assinatura Ativa' : 'Créditos Disponíveis'}
          </h3>
          <p className="text-3xl font-bold">
            {isUnlimited ? 'Ilimitado' : user?.credits || 0}
          </p>
          {!isUnlimited && (
            <div className="mt-2">
              {user?.credits === 0 && (
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 mb-2">
                  <Gift className="w-4 h-4" />
                  <p className="text-primary-100 text-sm font-semibold">
                    1 prompt gratuito disponível!
                  </p>
                </div>
              )}
              <p className="text-primary-100 text-sm">
                {user?.credits === 0 
                  ? 'Use seu prompt gratuito agora ou adquira um plano para mais.'
                  : `${user?.credits} prompt${user?.credits !== 1 ? 's' : ''} disponível${user?.credits !== 1 ? 'eis' : ''}`
                }
              </p>
            </div>
          )}
        </div>
        <div className="text-right">
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isUnlimited ? 'Gerenciar Plano' : 'Comprar Créditos'}
          </Link>
        </div>
      </div>
    </div>
  )
}

