import { GetServerSideProps } from "next"
import Router from "next/router"
import React, { useEffect, useState, ChangeEvent } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import SecondaryButton from "../../components/buttons/SecondaryButton"
import Card from "../../components/cards/CardBase"
import InputText from "../../components/inputs/InputText"
import H1 from "../../components/texts/h1"
import { getCurrentUser } from "../../services/user"
import { ALERT_MESSAGE_CODE, AQUARIUM_POSITION_MAP, TEMPERAMENT_OTHERS, TEMPERAMENT_SAME, USER_ROLE, USER_ROLE_MAP } from "../../utils/constants"
import { AlertMessage, Fish, Food, Substrate } from "../../utils/types"
import { parseCookies } from 'nookies'
import { getFishService } from "../../services/fish"
import H2 from "../../components/texts/h2"
import InputSelect from "../../components/inputs/InputSelect"
import { listFoodsService } from "../../services/food"
import { listSubstrateService } from "../../services/substrate"
import InputRange from "../../components/inputs/InputRange"
import ImageButton from "../../components/buttons/ImageButton"
import { downloadImage, uploadImage } from "../../utils/imagesControler"

export default function EditFood({ fishProps, foodProps, substrateProps }: any) {
    const [fish, setFish] = useState<Fish>()
    const [food, setFood] = useState<Food[]>()
    const [substrate, setSubstrate] = useState<Substrate[]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingLogo, setLoadingLogo] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()
    const [imageURL, setImageUrl] = useState<string>()

    useEffect(() => {
        console.log(fishProps)
        if (fishProps) {
            setFish(fishProps)
        } else {
            Router.push('/fish')
        }
        if (foodProps) {
            setFood(foodProps)
        }
        if (substrateProps) {
            setSubstrate(substrateProps)
        }
    }, [])

    useEffect(() => {
        getImageURL()
    }, [fish])

    async function getImageURL() {
        setLoadingLogo(true)
        const imageObject = await downloadImage(fishProps.image, 'fish')
        if (imageObject){
            console.log(imageObject)
            setImageUrl(URL.createObjectURL(imageObject))
        }
        setLoadingLogo(false)
    }

    async function updateFish() {
        setLoading(true)
        Promise.all([fetch('/api/fish', {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify(fish)
        }).then(res => {
            if (res.status >= 400) {
                console.log('Error na API:', res)
                return { error: res.json() }
            }
            return res.json();
        }).then(result => {
            setLoading(false)
            console.log(result)
            if (result?.hasOwnProperty('error')) {
                console.log('Error na API:', result.error)
                setMessage({ message: 'Ops, algo deu errado e não consegui salvar essa informação', code: ALERT_MESSAGE_CODE.DANGER })
                return false
            } else {
                setMessage({ message: 'Informações atualizadas com sucesso', code: ALERT_MESSAGE_CODE.SUCCESS })
            }
        }
        )])
    }

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
        <div className="flex h-screen w-full md:pl-24">
            <Card
                darkTheme={false}
                className={`w-full max-w-2xl m-auto py-4 px-6 sm:py-8 sm:px-10`}
                alertMessage={message}
            >
                <div className="w-full flex flex-col sm:flex-row justify-between mb-4 sm:mb-8">
                    <H1 className={''}>
                        Editar Espécie
                    </H1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <H2 className={'col-span-1 sm:col-span-2 mt-2'}>
                        Identificação
                    </H2>
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
                    <H2 className={'col-span-1 sm:col-span-2 mt-2'}>
                        Comportamento
                    </H2>
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
                        removeDefaultOption
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
                        removeDefaultOption
                    />
                    <InputSelect
                        label={'Temperamento com outras espécies'}
                        className={'col-span-1'}
                        selected={fish?.temperamentOthers.toString()}
                        list={Array.from(TEMPERAMENT_OTHERS, ([value, option]) => ({ value, option }))}
                        onChange={(newTemperamentOthers) => fish && setFish({ ...fish, temperamentOthers: +newTemperamentOthers })}
                        removeDefaultOption
                    />
                    <H2 className={'col-span-1 sm:col-span-2 mt-2'}>
                        Espaço
                    </H2>
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
                    <H2 className={'col-span-1 sm:col-span-2 mt-2'}>
                        Água
                    </H2>
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
                    <H2 className={'col-span-1 sm:col-span-2 mt-2'}>
                        Observações
                    </H2>
                    <InputText
                        label={'Detalhes'}
                        lines={4}
                        className={'col-span-1 sm:col-span-2'}
                        value={fish?.note ?? ''}
                        onChange={(newNote) => fish && setFish({ ...fish, note: newNote })}
                    />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                    <SecondaryButton
                        text={'Voltar'}
                        className="w-full"
                        onClick={() => Router.push('/fish')}
                    />
                    <PrimaryButton
                        text={'Salvar'}
                        className="w-full"
                        onClick={() => updateFish()}
                    />
                </div>
            </Card>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['atlantis_token']: token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const currentUser = await getCurrentUser(token)

    if (!currentUser?.data?.role_id) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (currentUser?.data?.role_id != USER_ROLE.SPECIALIST && currentUser?.data?.role_id != USER_ROLE.ADMINISTRATOR) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (!ctx?.params?.id || typeof ctx.params.id != 'string') {
        return {
            redirect: {
                destination: '/fish',
                permanent: false,
            }
        }
    }

    const id = ctx.params.id
    const fish = await getFishService(id)
    const food = await listFoodsService()
    const substrate = await listSubstrateService()

    if (fish?.statusCode != 200) {
        return {
            redirect: {
                destination: '/fish',
                permanent: false,
            }
        }
    }

    return {
        props: {
            fishProps: fish.data,
            foodProps: food.data,
            substrateProps: substrate.data
        }
    }
}