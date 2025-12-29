'use client'

import { ReactNode } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils/common'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  distance?: number
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 20,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, once: true })

  const getInitialTransform = () => {
    if (direction === 'fade') return 'none'
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`
      case 'down':
        return `translateY(-${distance}px)`
      case 'left':
        return `translateX(${distance}px)`
      case 'right':
        return `translateX(-${distance}px)`
      default:
        return 'none'
    }
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-all duration-600 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : 'opacity-0',
        className
      )}
      style={{
        transform: isVisible ? 'translateY(0) translateX(0)' : getInitialTransform(),
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

