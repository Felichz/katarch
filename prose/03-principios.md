# 03 · Las reglas de juego antes del primer diagrama (principios)

## 1. Trabajo de la sección
Mostrar el orden del método: primero se lee el negocio (una semana sin diagramas),
después se fijan criterios de desempate, recién después se diseña. Y dejar
instalada la herramienta central del oficio: la trazabilidad negocio → requerimiento.

## 2. Estado mental
- Antes: sabe que el razonamiento es lo que se premia, pero no sabe cómo se
  "hace" ese razonamiento.
- Después: conoce la semana cero del equipo (relectura del pliego, preguntas al
  cliente, glosario, marco de Rozanski & Woods, 4 principios), entiende qué es un
  ADR y puede seguir una fila de la tabla de trazabilidad.
- Pregunta: "¿cómo se ve esto aplicado a una decisión real?" → S4/S5.

## 3. Postura del narrador (derivada de 00-background)

- Docente de oficio, sin sermón ni confesiones personales: el orden de la sección
  ES el argumento (leer el negocio → fijar criterios → recién diseñar). La sorpresa
  ("¿una semana sin diagramas?") la provocan los hechos del repo, no adjetivos.
- La renuncia central acá es metodológica: cuestionar el requerimiento #1, preguntar
  en vez de inventar respuestas, ADRs con desventajas en vez de propaganda. Cada una
  se muestra con material primario (citas textuales de Questions.md).
- La tabla de trazabilidad se presenta como la renuncia más instructiva del repo
  (una tabla aburrida que lo decide todo); el narrador la marca y pasa, sin
  sentimentalismo.

## 4. Hechos duros
- Primera semana del repo: solo docs de negocio (objetivos, restricciones,
  preguntas, glosario); cero diagramas de software.
- El pliego llegó como 8 requerimientos crudos; el equipo los reescribió como
  escenarios de uso y marcó el #1 (integración con heladeras) como vago/fuera de
  alcance: ya lo hacía el software de kioscos de Byte.
- Questions.md: preguntas reales al cliente (suscriptor enfermo, pedido por lotes,
  comida no retirada, delta vs total de la API de Byte).
- Marco: Viewpoints and Perspectives (Rozanski & Woods).
- 4 principios: simplicidad cognitiva; evolucionabilidad sobre optimización
  prematura; telemetría obligatoria; mensajes antes que llamadas directas.
- Trazabilidad: tabla drivers → requerimientos significativos ("SAD", chiste
  interno del equipo). Filas citadas: conversión ocasionales→suscriptores;
  lealtad (cupones/puntos combinables); cocina sin desperdicio (reportes);
  garantía de retiro; crecimiento (notificaciones/integraciones no reescritas).
- ADR: formato de Michael Nygard (contexto/decisión/consecuencias, incluidas las
  negativas); 16 ADRs entregados; segunda ley: el porqué importa más que el cómo.

## 5. Decisiones de enseñanza
- Orden de la sección = orden del método (esa es la tesis; el formato lo replica).
- Las preguntas al cliente como lista de citas textuales: el contenido humilde
  (preguntar) se muestra con material primario.
- La tabla de trazabilidad se da en filas reales y UNA fila se marca como semilla
  que va a volver (retiro garantizado → PIN de S6).
- El ADR entra al final como "el cuaderno" que sostiene todo lo anterior.
- Los 15 concept chips ya definidos cubren los términos (ADR, RFP, quality
  attributes): la prosa no re-explica lo que el chip explica.

## 6. Conexiones
- Fila "que nadie se quede sin su comida" → S6 (PIN offline, la decisión celebrada).
- "Mensajes antes que llamadas" → S5 (ACL, comandos/eventos) y S8 (log stream).
- "Telemetría obligatoria" → S8 (health checks, cliente sintético, umbrales).
- "Evolucionabilidad" → S4 (monolito modular) y S8 (extracción del Menu Catalog).
- Segunda ley → rúbrica de S2 (criterio 7) y todos los modales de decisión.

## 7. Metáforas (máx 2)
- "Las reglas de juego antes del primer partido" (el título ya lo dice; en texto
  apenas se sostiene con "criterios de desempate").
- El ADR como "cuaderno donde se anotan las decisiones" (una vez).

## 8. Ritmo
- Apertura narrativa (la semana sin diagramas): ritmo de relato.
- Lista de preguntas: pausa larga (son citas).
- Principios y tabla: plano, enumerativo.
- Cierre de ADR: frase final corta y contundente (honestidad: "un ADR sin
  desventajas es propaganda").

## 9. Anti-patrones
- No glorificar el método: mostrar que es aburrido y que por eso funciona.
- No repetir "los buenos principios no se inventan, se destilan" en más de un lugar.
- Cero adelantos de qué decide el equipo con esos principios (eso es S4).
- No volver a explicar qué es un ADR más adelante: el chip es la referencia única.
