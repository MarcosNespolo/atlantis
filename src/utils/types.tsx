export type Fish = {
    id: number
    name: string
    image: string
    nameEn: string
    scientificName: string
    minimumShoal: number
    position: number
    substrates: Substrate[] | null
    temperamentSame: number
    temperamentOthers: number
    food: Food[] | null
    size: number
    aquariumWidth: (number | null)[]
    aquariumHeight: (number | null)[]
    volumeFirst: number
    volumeAdditional: number
    temperature: number[]
    ph: number[]
    dgh: number[]
    salinity: number[]
    note: string
    quantity?: number
    specialist?: User | null
}

export type FishBD = {
    fish_id: number
    name: string
    name_en: string
    image: string
    scientific_name: string
    minimum_shoal: number
    position: number
    temperament_same: number
    temperament_others: number
    size: number
    aquarium_width_min: number | null
    aquarium_width_max: number | null
    aquarium_height_min: number | null
    aquarium_height_max: number | null
    volume_first: number
    volume_additional: number
    temperature_min: number
    temperature_max: number
    ph_min: number
    ph_max: number
    dgh_min: number
    dgh_max: number
    salinity_min: number
    salinity_max: number
    food_id?: number | null
    substrate_id?: number | null
    food?: Food | null
    substrate?: Substrate | null
    note: string
    quantity?: number
    specialist?: User | null
    specialist_id?: number | null
}

export type Aquarium = {
    aquarium_id?: number
    name?: string
    created?: string
    width: (number | null)[]
    height: (number | null)[]
    volume: number
    temperature: (number | null)[]
    ph: (number | null)[]
    dgh:(number | null)[]
    salinity: (number | null)[]
    filter: number
    thermostat: number
    fishes: Fish[]
}

export type Substrate = {
    substrate_id?: string
    name: string
    description: string
    image?: string
}

export type Food = {
    food_id?: string
    name: string
    description: string
    image?: string
}

export type AlertMessage = {
    code: number
    message: string
}

export type User = {
    user_id?: number
    name: string
    email: string
    image?: string
    description?: string
    link?: string
    role_id?: number
}

export type AquariumBD = {
    aquarium_id?: number
    name?: string
    created_at?: any
    user_id: number
}

export type AquariumFishBD = {
    aquarium_id: number
    fish_id: number
    quantity: number
}