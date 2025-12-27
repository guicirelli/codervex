'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, X, Send, Star, Check } from 'lucide-react'
import { cn } from '@/lib/utils/common'

export default function FeedbackWidget() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Prevenir hydration errors - só renderizar no cliente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async () => {
    if (!rating) {
      return
    }

    setIsSubmitting(true)
    
    // Simular envio (sem fazer requisição real)
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
      
      // Fechar após mostrar OK por 1.5 segundos
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setRating(null)
        setFeedback('')
      }, 1500)
    }, 500)
  }

  // Não renderizar até estar montado no cliente
  if (!isMounted) {
    return <></>
  }

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
        aria-label="Send feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal de Feedback */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-scale-in shadow-lg">
                  <Check className="w-10 h-10 text-white stroke-[3]" />
                </div>
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-fade-in-delay">
                  Feedback sent successfully
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 animate-fade-in-delay-2">
                  Thank you for helping us improve
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    How can we improve?
                  </h3>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setRating(null)
                      setFeedback('')
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate your experience
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={cn(
                          'p-2 rounded transition-colors',
                          rating && rating >= star
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        )}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your feedback (optional)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="What can we improve? What did you like most?"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!rating || isSubmitting}
                  className="btn-primary w-full inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

