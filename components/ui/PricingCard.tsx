'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import CtaButton from './CtaButton'

interface PricingCardProps {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  featured?: boolean
  href?: string
  className?: string
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  featured = false,
  href = '/auth/register',
  className,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'card relative',
        featured && 'border-2 border-primary-500 dark:border-primary-400 shadow-xl',
        className
      )}
    >
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 dark:bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Mais Popular
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">
            {price}
          </span>
          <span className="text-gray-600 dark:text-gray-400">{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <CtaButton
        href={href}
        variant={featured ? 'primary' : 'outline'}
        className="w-full"
        size="lg"
      >
        {cta}
      </CtaButton>
    </motion.div>
  )
}

