# API pública — povoamento de espécies

Endpoint para popular o catálogo de espécies de forma automatizada (sem login).

> Grava com a **service role** no servidor (a RLS continua estrita; o banco **não**
> fica aberto a escrita pública). As espécies entram como **rascunho**
> (`specialist_id = null`) até validação por um especialista.

## Configuração (env)

| Variável | Onde | Obrigatória | Para quê |
|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | servidor (Vercel + `.env.local`) | **sim** | gravar apesar da RLS |
| `POPULATE_API_KEY` | servidor | opcional (recomendado em prod) | se definida, exige header `x-api-key` igual |

## `POST /api/public/fish`

Aceita **uma espécie** (objeto) ou **várias** (array, ou `{ "fish": [...] }`).
Faz **upsert por `scientificName`** (atualiza se já existir; senão insere) e recria os vínculos de substratos/alimentos.

### Corpo (campos)

```jsonc
{
  "name": "Betta",                       // obrigatório
  "scientificName": "Betta splendens",   // obrigatório (chave do upsert)
  "position": "superficie",              // obrigatório: fundo | meio | superficie
  "size": 6.5,                           // obrigatório (cm)
  "volumeFirst": 20,                     // obrigatório (L, 1º indivíduo)
  "temperature": [24, 28],               // obrigatório [min,max] °C
  "ph": [6.0, 7.5],                      // obrigatório [min,max]
  "dgh": [5, 20],                        // obrigatório [min,max] °dGH

  "nameEn": "Siamese fighting fish",     // opcional
  "image": null,                          // opcional
  "waterType": "doce",                   // opcional (default doce): doce | salgada | salobra
  "minimumShoal": 1,                      // opcional (default 1)
  "temperamentSame": "territorial_machos",   // opcional: pacifico | territorial | territorial_femeas | territorial_machos
  "temperamentOthers": "territorial",        // opcional: pacifico | territorial | agressivo_menores | agressivo_maiores
  "volumeAdditional": 10,                 // opcional (default 0)
  "aquariumWidth": [null, null],          // opcional [min,max] cm (null = sem limite)
  "aquariumHeight": [null, null],         // opcional
  "salinity": [0, 0],                     // opcional (default [0,0]) ppt
  "note": "Rascunho. ...",               // opcional
  "substrates": [1, 2, 3],                // opcional: ids do catálogo (ver abaixo)
  "foods": [2, 1, 5]                      // opcional: ids do catálogo
}
```

#### Ids de catálogo (seed fixo)

- **substrates**: `0` sem_substrato, `1` cascalho, `2` humus, `3` areia, `4` aragonita, `5` basalto, `6` turfa
- **foods**: `0` pastilha, `1` granulada, `2` floco, `3` tablet, `4` farinha, `5` artemia

### Exemplos

Uma espécie:

```bash
curl -X POST https://atlantis-aquarium.vercel.app/api/public/fish \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_CHAVE" \
  -d '{
    "name": "Neon", "scientificName": "Paracheirodon innesi",
    "position": "meio", "size": 3.5, "volumeFirst": 40, "volumeAdditional": 3,
    "minimumShoal": 6, "temperature": [20,26], "ph": [5,7], "dgh": [1,10],
    "substrates": [2,3,6], "foods": [2,1,5]
  }'
```

Em lote:

```bash
curl -X POST https://atlantis-aquarium.vercel.app/api/public/fish \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_CHAVE" \
  -d '{ "fish": [ { "name": "...", "scientificName": "...", "position": "meio", "size": 5, "volumeFirst": 40, "temperature": [22,28], "ph": [6.5,7.5], "dgh": [5,15] } ] }'
```

> Sem `POPULATE_API_KEY` definida no servidor, o header `x-api-key` é dispensável.

### Resposta

```jsonc
{
  "ok": true,
  "inserted": 1,
  "updated": 0,
  "results": [ { "id": 12, "scientificName": "Paracheirodon innesi", "action": "inserted" } ],
  "errors": []
}
```

- `200` tudo certo · `207` parcial (veja `errors`) · `400` nada gravado / payload inválido · `401` chave inválida · `405` método · `500` service role ausente.

## `GET /api/public/fish`

Lista as espécies (id, name, scientific_name, water_type, specialist_id). Útil para conferir o povoamento.
