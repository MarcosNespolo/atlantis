import { supabaseBrowser as supabase } from "../lib/supabase/browser";
import { Substrate } from "../utils/types";
import { substrateRowToDomain } from "../lib/mappers";
import { substrateDomainToLegacy } from "../lib/legacy";

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
    const { data, error } = await supabase
        .from('substrates')
        .select('*')
        .order('id')

    if (error) {
        console.log(error)
        return { data: null, statusCode: 500 }
    }

    return { data: (data ?? []).map((r: any) => substrateDomainToLegacy(substrateRowToDomain(r))), statusCode: 200 }
}


export async function getSubstrateService(substrate_id: string) {
    const { data, error } = await supabase
        .from('substrates')
        .select('*')
        .eq('id', substrate_id)
        .single()

    if (error) {
        console.log(error)
        return { statusCode: 500, data: null }
    }

    return { statusCode: 200, data: substrateDomainToLegacy(substrateRowToDomain(data as any)) }
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