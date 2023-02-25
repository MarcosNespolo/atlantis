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


export async function getSubstrateService(substrate_id: string) {
    const { data: substrateData, error: substrateDataError } = await supabase
        .from('SUBSTRATE')
        .select('*')
        .eq('substrate_id', substrate_id)
        .single()

    if (substrateDataError) {
        console.log(substrateDataError)
        throw { data: substrateDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: substrateData }
}

export async function updateSubstrateService(substrate: Substrate) {
    console.log(substrate)

    const { data: substrateData, error: substrateDataError } = await supabase
        .from('SUBSTRATE')
        .update({...substrate})
        .eq('substrate_id', substrate.substrate_id)

    if (substrateDataError) {
        return { statusCode: 500, data: substrateDataError }
    }

    return { statusCode: 200, data: substrateData }
}