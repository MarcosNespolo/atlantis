import { useState } from "react";
import CardFish from "../../../components/cards/CardFish";
import { useNewAquariumContext } from "../../../contexts/NewAquariumContext";
import { AQUARIUM_POSITION, Fish, FOOD, REPRODUCTION, SUBSTRATE, TEMPERAMENT } from "../../../utils/constants";

export default function AquariumFishes() {
    const {
        setCurrentStep
    } = useNewAquariumContext();

    const [fishes, setFishes] = useState<Fish[]>([
        {
            name: 'Betta',
            nameEn: 'Fighting fish',
            images: ['https://en.aqua-fish.net/imgs/fish/betta-fish-profile.jpg'],
            scientificName: 'Betta splendens',
            order: 'Perciformes',
            family: 'Osphronemidae',
            origin: 'Leste da Ásia',
            minimumShoal: 1,
            position: AQUARIUM_POSITION.TOP,
            reproduction: REPRODUCTION.OVIPAROUS,
            sexualDimorphism: 'sexualDimorphism',
            characteristics: 'characteristics',
            substrates: [SUBSTRATE.AREIA, SUBSTRATE.CASCALHO],
            temperamentSame: TEMPERAMENT.PEACEFUL_TO_FEMALES,
            temperamentOthers: TEMPERAMENT.PEACEFUL_OTHERS,
            alimentation: 'alimentation',
            food: [FOOD.ARTEMIA, FOOD.FLOCO, FOOD.GRANULADA],
            foodQuantity: 1,
            size: 7,
            aquariumSize: {
                width: {
                    min: 21,
                    max: null
                },
                height: {
                    min: 15,
                    max: 30
                }
            },
            volumeFirst: 18,
            volumeAdditional: 18,
            temperature: {
                min: 23,
                max: 30
            },
            ph: {
                min: 6.2,
                max: 7.9
            },
            dgh: {
                min: 4,
                max: 25
            },
            salinity: {
                min: 0,
                max: 6
            },
            note: ['O Betta macho pode ser agressivo com espécies mais agitadas.'],
            quant: 0
        },
        {
            name: 'Betta',
            nameEn: 'Betta',
            images: ['http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSBBNLXQq0KBmDh4natnTkt51_uBDxJ8afSr5HKZtHgD7kTFuOlFl4ECGANU42Nk6_o'],
            scientificName: 'Betta splendens',
            order: 'Perciformes',
            family: 'Osphronemidae',
            origin: 'Leste da Ásia',
            minimumShoal: 1,
            position: AQUARIUM_POSITION.TOP,
            reproduction: REPRODUCTION.OVIPAROUS,
            sexualDimorphism: 'sexualDimorphism',
            characteristics: 'characteristics',
            substrates: [SUBSTRATE.AREIA, SUBSTRATE.CASCALHO],
            temperamentSame: TEMPERAMENT.PEACEFUL_TO_FEMALES,
            temperamentOthers: TEMPERAMENT.PEACEFUL_OTHERS,
            alimentation: 'alimentation',
            food: [FOOD.ARTEMIA, FOOD.FLOCO, FOOD.GRANULADA],
            foodQuantity: 1,
            size: 7,
            aquariumSize: {
                width: {
                    min: 21,
                    max: null
                },
                height: {
                    min: 15,
                    max: 30
                }
            },
            volumeFirst: 18,
            volumeAdditional: 18,
            temperature: {
                min: 23,
                max: 30
            },
            ph: {
                min: 6.2,
                max: 7.9
            },
            dgh: {
                min: 4,
                max: 25
            },
            salinity: {
                min: 0,
                max: 6
            },
            note: ['O Betta macho pode ser agressivo com espécies mais agitadas.'],
            quant: 0
        }
    ])

    return (
        <div className="flex flex-col gap-8 m-auto max-w-xl my-12">
            {fishes && fishes.map((fish) => (
                <CardFish fish={fish} />
            ))}
        </div>
    )
}
