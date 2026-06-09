-- Atlantis — Row Level Security, papéis e triggers de identidade (CLAUDE.md §4 RLS)
-- A segurança real vive aqui (RLS por auth.uid()), não só nas rotas.

-- helper (bypassa RLS de profiles via SECURITY DEFINER → evita recursão)
create or replace function public.user_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles        enable row level security;
alter table public.substrates      enable row level security;
alter table public.foods           enable row level security;
alter table public.fish            enable row level security;
alter table public.fish_substrates enable row level security;
alter table public.fish_foods      enable row level security;
alter table public.aquariums       enable row level security;
alter table public.aquarium_fish   enable row level security;

-- PROFILES: leitura pública (perfil de especialista é público); update do próprio; admin edita qualquer
create policy profiles_read      on public.profiles for select using (true);
create policy profiles_self_upd  on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_upd on public.profiles for update using (public.user_role() = 'admin');

-- trava: só admin altera o campo role
create or replace function public.prevent_role_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and coalesce(public.user_role(),'aquarista') <> 'admin' then
    raise exception 'Somente admin pode alterar o papel';
  end if;
  return new;
end $$;
create trigger trg_prevent_role_change before update on public.profiles
for each row execute function public.prevent_role_change();

-- cria profile no signup
-- ⚠ BANCO COMPARTILHADO: este trigger roda em auth.users. O outro sistema deste
-- projeto NÃO usa Supabase Auth (auth.users vazio, sem outros triggers), então
-- isto não afeta o outro sistema. Todo auth.user criado aqui É um usuário Atlantis.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), new.email, 'aquarista');
  return new;
end $$;
create trigger trg_on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- CATÁLOGOS + FISH (+ N:N): leitura pública (inclui anon → degradação graciosa); escrita especialista+
create policy cat_read_sub  on public.substrates for select using (true);
create policy cat_read_food on public.foods      for select using (true);
create policy fish_read     on public.fish       for select using (true);
create policy fs_read       on public.fish_substrates for select using (true);
create policy ff_read       on public.fish_foods      for select using (true);

create policy fish_write on public.fish for all
  using (public.user_role() in ('especialista','admin'))
  with check (public.user_role() in ('especialista','admin'));
create policy sub_write  on public.substrates for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));
create policy food_write on public.foods for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));
create policy fs_write on public.fish_substrates for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));
create policy ff_write on public.fish_foods for all
  using (public.user_role() in ('especialista','admin')) with check (public.user_role() in ('especialista','admin'));

-- AQUÁRIOS: só o dono
create policy aq_owner on public.aquariums for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy aqf_owner on public.aquarium_fish for all
  using (exists (select 1 from public.aquariums a where a.id = aquarium_id and a.user_id = auth.uid()))
  with check (exists (select 1 from public.aquariums a where a.id = aquarium_id and a.user_id = auth.uid()));
