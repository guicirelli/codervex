# CustomPE - Arquitetura Técnica
## Stack e Organização de Produto Sério

---

## 🧱 STACK TÉCNICA FINAL

### Frontend
- **Next.js 14+** (App Router) - Framework principal
- **TypeScript** - Type safety obrigatório
- **Tailwind CSS** - Estilização
- **ShadCN/UI** - Componentes base (substituir componentes custom)
- **TanStack Query** - Data fetching e cache
- **Zustand** - Estado global (quando necessário)
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

### Backend
- **Next.js API Routes** - Início (serverless)
- **Node.js** - Runtime
- **Workers assíncronos** - Fila de processamento (futuro)
- **Separação de backend** - Quando escalar (Node.js + Express/Fastify)

### IA / Engine
- **Parser próprio** - Análise de código
- **AST (Abstract Syntax Tree)** - @babel/parser, @typescript-eslint/parser
- **Camada semântica** - Interpretação estruturada
- **LLM (OpenAI)** - Apenas no FINAL do pipeline, para enriquecimento

**Regra**: IA não pensa sozinha. Ela só interpreta o que estruturarmos.

### Infraestrutura
- **Vercel** - Frontend + API (serverless)
- **AWS S3** - Upload temporário de arquivos
- **PostgreSQL** - Banco de dados (via Prisma)
- **Stripe** - Pagamentos
- **GitHub OAuth** - Autenticação social (futuro)

### Observabilidade
- **Vercel Analytics** - Métricas básicas
- **Sentry** - Error tracking
- **PostHog** - Analytics e feature flags (futuro)

---

## 🏗️ ARQUITETURA DE PRODUTO

```
┌─────────────────┐
│      User       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Upload Project │
│  (Frontend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Ingestion Engine│ ← Parser + Normalização
│  (Isolated)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Semantic Analyzer│ ← AST + Pattern Detection
│  (Isolated)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Intent Engine  │ ← Business Logic
│  (Isolated)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Prompt Orchestrator│ ← Assembly
│  (Isolated)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Execution     │ ← Cursor / IA
│  (External)     │
└─────────────────┘
```

### Princípios Arquiteturais

1. **Isolamento de Camadas**
   - Cada camada é independente
   - Pode evoluir sem quebrar outras
   - Testável isoladamente

2. **IA como Ferramenta, Não Cérebro**
   - Lógica de negócio em código
   - IA apenas enriquece no final
   - Pode trocar IA sem refazer tudo

3. **Escalabilidade Horizontal**
   - Workers assíncronos para processamento pesado
   - Queue system (Bull/BullMQ)
   - Cache inteligente

---

## 📋 ORGANIZAÇÃO DO TRABALHO

### 🔹 FASE 1: FUNDAMENTOS (30-45 dias)

**Objetivo**: Valor mínimo real - "Subi um projeto e entendi tudo em minutos"

#### Entregas Obrigatórias
- [ ] Upload de arquivos/ZIP funcional
- [ ] Parser básico (detecta arquivos, estrutura)
- [ ] Detecção de stack (package.json, imports)
- [ ] Normalização de estrutura
- [ ] Prompt simples mas útil
- [ ] Exibição clara do resultado

#### Não Entra Nesta Fase
- ❌ Análise semântica profunda
- ❌ Engine de intenção
- ❌ Prompts modulares
- ❌ Diagnóstico técnico
- ❌ Pagamento
- ❌ Histórico complexo

#### Critério de Sucesso
✅ Usuário faz upload → Recebe prompt útil → Consegue usar no Cursor

---

### 🔹 FASE 2: INTELIGÊNCIA (60-90 dias)

**Objetivo**: Diferencial técnico real

#### Entregas
- [ ] Parser AST (TypeScript, JavaScript)
- [ ] Análise semântica (padrões, responsabilidades)
- [ ] Mapeamento de fluxos
- [ ] Detecção de padrões arquiteturais
- [ ] Diagnóstico técnico básico
- [ ] Score de qualidade

#### Não Entra Nesta Fase
- ❌ Prompts modulares
- ❌ Engine de intenção completa
- ❌ Sistema de aprendizado
- ❌ API pública

#### Critério de Sucesso
✅ Análise detecta padrões reais → Usuário confia no diagnóstico

---

### 🔹 FASE 3: PRODUTO (90-180 dias)

**Objetivo**: Negócio funcional

#### Entregas
- [ ] Engine de intenção completa
- [ ] Prompts modulares
- [ ] Sistema de histórico
- [ ] Pagamento integrado
- [ ] UX refinada
- [ ] Configurações
- [ ] Workers assíncronos

#### Critério de Sucesso
✅ Usuários pagam → Retêm → Recomendam

---

## 🚫 REGRAS PARA NÃO VIRAR PROJETO MORTO

### 1. Não Tentar Agradar Todo Mundo
- Foco: Freelancers e devs web
- Stack: JavaScript/TypeScript primeiro
- Features: Uma de cada vez

### 2. Não Adicionar Feature por Ego
- Toda feature precisa de validação
- Métricas antes de código
- Remover se não usar

### 3. Não Focar Só em IA
- IA é ferramenta, não produto
- Lógica de negócio em código
- IA enriquece, não decide

### 4. Não Ignorar UX
- Se não entender em 10s, perdeu
- Uma ação principal clara
- Feedback constante

### 5. Não Pular Validação
- Testar com usuários reais
- Medir tudo
- Iterar baseado em dados

---

## 📊 MÉTRICAS OBRIGATÓRIAS

### Desde o Dia 1

#### Produto
- **Tempo de análise** (deve ser < 2 min)
- **Taxa de sucesso** (análise completa sem erro)
- **Qualidade do prompt** (usuário consegue usar?)

#### Negócio
- **Uploads por dia**
- **Prompts gerados**
- **Taxa de execução** (usuário copia e usa?)
- **Retenção** (volta em 7 dias?)

#### Técnico
- **Uptime** (deve ser > 99%)
- **Tempo de resposta** (API < 5s)
- **Taxa de erro** (< 1%)

### Quando Tiver Pagamento
- **MRR** (Monthly Recurring Revenue)
- **Churn** (< 5% mensal)
- **LTV/CAC** (> 3:1)
- **NPS** (> 50)

---

## 🎯 PRIMEIRA ENTREGA REAL

### O Que Deve Funcionar
```
1. Usuário faz upload de projeto (ZIP ou arquivos)
2. Sistema detecta stack básica
3. Sistema identifica estrutura (páginas, componentes)
4. Sistema gera prompt útil
5. Usuário copia e usa no Cursor
6. Funciona ✅
```

### O Que NÃO Precisa Funcionar Ainda
- Análise profunda
- Diagnóstico técnico
- Prompts modulares
- Histórico complexo
- Pagamento

### Critério de Validação
**"Subi um projeto e em minutos entendi tudo."**

Se isso não acontecer, nada mais importa.

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### Estrutura de Pastas (Refatorada)

```
/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── upload/        # Upload de arquivos
│   │   ├── analyze/       # Análise de projeto
│   │   └── prompt/        # Geração de prompt
│   ├── dashboard/         # Dashboard do usuário
│   └── auth/              # Autenticação
│
├── lib/
│   ├── core/              # Core utilities
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   └── logger.ts
│   │
│   ├── services/          # Business logic
│   │   ├── ingestion/     # Camada 1: Ingestão
│   │   ├── parser/        # Parser AST
│   │   ├── semantic/      # Camada 2: Semântica
│   │   ├── intent/        # Camada 3: Intenção
│   │   ├── reconstruction/# Camada 4: Reconstrução
│   │   └── orchestrator/  # Camada 5: Orquestração
│   │
│   ├── ai/                # IA (isolada)
│   │   └── llm.ts         # Wrapper OpenAI
│   │
│   └── utils/             # Utilities
│
├── components/
│   ├── shared/            # Componentes compartilhados
│   └── features/          # Features específicas
│
└── types/                 # TypeScript types
```

### Regras de Código

1. **TypeScript Strict Mode**
   - `strict: true` sempre
   - Sem `any` explícito
   - Types bem definidos

2. **Testes**
   - Unit tests para lógica de negócio
   - Integration tests para APIs
   - E2E para fluxos críticos

3. **Error Handling**
   - Try/catch em tudo
   - Logs estruturados
   - Mensagens claras para usuário

4. **Performance**
   - Lazy loading
   - Code splitting
   - Cache inteligente

---

## ⚠️ VERDADE FINAL

Você escolheu o caminho:
- ✅ Mais difícil
- ✅ Mais lento
- ✅ Mais solitário

Mas também:
- ✅ Mais valioso
- ✅ Mais defensável
- ✅ Mais respeitado

**Pouca gente aguenta esse caminho.**

---

**Versão**: 1.0
**Status**: Em implementação
**Última atualização**: 2024

