/**
 * Analytics e Tracking
 * 
 * Sistema de métricas desde o dia 1.
 * Medir tudo que importa.
 */

type EventProperties = Record<string, any>

class Analytics {
  private enabled: boolean

  constructor() {
    this.enabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
  }

  /**
   * Track event
   */
  track(event: string, properties?: EventProperties) {
    if (!this.enabled) {
      console.log('[Analytics]', event, properties)
      return
    }

    // TODO: Integrar com PostHog, Mixpanel, ou Google Analytics
    // Por enquanto, apenas log
    if (typeof window !== 'undefined') {
      // window.posthog?.capture(event, properties)
      console.log('[Analytics]', event, properties)
    }
  }

  /**
   * Track metric (número)
   */
  metric(name: string, value: number, tags?: EventProperties) {
    if (!this.enabled) {
      console.log('[Metric]', name, value, tags)
      return
    }

    // TODO: Enviar para serviço de métricas (DataDog, New Relic)
    console.log('[Metric]', name, value, tags)
  }

  /**
   * Track error
   */
  error(error: Error, context?: EventProperties) {
    console.error('[Error]', error, context)
    
    // TODO: Enviar para Sentry
    // Sentry.captureException(error, { extra: context })
  }
}

export const analytics = new Analytics()

// Eventos principais
export const events = {
  // Upload
  PROJECT_UPLOADED: 'project_uploaded',
  UPLOAD_FAILED: 'upload_failed',
  
  // Análise
  ANALYSIS_STARTED: 'analysis_started',
  ANALYSIS_COMPLETED: 'analysis_completed',
  ANALYSIS_FAILED: 'analysis_failed',
  
  // Prompt
  PROMPT_GENERATED: 'prompt_generated',
  PROMPT_COPIED: 'prompt_copied',
  PROMPT_EXPORTED: 'prompt_exported',
  
  // Usuário
  USER_REGISTERED: 'user_registered',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  
  // Pagamento
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
} as const

