import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente do SERVIDOR (service role — BYPASSA a RLS).
 *
 * ⚠ NUNCA importe este módulo em código que vá para o browser. Use SOMENTE em
 * `src/pages/api/*` e em getServerSideProps/getStaticProps. A service role key
 * jamais deve chegar ao bundle do cliente.
 *
 * Inicialização preguiçosa: não estoura no import (build não quebra se a chave
 * ainda não estiver setada); só falha quando alguém de fato tenta usá-lo.
 *
 * NOTA: sem o generic <Database> por ora; tipagem forte + mappers entram no F7.
 */

// Guard explícito: se isto rodar no browser, é bug de import.
if (typeof window !== 'undefined') {
  throw new Error('src/lib/supabase/server.ts foi importado no browser — use browser.ts')
}

let cached: SupabaseClient | null = null

export function getSupabaseServer(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) {
    throw new Error(
      'Missing env.SUPABASE_SERVICE_ROLE_KEY — adicione a chave de serviço (sb_secret_...) no .env.local (apenas no servidor).',
    )
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
