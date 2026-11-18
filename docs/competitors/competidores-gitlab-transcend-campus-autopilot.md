# Competidores — GitLab Transcend "Life After Code"

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (+ Plumb propio) · clonados 1 · **nada se ejecuto** (solo GET de lectura a la demo) |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC |

## En criollo

- **Que se miro:** Campus Autopilot, un rival de la misma categoria (Path A, Hands-off), con el mismo premio unico que Plumb.
- **Quien es la amenaza:** el. Cuenta casi la misma historia que Plumb (la CI decide, Duo arregla), pero llega hasta produccion en Google Cloud y vuelve atras sola cuando un release sale mal.
- **Como estamos:** Plumb es mas fuerte en pagina del proyecto y en prueba sobre un segundo proyecto real; el rival gana en pruebas automaticas (160 vs 59) y en ciclo completo hasta produccion.
- **Que conviene hacer:** nada nuevo en el repo: el concurso cerro y los proyectos estan archivados. Sirve para el retro y para la defensa del pitch: la diferencia a marcar es "validamos contra un proyecto ajeno (epic-stack)", que el rival no tiene.

**Pesos del jurado** (`docs/judging.tsv`; Stage One es pasa/no pasa, bonus Google Cloud +0.2):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 2, 4, 5, 8, 9, 10 |
| Design | 20% | 6, 1 |
| Potential Impact | 20% | 1, 3 |
| Innovation / Idea | 20% | 7, 4 |
| Presentation | 20% | 1, 8 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- Los sitios de GitLab Pages redirigen a login para anonimos en todos los proyectos: no se pudo ver su pagina del proyecto, si la tiene (no hay `site/` en el arbol [1]).
- El video (2:52) no se miro: solo se confirmo que esta embebido en Devpost [8]. Calidad de narracion y de la parte visual: sin evidencia.
- La nota de Design se apoya en el codigo del front, no en una captura: la pagina viva solo se midio por codigo de respuesta [7].

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Tech 20% | Design 20% | Impact 20% | Innovation 20% | Presentation 20% | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `Campus Autopilot` | issue a produccion sin clics, con vuelta atras y re-entrega | fuerte | flojo | fuerte | fuerte | cumple | 4.0 prom. | alta |
| `Plumb` (propio) | triage de pruebas inestables, la CI decide y Duo arregla | cumple | cumple | cumple | fuerte | cumple | 4.1 prom. | — |

**Amenaza** es contra Plumb: mismo premio, misma tesis, mismo bonus de Google Cloud.

---

## `gitlab-ai-hackathon/.../43289904/showcase` — Campus Autopilot

<!-- ficha -->

**Que hace:** un dueño de codigo abre un issue, agentes de Duo escriben, prueban y revisan el cambio, una compuerta fija decide si se mergea, y el release sale por canarios a staging y produccion en Google Cloud; si falla, otro flow abre incidente y revierte, y el cambio vuelve a entregarse corregido.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43289904/showcase · creado 2026-10-12 · Python (FastAPI) · MIT (archivo `LICENSE`; la API dice licencia `null`) [1] |
| Demo | Cloud Run produccion: `curl` 200 en 10.4 s en `/readyz` (arranque en frio), 200 en 0.34 s en `/` [7]; Pages: sin evidencia |
| Devpost | `campus-autopilot` · video si, YouTube 2:52 [8] |
| Equipo | 1 persona (`Sanchay Singh`: 85 de 111 commits, 77%) · mas 26 de las cuentas del flow (Autopilot 21, Incident Response 5) [3] |
| Historial | primer commit 2026-10-13 · 111 commits · previos al evento: no (el repo se creo el 12) [3] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Technological Implementation 20% | fuerte | 160 tests y 445 asserts [4]; 7.823 lineas sin lockfiles; 808 pipelines en el proyecto [2]; Terraform con acceso sin llaves; 4 escaneres + compuerta de politica [5] |
| Design 20% | flojo | solo `app/static/app.js` y `index.html` de la app de ejemplo, sin `site/` ni design system [1]; el esfuerzo esta en el flujo, no en lo visual |
| Potential Impact 20% | fuerte | ciclo issue → produccion en 34 min y incidente → arreglo en 21 min, medidos en MRs y releases [6]; 8 releases de GitLab [9] |
| Innovation / Idea 20% | fuerte | "fix forward": tras un revert exacto, el steward abre un issue para re-entregar el cambio corregido [6] |
| Presentation 20% | cumple | README con diagrama, prueba fechada y limites honestos; video 2:52 [8]; sin pagina del proyecto vista |
| Stage One (usa Duo) | cumple | 20 pipelines `duo_workflow` (19 ok, 1 fallido), 17 commits de la cuenta del flow, 3 flows en `.gitlab/duo/flows/` [2] |
| Bonus Google Cloud | +0.2 | demo viva en Cloud Run (200) y Terraform en `infra/` [1][7] |
| Seguridad | cumple | no hay `.env` en el arbol, solo `.env.example`; `infra/showcase.auto.tfvars` declara no tener secretos [1] |

**Lo mas fuerte:** cierra el ciclo completo (entrega, reversion, re-entrega) con tiempos medidos, y lo prueba en el historial del proyecto [6].
**Donde se cae:** sin pagina de proyecto ni design system; una sola persona detras; los flows se pegan a mano en el AI Catalog y el steward actua con el token de un dueño [6].
**Sin evidencia:** video, Pages, y si el steward es "no hay clics" en la practica (su propio README dice que durante el juicio corre cada hora).

---

## Donde queda tu proyecto

| Criterio | Plumb | Campus Autopilot |
|---|---|---|
| Tests (casos / asserts) | 59 / 147 | 160 / 445 [4] |
| Commits · cuentas | 147 · 1 | 111 · 1 humana [3] |
| Lineas de codigo (sin lockfiles ni sesiones) | 13.576 | 7.823 [4] |
| Demo en Cloud Run | si, `booking-vic4jyzsha-uc.a.run.app` (README) | si, 200 [7] |
| Pagina del proyecto | si, `site/` con toggles | no [1] |
| Segundo proyecto de prueba | si, epic-stack (27/50) | no |
| Video | si (README) | si, 2:52 [8] |

Nota de Plumb: **sin cambios** (Tech 4, Design 4, Impact 4, Innovation 4.5, Presentation 4; +0.2). La evidencia contra el rival no mueve ninguna celda; la mas expuesta es Tech (rival 160 tests contra 59), y se mantiene en 4 porque Plumb tiene la validacion externa sobre epic-stack.

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Defender en el pitch la validacion sobre un proyecto ajeno | es lo que el rival no tiene y separa las dos tesis casi iguales | Innovation (20%) | brecha | rival sin segundo proyecto [1][2] | bajo | si |
| S-02 | Responder "¿y despues del arreglo?": explicar hasta donde llega Plumb (diagnostico y arreglo) frente a la entrega hasta produccion del rival | el jurado va a comparar alcance del ciclo | Potential Impact (20%) | brecha | rival mide 34 min issue → produccion [6] | bajo | si |
| S-03 | Subir la cobertura de tests de la logica de Plumb | el rival tiene 160 tests contra 59 | Technological Implementation (20%) | brecha | [4] | medio | si |
| S-04 | Poner mas estrellas o topics al repo | — | — | — | — | bajo | **cosmetico** |

> Control de sesgo: Plumb sale mejor en Design y en la validacion externa, y peor en tests y alcance del ciclo; no es "mejor en todo". Las tres celdas mas comodas (Design, Innovation, Presentation de Plumb) se revisaron contra `site/` y el README propios.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api projects/87534896` y `glab api "projects/87534896/repository/tree?recursive=true&per_page=100" --paginate`; `LICENSE` por `repository/files/LICENSE/raw` |
| [2] | `glab api -i "projects/87534896/pipelines?per_page=1"` (X-Total 808) y `...?source=duo_workflow&per_page=1` (X-Total 20); estados con `per_page=100` y `jq` |
| [3] | `glab api "projects/87534896/repository/commits?all=true&per_page=100&page=N"` (4 paginas, 111) y `jq` por `author_name` |
| [4] | clone `--depth 50`: `grep -rcE '^\s*def test_' tests`, `grep -rcE '^\s*assert ' tests`, `git ls-files \| grep -vE 'lock\|\.txt$' \| xargs wc -l` (clone borrado al final) |
| [5] | `grep -nE '^[a-z0-9_:-]+:$' .gitlab-ci.yml` (jobs `container_scanning`, `semgrep-sast`, `secret_detection`, `policy-gate`, `merge-steward`, `deploy-*`) |
| [6] | `README.md` del rival, secciones "Proof, in the project's history" y "Honest limits" (leida por API) |
| [7] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s'` sobre `/readyz` de produccion y staging y `/` de produccion |
| [8] | `curl -sL -A 'Mozilla/5.0' https://devpost.com/software/campus-autopilot` y `grep -oE 'youtube.com/embed/[^?"]*'` |
| [9] | `glab api -i "projects/87534896/releases?per_page=1"` (X-Total 8) |

Notas por criterio del rival (1 a 5): Tech 4.5, Design 3, Impact 4, Innovation 4, Presentation 4; bonus Google Cloud +0.2.
