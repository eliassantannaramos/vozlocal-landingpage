# Setup do Projeto Landing Page

## Passos para completar a configuração:

### 1. Instalar dependências
```bash
cd vozlocal-landingpage
npm install
```

### 2. Inicializar Git (se ainda não foi feito)
```bash
git init
git add .
git commit -m "Initial commit: Next.js landing page setup"
```

### 3. Conectar ao repositório remoto
```bash
# Adicione o remote do seu repositório Git
git remote add origin <URL_DO_SEU_REPOSITORIO>
git branch -M main
git push -u origin main
```

### 4. Executar o projeto
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3002`

**Portas utilizadas:**
- Frontend (vozlocal-front): `3000`
- Backend (vozlocal-back): `3001`
- Landing Page (vozlocal-landingpage): `3002`

## Estrutura criada:

- ✅ `package.json` - Dependências e scripts
- ✅ `tsconfig.json` - Configuração TypeScript
- ✅ `next.config.ts` - Configuração Next.js
- ✅ `app/layout.tsx` - Layout raiz
- ✅ `app/page.tsx` - Página inicial
- ✅ `app/globals.css` - Estilos globais com Tailwind
- ✅ `.gitignore` - Arquivos ignorados pelo Git
- ✅ `.eslintrc.json` - Configuração ESLint

## Próximos passos:

1. Instalar dependências: `npm install`
2. Inicializar Git: `git init`
3. Criar componentes da landing page em `/components`
4. Adicionar imagens e assets em `/public`

