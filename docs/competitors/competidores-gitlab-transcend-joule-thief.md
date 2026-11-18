# Competidores — GitLab Transcend "Life After Code": Joule Thief

| | |
|---|---|
| Fecha | 2026-11-17 (concurso ya cerrado; se mide el estado final) |
| Modo | hackathon |
| Evaluados | 1 (+ Plumb como control) · clonados 1 · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC |

## En criollo

- **Que se miro:** el repo de Joule Thief en GitLab, su ficha de Devpost, su demo en vivo y sus agentes de Duo, con las mismas sondas que Plumb.
- **Quien es la amenaza:** Joule Thief, alta. Tiene 4 flujos de Duo contra 1 de Plumb, un ciclo de punta a punta (de la tarea al deploy firmado) y un demo en Google Cloud que responde.
- **Como estamos:** Plumb es mas profundo en un solo problema (arreglar tests inestables y probarlo 50 veces); Joule Thief cubre mas terreno y gana en 3 de 5 criterios.
- **Que conviene hacer:** el concurso ya cerro; lo util es arreglar lo que el jurado todavia pueda ver: la pagina del proyecto de Plumb pide iniciar sesion en GitLab (403 anonimo) [13].

**Pesos del jurado** (`docs/judging.tsv`; Stage One es pasa/no pasa y el bonus de Google Cloud suma +0.2):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 4, 5, 6, 10 |
| Design | 20% | 4, 6 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7, 4 |
| Presentation | 20% | 1, 8 |
| Google Cloud bonus | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- Duracion y contenido real del video de Joule Thief: YouTube respondio 303 y no se miro el video [7]. Beneficio de la duda para el rival.
- Si Joule Thief marco el premio "Most Environmentally Impactful" en el formulario: no es publico. Su METHODOLOGY dice que es "la base de ese write-up" [10].
- Los numeros de energia son modelados con coeficientes estandar, no medidos con medidor: el propio repo lo dice (`measured: true\|false`, "todo el cloud energy es modelado") [10]. No se reprodujo ninguno porque no se ejecuta codigo ajeno.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Technological Implementation | Design | Impact | Innovation | Presentation | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `joule-thief` | Agentes que esperan energia limpia, ciclo de 9 etapas | fuerte | fuerte | cumple | fuerte | fuerte | 4.8/5 | alta |
| Plumb (propio) | Arregla un `main` rojo por tests inestables y lo prueba 50 veces | cumple | cumple | cumple | fuerte | cumple | 4.2/5 | — |

**Amenaza** es contra Plumb: los dos compiten por el mismo premio unico de US$5.000 en Path A, Hands-off. Joule Thief no se pisa en el nicho (energia, no tests inestables), pero un jurado compara ambos en los mismos 5 criterios.

---

## `gitlab-ai-hackathon/transcend-october-2026/39253963/joule-thief` — Joule Thief

<!-- ficha -->

**Que hace:** agentes de Duo que toman tareas diferibles (actualizar dependencias, refactors, escaneos) y las lanzan solo cuando la red electrica tiene energia limpia sobrante, sin humano, con el plazo de la tarea como tope.

| | |
|---|---|
| Repo | proyecto 87421067 · creado 2026-10-09 · Python · MIT · publico · no es fork [1] |
| Demo | `joule-thief-l27mx24tga-lz.a.run.app` · 200 en 4.54 s (arranque en frio) [7] |
| Devpost | `joule-thief` · video si (YouTube `We71EiCPS_U`, no visto) [14] |
| Equipo | 1 persona (Marc Donovici, 50 commits) + cuenta del flow `surge-worker` (27) [5] |
| Historial | primer commit 2026-10-06 (posterior a la apertura) · 77 commits · previos al evento: no [5] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (usa Duo) | **pasa, fuerte** | 4 flujos + 2 agentes + MCP en `.gitlab/duo/` [2]; 55 pipelines `duo_workflow`, 55 en verde [3] |
| Technological Implementation 20% | fuerte | 98 tests en 13 archivos, 8.493 lineas Python sin datos [8]; 530 de 564 pipelines en verde, 22 rojos [4]; escaneos SAST, secretos, dependencias, ZAP y 20.000 casos de fuzz [9] |
| Design 20% | fuerte | ciclo issue → MR → compuertas → recibo firmado (Sigstore) → canary → deploy → nota "Shipped" [9]; MR !1 mergeado 09:08 con pipeline `success` [6] |
| Potential Impact 20% | cumple | -85% J/request medido en !1; replays: -20 a -30% carbono, 0 plazos perdidos [9]; el propio README admite que en vivo "el trabajo movio de hora, no la electricidad" y que sin runner propio el balance es "cerca de neutral" [10] |
| Innovation 20% | fuerte | agenda por senal marginal de la red con solver CP-SAT y plazo duro; es un enfoque que Plumb no toca [9] |
| Presentation 20% | fuerte | README con linea de tiempo enlazada a objetos reales, 6 imagenes, sala de control en vivo [2][7]; video sin ver |
| Google Cloud bonus | +0.2 | Cloud Run con `gcloud run deploy` en `.gitlab-ci.yml` y OpenTofu en `infra/terraform/` (231 lineas) [2][7] |
| Cuantificacion SCI (premio ambiental) | cumple, con limite | ISO/IEC 21031:2024 y SCI for AI, rangos bajo/probable/alto, energia modelada [10]; la ventaja de agenda no se realiza en vivo [10] |
| Seguridad | cumple | 0 archivos `.env`/`.pem` en el historial, 0 patrones de credencial en el arbol [11] |

**Lo mas fuerte:** 4 flujos de Duo que reaccionan a disparadores reales (issue creado, pipeline fallido) y 55 corridas en verde [3].
**Donde se cae:** el ahorro de carbono "en vivo" no ocurre (runners en us-east1, red espanola leida); el numero fuerte son replays con datos sinteticos [10].
**Sin evidencia:** contenido del video y si se anoto al premio ambiental.

**Prueba de que Duo trabajo y no un humano:** 27 commits firmados por `surge-worker` [5]; !1 lo mergeo la cuenta `ai-surge-worker` con un job de CI en `success` antes del `merged_at` [6]. Los 14 MR figuran con autor humano `Marc_DVCI`, que solo prueba quien disparo el flow [6].

---

## Donde queda Plumb

| Criterio | Plumb | `joule-thief` |
|---|---|---|
| Flujos Duo propios | 1 (`triage-flow.yml`) [12] | 4 + 2 agentes + MCP [2] |
| Pipelines `duo_workflow` | 43; de 239 pipelines del proyecto, 197 en verde y 41 rojos a proposito (suite inestable) [12] | 55, todos en verde [3] |
| Tests | 59 casos, 13 archivos [12] | 98 casos, 13 archivos [8] |
| Codigo (lineas JS/TS/PY/YML) | 2.636 [12] | 8.493 (solo Python) [8] |
| Commits | 160 (137 humano, 20 flow) [12] | 77 (50 humano, 27 flow) [5] |
| Demo en vivo | Cloud Run 200 en 0.31 s [12] | Cloud Run 200 en 4.54 s [7] |
| Pagina del proyecto | **403 sin sesion** [13] | no tiene (README) |
| Prueba cuantitativa propia | 50 de 50 corridas, 33/50 de control negativo [12] | -85% J/request, replays [9] |

Notas 1-5 por criterio (Joule Thief / Plumb), con la misma vara:

| Criterio | Joule Thief | Plumb | Evidencia que la sostiene |
|---|---:|---:|---|
| Technological Implementation | 5 | 4 | 98 vs 59 tests; 4 flujos vs 1; 530/564 verde [3][4][8][12] |
| Design | 5 | 4 | 9 etapas con recibo firmado vs bucle rojo → fix → deploy de un solo problema [9][12] |
| Potential Impact | 4 | 4 | JT admite balance "cerca de neutral" sin runner propio [10]; Plumb cita 84% de transiciones inestables en Google, 9 min 47 s sin humano [12] |
| Innovation/Idea | 5 | 5 | JT agenda por senal de red; Plumb arregla y prueba en vez de reintentar [9][12] |
| Presentation | 5 | 4 | JT: README con linea de tiempo y demo vivo; Plumb: video 2:23 pero pagina del proyecto en 403 [13] |
| Bonus Google Cloud | +0.2 | +0.2 | ambos con deploy a Cloud Run vivo (200) y codigo de deploy en el repo [7][12] |

Total sin bonus: Joule Thief 24/25 (4.8), Plumb 21/25 (4.2). Nota: `docs/JUDGING-MOCK.md` da 4.6 a Plumb; con las sondas de este informe baja porque 59 tests y 1 flujo no son "fuerte" frente a 98 tests y 4 flujos, y porque la pagina del proyecto no abre sin sesion.

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Dejar publica la pagina `showcase-8b103c.gitlab.io` (Pages: visibilidad "Everyone") | Un jurado que la abre cae en el login de GitLab | Presentation (20%) | brecha | Plumb: 403 tras redirigir a `sign_in` [13] | bajo | si |
| S-02 | Sumar tests a `tools/` y a `ci/` y publicar el conteo en el README | El rival muestra 98 casos y plumb 59 | Technological Implementation (20%) | brecha | 98 vs 59 [8][12] | medio | si |
| S-03 | Evaluar un segundo flujo o agente de Duo para otro paso del ciclo (hoy solo reacciona a pipeline rojo) | JT muestra 4 flujos que cubren plan, verificar y reparar; Plumb 1 | Technological Implementation (20%) | brecha | 4 vs 1 [2][12] | alto | si |
| S-04 | Subir a las primeras 40 lineas del README la cifra de costo por incidente (mediana 9.5 min de CI, de `docs/RESULTS.md`) | JT abre con "-85%" y "~2 Wh" | Potential Impact (20%) | brecha | README de JT, primeras 40 lineas [9] | bajo | si |
| S-05 | Destacar en el README el uso de Plumb en un segundo proyecto (epic-stack, un solo `include: project`) | JT tiene un componente para cualquier proyecto | Potential Impact (20%) | brecha | `templates/grid-window` en JT [2] | bajo | si |
| S-06 | Subir estrellas o topics | ninguno pondera el jurado | — | — | JT tiene 0 estrellas [1] | bajo | **cosmetico** |

> Control de sesgo: Plumb se midio con las mismas sondas y salio peor que el rival en 4 de 6 filas del cuadro. Las tres celdas mas comodas para Plumb (Innovation, bonus Google Cloud, demo vivo) se re-midieron: 200 en 0.31 s contra 200 en 4.54 s [7][12].

---

## Apendice — como se midio

<!-- ficha -->

Ruta del scratchpad: `$S`. `P` = `gitlab-ai-hackathon%2Ftranscend-october-2026%2F39253963%2Fjoule-thief`; `I` = 87421067 (el 39253963 del path es el usuario, no el proyecto: da 404 como `projects/39253963`).

| Ref | Comando |
|---|---|
| [1] | `glab api "projects/$P" \| jq '{id,created_at,last_activity_at,visibility,forked_from_project,star_count}'` |
| [2] | `glab api "projects/$I/repository/tree?recursive=true&per_page=100" --paginate \| jq -r '.[].path'` (169 rutas) |
| [3] | `glab api -i "projects/$I/pipelines?source=duo_workflow&per_page=100"` (X-Total 55) y `jq '[.[]\|select(.status!="success")]\|length'` (0) |
| [4] | `glab api "projects/$I/pipelines?per_page=100" --paginate \| jq -r '.[].status' \| sort \| uniq -c` (530 success, 22 failed, 9 canceled, 3 skipped) |
| [5] | `glab api "projects/$I/repository/commits?all=true&per_page=100" --paginate \| jq -r '.[].author_name' \| sort \| uniq -c` |
| [6] | `glab api "projects/$I/merge_requests/1"` y `.../merge_requests/1/pipelines` y `.../merge_requests/1/commits` |
| [7] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' https://joule-thief-l27mx24tga-lz.a.run.app` (200, 4.54 s); `curl ... https://youtu.be/We71EiCPS_U` (303) |
| [8] | en el clone `--depth 50`: `grep -rcE '^\s*(async )?def test_' tests/*.py \| awk -F: '{s+=$2} END{print s}'` y `git ls-files '*.py' \| xargs wc -l \| tail -1` |
| [9] | `glab api "projects/$I/repository/files/README.md/raw?ref=HEAD"` y lectura de `.gitlab-ci.yml` con `grep -nE 'google\|Cloud Run\|tofu\|deploy'` |
| [10] | lectura de `docs/METHODOLOGY.md` y de la seccion "Measured on the live project" del README; `grep -n 'measured' docs/METHODOLOGY.md` |
| [11] | clone: `git log --all --diff-filter=A --name-only --format= \| grep -iE '\.env$\|\.pem$\|\.p12$\|credentials'` y `grep -rlE 'AKIA...\|BEGIN (RSA\|EC )?PRIVATE KEY\|glpat-...' --exclude-dir=.git .` (ambos vacios) |
| [12] | Plumb, mismas sondas sobre `projects/87376478`: pipelines, commits, tests por `grep -rcE '^\s*(test\|it)\(' tests/unit tests/e2e`, `curl` a `booking-vic4jyzsha-uc.a.run.app` |
| [13] | `curl -sL -o /dev/null -D - https://showcase-8b103c.gitlab.io/ \| grep -iE '^(HTTP\|location)'` (302 → `gitlab.com/users/sign_in` → 403) |
| [14] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/joule-thief` y lectura del texto y del "Built With" (`gitlab-duo-agent-platform`, `google-cloud-run`, `sigstore`, `or-tools`) |
