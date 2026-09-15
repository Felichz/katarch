# 05 · Repartir el sistema: qué se construye y qué se alquila (dominio)

## 1. Trabajo de la sección
Mostrar cómo se corta el monolito por dentro: el corte estratégico (core/soporte/
genérico) decide dónde va el mejor código propio, y dos herramientas concretas —
la capa anticorrupción y el metamodelo — protegen ese corte en el tiempo.

## 2. Estado mental
- Antes: acepta que el monolito se partió en módulos, pero no sabe con qué criterio
  ni cómo se protegen las fronteras.
- Después: sabe clasificar capacidades con las dos preguntas (¿diferencia? ¿ya
  existe?), entiende qué hace una ACL con un ejemplo de datos, y puede leer el
  metamodelo (nivel de conocimiento vs operacional) como respuesta estructural a
  la Entity Trap. Vio el presupuesto de calidad por subsistema.
- Pregunta: "¿qué pasa cuando dos personas pisan la misma vianda?" → S6.

## 3. Postura del narrador (derivada de 00-background)

- Traductor sin adoctrinamiento: tres renuncias estructuran la sección — alquilar
  lo genérico, prohibir que formatos ajenos toquen el dominio (ACL), no mezclar
  reglas con hechos (metamodelo). Los términos técnicos van con chips; la prosa no
  re-teoriza.
- Las inconsistencias del repo (OpenStreetMap dibujado vs Here Maps elegido) se
  muestran sin cinismo: son parte de la honestidad del material y se presentan como
  dato, no como chisme.
- Le da espacio al metamodelo porque es la renuncia menos obvia, pero lo justifica
  con un caso de cambio (promociones) antes de dejar que el lector lo admire.

## 4. Hechos duros
- Clasificación estratégica (mapa SolutionOverview): Core = Meal Catalog, Ordering,
  Loyalty (propio, mejor equipo); Soporte = Feedback, Scheduling (adaptar);
  Genérico = Reporting, Notifications, Payments (alquilar).
- Las dos preguntas de prueba: ¿esto diferencia a Farmacy Food? ¿ya existe probado?
- ACL alrededor del Menu Catalog: frontera interna (Meals Offer, Loyalty, API);
  consumidores por comandos/eventos (cart, recomendaciones, reviews, filtering);
  fabrica eventos si Byte no los publica (traduce API cruda → "catálogo actualizado").
- Pagos: fachada única hacia Visa/Mastercard/PayPal (pizarra); decisión ADR 009
  (proveedor externo primero, migración gradual después).
- ADR 015 (mapas): comparó OpenStreetMap/TomTom/Mapbox/Here Maps por cuota gratis;
  eligió Here Maps (250k consultas/mes gratis); consecuencia: vigilar consumo.
- Metamodelo (FF_Metamodel_v1): Knowledge Level (User/Action/Order Types, Promotion
  Rules, Meal Types...) sobre Operational Level (instancias); reglamento arriba,
  partido abajo; promociones cuelgan de menús y tipos, nunca de comidas sueltas.
- Presupuesto de calidad por subsistema (System Approach): front-end (usabilidad,
  performance, autonomous); catálogo (extensibilidad, mantenibilidad, disponibilidad
  con la cita honesta "reinicios y escala vertical"); ordering (confiabilidad,
  integridad); purchase gateway (seguridad, disponibilidad); centros de gravedad:
  Menu Catalog y Ordering; el cajero impersona usuarios (misma app).

## 5. Decisiones de enseñanza
- Orden: corte estratégico (dónde) → frontera (cómo se protege) → pagos (caso
  genérico) → mapas (caso chico) → metamodelo (cómo absorbe el futuro) →
  presupuesto de calidad (cierre que empalma con S6).
- Cuatro diagramas con guía de lectura (mapa, ACL, fachada pizarra, metamodelo) +
  composición final: esta es la sección más visual del artículo, a propósito.
- El ADR 015 se narra en prosa (es chico) en vez de tarjeta de decisión: variedad
  de escala para que el lector calibre qué es una decisión "grande".

## 6. Conexiones
- Entity Trap (S4) → el metamodelo como respuesta estructural (mencionar explícito).
- "Diseñado para la extracción" (S4) → el diagrama ACL dibujado como servicio.
- "Cajero impersona" (S1) → presupuesto de front-end apps.
- "Sin buena disponibilidad no hay caja" → conecta con S1 (el negocio físico) y
  S6 (integridad del dinero).
- Map Provider inconsistency → honestidad documental (tema del artículo).
- Centros de gravedad → S6/S7 viven casi enteros en ellos.

## 7. Metáforas (máx 2)
- "Reglamento arriba, partido abajo" (metamodelo; una vez, en la introducción del
  diagrama).
- "Aduana" para la ACL (la guía del diagrama la usa; la prosa la usa una vez).

## 8. Ritmo
- Es la sección densa del artículo: párrafos que abren cada figura en una sola idea.
- Entre figura y figura, un párrafo de respiro que diga qué se acaba de ver.
- El cierre (presupuesto de calidad) es el más largo: es el que empalma con S6.

## 9. Anti-patrones
- No dar una clase de DDD: los términos (core/support/generic, ACL, bounded
  context) van con chips, la prosa no re-teoriza.
- No usar "joya" más de una vez.
- No explicar de nuevo la Entity Trap: remitir a S4 en una frase.
- Las dos preguntas de clasificación deben aparecer exactamente una vez, en negrita.
