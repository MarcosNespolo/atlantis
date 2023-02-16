import { supabase } from "../../supabaseClient";
import { Food } from "../utils/types";

export default async function createNewFood(food: Food) {
    const { data: substrateData, error: substrateDataError } = await supabase
        .from('FOOD')
        .insert(food)

    if (substrateDataError) {
        console.log(substrateDataError)
        throw { message: substrateDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, message: 'Novo alimento salvo na base da dados!' }
}