import React, { useEffect, useState } from "react"
import { AQUARIUM_DEFAULT_PARAMETERS } from "../../utils/constants"
import { AlertMessage, Aquarium, Fish } from "../../utils/types"
import PrimaryButton from "../buttons/PrimaryButton"
import InputRange from "../inputs/InputRange"
import Card from "./CardBase"
import CardFish from "./CardFish"

type CardProps = {
    id?: string
    aquarium: Aquarium
    className?: string
    darkTheme?: boolean
    onUpdateFishQuantity?: (fishId: number, quantityUpdate: number) => void
    onClickToSave?: () => Promise<AlertMessage>
}

export default function CardAquarium({
    id,
    aquarium,
    className,
    darkTheme,
    onUpdateFishQuantity,
    onClickToSave
}: CardProps) {
    const [message, setMessage] = useState<AlertMessage | null>()
    const [temperature, setTemperature] = useState<number[]>(AQUARIUM_DEFAULT_PARAMETERS.TEMPERATURE)
    const [ph, setPh] = useState<number[]>(AQUARIUM_DEFAULT_PARAMETERS.PH)
    const [salinity, setSalinity] = useState<number[]>(AQUARIUM_DEFAULT_PARAMETERS.SALINITY)
    const [dgh, setDgh] = useState<number[]>(AQUARIUM_DEFAULT_PARAMETERS.DGH)

    useEffect(() => {
        if (aquarium?.temperature?.length == 2 && typeof aquarium?.temperature[0] == 'number' && typeof aquarium?.temperature[1] == 'number') {
            setTemperature([aquarium.temperature[0], aquarium.temperature[1]])
        } else {
            setTemperature(AQUARIUM_DEFAULT_PARAMETERS.TEMPERATURE)
        }
        if (aquarium?.ph?.length == 2 && typeof aquarium?.ph[0] == 'number' && typeof aquarium?.ph[1] == 'number') {
            setPh([aquarium.ph[0], aquarium.ph[1]])
        } else {
            setPh(AQUARIUM_DEFAULT_PARAMETERS.PH)
        }
        if (aquarium?.salinity?.length == 2 && typeof aquarium?.salinity[0] == 'number' && typeof aquarium?.salinity[1] == 'number') {
            setSalinity([aquarium.salinity[0], aquarium.salinity[1]])
        } else {
            setSalinity(AQUARIUM_DEFAULT_PARAMETERS.SALINITY)
        }
        if (aquarium?.dgh?.length == 2 && typeof aquarium?.dgh[0] == 'number' && typeof aquarium?.dgh[1] == 'number') {
            setDgh([aquarium.dgh[0], aquarium.dgh[1]])
        } else {
            setDgh(AQUARIUM_DEFAULT_PARAMETERS.DGH)
        }

    }, [aquarium])

    return (
        <Card
            id={id}
            alertMessage={message}
            onCloseMessage={() => setMessage(null)}
            darkTheme={darkTheme}
            className={className + ' py-2 px-4'}
        >
            <span className="mx-auto text-xl mt-4 mb-6">Aquário</span>
            <div className="flex flex-col w-full sm:flex-row sm:gap-8">
                <InputRange interval={AQUARIUM_DEFAULT_PARAMETERS.TEMPERATURE} value={temperature} className="w-full" label='Temperatura' disabled />
                <InputRange interval={AQUARIUM_DEFAULT_PARAMETERS.PH} value={ph} step={0.1} className="w-full" label='pH' disabled />
            </div>
            <div className="flex flex-col w-full sm:flex-row sm:gap-8">
                <InputRange interval={AQUARIUM_DEFAULT_PARAMETERS.SALINITY} value={salinity} className="w-full" label='Salinidade' disabled />
                <InputRange interval={AQUARIUM_DEFAULT_PARAMETERS.DGH} value={dgh} className="w-full" label='dGH' disabled />
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
                        aquarium={aquarium}
                        minicard
                    />
                ))}
            </div>
            <PrimaryButton
                text="Salvar"
                className="mt-2"
                disabled={aquarium.fishes.length < 1}
                onClick={() => onClickToSave
                    ? onClickToSave().then((response: AlertMessage) => setMessage(response))
                    : () => { }
                }
            />
        </Card>
    )
}