import React from "react"
import InputText from "../../../../components/inputs/InputText";
import { useNewFishContext } from "../../../../contexts/NewFishContext";

export default function Notes() {

    const {
        fish,
        setFish
    } = useNewFishContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InputText
                label={'Detalhes'}
                lines={4}
                className={'col-span-1 sm:col-span-2'}
                value={fish?.note ?? ''}
                onChange={(newNote) => fish && setFish({ ...fish, note: newNote })}
            />
        </div>
    )
}
