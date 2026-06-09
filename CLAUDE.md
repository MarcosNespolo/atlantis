# CLAUDE.md — Atlantis (fundação do projeto)

> Arquivo lido em **toda** sessão do Opus no Claude Code. Fonte de verdade de tese, stack, schema, contratos e fórmulas. Atualização in-place de https://github.com/MarcosNespolo/atlantis. **Não é greenfield.**

---

## 1. Tese do produto

Atlantis diz a quem tem aquário doméstico (doce **e** salgado) se as espécies que quer criar são compatíveis entre si e com o aquário. O problema do nicho não é UI — é **dado**: fóruns, pet shops e ferramentas dão valores contraditórios e sem responsável (ver divergência do *Betta splendens* entre 3 ferramentas no TCC). **Qualidade de dado é o produto.** Cada espécie é curada e **assinada** por um especialista credenciado, com link para o perfil público dele. Atribuição e accountability são núcleo, não enfeite.

## 2. Stack final (decisão)

**Manter Pages Router. Modernizar incrementalmente. NÃO migrar para App Router agora.**
Racional: o app é um planejador autenticado e altamente interativo (recálculo ao vivo em contexts React) → ganho marginal com RSC. `.babelrc` + `next-auth` + mistura MUI v4/v5 tornam a migração App Router cara e arriscada. SEO das páginas públicas (espécie, perfil) é resolvido com `getStaticProps`/ISR no próprio Pages Router. App Router fica como evolução futura opcional, não bloqueante.

| Camada | Atual | Alvo |
|---|---|---|
| Framework | Next 13.0.5 (Pages Router) | Next 14 LTS (Pages Router) |
| Linguagem | TS 4.9 | TS 5.x |
| UI | Tailwind 3 + MUI v4 **+** MUI v5 + emotion + styled-components | Tailwind + heroicons; **remover MUI v4 e libs de estilo redundantes** (confirmar uso no audit) |
| SVG | `.babelrc` + babel-plugin-inline-react-svg (SWC desligado) | SVGR via `next.config` → **religa SWC** |
| Banco | Supabase (perdido) | **Supabase novo**, schema do zero, **RLS** |
| Auth | `next-auth` | **Supabase Auth** (habilita RLS por `auth.uid()`) |
| Deploy | Vercel | Vercel |
| Pacotes | `package-lock.json` **e** `yarn.lock` | **um só** (recomendado: npm) |

## 3. Papéis

`aquarista` (default): planeja aquários, **lê** o banco. `especialista`: + **escreve** espécies/substratos/alimentos. `admin`: + gerencia papéis. Imposto por **RLS** (a v1 só checava na rota; agora é no banco).

## 4. Schema SQL — banco NOVO (PostgreSQL/Supabase)

> Reconstruído do zero a partir do modelo do TCC (ER + diagrama de classes), modernizado. **Parâmetros de água migram de `INT` → `NUMERIC`** (os dados reais têm decimais: pH 6.2, temp 27.8 °C). Identidade de usuário sai para o **Supabase Auth** (sem coluna de senha no nosso schema). Catálogos (`substrates`, `foods`) usam PK `smallint` com ids fixos do seed, para reprodutibilidade.

```sql
-- ========= ENUMS =========
create type user_role          as enum ('aquarista','especialista','admin');
create type water_type         as enum ('doce','salgada','salobra');
create type fish_position      as enum ('fundo','meio','superficie');
create type temperament_same   as enum ('pacifico','territorial','territorial_femeas','territorial_machos');
create type temperament_others as enum ('pacifico','territorial','agressivo_menores','agressivo_maiores');

-- ========= PROFILES (1:1 com auth.users) =========
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text,
  image       text,
  description  text,
  link        text,
  role        user_role not null default 'aquarista',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ========= CATÁLOGOS (seed-managed; ids estáveis) =========
create table public.substrates (
  id          smallint primary key,        -- 0..6 (ver seed)
  slug        text unique not null,
  name        text not null,
  description  text,
  image       text
);
create table public.foods (
  id          smallint primary key,        -- 0..5 (ver seed)
  slug        text unique not null,
  name        text not null,
  description  text,
  image       text
);

-- ========= FISH (entidade central) =========
create table public.fish (
  id                  bigint generated always as identity primary key,
  name                text not null,
  name_en             text,
  scientific_name     text not null,
  image               text,
  water_type          water_type not null default 'doce',
  minimum_shoal       int not null default 1 check (minimum_shoal >= 1),
  position            fish_position not null,
  temperament_same    temperament_same not null default 'pacifico',
  temperament_others  temperament_others not null default 'pacifico',
  size                numeric(6,2) not null,                 -- cm (adulto)
  aquarium_width_min  numeric(6,2),
  aquarium_width_max  numeric(6,2),
  aquarium_height_min numeric(6,2),
  aquarium_height_max numeric(6,2),
  volume_first        numeric(7,2) not null check (volume_first > 0),   -- L
  volume_additional   numeric(7,2) not null default 0 check (volume_additional >= 0),
  temperature_min     numeric(4,1) not null,                 -- °C
  temperature_max     numeric(4,1) not null,
  ph_min              numeric(3,1) not null,
  ph_max              numeric(3,1) not null,
  dgh_min             numeric(4,1) not null,                 -- °dGH
  dgh_max             numeric(4,1) not null,
  salinity_min        numeric(5,2) not null default 0,        -- ppt
  salinity_max        numeric(5,2) not null default 0,
  note                text,
  specialist_id       uuid references public.profiles(id),    -- último especialista que editou
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- guardrails: faixa interna válida (max >= min)
  check (aquarium_width_max  is null or aquarium_width_min  is null or aquarium_width_max  >= aquarium_width_min),
  check (aquarium_height_max is null or aquarium_height_min is null or aquarium_height_max >= aquarium_height_min),
  check (temperature_max >= temperature_min),
  check (ph_max  >= ph_min),
  check (dgh_max >= dgh_min),
  check (salinity_max >= salinity_min)
);

-- ========= N:N peixe ↔ catálogos =========
create table public.fish_substrates (
  fish_id      bigint not null references public.fish(id) on delete cascade,
  substrate_id smallint not null references public.substrates(id) on delete restrict,
  primary key (fish_id, substrate_id)
);
create table public.fish_foods (
  fish_id bigint not null references public.fish(id) on delete cascade,
  food_id smallint not null references public.foods(id) on delete restrict,
  primary key (fish_id, food_id)
);

-- ========= AQUÁRIOS (planos salvos) =========
-- Faixas/volume/filtro/termostato NÃO são persistidos: são DERIVADOS ao vivo (ver §6).
-- tank_* opcionais = dimensões reais que o usuário declara (passo "aquariumSize").
create table public.aquariums (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  water_type  water_type not null default 'doce',
  tank_width  numeric(6,2),
  tank_height numeric(6,2),
  tank_volume numeric(7,2),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ========= N:N aquário ↔ peixe (com quantidade) =========
create table public.aquarium_fish (
  aquarium_id bigint not null references public.aquariums(id) on delete cascade,
  fish_id     bigint not null references public.fish(id) on delete restrict,
  quantity    int not null check (quantity >= 1),
  primary key (aquarium_id, fish_id)
);

-- ========= ÍNDICES =========
create index on public.fish (specialist_id);
create index on public.fish (water_type);
create index on public.aquariums (user_id);
create index on public.aquarium_fish (fish_id);
create index on public.fish using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(scientific_name,'') || ' ' || coalesce(name_en,'')));
```

### RLS

```sql
-- helper (bypassa RLS de profiles via SECURITY DEFINER → evita recursão)
create or replace function public.user_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles       enable row level security;
alter table public.substrates     enable row level security;
alter table public.foods          enable row level security;
alter table public.fish           enable row level security;
alter table public.fish_substrates enable row level security;
alter table public.fish_foods     enable row level security;
alter table public.aquariums      enable row level security;
alter table public.aquarium_fish  enable row level security;

-- PROFILES: leitura pública (perfil de especialista é público); update do próprio; admin edita qualquer
create policy profiles_read   on public.profiles for select using (true);
create policy profiles_self_upd on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_upd on public.profiles for update using (public.user_role() = 'admin');

-- trava: só admin altera o campo role
create or replace function public.prevent_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and coalesce(public.user_role(),'aquarista') <> 'admin' then
    raise exception 'Somente admin pode alterar o papel';
  end if;
  return new;
end $$;
create trigger trg_prevent_role_change before update on public.profiles
for each row execute function public.prevent_role_change();

-- cria profile no signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), new.email, 'aquarista');
  return new;
end $$;
create trigger trg_on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- CATÁLOGOS + FISH (+ N:N): leitura pública (inclui anon → degradação graciosa); escrita especialista+
create policy cat_read_sub  on public.substrates for select using (true);
create policy cat_read_food on public.foods      for select using (true);
create policy fish_read     on public.fish       for select using (true);
create policy fs_read       on public.fish_substrates for select using (true);
create policy ff_read       on public.fish_foods      for select using (true);

create policy fish_write on public.fish for all
  using (public.user_role() in ('especialista','admin'))
  with check (public.user_role() in ('especialista','admin'));
create policy sub_write  on public.substrates for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));
create policy food_write on public.foods for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));
create policy fs_write on public.fish_substrates for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));
create policy ff_write on public.fish_foods for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));

-- AQUÁRIOS: só o dono
create policy aq_owner on public.aquariums for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy aqf_owner on public.aquarium_fish for all
  using (exists (select 1 from public.aquariums a where a.id = aquarium_id and a.user_id = auth.uid()))
  with check (exists (select 1 from public.aquariums a where a.id = aquarium_id and a.user_id = auth.uid()));
```

> `updated_at`: adicionar trigger genérico `set_updated_at()` em `profiles`, `fish`, `aquariums` (Fragmento 1).

## 5. Contratos TypeScript (fonte de verdade entre módulos)

> Em `src/domain/types.ts`. `*Row` = linha do banco (snake_case); tipo de domínio = camelCase (app). Mantém a separação que já existia em `utils/types.tsx` (`Fish`/`FishBD`).

```ts
export type Range = [number, number];                 // [min, max]
export type NullableRange = [number | null, number | null];

export type UserRole = 'aquarista' | 'especialista' | 'admin';
export type WaterType = 'doce' | 'salgada' | 'salobra';
export type FishPosition = 'fundo' | 'meio' | 'superficie';
export type TemperamentSame = 'pacifico' | 'territorial' | 'territorial_femeas' | 'territorial_machos';
export type TemperamentOthers = 'pacifico' | 'territorial' | 'agressivo_menores' | 'agressivo_maiores';

export interface Profile {
  id: string; name: string; email?: string | null;
  image?: string | null; description?: string | null; link?: string | null;
  role: UserRole;
}

export interface Substrate { id: number; slug: string; name: string; description?: string | null; image?: string | null; }
export interface Food      { id: number; slug: string; name: string; description?: string | null; image?: string | null; }

export interface Fish {
  id: number;
  name: string; nameEn?: string | null; scientificName: string; image?: string | null;
  waterType: WaterType;
  minimumShoal: number;
  position: FishPosition;
  temperamentSame: TemperamentSame;
  temperamentOthers: TemperamentOthers;
  size: number;                       // cm
  aquariumWidth: NullableRange;       // cm [min,max]
  aquariumHeight: NullableRange;      // cm [min,max]
  volumeFirst: number;                // L
  volumeAdditional: number;           // L
  temperature: Range;                 // °C
  ph: Range;
  dgh: Range;                         // °dGH
  salinity: Range;                    // ppt
  note?: string | null;
  substrates?: Substrate[] | null;
  foods?: Food[] | null;
  specialist?: Profile | null;        // assinatura/atribuição
  quantity?: number;                  // só no contexto do planejador
}

export interface AquariumPlan {       // identidade persistida
  id?: number; userId: string; name: string; waterType: WaterType;
  tankWidth?: number | null; tankHeight?: number | null; tankVolume?: number | null;
  createdAt?: string; updatedAt?: string;
}

export interface AquariumItem { fishId: number; quantity: number; }  // = aquarium_fish

// ----- saída DERIVADA do domínio (não persiste) -----
export type ConflictKind =
  | 'temperature' | 'ph' | 'dgh' | 'salinity'
  | 'width' | 'height'
  | 'water_type' | 'temperament' | 'shoal';

export interface Conflict {
  kind: ConflictKind;
  message: string;                    // POR QUE quebrou (PT, pronto p/ UI)
  fishIds: number[];                  // espécies envolvidas (p/ destacar em vermelho)
  detail?: { min?: number; max?: number; expected?: number; actual?: number };
}

export interface AquariumComputed {
  volume: number;                     // L mínimo
  filter: number;                     // l/h
  thermostat: number;                 // W
  temperature: Range; ph: Range; dgh: Range; salinity: Range;
  width: NullableRange; height: NullableRange;
  conflicts: Conflict[];              // vazio = compatível
}

export type AlertCode = 0 | 1 | 2;    // WARNING | DANGER | SUCCESS
export interface AlertMessage { code: AlertCode; message: string; }
```

## 6. Contrato de domínio (o coração — centralizar TODAS as fórmulas em `src/domain/aquarium.ts`)

> **Confirmadas no código atual** (`src/utils/aquariumControler.tsx`) e nos exemplos do TCC (volume 18→filtro 90/term. 18; 42→210/42; 168→840). Portar para `src/domain`, **sem espalhar lógica**. Apenas assinaturas + fórmula; implementação é dos fragmentos.

```
calcMinVolume(items: {volumeFirst,volumeAdditional,quantity}[]): number
  = Σ_i [ volumeFirst_i + max(0, quantity_i − 1) · volumeAdditional_i ]
  // soma entre espécies (reduce), confirmado no código.

calcFilterLh(volume: number): number   = volume × 5      // turnover 5×/h  [do código]
calcHeaterW(volume: number): number    = volume × 1      // 1 W/L          [do código]

aggregateRange(ranges: Range[]): Range            // temperatura, pH, dGH, salinidade
  = [ max(todos os min), min(todos os max) ]      // INTERSEÇÃO das tolerâncias
  // se min > max → interseção vazia → Conflict (valor sugerido omitido na UI)

aggregateDimension(ranges: NullableRange[]): NullableRange   // largura, altura
  = [ max(mins não-nulos), min(maxs não-nulos) ]  // MESMA semântica de interseção
  // ⚠ CORREÇÃO: o código atual usa min-de-min p/ largura e mistura união/interseção
  //   na altura (inconsistente). Padronizar TUDO como interseção. (ver premissa P2)
```

Regras de alerta (renderizar **inline** no card da espécie antes de adicionar; conflito = vermelho no card do aquário **e** na espécie culpada; mostrar **por que**):

- **Parâmetros/dimensões**: interseção vazia em qualquer faixa → `Conflict` com `fishIds` = espécies que puxaram os limites, `message` ex.: "Temperatura sem faixa comum: X precisa ≥27 °C, Y tolera ≤24 °C".
- **water_type**: todas as espécies devem ser do mesmo `waterType` do aquário; misturar `doce`+`salgada` → `Conflict('water_type')`. *(enhancement; ver P3)*
- **cardume**: para cada espécie, se `quantity < minimumShoal` → `Conflict('shoal')` (warning) "espécie de cardume: mín. N".
- **temperamento (pairwise, ciente de tamanho)**:
  - `territorial`/`territorial_machos`/`territorial_femeas` (same) → aviso se `quantity > 1` da mesma espécie.
  - `territorial` (others) → aviso se houver qualquer outra espécie no aquário.
  - `agressivo_menores` → conflito com qualquer espécie cujo `size` < o desta.
  - `agressivo_maiores` → conflito com qualquer espécie cujo `size` > o desta.
  *(o app v1 só exibia o rótulo; o cálculo pairwise é enhancement — P4)*

## 7. Reprodutibilidade & degradação graciosa (o que nos queimou)

- **Banco reproduzível a partir do repo**: `supabase/migrations/*.sql` (schema+RLS) + `supabase/seed/` versionado (substratos, alimentos, **espécies reais**). `supabase db reset` recria tudo.
- **Snapshot estático**: build gera `public/fallback/species.json` a partir do seed. Se o Supabase estiver indisponível, o app cai para o snapshot (catálogo + planejador funcionam em **modo demonstração read-only**, com banner). Salvar aquário exige login/banco.

## 8. Seed inicial de espécies (curadoria)

Catálogos (ids fixos): substratos `0 sem_substrato,1 cascalho,2 humus,3 areia,4 aragonita,5 basalto,6 turfa`; alimentos `0 pastilha,1 granulada,2 floco,3 tablet,4 farinha,5 artemia`.
Espécies: começar pelas documentadas no TCC (*Betta splendens*, *Trichogaster trichopterus*, …). **Os valores de espécie são rascunho até serem validados e assinados por um especialista credenciado** — isso é a promessa central do produto; não inventar dados como se fossem autoritativos.

## 9. Convenções

- Não exceder o escopo do fragmento atual. Rodar `npm run build` + testes antes de encerrar cada fragmento.
- Service role key **nunca** no cliente (só em rotas `api/`). Browser usa `NEXT_PUBLIC_SUPABASE_ANON_KEY` + RLS.
- Tipos do banco gerados (`supabase gen types`) em `src/types/database.ts`; mapear Row↔domínio em funções puras.
- Prosa/labels em PT-BR; identificadores/SQL/TS em inglês.
