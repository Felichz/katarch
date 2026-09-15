# Vista de concurrencia

Este documento describe la estructura de concurrencia del sistema. Mapea los elementos funcionales a unidades de concurrencia e identifica las partes del sistema que pueden ejecutarse concurrentemente. El documento demuestra cómo se coordinan y controlan los elementos del sistema.

La vista de concurrencia se usa para describir la estructura y restricciones de concurrencia y estado del sistema. Implica definir qué partes del sistema pueden correr al mismo tiempo y cómo se controla eso. La vista de concurrencia define cómo los elementos funcionales del sistema se empaquetan en procesos del sistema operativo y cómo los procesos coordinan su ejecución.

## Casos

### Integridad del catálogo de comidas disponibles

![](../img/FF_concurency_front.png)

Los puntos sensibles generales que identificamos acá son:
- Actualizar el catálogo local de los usuarios
- Actualizar el catálogo central con datos de los usuarios
- Actualizar el catálogo central con datos de las cocinas

**Actualización del catálogo local para usuarios**

Las actualizaciones del *catálogo central* se basan en los pedidos de los usuarios y deben ser lo más actuales posible. Confiamos en la consistencia e integridad de los datos del backend porque los datos de la *Ghost Kitchen* y de las *heladeras inteligentes* pueden ser poco confiables y la frecuencia de actualización es desconocida al momento de modelar la arquitectura. Asumimos que los datos de las *heladeras inteligentes* llegan una vez cada *n* minutos, y no esperamos interfaces de streaming para mantener el catálogo actualizado.

**Actualización del catálogo central de menús**

La *Ghost Kitchen* provee actualizaciones cuando las comidas están listas para retiro — asumimos que esto pasa una o dos veces por día. Tomamos esos datos y actualizamos el *catálogo central de menús* con la cantidad de comidas liberadas.

Los pedidos de los usuarios se restan de la cantidad disponible de comidas monitoreadas en el backend.

Surgen inquietudes adicionales cuando haya varias instancias del catálogo de menús en el sistema, pero lo vamos a resolver dividiendo el catálogo por geolocalización. Ayudará a mantener el catálogo chico y consistente dentro del área (ciudad).

El punto sensible principal viene de las actualizaciones concurrentes de los usuarios, y tenemos que resolverlo. Una de las soluciones puede ser procesar las órdenes con un *modelo de actores*. Un actor por heladera ayuda a mantener la integridad de la cantidad de comidas disponibles en una heladera concreta.

PREGUNTAS:
- No sabemos qué datos proveen las heladera(s): ¿el total de comidas o el delta? Esperamos que sea el total.

RIESGOS:
- Muchos usuarios en el área y necesidad de calcular las comidas disponibles del local. Un local puede tener varias heladeras. Debe haber un modelo para manejar esto.
- Una complejidad enorme en el sistema si el sistema de heladeras inteligentes no suma la disponibilidad de comidas de un local específico. Lo más probable es que no exista esa funcionalidad y que las heladera(s) solo compartan la misma ubicación — entonces tendríamos que implementarlo nosotros.

### Procesamiento de órdenes en el backend

Una de las inquietudes que puede surgir en desarrolladores que nunca trabajaron con event sourcing es cómo manejar múltiples órdenes que llegan simultáneamente. ¿Habrá race conditions, deadlocks y otras cosas feas?

Según el enfoque de arquitectura propuesto, los desarrolladores pueden reconocer el [patrón actor](https://en.wikipedia.org/wiki/Actor_model): el procesamiento de órdenes pasa de un actor a otro, una por una. Cada actor puede emitir eventos con información adicional y mantener su estado interno correcto.

![](../img/FF_concurency_order_processing.PNG)

Por ejemplo, restar la cantidad de comidas del stock disponible ocurre en un actor; después se crea un evento nuevo y se pasa al *sistema de órdenes*. El actor conectado con el catálogo de comidas tiene una sola responsabilidad simple y puede procesar eventos muy rápido. Teniendo en cuenta la naturaleza del negocio, podemos decir que habrá un actor por cada heladera con representación lógica en el sistema, y el usuario pedirá comida de una heladera específica (más que de una heladera agregada).

El sistema de órdenes, entre muchas cosas, verifica la posibilidad de cobrar, y lo hace con ayuda de un sistema de cola de mensajes. Cuando la comida se compra, el actor de la heladera confirmado puede ignorar tranquilamente el mensaje (la deducción ya ocurrió) o incrementar el valor de comidas disponibles de esa heladera.

Los eventos de compra se publican a un sistema de streaming basado en log. La parte responsable de informar la disponibilidad general puede escuchar los eventos y actualizar su estado interno según corresponda, sin race conditions ni locks.

El streaming de eventos también implica que cada agregado tiene un número de versión. Eso nos ayuda a evitar locks (con ayuda de los actores) en el código o en el almacenamiento.

![](../img/FF_concurency_orders.png)

**Procesamiento de órdenes** — punto sensible. Nos preocupa la velocidad de procesamiento, porque esperamos trabajar con límites de tiempo en el procesamiento de órdenes. El módulo de órdenes procesa la orden (podría verificar integridad) y envía eventos al *Payment Tracker*, que debe reenviar los datos al procesador externo de *pagos*. Se ve bien para la primera iteración — no esperamos miles de pedidos por minuto durante el primer año o dos. No hace falta actualizar datos que usan varios servicios.

Tener múltiples lectores para la cola de órdenes es seguro porque hay mensajes sobre eventos (algo que ya ocurrió). La idea de fondo: puede haber varias colas por geolocalización (ciudades o distritos) que aceleren el procesamiento.

**Scheduling** es seguro porque lee datos y puede trabajar a su propio ritmo. Las *Ghost Kitchens* no necesitan actualizaciones en tiempo real: preparan comida para el uno o dos días siguientes y solo necesitan información de reposiciones.

### Campañas promocionales

No esperamos problemas con las promociones: son actualizaciones de una sola vía desde la parte central y los usuarios no influyen en esto. No esperamos promociones basadas en el total de menús vendidos.

Desde la perspectiva del operador no queremos complicarla ahora involucrando CRDT (Conflict-free Replicated Data Types): las campañas no cambian seguido y no habrá decenas de operadores. Preparar campañas en Google Spreadsheet o Excel de Office 365 cumple. Vamos a consumir solo el resultado final, sin proveer herramientas para crearlas y modificarlas dentro del sistema diseñado.

### Otros subsistemas

Las demás partes del sistema deben consumir datos del streaming basado en log: recibirán todos los mensajes en algún orden y pueden procesarlos sin locks. Esos sistemas pueden necesitar balanceadores/routers internos si la cantidad de mensajes es enorme. Aun así es fácil de implementar, porque los mensajes deben contener toda la información necesaria para el procesamiento.

## Checklist para trabajo posterior

- ¿Hay un modelo de concurrencia claro a nivel sistema?
- ¿Tus modelos están en el nivel correcto de abstracción? ¿Te enfocaste en los aspectos arquitectónicamente significativos?
- ¿Puedes simplificar el diseño de concurrencia?
- ¿Todas las partes interesadas entienden la estrategia de concurrencia general?
- ¿Mapeaste todos los elementos funcionales a un proceso (y thread si hace falta)?
- ¿Tienes un modelo de estado para al menos un elemento funcional de cada proceso y thread? Si no, ¿estás seguro de que los procesos y threads interactuarán de forma segura?
- ¿Definiste un conjunto adecuado de mecanismos de comunicación entre procesos para soportar las interacciones definidas en la vista funcional?
- ¿Todos los recursos compartidos están protegidos contra corrupción?
- ¿Minimizaste la comunicación y sincronización entre tareas necesarias?
- ¿Tienes hot spots de recursos en el sistema? Si es así, ¿estimaste el throughput probable y es suficiente? ¿Sabrías reducir la contención en esos puntos si más adelante te vieras obligado?
- ¿El sistema puede llegar a deadlock? Si es así, ¿tienes una estrategia para reconocerlo y tratarlo cuando ocurra?
