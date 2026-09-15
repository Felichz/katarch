# Guion de la presentación final

## Introducción del grupo

¡Buenos días, buenas tardes y buenas noches a TODOS! ArchColider es un grupo de geeks cuyos miembros tienen 4 nacionalidades distintas de dos continentes distintos. Pese a las diferencias culturales compartimos la misma pasión por el desarrollo de software; creemos en la superación continua y nos gustaría dejar el software, alias el mundo, refactorizado. Lo último que tenemos en común, y que nos permitió trabajar con eficiencia: la zona horaria GMT+1, esposas pacientes e hijos dormidos alrededor de las 9 de la noche.

El nombre ArchColider se inspiró en el Gran Colisionador de Hadrones del CERN (lo más geek que conocemos). Temíamos que al chocar nuestros pensamientos y experiencias naciera una arquitectura nueva que se pareciera a un Service Oriented MonstroLith (jajaja). ¿Te imaginás nuestra cara cuando llegó la noticia de que íbamos a las semifinales? :) Estamos entusiasmados de presentar nuestra solución y compartirla con ustedes.

## Objetivo de negocio
Farmacy Food es una startup que busca crear comidas ricas alrededor de las necesidades dietarias de la gente. Farmacy Food quiere proveer comidas radicalmente asequibles y accesibles. Para lograrlo tiene que colaborar con varios stakeholders, incluyendo ghost kitchens (cocinas que cocinan las comidas), puntos de venta (kioscos que alojan heladeras inteligentes) y tener un medio de entregar las comidas a la heladera inteligente. Es obvio que una startup necesita software que le permita crecer. Como cualquier startup proyecta su base de usuarios y tiene un presupuesto limitado. El rol del arquitecto es proveer una solución que respete las restricciones del negocio y permita a Farmacy Food lograr sus objetivos.

## Presentación

Somos ArchColider y esta es nuestra propuesta de arquitectura para Farmacy Food.

Farmacy Food necesita un sistema de órdenes que conecte a sus usuarios con las ghost kitchens. Según los requisitos de la startup, identificamos los impulsores de negocio que nos guiaron al diseñar la arquitectura.

Además, tenemos los siguientes supuestos globales sobre el panorama de IT. Asumimos que los sistemas de heladeras inteligentes y ghost kitchen ya tienen API y podemos comunicarnos con ellos. Además, asumimos que la ghost kitchen opera en horario laboral regular, no 24/7. Finalmente, el equipo de desarrollo es chico pero experimentado.

Los requisitos y supuestos nos llevan a las restricciones y el alcance, y más importante aún, a lo que queda fuera de alcance. Sin extensiones ni modificaciones de las heladeras inteligentes ni de los sistemas de ghost kitchen.

Los Significant Architectural Drivers (SAD) usualmente arman un presupuesto y dejan a los arquitectos SAD :(, porque muestran la cantidad de trabajo necesario. ¡La trazabilidad de requerimientos es clave!

¡Nos acordamos de los stakeholders, los desarrolladores, los proveedores de comida y de qué les importa a cada uno!

Yendo a la solución. El dominio es sofisticado y decidimos usar un enfoque domain-driven para manejar la complejidad. No todas las partes del sistema son igual de importantes, así que necesitamos saber qué construimos y qué compramos.

El mapa conceptual ayuda a validar los escenarios de negocio y las conexiones entre entidades. Las reglas conectadas al nivel de conocimiento prueban que el sistema mantiene su integridad lógica. También ayuda a pensar en casos de negocio futuros que hoy no existen. Un ejemplo: un caso de campaña de promociones basada en tipo de comida.

Desde la perspectiva técnica, ofrecemos un monolito modularizado, o mejor, un conjunto de ellos. Los centros de gravedad funcional son los módulos Meal Catalog y Ordering.

Para empezar a pensar en los próximos patrones arquitectónicos, necesitamos identificar los atributos de calidad. Simplicidad y Modificabilidad son las cualidades dominantes de todo el sistema. ¿Se acuerdan de las restricciones?

Sin embargo, cada subsistema tiene sus propios atributos de calidad. Eso ayuda a elegir patrones según las necesidades específicas de cada subsistema.

Para atender modificabilidad y extensibilidad, usaremos comandos y eventos para la comunicación entre las partes lógicas del monolito. Haciéndolo, nos aseguramos de que la extracción de módulos no sea tan dolorosa, porque los comandos y eventos seguirán fluyendo igual.

Si todo se hace bien, la extracción debería ser fácil, con la comunicación y los chequeos de seguridad en su lugar.

Todas las decisiones de extraer o escalar servicios se basan en hechos. El análisis de tendencias de métricas debe usarse como fitness functions.

El mapa conceptual y el mapeo de atributos de calidad ayudan mucho a decidir el flujo de información.

Una situación potencialmente riesgosa son las actualizaciones concurrentes de las comidas disponibles, pero el catálogo debe mantener la consistencia de datos.
Proponemos usar el patrón actor porque tenemos actores naturales en la vida real: las heladeras. Un usuario siempre compra de una heladera específica, y una comida no puede saltar mágicamente de una heladera a otra.

Para evitar problemas de concurrencia a nivel sistema, proponemos usar software de streaming basado en log. ¿Alguien dijo Kafka?

La vista de infraestructura nos permite entender el costo de la solución. Primero sugerimos escalar hacia arriba: será más barato y rápido, porque la carga del sistema es chica al principio. Después podemos usar las métricas para tomar decisiones.

La solución soporta cuentas de Farmacy Food y la posibilidad de usar proveedores de terceros.

El análisis de costos puede generar preguntas sobre la necesidad de algunos servicios. Aun así, los ADRs deben tener respuestas, o discusiones abiertas con los dueños sobre soluciones posibles.

Tener una lista de riesgos técnicos está bien. Mejor todavía: tener una lista de riesgos de negocio. Porque la variedad de soluciones es amplia, y solo el dueño puede decidir cómo tratar el riesgo.

Lo mismo con los puntos sensibles. El review bombing es imprevisto pero posible.
