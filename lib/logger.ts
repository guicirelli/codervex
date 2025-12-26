type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    }

    if (this.isDevelopment) {
      const colors = {
        info: '\x1b[36m', // Cyan
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[90m', // Gray
      }
      const reset = '\x1b[0m'
      
      console.log(
        `${colors[level]}[${level.toUpperCase()}]${reset} ${entry.timestamp} - ${message}`,
        metadata || ''
      )
    } else {
      // Em produção, você pode enviar para um serviço de logging
      // Ex: Sentry, LogRocket, etc.
      if (level === 'error') {
        console.error(JSON.stringify(entry))
      } else {
        console.log(JSON.stringify(entry))
      }
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata)
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata)
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata)
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, metadata)
    }
  }
}

export const logger = new Logger()

