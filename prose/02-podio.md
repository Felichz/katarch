# 02 · El dilema del podio (podio)

## 1. Trabajo de la sección
Desarmar la creencia de que hay una respuesta correcta: las tres soluciones
finalistas son opuestas entre sí y las tres son defendibles. Lo que se premió
fue la calidad del razonamiento, y esa calidad es auditable (rúbrica de los jueces).

## 2. Estado mental
- Antes: el número de S1 en la mano, sin saber para qué sirve; sospecha de que
  habrá una "mejor arquitectura" para este caso.
- Después: sabe que las tres posturas (monolito modular / microservicios / bus de
  eventos) responden distinto a la MISMA pregunta económica, y conoce los 7
  criterios con los que los jueces midieron.
- Pregunta: "¿qué postura agarro yo?" → se responde en S4, no acá.

## 3. Postura del narrador (derivada de 00-background)

- Árbitro de compensaciones: las tres posturas finalistas son tres renuncias
  distintas sobre qué no pagar hoy, y las tres pagaron un precio real. El narrador
  no elige ganador (eso ocurre en S4 con números) y no da vuelta el carita del bronce.
- La rúbrica se muestra como lo que es: la evidencia de que "calidad del razonamiento"
  fue auditable, no impresión. Citar las dos leyes una vez cada una, como herramientas.
- Tono neutral; el contraste entre tarjetas hace el trabajo argumental.

## 4. Hechos duros
- 10 equipos; finalistas: ArchColider (monolito modular, AWS, barato hoy, partible
  mañana), Myagis-Forest (microservicios desde el día uno, modelado de dominio
  impecable, costo fijo alto), Jedis (plataforma centrada en bus de eventos/Kafka,
  analítica en vivo, mensajería sobredimensionada al inicio).
- Rúbrica de los jueces (7 criterios, del deck de semifinales del repo): narrativa
  y documentación; entendimiento del requerimiento y completitud; identificación
  de atributos de calidad; diagramas (tipo, detalle, completitud); arquitectura
  general; integración con terceros; ADRs con justificación.
- Primera ley citada por los jueces: no hay decisiones correctas o incorrectas,
  todo es una compensación. Segunda (adelanto que aparece en la lista): el porqué
  importa más que el cómo.
- Jurado de semifinales: Nate Schutta, Mark Richards, Sarah Taraporewalla,
  Luca Mezzalira.

## 5. Decisiones de enseñanza
- Las tres posturas en tarjetas paralelas (misma pregunta, tres respuestas): el
  contraste es el contenido.
- La rúbrica como lista numerada: es evidencia de que "calidad del razonamiento"
  no era impresión subjetiva.
- La sección corta a propósito: es bisagra. Cierra el "qué era el problema" y
  abre "cómo se piensa".

## 6. Conexiones
- "42 comidas al día" (S1) es la pregunta económica que las tres posturas responden.
- "Atributos de calidad" en la rúbrica → chip quality-attributes (S3 las desarrolla).
- "ADRs: documentación y justificación" → S3 (formato ADR) y S10 (mapa).
- Monolito modular premiado → S4 (la decisión madre, con su ADR 002).
- Myagis-Forest y Jedis vuelven en S11 (comparar repos como continuación).

## 7. Metáforas (máx 2)
- "El podio" como cuadro de las tres posturas (ya está en el título; en el texto
  apenas se toca).
- Ninguna otra: la fuerza es el paralelismo, no la imaginería.

## 8. Ritmo
- Tres tarjetas al hilo: ritmo de escaneo.
- La lista de criterios: plano, administrativo, a propósito (contraste con lo anterior).
- Cierre que pasa la pelota a S3 con una frase, sin dramatizar.

## 9. Anti-patrones
- No burlarse de Kafka ni de los microservicios: el costo que se nombra es real,
  el tono neutro.
- No anticipar el veredicto ("y por eso ganó el monolito" prohibido acá).
- No convertir las leyes en mantra: se citan una vez cada una.
