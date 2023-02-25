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

export async function getFoodsService(food_id: string) {
    const { data: foodData, error: foodDataError } = await supabase
        .from('FOOD')
        .select('*')
        .eq('food_id', food_id)
        .single()

    if (foodDataError) {
        console.log(foodDataError)
        throw { data: foodDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: foodData }
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

export async function updateFoodService(food: Food) {
    console.log(food)

    const { data: foodData, error: foodDataError } = await supabase
        .from('FOOD')
        .update({...food})
        .eq('food_id', food.food_id)

    if (foodDataError) {
        return { statusCode: 500, data: foodDataError }
    }

    return { statusCode: 200, data: foodData }
}