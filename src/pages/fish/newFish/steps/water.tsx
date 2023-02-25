import React from "react"
import InputRange from "../../../../components/inputs/InputRange";
import { useNewFishContext } from "../../../../contexts/NewFishContext";

export default function Water() {

    const {
        fish,
        setFish
    } = useNewFishContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InputRange
                interval={[0, 33]}
                value={fish?.temperature}
                className="w-full"
                label='Temperatura'
                onChange={(newTemperature) => fish && setFish({ ...fish, temperature: newTemperature })}
            />
            <InputRange
                interval={[0, 14]}
                value={fish?.ph}
                step={0.1}
                className="w-full"
                label='pH'
                onChange={(newPh) => fish && setFish({ ...fish, ph: newPh })}
            />

            <InputRange
                interval={[0, 33]}
                value={fish?.salinity}
                className="w-full"
                label='Salinidade'
                onChange={(newSalinity) => fish && setFish({ ...fish, salinity: newSalinity })}
            />
            <InputRange
                interval={[0, 30]}
                value={fish?.dgh}
                className="w-full"
                label='dGH'
                onChange={(newDgh) => fish && setFish({ ...fish, dgh: newDgh })}
            />
        </div>
    )
}
