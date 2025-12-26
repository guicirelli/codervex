'use client'

import { useState } from 'react'
import { MessageSquare, X, Send, Star } from 'lucide-react'
import { cn } from '@/lib/utils/common'
import toast from 'react-hot-toast'

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Por favor, selecione uma avaliação')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedback }),
      })

      if (response.ok) {
        toast.success('Obrigado pelo feedback!')
        setRating(null)
        setFeedback('')
        setIsOpen(false)
      } else {
        toast.error('Erro ao enviar feedback')
      }
    } catch (error) {
      toast.error('Erro ao enviar feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
        aria-label="Enviar feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal de Feedback */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Como podemos melhorar?
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avalie sua experiência
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
                Seu feedback (opcional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="O que podemos melhorar? O que você mais gostou?"
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
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Feedback
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

