import { supabase } from "../../supabaseClient";
import { ALERT_MESSAGE_CODE } from "../utils/constants";
import { Fish, FishBD, Substrate } from "../utils/types";

export async function createNewFishService(fish: Fish, user_id: number) {

    const { count: fishCount, error: fishCountError } = await supabase
        .from('FISH')
        .select('*', { count: 'exact', head: true })
        .eq('scientific_name', fish.scientificName)

    if (fishCountError) {
        console.log(fishCountError)
        throw { data: fishCountError.message, statusCode: 500 }
    }

    if (fishCount && fishCount > 0) {
        return { data: { message: 'Não foi possível salvar, o nome ciêntífico já existe no sistema.', code: ALERT_MESSAGE_CODE.DANGER }, statusCode: 500 }
    }

    const fishBD = await prepareFishBD(fish, user_id)

    const { data: fishData, error: fishDataError } = await supabase
        .from('FISH')
        .insert({ ...fishBD, fish_id: undefined })

    if (fishDataError) {
        console.log(fishDataError)
        throw { data: fishDataError.message, statusCode: 500 }
    }

    return { data: { message: 'Nova espécie salva na base da dados!', code: ALERT_MESSAGE_CODE.SUCCESS }, statusCode: 200 }
}

export async function getFishService(fish_id: string) {
    const { data: fishData, error: fishDataError } = await supabase
        .from('FISH')
        .select('*, food: food_id(*), substrates: substrate_id(*), specialist: specialist_id(*)')
        .eq('fish_id', fish_id)
        .single()

    if (fishDataError) {
        console.log(fishDataError)
        throw { data: fishDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: prepareResponseFish(fishData) }
}

export async function listFishesService() {
    const { data: fishData, error: fishDataError } = await supabase
        .from('FISH')
        .select('*, food: food_id(*), substrates: substrate_id(*), specialist: specialist_id(*)')

    if (fishDataError) {
        console.log(fishDataError)
        throw { data: fishDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: prepareResponseFishArray(fishData) }
}

export async function updateFishService(fish: Fish, user_id: number) {

    const fishBD = await prepareFishBD(fish, user_id)

    const { data: fishData, error: fishDataError } = await supabase
        .from('FISH')
        .update({ ...fishBD })
        .eq('fish_id', fishBD.fish_id)

    if (fishDataError) {
        console.log(fishDataError)
        return { statusCode: 500, data: fishDataError }
    }

    return { statusCode: 200, data: fishData }
}

function prepareResponseFishArray(fishesBD: FishBD[]) {
    const fishes: Fish[] = fishesBD.map(fishBD => {
        return prepareResponseFish(fishBD)
    })

    return fishes
}

function prepareFishBD(fish: Fish, user_id: number) {
    console.log(fish)

    let food_id: number | null = null
    let substrate_id: number | null = null

    if (fish?.food && fish?.food[0]?.food_id) {
        food_id = +fish?.food[0]?.food_id
    }

    const fishBD: FishBD = {
        fish_id: fish.id,
        name: fish.name,
        image: fish.image,
        name_en: fish.nameEn,
        scientific_name: fish.scientificName,
        minimum_shoal: fish.minimumShoal,
        position: fish.position,
        substrate_id: substrate_id,
        temperament_same: fish.temperamentSame,
        temperament_others: fish.temperamentOthers,
        food_id: food_id,
        size: fish.size,
        aquarium_width_min: fish.aquariumWidth[0],
        aquarium_width_max: fish.aquariumWidth[1],
        aquarium_height_min: fish.aquariumHeight[0],
        aquarium_height_max: fish.aquariumHeight[1],
        volume_first: fish.volumeFirst,
        volume_additional: fish.volumeAdditional,
        temperature_min: fish.temperature[0],
        temperature_max: fish.temperature[1],
        ph_min: fish.ph[0],
        ph_max: fish.ph[1],
        dgh_min: fish.dgh[0],
        dgh_max: fish.dgh[1],
        salinity_min: fish.salinity[0],
        salinity_max: fish.salinity[1],
        note: fish.note,
        specialist_id: user_id
    }
    console.log(fishBD)
    return fishBD
}

function prepareResponseFish(fishBD: FishBD) {

    let fish_substrates: Substrate[] | null = null
    let fish_food: Substrate[] | null = null

    if (fishBD?.substrate) {
        fish_substrates = [fishBD?.substrate]
    }

    if (fishBD?.food) {
        fish_food = [fishBD?.food]
    }

    const fish: Fish = {
        id: fishBD.fish_id,
        name: fishBD.name,
        image: fishBD.image,
        nameEn: fishBD.name_en,
        scientificName: fishBD.scientific_name,
        minimumShoal: fishBD.minimum_shoal,
        position: fishBD.position,
        substrates: fish_substrates,
        temperamentSame: fishBD.temperament_same,
        temperamentOthers: fishBD.temperament_others,
        food: fish_food,
        size: fishBD.size,
        aquariumWidth: [fishBD.aquarium_width_min, fishBD.aquarium_width_max],
        aquariumHeight: [fishBD.aquarium_height_min, fishBD.aquarium_height_max],
        volumeFirst: fishBD.volume_first,
        volumeAdditional: fishBD.volume_additional,
        temperature: [fishBD.temperature_min, fishBD.temperature_max],
        ph: [fishBD.ph_min, fishBD.ph_max],
        dgh: [fishBD.dgh_min, fishBD.dgh_max],
        salinity: [fishBD.salinity_min, fishBD.salinity_max],
        note: fishBD.note,
        specialist: fishBD.specialist
    }

    return fish
}