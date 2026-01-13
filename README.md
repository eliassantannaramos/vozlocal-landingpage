# VozLocal Landing Page

Landing page do VozLocal construída com Next.js, TypeScript e Tailwind CSS.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3002](http://localhost:3002) no navegador para ver o resultado.

**Nota:** A landing page roda na porta 3002 para não conflitar com:
- Frontend (vozlocal-front): porta 3000
- Backend (vozlocal-back): porta 3001

## Estrutura

- `/app` - Páginas e rotas (App Router)
- `/components` - Componentes React reutilizáveis
- `/public` - Arquivos estáticos (imagens, etc.)

## Scripts

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint

