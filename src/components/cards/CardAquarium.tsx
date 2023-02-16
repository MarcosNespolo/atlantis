import React from "react"
import { Aquarium, Fish } from "../../utils/types"
import InputRange from "../inputs/InputRange"
import Card from "./CardBase"
import CardFish from "./CardFish"

type CardProps = {
    id?: string
    aquarium: Aquarium
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
                {((aquarium.width[0] != null && aquarium.width[0] != 0) || (aquarium.width[1] != null && aquarium.width[1] != 0)) &&
                    <div className="flex flex-row items-center">
                        <span className="text-sm font-semibold whitespace-nowrap mr-1">Largura:</span>
                        <div className="flex flex-col 2xl:flex-row">
                            {aquarium.width[0] &&
                                <span className="text-sm mr-1">mínimo de {aquarium.width[0]}{aquarium.width[1] ? ' e' : ' cm'}</span>
                            }
                            {aquarium.width[1] &&
                                <span className="text-sm mr-1">máximo de {aquarium.width[1]} cm</span>
                            }
                        </div>
                    </div>
                }
                {((aquarium.width[0] != null && aquarium.width[0] != 0) || (aquarium.width[1] != null && aquarium.width[1] != 0)) &&
                    <div className="flex flex-row items-center">
                        <span className="text-sm font-semibold whitespace-nowrap mr-1">Altura:</span>
                        <div className="flex flex-col 2xl:flex-row">
                            {aquarium.height[0] &&
                                <span className="text-sm mr-1">mínimo de {aquarium.height[0]}{aquarium.height[1] ? ' e' : ' cm'}</span>
                            }
                            {aquarium.height[1] &&
                                <span className="text-sm mr-1">máximo de {aquarium.height[1]} cm</span>
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