// Auth via Supabase Auth (client-side). Substitui o fluxo antigo de token caseiro
// (/api/auth + cookie atlantis_token). A sessão é gerida pelo supabase-js no browser
// (persistSession) e a RLS no banco é a fonte de verdade de permissão.
import { supabaseBrowser } from '../lib/supabase/browser'
import type { Database } from '../types/database'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type UserRole = Database['public']['Enums']['user_role']

export async function signUpRequest(name: string, email: string, password: string) {
  // `name` vai para raw_user_meta_data; o trigger handle_new_user cria o profile.
  return supabaseBrowser.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
}

export async function signInRequest(email: string, password: string) {
  return supabaseBrowser.auth.signInWithPassword({ email, password })
}

export async function signOutRequest() {
  return supabaseBrowser.auth.signOut()
}

export async function getActiveSession() {
  const { data } = await supabaseBrowser.auth.getSession()
  return data.session
}

// Lê o profile (e o papel) da tabela public.profiles via cliente autenticado (RLS).
export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabaseBrowser
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('fetchProfile', error.message)
    return null
  }
  return (data as ProfileRow) ?? null
}

// Traduz mensagens de erro do Supabase Auth para PT-BR (UX).
export function translateAuthError(message?: string): string {
  if (!message) return 'Ops... erro de autenticação.'
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Usuário ou senha inválidos.'
  if (m.includes('email not confirmed')) return 'E-mail ainda não confirmado. Verifique sua caixa de entrada (e o spam).'
  if (m.includes('user already registered')) return 'Este e-mail já está cadastrado.'
  if (m.includes('password should be at least')) return 'A senha é muito curta.'
  return 'Ops... não foi possível completar a ação.'
}
