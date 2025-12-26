'use client'

import React from 'react'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import ReferenceProjectSelector from '@/components/features/dashboard/ReferenceProjectSelector'

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-2">
            Comunidade Open Source
          </h1>
          <p className="text-gray-700 mb-8">
            Explore projetos compartilhados pela comunidade e use como referência para melhorar seus próprios projetos
          </p>

          <ReferenceProjectSelector
            onSelect={(project) => {
              // Redirecionar para criar com referência
              if (typeof window !== 'undefined') {
                window.location.href = `/dashboard/create?ref=${project.id}`
              }
            }}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

