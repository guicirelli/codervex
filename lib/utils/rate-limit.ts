/**
 * Rate limiting simples em memória
 * Para produção, considere usar Redis ou serviço externo
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Limpar entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Limpar a cada minuto

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  blocked?: boolean
  blockUntil?: number
}

/**
 * Verifica rate limit por IP
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  const blockKey = `blocked:${identifier}`

  // Verificar se está bloqueado
  const blockEntry = rateLimitStore.get(blockKey)
  if (blockEntry && blockEntry.resetAt > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: blockEntry.resetAt,
      blocked: true,
      blockUntil: blockEntry.resetAt,
    }
  }

  // Remover bloqueio se expirou
  if (blockEntry && blockEntry.resetAt <= now) {
    rateLimitStore.delete(blockKey)
  }

  // Verificar rate limit atual
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    // Nova janela
    const resetAt = now + config.windowMs
    rateLimitStore.set(key, {
      count: 1,
      resetAt,
    })

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetAt,
    }
  }

  // Dentro da janela atual
  if (entry.count >= config.maxAttempts) {
    // Bloquear se excedeu
    if (config.blockDurationMs) {
      const blockUntil = now + config.blockDurationMs
      rateLimitStore.set(blockKey, {
        count: 0,
        resetAt: blockUntil,
      })
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      blocked: config.blockDurationMs ? true : false,
      blockUntil: config.blockDurationMs ? now + config.blockDurationMs : undefined,
    }
  }

  // Incrementar contador
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Obtém IP do request
 */
export function getClientIP(request: Request): string {
  // Tentar vários headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback
  return 'unknown'
}

/**
 * Configurações padrão de rate limit
 */
export const RATE_LIMIT_CONFIGS = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // Bloquear por 30 minutos após exceder
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 60 * 60 * 1000, // Bloquear por 1 hora
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
  },
} as const

