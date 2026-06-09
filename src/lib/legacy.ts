// PONTE TEMPORÁRIA: converte tipos de DOMÍNIO (src/domain/types) para os tipos
// ANTIGOS do app (src/utils/types, enums numéricos) que a UI atual ainda consome.
//
// Objetivo: permitir que os serviços leiam do schema NOVO mas devolvam o formato
// que o planejador/cards/páginas esperam HOJE, sem reescrever a UI ainda.
// Será REMOVIDA quando F8/F10/F12 migrarem a UI para os tipos de domínio.
import type { Fish as DomainFish, Substrate as DomainSubstrate, Food as DomainFood, Profile } from '../domain/types'
import type { Fish as LegacyFish, Substrate as LegacySubstrate, Food as LegacyFood, User } from '../utils/types'

// domínio (string) → enums numéricos da v1 (utils/constants)
const POSITION_TO_NUM: Record<DomainFish['position'], number> = { superficie: 1, meio: 2, fundo: 3 }
const TSAME_TO_NUM: Record<DomainFish['temperamentSame'], number> = {
  pacifico: 0,
  territorial: 1,
  territorial_femeas: 2,
  territorial_machos: 3,
}
const TOTHERS_TO_NUM: Record<DomainFish['temperamentOthers'], number> = {
  pacifico: 4,
  territorial: 5,
  agressivo_menores: 6,
  agressivo_maiores: 7,
}

export function substrateDomainToLegacy(s: DomainSubstrate): LegacySubstrate {
  return { substrate_id: String(s.id), name: s.name, description: s.description ?? '', image: s.image ?? undefined }
}

export function foodDomainToLegacy(f: DomainFood): LegacyFood {
  return { food_id: String(f.id), name: f.name, description: f.description ?? '', image: f.image ?? undefined }
}

function profileToUser(p: Profile): User {
  return {
    name: p.name,
    email: p.email ?? '',
    image: p.image ?? undefined,
    description: p.description ?? undefined,
    link: p.link ?? undefined,
  }
}

export function fishDomainToLegacy(d: DomainFish): LegacyFish {
  return {
    id: d.id,
    waterType: d.waterType,
    name: d.name,
    image: d.image ?? '',
    nameEn: d.nameEn ?? '',
    scientificName: d.scientificName,
    minimumShoal: d.minimumShoal,
    position: POSITION_TO_NUM[d.position],
    substrates: (d.substrates ?? []).map(substrateDomainToLegacy),
    temperamentSame: TSAME_TO_NUM[d.temperamentSame],
    temperamentOthers: TOTHERS_TO_NUM[d.temperamentOthers],
    food: (d.foods ?? []).map(foodDomainToLegacy),
    size: d.size,
    aquariumWidth: d.aquariumWidth,
    aquariumHeight: d.aquariumHeight,
    volumeFirst: d.volumeFirst,
    volumeAdditional: d.volumeAdditional,
    temperature: d.temperature,
    ph: d.ph,
    dgh: d.dgh,
    salinity: d.salinity,
    note: d.note ?? '',
    quantity: d.quantity,
    specialist: d.specialist ? profileToUser(d.specialist) : null,
  }
}

// Reverso: tipo legado (UI) → domínio, para alimentar computeAquarium no planejador.
const NUM_TO_POSITION: Record<number, DomainFish['position']> = { 1: 'superficie', 2: 'meio', 3: 'fundo' }
const NUM_TO_TSAME: Record<number, DomainFish['temperamentSame']> = {
  0: 'pacifico',
  1: 'territorial',
  2: 'territorial_femeas',
  3: 'territorial_machos',
}
const NUM_TO_TOTHERS: Record<number, DomainFish['temperamentOthers']> = {
  4: 'pacifico',
  5: 'territorial',
  6: 'agressivo_menores',
  7: 'agressivo_maiores',
}

export function fishLegacyToDomain(l: LegacyFish): DomainFish & { quantity: number } {
  return {
    id: l.id,
    name: l.name,
    nameEn: l.nameEn || null,
    scientificName: l.scientificName,
    image: l.image || null,
    waterType: l.waterType ?? 'doce',
    minimumShoal: l.minimumShoal,
    position: NUM_TO_POSITION[l.position] ?? 'meio',
    temperamentSame: NUM_TO_TSAME[l.temperamentSame] ?? 'pacifico',
    temperamentOthers: NUM_TO_TOTHERS[l.temperamentOthers] ?? 'pacifico',
    size: l.size,
    aquariumWidth: (l.aquariumWidth ?? [null, null]) as DomainFish['aquariumWidth'],
    aquariumHeight: (l.aquariumHeight ?? [null, null]) as DomainFish['aquariumHeight'],
    volumeFirst: l.volumeFirst,
    volumeAdditional: l.volumeAdditional,
    temperature: (l.temperature ?? [0, 0]) as DomainFish['temperature'],
    ph: (l.ph ?? [0, 0]) as DomainFish['ph'],
    dgh: (l.dgh ?? [0, 0]) as DomainFish['dgh'],
    salinity: (l.salinity ?? [0, 0]) as DomainFish['salinity'],
    note: l.note || null,
    substrates: (l.substrates ?? []).map((s) => ({
      id: Number(s.substrate_id) || 0,
      slug: '',
      name: s.name,
      description: s.description ?? null,
      image: s.image ?? null,
    })),
    foods: (l.food ?? []).map((f) => ({
      id: Number(f.food_id) || 0,
      slug: '',
      name: f.name,
      description: f.description ?? null,
      image: f.image ?? null,
    })),
    specialist: null,
    quantity: l.quantity ?? 0,
  }
}
