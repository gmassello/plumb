# Competidores — GitLab Transcend "Life After Code"

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (+ Plumb, el proyecto propio) · clonados 0 · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC (ya cerrada) |

## En criollo

- **Que se miro:** Tamper Gate, el rival mas cercano a Plumb, por la API publica de GitLab y su ficha de Devpost. Sin clonar nada.
- **Quien es la amenaza:** Tamper Gate, alta. Vigila lo opuesto a Plumb: que un agente no "arregle" un pipeline debilitando las pruebas. Mide su acierto con 175 casos y lo publica.
- **Como estamos:** Plumb gana en flujo completo (del pipeline rojo al deploy) y en el bonus de Google Cloud. Tamper Gate empata en casi todo lo demas y es mas riguroso al medir.
- **Que conviene hacer:** si las reglas aun dejan tocar la ficha, nombrar a Tamper Gate de frente y cerrar el hueco de Plumb: nada en el codigo impide que su arreglo debilite una prueba.

**Pesos del jurado** (`docs/judging.tsv`): los cinco criterios valen 20% cada uno; Stage One es pasa/no pasa; Google Cloud suma +0.2.

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 4, 5, 6, 10 |
| Design | 20% | 1, 4 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7, 4 |
| Presentation | 20% | 1, 8 |
| Stage One (usa Duo) | pasa/no | 2 |
| Bonus Google Cloud | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- Hoy es 2026-11-17, con el concurso cerrado: no se sabe si se puede editar algo en la etapa de jurado.
- Los dos videos no se vieron (solo titulo y duracion declarada); lo que muestran es `sin evidencia`.
- Si los tests de Tamper Gate pasan y cuantos asserts tienen: no se clono ni se ejecuto [9].
- La pagina de Plumb y el dashboard de Tamper Gate piden sesion de GitLab para un anonimo [8]: no se sabe que ve un jurado con cuenta.
- Si hay otros rivales con la misma idea: no se barrio el evento, solo este repo.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Technological | Design | Impact | Innovation | Presentation | Stage One | Google Cloud | Nota | Amenaza |
|---|---|---|---|---|---|---|---|---|---:|---|
| `43143384/tamper-gate` | guardia de MRs de agentes | fuerte | cumple | cumple | fuerte | cumple | cumple | ausente | 4.4/5 | alta |
| Plumb (propio) | arreglar el main rojo | fuerte | fuerte | cumple | fuerte | cumple | fuerte | fuerte | 4.6/5 +0.2 | — |

**Amenaza** es contra *tu* entrada: Tamper Gate comparte la categoria (Path A, Hands-off), la idea de que "verde debe significar algo" y el mismo premio unico.

---

## `43143384/tamper-gate` — Tamper Gate

<!-- ficha -->

**Que hace:** revisa cada cambio que un agente propone y lo frena si hace mas facil pasar las pruebas en vez de arreglar el codigo (tests borrados, saltados, valores esperados editados, umbrales bajados, escaneos de seguridad apagados).

| | |
|---|---|
| Repo | gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43143384/tamper-gate · creado 2026-10-08 · Python (solo PyYAML) · MIT [1] |
| Demo | no hay sitio vivo; video de 2:40 en YouTube; dashboard en Pages solo para miembros [8] |
| Devpost | `tamper-gate` · video si [2] |
| Equipo | 1 persona (93 de 98 commits; los otros 5 los titula el flow) [3] |
| Historial | commit mas antiguo 2026-10-07 · 98 commits · 0 antes de la apertura [3] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (Duo) | cumple | 3 flows propios en `flows/`; 6 pipelines `duo_workflow`, todos el 2026-10-08 [4]; 5 commits titulados por el flow [3] |
| Technological 20% | fuerte | 26 reglas, compara tests con `ast`; 100 de 100 pipelines de `main` en verde [5]; 14 archivos de test, 3 corpus [6] |
| Design 20% | cumple | issue → rama `duo/` → MR → gate → merge, pero los flows no pueden mergear: lo hace un job programado cada 15 min con el token de una persona [7] |
| Impact 20% | cumple | problema actual y citado (agentes que tocan tests); es un componente CI reutilizable; solo analiza tests Python con AST [2] |
| Innovation 20% | fuerte | "controlar los controles": corpus ciegos escritos por otros agentes; v2 ciego 59 de 60 tras arreglos, 81,7% antes [6] |
| Presentation 20% | cumple | video 2:40 publico [2]; capturas de MRs reales; contenido del video `sin evidencia` |
| Google Cloud | ausente | 0 menciones de Cloud Run o gcloud en README, CI y ficha [5] |
| Calidad de codigo | cumple | 14 archivos de test y ruff configurado; que pasen, `sin evidencia` [9] |
| Seguridad | cumple | 0 archivos `.env` o claves en el arbol [9]; SAST y Secret Detection en el CI |

**Lo mas fuerte:** mide su propio acierto con 175 casos y publica los fallos: v1 ciego 46,0% antes, 90,0% despues; v2 ciego 98,3% [6].
**Donde se cae:** Duo corrio un solo dia (2026-10-08, 6 pipelines) contra 43 de Plumb entre 2026-10-10 y 2026-10-26 [4]; sin deploy ni nube [5]; el MR !15 sigue abierto con pipeline rojo (es su demo del bloqueo) [7].
**Sin evidencia:** contenido del video, tests que pasen, si "Assign" a un issue cuenta como "hands-off" para el jurado.

---

## Donde queda tu proyecto

Mismas sondas sobre Plumb. Notas 1-5 por criterio, con la evidencia que las sostiene.

| Criterio (20% c/u) | Plumb | Tamper Gate | Evidencia |
|---|---:|---:|---|
| Technological Implementation | 5 | 5 | Plumb: 43 corridas Duo, 170 pipelines en `main`, prueba de 50 corridas, deploy y checks en vivo [4][10]. TG: 26 reglas, 3 corpus, 100/100 verdes [5][6] |
| Design | 5 | 4 | Plumb: rojo → veredicto → fix → prueba → merge → deploy → nota [10]. TG: sin deploy, merge via job programado con token humano [7] |
| Potential Impact | 4 | 4 | Plumb: segundo proyecto (epic-stack) donde ningun arreglo se sostuvo [10]. TG: solo Python, riesgo de agentes que ya es tema [2] |
| Innovation/Idea | 5 | 5 | Plumb: arreglar y probar 50 de 50 en vez de reintentar o aislar [10]. TG: corpus ciegos, controlar los controles [6] |
| Presentation | 4 | 4 | Plumb: video 2:23 con presentador de IA, pagina que pide sesion a un anonimo [8][10]. TG: video 2:40, dashboard solo miembros [2][8] |
| **Promedio** | **4.6** | **4.4** | 23/5 y 22/5 |
| Bonus Google Cloud | +0.2 | 0 | Plumb: Cloud Run responde 200 en 0.30 s, deploy en `.gitlab-ci.yml` [10]. TG: 0 menciones [5] |

| Medicion | Plumb | `tamper-gate` |
|---|---|---|
| Corridas de Duo en el proyecto | 43, de 2026-10-10 a 2026-10-26 [4] | 6, todas 2026-10-08 [4] |
| Casos de evaluacion publicados | 12 de 12 (QA-06, 4 escenarios, no ciego) [10] | 175 casos, dos conjuntos ciegos [6] |
| Tests | 54 unitarios + 5 e2e [10] | 14 archivos, resultado `sin evidencia` [9] |
| Commits / personas | 50 / 1 [10] | 98 / 1 [3] |
| Endpoint desplegado | Cloud Run, 200 en 0.30 s [10] | no hay [5] |
| Control sobre debilitar tests | solo en el texto del prompt [11] | codigo, 26 reglas [6] |

### Sugerencias

El concurso cerro el 2026-10-27: cada una vale solo si las reglas dejan editar en la etapa de jurado.

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Chequear en codigo que un fix de Plumb no baje asserts ni agregue skip antes de mergear | Hoy "no debilitar la prueba" es solo una frase al modelo; un fix debil pasa 50 de 50 | Technological (20%) | brecha | TG lo hace con 26 reglas [6]; en Plumb solo aparece en el prompt del flow [11] | medio | si |
| S-02 | Verificar que un anonimo o un miembro del grupo ve la pagina de Plumb, y avisar en la ficha si no | La pagina redirige a inicio de sesion (403 anonimo) y Presentation pesa 20% | Presentation (20%) | hueco | `curl -L` termina en `users/sign_in` 403 [8] | bajo | si |
| S-03 | Nombrar a Tamper Gate en la ficha: Plumb prueba que el arreglo es real, TG vigila que no sea trampa | Un jurado que vea los dos los junta; conviene que el cruce lo escriba Plumb | Innovation (20%) | brecha | la ficha de Plumb nombra a FlakeHunter y no a TG [11] | bajo | si |
| S-04 | Publicar una evaluacion ciega del veredicto de flaky, no solo QA-06 | TG convierte su rigor en puntos de Innovation y Technological | Technological (20%) | brecha | 175 casos con dos conjuntos ciegos contra 12 de 12 en 4 escenarios [6][10] | alto | si |
| S-05 | Subir estrellas o topics | Ningun criterio los mide | — | — | — | bajo | **cosmetico** |

> Control de sesgo: Plumb no sale mejor en todo. Empata en 3 de 5 criterios, pierde en rigor de evaluacion y su pagina tiene el mismo problema de acceso que el dashboard rival. Se revisaron las tres celdas mas comodas (Tech, Design, Impact): Design se bajo a 4 para TG por evidencia, no por simpatia. El mock propio daba 5 a Design y Tech; aqui Plumb queda 4.6 con la vara aplicada a ambos.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api projects/<id>` (creado, licencia nula) y `glab api projects/<id>/repository/files/LICENSE/raw?ref=main` (texto MIT) |
| [2] | `curl -A <navegador> https://devpost.com/software/tamper-gate` y `curl 'https://www.youtube.com/oembed?url=https://youtu.be/MuFV0CgFGCc&format=json'` |
| [3] | `glab api "projects/<id>/repository/commits?per_page=100&all=true"` y `glab api projects/<id>/repository/contributors`; `commits?until=2026-10-05` devuelve 0 |
| [4] | `glab api -i "projects/<id>/pipelines?source=duo_workflow&per_page=100"` (X-Total, `created_at` en cliente); Plumb 43, TG 6 |
| [5] | `glab api "projects/<id>/pipelines?ref=main&per_page=100"` y `grep -ciE 'cloud run\|gcloud'` sobre `.gitlab-ci.yml`, README y ficha |
| [6] | `glab api .../repository/files/eval%2Fresults.md/raw` y `heldout-v2-after.md`; README secciones corpus (65, 50, 60 casos) |
| [7] | `glab api projects/<id>/merge_requests?state=all` y `merge_requests/15`; `docs/duo.md` secciones Merge control y Tested on GitLab.com |
| [8] | `curl -sL -o /dev/null -w '%{http_code} %{url_effective}' https://showcase-8b103c.gitlab.io/` (403, `users/sign_in`); README de TG lineas 318-323 |
| [9] | `glab api .../repository/tree?recursive=true` filtrado a blobs: `grep -ciE '\.env$\|credentials\|\.pem$'` = 0, `grep -c tests/` = 14 archivos |
| [10] | `glab api -i` sobre Plumb: duo_workflow 43, `ref=main` 170, MRs mergeados 12; `curl -o /dev/null -w '%{http_code} %{time_total}s'` a la URL de Cloud Run; `grep -rcE` de tests en `tests/unit` |
| [11] | `grep -niE 'tamper\|fixme\|\.skip\|weaken' README.md docs/submission.md ci/plumb.gitlab-ci.yml tools/*.mjs`: solo el prompt de `.gitlab/duo/triage-flow.yml` lo menciona |
