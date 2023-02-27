import { createContext, ReactNode, useContext, useState } from "react"
import { updateAquariumParameters, updateFishQuantity } from "../utils/aquariumControler"
import { AQUARIUM_PART, ALERT_MESSAGE_CODE, NEW_AQUARIUM_STEP, SUBSTRATE, TEMPERAMENT, FOOD, FISH_DEFAULT, AQUARIUM_DEFAULT } from "../utils/constants"
import { Fish, Aquarium, Food, Substrate, AlertMessage } from "../utils/types"

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
  setAquarium: (aquarium: Aquarium) => void
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
  updateAquarium: (fishId: number, quantityUpdate: number) => void
  saveAquarium: () => Promise<AlertMessage>
  loadAquarium: (aquariumLoaded: Aquarium, fishesLoaded: Fish[]) => void
}

export function NewAquariumContextProvider({ children }: NewAquariumContextProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(NEW_AQUARIUM_STEP.TYPE)
  const [aquariumPartSelected, setAquariumPartSelected] = useState(AQUARIUM_PART.HEIGHT)
  const [aquariumHeight, setAquariumHeight] = useState<string>('')
  const [aquariumWidth, setAquariumWidth] = useState<string>('')
  const [aquariumLength, setAquariumLength] = useState<string>('')
  const [aquariumWater, setAquariumWater] = useState<string>('')
  const [aquarium, setAquarium] = useState<Aquarium>(AQUARIUM_DEFAULT)
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
  const [loading, setLoading] = useState<boolean>(false)

  function updateAquarium(fishId: number, quantityUpdate: number) {
    const { fishUpdated, aquariumUpdated } = updateFishQuantity(fishId, quantityUpdate, fishes, aquarium)

    fishUpdated && setFishes(prevState => prevState.map((fish: Fish) => fish.id == fishUpdated.id ? fishUpdated : fish))
    aquariumUpdated && setAquarium(aquariumUpdated)
  }

  function loadAquarium(aquariumLoaded: Aquarium, fishesLoaded: Fish[]) {
    const fishesUpdated = fishesLoaded.map((fishDefault: Fish) =>
      aquariumLoaded.fishes.find(fishAquarium => fishDefault.id == fishAquarium.id) ?? { ...fishDefault, quantity: 0 }
    )
    setFishes(fishesUpdated)

    setAquarium(updateAquariumParameters(aquariumLoaded, fishesUpdated.filter(fish => fish.quantity != 0)))
  }

  async function saveAquarium() {
    setLoading(true)

    const message = await Promise.all([fetch('/api/aquarium', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify(aquarium)
    }).then(res => {
      return res.json()
    }).then(result => {
      setLoading(false)
      console.log(result)
      if (result?.hasOwnProperty('error') || !result?.aquarium) {
        console.log('Error na API:', result.error)
        return { message: result.error, code: ALERT_MESSAGE_CODE.DANGER }
      } else {
        setAquarium(result.aquarium)
        return { message: result?.message, code: result?.code }
      }
    }
    )])

    console.log(message[0])

    return message[0]
  }

  return (
    <NewAquariumContext.Provider
      value={{
        fishes,
        setFishes,
        aquarium,
        setAquarium,
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
        updateAquarium,
        food,
        setFood,
        substrate,
        setSubstrate,
        saveAquarium,
        loadAquarium
      }}>
      {children}
    </NewAquariumContext.Provider>
  )
}

export const useNewAquariumContext = () => {
  return useContext(NewAquariumContext);
}

export const NewAquariumContext = createContext({} as NewAquariumContextType)