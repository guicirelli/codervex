'use client'

import { SignIn } from '@clerk/nextjs'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-lg',
              },
            }}
            routing="path"
            path="/auth/login"
            signUpUrl="/auth/register"
            afterSignInUrl="/dashboard"
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
