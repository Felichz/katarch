# 00 · El background: la tesis desde la que se narra todo

Este es el fondo holístico del artículo. No es la biografía de nadie: es un patrón
del material, verificable línea por línea en el repo, que da una sola manera
coherente de ver todo el caso. De acá deriva la postura del narrador en los 11
artifacts (campo 3 de cada uno).

## La tesis

**La arquitectura ganadora no se define por lo que construyeron: se define por lo
que renunciaron a construir, con justificación explícita en cada caso. Todo el
artículo es el recorrido de esa cadena de renuncias, en el mismo orden en que el
equipo la ejecutó, porque ese orden es el método.**

Dicho en una frase para el lector: *este caso no enseña qué construir; enseña
cómo se decide qué no construir, y cómo se documenta cada "no" para que alguien
 pueda confiar en él después.*

## Por qué es genuino (y no una voz inventada)

1. Es un patrón del material, no de la persona: cada renuncia citada abajo es un
   hecho con fuente en el repo. Cualquier lector puede verificarla haciendo clic
   al documento original.
2. Encaja con el propósito real del proyecto: un desarrollador senior llega
   entrenado en "qué construir"; el caso entero le enseña la operación inversa.
   La tesis sirve al lector, no al narrador.
3. Ya estaba latente en la primera versión del artículo (el pliego que define lo
   que no es problema, los descartes de S4, el "alquilar lo genérico", el "no hay
   locks porque no hay contienda", "la mejor notificación es ninguna", los
   riesgos "sin mitigación técnica"). La tesis no se impuso al texto: lo unificó.
4. Incluye lo no resuelto: el repo declara renuncias que quedaron "pendientes del
   negocio". Un background genuino no se limpia las deudas; las lista.

## La cadena de renuncias, sección por sección

| Sección | La renuncia (y dónde vive en el repo) |
|---|---|
| S1 terreno | El pliego delimita el trabajo definiendo lo que NO es problema: camionetas, firmware, movimiento no-compra. El arquitecto no elige las piezas: las recibe. |
| S2 podio | Las tres posturas finalistas son tres apuestas sobre qué NO comprar hoy; la rúbrica premia razonamiento (compensaciones), no maquinaria. |
| S3 principios | Renuncia metodológica: cuestionar el requerimiento #1 ("fuera de alcance"), preguntar en vez de inventar respuestas, ADRs con desventajas en vez de propaganda. |
| S4 estilo | Doble renuncia con cuenta: no microservicios ("el esfuerzo se pierde y el usuario no lo ve"), no monolito puro ("simplificación de más"). El post-it del 29/10 ya renuncia a las llamadas directas, con escape futuro. |
| S5 dominio | Alquilar lo genérico (pagos, mapas, reportes); la ACL prohíbe que formatos ajenos toquen el dominio; el metamodelo se niega a mezclar reglas con hechos. |
| S6 concurrencia | No locks (se elimina la contención por diseño); no invocar al pago dentro de la ventana de 30 s; no depender de la nube para validar el PIN; no consenso distribuido para promociones (hoja de cálculo). |
| S7 suscriptor | No materializar todas las órdenes futuras (se generan día a día); no cancelar lo ya cocinado (regla de negocio: libera al stock común). |
| S8 infraestructura | No telaraña de llamadas (log stream); no clickear a mano (IaC); no escalar horizontal antes de tiempo. Y los riesgos declarados sin mitigación quedan listados como tales. |
| S9 costos | No montar herramientas propias (horas de desarrollador > suscripción); no esconder supuestos (tráfico uniforme, sin compresión, 1 TB fijos: todo visible). |
| S10 mapa | La curaduría misma: 16 ADRs → 10 decisiones. Contar también es recortar. |
| S11 guía | El método se entrega como 4 pasos donde el primero es entender (no construir) y el tercero es diseñar para lo que no se puede cambiar. |

## Postura del narrador, derivada de la tesis

1. **Guía de la cadena de renuncias.** Cada decisión se narra como lo que deja
   afuera y por qué; lo que construye es la consecuencia, no el título.
2. **Anclaje verificable.** Toda afirmación de fondo cita un hecho del repo; el
   lector siempre puede hacer clic al original. Si no hay clic, no hay afirmación
   de fondo. Y vale para los calificativos: "instructivo", "aburrido", "elegante",
   "el más X" solo si el repo los respalda (un chiste escrito, una cita, un hecho).
   El elogio sin base es narrativa vacía: se muestra el hecho que lo justifica o
   se corta el adjetivo. Lo mismo vale para afirmaciones sobre poblaciones
   ("casi nadie publica", "la mayoría omite", "pocas entregas"): o se verifican
   contra los repos (así se fundamentó "única entrega con análisis de costos",
   chequeado sobre los diez finalistas) o se enuncian los hechos sin la población.
3. **Sin emociones prestadas.** Cuando algo impresiona, se muestra el hecho que
   impresiona (un post-it fechado, un "no hay mitigación técnica" por escrito);
   el narrador no declara sentimientos propios. La voz es funcional, no biográfica.
4. **Lo no resuelto se nombra.** Las deudas del repo se listan como deudas. La
   honestidad es contenido, no estilo.
5. **El orden es el método.** La secuencia de secciones espeja la secuencia del
   equipo; ningún concepto se adelanta a su momento (no spoilers).
6. **Una metáfora por sección, solo si comprime.** (TDAH: la metáfora es una
   herramienta de carga cognitiva, no decoración.)
7. **El hilo principal es auto-suficiente.** El artículo se lee de arriba a abajo
   sin abrir nada: el contexto de cada diagrama se introduce ANTES de mostrarlo y
   la explicación detallada (guía de lectura) va DEBAJO, a la vista. Las
   decisiones se cuentan enteras en el hilo (problema, decisión, compensación),
   nunca resumidas a una línea con el resto escondido en un modal. Los botones
   "doc original" son la capa de verificación, no lectura obligatoria: abren el
   documento íntegro como fuente, y su contenido no esconde nada que el hilo
   necesite. Cada mención de un ADR abre su ficha (el documento completo,
   traducido), y el enlace al archivo original vive dentro de la ficha: ningún
   botón sale de la página por sí mismo.

## Regla de auditoría

Todo párrafo del artículo debe poder rastrearse a la tesis de dos maneras: o
narran una renuncia (con su justificación), o preparan el terreno para la
siguiente. Un párrafo que no sea ninguna de las dos cosas se corta, o la tesis
está incompleta y se la amplía acá — nunca en el aire.
