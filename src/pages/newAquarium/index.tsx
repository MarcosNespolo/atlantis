import { useNewAquariumContext } from "../../contexts/NewAquariumContext"
import CardFish from "../../components/cards/CardFish"
import CardAquarium from "../../components/cards/CardAquarium";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { listFishesService } from "../../services/fish";
import { Fish, Food, Substrate } from "../../utils/types";
import { useEffect } from "react";
import { listFoodsService } from "../../services/food";
import { listSubstrateService } from "../../services/substrate";


type NewAquariumProps = {
    fishesProps: Fish[],
    foodProps: Food[],
    substrateProps: Substrate[],
    error: string
}

export default function NewAquarium({ fishesProps, foodProps, substrateProps, error }: NewAquariumProps) {
    const {
        aquarium,
        updateFishQuantity,
        fishes,
        setFishes,
        setFood,
        setSubstrate
    } = useNewAquariumContext()

    useEffect(() => {
        if (!error) {
            setFishes(fishesProps.map(fish => { return { ...fish, quantity: 0 } }))
            setFood(foodProps)
            setSubstrate(substrateProps)
        }
    }, [])

    return (
        <div className="w-full h-screen md:ml-24 flex">
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
                    ? <div className="flex flex-row justify-evenly w-full my-12">
                        <div className="flex flex-col gap-8 w-full max-w-xl">
                            {fishes.map((fish, index) => (
                                <CardFish
                                    key={index}
                                    fish={fish}
                                    onUpdateFishQuantity={updateFishQuantity}
                                />
                            ))}
                        </div>
                        <CardAquarium
                            aquarium={aquarium}
                            className="w-96 mr-20"
                            onUpdateFishQuantity={updateFishQuantity}
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

    const response = await listFishesService()
    let error = null

    if (response.statusCode != 200) {
        error = 'Algo deu errado, tente novamente mais tarde.'
    }
    const food = await listFoodsService()
    const substrate = await listSubstrateService()

    return {
        props: {
            fishesProps: response.data,
            foodProps: food.data,
            substrateProps: substrate.data,
            error: error
        }
    }
}