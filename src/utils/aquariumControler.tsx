import { Aquarium, Fish } from "./types"
import { computeAquarium } from "../domain/aquarium"
import { fishLegacyToDomain } from "../lib/legacy"
import type { WaterType } from "../domain/types"

// NOTA (F8): as fórmulas e regras de conflito vivem em src/domain/aquarium.ts.
// Aqui só há helpers de UI (quantidade) + a ponte legado→domínio que alimenta o domínio.
// Os antigos calculate* foram removidos (estavam duplicados e com o bug de largura/altura — P2).

export function updateFishQuantity(fishId: number, quantityUpdate: number, fishes: Fish[], aquarium: Aquarium): { fishUpdated: Fish | undefined, aquariumUpdated: Aquarium | undefined } {

    const fishUpdated: Fish | undefined = fishes.filter(fish => fish.id == fishId).map(fish => {
        if (fish.quantity != undefined && fish.quantity + quantityUpdate >= 0) {
            return { ...fish, quantity: fish.quantity + quantityUpdate }
        }
    })[0]

    if (fishUpdated == undefined) {
        return { fishUpdated: undefined, aquariumUpdated: undefined }
    }

    const fishesUpdated = updateAquariumFishes(aquarium, fishUpdated)
    const aquariumUpdated = updateAquariumParameters(aquarium, fishesUpdated)

    return { fishUpdated, aquariumUpdated }
}

export function updateAquariumFishes(aquarium: Aquarium, fishUpdated: Fish): Fish[] {
    if (fishUpdated.quantity == undefined || fishUpdated.quantity <= 0) {
        return aquarium.fishes.filter(aquariumFish =>
            aquariumFish.id != fishUpdated.id
        )
    }

    if (!aquarium.fishes.find(aquariumFish => aquariumFish.id == fishUpdated.id)) {
        return [...aquarium.fishes, fishUpdated]
    }

    return aquarium.fishes.map(aquariumFish =>
        aquariumFish.id == fishUpdated.id
            ? fishUpdated
            : aquariumFish
    )
}

// Tipo de água do aquário inferido pela maioria das espécies (default doce).
function inferWaterType(fishes: Fish[]): WaterType {
    const counts: Record<string, number> = {}
    for (const f of fishes) {
        const w = f.waterType ?? 'doce'
        counts[w] = (counts[w] ?? 0) + 1
    }
    let best: WaterType = 'doce'
    let bestN = -1
    for (const w of Object.keys(counts)) {
        if (counts[w] > bestN) {
            bestN = counts[w]
            best = w as WaterType
        }
    }
    return best
}

// Recalcula TODOS os derivados + conflitos via domínio (fonte única de fórmulas).
export function updateAquariumParameters(aquarium: Aquarium, fishes: Fish[]): Aquarium {
    const withQty = fishes.filter(fish => (fish.quantity ?? 0) > 0)
    const domainFishes = withQty.map(fishLegacyToDomain)
    const waterType = inferWaterType(withQty)
    const computed = computeAquarium(domainFishes, waterType)

    return {
        ...aquarium,
        volume: computed.volume,
        temperature: computed.temperature,
        ph: computed.ph,
        salinity: computed.salinity,
        dgh: computed.dgh,
        filter: computed.filter,
        thermostat: computed.thermostat,
        width: computed.width,
        height: computed.height,
        fishes: fishes,
        conflicts: computed.conflicts,
    }
}
