import { createContext, ReactNode, useContext, useState } from "react"
import { AQUARIUM_PART, AQUARIUM_POSITION, NEW_AQUARIUM_STEP, SUBSTRATE, TEMPERAMENT, FOOD, FISH_DEFAULT } from "../utils/constants"
import { Fish, Aquarium, Food, Substrate } from "../utils/types"

type NewAquariumContextProviderProps = {
  children: ReactNode
}

type AquariumType = {
  image: string
  title: string
  description: string
}

type NewAquariumContextType = {
  aquarium: Aquarium
  aquariums: AquariumType[]
  fishes: Fish[]
  setFishes: (fishes: Fish[]) => void
  food: Food[]
  setFood: (food: Food[]) => void
  substrate: Substrate[]
  setSubstrate: (substrate: Substrate[]) => void
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
  updateFishQuantity: (fishId: number, quantityUpdate: number) => void
}

export function NewAquariumContextProvider({ children }: NewAquariumContextProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(NEW_AQUARIUM_STEP.TYPE)
  const [aquariumPartSelected, setAquariumPartSelected] = useState(AQUARIUM_PART.HEIGHT)
  const [aquariumHeight, setAquariumHeight] = useState<string>('')
  const [aquariumWidth, setAquariumWidth] = useState<string>('')
  const [aquariumLength, setAquariumLength] = useState<string>('')
  const [aquariumWater, setAquariumWater] = useState<string>('')
  const [aquarium, setAquarium] = useState<Aquarium>({
    id: '0',
    width: [0, 0],
    height: [0, 0],
    volume: 0,
    temperature: [0, 0],
    ph: [0, 0],
    dgh: [0, 0],
    salinity: [0, 0],
    filter: 0,
    thermostat: 0,
    fishes: []
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
  const [fishes, setFishes] = useState<Fish[]>([])
  const [food, setFood] = useState<Food[]>([])
  const [substrate, setSubstrate] = useState<Substrate[]>([])

  function calculateFilter(aquariumVolume: number) {
    return aquariumVolume * 5
  }

  function calculateThermostat(aquariumVolume: number) {
    return aquariumVolume
  }

  function calculateVolume(fishes: Fish[]) {
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

  function calculateTemperature(fishes: Fish[]) {
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

  function calculatePh(fishes: Fish[]) {
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

  function calculateSalinity(fishes: Fish[]) {
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

  function calculateDgh(fishes: Fish[]) {
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

  function calculateWidth(fishes: Fish[]) {
    let width: number[] | null[] = [null, null]

    fishes.forEach((fish: Fish) => {
      if (fish.aquariumWidth[0] && (width[0] == null || fish.aquariumWidth[0] < width[0])) {
        width[0] = fish.aquariumWidth[0]
      }
      if (fish.aquariumWidth[1] && (width[1] == null || fish.aquariumWidth[1] > width[1])) {
        width[1] = fish.aquariumWidth[1]
      }
    }, 0)

    return width
  }

  function calculateHeight(fishes: Fish[]) {
    let height: number[] | null[] = [null, null]

    fishes.forEach((fish: Fish) => {
      if (fish.aquariumHeight[0] && (height[0] == null || fish.aquariumHeight[0] < height[0])) {
        height[0] = fish.aquariumHeight[0]
      }
      if (fish.aquariumHeight[1] && (height[1] == null || fish.aquariumHeight[1] < height[1])) {
        height[1] = fish.aquariumHeight[1]
      }
    }, 0)

    return height
  }

  function updateFishQuantity(fishId: number, quantityUpdate: number) {

    const fishUpdated = fishes.filter(fish => fish.id == fishId).map(fish => {
      if (fish.quantity != undefined && fish.quantity + quantityUpdate >= 0) {
        return { ...fish, quantity: fish.quantity + quantityUpdate }
      }
    })[0]

    if (fishUpdated == undefined) {
      return
    }

    setFishes(prevFishes =>
      prevFishes.map(fish =>
        fish.id == fishId
          ? fishUpdated
          : fish
      )
    )
    updateAquarium(fishUpdated)
  }

  function updateAquariumFishes(fishUpdated: Fish): Fish[] {
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

  function updateAquarium(fishUpdated: Fish) {
    const fishesUpdated = updateAquariumFishes(fishUpdated)
    const volumeUpdated = calculateVolume(fishesUpdated)

    const aquariumUpdated: Aquarium = {
      ...aquarium,
      volume: volumeUpdated,
      temperature: calculateTemperature(fishesUpdated),
      ph: calculatePh(fishesUpdated),
      salinity: calculateSalinity(fishesUpdated),
      dgh: calculateDgh(fishesUpdated),
      filter: calculateFilter(volumeUpdated),
      thermostat: calculateThermostat(volumeUpdated),
      width: calculateWidth(fishesUpdated),
      height: calculateHeight(fishesUpdated),
      fishes: fishesUpdated
    }

    setAquarium(aquariumUpdated)
  }

  return (
    <NewAquariumContext.Provider
      value={{
        fishes,
        setFishes,
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
        updateFishQuantity,
        food,
        setFood,
        substrate,
        setSubstrate
      }}>
      {children}
    </NewAquariumContext.Provider>
  )
}

export const useNewAquariumContext = () => {
  return useContext(NewAquariumContext);
}

export const NewAquariumContext = createContext({} as NewAquariumContextType)