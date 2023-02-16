import { supabase } from "../../supabaseClient";
import { Substrate } from "../utils/types";

export default async function createNewSubstrate(substrate: Substrate) {
    const { data: substrateData, error: substrateDataError } = await supabase
        .from('SUBSTRATE')
        .insert(substrate)

    if (substrateDataError) {
        console.log(substrateDataError)
        throw { message: substrateDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, message: 'Novo substrato salvo na base da dados!' }
}