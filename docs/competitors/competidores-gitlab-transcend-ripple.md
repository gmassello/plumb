# Competidores — GitLab Transcend "Life After Code"

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (`43144845/showcase`, RIPPLE) · clonados 1 (superficial, borrado) · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC (cerradas; proyectos archivados) |

## En criollo

- **Que se miro:** RIPPLE, un globo publico del El Niño 2026 cuya vida despues del codigo (planear, construir, probar, publicar, monitorear) la corren agentes de GitLab Duo.
- **Quien es la amenaza:** es el rival mas fuerte que se vio hasta ahora: corrio el ciclo completo de verdad (57 corridas de Duo, 889 pipelines), tiene demo vivo en Google Cloud y un video de 173 s.
- **Como estamos:** Plumb queda abajo en nota total (4.3 contra 4.5) pero arriba en lo que RIPPLE no hace: una sola pieza que arregla tests flojos de cualquier proyecto (hay dos en juego), no un solo sitio.
- **Que conviene hacer:** en preguntas del jurado, defender "generaliza y prueba su arreglo" contra "un solo sitio automatizado", y mostrar la prueba publica de ejecucion sin login.

**Pesos del jurado** (`docs/judging.tsv`; Stage One es pasa/no pasa):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design (ciclo de punta a punta) | 20% | 4, 6, 9 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7, 4 |
| Presentation | 20% | 1, 8 |
| Bonus Google Cloud | +0.2 | 9, 11 (deploy vivo + codigo de deploy en el repo) |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- La categoria declarada en el formulario de Devpost (Hands-off): la ficha publica no trae el campo. Solo dice "3 of 5 shipped hands-off" y el README dice Path A [9].
- El contenido del video: se confirmo que existe y dura 173 s, no se vio que muestre.
- Los sitios de GitLab Pages redirigen a login para todos (hecho dado: afecta a todos por igual, no penaliza a nadie).

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Tecnica (20%) | Design (20%) | Impacto (20%) | Innovacion (20%) | Presentacion (20%) | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `ripple` (rival) | Sitio de datos climaticos mantenido por agentes | fuerte | fuerte | cumple | cumple | fuerte | 4.3 + 0.2 = 4.5 | alta |
| `plumb` (propio, nota base) | Arreglo de tests flojos en cualquier proyecto | cumple | cumple | cumple | fuerte | cumple | 4.1 + 0.2 = 4.3 | — |

**Amenaza** es contra Plumb: mismo evento, mismo premio unico, mismo criterio "ciclo despues del codigo". Notas del rival: Tech 4.5, Design 4.5, Impact 4, Innovation 4, Presentation 4.5. Plumb no se cambia (4, 4, 4, 4.5, 4).

---

## `gitlab-ai-hackathon/transcend-october-2026/43144845/showcase` — RIPPLE

<!-- ficha -->

**Que hace:** un globo publico del El Niño mas fuerte registrado que responde "que significa esto donde vivo", cuyo mantenimiento corre solo con agentes de Duo y CI de GitLab.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144845/showcase · creado 2026-10-10 · TypeScript + Node · MIT (archivo `LICENSE`; el campo de la API sale vacio) [1] |
| Demo | https://ripple-vcoeoshooa-nn.a.run.app · `curl` 200 en 1.74 s; `/control.html` 200 en 0.56 s; `/api/receipts` 200 en 3.3 s [2] |
| Devpost | `ripple-the-record-el-nino-kept-live-by-agents` · video si (YouTube, 173 s) [3] |
| Equipo | 1 persona (118 de 127 commits humanos = 93%) + cuentas de servicio `RIPPLE Mission` (7) y `RIPPLE Medic` (1) [4] |
| Historial | primer commit real 2026-10-10 (repo creado ese dia, despues de la apertura 2026-10-05) · 158 commits · previos al evento: no [5] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (usa Duo) | fuerte | 57 pipelines `duo_workflow`; commits firmados por `RIPPLE Mission`; 6 flows en `flows/*.yaml` (576 lineas en total) [6] |
| Tecnica 20% | fuerte | 889 pipelines, 22 jobs en 7 etapas en un MR; 33 archivos de test, 427 `it`/`test`, 1277 asserts; 27767 lineas de codigo; deps con version exacta; escaneo de secretos sin hallazgos [7] |
| Design 20% | fuerte | Issue → plan → MR → verificar → asegurar → canary 10% → 100% → informe, todo en el pipeline !3 verde; `merge-gate` lee la politica desde `main` [8] |
| Impacto 20% | cumple | Impacto sobre el publico (OCHA US$17,4 M, FAO-WFP US$202 M) y mantenedores; el valor para equipos de desarrollo es indirecto: es un sitio, no una herramienta reutilizable |
| Innovacion 20% | cumple | Vigilante programado que abre el issue solo (#7, 18 min tras la publicacion de NOAA); recibos calculados desde la API; agentes que se niegan a violar `AGENTS.md` (#5); la autonomia es del propio sitio, no de otros proyectos |
| Presentacion 20% | fuerte | Video 173 s, 8 capturas, demo vivo publico, titulo del video nombra "Life After Code" [2][3] |
| Bonus Google Cloud | fuerte | Cloud Run vivo (200) + `deploy/cloudbuild.yaml`, `service.yaml`, `gcp-setup.sh`, deploy sin claves por Workload Identity [2][10] |
| Seguridad | cumple | sin `.env`, `.pem` ni credenciales en el arbol ni en el historial [7] |

**Lo mas fuerte:** 5 cambios entregados, 3 sin accion humana, mediana 23.4 min del issue a produccion, y los numeros salen en vivo de la API (`/api/receipts` 200) [2][8].
**Donde se cae:** el 93% de los commits es del mantenedor; de 11 MRs, 5 llevan commits de `RIPPLE Mission` (!1-!4, !7); !8 (Mission) sigue abierto, !10 (Medic) cerrado, y !9 (Medic) tardo 7 dias en mergearse, con `merged_by` el mantenedor (que, segun su README, es el token que usa CI, asi que no prueba merge manual) [4][11]. El README admite que la etiqueta `agent::*` se puede usar para forzar un auto-merge [12].
**Sin evidencia:** la categoria declarada (Hands-off) y el contenido del video.

---

## Donde queda tu proyecto

| Criterio | Plumb | RIPPLE |
|---|---|---|
| Corridas de Duo (`duo_workflow`) | 43 [6] | 57 [6] |
| Pipelines / MRs | 239 / 17 [6] | 889 / 11 [6] |
| Contribuyentes | 123 humano + 12 `triage-flow` | 118 humano + 7 Mission + 1 Medic [4] |
| Tests (`it`/`test`, asserts) | 59 / 148 | 427 / 1277 [7] |
| Lineas de codigo | 6964 | 27767 [7] |
| Demo vivo en Google Cloud | `booking-vic4jyzsha-uc.a.run.app` 200 en 0.30 s (app de prueba) [2] | `ripple-vcoeoshooa-nn.a.run.app` 200 en 1.74 s (el producto) [2] |
| Video | 2:23 | 2:53 (173 s) [3] |
| Proyectos donde corre el flow | 2 (Plumb + epic-stack, via `include: project`) | 1 |

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Abrir con "11 de 11 arreglos mergeados por el gate" junto al numero de RIPPLE (3 de 5 sin humano) | El jurado compara cuanta autonomia hay; Plumb la tiene mas alta y no la pone arriba | Design (20%) | brecha | RIPPLE destaca 3/5, 23.4 min, 0.96 g en su cabecera [8]; Plumb mide 11/11 `fix/` mergeados (2026-10-22) | bajo | si |
| S-02 | Mostrar prueba de ejecucion visible sin login (capturas fechadas de pipelines `duo_workflow` en el README) | RIPPLE tiene un sitio publico con recibos que anda hoy; las paginas de Plumb redirigen a login | Presentation (20%) | brecha | `curl` a `/api/receipts` 200 contra Pages 302 [2] | medio | si |
| S-03 | Preparar la respuesta "por que Plumb y no un sitio que se mantiene solo": generaliza a otros proyectos y prueba su arreglo | RIPPLE tiene mas codigo y mas tests; la ventaja de Plumb es el alcance, no el tamaño | Innovation (20%) | brecha | RIPPLE: 1 proyecto, 427 tests; Plumb: 2 proyectos, 33/50 de control negativo | bajo | si |
| S-04 | Tamaño del repo o de los tests de Plumb | Ningun jurado pondera lineas de codigo | — | — | 6964 contra 27767 [7] | alto | **cosmetico** |

> Control de sesgo: se midio a Plumb con las mismas sondas y salio peor en Tecnica, Design y Presentacion; la ventaja se limita a Innovation. El rival tiene tambien mas lineas, tests y pipelines, y el jurado puede notarlo.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api projects/<path-codificado>` (`.created_at`, `.license`, `.archived`); `glab api projects/87459436/repository/files/LICENSE/raw?ref=HEAD` |
| [2] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' <url>` sobre `/`, `/control.html`, `/open.html`, `/api/receipts`, `/api/v1/`, `/feed.xml`, y el demo de Plumb |
| [3] | `curl -sL -A 'Mozilla/5.0' https://devpost.com/software/ripple-the-record-el-nino-kept-live-by-agents` + `grep youtu`; YouTube `watch?v=f0LK62Wvivs` → `lengthSeconds` 173 |
| [4] | `glab api projects/87459436/repository/contributors`; `glab api "projects/87459436/repository/commits?per_page=100&all=true&page=N"` |
| [5] | `git log --reverse --format='%ad %s' --date=iso \| head -2`; `git rev-list --count HEAD` en el clon superficial |
| [6] | `glab api -i "projects/<id>/pipelines?source=duo_workflow&per_page=1"` (`X-Total`); `.../pipelines?per_page=1`; `.../merge_requests?state=all&per_page=1`; `wc -l flows/*.yaml` |
| [7] | clon superficial: `grep -rhoE "^\s*(it\|test)\(" tests \| wc -l`; `grep -rhoE "expect\(\|assert[.(]" tests \| wc -l`; `git ls-files \| xargs wc -l`; escaneo de `.env`, `.pem`, claves en el arbol e historial |
| [8] | `glab api projects/87459436/pipelines/2934675132/jobs`; `glab api projects/87459436/merge_requests/<n>/commits` para !1-!4 y !7 |
| [9] | `grep -niE 'hands-off\|path a' README` y de la ficha de Devpost |
| [10] | `deploy/` en el arbol del repo + `grep -c 'Cloud Run'` en la ficha |
| [11] | `glab api "projects/87459436/merge_requests?state=all&per_page=20"` (estado, `merged_by`, fechas) |
| [12] | `sed -n 114p README` ("Known limitation: who counts as an agent") |
