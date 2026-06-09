import Router from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import Table, { TableContentProps } from "../../components/tables/Table"
import { ALERT_MESSAGE_CODE } from "../../utils/constants"
import { AlertMessage, Aquarium } from "../../utils/types"
import { listAquariumsService } from "../../services/aquarium"
import Image from "next/image"

export default function Aquariums() {
    const [tableHeader] = useState<string[]>(['ID', 'Nome', 'Peixes'])
    const [tableContent, setTableContent] = useState<TableContentProps[][]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [, setMessage] = useState<AlertMessage>()

    async function getAquariums() {
        setLoading(true)
        const response = await listAquariumsService()
        setLoading(false)
        if (response.statusCode !== 200 || !response.data) {
            setMessage({ message: 'Ops, não consegui carregar seus aquários.', code: ALERT_MESSAGE_CODE.DANGER })
            return
        }
        setTableContent(
            response.data.map((content: Aquarium) => [
                { text: String(content.aquarium_id ?? '-') },
                { text: content.name ?? '-' },
                {
                    text: content.fishes
                        .map((fish, index) => index + 1 < content.fishes.length ? fish.name + ', ' : fish.name)
                        .join('') || '-'
                },
            ])
        )
    }

    useEffect(() => {
        getAquariums()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-col gap-4 h-screen w-full px-4 md:pl-28 pt-4">
            {loading
                ?
                <div className="h-full w-full flex items-center justify-center">
                    <Image src={'/circleLoading.svg'} width="64" height="64" alt={''} />
                </div>
                : <>
                    <div className="w-full flex">
                        <PrimaryButton
                            className="w-fit ml-auto"
                            text={'+ Novo Aquário'}
                            onClick={() => Router.push('/newAquarium')}
                        />
                    </div>
                    <div className="h-fit w-full">
                        <Table header={tableHeader} content={tableContent} onClick={Router.push} pathToEdit={'/aquarium/'} />
                    </div>
                </>
            }
        </div>
    )
}
