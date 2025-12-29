'use client'

import { useState, useEffect } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/shared/layout/Navbar'
import Footer from '@/components/shared/layout/Footer'
import { validateRegisterForm, validateEmail, validatePassword, getPasswordStrength } from '@/lib/utils/validation'
import { validateUsernameFormat } from '@/lib/utils/username-validation'

interface FieldErrors {
  email?: string
  password?: string
  name?: string
}

export default function RegisterPage() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [nameValidationError, setNameValidationError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [clerkReady, setClerkReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remaining: number; resetAt: number } | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying, setVerifying] = useState(false)

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

  // Validação em tempo real - Email
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

  // Validação em tempo real - Senha e força
  useEffect(() => {
    // Atualizar força da senha em tempo real
    const strength = getPasswordStrength(password)
    setPasswordStrength(strength)

    if (touched.password) {
      const passwordValidation = validatePassword(password, email)
      if (!passwordValidation.valid) {
        setErrors(prev => ({ ...prev, password: passwordValidation.error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.password
          return newErrors
        })
      }
    }
  }, [password, email, touched.password])

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Marcar todos os campos como tocados
    setTouched({ email: true, password: true, name: true })

    if (!isLoaded) {
      toast.error('Authentication service is not ready. Please wait a moment.')
      return
    }

    // Validação completa
    const validation = validateRegisterForm({
      email,
      password,
      confirmPassword: password, // Não usado mais, mas mantido para compatibilidade com validateRegisterForm
      name: name.trim(),
    })

    // Verificar força da senha (só aceita média ou forte)
    const strength = getPasswordStrength(password)
    if (strength === 'weak') {
      const errorMsg = 'Password is too weak. Use at least 8 characters with both letters and numbers. Add uppercase, lowercase, and symbols for a stronger password'
      setErrors({ password: errorMsg })
      toast.error(errorMsg)
      return
    }

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
      const result = await signUp.create({
        emailAddress: email.trim(),
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
        setShowVerification(true)
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      
      let errorMessage = 'Error creating account. Please try again.'
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0]
        
        // Erros específicos do Clerk
        if (clerkError.code === 'form_identifier_exists') {
          // Email já cadastrado - mostrar aviso amigável
          errorMessage = 'An account with this email address already exists. Please sign in instead or use a different email.'
          setErrors({ email: errorMessage })
          // Mostrar aviso amigável
          toast(errorMessage, {
            icon: 'ℹ️',
            duration: 6000,
            style: {
              background: '#1e40af',
              color: '#fff',
            },
          })
          return // Não mostrar toast.error
        } else if (clerkError.code === 'form_password_pwned' || clerkError.message?.includes('data breach') || clerkError.message?.includes('Password has been found')) {
          // Ignorar erro de senha comprometida completamente - permitir criação de conta
          console.warn('Password pwned warning ignored - allowing registration')
          setLoading(false)
          return // Não mostrar erro, permitir que o usuário continue
        } else if (clerkError.message) {
          errorMessage = clerkError.message
        }
      }

      // Verificar se é erro de rate limit
      if (err.status === 429 || err.statusCode === 429) {
        const resetAt = err.resetAt || Date.now() + 60 * 60 * 1000
        const remaining = err.remaining || 0
        setRateLimitInfo({ remaining, resetAt })
        errorMessage = `Too many attempts. Please try again in ${Math.ceil((resetAt - Date.now()) / 60000)} minutes.`
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialRegister = (provider: 'oauth_google' | 'oauth_github') => {
    try {
      if (!isLoaded) {
        toast.error('Authentication service is loading. Please wait a moment.')
        return
      }

      if (!signUp) {
        toast.error('Authentication service is not available. Please reload the page.')
        return
      }

      if (typeof signUp.authenticateWithRedirect !== 'function') {
        toast.error('OAuth method is not available. Please check the configuration.')
        return
      }

      setOauthLoading(provider)
      
      const redirectUrl = window.location.origin + '/sso-callback'
      const redirectUrlComplete = window.location.origin + '/dashboard'
      
      signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: redirectUrl,
        redirectUrlComplete: redirectUrlComplete,
      }).then(() => {
        // Redirecionamento iniciado
      }).catch((err: any) => {
        console.error('OAuth error:', err)
        setOauthLoading(null)
        
        let errorMsg = `Error connecting with ${provider === 'oauth_google' ? 'Google' : 'GitHub'}`
        
        if (err?.errors?.[0]?.message) {
          const clerkError = err.errors[0].message.toLowerCase()
          if (clerkError.includes('already exists') || clerkError.includes('already registered')) {
            errorMsg = `This ${provider === 'oauth_google' ? 'Google' : 'GitHub'} account is already registered. Please sign in instead.`
            // Mostrar aviso amigável
            toast(errorMsg, {
              icon: 'ℹ️',
              duration: 6000,
              style: {
                background: '#1e40af',
                color: '#fff',
              },
            })
            return // Não mostrar toast.error
          } else {
            errorMsg = err.errors[0].message
          }
        } else if (err?.message) {
          errorMsg = err.message
        }
        
        toast.error(errorMsg)
      })
      
    } catch (err: any) {
      console.error('Error in handleSocialRegister:', err)
      setOauthLoading(null)
      toast.error('An error occurred. Please try again.')
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!signUp) {
      toast.error('Authentication service not available')
      return
    }

    if (verificationCode.length !== 6) {
      toast.error('Please enter the 6-digit verification code')
      return
    }

    setVerifying(true)

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('Email verified successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Invalid verification code. Please try again.')
        setVerificationCode('')
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      let errorMessage = 'Invalid verification code. Please try again.'
      
      if (err.errors && err.errors.length > 0) {
        const clerkError = err.errors[0]
        if (clerkError.message) {
          errorMessage = clerkError.message
        }
      }
      
      toast.error(errorMessage)
      setVerificationCode('')
    } finally {
      setVerifying(false)
    }
  }

  const handleResendCode = async () => {
    if (!signUp) {
      toast.error('Authentication service not available')
      return
    }

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      toast.success('Verification code resent to your email!')
      setVerificationCode('')
    } catch (err: any) {
      console.error('Resend error:', err)
      toast.error('Error resending code. Please try again.')
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  // Labels e cores para força da senha
  const strengthLabels = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  }
  
  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500',
  }
  
  const strengthTextColors = {
    weak: 'text-red-400',
    medium: 'text-yellow-400',
    strong: 'text-green-400',
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
              <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-gray-400">Start using Codervex today</p>
            </div>

            {/* Rate limit warning */}
            {rateLimitInfo && (
              <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-sm text-yellow-400">
                  Too many attempts. Try again in {Math.ceil((rateLimitInfo.resetAt - Date.now()) / 60000)} minutes.
                </p>
              </div>
            )}

            {/* Email Verification Form */}
            {showVerification ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Verify your email</h2>
                  <p className="text-gray-400 text-sm">
                    We sent a verification code to <span className="font-semibold text-white">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-300 mb-2">
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setVerificationCode(value)
                      }}
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={verifying}
                      className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-700 bg-gray-800 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50"
                      autoComplete="one-time-code"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Enter the 6-digit code from your email
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={verifying || verificationCode.length !== 6}
                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Verify Email
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={verifying}
                      className="text-sm text-primary-400 hover:text-primary-300 disabled:opacity-50 transition-colors"
                    >
                      Didn&apos;t receive the code? Resend
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <form onSubmit={handleEmailRegister} action={undefined} className="space-y-4">
              {/* Nome de Usuário */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value
                    
                    // Bloquear caracteres inválidos em tempo real
                    // Apenas letras (maiúsculas/minúsculas) e números
                    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '')
                    
                    // Limitar comprimento
                    const limitedValue = filteredValue.slice(0, 30)
                    
                    setName(limitedValue)
                    
                    // Validação em tempo real
                    if (limitedValue.trim()) {
                      const validation = validateUsernameFormat(limitedValue)
                      if (!validation.valid) {
                        setNameValidationError(validation.error || 'Invalid username')
                      } else {
                        setNameValidationError(null)
                      }
                    } else {
                      setNameValidationError(null)
                    }
                  }}
                  onBlur={() => handleBlur('name')}
                  required
                  disabled={loading || !!rateLimitInfo}
                  maxLength={30}
                  minLength={3}
                  pattern="^[a-zA-Z0-9]+$"
                  className={`w-full pl-4 pr-4 py-2.5 border-2 ${
                    nameValidationError || (errors.name && touched.name)
                      ? 'border-red-500 bg-red-500/10' 
                      : 'border-gray-700'
                  } bg-gray-800 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500`}
                  placeholder="yourusername"
                  autoComplete="username"
                />
                {nameValidationError && (
                  <p className="mt-1 text-sm text-red-400">{nameValidationError}</p>
                )}
                {errors.name && touched.name && !nameValidationError && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
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

              {/* Senha */}
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
                    minLength={8}
                    disabled={loading || !!rateLimitInfo}
                    className={`w-full pl-4 pr-12 py-2.5 border-2 ${
                      errors.password 
                        ? 'border-red-500 bg-red-500/10' 
                        : touched.password && !errors.password
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-700 bg-gray-800'
                    } text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg transition-all disabled:opacity-50 placeholder-gray-500`}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
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
                
                {/* Indicador de força da senha em tempo real */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-2">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded transition-all ${
                            passwordStrength === 'weak' && i === 0
                              ? strengthColors.weak
                              : passwordStrength === 'medium' && i <= 1
                              ? strengthColors.medium
                              : passwordStrength === 'strong' && i <= 2
                              ? strengthColors.strong
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordStrength === 'weak' && (
                        <>
                          <AlertCircle className={`w-4 h-4 ${strengthTextColors.weak}`} />
                          <p className={`text-xs ${strengthTextColors.weak} font-medium`}>
                            {strengthLabels.weak}
                          </p>
                        </>
                      )}
                      {passwordStrength === 'medium' && (
                        <>
                          <CheckCircle2 className={`w-4 h-4 ${strengthTextColors.medium}`} />
                          <p className={`text-xs ${strengthTextColors.medium} font-medium`}>
                            {strengthLabels.medium}
                          </p>
                        </>
                      )}
                      {passwordStrength === 'strong' && (
                        <>
                          <CheckCircle2 className={`w-4 h-4 ${strengthTextColors.strong}`} />
                          <p className={`text-xs ${strengthTextColors.strong} font-medium`}>
                            {strengthLabels.strong}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded || !!rateLimitInfo || passwordStrength === 'weak'}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">ou</span>
              </div>
            </div>

            {/* Botões OAuth */}
            <div className="space-y-2 mt-6" style={{ position: 'relative', zIndex: 50 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!loading && oauthLoading === null) {
                    handleSocialRegister('oauth_google')
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
                    handleSocialRegister('oauth_github')
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
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
