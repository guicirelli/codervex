import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import dynamicImport from 'next/dynamic'

// Lazy load FeedbackWidget for better performance
const FeedbackWidget = dynamicImport(() => import('@/components/shared/ui/FeedbackWidget'), {
  ssr: false,
})

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'Codervex - Deep Software Understanding for Developers',
  description: 'Transform complex code into clear context. Codervex reconstructs the intent, architecture, and implicit rules of any codebase, allowing you to work with confidence and accelerate development.',
  keywords: ['code analysis', 'software understanding', 'system architecture', 'code comprehension', 'legacy code', 'system documentation', 'reverse engineering', 'AI for code', 'prompt generation', 'development optimization'],
  authors: [{ name: 'Codervex' }],
  openGraph: {
    title: 'Codervex - Deep Software Understanding for Developers',
    description: 'Deep software understanding platform. Transform code into reliable context for decision and execution, accelerating your projects and reducing uncertainties.',
    url: 'https://www.codervex.com',
    siteName: 'Codervex',
    images: [
      {
        url: 'https://www.codervex.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Codervex - Deep Software Understanding',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codervex - Deep Software Understanding for Developers',
    description: 'Transform complex code into clear context. Codervex reconstructs the intent, architecture, and implicit rules of any codebase.',
    creator: '@codervex',
    images: ['https://www.codervex.com/twitter-image.jpg'],
  },
}

export const dynamic = 'force-dynamic'

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
    <html lang="en" suppressHydrationWarning>
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
