# Estrutura Completa do Projeto Custom PE

## 📁 Árvore de Diretórios

```
custom-pe/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação
│   │   │   ├── login/            # POST - Login de usuário
│   │   │   ├── register/         # POST - Registro de usuário
│   │   │   ├── logout/           # POST - Logout
│   │   │   └── me/               # GET - Dados do usuário autenticado
│   │   ├── prompt/               # Geração de prompts
│   │   │   ├── generate/         # POST - Gerar superprompt
│   │   │   └── history/          # GET - Histórico de prompts
│   │   └── stripe/               # Pagamentos
│   │       ├── checkout/         # POST - Criar sessão de checkout
│   │       └── webhook/          # POST - Webhook do Stripe
│   ├── auth/                     # Páginas de autenticação
│   │   ├── login/                # Página de login
│   │   └── register/             # Página de registro
│   ├── dashboard/                # Dashboard do usuário
│   │   └── page.tsx              # Dashboard principal
│   ├── pricing/                  # Página de preços
│   │   └── page.tsx
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Estilos globais
│   ├── not-found.tsx             # Página 404
│   ├── error.tsx                 # Página de erro
│   └── loading.tsx               # Loading state
├── components/                   # Componentes React
│   ├── dashboard/                # Componentes do dashboard
│   │   ├── UploadForm.tsx        # Formulário de upload
│   │   ├── PromptDisplay.tsx     # Exibição de prompt
│   │   ├── PromptHistory.tsx     # Histórico de prompts
│   │   └── CreditsDisplay.tsx    # Exibição de créditos
│   └── layout/                   # Componentes de layout
│       ├── Navbar.tsx            # Barra de navegação
│       └── Footer.tsx             # Rodapé
├── lib/                          # Bibliotecas e utilitários
│   ├── auth.ts                   # Funções de autenticação JWT
│   ├── db.ts                     # Cliente Prisma
│   ├── fileAnalyzer.ts           # Análise de arquivos
│   └── promptGenerator.ts         # Geração de superprompts
├── prisma/                       # Prisma ORM
│   └── schema.prisma             # Schema do banco de dados
├── public/                       # Arquivos estáticos
├── .env.example                  # Exemplo de variáveis de ambiente
├── .eslintrc.json               # Configuração ESLint
├── .gitignore                   # Arquivos ignorados pelo Git
├── middleware.ts                # Middleware Next.js
├── next.config.js               # Configuração Next.js
├── package.json                 # Dependências e scripts
├── postcss.config.js            # Configuração PostCSS
├── tailwind.config.ts           # Configuração Tailwind
├── tsconfig.json                # Configuração TypeScript
├── README.md                    # Documentação principal
├── DEPLOY.md                    # Guia de deploy
├── ESTRUTURA_PROJETO.md         # Este arquivo
└── EXEMPLO_SUPERPROMPT.md       # Exemplo de superprompt
```

## 🔑 Arquivos Principais

### Configuração
- `package.json` - Dependências e scripts npm
- `tsconfig.json` - Configuração TypeScript
- `tailwind.config.ts` - Configuração Tailwind CSS
- `next.config.js` - Configuração Next.js
- `.env.example` - Variáveis de ambiente necessárias

### Banco de Dados
- `prisma/schema.prisma` - Schema do banco (User, Prompt, Payment)
- `lib/db.ts` - Cliente Prisma singleton

### Autenticação
- `lib/auth.ts` - Funções JWT (hash, verify, generate, verify token)
- `app/api/auth/*` - Rotas de autenticação

### Funcionalidades Core
- `lib/fileAnalyzer.ts` - Análise de arquivos e detecção de stack
- `lib/promptGenerator.ts` - Geração de superprompts com OpenAI
- `app/api/prompt/*` - Rotas de geração e histórico

### Pagamentos
- `app/api/stripe/*` - Integração com Stripe (checkout e webhook)

### UI/UX
- `app/page.tsx` - Landing page completa
- `app/dashboard/page.tsx` - Dashboard principal
- `components/dashboard/*` - Componentes do dashboard
- `components/layout/*` - Navbar e Footer

## 📊 Fluxo de Dados

### 1. Autenticação
```
Usuário → /auth/register → API /api/auth/register → Prisma → JWT → Cookie
Usuário → /auth/login → API /api/auth/login → Verifica senha → JWT → Cookie
```

### 2. Upload e Geração de Prompt
```
Dashboard → UploadForm → /api/prompt/generate
  → Verifica autenticação
  → Verifica créditos
  → Analisa arquivos (fileAnalyzer)
  → Gera superprompt (promptGenerator + OpenAI)
  → Salva no banco (Prisma)
  → Deduz crédito
  → Retorna prompt
```

### 3. Pagamento
```
Pricing → /api/stripe/checkout → Stripe Checkout
  → Usuário paga
  → Stripe webhook → /api/stripe/webhook
  → Atualiza créditos/assinatura
  → Salva pagamento no banco
```

## 🗄️ Modelos do Banco de Dados

### User
- id, email, name, password (hashed)
- credits, subscription (free/monthly)
- stripeId, createdAt, updatedAt

### Prompt
- id, userId, title, content
- projectType, stack, status
- createdAt, updatedAt

### Payment
- id, userId, stripeId
- amount, currency, status
- type (one-time/subscription)
- createdAt

## 🔐 Segurança

- Senhas hasheadas com bcrypt
- JWT com expiração de 7 dias
- Cookies httpOnly e secure
- Validação de arquivos no upload
- Verificação de autenticação em todas as rotas protegidas

## 🎨 Design System

### Cores
- Primary: #9333ea (Roxo)
- Secondary: #a855f7 (Lilás)
- Background: #f9fafb (Gray-50)
- Text: #111827 (Gray-900)

### Componentes Reutilizáveis
- `.btn-primary` - Botão primário
- `.btn-secondary` - Botão secundário
- `.card` - Card container
- `.input-field` - Campo de input

## 📦 Dependências Principais

### Front-end
- next, react, react-dom
- typescript
- tailwindcss
- react-dropzone
- lucide-react (ícones)
- react-hot-toast (notificações)

### Back-end
- @prisma/client
- bcryptjs
- jsonwebtoken
- openai
- stripe
- jszip

## 🚀 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento local
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter
```

## 📝 Próximos Passos

1. Configurar variáveis de ambiente
2. Configurar banco de dados PostgreSQL
3. Executar migrações: `npx prisma migrate dev`
4. Configurar OpenAI API key
5. Configurar Stripe (opcional para desenvolvimento)
6. Executar: `npm run dev`

---

**Estrutura completa e pronta para desenvolvimento! 🎉**

