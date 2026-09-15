# Requerimientos funcionales - discusión inicial

El objetivo de negocio (recordatorio):

_Una "ghost kitchen" (instalación de preparación y cocción de comida montada para preparar solo comidas para despacho) necesita *un sistema de órdenes* que permita a los usuarios ver qué artículos hay disponibles, comprar y retirar en cualquiera de sus puntos de venta / heladeras inteligentes._

## Requerimientos provistos por el dueño

1. Debe integrarse con heladeras inteligentes de terceros para obtener inventario y actividad de compra
2. Las heladeras inteligentes producen niveles de inventario de artículos y compras. Las heladeras inteligentes tienen un sistema de gestión en la nube que maneja la comunicación con ellas, así que obtener estos datos sería vía API.
3. Debe integrarse con el sistema de punto de venta de los kioscos
4. El kiosco es un espacio subalquilado dentro de otro negocio donde vendemos nuestro producto pero un empleado gestiona las transacciones a través de un punto de venta. Los mismos datos deben ser accesibles por las APIs del sistema PoS.
5. Aplicación accesible por móvil y web
6. Soportar feedback sobre artículos de compras verificadas y encuestas dentro de la app.
7. Aceptar cupones y precios promocionales
8. Enviar actualizaciones de inventario a la cocina central

### Aclaraciones y posibles ítems fuera de alcance

El Req #1 suena bastante vago y fuera de alcance, ya que existe un sistema independiente (lo llamaremos Sistema de Gestión de Kioscos) que provee la comunicación y gestión de las heladeras inteligentes (ver Req #2). Desde nuestra perspectiva, la responsabilidad de esa integración y comunicación queda fuera de la responsabilidad del sistema de órdenes. **Necesita aclaración.**

El Req #3 dice que el sistema de órdenes debe integrarse con los puntos de venta. Desde nuestra perspectiva, es la confirmación del vendedor. Acá, usar efectivo para no suscriptores puede ser un _use case_ válido.

El Req #4 se agrupa con el Req #3 y da información adicional sobre el entorno y el contexto. Si lo transformamos en _use cases_, queda:
- El sistema debe acompañar e incentivar a los usuarios ocasionales.
- El sistema debe soportar pagos en efectivo

El Req #5 es claro y habla de los canales de comunicación y engagement con el usuario. Posibles _use cases_:
- El sistema debe acompañar e incentivar a suscriptores y usuarios conocidos

El Req #6 trata por completo sobre el engagement del usuario en aspectos que quizá aún no están definidos. Posibles _use cases_:
El sistema debe ser extensible a nuevas formas de engagement, incluyendo encuestas, feedback directo, reviews, programas de descuentos/cupones, etc.

El Req #7 es una extensión del Req #6

El Req #8 trata sobre integración.

_Supuestos_:
1. La cocina central ya usa algún sistema de seguimiento que tiene alguna forma de API que acepta escrituras.
2. Las _actualizaciones de inventario_ no están limitadas a cambios de stock de las heladeras para reposición.
3. Las _actualizaciones de inventario_ pueden formarse por el pedido de una comida deseada por parte del usuario. El usuario puede ser Suscriptor o usuario Conocido.
4. Las _actualizaciones de inventario_ creadas por el sistema de agendado desde los menús de los suscriptores para una semana/mes.

_Preguntas_:
1. ¿Con qué frecuencia debería recibir actualizaciones la cocina central? Por qué importa: la cocina por sí sola no funciona 24/7. Una cocina necesita reposición de insumos
2. ¿Cómo dar feedback al usuario si la orden no puede cumplirse en el plazo deseado? ¿Existen plazos de entrega en general?

## Áreas funcionales - análisis preliminar de escenarios

A partir del objetivo de negocio provisto por el dueño, podemos extraer las siguientes áreas funcionales:

**Contexto core**

1. Reserva de comidas (Req #8, #5, #6)
1. Retiro de una comida (Req #3, #4)
1. Integración del punto de venta con el sistema de órdenes (#3, #4)
1. Catálogo de comidas (visibilidad de artículos) (#7, #6)
1. Sistema de órdenes - subsistema interno
1. Agendado de comidas

**Contexto de soporte**

1. Sistema de compras

**Contexto genérico**

1. Integración entre sistemas internos
1. Aplicaciones de usuario
1. Sistema de notificaciones

### Reserva de comidas

Hacer una reserva anticipada de comidas disponibles según el tiempo. En general, pueden ser comidas disponibles al instante en la heladera y bajo demanda desde el catálogo.

Escenarios de día de sol:
1. El usuario (Suscriptor, usuario Conocido) explora el catálogo de comidas, selecciona comidas disponibles en las heladeras, las reserva y paga la comida al momento del retiro.
2. El suscriptor arma una agenda de menús y recibe una notificación cuando una comida está disponible cada día. El menú preparado está prepagado.

Casos de uso extendidos:

Preguntas:
1. ¿Existe opción de prepago para reservar una comida, digamos por una semana o un mes?
2. ¿Hay un horario límite para que el usuario retire la comida?
3. Si el suscriptor no retira una comida dentro de un plazo, ¿puede listarse en el catálogo compartido?

Riesgos:
1. El usuario reservó una comida y no la retiró. Opción: prepago para completar la operación.

### Retiro de una comida

Responsable de la comunicación "directa" con la heladera y de cómo se ejecuta el proceso de retiro.

Escenarios de día de sol:
1. El usuario suscriptor guardó su tarjeta en la app para autorizar y retirar una comida. El kiosco conoce de antemano la orden asociada al usuario.
2. El usuario conocido selecciona una comida del catálogo, paga con tarjeta y retira la comida.
3. El usuario ocasional pide una comida con la ayuda del vendedor del PoS.
4. La comida llegó a una heladera; el usuario recibe la notificación de disponibilidad.

Casos de uso extendidos:

Riesgos:
1. Pérdida de conexión. Opciones: 1) Generar códigos de recuperación de un solo uso. 2) Pasar la tarjeta y recibir la comida.
2. La comida queda trabada en la heladera. Opciones: 1) El usuario saca una foto y presenta un reclamo.

### Integración con puntos de venta

Aplicación especial (o parte del frontend) con impersonación de usuarios por el administrador del PoS. Permite reutilizar la misma lógica que para el resto de los usuarios.

Escenarios de día de sol:
1. El usuario ocasional hace un pedido; el administrador del PoS ejecuta la orden en la app del PoS. El tipo de pago no importa.
2. El suscriptor viene a retirar una comida y da un código/mensaje que aparece en la app del PoS; con esa información el administrador del PoS entrega la comida.

Casos de uso extendidos:

Riesgos:
1. Pérdida de conexión. Opciones: 1) Consistencia eventual de operaciones. Enviar los datos cuando haya red. 2) Códigos de recuperación del suscriptor

### Catálogo de comidas

Responsable de proveer información sobre las comidas disponibles en las heladeras y las comidas bajo demanda.

Escenarios de día de sol:
1. Las comidas reales de cada heladera están disponibles para explorar. Cada artículo contiene descripción, precio, lugar exacto.

Casos de uso extendidos:
1. El usuario puede fijar la zona de heladeras deseada y obtener artículos según esa zona
2. El usuario puede aplicar filtros por alérgenos y contenido

Riesgos:
1. ¿Puede el catálogo contener comidas fuera de pedido pero con disponibilidad general para pedir dentro de cierto plazo?
2. ¿Con qué frecuencia deberían actualizarse los datos?

### Sistema de órdenes

Hacer el seguimiento del proceso de pedidos y generar información para la Ghost Kitchen.

Escenarios de día de sol:
1.

Casos de uso extendidos:

Riesgos:
1. ¿Cuál es el plazo mínimo para pedir una comida que no está en las heladeras pero la Ghost Kitchen puede preparar?
2. ¿Es posible hacer un pedido masivo y fijar una dirección específica?
3. El usuario pidió una comida, ¿y no hay forma de entregarla? Falta de stock, cocina cerrada.

### Sistema de compras

Fachada para los sistemas de pago

Escenarios de día de sol:

Casos de uso extendidos:

Riesgos:

### Aplicaciones de usuario

UI para el sistema de órdenes

Escenarios de día de sol:

Casos de uso extendidos:

Riesgos:

### Integración entre sistemas internos

Comunicación con sistemas upstream y downstream.

Escenarios de día de sol:

Casos de uso extendidos:

Riesgos:

### Sistema de notificaciones

Mantener al usuario informado de acciones postergadas en el tiempo.

Escenarios de día de sol:
1. El canal de notificación por defecto son los mensajes in-app.

Casos de uso extendidos:
1. El usuario puede configurar su vía de notificación preferida: in-app, push, email, SMS
2. Las notificaciones se diferencian por tipo y tienen distintos canales de entrega. Los tipos son: relacionadas con pedidos, novedades, solicitud de feedback, otras.

Riesgos:
1. ¿Debería haber un canal de respaldo?
2. ¿Varias vías de entrega para el mismo tipo?
