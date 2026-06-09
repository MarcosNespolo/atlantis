// Gera supabase/seed.sql a partir de supabase/seed/species.json (fonte legível).
// Node puro (ESM), sem dependências novas.  Rodar: `npm run build:seed`.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'supabase', 'seed', 'species.json')
const out = join(root, 'supabase', 'seed.sql')

const data = JSON.parse(readFileSync(src, 'utf8'))

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const n = (v) => (v === null || v === undefined ? 'null' : String(v))
const smallintArr = (ids) => `array[${(ids ?? []).join(',')}]::smallint[]`

const lines = []
lines.push('-- GERADO por scripts/build-seed.mjs — NÃO editar à mão. Fonte: supabase/seed/species.json')
lines.push('-- ⚠ RASCUNHO: ' + data._meta.disclaimer)
lines.push('-- Catálogos (substrates/foods): upsert por id fixo. Espécies: idempotente (recria as de rascunho).')
lines.push('')

// ----- catálogos (upsert por id estável) -----
lines.push('insert into public.substrates (id, slug, name) values')
lines.push(data.substrates.map((s) => `  (${n(s.id)}, ${q(s.slug)}, ${q(s.name)})`).join(',\n'))
lines.push('on conflict (id) do update set slug = excluded.slug, name = excluded.name;')
lines.push('')
lines.push('insert into public.foods (id, slug, name) values')
lines.push(data.foods.map((f) => `  (${n(f.id)}, ${q(f.slug)}, ${q(f.name)})`).join(',\n'))
lines.push('on conflict (id) do update set slug = excluded.slug, name = excluded.name;')
lines.push('')

// ----- espécies: remove as de rascunho (specialist_id null) com estes nomes, e reinsere -----
const sciNames = data.species.map((s) => q(s.scientificName)).join(', ')
lines.push('-- limpa apenas espécies de seed (rascunho, sem especialista); não toca em espécies curadas')
lines.push(`delete from public.fish where specialist_id is null and scientific_name in (${sciNames});`)
lines.push('')

for (const s of data.species) {
  const [wMin, wMax] = s.aquariumWidth ?? [null, null]
  const [hMin, hMax] = s.aquariumHeight ?? [null, null]
  const [tMin, tMax] = s.temperature
  const [phMin, phMax] = s.ph
  const [dMin, dMax] = s.dgh
  const [sMin, sMax] = s.salinity
  lines.push(`-- ${s.scientificName}`)
  lines.push('with f as (')
  lines.push('  insert into public.fish (')
  lines.push('    name, name_en, scientific_name, water_type, minimum_shoal, position,')
  lines.push('    temperament_same, temperament_others, size,')
  lines.push('    aquarium_width_min, aquarium_width_max, aquarium_height_min, aquarium_height_max,')
  lines.push('    volume_first, volume_additional,')
  lines.push('    temperature_min, temperature_max, ph_min, ph_max, dgh_min, dgh_max, salinity_min, salinity_max,')
  lines.push('    note, specialist_id')
  lines.push('  ) values (')
  lines.push(`    ${q(s.name)}, ${q(s.nameEn)}, ${q(s.scientificName)}, ${q(s.waterType)}, ${n(s.minimumShoal)}, ${q(s.position)},`)
  lines.push(`    ${q(s.temperamentSame)}, ${q(s.temperamentOthers)}, ${n(s.size)},`)
  lines.push(`    ${n(wMin)}, ${n(wMax)}, ${n(hMin)}, ${n(hMax)},`)
  lines.push(`    ${n(s.volumeFirst)}, ${n(s.volumeAdditional)},`)
  lines.push(`    ${n(tMin)}, ${n(tMax)}, ${n(phMin)}, ${n(phMax)}, ${n(dMin)}, ${n(dMax)}, ${n(sMin)}, ${n(sMax)},`)
  lines.push(`    ${q(s.note)}, null`)
  lines.push('  ) returning id')
  lines.push('),')
  lines.push(`ins_sub as ( insert into public.fish_substrates (fish_id, substrate_id) select id, sub from f, unnest(${smallintArr(s.substrates)}) as sub )`)
  lines.push(`insert into public.fish_foods (fish_id, food_id) select id, fd from f, unnest(${smallintArr(s.foods)}) as fd;`)
  lines.push('')
}

writeFileSync(out, lines.join('\n') + '\n')
console.log(`seed.sql gerado: ${data.substrates.length} substrates, ${data.foods.length} foods, ${data.species.length} espécies (rascunho).`)
