# Visión general del sistema

## Objetivo de negocio

Objetivo de negocio declarado por el dueño:

*Una "ghost kitchen" (instalación de preparación y cocción de comida montada para preparar solo comidas para despacho) necesita un sistema de órdenes que permita a los usuarios ver qué artículos hay disponibles, comprar y retirar en cualquiera de sus puntos de venta / heladeras inteligentes.*

## Antecedentes:

Farmacy Food es una startup de comida saludable potenciada por tecnología que toma al pie de la letra la cita "Que la comida sea tu medicina" y crea comidas ricas alrededor de las necesidades dietarias y los estilos de vida activos de la gente, para sostener su bienestar general. Nuestra misión es hacer que la salud y el bienestar sean radicalmente asequibles y accesibles.

Misión de Farmacy Food: https://www.youtube.com/watch?v=9aSLSVAIkoM

Sitio web de Farmacy Food: https://www.farmacyfood.com/

La empresa brinda servicio de asesoramiento y gestión de nutrición saludable para personas adultas (18-65 años; los niños están en los planes, pero no son el foco por ahora). Los clientes pueden suscribirse al servicio y recibir comida según sus necesidades nutricionales individuales (prescripción). Hay varios canales de distribución, y uno de ellos son las heladeras inteligentes.

Las dos primeras locaciones en Detroit proyectan crecer a ocho para 2021.

### Sistemas internos con los que interactúa el sistema

#### Heladeras inteligentes

Una heladera inteligente es como un kiosco de comida/bebida que se puede montar en cualquier lado; está conectada al back-office de la empresa. Tienen un sistema y una API independientes.

#### Sistema de órdenes de la ghost kitchen

Back-office de la ghost kitchen (https://pos.toasttab.com/) para gestionar la producción de comida.

#### Puntos de venta

No está claro cómo funciona actualmente, pero soporta ventas en el PoS para usuarios no registrados.

El kiosco es un espacio subalquilado dentro de otro negocio donde vendemos nuestro producto pero un empleado gestiona las transacciones a través de un punto de venta. Los mismos datos deben ser accesibles por las APIs de los sistemas PoS.

### Números/métricas

1. Actualmente 300 comidas/semana, con plan de llegar a 1.500-2.000 comidas/semana para diciembre
1. 68 locaciones para fin de año
1. 1.000 suscriptores para fin de año
1. 10 comidas/semana por suscriptor

## Funcionalidades y responsabilidades del sistema

### Ghost kitchen

1. Enviar actualizaciones de inventario a la ghost kitchen central
1. Enviar pedidos de comidas nuevas a una cocina de terceros

## Usuarios

1. Aplicación móvil/web
1. Los usuarios deben poder hacer un pedido personalizado por adelantado y retirarlo después. En el futuro, deben poder explorar el catálogo de comidas disponibles en las heladeras cercanas y pedir comidas.
1. El usuario debe poder "reservar" algo si hay una posición de venta abierta.
1. Puede haber opción de fijar horario de retiro y notificación de que tu comida llegó a una heladera específica.
1. Retiro por terceros (proxies).
1. Los usuarios no suscriptos también pueden usar las heladeras inteligentes.
1. Recompensas, cupones, promociones y otras actividades de engagement.
1. El usuario se autentica con una tarjeta de crédito/débito. Pasa la tarjeta y el kiosco entiende quién está operando. La autenticación se basa en la última tarjeta usada o en el pool de tarjetas agregadas a la aplicación.

### Otros

1. En algún momento todo esto podría integrarse con dispositivos inteligentes. Pero requiere trabajo serio con los datos privados del usuario.
1. Vinculación de heladeras, soporte de sistema modularizado

## Fuera de alcance

1. Desarrollar la comunicación interna entre heladeras inteligentes y de estas con el resto del sistema.
1. Cualquier tarea logística relacionada con la entrega de la comida. Aceptamos que la comida "de alguna manera" llega, y que la comida no usada se retira "de alguna manera" de las heladeras. Tampoco nos interesan las posibles reubicaciones de comida. Todo movimiento de comida no causado por un cliente queda fuera de alcance.
