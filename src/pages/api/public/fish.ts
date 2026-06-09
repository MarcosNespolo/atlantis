import { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseServer } from '../../../lib/supabase/server'

// =============================================================================
// API PÚBLICA de povoamento de espécies — POST /api/public/fish
// -----------------------------------------------------------------------------
// Escreve usando a SERVICE ROLE (servidor), então NÃO depende de login e NÃO
// abre o banco a escrita pública (a RLS continua estrita; só este endpoint grava).
// Requer env SUPABASE_SERVICE_ROLE_KEY. Proteção opcional via header `x-api-key`
// comparado a env POPULATE_API_KEY (se definida). Ver API.md.
// Espécies são gravadas como RASCUNHO (specialist_id = null).
// =============================================================================

const WATER_TYPES = ['doce', 'salgada', 'salobra'] as const
const POSITIONS = ['fundo', 'meio', 'superficie'] as const
const TEMP_SAME = ['pacifico', 'territorial', 'territorial_femeas', 'territorial_machos'] as const
const TEMP_OTHERS = ['pacifico', 'territorial', 'agressivo_menores', 'agressivo_maiores'] as const

type Range = [number, number]
type NullableRange = [number | null, number | null]

type SpeciesInput = {
  name: string
  nameEn?: string | null
  scientificName: string
  image?: string | null
  waterType?: string
  minimumShoal?: number
  position: string
  temperamentSame?: string
  temperamentOthers?: string
  size: number
  aquariumWidth?: NullableRange | null
  aquariumHeight?: NullableRange | null
  volumeFirst: number
  volumeAdditional?: number
  temperature: Range
  ph: Range
  dgh: Range
  salinity?: Range
  note?: string | null
  substrates?: number[]
  foods?: number[]
}

const isRange = (v: any): v is Range =>
  Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number'

function validate(s: any): string | null {
  if (!s || typeof s !== 'object') return 'espécie deve ser um objeto'
  if (!s.name || typeof s.name !== 'string') return 'name (string) é obrigatório'
  if (!s.scientificName || typeof s.scientificName !== 'string') return 'scientificName (string) é obrigatório'
  if (!POSITIONS.includes(s.position)) return `position deve ser um de: ${POSITIONS.join(', ')}`
  if (s.waterType && !WATER_TYPES.includes(s.waterType)) return `waterType deve ser um de: ${WATER_TYPES.join(', ')}`
  if (s.temperamentSame && !TEMP_SAME.includes(s.temperamentSame)) return `temperamentSame inválido (${TEMP_SAME.join(', ')})`
  if (s.temperamentOthers && !TEMP_OTHERS.includes(s.temperamentOthers)) return `temperamentOthers inválido (${TEMP_OTHERS.join(', ')})`
  if (typeof s.size !== 'number') return 'size (number) é obrigatório'
  if (typeof s.volumeFirst !== 'number') return 'volumeFirst (number) é obrigatório'
  for (const k of ['temperature', 'ph', 'dgh']) {
    if (!isRange(s[k])) return `${k} deve ser [min, max] de números`
    if (s[k][1] < s[k][0]) return `${k}: max não pode ser menor que min`
  }
  if (s.salinity && !isRange(s.salinity)) return 'salinity deve ser [min, max]'
  return null
}

function toRow(s: SpeciesInput) {
  const w: NullableRange = s.aquariumWidth ?? [null, null]
  const h: NullableRange = s.aquariumHeight ?? [null, null]
  const sal: Range = s.salinity ?? [0, 0]
  return {
    name: s.name,
    name_en: s.nameEn ?? null,
    scientific_name: s.scientificName,
    image: s.image ?? null,
    water_type: s.waterType ?? 'doce',
    minimum_shoal: s.minimumShoal ?? 1,
    position: s.position,
    temperament_same: s.temperamentSame ?? 'pacifico',
    temperament_others: s.temperamentOthers ?? 'pacifico',
    size: s.size,
    aquarium_width_min: w[0],
    aquarium_width_max: w[1],
    aquarium_height_min: h[0],
    aquarium_height_max: h[1],
    volume_first: s.volumeFirst,
    volume_additional: s.volumeAdditional ?? 0,
    temperature_min: s.temperature[0],
    temperature_max: s.temperature[1],
    ph_min: s.ph[0],
    ph_max: s.ph[1],
    dgh_min: s.dgh[0],
    dgh_max: s.dgh[1],
    salinity_min: sal[0],
    salinity_max: sal[1],
    note: s.note ?? null,
    specialist_id: null,
  }
}

async function upsertOne(supabase: ReturnType<typeof getSupabaseServer>, s: SpeciesInput) {
  const row = toRow(s)
  const { data: existing } = await supabase
    .from('fish')
    .select('id')
    .eq('scientific_name', s.scientificName)
    .maybeSingle()

  let id: number
  let action: 'inserted' | 'updated'

  if (existing?.id) {
    id = existing.id
    const { error } = await supabase.from('fish').update(row).eq('id', id)
    if (error) throw new Error(error.message)
    await supabase.from('fish_substrates').delete().eq('fish_id', id)
    await supabase.from('fish_foods').delete().eq('fish_id', id)
    action = 'updated'
  } else {
    const { data, error } = await supabase.from('fish').insert(row).select('id').single()
    if (error || !data) throw new Error(error?.message ?? 'falha ao inserir')
    id = data.id
    action = 'inserted'
  }

  if (s.substrates?.length) {
    const { error } = await supabase.from('fish_substrates').insert(s.substrates.map((sid) => ({ fish_id: id, substrate_id: sid })))
    if (error) throw new Error(`substratos: ${error.message}`)
  }
  if (s.foods?.length) {
    const { error } = await supabase.from('fish_foods').insert(s.foods.map((fid) => ({ fish_id: id, food_id: fid })))
    if (error) throw new Error(`alimentos: ${error.message}`)
  }

  return { id, scientificName: s.scientificName, action }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Proteção opcional por chave compartilhada.
  const requiredKey = process.env.POPULATE_API_KEY
  if (requiredKey && req.headers['x-api-key'] !== requiredKey) {
    return res.status(401).json({ error: 'x-api-key inválida ou ausente' })
  }

  let supabase: ReturnType<typeof getSupabaseServer>
  try {
    supabase = getSupabaseServer()
  } catch (e: any) {
    return res.status(500).json({ error: e.message ?? 'SUPABASE_SERVICE_ROLE_KEY não configurada no servidor' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('fish')
      .select('id, name, scientific_name, water_type, specialist_id')
      .order('name')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ count: data?.length ?? 0, fish: data ?? [] })
  }

  if (req.method === 'POST') {
    const body = req.body
    const list: any[] = Array.isArray(body) ? body : Array.isArray(body?.fish) ? body.fish : [body]
    if (list.length === 0) return res.status(400).json({ error: 'envie uma espécie ou um array de espécies' })

    const results: any[] = []
    const errors: any[] = []
    for (let i = 0; i < list.length; i++) {
      const invalid = validate(list[i])
      if (invalid) {
        errors.push({ index: i, scientificName: list[i]?.scientificName, error: invalid })
        continue
      }
      try {
        results.push(await upsertOne(supabase, list[i] as SpeciesInput))
      } catch (e: any) {
        errors.push({ index: i, scientificName: list[i]?.scientificName, error: e.message })
      }
    }

    const status = errors.length === 0 ? 200 : results.length === 0 ? 400 : 207
    return res.status(status).json({ ok: errors.length === 0, inserted: results.filter(r => r.action === 'inserted').length, updated: results.filter(r => r.action === 'updated').length, results, errors })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Método não permitido' })
}
