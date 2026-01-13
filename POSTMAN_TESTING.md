# Guia de Teste da Waitlist API no Postman

## Configuração Inicial

### 1. Criar uma Nova Request

1. Abra o Postman
2. Clique em **New** > **HTTP Request**
3. Configure:
   - **Method**: `POST`
   - **URL**: `http://localhost:3002/api/waitlist`
   - **Headers**: Adicione `Content-Type: application/json`

### 2. Configurar Variáveis de Ambiente (Opcional mas Recomendado)

1. Clique em **Environments** (canto superior direito)
2. Clique em **+** para criar novo ambiente
3. Nome: `VozLocal Local`
4. Adicione variáveis:
   - `base_url`: `http://localhost:3002`
   - `api_endpoint`: `/api/waitlist`
5. Salve e selecione o ambiente
6. Use `{{base_url}}{{api_endpoint}}` na URL

## Casos de Teste

### ✅ Teste 1: Request Válido (Sucesso)

**URL**: `POST http://localhost:3002/api/waitlist`

**Headers**:
```
Content-Type: application/json
```

**Body** (raw JSON):
```json
{
  "email": "teste@example.com",
  "businessType": "restaurante",
  "hp": "",
  "utm": {
    "source": "google",
    "campaign": "test_campaign",
    "medium": "cpc",
    "term": "reviews",
    "content": "ad1"
  }
}
```

**Resultado Esperado**:
- Status: `200 OK`
- Body: `{ "ok": true }`
- Verificar na Brevo: Contacto criado/atualizado na lista

---

### ✅ Teste 2: Request Mínimo (Apenas Email)

**Body**:
```json
{
  "email": "minimo@example.com",
  "hp": ""
}
```

**Resultado Esperado**:
- Status: `200 OK`
- Body: `{ "ok": true }`

---

### ❌ Teste 3: Email Inválido

**Body**:
```json
{
  "email": "email-invalido",
  "hp": ""
}
```

**Resultado Esperado**:
- Status: `400 Bad Request`
- Body: `{ "error": "Invalid email" }`

---

### ❌ Teste 4: Email Faltando

**Body**:
```json
{
  "businessType": "restaurante",
  "hp": ""
}
```

**Resultado Esperado**:
- Status: `400 Bad Request`
- Body: `{ "error": "Invalid email" }`

---

### 🤖 Teste 5: Honeypot (Anti-Bot)

**Body**:
```json
{
  "email": "bot@spam.com",
  "hp": "preenchido",
  "businessType": "restaurante"
}
```

**Resultado Esperado**:
- Status: `200 OK`
- Body: `{ "ok": true }`
- **Importante**: O contacto NÃO deve ser criado na Brevo (honeypot detectado)

---

### ⚡ Teste 6: Rate Limiting

1. Execute o **Teste 1** 11 vezes seguidas (mais de 10 requests)
2. Use o botão **Send** repetidamente ou configure um runner

**Resultado Esperado** (após 10 requests):
- Status: `429 Too Many Requests`
- Body: `{ "error": "Too many requests" }`

**Nota**: O rate limit é por IP. Se testar de outro computador/IP, o limite é independente.

---

### 🔧 Teste 7: Variáveis de Ambiente Não Configuradas

**Simulação**: Remova temporariamente `BREVO_API_KEY` ou `BREVO_LIST_ID` do `.env.local`

**Body**:
```json
{
  "email": "teste@example.com",
  "hp": ""
}
```

**Resultado Esperado**:
- Status: `500 Internal Server Error`
- Body: `{ "error": "Server configuration error" }`
- Console do servidor: Log de erro sobre variáveis não configuradas

---

### 📊 Teste 8: Com Todos os Tipos de Negócio

Teste cada tipo de negócio:

```json
{
  "email": "restaurante@example.com",
  "businessType": "restaurante",
  "hp": ""
}
```

```json
{
  "email": "clinica@example.com",
  "businessType": "clinica",
  "hp": ""
}
```

```json
{
  "email": "loja@example.com",
  "businessType": "loja",
  "hp": ""
}
```

```json
{
  "email": "hotel@example.com",
  "businessType": "hotel",
  "hp": ""
}
```

```json
{
  "email": "servico@example.com",
  "businessType": "servico",
  "hp": ""
}
```

```json
{
  "email": "outro@example.com",
  "businessType": "outro",
  "hp": ""
}
```

**Resultado Esperado**: Todos devem retornar `200 OK` e o atributo `BUSINESS_TYPE` deve estar correto na Brevo.

---

### 🎯 Teste 9: UTM Parameters Completos

**Body**:
```json
{
  "email": "utm@example.com",
  "businessType": "restaurante",
  "hp": "",
  "utm": {
    "source": "facebook",
    "campaign": "summer_sale",
    "medium": "social",
    "term": "reviews management",
    "content": "video_ad"
  }
}
```

**Resultado Esperado**:
- Status: `200 OK`
- Verificar na Brevo: Todos os atributos UTM devem estar preenchidos:
  - `UTM_SOURCE`: "facebook"
  - `UTM_CAMPAIGN`: "summer_sale"
  - `UTM_MEDIUM`: "social"
  - `UTM_TERM`: "reviews management"
  - `UTM_CONTENT`: "video_ad"

---

### 🎯 Teste 10: UTM Parcial

**Body**:
```json
{
  "email": "utm-parcial@example.com",
  "hp": "",
  "utm": {
    "source": "google",
    "campaign": "test"
  }
}
```

**Resultado Esperado**:
- Status: `200 OK`
- Verificar na Brevo: Apenas `UTM_SOURCE` e `UTM_CAMPAIGN` preenchidos

---

## Collection do Postman (Importar)

Você pode criar uma Collection no Postman com todos estes testes:

1. Clique em **Collections** > **New Collection**
2. Nome: `VozLocal Waitlist API`
3. Adicione cada teste como uma nova request dentro da collection
4. Configure variáveis de ambiente para facilitar testes

## Verificações na Brevo

Após cada teste bem-sucedido, verifique na Brevo:

1. Acesse [Brevo Dashboard](https://app.brevo.com/)
2. Vá em **Contacts** > **Contacts**
3. Procure pelo email testado
4. Clique no contacto para ver os atributos:
   - `SOURCE`: Deve ser "landing"
   - `BUSINESS_TYPE`: Tipo de negócio (se fornecido)
   - `UTM_*`: Parâmetros UTM (se fornecidos)

## Troubleshooting

### Erro: "Cannot POST /api/waitlist"
- Verifique se o servidor está rodando: `npm run dev`
- Verifique se a porta está correta (3002 por padrão)
- Verifique se o arquivo `/app/api/waitlist/route.ts` existe

### Erro: "Server configuration error"
- Verifique se `.env.local` existe na raiz do projeto
- Verifique se `BREVO_API_KEY` e `BREVO_LIST_ID` estão configuradas
- Reinicie o servidor após adicionar variáveis de ambiente

### Erro: "Brevo error"
- Verifique os logs do servidor (console) para detalhes
- Verifique se a API Key da Brevo está correta
- Verifique se o `BREVO_LIST_ID` é um número válido
- Verifique se a API Key tem permissões para criar/atualizar contactos

### Rate Limit não funciona
- O rate limit é em memória e pode ser resetado em ambientes serverless
- Teste de IPs diferentes para verificar o comportamento
- Verifique os logs do servidor para ver contadores de rate limit

## Exemplo de cURL (Alternativa ao Postman)

```bash
# Teste básico
curl -X POST http://localhost:3002/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "businessType": "restaurante",
    "hp": ""
  }'

# Com UTM
curl -X POST http://localhost:3002/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "utm@example.com",
    "businessType": "restaurante",
    "hp": "",
    "utm": {
      "source": "google",
      "campaign": "test"
    }
  }'
```

