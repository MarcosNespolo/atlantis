# Supabase — Atlantis

Schema, RLS, triggers e seed do Atlantis, versionados como migrations.

## ⚠ Banco COMPARTILHADO

O projeto Supabase de produção (`ungafoolmedlexptatbd`) **é compartilhado** com outro
sistema (app de mapa). Tabelas/funções daquele sistema — `player_state`, `mapa_config`,
`mapa_plano`, `mapa_save`, `mapa_load`, `mapa_change_pass`, `touch_updated_at` — **não
pertencem ao Atlantis e nunca devem ser alteradas**.

Por isso, **NÃO rode `supabase db reset` contra o banco remoto** — ele apagaria as tabelas
do outro sistema. As migrations daqui criam **apenas** objetos Atlantis, nomeados
explicitamente, sem colisão com o outro sistema.

## Migrations

| Arquivo | Conteúdo |
|---|---|
| `migrations/0001_init.sql` | 5 enums + 8 tabelas + CHECKs + índices (incl. GIN tsvector) |
| `migrations/0002_rls.sql` | `user_role()`, RLS em todas as tabelas, policies, triggers `handle_new_user` / `prevent_role_change` |
| `migrations/0003_updated_at.sql` | `set_updated_at()` + triggers BEFORE UPDATE em profiles/fish/aquariums |
| `migrations/0004_harden.sql` | search_path imutável + revoke EXECUTE das funções de trigger (advisors) |
| `seed.sql` | Catálogos (substrates/foods) + espécies rascunho (gerado de `seed/species.json`) |

## Como aplicar no banco remoto (compartilhado)

Estas migrations já foram aplicadas no projeto remoto via tooling (MCP `apply_migration`),
de forma escopada. Para reaplicar/auditar:

1. As migrations são **idempotentes apenas na primeira aplicação** (usam `create type`/`create table`).
   Para um ambiente novo, aplique-as em ordem.
2. **Preferível**: linkar e dar push apenas das migrations Atlantis:
   ```bash
   supabase link --project-ref ungafoolmedlexptatbd   # pede a senha do banco (NÃO commitar)
   supabase db push                                    # aplica migrations pendentes
   ```
   `db push` aplica só o que falta no histórico de migrations; **não** dropa nada.
3. Regenerar tipos após mudanças de schema:
   ```bash
   supabase gen types typescript --project-id ungafoolmedlexptatbd > src/types/database.ts
   ```

## Como rodar 100% local (opcional, recomendado p/ dev)

Um banco local é **isolado** — aí sim `db reset` é seguro (não há o outro sistema):

```bash
supabase start          # sobe Postgres + Studio locais
supabase db reset        # aplica migrations + seed.sql do zero
supabase gen types typescript --local > src/types/database.ts
```

Aponte o `.env.local` para as chaves locais (`supabase status` mostra URL/anon key locais)
quando quiser desenvolver sem tocar no remoto compartilhado.

## Segredos

- Nunca commite a senha do banco nem a `service_role` key.
- Variáveis de ambiente: ver `.env.example` na raiz (F4).
