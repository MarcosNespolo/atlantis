import React, { useState } from "react"
import Card from "../../components/cards/CardBase"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import SecondaryButton from "../../components/buttons/SecondaryButton"
import Identification from "./steps/identification"
import Behavior from "./steps/bahavior"
import Size from "./steps/size"
import Water from "./steps/water"
import Notes from "./steps/notes"
import H1 from "../../components/texts/h1"
import H2 from "../../components/texts/h2"

type CardFishProps = {
    id?: string
    darkTheme?: boolean
}

const STEP = {
    IDENTIFICATION: 0,
    BEHAVIOR: 1,
    SIZE: 2,
    WATER: 3,
    NOTES: 4
}

export default function CardFish({
    id,
    darkTheme
}: CardFishProps) {
    const [step, setStep] = useState<number>(0)


    function getPageStep() {
        switch (step) {
            case STEP.IDENTIFICATION:
                return <Identification />
            case STEP.BEHAVIOR:
                return <Behavior />
            case STEP.SIZE:
                return <Size />
            case STEP.WATER:
                return <Water />
            case STEP.NOTES:
                return <Notes />
        }
    }

    function getSubtitleStep() {
        switch (step) {
            case STEP.IDENTIFICATION:
                return 'Identificação'
            case STEP.BEHAVIOR:
                return 'Comportamento'
            case STEP.SIZE:
                return 'Espaço'
            case STEP.WATER:
                return 'Água'
            case STEP.NOTES:
                return 'Observações'
        }
    }

    return (
        <div className="flex h-screen w-full">
            <Card
                id={id}
                darkTheme={darkTheme}
                className={`w-full max-w-2xl m-auto py-4 px-6 sm:py-8 sm:px-10`}
            >
                <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-8">
                    <H1 className={''}>
                        Nova Espécie
                    </H1>
                    <H2 className={'flex items-end'}>
                        {getSubtitleStep()}
                    </H2>
                </div>
                {getPageStep()}
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                    <SecondaryButton
                        text={'Voltar'}
                        className="w-full"
                        onClick={() => step > STEP.IDENTIFICATION && setStep(step - 1)}
                    />
                    <PrimaryButton
                        text={'Continuar'}
                        className="w-full"
                        onClick={() => step < STEP.NOTES && setStep(step + 1)}
                    />
                </div>
            </Card>
        </div>
    )
}
