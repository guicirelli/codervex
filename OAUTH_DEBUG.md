# Debug OAuth - Clerk

## Como verificar se está funcionando:

1. **Abra o Console do Navegador (F12)**
   - Vá na aba "Console"
   - Clique em "Continue with Google" ou "Continue with GitHub"
   - Veja os logs que aparecem

2. **O que procurar nos logs:**
   - `OAuth click:` - confirma que o botão foi clicado
   - `Starting OAuth redirect for:` - confirma que o método foi chamado
   - `OAuth redirect method called successfully` - confirma que o método executou
   - Se aparecer erro, copie a mensagem completa

3. **Verificar no Clerk Dashboard:**
   - Acesse: https://dashboard.clerk.com
   - Vá em "User & Authentication" > "Social Connections"
   - Verifique se Google e GitHub estão **habilitados**
   - Verifique se as credenciais (Client ID e Secret) estão configuradas

4. **Verificar URLs de Redirect:**
   - No Clerk Dashboard, vá em "Paths"
   - Verifique se `/sso-callback` está configurado
   - Ou adicione manualmente nas configurações de OAuth

5. **Verificar variáveis de ambiente:**
   - Certifique-se de que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` está no `.env.local`
   - Certifique-se de que `CLERK_SECRET_KEY` está no `.env.local`

## Problemas comuns:

### "authenticateWithRedirect não é uma função"
- O Clerk pode não estar carregado corretamente
- Verifique se o `ClerkProvider` está envolvendo a aplicação
- Verifique se as chaves estão corretas

### Nada acontece ao clicar
- Verifique o console para erros
- Verifique se os providers OAuth estão habilitados no Clerk Dashboard
- Verifique se as URLs de redirect estão configuradas

### Erro de redirect
- Verifique se `/sso-callback` existe e está acessível
- Verifique se as URLs no Clerk Dashboard correspondem ao seu domínio

