import { createClient } from '@supabase/supabase-js'

// Cliente do BROWSER: anon key + RLS. Seguro para client components.
// Usa as variáveis NEXT_PUBLIC_* (embutidas no bundle por design).
//
// NOTA: ainda SEM o generic <Database> de propósito — os serviços do F1 usam o
// schema antigo (tabelas 'FISH', 'AQUARIUM'...). A tipagem forte (<Database>) e os
// mappers entram no F7, junto com a migração dos serviços para o schema novo.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
if (!anonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')

export const supabaseBrowser = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
