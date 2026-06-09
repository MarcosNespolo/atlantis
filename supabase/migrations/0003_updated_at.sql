-- Atlantis — trigger genérico de updated_at (CLAUDE.md §4 nota)
-- Nome próprio (set_updated_at) para NÃO colidir com o touch_updated_at() do outro
-- sistema que compartilha este projeto.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_profiles_updated_at  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_fish_updated_at      before update on public.fish
  for each row execute function public.set_updated_at();
create trigger trg_aquariums_updated_at before update on public.aquariums
  for each row execute function public.set_updated_at();
