# Trade-offs

1. El catálogo de comidas sacrifica exactitud por disponibilidad al momento de explorar. La verificación real de disponibilidad puede ocurrir al iniciar el pago. Los usuarios ya aceptan que el pago tome un tiempo, así que la demora adicional no afecta la percepción de performance.
    - En la práctica, significa que el catálogo se cachea en el dispositivo del usuario y recibe actualizaciones ocasionales a medida que llegan de los servicios upstream. Además, en realidad no podemos garantizar la exactitud, porque la info de artículos en stock llega por API del _sistema de heladeras inteligentes_ y dependemos de su disponibilidad y conectividad.
    - El segundo aspecto de este trade-off es que también podemos cachear en el backend la respuesta del _sistema de heladeras_. Hay un nivel de confianza alto en la corrección de la caché, ya que la porción de león de las órdenes (en perspectiva futura) la procesará el _sistema de órdenes_, y mantener la caché actualizada no será difícil.
    - Con esta decisión reducimos la presión sobre la API del _sistema de heladeras_, ya que podemos pedir actualizaciones con menor frecuencia mientras la gestión de heladeras no provea suscripciones a actualizaciones.

2. Event sourcing para la gestión de órdenes con historial completo, por integridad de datos y facilidad de investigación de incidentes, sobre almacenamiento relacional/documental. En este caso cambiamos simplicidad y espacio de almacenamiento por historial y visibilidad de operaciones. [ADR 009](../4.ADRs/007%20Event%20sourcing%20usage.md)
    - Event sourcing exige una comprensión más profunda del comportamiento del sistema y un modelado preciso de los eventos. En nuestro caso podemos tratarlo como un beneficio: desarrolladores y BAs modelan el dominio conscientemente.
    - Event sourcing exige soporte de herramientas adicionales que podrían desarrollarse internamente, pero conviene usar soluciones comerciales disponibles para ahorrar tiempo y aumentar el time-to-market.

3. En muchos casos vamos a compensar performance del backend por integridad de datos. Queremos asegurar la precisión en el manejo de órdenes para mantener alta la satisfacción de los usuarios. [ADR 008](../4.ADRs/008%20At%20least%20once%20delivery%20for%20ready%20to%20pay%20order.md)

4. Antes de una expansión mayor del sistema a otros países, conviene usar un proveedor de pagos antes que implementar la comunicación con Visa/MasterCard/AmEx/JCB/Paypal, etc. Así ahorramos tiempo y usamos una única API del proveedor de pagos. Después puede cambiarse, ya que existe un servicio de pagos interno que puede ir migrando paso a paso la comunicación con los sistemas de pago globales cuando sea necesario.
