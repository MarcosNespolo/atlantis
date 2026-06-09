import React, { useEffect } from "react"
import Router from "next/router"
import { useAuthContext } from "../contexts/AuthContext"

export default function Logout() {
    const { logout } = useAuthContext()

    useEffect(() => {
        // logout() encerra a sessão Supabase e redireciona para '/'.
        logout().catch(() => Router.replace('/'))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <></>
}
