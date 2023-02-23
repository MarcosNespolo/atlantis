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
        return { statusCode: 500, data: userDataError }
    }

    if (!userData) {
        return { statusCode: 404, data: error }
    }

    return { statusCode: 200, data: userData }
}

export async function updateUser(user: User) {

    const { data: userData, error: userDataError } = await supabase
        .from('USER')
        .update({...user, email: undefined})
        .eq('user_id', user.user_id)

    if (userDataError) {
        return { statusCode: 500, data: userDataError }
    }

    return { statusCode: 200, data: userData }
}

export async function getCurrentUser(token: string) {
    const { data: { user } } = await supabase.auth.getUser(token)

    let error = 'Usuário não encontrado'

    if (!user?.email) {
        destroyCookie(undefined, 'atlantis_token', {
            path: "/",
        })
        return { statusCode: 404, data: error }
    }

    const { data: currentUser, error: currentUserError } = await supabase
        .from('USER')
        .select(`*`)
        .eq('email', user.email)
        .single()

    if (currentUserError) {
        destroyCookie(undefined, 'atlantis_token', {
            path: "/",
        })
        return { statusCode: 500, data: currentUserError }
    }

    if (!currentUser) {
        destroyCookie(undefined, 'atlantis_token', {
            path: "/",
        })
        return { statusCode: 404, data: error }
    }

    return { statusCode: 200, data: currentUser }
}

export async function getUser(user_id: string) {
    let error = 'Usuário não encontrado'

    const { data: userData, error: userError } = await supabase
        .from('USER')
        .select(`*`)
        .eq('user_id', user_id)
        .single()

    if (userError) {
        return { statusCode: 500, data: userError }
    }

    if (!userData) {
        return { statusCode: 404, data: error }
    }

    return { statusCode: 200, data: userData }
}

export async function listUsers() {
    let error = 'A consulta não encontrou resultados'

    const { data: userData, error: userError } = await supabase
        .from('USER')
        .select(`*, role_id(role_id, name)`)

    if (userError) {
        return { statusCode: 500, data: userError }
    }

    if (!userData) {
        return { statusCode: 404, data: error }
    }

    return { statusCode: 200, data: userData }
}