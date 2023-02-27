import { GetServerSideProps } from "next"
import Router from "next/router"
import React, { useEffect, useState } from "react"
import Card from "../../components/cards/CardBase"
import H1 from "../../components/texts/h1"
import { getUser } from "../../services/user"
import { AlertMessage, User } from "../../utils/types"
import Link from "next/link"
import TertiaryButton from "../../components/buttons/TertiaryButton"

export default function NewSubstrate({ userProps }: any) {
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    useEffect(() => {
        if (userProps) {
            setUser(userProps)
        } else {
            Router.push('/')
        }
    }, [])

    return (
        <div className="flex h-screen w-full">
            <Card
                darkTheme={false}
                className={`w-full max-w-2xl m-auto py-4 px-6 sm:py-8 sm:px-10`}
                alertMessage={message}
            >
                <div className="w-full flex flex-col sm:flex-row justify-between sm:items-end">
                    <H1>
                        {user?.name}
                    </H1>
                    <p className={'font-semibold text-sm sm:text-lg text-action-2 tracking-wide '}>
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-col gap-8">
                    {user?.description &&
                        <span className="text mt-6 text-justify">{user?.description}</span>
                    }
                    {user?.link &&
                        <Link href={user?.link} target={'_blank'}>
                            <TertiaryButton className="mx-auto" text={user?.link} />
                        </Link>
                    }
                </div>
            </Card>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if (!ctx?.params?.id || typeof ctx.params.id != 'string') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const id = ctx.params.id
    const user = await getUser(id)

    if (user?.statusCode != 200) {
        return {
            redirect: {
                destination: '/',
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