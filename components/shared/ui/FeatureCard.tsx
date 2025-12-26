'use client'

import React from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={cn(
        'card text-center hover:shadow-xl transition-shadow duration-300',
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
    </motion.div>
  )
}
