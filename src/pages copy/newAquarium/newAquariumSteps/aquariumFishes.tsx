import CardFish from "../../../components/cards/CardFish";
import { useNewAquariumContext } from "../../../contexts/NewAquariumContext";

export default function AquariumFishes() {
    const {
        fishes,
        updateFishQuantity
    } = useNewAquariumContext();

    return (
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
    )
}
