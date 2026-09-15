# Enfoque del sistema

## Decisiones de diseño

### Enfoque orientado a servicios

La propuesta principal es construir servicios grandes que representen las partes lógicas del sistema. Servicios grandes independientes deben ser fáciles de desarrollar, probar y desplegar. Los servicios identificados (separados por [bounded context](https://en.wikipedia.org/wiki/Domain-driven_design#Bounded_context)) comparten atributos de calidad comunes, así que el mismo conjunto de tácticas puede aplicarse a todos. Todas esas actividades deben facilitar el lanzamiento del software y reducir el [time-to-market](https://en.wikipedia.org/wiki/Time_to_market).

![](../img/FF_system_approach.png)

Como proponemos un monolito modularizado con modificación posterior hacia servicios, cada parte tiene su(s) atributo(s) de calidad propio que hay que atender primero. Además, queremos señalar que los atributos de calidad globales del sistema deben resolverse antes que nada.

#### Atributos de calidad del sistema

**1 Simplicidad**

Queremos dar simplicidad inicial al sistema completo sin cerrar la ventana a la extracción futura de servicios con desarrollo y despliegue independientes.

Agrupar las áreas funcionales del sistema beneficia la facilidad de desarrollo y despliegue.

**2 Modificabilidad**

La segunda parte importante es proveer puntos de extensión y facilidad de modifi­cabilidad para la solución propuesta: las subpartes pueden extraerse y extenderse sin refactoring pesado.

#### Apps de front-end

**1 Usabilidad**

La aplicación debe ser fácil de usar para usuarios de un amplio rango de edades. El nivel de entrada debe ser bajo. La navegación del catálogo de comidas debe ser sencilla y el proceso de compra, obvio. La aplicación debe guiar a los usuarios en las actividades principales.

**2 Performance**

La aplicación debe mostrar la información principal con la menor demora posible. La velocidad de red no debe afectar explorar el catálogo ni armar la canasta.

**3 Autonomía**

Complementa el atributo de performance y asegura el funcionamiento del Point of Sale (PoS) en caso de desconexión o latencia de red alta.

#### Subsistema de catálogo de comidas

**1 Extensibilidad**

El subsistema de catálogo de comidas arranca como monolito modularizado y debe soportar extensibilidad. Esto permite agregar funcionalidades mientras el sistema madura y el modelo de negocio demuestra viabilidad. La extensibilidad no solo se ocupa de agregar partes nuevas, sino también de extraer las que crezcan lo suficiente como para vivir como servicio independiente.

**2 Mantenibilidad**

La base de código debe seguir buenas prácticas y usar los patrones necesarios para priorizar la extensibilidad. La mantenibilidad incluye tests, métricas y health checks para facilitar el mantenimiento desde la perspectiva de código y de operaciones.

**3 Disponibilidad**

Sin buena disponibilidad no hay flujo de caja, así que también es un atributo importante. Queremos aclarar que no debe confundirse con survivability: sigue siendo una prueba del modelo de negocio, y el reinicio del servicio, una caída corta y cosas así siguen siendo posibles. La disponibilidad se resuelve con reinicios y escala vertical. En etapas posteriores puede volverse más importante y se involucrarán otras tácticas arquitectónicas.

En general, el sistema debe estar disponible aunque la performance se degrade.

#### Subsistema de procesamiento de órdenes

**1 Confiabilidad**

La transparencia y las respuestas precisas son el tema central de este servicio. Los usuarios deben estar informados del estado y resultado de la compra. Este atributo de calidad atiende los requisitos de satisfacción del usuario y mantiene a usuarios y demás partes del sistema informados del proceso de compra, que impacta en muchos otros subsistemas.

**2 Integridad**

La integridad de datos es importante cuando hablamos de flujo de caja: la información sobre la compra debe ser precisa para evitar cobros dobles, pagos perdidos, etc. Evitar la corrupción del estado de pago es esencial.

#### Purchase gateway

**1 Seguridad**

Los datos y operaciones de pago deben tener el nivel máximo de seguridad, porque impactan en la confiabilidad de todo el sistema. El envío de información sensible de pago debe estar asegurado. La comunicación con los proveedores de pago también debe imponer este atributo.

**2 Disponibilidad**

No poder pagar genera pérdidas directas de dinero, porque todo el negocio se basa en vender. Los pedidos de pago deben procesarse con la máxima prioridad.

#### Subsistema de reporting

**1 Confiabilidad**

El sistema de reporting está en la categoría de soporte, y hay que pensar en conservar el histórico. El tema central acá no es perder datos, porque son una fuente valiosa de información para decisiones futuras del negocio.

#### Subsistema de notificaciones

**1 Confiabilidad**

El sistema de notificaciones también está en la categoría de soporte y debe ser lo bastante confiable como para enviar notificaciones a los usuarios. El envío lo provee una plataforma, y esa funcionalidad debe estar disponible para el resto de los componentes si la necesitan.

### Servicios modularizados

La decisión importante acá es aislar la comunicación entre módulos internos y hacerla tan transparente como sea posible (fingiendo que hay una conexión de red). También puede parecer un monolito altamente modularizado.

![](../img/FF_Modularization.PNG)

![](../img/FF_ModularizationExtraction.PNG)

La decisión de extraer módulos debe tomarse según métricas y tendencias que muestren que algunos módulos tienen más presión que otros. El [escalado vertical](https://www.esds.co.in/blog/vertical-scaling-horizontal-scaling/) es la forma preferida de manejar la carga durante los primeros meses o años de vida del sistema. Cuando la vertical ya no sea opción, empezaremos a [escalar horizontalmente](https://www.esds.co.in/blog/vertical-scaling-horizontal-scaling/).

### Event sourcing

Event sourcing para el servicio de gestión del estado de órdenes (incluyendo el rastreo de pagos) da confianza en el historial de cambios de una orden y de cómo se pagó. Las órdenes son un área sensible que exige atención especial a los cambios. Event sourcing ayuda a reconstruir las situaciones que llevaron a errores. También existe la posibilidad de reconstruir la pila de eventos desde el principio con una estrategia de ajuste adicional.

Reconstruir la pila de eventos para las entidades del dominio puede ser útil en caso de posibles migraciones de datos durante la fase activa de desarrollo. No todos los requisitos se conocen desde el principio, y aun así queremos tener el historial completo para análisis.

![](../img/FF_OrdersAndScheduler.PNG)

### Comunicación basada en log para la propagación de información entre servicios

La comunicación entre servicios puede implementarse de muchas maneras. Hay un anti-patrón que queremos evitar en un enfoque orientado a servicios: [spaghetti with meatballs](https://www.youtube.com/watch?v=6Fsd_LpwmFU&list=PLfaCH6hS1K2ID0mVFhshV2GjMlrBYLZQ7&index=4). Queremos limitar la comunicación directa entre servicios en el caso de actualizar servicios de soporte como reporting o mensajería. De hecho, nos inspiraron las [ideas de M. Kleppmann](https://martin.kleppmann.com/2015/05/27/logs-for-data-infrastructure.html) sobre resolver la complejidad con streams basados en log.

El beneficio principal es que cada servicio puede consumir datos a su propio ritmo, de forma independiente. Eso relaja los requisitos de disponibilidad y performance de algunos servicios, lo que también permite comprar instancias de despliegue más baratas.

![](../img/FF_LogBasedStream.PNG)

### Health checks basados en escenarios de caminos críticos de negocio

El monitoreo es esencial, pero las métricas de hardware/red no dan información sobre la disponibilidad real del sistema.

Durante el Quality Attribute Workshop, esos escenarios se identificarán y listarán en el documento correspondiente. Los escenarios de camino crítico pueden lanzarse desde un sistema supervisor que verifique la corrección del resultado y el tiempo de procesamiento. La medición de tiempos mostrará tendencias sobre cuándo pensar en escalar en la forma apropiada (vertical/arriba u horizontal/afuera).

### Almacenamiento de datos independiente para reporting

Queremos proteger la performance y la presión sobre la base operativa desde el principio y planificar los servicios de reporting en consecuencia. Muy a menudo, el reporting trabaja sobre el mismo almacenamiento que la base operativa. Las políticas de información pueden exigir guardar datos por 3-5 años o más; normalmente esos datos quedan en la base operativa, lo que degrada la performance y complica muchísimo las migraciones.

En esta solución, el servicio de reporting construye su propio almacenamiento con separación clara de datos operativos y archivados para asegurar los tiempos de ejecución de los reportes. La implementación toca:
- recolección de datos desde el stream de logs
- mapeo de eventos a read-models para el motor de reporting
- ejecución de políticas de retención para los datos almacenados

No tiene sentido construir un servicio de reporting propio, y una buena opción puede ser Apache Superset.

## Alternativas

Una serie de alternativas que quedaron rechazadas por ahora.

### Microservicios desde el inicio

El enfoque de microservicios exige mucha atención a la infraestructura, a la separación de responsabilidades y, preferentemente, un modelo de dominio estable y conocido. Para el *sistema de órdenes* no aplica, y el esfuerzo de los desarrolladores se desperdiciaría o sería invisible para el usuario final.

Los microservicios deberían crecer naturalmente según la necesidad.

### Monolito

Este enfoque es bueno para una prueba de concepto y las etapas tempranas de una startup. Acá ya vemos cierto nivel de madurez, así que un monolito puro sería una simplificación excesiva.

## Composición de componentes

![Visión de la solución](../img/FF_system_approach.png)

*Centros de gravedad destacados*

**Apuntar a la simplicidad**

Queremos dar simplicidad inicial al sistema completo sin cerrar la ventana a futuras extracciones de servicios y desarrollo y despliegue independientes.

Agrupar áreas funcionales para beneficiarse de la facilidad de desarrollo y despliegue.

**Apuntar a la modificabilidad**

La segunda parte importante es proveer puntos de extensión y facilidad de modificabilidad para la solución propuesta: las subpartes pueden extraerse y extenderse sin refactoring masivo.

### Composición

- Point of Sale (PoS) y las apps de Front End pueden ser una o dos aplicaciones distintas que reutilizan los mismos elementos de UI y la misma lógica, porque tienen mucho en común: el operador de la versión PoS impersona a otros usuarios del sistema y recorre el mismo flujo de trabajo.
- Feedback, Loyalty (Promoción/Descuento), catálogo de menús, retiro de comidas: trabajan con la composición de la orden y le aplican distintos "efectos"; por simplicidad de desarrollo y despliegue pueden desarrollarse como módulos del monolito para acelerar. Pero la comunicación entre módulos está descrita de forma que cada módulo puede extraerse como servicio en poco tiempo. El catálogo de menús está destacado por ser el punto focal de esta composición.
- Ordering y Scheduling: atienden el manejo correcto de las órdenes, y tiene sentido implementarlos como subsistema separado desde el principio. Ordering es el punto focal, responsable de la porción de león de las operaciones y de la consistencia de datos.
- El subsistema de compras es responsable de la comunicación con proveedores o sistemas de pago. Actúa como fachada hacia el sistema de pagos y maneja todos los matices de su uso.
- Reporting: motor de reportes y datos históricos para los reportes. Los reportes corren sobre un almacenamiento histórico dedicado para no afectar el almacenamiento de datos operativos. También permite aplicar estrategias efectivas de archivado de datos.
- Notifications: fachada de los sistemas de notificación que se usen; por ejemplo, envío por SMS, emails o notificaciones push in-app.
- Sistemas de pago, Ghost Kitchen, gestión de heladeras inteligentes: sistemas externos con los que el *sistema de órdenes* se comunica pero que no controla.

### Comunicación y seguridad

- Canales de comunicación seguros entre todos los subsistemas y módulos.
- Control de acceso por atributos introducido desde el principio para todos los módulos.
- La integración con proveedores de identidad de terceros es opcional pero puede ser útil para el engagement, evitando crear una cuenta más. Debe quedar la opción de crear una cuenta independiente para usuarios que desconfían de las cuentas de los gigantes tecnológicos.

## COTS

### Event Store

Event sourcing es una técnica que puede implementarse con varias herramientas y enfoques. La mayoría tiene una sobrecarga significativa en soportar la sincronización entre modelos de escritura y lectura. Por suerte está el proyecto EventStore que hace el trabajo aburrido por nosotros. Podemos empezar con la versión open source (OSS) y migrar después a Software as a Service (SaaS). [ADR 007](../4.ADRs/007%20Event%20sourcing%20usage.md)

### Kafka

La herramienta más conocida y soportada para streaming por log. No hay muchas opciones para elegir, aunque supere la necesidad actual en performance y otras funciones.

### RabbitMQ

Decidimos usar RabbitMQ como broker de mensajería porque permite entrega at-least-once y ofrece acknowledgment de mensajes. Además, es una solución de mensajería muy usada en la comunidad IT, con enorme soporte de lenguajes y tutoriales excelentes. Según varias comparativas de herramientas de mensajería, permite transacciones y persistencia de mensajes integrada.

### DataDog vs Grafana vs ELK

Datadog es un servicio de monitoreo para aplicaciones a escala de nube: monitorea servidores, bases de datos y herramientas mediante una plataforma SaaS de suscripción económica. Como se integra fácilmente y por poco dinero, la ganancia técnica en monitoreo y trazado es enorme, así que decidimos ir con DataDog. Las alternativas que consideramos fueron Grafana y el stack ELK, pero ambas exigen mantenimiento por parte de los desarrolladores, mientras que DataDog, al ser SaaS, lo descarga de ellos.

### Tableau vs Power BI vs koolreport

Tableau es el preferido por ser de fácil integración.
Power BI puede usarse si el dueño del negocio tiene suscripción Microsoft.
KoolReport es un framework de reporting open source en PHP, intuitivo y flexible, para entregar reportes más rápido.

## Temas pendientes

- Seguridad
- Cumplimiento local de privacidad de usuarios
