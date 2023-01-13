import React, { useState } from "react"
import { Fish } from "../../utils/constants"
import Card from "../../components/cards/CardBase"
import InputText from "../../components/inputs/InputText"
import H2 from "../../components/texts/h2"
import H1 from "../../components/texts/h1"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import SecondaryButton from "../../components/buttons/SecondaryButton"

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

    const [image, setImage] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [nameEng, setNameEng] = useState<string>('')
    const [scientificName, setScientificName] = useState<string>('')
    const [minimumShoal, setMinimumShoal] = useState<number>(0)
    const [position, setPosition] = useState<number>(0)
    const [substrates, setSubstrates] = useState<number[]>([])
    const [temperamentSame, setTemperamentSame] = useState<number>(0)
    const [temperamentOthers, setTemperamentOthers] = useState<number>(0)
    const [food, setFood] = useState<number[]>([])
    const [size, setSize] = useState<number>(0)
    const [aquariumWidth, setAquariumWidth] = useState<number | null>(null)
    const [aquariumHeight, setAquariumHeight] = useState<number | null>(null)
    const [volumeFirst, setVolumeFirst] = useState<number>(0)
    const [volumeAdditional, setVolumeAdditional] = useState<number>(0)
    const [temperature, setTemperature] = useState<number[]>([])
    const [ph, setPh] = useState<number[]>([])
    const [dgh, setDgh] = useState<number[]>([])
    const [salinity, setSalinity] = useState<number[]>([])
    const [note, setNote] = useState<string[]>([])
    const [quantity, setQuantity] = useState<number>(0)

    return (
        <div className="flex h-screen w-full">
            <Card
                id={id}
                darkTheme={darkTheme}
                className={`w-full max-w-2xl m-auto p-6 sm:p-10`}
            >
                <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-8 gap-1">
                    <H1 className={''}>
                        Nova Espécie
                    </H1>
                    <H2 className={'flex items-end'}>
                        Identificação
                    </H2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <InputText
                        label={'Nome científico'}
                        className={'col-span-1 sm:col-span-2'}
                        value={scientificName}
                        onChange={setScientificName}
                    />
                    <InputText
                        label={'Nome comum'}
                        value={name}
                        onChange={setName}
                    />
                    <InputText
                        label={'Nome comum em inglês'}
                        value={nameEng}
                        onChange={setNameEng}
                    />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                    <SecondaryButton
                        text={'Cancelar'}
                        className="w-full"
                        onClick={() => { }}
                    />
                    <PrimaryButton
                        text={'Continuar'}
                        className="w-full"
                        onClick={() => { }}
                    />
                </div>
            </Card>
        </div>
    )
}
