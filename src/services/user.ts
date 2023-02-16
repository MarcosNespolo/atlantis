import { supabase } from "../../supabaseClient";
import { User } from "../utils/types";

export default async function registerNewUser(user: User) {
    const { data: userData, error: userDataError } = await supabase
        .from('USER')
        .insert(user)

    if (userDataError) {
        console.log(userDataError)
        throw { message: userDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, message: 'Cadastro realizado!' }
}