# Competidores — GitLab Transcend "Life After Code" · Offbrief

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (+ Plumb como control) · clonados 0 · **nada se ejecutó** |
| Ventana | submissions 2026-10-05 → 2026-10-27 (13:00 UTC) |

## En criollo

- **Qué se miró:** Offbrief, el rival más parecido a Plumb: también desconfía del "verde" que escribe el mismo agente. Todo por la API de GitLab, la ficha de Devpost y dos sitios en vivo; sin bajar ni correr nada.
- **Quién es la amenaza:** Offbrief, y alta. Hace la misma apuesta (el agente no corrige su propia nota), con mucho más aparato: 5 agentes de Duo, 79 corridas de Duo, 41 archivos de infraestructura, un benchmark de 24 casos con intervalos de confianza y un video de 2:55.
- **Cómo estamos:** Plumb gana en foco y claridad (un problema, una frase, 50 corridas como prueba); Offbrief gana en profundidad técnica y en cantidad de evidencia pública. Los dos tienen el bonus de Google Cloud.
- **Qué conviene hacer:** no competir en volumen. Decir en la ficha, con números, qué resuelve Plumb que Offbrief no (tests intermitentes del propio proyecto, probados en 50 corridas) y cuidar que el jurado entienda Plumb en 30 segundos, algo que el README de Offbrief (6.143 palabras) no logra.

**Pesos del jurado** (`docs/judging.tsv`; texto en `docs/HACKATHON.md` §4):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 2, 4, 5, 9, 10 |
| Design | 20% | 1, 6, 8 |
| Potential Impact | 20% | 1, 7 |
| Innovation/Idea | 20% | 7 |
| Presentation | 20% | 1, 8 |
| Stage One (pass/fail: usa GitLab Duo Agent Platform) | pasa o no | 2 |
| Bonus Google Cloud | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- El sitio de GitLab Pages de ambos redirige a login tras el cierre (afecta a todos por igual); la sesión de cada flow tampoco se ve sin iniciar sesión, solo sus pipelines.
- Los 2.489 tests de Offbrief son lo que dice su README [10]; no se contaron ni se corrieron.
- Hay 10 commits de "Mario Gutierrez" junto a 76 de `terrizoaguimor`: no se pudo saber si es la misma persona con otra identidad de git.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miró y no está) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Tecnología 20% | Diseño 20% | Impacto 20% | Innovación 20% | Presentación 20% | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `offbrief` (rival) | Puerta de calidad por tráfico real grabado | fuerte (4.5) | cumple (4) | cumple (4) | fuerte (4.5) | cumple (4) | 21/25 +0.2 | alta |
| `plumb` (propio) | Puerta de calidad para tests intermitentes | cumple (4) | cumple (4) | cumple (4) | fuerte (4.5) | cumple (4) | 20.5/25 +0.2 | — |

**Amenaza** es contra *tu* entrada, no calidad absoluta. Las notas de Plumb son la base consolidada de otros revisores; no se cambiaron.

---

## `gitlab-ai-hackathon/.../43106822/offbrief` — Offbrief

<!-- ficha -->

**Qué hace:** antes de aceptar un cambio hecho por un agente en una API de pacientes (sintética), vuelve a reproducir tráfico real grabado contra la versión estable y la nueva, y decide con una puerta de 12 chequeos si se publica.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43106822/offbrief · creado 2026-10-07 · Python · MIT (archivo `LICENSE`; el campo de licencia de GitLab figura vacío) · archivado [1] |
| Demo | API en Google Cloud Run: `curl` 200 en 4.37 s (arranque en frío) y `/docs` 200 en 0.29 s; página de recibos 200 en 4.75 s [2] |
| Devpost | `offbrief` · video sí (https://youtu.be/kjYJZfcc33U, 2:55) [3] |
| Equipo | 1 persona según la ficha ("solo build") · 76/10/14 commits: `terrizoaguimor` / "Mario Gutierrez" / cuentas de servicio de Duo [4] |
| Historial | proyecto creado 2026-10-07 (posterior a la apertura del 2026-10-05) · 199 commits · previos al evento: no [1][4] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Technological Implementation 20% | fuerte | 5 flows de Duo en `flows/`, 79 corridas `duo_workflow` (78 ok, 1 fallida), 199 commits, 41 archivos `.tf` (infraestructura como código), 137 archivos de test [4][5][6] |
| Design 20% | cumple | un único disparador (issue con etiqueta) y recibos encadenados con hash; pero el README tiene 6.143 palabras y 299 líneas, con jerga densa en las primeras 40 líneas [7] |
| Potential Impact 20% | cumple | público claro (equipos con agentes sobre datos regulados), pero el demo es una API sintética de pacientes; la brecha admitida (`c6-raw-ip-miss`) está documentada [8] |
| Innovation/Idea 20% | fuerte | "el tráfico de producción es el único testigo que el agente no escribió": 3 réplicas, marcas honeytoken por corrida y canary; benchmark de 24 casos: tests del agente 0/18, puerta determinista 17/18, 0/6 falsos positivos [8] |
| Presentation 20% | cumple | video de 2:55 con apertura en frío (30/30 tests del agente contra la puerta en FAIL) y ficha larga; la ficha no es fácil de seguir sin glosar el vocabulario propio [3][7] |
| Stage One (Duo) | cumple | 5 flows definidos y 79 pipelines `duo_workflow` en 2026-10 [5][6] |
| Bonus Google Cloud | fuerte | despliegue vivo en Cloud Run 200 + 41 `.tf` y `deploy.yml` con `gcloud`/Cloud Run en el repo [2][9] |
| Calidad de código | fuerte | README afirma 2.489 tests (no verificado); 137 archivos de test; deps con `uv.lock` y 14 `.lock` [7][10] |
| Seguridad | cumple | sin `.env` ni `.pem` en el árbol; el proyecto es en sí un escáner de fuga de datos; honeytokens sintéticos [11] |
| CI/CD | cumple | 100 pipelines recientes: 86 ok / 14 fallidos (4 de ellos de `api`, 5 de MR); el conductor de MR !10 terminó verde (12:43:51) antes del merge (12:45:53), lo que sostiene un merge por el pipeline y no manual [12] |

**Lo más fuerte:** profundidad y evidencia pública verificable: 79 corridas de Duo, benchmark de 24 casos con intervalo de confianza y 41 archivos `.tf` [4][5][6].
**Dónde se cae:** legibilidad (README de 6.143 palabras), demo sobre datos inventados, y una brecha propia (`c6-raw-ip-miss`) que el benchmark reconoce [7][8].
**Sin evidencia:** los 2.489 tests (solo el README los afirma), el contenido de las sesiones de Duo y si "Mario Gutierrez" es otra persona.

---

## Donde queda tu proyecto

| Criterio | Plumb | `offbrief` |
|---|---|---|
| Corridas de Duo (`duo_workflow`) | 43 [5] | 79 [5] |
| Pipelines totales | 239 [5] | 100 listados (86 ok) [12] |
| Flows de Duo | 1 (`.gitlab/duo/triage-flow.yml`) | 5 |
| Tests | 8 archivos de test unitario + 5 e2e a propósito intermitentes | 137 archivos de test; 2.489 afirmados [10] |
| Infraestructura como código | 0 `.tf`; despliegue con `run deploy` en `.gitlab-ci.yml` [9] | 41 `.tf` [9] |
| Endpoint desplegado | `curl` 200 en 0.29 s [2] | 200 en 4.37 s en frío / 0.29 s [2] |
| Video | sí, 2:23 | sí, 2:55 |
| Palabras del README | ver `wc -w README.md` en Plumb (~152 líneas) | 6.143 [7] |

### Sugerencias

| # | Sugerencia | Por qué importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | En la ficha y el video, contrastar de frente con "puerta por tráfico grabado": Plumb prueba con 50 corridas que un rojo es intermitente y lo arregla; Offbrief no atiende tests intermitentes del propio proyecto | El jurado va a ver los dos juntos (misma categoría, un solo premio) y necesita saber en 10 segundos qué hace Plumb que el otro no | Innovation (20%) | brecha | `offbrief` 4.5 vs Plumb 4.5 en la misma idea [8] | bajo | sí |
| S-02 | Poner en la ficha la cifra de corridas de Duo propias (43 en este proyecto) al lado del número de pipelines | Offbrief muestra 79 corridas y recibos; Plumb no muestra cuántas veces corrió su agente | Technological Implementation (20%) | brecha | 79 vs 43 [5] | bajo | sí |
| S-03 | Primer párrafo del README y de la ficha en una frase sin jerga, y mantenerlo | La puntuación de Presentación se juega en 30 s; el README rival tiene 6.143 palabras y vocabulario propio, la ventaja de Plumb es ser corto | Presentation (20%) | brecha | README rival: 6.143 palabras, 299 líneas [7] | bajo | sí |
| S-04 | Nombrar en la ficha los límites conocidos de Plumb con su número, como hace el rival con su caso `c6` | La honestidad sobre lo que no funciona ya está en el brief; el rival la usa de argumento | Potential Impact (20%) | brecha | `offbrief` publica 17/18 con el caso fallido nombrado [8] | medio | sí |
| S-05 | Agregar archivos de infraestructura (por ejemplo `.tf`) del despliegue a Cloud Run | Probaría el bonus con "código de deploy en el repo"; hoy es un `run deploy` en el pipeline | Bonus Google Cloud (+0.2) | brecha | `offbrief` 41 `.tf`; Plumb 0 [9] | alto | **cosmético** (el bonus ya está) |

> Control de sesgo: Plumb se midió con las mismas sondas (duo_workflow, pipelines, `curl`) y sale detrás en profundidad técnica (43 vs 79 corridas, 1 vs 5 flows, 0 vs 41 `.tf`); mejora solo en claridad. Se revisaron las tres celdas más cómodas (Innovación, Presentación y Cloud) y se mantuvieron sin subirlas.

---

## Apéndice — cómo se midió

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api "projects/gitlab-ai-hackathon%2Ftranscend-october-2026%2F43106822%2Foffbrief" \| jq '{id,created_at,archived,license,topics}'` |
| [2] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' -m 20 <url>` sobre `patient-api-...run.app/health`, `/docs`, la página de recibos y `booking-vic4jyzsha-uc.a.run.app/health` (Plumb) |
| [3] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/offbrief` y `grep -oiE 'youtu[^"<> ]+'` |
| [4] | `glab api "projects/87345551/repository/commits?per_page=100&all=true" \| jq -r '.[].author_name' \| sort \| uniq -c` y `glab api -i ".../commits?per_page=1&all=true"` (X-Total 199) |
| [5] | `glab api -i "projects/<id>/pipelines?source=duo_workflow&per_page=1"` (X-Total: Offbrief 79, Plumb 43) |
| [6] | `glab api "projects/87345551/repository/tree?recursive=true&per_page=100&page=N"` y `grep -E '^flows/\|^\.gitlab/duo'`, `grep -c '\.tf$'` (41), `grep -cE '(^\|/)tests?/.*\.py$'` (137) |
| [7] | `glab api ".../repository/files/README.md/raw?ref=HEAD" \| wc -lw` (299 líneas, 6.143 palabras) |
| [8] | `glab api ".../repository/files/docs%2Fbenchmark.md/raw?ref=HEAD"` (tabla de filas 1–4) |
| [9] | `glab api ".../files/.gitlab%2Fci%2Fdeploy.yml/raw" \| grep -ciE 'gcloud\|cloud run\|run deploy'` y `grep -l 'run deploy' .gitlab-ci.yml ci/*.yml` en Plumb |
| [10] | Línea "2,489 tests collected" del README del rival (afirmación; no se contó ni ejecutó) |
| [11] | `grep -E '^\.env$\|\.pem$'` sobre el árbol: sin resultados |
| [12] | `glab api "projects/87345551/pipelines?per_page=100" \| jq` por estado y fuente; `glab api projects/87345551/merge_requests/10` y `.../pipelines/2946852762/jobs` (`finished_at` 12:43:51 ≤ `merged_at` 12:45:53) |
