# Configuração da Waitlist com Brevo

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
BREVO_API_KEY=sua_api_key_aqui
BREVO_LIST_ID=id_da_lista_aqui
```

**Nota:** O arquivo `.env.local` já está no `.gitignore` e não será commitado.

## Como obter as credenciais da Brevo

1. Acesse [Brevo Dashboard](https://app.brevo.com/)
2. Vá em **Settings** > **API Keys**
3. Crie uma nova API Key ou use uma existente
4. Copie a API Key para `BREVO_API_KEY`
5. Vá em **Contacts** > **Lists**
6. Crie uma lista ou use uma existente
7. Copie o ID da lista (número) para `BREVO_LIST_ID`

## Testando localmente

1. Configure as variáveis de ambiente no `.env.local`
2. Inicie o servidor de desenvolvimento: `npm run dev`
3. Teste o endpoint com Postman ou curl:

```bash
curl -X POST http://localhost:3002/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "businessType": "restaurante",
    "hp": "",
    "utm": {
      "source": "google",
      "campaign": "test"
    }
  }'
```

## Segurança

- ✅ API Key nunca exposta no frontend
- ✅ Honeypot anti-bot implementado
- ✅ Rate limiting (10 requests por 10 minutos por IP)
- ✅ Validação de email server-side
- ✅ Tratamento de erros adequado

## Estrutura do Payload

```typescript
{
  email: string;              // Obrigatório
  businessType?: string;      // Opcional
  hp?: string;                // Honeypot (sempre vazio)
  utm?: {                     // Opcional
    source?: string;
    campaign?: string;
    medium?: string;
    term?: string;
    content?: string;
  }
}
```

## Atributos salvos na Brevo

- `SOURCE`: Sempre "landing"
- `BUSINESS_TYPE`: Tipo de negócio (se fornecido)
- `UTM_SOURCE`, `UTM_CAMPAIGN`, `UTM_MEDIUM`, `UTM_TERM`, `UTM_CONTENT`: Parâmetros UTM (se fornecidos)

