'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/common'
// framer-motion removido temporariamente para compatibilidade com React 19

interface CtaButtonProps {
  children?: React.ReactNode
  text?: string
  variant?: 'primary' | 'outline' | 'secondary'
  onClick?: () => void
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CtaButton({
  children,
  text,
  variant = 'primary',
  onClick,
  href,
  className,
  size = 'md',
}: CtaButtonProps) {
  const content = text || children
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg'
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-500 text-white hover:opacity-90 hover:scale-105 dark:bg-primary-500 dark:hover:bg-primary-500',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:border-primary-500 dark:text-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  const buttonContent = (
    <span className="inline-flex items-center transition-transform hover:scale-105 active:scale-95">
      {content}
    </span>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {buttonContent}
    </button>
  )
}

