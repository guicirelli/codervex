'use client'

import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    console.warn('⚠️ Clerk não configurado - continuando sem autenticação')
    return <>{children}</>
  }
  
  try {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        {children}
      </ClerkProvider>
    )
  } catch (error) {
    console.error('Erro ao inicializar Clerk:', error)
    return <>{children}</>
  }
}

