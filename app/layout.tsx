import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import FeedbackWidgetWrapper from '@/components/shared/ui/FeedbackWidgetWrapper'
import ClerkProviderWrapper from '@/components/providers/ClerkProviderWrapper'
import { ErrorBoundary } from '@/components/providers/ErrorBoundary'

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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
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
  // O ClerkProvider lê automaticamente NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY do ambiente
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ClerkProviderWrapper>
            {children}
            <FeedbackWidgetWrapper />
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
          </ClerkProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  )
}
