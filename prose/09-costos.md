# 09 · La factura anual, al centavo (costos)

## 1. Trabajo de la sección
Cerrar el argumento con la variable que casi nadie presenta: el costo total anual.
Mostrar el método (volumetría → forecast → TCO por escenario) y el dato
contra-intuitivo: lo más caro no es el hardware, es el software alquilado y las
horas de mantenimiento.

## 2. Estado mental
- Antes: asume que los servidores dominan la factura; nunca vio una arquitectura
  con precio pegado.
- Después: sabe derivar bytes/frecuencias antes de elegir máquinas, vio los tres
  escenarios (12.248 / 12.548 / 22.481 USD), entiende por qué DataDog+Tableau
  ganaron a lo "gratis", y aprendió a leer los supuestos de una planilla.
- Pregunta: "¿qué decisiones sostienen todo esto?" → S10 (mapa).

## 3. Postura del narrador (derivada de 00-background)

- Trata la planilla como documento primario: los supuestos crudos (tráfico uniforme,
  sin compresión, 1 TB fijos) se muestran como fortaleza auditable, no como defecto
  a disimular.
- La renuncia económica central se enuncia seca: no montar herramientas propias,
  porque horas de desarrollador > suscripción. El giro del review de 4 MB se cuenta
  UNA vez, sin anuncio previo ("ojo, esto sorprende" prohibido).
- Sin clase de finanzas: el TCO va con chip; la prosa usa el concepto y sigue.

## 4. Hechos duros
- Volumetría: mensajes con peso y frecuencia (confirmar orden 0,2 kb 1–3/día;
  catálogo 500–700 kb 1 descarga/día, vive 24 h; stock 0,1–150 kb; cancelación
  0,1 kb 2–5%; despacho 20–50 kb 0–2/día/heladera; review con foto ~4 MB, 10%
  escribe, 5% reclama).
- Forecasts: base de datos ~3,96 GiB/mes y tráfico ~16,5 GiB/mes en el escenario
  proyectado (1.000 req/día ≈ 30.000 registros/mes).
- Supuestos a la vista: tráfico uniforme ("podría ser hasta 60% menor"), sin
  compresión ("con GZIP bajaría significativamente"), DynamoDB dimensionada a 12
  meses: 1 TB fijos = 3.072 USD/año, casi lo mismo que todas las máquinas (3.115 USD).
- Totales: 12.248 USD (mínimo), 12.548 USD (proyectado), 22.481 USD (rápido ×10);
  ~1.000 USD/mes en el base.
- Ítems más caros: monitoreo (DataDog 3.336 USD/año) y reporting (Tableau 1.440
  USD/año), cerca del 40% del presupuesto; alternativas comparadas: Grafana/ELK
  (descartados por mantenimiento propio), Power BI (solo si suscripción Microsoft),
  KoolReport (PHP).
- Las cifras del artículo salen de las planillas xlsx del repo (1y-min-tco, database
  forecast, traffic forecast).

## 5. Decisiones de enseñanza
- Orden: volumetría (método) → forecasts (resultados) → supuestos (honestidad) →
  totales (stats) → el giro DataDog/Tableau → lección de presupuesto (callout).
- Las dos figuras de forecast sin guía profunda (compactas): son gráficos simples;
  la profundidad va en la tabla de volumetría.
- La tabla de volumetría ES el corazón: los forecasts son su consecuencia.

## 6. Conexiones
- "~10 comidas/semana" (S1) y volumetría de cancelaciones (S6)/reembolsos (S7) →
  las frecuencias de la tabla.
- "<1 req/s" (S1) → los escenarios de la planilla (500/1.000/10.000 req/día).
- "Máquinas más baratas" (S8, log stream) → el costo como criterio de diseño.
- Monitoreo/reporting alquilados → S5 (genérico se alquila).
- El callout final (costo real incluye mantenimiento) → método S11 paso 4.

## 7. Metáforas (máx 2)
- "La factura anual" (marco económico de la sección; nada de imaginistería extra).
- "Gigantes escondidos" para los reviews de 4 MB (una sola vez).

## 8. Ritmo
- Arranca con el dato del equipo ("pocas entregas incluyen el costo"), tabla al
  centro, giro del review, stats block, cierre con callout.
- Los stats block hacen de silencio: números solos, sin prosa arriba.

## 9. Anti-patrones
- No convertirlo en clase de finanzas: TCO va con chip, la prosa lo usa.
- No repetir "transparencia" como publicidad del equipo: se muestra con los
  supuestos, no se proclama.
- Cero grimas ("ojo, te va a sorprender"): el giro del review se cuenta seco.
