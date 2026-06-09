// Gera public/fallback/species.json — snapshot estático para degradação graciosa (F13).
// Resolve substrates/foods (ids -> objetos) e produz o shape de domínio (camelCase) que a UI consome
// quando o Supabase está indisponível.  Node puro (ESM).  Rodar: `npm run build:fallback`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'supabase', 'seed', 'species.json')
const outDir = join(root, 'public', 'fallback')
const out = join(outDir, 'species.json')

const data = JSON.parse(readFileSync(src, 'utf8'))

const subById = new Map(data.substrates.map((s) => [s.id, s]))
const foodById = new Map(data.foods.map((f) => [f.id, f]))

// ids fictícios estáveis para o snapshot (o banco usa identity; aqui só precisamos de chaves únicas)
const species = data.species.map((s, i) => ({
  id: i + 1,
  name: s.name,
  nameEn: s.nameEn ?? null,
  scientificName: s.scientificName,
  image: s.image ?? null,
  waterType: s.waterType,
  minimumShoal: s.minimumShoal,
  position: s.position,
  temperamentSame: s.temperamentSame,
  temperamentOthers: s.temperamentOthers,
  size: s.size,
  aquariumWidth: s.aquariumWidth ?? [null, null],
  aquariumHeight: s.aquariumHeight ?? [null, null],
  volumeFirst: s.volumeFirst,
  volumeAdditional: s.volumeAdditional,
  temperature: s.temperature,
  ph: s.ph,
  dgh: s.dgh,
  salinity: s.salinity,
  note: s.note ?? null,
  substrates: (s.substrates ?? []).map((id) => subById.get(id)).filter(Boolean),
  foods: (s.foods ?? []).map((id) => foodById.get(id)).filter(Boolean),
  specialist: null,
}))

const snapshot = {
  generatedAt: new Date().toISOString(),
  draft: true,
  disclaimer: data._meta.disclaimer,
  substrates: data.substrates,
  foods: data.foods,
  species,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n')
console.log(`fallback gerado: public/fallback/species.json (${species.length} espécies).`)
