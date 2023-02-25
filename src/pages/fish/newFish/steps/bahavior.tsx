import React from "react"
import InputSelect from "../../../../components/inputs/InputSelect";
import InputText from "../../../../components/inputs/InputText"
import { useNewFishContext } from "../../../../contexts/NewFishContext";
import { AQUARIUM_POSITION_MAP, TEMPERAMENT_OTHERS, TEMPERAMENT_SAME } from "../../../../utils/constants";
import { Food, Substrate } from "../../../../utils/types";

export default function Behavior() {

    const {
        fish,
        setFish,
        substrate,
        food,
    } = useNewFishContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InputText
                onlyNumbers
                label={'Cardume mínimo'}
                className={'col-span-1'}
                value={fish?.minimumShoal ?? ''}
                onChange={(newMinimumShoal) => fish && setFish({ ...fish, minimumShoal: newMinimumShoal })}
            />
            <InputSelect
                label={'Posição no aquário'}
                className={'col-span-1'}
                selected={fish?.position.toString()}
                list={Array.from(AQUARIUM_POSITION_MAP, ([value, option]) => ({ value, option }))}
                onChange={(newPosition) => fish && setFish({ ...fish, position: +newPosition })}
            />
            {food && food?.length > 0 &&
                <InputSelect
                    label={'Alimentação indicada'}
                    className={'col-span-1'}
                    selected={fish?.food && fish?.food[0]?.food_id ? fish?.food[0]?.food_id?.toString() : '0'}
                    list={food.map((foodItem: Food) => {
                        return {
                            value: foodItem?.food_id ? +foodItem?.food_id : 0,
                            option: foodItem?.name
                        }
                    })}
                    onChange={(newFood) =>
                        fish &&
                        setFish({
                            ...fish,
                            food: food.filter(foodItem => foodItem.food_id == newFood)
                        })
                    }
                />
            }
            {substrate && substrate?.length > 0 &&
                <InputSelect
                    label={'Substrato indicada'}
                    className={'col-span-1'}
                    selected={fish?.substrates && fish?.substrates[0]?.substrate_id ? fish?.substrates[0]?.substrate_id?.toString() : '0'}
                    list={substrate.map((substrateItem: Substrate) => {
                        return {
                            value: substrateItem?.substrate_id ? +substrateItem?.substrate_id : 0,
                            option: substrateItem?.name
                        }
                    })}
                    onChange={(newSubstrate) =>
                        fish &&
                        setFish({
                            ...fish,
                            substrates: substrate.filter(substrateItem => substrateItem.substrate_id == newSubstrate)
                        })
                    }
                />
            }
            <InputSelect
                label={'Temperamento com mesma espécie'}
                className={'col-span-1'}
                selected={fish?.temperamentSame.toString()}
                list={Array.from(TEMPERAMENT_SAME, ([value, option]) => ({ value, option }))}
                onChange={(newTemperamentSame) => fish && setFish({ ...fish, temperamentSame: +newTemperamentSame })}
            />
            <InputSelect
                label={'Temperamento com outras espécies'}
                className={'col-span-1'}
                selected={fish?.temperamentOthers.toString()}
                list={Array.from(TEMPERAMENT_OTHERS, ([value, option]) => ({ value, option }))}
                onChange={(newTemperamentOthers) => fish && setFish({ ...fish, temperamentOthers: +newTemperamentOthers })}
            />
        </div>
    )
}
