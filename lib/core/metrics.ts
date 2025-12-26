/**
 * Métricas do Backend
 * 
 * Logging estruturado de métricas para análise.
 */

import { logger } from './logger'

export interface Metric {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp: string
}

/**
 * Log metric
 */
export function logMetric(name: string, value: number, tags?: Record<string, string>) {
  const metric: Metric = {
    name,
    value,
    tags,
    timestamp: new Date().toISOString(),
  }

  logger.info('metric', metric)

  // TODO: Enviar para serviço de métricas (DataDog, New Relic, etc)
  // metricsClient.record(metric)
}

/**
 * Track analysis duration
 */
export function trackAnalysisDuration(
  duration: number,
  metadata?: {
    stack?: string
    fileCount?: number
    projectType?: string
    success?: boolean
  }
) {
  logMetric('analysis_duration_ms', duration, {
    stack: metadata?.stack || 'unknown',
    fileCount: String(metadata?.fileCount || 0),
    projectType: metadata?.projectType || 'unknown',
    success: String(metadata?.success ?? true),
  })
}

/**
 * Track analysis success rate
 */
export function trackAnalysisResult(success: boolean, error?: string) {
  logMetric('analysis_result', success ? 1 : 0, {
    success: String(success),
    error: error || 'none',
  })
}

/**
 * Track stack detection accuracy
 */
export function trackStackDetection(detected: string[], actual?: string[]) {
  // Se tiver actual, calcular precisão
  if (actual) {
    const correct = detected.filter(s => actual.includes(s)).length
    const precision = (correct / Math.max(detected.length, actual.length)) * 100
    logMetric('stack_detection_precision', precision, {
      detected: detected.join(','),
      actual: actual.join(','),
    })
  } else {
    logMetric('stack_detected', 1, {
      stack: detected.join(','),
    })
  }
}

