import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import FeedbackWidget from '@/components/shared/ui/FeedbackWidget'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Codervex - Entendimento Profundo de Software para Desenvolvedores',
  description: 'Transforme código complexo em contexto claro. Codervex reconstrói a intenção, arquitetura e regras implícitas de qualquer codebase, permitindo que você trabalhe com confiança e acelere o desenvolvimento.',
  keywords: ['análise de código', 'entendimento de software', 'arquitetura de sistema', 'compreensão de código', 'código legado', 'documentação de sistema', 'engenharia reversa', 'IA para código', 'geração de prompt', 'otimização de desenvolvimento'],
  authors: [{ name: 'Codervex' }],
  openGraph: {
    title: 'Codervex - Entendimento Profundo de Software para Desenvolvedores',
    description: 'Plataforma de entendimento profundo de software. Transforme código em contexto confiável para decisão e execução, acelerando seus projetos e reduzindo incertezas.',
    url: 'https://www.codervex.com',
    siteName: 'Codervex',
    images: [
      {
        url: 'https://www.codervex.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Codervex - Entendimento Profundo de Software',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codervex - Entendimento Profundo de Software para Desenvolvedores',
    description: 'Transforme código complexo em contexto claro. Codervex reconstrói a intenção, arquitetura e regras implícitas de qualquer codebase.',
    creator: '@codervex',
    images: ['https://www.codervex.com/twitter-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <ClerkProvider
      publishableKey={clerkKey || ''}
    >
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={inter.className}>
          {children}
          <FeedbackWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#000',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
