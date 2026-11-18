# Competidores — GitLab Transcend "Life After Code" (post-mortem de Lookback)

| | |
|---|---|
| Fecha | 2026-11-18 |
| Modo | hackathon (post-mortem: el concurso cerró) |
| Evaluados | 1 rival (Lookback) + el proyecto propio (Plumb) · clonados 1 (Lookback, superficial, borrado) · **nada se ejecutó** |
| Ventana | submissions 2026-10-05 → 2026-10-27 |

## En criollo

- **Qué se miró:** Lookback, ganador de "Path A: Start Fresh \| Best Supervised Agent" [1], contra Plumb, que no ganó, con los mismos cinco criterios del jurado.
- **Quién es la amenaza:** Lookback, y ya ganó. Toma una apelación ganada por una persona, corrige el error del software y calcula cuánta plata se le debe a las otras 413 familias perjudicadas ($25.861) [2].
- **Cómo estamos:** en lo técnico y en el diseño Plumb queda cerca. Se separa en Impacto y Presentación: Lookback muestra daño a personas con datos públicos reales, y Plumb mide minutos de CI en una app de prueba.
- **Qué conviene hacer:** la próxima vez, abrir el pitch con una persona y una cifra real, dejar algo que el jurado pueda tocar sin cuenta, y una página "para jurados".

**Pesos del jurado** (`docs/judging.tsv`; `docs/HACKATHON.md` §4): cinco criterios al 20 % más Stage One pasa/falla y +0,2 por Google Cloud.

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20 % | 4, 5, 9, 10 |
| Design (flujo completo) | 20 % | 4, 6 |
| Potential Impact | 20 % | 1, 6 |
| Innovation/Idea | 20 % | 7 |
| Presentation | 20 % | 1, 8 |
| Google Cloud | +0,2 | 9, 11 |

**Lo que no se pudo ver** — el margen de error:

- El video de Lookback (2:50): solo se verificó que existe y responde 200 [3]. Si el presentador es una persona o un avatar: `sin evidencia`.
- La nota real que dio el jurado: no es pública. Las notas de abajo son estimaciones mías con la rúbrica del evento, no resultados.
- Lookback es un solo rival: la conclusión "esto pesó" no se contrastó con los otros ganadores.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miró y no está) · `sin evidencia` (no se pudo ver). Nota 1–5 por criterio.

| Proyecto | Nicho | Tecnología 20 % | Diseño 20 % | Impacto 20 % | Innovación 20 % | Presentación 20 % | Nota | Amenaza |
|---|---|---|---|---|---|---|---:|---|
| `Lookback` (gana) | Beneficios públicos: reparación tras una apelación | fuerte 5 | fuerte 5 | fuerte 5 | fuerte 5 | fuerte 5 | 5,0 | alta |
| `Plumb` (propio) | Tests inestables en CI | cumple 4 | fuerte 5 | cumple 4 | fuerte 5 | cumple 4 | 4,4 | — |

**Amenaza** es contra *tu* entrada: Lookback compite por los mismos criterios con otra historia.

---

## `gitlab-ai-hackathon/.../38491653/showcase` — Lookback

<!-- ficha -->

**Qué hace:** cuando alguien gana una apelación por un error del software, arregla el error, encuentra a todos los demás afectados y calcula qué se le debe a cada uno; solo puede actuar a favor de la persona.

| | |
|---|---|
| Repo | proyecto 87291075 · creado 2026-10-06 · Python 64 % + Astro 29 % · `LICENSE` MIT en el repo, pero la API dice `license: null` [4] · archivado |
| Demo | sitio en Cloud Run: 200 en 0.80 s; API `/docs`: 200 en 7.83 s (arranque en frío); video YouTube: 200 [3] |
| Devpost | `lookback-k98qr5` · "Winner, Path A: Start Fresh \| Best Supervised Agent" · video sí [1] |
| Equipo | 1 persona con dos identidades de git: 94 + 11 de 113 commits, más 2 bots de Duo [5] |
| Historial | primer commit 2026-10-08, posterior a la apertura (2026-10-05) · 113 commits · previos al evento: no [5] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Tecnología 20 % | fuerte | 3 flujos Duo + 1 agente de chat + servidor MCP con 6 herramientas; 4 escáneres de seguridad, imagen firmada, Cloud Run por WIF (acceso sin claves); 86 funciones de prueba, 9.295 líneas [6] |
| Diseño 20 % | fuerte | Apelación → MR → merge humano → bisección → replay → remedio → release: 7 etapas en `.gitlab-ci.yml`; corrió 2 veces con links [7] |
| Impacto 20 % | fuerte | Problema con fuente en las primeras líneas (0,2 % de apelaciones en Colorado, KFF 80,7 % ganan); 413 hogares y $25.861; 99,0 % de acuerdo con USDA sobre 42.327 hogares reales [8] |
| Innovación 20 % | fuerte | "Autonomía asimétrica": actúa solo a favor de la persona; 0 acciones adversas en 14.030 casos; 9 sobrepagos quedan en revisión humana [8] |
| Presentación 20 % | fuerte | Pitch con una persona (Ana) y su vecino (Ben); tabla de enlaces con video, sitio, API y página "For judges"; `docs/CLAIMS.md` con 68 líneas [3][9] |
| Google Cloud +0,2 | fuerte | Cloud Run (sitio y API), Artifact Registry, Cloud Storage, WIF; sitio sigue en 200 el 2026-11-18 [3] |
| Calidad de código | cumple | 14 archivos de test; CI con 90 push OK y 6 fallidos, 20 corridas programadas OK y 1 fallida [10] |
| Seguridad | cumple | Sin `.env` en el árbol; escaneo de secretos y de contenedor en CI [6] |

**Lo más fuerte:** 413 hogares y $25.861 hallados en una corrida real, con dato público real (42.327 hogares).
**Dónde se cae:** una sola persona; las decisiones de apelación están escritas por ellos y lo dicen; el flujo C de MCP es un control que no funciona todavía [8].
**Sin evidencia:** el video; la nota real del jurado.

---

## Donde queda tu proyecto

| Medición | Plumb | Lookback |
|---|---|---|
| Primeras 40 líneas del README | video, estado, comandos; el problema no aparece [11] | problema, persona, cifras con fuente y tabla de 4 enlaces [3] |
| Cifra de impacto | 84 % de flaky de Google; la propia entrada admite que "la cifra es de Google, no nuestra" [12] | 413 hogares / $25.861 propios, medidos [8] |
| Datos reales | app de reservas con flakiness puesta a propósito + 1 copia de epic-stack [12] | 42.327 hogares del USDA [8] |
| Algo que el jurado toque sin cuenta | sitio en gitlab.io: 403 hoy [13]; app de demo 200 en 1.64 s | sitio y API: 200, con subida de CSV propio [3] |
| Página "para jurados" | ausente (0 archivos del sitio) [14] | existe, 200 en 0.33 s [3] |
| Flujos Duo / agentes | 1 flujo | 3 flujos + 1 agente + MCP [6] |
| Tests | 59 `test(` + 5 e2e [15] | 86 `def test_` [6] |
| Commits / contribuyentes | 147 / 1 persona (+1 cuenta de flujo) | 113 / 1 persona |
| Pipelines `duo_workflow` en éxito | 43 | 40 [10] |

### Sugerencias

`S-0N` por **peso del criterio**. Todas las de "mueve nota" se grepearon antes en el repo propio.

| # | Sugerencia | Por qué importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Abrir README, ficha y video con una persona concreta y una cifra propia en plata o tiempo: "en N incidentes, M horas de CI y de lectura de logs" | El jurado premió el daño a personas medido; Plumb solo cita a Google | Impacto (20 %) | brecha | Lookback: 413 hogares / $25.861 [8]; Plumb: cifra ajena, ya admitida [12] | medio | sí |
| S-02 | Medir el costo del flaky en un proyecto real y público (no sembrado) y publicar el número | Plumb ya tiene epic-stack, pero ahí ningún fix pasó la prueba; no demuestra el impacto | Impacto (20 %) | brecha | Lookback: 99,0 % sobre 42.327 hogares reales [8]; Plumb: 3 pipelines en epic-stack, 0 fixes que valieran [12] | alto | sí |
| S-03 | Contar lo que ya existe: `include: project` para usar Plumb en otro proyecto, con las 3 líneas visibles al inicio del README | Lookback ofrece "traé tus datos"; Plumb ya lo tiene pero está en la línea 57 y el sitio no lo menciona (0 `include`) [14] | Impacto (20 %) | brecha | README línea 57; `grep -c include site/index.html` = 0 | bajo | sí |
| S-04 | Una página "para jurados": cada criterio con su evidencia y enlace | Lookback la tiene; en Plumb solo existe `docs/JUDGING-MOCK.md`, no publicada | Presentación (20 %) | brecha | `site/src/pages/judges.astro` en Lookback [3]; 0 en Plumb [14] | bajo | sí |
| S-05 | Algo que el jurado use sin cuenta ni login, fuera de gitlab.io | El sitio de Plumb da 403 anónimo hoy; el de Lookback, 200 en Cloud Run | Presentación (20 %) | brecha | Plumb 403, Lookback 200 [3][13] | medio | sí |
| S-06 | Reemplazar o complementar el avatar de IA por una persona real en cámara (o dejar claro en pantalla qué es real) | Plumb lo declara y lo etiqueta YouTube; el mock ya lo señalaba como el hueco para el 5 | Presentación (20 %) | brecha | `docs/AI_DISCLOSURE.md:7`; Lookback: `sin evidencia` | alto | sí |
| S-07 | Más piezas de Duo: un agente de chat o MCP para explicar un veredicto | Lookback: 3 flujos + chat + MCP; Plumb: 1 flujo | Tecnología (20 %) | brecha | [6] | alto | sí |
| S-08 | Sacar `license: null` de la API poniendo la licencia en la raíz, no solo en `LICENSE` | La regla pide MIT "visible en About"; ambos repos dan `null` [4] | Reglas (pasa/falla) | hueco | `glab api projects/<id>` de los dos | bajo | **cosmético** (ya no cambia nada: concurso cerrado) |

> Control de sesgo: Plumb se midió con las mismas sondas. El mock propio le daba 5 en Tecnología y acá bajó a 4 por menos piezas de Duo (1 flujo contra 3 + agente + MCP) y menos código; Presentación e Impacto quedan en 4. Se miraron las tres celdas más cómodas: Diseño, Innovación y Google Cloud.

---

## Apéndice — cómo se midió

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `curl -s -A <UA> https://devpost.com/software/lookback-k98qr5 \| grep -oE 'Winner[^<]{0,80}'` |
| [2] | `grep -n 'Households owed' README.md` (en `glab api projects/.../repository/files/README.md/raw?ref=main`) |
| [3] | `curl -s -o /dev/null -L -w '%{http_code} %{time_total}s' <url>` sobre sitio, `/judges/`, `/docs`, YouTube; `head -60` del README |
| [4] | `glab api projects/<ruta> \| jq '{license,archived,created_at}'`; `head -3 LICENSE` en el clon |
| [5] | `glab api projects/<ruta>/repository/commits?per_page=100&all=true --paginate` y `git shortlog -sn` |
| [6] | `git clone --depth 50`; `grep -rhE '^\s*def test_' tests \| wc -l`; `wc -l .gitlab/duo/flows/*.yaml`; `grep -nE '^(stage\|include)' .gitlab-ci.yml` |
| [7] | `glab api projects/<ruta>/merge_requests?state=all` y `.../releases` |
| [8] | `sed -n 1,200p` del README y del cuerpo de la ficha de Devpost |
| [9] | `wc -l docs/CLAIMS.md`; `grep -n judges` en el árbol |
| [10] | `glab api projects/<ruta>/pipelines?per_page=100 --paginate \| jq -r '"\(.source) \(.status)"' \| sort \| uniq -c` |
| [11] | `head -45 README.md` (Plumb) |
| [12] | `docs/submission.md` líneas 27–46 y `docs/CLAIMS.md` |
| [13] | `curl -s -o /dev/null -L -w '%{http_code}' https://showcase-8b103c.gitlab.io/` |
| [14] | `git ls-files \| xargs grep -il judges`; `grep -c include site/index.html` |
| [15] | `grep -rhoE '^\s*(test\|it)\(' tests tools \| wc -l` |
