'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface TopRibbonProps {
  messages?: string[]
  bgColor?: string
  textColor?: string
  speed?: number
  pauseOnHover?: boolean
  showCloseButton?: boolean
  className?: string
}

export default function TopRibbon({
  messages = [],
  bgColor = 'bg-primary-600',
  textColor = 'text-white',
  speed = 50,
  pauseOnHover = true,
  showCloseButton = true,
  className,
}: TopRibbonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    if (messages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 5000) // Muda mensagem a cada 5 segundos

    return () => clearInterval(interval)
  }, [messages.length])

  if (!isVisible || messages.length === 0) return null

  const currentMessage = messages[currentMessageIndex] || messages[0]

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        bgColor,
        textColor,
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center py-2 px-4 animate-marquee',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <p className="text-sm font-medium whitespace-nowrap">
          {currentMessage}
        </p>
      </div>

      {showCloseButton && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
          aria-label="Fechar banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}

    </div>
  )
}

