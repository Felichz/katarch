# Consideraciones de análisis de costos

[Documento](https://github.com/ldynia/archcolider/blob/master/3.ViewsAndPerspectives/docs/Data&PayloadsEstimates.xlsx?raw=true)

## Introducción
Al seleccionar la infraestructura y los sistemas de terceros, nos guiamos preliminarmente por los costos de la solución y el presupuesto limitado del cliente. En casos puntuales decidimos elegir soluciones más caras porque la conveniencia del servicio elegido superaba su valor monetario.

## Caveat Emptor
Los costos provistos se estiman sobre la lista de supuestos mencionada abajo y la proyección de crecimiento de usuarios y del tráfico que puedan generar.
Supuestos:
- Estimamos que Farmacy Food llegará a 10K usuarios

## Proyecciones
### Tamaño de base de datos
La imagen de abajo ilustra algunas tablas/documentos que podrían usarse en la solución; es por supuesto un modelo simplificado. Aun así, se ve que generar **30K** registros por mes (1.000 registros por día) ocupará alrededor de **3,96 GiB** de almacenamiento.

Es importante mencionar que este número está en el extremo alto de la estimación porque asume que el tráfico a la aplicación se distribuye uniformemente. En la realidad, el número propuesto podría ser incluso un 60% menor que los **3,96 GiB** estimados.

![pronóstico de base de datos](./docs/database_forecast.png)

### Tamaño de transferencia de datos (tráfico)
El pronóstico de tráfico se calculó sobre los pedidos más frecuentes a la API de la aplicación. Como los usuarios de Farmacy Food podrán escribir feedback y reviews, les daremos la posibilidad de subir imágenes. Asumimos que una imagen ocupa 4 MiB. Además, esperamos que mensualmente solo el 10% de los usuarios escriba reviews y que el 5% tenga algún problema que lleve a enviar feedback. Como se ve, para **1.000** pedidos por día (30K por mes) terminaremos transfiriendo a la aplicación alrededor de **16,5 GiB** de datos, y almacenando alrededor de **16 GiB** de imágenes por mes.

Estas estimaciones asumen tráfico distribuido uniformemente. Además, no usamos compresión para los pedidos HTTP ni para los mensajes, ni para las imágenes. Al implementar la solución usaríamos un algoritmo de compresión apropiado como GZIP, muy eficiente para texto y bueno para imágenes; con eso podríamos bajar los costos significativamente.

![pronóstico de tráfico](./docs/traffic_forecst.png)

## Infraestructura

La región de AWS elegida es us-east por ser la ubicación más cercana a Detroit, que hoy es el mercado más grande.

Esta parte solo muestra elementos de infraestructura que tienen costos asociados.

| Servicio (nube o SaaS) | Proveedor | Descripción |
| ------------- | --------  |------------- |
| EC2           | AWS       | Instancia de   |
| Amazon MQ     | AWS       | Servicio gestionado que provee Rabbit MQ [ADR 003](../4.ADRs/003%20Tracing%20and%20Monitoring%20Sytem.md)  |
| Application Load Balancer | AWS  | Balanceador para servicios corriendo dentro de AWS. |
| Amazon Cognito | AWS  | Proveedor de autenticación y autorización. |
| DataDog | DataDog | Agregador de métricas y eventos |
| SNS     | AWS | Servicio de notificaciones usado para push |
| Cognito | AWS |  |
| Route 53 | AWS | Certificados (TLS) y enrutamiento DNS. |
| Buckets S3| AWS | Servicios de almacenamiento |
| API Gateway | AWS | Pedidos entrantes |
| Amazon DynamoDB| AWS | Base de datos NoSQL |
| CloudFormation| AWS | Solución de infraestructura como código |

## Costo

En los próximos párrafos encontrarás la lista detallada de costos proyectados por servicio/transferencia de datos. Para un resumen sin todos los detalles, ve [acá](#summary)

## Costos de transferencia de datos.
> **Importante:**
> Prefiere siempre la transferencia interna de datos usando direcciones IP **privadas**. Usar IPs públicas o elásticas genera costos adicionales.
> Prefiere transferencias dentro de una misma _Availability Zone_ de AWS. Las transferencias entre _AZs_ generan costos adicionales.
> Al momento de escribir esto, el costo extra es de $0,01 por gigabyte transferido.


## Banda estimada de costos

### Base de la estimación

- Todos los precios en $, USD
- Los precios se totalizan por mes en los párrafos de detalle. El resumen muestra una vista de los costos por año.
- El TCO de 1 año en el mínimo se basa en 500 pedidos de clientes por día. (15k por mes) A veces llamamos a este escenario MIN.
- El TCO de 1 año en el crecimiento proyectado se basa en 1.000 pedidos por día. (31k por mes) A veces llamamos a este escenario PROJECTED.
- El TCO de 1 año en el crecimiento rápido se basa en 10.000 pedidos por día. (310k por mes). A veces llamamos a este escenario RAPID.

### EC2

#### Escenarios MIN y PROJECTED
Ambos escenarios requieren la misma cantidad de instancias EC2 y almacenamiento adjunto.

8 instancias x 0,0376 USD x 730 horas del mes = 219,58 USD (costo mensual onDemand)
50 GB x 0,10 USD x 8 instancias = 40,00 USD (costo de almacenamiento EBS)

**_Total: 259,58 USD_**

#### Escenario RAPID
16 instancias x 0,0376 USD x 730 horas del mes = 439,17 USD (costo mensual onDemand)
Instancias Amazon EC2 On-Demand (mensual): 439,17 USD

50 GB x 0,10 USD x 16 instancias = 80,00 USD (costo de almacenamiento EBS)
Precio Amazon Elastic Block Storage (EBS) (mensual): 80,00 USD

**_Total: 519,17 USD_**

### VPN
Costo fijo para los 3 escenarios.

1 conexión x 0,05 USD x 182,50 horas por mes = 9,13 USD (costo de uso VPN Site to Site)

**_Total: 9,13 USD_**

### Amazon MQ
#### Escenario MIN
1 broker x 730 horas del mes x 0,05408 USD = 39,48 USD (costo del broker Amazon MQ)
1 broker x 9 GB x 0,30 USD = 2,70 USD (costo de almacenamiento del broker Amazon MQ)
39,48 USD + 2,70 USD = 42,18 USD
Costo de Amazon MQ (mensual): 42,18 USD

Costos adicionales de tráfico
Intra región:
(9 GB x 0,01 USD por GB de salida) + (9 GB x 0,01 USD por GB de entrada) = 0,18 USD
Costo de transferencia de datos (mensual): 0,18 USD

**_Total: 42,36 USD_**

#### Escenario PROJECTED
1 broker x 730 horas del mes x 0,05408 USD = 39,48 USD (costo del broker Amazon MQ)
1 broker x 19 GB x 0,30 USD = 5,70 USD (costo de almacenamiento del broker Amazon MQ)
39,48 USD + 5,70 USD = 45,18 USD
Costo de Amazon MQ (mensual): 45,18 USD

Costos adicionales de tráfico
Intra región:
(19 GB x 0,01 USD por GB de salida) + (19 GB x 0,01 USD por GB de entrada) = 0,38 USD
Costo de transferencia de datos (mensual): 0,38 USD

**_Total: 45,56 USD_**

#### Escenario RAPID
1 broker x 730 horas del mes x 0,05408 USD = 39,48 USD (costo del broker Amazon MQ)
1 broker x 190 GB x 0,30 USD = 57,00 USD (costo de almacenamiento del broker Amazon MQ)
39,48 USD + 57,00 USD = 96,48 USD
Costo de Amazon MQ (mensual): 96,48 USD

Costos adicionales de tráfico
Intra región:
(190 GB x 0,01 USD por GB de salida) + (190 GB x 0,01 USD por GB de entrada) = 3,80 USD
Costo de transferencia de datos (mensual): 3,80 USD

**_Total: 100,28 USD_**

### S3
#### MIN
Precio por tramo para: 500 GB
500 GB x 0,0230000000 USD = 11,50 USD
Costo total del tramo = 11,5000 USD (almacenamiento S3 Standard)
1.000 pedidos PUT de almacenamiento S3 x 0,000005 USD por pedido = 0,005 USD (costo de pedidos PUT S3 Standard)
500 pedidos GET en el mes x 0,0000004 USD por pedido = 0,0002 USD (costo de pedidos GET S3 Standard)
500 GB x 0,0007 USD = 0,35 USD (costo de datos devueltos por S3 select)
5.000 GB x 0,002 USD = 10,00 USD (costo de escaneo S3 select)
11,50 USD + 0,0002 USD + 0,005 USD + 0,35 USD + 10,00 USD = 21,86 USD (total almacenamiento S3 Standard, pedidos de datos, S3 select)
Costo S3 Standard (mensual): 21,86 USD

**_Total: 21,86 USD_**

#### Escenario PROJECTED
Precio por tramo para: 1.000 GB
1.000 GB x 0,0230000000 USD = 23,00 USD
Costo total del tramo = 23,0000 USD (almacenamiento S3 Standard)
2.000 pedidos PUT de almacenamiento S3 x 0,000005 USD por pedido = 0,01 USD (costo de pedidos PUT S3 Standard)
1.000 pedidos GET en el mes x 0,0000004 USD por pedido = 0,0004 USD (costo de pedidos GET S3 Standard)
1.000 GB x 0,0007 USD = 0,70 USD (costo de datos devueltos por S3 select)
10.000 GB x 0,002 USD = 20,00 USD (costo de escaneo S3 select)
23 USD + 0,0004 USD + 0,01 USD + 0,70 USD + 20,00 USD = 43,71 USD (total almacenamiento S3 Standard, pedidos de datos, S3 select)
Costo S3 Standard (mensual): 43,71 USD

**_Total: 43,71 USD_**

#### Escenario RAPID
Precio por tramo para: 10.000 GB
10.000 GB x 0,0230000000 USD = 230,00 USD
Costo total del tramo = 230,0000 USD (almacenamiento S3 Standard)
20.000 pedidos PUT de almacenamiento S3 x 0,000005 USD por pedido = 0,10 USD (costo de pedidos PUT S3 Standard)
10.000 pedidos GET en el mes x 0,0000004 USD por pedido = 0,004 USD (costo de pedidos GET S3 Standard)
10.000 GB x 0,0007 USD = 7,00 USD (costo de datos devueltos por S3 select)
100.000 GB x 0,002 USD = 200,00 USD (costo de escaneo S3 select)
230 USD + 0,004 USD + 0,10 USD + 7,00 USD + 200,00 USD = 437,10 USD (total almacenamiento S3 Standard, pedidos de datos, S3 select)
Costo S3 Standard (mensual): 437,10 USD

**_Total: 437,10 USD_**

### DynamoDB
Los escenarios no impactan el costo de DynamoDB, porque el crecimiento después de 12 meses será el principal driver de costos de este servicio.

Tamaño de almacenamiento: 1 TB x 1024 GB por TB = 1024 GB
Cálculo del precio
1.024 GB x 0,25 USD = 256,00 USD (costo de almacenamiento de datos)
Costo de almacenamiento de datos DynamoDB (mensual): 256,00 USD

**_Total: 256,00 USD_**

#### Kafka Managed Stream
> Hay un recargo sobre los datos salientes del streaming de logs. Por ahora cualquier estimación es poco clara. Habría que calcularla después de un mes de operación.
> Abajo una aproximación muy burda:

Cantidad de registros: 1.000 por minuto / (60 segundos por minuto) = 16,67 por segundo
Cálculo del precio
3 KB / 1024 KB factor de conversión a MB = 0,00292969 MB (tamaño de registro)
0,00292969 MB x 16,67 registros por segundo = 0,05 MB/seg (tasa de entrada de datos)
0,05 MB/seg / 1 MB por segundo de capacidad de entrada por shard = 0,05 shards necesarios para entrada
0,05 MB/seg x 3 aplicaciones consumidoras = 0,15 MB/seg (tasa de salida de datos)
0,15 MB/seg / 2 MB por segundo de capacidad de salida por shard = 0,07 shards necesarios para salida
16,67 registros por segundo / 1.000 factor de registros por shard = 0,017 shards necesarios para registros
Máx (0,05 entrada, 0,07 salida, 0,017 registros) = 0,07 cantidad de shards
Redondeo arriba (0,070) = 1 shard
1 shard x 730 horas del mes = 730,00 horas de shard por mes
730,00 horas de shard por mes x 0,015 USD = 10,95 USD
Costo de horas de shard por mes: 10,95 USD
3 KB / 25 factor de Payload Unit = 0,12 fracción de PUT Payload Units
Redondeo arriba (0,12) = 1 PUT Payload Unit
1 PUT Payload Unit x 16,67 registros por segundo x 2.628.000 segundos del mes = 43.808.760,00 PUT Payload Units por mes
43.808.760,00 PUT Payload Units x 0,000000014 USD = 0,61 USD
Costo de PUT Payload Units por mes: 0,61 USD
Costo de retención extendida de datos: 0 USD
Costo de horas consumidor-shard con enhanced fan-out: 0 USD
16,67 registros por segundo x 2.628.000 segundos del mes = 43.808.760,00 registros por mes
0,00292969 MB / 1024 factor de conversión MB a GB = 0,00000286 GB (tamaño de registro)
Costo de recuperaciones de datos enhanced fan-out: 0 USD
10,95 USD + 0,61 USD = 11,56 USD
Costo del stream de datos Kinesis (mensual): 11,56 USD

**_Total: 11,56 USD_**

### Tableau
El reporting con Tableau tendrá los mismos costos en todos los escenarios.

Team
1 Creator + 5 Explorers

$278 USD
Bundle/Mes
Facturado anualmente ($3,340 + impuestos)

**_Total: 278,00 USD_**

### DataDog

#### Escenarios MIN y PROJECTED
[DataDog](https://www.datadoghq.com/pricing/) $15 USD por host, por mes.
15 USD por host, por mes * 8 instancias

**_Total: 120,00 USD_**

#### Escenario RAPID
[DataDog](https://www.datadoghq.com/pricing/) $15 USD por host, por mes.
15 USD por host, por mes * 16 instancias

**_Total: 240,00 USD_**


### Simple Notification Service (SNS)
> El escalón más pequeño arriba o abajo para estimar SNS es el multiplicador de 1.000.000. El nivel más bajo (1M) excede nuestras necesidades en todos los escenarios

1 pedido x 0,0000005 USD x multiplicador de 1.000.000 = 0,50 USD (costo de pedidos SNS)
1 notificación x 0,0000006 USD x multiplicador de 1.000.000 = 0,60 USD (costo de notificaciones HTTP/HTTPS)
1 notificación x 0,00002 USD x multiplicador de 1.000.000 = 20,00 USD (costo de notificaciones EMAIL/EMAIL-JSON)
1 notificación x 0,00 USD x multiplicador de 1.000.000 = 0,00 USD (costo de notificaciones SQS)
0,50 USD + 0,60 USD + 20,00 USD = 21,10 USD
Costo de pedidos y notificaciones SNS (mensual): 21,10 USD

1 notificación x 0,0000005 USD x multiplicador de 1.000.000 = 0,50 USD (costo de notificaciones push móviles)
Costo de notificaciones push móviles (mensual): 0,50 USD

Costo de pedidos y notificaciones SNS (mensual)
21,10 USD
Costo de notificaciones push móviles (mensual)
0,50 USD
Costo de transferencia de datos (mensual)
8,91 USD
Costo mensual total:
30,51 USD

**_Total: 30,51 USD_**

## Otros datos
Salida:
Internet: precio por tramos para 1.000 GB:
1 GB x 0 USD por GB = 0,00 USD
999 GB x 0,09 USD por GB = 89,91 USD
Costo de transferencia de datos (mensual): 89,91 USD

## Resumen de costos por año

|Servicio                    | TCO 1 año en mínimo      | TCO 1 año en crecimiento proyectado | TCO 1 año en crecimiento rápido |
| -----                     | ---------------------    | ------------------------------     | --------------------------     |
| EC2                       |    3.114,96 USD          |    3.114,96 USD                    |    6.230,04 USD                |
| VPN                       |        9,13 USD          |        9,13 USD                    |        9,13 USD                |
| AMAZON MQ                 |      508,32 USD          |      546,72 USD                    |    1.203,36 USD                |
| AMAZON S3 Buckets         |      262,32 USD          |      524,52 USD                    |    5.245,20 USD                |
| AMAZON Dynamo DB          |    3.072,00 USD          |    3.072,00 USD                    |    3.072,00 USD                |
| Application Load Balancer |    TBD                   |    TBD                             |    TBD                         |
| Kafka Managed Streams     |      138,72 USD          |      138,72 USD                    |      138,72 USD                |
| Tableau                   |    1.440,00 USD          |    1.440,00 USD                    |    2.880,00 USD                |
| DataDog                   |    3.336,00 USD          |    3.336,00 USD                    |    3.336,00 USD                |
| SNS                       |      366,12 USD          |      366,12 USD                    |      366,12 USD                |
| Transferencia de datos saliente |    TBD             |    TBD                             |  TBD                           |
| -----                     | ---------------------    | ------------------------------     | --------------------------     |
| **TOTAL**                 | **12.247,57 USD**        |  **12.548,17 USD**                 | **22.480,57 USD**

## Resumen de distribución de costos

### TCO 1 año en mínimo (MIN)
![TCO-1y-min](../img/1y-min-tco.png)
