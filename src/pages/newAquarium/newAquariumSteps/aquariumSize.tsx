import { useState } from "react";
import AquariumCube from "../../../components/aquarium/AquariumCube";
import Wall from "../../../components/aquarium/AquariumWall";
import Water from "../../../components/aquarium/AquariumWater";
import PrimaryButton from "../../../components/buttons/PrimaryButton";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import TertiaryButton from "../../../components/buttons/TertiaryButton";
import CardVertical from "../../../components/cards/CardVertical";
import InputText from "../../../components/inputs/InputText";
import { useNewAquariumContext } from "../../../contexts/NewAquariumContext";
import { AQUARIUM_PART, NEW_AQUARIUM_STEP } from "../../../utils/constants";

export default function AquariumSize() {
    const [darkTheme, setDarkTheme] = useState()
    const [aquariumPartSelected, setAquariumPartSelected] = useState(AQUARIUM_PART.HEIGHT)
    const [aquariumHeight, setAquariumHeight] = useState('')
    const [aquariumWidth, setAquariumWidth] = useState('')
    const [aquariumLength, setAquariumLength] = useState('')
    const [aquariumWater, setAquariumWater] = useState('')
    const {
        setCurrentStep,
        aquariums
    } = useNewAquariumContext();

    function validateDimensions() {
        if (
            aquariumHeight != '' &&
            aquariumWidth != '' &&
            aquariumLength != '' &&
            aquariumWater != ''
        ) {
            return true
        }
        return false
    }

    return (
        <div className="flex h-screen w-full px-4 sm:px-8">
            <div className="flex flex-col gap-8 m-auto">
                <CardVertical
                    className={`w-full max-w-2xl mx-auto`}
                    title={'Medidas do Aquário'}
                    description={'Selecione o tamanho do aquário'}
                >
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex flex-col w-full sm:w-1/2 sm:pr-16 gap-4 my-auto">
                            <InputText
                                label={'Altura'}
                                value={aquariumHeight}
                                onChange={setAquariumHeight}
                                onClick={() => setAquariumPartSelected(AQUARIUM_PART.HEIGHT)}
                            />
                            <InputText
                                label={'Largura'}
                                value={aquariumWidth}
                                onChange={setAquariumWidth}
                                onClick={() => setAquariumPartSelected(AQUARIUM_PART.WIDTH)}
                            />
                            <InputText
                                label={'Comprimento'}
                                value={aquariumLength}
                                onChange={setAquariumLength}
                                onClick={() => setAquariumPartSelected(AQUARIUM_PART.LENGTH)}
                            />
                            <InputText
                                label={'Coluna de água'}
                                value={aquariumWater}
                                onChange={setAquariumWater}
                                onClick={() => setAquariumPartSelected(AQUARIUM_PART.WATER)}
                            />
                        </div>
                        <div className="w-1/2 ml-auto mr-auto sm:mr-36 md:mr-20">
                            <div className="w-fit w-52 h-52 mt-24 mb-6">
                                <AquariumCube aquariumPartSelected={aquariumPartSelected} />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col-reverse sm:flex-row justify-between mt-4 gap-4">
                        <TertiaryButton
                            className="w-full sm:w-fit"
                            text={"Voltar"}
                            onClick={() => setCurrentStep(NEW_AQUARIUM_STEP.TYPE)}
                        />
                        <div className="flex flex-col-reverse sm:flex-row gap-4">
                            <SecondaryButton
                                className="w-full sm:w-48"
                                text={"Ainda não sei as medidas"}
                                onClick={() => setCurrentStep(NEW_AQUARIUM_STEP.FISH)}
                            />
                            <PrimaryButton
                                className="w-full sm:w-48"
                                text={"Definir as medidas"}
                                disabled={!validateDimensions()}
                                onClick={() => setCurrentStep(NEW_AQUARIUM_STEP.FISH)}
                            />
                        </div>
                    </div>
                </CardVertical>
            </div>
        </div>
    )
}
