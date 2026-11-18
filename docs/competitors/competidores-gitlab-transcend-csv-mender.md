# Competidores — GitLab Transcend "Life After Code"

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (`CSV Mender`) · clonados 0 (se leyó todo por API de solo lectura) · **nada se ejecutó** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC (ya cerrada) |

## En criollo

- **Que se miro:** CSV Mender, el rival directo en la categoría "Hands-off" (arreglar solo, sin manos), contra Plumb con las mismas sondas.
- **Quien es la amenaza:** CSV Mender, alta: hace casi lo mismo que Plumb (avisás un problema y llega el arreglo a producción solo) y lo muestra con 7 corridas públicas, 449 pruebas y un demo en Google Cloud que responde hoy [1][2].
- **Como estamos:** parejos. Plumb 20 de 25 puntos, CSV Mender 19 de 25; Plumb gana en diseño e impacto, CSV Mender en ejecución técnica.
- **Que conviene hacer:** el plazo de envío ya cerró; lo que aún se puede tocar (README, repo) debería mostrar números de corridas y pruebas con la misma claridad que CSV Mender (S-01 a S-03).

**Pesos del jurado** (de `docs/judging.tsv`; cada uno 20%, más Stage One pasa/no pasa y bonus Google Cloud +0.2):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Stage One: usa GitLab Duo Agent Platform | pasa/no pasa | 2 |
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design | 20% | 1, 4, 6 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7, 4 |
| Presentation | 20% | 1, 8 |
| Google Cloud bonus | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- `sin evidencia`: lo que dice el video de CSV Mender (solo se confirmó que existe y responde [3]); duración y contenido no se miraron.
- `sin evidencia`: las sesiones del flow y los créditos de Duo de ambos (piden acceso al proyecto); se usó el conteo de pipelines `duo_workflow` [4].
- `sin evidencia`: si CSV Mender escribió su código antes del 18 de octubre en privado: el repo nace el 2026-10-18 y sus 11 commits iniciales caen en 29 segundos [5]. Es un dato, no una acusación.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miró y no está) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Tech. 20% | Design 20% | Impact 20% | Innovation 20% | Presentation 20% | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `CSV Mender` (rival) | CSV bancario roto → arreglo a producción | fuerte | cumple | cumple | cumple | cumple | 19/25 | alta |
| `Plumb` (propio) | prueba inestable (flaky) → arreglo probado | cumple | cumple | cumple | cumple | cumple | 20/25 | — |

**Amenaza** es contra Plumb: misma categoría (Hands-off), mismo premio único de US$5.000, mismo patrón "CI decide, Duo actúa".

---

## `gitlab-ai-hackathon/transcend-october-2026/43461547/showcase` — CSV Mender

<!-- ficha -->

**Que hace:** cuando alguien abre un reporte de importación bancaria rota, un flow de Duo escribe el test y el arreglo, Duo revisa, un job de CI lo mergea y despliega, y el reporte se cierra solo.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43461547/showcase · creado 2026-10-18 · Python 99,7% · licencia MIT (archivo `LICENSE` presente) [6] |
| Demo | https://csv-mender-879903213333.europe-west6.run.app · `curl` 200 en 4.2 s la primera vez, `/health` 200 en 0.60 s [2] |
| Devpost | `csv-mender` · video sí (YouTube, responde 200) [3] · tags: gitlab-duo-agent-platform, google-cloud-run, mcp, hypothesis |
| Equipo | 1 persona (66 commits de la persona, 18 del flow, 1 de la plantilla) [5] |
| Historial | primer commit propio 2026-10-18 (11 commits en 29 s) · 85 commits · previos al 2026-10-05: no |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (usa Duo) | fuerte | 22 pipelines `duo_workflow`, todos `success`, desde 2026-10-19 [4]; flow propio de 406 líneas, agente propio y config MCP en el árbol [7] |
| Technological Implementation 20% | fuerte | 24 archivos de test, 449 pruebas en un job citado, pruebas con Hypothesis, SAST y secret detection, rollback automático, merge:gate [7][8] |
| Design 20% | cumple | bucle completo issue→merge→deploy→cierre en 7 corridas; demo web de una pantalla con CSS mínimo, sin idiomas ni temas [9] |
| Potential Impact 20% | cumple | problema real pero angosto (importadores de bancos); mide 6 de 7 sin intervención, mediana 14 min 45 s [10] |
| Innovation/Idea 20% | cumple | rechazó una instrucción mala a propósito (corrida 06) y un caso sin cambio (07); la idea central es la misma que la de Plumb [10] |
| Presentation 20% | cumple | video existe; README abre con "Verify it yourself in 2 minutes" y ids de jobs; contenido del video `sin evidencia` [3][10] |
| Google Cloud bonus | fuerte | demo vivo 200 y código de deploy en `.gitlab-ci.yml` (`deploy:cloudrun`, `smoke:cloudrun`) [2][7] |
| Calidad de codigo | fuerte | ruff + 449 pruebas; 12 de 960 pipelines fallaron, 28 manuales [4][7] |
| Seguridad | cumple | `scripts/check_gcp_key.py` chequea la llave antes del login; ningún `.env` ni `.pem` en el árbol [7] |

**Lo mas fuerte:** 22 pipelines de Duo y 7 corridas publicadas con links abiertos, más 449 pruebas [4][10].
**Donde se cae:** diseño de una sola pantalla y problema angosto; el primer arranque del demo tardó 4.2 s [2].
**Sin evidencia:** contenido del video y las sesiones de Duo (piden acceso).

---

## Donde queda tu proyecto

| Criterio | Plumb | CSV Mender |
|---|---|---|
| Pipelines `duo_workflow` | 43 (43 desde el 2026-10-05) [4] | 22 [4] |
| MRs mergeados | 12 [4] | 8 [4] |
| Archivos de test | 13 [11] | 24 [7] |
| Pruebas publicadas en el README | 0 menciones de conteo [11] | "1 failed, 449 passed" con link a job [10] |
| Tabla de corridas con mediana | 1 mención (README) [11] | 7 corridas, mediana 14 min 45 s [10] |
| Camino del jurado en el README | 0 menciones [11] | sección "Judges: 5 minutes" [10] |
| Demo en Google Cloud | 200 en 1.8 s [2] | 200 en 4.2 s [2] |
| Idiomas y temas en la página | sí (sitio de proyecto en inglés/español) [11] | no [9] |
| Commits | 147 (2 autores y el flow) [11] | 85 [5] |

### Notas 1–5

Escala 1 a 5 con la misma vara para los dos. Mis notas para Plumb son más duras que su `JUDGING-MOCK.md` (que se puso 5 en tres criterios) a propósito, para controlar el sesgo.

| Criterio | CSV Mender | Plumb | Evidencia |
|---|---:|---:|---|
| Technological Implementation | 5 | 4 | CSV: 24 archivos de test, 449 pruebas, Hypothesis, rollback [7]. Plumb: 13 archivos, ~156 líneas con `assert`, prueba de 50 corridas y gate [11] |
| Design | 3 | 4 | CSV: demo de 2.5 KB sin idiomas ni temas [9]. Plumb: bucle de 9 etapas y sitio bilingüe [11] |
| Potential Impact | 3 | 4 | CSV: importadores bancarios, 6/7 [10]. Plumb: pruebas inestables, que sufre todo equipo de CI [11] |
| Innovation/Idea | 4 | 4 | CSV: rechazo de instrucción mala [10]. Plumb: "CI decide, Duo arregla" con control negativo 33/50 [11] |
| Presentation | 4 | 4 | CSV: video + guía de 2 min [3][10]. Plumb: video de 2:23 con avatar de IA, que el jurado podría leer como falta de presencia humana [11] |
| **Total sobre 25** | **19** | **20** | diferencia de un punto: dentro del error de medición |
| Bonus Google Cloud (+0.2) | sí | sí | los dos con demo en 200 y código de deploy en el repo [2][7][11] |

Stage One: los dos pasan (22 y 43 pipelines `duo_workflow`) [4].

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Publicar en el README cuántas pruebas pasan y linkear el job que lo demuestra | El jurado compara números y ve 449 en uno y ninguno en el otro | Technological Implementation (20%) | brecha | CSV cita "449 passed" con job; Plumb 0 menciones [10][11] | bajo | si |
| S-02 | Agregar una tabla de todas las corridas reales con tasa sin manos y mediana | Convierte 12 MRs en un número comparable | Potential Impact (20%) | brecha | CSV: 6/7 y 14 min 45 s; Plumb 1 mención [10][11] | medio | si |
| S-03 | Poner un camino de 5 minutos para el jurado arriba del README, con ids de jobs | El jurado lee 400 fichas; el que guía gana tiempo | Presentation (20%) | brecha | CSV tiene "Judges: 5 minutes"; Plumb 0 menciones [10][11] | bajo | si |
| S-04 | Mostrar en el README qué pasa cuando algo sale mal (rollback o rechazo de un pedido malo) | CSV lo usa como argumento de confianza | Innovation/Idea (20%) | brecha | CSV: corrida 06 rechazada y `rollback:production`; Plumb: 0 menciones de rollback [10][11] | medio | si |
| S-05 | Subir el conteo de estrellas o topics del repo | Ningún criterio lo pondera | — | — | — | bajo | **cosmetico** |

> Control de sesgo: Plumb salió mejor en 2 de 5 criterios, peor en 1 y empate en 2; no es una victoria completa. Revisé las tres celdas más cómodas (Design, Impact, Presentation de Plumb) y las bajé de las notas del propio mock. El estado del demo de Plumb figura "vivo hasta 2026-11-16" en `PENDING.md`: hoy responde 200 [2], pero hay que bajarlo cuando termine el juzgamiento.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' https://csv-mender-879903213333.europe-west6.run.app/` |
| [2] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' <url>/ , /health , /version.json` (rival) y `https://booking-vic4jyzsha-uc.a.run.app/` (Plumb) |
| [3] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/csv-mender` (embed YouTube `5t91UQiS1yc`) y `curl 'https://www.youtube.com/oembed?url=...'` → 200 |
| [4] | `glab api -i "projects/<id>/pipelines?source=duo_workflow&per_page=1"` (X-Total) y `per_page=100` con filtro `created_at` del lado cliente; `glab api projects/<id>/pipelines --paginate` por estado; `merge_requests?state=all` |
| [5] | `glab api projects/87777631/repository/commits?all=true --paginate` → autores y fechas (`authored_date`/`committed_date`) |
| [6] | `glab api projects/gitlab-ai-hackathon%2Ftranscend-october-2026%2F43461547%2Fshowcase` y `repository/languages` |
| [7] | `glab api "projects/87777631/repository/tree?recursive=true" --paginate` + `repository/files/<ruta>/raw` (flow, `.gitlab-ci.yml`) |
| [8] | `README.md` raw del rival: "1 failed, 449 passed on 259c3a87" (corrida 05) |
| [9] | `curl -s https://csv-mender-879903213333.europe-west6.run.app/ \| wc -c` y texto del HTML |
| [10] | `glab api projects/87777631/repository/files/README.md/raw?ref=HEAD` (secciones "Verify", "Results", "Judges: 5 minutes") |
| [11] | `git ls-files`, `git shortlog -sn`, `grep -c` sobre `README.md`/`docs/submission.md`/`docs/judging.tsv`/`PENDING.md` del repo propio; `glab api projects/87376478/pipelines?source=duo_workflow` |
