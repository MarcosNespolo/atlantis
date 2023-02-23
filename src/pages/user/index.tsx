import { GetServerSideProps } from "next"
import React, { useEffect, useState } from "react"
import { parseCookies } from 'nookies'
import Table, { TableContentProps } from "../../components/tables/Table"
import { AlertMessage } from "../../utils/types"
import Router from "next/router"
import Image from "next/image"

export default function Users() {
    const [tableHeader, setTableHeader] = useState<string[]>([
        'ID',
        'Perfil',
        'Nome',
        'E-mail'
    ])
    const [tableContent, setTableContent] = useState<TableContentProps[][]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    async function getUsers() {
        setLoading(true)
        Promise.all([fetch('/api/users', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin'
        }).then(res => {
            if (res.status >= 400) {
                console.log('Error na API:', res)
                Router.push('/')
            }
            return res.json();
        })
            .then(result => {
                if (result.hasOwnProperty('error')) {
                    console.log('Error na API:', result.error)
                    Router.push('/')
                    return false
                } else {
                    console.log(result)
                    result && setTableContent(
                        result.map((content: any) => {
                            return [
                                { text: content.user_id },
                                { text: content.role_id.name },
                                { text: content.name },
                                { text: content.email }
                            ]
                        })
                    )
                    setLoading(false)
                }
            }
            )]);
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="flex flex-col gap-4 h-screen w-full px-4 md:pl-28 pt-4">
            {loading
                ?
                <div className="h-full w-full flex items-center justify-center">
                    <Image src={'/circleLoading.svg'} width="64" height="64" alt={''} />
                </div>
                :
                <div className="h-fit w-full">
                    <Table header={tableHeader} content={tableContent} onClick={Router.push} pathToEdit={'/user/'} />
                </div>
            }
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { ['atlantis_token']: token } = parseCookies(ctx)

    if (!token) {
        console.log('Token inválido')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return { props: {} }
}