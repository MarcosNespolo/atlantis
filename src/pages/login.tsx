import Router from "next/router"
import React, { useState } from "react"
import PrimaryButton from "../components/buttons/PrimaryButton"
import TertiaryButton from "../components/buttons/TertiaryButton"
import Card from "../components/cards/CardBase"
import InputText from "../components/inputs/InputText"
import H1 from "../components/texts/h1"
import { useAuthContext } from "../contexts/AuthContext"
import { ALERT_MESSAGE_CODE } from "../utils/constants"
import { AlertMessage } from "../utils/types"

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [message, setMessage] = useState<AlertMessage>()
    const {
        login
    } = useAuthContext()


    const onFormSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!loading && login) {
            console.log(email, password)
            setMessage({ message: await login(email, password), code: ALERT_MESSAGE_CODE.DANGER })
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
                            Login
                        </H1>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-4">
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
                        />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 sm:gap-8">
                        <PrimaryButton
                            text={'Entrar'}
                            type={'submit'}
                            className="w-full"
                        />
                    </div>
                    <TertiaryButton
                        text={'Criar conta'}
                        className="w-fit mx-auto mt-4"
                        onClick={() => Router.push('/register')}
                    />
                </form>
            </Card>
        </div>
    )
}
