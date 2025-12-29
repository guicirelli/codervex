'use client'

import { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { validateLoginForm, validateEmail } from '@/lib/utils/validation'

interface FieldErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [clerkReady, setClerkReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; resetAt: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isLoaded) {
      setClerkReady(true)
    } else {
      const timer = setTimeout(() => {
        setClerkReady(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      let captchaElement = document.getElementById('clerk-captcha')
      if (!captchaElement) {
        captchaElement = document.createElement('div')
        captchaElement.id = 'clerk-captcha'
        captchaElement.style.display = 'none'
        captchaElement.style.visibility = 'hidden'
        captchaElement.style.opacity = '0'
        captchaElement.style.position = 'absolute'
        captchaElement.style.left = '-9999px'
        document.body.appendChild(captchaElement)
      } else {
        captchaElement.style.display = 'none'
        captchaElement.style.visibility = 'hidden'
        captchaElement.style.opacity = '0'
      }
    }
  }, [mounted])

  // Validação em tempo real
  useEffect(() => {
    if (touched.email) {
      const emailValidation = validateEmail(email)
      if (!emailValidation.valid) {
        setErrors(prev => ({ ...prev, email: emailValidation.error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.email
          return newErrors
        })
      }
    }
  }, [email, touched.email])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Marcar campos como tocados
    setTouched({ email: true, password: true })

    if (!isLoaded) {
      toast.error('Authentication service is not ready. Please wait a moment.')
      return
    }

    // Validação completa
    const validation = validateLoginForm({ email, password })
    if (!validation.valid) {
      setErrors(validation.errors)
      const firstError = Object.values(validation.errors)[0]
      if (firstError) {
        toast.error(firstError)
      }
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Successfully signed in!')
        router.push('/dashboard')
      } else if (result.status === 'needs_first_factor') {
        toast.error('Additional verification required')
      } else {
        toast.error('Error signing in. Please try again.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Error signing in. Please check your credentials.'
      let isUserNotFound = false
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0]
        
        // Erros específicos do Clerk
        if (clerkError.code === 'form_identifier_not_found') {
          // Usuário não encontrado - mostrar aviso amigável
          isUserNotFound = true
          errorMessage = 'No account found with this email address. Please sign up first to create your account.'
        } else if (clerkError.code === 'form_password_incorrect') {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (clerkError.message) {
          errorMessage = clerkError.message
        }
      }

      // Verificar se é erro de rate limit
      if (err.status === 429 || err.statusCode === 429) {
        const resetAt = err.resetAt || Date.now() + 15 * 60 * 1000
        const remaining = err.remaining || 0
        setRateLimitInfo({ remaining, resetAt })
        errorMessage = `Too many attempts. Please try again in ${Math.ceil((resetAt - Date.now()) / 60000)} minutes.`
        isUserNotFound = false
      }

      // Mostrar aviso amigável se usuário não encontrado, erro caso contrário
      if (isUserNotFound) {
        toast(errorMessage, {
          icon: 'ℹ️',
          duration: 5000,
          style: {
            background: '#1e40af',
            color: '#fff',
          },
        })
      } else {
        toast.error(errorMessage)
      }
      
      setErrors({
        email: errorMessage.toLowerCase().includes('email') || isUserNotFound ? errorMessage : undefined,
        password: errorMessage.toLowerCase().includes('password') || errorMessage.toLowerCase().includes('credentials') ? errorMessage : undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'oauth_google' | 'oauth_github') => {
    try {
      if (!isLoaded) {
        toast.error('Authentication service is loading. Please wait a moment.')
        return
      }

      if (!signIn) {
        toast.error('Authentication service is not available. Please reload the page.')
        return
      }

      if (typeof signIn.authenticateWithRedirect !== 'function') {
        toast.error('OAuth method is not available. Please check the configuration.')
        return
      }

      setOauthLoading(provider)
      
      const redirectUrl = window.location.origin + '/sso-callback'
      const redirectUrlComplete = window.location.origin + '/dashboard'
      
      signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: redirectUrl,
        redirectUrlComplete: redirectUrlComplete,
      }).then(() => {
        // Redirecionamento iniciado
      }).catch((err: any) => {
        console.error('OAuth error:', err)
        setOauthLoading(null)
        
        let errorMsg = 'Erro ao conectar com ' + (provider === 'oauth_google' ? 'Google' : 'GitHub')
        
        if (err?.errors?.[0]?.message) {
          const clerkError = err.errors[0].message.toLowerCase()
          const isUserNotFound = clerkError.includes('not found') || clerkError.includes('does not exist')
          
          if (isUserNotFound) {
            errorMsg = `No account found with this ${provider === 'oauth_google' ? 'Google' : 'GitHub'} account. Please sign up first to create your account.`
            // Mostrar aviso amigável ao invés de erro
            toast(errorMsg, {
              icon: 'ℹ️',
              duration: 6000,
              style: {
                background: '#1e40af',
                color: '#fff',
              },
            })
            return // Não continuar com toast.error
          } else if (clerkError.includes('already exists') || clerkError.includes('already registered')) {
            errorMsg = `This ${provider === 'oauth_google' ? 'Google' : 'GitHub'} account is already registered. Please sign in instead.`
            toast(errorMsg, {
              icon: 'ℹ️',
              duration: 5000,
              style: {
                background: '#1e40af',
                color: '#fff',
              },
            })
            return
          } else {
            errorMsg = err.errors[0].message
          }
        } else if (err?.message) {
          errorMsg = err.message
        }
        
        toast.error(errorMsg)
      })
      
    } catch (err: any) {
      console.error('Error in handleSocialLogin:', err)
      setOauthLoading(null)
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
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
        <div className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
          <div className="absolute inset-0 bg-primary-500/10"></div>
        </div>
        
        <div className="w-full max-w-md relative z-50 mt-8" style={{ pointerEvents: 'auto' }}>
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-2xl p-8 relative z-50" style={{ pointerEvents: 'auto' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Sign in to your account</h1>
              <p className="text-gray-400">Welcome back to Codervex</p>
            </div>

            {/* Rate limit warning */}
            {rateLimitInfo && (
              <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-sm text-yellow-400">
                  Too many attempts. Try again in {Math.ceil((rateLimitInfo.resetAt - Date.now()) / 60000)} minutes.
                </p>
              </div>
            )}

            {/* Botões OAuth */}
            <div className="space-y-2 mb-4" style={{ position: 'relative', zIndex: 50 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!loading && oauthLoading === null) {
                    handleSocialLogin('oauth_google')
                  }
                }}
                disabled={loading || oauthLoading !== null || !!rateLimitInfo}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg py-2 px-3 text-sm flex items-center justify-center gap-2"
                style={{ 
                  position: 'relative',
                  zIndex: 50,
                  pointerEvents: (loading || oauthLoading !== null || !!rateLimitInfo) ? 'none' : 'auto',
                }}
              >
                {oauthLoading === 'oauth_google' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  e.preventDefault()
                  e.stopPropagation()
                  if (!loading && oauthLoading === null) {
                    handleSocialLogin('oauth_github')
                  }
                }}
                disabled={loading || oauthLoading !== null || !!rateLimitInfo}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg py-2 px-3 text-sm flex items-center justify-center gap-2"
                style={{ 
                  position: 'relative',
                  zIndex: 50,
                  pointerEvents: (loading || oauthLoading !== null || !!rateLimitInfo) ? 'none' : 'auto',
                }}
              >
                {oauthLoading === 'oauth_github' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    Continue with GitHub
                  </>
                )}
              </button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">ou</span>
              </div>
            </div>

            {/* Formulário Email/Senha */}
            <form onSubmit={handleEmailLogin} action={undefined} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-500' : touched.email && !errors.email ? 'text-green-500' : 'text-gray-500'}`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    required
                    disabled={loading || !!rateLimitInfo}
                    className={`w-full pl-10 pr-10 py-2.5 border-2 ${
                      errors.email 
                        ? 'border-red-500 bg-red-500/10' 
                        : touched.email && !errors.email
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-700 bg-gray-800'
                    } text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500`}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {touched.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {errors.email ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
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
                    onBlur={() => handleBlur('password')}
                    required
                    disabled={loading || !!rateLimitInfo}
                    className={`w-full pl-4 pr-12 py-2.5 border-2 ${
                      errors.password 
                        ? 'border-red-500 bg-red-500/10' 
                        : 'border-gray-700 bg-gray-800'
                    } text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded || !!rateLimitInfo}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <a 
                  href="/auth/register" 
                  className="text-primary-500 hover:text-primary-400 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  Sign up
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
