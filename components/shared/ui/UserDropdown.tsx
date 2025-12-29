'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { User, LogOut, ChevronDown } from 'lucide-react'

interface UserIdentity {
  username?: string | null
  displayName?: string | null
  avatar?: string | null
  email: string
}

interface UserDropdownProps {
  identity: UserIdentity
  clerkUser: any
}

export default function UserDropdown({ identity, clerkUser }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { signOut } = useClerk()

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const displayName = identity.username 
    ? `@${identity.username}` 
    : identity.displayName || identity.email.split('@')[0]

  const avatarUrl = identity.avatar || clerkUser?.imageUrl

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do usuário */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-gray-800/50 rounded-lg transition-colors"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={32}
            height={32}
            className="rounded-full border-2 border-primary-500/50"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="hidden sm:inline text-white font-semibold text-sm">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header do usuário */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-primary-500/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center border-2 border-primary-400">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {identity.username && (
                  <p className="text-white font-semibold text-sm truncate">
                    @{identity.username}
                  </p>
                )}
                <p className="text-gray-400 text-xs truncate">
                  {identity.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            <div className="border-t border-gray-800 my-2"></div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

