import { GetServerSideProps } from "next"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import Table, { TableContentProps } from "../../components/tables/Table"
import { ALERT_MESSAGE_CODE, USER_ROLE } from "../../utils/constants"
import { AlertMessage } from "../../utils/types"
import { parseCookies } from 'nookies'
import { getCurrentUser } from "../../services/user"
import Image from "next/image"

export default function Substrate() {
    const [tableHeader, setTableHeader] = useState<string[]>([
        'ID',
        'Nome',
        'Descrição'
    ])
    const [tableContent, setTableContent] = useState<TableContentProps[][]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    async function getSubstrates() {
        setLoading(true)
        Promise.all([fetch('/api/substrate', {
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
                setLoading(false)
                if (result.hasOwnProperty('error')) {
                    console.log('Error na API:', result.error)
                    setMessage({ message: 'Ops, algo deu errado e não consegui salvar essa informação', code: ALERT_MESSAGE_CODE.DANGER })
                    return false
                } else {
                    result && setTableContent(
                        result.map((content: any) => {
                            return [
                                { text: content.substrate_id },
                                { text: content.name },
                                { text: content.description }
                            ]
                        })
                    )
                    setMessage({ message: result, code: ALERT_MESSAGE_CODE.SUCCESS })
                }
            }
            )]);
    }

    useEffect(() => {
        getSubstrates()
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
                            text={'+ Novo substrato'}
                            onClick={() => Router.push('/substrate/newSubstrate')}
                        />
                    </div>
                    <div className="h-fit w-full">
                        <Table header={tableHeader} content={tableContent} onClick={Router.push} pathToEdit={'/substrate/'} />
                    </div>
                </>
            }
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