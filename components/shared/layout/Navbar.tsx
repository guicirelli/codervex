'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/common'
import { useUser } from '@clerk/nextjs'
import { LogIn, UserPlus } from 'lucide-react'

function Navbar() {
  const { user } = useUser()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b gpu-accelerated',
        'bg-black/90 backdrop-blur-md shadow-lg border-gray-800'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20 relative">
          {/* Centered Logo and Name */}
          <Link href="/" className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
            <div className="relative w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 overflow-hidden">
              <Image
                src="/images/logo codervex pronto.png"
                alt="Codervex Logo"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, (max-width: 1024px) 56px, 64px"
              />
            </div>
            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Codervex</span>
          </Link>

          {/* Login and Sign Up Buttons - Right */}
          {!user && (
            <div className="flex items-center gap-3 sm:gap-4 absolute right-0">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-gray-300 hover:text-white font-semibold text-sm sm:text-base transition-colors rounded-lg hover:bg-gray-800/50"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary-500 text-white font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default memo(Navbar)
