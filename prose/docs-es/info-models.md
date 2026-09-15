# Modelos de información

Nuestra propuesta de arquitectura se basa en event sourcing, mensajería y un desacoplamiento posterior de los módulos del monolito. Por eso no vemos valor en proveer un diagrama relacional con entidades y vínculos entre ellas. En cambio, podemos proveer estimaciones de tamaño para las entidades principales y la frecuencia de los eventos. Con esa información podemos calcular el espacio de almacenamiento requerido y la estimación de ancho de banda, con pronósticos de crecimiento del sistema.

Los siguientes casos representan las partes más importantes para una etapa temprana de la aplicación.

## Consideraciones generales

Una de las mayores ventajas de todo el proceso de gestión de datos es la separación geográfica. Casi todo puede compartirse según las geolocalizaciones de usuarios y heladeras. Cada distrito geográfico lo bastante grande (barrio, ciudad, área suburbana) tendrá su propio set de datos compartidos que no requiere replicación a ningún lado. Las ghost kitchens de Detroit no ofrecerán comidas en Nueva York. Los usuarios viajan todo el tiempo, pero sus pedidos pasados no. En cada área nueva habrá un set único de preferencias según las ghost kitchens presentes. Solo una porción bastante chica de datos necesita ser accesible en cualquier ubicación, como la información de pago. Esta idea y supuesto básicos simplifican el modelo de datos general en cuanto a acceso, replicación, modificación, etc.

## Casos

### Aplicación cliente

Acá, por aplicación cliente entendemos la aplicación móvil y la app del punto de venta, porque se comportan de forma idéntica a nivel conceptual y requieren los mismos eventos y datos.

_¿Por qué es importante?_

La aplicación es el canal principal de comunicación, y el proceso de explorar el catálogo y comprar debe ser rápido y confiable desde la perspectiva del usuario. El acceso a los datos históricos del usuario también debe ser rápido y eficiente. Una aplicación con tiempos de respuesta lentos desalienta al usuario de pedir o pagar comidas, porque puede temer que su información financiera esté comprometida.

#### Intereses de los stakeholders

| Stakeholder | Intereses |
|---------|------|
| Suscriptor | Obtener información del próximo pedido según la agenda |
| | Poder modificar (cambiar\cancelar) el menú programado |
| Usuarios conocidos | Explorar el catálogo sin demoras y verificar la disponibilidad de comidas en las heladeras de una zona seleccionada |
| | Comprar y reservar una comida |
| | Ejecutar la compra con la menor cantidad de clics de interfaz |
| Usuarios ocasionales | Obtener la información nutricional de la comida elegida |
| | Comprar la comida elegida sin esperas significativas por datos de disponibilidad\reserva |
| Administradores de PoS | Ejecutar la compra con la menor cantidad de clics de interfaz |
| Desarrolladores | Simplicidad de los modelos de datos |

#### Diagramas

**Actualizaciones de stock de comidas**

El acento principal está en cómo los datos de comidas disponibles se actualizan en tiempo real en los dispositivos de los clientes. Según el diagrama y el modelo de negocio, las actualizaciones pueden enviarse a los usuarios según su ubicación. La ubicación puede actualizarse cada vez que el usuario abre la aplicación.

![](../img/IM_meal_stock_update.PNG)

En la imagen de arriba se ve el orden de eventos/comandos. Representa cómo la app cliente recibe actualizaciones sobre las comidas ofrecidas y la cantidad en stock.

| Evento\Comando\Query | Descripción | Frecuencia | Tamaño (kb) |
|-------|-----|--------|---|
| Catalog Updated | Evento de notificación a la app cliente de que el catálogo tiene cambios en la oferta de comidas. Nota: las heladeras inteligentes publican el mismo evento. Aunque no sea cierto técnicamente, nuestra ACL puede transformar los datos de las heladeras en este evento para unificar el procesamiento general | Probablemente una vez por día por usuario | 0,1 |
| Meal Stock Updated | Contiene información sobre una comida y el inventario de comidas | Con cada orden realizada. Actualización por lote desde las heladeras inteligentes. La entrega puede optimizarse por la ubicación del usuario. | 0,1-150 |
| Meal Stock Reserved | Avisa al catálogo que una comida fue reservada por un usuario. Ayuda a gestionar el inventario de comidas | Con cada orden realizada | 0,1 |
| Get Catalog (query) | Referencia a un catálogo específico o a todos los catálogos disponibles en la zona del usuario | Cada vez que el usuario empieza a armar un pedido nuevo. 1-2 veces por día por agenda | 0,1 / 150-300 (sin imágenes) |
| Confirm Order by User | Comando que envía la intención del usuario de pedir una comida | Cada vez que el usuario confirma la orden y está por pagar | 0,2 |

TRADE-OFFS:
- _CatalogUpdated_ podría llevar la información de la actualización, como descripción de comida nueva, ingredientes, etc. Parece un buen enfoque, porque es un modelo "push" y los clientes reciben toda la información necesaria sin pedir más datos al backend. Por otro lado, no todos los clientes serán alcanzables ni podrán procesar los datos. Además puede haber varios catálogos, y enviar al cliente el catálogo entero quizá no sea necesario, ya que el cliente puede tener preferencia por un catálogo determinado. Lo más razonable puede ser informar solo el hecho de la actualización, el nombre/id del catálogo, la ubicación.

**Compra de una comida**

![](../img/IM_meal_purchase.PNG)

El diagrama muestra un escenario de día de sol simplificado para representar cómo la información de la orden fluye por el sistema y cómo el usuario recibe la respuesta de la compra. La verificación de cupones queda omitida, porque es una funcionalidad extra. Este caso está fuertemente acoplado al anterior, sobre propagación de cambios de stock.

| Evento\Comando\Query | Descripción | Frecuencia | Tamaño (kb) |
|-------|-----|--------|---|
| Start Order | Se explica solo :) Solo prepara un contenedor para una orden nueva. Nada molesta al backend | No nos importa, es un comando local | N/A |
| Apply Coupon | El usuario aplica un código y todavía no nos importa cuál | No nos importa, es un comando local | N/A |
| Confirm Order by User | El usuario confirma que la orden está formada; es la señal para la app local de que la orden debe enviarse al backend para procesarse | Cada vez que el usuario termina de armar la orden y va a pagar. 1-3 veces por día por usuario (excepto suscriptores) | 0,2 |
| Purchase Order | El sistema de órdenes verifica que la orden pueda entregarse técnicamente (o sea, que haya cantidad suficiente de comidas en la heladera) y el sistema de pago debe confirmar la compra real | 1-3 veces por día por usuario (excepto suscriptores) | 0,2 |
| Order Purchase Confirmed | Se explica solo | Una vez por orden normalmente | 0,1 |
| Meal Stock Updated | El catálogo es informado de que la cantidad de comidas cambió | Con cada orden confirmada, y con actualizaciones de las heladeras inteligentes | 0,2 |
| Order purchased | Confirmación para el usuario y la app cliente de que todo se procesó bien, y de que la heladera o la ghost kitchen quedó informada del deseo del usuario | Una vez por orden normalmente. | 0,1 |

**Cancelación de orden por el usuario**

![](../img/IM_cancel_order_by_user.PNG)

La historia detrás de este diagrama: el usuario puede cancelar cualquier orden y, como hace gmail, podemos inhibir la ejecución de la orden durante 10-30 segundos para darle al usuario la chance de cancelar sin complicaciones como reembolsos e involucramiento de los sistemas de pago. En el caso común, el usuario recibe la notificación de procesamiento de la orden apenas el backend recibe el comando. Pero es totalmente válido postergar las acciones siguientes un tiempo, porque la compra puede ser impulsiva y puede haber una cancelación inmediata.

El caso en que el sistema de pago ya cobró al usuario y ocurre una cancelación se describe en la sección siguiente.

| Evento\Comando\Query | Descripción | Frecuencia | Tamaño (kb) |
|-------|-----|--------|---|
| Start Order | Se explica solo :) Solo prepara un contenedor para una orden nueva. Nada molesta al backend | No nos importa, es un comando local | N/A |
| Cancel order by user | Debemos ocuparnos de dos casos principales: 1) cancelar una orden que aún no se confirmó: sin impacto en el backend. 2) El pedido se envió y luego se canceló. | 2%-5% de todas las órdenes | 0,1 |
| Meal Stock Canceled | - | 2%-5% de todas las órdenes | 0,1 |
| Meal Stock Updated | El catálogo es informado de que la cantidad de comidas cambió | Con cada orden confirmada, y con actualizaciones de las heladeras inteligentes | 0,2 |

**Cancelación de orden programada por el usuario**

Es una situación normal que un usuario prepagara un servicio y luego pueda cancelarlo en cualquier momento. Debemos representarlo también en el sistema, porque los "suscriptores" son el grupo objetivo de Farmacy Food. Entonces un _suscriptor_ debería

![](../img/IM_cancel_scheduled_order_by_user.PNG)

Lo importante acá: al cancelar órdenes programadas no hay impacto en el catálogo de comidas, porque en general el usuario cancela algo que todavía no existe. El proceso de reembolso es sobre todo una inquietud técnica, pero puede haber aspectos de negocio. Tener el comando _ClaimRefund_ es conveniente: podemos procesarlo de distintas maneras según el modelo de negocio.

SUPUESTOS:
- El usuario no puede cancelar comidas que ya se produjeron y entregaron. La cancelación rige desde el siguiente día hábil. Pero es una decisión de negocio. Las comidas pueden pasarse a un stock disponible para todos.

RIESGOS:
- La ghost kitchen prepara comidas hasta 3 días por adelantado según la agenda. La probabilidad es baja, porque FF apunta a comida fresca y saludable y (esperamos) desperdicio mínimo.


#### Inquietudes de ciclo de vida

Asumimos que las siguientes entidades estarán presentes y almacenadas en el dispositivo del usuario.

- **El catálogo de comidas** vive alrededor de 24 horas o menos en el dispositivo del usuario y después debe actualizarse forzadamente.
- **El historial de órdenes** en los dispositivos locales puede vivir alrededor de un mes para permitir re-pedidos rápidos. Las órdenes programadas deben tener la misma vida útil.
- **Las notificaciones** sobre pedidos de comidas viven alrededor de 24 horas.
- **Las notificaciones de promociones** están disponibles durante toda la campaña o hasta borrarlas manualmente.

### Procesamiento de órdenes en el backend

_¿Por qué es importante?_

El procesamiento de órdenes (compras simples u órdenes del planificador) es la parte del sistema que genera la plata. Queremos revisar las partes relacionadas e identificar las piezas móviles principales, cuarentenas, puntos sensibles y otras inquietudes posibles.

Un modelo claro de cómo funciona facilita la implementación y permite tratar los riesgos (de negocio y técnicos) temprano, durante el diseño del sistema.

#### Intereses de los stakeholders

| Stakeholder | Intereses |
|---------|------|
| Todos los tipos de usuario | Procesamiento preciso con feedback a tiempo del resultado de la compra |
| Ghost kitchen | Información sobre las órdenes próximas |
| Dueño | Analítica sobre patrones de uso |


#### Diagramas

Muchos aspectos ya se tocaron en diagramas anteriores, y a esta etapa del desarrollo podemos referenciarlos sin cambios.

**Cancelación de orden programada por el sistema de pago**

![](../img/IM_cancel_order_by_payment_system.png)

La parte más interesante son los eventos del _System order_. El pago puede rechazarse o demorar tanto que deba rechazarse por timeout. En ambos casos el usuario debe ser notificado del fallo.

Lo más importante acá es notificar al usuario de que la compra falló. Después, el backend no debe guardar información operativa sobre la compra; solo el dominio de reporting sabrá del intento fallido. La app del usuario puede tratar _OrderPurchaseRefused_ como la señal para reintentar la última orden desde el historial guardado localmente. El usuario solo necesita confirmar un nuevo intento.

PUNTOS SENSIBLES:
- El negocio debe decidir cuándo puede cancelarse una orden y qué hacer con los fondos.
- Si una comida se produjo y el usuario no la retiró, ¿puede liberarse al catálogo común como comida disponible?

**Preparación de órdenes programadas para suscriptores**

Queremos introducir la orden programada, que representa la intención del usuario sobre pedidos futuros ya prepagados. La responsabilidad del _Scheduler_ es encontrar esas órdenes y proveer un "reporte" a la Ghost Kitchen sobre las comidas a preparar y despachar. Informar a los usuarios sobre las comidas en preparación y su despacho a las heladeras sostiene el objetivo de negocio de engagement y satisfacción. Usuario informado, usuario contento.

![](../img/IM_preparing_scheduled_orders.PNG)

| Evento\Comando\Query | Descripción | Frecuencia | Tamaño (kb) |
|-------|-----|--------|---|
| Get Scheduled Orders | | típicamente una vez por día para dar info de reposición a la cocina, o bajo demanda | 2-5 |
| Prepare Orders | | típicamente una vez por día para dar info de reposición a la cocina, o bajo demanda | 20-50 |
| OrderDispatched | | típicamente 0-2 veces por día por heladera. Viene de la especificidad del dominio: la entrega no ocurre varias veces por día por pedido. | 10-30 |
| OrderPlacedInFridge | | típicamente 0-2 veces por día por heladera. Viene de la especificidad del dominio: la entrega no ocurre varias veces por día por pedido. | 10-30 |
| OrderAvailableForPicking | | típicamente 0-3 veces por día por usuario | 0,1 |

SUPUESTOS:
- Las heladeras pueden reportar reposiciones de stock.
- Las comidas tienen ids únicos que permiten asociar una comida a un usuario. Es necesario para comidas personalizadas (por ejemplo, una lasaña sin lactosa)
- La ghost kitchen puede reportar las comidas preparadas.

TRADE-OFFS:
- Las órdenes programadas podrían descomponerse y crearse por adelantado para todo el período agendado. Eso inflaría la base de órdenes y exigiría una marca especial que indique cuándo ejecutar cada orden. Podría ser más simple en cuanto al procesamiento de órdenes, porque todas las órdenes necesarias ya están. Pero trae problemas cuando la agenda cambia o se cancela: se requieren múltiples actualizaciones. Por el otro lado, la agenda puede ser una estructura lógica según la cual cada día se generan y procesan órdenes nuevas. Es mucho más fácil manejar cambios de agenda, pero introduce reglas adicionales para la parte de procesamiento de pagos. Tales órdenes deben marcarse como prepagadas. Puede resolverse con una campaña promocional especial "suscriptor".

#### Inquietudes de ciclo de vida

Todos los eventos terminan en el Event Store y se conservan indefinidamente, o según una política de retención que podría ser de 1-2 años. Pero toda la idea del event sourcing es conservar los eventos para siempre, para análisis futuros que quizá no se necesiten al momento de recolectar los datos.

### Campañas promocionales

_¿Por qué es importante?_

Uno de los objetivos de negocio es expandirse a otras áreas y convertir ocasionales en suscriptores. Las campañas promocionales bien usadas son una gran palanca para el crecimiento de la base de usuarios y hacen que los usuarios usen la aplicación una y otra vez.

#### Intereses de los stakeholders

| Stakeholder | Intereses |
|---------|------|
| Todos los tipos de usuario | Poder usar el material promocional de las campañas |
| Suscriptores, usuarios conocidos | Información sobre puntos de bonificación y cómo usarlos |
| Dueño | Fuente de analítica sobre involucramiento, uso, gasto de puntos de bonificación |
| | Popularidad de las comidas ofrecidas |
| Administradores de promociones | Facilidad para crear y hacer seguimiento de campañas |

#### Diagramas

TBD

#### Inquietudes de ciclo de vida

Todas las campañas se conservan en el sistema al menos 1-2 años para revisar cómo funcionaron en promociones estacionales (por ejemplo).

Aplicación según los plazos de cada campaña.

### Cantidad de comidas vendidas

_¿Por qué es importante?_

Una aplicación ultrarrápida y campañas brillantes no sirven de nada si no hay información sobre las comidas en stock, para que los usuarios aprovechen de verdad la app y las promos. Debemos esforzarnos por dar la información más actual posible sobre las comidas disponibles.

Las ghost kitchens (las de terceros también) pueden obtener información sobre los artículos realmente vendidos y retirados (lo primero no siempre implica lo segundo). Puede ayudarlas a planear mejor la producción para el día o los dos siguientes.

#### Intereses de los stakeholders

| Stakeholder | Intereses |
|---------|------|
| Todos los tipos de usuario | Información actual de las comidas disponibles, para evitar la frustración de que, tras varios pasos de compra en la app, aparezca la notificación de sin-stock. |
| Dueño | Aumentar el nivel de satisfacción de los usuarios |
| Ghost kitchen | Información sobre artículos realmente vendidos y despachados |
| Desarrolladores | Evitar race conditions y complejidad innecesaria en la actualización de datos |

#### Diagramas

**Compra de una comida**

(esta es la copia de uno de los escenarios anteriores)

![](../img/IM_meal_purchase.PNG)

El diagrama representa un escenario de día de sol simplificado para mostrar cómo la información de la orden fluye por el sistema y cómo el usuario recibe la respuesta de la compra. La verificación de cupones queda omitida, porque es una funcionalidad extra. Este caso está fuertemente acoplado al anterior, sobre propagación de cambios de stock.

| Evento\Comando\Query | Descripción | Frecuencia | Tamaño (kb) |
|-------|-----|--------|---|
| Start Order | Se explica solo :) Solo prepara un contenedor para una orden nueva. Nada molesta al backend | No nos importa, es un comando local | N/A |
| Apply Coupon | El usuario aplica un código y todavía no nos importa cuál | No nos importa, es un comando local | N/A |
| Confirm Order by User | El usuario confirma que la orden está formada; es la señal para la app local de que la orden debe enviarse al backend para procesarse | Cada vez que el usuario termina de armar la orden y va a pagar. 1-3 veces por día por usuario (excepto suscriptores) | 0,2 |
| Purchase Order | El sistema de órdenes verifica que la orden pueda entregarse técnicamente (o sea, que haya cantidad suficiente de comidas en la heladera) y el sistema de pago debe confirmar la compra real | 1-3 veces por día por usuario (excepto suscriptores) | 0,2 |
| Order Purchase Confirmed | Se explica solo | Una vez por orden normalmente | 0,1 |
| Meal Stock Updated | El catálogo es informado de que la cantidad de comidas cambió | Con cada orden confirmada, y con actualizaciones de las heladeras inteligentes | 0,2 |
| Order purchased | Confirmación para el usuario y la app cliente de que todo se procesó bien, y de que la heladera o la ghost kitchen quedó informada del deseo del usuario | Una vez por orden normalmente. | 0,1 |

## Estimaciones de uso y costos

[Documento](https://github.com/ldynia/archcolider/blob/master/3.ViewsAndPerspectives/docs/Data&PayloadsEstimates.xlsx?raw=true)

## Inquietudes de backup

- No necesitamos hacer backup de los datos de órdenes en la MQ, porque la app cliente debe implementar un mecanismo de timeout para enviar pedidos y recibir respuestas. Si no hay confirmación de aceptación o rechazo del pago, el usuario debe ser notificado y ofrecérsele un reintento. Para la MQ podemos confiar en el modelo de persistencia integrado del servicio para el escenario de reinicio.
- El EventStore requiere un mecanismo de backup, porque es información vital para el sistema. Las proyecciones generadas por el EventStore no requieren backup, ya que pueden reconstruirse desde los eventos del EventStore. Pero podemos respaldar las proyecciones para acelerar el escenario de recuperación.
- El servicio de reportes requiere un mecanismo de backup para conservar datos operativos e históricos para análisis
- Kafka no requiere mecanismos adicionales de backup en esta etapa; podemos confiar en sus mecanismos integrados.
