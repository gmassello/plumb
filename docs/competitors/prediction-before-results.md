# Candidatos a ganar Path A Hands-off, contra Plumb (2026-11-17)

Los ganadores todavía no están publicados. Plumb compite en **Path A · Hands-off**: un solo premio de US$5.000, más la posibilidad de un premio especial. Este informe consolida 10 revisiones a fondo, una por rival, hechas con el agente `personal-competitor-reviewer`. Cada informe individual está linkeado en la tabla.

## Método

- **Pool:** 786 fichas de la galería de Devpost. Quedan 76 asociadas a Path A Hands-off y, de esas, los 10 con más evidencia. El Path está confirmado en el README de cada uno.
- **Revisión por rival:** un agente midió cada criterio con `glab api` de solo lectura, la ficha de Devpost, el sitio y el demo. Los clones superficiales se borraron y no se ejecutó código ajeno.
- **Escala:** nota de 1 a 5 por criterio. Los 5 criterios pesan 20 % cada uno, y el bonus de Google Cloud suma +0,2 si hay un deploy vivo y su código está en el repo.
- **Una sola vara para Plumb:** los primeros revisores puntuaron a Plumb con varas distintas (de 4,0 a 4,6). La tabla usa la nota consolidada **4 / 4 / 4 / 4,5 / 4 = 4,1, +0,2 = 4,3**. Ninguno de los revisores de la segunda ola encontró evidencia para moverla.
- **Correcciones mías a lo que entregaron los agentes:**
  - **Campus Autopilot y CSV Mender, Diseño 3 → 4,5 y 3 → 4.** Sus revisores puntuaron lo visual (sitio, idiomas, temas). El criterio pide *"a complete, coherent end-to-end workflow"*, y los dos cierran el ciclo de issue a producción.
- **Contexto común:** después del cierre, todos los proyectos del evento quedaron archivados y sus sitios de GitLab Pages redirigen a un login. Afecta a todos por igual y no se penaliza a nadie.

## Ranking de la categoría

| # | Proyecto | Tech | Diseño | Impacto | Innov. | Present. | Prom. | GCP | **Total** | Informe |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | [Joule Thief](https://devpost.com/software/joule-thief) | 5 | 5 | 4 | 5 | 5 | 4,8 | +0,2 | **5,0** | [informe](competidores-gitlab-transcend-joule-thief.md) |
| 2 | [Shipyard](https://devpost.com/software/shipyard-4dqfa6) | 5 | 5 | 4 | 5 | 4 | 4,6 | +0,2 | **4,8** | [informe](competidores-gitlab-transcend-shipyard.md) |
| 2 | [Dongjo](https://devpost.com/software/dongjo) | 5 | 5 | 4 | 5 | 4 | 4,6 | +0,2 | **4,8** | [informe](competidores-gitlab-transcend-dongjo.md) |
| 4 | [Ripple](https://devpost.com/software/ripple-the-record-el-nino-kept-live-by-agents) | 4,5 | 4,5 | 4 | 4 | 4,5 | 4,3 | +0,2 | **4,5** | [informe](competidores-gitlab-transcend-ripple.md) |
| 4 | [Pre-mortem Agents](https://devpost.com/software/pre-mortem-agents) | 4,5 | 4,5 | 4 | 4,5 | 4 | 4,3 | +0,2* | **4,5** | [informe](competidores-gitlab-transcend-pre-mortem-agents.md) |
| 6 | [Tamper Gate](https://devpost.com/software/tamper-gate) | 5 | 4 | 4 | 5 | 4 | 4,4 | — | **4,4** | [informe](competidores-gitlab-transcend-tamper-gate.md) |
| 6 | [Offbrief](https://devpost.com/software/offbrief) | 4,5 | 4 | 4 | 4,5 | 4 | 4,2 | +0,2 | **4,4** | [informe](competidores-gitlab-transcend-offbrief.md) |
| 6 | [Campus Autopilot](https://devpost.com/software/campus-autopilot) | 4,5 | 4,5† | 4 | 4 | 4 | 4,2 | +0,2 | **4,4** | [informe](competidores-gitlab-transcend-campus-autopilot.md) |
| **9** | **[Plumb](https://devpost.com/software/plumb-t69qx1)** | 4 | 4 | 4 | 4,5 | 4 | 4,1 | +0,2 | **4,3** | — |
| 10 | [CSV Mender](https://devpost.com/software/csv-mender) | 5 | 4† | 3 | 4 | 4 | 4,0 | +0,2 | **4,2** | [informe](competidores-gitlab-transcend-csv-mender.md) |
| 11 | [ShipFromPhone](https://devpost.com/software/shipfromphone) | 4,5 | 4 | 4 | 4 | 4 | 4,1 | — | **4,1** | [informe](competidores-gitlab-transcend-shipfromphone.md) |

\* Provisorio: su demo en Cloud Run responde 503 hoy y no se sabe si estaba arriba durante el juicio. † Corregido por mí (ver Método).

## Qué cambió respecto de mi lectura de las fichas

- **Joule Thief sube a la punta:** sale primero, cuando yo lo había puesto en tercer lugar. Sumó Presentación 5 y el bonus de Google Cloud que no había visto. Su revisor aclara que el ahorro de carbono en vivo es modelado: los números fuertes salen de replays con datos sintéticos, cosa que su propio README admite.
- **Plumb sube de 4,0 a 4,3**, pero queda **noveno de 11**. Antes estaba en el último escalón, empatado.
- **CSV Mender y ShipFromPhone quedan debajo de Plumb.** CSV Mender por Impacto, y ShipFromPhone por no tener el bonus de Google Cloud.
- **Tamper Gate y Offbrief**, los dos rivales que más se parecen a Plumb en la idea, le sacan una décima. Sus benchmarks públicos con falsos positivos pesan más que los 50 de 50 de Plumb.

## Mejoras para Plumb que repiten 2 o más revisores

1. **Un camino de 5 minutos para el jurado** arriba del README, con cada claim y su link (CSV Mender, Shipyard). Los rivales mejor puntuados lo tienen.
2. **Evidencia que se vea sin login:** recibos o corridas públicas fuera de Pages (Ripple, Shipyard, Tamper Gate). Hoy Pages pide login para todos, así que el que publicó recibos en Cloud Run quedó mejor parado.
3. **Una evaluación ciega del veredicto flaky/real,** con aciertos y falsos positivos, como la de Tamper Gate (20 de 26, 0 de 20), Offbrief (17 de 18, 0 de 6) y Pre-mortem (12 de 12, 2 de 6). Plumb publica corridas, pero no una tasa de acierto.
4. **Llevar a código el control contra un fix que debilita la prueba** (Tamper Gate, Pre-mortem). En Plumb, hoy ese control vive solo en el prompt del flow. El `merge-gate` exige 50 de 50 y que solo cambien specs, pero no detecta un assert aflojado.
5. **Más alcance de flujo:** más flows con roles separados, o mostrar el ciclo hasta producción (Dongjo, Shipyard, Joule Thief, Campus Autopilot). Es el hueco de Diseño que repiten todos.

## Veredicto

Plumb queda en la mitad de abajo de la categoría: 9.º de 11, a 0,7 del primero.

- **Premio de Path A Hands-off:** el favorito es Joule Thief, seguido por Shipyard y Dongjo.
- **Premios especiales:**
  - **Most Stages (Path A):** Shipyard y Dongjo.
  - **Environmental:** Joule Thief, si se inscribió; no está confirmado.
  - **Most Creative:** cualquiera de los tres de la punta, o Tamper Gate.

Lo que distingue a Plumb, y nadie más tiene, es haber validado el flow en un segundo proyecto real (epic-stack) y su foco en tests inestables. No alcanza para compensar el alcance más corto de su flujo.

Mis notas siguen siendo juicio sobre evidencia medida: ningún revisor vio los videos cuadro por cuadro, y las celdas más sensibles son Diseño e Innovación.
