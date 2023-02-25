import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { ALERT_MESSAGE_CODE, FISH_DEFAULT } from "../utils/constants"
import { AlertMessage, Fish, Food, Substrate } from "../utils/types"

export const NewFishContext = createContext({} as NewFishContextType)

type NewFishContextProviderProps = {
  children: ReactNode
}

type NewFishContextType = {
  loading: boolean
  fish: Fish | undefined
  setFish: (scientificName: Fish) => void
  food: Food[] | undefined
  setFood: (food: Food[]) => void
  substrate: Substrate[] | undefined
  setSubstrate: (substrate: Substrate[]) => void
  saveNewFish: (fish: Fish) => Promise<void>
  message: AlertMessage | null
  setMessage: (message: AlertMessage | null) => void
}

export function NewFishContextProvider({ children }: NewFishContextProviderProps) {
  const [fish, setFish] = useState<Fish>(FISH_DEFAULT)
  const [food, setFood] = useState<Food[]>()
  const [substrate, setSubstrate] = useState<Substrate[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<AlertMessage | null>(null)

  useEffect(() => {
    console.log(fish)
  }, [fish])

  async function saveNewFish(fish: Fish) {
    setLoading(true)
    console.log(fish)

    Promise.all([fetch('/api/fish', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify(fish)
    }).then(res => {
      if (res.status >= 400) {
        console.log('Error na API:', res)
      }
      return res.json()
    }).then(result => {
      setLoading(false)
      console.log(result)
      if (result?.hasOwnProperty('error')) {
        console.log('Error na API:', result.error)
        setMessage({ message: 'Ops, algo deu errado e não consegui salvar essa informação', code: ALERT_MESSAGE_CODE.DANGER })
        return false
      } else {
        setMessage(result)
      }
    }
    )])
  }

  return (
    <NewFishContext.Provider
      value={{
        loading,
        fish,
        setFish,
        food,
        setFood,
        substrate,
        setSubstrate,
        saveNewFish,
        message,
        setMessage
      }}>
      {children}
    </NewFishContext.Provider >
  )
}

export const useNewFishContext = () => {
  return useContext(NewFishContext);
}