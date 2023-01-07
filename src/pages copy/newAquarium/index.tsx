import { useNewAquariumContext } from "../../contexts/NewAquariumContext";
import { NEW_AQUARIUM_STEP } from "../../utils/constants";
import AquariumType from "./newAquariumSteps/aquariumType";
import AquariumSize from "./newAquariumSteps/aquariumSize";
import AquariumFishes from "./newAquariumSteps/aquariumFishes";
import CardAquarium from "../../components/cards/CardAquarium";

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
            <CardAquarium
                aquarium={aquarium}
                className="absolute lg:w-60 xl:w-72 2xl:w-96 top-12 right-10"
                onUpdateFishQuantity={updateFishQuantity}
            />
        </div>
    )
}
