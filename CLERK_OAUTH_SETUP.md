# Configuração OAuth no Clerk Dashboard

## ✅ Chaves Configuradas

As chaves do Clerk já foram configuradas no arquivo `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ✅
- `CLERK_SECRET_KEY` ✅

## 🔧 Configurar OAuth no Clerk Dashboard

### 1. Acesse o Clerk Dashboard
- URL: https://dashboard.clerk.com
- Faça login com sua conta

### 2. Selecione sua Aplicação
- Selecione a aplicação que você acabou de criar

### 3. Habilitar Google OAuth

1. Vá em **"User & Authentication"** > **"Social Connections"**
2. Encontre **"Google"** na lista
3. Clique em **"Configure"** ou **"Enable"**
4. Você tem duas opções:

   **Opção A: Usar credenciais do Clerk (Recomendado para desenvolvimento)**
   - Marque "Use Clerk's development keys"
   - Isso permite testar sem configurar credenciais próprias

   **Opção B: Usar suas próprias credenciais (Recomendado para produção)**
   - Vá em https://console.cloud.google.com/
   - Crie um projeto ou selecione um existente
   - Vá em "APIs & Services" > "Credentials"
   - Crie um "OAuth 2.0 Client ID"
   - Configure as URLs de redirect:
     - Development: `http://localhost:3000/sso-callback`
     - Production: `https://seudominio.com/sso-callback`
   - Copie o Client ID e Client Secret
   - Cole no Clerk Dashboard

### 4. Habilitar GitHub OAuth

1. Vá em **"User & Authentication"** > **"Social Connections"**
2. Encontre **"GitHub"** na lista
3. Clique em **"Configure"** ou **"Enable"**
4. Você tem duas opções:

   **Opção A: Usar credenciais do Clerk (Recomendado para desenvolvimento)**
   - Marque "Use Clerk's development keys"
   - Isso permite testar sem configurar credenciais próprias

   **Opção B: Usar suas próprias credenciais (Recomendado para produção)**
   - Vá em https://github.com/settings/developers
   - Clique em "New OAuth App"
   - Preencha:
     - Application name: Codervex (ou o nome que preferir)
     - Homepage URL: `http://localhost:3000` (dev) ou seu domínio (prod)
     - Authorization callback URL: `http://localhost:3000/sso-callback` (dev) ou `https://seudominio.com/sso-callback` (prod)
   - Clique em "Register application"
   - Copie o Client ID
   - Gere um Client Secret
   - Cole no Clerk Dashboard

### 5. Configurar URLs de Redirect

1. No Clerk Dashboard, vá em **"Paths"** ou **"Redirect URLs"**
2. Adicione as seguintes URLs:
   - Development: `http://localhost:3000/sso-callback`
   - Production: `https://seudominio.com/sso-callback`

### 6. Reiniciar o Servidor

Após configurar tudo, reinicie o servidor de desenvolvimento:

```bash
# Pare o servidor (Ctrl+C)
# Limpe o cache
npm run clean:win
# Ou no Windows PowerShell:
if (Test-Path .next) { Remove-Item -Recurse -Force .next }

# Inicie novamente
npm run dev
```

## 🧪 Testar OAuth

1. Acesse `http://localhost:3000/auth/login`
2. Clique em "Continue with Google" ou "Continue with GitHub"
3. Você deve ser redirecionado para o provedor OAuth
4. Após autenticar, será redirecionado de volta para `/dashboard`

## ⚠️ Troubleshooting

### "OAuth method not available"
- Verifique se Google/GitHub estão habilitados no Clerk Dashboard
- Verifique se as chaves estão corretas no `.env.local`
- Reinicie o servidor após alterar `.env.local`

### "Redirect URL mismatch"
- Verifique se as URLs no Clerk Dashboard correspondem exatamente às URLs usadas
- Certifique-se de que `/sso-callback` está acessível

### Nada acontece ao clicar
- Abra o Console do navegador (F12)
- Verifique se há erros
- Verifique se os logs aparecem quando clica nos botões

## 📝 Notas Importantes

- **Development keys do Clerk**: Funcionam apenas em `localhost:3000`
- **Production**: Você precisará configurar suas próprias credenciais OAuth
- **URLs de redirect**: Devem corresponder exatamente (incluindo http/https, porta, etc)
- **Cache**: Sempre limpe o cache após alterar configurações do Clerk

