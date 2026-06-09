import { GetServerSideProps } from "next"
import React, { useEffect, useState } from "react"
import { Fish, Food, Substrate } from "../../utils/types"
import { listFoodsService } from "../../services/food"
import { listSubstrateService } from "../../services/substrate"
import { listFishesService } from "../../services/fish"
import { getAquariumService } from "../../services/aquarium"
import { useNewAquariumContext } from "../../contexts/NewAquariumContext"
import { useRequireAuth } from "../../lib/auth/guards"
import CardFish from "../../components/cards/CardFish"
import CardAquarium from "../../components/cards/CardAquarium"
import Image from "next/image"

type EditAquariumProps = {
    id: string
    fishesProps: Fish[]
    foodProps: Food[]
    substrateProps: Substrate[]
    error: string | null
}

export default function EditAquarium({ id, fishesProps, foodProps, substrateProps, error }: EditAquariumProps) {
    const { session } = useRequireAuth()
    const {
        aquarium,
        updateAquarium,
        fishes,
        setFood,
        setSubstrate,
        saveAquarium,
        loadAquarium
    } = useNewAquariumContext()

    const [loadError, setLoadError] = useState<string | null>(error)

    useEffect(() => {
        if (!session || error) return
        setFood(foodProps)
        setSubstrate(substrateProps)
        getAquariumService(id).then(res => {
            if (res.statusCode !== 200 || !res.data) {
                setLoadError('Não foi possível carregar este aquário.')
                return
            }
            loadAquarium(res.data, fishesProps)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    return (
        <div className="w-full md:ml-24 flex">
            {loadError
                ? <div className="w-full h-screen m-auto p-12 flex flex-col gap-4 text-center items-center text-primary-medium justify-center">
                    <span className="text-6xl">Ops..</span>
                    <span className="text-2xl font-semibold">{loadError}</span>
                </div>
                : fishes && fishes.length > 0
                    ? <div className="flex flex-col w-full my-12 items-center md:mr-24 lg:items-start lg:mr-0 lg:flex-row lg:justify-evenly">
                        <div className="flex flex-col gap-8 w-full max-w-xl">
                            {fishes.map((fish, index) => (
                                <CardFish
                                    key={index}
                                    fish={fish}
                                    onUpdateFishQuantity={updateAquarium}
                                    aquarium={aquarium}
                                />
                            ))}
                        </div>
                        <CardAquarium
                            aquarium={aquarium}
                            className="flex flex-col w-full max-w-xl lg:w-96 mt-20 lg:mt-0 lg:mr-24"
                            onUpdateFishQuantity={updateAquarium}
                            onClickToSave={saveAquarium}
                        />
                    </div>
                    : <div className="h-screen w-full flex items-center justify-center">
                        <Image src={'/circleLoading.svg'} width="64" height="64" alt={''} />
                    </div>
            }
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (!ctx?.params?.id || typeof ctx.params.id != 'string') {
        return { redirect: { destination: '/aquarium', permanent: false } }
    }
    const id = ctx.params.id

    const fishes = await listFishesService()
    const food = await listFoodsService()
    const substrate = await listSubstrateService()

    const error = (fishes.statusCode != 200 || food.statusCode != 200 || substrate.statusCode != 200)
        ? 'Algo deu errado ao carregar os dados.'
        : null

    return {
        props: {
            id,
            fishesProps: fishes.data ?? [],
            foodProps: food.data ?? [],
            substrateProps: substrate.data ?? [],
            error,
        }
    }
}
