# 07 · El viaje de una vianda de suscriptor (suscriptor)

## 1. Trabajo de la sección
Cerrar el cabo que quedó abierto en S1: el suscriptor, el cliente que el negocio
más quiere. Mostrar su ciclo completo (agenda → cocina → heladera → retiro →
reembolso si hace falta) con el mismo alfabeto de comandos y eventos de S6.

## 2. Estado mental
- Antes: domina el alfabeto (comando/evento) con compras instantáneas; sospecha
  que el suscriptor "será más de lo mismo".
- Después: ve que el suscriptor es el caso donde el diseño físico importa más
  (comida futura comprometida, cancelación con reglas de negocio, reembolso real)
  y que se resuelve con las mismas piezas simples.
- Pregunta: "¿todo esto dónde corre y cuánto cuesta?" → S8/S9.

## 3. Postura del narrador (derivada de 00-background)

- Sección corta por diseño: el alfabeto comando/evento ya se aprendió en S6 y el
  narrador no lo re-explica (respeto por el progreso del lector, regla 3 del background).
- La renuncia acá es temporal: no materializar todas las órdenes futuras (se generan
  día a día desde el menú) y no cancelar lo ya cocinado (regla de negocio, con su
  letra chica mostrada sin rodeo legal).
- La génesis en pizarra ("IDEA!!!") se muestra corta y sin mística: un hecho de
  proceso, no un mito de origen.

## 4. Hechos duros
- Génesis: whiteboard "IDEA!!!" (cuenta +1 punto, heladera, casilleros 1d/2d/3d,
  "+ loyalty points").
- Ciclo diario (IM_preparing_scheduled_orders): Get Scheduled Orders → PrepareOrders
  hacia la ghost kitchen → OrderDispatched (escuchan catálogo, reporting, orden) →
  OrderPlacedInFridge → OrderAvailableForPicking (aviso con PIN al usuario).
- Inventory updates: la cocina recibe cada mañana la lista de producción formada
  desde los menús de los suscriptores; responde con vocabulario de 4 palabras:
  aceptado, despachado, no puedo, demorado.
- Scheduling no lee el event store directo: lee proyecciones (read models, CQRS).
- Trade-off documentado: no materializar todas las órdenes futuras; generarlas
  cada día desde el menú; costo: marcar cuáles van prepagadas.
- Cancelación fuera de ventana (IM_cancel_scheduled_order_by_user): Cancel Order →
  MealStockCanceled (stock liberado) + ClaimRefund → RefundSuccessful a la app.
- Regla de negocio: cancelación de menú programado rige desde el día siguiente;
  comida ya preparada no se cancela, puede liberarse al stock común.

## 5. Decisiones de enseñanza
- Es la sección más corta del diseño a propósito: S6 hizo el trabajo pesado del
  alfabeto; acá se cosecha.
- Un solo diagrama "de negocio" (la pizarra IDEA) para marcar el contraste
  idea→especificación.
- Dos diagramas de información con guía: el ciclo y el reembolso.
- La última frase devuelve el tema de S6: piezas simples sostienen al cliente
  más valioso.

## 6. Conexiones
- "El cliente ideal presentado en S1 y nunca más visto" → acá se cobra el cabo.
- "~10 comidas/semana" (S1) → la mecánica diaria de esta sección.
- Proyecciones (chip CQRS) → S8 (el log stream las alimenta).
- ClaimRefund/RefundSuccessful → S9 (frecuencia de cancelaciones en la volumetría).
- "Día de sol/día nublado" (S6) → el reembolso es el día nublado del suscriptor.

## 7. Metáforas (máx 2)
- "Un pequeño festival de eventos encadenados" (una vez).
- Reuso permitido de "día nublado" (ya definida en S6).

## 8. Ritmo
- Apertura breve (el cabo + la génesis), medio, cierre en dos líneas.
- Menos prosa que S6: los diagramas y sus guías llevan el peso.

## 9. Anti-patrones
- No re-explicar comando/evento ni colores (ya vistos en S6).
- No idealizar al suscriptor ni a la suscripción: es un flujo con reglas incómodas
  (letra chica) y así se presenta.
- Prohibido adelantar infraestructura (Kafka, SNS) para "dar contexto".
