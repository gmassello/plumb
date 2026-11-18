# Competidores — GitLab Transcend "Life After Code" · ShipFromPhone

| | |
|---|---|
| Fecha | 2026-11-17 |
| Modo | hackathon |
| Evaluados | 1 (+ Plumb como control) · clonados 0 · **nada se ejecuto** |
| Ventana | submissions 2026-10-05 → 2026-10-27 13:00 UTC · categoria Path A, Hands-off (mismo premio que Plumb) |

## En criollo

- **Que se miro:** ShipFromPhone, un proyecto que lleva un pedido (issue) escrito desde una tablet hasta produccion con agentes de GitLab Duo, sin tocar nada.
- **Quien es la amenaza:** el mismo ShipFromPhone, **alta**. Compite en la misma categoria, con mas corridas publicas que Plumb (104 contra 43 de agentes [1]) y un video.
- **Como estamos:** empate tecnico en la nota base (20.5 de 25 los dos). Plumb suma el bonus de Google Cloud (+0.2); el rival declara que no tiene Google Cloud [5].
- **Que conviene hacer:** poner un numero de cabecera tan claro como el suyo ("13.3 min del pedido a produccion") y no perder el bonus de Google Cloud antes del jurado.

**Pesos del jurado** (`docs/judging.tsv`; Stage One es pasa/no pasa):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design | 20% | 6, 4 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7 |
| Presentation | 20% | 1, 8 |
| Google Cloud bonus | +0.2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error:

- El video (YouTube `FRDm4Vmb9tY`): existe, no se vio su duracion ni si muestra el producto o solo slides.
- El sitio publicado y la pagina Flight Recorder: redirigen a login para anonimos (`302`) [4]; pasa con todos los proyectos del evento, no pesa contra nadie.
- Si los 161 tests pasan, y el codigo de los flujos mas alla de su cabecera: no se ejecuto ni se clono nada.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miro y no esta) · `sin evidencia` (no se pudo ver).

| Proyecto | Nicho | Technological Implementation | Design | Potential Impact | Innovation | Presentation | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `shipfromphone` | issue a produccion, 9 etapas | fuerte | cumple | cumple | cumple | cumple | 8.2/10 | alta |
| `plumb` (propio) | tests inestables: triage y arreglo | cumple | cumple | cumple | fuerte | cumple | 8.2/10 | — |

**Amenaza** es contra Plumb: mismo premio, mismo patron (CI decide, Duo actua), pero otro dolor (un pedido nuevo vs un test que falla).

---

## `shipfromphone` — ShipFromPhone

<!-- ficha -->

**Que hace:** escribis un pedido desde el celular y un flujo de agentes lo planifica, lo construye, lo pasa por pruebas y escaneos, lo mergea, lo publica y verifica que produccion cambio.

| | |
|---|---|
| Repo | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43294713/shipfromphone · creado 2026-10-13 · JavaScript · MIT (`LICENSE` en el arbol; la API dice `license: null`) [2] |
| Demo | https://shipfromphone-d1d3e6.gitlab.io · `302` a login en 0.49 s [4] (igual para todos) |
| Devpost | `shipfromphone` · video si (YouTube embebido) [3] |
| Equipo | 1 persona (declara 18 anos) + agentes · autores de commits 33 del flujo "Conductor", 17 humano [2] |
| Historial | primer commit 2026-10-13 · repo archivado · previos al evento: no (Path A pide desde 2026-10-05) [2] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Stage One (usa Duo) | `fuerte` | 104 pipelines `duo_workflow` de 230 [1]; 5 flujos en `.gitlab/duo/flows/` [2]; registrados en el AI Catalog segun commit |
| Technological Implementation 20% | `fuerte` | CI con 17 jobs (tests, SAST, secretos, SBOM, imagen, staging, verify, rollback) [2]; 161 tests en 10 archivos [6]; 28 MR mergeados [1] |
| Design 20% | `cumple` | Flujo completo issue→produccion con candado "Draft + CI libera" y pagina Flight Recorder [3]; la app de carga (StudyDesk) es un PWA chico |
| Potential Impact 20% | `cumple` | Historia personal fuerte; cubre 8 de 9 etapas DevSecOps; produccion es solo un sitio estatico en Pages [3] |
| Innovation 20% | `cumple` | Flujo unico de 7 agentes porque los disparadores ignoran cuentas de servicio; candado en CI; reglas escritas de "toque humano" [3] |
| Presentation 20% | `cumple` | Video si; README con prueba fechada (issue 23, 13 min); limitaciones declaradas; contenido del video `sin evidencia` |
| Google Cloud +0.2 | `ausente` | README: "no IaC ... no Google Cloud" [5]; 0 archivos de nube en el arbol [2] |
| Calidad de codigo | `cumple` | 10 archivos de test; lint propio; sin ESLint externo [2] |
| Seguridad | `cumple` | SAST y secretos en CI [2]; ningun `.env` ni credencial en el arbol [2] |

**Lo mas fuerte:** volumen y honestidad de la evidencia: 35 corridas, 25 llegaron a produccion, 23 sin toque humano, mediana 13.3 min (cifras de su ficha, no re-medidas) [3].
**Donde se cae:** 8 de 35 corridas fallaron o se abandonaron, 5 se re-lanzaron a mano, y produccion es solo la parte estatica [3]; sin Google Cloud.
**Sin evidencia:** video, que los tests pasen, "cero toques humanos" (se declara; el `author` de un MR no lo prueba).

---

## Donde queda tu proyecto

| Criterio | Plumb | `shipfromphone` |
|---|---|---|
| Pipelines totales / de agentes | 239 / 43 [1] | 230 / 104 [1] |
| MR mergeados | 12 [1] | 28 [1] |
| Flujos de Duo | 1 (`triage-flow.yml`) | 5 [2] |
| Tests | 54 unitarios (mas 5 e2e) | 161 en 10 archivos [6] |
| Commits | 147 | 50+ (33 + 17) [2] |
| Google Cloud (bonus) | Cloud Run declarado en `PENDING.md` | ausente [5] |
| Video | si (`youtu.be/I6_9prWib8Q`) | si [3] |

### Sugerencias

| # | Sugerencia | Por que importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Confirmar que el servicio de Cloud Run sigue vivo hasta el fallo del jurado | Es el unico criterio donde el rival no puntua; si se borra, se pierde | Google Cloud (+0.2) | brecha | `PENDING.md` lista el proyecto con borrado fechado 2026-11-16; rival: 0 [5] | bajo | si |
| S-02 | Un numero de cabecera medido, en el README y la ficha, del estilo "mediana X min de pedido a arreglo" | El rival abre con una cifra y una prueba fechada; es lo que lee el jurado primero | Presentation (20%) | brecha | su README abre con "13 minutes later" [3] | bajo | si |
| S-03 | Publicar el recuento de corridas fallidas junto a las exitosas | El rival declara 8 de 35 fallidas y suma credibilidad | Technological Implementation (20%) | brecha | ficha del rival [3] | bajo | si |
| S-04 | Mostrar mas corridas de agentes en `docs/RESULTS.md` (43 contra 104) | Volumen de evidencia pesa en la nota tecnica | Technological Implementation (20%) | brecha | 43 vs 104 [1] | medio | si |
| S-05 | Pulir el README o las estrellas | Nadie lo pondera | — | — | — | bajo | **cosmetico** |

> Control de sesgo: Plumb se midio con las mismas sondas; salio por detras en volumen de agentes, MR y tests, y por delante solo en el bonus y el nicho de innovacion.

---

## Apendice — como se midio

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api -i "projects/87549017/pipelines?per_page=1"` y con `source=duo_workflow`, y `merge_requests?state=merged` (leer `X-Total`); mismo con `projects/gitlab-ai-hackathon%2Ftranscend-october-2026%2F43144947%2Fshowcase` |
| [2] | `glab api projects/87549017`, `repository/tree?recursive=true`, `repository/commits?per_page=100&all=true`, `repository/contributors`, `.gitlab-ci.yml` y `conductor.yaml` crudos |
| [3] | `curl -A Mozilla/5.0 https://devpost.com/software/shipfromphone` (200) y `repository/files/README.md/raw` |
| [4] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s' https://shipfromphone-d1d3e6.gitlab.io` |
| [5] | `grep -iE 'google cloud\|cloud run\|gcp\|gke\|vertex' README.md` (rival: 2 lineas, una dice "no Google Cloud"); `grep -iE 'cloud' PENDING.md` (Plumb) |
| [6] | `repository/files/test%2F<archivo>.test.js/raw` y `grep -cE '^\s*(test\|it)\('` por los 10 archivos: 20 + 23 + 10 + 11 + 22 + 20 + 7 + 15 + 8 + 25 |
