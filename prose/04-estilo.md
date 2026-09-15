# 04 · La gran decisión: cuánta maquinaria comprar (estilo)

## 1. Trabajo de la sección
Que el lector vea la primera decisión estructural completa: la pregunta de estilo
resuelta con una cuenta (volumen × equipo × presupuesto), no con ideología. Y que
vea el material crudo de esa decisión (la pizarra del 29/10) para creer que el
método no es reconstrucción limpia posterior.

## 2. Estado mental
- Antes: conoce principios y trazabilidad; espera ver "aplicar el método".
- Después: entiende por qué monolito modular y no los otros dos extremos; vio la
  Entity Trap (el error clásico que esquivaron); y vio evidencia de que el diseño
  para la extracción futura estuvo en la pizarra desde antes de cualquier diagrama.
- Pregunta: "¿y cómo se parte internamente ese monolito?" → S5.

## 3. Postura del narrador (derivada de 00-background)

- Muestra la decisión madre como una doble renuncia con cuenta: no microservicios
  ("el esfuerzo se pierde y el usuario no lo ve"), no monolito puro ("simplificación
  de más"). Las citas del repo opinan; el narrador no agrega la suya.
- Asume que el lector viene de charlas de microservicios y desactiva la Entity Trap
  con respeto (es el error clásico del kata según los jueces, no una torpeza ajena).
- Se permite subrayar el post-it del 29/10 porque es un hecho fechado (la renuncia
  a las llamadas directas escrita antes de cualquier diagrama), no un sentimiento:
  se muestra, no se declara.

## 4. Hechos duros
- Entity Trap (slides oficiales Richards & Ford): anotar sustantivos y crear un
  componente por cada uno; error clásico del kata.
- Comparación de estilos contra las 4 restricciones del cliente: equipo chico,
  salida rápida al mercado, presupuesto mínimo, AWS como plataforma.
- Decisión (ADR 002): monolito modular en pocas máquinas AWS; diseño para la
  extracción futura; escala vertical primero, horizontal cuando la telemetría lo diga.
- Descartes con citas del repo: monolito puro ("sirve para PoC; acá sería
  simplificación de más"); microservicios desde día uno ("exigen modelo de dominio
  estable que todavía no existe").
- Pizarra del 29/10/2020: núcleo "Menu" + plug-ins; post-it con la política de
  comunicación por mensajería y el condicional de caché; tamaños crudos (4
  cores/8 GB el núcleo, 1 core/2GB la pieza escalable con load balancer + JAR + MSG).

## 5. Decisiones de enseñanza
- Estructura: trampa (Entity Trap) → cuenta (restricciones × volumen) → decisión
  (tarjeta ADR 002) → evidencia cruda (pizarra) → descartes (citas) → lección.
- La pizarra con guía de lectura propia: es el primer artefacto crudo del artículo;
  hay que enseñar a leer garabatos.
- La lección transferible va en callout al final, enunciada como pregunta
  reformulada (no como moraleja edulcorada).

## 6. Conexiones
- "<1 req/s" (S1) es el número que decide: acá se cobra por primera vez.
- "Evolucionabilidad" (S3) se convierte en diseño concreto (fronteras internas).
- "Según los propios jueces cayeron varios equipos" → rúbrica de S2.
- ADR 002 → S10 (mapa, pilar 1).
- Post-it "mensajería para desacoplar" → S5 (comandos/eventos de la ACL) y S8
  (log stream).

## 7. Metáforas (máx 2)
- "¿Cuánta maquinaria comprar?" (título y pregunta rectora; es económica, no
  imaginística).
- "Diseñar para la extracción futura" como promesa que luego se cobra (S8 la cobra).

## 8. Ritmo
- Apertura con la trampa: rápido, casi de conversación.
- La cuenta: lenta, con el número de S1 a la vista.
- La pizarra: pausa larga (imagen + guía).
- Descartes y cierre: de nuevo rápido, dos párrafos.

## 9. Anti-patrones
- No escribir "el monolito modular es la respuesta correcta": es la respuesta
  para estas restricciones, y así hay que decirlo.
- No repetir "pragmatismo" más de una vez.
- No anticipar la ACL ni los módulos internos (S5): acá solo el post-it sugiere.
