# Visión general de la solución

## Principios

1. Buscar la simplicidad cognitiva
2. Ante compensaciones, se prefieren extensibilidad y modificabilidad
3. La telemetría es obligatoria
4. Mensajes antes que llamadas directas

## Estilo

Según los principios declarados, el sistema debe ser n-capas con un enfoque por capas dentro de los módulos que asegure la extensibilidad de la funcionalidad. Por los [objetivos de negocio](../1.ProblemBackground/BusinessGoalAndScope.md) declarados (número de usuarios, funcionalidad actual y deseada) y las [restricciones](../1.ProblemBackground/Constraints.md), el estilo de implementación primario de la arquitectura es un **monolito modularizado**, con acento en la alta modularidad para bajar el costo de futuras extracciones hacia servicios independientes.

De acuerdo con los principios declarados, proponemos construir el sistema basado en event sourcing y domain-driven design para los componentes core.

- El event sourcing ayuda a rastrear y razonar sobre los cambios en los modelos de dominio. Es necesario porque hay muchos usuarios externos involucrados, y el sistema debe permitir investigar en detalle cada posible reclamo de los usuarios sobre la toma de decisiones, el proceso de pago y la visibilidad general.
- Domain-Driven Design (DDD) ayuda a controlar la complejidad cognitiva del dominio donde hace falta. Aunque la implementación inicial requiere más esfuerzo que un transaction script o un enfoque tabular, ahorra mucho tiempo en el futuro. DDD también sostiene los principios declarados de simplicidad cognitiva y modificabilidad del sistema diseñado.

Todos los subdominios deben proveer telemetría de uso abundante para tomar decisiones informadas sobre extracción y escalado cuando un componente se vuelva un cuello de botella de la solución.

## Diseño estratégico de dominio

![Diseño estratégico de dominio](../img/FF_StrategicDomainDesign.jpg)

En la imagen anterior presentamos nuestra visión de las responsabilidades de los contextos primarios del sistema.

**Core**

El diferenciador principal del negocio: módulos únicos que sostienen los procesos de negocio. En nuestro caso:

- Meal Catalog: una manera única de mostrar la información de la comida, disponibilidad en heladeras, ingredientes. También se acumulan acá la información de promociones, reviews, etc.
- Ordering: un sistema de catering estándar no serviría acá, porque necesitamos extensibilidad rica y control sobre las órdenes. Órdenes de suscripción, cobro por sistemas de pago online, cupones y promociones, y feedback solo de compradores confirmados: es mucho más fácil de sostener con software a medida.
- Loyalty: hay maneras únicas de enganchar a nuevos usuarios, y las limitaciones de otros proveedores no deben atar a los dueños del sistema.

**Soporte**

Significativo para el negocio, pero herramientas de terceros pueden cubrir el gap con personalización o integración adecuadas.
- Feedback: el sistema debe ser altamente extensible y puede incluir mecanismos de encuestas de otros proveedores. El módulo provee una forma conveniente de gestionar los canales de feedback.
- Scheduling ayuda a trabajar con los eventos recurrentes de las áreas Core y a formar las órdenes de la Ghost Kitchen.

**Genérico**

Los módulos de esta canasta no requieren personalización o la necesitan en medida pequeña; todas las necesidades están cubiertas por productos del mercado.
- Reporting: no hace falta implementar un motor de reportes propio; muchos productos especializados pueden generar todos los reportes necesarios a partir de los datos provistos.
- Pagos: solo construiremos una gateway hacia los sistemas de pago, o incluso elegiremos un proveedor de pagos que maneje toda la comunicación específica con los sistemas de pago.
- Notificaciones: conviene usar servicios ya hechos que lo provean, para ahorrar el tiempo y el dinero de una implementación propia.

## Modelo conceptual

A partir de la descripción del sistema y los requerimientos, construimos el modelo conceptual del _sistema de órdenes_.

![Metamodelo](../img/FF_Metamodel_v1.png)

El _nivel de conocimiento_ describe las reglas de interacción entre actores/entidades

El _nivel operacional_ describe los actores/entidades principales involucrados en los escenarios principales

El metamodelo cubre todos los escenarios de negocio existentes y debe ser capaz de absorber los futuros. Más aún: el metamodelo debería incentivarnos a pensar en nuevos escenarios que se abren en el metamodelo.

Refiriéndonos al diagrama:

_User_ y _User type_ describen los posibles usuarios que pueden interactuar con el sistema. A nivel meta, un suscriptor y un administrador de PoS (o incluso un PoS) no tienen diferencia. Desde la perspectiva operacional, ejecutan algunas _acciones_ sobre una _orden_. Los _tipos de acción_ dependen del _tipo de usuario_, y esas reglas se describen en el nivel de conocimiento. Claramente hay un conjunto de _tipos de acción_ común a todos los _tipos de usuario_, lo que puede llevarnos a la idea de una implementación por comandos para compartir posibilidades entre _tipos de usuario_ de forma conveniente.

Los _tipos de acción_ se ubican por el _lugar_ donde se ejecutan y, por ejemplo, un _PoS_ puede ejecutar implícitamente algunos pasos para llevar una _orden_ al _estado de orden_ deseado.

La _orden_ se forma desde un _menú_ que provee la _ghost kitchen_. Puede haber muchas _ghost kitchens_ con una variedad de _menús_, que a su vez consisten en _comidas_ que pueden ser comunes a muchos _menús_. Para facilitar la navegación, la gestión, el filtrado y otras acciones, todas las _comidas_ se describen por su _tipo de comida_. Cualquier _comida_ puede describirse por un conjunto de _tipos de comida_.

Según el _tipo de orden_ y el _estado de orden_, hay una estrategia de _agendado_ que atiende las reservas y las órdenes recurrentes.

Las _promociones_ se aplican a _menús_ y apuntan a una _comida_ o _tipos de comida_ específicos. Fue intencional: si las _promociones_ se conectaran con las _comidas_, sería difícil fijar promociones que dependan de la _ghost kitchen_ (escenario posible: promociones provistas por una _ghost kitchen_ específica, no por la plataforma en general). El _tipo de promoción_ puede basarse en el _tipo de feedback_ (encuesta, review), pero no se limita al _feedback_, ya que una _promoción_ puede aplicar a todos los usuarios. A la vez, la conexión entre _tipo de promoción_ y _tipo de feedback_ permite al dueño armar programas de engagement de usuarios.

La relación entre _tipo de promoción_ y _tipo de orden_ (y _estado de orden_) ofrece un mecanismo flexible de restricciones posibles para participar en campañas de promoción.

## Composición de componentes y comunicación

![Visión de la solución](../img/FF_system_approach.png)

*Centros de gravedad destacados*

**Apuntar a la simplicidad**

Queremos dar simplicidad inicial al sistema completo sin cerrar la ventana a futuras extracciones de servicios y desarrollo y despliegue independientes.

Agrupar áreas funcionales para beneficiarse de la facilidad de desarrollo y despliegue.

**Apuntar a la modificabilidad**

La segunda parte importante es proveer puntos de extensión y facilidad de modificabilidad para la solución propuesta: las subpartes pueden extraerse y extenderse sin refactoring masivo.

### Composición

- Point of Sale y las apps de Front End pueden ser una o dos aplicaciones distintas que reutilizan los mismos elementos de UI y la misma lógica, porque tienen mucho en común: el operador de la versión PoS impersona a otros usuarios del sistema y recorre el mismo flujo de trabajo.
- Feedback, Loyalty (Promoción/Descuento), catálogo de menús, retiro de comidas: trabajan con la composición de la orden y le aplican distintos "efectos"; por simplicidad de desarrollo y despliegue pueden desarrollarse como módulos del monolito para acelerar. Pero la comunicación entre módulos está descrita de forma que cada módulo puede extraerse como servicio en poco tiempo. El catálogo de menús está destacado por ser el punto focal de esta composición.
- Ordering y Scheduling: atienden el manejo correcto de las órdenes, y tiene sentido implementarlos como subsistema separado desde el principio. Ordering es el punto focal, responsable de la porción de león de las operaciones y de la consistencia de datos.
- El subsistema de compras es responsable de la comunicación con proveedores o sistemas de pago. Actúa como fachada hacia el sistema de pagos y maneja todos los matices de su uso.
- Reporting: motor de reportes y datos históricos para los reportes. Los reportes corren sobre un almacenamiento histórico dedicado para no afectar el almacenamiento de datos operativos. También permite aplicar estrategias efectivas de archivado de datos.
- Notifications: fachada de los sistemas de notificación que se usen; por ejemplo, envío por SMS, emails o notificaciones push in-app.
- Sistemas de pago, Ghost Kitchen, gestión de heladeras inteligentes: sistemas externos con los que el _sistema de órdenes_ se comunica pero que no controla.

### Comunicación y seguridad

- Canales de comunicación seguros entre todos los subsistemas y módulos.
- Control de acceso por atributos introducido desde el principio para todos los módulos.
- La integración con proveedores de identidad de terceros es opcional pero puede ser útil para el engagement, evitando crear una cuenta más. Debe quedar la opción de crear una cuenta independiente para usuarios que desconfían de las cuentas de los gigantes tecnológicos.
