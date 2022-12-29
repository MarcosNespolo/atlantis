import { useState } from "react";
import CardFish from "../../../components/cards/CardFish";
import { useNewAquariumContext } from "../../../contexts/NewAquariumContext";
import { AQUARIUM_POSITION, Fish, FOOD, REPRODUCTION, SUBSTRATE, TEMPERAMENT } from "../../../utils/constants";

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
