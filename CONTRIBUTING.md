# Guia de Contribuição

Obrigado por considerar contribuir com o Custom PE! Este documento fornece diretrizes para contribuir com o projeto.

## 🚀 Como Contribuir

### Reportar Bugs

Se você encontrou um bug:

1. Verifique se o bug já não foi reportado nas [Issues](../../issues)
2. Se não foi, crie uma nova issue com:
   - Título descritivo
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)
   - Ambiente (OS, navegador, versão do Node)

### Sugerir Funcionalidades

Temos ideias? Adoraríamos ouvir!

1. Verifique se a funcionalidade já não foi sugerida
2. Crie uma issue com:
   - Título descritivo
   - Descrição detalhada da funcionalidade
   - Casos de uso
   - Benefícios

### Pull Requests

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/MinhaFuncionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona MinhaFuncionalidade'`)
4. **Push para a branch** (`git push origin feature/MinhaFuncionalidade`)
5. **Abra um Pull Request**

### Padrões de Código

- Use TypeScript
- Siga o ESLint configurado
- Use Prettier para formatação
- Escreva código limpo e comentado
- Adicione testes quando possível

### Estrutura de Commits

Use mensagens de commit descritivas:

```
feat: adiciona funcionalidade X
fix: corrige bug Y
docs: atualiza documentação
style: formatação de código
refactor: refatora código
test: adiciona testes
chore: atualiza dependências
```

### Desenvolvimento

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure `.env` com as variáveis necessárias
4. Execute migrações: `npx prisma migrate dev`
5. Inicie o servidor: `npm run dev`

### Testes

Antes de fazer push:

- Execute o linter: `npm run lint`
- Verifique se não há erros de TypeScript
- Teste manualmente as funcionalidades

### Código de Conduta

- Seja respeitoso
- Aceite críticas construtivas
- Foque no que é melhor para o projeto
- Mostre empatia com outros contribuidores

## 📝 Checklist para Pull Requests

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Commits seguem o padrão
- [ ] Não há erros de lint
- [ ] Funcionalidade foi testada manualmente

## 🙏 Obrigado!

Sua contribuição é muito valiosa para o projeto!

