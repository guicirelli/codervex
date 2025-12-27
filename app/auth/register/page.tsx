'use client'

import { useState, useEffect } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'

export default function RegisterPage() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [clerkReady, setClerkReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Aguardar Clerk carregar, mas não bloquear indefinidamente
    if (isLoaded) {
      setClerkReady(true)
    } else {
      // Timeout de segurança: habilitar botões após 2 segundos mesmo se Clerk não carregar
      const timer = setTimeout(() => {
        setClerkReady(true)
        console.warn('Clerk não carregou, mas habilitando botões OAuth')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Adicionar elemento CAPTCHA apenas no cliente
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      let captchaElement = document.getElementById('clerk-captcha')
      if (!captchaElement) {
        captchaElement = document.createElement('div')
        captchaElement.id = 'clerk-captcha'
        captchaElement.style.display = 'none'
        document.body.appendChild(captchaElement)
      }
    }
  }, [mounted])

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) {
      toast.error('Authentication service is not ready. Please wait a moment.')
      return
    }

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Account created successfully!')
        router.push('/dashboard')
      } else {
        // Preparar verificação por email
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        toast.success('Verification code sent to your email!')
        // Em produção, você pode redirecionar para uma página de verificação
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage = err.errors?.[0]?.message || 'Error creating account. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialRegister = (provider: 'oauth_google' | 'oauth_github') => {
    try {
      console.log('=== OAuth Button Clicked ===')
      console.log('Provider:', provider)
      console.log('isLoaded:', isLoaded)
      console.log('signUp exists:', !!signUp)
      
      if (!isLoaded) {
        console.warn('Clerk not loaded yet')
        toast.error('Authentication service is loading. Please wait a moment.')
        return
      }

      if (!signUp) {
        console.error('signUp is null or undefined')
        toast.error('Authentication service is not available. Please refresh the page.')
        return
      }

      console.log('signUp object:', signUp)
      console.log('signUp.authenticateWithRedirect type:', typeof signUp.authenticateWithRedirect)

      if (typeof signUp.authenticateWithRedirect !== 'function') {
        console.error('authenticateWithRedirect is not a function')
        toast.error('OAuth method not available. Please check Clerk configuration.')
        return
      }

      setOauthLoading(provider)
      
      const redirectUrl = window.location.origin + '/sso-callback'
      const redirectUrlComplete = window.location.origin + '/dashboard'
      
      console.log('Calling authenticateWithRedirect with:', {
        strategy: provider,
        redirectUrl,
        redirectUrlComplete
      })
      
      // Chamar o método sem await para não bloquear
      signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: redirectUrl,
        redirectUrlComplete: redirectUrlComplete,
      }).then(() => {
        console.log('OAuth redirect initiated successfully')
      }).catch((err: any) => {
        console.error('OAuth error:', err)
        setOauthLoading(null)
        
        // Tratar erros específicos
        let errorMsg = err?.errors?.[0]?.message || err?.message || 'OAuth error occurred'
        
        // Verificar se é erro de conta já existente
        if (errorMsg.toLowerCase().includes('already exists') || 
            errorMsg.toLowerCase().includes('already registered') ||
            errorMsg.toLowerCase().includes('email') && errorMsg.toLowerCase().includes('exists')) {
          errorMsg = `This ${provider === 'oauth_google' ? 'Google' : 'GitHub'} account is already registered. Please sign in instead.`
        }
        
        toast.error(errorMsg)
      })
      
    } catch (err: any) {
      console.error('Error in handleSocialRegister:', err)
      setOauthLoading(null)
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      
      <div 
        className="flex-1 flex items-start justify-center pt-20 pb-12 px-4 relative overflow-hidden min-h-screen"
        style={{
          backgroundImage: 'url(/images/background-home.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#000',
        }}
        suppressHydrationWarning
      >
        {/* Background igual à home */}
        <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-primary-500/10"></div>
        </div>
        
        <div className="w-full max-w-md relative z-50 mt-8" style={{ pointerEvents: 'auto' }}>
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8 relative z-50" style={{ pointerEvents: 'auto' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-gray-400">Start using Codervex today</p>
            </div>

            {/* Clerk CAPTCHA Element será adicionado via useEffect no cliente */}

            <div className="space-y-3 mb-6" style={{ position: 'relative', zIndex: 50 }}>
              <button
                type="button"
                onClick={(e) => {
                  console.log('Google button clicked', { clerkReady, isLoaded, loading, oauthLoading })
                  e.preventDefault()
                  e.stopPropagation()
                  if (!loading && oauthLoading === null) {
                    handleSocialRegister('oauth_google')
                  } else {
                    console.log('Button blocked:', { loading, oauthLoading })
                  }
                }}
                disabled={loading || oauthLoading !== null}
                className="w-full bg-gray-800 border-2 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-3"
                style={{ 
                  position: 'relative',
                  zIndex: 50,
                  pointerEvents: (loading || oauthLoading !== null) ? 'none' : 'auto',
                  cursor: (loading || oauthLoading !== null) ? 'not-allowed' : 'pointer'
                }}
              >
                {oauthLoading === 'oauth_google' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  console.log('GitHub button clicked', { clerkReady, isLoaded, loading, oauthLoading })
                  e.preventDefault()
                  e.stopPropagation()
                  if (!loading && oauthLoading === null) {
                    handleSocialRegister('oauth_github')
                  } else {
                    console.log('Button blocked:', { loading, oauthLoading })
                  }
                }}
                disabled={loading || oauthLoading !== null}
                className="w-full bg-gray-800 border-2 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-3"
                style={{ 
                  position: 'relative',
                  zIndex: 50,
                  pointerEvents: (loading || oauthLoading !== null) ? 'none' : 'auto',
                  cursor: (loading || oauthLoading !== null) ? 'not-allowed' : 'pointer'
                }}
              >
                {oauthLoading === 'oauth_github' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">or</span>
              </div>
            </div>

            <form onSubmit={handleEmailRegister} action={undefined} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-700 bg-gray-800 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                    className="w-full pl-4 pr-12 py-2.5 border-2 border-gray-700 bg-gray-800 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                    className="w-full pl-4 pr-12 py-2.5 border-2 border-gray-700 bg-gray-800 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <a 
                  href="/auth/login" 
                  className="text-primary-500 hover:text-primary-400 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
