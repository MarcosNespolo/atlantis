import { supabase } from "../../supabaseClient";
import { User } from "../utils/types";
import { destroyCookie } from 'nookies'

export async function registerNewUser(user: User) {
    let error = 'Usuário não encontrado'
    const { data: userData, error: userDataError } = await supabase
        .from('USER')
        .insert(user)

    if (userDataError) {
        console.log(userDataError)
        return { statusCode: 500, message: userDataError }
    }

    if (!userData) {
        return { statusCode: 404, message: error }
    }

    return { statusCode: 200, message: userData }
}

export async function getCurrentUser(token: string) {
    const { data: { user } } = await supabase.auth.getUser(token)
    let error = 'Usuário não encontrado'
    if (!user?.email) {
        destroyCookie(undefined, 'atlantis_token')
        return { statusCode: 404, message: error }
    }

    const { data: currentUser, error: currentUserError } = await supabase
        .from('USER')
        .select(`*`)
        .eq('email', user.email)
        .single()

    if (currentUserError) {
        return { statusCode: 500, message: currentUserError }
    }

    if (!currentUser) {
        return { statusCode: 404, message: error }
    }

    return { statusCode: 200, message: currentUser }
}