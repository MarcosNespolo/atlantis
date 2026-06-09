// Contratos de domínio do Atlantis (fonte de verdade entre módulos). CLAUDE.md §5.
// Tipos de DOMÍNIO em camelCase (app). O mapeamento Row(snake_case)↔domínio vive
// em src/lib/mappers.ts (F7). Nenhuma fórmula aqui — só tipos.

export type Range = [number, number] // [min, max]
export type NullableRange = [number | null, number | null]

export type UserRole = 'aquarista' | 'especialista' | 'admin'
export type WaterType = 'doce' | 'salgada' | 'salobra'
export type FishPosition = 'fundo' | 'meio' | 'superficie'
export type TemperamentSame = 'pacifico' | 'territorial' | 'territorial_femeas' | 'territorial_machos'
export type TemperamentOthers = 'pacifico' | 'territorial' | 'agressivo_menores' | 'agressivo_maiores'

export interface Profile {
  id: string
  name: string
  email?: string | null
  image?: string | null
  description?: string | null
  link?: string | null
  role: UserRole
}

export interface Substrate {
  id: number
  slug: string
  name: string
  description?: string | null
  image?: string | null
}
export interface Food {
  id: number
  slug: string
  name: string
  description?: string | null
  image?: string | null
}

export interface Fish {
  id: number
  name: string
  nameEn?: string | null
  scientificName: string
  image?: string | null
  waterType: WaterType
  minimumShoal: number
  position: FishPosition
  temperamentSame: TemperamentSame
  temperamentOthers: TemperamentOthers
  size: number // cm
  aquariumWidth: NullableRange // cm [min,max]
  aquariumHeight: NullableRange // cm [min,max]
  volumeFirst: number // L
  volumeAdditional: number // L
  temperature: Range // °C
  ph: Range
  dgh: Range // °dGH
  salinity: Range // ppt
  note?: string | null
  substrates?: Substrate[] | null
  foods?: Food[] | null
  specialist?: Profile | null // assinatura/atribuição
  quantity?: number // só no contexto do planejador
}

export interface AquariumPlan {
  // identidade persistida
  id?: number
  userId: string
  name: string
  waterType: WaterType
  tankWidth?: number | null
  tankHeight?: number | null
  tankVolume?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface AquariumItem {
  fishId: number
  quantity: number
} // = aquarium_fish

// ----- saída DERIVADA do domínio (não persiste) -----
export type ConflictKind =
  | 'temperature'
  | 'ph'
  | 'dgh'
  | 'salinity'
  | 'width'
  | 'height'
  | 'water_type'
  | 'temperament'
  | 'shoal'

export interface Conflict {
  kind: ConflictKind
  message: string // POR QUE quebrou (PT, pronto p/ UI)
  fishIds: number[] // espécies envolvidas (p/ destacar em vermelho)
  detail?: { min?: number; max?: number; expected?: number; actual?: number }
}

export interface AquariumComputed {
  volume: number // L mínimo
  filter: number // l/h
  thermostat: number // W
  temperature: Range
  ph: Range
  dgh: Range
  salinity: Range
  width: NullableRange
  height: NullableRange
  conflicts: Conflict[] // vazio = compatível
}

export type AlertCode = 0 | 1 | 2 // WARNING | DANGER | SUCCESS
export interface AlertMessage {
  code: AlertCode
  message: string
}
