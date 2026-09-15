# Autenticación y autorización

## Autenticación
![Figura 1: vista general del flujo de autenticación](../../img/Authentication.png)
Figura 1: vista general del flujo de autenticación

La figura 1 muestra el flujo general de autenticación para el acceso de clientes por internet. Este flujo **no** se usa para la comunicación directa con recursos de AWS.

## Cognito
AWS ofrece un servicio llamado Cognito que usamos acá para cubrir nuestras necesidades de autenticación. El flujo descrito se conoce como [Authorization Code Grant](https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/).

> Algunos clientes no soportan de forma nativa el manejo de redirects (manejo de 302) o no lo soportan por defecto. Es una causa común de errores/malentendidos en desarrollo.

Cognito trae integrados todos los formularios necesarios para las pantallas de login, logout, perfil, etc. Se puede aplicar estilado para ponerle marca a todas las pantallas.

### Configuración
- ¡Asegurate de usar la opción User Pool en Cognito!
- Permitir login _con username_
- Permitir login _con email verificado_
- Agregar atributos a los datos de identidad: número de teléfono, email.
- Permitir el scope _openid_
- Fijar el _scheme_ del load balancer en _internet facing_

## Federación

La federación permite conectar otros proveedores de autenticación a nuestros sistemas. Un ejemplo práctico: darle al usuario la opción de entrar a *tu sistema* usando su cuenta de Google, Facebook u otra red social. El uso de federación genera confianza inmediata en tu sistema para una gran porción de usuarios potenciales.

> Soporta también autenticación no federada. Algunas personas pueden confiar menos en *tu* sitio que en el proveedor federado (ej. Google). Eso puede hacerlos escépticos. Para apoyar además la disponibilidad de tu propio proveedor de autenticación, deberías considerar que, desde una perspectiva de seguridad, los usuarios pueden querer usar contraseñas distintas para distintos servicios online.

## Load balancer
El diseño ofrecido acá usa el load balancer directamente para proveer autenticación. El HTTPS Listener se usa con un conjunto de reglas que proveen acciones para verificar la identidad del usuario que pide el recurso. Hecho eso, usamos la regla del load balancer para reenviar el tráfico al scaling group apropiado. [Escalado y balanceo de infraestructura](./InfrastructureScalingAndBalancing.md)

## Precios

Aunque los precios de Cognito están en la lista de precios del sitio de AWS, queremos aclarar una cosa. El precio de Cognito se basa en usuarios únicos por mes. La facturación **no** sube si un usuario entra varias veces por mes ni cuando hace múltiples pedidos. Si un usuario no entra ni se registra durante un mes, no se te factura por ese usuario. Consultá [los precios de AWS Cognito](https://aws.amazon.com/cognito/pricing/) para información actualizada.
