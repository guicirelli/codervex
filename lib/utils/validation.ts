/**
 * Validações completas para autenticação
 * Cobre todos os casos de erro possíveis
 */

// Domínios de email temporários conhecidos
const TEMP_EMAIL_DOMAINS = [
  'tempmail.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
  'mohmal.com',
  'yopmail.com',
]

// Senhas comuns que devem ser rejeitadas
const COMMON_PASSWORDS = [
  'password',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'abc123',
  'password123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  '1234567',
  'sunshine',
  'princess',
  'dragon',
  'passw0rd',
  'master',
]

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' }
  }

  const trimmedEmail = email.trim()
  
  // Verificar espaços
  if (email !== trimmedEmail) {
    return { valid: false, error: 'Email cannot contain leading or trailing spaces' }
  }

  // Verificar formato básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Invalid email format. Please enter a valid email address (e.g., user@example.com)' }
  }

  // Verificar se tem @
  if (!trimmedEmail.includes('@')) {
    return { valid: false, error: 'Email must contain @ symbol' }
  }

  // Verificar domínio
  const parts = trimmedEmail.split('@')
  if (parts.length !== 2 || !parts[1] || !parts[1].includes('.')) {
    return { valid: false, error: 'Invalid email domain. Email must have a valid domain (e.g., example.com)' }
  }

  // Verificar comprimento
  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email is too long. Maximum length is 254 characters' }
  }

  // Verificar caracteres inválidos
  const invalidChars = /[<>\"'\\]/
  if (invalidChars.test(trimmedEmail)) {
    return { valid: false, error: 'Email contains invalid characters. Please remove special characters like < > " \' \\' }
  }

  // Verificar domínio temporário
  const domain = parts[1].toLowerCase()
  if (TEMP_EMAIL_DOMAINS.some(temp => domain.includes(temp))) {
    return { valid: false, error: 'Temporary email addresses are not allowed. Please use a permanent email address' }
  }

  return { valid: true }
}

/**
 * Classifica força da senha: 'weak' | 'medium' | 'strong'
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password || password.length === 0) {
    return 'weak'
  }

  // Comprimento mínimo
  if (password.length < 8) {
    return 'weak'
  }

  // Verificar componentes
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  // Verificar se é apenas letras ou apenas números
  const onlyLetters = /^[a-zA-Z]+$/.test(password)
  const onlyNumbers = /^\d+$/.test(password)

  // Senha fraca: menos de 8 OU apenas letras OU apenas números OU sem número e sem símbolo
  if (password.length < 8 || onlyLetters || onlyNumbers || (!hasNumber && !hasSpecial)) {
    return 'weak'
  }

  // Senha forte: tem maiúscula + minúscula + número + símbolo
  if (hasUpperCase && hasLowerCase && hasNumber && hasSpecial) {
    return 'strong'
  }

  // Senha média: 8+ caracteres, tem letra e número (não exige símbolo nem maiúscula/minúscula)
  if (hasLetter && hasNumber) {
    return 'medium'
  }

  // Se não atender nenhum critério, é fraca
  return 'weak'
}

/**
 * Valida força da senha (aceita apenas média ou forte)
 */
export function validatePassword(password: string, email?: string): ValidationResult {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' }
  }

  // Comprimento máximo
  if (password.length > 128) {
    return { valid: false, error: 'Password is too long. Maximum length is 128 characters' }
  }

  // Verificar espaços
  if (password.includes(' ')) {
    return { valid: false, error: 'Password cannot contain spaces' }
  }

  // Verificar se é senha comum
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    return { valid: false, error: 'This password is too common and easily guessed. Please choose a more secure password' }
  }

  // Verificar se senha é igual ao email
  if (email && password.toLowerCase() === email.toLowerCase()) {
    return { valid: false, error: 'Password cannot be the same as your email address' }
  }

  // Verificar força (só aceita média ou forte)
  const strength = getPasswordStrength(password)
  
  if (strength === 'weak') {
    return {
      valid: false,
      error: 'Password is too weak. Use at least 8 characters with both letters and numbers. Add uppercase, lowercase, and symbols for a stronger password'
    }
  }

  return { valid: true }
}

/**
 * Valida confirmação de senha (mantido para compatibilidade, mas não usado mais)
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword || confirmPassword.length === 0) {
    return { valid: false, error: 'Password confirmation is required' }
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match. Please make sure both passwords are identical' }
  }

  return { valid: true }
}

/**
 * Normaliza email (remove espaços, converte para lowercase)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Sanitiza entrada para prevenir XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500) // Limite de comprimento
}

import { validateUsernameFormat } from './username-validation'

/**
 * Valida nome de usuário (obrigatório)
 * Usa a validação completa de username
 */
export function validateName(name: string | undefined): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Username is required' }
  }

  // Usar validação completa de username
  return validateUsernameFormat(name)
}

/**
 * Validação completa do formulário de registro
 */
export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  name?: string
}

export function validateRegisterForm(data: RegisterFormData): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Validar email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.valid) {
    errors.email = emailValidation.error || 'Invalid email address'
  }

  // Validar senha
  const passwordValidation = validatePassword(data.password, data.email)
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.error || 'Invalid password'
  }

  // Confirmação de senha removida - não é mais necessária

  // Validar nome de usuário (obrigatório)
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Username is required'
  } else {
    const nameValidation = validateName(data.name)
    if (!nameValidation.valid) {
      errors.name = nameValidation.error || 'Invalid username'
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validação completa do formulário de login
 */
export interface LoginFormData {
  email: string
  password: string
}

export function validateLoginForm(data: LoginFormData): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Validar email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.valid) {
    errors.email = emailValidation.error || 'Invalid email address'
  }

  // Validar senha (apenas se não estiver vazia)
  if (!data.password || data.password.length === 0) {
    errors.password = 'Password is required'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

