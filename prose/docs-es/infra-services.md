# Servicios de infraestructura y hardware (virtual)

![Figura 1: vista general de servicios](../../img/services.png)
Figura 1: vista general de servicios

> **Nota:** la segunda subred es una copia de la subnet 1 cuando se instancia desde la especificación de Infrastructure as Code. El escalado puede crear más copias bajo demanda.

# Servidores en las subredes públicas (subnet 1 y 3)
Todos los servidores de la subred pública pueden comunicarse internamente y entre subredes (incluidas las privadas) usando colas de mensajes (_MQ_). El tráfico HTTPS interno se permite donde corresponda (ej. APIs REST).

La comunicación externa se realiza a través de un stream de datos que toman los log readers en el extremo externo, o por comunicación HTTPS.

Las subredes privadas solo pueden comunicarse dentro de la _VPC_ o, por los canales apropiados, con servicios de _AWS_ como _S3_.

> Todos los servidores son instancias _EC2_ **t3.medium**.

## Servidor core
La arquitectura de software se clasifica como monolito modular. (Ver: [ADR 002: System approach](../../4.ADRs/002%20System%20approach.md)) En la figura 1 usamos un servidor core único como ejemplo. Claramente no representa el escalado real de los sistemas, pero sirve para enfocarse en lo importante a los efectos de esta discusión.

> Los servidores de la figura 1 representan plantillas de instancias de servidor.

## Servidor de órdenes
El servidor de órdenes aloja los módulos de órdenes y agendado contenidos en el subsistema de procesamiento de órdenes.

## Event Store
El event-store no está disponible desde afuera de la _VPC_. Su escalado se hace por separado del grupo de escalado de la subred pública.

## Amazon MQ (_MQ_)
Como tenemos un monolito modular, debemos tratar los módulos como si **no** fueran parte de un monolito único. A los módulos se les permite "hablarse" usando una cola de mensajes. Decidimos usar _AMQ_ para proveernos esa capacidad de colas.

## Kafka Managed Streams (_Kafka_)[1](#footnotes)
Una vez más, elegimos un servicio nativo de _AWS_ para nuestras necesidades de streaming. Este componente de la infraestructura nos permite comunicar más allá del ámbito intra-módulo. Lo usamos para pedidos de notificación, exportación de métricas y reportes de datos.

## Amazon Simple Notification Service (_SNS_)
_SNS_ es un servicio de notificaciones que actúa como fachada de múltiples opciones de notificación. Usar este servicio nos permitirá enviar textos _SMS_, e-mails o mensajes push móviles cuando ocurran ciertos eventos. Ejemplos de esos eventos:
- La comida está disponible para retiro
- Mensajes amigables para el cliente ante condiciones inesperadas/indeseadas. (Comida sin stock, pago fallido, etc.)

## DataDog
_DataDog_ es una oferta _SaaS_ que vive fuera de _AWS_. _DataDog_ se usa para recibir, analizar y reportar las métricas que proveen nuestros sistemas. _DataDog_ será el agregador de todos nuestros datos de métricas. (Puede haber excepciones)

## Tableau
El reporting sobre datos generados por usuarios puede ser de importancia vital para la empresa. Tableau es un actor conocido del mercado de reporting, confiado por muchas empresas. Los reportes de Tableau sirven para identificar puntos de giro cruciales para la empresa.

## Sistemas externos
En la figura 1 agrupamos algunos sistemas externos. A los efectos de esta discusión, solo interesan desde la perspectiva de los canales de comunicación. Usamos HTTPS para comunicarnos con varios sistemas externos. Todos los canales **deben** estar asegurados.

## Notas
1: Usamos Kafka como abreviatura (más o menos) acá porque _KMS_ ya es un término usado en _AWS_ y creemos que podría causar confusión.
