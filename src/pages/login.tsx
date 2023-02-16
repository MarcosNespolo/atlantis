import { XMarkIcon } from "@heroicons/react/24/outline"
import Router from "next/router"
import React, { useState } from "react"
import PrimaryButton from "../components/buttons/PrimaryButton"
import SecondaryButton from "../components/buttons/SecondaryButton"
import TertiaryButton from "../components/buttons/TertiaryButton"
import Card from "../components/cards/CardBase"
import InputText from "../components/inputs/InputText"
import H1 from "../components/texts/h1"
import { AlertMessage, ALERT_MESSAGE_CODE } from "../utils/constants"

export default function Register() {
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()

    async function registerUser() {

        const food = {
            name,
            description
        }

        setLoading(true)

        Promise.all([fetch('/api/user', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify(food)
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
                    setMessage({ message: result, code: ALERT_MESSAGE_CODE.SUCCESS })
                    setLoading(false)
                }
            }
            )]);
    }

    return (
        <div className="flex h-screen w-full">
            <Card
                darkTheme={false}
                className={`w-full max-w-lg m-auto py-4 px-6 sm:py-8 sm:px-10`}
                alertMessage={message}
            >
                <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-8">
                    <H1 className={''}>
                        Login
                    </H1>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                    <InputText
                        label={'E-mail'}
                        className={'col-span-1'}
                        value={name}
                        onChange={setName}
                    />
                    <InputText
                        label={'Senha'}
                        className={'col-span-1'}
                        value={description}
                        onChange={setDescription}
                    />
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                    <PrimaryButton
                        text={'Entrar'}
                        className="w-full"
                        onClick={() => registerUser()}
                    />
                </div>
                <TertiaryButton
                    text={'Criar conta'}
                    className="w-fit mx-auto mt-4"
                    onClick={() => Router.push('/register')}
                />
            </Card>
        </div>
    )
}
