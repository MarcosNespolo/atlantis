import { supabase } from "../../supabaseClient";
import { Substrate } from "../utils/constants";

export default async function createNewSubstrate(substrate: Substrate) {

    console.log(substrate)

    const { data: substrateData, error: substrateDataError } = await supabase
        .from('SUBSTRATE')
        .insert({ name: substrate.name })

    if (substrateDataError) {
        console.log(substrateDataError)
        throw { message: substrateDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, message: 'Novo substrato salvo na base da dados!' }
}