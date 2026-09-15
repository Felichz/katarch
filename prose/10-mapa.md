# 10 · El mapa de decisiones completo (mapa)

## 1. Trabajo de la sección
Entregar el material de consulta: las diez decisiones estructurales, curadas en
tres pilares, cada una con su ficha (problema/decisión/compensación) y su enlace
al ADR original. Es el "volver a consultar" del artículo, no una sección de lectura.

## 2. Estado mental
- Antes: pasó por todas las decisiones dentro de la narrativa, dispersas en el tiempo.
- Después: las tiene juntas, agrupadas por pilar, y puede saltar a cualquiera o al
  ADR original. Sabe que hubo 16 ADRs y que la curaduría filtró a 10.
- Pregunta: "¿cómo llevo esto a mi proyecto?" → S11.

## 3. Postura del narrador
- El narrador se posiciona como curador y dice el criterio: no todos los ADRs pesan
  lo mismo (estructural / higiene operativa / trámite documental). Es una postura
  editorial asumida, no una verdad del repo.
- Cero prosa nueva sobre las decisiones: cada ficha ya existió en su sección; el
  mapa no vuelve a argumentar.

## 4. Hechos duros
- 16 ADRs entregados; curaduría a 10 decisiones en 3 pilares:
  - Pilar 1 (forma del sistema): monolito modular (ADR 002), cortes DDD/ACL, log
    stream, edge auth.
  - Pilar 2 (dinero y datos): event sourcing (007), RabbitMQ at-least-once (008),
    PIN offline (011), caché de catálogo (013).
  - Pilar 3 (lindes y operación): payment facade (009), map provider (015),
    IaC (016), escala vertical→horizontal.
- Formato de ficha: problema → decisión → compensación asumida, con enlace al
  archivo original en GitHub.

## 5. Decisiones de enseñanza
- Un solo párrafo de entrada + el mapa interactivo. Nada más.
- El párrafo declara la curaduría (16 → 10) y el formato, y calla: el componente
  es el contenido.

## 6. Conexiones
- Cada ficha enlaza (data-decision) con su momento narrativo (S4–S8).
- Los enlaces GitHub → los ADRs originales (mismo criterio que el doc viewer).
- S2 (rúbrica, criterio ADR) justifica el formato problema/decisión/compensación.

## 7. Metáforas
- Ninguna. Es una referencia.

## 8. Ritmo
- Sección mínima: párrafo + componente. El ritmo lo pone el mapa (modales).

## 9. Anti-patrones
- No re-argumentar ninguna decisión acá.
- No agregar un décimo primer "porque quedó afuera y era lindo": la curaduría se
  sostiene.
- Cero apelaciones al lector.
