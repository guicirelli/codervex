/**
 * Validação completa de username (identidade pública)
 * Regras: único, minúsculo, sem espaços, permanente
 */

export interface UsernameValidationResult {
  valid: boolean
  error?: string
}

// Usernames reservados (não permitidos)
const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'root',
  'system',
  'api',
  'www',
  'mail',
  'support',
  'help',
  'about',
  'contact',
  'privacy',
  'terms',
  'legal',
  'blog',
  'news',
  'dashboard',
  'settings',
  'profile',
  'login',
  'register',
  'signup',
  'signin',
  'logout',
  'auth',
  'oauth',
  'api',
  'app',
  'web',
  'mobile',
  'desktop',
  'codervex',
  'codervexapp',
  'codervexdev',
]

// Palavras proibidas
const FORBIDDEN_WORDS = [
  'fuck',
  'shit',
  'ass',
  'bitch',
  'damn',
  // Adicione mais conforme necessário
]

/**
 * Valida formato de username
 */
export function validateUsernameFormat(username: string): UsernameValidationResult {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' }
  }

  const trimmed = username.trim()
  const lowerTrimmed = trimmed.toLowerCase()

  // Comprimento
  if (trimmed.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }

  if (trimmed.length > 30) {
    return { valid: false, error: 'Username must be at most 30 characters' }
  }

  // Apenas letras (maiúsculas e minúsculas) e números
  if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Username can only contain letters and numbers'
    }
  }

  // Não pode ter underscores/hífens consecutivos
  if (trimmed.includes('__') || trimmed.includes('--') || trimmed.includes('_-') || trimmed.includes('-_')) {
    return { valid: false, error: 'Username cannot have consecutive special characters' }
  }

  // Verificar se é reservado
  if (RESERVED_USERNAMES.includes(lowerTrimmed)) {
    return { valid: false, error: 'This username is not available' }
  }

  // Verificar palavras proibidas
  const hasForbiddenWord = FORBIDDEN_WORDS.some(word => lowerTrimmed.includes(word))
  if (hasForbiddenWord) {
    return { valid: false, error: 'Username contains forbidden words' }
  }

  // Não pode ser apenas números
  if (/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'Username cannot be only numbers' }
  }

  return { valid: true }
}

/**
 * Normaliza username (trim apenas, mantém maiúsculas/minúsculas)
 * Para comparação no banco, usa lowercase
 */
export function normalizeUsername(username: string): string {
  return username.trim()
}

/**
 * Normaliza username para comparação no banco (lowercase)
 */
export function normalizeUsernameForDB(username: string): string {
  return username.trim().toLowerCase()
}

/**
 * Gera sugestões de username baseado em nome/email
 */
export function generateUsernameSuggestions(name?: string, email?: string): string[] {
  const suggestions: string[] = []

  if (name) {
    // Nome completo
    const nameParts = name
      .toLowerCase()
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part.replace(/[^a-z0-9]/g, ''))

    if (nameParts.length >= 2) {
      // primeiro.ultimo
      suggestions.push(`${nameParts[0]}.${nameParts[nameParts.length - 1]}`)
      // primeiro_ultimo
      suggestions.push(`${nameParts[0]}_${nameParts[nameParts.length - 1]}`)
      // primeiroultimo
      suggestions.push(`${nameParts[0]}${nameParts[nameParts.length - 1]}`)
    }

    // Apenas primeiro nome
    if (nameParts[0]) {
      suggestions.push(nameParts[0])
    }
  }

  if (email) {
    // Parte antes do @
    const emailPart = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
    if (emailPart && emailPart.length >= 3) {
      suggestions.push(emailPart)
    }
  }

  // Adicionar números aleatórios se necessário
  const finalSuggestions: string[] = []
  suggestions.forEach(suggestion => {
    if (validateUsernameFormat(suggestion).valid) {
      finalSuggestions.push(suggestion)
      // Adicionar variações com números
      for (let i = 1; i <= 3; i++) {
        finalSuggestions.push(`${suggestion}${i}`)
        finalSuggestions.push(`${suggestion}${Math.floor(Math.random() * 1000)}`)
      }
    }
  })

  // Remover duplicatas e limitar
  return [...new Set(finalSuggestions)].slice(0, 6)
}

/**
 * Verifica se pode alterar username (limite de tempo)
 */
export function canChangeUsername(lastChange?: Date | null, cooldownDays: number = 30): boolean {
  if (!lastChange) {
    return true // Nunca alterou, pode alterar
  }

  const now = new Date()
  const daysSinceChange = (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24)
  
  return daysSinceChange >= cooldownDays
}

/**
 * Calcula quando pode alterar novamente
 */
export function getNextUsernameChangeDate(lastChange?: Date | null, cooldownDays: number = 30): Date | null {
  if (!lastChange) {
    return null
  }

  const nextChange = new Date(lastChange)
  nextChange.setDate(nextChange.getDate() + cooldownDays)
  
  return nextChange
}

