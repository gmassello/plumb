# Competidores — GitLab Transcend "Life After Code" (Earned Autonomy)

| | |
|---|---|
| Fecha | 2026-11-18 |
| Modo | hackathon (concurso cerrado: Earned Autonomy ganó "Most Stages Covered" por Path B; Plumb, Path A Hands-off, no ganó) |
| Evaluados | 1 (Earned Autonomy) + el proyecto propio (Plumb) · clonados 0 · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC |

## En criollo

- **Que se miro:** el repo de Earned Autonomy en GitLab, su espejo de GitHub, su ficha de Devpost y su archivo de pruebas (`CLAIMS.md`), sin ejecutar nada. Plumb se midio con las mismas sondas.
- **Quien es la amenaza:** alta, y ya se confirmo: gano. Cubre las 9 etapas con 4 flows de Duo, 1575 corridas de agentes y 61 despliegues; Plumb cubre una sola cosa, el main en rojo, con 1 flow y 43 corridas.
- **Como estamos:** en foco y en rigor de prueba (50 corridas seguidas verdes, control negativo 33/50) Plumb esta a la par; en amplitud y en como se le muestra la evidencia al jurado, Earned Autonomy gana.
- **Que conviene hacer:** la diferencia que mas peso no fue el codigo sino la entrada: un link por afirmacion en las primeras 40 lineas, y una tabla etapa por etapa con una corrida real cada una. Plumb ya tiene casi todo ese material, pero esta mas abajo y en un formato de auditoria.

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

- El video de Devpost (YouTube `_FYzcQnvD9M`): se vio que existe, no su duracion ni su contenido [8].
- Los transcripts de las sesiones de agentes y la pagina del ledger (`showcase-4900ab.gitlab.io`): piden login, `curl` da 302 [7]. Afecta a Plumb igual (302 [7]).
- No se clono ni se corrio nada: "62 pruebas de interfaz y 58 de backend" es lo que dice su README, no algo que se contara pasando [5].

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Technological Implementation | Design | Impact | Innovation | Presentation | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `43529136/showcase` Earned Autonomy | Decidir por cada cambio cuanta autonomia gana, con memoria por area (Path B, sobre un template de 46k estrellas) | fuerte | fuerte | cumple | fuerte | cumple | 4.6/5 | alta |
| `43144947/showcase` Plumb (propio) | Arreglar el main en rojo y tests inestables (Path A) | fuerte | cumple | cumple | fuerte | cumple | 4.2/5 | — |

**Amenaza** es contra Plumb: compitieron por el mismo premio de Most Stages Covered y los mismos jueces; el nicho es distinto (cero menciones de tests inestables en su README [6]).

---

## `43529136/showcase` — Earned Autonomy

<!-- ficha -->

**Que hace:** a cada cambio (merge request) le calcula evidencia, riesgo y un nivel de autonomia (Hands-off, Supervised, Assisted, Blocked); cuatro flows de Duo suben el riesgo, arreglan dependencias, abren incidentes y deshacen en produccion; un registro de confianza por area recalibra el nivel despues de cada release.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43529136/showcase (archivado) · creado 2026-10-20 · Python/React sobre `fastapi/full-stack-fastapi-template` · MIT en el espejo de GitHub, la API de GitLab devuelve licencia vacia [1] |
| Demo | https://api-prod-gkozang2ta-uc.a.run.app · `curl` 200 en 17.68 s (arranque en frio; el README avisa ~25 s) [7] |
| Devpost | `earned-autonomy-li8qxm` · video de YouTube si · ficha de 1149 palabras · "Winner, Most Stages Covered" [8] |
| Equipo | una persona con dos nombres (39 commits "Shivansh Kalra" + 77 "shivansh193") + 2 de `ea-triage-agent`; el resto es historial heredado del template [2] |
| Historial | espejo creado 2026-10-22, 1656 commits porque trae el historial del template (desde 2019); 128 commits desde 2026-10-05, 1 anterior a esa fecha por el import [2] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (Duo) | `fuerte` | 4 flows en `.gitlab/duo/flows/` (83 a 189 lineas) con trigger por eventos de pipeline [3]; 1575 pipelines `duo_workflow` entre 2026-10-20 y 2026-10-27, 1572 en `success` y 2 fallidos [4] |
| Technological Implementation 20% | `fuerte` | 54 MRs (40 mergeados, 14 abiertos), 61 despliegues y 2 entornos registrados en GitLab, Terraform en `infra/` [4][9]; 6 archivos `.spec.ts` de la UI y 14 `test_*.py`, "62 + 58 pruebas" segun el README [5] |
| Design 20% | `fuerte` | Cadena completa en un diagrama del README (evidencia, riesgo, nivel, promocion, monitoreo, ledger) y una tabla etapa por etapa con una corrida real por cada una de las 9 etapas [6][10] |
| Potential Impact 20% | `cumple` | Aplica a un template real y muy usado, y a una segunda app (VaultScope, 350 pruebas); sin cifra de adopcion ni tiempo ahorrado medido [6] |
| Innovation 20% | `fuerte` | Confianza por area que baja tras un rollback (+0.30) y sube con releases limpios (umbral 0.20 a 0.30); los agentes solo pueden subir el riesgo [6] |
| Presentation 20% | `cumple` | Las primeras 40 lineas ya traen tres afirmaciones con link cada una, mas una tabla "verificalo en 5 minutos"; video sin ver; la pagina del ledger pide login [6][7][8] |
| Bonus Google Cloud | `fuerte` | Cloud Run vivo 200, Terraform, imagen a Artifact Registry y despliegue por pipeline [7][9] |
| Calidad de codigo | `cumple` | 36 archivos de prueba en `backend/tests` y `frontend/tests`; no se corrieron [5] |
| Seguridad | `cumple` | `.env` en el arbol sin estar en `.gitignore`: es el del template, con 3 de 3 claves sensibles en el valor de ejemplo `changethis` (no se transcribe nada) [11]; no se revisaron commits viejos (sin clone) |

**Lo mas fuerte:** 1575 corridas de agentes, 61 despliegues y una prueba de benchmark pre-registrada (esperados commiteados a las 20:16 UTC, antes de abrir los 12 MR de las 20:19) que publica sus 2 fallas: 10/12, luego 12/12 [6].
**Donde se cae:** el merge de TODOS los 40 MR figura a nombre de la dueña de la cuenta (`merged_by` = `shivansh193`), incluido el !52 que se presenta como "sin pasos humanos"; solo el job programado (cron cada 10 min) lo hace creible [12]. El README dice "re-run as a person" y el CLAIMS dice "the system re-ran", sin conciliar.
**Sin evidencia:** video, transcripts de agentes, conteo real de pruebas, cuantas de las 1575 corridas son de Router sobre MR de benchmark.

---

## Donde queda tu proyecto

Mismas sondas sobre Plumb (`gitlab-ai-hackathon/transcend-october-2026/43144947/showcase`, id 87376478). **Como presenta cada uno la evidencia:**

| Criterio | Plumb | Earned Autonomy |
|---|---|---|
| Forma del archivo de claims | tabla de 27 filas: afirmacion, donde aparece, fuente, comando para chequear; 7 links unicos a corridas [13] | tabla de 8 afirmaciones + 9 etapas con un link cada una; 14 links unicos a corridas, sin comando [13] |
| Enlazado desde el README | 1 mencion, en la linea 117 (abajo de todo) [13] | 1 mencion + "Judge TL;DR" de 14 filas con link en las lineas 14-30 [13] |
| Seccion "que hizo una persona y que no" | `ausente`: solo una mencion de "merged by a human" en la linea 41 [14] | `cumple`: seccion propia en el CLAIMS que lista que hizo la persona [13] |
| Mapa por etapa con una corrida real cada una | `flojo`: "9 etapas" en CLAIMS/submission, el mapa esta en `docs/ARCHITECTURE.md`, sin link por etapa [14] | `fuerte`: tabla de 9 etapas, un link por etapa [13] |
| Pipelines `duo_workflow` | 43 (43 `success`) [4] | 1575 (1572 `success`, 2 fallidos) [4] |
| Flows de Duo | 1 (`triage-flow`) | 4 [3] |
| MRs mergeados / quien | 12; 11 `fix/` mergeados por el job `merge-gate`, con prueba de CI verde antes del merge (CLAIMS) | 40; todos con `merged_by` = la dueña; merge por job programado [12] |
| Despliegues registrados (API de GitLab) | 0, sin `environment:` en el CI (`ausente`) [9][14] | 61, con 2 entornos [9] |
| Prueba de "el arreglo funciona" | 50 corridas seguidas verdes, con control negativo (33/50 no se mergea) | benchmark pre-registrado de 12 casos, 10/12 luego 12/12 [6] |
| Benchmark con esperados commiteados antes de correr | `ausente` (0 coincidencias de "pre-register" o "committed before") [14] | `fuerte` [6] |
| Sitio publico sin login | `flojo`: 302 [7] | `flojo`: 302 [7] |
| Cloud Run vivo | 200 en 0.31 s [7] | 200 en 17.68 s en frio [7] |
| Commits propios | 160 (API, todas las ramas) [2] | 128 desde el 2026-10-05, mezclados con bots [2] |

### Sugerencias

El concurso cerro: valen como aprendizaje para el proximo evento o para el retro. Cada una se chequeo contra el repo propio.

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Poner arriba del README una tabla "verificalo en 5 minutos": una afirmacion, un link a la corrida. Plumb ya tiene los links (31 en el README, linea 88 en adelante); falta subirlos y contarlos como tabla | El jurado lee las primeras 40 lineas; Earned Autonomy tiene alli 3 afirmaciones con link y 14 filas con link, Plumb tiene un video y los comandos [13] | Presentation (20%) | brecha | 14 filas con link a la linea 14-30 contra 0 en las primeras 40 lineas de Plumb [13] | bajo | si |
| S-02 | Agregar a `docs/CLAIMS.md` una columna "Corrida" con el link de cada una de las 27 filas, sin quitar la columna de comando | Plumb gana en auditabilidad (comando por fila), Earned Autonomy en clic directo; lo ideal es tener ambos | Presentation (20%) | brecha | 7 links unicos contra 14, y 0 columnas de link contra 1 [13] | bajo | si |
| S-03 | Escribir en `docs/CLAIMS.md` y en el README una seccion "que hizo una persona y que no", con la prueba del merge (job `merge-gate` en `success` antes de `merged_at`) | La atribucion de merge (`merged_by`) enganya igual en los dos; quien la explica primero se lleva la confianza del jurado | Technological Implementation (20%) | brecha | seccion presente en su CLAIMS, ausente en Plumb [13][14] | bajo | si |
| S-04 | Contar "las 9 etapas" con una tabla etapa a etapa y una corrida real por etapa; el mapa ya existe en `docs/ARCHITECTURE.md`, no hay que inventarlo | Earned Autonomy gano el premio de etapas con esa tabla; Plumb afirma 9 etapas sin link por etapa [10][14] | Design (20%) | brecha | 9 de 9 etapas con link contra 0 [13][14] | bajo | si |
| S-05 | Registrar el despliegue a Cloud Run como `environment:` con deployment en GitLab | El jurado que mire "Deployments" ve 61 en un lado y 0 en Plumb, aunque Plumb despliega con `gcloud run deploy` | Technological Implementation (20%) y bonus Google Cloud | brecha | 61 contra 0 despliegues, 0 `environment:` en el CI propio [9][14] | bajo | si |
| S-06 | Pre-registrar la expectativa antes de correr cada escenario de prueba (commit con el resultado esperado y su fecha), y publicar la tabla esperado/obtenido | Convierte "12 de 12" en una afirmacion que no depende de la palabra del autor | Innovation (20%) | brecha | benchmark con esperados antes de correr contra 0 coincidencias [6][14] | medio | si |
| S-07 | Sumar al menos un segundo flow (por ejemplo revisar el riesgo del MR del arreglo) y con eso mas corridas publicas | El jurado de Most Stages cuenta flows y corridas: 1 contra 4, 43 contra 1575 | Technological Implementation (20%) | brecha | 1 flow contra 4; 43 contra 1575 corridas [3][4] | alto | si |
| S-08 | Estrellas, topics y tamano del README: no tocar | No los pondera ninguno de los 5 criterios | — | — | `docs/judging.tsv` | — | **cosmetico** |

> Control de sesgo: Plumb salio peor o igual en la mayoria de las 13 filas; las celdas mas comodas (benchmark, "forma del claims") se rechequearon con `grep` en el repo propio y con el conteo de links unicos de cada archivo [13][14]. Una aclaracion que favorece a Earned Autonomy: 1575 pipelines `duo_workflow` son corridas, no incidentes distintos: el Router corre en cada pipeline de MR, asi que el numero mide volumen de uso, no 1575 casos.

---

## Notas 1–5 por criterio

<!-- ficha -->

| Criterio | Earned Autonomy | Plumb | Evidencia |
|---|---:|---:|---|
| Technological Implementation | 5 | 4 | 1575 vs 43 corridas de Duo, 4 vs 1 flows, 61 vs 0 despliegues, Terraform vs ninguno [3][4][9] |
| Design | 5 | 4 | Earned Autonomy cubre las 9 etapas con un link por etapa; Plumb un solo bucle muy bien probado sin mapa por etapa [13] |
| Potential Impact | 4 | 4 | Template de 46k estrellas y segunda app (VaultScope) contra el 84 % de fallos pasa-a-falla que son flaky (cita de Google) y 9 min 47 s; ninguno mide adopcion [6] |
| Innovation/Idea | 5 | 5 | Confianza por area que baja y sube, y esperados pre-registrados contra "arreglar y probar con 50 corridas, con control negativo" [6] |
| Presentation | 4 | 4 | Earned Autonomy: pitch con links en las primeras 40 lineas, video sin ver; Plumb: video de 2:23 y pagina con login; ambos con la pagina publica detras de login [7][8] |
| **Promedio** | **4.6** | **4.2** | |
| Bonus Google Cloud | +0.2 | +0.2 | Ambos: Cloud Run vivo 200 y codigo de deploy en el repo; Earned Autonomy ademas Terraform y despliegues registrados [7][9] |

**Total:** Earned Autonomy 4.8/5.2, Plumb 4.4/5.2. Las notas son de esta revision y usan la misma vara que `competidores-gitlab-transcend-shipyard.md` (4.4 para Plumb); `docs/JUDGING-MOCK.md` le daba 4.6. **La diferencia que mas peso:** amplitud medida (9 etapas, 4 flows, 1575 corridas, 61 despliegues) mostrada con un link por afirmacion en la entrada, mientras que Plumb tenia la prueba pero repartida y mas abajo.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api "projects/gitlab-ai-hackathon%2Ftranscend-october-2026%2F43529136%2Fshowcase"` (id 87857306) y `gh api repos/shivansh193/earned-autonomy` (`fork` false, `license` MIT) |
| [2] | `gh api "repos/shivansh193/earned-autonomy/commits?since=2026-10-05T00:00:00Z" --paginate --jq '.[].commit.author.name' \| sort \| uniq -c`; `glab api "projects/87857306/repository/commits?since=2026-10-20T00:00:00Z&per_page=100"`; Plumb: `glab api "projects/87376478/repository/commits?per_page=100&page=N&all=true"` (3 paginas) |
| [3] | `gh api repos/shivansh193/earned-autonomy/contents/.gitlab/duo/flows/<flow>.yaml -H "Accept: application/vnd.github.raw" \| wc -l` (4 archivos: 189, 83, 90, 104 lineas) y `grep -n Trigger` en la cabecera de cada uno |
| [4] | `glab api "projects/87857306/pipelines?source=duo_workflow&per_page=1&status=<success\|failed>" -i \| grep -i x-total` (total 1575, rango 2026-10-20 a 2026-10-27); Plumb: igual sobre 87376478 (43) |
| [5] | `grep -cE '\.spec\.ts$' <scratchpad>/eagh.tree` y `grep -cE '(^\|/)test_.*\.py$'` (6 y 14) sobre el arbol del espejo |
| [6] | `head -60 <scratchpad>/eagh.readme` (pitch y "Judge TL;DR"); `gh api repos/shivansh193/earned-autonomy/contents/benchmark/RESULTS.md -H "Accept: application/vnd.github.raw"`; `grep -ci 'flaky' <scratchpad>/eagh.readme` |
| [7] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' <url>`: `api-prod-gkozang2ta-uc.a.run.app/api/v1/utils/health-check/` 200 17.68 s; `showcase-4900ab.gitlab.io` 302 0.73 s; `showcase-8b103c.gitlab.io` (Plumb) 302 0.53 s; `booking-vic4jyzsha-uc.a.run.app` (Plumb) 200 0.31 s |
| [8] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/earned-autonomy-li8qxm` (200, 136982 bytes; `<title>`, embed de YouTube, "Winner, Most Stages Covered") |
| [9] | `glab api "projects/<id>/deployments?per_page=1" -i \| grep -i x-total` y `glab api "projects/<id>/environments" \| jq length`: 61 y 2 (EA), 0 y 0 (Plumb); `rtk proxy grep -n 'environment:' .gitlab-ci.yml ci/plumb.gitlab-ci.yml` en Plumb: 0 |
| [10] | `sed -n 26,40p <scratchpad>/ea.claims` (tabla "Every stage, with a real run") y `gh api repos/shivansh193/earned-autonomy/contents/docs/stages.md` (34 lineas) |
| [11] | `gh api repos/shivansh193/earned-autonomy/contents/.env -H "Accept: application/vnd.github.raw" \| grep -E '^(SECRET_KEY\|FIRST_SUPERUSER_PASSWORD\|POSTGRES_PASSWORD)=' \| grep -c changethis` (3) y `grep -n '^\.env'` sobre su `.gitignore` (0) |
| [12] | `glab api "projects/87857306/merge_requests?state=all&per_page=100"` (merged_by); `.../pipelines/2992647202/jobs` (job `hands-off-merge` 03:54:23 a 03:54:38, merge a las 03:54:36.96); `.../pipeline_schedules` (`*/10 * * * *`) |
| [13] | `grep -o 'https://gitlab.com[^) ]*' <archivo> \| sort -u \| wc -l` sobre `ea.claims` (14) y `docs/CLAIMS.md` (7); `grep -n CLAIMS README.md` (Plumb: linea 117; EA: 1 mencion arriba) |
| [14] | `rtk proxy grep -niE 'a person\|by a human\|human' README.md`; `rtk proxy grep -rniE 'pre-?regist\|committed before' docs/*.md README.md` (0); `rtk proxy grep -n 'environment:' .gitlab-ci.yml ci/plumb.gitlab-ci.yml` (0); `grep -n 'R7' docs/ARCHITECTURE.md` |
