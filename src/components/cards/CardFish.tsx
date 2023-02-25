import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import React, { useEffect, useState } from "react"
import { AQUARIUM_POSITION, FOOD_NAME, SUBSTRATE_NAME, TEMPERAMENT, TEMPERAMENT_NAME } from "../../utils/constants"
import { Fish, Food, Substrate } from "../../utils/types"
import PrimaryButton from "../buttons/PrimaryButton"
import InputRange from "../inputs/InputRange"
import Card from "./CardBase"

type CardProps = {
    id?: string
    fish: Fish
    className?: string
    minicard?: boolean
    darkTheme?: boolean
    onUpdateFishQuantity?: (fishId: number, quantityUpdate: number) => void
}

export default function CardFish({
    id,
    fish,
    className,
    minicard,
    darkTheme,
    onUpdateFishQuantity
}: CardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Card
            id={id}
            darkTheme={darkTheme}
            className={className}
        >
            <div className={`flex flex-col sm:flex-row w-full z-10 ${minicard ? 'h-16' : 'sm:h-44'}`}>
                {fish.image &&
                    <div className={`bg-gray-400/10 ${minicard ? 'h-16 w-32' : 'w-full sm:w-72 h-60 sm:h-44 '}`}>
                        <img src={fish.image} className={"object-cover h-full w-full rounded-br-md rounded-tl-md"} />
                    </div>
                }
                <div className="flex flex-col justify-between w-full h-fit pt-2 px-4">
                    {/* Título */}
                    <div className="flex flex-col h-fit">
                        <span className="text-xl">{fish.name}</span>
                        <span className="text-sm italic">{fish.scientificName}</span>
                    </div>
                    {!minicard &&
                        <div className="flex flex-col mt-4">
                            <div className={`flex w-full flex-row gap-8`}>
                                <InputRange interval={[0, 33]} value={fish.temperature} className="w-full" label='Temperatura' disabled />
                                <InputRange interval={[0, 14]} value={fish.ph} step={0.1} className="w-full" label='pH' disabled />
                            </div>
                            <div className={`flex w-full flex-row gap-8`}>
                                <InputRange interval={[0, 33]} value={fish.salinity} className="w-full" label='Salinidade' disabled />
                                <InputRange interval={[0, 30]} value={fish.dgh} className="w-full" label='dGH' disabled />
                            </div>
                        </div>

                    }
                </div>
            </div>

            <div
                className={`
                    flex flex-col
                    h-full 
                    px-4 
                    ${(!minicard || isOpen) && 'pt-4'}
                    gap-1
                    rounded-b-md
                    text-xs 
                    font-regular
                `}
            >
                {isOpen &&
                    <div className="flex flex-col mb-2">
                        {minicard &&
                            <div className="flex flex-col">
                                <div className={`flex w-full flex-row gap-6`}>
                                    <InputRange interval={[0, 33]} value={fish.temperature} className="w-full" label='Temperatura' disabled />
                                    <InputRange interval={[0, 14]} value={fish.ph} step={0.1} className="w-full" label='pH' disabled />
                                </div>
                                <div className={`flex w-full flex-row gap-6`}>
                                    <InputRange interval={[0, 33]} value={fish.salinity} className="w-full" label='Salinidade' disabled />
                                    <InputRange interval={[0, 30]} value={fish.dgh} className="w-full" label='dGH' disabled />
                                </div>
                            </div>

                        }
                        <div className={`flex flex-row w-full ${minicard ? 'gap-5' : 'gap-7'}`}>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm whitespace-nowrap">
                                    Posição no aquário
                                </span>
                                <div className="flex h-16 w-32 mt-1.5 bg-primary-light/50 rounded">
                                    <img
                                        src="/icons/atlantis_icon.svg"
                                        className={`
                                            object-contain
                                            mx-auto 
                                            w-6 h-6 
                                            ${fish.position == AQUARIUM_POSITION.TOP
                                                ? 'self-start'
                                                : fish.position == AQUARIUM_POSITION.BOTTOM
                                                    ? 'self-end'
                                                    : 'self-center'
                                            }
                                `}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <span className="font-semibold text-sm -mb-1">
                                    Espaço no aquário
                                </span>
                                <div>
                                    <span className="font-semibold">Tamanho médio:&nbsp;</span>
                                    <span>{fish.size} cm</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Volume para 1º espécime:&nbsp;</span>
                                    <span>{fish.volumeFirst} L</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Volume para cada espécime adicional:&nbsp;</span>
                                    <span>{fish.volumeAdditional} L</span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex flex-row w-full ${minicard ? 'gap-4' : 'gap-6'} mt-4`}>
                            {fish?.substrates && fish?.substrates.length > 0 &&
                                <div className="flex flex-col w-full gap-0.5">
                                    <span className="text-sm font-semibold whitespace-nowrap">Substratos indicados </span>
                                    <span className="flex flex-col">
                                        {fish?.substrates.map((substrate: Substrate, index) => (
                                            substrate && fish?.substrates && index + 1 < fish?.substrates.length
                                                ? <> {substrate.name + ', '}</>
                                                : <> {substrate.name}</>
                                        ))}
                                    </span>
                                </div>
                            }
                            {fish?.food && fish?.food.length > 0 &&
                                <div className="flex flex-col w-full gap-0.5">
                                    <span className="text-sm font-semibold">Rações indicadas</span>
                                    <span className="flex flex-col">
                                        {fish?.food.map((food: Food, index) => (
                                            food && fish?.food && index + 1 < fish?.food.length
                                                ? <> {food.name + ', '}</>
                                                : <> {food.name}</>
                                        ))}
                                    </span>
                                </div>
                            }
                        </div>
                        {fish.note && fish.note.length > 0 &&
                            <span className="flex flex-col gap-1 mt-4">
                                {fish.note}
                            </span>
                        }
                    </div>
                }
                {(!minicard || (minicard && isOpen)) &&
                    <>
                        {fish.minimumShoal > 1 &&
                            <span className="flex font-semibold">
                                <ExclamationTriangleIcon className="w-4 mt-0.5 mr-1 text-yellow-700" /> Cardume mínimo recomendado de {fish.minimumShoal} indivíduo
                            </span>
                        }
                        {fish.temperamentSame != TEMPERAMENT.PEACEFUL &&
                            <span className="flex font-semibold items-start">
                                <ExclamationTriangleIcon className={`w-4 mr-1 text-red-700 mt-0.5`} /> {TEMPERAMENT_NAME[fish.temperamentSame]}
                            </span>
                        }
                        {fish.temperamentOthers != TEMPERAMENT.PEACEFUL_OTHERS &&
                            <span className="flex font-semibold">
                                <ExclamationTriangleIcon className="w-4 mt-0.5 mr-1 text-red-700" /> {TEMPERAMENT_NAME[fish.temperamentOthers]}
                            </span>
                        }
                    </>
                }
            </div>
            <div
                className="
                    flex flex-row 
                    items-center
                    text-sm
                    text-center 
                    font-semibold 
                "
            >
                <div
                    className="
                        w-full 
                        p-2 
                        pt-3 
                        mr-2
                        cursor-pointer 
                        select-none 
                        rounded-b-md
                        text-gray-600
                        hover:text-gray-700
                        active:text-gray-800
                        bg-gradient-to-b 
                        from-transparent 
                        hover:to-[#0396A622]
                        active:to-[#0396A644]
                    "
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '-' : '+'} Informações
                </div>
                <div
                    className="
                        w-fit
                        flex flex-row
                        items-center
                        bg-gray-400/20
                        rounded-lg
                    "
                >
                    <PrimaryButton icon={'minus'} className={'rounded-r-none'} onClick={() => onUpdateFishQuantity && onUpdateFishQuantity(fish.id, -1)} />
                    <span className="flex items-center justify-center h-10 w-10 shadow-inner text-primary-dark">
                        {fish.quantity}
                    </span>
                    <PrimaryButton icon={'plus'} onClick={() => onUpdateFishQuantity && onUpdateFishQuantity(fish.id, +1)} />
                </div>
            </div>
        </Card>
    )
}