# Estrutura Reorganizada do Projeto

## Nova Estrutura de Pastas

```
custom-pe/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   ├── auth/                     # Páginas de autenticação
│   ├── dashboard/                # Páginas do dashboard
│   └── ...
├── components/
│   ├── features/                 # Componentes por feature
│   │   └── dashboard/           # Componentes do dashboard
│   └── shared/                   # Componentes compartilhados
│       ├── layout/              # Layout components (Navbar, Footer)
│       └── ui/                   # UI components (Button, Modal, etc)
├── lib/
│   ├── core/                     # Core utilities
│   │   ├── auth.ts              # Autenticação
│   │   ├── database.ts          # Prisma client
│   │   ├── logger.ts            # Sistema de logs
│   │   └── rate-limiter.ts      # Rate limiting
│   ├── services/                 # Business logic services
│   │   ├── email.service.ts     # Serviço de email
│   │   ├── file-analyzer.service.ts  # Análise de arquivos
│   │   └── prompt-generator.service.ts # Geração de prompts
│   ├── utils/                    # Utility functions
│   │   ├── common.ts            # Funções comuns
│   │   └── markdown.ts          # Processamento de markdown
│   └── config/                   # Configurações
│       └── settings.ts          # Configurações do site
├── hooks/
│   └── features/                 # Custom hooks por feature
│       ├── use-auth.ts
│       └── use-prompt.ts
├── types/
│   └── shared/                   # Tipos compartilhados
│       └── index.ts
├── config/                      # Arquivos de configuração
│   ├── next.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── postcss.config.js
└── ...
```

## Mapeamento de Imports Antigos → Novos

### Lib Core
- `@/lib/auth` → `@/lib/core/auth`
- `@/lib/db` → `@/lib/core/database`
- `@/lib/logger` → `@/lib/core/logger`
- `@/lib/rateLimiter` → `@/lib/core/rate-limiter`

### Lib Services
- `@/lib/email` → `@/lib/services/email.service`
- `@/lib/fileAnalyzer` → `@/lib/services/file-analyzer.service`
- `@/lib/promptGenerator` → `@/lib/services/prompt-generator.service`

### Lib Utils
- `@/lib/utils` → `@/lib/utils/common`
- `@/lib/markdown` → `@/lib/utils/markdown`
- `@/lib/settings` → `@/lib/config/settings`

### Components
- `@/components/layout/*` → `@/components/shared/layout/*`
- `@/components/ui/*` → `@/components/shared/ui/*`
- `@/components/dashboard/*` → `@/components/features/dashboard/*`
- `@/components/onboarding/*` → `@/components/features/dashboard/*`

### Hooks
- `@/hooks/useAuth` → `@/hooks/features/use-auth`
- `@/hooks/usePrompt` → `@/hooks/features/use-prompt`

### Types
- `@/types` → `@/types/shared`

## Convenções de Nomenclatura

### Pastas
- **kebab-case** para pastas (ex: `file-analyzer`, `use-auth`)
- **PascalCase** para componentes React
- **camelCase** para utilitários e funções

### Arquivos
- **kebab-case** para arquivos de serviço (ex: `email.service.ts`)
- **PascalCase** para componentes (ex: `Navbar.tsx`)
- **camelCase** para hooks (ex: `use-auth.ts`)

## Benefícios da Nova Estrutura

1. **Organização por Domínio**: Separação clara entre core, services, utils
2. **Escalabilidade**: Fácil adicionar novas features sem poluir a estrutura
3. **Manutenibilidade**: Localização rápida de arquivos relacionados
4. **Consistência**: Nomenclaturas padronizadas em todo o projeto
5. **Separação de Concerns**: Features isoladas, componentes compartilhados separados

