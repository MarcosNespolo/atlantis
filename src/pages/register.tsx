import React, { useState } from "react"
import PrimaryButton from "../components/buttons/PrimaryButton"
import TertiaryButton from "../components/buttons/TertiaryButton"
import Card from "../components/cards/CardBase"
import InputText from "../components/inputs/InputText"
import H1 from "../components/texts/h1"
import { ALERT_MESSAGE_CODE } from "../utils/constants"
import { AlertMessage } from "../utils/types"
import { useAuthContext } from '../contexts/AuthContext'
import Link from "next/link"

export default function Register() {
    const [name, setName] = useState<string>('Maria')
    const [email, setEmail] = useState<string>('aquarista@email.com')
    const [password, setPassword] = useState<string>('123456')
    const [confirmPassword, setConfirmPassword] = useState<string>('123456')
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()
    const {
        register
    } = useAuthContext()

    // async function registerUser() {

    //     const user = {
    //         name,
    //         email,
    //         password
    //     }

    //     setLoading(true)

    //     Promise.all([fetch('/api/user', {
    //         method: 'POST',
    //         headers: new Headers({ 'Content-Type': 'application/json' }),
    //         credentials: 'same-origin',
    //         body: JSON.stringify(user)
    //     }).then(res => {
    //         if (res.status >= 400) {
    //             console.log('Error na API:', res)
    //         }
    //         return res.json();
    //     })
    //         .then(result => {
    //             if (result.hasOwnProperty('error')) {
    //                 console.log('Error na API:', result.error)
    //                 setMessage({ message: 'Ops, algo deu errado e não consegui salvar essa informação', code: ALERT_MESSAGE_CODE.DANGER })
    //                 setLoading(false)
    //                 return false
    //             } else {
    //                 setMessage({ message: result, code: ALERT_MESSAGE_CODE.SUCCESS })
    //                 setLoading(false)
    //             }
    //         }
    //         )]);
    // }

    const onFormSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!loading && register) {
            console.log(email, password)
            const responseMessage = await register(name, email, password)
            if (responseMessage) {
                setMessage({ message: responseMessage, code: ALERT_MESSAGE_CODE.DANGER })
            } else {
                setMessage(undefined)
            }
        }
    }

    return (
        <div className="flex h-screen w-full">
            <Card
                darkTheme={false}
                className={`w-full max-w-lg m-auto py-4 px-6 sm:py-8 sm:px-10`}
                alertMessage={message}
            >
                <form className='' onSubmit={onFormSubmit}>
                    <div className="flex flex-col sm:flex-row justify-between mb-4 sm:mb-8">
                        <H1 className={''}>
                            Criar conta
                        </H1>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-4">
                        <InputText
                            label={'Nome'}
                            className={'col-span-1'}
                            value={name}
                            onChange={setName}
                        />
                        <InputText
                            label={'E-mail'}
                            className={'col-span-1'}
                            value={email}
                            onChange={setEmail}
                        />
                        <InputText
                            label={'Senha'}
                            className={'col-span-1'}
                            value={password}
                            onChange={setPassword}
                            isPassword
                        />
                        <InputText
                            label={'Confirme a senha'}
                            className={'col-span-1'}
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            isPassword
                        />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                        <PrimaryButton
                            type={'submit'}
                            text={'Salvar'}
                            className="w-full"
                        />
                    </div>
                    <Link href='/login'>
                        <TertiaryButton
                            text={'Já tenho uma conta'}
                            className="w-fit mx-auto mt-4"
                        />
                    </Link>
                </form>
            </Card>
        </div>
    )
}
