# Competidores — GitLab Transcend "Life After Code" (post-mortem de ShakeFix)

| | |
|---|---|
| Fecha | 2026-11-18 |
| Modo | hackathon (post-mortem: ShakeFix ganó "Path A \| Best Hands-off Agent", Plumb no) |
| Evaluados | 1 (`nxt-spacenos-global/shakefix`) + Plumb como control · clonados 1 · **nada se ejecutó** |
| Ventana | apertura 2026-10-05 → cierre 2026-10-27 13:00 UTC |

## En criollo

- **Qué se miró:** el repo de ShakeFix en GitLab, su ficha de Devpost, su video y sus sitios publicados, con las mismas sondas que Plumb.
- **Por qué ganó:** ShakeFix tiene una persona concreta (Margaret, 78 años, cobrada de más) y 4 casos reales con minutos medidos (18m 34s, 24m 51s) en un video de 2:52.
- **Dónde Plumb queda atrás:** más cantidad de prueba (1781 chequeos de test contra 148), nube como código (10 archivos Terraform contra 0) y un sitio que sigue abierto a anónimos [1][7].
- **Dónde Plumb no queda atrás:** la idea y el cierre completo del ciclo (merge, deploy, resumen) son del mismo nivel; la brecha es de alcance y de cómo se cuenta.
- **Qué conviene hacer:** para el próximo evento, contar el número humano en el título del video y publicar la prueba fuera del grupo del evento.

**Pesos del jurado** (`docs/judging.tsv`; "equally-weighted", final 1 a 5.2):

| Criterio | Peso | Secciones que lo responden |
|---|---:|---|
| Technological Implementation | 20% | 4, 5, 9, 10 |
| Design (flujo completo) | 20% | 3, 6 |
| Potential Impact | 20% | 1, 6 |
| Innovation/Idea | 20% | 7 |
| Presentation | 20% | 1, 8 |
| Google Cloud (bonus) | +0.2 | 9, 11 |
| Stage One: usa Duo (aprobado / reprobado) | — | 2 |

**Lo que no se pudo ver** — el margen de error de todo lo que sigue:

- Las notas reales del jurado: no se publican. Las notas 1–5 de abajo son mi lectura con la evidencia medida, no las del jurado.
- El contenido del video de ShakeFix: solo se midió duración (172 s) y título [12]. No se vio qué muestra.
- Si el sitio de Plumb ya estaba cerrado a anónimos cuando juzgó el jurado: hoy pide login [7], antes no se sabe.

---

## Tabla comparativa

Escala: `fuerte` · `cumple` · `flojo` · `ausente` (se miró y no está) · `sin evidencia` (no se pudo ver). Nota 1–5 por criterio.

| Proyecto | Nicho | Tecnología 20% | Diseño 20% | Impacto 20% | Innovación 20% | Presentación 20% | Nube +0.2 | Nota | Amenaza |
|---|---|---|---|---|---|---|---|---:|---|
| `nxt-spacenos-global/shakefix` | reporte de bug por sacudida del celular | fuerte 5 | fuerte 5 | fuerte 5 | fuerte 5 | fuerte 5 | fuerte | 5.0/5 | alta |
| Plumb (propio) | test inestable en CI | cumple 4 | fuerte 5 | cumple 4 | fuerte 5 | cumple 4 | cumple | 4.4/5 | — |

**Amenaza** es contra el premio al que competía Plumb. Alta: mismo premio, mismo jurado, ShakeFix cubre las 9 etapas de DevSecOps y suma capas que Plumb no tiene.

---

## `nxt-spacenos-global/shakefix` — ShakeFix

<!-- ficha -->

**Qué hace:** una persona sacude el celular y un flujo de Duo con 4 agentes escribe la prueba que falla, arregla, compara producción contra el arreglo y publica; la persona confirma con un pulgar.

| | |
|---|---|
| Repo | https://gitlab.com/nxt-spacenos-global/shakefix · creado 2026-10-10 · JavaScript · MIT (archivo `LICENSE`, la API no lo detecta) [1][13] |
| Demo | `judges.html` 200 en 0.70 s a anónimos; CareRx 200 en 0.36 s [7] |
| Devpost | `shakefix` · video sí, 172 s, título con "18m 34s, 0 humans" [6][12] |
| Equipo | 2 personas + 2 bots · reparto 105/45 humanos (de 189 commits) [4] |
| Historial | primer commit 2026-10-12 · 189 commits · previos a la apertura: no [4] |

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Tecnología 20% | fuerte | 445 archivos, 114 de test, 1781 chequeos; 27 jobs de CI con SAST, dependencias y secretos; 10 .tf [2][5][10] |
| Diseño 20% | fuerte | 11 etapas desde la sacudida hasta "sigue arreglado tras cada deploy"; MR !12 mergeado por bot con 9 jobs en verde antes del merge [8][9] |
| Impacto 20% | fuerte | Margaret, 4 bugs sembrados con caso real y cifra citada; 4 casos con minutos medidos (18m 34s a 37m 55s) [6][14] |
| Innovación 20% | fuerte | Segunda Opinión (compara pantalla, API y base entre `main` y el arreglo) y voz (transcripción y llamada) [6] |
| Presentación 20% | fuerte | Devpost 1381 palabras, 16 etiquetas, video 2:52 (< 3:00), páginas para jurado y "pruébalo vos" [6][12] |
| Nube +0.2 | fuerte | Cloud Run, Firestore, Artifact Registry y Workload Identity en Terraform; CareRx vivo 200 [7][10] |
| Calidad de código | fuerte | 12 de 12 MRs de control con el veredicto esperado, escrito antes de correr [8] |
| Seguridad | cumple | sin `.env` en el árbol; no se escaneó el historial completo [2] |

**Lo más fuerte:** los 12 controles con respuesta commiteada antes de correr: 12 de 12 coinciden [8].
**Dónde se cae:** el eval gradado solo tiene 1 arreglo corrido (1/1) y "mediana sacudida a MR: not run" [15]; `docs/sci.md` es un esqueleto con TODO [15].
**Sin evidencia:** qué muestra el video; si el jurado abrió los certificados firmados.

---

## Donde queda tu proyecto

| Medición | Plumb | ShakeFix |
|---|---|---|
| Archivos de test / chequeos | 13 / 148 [5] | 114 / 1781 [5] |
| Commits (primero) | 147 (2026-10-17) [4] | 189 (2026-10-12) [4] |
| Pipelines / de Duo | 239 / 43 [3] | 204 / 52 [3] |
| MRs mergeados / total | 12 / 17 [3] | 9 / 26 [3] |
| Terraform | 0 archivos [10] | 10 archivos [10] |
| Escaneos de seguridad en CI | SAST + secretos [10] | SAST + dependencias + secretos [10] |
| Video | 143 s [12] | 172 s [12] |
| Sitio público a anónimos | pide login (grupo archivado) [7] | 200 en 0.70 s [7] |
| Nube en vivo | 200 en 0.31 s [7] | 200 en 0.36 s [7] |
| Número humano en el título del video | no ("a hands-off GitLab Duo flow…") [12] | sí ("live run, 18m 34s, 0 humans") [12] |

Pipelines y MRs son del mismo orden: no los separó el volumen de corridas, sino lo que cada una cuenta.

### Sugerencias

Ordenadas por peso del criterio. Se grepeó Plumb antes: cada fila dice si ya lo tiene.

| # | Sugerencia | Por qué importa | Criterio (peso) | Origen | Evidencia | Esfuerzo | Mueve nota |
|---|---|---|---|---|---|---|---|
| S-01 | Poner la cifra humana en el título del video y de la ficha: Plumb ya mide 9 min 47 s sin humano (`docs/submission.md:42`), solo falta decirlo arriba | El jurado puede juzgar solo por texto y video; ShakeFix lo hizo y su video lleva el número en el título | Presentación (20%) | brecha | ShakeFix: "18m 34s, 0 humans" en el título; Plumb: sin número [12] | bajo | si |
| S-02 | Pre-registrar un lote de controles: veredicto esperado commiteado antes de correr, tabla de aciertos | Prueba que el árbitro no se ajustó después; Plumb tiene 1 control negativo (33/50) pero no una tabla de varios | Tecnología (20%) | brecha | ShakeFix 12/12 [8]; en Plumb `grep` de pre-registro en `docs/submission.md`: 0 | medio | si |
| S-03 | Persona con nombre y costo en plata, no solo "el developer de guardia". Plumb ya tiene un destinatario y 1 incidente medido (`docs/submission.md:27,43`): hay que contarlo con una persona | Impacto pide "problema real, audiencia real"; ShakeFix 5 por una persona y 4 cifras citadas | Impacto (20%) | brecha | ShakeFix: 4 bugs con caso real citado [6]; Plumb mock Impacto 4 por no probar el arreglo fuera de la demo | medio | si |
| S-04 | Publicar el sitio y la prueba fuera del grupo del evento (o un espejo): al archivarse el grupo, el sitio pide login | Quien revise después del cierre no ve nada de Plumb | Presentación (20%) | brecha | ShakeFix 200 a anónimos; Plumb redirige a `sign_in` [7] | bajo | si (no demostrado que moviera el fallo) |
| S-05 | Nube como código: pasar el despliegue de `gcloud run deploy` a Terraform con presupuesto y roles | El bonus pide código de despliegue en el repo; ShakeFix muestra 10 archivos | Nube (+0.2) | brecha | ShakeFix 10 .tf; Plumb 0 [10] | medio | si (hasta +0.2) |
| S-06 | Más pruebas por componente: 148 chequeos frente a 1781 pesa en "código y pipeline reflejan esfuerzo real" | El jurado lee la cantidad de tests como señal de trabajo no trivial | Tecnología (20%) | brecha | 13 archivos de test contra 114 [5] | alto | si |
| S-07 | Etiquetas de Devpost: 5 contra 16 | Casi nunca las pondera un jurado | — | — | 5 contra 16 [6] | bajo | **cosmético** |

> Control de sesgo: Plumb salió peor en 4 de 6 criterios y empató en Diseño e Innovación. Las celdas más cómodas que se revisaron fueron Diseño e Innovación (notas 5 y 5): se mantienen porque ShakeFix no tiene más "decisión por código" que el proof de 50 corridas de Plumb; la diferencia ahí es de público, no de ingeniería.

---

## Apéndice — como se midió

<!-- ficha -->

| Ref | Comando |
|---|---|
| [1] | `glab api projects/nxt-spacenos-global%2Fshakefix` (id 87458663: `created_at`, `license`, `archived`, `forked_from_project`) |
| [2] | `glab api "projects/87458663/repository/tree?recursive=true&per_page=100&page=N"` paginado, solo blobs: 445; sin `node_modules/` ni `.env` |
| [3] | `glab api "projects/<id>/pipelines?per_page=1" -i` y `?source=duo_workflow`, `merge_requests?state=all`, `?state=merged`, leyendo `X-Total` (ShakeFix 87458663; Plumb 87376478) |
| [4] | `glab api "projects/<id>/repository/commits?per_page=100&page=N&all=true"` ordenado por `authored_date`; `repository/contributors` |
| [5] | `grep -rcE '\bassert[.(]\|expect\(' $(git ls-files \| grep -E '\.(test\|spec)\.')` sumado, en el clone y en el repo propio |
| [6] | `curl -s -A 'Mozilla/5.0' https://devpost.com/software/shakefix` (y `plumb-t69qx1`), texto de `app-details-left` y etiquetas |
| [7] | `curl -s -o /dev/null -w '%{http_code} %{time_total}s'` sobre `shakefix-bdb22c.gitlab.io/judges.html`, `carerx-pzd4uebegq-uc.a.run.app`, `showcase-8b103c.gitlab.io` (con `-L`: termina en `gitlab.com/users/sign_in`), `booking-vic4jyzsha-uc.a.run.app` |
| [8] | `controls/RESULTS.md` del clone: "12 of 12 verdicts match", expectativas commiteadas antes |
| [9] | `glab api projects/87458663/merge_requests/12` y `.../pipelines/2937755328/jobs`: autor `cto.spacenos`, mergeado por bot, 9 jobs `success` con `finished_at` ≤ `merged_at` (08:34:00) |
| [10] | clone `--depth 50` en el scratchpad: `ls infra/*.tf`, `grep template: .gitlab-ci.yml`, y las mismas sondas sobre el repo propio (`git ls-files \| grep -ciE '\.tf$'`) |
| [12] | `curl` de la página de YouTube: `lengthSeconds` 172 (ShakeFix `SOZXeF82qZ0`) y 143 (Plumb `I6_9prWib8Q`), más el `<title>` |
| [13] | `glab api "projects/87458663/repository/files/LICENSE/raw?ref=HEAD"`: "MIT License" |
| [14] | ficha de Devpost, sección "Accomplishments": tiempos tomados del certificado de cada caso (no se recalcularon) |
| [15] | `evals/results/2026-10-10.md` y `docs/sci.md` del clone |
