# Riesgos

## Riesgos de negocio

1. El catálogo está desactualizado y la comida reservada no puede despacharse desde la heladera seleccionada.
    - Opción: sincronizar los artículos disponibles en el momento de la compra para evitar daños reputacionales.
2. El menú del suscriptor no puede prepararse.
    - Opciones: informar lo antes posible. Ofrecer otras comidas de la misma categoría. Agregar cupones de bonificación.
3. La notificación de entrega (o de la comida) no puede enviarse por el canal preferido.
    - Opción 1: entrega por canales de comunicación de respaldo.
    - Opción 2: no hacer nada si la comida ya llegó al punto de despacho.
    - Opción 3: si la comida no llegó, crear una oferta dedicada a través del PoS.
4. La app del PoS queda desconectada de la red.
    - Opción 1: consistencia eventual de operaciones. Enviar los datos cuando haya red.
    - Opción 2: códigos PIN para que el suscriptor retire la comida
5. La heladera inteligente queda desconectada de la red.
    - Opción 1: generar el código PIN de despacho lo antes posible, de modo que la heladera y la app del usuario lo tengan de antemano. Posiblemente unos días de antelación.
6. El usuario reservó una comida y no la retiró.
    - Opción: prepago para completar la operación.
7. La comida queda trabada en la heladera.
    - Opciones: el usuario saca una foto y presenta un reclamo.

## Riesgos técnicos

1. El servicio del proveedor de pagos está temporalmente caído.
    - Opciones: todos los registros de órdenes se guardan y los pedidos al sistema de pago pueden reintentarse por un período definido. Política de confianza para usuarios conocidos y suscriptores.
2. Levantar demasiadas instancias de servicios genera desperdicio de dinero.
    - Opción 1: configurar el número máximo posible de instancias por servicio
    - Opción 2: umbral de seguridad; por ejemplo, al levantar instancias, pedir confirmación de un administrador del sistema.
3. La Ghost Kitchen está caída y no provee información de disponibilidad de comidas
    - Opción 1: operar como siempre usando la información interna del _sistema de órdenes_. Si falla un despacho, usar el protocolo de compensación.
4. No aplicar prácticas de seguridad.
    - Opción: involucrar hackers éticos (white hat) de terceros para escanear vulnerabilidades.
5. Releases riesgosos con cambios significativos.
    - Opción 1: habilitar hot-swap hacia releases anteriores. Fijar requisitos para el proveedor de plataforma.
6. Cambios que rompen los formatos de mensajes para servicios internos o externos.
    - Opción 1: compatibilidad hacia atrás y hacia adelante en los formatos de serialización de mensajes.
    - Opción 2: mantener al menos 1 mecanismo de conversión con compatibilidad hacia atrás. Versionado de API.
    - Opción 3: negociación temprana con atributo de cabecera "sunset" y alertas por esa cabecera.
7. Desajuste entre los entornos de producción y desarrollo
    - Opción 1: negociación del problema 1:1. Es decir, correr en dev el mismo set de elementos de infraestructura: al menos 1 ítem para servicios puramente de infraestructura (proxies, firewalls, balanceadores) y al menos 2 instancias para servicios de negocio (aunque en prod haya una sola). Ayuda a detectar muchos problemas temprano.

# Puntos sensibles

## De negocio

1. Suscriptores y usuarios conocidos generan una situación de sobreaprovisionamiento para una heladera. No toda la comida entra en la heladera.
    - Opción: *se necesita decisión del negocio sobre cómo manejar esta situación*.
2. El pedido se hizo fuera del horario de la Ghost Kitchen.
3. Review bombing contra cocinas de terceros.
    - Opción: el review del servicio o de las comidas solo está disponible para compras confirmadas.

## Técnicos

1. Las tecnologías modernas de escalado en la nube permiten escalar vertical durante mucho tiempo, lo que puede postergar las decisiones de escalar horizontal.
    - Evaluación del escenario del camino crítico de negocio en producción
2. Sobrecarga de un servicio
    - Monitoreo proactivo
    - Circuit breaker
    - Protección anti dog-pile
