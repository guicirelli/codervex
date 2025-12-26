# Guia de Deploy - Custom PE

Este guia fornece instruções detalhadas para fazer deploy do Custom PE em produção.

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

A Vercel é a plataforma ideal para projetos Next.js, oferecendo deploy automático e otimizações nativas.

#### Passo a Passo:

1. **Instalar Vercel CLI**
```bash
npm i -g vercel
```

2. **Login na Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configurar Variáveis de Ambiente**

No dashboard da Vercel, adicione todas as variáveis do `.env`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `JWT_SECRET`

5. **Configurar Banco de Dados**

**Opção A: Vercel Postgres**
- No dashboard da Vercel, vá em Storage
- Crie um novo banco PostgreSQL
- Copie a `DATABASE_URL` gerada
- Execute migrações: `npx prisma migrate deploy`

**Opção B: Banco Externo**
- Use Supabase, Railway, ou outro provedor
- Configure a `DATABASE_URL` nas variáveis de ambiente

6. **Configurar Webhook do Stripe**

- No dashboard do Stripe, vá em Developers > Webhooks
- Adicione endpoint: `https://seu-dominio.vercel.app/api/stripe/webhook`
- Selecione eventos:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
- Copie o `Signing secret` e adicione como `STRIPE_WEBHOOK_SECRET`

### 2. Netlify

1. **Instalar Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Deploy**
```bash
netlify deploy --prod
```

4. **Configurar Build Settings**

No `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. Railway

1. Conecte seu repositório GitHub
2. Railway detecta automaticamente Next.js
3. Configure variáveis de ambiente
4. Adicione PostgreSQL addon
5. Execute migrações: `npx prisma migrate deploy`

### 4. Docker (Qualquer Plataforma)

1. **Criar Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build e Run**
```bash
docker build -t custom-pe .
docker run -p 3000:3000 --env-file .env custom-pe
```

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco de dados criado e acessível
- [ ] Migrações do Prisma executadas
- [ ] API keys configuradas (OpenAI, Stripe)
- [ ] Webhook do Stripe configurado
- [ ] Domínio configurado (se aplicável)
- [ ] SSL/HTTPS habilitado

### Após o Deploy

- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Testar upload de arquivos
- [ ] Testar geração de prompt
- [ ] Testar checkout do Stripe
- [ ] Verificar webhook do Stripe
- [ ] Testar em diferentes dispositivos
- [ ] Verificar performance

## 🔒 Segurança em Produção

1. **Variáveis de Ambiente**
   - Nunca commite arquivos `.env`
   - Use variáveis de ambiente do provedor
   - Rotacione secrets regularmente

2. **HTTPS**
   - Sempre use HTTPS em produção
   - Configure redirect HTTP → HTTPS

3. **Rate Limiting**
   - Adicione rate limiting nas APIs
   - Use serviços como Upstash Redis

4. **Validação**
   - Valide todos os inputs
   - Sanitize dados do usuário

5. **Monitoramento**
   - Configure logs (Vercel Analytics, Sentry)
   - Monitore erros e performance

## 🗄️ Banco de Dados

### Migrações em Produção

```bash
# Gerar migração
npx prisma migrate dev --name nome-da-migracao

# Aplicar em produção
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate
```

### Backup

Configure backups regulares do banco de dados:
- **Vercel Postgres**: Backups automáticos
- **Supabase**: Backups diários incluídos
- **Railway**: Configure backups manuais

## 📊 Monitoramento

### Vercel Analytics
- Ative no dashboard da Vercel
- Monitore performance e erros

### Sentry (Opcional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## 🔄 CI/CD

### GitHub Actions (Exemplo)

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Erro: "Database connection failed"
- Verifique `DATABASE_URL`
- Confirme que o banco está acessível
- Verifique firewall/whitelist de IPs

### Erro: "OpenAI API error"
- Verifique `OPENAI_API_KEY`
- Confirme créditos na conta OpenAI
- Verifique rate limits

### Erro: "Stripe webhook failed"
- Verifique `STRIPE_WEBHOOK_SECRET`
- Confirme URL do webhook no Stripe
- Verifique logs do webhook

## 📞 Suporte

Para problemas de deploy, consulte:
- [Documentação Next.js](https://nextjs.org/docs/deployment)
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Prisma](https://www.prisma.io/docs/guides/deployment)

---

**Boa sorte com o deploy! 🚀**

