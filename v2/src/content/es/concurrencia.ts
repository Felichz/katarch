import type { Chapter } from '../types';
import { c, doc, cmd, evt } from '../helpers';

export const concurrencia: Chapter = {
  id: 'concurrencia',
  number: 6,
  phase: 'El diseño',
  title: 'El mundo físico',
  subtitle: 'Heladeras, dinero y conexiones inestables: tres problemas reales, la solución que el equipo diseñó para cada uno y el patrón que comparten.',
  minutes: 16,
  learn: [
    'Explicar por qué un <strong>actor por heladera</strong> hace innecesarios los locks.',
    'Leer una compra completa en el alfabeto de <strong>comandos y eventos</strong>.',
    'Justificar event sourcing, colas con confirmación, la ventana de 30 segundos y el PIN offline como renuncias concretas.',
    'Diseñar también el <strong>día nublado</strong>: el camino cuando el hardware falla.',
  ],
  steps: [
    {
      id: 'cover',
      layout: 'cover',
      title: 'El mundo físico',
      blocks: [
        {
          t: 'p',
          html: 'Acá el caso deja de ser teórico y se vuelve ingeniería de la realidad: dos personas comprando la última vianda al mismo tiempo, arrepentimientos con plata de por medio, heladeras sin señal.',
        },
      ],
    },
    {
      id: 'problemas',
      kicker: 'Tres problemas reales',
      title: 'Donde el software choca con el mundo físico',
      visual: { scene: 'problems', state: 'intro' },
      blocks: [
        { t: 'p', html: 'Hasta acá el sistema se pensó como software limpio. Este capítulo lo pone frente a lo que no se puede programar: comida que no se teletransporta, dinero que no se puede perder y antenas que se quedan sin señal.' },
        { t: 'p', html: 'Tres problemas, en orden: <strong>contención</strong> (el stock), <strong>evidencia</strong> (el dinero) y <strong>autonomía</strong> (sin conexión). Cada uno termina en una renuncia visible.' },
      ],
    },

    /* ── problema 1 ── */
    {
      id: 'ultimo-plato',
      kicker: 'Problema 1 · El último plato',
      title: 'Dos personas, una vianda',
      visual: { scene: 'race' },
      describe: '<p>Ana y Beto compran desde la app, en el mismo segundo, la última lasaña de la heladera del gimnasio. La solución tentadora es bloquear el stock en la base de datos: mientras atiende a Ana, Beto espera.</p>',
      blocks: [
        { t: 'p', html: 'Queda una lasaña en la heladera del gimnasio. Dos clientes la compran desde la app en el mismo segundo.' },
        { t: 'p', html: 'La tentación es bloquear la base de datos: “nadie toca el stock mientras yo compro”. Es la respuesta de manual, y obliga a que cada compra espere a la anterior.' },
        { t: 'p', html: 'El equipo hizo algo mejor, usando una peculiaridad física del negocio.' },
      ],
    },
    {
      id: 'actor',
      kicker: 'Problema 1 · El último plato',
      title: 'Un actor por heladera',
      visual: { scene: 'actors', state: 'route' },
      evidence: { src: '/img/FF_concurency_order_processing.PNG', alt: 'Diagrama original de procesamiento de órdenes con actores', caption: 'El diagrama de concurrencia original de ArchColider: router por ubicación, una cola por heladera y un actor por heladera.' },
      describe: '<p>Clientes de tres ubicaciones (A, B y C) envían órdenes a un router que lee la ubicación. El router deja cada orden en la cola de su heladera: la orden A jamás entra a la cola B. Cada cola alimenta un único actor, que guarda el stock de su heladera en memoria.</p>',
      blocks: [
        { t: 'p', html: 'La observación: <strong>una vianda no puede saltar de una heladera a otra</strong>. El stock de cada heladera es un mundo aparte.' },
        { t: 'p', html: `Entonces cada heladera tiene su propio ${c('actor-model', 'actor')}: un proceso que atiende las compras de esa heladera, de a una, en orden. Un router lee la ubicación de cada orden y la deja en la cola que le corresponde.` },
        { t: 'p', html: 'Mirá el diagrama: la orden A jamás entra a la cola B.' },
      ],
    },
    {
      id: 'sin-locks',
      kicker: 'Problema 1 · El último plato',
      title: 'Sin locks, porque no hay contienda',
      visual: { scene: 'actors', state: 'serial' },
      describe: '<p>En la cola de la heladera A esperan Ana y Beto. El actor toma la orden de Ana: stock de 1 a 0, compra confirmada. Después toma la de Beto: stock 0, recibe agotado. Nunca hubo dos escrituras simultáneas.</p>',
      blocks: [
        { t: 'p', html: 'Dentro de la cola, las órdenes se atienden de a una. Si dos personas piden la última lasaña, la primera se la lleva y la segunda recibe un <strong>agotado</strong> limpio.' },
        { t: 'p', html: 'Nunca hay dos escrituras simultáneas sobre el mismo stock, así que nunca hacen falta locks. Y como el stock vive en memoria del actor, cada decisión se toma a velocidad de procesador.' },
        { t: 'callout', tone: 'note', title: 'La renuncia', html: 'No se protege el stock con bloqueos: se <strong>elimina la posibilidad</strong> de que dos escrituras compitan.' },
      ],
    },
    {
      id: 'difusion',
      kicker: 'Problema 1 · El último plato',
      title: 'Todas las apps se enteran',
      visual: { scene: 'actors', state: 'broadcast' },
      describe: '<p>De cada actor salen dos flujos: la orden sigue hacia el procesamiento de pago, y el aviso de que cambió el stock va al catálogo. El catálogo difunde un evento de catálogo actualizado a todos los clientes, que refrescan su copia local.</p>',
      blocks: [
        { t: 'p', html: 'De cada actor salen dos flujos. La <strong>orden</strong> sigue hacia el pago. Y el aviso de que <strong>cambió el stock</strong> viaja al catálogo.' },
        { t: 'p', html: 'El catálogo lo difunde a todos los dispositivos, que refrescan su copia local. Así la lasaña agotada desaparece de las pantallas sin que nadie tenga que preguntar.' },
      ],
    },
    {
      id: 'local',
      kicker: 'Problema 1 · El último plato',
      title: 'Un local, varias heladeras',
      visual: { scene: 'venue' },
      blocks: [
        { t: 'p', html: 'Mirando el mundo físico apareció un problema que un diagrama genérico no muestra: <strong>un local puede tener varias heladeras</strong>. Si un gimnasio tiene tres, ¿qué stock ve el usuario, el de una heladera o el del local entero?' },
        { t: 'p', html: `La API de Byte Technology no garantizaba esa suma, así que el equipo anotó el riesgo de tener que implementarla por su cuenta, y dejó registrada la pregunta al proveedor ${doc('questions')}.` },
        { t: 'callout', tone: 'info', title: 'Hábito de arquitecto', html: 'Cuando un sistema depende de una API externa que no controlás, esas preguntas se escriben <strong>antes</strong> que el código.' },
      ],
    },

    /* ── problema 2 ── */
    {
      id: 'evidencia',
      kicker: 'Problema 2 · El dinero',
      title: 'El reclamo del cliente que cobraron mal',
      visual: { scene: 'ledger' },
      describe: '<p>La misma orden guardada de dos maneras. En una tabla tradicional, el estado se reescribe: creada, reservada, pagada, y solo queda el último valor. En un registro de eventos, cada hecho se agrega con su hora. Cuando llega un reclamo, solo el registro de eventos puede mostrar qué pasó y cuándo.</p>',
      blocks: [
        { t: 'p', html: 'Un negocio que maneja comida y dinero va a recibir reclamos. La pregunta no es si llegan, sino <strong>qué evidencia existe</strong> cuando llegue uno.' },
        { t: 'p', html: `La respuesta del equipo fue ${c('event-sourcing', 'Event Sourcing')}: registrar cada orden como una secuencia inmutable de eventos, en vez de un estado que se borra y se reescribe.` },
        { t: 'decision', id: 'event-sourcing' },
      ],
    },
    {
      id: 'cola',
      kicker: 'Problema 2 · El dinero',
      title: 'El mensaje que no se puede perder ni duplicar',
      visual: { scene: 'ackqueue' },
      describe: '<p>La orden deja un mensaje de cobro con un identificador único en una cola. La cola lo entrega al servicio de pagos y no lo borra hasta recibir la confirmación de recibo. Si un reintento entrega el mismo mensaje otra vez, pagos reconoce el identificador y lo descarta: no se cobra doble.</p>',
      blocks: [
        { t: 'p', html: `El mensaje “cobrá esta orden” no puede perderse (se perdería plata) ni procesarse dos veces (se cobraría doble). Para eso, una ${c('message-queue', 'cola de mensajes')} con confirmación de recibo e identificadores únicos.` },
        { t: 'decision', id: 'rabbitmq' },
        { t: 'p', html: `Un detalle fino de los documentos internos ${doc('concurrency')}: cada agregado lleva un <strong>número de versión</strong>, así que dos escrituras concurrentes sobre la misma orden se detectan sin locks.` },
      ],
    },
    {
      id: 'rechazo',
      kicker: 'Problema 2 · El dinero',
      title: 'El lado B: cuando el pago falla',
      visual: { scene: 'refused' },
      evidence: { src: '/img/IM_cancel_order_by_payment_system.png', alt: 'Diagrama original: orden cancelada por el sistema de pagos', caption: 'El lado B del flujo, en el diagrama de información original: MealStockCanceled repone el stock y OrderPurchaseRefused avisa al usuario y al reporting.' },
      describe: '<p>La pasarela rechaza el cargo o el intento expira. La orden del sistema emite MealStockCanceled, que devuelve la vianda al catálogo, y OrderPurchaseRefused, que avisa al usuario y alimenta los reportes. La app ofrece reintentar la última orden.</p>',
      blocks: [
        { t: 'p', html: 'El equipo también diagramó qué pasa si el proveedor de pagos <strong>rechaza</strong> el cargo o el intento expira.' },
        { t: 'p', html: `El stock reservado se repone solo (${evt('MealStockCanceled')}) y el usuario recibe el aviso de rechazo (${evt('OrderPurchaseRefused')}). Nada queda a medias.` },
        { t: 'p', html: 'Y como el historial de órdenes vive alrededor de un mes en el dispositivo, el rechazo se convierte en un botón: reintentar la última orden con un toque.' },
      ],
    },
    {
      id: 'alfabeto',
      kicker: 'El alfabeto',
      title: 'Azul promete, verde informa',
      visual: { scene: 'purchase' },
      evidence: { src: '/img/IM_meal_purchase.PNG', alt: 'Diagrama de información original: compra de una comida paso a paso', caption: 'La compra instantánea en el diagrama de información de ArchColider, con el mismo alfabeto: azul para comandos, verde para eventos.' },
      describe: '<ol><li>Start Order: comando local en el teléfono.</li><li>Confirm Order by User: comando que cruza al servidor.</li><li>MealStockReserved: evento, la vianda quedó apartada.</li><li>MealStockUpdated: evento difundido a todos los dispositivos.</li><li>OrderPurchased: evento, la compra está confirmada.</li></ol>',
      blocks: [
        { t: 'p', html: 'Antes de la próxima táctica, el flujo completo de una compra normal. Cada mensaje es de uno de dos tipos:' },
        {
          t: 'cards',
          cards: [
            { title: 'Comando', tag: 'azul', html: `Lo que alguien <strong>quiere</strong> que ocurra. Puede fallar. Ej.: ${cmd('Confirm Order by User')}.` },
            { title: 'Evento', tag: 'verde', html: `Lo que <strong>ya ocurrió</strong> y todos escuchan. Es historia. Ej.: ${evt('OrderPurchased')}.` },
          ],
        },
        { t: 'p', html: 'Recorré la compra en el diagrama. Fijate en la frontera punteada: antes, todo es barato y local; después, todo queda registrado. Los eventos verdes son justamente los que el event store jamás borra.' },
      ],
    },
    {
      id: 'ventana',
      kicker: 'Problema 2 · El dinero',
      title: 'Los 30 segundos que evitan un reembolso',
      visual: { scene: 'window' },
      evidence: { src: '/img/IM_cancel_order_by_user.PNG', alt: 'Diagrama original: cancelación de la orden por el usuario dentro de la ventana', caption: 'La cancelación dentro de la ventana de inhibición, en el diagrama original: ninguna flecha llega a la pasarela de pagos.' },
      describe: '<p>Simulador: al confirmar una compra, la orden queda retenida en memoria durante una ventana de hasta 30 segundos. Si el usuario cancela dentro de la ventana, el stock vuelve al catálogo y la pasarela nunca se entera: cero comisiones. Si la ventana vence, recién ahí se invoca al pago, y cancelar después implica un reembolso real con dos comisiones.</p>',
      blocks: [
        { t: 'p', html: `Los números del propio caso ${doc('info-models')} dicen que un <strong>2 a 5% de las órdenes se cancelan al toque</strong>: compras impulsivas de las que el usuario se arrepiente enseguida.` },
        { t: 'p', html: 'Si cada una llega a la pasarela, el negocio paga comisión de cobro y después otra de reembolso, por la misma comida.' },
        { t: 'p', html: 'La solución replica el “deshacer envío” del correo: la orden se <strong>retiene entre 10 y 30 segundos</strong> antes de invocar al pago. Probalo en el simulador.' },
      ],
    },

    /* ── problema 3 ── */
    {
      id: 'sin-senal',
      kicker: 'Problema 3 · Sin señal',
      title: 'La heladera del subsuelo',
      visual: { scene: 'offline', props: { correct: 2 } },
      describe: '<p>Una heladera en el subsuelo de un hospital se queda sin señal celular. Un cliente que ya pagó llega a retirar su almuerzo. La heladera no puede consultar a la nube.</p>',
      blocks: [
        { t: 'p', html: 'Las heladeras dependen de conexión celular. Una heladera en el subsuelo de un hospital puede quedarse sin señal justo cuando un cliente llega a retirar su almuerzo ya pagado.' },
        {
          t: 'predict',
          question: 'El cliente pagó, la comida está adentro y la heladera no puede hablar con la nube. ¿Cómo le darías su comida sin abrir la puerta a los fraudes?',
          options: [
            { label: 'Abrir la puerta a cualquiera mientras no haya señal', feedback: 'Resuelve el hambre y abre la puerta a los fraudes: cualquiera se lleva cualquier cosa.' },
            { label: 'Pedirle que espere a que vuelva la señal', feedback: 'El cliente pagó y se queda sin almuerzo: justo lo que el requerimiento “que nadie se quede sin su comida” prohíbe.' },
            { label: 'Que la heladera valide algo que recibió antes del corte', correct: true, feedback: '<strong>Esa es la idea.</strong> Preparar la validación mientras hay señal, para no necesitar la nube en el momento del retiro.' },
            { label: 'Mandar a alguien de soporte a abrirla', feedback: 'Funciona una vez. No escala a 68 locaciones en la hora del almuerzo.' },
          ],
        },
      ],
    },
    {
      id: 'pin',
      kicker: 'Problema 3 · Sin señal',
      title: 'Un PIN que la heladera ya conoce',
      visual: { scene: 'pinprepare' },
      describe: '<p>Mientras hay señal, la plataforma genera un PIN de un solo uso para cada entrega y lo envía al teléfono del cliente y a la memoria local de la heladera.</p>',
      blocks: [
        { t: 'p', html: 'La solución del equipo: <strong>códigos PIN generados por adelantado</strong>, uno por entrega, que viajan al teléfono del cliente y a la memoria de la heladera mientras todavía hay señal.' },
        { t: 'p', html: 'Los documentos guardan la evolución de la idea: primero pensaron en “códigos de acceso” genéricos y los descartaron por engorrosos. El PIN de 6 a 8 dígitos atado a cada comida fue la simplificación final.' },
      ],
    },
    {
      id: 'retiro',
      kicker: 'Problema 3 · Sin señal',
      title: 'Probalo: retirar sin nube',
      visual: { scene: 'pinpickup' },
      describe: '<p>Sin conexión, el cliente teclea su PIN en la heladera. La heladera lo valida contra su memoria local, destraba la puerta y guarda el retiro. Cuando vuelve la señal, reporta el retiro a la nube. Un PIN incorrecto se rechaza y se puede reintentar.</p>',
      blocks: [
        { t: 'p', html: 'Sin señal, la heladera valida el PIN contra su memoria, abre, y <strong>reporta el retiro cuando recupera la conexión</strong>.' },
        { t: 'p', html: 'Los códigos también quedan guardados en el teléfono: si algo falla, el usuario no queda atrapado en un loop de reintentos.' },
        { t: 'decision', id: 'pin-offline' },
        { t: 'p', html: '¿Te acordás de la fila “que nadie se quede sin su comida” en la tabla de trazabilidad? Este es su destino.' },
      ],
    },
    {
      id: 'jedis',
      kicker: 'Problema 3 · Sin señal',
      title: 'La misma puerta, otro modelo de confianza',
      visual: { scene: 'trust' },
      blocks: [
        { t: 'p', html: 'El contrapunto del podio: <strong>Jedis</strong> resolvió la misma puerta de otra manera.' },
        { t: 'p', html: 'Su módulo de heladera crea una “purchase session” antes de abrir la puerta, con la identidad de la tarjeta o del token de la app. Si el cliente toma una comida que no es suya, suena la alarma.' },
        { t: 'p', html: 'Comparalas: una guarda la identidad en un código compartido de antemano; la otra, en una sesión que se abre en el momento.' },
      ],
    },
    {
      id: 'catalogo',
      kicker: 'Problema 3 · Sin señal',
      title: 'El catálogo en el bolsillo',
      visual: { scene: 'pocket' },
      evidence: { src: '/img/IM_meal_stock_update.PNG', alt: 'Diagrama original: eventos CatalogUpdated y MealStockUpdated difundidos a todos los usuarios', caption: 'La sincronización original: eventos difundidos “for all users” para refrescar el catálogo de cada dispositivo.' },
      describe: '<p>El teléfono navega un catálogo guardado localmente, instantáneo y disponible sin señal, aunque quizás un poco viejo. El servidor difunde avisos de cambio con solo el id y la ubicación del catálogo. Al pagar, el teléfono verifica el stock real con el servidor.</p>',
      blocks: [
        { t: 'p', html: 'El mismo pragmatismo aparece en la app: el catálogo vive en el teléfono (instantáneo, disponible sin señal) y el stock real se verifica <strong>recién al pagar</strong>.' },
        { t: 'p', html: 'Para que la copia local no envejezca, el servidor difunde un aviso cada vez que algo cambia. El aviso dice <em>qué</em> cambió, no arrastra el catálogo entero: cada dispositivo descarga lo suyo cuando le toca.' },
        { t: 'decision', id: 'catalog-cache' },
      ],
    },
    {
      id: 'pragmatismo',
      kicker: 'Pragmatismo',
      title: 'Una hoja de cálculo y un mapa',
      visual: { scene: 'partition' },
      blocks: [
        { t: 'p', html: 'Esa manera de pensar llega hasta las decisiones más chicas. ¿Sincronizar campañas promocionales entre operadores con algoritmos de consistencia distribuida? Innecesario: las promociones cambian poco, se manejan <strong>en una hoja de cálculo</strong>, y el sistema solo consume el resultado final.' },
        { t: 'p', html: 'Y todo el modelo de datos descansa sobre una observación del mundo físico: <strong>las cocinas de Detroit no ofrecen comida en Nueva York</strong>. Catálogos, stock y órdenes se parten por ciudad, lo que simplifica acceso, consistencia y costos de un plumazo.' },
      ],
    },

    /* ── día nublado ── */
    {
      id: 'dia-nublado',
      kicker: 'El día nublado',
      title: 'Cuando la comida se traba',
      visual: { scene: 'journey' },
      evidence: { src: '/img/user-journey-error.png', alt: 'Journey original: el suscriptor no puede retirar su comida', caption: 'El journey original del equipo, “Subscribed User Cannot Pick Up The Meal”, con carriles por actor y sistema.' },
      describe: '<ol><li>El suscriptor ingresa su código en la heladera.</li><li>Si el código no es válido, reintenta.</li><li>El código es válido, pero la vianda queda físicamente trabada.</li><li>El suscriptor saca una foto desde la app y registra el reclamo.</li><li>Un administrador revisa y aprueba el reclamo.</li><li>El sistema de órdenes crea una orden nueva o un cupón.</li><li>Una notificación le avisa al suscriptor que su reclamo fue aprobado.</li></ol>',
      blocks: [
        { t: 'p', html: 'Todos los diagramas anteriores muestran el “día de sol”: el usuario pide, paga, retira, feliz.' },
        { t: 'p', html: 'El equipo también diagramó el día nublado: la vianda queda <strong>físicamente trabada</strong>, el usuario ya pagó y ningún software empuja la bandeja. La salida es humana: foto, revisión de un administrador, compensación.' },
        { t: 'callout', tone: 'info', title: 'La mitad que falta', html: 'El <em>happy path</em> es la mitad del diseño. La otra mitad está en los journeys donde el hardware falla, la señal se corta o el usuario se arrepiente, y también se diagrama antes de escribir código.' },
      ],
    },
    {
      id: 'patron',
      kicker: 'El patrón',
      title: 'Aceptar la realidad física en vez de pelearla',
      visual: { scene: 'problems', state: 'recap' },
      blocks: [
        { t: 'p', html: 'Todas las soluciones del capítulo hacen lo mismo. Las heladeras se van a quedar sin señal: diseñá para eso. Los datos van a llegar tarde: diseñá para eso. Los reclamos van a llegar: guardá la evidencia.' },
        { t: 'callout', tone: 'note', title: 'El patrón', html: 'La arquitectura madura no elimina los problemas del mundo real: <strong>los espera preparada</strong>.' },
      ],
    },
    {
      id: 'checkpoint',
      kicker: 'Checkpoint',
      title: 'Cuatro preguntas antes de seguir',
      visual: {
        scene: 'quiz',
        props: {
          questions: [
            {
              q: '¿Por qué el sistema no necesita bloquear la base de datos para proteger el stock?',
              options: [
                'Porque el stock nunca cambia durante el día',
                'Porque cada heladera tiene un actor que procesa sus órdenes de a una',
                'Porque la heladera cobra antes de abrir la puerta',
                'Porque usa una base de datos más rápida',
              ],
              answer: 1,
              why: 'Una vianda no salta de heladera: una cola y un actor por heladera hacen imposibles las escrituras simultáneas sobre el mismo stock.',
            },
            {
              q: 'Un cliente reclama un cobro. ¿Qué decisión garantiza que exista evidencia de qué pasó?',
              options: ['Cachear el catálogo en el teléfono', 'Event sourcing: cada orden como secuencia inmutable de eventos', 'El PIN offline', 'Partir los datos por ciudad'],
              answer: 1,
              why: 'El registro de eventos nunca se borra: el estado actual se reconstruye, y la historia completa queda disponible para auditar.',
            },
            {
              q: '¿Qué ahorra la ventana de 10 a 30 segundos antes de cobrar?',
              options: ['Tráfico de red', 'Las comisiones de cobro y reembolso de las cancelaciones impulsivas', 'Espacio en la base de datos', 'El tiempo de cocina'],
              answer: 1,
              why: 'El 2 a 5% de órdenes canceladas al toque se resuelve en memoria: la pasarela nunca se entera.',
            },
            {
              q: '¿Cómo retira su comida un cliente si la heladera no tiene señal?',
              options: ['No puede: espera a que vuelva la señal', 'Con un PIN generado de antemano que la heladera valida localmente', 'Un cajero le abre la puerta', 'La heladera abre para cualquiera'],
              answer: 1,
              why: 'La validación se prepara mientras hay señal; el retiro se reporta cuando la conexión vuelve.',
            },
          ],
        },
      },
      blocks: [
        { t: 'p', html: 'Repasá lo esencial del capítulo antes de seguir.' },
        { t: 'p', html: 'La pregunta que queda abierta: <strong>¿y el suscriptor, que pedía para toda la semana?</strong> Su ciclo completo, con el mismo alfabeto de comandos y eventos, es el próximo capítulo.' },
      ],
    },
  ],
};
