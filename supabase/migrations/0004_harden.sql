-- Atlantis — hardening pós-DDL (advisors de segurança do Supabase)
-- Só objetos Atlantis. Não toca em funções do outro sistema (mapa_*).

-- 1. search_path imutável na função de updated_at (lint 0011).
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- 2. As funções de TRIGGER não precisam ser chamáveis via RPC (lint 0028/0029).
--    Triggers disparam pelo mecanismo do Postgres independentemente do EXECUTE,
--    então revogar é seguro e remove a superfície de ataque em /rest/v1/rpc.
revoke all on function public.handle_new_user()    from anon, authenticated, public;
revoke all on function public.prevent_role_change() from anon, authenticated, public;

-- public.user_role() permanece executável: é usada DENTRO das policies RLS pelo
-- papel authenticated e só revela o papel do próprio chamador (não sensível).
