import { cn } from '@/lib/utils/common'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton className="h-6 w-3/4 mb-4" variant="text" />
      <Skeleton className="h-4 w-full mb-2" variant="text" />
      <Skeleton className="h-4 w-5/6 mb-4" variant="text" />
      <Skeleton className="h-10 w-24" variant="rectangular" />
    </div>
  )
}

export function SkeletonPrompt() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" variant="rectangular" />
        <Skeleton className="h-10 w-24" variant="rectangular" />
      </div>
      <Skeleton className="h-64 w-full mb-4" variant="rectangular" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" variant="rectangular" />
        <Skeleton className="h-10 w-32" variant="rectangular" />
      </div>
    </div>
  )
}

