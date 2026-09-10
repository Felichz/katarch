/**
 * Curated decision map — the editorial digest of ArchColider's 16 ADRs.
 *
 * The full ADR catalog is NOT dumped on the reader. The authors did the
 * curation: every decision is presented as Problem -> Decision -> Trade-off
 * in natural language, grouped into three pillars. Bureaucratic status
 * labels (Proposed/Accepted/Draft) are deliberately absent.
 */

export interface DecisionRef {
  id: string;
  label: string;
}

export interface DecisionEntry {
  id: string;
  pillar: 1 | 2 | 3;
  title: { es: string; en: string };
  problem: { es: string; en: string };
  decision: { es: string; en: string };
  tradeoff: { es: string; en: string };
  adrs: DecisionRef[];
  githubBase: string;
}

const GH = 'https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/';

export const PILLARS = {
  es: [
    {
      title: 'El núcleo estructural',
      subtitle: 'Las decisiones que definen la forma del sistema: cómo se organiza, cómo guarda los datos y cómo se habla internamente.',
    },
    {
      title: 'La realidad física y la privacidad',
      subtitle: 'Las decisiones nacidas del choque entre el software y el mundo real: heladeras sin señal, datos médicos de clientes reales.',
    },
    {
      title: 'Operación, escala y presupuesto',
      subtitle: 'Las decisiones que cuidan el bolsillo de la startup: cuándo escalar, qué monitorear y dónde validar usuarios.',
    },
  ],
  en: [
    {
      title: 'The structural core',
      subtitle: 'The decisions that define the system\u2019s shape: how it is organized, how it stores data, and how its parts talk.',
    },
    {
      title: 'Physical reality and privacy',
      subtitle: 'Decisions born from software colliding with the real world: fridges losing signal, real customers\u2019 medical data.',
    },
    {
      title: 'Operations, scale and budget',
      subtitle: 'The decisions that protect the startup\u2019s wallet: when to scale, what to monitor, and where to validate users.',
    },
  ],
} as const;

export const DECISIONS: DecisionEntry[] = [
  {
    id: 'monolith',
    pillar: 1,
    title: {
      es: 'Un monolito modular, no una nube de microservicios',
      en: 'A modular monolith, not a cloud of microservices',
    },
    problem: {
      es: 'Con 2 locaciones, ~42 comidas al día y un equipo de desarrollo chico, ¿qué estilo de sistema elegir sin quemar presupuesto ni hipotecar el crecimiento futuro a 68 locaciones?',
      en: 'With 2 locations, ~42 meals a day and a small dev team, which system style do you pick without burning the budget or mortgaging future growth to 68 locations?',
    },
    decision: {
      es: 'Un monolito dividido internamente en módulos con fronteras estrictas, desplegado en pocas máquinas de AWS. Cada módulo se comunica a través de contratos, como si hubiera red entre ellos, para poder extraer cualquiera como servicio independiente el día que la telemetría lo justifique.',
      en: 'A monolith internally divided into modules with strict boundaries, deployed on a handful of AWS machines. Modules talk through contracts as if there were a network between them, so any one can be extracted as an independent service the day telemetry justifies it.',
    },
    tradeoff: {
      es: 'Se acepta el riesgo de que la disciplina modular se relaje y el código se vuelva una bola de barro. El contrapeso: contratos internos, telemetría obligatoria por módulo y revisión constante.',
      en: 'The accepted risk is that modular discipline erodes and the code decays into a ball of mud. The counterweights: internal contracts, mandatory per-module telemetry and constant review.',
    },
    adrs: [{ id: '002', label: 'ADR 002 · System approach' }],
    githubBase: GH + '002%20System%20approach.md',
  },
  {
    id: 'event-sourcing',
    pillar: 1,
    title: {
      es: 'Guardar la historia completa de cada orden (Event Sourcing)',
      en: 'Keep the full history of every order (Event Sourcing)',
    },
    problem: {
      es: 'El sistema maneja dinero y comida: si un cliente reclama un cobro mal hecho, "borrar y reescribir" el estado actual destruye la evidencia de qué pasó.',
      en: 'The system handles money and food: if a customer disputes a charge, "erase and rewrite" storage destroys the evidence of what happened.',
    },
    decision: {
      es: 'Registrar cada orden como una secuencia inmutable de eventos (creada, pagada, retirada) en una base de datos especializada en eventos (EventStore, versión open source). El estado actual se reconstruye repasando la historia, como un libro contable que nunca se borra.',
      en: 'Record every order as an immutable sequence of events (created, paid, picked up) in an event-oriented database (the open-source EventStore). Current state is rebuilt by replaying history, like a ledger written in ink.',
    },
    tradeoff: {
      es: 'Es más trabajo mental que una tabla tradicional: hay que proyectar los eventos a vistas legibles. A cambio, auditoría completa, depuración de errores por reproducción y migraciones de datos reconstruibles.',
      en: 'It is more mental work than a traditional table: events must be projected into readable views. In exchange: full auditability, debugging by replay, and rebuildable data migrations.',
    },
    adrs: [{ id: '007', label: 'ADR 007 · Event sourcing usage' }],
    githubBase: GH + '007%20Event%20sourcing%20usage.md',
  },
  {
    id: 'rabbitmq',
    pillar: 1,
    title: {
      es: 'Mensajes con confirmación de recibo para el camino del dinero',
      en: 'Acknowledged message delivery on the money path',
    },
    problem: {
      es: 'Cuando el sistema decide cobrar una orden, el mensaje hacia la pasarela de pago no puede perderse (se perdería plata) ni procesarse dos veces (se cobraría doble).',
      en: 'When the system decides to charge an order, the message to the payment gateway must not get lost (lost money) nor be processed twice (double charge).',
    },
    decision: {
      es: 'Usar una cola de mensajes (RabbitMQ, en su versión administrada de AWS) con entrega "al menos una vez" y confirmación de recibo. Cada mensaje lleva un identificador único para que los reintentos repetidos se descarten sin efecto.',
      en: 'Use a message queue (RabbitMQ, via its AWS-managed version) with at-least-once delivery and acknowledgements. Every message carries a unique identifier so duplicate retries are discarded harmlessly.',
    },
    tradeoff: {
      es: 'La cola agrega una pieza más que operar, y obliga a diseñar todos los receptores para tolerar duplicados. Es el precio estándar de no perder ni duplicar dinero.',
      en: 'The queue adds one more moving part to operate, and forces every consumer to tolerate duplicates. That is the standard price of losing or doubling no money.',
    },
    adrs: [{ id: '008', label: 'ADR 008 · At least once delivery' }],
    githubBase: GH + '008%20At%20least%20once%20delivery%20for%20ready%20to%20pay%20order.md',
  },
  {
    id: 'pin-offline',
    pillar: 2,
    title: {
      es: 'Retiro offline por PIN: comer aunque se corte internet',
      en: 'Offline PIN pickup: eat even when the internet drops',
    },
    problem: {
      es: 'Las heladeras dependen de conexión celular. Si la heladera de un subsuelo de hospital pierde señal justo cuando el cliente va a retirar su almuerzo pagado, el cliente se queda sin comida y el negocio devuelve plata.',
      en: 'Fridges depend on cellular connectivity. If a hospital basement fridge loses signal right when a customer arrives to pick up a paid lunch, the customer goes hungry and the business refunds money.',
    },
    decision: {
      es: 'Generar por adelantado un código PIN de un solo uso para cada entrega. La heladera puede validar el PIN con su memoria local, sin hablar con la nube, y reportar el retiro cuando recupere conexión.',
      en: 'Pre-generate a single-use PIN for every delivery. The fridge can validate the PIN against its local memory without talking to the cloud, and report the pickup once connectivity returns.',
    },
    tradeoff: {
      es: 'Los códigos deben generarse, entregarse al usuario y expirar de forma segura; hay que asumir una ventana pequeña de riesgo si un PIN se filtra. Mucho más barato que pedir conectividad perfecta en cada punto de venta.',
      en: 'Codes must be generated, delivered and expired securely; a small risk window exists if a PIN leaks. Far cheaper than demanding perfect connectivity at every point of sale.',
    },
    adrs: [{ id: '011', label: 'ADR 011 · Every meal delivery has pick up pin code' }],
    githubBase: GH + '011%20Every%20meal%20delivery%20has%20pick%20up%20pin%20code.md',
  },
  {
    id: 'catalog-cache',
    pillar: 2,
    title: {
      es: 'Catálogo en el bolsillo, verificación de stock al final',
      en: 'Catalog in your pocket, stock verified at the end',
    },
    problem: {
      es: 'Los datos de qué comidas quedan en cada heladera llegan con retraso y de forma poco confiable. Mostrar "stock vivo" en cada pantalla haría la app lenta y mentirosa a la vez.',
      en: 'Data about which meals remain in each fridge arrives late and unreliably. Showing "live stock" on every screen would make the app slow and a liar at the same time.',
    },
    decision: {
      es: 'La app navega un catálogo guardado localmente (instantáneo y disponible sin señal), y la verificación del stock real se hace en el último paso posible: el momento de pagar. Se acepta mostrar datos posiblemente viejos durante la navegación, nunca durante el cobro.',
      en: 'The app browses a locally cached catalog (instant and available offline), and real stock is verified at the last possible step: the moment of payment. Stale data is accepted while browsing, never while charging.',
    },
    tradeoff: {
      es: 'Un usuario puede enamorarse de una comida que ya no está. La compensación: el error aparece en el pago, con alternativas a mano, y no en la puerta de una heladera vacía.',
      en: 'A user may fall in love with a meal that is gone. The compensation: the error surfaces at payment, with alternatives at hand, not at the door of an empty fridge.',
    },
    adrs: [
      { id: '012', label: 'ADR 012 · Stale data from fridges' },
      { id: '013', label: 'ADR 013 · Cache the meal catalogue' },
    ],
    githubBase: GH + '012%20Stale%20data%20from%20fridges.md',
  },
  {
    id: 'privacy',
    pillar: 2,
    title: {
      es: 'Rechazar encuestas externas para proteger datos de salud',
      en: 'Rejecting external survey tools to protect health data',
    },
    problem: {
      es: 'El sistema de opiniones y encuestas podría resolverse con herramientas externas listas para usar (encuestas web de terceros). Pero Farmacy Food maneja perfiles nutricionales y de salud: diabetes, celiaquía, dietas médicas.',
      en: 'The feedback and survey system could be solved with ready-made external tools (third-party web surveys). But Farmacy Food handles nutritional and health profiles: diabetes, celiac disease, medical diets.',
    },
    decision: {
      es: 'Construir el módulo de feedback dentro del propio sistema y no delegarlo a terceros, aunque eso cueste desarrollo propio. Los datos sensibles de salud no salen de la plataforma.',
      en: 'Build the feedback module inside the system rather than delegating it, even at the cost of in-house development. Sensitive health data never leaves the platform.',
    },
    tradeoff: {
      es: 'Más código propio que mantener a cambio de eliminar una fuga de datos personales de salud hacia servidores de terceros, con el riesgo legal y de reputación que implicaba.',
      en: 'More in-house code to maintain, in exchange for eliminating a leak of personal health data to third-party servers, with the legal and reputational risk that implied.',
    },
    adrs: [{ id: '010', label: 'ADR 010 · Feedback System separation' }],
    githubBase: GH + '010%20Feedback%20System%20separation.md',
  },
  {
    id: 'scale-up',
    pillar: 3,
    title: {
      es: 'Primero agrandar la máquina, recién después multiplicarla',
      en: 'Scale up first, only then scale out',
    },
    problem: {
      es: 'Todo sistema crece. La pregunta es si se paga desde el día uno por muchas máquinas pequeñas con balanceador (escala horizontal) o se empieza con pocas máquinas que se van agrandando (escala vertical).',
      en: 'Every system grows. The question is whether to pay from day one for many small machines behind a load balancer (horizontal scale) or start with few machines that grow in size (vertical scale).',
    },
    decision: {
      es: 'Escalar verticalmente durante los primeros meses o años: ante carga, se agranda la máquina. La escala horizontal (más instancias y balanceadores) queda para cuando la telemetría muestre que la vertical ya no da.',
      en: 'Scale vertically during the first months or years: under load, buy a bigger machine. Horizontal scale (more instances and balancers) waits until telemetry shows vertical scaling has hit its ceiling.',
    },
    tradeoff: {
      es: 'Una sola máquina grande es un único punto de falla mientras no se duplique. Con el tráfico real de este negocio (menos de una petición por segundo), ese riesgo era infinitamente más barato de asumir que la complejidad permanente de un cluster.',
      en: 'One big machine is a single point of failure until duplicated. At this business\u2019s real traffic (under one request per second), that risk was infinitely cheaper than the permanent complexity of a cluster.',
    },
    adrs: [{ id: '014', label: 'ADR 014 · Deployment Strategy' }],
    githubBase: GH + '014%20Deployment%20Strategy.md',
  },
  {
    id: 'datadog',
    pillar: 3,
    title: {
      es: 'Monitoreo alquilado antes que monitoreo casero',
      en: 'Rented monitoring before home-grown monitoring',
    },
    problem: {
      es: 'La telemetría es obligatoria, pero montar las herramientas open source de monitoreo (recolectar métricas, graficarlas, almacenarlas) exige servidores propios y — sobre todo — horas de desarrollador para mantenerlas.',
      en: 'Telemetry is mandatory, but self-hosting the open-source monitoring stack (collecting metrics, graphing them, storing them) demands extra servers and, above all, developer hours to keep it alive.',
    },
    decision: {
      es: 'Pagar la suscripción de un servicio de monitoreo gestionado (DataDog, ~15 USD por servidor al mes) en lugar de operar el stack propio. El costo aparece en la factura mensual; el beneficio, en las horas de desarrollo que no se quemaron.',
      en: 'Pay for a managed monitoring subscription (DataDog, ~$15 per host per month) instead of operating the self-hosted stack. The cost shows up on the monthly bill; the benefit, in developer hours never burned.',
    },
    tradeoff: {
      es: 'Fue el ítem más caro del presupuesto anual (más que todas las máquinas juntas). El equipo lo defendió con una cuenta simple: mantener el stack casero costaba medio sueldo de desarrollador al mes.',
      en: 'It was the most expensive line of the yearly budget (more than all machines combined). The team defended it with simple math: running the home-grown stack cost half a developer salary per month.',
    },
    adrs: [{ id: '003', label: 'ADR 003 · Tracing and Monitoring System' }],
    githubBase: GH + '003%20Tracing%20and%20Monitoring%20Sytem.md',
  },
  {
    id: 'edge-auth',
    pillar: 3,
    title: {
      es: 'Validar credenciales en la puerta, no en cada escritorio',
      en: 'Check credentials at the gate, not at every desk',
    },
    problem: {
      es: 'Si cada pieza del sistema verificara la identidad de cada visitante, todas gastarían tiempo y todas repetirían la misma lógica sensible. Además, el monolito confía en sus propios módulos… ¿hasta cuándo?',
      en: 'If every part of the system verified every visitor\u2019s identity, all of them would spend time and duplicate the same sensitive logic. Besides, a monolith trusts its own modules… until when?',
    },
    decision: {
      es: 'Autenticar en el borde de la red: el balanceador de entrada valida los tokens contra el servicio de identidades de AWS (Cognito) antes de que el tráfico llegue a los servidores. Y por dentro, "confianza cero": los módulos también exigen autorización entre sí, como si ya fueran servicios separados.',
      en: 'Authenticate at the network edge: the incoming load balancer validates tokens against AWS\u2019s identity service (Cognito) before traffic reaches the servers. And inside, zero trust: modules also demand authorization from each other, as if they were already separate services.',
    },
    tradeoff: {
      es: 'Dependencia de servicios gestionados de AWS y una verificación extra entre módulos que podría sobrar en un monolito chico. Garantiza que el día que los módulos se separen, la seguridad ya estaba lista.',
      en: 'Dependence on AWS managed services and an extra check between modules that might seem redundant in a small monolith. It guarantees that the day modules are split apart, security is already in place.',
    },
    adrs: [{ id: '006', label: 'ADR 006 · Zero trust architecture' }],
    githubBase: GH + '006%20Zero%20trust%20architecture.md',
  },
];
