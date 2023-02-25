import { GetServerSideProps } from "next"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import SecondaryButton from "../../components/buttons/SecondaryButton"
import Card from "../../components/cards/CardBase"
import InputText from "../../components/inputs/InputText"
import H1 from "../../components/texts/h1"
import { getCurrentUser } from "../../services/user"
import { ALERT_MESSAGE_CODE, USER_ROLE } from "../../utils/constants"
import { AlertMessage, Substrate } from "../../utils/types"
import { parseCookies } from 'nookies'
import { getSubstrateService } from "../../services/substrate"

export default function EditSubstrate({ substrateProps }: any) {
    const [substrate, setSubstrate] = useState<Substrate>()
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    useEffect(() => {
        console.log(substrateProps)
        if (substrateProps) {
            setSubstrate(substrateProps)
        } else {
            Router.push('/substrate')
        }
    }, [])


    async function updateSubstrate() {
        setLoading(true)
        Promise.all([fetch('/api/substrate', {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify(substrate)
        }).then(res => {
            if (res.status >= 400) {
                console.log('Error na API:', res)
                return {error: res}
            }
            return res.json();
        })
            .then(result => {
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

    return (
        <div className="flex h-screen w-full">
            <Card
                darkTheme={false}
                className={`w-full max-w-2xl m-auto py-4 px-6 sm:py-8 sm:px-10`}
                alertMessage={message}
            >
                <div className="w-full flex flex-col sm:flex-row justify-between mb-4 sm:mb-8">
                    <H1 className={''}>
                        Editar Alimento
                    </H1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <InputText
                        label={'Nome'}
                        className={'col-span-1'}
                        value={substrate?.name ?? ''}
                        onChange={(newName) => substrate && setSubstrate({ ...substrate, name: newName })}
                    />
                    <InputText
                        label={'Descrição'}
                        className={'col-span-1 sm:col-span-2'}
                        value={substrate?.description ?? ''}
                        lines={4}
                        onChange={(newDescription) => substrate && setSubstrate({ ...substrate, description: newDescription })}
                    />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                    <SecondaryButton
                        text={'Voltar'}
                        className="w-full"
                        onClick={() => Router.push('/substrate')}
                    />
                    <PrimaryButton
                        text={'Salvar'}
                        className="w-full"
                        onClick={() => updateSubstrate()}
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
                destination: '/substrate',
                permanent: false,
            }
        }
    }

    const id = ctx.params.id
    const substrate = await getSubstrateService(id)

    if (substrate?.statusCode != 200) {
        return {
            redirect: {
                destination: '/substrate',
                permanent: false,
            }
        }
    }

    return {
        props: {
            substrateProps: substrate.data
        }
    }
}