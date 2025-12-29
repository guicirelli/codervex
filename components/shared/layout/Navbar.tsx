'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/common'
import { LogIn, UserPlus, HelpCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import UserDropdown from '@/components/shared/ui/UserDropdown'

export default function Navbar() {
  const { user, isLoaded } = useUser()
  const [identity, setIdentity] = useState<{
    username?: string | null
    displayName?: string | null
    avatar?: string | null
    email: string
  } | null>(null)

  // Carregar identidade do usuário
  useEffect(() => {
    if (user && isLoaded) {
      loadIdentity()
    }
  }, [user, isLoaded])

  const loadIdentity = async () => {
    try {
      const response = await fetch('/api/user/identity')
      if (response.ok) {
        const data = await response.json()
        setIdentity({
          username: data.identity?.username,
          displayName: data.identity?.displayName,
          avatar: data.identity?.avatar,
          email: data.identity?.email || user?.emailAddresses[0]?.emailAddress || '',
        })
      } else {
        // Fallback para dados do Clerk
        setIdentity({
          username: null,
          displayName: user?.firstName || null,
          avatar: user?.imageUrl || null,
          email: user?.emailAddresses[0]?.emailAddress || '',
        })
      }
    } catch (error) {
      console.error('Erro ao carregar identidade:', error)
      // Fallback
      setIdentity({
        username: null,
        displayName: user?.firstName || null,
        avatar: user?.imageUrl || null,
        email: user?.emailAddresses[0]?.emailAddress || '',
      })
    }
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 border-b',
        'bg-black/90 backdrop-blur-md shadow-lg border-gray-800'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 md:h-20 relative">
          {/* Centered Logo and Name */}
          <Link href="/" className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
            <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0 overflow-hidden">
              <Image
                src="/images/logo codervex pronto.png"
                alt="Codervex Logo"
                fill
                className="object-contain object-center"
                priority
                sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                onError={(e) => {
                  // Fallback se imagem não carregar
                  const target = e.target as HTMLImageElement
                  if (target) {
                    target.style.display = 'none'
                  }
                }}
              />
            </div>
            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white">Codervex</span>
          </Link>

          {/* Right Side - User Menu or Login/Sign Up */}
          <div className="flex items-center gap-3 sm:gap-4 absolute right-0">
            <Link
              href="/why-codervex"
              prefetch={true}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 transition-all hover:scale-105 group border border-primary-500/30 hover:border-primary-500/50"
            >
              <span className="font-semibold text-sm">Why</span>
              <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
            {user && identity ? (
              <UserDropdown identity={identity} clerkUser={user} />
            ) : user ? (
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400 animate-pulse"></div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-gray-300 hover:text-white font-semibold text-sm sm:text-base transition-colors rounded-lg hover:bg-gray-800/50"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  href="/auth/register"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary-500 text-white font-semibold text-sm sm:text-base rounded-lg hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
