'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/common'
import { LogIn, UserPlus, LogOut, User } from 'lucide-react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
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
            {!isLoaded ? (
              // Loading state - mostrar nada ou um placeholder sutil
              <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-2 text-white hover:text-gray-200 font-medium text-sm transition-colors rounded-lg hover:bg-gray-800/50"
                  title={user.emailAddresses[0]?.emailAddress || 'Dashboard'}
                >
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.firstName || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-primary-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden sm:inline text-white font-semibold">
                    {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User'}
                  </span>
                </Link>
                
                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white font-medium text-sm transition-colors rounded-lg hover:bg-gray-800/50"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
