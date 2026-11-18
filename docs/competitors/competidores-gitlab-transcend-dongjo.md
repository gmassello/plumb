# Competidores — GitLab Transcend "Life After Code"

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (Dongjo) + Plumb (propio) · clonados 1 (borrado) · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC (ya cerrada: lo medido es lo que vio el jurado) |

## En criollo

- **Que se miro:** el repo de Dongjo en GitLab, su ficha de Devpost, su demo en vivo y la evidencia de que su flow de Duo corrio de verdad (40 corridas propias de Duo, 60 commits de la cuenta de servicio del flow [1][2]).
- **Quien es la amenaza:** Dongjo, alta. Cubre todo el ciclo (issue → plan → codigo → ataque → firma → canary → release) con pruebas enlazadas, mientras Plumb cubre un tramo (pipeline rojo → arreglo → merge).
- **Como estamos:** Plumb queda un escalon abajo en Tecnologia, Diseno e Innovacion; empatamos en Impacto y Presentacion y en el bonus de Google Cloud.
- **Que conviene hacer:** el concurso cerro el 2026-10-27; lo accionable es lo que todavia se puede tocar en la ficha y en la pagina (ver sugerencias), no codigo nuevo.

**Pesos del jurado** (`docs/judging.tsv`; los cinco criterios valen lo mismo):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Stage One: usa GitLab Duo Agent Platform | pasa/no pasa | 2 |
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design | 20% | 4, 6 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7 |
| Presentation | 20% | 1, 8 |
| Bonus Google Cloud | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- La Dongjo Console (`showcase-bf2b4b.gitlab.io`) responde 302 a un login de GitLab Pages [3]: no se vio lo que ve el jurado ahi. La pagina de Plumb da el mismo 302 [3]: ninguna de las dos se midio desde afuera.
- El contenido del video (YouTube responde 200 [4]): no se miro, solo que existe y dura 2:53 segun el README.
- Los 100 commits que devolvio la API son una muestra: el paginado repitio paginas, el total real de commits es `sin evidencia`.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Tecnologia 20% | Diseno 20% | Impacto 20% | Innovacion 20% | Presentacion 20% | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `Dongjo` | issue → release firmado, red team | fuerte | fuerte | cumple | fuerte | cumple | 4.6/5 | alta |
| `Plumb` (propio) | pipeline rojo → arreglo probado | cumple | cumple | cumple | cumple | cumple | 4.0/5 | — |

**Amenaza** es contra Plumb: Dongjo compite por el mismo premio unico (Path A, Hands-off) y su cobertura es mas ancha.

---

## `Dongjo` — Faiz Muflich (faizmuh26)

<!-- ficha -->

**Que hace:** asignas un issue y vuelve un cambio planeado, construido, atacado, arreglado, firmado, desplegado en canary (prueba con poco trafico) y publicado con evidencia.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43486598/showcase · creado 2026-10-19 · Python · MIT [5] |
| Demo | https://dongjo-823854619520.europe-north1.run.app/ · `curl` 200 en 4.18 s (arranque en frio); `/version` 200 en 0.62 s [3] |
| Devpost | `dongjo` · video si (YouTube, 2:53) [4] |
| Equipo | 1 persona (2 cuentas: `faizmuh26`, `Faiz Muflich`) + 1 commit de otra · 26 de 100 commits leidos son de la cuenta de servicio del flow [2] |
| Historial | primer commit 2026-10-19 ("Initial commit" de la plantilla), 0 commits antes del 2026-10-18 · previos al evento: no [6] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (Duo) | fuerte | 2 flows en `flows/` (377 lineas el principal), 40 pipelines `duo_workflow`, 26 de 100 commits leidos de cuenta de servicio, 60 en el total listado [1][2][7] |
| Tecnologia 20% | fuerte | 113 tests, 351 asserts, 4.777 lineas Python [8]; Terraform con 15 recursos GCP y Workload Identity (sin llave guardada) [9]; SBOM, OpenVEX, cosign en tags de Devpost [10] |
| Diseno 20% | fuerte | 9 etapas con un mapa en el issue; 3 corridas sin mano humana en 23, 21 y 26 min segun README [11]; 12 MRs `fix/` mergeados |
| Impacto 20% | cumple | cambios de seguridad en un servicio chico (notes-api); 2 pipelines rojos en main, ambos explicados y arreglados en !46 [11][12] |
| Innovacion 20% | fuerte | benchmark sellado con SHA-256: 3 corridas, el red team atrapa 13 de 16 errores plantados y publica sus falsos positivos [11] |
| Presentacion 20% | cumple | video 2:53 + pagina "probalo vos" con 6 ataques como botones; demo en frio 4.18 s, consola detras de login [3][4] |
| Bonus Google Cloud | fuerte | Cloud Run vivo 200, 15 recursos Terraform, scripts `ci/*.sh` en el repo [3][9] |
| Calidad de codigo | fuerte | ruff 0.16.7 y pytest 9.1.1 pineados, deps de la app con `==` [8] |
| Seguridad | cumple | sin `.env`/`.pem`/credenciales en el arbol [13]; `gate-guard` impide que el agente toque sus propias puertas [11] |

**Lo mas fuerte:** prueba medida, no declarada: 13 de 16 errores atrapados con gates verdes y falsos positivos publicados [11].
**Donde se cae:** el servicio sobre el que trabaja es una app de notas de juguete; la pagina de la consola exige login [3].
**Sin evidencia:** si el video muestra el flujo real; commits totales; lo que ve el jurado en la consola.

---

## Donde queda tu proyecto

| Criterio | Plumb | `Dongjo` |
|---|---|---|
| Pipelines (total / `duo_workflow`) | 239 / 43 [2] | 397 / 40 [2] |
| MRs mergeados (de ellos `fix/`) | 12 (11) [14] | 47 (12) [14] |
| Tests / asserts | 54 tests, 151 lineas con assert/expect [8] | 113 tests, 351 asserts [8] |
| Infra como codigo (Terraform) | ausente [9] | 15 recursos [9] |
| Flows publicados | 1 (`triage-flow.yml`, 124 lineas) | 2 (377 lineas el principal) [7] |
| Demo vivo | Cloud Run 200 en 0.31 s [3] | Cloud Run 200 en 4.18 s [3] |
| Video | 2:23 | 2:53 |
| Pagina del proyecto | 302 a login [3] | 302 a login [3] |
| Cobertura del ciclo | 1 tramo (rojo → arreglo → deploy) | 9 etapas (issue → release) |

### Notas 1-5 por criterio (misma vara para los dos)

| Criterio | Dongjo | Plumb | Evidencia |
|---|---:|---:|---|
| Technological Implementation | 5 | 4 | Dongjo: 351 asserts, Terraform, WIF, firma y VEX [8][9][10]. Plumb: 54 tests, WIF, sin IaC, app con estado en memoria [8][9] |
| Design | 5 | 4 | Dongjo: 9 etapas de issue a release [11]. Plumb: un tramo, sin planificacion previa del issue |
| Potential Impact | 4 | 4 | Dongjo: app de juguete pero ciclo general [11]. Plumb: segundo proyecto (epic-stack) donde las 2 correcciones no sostuvieron (27/50, 30/50) segun `docs/JUDGING-MOCK.md` |
| Innovation/Idea | 5 | 4 | Dongjo: benchmark sellado con falsos positivos medidos [11]. Plumb: probar el arreglo 50 veces es fuerte, pero "CI decide, Duo arregla" es la misma tesis que Dongjo ("CI computes, LLM decides") |
| Presentation | 4 | 4 | ambos con video publico y demo vivo; Dongjo tiene la pagina interactiva, Plumb una pagina bilingue; las dos consolas dan 302 [3][4] |
| Promedio | 4.6 | 4.0 | |
| Bonus Google Cloud (+0.2) | +0.2 | +0.2 | los dos con Cloud Run vivo y codigo de deploy en el repo [3][9] |

Las notas de Plumb son mas bajas que las de `docs/JUDGING-MOCK.md` (4.6): esa pasada la escribio el propio equipo; aca se aplico la misma vara que a Dongjo.

### Sugerencias

El concurso cerro el 2026-10-27: cualquier cambio de codigo ya no entra en juicio. Las que siguen son para ficha, pagina y el siguiente evento.

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Publicar una medicion de falsos positivos y aciertos del flow (por ejemplo, N arreglos plantados) | Dongjo vende lo que mide de si mismo y Plumb solo lo que acierta | Innovacion (20%) | brecha | Dongjo publica 13/16 atrapados y sus falsos positivos [11]; Plumb no tiene serie equivalente | alto | si |
| S-02 | Cubrir el tramo previo al codigo (plan o criterios de aceptacion antes del fix) | el jurado de Diseno premia el ciclo, no un tramo | Diseno (20%) | brecha | Dongjo: 9 etapas desde el issue [11] | alto | si |
| S-03 | Poner infra como codigo para Cloud Run (Terraform) | el bonus pide codigo de deploy y Tecnologia mide reproducibilidad | Tecnologia (20%) | brecha | Dongjo: 15 recursos Terraform [9]; Plumb: ninguno | medio | si |
| S-04 | Verificar que la pagina de Plumb se abra sin login para el jurado | las dos paginas dan 302; si la de Plumb queda abierta es ventaja | Presentacion (20%) | hueco | ambas `302` a `projects.gitlab.io/auth` [3] | bajo | si |
| S-05 | Subir a 100+ tests unitarios sobre la logica de los flows | 351 asserts de Dongjo contra 151 | Tecnologia (20%) | brecha | [8] | medio | si |
| S-06 | Mejorar topics, estrellas del repo | ningun criterio lo pondera | — | — | — | bajo | **cosmetico** |

> Control de sesgo: Plumb se midio con las mismas sondas y salio peor en 4 de 5 criterios; no es la firma del sesgo propio. Las tres celdas mas comodas (Impacto, Presentacion, Bonus) se revisaron y quedaron empatadas.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api -i "projects/87802146/pipelines?source=duo_workflow&per_page=1" \| grep -i x-total:` (40; Plumb, proyecto 87376478: 43) |
| [2] | `glab api "projects/87802146/repository/commits?per_page=100&all=true" \| jq -r '.[].author_name'` (cuenta de servicio `Dongjo red team`) |
| [3] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' <url>` sobre run.app, `/version`, y las dos paginas gitlab.io |
| [4] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/dongjo` (video YouTube y tags) y `curl` al link de YouTube (200) |
| [5] | `glab api projects/gitlab-ai-hackathon%2Ftranscend-october-2026%2F43486598%2Fshowcase` (`created_at`) y `head -5 LICENSE` en el clone |
| [6] | `glab api "projects/87802146/repository/commits?per_page=1&all=true&until=2026-10-18T00:00:00Z"` (null) |
| [7] | `glab api "projects/87802146/repository/files/flows%2Fdongjo.yaml/raw?ref=HEAD" \| wc -l` |
| [8] | clone `--depth 50`: `grep -rhE '^\s*def test_' tests \| wc -l`; `grep -rcE 'assert ' tests`; `git ls-files \| grep -E '\.py$' \| xargs wc -l` (clone borrado); en Plumb `grep -rhE '^\s*(test\|it)\(' tests/unit \| wc -l` |
| [9] | `glab api "projects/87802146/repository/files/infra%2Fterraform%2Fmain.tf/raw?ref=HEAD" \| grep -c 'resource "'` |
| [10] | tags `cosign`, `cyclonedx`, `openvex` en la ficha de Devpost; `grep` de `sbom`/`vex` en `.gitlab-ci.yml` |
| [11] | `grep` de las cifras del README crudo (`repository/files/README.md/raw`) |
| [12] | `glab api "projects/87802146/pipelines?per_page=100" \| jq -r '.[].status' \| sort \| uniq -c` (2 failed, 98 success) |
| [13] | `grep -iE '\.env$\|\.pem$\|credentials\|serviceaccount' <arbol>` (sin resultados) |
| [14] | `glab api -i "projects/<id>/merge_requests?state=merged&per_page=1" \| grep -i x-total:` y ramas de origen por prefijo |
