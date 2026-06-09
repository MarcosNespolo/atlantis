// CORAÇÃO do Atlantis: TODAS as fórmulas e regras de compatibilidade num só lugar.
// Funções PURAS (sem React, sem I/O). CLAUDE.md §6. Erro aqui = peixe morto.
import type {
  Range,
  NullableRange,
  WaterType,
  Fish,
  Conflict,
  ConflictKind,
  AquariumComputed,
} from './types'

type Item = Fish & { quantity: number }

// ---------- fórmulas numéricas ----------

export function calcMinVolume(
  items: { volumeFirst: number; volumeAdditional: number; quantity: number }[],
): number {
  // Σ_i [ volumeFirst_i + max(0, quantity_i − 1) · volumeAdditional_i ]
  return items.reduce((sum, it) => {
    const q = Math.max(0, it.quantity ?? 0)
    if (q <= 0) return sum
    return sum + it.volumeFirst + Math.max(0, q - 1) * it.volumeAdditional
  }, 0)
}

export function calcFilterLh(volume: number): number {
  return volume * 5 // turnover 5×/h
}

export function calcHeaterW(volume: number): number {
  return volume * 1 // 1 W/L
}

// Interseção das tolerâncias: [max(mins), min(maxs)]. Se min > max → faixa vazia.
export function aggregateRange(ranges: Range[]): Range {
  if (ranges.length === 0) return [0, 0]
  return [Math.max(...ranges.map((r) => r[0])), Math.min(...ranges.map((r) => r[1]))]
}

// Mesma semântica de interseção, ignorando bounds nulos (CORRIGE o bug da v1 — P2).
export function aggregateDimension(ranges: NullableRange[]): NullableRange {
  const mins = ranges.map((r) => r[0]).filter((v): v is number => v != null)
  const maxs = ranges.map((r) => r[1]).filter((v): v is number => v != null)
  return [mins.length ? Math.max(...mins) : null, maxs.length ? Math.min(...maxs) : null]
}

// ---------- helpers internos ----------

const names = (items: Item[]) => items.map((i) => i.name).join(', ')
const uniqueIds = (items: Item[]) => Array.from(new Set(items.map((i) => i.id)))
const waterLabel: Record<WaterType, string> = { doce: 'doce', salgada: 'salgada', salobra: 'salobra' }

function rangeConflict(
  kind: ConflictKind,
  label: string,
  unit: string,
  items: Item[],
  get: (i: Item) => Range,
): Conflict | null {
  if (items.length < 2) return null
  const floor = Math.max(...items.map((i) => get(i)[0]))
  const ceil = Math.min(...items.map((i) => get(i)[1]))
  if (floor <= ceil) return null
  const needHigher = items.filter((i) => get(i)[0] === floor)
  const needLower = items.filter((i) => get(i)[1] === ceil)
  const u = unit ? ` ${unit}` : ''
  return {
    kind,
    fishIds: uniqueIds([...needHigher, ...needLower]),
    message: `${label} sem faixa comum: ${names(needHigher)} precisa ≥ ${floor}${u}, ${names(needLower)} tolera ≤ ${ceil}${u}.`,
    detail: { min: floor, max: ceil },
  }
}

function dimensionConflict(
  kind: ConflictKind,
  label: string,
  items: Item[],
  get: (i: Item) => NullableRange,
): Conflict | null {
  const withMin = items.filter((i) => get(i)[0] != null)
  const withMax = items.filter((i) => get(i)[1] != null)
  if (!withMin.length || !withMax.length) return null
  const floor = Math.max(...withMin.map((i) => get(i)[0] as number))
  const ceil = Math.min(...withMax.map((i) => get(i)[1] as number))
  if (floor <= ceil) return null
  const needHigher = withMin.filter((i) => get(i)[0] === floor)
  const needLower = withMax.filter((i) => get(i)[1] === ceil)
  return {
    kind,
    fishIds: uniqueIds([...needHigher, ...needLower]),
    message: `${label} sem faixa comum: ${names(needHigher)} exige ≥ ${floor} cm, ${names(needLower)} permite ≤ ${ceil} cm.`,
    detail: { min: floor, max: ceil },
  }
}

function temperamentConflicts(items: Item[]): Conflict[] {
  const out: Conflict[] = []
  for (const a of items) {
    // mesma espécie: territorial e há mais de um indivíduo
    const territorialSame =
      a.temperamentSame === 'territorial' ||
      a.temperamentSame === 'territorial_machos' ||
      a.temperamentSame === 'territorial_femeas'
    if (territorialSame && a.quantity > 1) {
      out.push({
        kind: 'temperament',
        fishIds: [a.id],
        message: `${a.name}: territorial com a própria espécie; manter ${a.quantity} indivíduos pode gerar disputa.`,
      })
    }

    const otherSpecies = items.filter((b) => b.id !== a.id)
    if (a.temperamentOthers === 'territorial' && otherSpecies.length > 0) {
      out.push({
        kind: 'temperament',
        fishIds: [a.id],
        message: `${a.name}: territorial com outras espécies no mesmo aquário.`,
      })
    }
    if (a.temperamentOthers === 'agressivo_menores') {
      const prey = otherSpecies.filter((b) => b.size < a.size)
      if (prey.length) {
        out.push({
          kind: 'temperament',
          fishIds: uniqueIds([a, ...prey]),
          message: `${a.name} é agressivo com espécies menores: ${names(prey)}.`,
        })
      }
    }
    if (a.temperamentOthers === 'agressivo_maiores') {
      const targets = otherSpecies.filter((b) => b.size > a.size)
      if (targets.length) {
        out.push({
          kind: 'temperament',
          fishIds: uniqueIds([a, ...targets]),
          message: `${a.name} é agressivo com espécies maiores: ${names(targets)}.`,
        })
      }
    }
  }
  return out
}

// ---------- orquestrador ----------

export function computeAquarium(rawItems: Item[], waterType: WaterType): AquariumComputed {
  const items = rawItems.filter((i) => (i.quantity ?? 0) > 0)

  if (items.length === 0) {
    return {
      volume: 0,
      filter: 0,
      thermostat: 0,
      temperature: [0, 0],
      ph: [0, 0],
      dgh: [0, 0],
      salinity: [0, 0],
      width: [null, null],
      height: [null, null],
      conflicts: [],
    }
  }

  const volume = calcMinVolume(items)
  const temperature = aggregateRange(items.map((i) => i.temperature))
  const ph = aggregateRange(items.map((i) => i.ph))
  const dgh = aggregateRange(items.map((i) => i.dgh))
  const salinity = aggregateRange(items.map((i) => i.salinity))
  const width = aggregateDimension(items.map((i) => i.aquariumWidth))
  const height = aggregateDimension(items.map((i) => i.aquariumHeight))

  const conflicts: Conflict[] = []

  // parâmetros de água (interseção vazia)
  for (const [kind, label, unit, get] of [
    ['temperature', 'Temperatura', '°C', (i: Item) => i.temperature],
    ['ph', 'pH', '', (i: Item) => i.ph],
    ['dgh', 'dGH', '°dGH', (i: Item) => i.dgh],
    ['salinity', 'Salinidade', 'ppt', (i: Item) => i.salinity],
  ] as [ConflictKind, string, string, (i: Item) => Range][]) {
    const c = rangeConflict(kind, label, unit, items, get)
    if (c) conflicts.push(c)
  }

  // dimensões (interseção vazia)
  const wc = dimensionConflict('width', 'Largura', items, (i) => i.aquariumWidth)
  if (wc) conflicts.push(wc)
  const hc = dimensionConflict('height', 'Altura', items, (i) => i.aquariumHeight)
  if (hc) conflicts.push(hc)

  // tipo de água divergente (P3)
  const wrongWater = items.filter((i) => i.waterType !== waterType)
  if (wrongWater.length) {
    conflicts.push({
      kind: 'water_type',
      fishIds: wrongWater.map((i) => i.id),
      message: `Tipo de água incompatível: o aquário é de água ${waterLabel[waterType]}, mas ${names(wrongWater)} não ${wrongWater.length > 1 ? 'são' : 'é'}.`,
    })
  }

  // cardume (P4-shoal)
  for (const it of items) {
    if (it.quantity < it.minimumShoal) {
      conflicts.push({
        kind: 'shoal',
        fishIds: [it.id],
        message: `${it.name}: espécie de cardume (mín. ${it.minimumShoal}); há apenas ${it.quantity}.`,
        detail: { expected: it.minimumShoal, actual: it.quantity },
      })
    }
  }

  // temperamento pairwise ciente de tamanho (P4)
  conflicts.push(...temperamentConflicts(items))

  return { volume, filter: calcFilterLh(volume), thermostat: calcHeaterW(volume), temperature, ph, dgh, salinity, width, height, conflicts }
}
