import Card from "../../components/cards/CardHorizontal";
import Waves from '../../components/waves/Waves'
import { useState } from "react";
import { useNewAquariumContext } from "../../contexts/NewAquariumContext";
import { NEW_AQUARIUM_STEP } from "../../utils/constants";
import AquariumType from "./newAquariumSteps/aquariumType";
import AquariumSize from "./newAquariumSteps/aquariumSize";

export default function NewAquarium() {
    const {
        currentStep,
        setCurrentStep,
        aquariums
    } = useNewAquariumContext();

    switch (currentStep) {
        case NEW_AQUARIUM_STEP.TYPE:
            return <AquariumType />
        case NEW_AQUARIUM_STEP.SIZE:
            return <AquariumSize />
        case NEW_AQUARIUM_STEP.FISH:
            return <AquariumType />
    }
}
