# DEPLOY.md — Atlantis (Vercel)

> Por que produção está em 500 hoje: o site em `main` roda o código antigo, que
> consulta o banco **perdido** (tabela `FISH` etc.) no `getServerSideProps` de
> `/newAquarium` → erro de SSR → 500. A branch `feat/atlantis-revival` aponta para o
> schema novo e corrige isso.

## 1. Variáveis de ambiente na Vercel (Project → Settings → Environment Variables)

Adicionar (Production + Preview):

| Variável | Valor | Exposição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ungafoolmedlexptatbd.supabase.co` | pública (browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a publishable key (`sb_publishable_...`) | pública (browser) |
| `GEMINI_API_KEY` | (se usar geração de imagem) | só servidor |

> O app usa apenas sessão + RLS (não há chave de serviço / bypass de RLS).

**Remover** as antigas: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_API_KEY` e a `SUPABASE_SERVICE_ROLE_KEY` (o código novo não lê nenhuma delas; ficam órfãs).

## 2. Banco (já feito)

As migrations do Atlantis **já foram aplicadas** no projeto remoto `ungafoolmedlexptatbd`
(de forma escopada — ver `supabase/README.md`). É um **banco compartilhado**; não rode
`supabase db reset`. Para reaplicar em outro ambiente: `supabase link` + `supabase db push`.

## 3. Build

- `npm ci` (lockfile já inclui o vitest; `yarn.lock` removido — gerenciador único npm).
- `prebuild` roda `scripts/build-fallback.mjs` e gera `public/fallback/species.json` (snapshot p/ degradação graciosa — F13).
- `npm run build` (Next 13, Pages Router).

## 4. O que funciona vs. pendente nesta branch (estado atual)

✅ Funciona: home, **planejador `/newAquarium`** (lê o banco novo + cálculo de compatibilidade correto), login/registro/logout (Supabase Auth), **Meus Aquários** (salvar/listar/abrir, sob RLS do dono), detalhe de espécie `/fish/[id]`.

⚠️ Ainda pendente (lotes seguintes): listagem `/fish` e catálogos `/food`,`/substrate` (ainda via rotas `/api/*` antigas — F10), perfil público (F11), área do especialista criar/editar espécie (F12), modo demo offline (F13), upgrade Next 14 (F14), remoção do MUI v4 (F15).

> Mesmo com os itens ⚠️ pendentes, subir esta branch **resolve o 500** e restaura o fluxo principal.

## 5. Passos

1. Setar as env vars (item 1).
2. Merge `feat/atlantis-revival` → `main` (ou apontar a Vercel para a branch / abrir Preview Deploy).
3. Deploy. Validar: `/` carrega, `/newAquarium` lista espécies e calcula, login funciona, salvar aquário persiste.
