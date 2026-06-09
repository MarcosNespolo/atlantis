-- Atlantis — schema inicial (banco PostgreSQL/Supabase)
-- Reconstruído do CLAUDE.md §4. Parâmetros de água em NUMERIC (decimais reais).
-- Identidade fica no Supabase Auth (sem coluna de senha aqui).
--
-- ⚠ BANCO COMPARTILHADO: este projeto também hospeda outro sistema
-- (tabelas player_state, mapa_config, mapa_plano e funções mapa_*/touch_updated_at).
-- TODOS os objetos abaixo são exclusivos do Atlantis e não colidem com aquele sistema.
-- Nunca referencie/altere os objetos do outro sistema.

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
  description text,
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
  description text,
  image       text
);
create table public.foods (
  id          smallint primary key,        -- 0..5 (ver seed)
  slug        text unique not null,
  name        text not null,
  description text,
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
