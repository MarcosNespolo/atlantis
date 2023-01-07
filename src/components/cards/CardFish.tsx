import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import React, { useState } from "react"
import { AQUARIUM_POSITION, Fish, FoodName, SubstrateName, TEMPERAMENT, TemperamentName } from "../../utils/constants"
import PrimaryButton from "../buttons/PrimaryButton"
import InputRange from "../inputs/InputRange"
import Card from "./CardBase"

type CardProps = {
    id?: string
    fish: Fish
    className?: string
    minicard?: boolean
    darkTheme?: boolean
    onUpdateFishQuantity?: (fishId: string, quantityUpdate: number) => void
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
                                <div className="flex h-16 w-32 mt-1.5 bg-cyan-100 rounded">
                                    <img
                                        src="/icons/icon.png"
                                        className={`
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
                            <div className="flex flex-col w-44 gap-0.5">
                                <span className="text-sm font-semibold whitespace-nowrap">Substratos indicados </span>
                                <span className="flex flex-col">
                                    {fish.substrates.map((substrate, index) => (
                                        index + 1 < fish.substrates.length
                                            ? SubstrateName[substrate] + ', '
                                            : SubstrateName[substrate]
                                    ))}
                                </span>
                            </div>
                            <div className="flex flex-col w-full gap-0.5">
                                <span className="text-sm font-semibold">Rações indicadas</span>
                                <span className="flex flex-col">
                                    {fish.food.map((food, index) => (
                                        index + 1 < fish.food.length
                                            ? FoodName[food] + ', '
                                            : FoodName[food]
                                    ))}
                                </span>
                            </div>
                        </div>
                        {fish.note && fish.note.length > 0 &&
                            <span className="flex flex-col gap-1 mt-4">
                                {fish.note.map((note, index) => (
                                    <span key={index}>{note}</span>
                                ))}
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
                                <ExclamationTriangleIcon className={`w-4 mr-1 text-red-700 mt-0.5`} /> {TemperamentName[fish.temperamentSame]}
                            </span>
                        }
                        {fish.temperamentOthers != TEMPERAMENT.PEACEFUL_OTHERS &&
                            <span className="flex font-semibold">
                                <ExclamationTriangleIcon className="w-4 mt-0.5 mr-1 text-red-700" /> {TemperamentName[fish.temperamentOthers]}
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
                        mx-2 
                        flex flex-row
                        items-center
                    "
                >
                    <PrimaryButton icon={'minus'} className="h-6" onClick={() => onUpdateFishQuantity && onUpdateFishQuantity(fish.id, -1)} />
                    <span className="px-3 w-10">
                        {fish.quantity}
                    </span>
                    <PrimaryButton icon={'plus'} className="h-6" onClick={() => onUpdateFishQuantity && onUpdateFishQuantity(fish.id, +1)} />
                </div>
            </div>
        </Card>
    )
}