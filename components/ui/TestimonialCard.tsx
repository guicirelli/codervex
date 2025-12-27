'use client'

// framer-motion removido para compatibilidade com React 19
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface TestimonialCardProps {
  name: string
  role: string
  rating: number
  text: string
  className?: string
}

export default function TestimonialCard({
  name,
  role,
  rating,
  text,
  className,
}: TestimonialCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={cn('card animate-fade-in-up', className)}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
          {initials}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
        </div>
      </div>

      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'w-4 h-4',
              i < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            )}
          />
        ))}
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative pl-4">
        <span className="absolute left-0 top-0 text-4xl text-primary-200 dark:text-primary-800 leading-none">
          &quot;
        </span>
        {text}
      </p>
    </div>
  )
}

