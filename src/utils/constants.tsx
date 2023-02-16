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