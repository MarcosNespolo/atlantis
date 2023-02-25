import React from "react"
import InputText from "../../../../components/inputs/InputText";
import { useNewFishContext } from "../../../../contexts/NewFishContext";

export default function Size() {

    const {
        fish,
        setFish
    } = useNewFishContext();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <InputText
                onlyNumbers
                label={'Tamanho médio do espécime adulto'}
                complementText={'cm'}
                className={'col-span-1'}
                value={fish?.size ?? ''}
                onChange={(newSize) =>
                    fish && setFish({
                        ...fish,
                        size: newSize
                    })
                }
            />
            <div></div>
            <InputText
                onlyNumbers
                label={'Volume mínimo para 1º espécime'}
                complementText={'litros'}
                className={'col-span-1'}
                value={fish?.volumeFirst ?? ''}
                onChange={(newVolumeFirst) =>
                    fish && setFish({
                        ...fish,
                        volumeFirst: newVolumeFirst
                    })
                }
            />
            <InputText
                onlyNumbers
                label={'Volume para espécime adicional'}
                complementText={'litros'}
                className={'col-span-1'}
                value={fish?.volumeAdditional ?? ''}
                onChange={(newVolumeAdditional) =>
                    fish && setFish({
                        ...fish,
                        volumeAdditional: newVolumeAdditional
                    })
                }
            />
            <InputText
                onlyNumbers
                label={'Largura mínima do aquário'}
                complementText={'cm'}
                className={'col-span-1'}
                value={fish?.aquariumWidth[0] ?? ''}
                onChange={(newAquariumWidth) =>
                    fish && setFish({
                        ...fish,
                        aquariumWidth: [
                            +newAquariumWidth == 0
                                ? null
                                : +newAquariumWidth,
                            fish.aquariumWidth[1]]
                    })
                }
            />
            <InputText
                onlyNumbers
                label={'Largura máxima do aquário'}
                complementText={'cm'}
                className={'col-span-1'}
                value={fish?.aquariumWidth[1] ?? ''}
                onChange={(newAquariumWidth) =>
                    fish && setFish({
                        ...fish,
                        aquariumWidth: [
                            fish.aquariumWidth[0],
                            +newAquariumWidth == 0
                                ? null
                                : +newAquariumWidth
                        ]
                    })
                }
            />
            <InputText
                onlyNumbers
                label={'Altura mínima do aquário'}
                complementText={'cm'}
                className={'col-span-1'}
                value={fish?.aquariumHeight[0] ?? ''}
                onChange={(newAquariumHeight) =>
                    fish && setFish({
                        ...fish,
                        aquariumHeight: [
                            +newAquariumHeight == 0
                                ? null
                                : +newAquariumHeight,
                            fish.aquariumHeight[1]]
                    })
                }
            />
            <InputText
                onlyNumbers
                label={'Altura máxima do aquário'}
                complementText={'cm'}
                className={'col-span-1'}
                value={fish?.aquariumHeight[1] ?? ''}
                onChange={(newAquariumHeight) =>
                    fish && setFish({
                        ...fish,
                        aquariumHeight: [
                            fish.aquariumHeight[0],
                            +newAquariumHeight == 0
                                ? null
                                : +newAquariumHeight
                        ]
                    })
                }
            />
        </div>
    )
}
