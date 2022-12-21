import React, { useState } from "react"
import { Fish, TemperamentName } from "../../utils/constants"
import Card from "./CardBase"

type CardProps = {
    id?: string
    fish: Fish
    className?: string
    darkTheme?: boolean
    onClick?: () => void
}

export default function CardFish({
    id,
    fish,
    className,
    darkTheme,
    onClick
}: CardProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Card
            id={id}
            darkTheme={darkTheme}
            className={className}
        >
            <div className="flex flex-col sm:flex-row w-full h-40 z-10">
                {fish.images[0] &&
                    <div className="w-full sm:w-60 h-40">
                        <img src={fish.images[0]} className={"object-cover h-full w-full rounded-tl-md shadow-lg"} />
                    </div>
                }
                <div className="flex flex-col justify-between w-full h-full pt-1 p-2 shadow-lg">
                    {/* Título */}
                    <div className="flex flex-col h-fit">
                        <span className="text-xl">{fish.name} - {fish.nameEn}</span>
                        <span className="text-sm">{fish.scientificName}</span>
                    </div>
                    <div className="flex flex-col h-full">
                        <span className="text-xl">{fish.name} - {fish.nameEn}</span>
                        <span className="text-sm">{fish.scientificName}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col h-full bg-cyan-900/10 text-gray-800 rounded-b-md p-2 shadow-inner text-xs font-medium">
                <span className="flex items-center">
                    {TemperamentName[fish.temperamentSame]}
                </span>
                <span className="flex items-center">
                    {TemperamentName[fish.temperamentOthers]}
                </span>
                <span className="flex items-center">
                   Cardume mínimo recomendado de {fish.minimumShoal} indivíduo
                </span>
            </div>
        </Card>
    )
}