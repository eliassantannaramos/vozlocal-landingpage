# Troubleshooting: Variáveis de Ambiente não Carregadas

## Problema
Erro: `[Waitlist API] BREVO_API_KEY ou BREVO_LIST_ID não configuradas`

## Soluções

### 1. ✅ Reiniciar o Servidor Next.js

**IMPORTANTE**: O Next.js só carrega variáveis de ambiente na inicialização. Após criar ou modificar `.env.local`, você **DEVE** reiniciar o servidor.

1. Pare o servidor (Ctrl+C no terminal)
2. Inicie novamente: `npm run dev`
3. Teste novamente no Postman

### 2. ✅ Verificar Formato do `.env.local`

O arquivo deve estar na **raiz do projeto** (`vozlocal-landingpage/.env.local`) e ter este formato:

```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_LIST_ID=123
```

**Importante**:
- ❌ **NÃO** use aspas: `BREVO_API_KEY="xkeysib-..."` (errado)
- ✅ **SEM** aspas: `BREVO_API_KEY=xkeysib-...` (correto)
- ❌ **NÃO** tenha espaços antes ou depois do `=`
- ✅ **SEM** espaços: `BREVO_API_KEY=valor` (correto)
- ❌ **NÃO** use `NEXT_PUBLIC_` prefix (não queremos expor no frontend)

### 3. ✅ Verificar Localização do Arquivo

O arquivo deve estar em:
```
vozlocal-landingpage/
  ├── .env.local          ← AQUI
  ├── app/
  ├── package.json
  └── ...
```

**NÃO** deve estar em:
- `vozlocal-landingpage/app/.env.local` ❌
- `vozlocal-landingpage/.env` ❌ (deve ser `.env.local`)

### 4. ✅ Verificar Nomes das Variáveis

Os nomes devem ser **exatamente**:
- `BREVO_API_KEY` (não `BREVO_API_KEY_` ou `BREVOAPIKEY`)
- `BREVO_LIST_ID` (não `BREVO_LISTID` ou `BREVO_LIST`)

### 5. ✅ Testar se as Variáveis Estão Sendo Carregadas

Adicione temporariamente um log no código para debug:

No arquivo `/app/api/waitlist/route.ts`, adicione antes da verificação:

```typescript
console.log('[DEBUG] BREVO_API_KEY existe?', !!process.env.BREVO_API_KEY);
console.log('[DEBUG] BREVO_LIST_ID existe?', !!process.env.BREVO_LIST_ID);
console.log('[DEBUG] BREVO_LIST_ID valor:', process.env.BREVO_LIST_ID);
```

**Não commite este código de debug!** Remova após testar.

### 6. ✅ Verificar se o Servidor Está Lendo o Arquivo

No terminal onde o servidor está rodando, você deve ver algo como:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3002
- Environments: .env.local
```

Se não aparecer `- Environments: .env.local`, o arquivo não está sendo lido.

### 7. ✅ Verificar Permissões do Arquivo

Certifique-se de que o arquivo tem permissões de leitura:

```bash
chmod 644 .env.local
```

### 8. ✅ Verificar Conteúdo do Arquivo

Abra o arquivo e verifique:
- Não há espaços extras no início/fim das linhas
- Não há linhas em branco com espaços
- Cada variável está em uma linha separada
- Não há caracteres especiais invisíveis

### 9. ✅ Exemplo Correto Completo

```env
BREVO_API_KEY=xkeysib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
BREVO_LIST_ID=5
```

### 10. ✅ Se Nada Funcionar

1. Pare o servidor completamente
2. Delete o arquivo `.env.local`
3. Crie novamente com o formato correto
4. Reinicie o servidor
5. Teste novamente

## Checklist Rápido

- [ ] Arquivo `.env.local` existe na raiz do projeto
- [ ] Formato correto (sem aspas, sem espaços)
- [ ] Nomes das variáveis corretos (`BREVO_API_KEY`, `BREVO_LIST_ID`)
- [ ] Servidor reiniciado após criar/modificar o arquivo
- [ ] Valores preenchidos (não vazios)
- [ ] Terminal mostra `- Environments: .env.local`

## Teste Rápido

Após seguir os passos acima, teste no Postman:

```json
{
  "email": "teste@example.com",
  "hp": ""
}
```

Se ainda der erro, verifique os logs do servidor para ver se as variáveis estão sendo lidas.

