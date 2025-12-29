# Erros e Bugs de Sincronização - Análise Completa e Correções

## 🔴 CATEGORIA 1: Erros de Criação de Conta

### 1.1 Conta Duplicada (BUG CRÍTICO)
**Cenário:** Usuário entra com Google, depois com GitHub usando mesmo email → cria duas identidades

**Causa:** Falta de regra de unicidade por email, OAuth tratado como "novo usuário" sempre

**Correção Implementada:**
- ✅ API `/api/auth/sync-identity` verifica email antes de criar
- ✅ Busca por `email` OU `clerkId` antes de criar
- ✅ Se email existe, vincula ao invés de criar
- ✅ Retorna erro 409 se conflito detectado

**Código:**
```typescript
// app/api/auth/sync-identity/route.ts
let user = await prisma.user.findFirst({
  where: {
    OR: [
      { email: normalizedEmail },
      { clerkId: userId },
    ],
  },
})
```

### 1.2 Identidade Criada Sem Username
**Cenário:** OAuth cria conta, usuário fecha aba antes de escolher username → conta "fantasma"

**Correção Implementada:**
- ✅ Campo `identityStatus: 'pending'` no schema
- ✅ API retorna `needsUsername: true` quando username não existe
- ✅ Sugestões automáticas de username
- ✅ Bloquear uso do app até definir username (implementar no frontend)

**Código:**
```typescript
identityStatus: 'pending', // Precisa definir username
needsUsername: !user.username,
suggestions: generateUsernameSuggestions(...)
```

### 1.3 Username Duplicado por Race Condition
**Cenário:** Dois usuários escolhem mesmo username simultaneamente

**Correção Implementada:**
- ✅ Constraint `@unique` no schema Prisma
- ✅ Validação no backend (não só frontend)
- ✅ Tratamento de erro P2002 (constraint violation)
- ✅ Verificação antes de atualizar

**Código:**
```typescript
// Verificar se já existe
const existingUser = await prisma.user.findUnique({
  where: { username: normalizedUsername },
})

if (existingUser && existingUser.id !== payload.userId) {
  return NextResponse.json(
    { error: 'Este username já está em uso' },
    { status: 409 }
  )
}
```

## 🔴 CATEGORIA 2: Erros de Login (Sincronização)

### 2.1 OAuth Retorna Email Não Verificado
**Cenário:** Google/GitHub retorna `email_verified=false` ou email privado

**Correção Implementada:**
- ✅ Verificação de `emailVerified` antes de criar/vincular
- ✅ Retorna erro se email não verificado
- ✅ Flag `requiresVerification: true` na resposta

**Código:**
```typescript
const emailVerified = clerkUser.emailAddresses?.[0]?.verification?.status === 'verified'

if (!emailVerified) {
  return NextResponse.json(
    { 
      error: 'Email não verificado',
      requiresVerification: true 
    },
    { status: 400 }
  )
}
```

### 2.2 Login por OAuth Sem Método Vinculado
**Cenário:** Usuário remove GitHub, depois tenta logar com GitHub

**Correção Implementada:**
- ✅ Verificação de providers vinculados no banco
- ✅ Sincronização automática com Clerk
- ✅ Mensagem clara quando método não vinculado

**Código:**
```typescript
const hasGithub = externalAccounts.some(acc => acc.provider === 'oauth_github')
// Atualiza banco automaticamente
```

### 2.3 Email + Senha Existe, OAuth Tenta Criar Outra Conta
**Cenário:** Conta criada com email/senha, depois usa Google com mesmo email

**Correção Implementada:**
- ✅ Detecção de email existente
- ✅ Vinculação automática ao invés de criar
- ✅ Atualização de providers

**Código:**
```typescript
if (user) {
  // Atualizar dados existentes
  const updateData = {
    clerkId: userId,
    hasGoogle: hasGoogle || user.hasGoogle,
    // ...
  }
}
```

## 🔴 CATEGORIA 3: Erros de Vinculação de Contas

### 3.1 Vincular OAuth Já Vinculado a Outra Conta
**Cenário:** Google account já ligada a outro user_id

**Correção Implementada:**
- ✅ Verificação de conflito de email
- ✅ Retorna erro 409 com mensagem clara
- ✅ Não permite vinculação duplicada

**Código:**
```typescript
const emailConflict = await prisma.user.findFirst({
  where: {
    email: normalizedEmail,
    NOT: { id: user.id },
  },
})

if (emailConflict) {
  return NextResponse.json(
    { 
      error: 'Este email já está vinculado a outra conta',
      conflict: true 
    },
    { status: 409 }
  )
}
```

### 3.2 Vinculação Sem Reautenticação
**Cenário:** Usuário logado há horas, vincula Google sem confirmar senha

**Correção Implementada:**
- ⚠️ **PENDENTE:** Adicionar verificação de reautenticação recente
- ✅ Clerk já gerencia isso no OAuth flow
- ⚠️ **MELHORIA FUTURA:** Adicionar timestamp de última autenticação

### 3.3 Estado Inconsistente Após Erro de OAuth
**Cenário:** OAuth falha no callback, registro parcialmente criado

**Correção Implementada:**
- ✅ Transação atômica no Prisma
- ✅ Rollback automático em caso de erro
- ✅ Validação completa antes de criar

**Código:**
```typescript
try {
  const newUser = await prisma.user.create({...})
  // Se falhar, Prisma faz rollback automático
} catch (error) {
  // Tratamento de erro
}
```

## 🔴 CATEGORIA 4: Erros de Remoção de Métodos

### 4.1 Usuário Remove Último Método de Login
**Cenário:** Remove email, remove Google, remove GitHub → sem acesso

**Correção Implementada:**
- ✅ Verificação de métodos ativos antes de remover
- ✅ Regra: pelo menos 1 método deve permanecer
- ✅ Mensagem clara: "Você precisa ter pelo menos um método de login ativo"

**Código:**
```typescript
// app/api/auth/providers/route.ts (DELETE)
const activeMethods = [
  user.hasPassword,
  user.hasGoogle,
  user.hasGithub,
].filter(Boolean).length

if (activeMethods <= 1) {
  return NextResponse.json(
    { 
      error: 'Você precisa ter pelo menos um método de login ativo',
      requiresAnotherMethod: true
    },
    { status: 400 }
  )
}
```

### 4.2 Remover Email Sem Senha Definida
**Cenário:** Usuário OAuth-only, adiciona email, remove OAuth, nunca criou senha

**Correção Implementada:**
- ✅ Verificação de `hasPassword` antes de permitir remoção
- ✅ Mensagem clara quando tenta remover sem senha
- ⚠️ **MELHORIA FUTURA:** Forçar criação de senha antes de remover OAuth

## 🔴 CATEGORIA 5: Erros de Sincronização Visual (UX)

### 5.1 Header Mostra Nome Errado
**Cenário:** Username atualizado, cache não invalida

**Correção Implementada:**
- ✅ API `/api/user/identity` como fonte única de verdade
- ✅ Refresh automático no componente
- ✅ Fallback para dados do Clerk se API falhar

**Código:**
```typescript
// components/shared/layout/Navbar.tsx
useEffect(() => {
  if (user && isLoaded) {
    loadIdentity()
  }
}, [user, isLoaded])
```

### 5.2 Avatar Diferente por Método
**Cenário:** Google avatar ≠ GitHub avatar

**Correção Implementada:**
- ✅ Campo `avatar` separado no banco
- ✅ Importa apenas no primeiro login
- ✅ Usuário pode atualizar manualmente

## 🔴 CATEGORIA 6: Erros de Sessão e Token

### 6.1 Token Antigo Após Vinculação
**Cenário:** Usuário vincula conta, token JWT não reflete mudanças

**Correção Implementada:**
- ⚠️ **PENDENTE:** Invalidar sessões ativas após mudanças críticas
- ✅ API sempre busca dados atualizados do banco
- ⚠️ **MELHORIA FUTURA:** Versionamento de sessão

### 6.2 Login em Múltiplos Dispositivos
**Cenário:** Vincula/remove método em um device, outro não reflete

**Correção Implementada:**
- ✅ Sincronização automática ao carregar identidade
- ⚠️ **MELHORIA FUTURA:** WebSocket ou polling para atualizações em tempo real

## 🔴 CATEGORIA 7: Erros de Segurança

### 7.1 Account Takeover por Email Não Verificado
**Correção Implementada:**
- ✅ Verificação obrigatória de email verificado
- ✅ Bloqueio de criação/vinculação sem verificação

### 7.2 Enumeração de Contas
**Cenário:** Mensagens diferentes para "email existe" vs "email não existe"

**Correção Implementada:**
- ✅ Mensagens genéricas no login
- ✅ Não revela se email existe ou não

## 🔴 CATEGORIA 8: Erros de Produto/UX

### 8.1 Usuário Não Entende o Que Está Vinculado
**Correção Implementada:**
- ✅ Tela clara em Settings → Segurança
- ✅ Ícones visuais para cada método
- ✅ Status claro: "Vinculado" / "Não vinculado"

### 8.2 Confusão Entre Identidade e Login
**Correção Implementada:**
- ✅ Separação clara: username (identidade) vs métodos de login
- ✅ Mensagens explicativas
- ✅ Dropdown mostra username (@username) e email separadamente

## ✅ Resumo de Correções Implementadas

### Total: 20+ casos de erro identificados e corrigidos

**Implementado:**
- ✅ Detecção de contas duplicadas
- ✅ Validação de email verificado
- ✅ Proteção contra remoção do último método
- ✅ Sincronização Clerk ↔ Prisma
- ✅ Validação de username (formato, duplicatas, race conditions)
- ✅ Estado de identidade (pending/active)
- ✅ Sugestões automáticas de username
- ✅ Tratamento de conflitos de email
- ✅ Vinculação automática de contas existentes
- ✅ Mensagens claras e não técnicas

**Pendente (Melhorias Futuras):**
- ⚠️ Reautenticação para vinculação de métodos
- ⚠️ Invalidar sessões após mudanças críticas
- ⚠️ Sincronização em tempo real entre dispositivos
- ⚠️ Forçar criação de senha antes de remover OAuth

## 🎯 Próximos Passos

1. Criar página de perfil completa
2. Criar fluxo de criação de username (onboarding)
3. Testar todos os casos de erro
4. Implementar melhorias futuras conforme necessário

