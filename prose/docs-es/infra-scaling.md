# Escalado de infraestructura y balanceo de carga

## Auto scaling
![Auto-scaling](../../img/infra-auto-scaling.png)
Figura 1: Auto-scaling

El auto-scaling se aplica a todas las instancias _Elastic Cloud Compute_ (_EC2_) de las subredes públicas. Esto nos resuelve el escalado según ciertos criterios de carga.

La recomendación por defecto para los auto-scaling groups es **Balance availability and cost** (equilibrar disponibilidad y costo). Además, por defecto, solo las instancias _EC2_ deben formar parte del auto-scaling group. Sin embargo, si hace falta, se pueden configurar otros recursos para agregarlos al grupo.

## Escalado basado en métricas
En este punto del proyecto se desconoce qué métrica serviría mejor a los intereses de Farmacy Foods. Por ahora aconsejamos:
- Uso de CPU > 75%
- Uso de memoria > 85%

El reporte de métricas es crucial para guiar tu elección de opciones de escalado.

## Balanceo de carga

![Vista general del balanceo](../../img/Balancing-Overview.png)
Figura 2: Balanceo de carga

> La figura 2 muestra de la instancia 1 a la instancia n. A los efectos de este documento, eso significa N instancias de un recurso particular en el _ASG_.

### Route 53 DNS

Amazon Route 53 es un servicio web de sistema de nombres de dominio (DNS) en la nube, altamente disponible y escalable. [...] Amazon Route 53 conecta eficazmente los pedidos de los usuarios con la infraestructura corriendo en AWS, como instancias Amazon EC2, balanceadores de Elastic Load Balancing o buckets de Amazon S3, y también puede usarse para enrutar usuarios hacia infraestructura fuera de AWS. Podés usar Amazon Route 53 para configurar health checks de DNS que enruten el tráfico hacia endpoints sanos, o para monitorear de forma independiente la salud de tu aplicación y sus endpoints.[1](#references)

### Application Load Balancer (_ALB_)

El _Application Load Balancer_ provisto por _AWS_ es responsable de distribuir el tráfico entre nuestros servicios expuestos a internet y las instancias _EC2_. Para algunos servicios lo hacemos indirectamente usando el _Auto Scaling Group_ (_ASG_). El _ALB_ es un balanceador a nivel de pedido. ([Capa 7](https://en.wikipedia.org/wiki/Application_layer))

Usar el ALB nos permite balancear en base a una interfaz de aplicación. En nuestro caso, esto significa sobre todo que podemos tener balanceo de carga por recursos para una API REST. Esto incluye recursos específicos de la aplicación, pero también recursos de la API de autenticación provista por Cognito. (Ver: [Autenticación](./Authentication.md))


> En la figura 2 vemos dos reglas en el ruleset:
> 1. Redirigir HTTP a HTTPS.
> 2. /Ordering
>
> La primera regla se encarga de redirigir el tráfico HTTP a HTTPS. En esencia, elimina el uso de HTTP.
> La segunda regla se usa para reenviar los pedidos a /Ordering hacia cierto endpoint. También aplicamos este tipo de regla de reenvío cuando, por ejemplo, queremos enrutar de forma balanceada hacia un _Auto Scaling Group_ o un recurso de la API de _Cognito_.

Otra ventaja del _ALB_ es la capacidad nativa de forzar solo conexiones HTTPS. Lo hacemos con una regla configurable en los rulesets del load balancer.

### AWS Certificate Manager (_ACM_)

El AWS Certificate Manager se usa para almacenar certificados [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security). En nuestro caso usamos ACM para guardar tanto certificados reconocidos por una [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority) como certificados privados. Estos últimos se usan para los entornos de desarrollo y prueba.

### Listener

Un listener es un proceso que verifica los pedidos de conexión usando el protocolo y el puerto que configuraste. Podés configurar HTTP o HTTPS en el puerto estándar, pero también podrías agregar listeners adicionales en puertos no estándar.

### Ruleset

Los rulesets se adjuntan a un _ALB_ y contienen reglas para ejecutar _acciones_ específicas sobre los pedidos entrantes. Lo usamos para:
- redirigir a un usuario **no autenticado** a _Cognito_ para autenticarse.
- verificar un _JWT_ contra _Cognito_ para validar la autenticación correcta del usuario. (Redirigiendo al usuario si el _JWT_ no es válido.)
- reenviar el tráfico al scaling group según la ruta del recurso pedido.

### Target group

Usamos _target groups_ para apuntar al recurso real detrás del _ALB_. Por ejemplo, nuestro _ASG_, una instancia _EC2_ o cualquier otro tipo de recurso de servicio que queramos exponer a internet.

### Referencias
1: https://aws.amazon.com/route53/
