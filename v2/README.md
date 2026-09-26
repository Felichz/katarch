# KatArch v2 · curso guiado

Reconstrucción desde cero de KatArch como curso guiado: una idea por pantalla, avance horizontal y diagramas nativos que se arman paso a paso. Mismo contenido pedagógico que la v1 (prosa, conceptos, decisiones, documentos originales), nueva estructura y presentación.

Estado: capítulos 1 a 6 completos en español; del 7 al 11 figuran en el mapa como "en construcción".

## Correr

Requiere Node 22.12 o superior.

```bash
cd v2
npm install
npm run dev      # http://localhost:4321
npm run build    # sitio estático en dist/
```

## Cómo está armado

- **Astro + islas React.** Cada capítulo es una página estática con una sola isla, `Player`, que maneja pasos, teclado (← →), swipe, progreso (localStorage) y el cajón lateral de conceptos, documentos y decisiones.
- **Un paso = una pantalla.** `src/content/es/<capítulo>.ts` define los pasos: título, texto corto (bloques) y `visual: { scene, state }`. Pasos consecutivos con la misma `scene` mantienen el diagrama montado y solo cambian su `state`: por eso el diagrama se transforma en vez de reemplazarse.
- **Escenas.** `src/visuals/`: `kit.tsx` (nodos, flechas, mensajes que viajan, stepper), `ch1.tsx` a `ch5.tsx`, `ch6a.tsx`, `ch6b.tsx`, `quiz.tsx`. Se registran en `src/visuals/index.ts`.
- **Evidencia.** Cada paso puede declarar `evidence` (el PNG original del equipo, detrás del botón "Ver el original") y `describe` (lectura en texto del diagrama, para lectores de pantalla y "Leer como texto").
- **Datos reutilizados de la v1.** `src/content/concepts.ts`, `decision-map.ts` y `original-docs.ts` son copias de `src/data/article/`. `src/lib/refs.ts` envía a cada página solo los conceptos, documentos y ADRs que el capítulo usa.

## El alfabeto de los diagramas

Fijo en todo el curso, con leyenda en cada escena:

| Color | Significa |
|---|---|
| Azul | Comando: alguien pide que algo ocurra (puede fallar) |
| Verde | Evento: algo que ya ocurrió |
| Violeta | Componente con estado (actor, orden, catálogo) |
| Borde punteado gris | Sistema externo que ya existía |
| Naranja | Lo que se construye / acento de la interfaz |
| Rojo | Falla, rechazo, conflicto |

## Agregar un capítulo

1. Crear `src/content/es/<id>.ts` exportando un `Chapter` (ver `types.ts`).
2. Registrarlo en `src/content/es/index.ts` y marcar `available: true` en `src/content/course.ts`.
3. Si necesita escenas nuevas, escribirlas con el kit y registrarlas en `src/visuals/index.ts`.
