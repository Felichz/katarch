# 08 · Aterrizar el diseño en la nube (infraestructura)

## 1. Trabajo de la sección
Traducir todo el diseño lógico a máquinas, red y operación reales: dónde corre
cada pieza (VPC), quién valida identidades (edge auth), cómo se propagan los
cambios (log stream), cómo se define la infraestructura (IaC) y cuándo se escala.
Incluye la lista de riesgos con mitigación: el día nublado operacional.

## 2. Estado mental
- Antes: entiende el diseño como piezas lógicas y mensajes; la nube es para él
  "servidores en algún lado".
- Después: sabe leer el diagrama VPC (público/privado, dos AZ), entiende validar
  en el borde, el log-based stream como estilo de comunicación, IaC como
  especificación testeable, escala vertical→horizontal con umbrales concretos,
  y termina con una lista de riesgos reales con mitigación.
- Pregunta: "¿y esto cuánto plata es?" → S9.

## 3. Postura del narrador
- Es la sección más técnica y el narrador lo asume sin pedir permiso, pero traduce
  cada concepto de red a su función (el gateway es "la única salida a internet",
  no una lección de networking).
- El Kleppmann y el anti-patrón espagueti se citan una vez y se usan: no hay
  digresión de teoría de sistemas distribuidos.
- La lista de riesgos se presenta con respeto por la honestidad del equipo
  (incluye los "decisión pendiente del negocio" sin disimularlos).

## 4. Hechos duros
- AWS por restricción del pliego + región us-east (más cercana a Detroit).
- VPC: dos AZ, subredes públicas (balanceadores) y privadas (servidores sin IP
  pública), internet gateway, VGW (VPN a on-premise), duplicación total a/b.
- Edge auth: el ALB valida tokens contra Cognito antes de reenviar; federación
  (Google/Facebook) como argumento de producto; opción de cuenta independiente;
  ABAC entre módulos desde el día uno (zero trust interno).
- services.png: Meal Catalog y Ordering en subnet pública/privada según corresponde,
  Purchase + Event Store en privada, Amazon MQ gestionado, Kafka managed streams,
  SNS/DataDog/Tableau, S3, DynamoDB; plantillas "1..N" (auto scaling); copias
  subnet-3/4 en la segunda AZ.
- Comunicación: anti-patrón "espagueti con albóndigas" evitado; inspiración
  Kleppmann (logs como infraestructura); log-based stream; consumidores a su ritmo
  → máquinas más baratas.
- IaC (ADR 016): CloudFormation sin cerrar la puerta a Terraform; reproducibilidad,
  entornos derivados, pruebas de arquitectura contra la especificación, detección
  de drift.
- Escala: vertical primero; horizontal cuando la telemetría lo diga; umbrales
  concretos (CPU > 75%, memoria > 85%); peligro: la vertical puede postergar
  indefinidamente la horizontal; antídoto: medir el camino crítico en producción;
  el módulo con más presión se extrae (menu-catalog-extraction como caso).
- Telemetría: health checks de 3 niveles (readiness, negocio, técnico); escenarios
  sintéticos ("cliente dummy" recorre el camino crítico).
- Riesgos con mitigación: caída de pasarela (guardar y reintentar); review bombing
  (solo con cobro confirmado); canal de notificación (respaldo); reserva no retirada
  (prepaga); heladera llena (sin mitigación técnica, "decisión pendiente del
  negocio"); fuera de horario (abierto); cocina caída (operar con info interna);
  formato de mensajes (versionado + sunset); factura de escala (tope de instancias
  + confirmación humana); release roto (hot-swap como requisito).

## 5. Decisiones de enseñanza
- Orden: dónde corre (VPC) → quién entra (auth) → qué corre (services) → cómo se
  hablan (log stream) → cómo se define (IaC) → cuándo crece (escala) → qué puede
  fallar (riesgos).
- Cuatro figuras con guía; la prosa entre figuras nombra la idea, nunca la repite.
- Los riesgos como lista en negrita: es material de consulta, no narrativa.
- Sin números de costo acá (eso es S9): solo "más baratas" cualitativo.

## 6. Conexiones
- "Mensajes antes que llamadas" (S3) y post-it (S4) → el log stream es su
  implementación final.
- "Telemetría obligatoria" (S3) → umbrales y escenarios sintéticos.
- Extracción (S4: promesa; S5: diagrama ACL) → acá se cobra (menu-catalog-extraction).
- Proyecciones (S7) → el log stream las alimenta.
- Región us-east → S9 (los precios de la planilla corresponden a esa región).
- Riesgos → S10 (algunas decisiones del mapa tienen su riesgo asociado).

## 7. Metáforas (máx 2)
- "El recinto privado" (VPC; la guía lo usa, la prosa una vez).
- "Espagueti con albóndigas" (cita del anti-patrón, no metáfora propia).

## 8. Ritmo
- La más larga del artículo pero por figuras, no por párrafos: prosa en ráfagas
  cortas entre diagramas.
- La lista de riesgos: plano y final, como checklist.
- Sin callout de moraleja: la sección termina en la lista (el cierre conceptual
  ya estuvo en S6).

## 9. Anti-patrones
- No enseñar AWS: cada término se usa por su función, se link-ea si hace falta.
- No repetir "zero trust" ni "edge" como buzzwords: una definición operativa cada uno.
- No contarlo como hazaña: es la parte aburrida y responsable del trabajo.
