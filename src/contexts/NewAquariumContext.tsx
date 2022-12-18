import { createContext, ReactNode, useContext, useState } from "react"
import { NEW_AQUARIUM_STEP } from "../utils/constants"
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
  aquariums: AquariumType[]
  currentStep: number
  setCurrentStep: (currentStep: number) => void 
}

export function NewAquariumContextProvider({ children }: NewAquariumContextProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(NEW_AQUARIUM_STEP.TYPE)
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

  return (
    <NewAquariumContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        aquariums
      }}>
      {children}
    </NewAquariumContext.Provider>
  )
}

export const useNewAquariumContext = () => {
  return useContext(NewAquariumContext);
}