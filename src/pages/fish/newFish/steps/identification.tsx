import React from "react"
import InputText from "../../../../components/inputs/InputText"
import { useNewFishContext } from "../../../../contexts/NewFishContext"

export default function Identification() {

    const {
        fish,
        setFish
    } = useNewFishContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InputText
                label={'Nome'}
                className={'col-span-1'}
                value={fish?.name ?? ''}
                onChange={(newName) => fish && setFish({ ...fish, name: newName })}
            />
            <InputText
                label={'Nome em inglês'}
                className={'col-span-1'}
                value={fish?.nameEn ?? ''}
                onChange={(newNameEn) => fish && setFish({ ...fish, nameEn: newNameEn })}
            />
            <InputText
                label={'Nome ciêntífico'}
                className={'col-span-1 sm:col-span-2'}
                value={fish?.scientificName ?? ''}
                onChange={(newScientificName) => fish && setFish({ ...fish, scientificName: newScientificName })}
            />
        </div>
    )
}
