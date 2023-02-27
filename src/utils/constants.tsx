import { Aquarium, Fish } from "./types"

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
    TOP: 1,
    MIDDLE: 2,
    BOTTOM: 3
}


export const AQUARIUM_POSITION_MAP = new Map([
    [AQUARIUM_POSITION.TOP, 'Topo'],
    [AQUARIUM_POSITION.MIDDLE, 'Meio'],
    [AQUARIUM_POSITION.BOTTOM, 'Fundo'],
])

export const SUBSTRATE = {
    SEM_SUBSTRATO: 0,
    CASCALHO: 1,
    HUMUS: 2,
    AREIA: 3,
    ARAGONITA: 4,
    BASALTO: 5,
    TURFA: 6
}

export const SUBSTRATE_NAME = [
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

export const TEMPERAMENT_NAME = [
    'Pacífico com a mesma espécie',
    'Territorialista com a mesma espécie',
    'Territorialista para fêmeas da mesma espécie',
    'Territorialista para machos da mesma espécie',
    'Pacífico com outras espécies',
    'Territorialista com outras espécies',
    'Agressivo com menores de outras espécies',
    'Agressivo com maiores de outras espécies'
]

export const TEMPERAMENT_SAME = new Map([
    [TEMPERAMENT.PEACEFUL, 'Pacífico com a mesma espécie'],
    [TEMPERAMENT.TERRITORIAL, 'Territorialista com a mesma espécie'],
    [TEMPERAMENT.TERRITORIAL_TO_FEMALES, 'Territorialista para fêmeas da mesma espécie'],
    [TEMPERAMENT.TERRITORIAL_TO_MALES, 'Territorialista para machos da mesma espécie'],
])

export const TEMPERAMENT_OTHERS = new Map([
    [TEMPERAMENT.PEACEFUL_OTHERS, 'Pacífico com outras espécies'],
    [TEMPERAMENT.TERRITORIAL_OTHERS, 'Territorialista com outras espécies'],
    [TEMPERAMENT.AGGRESSIVE_TO_SMALLER, 'Agressivo com menores de outras espécies'],
    [TEMPERAMENT.AGGRESSIVE_TO_LARGER, 'Agressivo com maiores de outras espécies'],
])

export const FOOD = {
    PASTILHA: 0,
    GRANULADA: 1,
    FLOCO: 2,
    TABLET: 3,
    FARINHA: 4,
    ARTEMIA: 5
}

export const FOOD_NAME = [
    'Pastilha',
    'Granulada',
    'Floco',
    'Tablet',
    'Farinha',
    'Artemia'
]

export const ALERT_MESSAGE_CODE = {
    WARNING: 0,
    DANGER: 1,
    SUCCESS: 2
}

export const REQUEST_TYPE = {
    SIGN_UP: 1,
    SIGN_IN: 2,
    SIGN_OUT: 3,
}

export const USER_ROLE = {
    AQUARIST: 1,
    SPECIALIST: 2,
    ADMINISTRATOR: 3,
}

export const USER_ROLE_MAP = new Map([
    [USER_ROLE.AQUARIST, 'Aquarista'],
    [USER_ROLE.SPECIALIST, 'Especialista'],
    [USER_ROLE.ADMINISTRATOR, 'Admnistrador']
])

export const FISH_DEFAULT: Fish = {
    id: 0,
    name: "",
    image: "",
    nameEn: "",
    scientificName: "",
    minimumShoal: 0,
    position: 0,
    substrates: null,
    temperamentSame: 0,
    temperamentOthers: 0,
    food: null,
    size: 0,
    aquariumWidth: [null, null],
    aquariumHeight: [null, null],
    volumeFirst: 0,
    volumeAdditional: 0,
    temperature: [0, 33],
    ph: [0, 14],
    dgh: [0, 30],
    salinity: [0, 33],
    note: "",
    specialist: null
}

export const ERROR_MESSAGE = {
    DEFAULT: 'Ops, algo deu errado. Tente novamente mais tarde.'
}

export const AQUARIUM_DEFAULT_PARAMETERS = {
    TEMPERATURE: [0, 33],
    PH: [0, 14],
    SALINITY: [0, 33],
    DGH: [0, 30]
}

export const AQUARIUM_DEFAULT: Aquarium = {
    width: [0, 0],
    height: [0, 0],
    volume: 0,
    temperature: AQUARIUM_DEFAULT_PARAMETERS.TEMPERATURE,
    ph: AQUARIUM_DEFAULT_PARAMETERS.PH,
    salinity: AQUARIUM_DEFAULT_PARAMETERS.SALINITY,
    dgh: AQUARIUM_DEFAULT_PARAMETERS.DGH,
    filter: 0,
    thermostat: 0,
    fishes: []
}