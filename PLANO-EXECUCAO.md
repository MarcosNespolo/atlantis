# Atlantis — Plano de execução fragmentado

> Companheiro do `CLAUDE.md` (fundação: tese, stack, schema, contratos, fórmulas).
> Cada **Fragmento** abaixo é um prompt **pronto para colar** numa sessão isolada e barata do Claude Code (Opus 4.8), com acesso total ao repo. Execute **na ordem**. Cada um termina com `npm run build` verde + verificação. Não exceda o escopo do fragmento.
> Repo: https://github.com/MarcosNespolo/atlantis — atualização **in-place** sobre banco Supabase **novo**.

---

## PREMISSAS / decisões assumidas — revise e corrija antes de rodar

| # | Premissa | Impacto se errada |
|---|---|---|
| **P1** | `filter = volume×5` (turnover 5×/h) e `termostato = volume×1` (1 W/L). **Confirmado no código** (`aquariumControler.tsx`) e nos exemplos do TCC (18→90/18; 42→210/42; 168→840). Assumo que continua sendo a regra desejada. | Recalibrar 2 constantes em `src/domain/aquarium.ts`. |
| **P2** | Largura e altura passam a agregar por **INTERSEÇÃO** `[max(mins), min(maxs)]`. Hoje o código faz `min-de-min` na largura e mistura união/interseção na altura (**bug**). | Muda quais aquários acusam conflito de dimensão. |
| **P3** | `water_type` divergente vira **conflito** (misturar doce+salgada num mesmo aquário). A v1 não bloqueava isso. | É *enhancement*; remover a regra se indesejado. |
| **P4** | Temperamento vira cálculo **pairwise ciente de tamanho** (agressivo_menores/maiores compara `size` entre espécies). A v1 só **exibia o rótulo**. | É *enhancement*; reverter para só-rótulo se preferir. |
| **P5** | O enum único `TEMPERAMENT` (0–7) da v1 vira **dois** enums (`temperament_same`, `temperament_others`). Mapa de migração no Fragmento 7. | Releitura dos dados antigos — mas dados foram perdidos, então só afeta o seed. |
| **P6** | `water_type` inclui **`salobra`** (brackish) além de doce/salgada. | Remover do enum se fora de escopo. |
| **P7** | **Manter Pages Router** (não migrar p/ App Router agora). Decisão arquitetural central — ver racional no CLAUDE.md §2. | Replanejar fragmentos de página se você quiser App Router. |
| **P8** | `termostato = 1 W/L` é simplificação (ignora ΔT do ambiente). Mantida de propósito da v1. | Trocar fórmula em 1 lugar. |
| **P9** | Catálogos `substrates`/`foods` passam a ser **seed versionado, sem CRUD UI**. O repo atual tem `newSubstrate.tsx`, `newFood.tsx`, `substrate/*`, `food/*` — esses CRUDs serão **removidos/aposentados** (Fragmento 15). | Manter as telas se quiser editar catálogo pela UI. |
| **P10** | `position` da v1 era numérico (`TOP:1/MIDDLE:2/BOTTOM:3`); vira enum textual (`fundo/meio/superficie`). Relabel + mapa no Fragmento 7. | Ajuste de mapeamento apenas. |
| **P11** | Há um typo no repo: `src/pages/fish/newFish/steps/bahavior.tsx`. Será corrigido p/ `behavior.tsx` no Fragmento 13. | Cosmético; ajustar imports. |

**Ordem e racional:** revivemos primeiro no stack atual (F1–F4), consertamos identidade/segurança (F5), corrigimos o domínio (F6), plumbamos pelos serviços (F7), entregamos features (F8–F13), e só então modernizamos toolchain/deps (F14–F15) — o caminho de menor risco.

---

## Fragmento 1 — Auditoria, branch e baseline

```
Contexto: leia o CLAUDE.md na raiz (fundação do projeto). Esta é a sessão de AUDITORIA. NÃO altere lógica de aplicação.

Objetivo: confirmar a realidade do repo, fixar um baseline de build e preparar o terreno.

Tarefas:
1. Crie e use a branch `feat/atlantis-revival`.
2. Garanta que o CLAUDE.md está na raiz (se não estiver, peça o arquivo).
3. Rode `npm install` e `npm run build`. Registre o resultado (passa/falha + erros) em `AUDIT.md`.
4. Em `AUDIT.md`, documente e CONFIRME ou CORRIJA, com trechos de código:
   - Versões reais (next, react, typescript) e gerenciador (existe package-lock E yarn.lock?).
   - Uso real de cada lib de UI: @material-ui/core (v4), @mui/material (v5), @emotion, styled-components, @heroicons. Liste QUAIS arquivos importam cada uma (grep). Isso decide o que remover no F15.
   - Fórmulas em `src/utils/aquariumControler.tsx`: confirme `calculateFilter = v*5`, `calculateThermostat = v` (×1), `calculateVolume` (reduce volumeFirst + (q-1)*volumeAdditional), e a inconsistência de `calculateWidth`/`calculateHeight` (min-de-min vs interseção).
   - Enums em `src/utils/constants.tsx` (USER_ROLE, AQUARIUM_POSITION, SUBSTRATE, FOOD, TEMPERAMENT 0–7, ALERT_MESSAGE_CODE).
   - Como `next-auth` está montado: `src/pages/api/auth.ts`, `src/services/auth.ts`, `src/services/getToken.ts`, `src/contexts/AuthContext.tsx`, páginas login/logout/register.
   - SVG: `.babelrc` + babel-plugin-inline-react-svg, e `next.config.js`.
   - Confirme o typo `src/pages/fish/newFish/steps/bahavior.tsx`.
5. NÃO corrija nada ainda. Apenas relate divergências entre o CLAUDE.md e o repo real em uma seção "Divergências" do AUDIT.md.

Definition of Done: branch criada; `AUDIT.md` commitado com baseline de build e as confirmações/divergências acima. Nenhuma mudança de comportamento.
```

---

## Fragmento 2 — Supabase novo: schema + RLS + triggers

```
Contexto: leia o CLAUDE.md (§4 schema, §3 papéis). Banco antigo PERDIDO — começamos do zero num projeto Supabase NOVO.

Objetivo: versionar o schema completo como migration e prepará-lo para `supabase db reset`.

Pré-requisito: Supabase CLI disponível. NÃO precise da senha do projeto remoto nesta sessão; trabalhe no banco LOCAL (`supabase start`).

Tarefas:
1. `supabase init` (se ainda não houver `supabase/`).
2. Crie `supabase/migrations/0001_init.sql` com EXATAMENTE o schema do CLAUDE.md §4: os 5 enums; tabelas profiles, substrates, foods, fish, fish_substrates, fish_foods, aquariums, aquarium_fish; todos os CHECK (max>=min); os índices (incl. GIN tsvector).
3. Crie `supabase/migrations/0002_rls.sql` com o bloco RLS do CLAUDE.md: função `user_role()` (SECURITY DEFINER), `enable row level security` em todas as tabelas, policies de leitura pública (catálogos+fish+N:N+profiles), escrita só `especialista`/`admin`, aquários só do dono; triggers `prevent_role_change`, `handle_new_user`.
4. Crie `supabase/migrations/0003_updated_at.sql`: função genérica `set_updated_at()` + trigger BEFORE UPDATE em `profiles`, `fish`, `aquariums`.
5. `supabase start` e `supabase db reset`. Corrija erros de SQL até reset rodar limpo.
6. Documente em `supabase/README.md` como rodar local e como aplicar no projeto remoto novo (`supabase link` + `supabase db push`) — sem expor segredos.

Restrições: SQL idêntico ao contrato do CLAUDE.md; se algo não casar, ajuste o SQL, não o CLAUDE.md (a menos que ache um bug — então registre em AUDIT.md).

Definition of Done: `supabase db reset` aplica as 3 migrations sem erro no banco local; `supabase/README.md` commitado.
```

---

## Fragmento 3 — Seed versionado (catálogos + espécies) + reprodutibilidade + snapshot

```
Contexto: leia o CLAUDE.md (§7 reprodutibilidade, §8 seed). Os dados de espécie foram perdidos; recriamos um seed VERSIONADO para o banco ser reproduzível a partir do repo.

Objetivo: seed determinístico dos catálogos e de espécies (rascunho), + geração de snapshot estático para degradação graciosa.

Tarefas:
1. `supabase/seed.sql` (rodado pelo `supabase db reset`):
   - substrates ids fixos: 0 sem_substrato,1 cascalho,2 humus,3 areia,4 aragonita,5 basalto,6 turfa (slug+name).
   - foods ids fixos: 0 pastilha,1 granulada,2 floco,3 tablet,4 farinha,5 artemia.
   - espécies iniciais: comece pelas documentadas no TCC (Betta splendens; Trichogaster trichopterus; e mais 3–5 comuns de água doce). Preencha as ~19 variáveis com NUMERIC (decimais reais). Ligue fish_substrates/fish_foods. `specialist_id = NULL`.
   - IMPORTANTE: marque claramente (comentário no SQL + coluna `note`) que estes valores são RASCUNHO até validação/assinatura de um especialista credenciado. NÃO apresente dados inventados como autoritativos.
2. Mantenha os dados de espécie também em `supabase/seed/species.json` (fonte legível) e gere o `seed.sql` a partir dele com um script `scripts/build-seed.mjs` (Node puro, sem libs novas se possível).
3. Script `scripts/build-fallback.mjs`: lê `species.json` + catálogos e escreve `public/fallback/species.json` (snapshot consumido na degradação graciosa do F13). Adicione npm script `build:fallback` e encadeie no `prebuild`.
4. `supabase db reset` deve popular tudo. Verifique contagens com `supabase db` query.

Restrições: zero CRUD de catálogo; catálogo é seed. Não invente fórmulas aqui.

Definition of Done: `supabase db reset` popula catálogos + espécies; `npm run build:fallback` gera `public/fallback/species.json`; ambos commitados.
```

---

## Fragmento 4 — Reapontar cliente Supabase + env vars + tipos gerados

```
Contexto: leia o CLAUDE.md (§9 convenções). App precisa apontar para o Supabase NOVO, com chave de serviço só no servidor.

Objetivo: substituir o `supabaseClient.ts` raiz por clientes separados (browser/server), renomear env vars e gerar os tipos do banco.

Tarefas:
1. Renomeie env vars:
   - SUPABASE_URL → NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_ANON_KEY → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_API_KEY → SUPABASE_SERVICE_ROLE_KEY (NUNCA exposta ao browser)
   Atualize `.env.local` exemplo no README e qualquer referência.
2. Crie `src/lib/supabase/browser.ts` (createClient com a anon key, p/ client components) e `src/lib/supabase/server.ts` (service role, importável SÓ em `src/pages/api/*` e funções getServerSideProps/getStaticProps). Marque `server.ts` com um comentário de aviso e, se possível, um guard `if (typeof window !== 'undefined') throw`.
3. Atualize TODOS os imports do antigo `supabaseClient.ts` (exports `supabase` e `supabaseAuth`) para os novos módulos. Remova o arquivo raiz.
4. Gere tipos: `supabase gen types typescript --local > src/types/database.ts`. Commit.
5. `npm run build` deve passar (pode haver telas ainda usando schema antigo — corrija só o que quebra o build de tipos de cliente; refactor profundo de serviços é o F7).

Restrições: service role key nunca chega ao bundle do cliente. Não mude lógica de domínio.

Definition of Done: build passa; nenhum import do `supabaseClient.ts` antigo restante; `src/types/database.ts` gerado e commitado.
```

---

## Fragmento 5 — Auth: migrar `next-auth` → Supabase Auth (+ papéis)

```
Contexto: leia o CLAUDE.md (§3 papéis, RLS). A v1 só checava permissão nas rotas; agora a segurança vem do banco (RLS por auth.uid()). Trocamos next-auth por Supabase Auth.

Objetivo: autenticação via Supabase Auth, com perfil (profiles) e papel (role) disponíveis no app, e RLS efetiva.

Tarefas:
1. Remova next-auth e tokens caseiros: `src/pages/api/auth.ts`, `src/services/getToken.ts`, e a lógica de sessão em `src/services/auth.ts`. Reescreva `auth.ts` sobre `supabase.auth` (signUp, signInWithPassword, signOut, getSession). nookies/js-cookie só se necessário p/ SSR de sessão (prefira o helper de SSR do supabase-js).
2. Reescreva `src/contexts/AuthContext.tsx`: provê `session`, `user`, `profile` (de `profiles`), `role`, e estados de loading. Use `onAuthStateChange`.
3. Páginas `login.tsx`, `register.tsx`, `logout.tsx`: religue aos novos métodos. No registro, o trigger `handle_new_user` já cria o profile como `aquarista`; não insira profile manualmente.
4. Gating de rota: crie um helper `requireRole(role)` para getServerSideProps das áreas restritas (ex.: área do especialista). A imposição REAL é a RLS; o gating de rota é só UX.
5. Verifique fim-a-fim no banco local: criar usuário → login → sessão persiste → `profile.role = aquarista`. Promova um usuário a `especialista` via SQL e confirme que escrita em `fish` passa a ser permitida (RLS).

Restrições: não dependa de checagem de papel só no front; a RLS é a fonte de verdade. Service role nunca no cliente.

Definition of Done: build passa; login/registro/logout funcionam contra Supabase Auth local; papel lido do profiles; RLS validada (aquarista não escreve fish, especialista escreve).
```

---

## Fragmento 6 — Módulo de domínio: tipos + fórmulas + testes

```
Contexto: leia o CLAUDE.md (§5 contratos, §6 domínio). Este é o CORAÇÃO. Centralize TODAS as fórmulas num só lugar. Erro aqui = peixe morto.

Objetivo: criar `src/domain/types.ts` e `src/domain/aquarium.ts` portando as fórmulas existentes, com a correção de largura/altura, e cobertura de testes.

Tarefas:
1. `src/domain/types.ts`: cole os contratos do CLAUDE.md §5 (Range, NullableRange, UserRole, WaterType, FishPosition, TemperamentSame/Others, Profile, Substrate, Food, Fish, AquariumPlan, AquariumItem, ConflictKind, Conflict, AquariumComputed, AlertMessage).
2. `src/domain/aquarium.ts`, funções PURAS:
   - calcMinVolume(items) = Σ [volumeFirst + max(0,q-1)*volumeAdditional]  (confirmar contra calculateVolume da v1)
   - calcFilterLh(v) = v*5 ; calcHeaterW(v) = v*1
   - aggregateRange(ranges): interseção [max(mins), min(maxs)]
   - aggregateDimension(ranges nuláveis): interseção [max(mins não-nulos), min(maxs não-nulos)] — CORRIGE o bug da v1 (P2)
   - computeAquarium(items: (Fish & {quantity})[], waterType): retorna AquariumComputed, agregando temperatura/ph/dgh/salinidade/largura/altura, volume/filtro/termostato, e a lista de Conflict.
   - Regras de Conflict do CLAUDE.md §6: interseção vazia (params/dimensões) com `fishIds` das espécies que puxaram o limite e `message` em PT explicando o porquê; water_type (P3); cardume `quantity < minimumShoal` (P4-shoal); temperamento pairwise ciente de tamanho (P4).
3. Testes (Vitest ou Jest — escolha o de menor atrito; adicione devDependency e script `test`):
   - exemplos do TCC: volume 18→filtro 90/term 18; 42→210/42; 168→840.
   - interseção vazia de temperatura entre duas espécies → 1 Conflict('temperature') com os 2 fishIds.
   - agressivo_menores vs espécie menor → Conflict('temperament').
   - mistura doce+salgada → Conflict('water_type').
4. NÃO consuma React aqui; é domínio puro e testável.

Restrições: nenhuma fórmula fora deste arquivo. Mensagens de conflito prontas para UI, em PT-BR.

Definition of Done: `npm test` verde com os casos acima; `npm run build` passa; nenhuma duplicação de fórmula no restante do código (a remoção dos cálculos antigos acontece no F8).
```

---

## Fragmento 7 — Serviços + rotas API: refatorar para o schema novo

```
Contexto: leia o CLAUDE.md (§4, §5). Ligue a camada de dados ao schema novo e aos contratos do domínio. Mapeie Row (snake_case) ↔ domínio (camelCase) em funções puras.

Objetivo: serviços e rotas API lendo/gravando no schema novo, retornando os tipos de `src/domain/types.ts`.

Tarefas:
1. Crie `src/lib/mappers.ts`: `fishRowToDomain` / `fishDomainToRow`, idem para Profile, Substrate, Food, Aquarium. Use `src/types/database.ts` (gerado) como tipos de Row. Aqui vive o mapa dos enums (P5 temperamento 0–7 → dois enums; P10 position numérico → fundo/meio/superficie).
2. Refatore serviços (`src/services/{fish,aquarium,food,substrate,user}.ts`) para usar o cliente correto:
   - Leituras públicas (catálogo, fish, perfil) podem usar o cliente browser (anon + RLS).
   - Escritas e dados sensíveis passam por rotas `src/pages/api/*` usando `src/lib/supabase/server.ts`.
   - `fish` deve trazer `specialist` (join em profiles) e `substrates`/`foods` (joins N:N).
3. Refatore rotas `src/pages/api/{fish,aquarium,food,substrate,user,users}.ts` para o schema novo + checagem de sessão Supabase (a RLS ainda protege).
4. `aquarium.ts`: persistência usa `aquariums` + `aquarium_fish` (quantidade). Faixas/volume/filtro NÃO são persistidos (são derivados no F8).
5. `npm run build` + um teste de fumaça: listar fish do banco local e mapear sem perda.

Restrições: nenhuma regra de domínio nos serviços — só I/O + mapeamento. Reaproveite o código de serviço que ainda servir.

Definition of Done: build passa; CRUD de fish e leitura de catálogo funcionam contra o banco local via os mappers; nada usa o schema antigo.
```

---

## Fragmento 8 — Planejador: recálculo ao vivo + alertas inline/vermelhos

```
Contexto: leia o CLAUDE.md (§6). O planejador é o produto. Recalcule ao vivo consumindo SÓ `src/domain/aquarium.ts`.

Objetivo: substituir a lógica espalhada por chamadas ao domínio e renderizar conflitos com o "porquê".

Tarefas:
1. Refatore `src/contexts/NewAquariumContext.tsx` e a página `src/pages/newAquarium/*` (+ steps aquariumType/aquariumSize/aquariumFishes) para, a cada add/remove/quantidade, chamar `computeAquarium(...)` e guardar o `AquariumComputed`.
2. APAGUE os cálculos antigos de `src/utils/aquariumControler.tsx` (volume/filtro/termostato/params/width/height) — agora vêm do domínio. Mantenha só helpers de UI que não sejam fórmula, se houver.
3. UI:
   - Mostre volume mínimo, vazão (l/h) e watts recalculando ao vivo.
   - Faixas de temperatura/pH/dGH/salinidade estreitando conforme espécies entram.
   - Temperamento renderiza INLINE no card da espécie ANTES de adicionar (`CardFish`).
   - Conflito: card do aquário (`CardAquarium`) em vermelho E a espécie culpada em vermelho, com a `message` do Conflict visível (por que quebrou). Use `ALERT_MESSAGE_CODE`/`AlertMessage`.
4. Garanta reatividade sem recomputar fora do domínio (memo onde fizer sentido).

Restrições: zero fórmula na camada de view; tudo via domínio. Não persista derivados.

Definition of Done: adicionar/remover espécies recalcula tudo ao vivo; conflitos aparecem em vermelho com explicação; `aquariumControler.tsx` sem fórmulas; build passa.
```

---

## Fragmento 9 — "Meus Aquários": persistência + reidratar editor

```
Contexto: leia o CLAUDE.md (§4 aquariums/aquarium_fish). Planos salvos e reabertos reidratam o editor.

Objetivo: salvar, listar, abrir (reidratar) e excluir planos de aquário do usuário logado.

Tarefas:
1. Salvar: a partir do estado do planejador, grave `aquariums` (name, water_type, tank_* opcionais) + `aquarium_fish` (fish_id, quantity) numa rota API transacional. RLS garante dono.
2. Listar: `src/pages/aquarium/index.tsx` mostra os aquários do usuário (cards). Use `CardAquarium`.
3. Abrir: `src/pages/aquarium/[id].tsx` carrega o plano, busca os fish completos, e REIDRATA o `NewAquariumContext` (mesmo estado do planejador) → recomputa via domínio e permite editar.
4. Editar/excluir: salvar de novo faz upsert (recria aquarium_fish); excluir remove o aquário (cascade).
5. Trate o caso não-logado (redireciona p/ login) — mas catálogo/planejador continuam usáveis sem login (preparando o F13).

Restrições: persistir só identidade + itens; derivados recomputados ao abrir. Nada de service role no cliente.

Definition of Done: criar → aparece em Meus Aquários → reabrir reidrata e recomputa → editar e excluir funcionam; tudo sob RLS do dono; build passa.
```

---

## Fragmento 10 — Páginas de espécie + atribuição do especialista (ISR)

```
Contexto: leia o CLAUDE.md (§1 tese, §2 SEO via ISR). Atribuição/accountability são CORE.

Objetivo: página pública de espécie, estática/ISR, exibindo a "assinatura" do especialista com link para o perfil.

Tarefas:
1. `src/pages/fish/[id].tsx`: use `getStaticPaths` + `getStaticProps` com `revalidate` (ISR) lendo via server client. Renderize as ~19 variáveis de forma legível (faixas, posição, substratos, alimentos, temperamento com mesma/outras espécies, volumes, dimensões).
2. Bloco de ATRIBUIÇÃO: "Curado por {especialista.name}" com link para `/profile/[id]` do especialista. Se `specialist_id` for NULL, marque explicitamente como "Dados em rascunho — ainda não validados por especialista" (honestidade da tese; ver F3).
3. `src/pages/fish/index.tsx`: listagem/busca de espécies (use o índice GIN para busca textual via rota API ou RPC simples).
4. SEO: title/meta por espécie.

Restrições: não invente credenciais; se não há especialista, diga que é rascunho. Conteúdo público (sem login).

Definition of Done: páginas de espécie geram estaticamente, mostram atribuição (ou aviso de rascunho) com link ao perfil; listagem com busca funciona; build passa.
```

---

## Fragmento 11 — Perfil público de especialista

```
Contexto: leia o CLAUDE.md (§1). O perfil público é o outro lado da accountability.

Objetivo: página pública de perfil exibindo o especialista e as espécies que ele assinou.

Tarefas:
1. `src/pages/profile/[id].tsx`: getStaticProps/ISR. Mostre name, image, description, link (campos de `profiles`) e o papel (badge "Especialista").
2. Liste as espécies onde `fish.specialist_id = profile.id`, com link para cada `/fish/[id]`.
3. `link` do profile é renderizado como link externo (rel noopener). Não exponha email se não for desejado (decida e documente).
4. Perfis de `aquarista` comuns: decida se têm página pública mínima ou 404 (recomendo página mínima sem dados sensíveis).

Restrições: só dados públicos; nada que dependa de service role.

Definition of Done: perfil público renderiza com espécies assinadas e link externo; build passa.
```

---

## Fragmento 12 — Área do especialista: formulário de criar/editar espécie (~19 variáveis)

```
Contexto: leia o CLAUDE.md (§3 papéis, §4 fish, §5 Fish). Só `especialista`/`admin` escrevem (RLS). Editar carimba `specialist_id`.

Objetivo: formulário completo das ~19 variáveis para criar e editar espécies, gravando via rota API com a sessão do especialista.

Tarefas:
1. Reaproveite o fluxo existente `src/pages/fish/newFish/*` (steps identification/water/size/behavior/notes). Refatore os campos para o schema novo e os tipos de domínio.
2. Campos: identificação (name, name_en, scientific_name, image, water_type, position); água (4 faixas min/max NUMERIC); tamanho/volumes (size, volume_first, volume_additional, largura min/max, altura min/max); comportamento (minimum_shoal, temperament_same, temperament_others); substratos e alimentos (multi-select dos catálogos seedados); nota.
3. Use os inputs existentes (`InputRange`, `InputSelect`, `InputText`). Valide no cliente as regras de CHECK (max>=min) ANTES de enviar (mensagens claras).
4. Gravação via rota API (server client) setando `specialist_id = auth.uid()` e `updated_at`. RLS confirma o papel.
5. Modo edição: pré-carrega uma espécie existente e salva por update.
6. Gating de UX: esconda a área para quem não é especialista (a RLS é a trava real).

Restrições: não burlar a RLS; o servidor seta specialist_id (não confie no cliente). Catálogos vêm do seed (sem criar substrato/alimento aqui).

Definition of Done: especialista cria e edita espécie com as ~19 variáveis; specialist_id e updated_at gravados; aquarista não consegue (RLS); build passa.
```

---

## Fragmento 13 — Degradação graciosa: modo demonstração read-only

```
Contexto: leia o CLAUDE.md (§7). Banco indisponível foi o que nos queimou. A demo NÃO pode quebrar.

Objetivo: se o Supabase estiver indisponível, o app cai para o snapshot estático (`public/fallback/species.json`) em modo read-only navegável, com banner.

Tarefas:
1. Na camada de dados (serviços/mappers), envolva as leituras de catálogo/espécie num fallback: se a chamada ao Supabase falhar (erro/timeout), carregue de `public/fallback/species.json`. Centralize num `src/lib/data-source.ts` para não espalhar try/catch.
2. Exponha um flag `isDemoMode` no contexto quando o fallback estiver ativo.
3. UI: banner global "Modo demonstração — dados estáticos; salvar aquário indisponível". Desabilite ações de escrita (salvar aquário, área do especialista) com tooltip explicativo.
4. O planejador deve FUNCIONAR em modo demo (recálculo é domínio puro, não precisa de banco). Só a persistência fica off.
5. Corrija o typo `bahavior.tsx` → `behavior.tsx` e ajuste imports (P11).
6. Teste: rode com env do Supabase apontando para um host inválido e confirme que catálogo+planejador funcionam via snapshot, sem tela branca.

Restrições: fallback é read-only; nunca finja que salvou. Snapshot vem do seed (F3), sempre atualizado no prebuild.

Definition of Done: com banco indisponível, o app navega o catálogo e usa o planejador via snapshot, com banner e escrita desabilitada; typo corrigido; build passa.
```

---

## Fragmento 14 — Modernização de toolchain (framework/TS/SVG/gerenciador)

```
Contexto: leia o CLAUDE.md (§2). Agora que o app revive e funciona, modernizamos com baixo risco. NÃO mexer em MUI v4 ainda (é o F15).

Objetivo: Next 14 LTS + TS 5.x, SVG via SVGR no next.config (religando SWC, removendo .babelrc), e um único gerenciador de pacotes.

Tarefas:
1. Gerenciador único: escolha npm. Remova `yarn.lock`, regenere `package-lock.json`, ajuste docs.
2. Suba Next para 14 LTS e eslint-config-next correspondente; TypeScript para 5.x. Rode codemods se necessário. Corrija breaking changes do Pages Router (são poucos).
3. SVG: configure SVGR em `next.config.js` (webpack rule para `*.svg`), remova `.babelrc` e `babel-plugin-inline-react-svg` — isso RELIGA o SWC (build mais rápido). Ajuste imports de SVG se a sintaxe mudar.
4. Rode `npm run build` + `npm test` + `npm run dev` e clique pelos fluxos principais (planejador, salvar, espécie, perfil, área do especialista, modo demo).
5. Atualize o CLAUDE.md §2 marcando os alvos atingidos.

Restrições: não migrar para App Router (P7). Não remover MUI v4 aqui. Um PR só, revertível.

Definition of Done: build/test/dev verdes em Next 14 + TS 5; sem `.babelrc` nem yarn.lock; SVGs renderizam via SVGR; fluxos principais OK.
```

---

## Fragmento 15 — Limpeza de dependências + QA final + deploy

```
Contexto: leia o CLAUDE.md (§2) e o AUDIT.md (mapa de uso de UI do F1). Último fragmento.

Objetivo: remover MUI v4 e libs de estilo redundantes, aposentar CRUDs de catálogo, QA final e checklist de deploy na Vercel.

Tarefas:
1. Usando o grep do AUDIT.md, migre os usos de `@material-ui/core` (v4) para Tailwind + @heroicons (ou @mui/material v5 onde já houver). Remova `@material-ui/core`. Avalie remover `styled-components` e/ou `@emotion` se não forem mais necessários após a migração (mantenha o que o MUI v5 exigir).
2. Aposente os CRUDs de catálogo (P9): remova/oculte `src/pages/substrate/newSubstrate.tsx`, `src/pages/food/newFood.tsx` e telas de edição de catálogo; catálogo é seed. Mantenha páginas de leitura só se agregarem valor.
3. `npm prune`, remova deps órfãs, rode `npm run lint` e conserte.
4. QA fim-a-fim no banco local: registro/login, papéis e RLS, planejador + alertas, salvar/reabrir aquário, página de espécie com atribuição, perfil do especialista, área do especialista (criar/editar), modo demonstração.
5. Deploy: documente em `DEPLOY.md` as env vars novas na Vercel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY), o `supabase db push` para o projeto novo, e o `prebuild` que gera o snapshot.

Restrições: não introduza libs novas de UI. Não quebre o que já funciona; cada remoção verificada por build.

Definition of Done: `@material-ui/core` removido e libs redundantes podadas; CRUDs de catálogo aposentados; lint limpo; build/test verdes; `DEPLOY.md` commitado; checklist de QA passado.
```

---

### Resumo da ordem

1. Auditoria/baseline → 2. Schema+RLS → 3. Seed+snapshot → 4. Reapontar cliente+env → 5. Auth Supabase → 6. Domínio (fórmulas+testes) → 7. Serviços/API → 8. Planejador ao vivo → 9. Meus Aquários → 10. Páginas de espécie → 11. Perfil de especialista → 12. Área do especialista → 13. Degradação graciosa → 14. Toolchain → 15. Limpeza+deploy.
