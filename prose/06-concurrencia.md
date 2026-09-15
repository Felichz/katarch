# 06 · El mundo físico: heladeras, dinero y conexiones inestables (concurrencia)

## 1. Trabajo de la sección
Que el lector vea que las decisiones serias nacen de aceptar la física del negocio
(una vianda no salta de heladera, el efectivo no avisa, la señal se corta) y no de
aplicar patrones por elegancia. Tres problemas → tres soluciones, y un patrón que
se repite: diseñar para el mundo como es.

## 2. Estado mental
- Antes: sabe cómo está cortado el sistema; todavía lo piensa como software limpio.
- Después: entiende actor-por-heladera (por qué no hay locks), event sourcing para
  evidencia, la ventana de 30 segundos, el PIN offline, y que los journeys de error
  también se diseñan. Vio el vocabulario de comandos y eventos con colores.
- Pregunta: "¿y el suscriptor, que pedía para toda la semana?" → S7.

## 3. Postura del narrador
- El narrador plantea cada problema ANTES de la solución y, en uno (heladera sin
  señal), frena de verdad: le cede la pregunta al lector con un callout antes de
  revelar. Es el único freno interactivo del artículo y va acá porque acá la
  respuesta es contra-intuitiva.
- Habla de dinero con seriedad (es la sección del dinero) pero sin dramatizar:
  la seriedad está en los hechos (doble cobro, reclamos, reembolsos), no en adjetivos.
- Al final nombra el patrón que se repitió UNA vez, en callout, y se va.

## 4. Hechos duros
- Problema 1 (dos compran la última vianda): actor por heladera; stock en memoria;
  una fila por heladera; sin locks por construcción; router por ubicación; colas
  separadas; broadcast "catálogo actualizado".
- Riesgo anotado: un local puede tener varias heladeras; la API de Byte no garantiza
  la suma por local; pregunta al proveedor: ¿total o delta?
- Problema 2 (reclamos): event sourcing para órdenes (historial inmutable); colas
  con ack e idempotencia (identificadores únicos); version number por agregado
  (Concurrency.md); diagrama del rechazo: stock se repone, usuario avisado;
  historial ~1 mes en el dispositivo → botón reintentar.
- Compra paso a paso (IM_meal_purchase): Start Order local → Confirm Order →
  MealStockReserved → MealStockUpdated → OrderPurchased. Azul comando / verde evento.
- Ventana de 30 s (2–5% de cancelaciones al toque): la cancelación se resuelve en
  memoria antes de invocar al pago (IM_cancel_order_by_user).
- Problema 3 (sin señal): PIN de 6–8 dígitos validado localmente (evolución: códigos
  de acceso descartados por engorrosos); catálogo cacheado en el dispositivo; stock
  real verificado al pagar.
- Día nublado (user-journey-error): vianda trabada → foto → admin aprueba reclamo →
  orden nueva → notificación; sin arreglo por software.
- El cierre de promociones: hoja de cálculo, no consenso distribuido; datos
  particionables por ciudad ("las cocinas de Detroit no ofrecen en Nueva York").

## 5. Decisiones de enseñanza
- Tres problemas en orden deincreasing abstracción: contención (stock) → evidencia
  (dinero) → autonomía (offline). Cada uno: problema en prosa corta → decisión
  (tarjeta cuando hay ADR) → diagrama con guía.
- El callout "antes de seguir leyendo" va en el problema 3, único lugar.
- La ventana de 30 s se narra por analogía con "deshacer envío" del correo (única
  analogía cotidiana de la sección).
- La lección agregada va al final en callout; el cuerpo no repite el eslogan.

## 6. Conexiones
- "Efectivo invisible" (S1) → por qué el sistema necesita evidencia (event sourcing).
- Fila "que nadie se quede sin su comida" (S3) → el PIN es su destino (mencionar).
- Comandos/eventos (azul/verde) → S7 (ciclo del suscriptor usa el mismo alfabeto)
  y S8 (el log stream es su implementación).
- RabbitMQ/event sourcing → S10 (mapa, pilar 2).
- Volumetría de cancelaciones (2–5%) → S9 (la tabla de mensajes).

## 7. Metáforas (máx 2)
- "Deshacer envío de un correo" (ventana de 30 s).
- "Día de sol / día nublado" (para happy path vs error journeys; acá nace y S7 la reusa).

## 8. Ritmo
- Problema → solución repetido tres veces: el lector aprende el ciclo.
- Los diagramas de información son los más densos del artículo: la prosa que los
  antecede debe ser la más corta.
- El callout interactivo frena el ritmo a propósito en el tercio final.

## 9. Anti-patrones
- No decir "elegante" de las propias soluciones del equipo más de una vez (el PIN).
- No re-explicar event sourcing en cada figura: el chip + primera mención bastan.
- No enumerar los colores azul/verde más de una vez en prosa (las guías lo hacen).
- Prohibido "la magia de": las soluciones son de ingeniería, no magia.
