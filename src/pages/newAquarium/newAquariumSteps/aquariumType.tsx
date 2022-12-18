import CardHorizontal from "../../../components/cards/CardHorizontal";
import { useNewAquariumContext } from "../../../contexts/NewAquariumContext";
import { NEW_AQUARIUM_STEP } from "../../../utils/constants";

export default function AquariumType() {
    const {
        setCurrentStep,
        aquariums
    } = useNewAquariumContext();

    return (
        <div className="h-screen w-full px-4 sm:px-8 ">
            <div className="flex flex-col gap-8 py-6 sm:py-12">
                {aquariums && aquariums.map((aquarium, index) => (
                    <CardHorizontal
                        key={index}
                        className={`w-full max-w-2xl mx-auto`}
                        title={aquarium.title}
                        description={aquarium.description}
                        image={aquarium.image}
                        onClick={() => setCurrentStep(NEW_AQUARIUM_STEP.SIZE)}
                    >
                    </CardHorizontal>
                ))}
            </div>
        </div>
    )
}
