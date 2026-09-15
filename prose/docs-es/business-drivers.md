# Impulsores de negocio

## Objetivo de negocio:

*Una "ghost kitchen" (instalación de preparación y cocción de comida montada para preparar solo comidas para despacho) necesita un sistema de órdenes que permita a los usuarios ver qué artículos hay disponibles, comprar y retirar en cualquiera de sus puntos de venta / heladeras inteligentes.*

## Impulsores de negocio (BD)

1. El sistema acompaña e incentiva a los usuarios ocasionales a comprar para agrandar la base de usuarios, convirtiendo ocasionales en conocidos y conocidos en suscriptores.
2. El sistema ofrece opciones ricas para enganchar a conocidos y suscriptores mediante distintos tipos de programas de lealtad. Las opciones nuevas se agregan fácilmente para aumentar la satisfacción del usuario y la probabilidad de recomendación.
3. El sistema provee información sobre las comidas consumidas y los pedidos bajo demanda para apoyar la gestión de las ghost kitchens.
4. El sistema debe ser fácil de usar para usuarios sin experiencia, para agrandar la base de usuarios.
5. Uso sostenible del servicio.
6. Involucrar a otros especialistas del área de la salud para aumentar la base de usuarios.

# Requerimientos arquitectónicamente significativos (SAR)

Lista de requerimientos que guían la arquitectura (funcionales primarios, atributos de calidad y requerimientos de ciclo de vida)

| # | Requerimiento arquitectónicamente significativo | Del BD |
|----|----|----|
| 1 | El sistema soporta pagos en efectivo y electrónicos | 1 |
| 2 | Sistema enchufable de funcionalidades de feedback, encuestas y reviews | 1, 2 |
| 3 | Reportes puntuales sobre las comidas consumidas de las heladeras. Desglose por suscriptores y compras ocasionales | 3 |
| 4 | Sistema de agendado para suscriptores, para evitar operaciones repetitivas de pedido | 1, 3, 4, 5 |
| 5 | Poder comprar sin registrarse antes | 1, 4, 5 |
| 6 | Sistema de notificaciones para informar al usuario sobre sus órdenes | 1, 4, 5 |
| 7 | Notificaciones sobre programas de lealtad y cupones nuevos | 2, 5 |
| 8 | Desglose detallado de cada comida por componentes en el catálogo | 1, 5, 6 |
| 9 | Pagos seguros | 1, 5 |
| 10 | Maximizar la garantía de retiro de cada comida por parte del usuario | 1, 5 |

# Detallización de los SAR

## 1. El sistema soporta pagos en efectivo y electrónicos.

1. Pagos en efectivo soportados por el _administrador de PoS_ y una aplicación dedicada para _usuarios ocasionales_
2. Los usuarios pueden agregar distintos métodos de pago a la app.
3. Un método de pago nuevo es fácil de agregar en un hombre/mes para áreas nuevas.
4. El usuario puede pagar con fondos virtuales (cupones y descuentos).

## 2. Funcionalidad de feedback - sistema enchufable de feedback, encuestas y reviews

1. El sistema le recuerda al usuario agregar un review de una comida si no lo hizo antes.
2. Los usuarios pueden leer reviews de cualquier comida del catálogo.
3. El usuario puede dar feedback fácilmente sobre cualquier aspecto del servicio.
4. Los reviews se agrupan y categorizan para el dueño.
5. Soporte de encuestas dentro de la app.
6. Los usuarios solo pueden dejar review de servicios realmente usados. Es decir, review solo de comidas compradas.
7. Facilidad para introducir actividades de engagement para el dueño.

## 3. Funcionalidad de reportes

1. La ghost kitchen puede explorar y consultar la agenda de menús de los suscriptores
2. La ghost kitchen recibe un reporte de comidas consumidas con desglose posible por PoS, suscriptores y compras ocasionales

## 4. Funcionalidad de agendado

1. El suscriptor puede armar un menú para una semana, prepagarlo y fijar un horario de retiro.
2. El suscriptor puede explorar el menú creado.
3. El suscriptor puede cancelar el menú y recibir una notificación al respecto.
4. El suscriptor puede volver a pedir el mismo menú de un período anterior en un clic. (Posiblemente el suscriptor puede elegir entre menús pre-armados anteriores)
5. Un usuario conocido o suscriptor puede hacer un pedido y reservar un horario de retiro. Se trata como una orden programada.

## 5. Funcionalidad de compra

1. El _administrador de PoS_ impersona al usuario del sistema y hace un pedido desde la heladera inteligente en el PoS local
- El _administrador de PoS_ tiene cuenta e inicio de sesión propios. No es una cuenta genérica por PoS.
2. Cualquier usuario puede comprar y usar cualquier método de pago soportado por el PoS
- De hecho, esto puede descartarse: el _administrador de PoS_ ingresa el precio solo "para el log". Así que no nos importa. (AG)
3. (idea descabellada) Las heladeras pueden tener un código QR que lleve a la página web de una heladera específica, donde el usuario puede hacer un pedido o ver información de las comidas. (no es nuestro caso, porque igual se paga por la terminal de la heladera y queda fuera de alcance y responsabilidad)
4. La compra puede cubrirse con cupones, puntos de bonificación y dinero (electrónico y efectivo) en cualquier proporción.

## 6. Funcionalidad de notificaciones

1. Los usuarios reciben notificación de toda acción significativa relacionada con la orden en curso: proceso de pago (inicio y resultado), disponibilidad de la comida para retiro, cancelaciones, falta de stock.
2. El usuario puede elegir su vía de notificación preferida: in-app, push, SMS, email.
3. El usuario recibe notificación de cambios significativos en el estado de su cuenta.

## 7. Funcionalidad de lealtad

1. Las notificaciones de eventos que no son pedidos deben gestionarse por separado.
2. Los usuarios pueden elegir su vía de notificación preferida: in-app, push, SMS, email.
3. El usuario tiene una cuenta dedicada con cupones y bonificaciones acumuladas.
4. El usuario puede dividir un pago y cubrir parte de la orden con cupones\vouchers\puntos de bonificación.
5. El usuario gana puntos de lealtad por participar del programa de feedback, compras planificadas, campañas y otras actividades sugeridas por el dueño del sistema.

## 8. Maximizar la garantía de retiro de una comida por el usuario

1. Los usuarios pueden usar tarjeta(s) registradas para autorizar el retiro.
2. Los códigos pre-generados para el retiro permiten la recogida impersonada de comidas. (ADR 002)
