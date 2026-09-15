# Vista de despliegue

La vista de despliegue se enfoca en los aspectos del sistema importantes después de que el sistema fue probado y está listo para entrar en operación real. Esta vista define el entorno físico donde el sistema va a correr, incluyendo el entorno de hardware que el sistema necesita (por ejemplo, nodos de procesamiento, interconexiones de red y almacenamiento en disco), los requisitos del entorno técnico de cada nodo (o tipo de nodo) del sistema, y el mapeo de los elementos de software al entorno de ejecución que los correrá.

Las principales inquietudes son: tipos de hardware requeridos, especificación y cantidad de hardware necesario, requisitos de software de terceros, compatibilidad tecnológica, requisitos de red, capacidad de red requerida y restricciones físicas.

## Componentes
### Redes
El objetivo de este documento es que el lector entienda el diseño de la _VPC_. Una _VPC_ es equivalente a una infraestructura de red como las que puede haber en ecosistemas on-premise.

Lee el documento completo [acá](infrastructure/InfrastructureAndNetworking.md).

### Escalado y balanceo
Para ser lo más performante y económico posible, adoptamos una estrategia donde no escalamos hacia arriba sino hacia afuera. Un ejemplo de escalar hacia arriba sería actualizar un servidor a un hardware (virtual) mejor para poder manejar la carga. En un escenario de escalado horizontal, la carga pesada la manejan múltiples instancias del servidor.

![Figura 1: estrategias de escalado](../img/scaling-strategies.png)

Figura 1: estrategias de escalado

### Hardware (virtual) y servicios
Una vista completa de todo el hardware (virtual) y los servicios usados está [acá](infrastructure/Infrastructure-services-and-virtual-hardware.md).

### Autenticación
La autenticación nos permite verificar la identidad de un usuario o sistema (externo). También usamos la autenticación para guardar de forma segura cierta información personal del usuario.

Lee el documento completo [acá](infrastructure/Authentication.md).

## Riesgos
1. OpenStreetMap tiene licencia de fair-use. Por lo tanto, siempre existe el riesgo de que el servicio no esté disponible o esté algo desactualizado. (Ver: [ADR 015](../4.ADRs/015%20Integration%20with%20Map%20Providers.md))

*Reducción del riesgo:* además de cambiar de proveedor, existe la posibilidad de cachear los tilemaps e internalizar los datos de ubicación.

## Análisis de costos
El análisis de costos está [acá](CostAnalysis.md)

## Glosario de abreviaturas
Acá introducimos algunos términos usados en la documentación de infraestructura.

AMQ: Amazon MQ (servicio gestionado de colas de mensajes)

ASG: Auto-scaling group

AWS: Amazon Web Service

EC2: Elastic Compute Cloud

S3: Simple Storage Service

VPC: Virtual Private Cloud

VPG: Virtual Private Gateway


CAPEX: Capital expenses (gastos de capital)
OPEX: Operational expenses (gastos operativos)


CIDR: Classless Inter-Domain Routing

DataDog: ver [DataDog](../4.ADRs/003%20Tracing%20and%20Monitoring%20Sytem.md)

JSON: JavaScript Object Notation

JWT: JSON Web Token

SaaS: Software as a Service

SMS: Short Message Service

REST: Representational state transfer

VPN: Virtual Private Network

## Checklist

* ¿Mapeaste todos los elementos funcionales del sistema a un tipo de dispositivo de hardware?
* ¿Los mapeaste a dispositivos de hardware específicos si correspondía?
* ¿Se entiende completamente el rol de cada elemento de hardware en el sistema?
* ¿El hardware especificado es adecuado para el rol?
* ¿Estableciste especificaciones detalladas para los dispositivos de hardware del sistema? ¿Sabés exactamente cuántos de cada dispositivo se requieren?
* ¿Identificaste todo el software de terceros necesario y documentaste todas las dependencias entre los elementos del sistema y ese software?
* ¿La topología de red requerida por el sistema está entendida y documentada?
* ¿Estimaste y validaste la capacidad de red requerida?
* ¿Se puede construir la topología de red propuesta para soportar esa capacidad?
* ¿Especialistas de red validaron que la red requerida puede construirse?
* ¿Hiciste pruebas de compatibilidad al evaluar las opciones arquitectónicas para asegurar que los elementos del entorno de despliegue propuesto se puedan combinar como querés?
* ¿Usaste suficientes prototipos, benchmarks y otras pruebas prácticas al evaluar tus opciones arquitectónicas para validar los aspectos críticos del entorno de despliegue propuesto?
* ¿Podés crear un entorno de pruebas realista, representativo del entorno de despliegue propuesto?
* ¿Estás seguro de que el entorno de despliegue funcionará como fue diseñado?
* ¿Obtuviste una revisión externa que valide esa opinión?
* ¿Los evaluadores quedaron conformes con que el entorno de despliegue cumple sus requisitos de estándares, riesgos y costos?
* ¿Verificaste que se puedan cumplir las restricciones físicas (espacio en piso, energía, refrigeración, etc.) implícitas en el entorno de despliegue requerido?
