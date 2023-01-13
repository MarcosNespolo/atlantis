import { createContext, ReactNode, useContext, useState } from "react"

export const NewFishContext = createContext({} as NewFishContextType)

type NewFishContextProviderProps = {
  children: ReactNode
}

type NewFishContextType = {
  scientificName: string
  setScientificName: (scientificName: string) => void
  name: string
  setName: (name: string) => void
  nameEng: string
  setNameEng: (nameEng: string) => void
  image: string
  setImage: (image: string) => void
  minimumShoal: number
  setMinimumShoal: (minimumShoal: number) => void
  position: number
  setPosition: (position: number) => void
  substrates: number[]
  setSubstrates: (substrates: number[]) => void
  temperamentSame: number
  setTemperamentSame: (temperamentSame: number) => void
  temperamentOthers: number
  setTemperamentOthers: (temperamentOthers: number) => void
  food: number[]
  setFood: (food: number[]) => void
  size: number
  setSize: (size: number) => void
  aquariumWidth: number | null
  setAquariumWidth: (caquariumWidth: number | null) => void
  aquariumHeight: number | null
  setAquariumHeight: (aquariumHeight: number | null) => void
  volumeFirst: number
  setVolumeFirst: (volumeFirst: number) => void
  volumeAdditional: number
  setVolumeAdditional: (volumeAdditional: number) => void
  temperature: number[]
  setTemperature: (temperature: number[]) => void
  ph: number[]
  setPh: (ph: number[]) => void
  dgh: number[]
  setDgh: (dgh: number[]) => void
  salinity: number[]
  setSalinity: (salinity: number[]) => void
  note: string[]
  setNote: (note: string[]) => void
  quantity: number
  setQuantity: (quantity: number) => void
}

export function NewFishContextProvider({ children }: NewFishContextProviderProps) {
  const [scientificName, setScientificName] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [nameEng, setNameEng] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [minimumShoal, setMinimumShoal] = useState<number>(0)
  const [position, setPosition] = useState<number>(0)
  const [substrates, setSubstrates] = useState<number[]>([])
  const [temperamentSame, setTemperamentSame] = useState<number>(0)
  const [temperamentOthers, setTemperamentOthers] = useState<number>(0)
  const [food, setFood] = useState<number[]>([])
  const [size, setSize] = useState<number>(0)
  const [aquariumWidth, setAquariumWidth] = useState<number | null>(null)
  const [aquariumHeight, setAquariumHeight] = useState<number | null>(null)
  const [volumeFirst, setVolumeFirst] = useState<number>(0)
  const [volumeAdditional, setVolumeAdditional] = useState<number>(0)
  const [temperature, setTemperature] = useState<number[]>([])
  const [ph, setPh] = useState<number[]>([])
  const [dgh, setDgh] = useState<number[]>([])
  const [salinity, setSalinity] = useState<number[]>([])
  const [note, setNote] = useState<string[]>([])
  const [quantity, setQuantity] = useState<number>(0)

  return (
    <NewFishContext.Provider
      value={{
        scientificName,
        setScientificName,
        name,
        setName,
        nameEng,
        setNameEng,
        image,
        setImage,
        minimumShoal,
        setMinimumShoal,
        position,
        setPosition,
        substrates,
        setSubstrates,
        temperamentSame,
        setTemperamentSame,
        temperamentOthers,
        setTemperamentOthers,
        food,
        setFood,
        size,
        setSize,
        aquariumWidth,
        setAquariumWidth,
        aquariumHeight,
        setAquariumHeight,
        volumeFirst,
        setVolumeFirst,
        volumeAdditional,
        setVolumeAdditional,
        temperature,
        setTemperature,
        ph,
        setPh,
        dgh,
        setDgh,
        salinity,
        setSalinity,
        note,
        setNote,
        quantity,
        setQuantity
      }}>
      {children}
    </NewFishContext.Provider >
  )
}

export const useNewFishContext = () => {
  return useContext(NewFishContext);
}