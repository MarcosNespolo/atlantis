import { supabase } from "../../supabaseClient";
import { Substrate } from "../utils/types";

export async function createNewSubstrateService(substrate: Substrate) {
    const { data: substrateData, error: substrateDataError } = await supabase
        .from('SUBSTRATE')
        .insert(substrate)

    if (substrateDataError) {
        console.log(substrateDataError)
        throw { data: substrateDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: 'Novo substrato salvo na base da dados!' }
}


export async function listSubstrateService() {
    const { data: substrateData, error: substrateDataError } = await supabase
        .from('SUBSTRATE')
        .select('*')

    if (substrateDataError) {
        console.log(substrateDataError)
        throw { data: substrateDataError.message, statusCode: 500 }
    }

    return { data: substrateData, statusCode: 200 }
}