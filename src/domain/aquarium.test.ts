import { describe, it, expect } from 'vitest'
import {
  calcMinVolume,
  calcFilterLh,
  calcHeaterW,
  aggregateRange,
  aggregateDimension,
  computeAquarium,
} from './aquarium'
import type { Fish, WaterType } from './types'

// fábrica de peixe para os testes (valores neutros, sobrescritos por `over`)
function fish(over: Partial<Fish> & { id: number; quantity?: number }): Fish & { quantity: number } {
  return {
    name: `peixe-${over.id}`,
    nameEn: null,
    scientificName: `sp ${over.id}`,
    image: null,
    waterType: 'doce',
    minimumShoal: 1,
    position: 'meio',
    temperamentSame: 'pacifico',
    temperamentOthers: 'pacifico',
    size: 5,
    aquariumWidth: [null, null],
    aquariumHeight: [null, null],
    volumeFirst: 20,
    volumeAdditional: 5,
    temperature: [22, 28],
    ph: [6.5, 7.5],
    dgh: [5, 15],
    salinity: [0, 0],
    note: null,
    quantity: 1,
    ...over,
  }
}

describe('fórmulas numéricas (exemplos do TCC)', () => {
  it('filtro = volume × 5 e termostato = volume × 1', () => {
    expect(calcFilterLh(18)).toBe(90)
    expect(calcHeaterW(18)).toBe(18)
    expect(calcFilterLh(42)).toBe(210)
    expect(calcHeaterW(42)).toBe(42)
    expect(calcFilterLh(168)).toBe(840)
    expect(calcHeaterW(168)).toBe(168)
  })

  it('volume mínimo = Σ [volumeFirst + (q-1)·volumeAdditional]', () => {
    // 1 peixe volumeFirst 18 → 18
    expect(calcMinVolume([{ volumeFirst: 18, volumeAdditional: 5, quantity: 1 }])).toBe(18)
    // 6 neons (40 + 5×3) = 55  +  1 betta (20) = 75
    expect(
      calcMinVolume([
        { volumeFirst: 40, volumeAdditional: 3, quantity: 6 },
        { volumeFirst: 20, volumeAdditional: 10, quantity: 1 },
      ]),
    ).toBe(40 + 5 * 3 + 20)
  })

  it('aggregateRange faz interseção [max(mins), min(maxs)]', () => {
    expect(aggregateRange([[22, 28], [24, 30]])).toEqual([24, 28])
  })

  it('aggregateDimension ignora nulos e faz interseção (corrige P2)', () => {
    // largura: um exige ≥40, outro permite ≤60, terceiro sem limite → [40,60]
    expect(
      aggregateDimension([
        [40, null],
        [null, 60],
        [null, null],
      ]),
    ).toEqual([40, 60])
  })
})

describe('conflitos do domínio', () => {
  it('temperatura sem faixa comum → 1 Conflict(temperature) com os 2 fishIds', () => {
    const items = [
      fish({ id: 1, temperature: [27, 30] }), // precisa quente
      fish({ id: 2, temperature: [20, 24] }), // tolera frio
    ]
    const r = computeAquarium(items, 'doce')
    const temp = r.conflicts.filter((c) => c.kind === 'temperature')
    expect(temp).toHaveLength(1)
    expect(temp[0].fishIds.sort()).toEqual([1, 2])
  })

  it('agressivo_menores vs espécie menor → Conflict(temperament)', () => {
    const items = [
      fish({ id: 1, size: 15, temperamentOthers: 'agressivo_menores' }),
      fish({ id: 2, size: 4 }),
    ]
    const r = computeAquarium(items, 'doce')
    const t = r.conflicts.filter((c) => c.kind === 'temperament')
    expect(t.length).toBeGreaterThanOrEqual(1)
    expect(t[0].fishIds).toContain(1)
    expect(t[0].fishIds).toContain(2)
  })

  it('misturar doce + salgada → Conflict(water_type)', () => {
    const items = [
      fish({ id: 1, waterType: 'doce' }),
      fish({ id: 2, waterType: 'salgada' }),
    ]
    const r = computeAquarium(items, 'doce' as WaterType)
    const wt = r.conflicts.filter((c) => c.kind === 'water_type')
    expect(wt).toHaveLength(1)
    expect(wt[0].fishIds).toEqual([2])
  })

  it('quantidade abaixo do cardume mínimo → Conflict(shoal)', () => {
    const items = [fish({ id: 1, minimumShoal: 6, quantity: 2 })]
    const r = computeAquarium(items, 'doce')
    const s = r.conflicts.filter((c) => c.kind === 'shoal')
    expect(s).toHaveLength(1)
    expect(s[0].detail).toMatchObject({ expected: 6, actual: 2 })
  })

  it('aquário compatível → zero conflitos e derivados corretos', () => {
    const items = [fish({ id: 1, volumeFirst: 18, quantity: 1 })]
    const r = computeAquarium(items, 'doce')
    expect(r.conflicts).toHaveLength(0)
    expect(r.volume).toBe(18)
    expect(r.filter).toBe(90)
    expect(r.thermostat).toBe(18)
  })
})
