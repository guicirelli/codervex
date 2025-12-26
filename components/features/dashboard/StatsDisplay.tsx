'use client'

import { Trophy, Zap, Calendar, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface StatsDisplayProps {
  totalPrompts: number
  favoritePrompts: number
  thisMonth: number
  streak: number
}

export default function StatsDisplay({ totalPrompts, favoritePrompts, thisMonth, streak }: StatsDisplayProps) {
  const getBadge = () => {
    if (totalPrompts >= 50) return { name: 'Mestre', icon: Trophy, color: 'text-yellow-600' }
    if (totalPrompts >= 20) return { name: 'Expert', icon: TrendingUp, color: 'text-purple-600' }
    if (totalPrompts >= 10) return { name: 'Avançado', icon: Zap, color: 'text-blue-600' }
    if (totalPrompts >= 5) return { name: 'Intermediário', icon: Calendar, color: 'text-green-600' }
    return { name: 'Iniciante', icon: Zap, color: 'text-gray-600' }
  }

  const badge = getBadge()
  const BadgeIcon = badge.icon

  return (
    <div className="card bg-gradient-to-br from-primary-50 dark:from-primary-900/20 to-secondary-50 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Suas Estatísticas
          </h3>
          <div className="flex items-center space-x-2">
            <BadgeIcon className={cn('w-5 h-5', badge.color)} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {badge.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalPrompts}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Prompts Gerados
          </div>
        </div>

        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {favoritePrompts}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Favoritos
          </div>
        </div>

        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {thisMonth}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Este Mês
          </div>
        </div>

        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {streak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Dias Consecutivos
          </div>
        </div>
      </div>
    </div>
  )
}

