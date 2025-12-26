'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CtaButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'secondary'
  onClick?: () => void
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CtaButton({
  children,
  variant = 'primary',
  onClick,
  href,
  className,
  size = 'md',
}: CtaButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg'
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white hover:opacity-90 hover:scale-105 dark:bg-primary-500 dark:hover:bg-primary-600',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white dark:border-primary-400 dark:text-primary-400',
    secondary: 'bg-secondary-200 hover:bg-secondary-300 text-primary-800 dark:bg-secondary-800 dark:text-secondary-700',
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
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center"
    >
      {children}
    </motion.span>
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

