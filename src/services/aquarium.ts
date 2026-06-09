import { supabaseBrowser } from "../lib/supabase/browser";
import { fishRowToDomain } from "../lib/mappers";
import { fishDomainToLegacy } from "../lib/legacy";
import { ALERT_MESSAGE_CODE, AQUARIUM_DEFAULT, ERROR_MESSAGE } from "../utils/constants";
import { Aquarium, Fish } from "../utils/types";
import type { WaterType } from "../domain/types";

// Persistência de aquários no schema NOVO (aquariums + aquarium_fish), via cliente
// autenticado do usuário. A RLS (aq_owner/aqf_owner) garante que só o dono lê/escreve.
const FISH_SELECT = '*, fish_substrates(substrates(*)), fish_foods(foods(*)), specialist:profiles(*)'

function inferWaterType(fishes: Fish[]): WaterType {
    const counts: Record<string, number> = {}
    for (const f of fishes) {
        const w = f.waterType ?? 'doce'
        counts[w] = (counts[w] ?? 0) + 1
    }
    let best: WaterType = 'doce'
    let bestN = -1
    for (const w of Object.keys(counts)) {
        if (counts[w] > bestN) { bestN = counts[w]; best = w as WaterType }
    }
    return best
}

function rowToLegacyAquarium(row: any): Aquarium {
    const fishes: Fish[] = (row.aquarium_fish ?? [])
        .filter((af: any) => af.fish)
        .map((af: any) => ({ ...fishDomainToLegacy(fishRowToDomain(af.fish)), quantity: af.quantity }))
    return {
        ...AQUARIUM_DEFAULT,
        aquarium_id: row.id,
        name: row.name,
        created: row.created_at,
        fishes,
    }
}

// Salva (insere ou atualiza) o aquário do usuário logado + recria os itens.
export async function saveAquariumService(aquarium: Aquarium) {
    const { data: { user } } = await supabaseBrowser.auth.getUser()
    if (!user) {
        return { statusCode: 401, data: { message: 'É necessário estar logado para salvar um aquário.', code: ALERT_MESSAGE_CODE.DANGER } }
    }

    const fishes = aquarium.fishes.filter(f => (f.quantity ?? 0) > 0)
    const waterType = inferWaterType(fishes)
    const name = aquarium.name?.trim() || 'Meu aquário'

    let aquariumId = aquarium.aquarium_id

    if (aquariumId) {
        const { error } = await supabaseBrowser.from('aquariums').update({ name, water_type: waterType }).eq('id', aquariumId)
        if (error) { console.log(error); return { statusCode: 500, data: { message: ERROR_MESSAGE.DEFAULT, code: ALERT_MESSAGE_CODE.DANGER } } }
    } else {
        const { data, error } = await supabaseBrowser.from('aquariums').insert({ user_id: user.id, name, water_type: waterType }).select('id').single()
        if (error || !data) { console.log(error); return { statusCode: 500, data: { message: ERROR_MESSAGE.DEFAULT, code: ALERT_MESSAGE_CODE.DANGER } } }
        aquariumId = (data as any).id
    }

    // recria os itens (upsert por substituição)
    await supabaseBrowser.from('aquarium_fish').delete().eq('aquarium_id', aquariumId)
    if (fishes.length > 0) {
        const rows = fishes.map(f => ({ aquarium_id: aquariumId, fish_id: f.id, quantity: f.quantity ?? 1 }))
        const { error } = await supabaseBrowser.from('aquarium_fish').insert(rows)
        if (error) { console.log(error); return { statusCode: 500, data: { message: ERROR_MESSAGE.DEFAULT, code: ALERT_MESSAGE_CODE.DANGER } } }
    }

    return {
        statusCode: 200,
        data: { aquarium: { ...aquarium, aquarium_id: aquariumId, name }, message: 'Aquário salvo!', code: ALERT_MESSAGE_CODE.SUCCESS },
    }
}

export async function listAquariumsService() {
    const { data: { user } } = await supabaseBrowser.auth.getUser()
    if (!user) return { statusCode: 401, data: null }

    const { data, error } = await supabaseBrowser
        .from('aquariums')
        .select(`id, name, water_type, created_at, aquarium_fish(quantity, fish(${FISH_SELECT}))`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) { console.log(error); return { statusCode: 500, data: null } }
    return { statusCode: 200, data: (data ?? []).map(rowToLegacyAquarium) }
}

export async function getAquariumService(aquarium_id: string) {
    const { data, error } = await supabaseBrowser
        .from('aquariums')
        .select(`id, name, water_type, created_at, aquarium_fish(quantity, fish(${FISH_SELECT}))`)
        .eq('id', aquarium_id)
        .single()

    if (error || !data) { console.log(error); return { statusCode: 500, data: null } }
    return { statusCode: 200, data: rowToLegacyAquarium(data) }
}

export async function deleteAquariumService(aquarium_id: number) {
    const { error } = await supabaseBrowser.from('aquariums').delete().eq('id', aquarium_id)
    if (error) { console.log(error); return { statusCode: 500 } }
    return { statusCode: 200 }
}
