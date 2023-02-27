import { supabase } from "../../supabaseClient";
import { updateAquariumParameters } from "../utils/aquariumControler";
import { ALERT_MESSAGE_CODE, AQUARIUM_DEFAULT, ERROR_MESSAGE } from "../utils/constants";
import { Aquarium, AquariumBD, AquariumFishBD } from "../utils/types";
import { prepareResponseFish } from "./fish";

export async function upsertAquariumService(aquarium: Aquarium, user_id: number) {

    const aquariumBD: AquariumBD = {
        aquarium_id: aquarium.aquarium_id,
        user_id: user_id,
        name: aquarium.name,
        created_at: aquarium.created
    }

    const { data: aquariumData, error: aquariumDataError } = await supabase
        .from('AQUARIUM')
        .upsert({ ...aquariumBD })
        .select()
        .single()

    if (aquariumDataError) {
        console.log(aquariumDataError)
        throw { data: ERROR_MESSAGE.DEFAULT, statusCode: 500 }
    }

    if (!aquariumData.aquarium_id) {
        throw { data: ERROR_MESSAGE.DEFAULT, statusCode: 500 }
    }

    const aquariumFishBD: AquariumFishBD[] = aquarium.fishes.map(fish => {
        return {
            aquarium_id: aquariumData.aquarium_id,
            fish_id: fish.id,
            quantity: fish.quantity ?? 0
        }
    })

    const { data: aquariumFishDeleteData, error: aquariumFishDeleteDataError } = await supabase
        .from('AQUARIUM_FISH')
        .delete()
        .match({ aquarium_id: aquariumBD.aquarium_id })

    console.log(aquariumFishDeleteDataError)

    const { data: aquariumFishData, error: aquariumFishDataError } = await supabase
        .from('AQUARIUM_FISH')
        .upsert(aquariumFishBD)
        .select()

    if (aquariumFishDataError) {
        console.log(aquariumFishDataError)
        throw { data: ERROR_MESSAGE.DEFAULT, statusCode: 500 }
    }

    return {
        data: {
            aquarium: { ...aquarium, aquarium_id: aquariumData.aquarium_id },
            message: 'Aquário salvo!',
            code: ALERT_MESSAGE_CODE.SUCCESS
        },
        statusCode: 200
    }
}

export async function listAquariumsService(user_id: number) {
    const { data: aquariumData, error: aquariumDataError } = await supabase
        .from('AQUARIUM')
        .select('*')
        .eq('user_id', user_id)

    if (aquariumDataError) {
        console.log(aquariumDataError)
        throw { data: aquariumDataError.message, statusCode: 500 }
    }

    if (!aquariumData || aquariumData.length < 1) {
        throw { data: ERROR_MESSAGE.DEFAULT, statusCode: 500 }
    }

    const { data: aquariumFishData, error: aquariumFishDataError } = await supabase
        .from('AQUARIUM_FISH')
        .select('quantity, aquarium_id, fish: fish_id(*)')
        .in('aquarium_id', aquariumData.map((aquarium: Aquarium) => aquarium.aquarium_id))

    if (aquariumFishDataError) {
        console.log(aquariumFishDataError)
        throw { data: aquariumFishDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: prepareResponseAquariumArray(aquariumData, aquariumFishData) }
}

export async function getAquariumService(aquarium_id: string) {
    const { data: aquariumFishData, error: aquariumFishDataError } = await supabase
        .from('AQUARIUM_FISH')
        .select('quantity, aquarium: aquarium_id(*), fish: fish_id(*)')
        .eq('aquarium_id', aquarium_id)

    if (aquariumFishDataError) {
        console.log(aquariumFishDataError)
        throw { data: aquariumFishDataError.message, statusCode: 500 }
    }

    return { statusCode: 200, data: prepareResponseAquarium(aquariumFishData) }
}

function prepareResponseAquarium(aquariumFishBD: any[]) {
    const aquarium = {
        ...AQUARIUM_DEFAULT,
        aquarium_id: aquariumFishBD[0].aquarium.aquarium_id,
        name: aquariumFishBD[0].aquarium.name,
        created: aquariumFishBD[0].aquarium.created_at,
        fishes: aquariumFishBD.map(fish => {
            return {
                ...fish.fish,
                quantity: fish.quantity
            }
        })
    }

    const aquariumUpdated = updateAquariumParameters(aquarium, aquarium.fishes.map(fish =>
        prepareResponseFish(fish)
    ))

    return aquariumUpdated
}

function prepareResponseAquariumArray(aquariumData: any[], aquariumFishBD: any[]) {
    const aquariums = aquariumData.map(aquarium => {
        return {
            ...AQUARIUM_DEFAULT,
            aquarium_id: aquarium.aquarium_id,
            name: aquarium.name,
            created: aquarium.created,
            fishes: aquariumFishBD.filter(fish =>
                fish.aquarium_id == aquarium.aquarium_id
            ).map(fish => {
                return {
                    ...fish.fish,
                    quantity: fish.quantity
                }
            })
        }
    })

    const aquariumUpdated = aquariums.map(aquarium =>
        updateAquariumParameters(aquarium, aquarium.fishes.map(fish =>
            prepareResponseFish(fish)
        ))
    )

    return aquariumUpdated
}
