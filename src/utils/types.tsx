export type Fish = {
    id: string
    name: string
    image: string
    nameEn: string
    scientificName: string
    minimumShoal: number
    position: number
    substrates: number[]
    temperamentSame: number
    temperamentOthers: number
    food: number[]
    size: number
    aquariumWidth: (number | null)[]
    aquariumHeight: (number | null)[]
    volumeFirst: number
    volumeAdditional: number
    temperature: number[]
    ph: number[]
    dgh: number[]
    salinity: number[]
    note?: string[]
    quantity?: number
}

export type Aquarium = {
    id: string
    width: (number | null)[]
    height: (number | null)[]
    volume: number
    temperature: number[]
    ph: number[]
    dgh: number[]
    salinity: number[]
    filter: number
    thermostat: number
    fishes: Fish[]
}

export type Substrate = {
    id?: string
    name: string
    description: string
    image?: string
}

export type Food = {
    id?: string
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
    password: string
    image?: string
    description?: string
    link?: string
    role_id?: number
}