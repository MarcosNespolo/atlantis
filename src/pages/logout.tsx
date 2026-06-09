import { GetServerSideProps } from "next"
import React from "react"
import { destroyCookie } from 'nookies'
import { supabaseBrowser as supabaseAuth } from "../lib/supabase/browser"

export default function Logout() {
    return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    try {
        await supabaseAuth.auth.signOut()
        destroyCookie(ctx, 'atlantis_token', {
            path: "/",
        })

    } catch (error) {
        console.error('Ocorreu um erro durante o logout:', error);
    }
    return {
        redirect: {
            destination: '/',
            permanent: false,
        }
    }
}