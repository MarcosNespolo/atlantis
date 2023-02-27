import { GetServerSideProps } from "next"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import { getCurrentUser } from "../../services/user"
import { USER_ROLE } from "../../utils/constants"
import { AlertMessage, Aquarium, Fish, Food, Substrate } from "../../utils/types"
import { parseCookies } from 'nookies'
import { listFoodsService } from "../../services/food"
import { listSubstrateService } from "../../services/substrate"
import { listFishesService } from "../../services/fish"
import { getAquariumService } from "../../services/aquarium"
import { useNewAquariumContext } from "../../contexts/NewAquariumContext"
import CardFish from "../../components/cards/CardFish"
import CardAquarium from "../../components/cards/CardAquarium"
import Image from "next/image"

type EditAquariumProps = {
    aquariumProps: Aquarium,
    fishesProps: Fish[],
    foodProps: Food[],
    substrateProps: Substrate[],
    error: string
}

export default function EditAquarium({ aquariumProps, fishesProps, foodProps, substrateProps, error }: EditAquariumProps) {
    const {
        aquarium,
        updateAquarium,
        fishes,
        setFood,
        setSubstrate,
        saveAquarium,
        loadAquarium
    } = useNewAquariumContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    useEffect(() => {
        console.log(aquariumProps)
        if (!error) {
            loadAquarium(aquariumProps, fishesProps)
            foodProps && setFood(foodProps)
            substrateProps && setSubstrate(substrateProps)
        } else {
            Router.push('/aquarium')
        }
    }, [])

    return (
        <div className="w-full md:ml-24 flex">
            {error
                ? <div className="w-full h-screen m-auto p-12 w-96 h-72 flex flex-col gap-4 text-center items-center text-primary-medium justify-center">
                    <span className="text-6xl">
                        Ops..
                    </span>
                    <span className="text-2xl font-semibold">
                        {error}
                    </span>
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
    const { ['atlantis_token']: token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const currentUser = await getCurrentUser(token)

    if (!currentUser?.data?.role_id) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (currentUser?.data?.role_id != USER_ROLE.SPECIALIST && currentUser?.data?.role_id != USER_ROLE.ADMINISTRATOR) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (!ctx?.params?.id || typeof ctx.params.id != 'string') {
        return {
            redirect: {
                destination: '/food',
                permanent: false,
            }
        }
    }

    const id = ctx.params.id
    const response = await getAquariumService(id)
    let error = null

    console.log(response)

    if (response.statusCode != 200) {
        error = 'Algo deu errado, tente novamente mais tarde.'
    }

    const fishes = await listFishesService()
    const food = await listFoodsService()
    const substrate = await listSubstrateService()

    if (food?.statusCode != 200) {
        return {
            redirect: {
                destination: '/aquarium',
                permanent: false,
            }
        }
    }

    return {
        props: {
            aquariumProps: response.data,
            fishesProps: fishes.data,
            foodProps: food.data,
            substrateProps: substrate.data,
            error: error
        }
    }
}