import { supabase } from "../../supabaseClient";
import { Food } from "../utils/types";

export async function createNewFoodService(food: Food) {
    const { data: foodData, error: foodDataError } = await supabase
        .from('FOOD')
        .insert(food)

    if (foodDataError) {
        console.log(foodDataError)
        throw { data: foodDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: 'Novo alimento salvo na base da dados!' }
}

export async function listFoodsService() {
    const { data: foodData, error: foodDataError } = await supabase
        .from('FOOD')
        .select('*')

    if (foodDataError) {
        console.log(foodDataError)
        throw { data: foodDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: foodData }
}