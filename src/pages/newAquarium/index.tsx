import { useNewAquariumContext } from "../../contexts/NewAquariumContext";
import { NEW_AQUARIUM_STEP } from "../../utils/constants";
import AquariumType from "./newAquariumSteps/aquariumType";
import AquariumSize from "./newAquariumSteps/aquariumSize";
import AquariumFishes from "./newAquariumSteps/aquariumFishes";

export default function NewAquarium() {
    const {
        currentStep,
        aquarium,
        updateFishQuantity
    } = useNewAquariumContext();

    function getAquariumStep() {
        switch (currentStep) {
            case NEW_AQUARIUM_STEP.TYPE:
                return <AquariumType />
            case NEW_AQUARIUM_STEP.SIZE:
                return <AquariumSize />
            case NEW_AQUARIUM_STEP.FISH:
                return <AquariumFishes />
        }
    }

    return (
        <div>
            {getAquariumStep()}
        </div>
    )
}
