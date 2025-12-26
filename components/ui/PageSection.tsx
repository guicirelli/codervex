'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils/common'
import Link from 'next/link'

interface PageSectionProps {
  isBoxed?: boolean
  bgImage?: string
  bgColor?: string
  numColumns?: 1 | 2 | 3 | 4
  gap?: string
  maxWidth?: string
  hPadding?: string
  vPadding?: string
  title?: string
  subtitle?: string
  ctaBtnText?: string
  ctaBtnLink?: string
  ctaContrastBtnText?: string
  ctaContrastBtnLink?: string
  ctaContrastBtnPosition?: 'left' | 'right' | 'center'
  children?: ReactNode
  className?: string
}

export default function PageSection({
  isBoxed = false,
  bgImage,
  bgColor = 'bg-white dark:bg-gray-900',
  numColumns = 1,
  gap = 'gap-6',
  maxWidth = 'max-w-7xl',
  hPadding = 'px-4',
  vPadding = 'py-12',
  title,
  subtitle,
  ctaBtnText,
  ctaBtnLink,
  ctaContrastBtnText,
  ctaContrastBtnLink,
  ctaContrastBtnPosition = 'right',
  children,
  className,
}: PageSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  const containerClass = isBoxed ? maxWidth : 'w-full'
  const sectionStyle = bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <section
      className={cn(
        'relative',
        bgColor,
        vPadding,
        className
      )}
      style={sectionStyle}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      )}
      <div className={cn('mx-auto', containerClass, hPadding, 'relative z-10')}>
        {(title || subtitle) && (
          <div className="mb-8 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={cn('grid', gridCols[numColumns], gap)}>
          {children}
        </div>

        {(ctaBtnText || ctaContrastBtnText) && (
          <div
            className={cn(
              'mt-8 flex flex-col sm:flex-row items-center justify-center gap-4',
              {
                'justify-start': ctaContrastBtnPosition === 'left',
                'justify-end': ctaContrastBtnPosition === 'right',
                'justify-center': ctaContrastBtnPosition === 'center',
              }
            )}
          >
            {ctaBtnText && ctaBtnLink && (
              <Link href={ctaBtnLink} className="btn-primary">
                {ctaBtnText}
              </Link>
            )}
            {ctaContrastBtnText && ctaContrastBtnLink && (
              <Link
                href={ctaContrastBtnLink}
                className="btn-secondary"
              >
                {ctaContrastBtnText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

