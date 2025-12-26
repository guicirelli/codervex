import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/common'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  children?: React.ReactNode
  onClose?: () => void
  className?: string
}

export default function Alert({ type = 'info', title, children, onClose, className }: AlertProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'border rounded-lg p-4 flex items-start',
        styles[type],
        className
      )}
    >
      <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-current opacity-70 hover:opacity-100"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

