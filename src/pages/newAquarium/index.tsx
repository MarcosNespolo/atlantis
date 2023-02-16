import { useNewAquariumContext } from "../../contexts/NewAquariumContext"
import CardFish from "../../components/cards/CardFish"
import CardAquarium from "../../components/cards/CardAquarium";
export default function NewAquarium() {
    const {
        aquarium,
        updateFishQuantity,
        fishes
    } = useNewAquariumContext();

    return (
        <div>
        <div className="flex flex-col gap-8 m-auto max-w-xl my-12">
            {fishes && fishes.map((fish, index) => (
                <CardFish
                    key={index}
                    fish={fish}
                    onUpdateFishQuantity={updateFishQuantity}
                />
            ))}
            {fishes && fishes.map((fish, index) => (
                <CardFish
                    key={index}
                    fish={fish}
                    onUpdateFishQuantity={updateFishQuantity}
                />
            ))}
            {fishes && fishes.map((fish, index) => (
                <CardFish
                    key={index}
                    fish={fish}
                    onUpdateFishQuantity={updateFishQuantity}
                />
            ))}
        </div>
        <CardAquarium
            aquarium={aquarium}
            className="absolute lg:w-60 xl:w-72 2xl:w-96 top-12 right-10"
            onUpdateFishQuantity={updateFishQuantity}
        />
        </div>
    )
}