# Competidores — GitLab Transcend "Life After Code" (Shipyard)

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (Shipyard) + el proyecto propio (Plumb) · clonados 0 · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC |

## En criollo

- **Que se miro:** el repo de Shipyard en GitLab, su ficha de Devpost, su sitio en vivo y su historial de corridas de Duo, sin ejecutar nada. Plumb se midio con las mismas sondas.
- **Quien es la amenaza:** Shipyard, alta. Compite por el mismo premio unico y cubre todo el ciclo (request, build, review, deploy, incidente) con 97 corridas de Duo y 255 deploys; Plumb cubre una sola cosa, el main en rojo.
- **Como estamos:** Plumb gana en foco y en una prueba muy concreta (50 corridas seguidas verdes antes de mergear), pero pierde en volumen de evidencia (43 corridas de Duo contra 97) y en amplitud.
- **Que conviene hacer:** no competir en amplitud; mostrar lo que Shipyard no tiene (arreglar tests inestables, "flaky", con prueba medida) y subir el conteo de evidencia verificable.

**Pesos del jurado** (`docs/judging.tsv`; los cinco criterios pesan igual, 20% cada uno):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Stage One: usa GitLab Duo Agent Platform | pasa/no pasa | 2 |
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design | 20% | 3, 4, 6 |
| Potential Impact | 20% | 1, 7 |
| Innovation/Idea | 20% | 7 |
| Presentation | 20% | 1, 8 |
| Bonus Google Cloud | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- No se pudo ver el video: el link responde 303 [8] y no se midio su duracion; la regla pide menos de 3 min y Shipyard dice "3 min".
- Las sesiones de agentes piden login de GitLab: no se pudo leer ni un transcript de Shipyard.
- No se clono ni se corrio nada: "tiene 364 tests" es lo que dice su ficha, no algo que se contara pasando [5].

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Technological Implementation | Design | Impact | Innovation | Presentation | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `10182502/showcase` Shipyard | Entrega de software de punta a punta, la maneja el publico | fuerte | fuerte | cumple | fuerte | cumple | 4.6/5 | alta |
| `43144947/showcase` Plumb (propio) | Arreglar el main en rojo y tests inestables | fuerte | cumple | cumple | fuerte | cumple | 4.2/5 | — |

**Amenaza** es contra Plumb: Shipyard compite por el mismo premio y por los mismos jueces, aunque en otro nicho (cero menciones de tests inestables en su README [6]).

---

## `10182502/showcase` — Shipyard

<!-- ficha -->

**Que hace:** un sitio de pedidos de funciones al que cualquiera puede escribir; cinco flows de Duo piden, programan, revisan, arreglan y reparan solos, y todo se despliega en Google Cloud Run.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/10182502/showcase · creado 2026-10-13 · Python (FastAPI) · MIT (archivo `LICENSE`; la API devuelve licencia vacia) [1] |
| Demo | https://shipyard-p6ypbeakfq-nn.a.run.app · `curl` 200 en 4.98 s la primera vez (arranque en frio), 200 en 0.96 s y 2.11 s despues [7] |
| Devpost | `shipyard-4dqfa6` · link a YouTube presente, duracion sin medir [8] |
| Equipo | 105 commits de `sam838` + 18 de Samuel Christian Suhartanto (misma persona probable, no verificado) · 28 de cuentas de agentes (24 build, 3 sre, 1 fix) [2] |
| Historial | primer commit 2026-10-15 · 172 commits visibles · previos al evento: no [2] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (Duo) | `fuerte` | 5 flows en `.gitlab/duo/flows/` (82 a 144 lineas cada uno) + 97 pipelines `duo_workflow` entre 2026-10-15 y 2026-10-22 [3] |
| Technological Implementation 20% | `fuerte` | 30 MRs (24 mergeados), 13 jobs en verde antes del merge del MR 30, merge a las 12:03:45 con los jobs terminados 12:02:10 [4]; 255 deploys; 16 archivos de test, "364 tests" segun la ficha [5] |
| Design 20% | `fuerte` | Flujo completo request → triage → build → review → fix → deploy → incidente, dibujado en un diagrama mermaid del README [6] |
| Potential Impact 20% | `cumple` | Mediana de 15 min de pedido a produccion sobre 21 pedidos reales [9]; la app de demo es un tablero de pedidos, el valor esta en la automatizacion reutilizable (`docs/ADOPT.md`) |
| Innovation 20% | `fuerte` | "Bisect de produccion": reproduce 5 versiones desplegadas y nombra el commit culpable en 24 s [6]; aprobacion falsa humana eliminada en segundos (!17) |
| Presentation 20% | `cumple` | Primeras 40 lineas con el pitch claro y tabla "compruebalo en 10 minutos"; video sin ver; sitio con arranque en frio de 5 s [6][7] |
| Bonus Google Cloud | `fuerte` | Cloud Run vivo, 200; Terraform en `infra/` (7 archivos), `ci/cloudrun.py`, `ci/gcloud_auth.sh`; 255 despliegues registrados [7][10] |
| Calidad de codigo | `cumple` | 16 archivos de test y chequeos de politica (`policy/`); no se corrieron [5] |
| Seguridad | `cumple` | Solo `.env.example` en el arbol; 0 `.env`/`.pem` [11]; no se revisaron commits viejos (sin clone) |

**Lo mas fuerte:** 97 corridas de Duo y 255 despliegues, con una prueba de merge atada a CI verde.
**Donde se cae:** el sitio tarda 4.98 s en frio y el sistema se congela 3 horas antes del cierre (README), asi que el jurado ve un sitio de solo lectura.
**Sin evidencia:** duracion del video, transcripts de agentes (piden login), conteo real de tests.

---

## Donde queda tu proyecto

Mismas sondas sobre Plumb (`gitlab-ai-hackathon/transcend-october-2026/43144947/showcase`, id 87376478).

| Criterio | Plumb | Shipyard |
|---|---|---|
| Pipelines `duo_workflow` | 43 [3] | 97 [3] |
| MRs mergeados | 12 (11 `fix/` por `merge-gate` segun `docs/CLAIMS.md`) | 24, merge atado a CI verde [4] |
| Despliegues registrados (API de GitLab) | 0 (`gcloud run deploy` en CI, sin environments) | 255 [10] |
| Cloud Run vivo | 200 en 0.29 s | 200 en 4.98 s (frio) [7] |
| Infraestructura como codigo | `ausente` (se miro, no hay Terraform) | 7 archivos Terraform |
| Flows de Duo | 1 (`triage-flow`) | 5 |
| Tests | 13 archivos `*.test.js`/`*.spec.ts` en el repo | 16 archivos de test |
| Commits | 147 (123 humano, 12 `triage-flow`) | 172 visibles (28 de agentes) |
| Sitio publico sin login | `flojo`: `curl` redirige a la autenticacion de GitLab Pages | `cumple`: sitio en Cloud Run, 200 |
| Prueba de "fix correcto" | 50 corridas seguidas verdes, medido con control negativo (33/50) | `ausente` en su nicho: 0 menciones de tests inestables [6] |

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Registrar el deploy de Cloud Run como un environment con deployment en GitLab | El jurado que busque "deployments" ve 0 en Plumb y 255 en Shipyard | Technological Implementation (20%) y bonus Google Cloud | brecha | 0 contra 255 en la API de deployments [10] | bajo | si |
| S-02 | Verificar la home publica de Plumb sin sesion (Pages redirige a login) y, si hace falta, enlazar una copia estatica en el README | Un jurado sin login no ve la pagina del proyecto | Presentation (20%) | brecha | `curl` al sitio de Plumb: 302 y termina en `sign_in` 403 [12] | bajo | si |
| S-03 | Poner arriba del README una tabla corta "compruebalo en 5 minutos" con un link por afirmacion (ya existe el patron en `docs/CLAIMS.md`) | Shipyard guia al jurado con 10 enlaces; Plumb esta repartido en 137 lineas | Presentation (20%) | brecha | Tabla "Check it yourself" en el README de Shipyard [6] | bajo | si |
| S-04 | Mostrar en el video y la ficha lo que Shipyard no tiene: arreglar tests inestables con 50 corridas y el caso que no se merge (33/50) | Es la unica diferencia de nicho que ningun jurado ve si no se dice | Innovation (20%) | hueco | 0 menciones de "flaky" en el README de Shipyard [6] | bajo | si |
| S-05 | Subir el volumen de corridas de Duo reales y publicas (hoy 43 contra 97) con casos nuevos que aprieten otros caminos | El jurado cuenta pruebas; mas casos, menos duda | Technological Implementation (20%) | brecha | 43 contra 97 pipelines `duo_workflow` [3] | medio | si |
| S-06 | Medir y publicar el tiempo de arranque en frio y el costo de la demo | Shipyard publica carbono y creditos por pedido; Plumb no publica costo | Potential Impact (20%) | brecha | "19 g CO2e y 14 creditos por feature" en README de Shipyard [6] | medio | si |
| S-07 | Estrellas, topics y tamano del README: no tocar | No los pondera ninguno de los 5 criterios | — | — | `docs/judging.tsv` | — | **cosmetico** |

> Control de sesgo: Plumb salio peor en 6 de las 10 filas de la tabla de arriba; las celdas mas comodas (innovacion, bonus Cloud) se rechequearon con el deployment count y el `curl`. Notas 1–5 mas abajo.

---

## Notas 1–5 por criterio

<!-- ficha -->

| Criterio | Shipyard | Plumb | Evidencia |
|---|---:|---:|---|
| Technological Implementation | 5 | 4 | 97 vs 43 corridas de Duo, 255 vs 0 despliegues, 5 vs 1 flows, Terraform vs ninguno [3][10] |
| Design | 5 | 4 | Shipyard cubre las 9 etapas con un diagrama; Plumb un solo bucle muy bien probado (8 caminos reales) |
| Potential Impact | 4 | 4 | Shipyard: 21 pedidos reales, mediana 15 min [9]; Plumb: 84% de fallos pasa-a-falla son flaky (cita de Google), 9 min 47 s |
| Innovation/Idea | 5 | 5 | Bisect de produccion y aprobacion falsa [6] contra 50 corridas verdes con control negativo 33/50 |
| Presentation | 4 | 4 | Shipyard: tabla de 10 minutos, sitio con arranque en frio 5 s, video sin medir; Plumb: video de 2:23, pagina con login |
| **Promedio** | **4.6** | **4.2** | |
| Bonus Google Cloud | +0.2 | +0.2 | Ambos: Cloud Run vivo 200, codigo de deploy en el repo, Workload Identity; Shipyard ademas Terraform [7][10] |

**Total:** Shipyard 4.8/5.2, Plumb 4.4/5.2. Las notas son de esta revision (mas exigentes que `docs/JUDGING-MOCK.md`, que le da 4.6 a Plumb): el Technological Implementation y el Design de Plumb no se igualan con evidencia de volumen que Shipyard si tiene.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api "projects/gitlab-ai-hackathon%2Ftranscend-october-2026%2F10182502%2Fshowcase"` (id 87562729) y `repository/files/LICENSE/raw` |
| [2] | `glab api "projects/87562729/repository/commits?per_page=100&all=true"` (2 paginas, ordenado por fecha) y `repository/contributors` |
| [3] | `glab api -i "projects/<id>/pipelines?source=duo_workflow&per_page=1"` (X-Total) y min/max de `created_at` del lado del cliente |
| [4] | `glab api "projects/87562729/merge_requests/30/pipelines"`, `.../pipelines/<id>/jobs` y `merged_at` de `merge_requests?state=merged` |
| [5] | Arbol del repo por `repository/tree?recursive=true`: archivos `tests/` y `policy/test_*`; el 364 sale de la ficha de Devpost |
| [6] | `repository/files/README.md/raw?ref=HEAD` leido por partes; `grep -ciE 'flak'` y mermaid del README |
| [7] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' https://shipyard-p6ypbeakfq-nn.a.run.app` (y `/roadmap`) |
| [8] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/shipyard-4dqfa6` y `curl` a `youtu.be/20B75ANpBHE` (303) |
| [9] | `repository/files/docs%2FEVIDENCE.md/raw?ref=HEAD` (32 pedidos, 21 llegaron a produccion, mediana 15.0 min) |
| [10] | `glab api -i "projects/<id>/deployments?per_page=1"` (X-Total) y `repository/tree` en `infra/` |
| [11] | `repository/tree` filtrado por `\.env$\|\.pem$\|credentials`: solo `.env.example` |
| [12] | `curl -sL -o /dev/null -w '%{http_code} %{url_effective}' https://showcase-8b103c.gitlab.io/` |
