'use client'

import React from 'react'
// framer-motion removido para compatibilidade com React 19
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface FeatureCardProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  title: string
  description: string
  className?: string
}

export default function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up',
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-primary-600" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  )
}
