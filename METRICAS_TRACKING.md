# Métricas e Tracking
## O Que Medir Desde o Dia 1

---

## 📊 MÉTRICAS OBRIGATÓRIAS

### Produto (Core Metrics)

#### 1. Tempo de Análise
- **O que**: Tempo desde upload até prompt gerado
- **Meta**: < 2 minutos
- **Como medir**: Log timestamp no início e fim
- **Onde**: Backend logs + Analytics

```typescript
// Exemplo de tracking
const startTime = Date.now()
await analyzeProject(files)
const duration = Date.now() - startTime
trackMetric('analysis_duration', duration)
```

#### 2. Taxa de Sucesso
- **O que**: % de análises que completam sem erro
- **Meta**: > 95%
- **Como medir**: (sucessos / total) * 100
- **Onde**: Backend logs

#### 3. Qualidade do Prompt
- **O que**: Usuário consegue usar o prompt?
- **Meta**: > 80% dos usuários conseguem
- **Como medir**: Feedback após uso + tracking de cópia
- **Onde**: Frontend analytics

#### 4. Stack Detectada Corretamente
- **O que**: % de projetos com stack correta
- **Meta**: > 90%
- **Como medir**: Validação manual de amostra
- **Onde**: Dashboard admin

---

### Negócio (Business Metrics)

#### 1. Uploads por Dia
- **O que**: Quantos projetos são analisados
- **Meta**: Crescimento constante
- **Como medir**: Contagem diária no banco
- **Onde**: Analytics dashboard

#### 2. Prompts Gerados
- **O que**: Total de prompts criados
- **Meta**: Crescimento com uploads
- **Como medir**: Contagem no banco
- **Onde**: Analytics dashboard

#### 3. Taxa de Execução
- **O que**: % de usuários que copiam e usam o prompt
- **Meta**: > 60%
- **Como medir**: Evento de cópia + feedback
- **Onde**: Frontend analytics

#### 4. Retenção
- **O que**: % de usuários que voltam em 7 dias
- **Meta**: > 40%
- **Como medir**: Tracking de login
- **Onde**: Analytics

---

### Técnico (Technical Metrics)

#### 1. Uptime
- **O que**: % de tempo que sistema está online
- **Meta**: > 99%
- **Como medir**: Monitoring (Vercel Analytics)
- **Onde**: Vercel Dashboard

#### 2. Tempo de Resposta (API)
- **O que**: Tempo médio de resposta das APIs
- **Meta**: < 5 segundos
- **Como medir**: Vercel Analytics
- **Onde**: Vercel Dashboard

#### 3. Taxa de Erro
- **O que**: % de requisições que falham
- **Meta**: < 1%
- **Como medir**: Error tracking (Sentry)
- **Onde**: Sentry Dashboard

---

## 🔧 IMPLEMENTAÇÃO

### 1. Event Tracking (Frontend)

```typescript
// lib/utils/analytics.ts
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // PostHog, Mixpanel, ou Google Analytics
    window.posthog?.capture(event, properties)
  }
}

// Uso
trackEvent('project_uploaded', {
  fileCount: files.length,
  totalSize: totalSize,
})

trackEvent('prompt_copied', {
  promptId: prompt.id,
  stack: prompt.stack,
})
```

### 2. Metric Logging (Backend)

```typescript
// lib/core/metrics.ts
export function logMetric(name: string, value: number, tags?: Record<string, string>) {
  logger.info('metric', {
    name,
    value,
    tags,
    timestamp: new Date().toISOString(),
  })
  
  // Enviar para serviço de métricas (DataDog, New Relic, etc)
}

// Uso
logMetric('analysis_duration', duration, {
  stack: detectedStack,
  fileCount: files.length,
})
```

### 3. Error Tracking

```typescript
// lib/core/error-tracking.ts
import * as Sentry from '@sentry/nextjs'

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  })
  
  logger.error('Error captured', {
    error: error.message,
    stack: error.stack,
    context,
  })
}
```

---

## 📈 DASHBOARD DE MÉTRICAS

### Métricas em Tempo Real
- Uploads hoje
- Prompts gerados hoje
- Taxa de sucesso (últimas 24h)
- Tempo médio de análise

### Métricas Semanais
- Uploads na semana
- Novos usuários
- Retenção
- Erros mais comuns

### Métricas Mensais
- Crescimento de uploads
- Taxa de retenção
- NPS (quando tiver usuários suficientes)
- MRR (quando tiver pagamento)

---

## 🎯 MÉTRICAS POR FASE

### Fase 1 (Fundamentos)
- ✅ Tempo de análise
- ✅ Taxa de sucesso
- ✅ Stack detectada corretamente
- ✅ Qualidade do prompt (feedback)

### Fase 2 (Inteligência)
- ✅ Precisão da análise semântica
- ✅ Padrões detectados corretamente
- ✅ Score de qualidade validado

### Fase 3 (Produto)
- ✅ MRR
- ✅ Churn
- ✅ LTV/CAC
- ✅ NPS

---

## 🚨 ALERTAS

### Críticos (Ação Imediata)
- Uptime < 99%
- Taxa de erro > 5%
- Tempo de análise > 5 minutos

### Importantes (Investigar)
- Taxa de sucesso < 90%
- Retenção < 30%
- Taxa de execução < 50%

---

## 📝 LOGGING ESTRUTURADO

```typescript
// Sempre logar com contexto
logger.info('Project analyzed', {
  userId: user.id,
  projectId: project.id,
  stack: detectedStack,
  duration: analysisDuration,
  fileCount: files.length,
  success: true,
})
```

---

**Versão**: 1.0
**Status**: Em implementação

