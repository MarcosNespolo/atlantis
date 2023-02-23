import { GetServerSideProps } from "next"
import Router, { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PrimaryButton from "../../components/buttons/PrimaryButton"
import SecondaryButton from "../../components/buttons/SecondaryButton"
import Card from "../../components/cards/CardBase"
import InputText from "../../components/inputs/InputText"
import H1 from "../../components/texts/h1"
import { getCurrentUser, getUser } from "../../services/user"
import { ALERT_MESSAGE_CODE, USER_ROLE, USER_ROLE_MAP } from "../../utils/constants"
import { AlertMessage, User } from "../../utils/types"
import { parseCookies } from 'nookies'
import InputSelect from "../../components/inputs/InputSelect"

export default function NewSubstrate({ userProps }: any) {
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    useEffect(() => {
        console.log(userProps)
        if (userProps) {
            setUser(userProps)
        } else {
            Router.push('/user')
        }
    }, [])


    async function updateUser() {
        setLoading(true)

        Promise.all([fetch('/api/user', {
            method: 'PUT',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify(user)
        }).then(res => {
            if (res.status >= 400) {
                console.log('Error na API:', res)
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
                        Usuário
                    </H1>
                    {user?.role_id &&
                        <InputSelect
                            className="w-fit"
                            selected={user?.role_id?.toString()}
                            list={Array.from(USER_ROLE_MAP, ([value, option]) => ({ value, option }))}
                            onChange={(newRole) => user && setUser({ ...user, role_id: +newRole })}
                            removeDefaultOption
                        />
                    }
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <InputText
                        label={'Nome'}
                        className={'col-span-1'}
                        value={user?.name ?? ''}
                        onChange={(newName) => user && setUser({ ...user, name: newName })}
                    />
                    <InputText
                        disabled
                        label={'E-mail'}
                        className={'col-span-1'}
                        value={user?.email ?? ''}
                        onChange={(newEmail) => user && setUser({ ...user, email: newEmail })}
                    />
                    <InputText
                        label={'Link'}
                        className={'col-span-1 sm:col-span-2'}
                        value={user?.link ?? ''}
                        onChange={(newLink) => user && setUser({ ...user, link: newLink })}
                    />
                    <InputText
                        label={'Descrição'}
                        className={'col-span-1 sm:col-span-2'}
                        value={user?.description ?? ''}
                        lines={2}
                        onChange={(newDescription) => user && setUser({ ...user, description: newDescription })}
                    />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                    <SecondaryButton
                        text={'Voltar'}
                        className="w-full"
                        onClick={() => Router.push('/user')}
                    />
                    <PrimaryButton
                        text={'Salvar'}
                        className="w-full"
                        onClick={() => updateUser()}
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

    if (currentUser?.data?.role_id != USER_ROLE.ADMINISTRATOR) {
        return {
            props: {
                userProps: { ...currentUser.data, role_id: null }
            }
        }
    }

    if (!ctx?.params?.id || typeof ctx.params.id != 'string') {
        return {
            props: {
                userProps: { ...currentUser.data, role_id: null }
            }
        }
    }

    const id = ctx.params.id
    const user = await getUser(id)

    if (user?.statusCode != 200) {
        return {
            redirect: {
                destination: '/user',
                permanent: false,
            }
        }
    }

    return {
        props: {
            userProps: user.data
        }
    }
}