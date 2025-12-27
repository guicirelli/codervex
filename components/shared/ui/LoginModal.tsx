'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, LogIn, UserPlus, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function LoginModal({ 
  isOpen, 
  onClose, 
  title = 'Login Required',
  message = 'You need to log in to continue'
}: LoginModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary-500" />
          </div>

          {/* Content */}
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
            <Link
              href="/auth/register"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-primary-500 text-primary-500 rounded-lg font-semibold hover:bg-primary-500/10 dark:hover:bg-primary-500/20 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            It&apos;s quick and free. No credit card required.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

