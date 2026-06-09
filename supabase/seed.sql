-- GERADO por scripts/build-seed.mjs — NÃO editar à mão. Fonte: supabase/seed/species.json
-- ⚠ RASCUNHO: RASCUNHO — valores de espécie compilados de fontes de hobby, NÃO validados nem assinados por especialista credenciado. specialist_id permanece NULL até curadoria. Ver CLAUDE.md §1 e §8.
-- Catálogos (substrates/foods): upsert por id fixo. Espécies: idempotente (recria as de rascunho).

insert into public.substrates (id, slug, name) values
  (0, 'sem_substrato', 'Sem substrato'),
  (1, 'cascalho', 'Cascalho'),
  (2, 'humus', 'Humus'),
  (3, 'areia', 'Areia'),
  (4, 'aragonita', 'Aragonita'),
  (5, 'basalto', 'Basalto'),
  (6, 'turfa', 'Turfa')
on conflict (id) do update set slug = excluded.slug, name = excluded.name;

insert into public.foods (id, slug, name) values
  (0, 'pastilha', 'Pastilha'),
  (1, 'granulada', 'Granulada'),
  (2, 'floco', 'Floco'),
  (3, 'tablet', 'Tablet'),
  (4, 'farinha', 'Farinha'),
  (5, 'artemia', 'Artemia')
on conflict (id) do update set slug = excluded.slug, name = excluded.name;

-- limpa apenas espécies de seed (rascunho, sem especialista); não toca em espécies curadas
delete from public.fish where specialist_id is null and scientific_name in ('Betta splendens', 'Trichogaster trichopterus', 'Paracheirodon innesi', 'Poecilia reticulata', 'Pterophyllum scalare', 'Corydoras aeneus');

-- Betta splendens
with f as (
  insert into public.fish (
    name, name_en, scientific_name, water_type, minimum_shoal, position,
    temperament_same, temperament_others, size,
    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,
    volume_first, volume_additional,
    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,
    note, specialist_id
  ) values (
    'Betta', 'Siamese fighting fish', 'Betta splendens', 'doce', 1, 'superficie',
    'territorial_machos', 'territorial', 6.5,
    null, null, null, null,
    20, 10,
    24, 28, 6, 7.5, 5, 20, 0, 0,
    'Rascunho. Machos não convivem entre si. Prefere água parada e morna.', null
  ) returning id
),
ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(array[1,2,3]::smallint[]) as sub )
insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(array[2,1,5]::smallint[]) as fd;

-- Trichogaster trichopterus
with f as (
  insert into public.fish (
    name, name_en, scientific_name, water_type, minimum_shoal, position,
    temperament_same, temperament_others, size,
    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,
    volume_first, volume_additional,
    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,
    note, specialist_id
  ) values (
    'Tricogáster-azul', 'Three spot gourami', 'Trichogaster trichopterus', 'doce', 1, 'meio',
    'territorial', 'pacifico', 12,
    null, null, null, null,
    80, 40,
    22, 28, 6, 8, 5, 25, 0, 0,
    'Rascunho. Respira ar atmosférico (labirinto); tolera ampla faixa.', null
  ) returning id
),
ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(array[1,2,3]::smallint[]) as sub )
insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(array[2,1,0]::smallint[]) as fd;

-- Paracheirodon innesi
with f as (
  insert into public.fish (
    name, name_en, scientific_name, water_type, minimum_shoal, position,
    temperament_same, temperament_others, size,
    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,
    volume_first, volume_additional,
    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,
    note, specialist_id
  ) values (
    'Neon', 'Neon tetra', 'Paracheirodon innesi', 'doce', 6, 'meio',
    'pacifico', 'pacifico', 3.5,
    null, null, null, null,
    40, 3,
    20, 26, 5, 7, 1, 10, 0, 0,
    'Rascunho. Espécie de cardume (mín. 6). Água mole e levemente ácida.', null
  ) returning id
),
ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(array[2,3,6]::smallint[]) as sub )
insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(array[2,1,5]::smallint[]) as fd;

-- Poecilia reticulata
with f as (
  insert into public.fish (
    name, name_en, scientific_name, water_type, minimum_shoal, position,
    temperament_same, temperament_others, size,
    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,
    volume_first, volume_additional,
    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,
    note, specialist_id
  ) values (
    'Guppy', 'Guppy', 'Poecilia reticulata', 'doce', 3, 'superficie',
    'pacifico', 'pacifico', 5,
    null, null, null, null,
    40, 4,
    22, 28, 6.8, 7.8, 8, 25, 0, 0,
    'Rascunho. Prolífico (vivíparo); prefere água dura e alcalina.', null
  ) returning id
),
ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(array[1,3]::smallint[]) as sub )
insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(array[2,1,5]::smallint[]) as fd;

-- Pterophyllum scalare
with f as (
  insert into public.fish (
    name, name_en, scientific_name, water_type, minimum_shoal, position,
    temperament_same, temperament_others, size,
    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,
    volume_first, volume_additional,
    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,
    note, specialist_id
  ) values (
    'Acará-bandeira', 'Angelfish', 'Pterophyllum scalare', 'doce', 1, 'meio',
    'territorial', 'agressivo_menores', 15,
    null, null, 40, null,
    120, 40,
    24, 30, 6, 7.5, 3, 15, 0, 0,
    'Rascunho. Corpo alto exige aquário alto (≥40 cm). Predador de peixes muito pequenos (ex.: neon).', null
  ) returning id
),
ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(array[2,3]::smallint[]) as sub )
insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(array[2,1,0,5]::smallint[]) as fd;

-- Corydoras aeneus
with f as (
  insert into public.fish (
    name, name_en, scientific_name, water_type, minimum_shoal, position,
    temperament_same, temperament_others, size,
    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,
    volume_first, volume_additional,
    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,
    note, specialist_id
  ) values (
    'Coredora-bronze', 'Bronze corydoras', 'Corydoras aeneus', 'doce', 6, 'fundo',
    'pacifico', 'pacifico', 6.5,
    null, null, null, null,
    50, 8,
    22, 26, 6, 7.5, 2, 15, 0, 0,
    'Rascunho. Espécie de cardume de fundo (mín. 6). Exige substrato de areia para não ferir os barbilhões.', null
  ) returning id
),
ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(array[3]::smallint[]) as sub )
insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(array[0,3,2]::smallint[]) as fd;

