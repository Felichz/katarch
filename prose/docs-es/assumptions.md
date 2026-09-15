# Supuestos

## Heladeras inteligentes

1. Asumimos que existen métodos que permiten saber el stock actual, los despachos, el horario de reposición, etc. [ADR 012](../4.ADRs/012%20Stale%20data%20from%20fridges.md)
2. La reposición de stock ocurre una o dos veces por día a una hora aproximadamente predecible. Ocurre por la capacidad física de entregar comidas según la demanda, el tráfico, la carga de las ghost kitchens. [ADR 013](../4.ADRs/013%20%20Cache%20the%20meal%20catalogue.md)
3. El sistema de heladeras inteligentes provee información de ubicación de cada heladera. [ADR 015](../4.ADRs/015%20Integration%20with%20Map%20Providers.md)

## Ghost Kitchen

1. La ghost kitchen puede dar feedback sobre la ejecución de una orden, tipo: aceptado, despachado, no puedo, demorado
2. La ghost kitchen no trabaja 24/7 y prepara las órdenes recibidas al comienzo del día laboral. [ADR 013](../4.ADRs/013%20%20Cache%20the%20meal%20catalogue.md)
3. La ghost kitchen ya usa algún sistema de seguimiento que tiene alguna forma de API que acepta escrituras.
4. Las [actualizaciones de inventario](../Glossary.md) no están limitadas a cambios de stock de las heladeras para reposición.
5. Las actualizaciones de inventario pueden formarse por el pedido de una comida deseada por parte del usuario. El usuario puede ser Suscriptor o usuario Conocido.
6. Las actualizaciones de inventario las crea el sistema de agendado a partir de los menús de los suscriptores para una semana/mes.
7. La ghost kitchen asigna un número único a cada comida para su seguimiento. [ADR 013](../4.ADRs/013%20%20Cache%20the%20meal%20catalogue.md)

## Equipo de desarrollo

1. El equipo de desarrollo es relativamente chico, y la solución propuesta debe permitir una salida rápida al mercado y facilidad de cambios
2. El equipo de desarrollo es multifuncional y tiene experiencia con las tecnologías principales disponibles en el mercado
