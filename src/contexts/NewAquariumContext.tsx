import { createContext, ReactNode, useContext, useState } from "react"
import { AQUARIUM_PART, AQUARIUM_POSITION, NEW_AQUARIUM_STEP, REPRODUCTION, SUBSTRATE, TemperamentName, Fish, TEMPERAMENT, FOOD } from "../utils/constants"
export const NewAquariumContext = createContext({} as NewAquariumContextType)

type NewAquariumContextProviderProps = {
  children: ReactNode
}

type AquariumType = {
  image: string
  title: string
  description: string
}

type NewAquariumContextType = {
  aquarium: {}
  aquariums: AquariumType[]
  fishes: Fish[]
  currentStep: number
  setCurrentStep: (currentStep: number) => void
  aquariumPartSelected: number
  setAquariumPartSelected: (aquariumPartSelected: number) => void
  aquariumHeight: string
  setAquariumHeight: (aquariumHeight: string) => void
  aquariumWidth: string
  setAquariumWidth: (aquariumWidth: string) => void
  aquariumLength: string
  setAquariumLength: (aquariumLength: string) => void
  aquariumWater: string
  setAquariumWater: (aquariumWater: string) => void
  updateFishQuantity: (fishId: string, quantityUpdate: number) => void
}

export function NewAquariumContextProvider({ children }: NewAquariumContextProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(NEW_AQUARIUM_STEP.TYPE)
  const [aquariumPartSelected, setAquariumPartSelected] = useState(AQUARIUM_PART.HEIGHT)
  const [aquariumHeight, setAquariumHeight] = useState<string>('')
  const [aquariumWidth, setAquariumWidth] = useState<string>('')
  const [aquariumLength, setAquariumLength] = useState<string>('')
  const [aquariumWater, setAquariumWater] = useState<string>('')
  const [aquarium, setAquarium] = useState<{}>({
    size: {
      width: {
        min: 21,
        max: 40
      },
      height: {
        min: 15,
        max: 30
      }
    },
    volume: 20,
    temperature: [18, 23],
    ph: [6.5, 8],
    dgh: [4, 25],
    salinity: [0, 6],
    filter: 100,
    thermostat: 20,
    fishes: [
      {
        id: '32a8cbad-c0be-4f14-b57b-a19effe7a590',
        name: 'Betta',
        nameEn: 'Fighting fish',
        images: ['https://en.aqua-fish.net/imgs/fish/betta-fish-profile.jpg'],
        scientificName: 'Betta splendens',
        order: 'Perciformes',
        family: 'Osphronemidae',
        origin: 'Leste da Ásia',
        minimumShoal: 1,
        position: AQUARIUM_POSITION.TOP,
        reproduction: REPRODUCTION.OVIPAROUS,
        sexualDimorphism: 'sexualDimorphism',
        characteristics: 'characteristics',
        substrates: [SUBSTRATE.AREIA, SUBSTRATE.CASCALHO],
        temperamentSame: TEMPERAMENT.TERRITORIAL_TO_MALES,
        temperamentOthers: TEMPERAMENT.PEACEFUL_OTHERS,
        alimentation: 'alimentation',
        food: [FOOD.ARTEMIA, FOOD.FLOCO, FOOD.GRANULADA],
        foodQuantity: 3,
        size: 7,
        aquariumSize: {
          width: {
            min: 21,
            max: null
          },
          height: {
            min: 15,
            max: 30
          }
        },
        volumeFirst: 18,
        volumeAdditional: 18,
        temperature: [23, 30],
        ph: [6.2, 7.9],
        dgh: [4, 25],
        salinity: [0, 6],
        note: [
          'Um Betta vive em média de dois a cinco anos.',
          'O Betta macho pode ser agressivo com espécies mais agitadas.'
        ],
        quant: 2
      }
    ]
  })
  const [aquariums, setAquariums] = useState<AquariumType[]>([
    {
      image: '/aquariums/comunitario.jpg',
      title: 'Comunitário',
      description: 'Conjunto de espécies de peixes e plantas variados. O ambiente criado suporta peixes e plantas de inúmeras partes do mundo, como peixes americanos misturados com asiáticos por exemplo.'
    },
    {
      image: '/aquariums/mono.jpeg',
      title: 'Monoespécie',
      description: 'Peixes de apenas uma espécie.'
    },
    {
      image: '/aquariums/jumbo.webp',
      title: 'Jumbo',
      description: 'Peixes de médio e grande porte.'
    },
    {
      image: '/aquariums/biotipo.jpg',
      title: 'Temático ou Biotipo',
      description: 'Peixes de uma determinada região'
    },
    {
      image: '/aquariums/salobra.jpg',
      title: 'Água salobra',
      description: 'Peixes de mangues, estuários e rios salobros.'
    },
    {
      image: '/aquariums/ciclideos.webp',
      title: 'Ciclídeos Africanos',
      description: 'Peixes ciclídeos africanos.'
    },
    {
      image: '/aquariums/marinho.webp',
      title: 'Marinho',
      description: 'Peixes marinhos.'
    }
  ])
  const [fishes, setFishes] = useState<Fish[]>([
    {
      id: '32a8cbad-c0be-4f14-b57b-a19effe7a590',
      name: 'Betta',
      nameEn: 'Fighting fish',
      images: ['https://en.aqua-fish.net/imgs/fish/betta-fish-profile.jpg'],
      scientificName: 'Betta splendens',
      order: 'Perciformes',
      family: 'Osphronemidae',
      origin: 'Leste da Ásia',
      minimumShoal: 1,
      position: AQUARIUM_POSITION.TOP,
      reproduction: REPRODUCTION.OVIPAROUS,
      sexualDimorphism: 'sexualDimorphism',
      characteristics: 'characteristics',
      substrates: [SUBSTRATE.AREIA, SUBSTRATE.CASCALHO],
      temperamentSame: TEMPERAMENT.TERRITORIAL_TO_MALES,
      temperamentOthers: TEMPERAMENT.PEACEFUL_OTHERS,
      alimentation: 'alimentation',
      food: [FOOD.ARTEMIA, FOOD.FLOCO, FOOD.GRANULADA],
      foodQuantity: 3,
      size: 7,
      aquariumSize: {
        width: {
          min: 21,
          max: null
        },
        height: {
          min: 15,
          max: 30
        }
      },
      volumeFirst: 18,
      volumeAdditional: 18,
      temperature: [23, 30],
      ph: [6.2, 7.9],
      dgh: [4, 25],
      salinity: [0, 6],
      note: [
        'Um Betta vive em média de dois a cinco anos.',
        'O Betta macho pode ser agressivo com espécies mais agitadas.'
      ],
      quantity: 0
    },
    {
      id: 'aaad8714-458b-4483-b603-c4a87430a90c',
      name: 'Acará-azul',
      nameEn: 'Blue Acara',
      images: ['https://en.aqua-fish.net/imgs/fish/blue-acara-1.jpg'],
      scientificName: 'Aequidens pulcher',
      order: 'Perciformes',
      family: 'Cichlidae',
      origin: 'America Central',
      minimumShoal: 1,
      position: AQUARIUM_POSITION.MIDDLE,
      reproduction: REPRODUCTION.OVIPAROUS,
      sexualDimorphism: 'sexualDimorphism',
      characteristics: 'characteristics',
      substrates: [SUBSTRATE.AREIA, SUBSTRATE.CASCALHO],
      temperamentSame: TEMPERAMENT.PEACEFUL,
      temperamentOthers: TEMPERAMENT.TERRITORIAL_OTHERS,
      alimentation: 'alimentation',
      food: [FOOD.ARTEMIA, FOOD.FLOCO, FOOD.GRANULADA],
      foodQuantity: 1,
      size: 20,
      aquariumSize: {
        width: {
          min: 21,
          max: null
        },
        height: {
          min: 15,
          max: 30
        }
      },
      volumeFirst: 18,
      volumeAdditional: 18,
      temperature: [18, 23],
      ph: [6.5, 8],
      dgh: [4, 25],
      salinity: [0, 6],
      note: [],
      quantity: 0
    }
  ])

  function calculateFilter(aquariumVolume: number) {
    return aquariumVolume * 5
  }

  function calculateThermostat(aquariumVolume: number) {
    return aquariumVolume
  }

  function updateFishQuantity(fishId: string, quantityUpdate: number) {

    const fishUpdated = fishes.filter(fish => fish.id == fishId).map(fish => {
      if (fish.quantity != undefined && fish.quantity + quantityUpdate >= 0) {
        return { ...fish, quantity: fish.quantity + quantityUpdate }
      }
    })[0]

    if (fishUpdated == undefined) {
      return
    }
    console.log(fishUpdated)

    console.log(fishes.map(fish =>
      fish.id == fishId
        ? fishUpdated
        : fish
    ))

    setFishes(prevFishes =>
      prevFishes.map(fish =>
        fish.id == fishId
          ? fishUpdated
          : fish
      )
    )
    updateAquarium(fishUpdated)
  }

  function updateAquarium(fishUpdated: Fish) {
    console.log(fishes.reduce(aquariumFish =>
      aquariumFish.id == fishUpdated.id
        ? fishUpdated
        : aquariumFish
    ))

    setAquarium(prevAquarium => {
      if (fishUpdated.quantity == undefined || fishUpdated.quantity <= 0) {
        return {
          ...prevAquarium,
          fishes: prevAquarium.fishes.filter(aquariumFish =>
            aquariumFish.id != fishUpdated.id
          )
        }
      }
      if (!prevAquarium.fishes.find(aquariumFish => aquariumFish.id == fishUpdated.id)) {
        return {
          ...prevAquarium,
          fishes: prevAquarium.fishes.push(fishUpdated)
        }
      }
      return {
        ...prevAquarium,
        fishes: prevAquarium.fishes.map(aquariumFish =>
          aquariumFish.id == fishUpdated.id
            ? fishUpdated
            : aquariumFish
        )
      }
    }
    )
  }

  return (
    <NewAquariumContext.Provider
      value={{
        fishes,
        aquarium,
        currentStep,
        setCurrentStep,
        aquariums,
        aquariumPartSelected,
        setAquariumPartSelected,
        aquariumHeight,
        setAquariumHeight,
        aquariumWidth,
        setAquariumWidth,
        aquariumLength,
        setAquariumLength,
        aquariumWater,
        setAquariumWater,
        updateFishQuantity
      }}>
      {children}
    </NewAquariumContext.Provider>
  )
}

export const useNewAquariumContext = () => {
  return useContext(NewAquariumContext);
}