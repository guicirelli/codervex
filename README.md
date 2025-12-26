# Codervex

Codervex is a personal SaaS case study focused on understanding complex software systems.

## Purpose

This project was built to demonstrate:
- SaaS architecture design
- AI integration with real constraints
- Clean front-end structure
- System-level reasoning

## What Codervex Does

- Analyzes project structure
- Infers architecture and responsibilities
- Generates a structured system overview
- Produces AI-ready contextual output

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Backend:** API-based architecture, async processing
- **Database:** PostgreSQL with Prisma ORM
- **Infrastructure:** Stripe-ready SaaS structure

## Status

This project is a portfolio case study and not a commercial product.

## Author

Guilherme Cirelli Lopes

---

## 🎯 O Problema Real

**"Estou lidando com um sistema que funciona, mas não entendo totalmente."**

Isso gera:
- Medo de refatorar
- Onboarding lento
- Retrabalho
- Dependência de quem escreveu
- Bugs difíceis de explicar
- Clientes insatisfeitos

👉 **Esse problema custa dinheiro. Muito.**

---

## ✅ O Que Codervex Entrega

### 1️⃣ Clareza
- O sistema deixa de ser um mistério
- Arquitetura real, não a ideal
- Regras que não estão escritas

### 2️⃣ Segurança
- Você sabe o que não pode quebrar
- Menos refactors errados
- Menos decisões às cegas

### 3️⃣ Velocidade Responsável
- Onboarding rápido
- Uso de IA com contexto real
- Execução sem destruir o sistema

---

## 📦 Artefato de Entendimento do Sistema (AES)

Codervex não entrega "respostas".  
Ele entrega um **Artefato de Entendimento do Sistema (AES)**.

### O Artefato contém:
- Visão geral do sistema
- Arquitetura inferida
- Fluxos principais
- Decisões técnicas críticas
- Restrições implícitas
- Componentes-chave
- Stack real detectada
- Contexto pronto para IA

### Isso vira:
- Base para refatoração
- Onboarding
- Documentação viva
- Superprompt confiável

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ShadCN/UI** (preparado)
- **TanStack Query** (preparado)
- **Zustand** (preparado)

### Backend
- **Next.js API Routes**
- **Node.js**
- **PostgreSQL + Prisma ORM**

### IA / Engine
- **Parser próprio** (AST)
- **Camada semântica**
- **LLM (OpenAI)** - Apenas no final do pipeline

### Infraestrutura
- **Vercel** (frontend + API)
- **AWS S3** (upload temporário)
- **Stripe** (pagamentos)

---

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn
- PostgreSQL instalado e rodando
- Conta OpenAI com API key
- Conta Stripe (para pagamentos)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/codervex.git
cd codervex
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/codervex?schema=public"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui"

# OpenAI
OPENAI_API_KEY="sua-chave-openai-aqui"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configure o banco de dados

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## 📁 Estrutura do Projeto

```
codervex/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── analyze/        # Análise de projetos
│   │   ├── auth/           # Autenticação
│   │   └── prompt/         # Geração de prompts
│   ├── dashboard/          # Dashboard do usuário
│   └── auth/               # Páginas de autenticação
│
├── lib/
│   ├── core/              # Core utilities
│   │   ├── database.ts
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │   └── metrics.ts
│   │
│   ├── services/          # Business logic
│   │   ├── ingestion/     # Camada 1: Ingestão
│   │   │   ├── parser.service.ts
│   │   │   ├── stack-detector.service.ts
│   │   │   └── structure-mapper.service.ts
│   │   └── prompt/        # Geração de prompts
│   │       └── simple-generator.service.ts
│   │
│   └── utils/             # Utilities
│       └── analytics.ts
│
├── components/
│   ├── shared/            # Componentes compartilhados
│   └── features/         # Features específicas
│
└── prisma/
    └── schema.prisma     # Schema do banco
```

---

## 🎯 Casos de Uso

1. **"Preciso refatorar sem quebrar"**
2. **"Vou assumir esse projeto e preciso entender rápido"**
3. **"Cliente quer refazer um sistema existente"**
4. **"Quero usar IA sem gerar código burro"**
5. **"Preciso documentar um sistema que ninguém entende mais"**

---

## 🧠 Posicionamento

### Codervex não compete com:
- ❌ ChatGPT
- ❌ Copilot
- ❌ Cursor

**Ele alimenta essas ferramentas com contexto real.**

### Codervex não escreve código por você.
**Ele garante que o código escrito faça sentido.**

---

## 📊 Fases de Desenvolvimento

### 🔹 Fase 1: Fundamentos (30-45 dias)
- Upload funcional
- Parser básico
- Detecção de stack
- Prompt simples mas útil

### 🔹 Fase 2: Inteligência (60-90 dias)
- Análise semântica
- Identificação de padrões
- Diagnóstico técnico

### 🔹 Fase 3: Produto (90-180 dias)
- Prompt modular
- Sistema de aprendizado
- Workers assíncronos

---

## 📝 Documentação

- `CODERVEX_DEFINICAO.md` - Definição completa do produto
- `ARQUITETURA_TECNICA.md` - Arquitetura técnica detalhada
- `FASE_1_FUNDAMENTOS.md` - Plano da Fase 1
- `BRANDING_CODERVEX.md` - Guidelines de branding
- `METRICAS_TRACKING.md` - Sistema de métricas
- `REGRAS_PRODUTO.md` - Regras para não virar projeto morto

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros

Veja `DEPLOY.md` para instruções detalhadas.

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 🤝 Contribuindo

Este é um projeto privado. Contribuições não são aceitas no momento.

---

## 📧 Contato

Para mais informações, consulte a documentação interna.

---

**Codervex exists because guessing software is expensive.  
Understanding it should be systematic.**
