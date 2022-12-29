export const NEW_AQUARIUM_STEP = {
    TYPE: 0,
    SIZE: 1,
    FISH: 2
}

export const AQUARIUM_PART = {
    HEIGHT: 0,
    WIDTH: 1,
    LENGTH: 2,
    WATER: 3
}

export const AQUARIUM_POSITION = {
    TOP: 0,
    MIDDLE: 1,
    BOTTOM: 2
}

export const SUBSTRATE = {
    SEM_SUBSTRATO: 0,
    CASCALHO: 1,
    HUMUS: 2,
    AREIA: 3,
    ARAGONITA: 4,
    BASALTO: 5,
    TURFA: 6
}

export const SubstrateName = [
    'Sem substrato',
    'Cascalho',
    'Humus',
    'Areia',
    'Aragonita',
    'Basalto',
    'Turfa'
]

export const TEMPERAMENT = {
    PEACEFUL: 0,
    TERRITORIAL: 1,
    TERRITORIAL_TO_FEMALES: 2,
    TERRITORIAL_TO_MALES: 3,
    PEACEFUL_OTHERS: 4,
    TERRITORIAL_OTHERS: 5,
    AGGRESSIVE_TO_SMALLER: 6,
    AGGRESSIVE_TO_LARGER: 7
}

export const TemperamentName = [
    'Pacífico com a mesma espécie',
    'Territorialista com a mesma espécie',
    'Territorialista para fêmeas da mesma espécie',
    'Territorialista para machos da mesma espécie',
    'Pacífico com outras espécies',
    'Territorialista com outras espécies',
    'Agressivo com menores de outras espécies',
    'Agressivo com maiores de outras espécies'
]


export const REPRODUCTION = {
    OVIPAROUS: 0,
    LIVEBEARING: 1,
    OVOVIVIPAROUS: 2,
}

export const FOOD = {
    PASTILHA: 0,
    GRANULADA: 1,
    FLOCO: 2,
    TABLET: 3,
    FARINHA: 4,
    ARTEMIA: 5
}

export const FoodName = [
    'Pastilha',
    'Granulada',
    'Floco',
    'Tablet',
    'Farinha',
    'Artemia'
]

export type Fish = {
    id: string
    name: string
    images: string[]
    nameEn: string
    scientificName: String
    order: String
    family: string
    origin: string
    minimumShoal: number
    position: number
    reproduction: number
    sexualDimorphism: string
    characteristics: string
    substrates: number[]
    temperamentSame: number
    temperamentOthers: number
    alimentation: string
    food: number[]
    foodQuantity: number
    size: number
    aquariumSize: {
        width: {
            min: number | null
            max: number | null
        }
        height: {
            min: number | null
            max: number | null
        }
    }
    volumeFirst: number
    volumeAdditional: number
    temperature: number[]
    ph: number[]
    dgh: number[]
    salinity: number[]
    note?: string[]
    quantity?: number
}