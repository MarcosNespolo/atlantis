import Router from "next/router"
import { createContext, ReactNode, useContext, useState } from "react"
import { signInRequest, signOutRequest } from "../services/auth"

type AuthContextProviderProps = {
    children: ReactNode
}

type AuthContextType = {
    login: (email: string, password: string) => Promise<string>
    signOut: () => Promise<void>
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    async function login(email: string, password: string) {
        const { user, error } = await signInRequest({ email, password })
        console.log(user)
        console.log(error)
        if (error) {
            return error
        }
        Router.push('/newAquarium')
    }

    async function signOut() {
        await signOutRequest()
    }

    return (
        <AuthContext.Provider
            value={{
                login,
                signOut
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContext = createContext({} as AuthContextType)