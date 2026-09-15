# Infraestructura y redes

## Diseño de la VPC

![Diseño de la VPC](../../img/infra-vpc.png)

### Availability Zone y región

Una _Availability Zone_ (_AZ_) es uno o más datacenters discretos con energía, red y conectividad redundantes dentro de una _región de AWS_.

Elegimos diseñar la infraestructura con dos availability zones dentro de una única _región de AWS_. La elección de la región us-east se basó en la ubicación del cliente y su cercanía al datacenter de la región.

Para más información sobre regiones y availability zones, ver https://aws.amazon.com/about-aws/global-infrastructure/regions_az/

### Subredes

Las subredes son simplemente partes de una red. A estas subredes se les asigna un rango de direcciones IP (Internet Protocol) usando una notación conocida como bloques _CIDR_. Cualquier dirección dentro de un bloque _CIDR_ asignado se dice que está en la subred a la que pertenece ese bloque _CIDR_.

> Nota: solo se considera IPv4, tanto en el diseño como en este documento.

#### Subred pública

Las subredes públicas están diseñadas para direcciones IP accesibles externamente. Suelen ser alcanzables desde internet en general y se les permite salida (egreso). (Pueden aplicar restricciones) En nuestro caso concreto permitiremos tráfico seguro desde internet hacia recursos de API predefinidos.

#### Subred privada

Las subredes privadas están diseñadas para direcciones IP internas. Normalmente no son alcanzables desde internet y están atadas a reglas de egreso estrictas. Las direcciones IP de la subred privada son accesibles desde elementos conectados por VPN. Podés restringirlo en las tablas de rutas de las subredes privadas.

No permitiremos ningún tráfico de internet directamente sobre nuestras subredes privadas.

### Tablas de rutas

Las tablas de rutas permiten dictar el flujo del tráfico de red.

> El concepto de subred privada o pública es abstracto. No vas a encontrar un recurso de AWS con ese nombre. La tabla de rutas determina si una subred es privada o pública.

Las tablas de rutas se leen de Destino a Objetivo. Es decir: cuando un elemento de una subred intenta alcanzar una IP objetivo, consulta la tabla de rutas para ver si/cómo puede llegar. Por ejemplo, si una tabla de rutas declara el destino 0.0.0.0/0 con objetivo igw-1, significa que para ir a cualquier dirección IP debe pasar por internet gateway-1. El lector atento concluirá que esa regla no debería estar arriba de la tabla, porque la tabla se aplica en orden de prioridad. (En algunos escenarios puede haber excepciones)

> 0.0.0.0/0 en _AWS_ significa CUALQUIER dirección ipv4.

Abajo están las tablas de rutas mínimas para nuestro diseño de infraestructura.

#### Tabla de rutas para subredes públicas
| Destino      | Objetivo   | Comentario             |
| ----        | ------        | ------              |
| 10.0.0.0/16 | Local         | Permite el tráfico entre elementos locales |
| 0.0.0.0/0   | igw-1         | Permite tráfico de internet |

#### Tabla de rutas para subredes privadas

| Destino      | Objetivo   | Comentario             |
| ----        | ------        | ------              |
| 10.0.0.0/16 | Local         | Permite el tráfico entre elementos locales |

La falta de conexión a internet de las subredes privadas es intencional: ningún servicio que corra ahí debería ser accesible directamente desde internet.

#### Internet Gateway

El _Internet Gateway_ (en el diagrama llamado **igw-1**) se usa para que la tabla de rutas pueda apuntar a él para el tráfico enrutable por internet. También hace network address translation (NAT) para las instancias que tienen una IP pública asignada.

### Amazon Virtual Private Network

Cualquier sistema on-premise ya en uso puede conectarse a los sistemas dentro de la _VPC_ usando una conexión _VPN_ segura. Ojo: no hace falta pasar por la _VPN_ para acciones públicas, como pedir un endpoint _REST_ público en una _API_. Preferí ese endpoint público cuando esté disponible.

La _VPN_ se conectará a una _VPC_ que exige configurar la tabla de rutas de modo que la comunicación entre la red on-premise y la _VPC_ sea posible.

> #### Ejemplo
> Con una red on-premise con bloque _CIDR_ 192.168.0.0/16 y una _VPC_ con bloque _CIDR_ 10.0.0.0/16 necesitarías esta entrada en la tabla de rutas:
> | Destino | Objetivo |
> | --- | --- |
> | 192.168.0.0/0 | VGW |
>
> Este ejemplo muestra solo la entrada necesaria para conectar con el _Virtual Private Gateway_. Las demás entradas no se muestran.

## Perspectiva evolutiva
En este apartado intentamos mostrar cómo se manejarían algunos escenarios seleccionados si ocurrieran en el futuro. Este documento solo trata ítems de red. Para más sobre escalado, ver: [Escalado y balanceo de infraestructura](InfrastructureScalingAndBalancing.md)

### Aumentar el up-time
**El trade-off:** aumentar el up-time teórico exige aumentar el presupuesto.
Para aumentar el up-time podríamos agregar una availability zone. Por ejemplo, agregar us-east-2c suma una adicional. Si te topás con el límite de availability zones de tu infraestructura, siempre podés agregar una _región_. Las _VPC_ pueden contener múltiples _availability zones_, pero una _VPC_ no puede abarcar múltiples _regiones de AWS_. Según cómo escales, puede que necesites agregar _VPC peering_ para trabajar fluidamente con otras VPCs. Ver: [VPC Peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html)

### Bajada general de carga
**El trade-off:** el costo baja, pero el up-time teórico también.
Si tenés varias VPCs conectadas por una _VPC Peering Connection_, considerá quitar eso primero, porque pesa más en el presupuesto que las _AZs_. Eliminar una _AZ_ por completo (y todos sus recursos dentro) te permite recortar costos y acercarte a los requisitos reales de carga.

### Agregar nuevas áreas de servicio (ubicaciones lejos de Detroit)
**El trade-off:** los costos suben por replicación de infraestructura, lo que a cambio te permite tener la infraestructura más cerca de los clientes.
Con edge locations o _regiones de AWS_ nuevas podés mover tu infraestructura y operaciones más cerca del cliente. Eso probablemente aumente la velocidad de las operaciones.

Se puede introducir una _CDN_ si hay necesidad de entregar contenido estático más rápido.

### Quitar áreas de servicio
**El trade-off:** los costos bajan por quitar infraestructura, lo que a su vez puede afectar negativamente la velocidad de las operaciones.
Dar de baja un área de servicio sin otras áreas que se beneficien de tener edge locations o _regiones de AWS_ cerca debería llevarte a considerar darlas de baja.

> **Importante:** a primera vista puede parecer muy natural agregar una nueva _región de AWS_ o edge location al agregar un área de servicio nueva. Sin embargo, considerá que solo deberías tomar ese camino cuando las operaciones se relentizan hasta el punto de impactar negativamente de forma mayor al cliente u otro stakeholder. El cliente u otro stakeholder debería representar el valor monetario del costo de la infraestructura extra y demás _OPEX_.
