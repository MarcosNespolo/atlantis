import { ExclamationCircleIcon, ExclamationTriangleIcon, ShieldExclamationIcon } from "@heroicons/react/20/solid"
import React, { useState } from "react"
import { AQUARIUM_POSITION, Fish, FoodName, SubstrateName, TEMPERAMENT, TemperamentName } from "../../utils/constants"
import InputRange from "../inputs/InputRange"
import Card from "./CardBase"
import CardFish from "./CardFish"

type CardProps = {
    id?: string
    aquarium: {}
    className?: string
    darkTheme?: boolean
    onUpdateFishQuantity?: (fishId: string, quantityUpdate: number) => void
}

export default function CardAquarium({
    id,
    aquarium,
    className,
    darkTheme,
    onUpdateFishQuantity
}: CardProps) {
    return (
        <Card
            id={id}
            darkTheme={darkTheme}
            className={className + ' py-2 px-4'}
        >
            <span className="mx-auto text-xl mb-6">Aquário</span>
            <div className="flex flex-col w-full 2xl:flex-row 2xl:gap-8">
                <InputRange interval={[0, 33]} value={aquarium.temperature} className="w-full" label='Temperatura' disabled />
                <InputRange interval={[0, 14]} value={aquarium.ph} step={0.1} className="w-full" label='pH' disabled />
            </div>
            <div className="flex flex-col w-full 2xl:flex-row 2xl:gap-8">
                <InputRange interval={[0, 33]} value={aquarium.salinity} className="w-full" label='Salinidade' disabled />
                <InputRange interval={[0, 30]} value={aquarium.dgh} className="w-full" label='dGH' disabled />
            </div>
            <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row">
                    <span className="text-sm font-semibold whitespace-nowrap mr-1">Volume mínimo:</span>
                    <span className="text-sm">{aquarium.volume} L</span>
                </div>
                {(aquarium.size.width.min || aquarium.size.width.max) &&
                    <div className="flex flex-row items-center">
                        <span className="text-sm font-semibold whitespace-nowrap mr-1">Largura:</span>
                        <div className="flex flex-col 2xl:flex-row">
                            {aquarium.size.width.min &&
                                <span className="text-sm">mínimo de {aquarium.size.width.min}{aquarium.size.width.max ? ' e' : ' cm'}</span>
                            }
                            {aquarium.size.width.max &&
                                <span className="text-sm">máximo de {aquarium.size.width.max} cm</span>
                            }
                        </div>
                    </div>
                }
                {(aquarium.size.height.min || aquarium.size.height.max) &&
                    <div className="flex flex-row items-center">
                        <span className="text-sm font-semibold whitespace-nowrap mr-1">Altura:</span>
                        <div className="flex flex-col 2xl:flex-row">
                            {aquarium.size.height.min &&
                                <span className="text-sm mr-1">mínimo de {aquarium.size.height.min}{aquarium.size.height.max ? ' e' : ' cm'}</span>
                            }
                            {aquarium.size.height.max &&
                                <span className="text-sm mr-1">máximo de {aquarium.size.height.max} cm</span>
                            }
                        </div>
                    </div>
                }
                <div className="flex flex-row">
                    <span className="text-sm font-semibold whitespace-nowrap mr-1">Capacidade de Filtragem:</span>
                    <span className="text-sm">{aquarium.filter} l/h</span>
                </div>
                <div className="flex flex-row">
                    <span className="text-sm font-semibold whitespace-nowrap mr-1">Termostato:</span>
                    <span className="text-sm">{aquarium.thermostat} W</span>
                </div>
            </div>
            <div className="flex flex-col my-2 gap-3">
                {aquarium.fishes.length > 0 && aquarium.fishes.map((fish: Fish, index: number) => (
                    <CardFish
                        key={index}
                        fish={fish}
                        onUpdateFishQuantity={onUpdateFishQuantity}
                        minicard
                    />
                ))}
            </div>
        </Card>
    )
}