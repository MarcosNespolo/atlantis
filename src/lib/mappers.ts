// Mapeamento Row (snake_case, banco) ↔ domínio (camelCase, app). Funções PURAS.
// CLAUDE.md §9. Os tipos de Row vêm de src/types/database.ts (gerado).
import type { Database } from '../types/database'
import type { Fish, Profile, Substrate, Food, AquariumPlan } from '../domain/types'

type FishRow = Database['public']['Tables']['fish']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type SubstrateRow = Database['public']['Tables']['substrates']['Row']
type FoodRow = Database['public']['Tables']['foods']['Row']
type AquariumRow = Database['public']['Tables']['aquariums']['Row']

const num = (v: number | string | null | undefined): number => (v == null ? 0 : Number(v))
const numOrNull = (v: number | string | null | undefined): number | null => (v == null ? null : Number(v))

export function substrateRowToDomain(r: SubstrateRow): Substrate {
  return { id: r.id, slug: r.slug, name: r.name, description: r.description, image: r.image }
}

export function foodRowToDomain(r: FoodRow): Food {
  return { id: r.id, slug: r.slug, name: r.name, description: r.description, image: r.image }
}

export function profileRowToDomain(r: ProfileRow): Profile {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    image: r.image,
    description: r.description,
    link: r.link,
    role: r.role,
  }
}

// Row de fish possivelmente com joins N:N e specialist embutidos (ver select em services/fish.ts).
type FishRowJoined = FishRow & {
  fish_substrates?: { substrates: SubstrateRow | null }[] | null
  fish_foods?: { foods: FoodRow | null }[] | null
  specialist?: ProfileRow | null
}

export function fishRowToDomain(r: FishRowJoined): Fish {
  return {
    id: r.id,
    name: r.name,
    nameEn: r.name_en,
    scientificName: r.scientific_name,
    image: r.image,
    waterType: r.water_type,
    minimumShoal: r.minimum_shoal,
    position: r.position,
    temperamentSame: r.temperament_same,
    temperamentOthers: r.temperament_others,
    size: num(r.size),
    aquariumWidth: [numOrNull(r.aquarium_width_min), numOrNull(r.aquarium_width_max)],
    aquariumHeight: [numOrNull(r.aquarium_height_min), numOrNull(r.aquarium_height_max)],
    volumeFirst: num(r.volume_first),
    volumeAdditional: num(r.volume_additional),
    temperature: [num(r.temperature_min), num(r.temperature_max)],
    ph: [num(r.ph_min), num(r.ph_max)],
    dgh: [num(r.dgh_min), num(r.dgh_max)],
    salinity: [num(r.salinity_min), num(r.salinity_max)],
    note: r.note,
    substrates: (r.fish_substrates ?? [])
      .map((j) => j.substrates)
      .filter((s): s is SubstrateRow => s != null)
      .map(substrateRowToDomain),
    foods: (r.fish_foods ?? [])
      .map((j) => j.foods)
      .filter((f): f is FoodRow => f != null)
      .map(foodRowToDomain),
    specialist: r.specialist ? profileRowToDomain(r.specialist) : null,
  }
}

// Converte domínio Fish → colunas de fish (escrita). specialist_id é setado no servidor/rota.
export function fishDomainToRow(f: Fish): Database['public']['Tables']['fish']['Insert'] {
  return {
    name: f.name,
    name_en: f.nameEn ?? null,
    scientific_name: f.scientificName,
    image: f.image ?? null,
    water_type: f.waterType,
    minimum_shoal: f.minimumShoal,
    position: f.position,
    temperament_same: f.temperamentSame,
    temperament_others: f.temperamentOthers,
    size: f.size,
    aquarium_width_min: f.aquariumWidth?.[0] ?? null,
    aquarium_width_max: f.aquariumWidth?.[1] ?? null,
    aquarium_height_min: f.aquariumHeight?.[0] ?? null,
    aquarium_height_max: f.aquariumHeight?.[1] ?? null,
    volume_first: f.volumeFirst,
    volume_additional: f.volumeAdditional,
    temperature_min: f.temperature[0],
    temperature_max: f.temperature[1],
    ph_min: f.ph[0],
    ph_max: f.ph[1],
    dgh_min: f.dgh[0],
    dgh_max: f.dgh[1],
    salinity_min: f.salinity[0],
    salinity_max: f.salinity[1],
    note: f.note ?? null,
  }
}

export function aquariumRowToPlan(r: AquariumRow): AquariumPlan {
  return {
    id: r.id,
    userId: r.user_id,
    name: r.name,
    waterType: r.water_type,
    tankWidth: numOrNull(r.tank_width),
    tankHeight: numOrNull(r.tank_height),
    tankVolume: numOrNull(r.tank_volume),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}
