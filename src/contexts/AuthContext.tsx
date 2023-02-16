import Router from "next/router"
import { createContext, ReactNode, useContext, useState } from "react"
import { signInRequest, signOutRequest } from "../services/auth"

type AuthContextProviderProps = {
    children: ReactNode
}

type AuthContextType = {
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

    async function signIn(email: string, password: string) {
        const { user, error } = await signInRequest({ email, password })
        console.log(user)
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
                signIn,
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