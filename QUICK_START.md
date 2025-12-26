# 🚀 Quick Start - Custom PE

Guia rápido para começar a usar o Custom PE em 5 minutos.

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/custompe?schema=public"
JWT_SECRET="seu-secret-super-seguro-aqui"
OPENAI_API_KEY="sk-sua-chave-openai"
```

### 3. Configurar Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Iniciar Servidor
```bash
npm run dev
```

Acesse: http://localhost:3000

## ✅ Checklist Mínimo

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL rodando
- [ ] Arquivo `.env` configurado
- [ ] Migrações do Prisma executadas
- [ ] OpenAI API key configurada

## 🎯 Primeiros Passos

1. **Criar Conta**
   - Acesse http://localhost:3000
   - Clique em "Criar Conta"
   - Registre-se com email e senha

2. **Acessar Dashboard**
   - Faça login
   - Você verá o dashboard com 1 crédito inicial

3. **Gerar Primeiro Prompt**
   - Faça upload de arquivos do seu projeto
   - Clique em "Gerar Superprompt"
   - Aguarde o processamento
   - Copie o prompt gerado

4. **Usar o Prompt**
   - Cole o prompt em Cursor, ChatGPT ou Claude
   - A IA recriará seu projeto automaticamente!

## 🔧 Configuração Opcional

### Stripe (Para Pagamentos)
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### NextAuth (Opcional)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-nextauth"
```

## 📚 Documentação Completa

- **README.md** - Documentação completa
- **DEPLOY.md** - Guia de deploy
- **ESTRUTURA_PROJETO.md** - Estrutura detalhada
- **EXEMPLO_SUPERPROMPT.md** - Exemplo de output

## 🐛 Problemas Comuns

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erro: "Database connection failed"
- Verifique se PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`

### Erro: "OpenAI API error"
- Verifique se `OPENAI_API_KEY` está configurada
- Confirme créditos na conta OpenAI

## 💡 Dicas

- Use `npx prisma studio` para visualizar o banco
- Adicione mais créditos editando diretamente no banco (desenvolvimento)
- Teste upload com arquivos pequenos primeiro

## 🎉 Pronto!

Agora você está pronto para usar o Custom PE! 

**Boa sorte transformando projetos em superprompts! 🚀**

