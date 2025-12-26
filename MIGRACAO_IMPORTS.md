# Guia de Migração de Imports

## ⚠️ IMPORTANTE: Atualize todos os imports antes de deletar os arquivos antigos!

## Script de Atualização Automática

Execute este script PowerShell para atualizar todos os imports:

```powershell
# Atualizar imports de lib/core
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '@/lib/auth', '@/lib/core/auth' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/db', '@/lib/core/database' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/logger', '@/lib/core/logger' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/rateLimiter', '@/lib/core/rate-limiter' | Set-Content $_.FullName
}

# Atualizar imports de lib/services
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '@/lib/email', '@/lib/services/email.service' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/fileAnalyzer', '@/lib/services/file-analyzer.service' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/promptGenerator', '@/lib/services/prompt-generator.service' | Set-Content $_.FullName
}

# Atualizar imports de lib/utils
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '@/lib/utils', '@/lib/utils/common' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/markdown', '@/lib/utils/markdown' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/lib/settings', '@/lib/config/settings' | Set-Content $_.FullName
}

# Atualizar imports de components
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '@/components/layout/', '@/components/shared/layout/' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/components/ui/', '@/components/shared/ui/' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/components/dashboard/', '@/components/features/dashboard/' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/components/onboarding/', '@/components/features/dashboard/' | Set-Content $_.FullName
}

# Atualizar imports de hooks
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '@/hooks/useAuth', '@/hooks/features/use-auth' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace '@/hooks/usePrompt', '@/hooks/features/use-prompt' | Set-Content $_.FullName
}

# Atualizar imports de types
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '@/types', '@/types/shared' | Set-Content $_.FullName
}
```

## Mapeamento Completo

| Antigo | Novo |
|--------|------|
| `@/lib/auth` | `@/lib/core/auth` |
| `@/lib/db` | `@/lib/core/database` |
| `@/lib/logger` | `@/lib/core/logger` |
| `@/lib/rateLimiter` | `@/lib/core/rate-limiter` |
| `@/lib/email` | `@/lib/services/email.service` |
| `@/lib/fileAnalyzer` | `@/lib/services/file-analyzer.service` |
| `@/lib/promptGenerator` | `@/lib/services/prompt-generator.service` |
| `@/lib/utils` | `@/lib/utils/common` |
| `@/lib/markdown` | `@/lib/utils/markdown` |
| `@/lib/settings` | `@/lib/config/settings` |
| `@/components/layout/*` | `@/components/shared/layout/*` |
| `@/components/ui/*` | `@/components/shared/ui/*` |
| `@/components/dashboard/*` | `@/components/features/dashboard/*` |
| `@/components/onboarding/*` | `@/components/features/dashboard/*` |
| `@/hooks/useAuth` | `@/hooks/features/use-auth` |
| `@/hooks/usePrompt` | `@/hooks/features/use-prompt` |
| `@/types` | `@/types/shared` |

## Próximos Passos

1. Execute o script acima
2. Verifique se há erros de compilação
3. Teste a aplicação
4. Delete os arquivos antigos após confirmar que tudo funciona

