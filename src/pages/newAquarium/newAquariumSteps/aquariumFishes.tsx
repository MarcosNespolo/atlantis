import CardAquarium from "../../../components/cards/CardAquarium";
import CardFish from "../../../components/cards/CardFish";
import { useNewAquariumContext } from "../../../contexts/NewAquariumContext";

export default function AquariumFishes() {
    const {
        fishes,
        aquarium,
        updateAquarium
    } = useNewAquariumContext();

    return (
        <>
            <div className="flex flex-col gap-8 m-auto max-w-xl my-12">
                {fishes && fishes.map((fish, index) => (
                    <CardFish
                        key={index}
                        fish={fish}
                        onUpdateFishQuantity={updateAquarium}
                    />
                ))}
            </div>
            <CardAquarium
                aquarium={aquarium}
                className="absolute w-96 top-12 right-10"
                onUpdateFishQuantity={updateAquarium}
            />
        </>
    )
}
