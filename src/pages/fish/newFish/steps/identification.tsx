import React, { useEffect, useState, ChangeEvent } from "react"
import ImageButton from "../../../../components/buttons/ImageButton";
import InputText from "../../../../components/inputs/InputText"
import { useNewFishContext } from "../../../../contexts/NewFishContext"
import { uploadImage } from "../../../../utils/imagesControler";
import { AlertMessage } from "../../../../utils/types";

export default function Identification() {
    const [loadingLogo, setLoadingLogo] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()
    const [imageURL, setImageUrl] = useState<string>()

    const {
        fish,
        setFish
    } = useNewFishContext();

    async function uploadImageFish(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files || event.target.files.length == 0) {
            throw 'Selecione uma imagem para enviar.'
        }

        let file = event.target.files[0]
        const filename = `${file.name.split('.')[0]}${Math.random()}`.replace(/[^A-z0-9]+/g, '') + '.' + file.name.split('.')?.pop()?.toLowerCase()

        console.log(filename)

        fish && setFish({ ...fish, image: filename })
        setImageUrl(URL.createObjectURL(file))

        const response = uploadImage(file, filename, 'fish')

        console.log(response)
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <ImageButton
                image={imageURL}
                name={fish?.name}
                onUpload={(e) => uploadImageFish(e)}
                loading={loadingLogo}
                className={'col-span-1 sm:col-span-2 w-full sm:mx-auto'}
            />
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
