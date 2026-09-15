# Escenarios de usuario (journeys)

Esta sección muestra un ejemplo genérico de un journey de usuario. Después de leer esta sección, el lector debe saber quiénes son los stakeholders del sistema, cómo interactúa el usuario con el sistema y cuál es el resultado de una interacción.

## 1 Escenario: compra de una comida por un suscriptor

El diagrama de abajo ilustra un pedido de compra dentro del sistema. El journey del usuario arranca al explorar una comida del catálogo y termina cuando el usuario retira la comida. Las líneas punteadas representan interacciones opcionales del sistema.

![Journey del suscriptor](../img/user%20journey/Subscriber.png)

### Stakeholders
* Suscriptor: le interesa elegir una comida, retirarla y eventualmente calificarla y escribir un review.
* Cajero: operador del punto de venta, facilita la compra de comida para usuarios no suscriptos.

### Riesgos
La generación de códigos de acceso puede ser engorrosa de implementar. Quizá introduzcamos un **PIN**.
Debemos poner mecanismos que manejen el envío de dos cupones válidos.
Manejo del pago en efectivo. Esto hay que discutirlo más.

## 2 Escenario: compra de una comida por un usuario ocasional

Este journey ilustra la compra de una comida por un usuario ocasional, un usuario que no está registrado en el sistema. La idea del usuario ocasional es convertirlo en suscriptor.

![Journey del usuario ocasional](../img/user%20journey/Ocasional%20User.png)

### Stakeholders

* Usuario ocasional: le interesa comprar una comida sin registrarse en el sistema.
* Cajero: operador del punto de venta, facilita la compra de comida para usuarios no suscriptos.

### Riesgos
Debemos poner mecanismos que manejen el envío de dos cupones válidos.
Proveer código de acceso a la heladera inteligente para retirar la comida.

## 3 Escenario: error en el retiro

El siguiente user story muestra un caso de uso donde un error inesperado (quizás mecánico) le impide al usuario retirar la comida. El resultado de los eventos es la creación de un reclamo por parte del usuario, que recibe una nueva comida (o una compensación) más adelante.

![Journey de error del suscriptor](../img/user%20journey/Error%20-%20Subscriber.png)


### Stakeholders

* Suscriptor: le interesa elegir una comida, retirarla y eventualmente calificarla y escribir un review.
* Administrador: usuario de backend que modera contenido y resuelve reclamos de suscriptores.

### Riesgos
Existe el riesgo de que un suscriptor quede atrapado en un loop al enviar un código válido en un sistema que no puede validarlo. Sin embargo, este caso debería mitigarse almacenando los códigos de acceso localmente.
