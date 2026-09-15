# 01 · El terreno de juego (terreno)

## 1. Trabajo de la sección
Instalar el dato que gobierna todo el caso: el volumen es ridículamente chico
(~42 comidas/día, menos de 1 petición por segundo). Todo lo que el lector decida
después se decide con ese número.

## 2. Estado mental
- Antes: "arquitectura = elegir tecnologías buenas".
- Después: conoce las 3 piezas físicas, los 3 tipos de usuario, qué existía ya y
  qué le toca construir al arquitecto. Y se lleva UN número guardado (<1 req/s)
  que todavía no sabe usar.
- Pregunta que se lleva: "¿qué tiene que ver este número con elegir arquitectura?"
  (la respuesta no es acá; es S2/S4).

## 3. Postura del narrador (derivada de 00-background)

- Abre la cadena de renuncias: el pliego mismo arranca delimitando lo que NO es
  problema del arquitecto (camionetas, firmware, movimiento no-compra). Presentar
  esa delimitación con la misma seriedad que los requerimientos es el trabajo de voz.
- Modo inventario: mundo físico, actores, números. Sin conclusiones de estilo ni
  emociones prestadas; la única evaluación permitida es la que hace el propio
  material (los stakeholders extra que el equipo listó).
- El número final se entrega en silencio (stat block + callout aritmético): es la
  renuncia a pelear contra un volumen diminuto, y todavía no se explica. El narrador
  no adelanta la explicación (regla 5 del background: no spoilers).

## 4. Hechos duros
- Misión: comida saludable y accesible en Detroit; lema "que la comida sea tu
  medicina"; viandas por necesidad médica (diabetes, celiaquía, dietas).
- 3 piezas físicas: ghost kitchens (cocinan por lotes, 1–2 ciclos/día, usan ChefTec);
  heladeras Byte Technology (RFID, cobro automático al cerrar la puerta); kioscos
  con cajero humano (Toast POS).
- 3 usuarios: ocasional (efectivo, sin cuenta, invisible para el sistema central),
  conocido (cuenta + tarjeta, compra por app), suscriptor (menú semanal prepagado,
  retiro diario, ~10 comidas/semana).
- 4ª figura: el cajero. Stakeholders extra que el equipo listó: nutricionistas,
  proveedores de ingredientes.
- A construir: solo la Plataforma Central de Órdenes, sobre APIs existentes:
  Byte Technology, Toast POS, ChefTec, Stripe, QuickBooks.
- Fuera de alcance declarado: logística de camionetas, firmware de heladeras,
  movimiento de comida que no sea compra de cliente.
- Números: 2 locaciones piloto; ~300 comidas/semana (≈42/día); meta a 12 meses:
  68 locaciones y 1.000 suscriptores; <1 req/s en hora pico; crecimiento 2021:
  8 locaciones; 1.000 suscriptores ≈ 10.000 comidas/semana.

## 5. Decisiones de enseñanza
- Mundo físico primero, números al final: el número golpea cuando ya conocés las
  piezas que mueve.
- Piezas y usuarios en tarjetas (3×3): escaneables, no párrafos.
- El diagrama de contexto va al final de la sección: recién ahí es legible.
- El callout "hacé la cuenta" es la única instrucción aritmética explícita del artículo.
- Cero spoilers de solución o estilo. La recompensa de la sección es la pregunta,
  no la respuesta.

## 6. Conexiones
- "La compra en efectivo no le dice nada al sistema central" → S6 (evidencia y
  dinero: event sourcing, colas con ack).
- "El cajero atiende ocasionales" → S5 (la app del cajero impersona usuarios).
- "~10 comidas/semana por suscriptor" → S7 (ciclo del suscriptor) y S9 (volumetría).
- "42/día" y "<1 req/s" → S2 (dilema del podio) y S4 (elección de estilo).
- "El negocio quiere convertir ocasionales en suscriptores" → S3 (trazabilidad,
  drivers → requerimientos).

## 7. Metáforas (elegidas, máx 2)
- "El puente entre los usuarios y las herramientas ya contratadas" (posición de
  la plataforma en el ecosistema).
- Ninguna más. Sin ríos, sin cajas fuertes, sin reglamentos: esas nacen donde
  se usan (S6/S8/S5).

## 8. Ritmo
- Arranque descriptivo, párrafos medianos.
- Cambio de marcha en "Los números reales": frase corta, stat block, silencio.
- Cierre de dos líneas: "guardá este número".

## 9. Anti-patrones
- No etiquetar de interesante nada: mostrar.
- No adelantar consecuencias ("esto explica el monolito" prohibido acá).
- Máx. 1 apelación directa por sub-sección; cero exclamaciones retóricas.
- No decir "como vas a ver" más de una vez.
