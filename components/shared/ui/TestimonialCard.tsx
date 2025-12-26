'use client'

import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface TestimonialCardProps {
  name: string
  role: string
  rating: number
  text: string
  className?: string
}

function TestimonialCard({
  name,
  role,
  rating,
  text,
  className,
}: TestimonialCardProps) {
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [name])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('card bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-md gpu-accelerated', className)}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-primary-600 dark:bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-base">{name}</h4>
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{role}</p>
        </div>
      </div>

      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        ))}
      </div>

      <p className="text-gray-900 dark:text-white leading-relaxed relative pl-6 text-sm sm:text-base font-normal">
        <span className="absolute left-0 top-0 text-4xl text-primary-500 dark:text-primary-400 leading-none opacity-40 font-serif pointer-events-none">
          &quot;
        </span>
        {text}
      </p>
    </motion.div>
  )
}

export default memo(TestimonialCard)

