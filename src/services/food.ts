import { supabaseBrowser as supabase } from "../lib/supabase/browser";
import { Food } from "../utils/types";
import { foodRowToDomain } from "../lib/mappers";
import { foodDomainToLegacy } from "../lib/legacy";

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
    const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', food_id)
        .single()

    if (error) {
        console.log(error)
        return { statusCode: 500, data: null }
    }

    return { statusCode: 200, data: foodDomainToLegacy(foodRowToDomain(data as any)) }
}

export async function listFoodsService() {
    const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('id')

    if (error) {
        console.log(error)
        return { statusCode: 500, data: null }
    }

    return { statusCode: 200, data: (data ?? []).map((r: any) => foodDomainToLegacy(foodRowToDomain(r))) }
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