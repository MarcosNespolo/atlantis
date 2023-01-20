import React from "react"
import InputText from "../../../components/inputs/InputText"
import H1 from "../../../components/texts/h1";
import H2 from "../../../components/texts/h2";
import { useNewFishContext } from "../../../contexts/NewFishContext";

export default function Size() {

    const {
        size,
        setSize,
        aquariumWidth,
        setAquariumWidth,
        aquariumHeight,
        setAquariumHeight,
        volumeFirst,
        setVolumeFirst,
        volumeAdditional,
        setVolumeAdditional
    } = useNewFishContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">

        </div>
    )
}
