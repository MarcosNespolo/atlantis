import Router from "next/router"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { recoverUserInformation, signInRequest, signOutRequest } from "../services/auth"
import { REQUEST_TYPE } from "../utils/constants"
import { setCookie, parseCookies } from 'nookies'

type AuthContextProviderProps = {
    children: ReactNode
}

type AuthContextType = {
    login: (email: string, password: string) => Promise<string | void>
    logout: () => Promise<void>
    register: (name: string, email: string, password: string) => Promise<string | void>
    setUser: (user: any) => void
    user: any
}


export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<any>()

    useEffect(() => {
        const { 'atlantis_token': token } = parseCookies()

        if (token) {
            recoverUserInformation().then(response => {
                if (response.error) {
                    console.log(response.error)
                    Router.push('/logout')
                }
                setUser(response.user)
            })
        }else{
            setUser(null)
        }
    }, [])

    async function login(email: string, password: string) {
        const { token, user, error } = await signInRequest({ email, password, type: REQUEST_TYPE.SIGN_IN })

        if (error) {
            return error
        }
        if (!token) {
            return 'Não foi possível logar'
        }
        setUser(user)
        setCookie(undefined, 'atlantis_token', token, {
            maxAge: 60 * 60 * 4, // 4h
        })
        Router.push('/newAquarium')
    }

    async function register(name: string, email: string, password: string) {
        const { token, user, error } = await signInRequest({ email, password, type: REQUEST_TYPE.SIGN_UP, name })
        
        if (error) {
            return error
        }
        if (!token) {
            return 'Não foi possível logar'
        }
        setUser(user)
        setCookie(undefined, 'atlantis_token', token, {
            maxAge: 60 * 60 * 4, // 4h
        })
        Router.push('/newAquarium')
    }

    async function logout(){
        await signOutRequest()
    }

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                register,
                setUser,
                user
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContext = createContext({} as AuthContextType)