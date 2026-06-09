import Router from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import Table, { TableContentProps } from "../../components/tables/Table"
import { TEMPERAMENT_OTHERS, TEMPERAMENT_SAME } from "../../utils/constants"
import { Fish } from "../../utils/types"
import { listFishesService } from "../../services/fish"
import { useRequireRole } from "../../lib/auth/guards"
import Image from "next/image"

export default function Species() {
    const { allowed } = useRequireRole(['especialista', 'admin'])
    const [tableHeader] = useState<string[]>([
        'ID',
        'Nome',
        'Nome científico',
        'pH',
        'Temperatura (ºC)',
        'Temperamento'
    ])
    const [tableContent, setTableContent] = useState<TableContentProps[][]>()
    const [loading, setLoading] = useState<boolean>(false)

    async function getFishes() {
        setLoading(true)
        const response = await listFishesService()
        setLoading(false)
        if (response.statusCode !== 200 || !response.data) return
        setTableContent(
            response.data.map((f: Fish) => [
                { text: String(f.id) },
                { text: f.name + (f.nameEn ? ', ' + f.nameEn : '') },
                { text: f.scientificName },
                { text: `${Math.min(...f.ph)} - ${Math.max(...f.ph)}` },
                { text: `${Math.min(...f.temperature)} - ${Math.max(...f.temperature)}` },
                { text: [TEMPERAMENT_OTHERS.get(f.temperamentOthers), TEMPERAMENT_SAME.get(f.temperamentSame)].filter(Boolean).join(', ') },
            ])
        )
    }

    useEffect(() => {
        if (allowed) getFishes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowed])

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
                            text={'+ Nova espécie'}
                            onClick={() => Router.push('/fish/newFish')}
                        />
                    </div>
                    <div className="h-fit w-full">
                        <Table header={tableHeader} content={tableContent} onClick={Router.push} pathToEdit={'/fish/'} />
                    </div>
                </>
            }
        </div>
    )
}
