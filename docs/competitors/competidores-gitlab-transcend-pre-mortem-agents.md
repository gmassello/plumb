# Competidores — GitLab Transcend "Life After Code" (Path A, Hands-off)

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (Pre-mortem Agents) · clonados 1 (superficial, borrado) · **nada se ejecuto** |
| Ventana | apertura 2026-10-05 → cierre de envios 2026-10-27 13:00 UTC |

## En criollo

- **Que se miro:** Pre-mortem Agents, un rival de la misma categoria (Hands-off, un solo premio de US$5.000), contra Plumb con la misma vara.
- **Quien es la amenaza:** el, y es alta. Cada cambio recibe un "informe de incidente antes de que ocurra", se prueba en vivo en Google Cloud y se promueve o revierte solo. Tiene 79 corridas del agente de GitLab Duo y un benchmark publico de 12 cambios.
- **Como estamos:** con la nota base de Plumb (4.1 sobre 5) el rival da 4.3. Plumb gana en prueba repetida (50 corridas) y demo vivo hoy; el rival gana en alcance (9 etapas, canary, rollback).
- **Que conviene hacer:** reforzar Impacto (el unico criterio donde Plumb no demuestra el arreglo fuera de su app de juguete) y no pelear en amplitud de pipeline.

**Pesos del jurado** (`docs/judging.tsv`; 5 criterios iguales y un pase/falla):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Stage One: usa GitLab Duo Agent Platform | pasa/falla | 2 |
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design | 20% | 4, 6 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7 |
| Presentation | 20% | 1, 8 |
| Bonus Google Cloud | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- Los sitios de GitLab Pages piden login (afecta a todos por igual) y el repo esta archivado: no se vio la pagina como la vio el jurado.
- El demo en Cloud Run responde 503 hoy (2026-11-17, post-cierre) [6]: no se sabe si respondia durante la evaluacion.
- Duracion y contenido del video: existe y es publico [8], pero no se miro cuadro por cuadro (`sin evidencia`).
- Los flows se crearon por la interfaz (no hay `.gitlab/duo/` con flows, solo `mcp.json`): no se pudo ver si estan publicados en el catalogo de AI.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Technological Implementation | Design | Potential Impact | Innovation | Presentation | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `Pre-mortem Agents` | Prevenir incidentes antes de mergear | fuerte (4.5) | fuerte (4.5) | cumple (4) | fuerte (4.5) | cumple (4) | 4.3 | alta |
| `Plumb` (propio, nota base) | Arreglar tests intermitentes y probarlo | cumple (4) | cumple (4) | cumple (4) | fuerte (4.5) | cumple (4) | 4.1 | — |

Bonus Google Cloud: rival **+0.2** provisorio (codigo de deploy y 12 MRs mergeados por pipeline [2][5]; demo caido hoy [6]). Plumb **+0.2** (demo 200 en 0.30 s [6]).
**Amenaza** es contra Plumb: mismo premio unico y misma categoria, por eso alta.

---

## `Pre-mortem Agents` — Jeroen Zwiers y Ronald Zwiers

<!-- ficha -->

**Que hace:** en cada merge request, un agente predice 1 a 4 incidentes, los convierte en chequeos automaticos, los prueba contra una copia viva en Google Cloud y deja pasar o revierte sin humano.

| | |
|---|---|
| Repo | gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43276502/showcase · creado 2026-10-12 · Python · MIT · archivado |
| Demo | https://demo-shop-121855340759.europe-west4.run.app · `curl` 503 en 0.60 s (2026-11-17) [6] |
| Devpost | devpost.com/software/pre-mortem-agents · video si (YouTube, publico) [8] |
| Equipo | 2 en el repo · reparto 32 / 16 / 5 / 2 / 1 / 1 entre personas y cuentas del flow [4] |
| Historial | primer commit 2026-10-12 · 94 commits · previos a la apertura: no [4] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (Duo) | cumple | 79 pipelines `duo_workflow`, todos en exito; 3 cuentas del flow con commits (Pre-mortem 16+18, Incident report 7); 18 ramas `eval/` [1][4] |
| Technological Implementation 20% | fuerte | 11 etapas de CI, canary 0%→10%→100% con rollback, identidad federada (sin llaves), 61 tests, 4.789 lineas sin vendorizados [2][3][7] |
| Design 20% | fuerte | Ciclo completo MR → prueba en vivo → merge → canary → promocion/rollback, con perilla de autonomia (`AUTONOMY`) [2] |
| Potential Impact 20% | cumple | Problema real (confianza para dejar que agentes desplieguen), pero se prueba solo en una tienda de juguete de 1 app [9] |
| Innovation 20% | fuerte | Cada prediccion queda como guardia permanente y un tablero de aciertos realimenta al agente [2][9] |
| Presentation 20% | cumple | Ficha larga y honesta (cuenta el bug del propio rollback); video existe, duracion `sin evidencia` [8] |
| Google Cloud (+0.2) | cumple | `deploy/*.sh`, `cloudbuild.yaml`, Cloud Run, Monitoring; demo 503 hoy [2][6] |
| Calidad de codigo | cumple | 14 archivos de test, 61 funciones de test, 186 lineas de assert o test [3] |
| Seguridad | fuerte | SAST, deteccion de secretos y auditoria de dependencias en el pipeline; ningun `.env` ni `.pem` en el repo; sin llaves (WIF) [2][3] |

**Lo mas fuerte:** benchmark publico con respuestas ocultas: 12 de 12 regresiones atrapadas, 0 omitidas [9].
**Donde se cae:** 2 de 6 cambios inocuos bloqueados por error; 37 de 100 pipelines recientes en rojo (no se desglosó cuantos son bloqueos buscados del benchmark) [9][1]. El rollback propio tuvo un bug que dejo produccion lenta unos 30 min [8].
**Sin evidencia:** si el demo vivo estaba arriba durante la evaluacion; el contenido del video; si los flows estan publicos en el catalogo de AI.

El merge es de pipeline y no humano: en !5 el job `release:auto-merge` termino 18:24:53 y el merge fue 18:24:57 [5].

---

## Donde queda tu proyecto

| Criterio | Plumb | `Pre-mortem Agents` |
|---|---|---|
| Corridas del flow en Duo | 43 pipelines `duo_workflow` [1] | 79 [1] |
| MRs | 17 (12 mergeados por `merge-gate`) [1] | 30 (12 mergeados, 18 cerrados en benchmark) [1] |
| Tests | 54 en `tests/unit` + 5 e2e, 147 asserts [3] | 61 funciones de test, 14 archivos [3] |
| Prueba de que el arreglo vale | 50 corridas por arreglo [10] | 12 cambios de benchmark, 12/12 atrapados [9] |
| Proyectos donde corrio | 2 (app propia + epic-stack) [10] | 1 (tienda demo) [9] |
| Commits | 147 | 94 [4] |
| Endpoint desplegado hoy | 200 en 0.30 s [6] | 503 en 0.60 s [6] |
| Video | si, 2:23 con avatar de IA declarado [10] | si, duracion `sin evidencia` [8] |

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Mostrar en la ficha y el video un resultado cuantitativo sobre cambios no vistos (no solo la app de juguete): casos con arreglo que si pasa 50/50 en epic-stack | El rival publica 12/12 y 0 omitidas; Plumb en epic-stack tiene 0 arreglos que aguanten (27/50 y 30/50) | Potential Impact (20%) | brecha | rival: benchmark 12 casos [9]; Plumb: ambos arreglos rechazados [10] | alto | si |
| S-02 | Citar en el video la cifra de 43 corridas del flow sobre el pipeline real, junto a la de 50 corridas por arreglo | El rival muestra 79 corridas del flow; el jurado compara actividad real de Duo | Technological Implementation (20%) | brecha | 43 vs 79 [1] | bajo | si |
| S-03 | Estrellas, topics y tamaño del README | No los pondera el jurado (ver `docs/judging.tsv`) | — | — | — | bajo | **cosmetico** |

> Control de sesgo: Plumb no sale mejor en todo. Pierde en alcance del pipeline (11 etapas del rival) y en corridas de Duo (43 vs 79); gana en demo vivo hoy y en prueba repetida. Las tres celdas mas comodas se revisaron: Tests (54 + 147 asserts de Plumb, no comparables 1 a 1 con 61 funciones), demo (503 del rival es post-cierre) y Presentation (avatar de IA de Plumb contra video sin ver del rival). La nota base de Plumb no se movio.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api -i "projects/<id>/pipelines?source=duo_workflow&per_page=1" \| grep -i x-total` (rival 87534628: 79; Plumb 43); idem `merge_requests?state=all` (30; 17) y estados de `pipelines?per_page=100` |
| [2] | `glab api "projects/87534628/repository/files/<README.md\|.gitlab-ci.yml\|DEVPOST.md>/raw?ref=HEAD"` y `repository/tree?recursive=true` |
| [3] | clone `--depth 50 --no-tags`, borrado: `git ls-files \| grep -vE 'node_modules/\|dist/' \| xargs wc -l`; `grep -rcE 'def test_' tests`; `git ls-files \| grep -iE '\.env$\|\.pem$'` |
| [4] | `glab api "projects/87534628/repository/commits?all=true&per_page=100"` (autor y fecha) y `repository/contributors` |
| [5] | `glab api "projects/87534628/merge_requests/5/pipelines"` y `pipelines/<id>/jobs`: `release:auto-merge` `finished_at` 18:24:53 contra `merged_at` 18:24:57 |
| [6] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' <url>` (rival 503 en `/`, `/docs`, `/health`, `/products`; Plumb 200) |
| [7] | `glab api "projects/87534628/repository/files/flows%2Fpremortem.yml/raw?ref=HEAD"`, `premortem-eval.yml`, `incident-report.yml` |
| [8] | `curl -sL -A 'Mozilla/5.0' https://devpost.com/software/pre-mortem-agents` y `youtube.com/oembed?url=...lth_JEukuIQ` (200, titulo y autor) |
| [9] | `docs/benchmark.md` del repo del rival, via `repository/files/.../raw` (1.043 palabras) |
| [10] | `docs/JUDGING-MOCK.md`, `docs/submission.md` y `README.md` del repo propio |
