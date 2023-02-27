import { Aquarium, Fish } from "./types"

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


export function updateAquariumParameters(aquarium: Aquarium, fishes: Fish[]) {
    const volumeUpdated = calculateVolume(fishes)

    const aquariumUpdated: Aquarium = {
        ...aquarium,
        volume: volumeUpdated,
        temperature: calculateTemperature(fishes),
        ph: calculatePh(fishes),
        salinity: calculateSalinity(fishes),
        dgh: calculateDgh(fishes),
        filter: calculateFilter(volumeUpdated),
        thermostat: calculateThermostat(volumeUpdated),
        width: calculateWidth(fishes),
        height: calculateHeight(fishes),
        fishes: fishes
    }

    return aquariumUpdated
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


export function calculateFilter(aquariumVolume: number) {
    return aquariumVolume * 5
}

export function calculateThermostat(aquariumVolume: number) {
    return aquariumVolume
}

export function calculateVolume(fishes: Fish[]) {
    return fishes.reduce((volume: number, fish: Fish) => {
        if (fish.quantity == undefined) {
            return volume
        }
        if (fish.quantity > 1) {
            return volume + fish.volumeFirst + ((fish.quantity - 1) * fish.volumeAdditional)
        }
        if (fish.quantity == 1) {
            return volume + fish.volumeFirst
        }
        return volume
    }, 0)
}

export function calculateTemperature(fishes: Fish[]) {
    let temperature = [0, 90]

    fishes.forEach((fish: Fish) => {
        if (fish.temperature == undefined) {
            return
        }
        if (fish.temperature[0] > temperature[0]) {
            temperature[0] = fish.temperature[0]
        }
        if (fish.temperature[1] < temperature[1]) {
            temperature[1] = fish.temperature[1]
        }
    }, 0)

    return temperature
}

export function calculatePh(fishes: Fish[]) {
    let ph = [0, 14]

    fishes.forEach((fish: Fish) => {
        if (fish.ph == undefined) {
            return
        }
        if (fish.ph[0] > ph[0]) {
            ph[0] = fish.ph[0]
        }
        if (fish.ph[1] < ph[1]) {
            ph[1] = fish.ph[1]
        }
    }, 0)

    return ph
}

export function calculateSalinity(fishes: Fish[]) {
    let salinity = [0, 33]

    fishes.forEach((fish: Fish) => {
        if (fish.salinity == undefined) {
            return
        }
        if (fish.salinity[0] > salinity[0]) {
            salinity[0] = fish.salinity[0]
        }
        if (fish.salinity[1] < salinity[1]) {
            salinity[1] = fish.salinity[1]
        }
    }, 0)

    return salinity
}

export function calculateDgh(fishes: Fish[]) {
    let dgh = [0, 33]

    fishes.forEach((fish: Fish) => {
        if (fish.dgh == undefined) {
            return
        }
        if (fish.dgh[0] > dgh[0]) {
            dgh[0] = fish.dgh[0]
        }
        if (fish.dgh[1] < dgh[1]) {
            dgh[1] = fish.dgh[1]
        }
    }, 0)

    return dgh
}

export function calculateWidth(fishes: Fish[]) {
    let width: number[] | null[] = [null, null]

    fishes.forEach((fish: Fish) => {
        if (!(fish.aquariumWidth && fish.aquariumWidth.length == 2)) {
            return
        }
        if (fish.aquariumWidth[0] && (width[0] == null || fish.aquariumWidth[0] < width[0])) {
            width[0] = fish.aquariumWidth[0]
        }
        if (fish.aquariumWidth[1] && (width[1] == null || fish.aquariumWidth[1] > width[1])) {
            width[1] = fish.aquariumWidth[1]
        }
    }, 0)

    return width
}

export function calculateHeight(fishes: Fish[]) {
    let height: number[] | null[] = [null, null]

    fishes.forEach((fish: Fish) => {
        if (!(fish.aquariumHeight && fish.aquariumHeight.length == 2)) {
            return
        }
        if (fish.aquariumHeight[0] && (height[0] == null || fish.aquariumHeight[0] < height[0])) {
            height[0] = fish.aquariumHeight[0]
        }
        if (fish.aquariumHeight[1] && (height[1] == null || fish.aquariumHeight[1] < height[1])) {
            height[1] = fish.aquariumHeight[1]
        }
    }, 0)

    return height
}
