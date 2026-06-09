# AUDIT.md — Fragmento 1 (baseline e auditoria)

> Sessão de auditoria. Nenhuma lógica de aplicação foi alterada neste fragmento.
> Branch: `feat/atlantis-revival`. Data: 2026-06-09.

## Baseline de build

`npm run build` → **FALHA (exit 1)**, mas por um único motivo esperado:

- `info - Compiled successfully` — **os tipos TypeScript compilam** (TS 4.9). Não há erro de tipos.
- Falha em *Collecting page data* (`/food/[id]`): **`Error: Missing env.SUPABASE_URL`**.
- Causa raiz: [supabaseClient.ts](supabaseClient.ts) exige `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_API_KEY` (nomes **antigos**), mas o `.env.local` já foi renomeado para `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`. **É exatamente o trabalho do Fragmento 4.**
- Ruído de ambiente (não-bloqueante): `ESLint: EPERM ... .next\cache\eslint` (lock de arquivo do OneDrive no Windows) e `Browserslist: caniuse-lite is outdated`.
- `info - Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc"` — confirma o ponto do F14 (o `.babelrc` desliga o SWC).

## Versões e gerenciador

| Item | Valor real |
|---|---|
| next | **13.0.5** (Pages Router) |
| react / react-dom | 18.2.0 |
| typescript | **4.9.3** |
| eslint-config-next | 13.0.5 |
| Gerenciador | ⚠ **AMBOS** `package-lock.json` **e** `yarn.lock` presentes (F14 unifica em npm) |

## Uso real das libs de UI (grep em `src/`)

| Lib | Arquivos que importam | Nota |
|---|---|---|
| `@material-ui/core` (MUI **v4**) | **0 arquivos** | **Dependência morta** → remoção trivial no F15 |
| `@mui/material` \| `@mui/lab` \| `@mui/icons-material` \| `@mui/styles` (v5) | `src/components/inputs/InputRange.tsx` | Único uso direto encontrado |
| `styled-components` / `@emotion` / `@heroicons` | 11 arquivos (CardFish, InputRange, SidebarMenu, UserBar, CardMessage, PrimaryButton, SecondaryButton, TertiaryButton, menuLayout, AquariumCube, Rotate) | Maioria são `@heroicons`; confirmar `@emotion`/`styled-components` no F15 antes de remover |

> Conclusão p/ F15: remover `@material-ui/core` é seguro (sem uso). `@mui/*` v5 só aparece em 1 componente. Reavaliar `@emotion`/`styled-components` após detalhar imports.

## Fórmulas em `src/utils/aquariumControler.tsx` (P1 / P2)

- `calculateFilter(v) = v * 5` ✅ (confirmado, linha 61-63)
- `calculateThermostat(v) = v` (×1) ✅ (linha 65-67)
- `calculateVolume` = `reduce(volumeFirst + (quantity-1)*volumeAdditional)` ✅ (linha 69-82)
- **Bug P2 CONFIRMADO**:
  - `calculateWidth` (linha 156): pega **menor min** e **maior max** → isso é **UNIÃO**, não interseção.
  - `calculateHeight` (linha 174): pega menor min (linha 181) e, na linha 184, usa `fish.aquariumHeight[1] < height[1]` → pega **menor max**. Inconsistente com a largura.
  - Padronizar ambos como **interseção** `[max(mins), min(maxs)]` no F6.
- `calculateTemperature/Ph/Salinity/Dgh` já fazem interseção `[max(min), min(max)]` ✅ (mas com defaults mágicos `[0,90]`, `[0,14]`, etc. — mover p/ domínio no F6).

## Enums em `src/utils/constants.tsx`

- `USER_ROLE` = AQUARIST 1 / SPECIALIST 2 / ADMINISTRATOR 3 (numérico) → vira enum textual `user_role` no schema novo.
- `AQUARIUM_POSITION` = TOP 1 / MIDDLE 2 / BOTTOM 3 (numérico) → vira `fish_position` textual `fundo/meio/superficie` (**P10**).
- `SUBSTRATE` = 0..6 ✅ (bate com seed).
- `FOOD` = 0..5 ✅ (bate com seed).
- `TEMPERAMENT` = 0..7 (enum único) → vira **dois** enums `temperament_same` / `temperament_others` (**P5**). Mapa de migração:
  - 0 PEACEFUL → same=`pacifico`; 1 TERRITORIAL → same=`territorial`; 2 TO_FEMALES → same=`territorial_femeas`; 3 TO_MALES → same=`territorial_machos`.
  - 4 PEACEFUL_OTHERS → others=`pacifico`; 5 TERRITORIAL_OTHERS → others=`territorial`; 6 AGGRESSIVE_TO_SMALLER → others=`agressivo_menores`; 7 AGGRESSIVE_TO_LARGER → others=`agressivo_maiores`.
- `ALERT_MESSAGE_CODE` = WARNING 0 / DANGER 1 / SUCCESS 2 ✅ (bate com `AlertCode` do contrato).

## Montagem do `next-auth` / auth atual

- `next-auth` só aparece em [_app.tsx](src/pages/_app.tsx) como `<SessionProvider>` **vazio** — **não há rota `pages/api/auth/[...nextauth].ts`**. É vestigial.
- A auth real **já usa Supabase Auth**: [api/auth.ts](src/pages/api/auth.ts) chama `supabaseAuth.auth.signInWithPassword` / `.signUp` / `.signOut` (cliente **service-role** `supabaseAuth`), envolto em cookie próprio `atlantis_token` (nookies) + [services/getToken.ts](src/services/getToken.ts).
- [AuthContext.tsx](src/contexts/AuthContext.tsx) usa `recoverUserInformation()` via `/api/user`; estado `user: any`.
- Dados de usuário hoje vão para uma tabela `users` **numérica** (`user_id`, `role_id`) — ver `services/user.ts`. O schema novo usa `profiles` (uuid = `auth.uid()`, `role` enum) criado por trigger.
- **F5 é mais limpeza que migração**: remover `next-auth` + cookie caseiro, usar `supabase.auth` no browser com `onAuthStateChange`, ler `role` de `profiles`.

## SVG (F14)

- `.babelrc` = `presets: ["next/babel"]`, `plugins: ["inline-react-svg"]` → **desliga o SWC** (confirmado no log de build).
- [next.config.js](next.config.js) **também** tem regra `@svgr/webpack` para `*.svg`. Ou seja, **duas** soluções de SVG coexistem (redundante). F14 mantém só o SVGR e remove `.babelrc` + `babel-plugin-inline-react-svg`.

## Typo confirmado (P11)

- Existe `src/pages/fish/newFish/steps/bahavior.tsx` (deveria ser `behavior.tsx`). Correção no F13.

## Banco compartilhado (descoberta crítica desta sessão)

O projeto Supabase do `.env.local` (`ungafoolmedlexptatbd`) **é compartilhado** com outro sistema (um app de mapa/jogo):

- Tabelas de outro sistema: `public.player_state`, `public.mapa_config`, `public.mapa_plano`.
- Funções de outro sistema: `mapa_save`, `mapa_load`, `mapa_change_pass`, `touch_updated_at`.
- `auth.users` está **vazio** (0 usuários) e **sem triggers** → o outro sistema **não usa Supabase Auth** (usa esquema de senha via funções `mapa_*`).
- **Zero colisão** com os objetos do Atlantis: nenhum enum, nenhuma tabela/função/trigger com os nomes do Atlantis existe.

### Decisão (divergência necessária do plano)

O Fragmento 2 do plano previa `supabase db reset` (local). **Proibido aqui**: `db reset` apagaria as tabelas do outro sistema. Em vez disso:

- As migrations `supabase/migrations/000{1,2,3}.sql` são aplicadas **escopadas** (só objetos Atlantis, nomeados explicitamente) **diretamente no projeto remoto** via tooling Supabase.
- A função genérica de `updated_at` chama-se `set_updated_at()` (não `touch_updated_at`) para não colidir com a do outro sistema.
- O trigger `handle_new_user` em `auth.users` é seguro (sem usuários/triggers prévios; outro sistema não usa Auth).

## Divergências CLAUDE.md ↔ repo real

1. **Auth**: CLAUDE.md §2 lista "Atual = next-auth". Na prática o `next-auth` é vestigial (só `SessionProvider`); a auth já roda sobre `supabase.auth`. Ajuste de leitura — o F5 continua válido (limpa o vestígio e move a sessão para o browser + RLS).
2. **Banco novo dedicado** (§4) vs. **banco compartilhado** (realidade): ver seção acima. Migrations escopadas, sem `db reset`.
3. **`src/utils/types.tsx`**: o domínio antigo usa `food` (singular) em `Fish`, `position`/`temperamentSame`/`temperamentOthers` como `number`, e `User` com `user_id`/`role_id` numéricos. O contrato novo (§5) usa `foods`, enums textuais e `Profile` com `id` uuid. Mapeamento fica no F6/F7 (mappers).
4. **SVG redundante**: o repo tem `.babelrc`(inline-react-svg) **e** `@svgr/webpack` no `next.config.js` ao mesmo tempo. CLAUDE.md §2 trata só do `.babelrc`. F14 remove o babel e mantém o SVGR.

Nenhuma mudança de comportamento foi feita neste fragmento (apenas criação de `AUDIT.md` e dos arquivos de migration versionados, ainda não aplicados ao banco).
