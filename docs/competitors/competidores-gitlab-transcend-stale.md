# Competidores — GitLab Transcend "Life After Code": Stale (ganador de Most Stages Covered, Path A)

| | |
|---|---|
| Fecha | 2026-11-18 |
| Modo | hackathon (post-mortem: el concurso cerró) |
| Evaluados | 1 (+ Plumb como control) · clonados 1 (espejo de GitHub) · **nada se ejecutó** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC |

## En criollo

- **Qué se miró:** cómo Stale cubrió las 9 etapas del ciclo de vida y cuáles tocaba Plumb. Stale ganó "Most Stages Covered"; Plumb no ganó nada.
- **Quién es la amenaza:** era alta. Stale no listó las 9 etapas: las convirtió en las etapas reales de su pipeline (`stages:` con las 9 en orden) y cada una tiene jobs [1]. Además publica con canario (0%, 50%, 100%) y vuelta atrás automática [2].
- **Cómo estábamos:** Plumb afirma las 9 etapas en la ficha, pero tres (package, release, configure) son declaraciones sin un job propio [3]. Stale las demuestra con jobs.
- **Qué conviene hacer:** en el próximo concurso con premio por etapas, un job por etapa con nombre de etapa, y contar solo lo que se mide.

**Pesos del jurado** (`docs/judging.tsv`, 5 criterios iguales; más bono Google Cloud):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design (flujo completo) | 20% | 4, 6, 9 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7, 4 |
| Presentation | 20% | 1, 8 |
| Google Cloud (bono) | +0,2 | 2, 9 |

**Lo que no se pudo ver:**

- El video de Stale (YouTube `WxutrE5xljE`): existe, no se miró el contenido [4].
- Los sitios `*.gitlab.io` piden login: afecta a Stale y a Plumb por igual.
- Los logs de los jobs de GitLab: se midieron pipelines y MRs por conteo, no cada resultado.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miró y no está) · `sin evidencia` (no se pudo ver). Nota 1–5 por criterio, estimada con la evidencia de abajo (no es la del jurado).

| Proyecto | Nicho | Tecnología 20% | Diseño 20% | Impacto 20% | Innovación 20% | Presentación 20% | Etapas | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---:|---|
| `DevAshutoshhh/stale` | Re-verificar "seguro para publicar" cuando cambia el mundo | fuerte (5) | fuerte (5) | cumple (4) | fuerte (5) | cumple (4) | 9/9 medidas | 4,6/5 | alta |
| `Plumb` (propio) | Triage de tests inestables | cumple (4) | cumple (4) | cumple (3) | flojo (3) | cumple (4) | 6/9 medidas | 3,6/5 | — |

**Amenaza** es contra la entrada propia: Stale compite en otro nicho, pero en el mismo premio.

---

## `DevAshutoshhh/stale` — Stale

<!-- ficha -->

**Qué hace:** cada veredicto "seguro para publicar" es un dato con vencimiento. Cuando cambia algo afuera del repo (un CA distrusted, un release de Node, una tabla que creció), abre un issue, un agente de Duo escribe el arreglo, el pipeline lo prueba y lo publica por canario.

| | |
|---|---|
| Repo | espejo https://github.com/DevAshutoshhh/stale (creado 2026-10-27, un solo commit) · GitLab proyecto `88034991` (archivado) · Python + Node · MIT [5] |
| Demo | Cloud Run `/status`: `curl` 200 en 2.5 s, vivo 22 días después del cierre [6] |
| Devpost | `stale` · video sí (YouTube) · "Winner" y "Most Stages Covered" en la ficha [4] |
| Equipo | GitLab: 87 commits · 43 `DevAshutoshhh`, 19 `Abhinav`, 24 del bot `stale-remediator`, 1 plantilla [7] · dueño GitLab `@ZAPcodes2` |
| Historial | Initial commit 2026-10-24 · repo posterior a la apertura (2026-10-05) · previos: no [5][7] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Tecnología 20% | fuerte | 168 tests (la ficha dice 196), 20.026 líneas sin lockfiles/claves, 17 jobs, 2 flows Duo [8] |
| Diseño 20% | fuerte | cadena entera sin humano: schedule → issue → flow → MR → auto-merge → canario → mint; 12 MRs mergeados, 16 pipelines `duo_workflow` [9] |
| Impacto 20% | cumple | 4 incidentes reales citados (CrowdStrike, Railway, axios, eMudhra); la demo simula la raíz distrusted y el crecimiento de la tabla, y la ficha lo declara [10] |
| Innovación 20% | fuerte | el CI solo corre cuando cambia el código; Stale hace que cambie el mundo sea el disparador. Claims en YAML con reglas, rutas permitidas y re-prueba [10] |
| Presentación 20% | cumple | video + 14 capturas en la ficha, README con tabla de resultados al inicio; contenido del video sin ver [4] |
| Google Cloud (+0,2) | fuerte | Cloud Run, Cloud SQL, Artifact Registry, Cloud Monitoring, Secret Manager; WIF sin clave de servicio [10] |
| Calidad de código | cumple | tests contra Postgres real y TLS real; sin lint de CI visible [8] |
| Seguridad | cumple | SAST, secret detection, container scanning + `verify-mr` (rutas, autoría); claves de demo declaradas demo-only en `app/partner-sim/certs/` (2 `.key`) [11] |

**Lo más fuerte:** las 9 etapas son las `stages:` del pipeline y cada una tiene jobs reales [1], más canario con rollback [2].
**Donde se cae:** el espejo de GitHub tiene un solo commit (la historia vive en GitLab), y la ficha dice 196 tests contra 168 contados [8].
**Sin evidencia:** contenido del video; resultado de cada job; si el `stale-canary-analyst` corrió (es opcional y figura en "What's next").

### Cómo cubrió las 9 etapas (la respuesta de la pregunta)

| Etapa | Qué hizo Stale (jobs reales, README § "DevSecOps stages covered") | Por qué cuenta como creativo |
|---|---|---|
| Plan | `collect-serving`, `check`: abre el issue con tabla de evidencia | el issue lo abre un control de evidencia externa, no una persona |
| Create | `dispatch` asigna el flow `stale-remediator`; el flow abre el MR | el trigger Assign: asignar un issue a la cuenta de servicio arranca al agente |
| Verify | `engine-tests` (pytest + Postgres 18), `app-tests` (TLS real) | prueba contra servicios reales |
| Package | `build-candidate` (Kaniko), `inspect-candidate`, `publish-ar` | `inspect-candidate` corre las reglas dentro de la imagen construida |
| Secure | `semgrep-sast`, `secret_detection`, `container_scanning`, `security-gate`, `reprove` | re-prueba la regla sobre el candidato; migración en sombra con 600.000 filas bajo escritura |
| Configure | `record-stable`, WIF, tags de revisión de Cloud Run | configuración como parte del release |
| Release | `plan-release` (pasa / posterga / bloquea), `release` hijo, `migrate`, `deploy-canary` | el gate posterga el primer fix si el otro sigue en vuelo |
| Monitor | `canary-reprove`, `canary-ring` (k6 + 5xx por revisión), `rollback` | el canario prueba que el socio distrusted recibe 502 |
| Govern | `verify-mr` + auto-merge, `promote`, `mint`, cuarentena | un MR hecho a mano que toca `.stale/` es rechazado |

---

## Donde queda tu proyecto

| Medición | Plumb | `stale` |
|---|---|---|
| Etapas con job propio (de 9) | 6: plan, create, verify, secure, monitor, govern [3] | 9 [1] |
| Package | flojo: `gcloud run deploy --source`, sin job de imagen [3] | `build-candidate` + `publish-ar` [1] |
| Release | flojo: `merge-gate` es una compuerta de merge, no un release [3] | canario 0 → 50 → 100% y rollback [2] |
| Secure | SAST + secret detection (2 plantillas) [3] | 3 escáneres + re-prueba + shadow migration [1] |
| Configure | flojo: "el CI y el flow son YAML" [3] | `record-stable`, tags de revisión [1] |
| Tests (funciones) | 59 [12] | 168 [8] |
| Pipelines `duo_workflow` | 43 [9] | 16 [9] |
| MRs mergeados | 12 [9] | 12 [9] |
| Commits | 50 | 87 |
| Endpoint desplegado | 200 en 0.97 s [6] | 200 en 2.5 s [6] |

Plumb gana en corridas del flow (43 contra 16) y en el rigor del control negativo (el MR !9 no se mergeó porque pasó 33 de 50 corridas). Eso no mueve "Most Stages Covered", que premia cantidad de etapas con creatividad.

### Sugerencias

Para el próximo concurso con premio por etapas (no se puede mover nada de este). Las celdas marcadas ya existen en Plumb: la mejora es contarlo.

| # | Sugerencia | Por qué importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Poner las 9 etapas como `stages:` del pipeline y un job por etapa | el jurado ve la cobertura en el YAML sin leer la ficha | Tecnología (20%) + premio Stages | brecha | Stale lo hace, el `.gitlab-ci.yml` de Plumb usa `deploy`/`verify` [1][3] | medio | sí |
| S-02 | Un job de package real (imagen construida y publicada) en vez de "Cloud Run la construye" | hoy la etapa es una frase | Tecnología (20%) | brecha | `build-candidate` + `publish-ar` en Stale [1] | medio | sí |
| S-03 | Un release gradual con rollback (por ejemplo, `--no-traffic`, 50%, 100%) sobre Cloud Run | convierte `merge-gate` en un release de verdad | Diseño (20%) | brecha | `deploy-canary` + `rollback` [2] | alto | sí |
| S-04 | Sumar `Container-Scanning` a las plantillas | Plumb usa 2 de las 3 plantillas de seguridad | Tecnología (20%) | brecha | Stale las usa las 3 [1][3] | bajo | sí |
| S-05 | Contar lo que ya existe: 43 corridas del flow y el MR !9 no mergeado (33/50) como evidencia de la etapa Govern | Stale mostró una tabla "Real vs simulated"; Plumb ya tiene el dato (`docs/RESULTS.md`) | Presentación (20%) | brecha | tabla "Results at a glance" en el README de Stale [10] | bajo | sí |
| S-06 | Estrellas, topics y README corto | ningún criterio de `docs/judging.tsv` los pondera | — | — | Stale tiene 0 estrellas y ganó [5] | bajo | **cosmético** |

> Control de sesgo: Plumb se midió con las mismas sondas (tests, jobs por etapa, plantillas, `curl`) y salió peor en 4 de 5 criterios y en etapas. Las celdas más cómodas para Plumb (Impacto, Presentación) se rebajaron o se dejaron iguales por no poder ver el video de Stale.

---

## Apéndice — como se midió

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `grep -nE '^stages:' .gitlab-ci.yml` y README § "DevSecOps stages covered" en el clone de `DevAshutoshhh/stale`; templates: `grep -hE 'template:' .gitlab-ci.yml ci/*.yml` |
| [2] | README § "Claim lifecycle" y `ci/release.yml`; MRs/rollback: `glab api "projects/88034991/merge_requests?state=merged&per_page=20"` |
| [3] | `grep -nE 'stage:\|template:' .gitlab-ci.yml ci/plumb.gitlab-ci.yml` y `docs/submission.md:36` en el repo propio |
| [4] | `curl -s -A "Mozilla/5.0" https://devpost.com/software/stale` (200 en 0.77 s; busca `youtu`, `Winner`, `Most Stages Covered`) |
| [5] | `jq '{fork,created:.created_at,license:.license.spdx_id,archived}' stale.json` y `gh api "repos/DevAshutoshhh/stale/commits?until=2026-10-05T00:00:00Z&per_page=1" --jq length` (0) |
| [6] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' <url>` sobre `/status` (Stale) y `/health` (Plumb) |
| [7] | `glab api "projects/88034991/repository/commits?per_page=100&all=true"` + `jq -r '.[].author_name' \| sort \| uniq -c`; `git shortlog -sn` en el clone (1 commit) |
| [8] | `grep -rEc '^\s*(def test_\|test\()' engine/tests app/ledger-api/test` (168); `git ls-files \| grep -vE 'package-lock\|\.pem$\|\.key$' \| xargs wc -l` (20.026) |
| [9] | `glab api "projects/<id>/pipelines?source=duo_workflow&per_page=1" -i \| grep -i x-total` (Stale 16, Plumb 43) y `merge_requests?state=merged` (12 y 12) |
| [10] | README y ficha de Devpost de Stale: secciones "Why", "Results at a glance", "How we built it", "Real vs simulated" |
| [11] | `grep -rnoE` de patrones de claves sobre el clone: 2 archivos `.key` en `app/partner-sim/certs/` (descritos como demo-only); no se transcribió ningún valor |
| [12] | `grep -rEc '^\s*(test\|it)\(' tests` en el repo propio (59) |
