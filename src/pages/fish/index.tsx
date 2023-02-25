import { GetServerSideProps } from "next"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import Table, { TableContentProps } from "../../components/tables/Table"
import { ALERT_MESSAGE_CODE, TEMPERAMENT_OTHERS, TEMPERAMENT_SAME, USER_ROLE } from "../../utils/constants"
import { AlertMessage, Fish } from "../../utils/types"
import { parseCookies } from 'nookies'
import { getCurrentUser } from "../../services/user"

export default function Species() {
    const [tableHeader, setTableHeader] = useState<string[]>([
        'ID',
        'Nome',
        'Nome ciêntífico',
        'pH',
        'Temperatura (ºC)',
        'Temperamento'
    ])
    const [tableContent, setTableContent] = useState<TableContentProps[][]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    async function getFishes() {

        Promise.all([fetch('/api/fish', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin'
        }).then(res => {
            if (res.status >= 400) {
                console.log('Error na API:', res)
            }
            return res.json();
        })
            .then(result => {
                if (result.hasOwnProperty('error')) {
                    console.log('Error na API:', result.error)
                    setMessage({ message: 'Ops, algo deu errado e não consegui salvar essa informação', code: ALERT_MESSAGE_CODE.DANGER })
                    setLoading(false)
                    return false
                } else {
                    console.log(result)
                    setTableContent(
                        result.map((content: Fish) => {
                            return [
                                { text: content.id },
                                { text: content.name + ', ' + content.nameEn },
                                { text: content.scientificName },
                                { text: Math.min(...content.ph) + ' - ' + Math.max(...content.ph) },
                                { text: Math.min(...content.temperature) + ' - ' + Math.max(...content.temperature) },,
                                { text: TEMPERAMENT_OTHERS.get(content.temperamentOthers) + ', ' + TEMPERAMENT_SAME.get(content.temperamentSame) }
                            ]
                        })
                    )
                    setMessage({ message: result, code: ALERT_MESSAGE_CODE.SUCCESS })
                    setLoading(false)
                }
            }
            )
        ])
    }

    useEffect(() => {
        getFishes()
    }, [])

    return (
        <div className="flex flex-col gap-4 h-screen w-full px-4 md:pl-28 pt-4">
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

    if (!currentUser || currentUser?.data?.role_id == USER_ROLE.AQUARIST) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return { props: {} }
}