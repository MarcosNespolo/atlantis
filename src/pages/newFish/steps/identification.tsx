import React, { useState } from "react"
import InputText from "../../../components/inputs/InputText"
import H1 from "../../../components/texts/h1";
import H2 from "../../../components/texts/h2";
import { useNewFishContext } from "../../../contexts/NewFishContext";

export default function Identification() {

    const {
        scientificName,
        setScientificName,
        name,
        setName,
        nameEng,
        setNameEng
    } = useNewFishContext();

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-8">
                <H1 className={''}>
                    Nova Espécie
                </H1>
                <H2 className={'flex items-end'}>
                    Identificação
                </H2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <InputText
                    label={'Nome científico'}
                    className={'col-span-1 sm:col-span-2'}
                    value={scientificName}
                    onChange={setScientificName}
                />
                <InputText
                    label={'Nome comum'}
                    value={name}
                    onChange={setName}
                />
                <InputText
                    label={'Nome comum em inglês'}
                    value={nameEng}
                    onChange={setNameEng}
                />
            </div>
        </>
    )
}
