# Artefactos de prosa — la capa low-level del artículo

Cada archivo de esta carpeta es el **estado mental explicitado** de una sección del
artículo: qué trabaja la sección, desde qué postura habla el narrador, qué hechos
duros tiene a mano, qué decisiones de enseñanza toma, qué hilos planta y qué
metáforas tiene permitidas.

**El contrato:** los párrafos de `src/data/article/es.ts` no se escriben directo.
Se derivan de acá. Si un párrafo no se puede rastrear hasta un campo del artifact,
o el párrafo sobra, o al artifact le falta un campo. Si la prosa "suena rara" o
"artificial", el bug casi siempre está en el artifact (postura difusa, propósito
doble, metáfora no elegida), no en la redacción.

**Por qué existe:** la primera versión del artículo produjo una prosa que *simulaba*
tener perspectiva (gesticulación: apelaciones al lector, metáforas apiladas, suspenso)
sin un proceso mental previo del que emergiera. Estos artifacts son ese proceso,
escrito. Hacen el background explícito y auditable.

## Esquema (los 9 campos)

| Campo | Qué responde |
|---|---|
| **1. Trabajo de la sección** | ¿Qué ÚNICA cosa cambia en el lector? (si son dos, son dos secciones) |
| **2. Estado mental** | Qué sabe/crece el lector antes → después. Qué pregunta se lleva. |
| **3. Postura del narrador** | Desde dónde habla: qué piensa, qué siente, qué NO hace acá. |
| **4. Hechos duros** | El inventario verificable (con fuente en el repo). Nada de prosa sin esto. |
| **5. Decisiones de enseñanza** | Orden, formato, qué se omite y por qué. |
| **6. Conexiones** | Hilos que planta o cobra (hacia qué sección/ADR va cada uno). |
| **7. Metáforas** | Máximo 1–2, elegidas a mano. Las demás están prohibidas acá. |
| **8. Ritmo** | Dónde acelera, dónde frena, dónde queda el silencio. |
| **9. Anti-patrones** | Los vicios específicos que esta sección no se permite. |

## Reglas de derivación (prosa ← artifact)

1. Todo hecho del bloque 4 puede aparecer; nada fuera del bloque 4 (o de los
   artifacts de conexiones de otras secciones) puede colarse.
2. La postura (bloque 3) se traduce en *elecciones*, no en confesiones literales:
   el narrador no dice "mi postura es", la ejecuta.
3. Las apelaciones directas al lector (voseo, imperativos) se racionan según el
   bloque 8; el default es enunciativo.
4. Una metáfora por aparición: si dos compiten en el mismo párrafo, se corta una.
5. La edición EN es traducción de la misma prosa, no una segunda voz.
6. Cambio de contenido → primero el artifact, después los dos `es.ts`/`en.ts`.

## Convenciones

- Idioma de trabajo: español rioplatense (voseo), el de la edición ES.
- Fuente = carpeta `fall-2020-farmacy-food/ArchColider/` (docs, img, xlsx, slides).
- "S#" se refiere a la sección N del artículo (S1 = terreno … S11 = guía).
