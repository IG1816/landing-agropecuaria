# Página de Vendas — Agropecuária

Landing page demonstrativa (single-page, scroll) construída em **React + Vite + TypeScript + Tailwind CSS**, com **login de clientes via Supabase**.

## Como rodar

```bash
npm install
npm run setup    # cria o .env (pede URL e chave do Supabase)
npm run dev
```

Ou abra **`http://localhost:5173/configurar`** — assistente visual com cópia do SQL e teste de conexão.

Abrir `http://localhost:5173`.

### Autenticação (Supabase)

1. Copie `.env.example` para `.env` (ou rode `npm run setup`).
2. Crie um projeto em [supabase.com](https://supabase.com).
3. Em **Authentication → Providers**, mantenha **Email** ativo.
4. Em **Settings → API**, copie **Project URL** e **anon public** para o `.env`.
5. Em **Authentication → URL Configuration**, adicione:
   - Site URL: `http://localhost:5173` (e a URL de produção depois)
   - Redirect URLs: `http://localhost:5173/conta`, `http://localhost:5173/login`
6. Em **SQL Editor**, execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) (tabelas de favoritos e pedidos).

**Rotas:**

| Rota | Descrição |
|------|-----------|
| `/` | Página de vendas (inalterada) |
| `/login` | Entrar |
| `/cadastro` | Criar conta |
| `/conta` | Favoritos, pedidos e perfil (requer login) |
| `/configurar` | Assistente Supabase (URL, chave, copiar SQL) |
| `/admin` | Painel da loja — ver e atualizar pedidos (requer admin) |

No menu: **Entrar** / **Minha conta**. Coração nas categorias = favoritos.

**Virar administrador:** após cadastro, execute `supabase/seed-admin.sql` no SQL Editor com seu e-mail.

## Como personalizar para cada cliente

Tudo está concentrado no topo do arquivo [`src/Landing.tsx`](src/Landing.tsx):

```ts
const WHATSAPP_NUMBER = '5500000000000'; // DDI + DDD + número, só dígitos
const WHATSAPP_MESSAGE = 'Olá! Vim pelo site...';
const BUSINESS_NAME = 'Agropecuária';
const BUSINESS_TAGLINE = 'do Campo';
const CITY_REGION = 'Sua região';
```

Basta trocar esses valores para adaptar a página para o nome, número e região do dono da agropecuária.

## Build de produção

```bash
npm run build
npm run preview
```

Os arquivos estáticos saem em `dist/` e podem ser hospedados em qualquer serviço (Vercel, Netlify, GitHub Pages, hospedagem comum etc).
