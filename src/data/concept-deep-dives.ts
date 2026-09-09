// =======================================================================
// INTERACTIVE ARCHITECTURAL CONCEPT DEEP DIVES
// Pedagogical breakdown designed for senior developers transitioning to architecture.
// Zero em dashes, authentic quotes, clear mental models.
// =======================================================================

export interface ConceptKeyTerm {
  term: string;
  explanation: string;
}

export interface ConceptDetail {
  id: string;
  category: string;
  categoryIcon: string;
  title: string;
  headline: string;
  frontendAnalogy?: string;
  mechanism: string;
  keyTerms: ConceptKeyTerm[];
  farmacyCase: string;
  architecturalLesson: string;
  originalQuote?: string;
}

export const conceptDeepDives: Record<string, ConceptDetail> = {
  "actor-model": {
    "id": "actor-model",
    "category": "Concurrencia & Memoria",
    "categoryIcon": "🧊",
    "title": "El Patrón Actor (Actor Model)",
    "headline": "Un buzón secuencial en memoria por cada heladera física: cero bloqueos de base de datos",
    "frontendAnalogy": "Si conocés cómo un Web Worker o un event loop procesa una tarea a la vez en su propio hilo sin compartir memoria, o cómo un reducer de Redux procesa una cola de acciones de forma determinista, un Actor en backend funciona igual: es una entidad aislada que tiene su propio buzón (mailbox) privado y procesa mensajes uno tras otro.",
    "mechanism": "En lugar de resolver la concurrencia a nivel de base de datos relacional (con bloqueos pesados como SELECT ... FOR UPDATE que saturan las conexiones y generan deadlocks), el Modelo de Actores (creado por Carl Hewitt y popularizado por Erlang/Akka) encapsula el estado dentro de un proceso liviano en memoria RAM. Cada actor procesa los mensajes de su cola estrictamente de a uno a velocidad de microsegundos de CPU. Ningún otro proceso puede mutar sus variables internas directamente; solo pueden enviarle mensajes asíncronos.",
    "keyTerms": [
      {
        "term": "Mailbox (Buzón de Mensajes)",
        "explanation": "Cola FIFO en memoria privada de cada actor. Todos los comandos (reservar vianda, deducir stock) se encolan allí y se procesan secuencialmente, eliminando condiciones de carrera sin usar semáforos o mutexes."
      },
      {
        "term": "Estado Encapsulado en RAM",
        "explanation": "El stock vivo de la heladera reside en la memoria de la instancia. Al confirmarse un retiro físico, el actor actualiza su estado interno en microsegundos y luego emite un evento asíncrono para persistir en disco."
      }
    ],
    "farmacyCase": "ArchColider asignó exactamente un Actor a cada heladera física. Su razonamiento físico fue irrebatible: un usuario compra en una heladera específica, y una vianda no puede saltar mágicamente de una heladera a otra. Las reservas y compras de cada punto de venta se resolvían secuencialmente en el actor de esa heladera, garantizando cero conflictos de stock.",
    "architecturalLesson": "Mapeá los límites de concurrencia al mundo material. Cuando un recurso físico no puede compartirse entre ubicaciones, crear un actor por entidad física en memoria elimina la sobrecarga de bloqueos distribuidos.",
    "originalQuote": "We propose to use the actor pattern because we have natural actors in life: fridges. A user always buys from a specific fridge, and a meal can't magically jump from one fridge to another."
  },
  "inhibit-window": {
    "id": "inhibit-window",
    "category": "Transacciones & Resiliencia",
    "categoryIcon": "⏱️",
    "title": "Ventana de Inhibición (Gmail Undo Send Pattern)",
    "headline": "Demorar la orden 30 segundos en el backend para anular compras impulsivas sin costo de pasarela",
    "frontendAnalogy": "Es idéntico a la función 'Deshacer envío' de Gmail. Cuando presionás Enviar, el cliente de correo no despacha el mail de inmediato por SMTP: lo retiene 10 o 30 segundos en una cola temporal local. Si te arrepentís y hacés clic en Deshacer, el mail jamás salió al mundo exterior.",
    "mechanism": "En e-commerce y retail desatendido, una de las mayores fuentes de fricción operativa son los arrepentimientos inmediatos de compra. Si el backend procesa el cobro con Stripe en el milisegundo cero, una cancelación a los 5 segundos obliga a ejecutar un reembolso bancario formal: pagar comisiones no recuperables de pasarela, lidiar con demoras de acreditación en el banco del usuario (3 a 5 días hábiles) y disparar eventos de compensación en múltiples servicios. La ventana de inhibición retiene la orden en estado 'pendiente de despacho' durante 10 a 30 segundos antes de invocar la API de pago externa.",
    "keyTerms": [
      {
        "term": "Transacción Compensatoria",
        "explanation": "Operación de software que deshace los efectos de una transacción previa en sistemas distribuidos (por ejemplo, emitir una nota de crédito o revertir un débito bancario). Siempre es más costosa y propensa a fallos que evitarla de entrada."
      },
      {
        "term": "Inhibition Hold (Retención de Orden)",
        "explanation": "Pausa temporal deliberada en el flujo de ejecución donde la orden se registra pero no se liquida financieramente, permitiendo cancelaciones limpias a costo cero."
      }
    ],
    "farmacyCase": "ArchColider documentó en InformationModels.md que entre el 2% y el 5% de las órdenes sufren cancelaciones inmediatas. Al aplicar una retención de 10 a 30 segundos previa al cobro con Stripe, todas esas cancelaciones se resolvían localmente en memoria sin comisiones bancarias ni quejas de comensales.",
    "architecturalLesson": "No te apures a ejecutar llamadas externas destructivas o costosas. Introducir una pequeña latencia controlada antes de comprometer fondos o recursos externos reduce exponencialmente la complejidad de recuperación ante errores humanos.",
    "originalQuote": "User can cancel any order, and as Gmail does, we can inhibit order execution for 10-30 seconds to give a chance for a user to cancel an order without any complications as refunding and involving payment systems."
  },
  "pacelc-theorem": {
    "id": "pacelc-theorem",
    "category": "Teoremas Distribuidos",
    "categoryIcon": "⚖️",
    "title": "Teorema PACELC (La Extensión Realista de CAP)",
    "headline": "Si hay partición: Disponibilidad vs Consistencia. Si no la hay: Latencia vs Consistencia",
    "frontendAnalogy": "Pensalo como cachear datos en React Query: ante un corte total de red en el cliente, decidís si mostrás la UI desactualizada (Disponibilidad) o una pantalla de error (Consistencia). Pero cuando la red funciona perfecto (el 99.9% del tiempo), tu disyuntiva diaria es: ¿muestro datos del cache en 1 ms aunque puedan tener 5 segundos de retraso (Latencia), o espero a que el servidor valide la última mutación tardando 300 ms (Consistencia)?",
    "mechanism": "Formulado por Daniel Abadi en 2012, PACELC resuelve la gran omisión del Teorema CAP de Eric Brewer. CAP solo analiza qué pasa ante una partición de red (P). Pero en la nube moderna la red opera normalmente el 99.99% del tiempo. PACELC establece: Si hay Partición (P), elegís entre Disponibilidad (A) o Consistencia (C); sino (Else), en operación ordinaria el dilema permanente es entre Latencia (L) o Consistencia (C). Para ofrecer lecturas ultra-rápidas a escala, tenés que aceptar consistencia eventual.",
    "keyTerms": [
      {
        "term": "Teorema CAP (Brewer)",
        "explanation": "Postulado de 2000 que afirma que ante una partición de red en un sistema distribuido, es físicamente imposible garantizar simultáneamente Consistencia lineal y Disponibilidad total."
      },
      {
        "term": "Trade-off Else (L vs C)",
        "explanation": "En ausencia de fallas de red, una réplica distribuida debe decidir si responde inmediatamente al cliente con datos locales (baja latencia) o espera confirmación de otras réplicas (consistencia fuerte)."
      }
    ],
    "farmacyCase": "Myagis-Forest eligió Latencia (L) en la consulta de menús usando vistas desnormalizadas en cache: un comensal al mediodía ve el catálogo en 50 ms aunque un plato recién vendido tarde 3 segundos en desaparecer. Por el contrario, ArchColider priorizó Consistencia (C) en el momento del cobro mediante su actor de heladera para no cobrar platos agotados.",
    "architecturalLesson": "No diseñes tu sistema pensando solo en catástrofes de red. Tu arquitectura se mide en el 99.9% del tiempo normal: decidí explícitamente si tu negocio muere por lentitud de respuesta o por datos desincronizados."
  },
  "optimistic-concurrency": {
    "id": "optimistic-concurrency",
    "category": "Persistencia & Bloqueos",
    "categoryIcon": "🛡️",
    "title": "Control de Concurrencia Optimista (OCC)",
    "headline": "Commit condicional con número de versión: escalar sin congelar tablas en la base de datos",
    "frontendAnalogy": "Es exactamente igual al funcionamiento de los encabezados HTTP If-Match y ETags, o cómo Git gestiona los commits. Si dos desarrolladores bajan la versión 12 de un archivo y uno hace push primero, la rama pasa a la versión 13. Cuando el segundo intenta subir, Git rechaza el push y le pide actualizarse, sin haber bloqueado jamás el repositorio mientras editaban.",
    "mechanism": "En el control de concurrencia pesimista, el sistema asume que los conflictos son frecuentes y bloquea la fila en la base de datos (SELECT ... FOR UPDATE) impidiendo cualquier otra lectura o escritura hasta que termine la transacción. Esto colapsa el rendimiento y provoca deadlocks. El control optimista (OCC) asume que los conflictos son la excepción: no bloquea nada. Cada fila o agregado guarda un campo 'version'. Al escribir, ejecuta un UPDATE ... WHERE id = X AND version = 5. Si otra transacción modificó la fila antes, la versión ya no es 5, la consulta afecta 0 filas, el sistema detecta el conflicto limpiamente y la aplicación decide si reintenta o informa al usuario.",
    "keyTerms": [
      {
        "term": "Versión de Agregado",
        "explanation": "Número secuencial entero o hash que se incrementa monótonamente con cada mutación de un agregado en la base de datos o en Event Sourcing."
      },
      {
        "term": "Deadlock (Bloqueo Mutuo)",
        "explanation": "Situación crítica en bloqueos pesimistas donde la transacción A bloquea la fila 1 y espera la fila 2, mientras la transacción B bloquea la fila 2 y espera la fila 1, congelando el motor de base de datos."
      }
    ],
    "farmacyCase": "ArchColider implementó OCC en EventStoreDB (ADR 007). Cada orden de comida tiene un número de versión secuencial. Si dos hilos intentaban registrar el retiro del mismo ítem, la segunda escritura fallaba por conflicto de versión, evitando inconsistencias de stock sin poner locks en la base de datos.",
    "architecturalLesson": "Usá concurrencia pesimista únicamente si el costo de reintentar es inaceptable o la tasa de colisión es masiva. Para el 95% de los sistemas de negocio web, el control optimista ofrece órdenes de magnitud mayor throughput."
  },
  "distributed-fallacies": {
    "id": "distributed-fallacies",
    "category": "Sistemas Distribuidos",
    "categoryIcon": "💣",
    "title": "Las Falacias de la Computación Distribuida",
    "headline": "Las 8 suposiciones falsas de L. Peter Deutsch que destruyen proyectos de microservicios",
    "frontendAnalogy": "En una Single Page Application (SPA), llamar a una función local de JavaScript toma 0.0001 milisegundos y nunca falla por 'problemas de cable'. Pero cuando llamás a una API remota mediante fetch(), la conexión puede colapsar, demorar 2 segundos, llegar desordenada o recibir un error 504. Creer que dividir un backend en microservicios es tan inocuo como llamar a funciones internas es la trampa clásica de los juniors.",
    "mechanism": "En la década de 1990, L. Peter Deutsch y sus colegas de Sun Microsystems identificaron 8 premisas que los desarrolladores asumen como ciertas al diseñar sistemas en red y que invariablemente resultan ser falsas: 1. La red es confiable. 2. La latencia es cero. 3. El ancho de banda es infinito. 4. La red es segura. 5. La topología no cambia. 6. Hay un solo administrador. 7. El costo de transporte es cero. 8. La red es homogénea.",
    "keyTerms": [
      {
        "term": "Latencia Acumulada en Cascada",
        "explanation": "Cuando un microservicio llama a otros tres de forma encadenada por HTTP, la latencia total es la suma de los tiempos de red más el peor caso, transformando una petición de 20 ms en una de 600 ms."
      },
      {
        "term": "Falla Parcial (Partial Failure)",
        "explanation": "En un sistema distribuido, una parte del sistema puede colapsar mientras el resto sigue funcionando, dejando transacciones en estados zombis a mitad de camino."
      }
    ],
    "farmacyCase": "ArchColider fundamentó su monolito modular en su ADR 002 precisamente reconociendo estas falacias: para 2 heladeras piloto, dividir la lógica en 8 microservicios conectándose por la red agregaba serialización JSON, latencia de red y riesgo de fallas parciales sin ninguna ganancia real.",
    "architecturalLesson": "Un proceso en la misma máquina física comunicándose por llamadas a métodos en memoria siempre será órdenes de magnitud más rápido, confiable y económico que llamadas de red entre microservicios. Distribuí físicamente solo cuando la escala organizativa o de cómputo lo exija."
  },
  "event-delivery-guarantees": {
    "id": "event-delivery-guarantees",
    "category": "Mensajería Asíncrona",
    "categoryIcon": "📬",
    "title": "Garantías de Entrega: At-Least-Once e Idempotencia",
    "headline": "En redes reales 'Exactly-Once' no existe: todo consumidor está obligado a ser idempotente",
    "frontendAnalogy": "Pensá en un botón de 'Pagar $25' en React. Si el usuario hace doble clic rápido o si la conexión se corta justo cuando enviabas la petición, el navegador podría enviar el POST dos veces. Para evitar cobrarle $50, el frontend envía un header 'Idempotency-Key: uuid-123'. En el backend de mensajería pasa exactamente lo mismo entre colas y servicios.",
    "mechanism": "Debido a la imposibilidad de resolver el problema de los dos generales en redes con fallas, los brokers de mensajería (RabbitMQ, Kafka, AWS SQS) ofrecen garantía 'At-Least-Once' (al menos una vez). Cuando un consumidor procesa un mensaje y envía la confirmación (ACK), un microcorte de red puede hacer que el broker nunca reciba ese ACK. Por seguridad, el broker reenvía el mensaje. Si el consumidor no guarda un registro de mensajes ya procesados, ejecutará la acción dos veces (por ejemplo, duplicando una deducción de stock).",
    "keyTerms": [
      {
        "term": "Idempotencia",
        "explanation": "Propiedad de una operación donde el resultado es exactamente el mismo sin importar si se ejecuta una vez o diez veces con los mismos parámetros (f(x) = f(f(x)))."
      },
      {
        "term": "Message ACK (Acknowledgment)",
        "explanation": "Señal de confirmación que envía el consumidor al broker para certificar que el mensaje fue procesado exitosamente y puede eliminarse de la cola."
      }
    ],
    "farmacyCase": "ArchColider definió en su ADR 008 la garantía At-Least-Once para órdenes listas para cobrar. Cada mensaje lleva un OrderID único. Si RabbitMQ reenvía el mensaje por una desconexión momentánea, el procesador de pagos detecta que ese OrderID ya fue liquidado y descarta el duplicado.",
    "architecturalLesson": "Nunca asumas que un evento llegará una sola vez. Diseñá todo consumidor asíncrono asumiendo que recibirá mensajes duplicados y fuera de orden desde el Día 1."
  },
  "architectural-quantum": {
    "id": "architectural-quantum",
    "category": "Fundamentos de Arquitectura",
    "categoryIcon": "⚛️",
    "title": "Architectural Quantum (El Átomo de Arquitectura)",
    "headline": "La unidad mínima independiente con despliegue, persistencia propia y alta cohesión",
    "frontendAnalogy": "En frontend, un componente aislado de React no es un 'quantum' si depende de un contexto global acoplado que lo rompe al moverlo. Un quantum es como una micro-frontend o aplicación autocontenida que tiene su propio ciclo de build, su propio almacenamiento y puede funcionar de forma 100% autónoma en producción.",
    "mechanism": "Definido formalmente por Mark Richards y Neal Ford en 'Fundamentals of Software Architecture', un quantum arquitectónico es un artefacto desplegable de forma independiente que posee alta cohesión funcional, acoplamiento sincrónico interno y persistencia de datos propia. Un monolito clásico posee exactamente 1 quantum: si una sola función requiere escalar, todo el monolito debe escalarse. Pero atención: si tenés 10 microservicios que comparten la misma base de datos SQL con claves foráneas, NO tenés 10 quanta: seguís teniendo 1 solo quantum acoplado por los datos.",
    "keyTerms": [
      {
        "term": "Acoplamiento Sincrónico",
        "explanation": "Llamadas bloqueantes entre componentes donde el llamador no puede continuar sin la respuesta inmediata del receptor, unificando su disponibilidad operativa."
      },
      {
        "term": "Persistencia Independiente",
        "explanation": "Cada quantum debe ser dueño exclusivo de sus tablas o colecciones de datos; ningún otro componente puede consultar o mutar su almacenamiento directamente."
      }
    ],
    "farmacyCase": "ArchColider empaquetó su solución como un único quantum modular desplegado en AWS EC2, manteniendo un costo operativo mínimo para el primer año. Si en el año 2 el módulo de catálogo requería escalado masivo independiente, sus límites de código permitían extraerlo a un segundo quantum sin tocar el resto.",
    "architecturalLesson": "Contá los quanta de tu sistema para medir su complejidad real. Si tenés decenas de servicios pero todos comparten la misma base de datos o fallan juntos cuando se cae la red, no tenés microservicios: tenés un monolito distribuido."
  },
  "bounded-contexts": {
    "id": "bounded-contexts",
    "category": "Domain-Driven Design",
    "categoryIcon": "🗺️",
    "title": "Bounded Contexts & Homonimia en DDD",
    "headline": "Por qué una misma palabra tiene significados completamente distintos en cada rincón del sistema",
    "frontendAnalogy": "En React, sabés el peligro de tener un estado global gigante 'User' donde mezclás datos de login, datos de pago, configuración de tema y perfil social: cualquier cambio rompe componentes no relacionados. Crear contextos acotados en DDD es el equivalente a separar estados atómicos y desacoplados con responsabilidades claras.",
    "mechanism": "En sistemas empresariales, el mayor error de modelado es crear una única clase universal (por ejemplo, 'Order' o 'Product') que todo el sistema comparte. En Domain-Driven Design (Eric Evans), un Bounded Context es la frontera lingüística y conceptual donde un modelo de dominio aplica estrictamente. Fuera de esa frontera, la misma entidad del mundo real tiene un significado, atributos y reglas de negocio radicalmente diferentes.",
    "keyTerms": [
      {
        "term": "Lenguaje Ubicuo (Ubiquitous Language)",
        "explanation": "Vocabulario riguroso y compartido entre desarrolladores y expertos del negocio dentro de un Bounded Context específico, evitando ambigüedades."
      },
      {
        "term": "Anti-Corruption Layer (ACL)",
        "explanation": "Capa traductora que adapta las entidades de un sistema externo o de otro contexto para que no contaminen el modelo de dominio interno."
      }
    ],
    "farmacyCase": "En Farmacy Food, la entidad 'Plato' significa cosas opuestas en cada contexto: en Cocina es receta, ingredientes y tiempo de cocción; en la Heladera Inteligente es peso en gramos, tag RFID y temperatura; en Facturación es precio unitario, tasa de impuesto y código de descuento. Intentar crear una tabla única con todos esos campos hubiera sido caótico.",
    "architecturalLesson": "No busques el modelo de datos universal. Aceptá la duplicación controlada de entidades entre contextos a cambio de que cada equipo y módulo tenga autonomía total sobre sus reglas de negocio."
  },
  "strategic-subdomains": {
    "id": "strategic-subdomains",
    "category": "Domain-Driven Design",
    "categoryIcon": "🎯",
    "title": "Subdominios en DDD: Core, Supporting y Generic",
    "headline": "La regla de oro del ROI: dónde programar a medida y dónde comprar software empaquetado",
    "frontendAnalogy": "En un proyecto web, desarrollás componentes UI a medida para la experiencia exclusiva de tu producto (Core), escribís un modal de feedback simple con Tailwind (Supporting) e instalás librerías de mercado para fechas como date-fns o pasarelas de pago con Stripe Elements (Generic), en vez de reinventar un calendario o un validador de tarjetas desde cero.",
    "mechanism": "El diseño estratégico de DDD categoriza las áreas funcionales del negocio para asignar el presupuesto de ingeniería de forma inteligente: 1. Core Domain: La ventaja competitiva que hace único al negocio. Exige código propietario a medida con los mejores desarrolladores. 2. Supporting Domain: Funcionalidad complementaria necesaria pero que no diferencia a la empresa frente a la competencia. Se implementa de forma modular y sencilla. 3. Generic Domain: Problemas estándar ya resueltos por la industria. Jamás se programa desde cero; se adquiere un SaaS o librería probada.",
    "keyTerms": [
      {
        "term": "Ventaja Competitiva de Software",
        "explanation": "Aquéllas capacidades digitales que ningún competidor puede comprar empaquetadas en el mercado y que representan la propuesta de valor de la compañía."
      },
      {
        "term": "COTS (Commercial Off-The-Shelf)",
        "explanation": "Software comercial existente de mercado listo para usar que resuelve funcionalidades estándar sin costo de desarrollo inicial."
      }
    ],
    "farmacyCase": "ArchColider clasificó su arquitectura con precisión quirúrgica: Core Domain para el catálogo de ingredientes frescos y el motor de suscripciones; Supporting Domain para encuestas diferidas; Generic Domain para pagos (Stripe), notificaciones (Twilio) y métricas (DataDog), permitiendo a solo 4 ingenieros lanzar el producto a tiempo.",
    "architecturalLesson": "Nunca gastes horas de desarrollo en programar lo que podés comprar por $50 dólares al mes como servicio. Focalizá el 80% de tu esfuerzo técnico en el Core Domain de tu negocio."
  },
  "hexagonal-architecture": {
    "id": "hexagonal-architecture",
    "category": "Patrones de Arquitectura",
    "categoryIcon": "⬡",
    "title": "Arquitectura Hexagonal (Ports & Adapters)",
    "headline": "El dominio de negocio aislado del mundo exterior: bases de datos y frameworks como simples plugins",
    "frontendAnalogy": "Es idéntico a cómo en frontend creás una función o hook puro de TypeScript que contiene la lógica de negocio y usás interfaces para inyectar la capa de datos: no te importa si los datos vienen de localStorage, de una API REST o de un mock en tus tests de Vitest. Tu lógica de negocio permanece 100% intacta.",
    "mechanism": "Creada por Alistair Cockburn en 2005, la Arquitectura Hexagonal establece que la lógica de negocio (el núcleo de la aplicación) no debe depender de ningún detalle técnico externo (como bases de datos relacionales, frameworks web, colas de mensajería o terminales físicas). El núcleo define 'Puertos' (interfaces de entrada y salida). La tecnología concreta se implementa en 'Adaptadores' que se conectan a esos puertos desde afuera hacia adentro, respetando el Principio de Inversión de Dependencias.",
    "keyTerms": [
      {
        "term": "Puerto (Port)",
        "explanation": "Interfaz pública definida por el dominio que especifica qué operaciones necesita realizar hacia el exterior (ej: IOrderRepository o INotificationSender)."
      },
      {
        "term": "Adaptador (Adapter)",
        "explanation": "Clase de infraestructura que implementa la interfaz del puerto interactuando con una tecnología concreta (ej: PostgresOrderRepository o TwilioSmsAdapter)."
      }
    ],
    "farmacyCase": "Myagis-Forest usó Arquitectura Hexagonal en sus microservicios. Gracias a esto, pudieron simular las heladeras inteligentes de Byte Technology mediante un adaptador mock en memoria para ejecutar suites de tests automáticos en milisegundos sin requerir hardware físico conectado.",
    "architecturalLesson": "Mantené tu lógica de negocio agnóstica de frameworks y bases de datos. Si cambiar de PostgreSQL a DynamoDB te obliga a reescribir tus entidades de dominio, tu arquitectura está acoplada."
  },
  "bff-pattern": {
    "id": "bff-pattern",
    "category": "Patrones de Integración",
    "categoryIcon": "📱",
    "title": "Patrón BFF (Backend For Frontend)",
    "headline": "Un micro-backend adaptador por cada tipo de cliente: web, apps móviles y terminales IoT",
    "frontendAnalogy": "Como dev de React, conocés el sufrimiento de consumir una API monolítica que devuelve 80 campos innecesarios cuando en tu pantalla de móvil solo mostrás 3, o tener que hacer 6 peticiones HTTP encadenadas para armar una vista. El BFF es la capa intermedia que vos mismo como dev de frontend controlás para moldear el JSON perfecto en un solo viaje de red.",
    "mechanism": "Popularizado por Sam Newman y ampliamente adoptado por empresas como Netflix y SoundCloud, el patrón Backend For Frontend propone que en lugar de exponer una única API REST genérica para todos los clientes, se construya un servicio ligero y especializado para cada canal de experiencia. El BFF se encarga de autenticar, orquestar llamadas a servicios internos aguas abajo, filtrar campos y comprimir el payload para optimizar la latencia según las capacidades de la red y el hardware del cliente.",
    "keyTerms": [
      {
        "term": "Over-fetching / Under-fetching",
        "explanation": "Over-fetching es descargar datos innecesarios consumiendo batería y ancho de banda; under-fetching es requerir múltiples llamadas sucesivas para completar la información de una pantalla."
      },
      {
        "term": "Orquestación en el Borde",
        "explanation": "El BFF ejecuta llamadas paralelas a los servicios de inventario, precios y descuentos en la red local de alta velocidad de la nube, devolviendo un único JSON consolidado al cliente."
      }
    ],
    "farmacyCase": "Myagis-Forest implementó un BFF web y un BFF para las terminales de kiosco. Mientras la app web recibía información enriquecida con imágenes y recomendaciones, la terminal del kiosco consumía un payload mínimo optimizado para operar con alta latencia.",
    "architecturalLesson": "No obligues a dispositivos móviles o hardware periférico con conexiones inestables a lidiar con APIs internas genéricas. El BFF desacopla la evolución de la UI de la estructura interna del backend."
  },
  "event-sourcing": {
    "id": "event-sourcing",
    "category": "Patrones de Persistencia",
    "categoryIcon": "📜",
    "title": "Event Sourcing & Log Inmutable",
    "headline": "Guardar la historia completa en vez de UPDATEs destructivos: por qué las proyecciones no necesitan backup",
    "frontendAnalogy": "Es conceptualmente idéntico a Redux o Git. En Git, nunca hacés un UPDATE destructivo sobre tu código; cada commit es un hecho inmutable en el historial. Tu carpeta de trabajo es solo una proyección del estado actual resultante de aplicar todos los commits en secuencia desde el inicio.",
    "mechanism": "En la persistencia tradicional basada en CRUD, cuando el estado de una entidad cambia, se ejecuta un UPDATE que sobreescribe la fila, destruyendo irremediablemente la evidencia de los estados intermedios. En Event Sourcing (Greg Young), la base de datos es un log append-only inmutable donde solo se agregan eventos de dominio en pasado (ej: OrderPlaced, ItemScanned, DiscountApplied, OrderCancelled). El estado actual se calcula recalculando (fold/reduce) los eventos. Las tablas de lectura relacionales son simples proyecciones creadas a partir del log.",
    "keyTerms": [
      {
        "term": "Log Append-Only",
        "explanation": "Estructura de datos donde solo se permiten operaciones de inserción al final del archivo. Garantiza inmutabilidad, auditoría forense y alto rendimiento de escritura secuencial."
      },
      {
        "term": "Reconstrucción de Proyecciones (Replay)",
        "explanation": "Capacidad de borrar por completo una base de datos relacional de lectura y reconstruirla al 100% en minutos simplemente reproduciendo los eventos históricos desde EventStoreDB."
      }
    ],
    "farmacyCase": "ArchColider documentó en su ADR 007 que ante reclamos de comensales por viandas cobradas o fallas en sensores de las heladeras inteligentes, EventStore permitía reconstruir segundo a segundo exactamente qué ocurrió. Además, documentaron explícitamente que sus proyecciones de lectura no requerían backup, ya que el log inmutable permite recrearlas cuando sea necesario.",
    "architecturalLesson": "Si operás en dominios donde la trazabilidad legal, contable o forense es crítica (finanzas, salud, logística), nunca uses UPDATEs destructivos. Los eventos son la verdad indiscutible; el estado actual es solo una vista pasajera.",
    "originalQuote": "Keeping only the final state of a domain entity won't help to understand how we end up with a specific state... The event sourcing approach gives us a full history of changes and can help investigate issues and users' complaints."
  },
  "cqrs": {
    "id": "cqrs",
    "category": "Patrones de Persistencia",
    "categoryIcon": "🔀",
    "title": "CQRS (Command Query Responsibility Segregation)",
    "headline": "Separar la escritura transaccional de la lectura desnormalizada para optimizar ambos extremos",
    "frontendAnalogy": "Es la misma razón por la que en React separás tus mutaciones (useMutation) de tus consultas de lectura cacheadas (useQuery). Mezclar las dos cosas en un solo endpoint o modelo de datos obliga a comprometer la velocidad de lectura o la seguridad de la escritura.",
    "mechanism": "Postulado por Greg Young sobre el principio CQS de Bertrand Meyer, CQRS separa físicamente el modelo que procesa mutaciones de negocio (Comandos: POST, PUT, DELETE) del modelo que entrega datos para la interfaz de usuario (Consultas: GET). El lado de escritura se optimiza para consistencia, integridad referencial y validación de reglas de negocio (ej: PostgreSQL transaccional). El lado de lectura se optimiza para velocidad pura mediante vistas desnormalizadas en bases no relacionales o caches en memoria (ej: Redis o Elasticsearch).",
    "keyTerms": [
      {
        "term": "Comando (Command)",
        "explanation": "Intención de mutar el estado del sistema. Modifica datos pero no retorna información de consulta (salvo confirmación de éxito/error)."
      },
      {
        "term": "Consulta (Query)",
        "explanation": "Petición de lectura que retorna datos formateados para la UI sin provocar jamás ningún efecto colateral sobre el estado del sistema."
      }
    ],
    "farmacyCase": "Myagis-Forest adoptó CQRS para resolver la asimetría de tráfico en Farmacy Food: miles de comensales consultan menús y alérgenos simultáneamente al mediodía (lecturas masivas), pero solo una fracción concreta compra viandas (escrituras). Las lecturas se atendían desde caches ultra-rápidos sin congestionar la base de órdenes.",
    "architecturalLesson": "No fuerces a una única base de datos relacional normalizada a resolver al mismo tiempo la estrictez transaccional y la visualización hiper-rápida de menús. Separá comandos de consultas cuando la asimetría de tráfico lo justifique."
  },
  "pci-dss-saq-a": {
    "id": "pci-dss-saq-a",
    "category": "Seguridad & Finanzas",
    "categoryIcon": "💳",
    "title": "PCI DSS & El Truco del SAQ A",
    "headline": "Cómo un iframe de Stripe ahorra más de $100.000 USD y 300 controles de auditoría de tarjetas",
    "frontendAnalogy": "Cuando integrás Stripe Elements en React, nunca creás un `<input>` HTML propio para el número de tarjeta: renderizás un componente especial que monta un `<iframe>` seguro alojado directamente en los servidores de Stripe. Esa decisión de frontend tiene un impacto colosal e invisible en el backend.",
    "mechanism": "Las normas internacionales PCI DSS (Payment Card Industry Data Security Standard) exigen que cualquier empresa que reciba, procese o almacene datos de tarjetas de crédito se someta a auditorías anuales draconianas (nivel SAQ D: más de 300 controles técnicos, segmentación de redes, pruebas de penetración trimestrales y servidores dedicados certificados). Al delegar el cobro a Stripe mediante iframes embebidos o redirecciones, los números de tarjeta viajan directo del navegador a Stripe sin tocar jamás la memoria ni los discos de tus servidores. Esto permite calificar en el nivel más bajo de cumplimiento: SAQ A (un cuestionario administrativo de apenas 22 preguntas).",
    "keyTerms": [
      {
        "term": "SAQ A (Self-Assessment Questionnaire A)",
        "explanation": "El nivel de cumplimiento PCI DSS más simple y económico del mercado, aplicable únicamente cuando todo el procesamiento de tarjetas está 100% externalizado en un proveedor certificado Nivel 1."
      },
      {
        "term": "Superficie de Ataque Financiera",
        "explanation": "El alcance de los servidores propios sujetos a normativas de seguridad bancaria. Con SAQ A, esa superficie se reduce a cero servidores propios."
      }
    ],
    "farmacyCase": "Tanto ArchColider (ADR 009) como Myagis-Forest especificaron explícitamente SAQ A mediante formularios embebidos de Stripe. Para una startup en Día 1, intentar procesar números de tarjeta en servidores propios hubiera consumido todo su presupuesto anual en auditorías antes de vender la primera comida.",
    "architecturalLesson": "La mejor estrategia de seguridad para datos hiper-sensibles es no poseerlos. Delegá la custodia y el procesamiento en proveedores especializados para reducir tu alcance regulatorio al mínimo legal posible."
  },
  "fitness-functions": {
    "id": "fitness-functions",
    "category": "Gobernanza de Código",
    "categoryIcon": "🧪",
    "title": "Fitness Functions (Pruebas de Arquitectura Automatizadas)",
    "headline": "Tests en CI que rompen el build si alguien viola los límites de paquetes o introduce dependencias no autorizadas",
    "frontendAnalogy": "Es como configurar ESLint con reglas estrictas de dependencias circulares o TypeScript en modo estricto en tu CI, pero a nivel de arquitectura de módulos: si un desarrollador intenta hacer `import { kitchenDatabase } from '../kitchen/internal'` dentro del módulo de Catálogo, el test falla y bloquea el merge del Pull Request.",
    "mechanism": "Concebidas por Neal Ford, Rebecca Parsons y Patrick Kua en 'Building Evolutionary Architectures', una Fitness Function arquitectónica es cualquier mecanismo objetivo y verificable que evalúa si el sistema preserva sus características de diseño a medida que el código evoluciona. Mediante herramientas como ArchUnit (en Java), NetArchTest (.NET) o ts-arch / dependency-cruiser (TypeScript/Node), los arquitectos escriben pruebas unitarias ejecutadas en cada build que validan que ningún módulo viole las fronteras de capas o llame a APIs no permitidas.",
    "keyTerms": [
      {
        "term": "ArchUnit / Boundary Linters",
        "explanation": "Librerías de análisis estático que inspeccionan el bytecode o el árbol de sintaxis abstracta (AST) para verificar que las dependencias entre paquetes respeten las reglas de arquitectura."
      },
      {
        "term": "Degradación a Big Ball of Mud",
        "explanation": "El deterioro inevitable de un monolito cuando los desarrolladores, apurados por plazos, importan directamente clases internas y tablas de otros módulos saltándose las fachadas públicas."
      }
    ],
    "farmacyCase": "ArchColider documentó en su matriz de riesgos que el mayor peligro de su monolito modular era la degradación por acoplamiento indebido entre módulos internos. Su mitigación fue establecer fitness functions en el pipeline de CI para impedir la compilación ante violaciones de paquetes.",
    "architecturalLesson": "Las pautas de arquitectura escritas en un documento en PDF nunca se cumplen en el tiempo. Si querés que una frontera modular se respete en producción, convertila en un test automático que rompa el build de CI."
  },
  "store-and-forward": {
    "id": "store-and-forward",
    "category": "Hardware & Edge",
    "categoryIcon": "📡",
    "title": "Store-and-Forward & Modo Offline en Edge",
    "headline": "Seguir vendiendo comida aunque se corte el WiFi: almacenamiento local seguro y reconciliación posterior",
    "frontendAnalogy": "Es idéntico a cómo los Service Workers y PWAs almacenan peticiones en IndexedDB usando librerías como Workbox Background Sync: si el usuario pierde la conexión en el túnel del metro y hace clic en 'Guardar', la acción se guarda en local y se dispara en segundo plano apenas se recupera la señal.",
    "mechanism": "En retail físico y terminales IoT (kioscos, puntos de venta y heladeras inteligentes), depender de una conexión a internet 100% estable es inviable. El patrón Store-and-Forward permite que el dispositivo periférico (Edge) registre la transacción, genere una firma criptográfica y guarde la compra en memoria persistente local protegida (*Store*). La puerta se destraba y el cliente se alimenta. Cuando la conectividad celular o WiFi se restablece, el dispositivo reenvía en lote todas las transacciones pendientes a la nube (*Forward*) para su liquidación bancaria definitiva.",
    "keyTerms": [
      {
        "term": "Reconciliación Diferida",
        "explanation": "Proceso por el cual el backend procesa compras offline y concilia el inventario y los cobros horas después de ocurridos físicamente."
      },
      {
        "term": "Riesgo de Crédito (Float Risk)",
        "explanation": "La probabilidad de que una tarjeta aprobada en offline sea rechazada por falta de fondos al liquidarse en la nube. Se mitiga configurando límites máximos de compra sin conexión ($15-$25 USD)."
      }
    ],
    "farmacyCase": "Para los kioscos asistidos operados con terminales Toast POS y el retiro mediante PINs de un solo uso (ADR 011), Farmacy Food requería garantizar la entrega de comidas ante caídas del enlace de red local, asumiendo un riesgo financiero acotado al valor de un almuerzo.",
    "architecturalLesson": "En el mundo físico, la desconexión no es una excepción: es una condición operativa normal. Diseñá tus dispositivos edge para que operen de forma autónoma y delegá la sincronización para cuando la red vuelva."
  },
  "crdt-pragmatism": {
    "id": "crdt-pragmatism",
    "category": "Pragmatismo de Arquitectura",
    "categoryIcon": "📊",
    "title": "Descarte de CRDTs vs. Planillas de Google",
    "headline": "Cuando un Google Sheets compartido le gana a un algoritmo distribuido de sincronización",
    "frontendAnalogy": "En frontend a veces caemos en la tentación de instalar librerías pesadas de WebSockets, WebRTC y estructuras CRDT (como Yjs) para permitir edición colaborativa multiusuario en tiempo real, cuando el requerimiento del negocio era simplemente un formulario tradicional donde una sola persona edita a la vez.",
    "mechanism": "Los CRDTs (Conflict-free Replicated Data Types) son estructuras matemáticas fascinantes utilizadas por herramientas como Figma, Google Docs o Apple Notes para resolver colisiones concurrentes de datos en múltiples nodos sin necesidad de un servidor central de coordinación. Sin embargo, su implementación en producción es notoriamente compleja, exigiendo almacenamiento extra, resolución de tumbas de datos (tombstones) y modelos matemáticos no triviales.",
    "keyTerms": [
      {
        "term": "CRDT (Tipos de Datos Replicados Sin Conflicto)",
        "explanation": "Estructuras de datos diseñadas para converger automáticamente al mismo estado en múltiples nodos desconectados sin requerir bloqueos ni consenso distribuido."
      },
      {
        "term": "Sobrediseño (Over-Engineering)",
        "explanation": "El vicio de implementar soluciones tecnológicas complejas y costosas para problemas simples que podían resolverse con procesos humanos u herramientas existentes."
      }
    ],
    "farmacyCase": "Al diseñar el módulo de campañas promocionales, ArchColider consideró la posibilidad de que múltiples operadores editaran descuentos simultáneamente. En su documento Concurrency.md declararon con madurez: 'No queremos complicarlo involucrando CRDTs... preparar las campañas en Google Spreadsheet o Excel alcanza perfectamente'. Exportar un archivo y consumirlo ahorró semanas de desarrollo.",
    "architecturalLesson": "Un buen arquitecto no se mide por cuántas tecnologías sofisticadas mete en un diagrama, sino por cuánta complejidad innecesaria logra evitarle al negocio usando el sentido común.",
    "originalQuote": "From the operator's perspective we don't want to make it complicated right now involving CRDT (Conflict-free Replicated Data Types)... Preparing campaigns in Google Spreadsheet or Office 365 Excel do the trick."
  },
  "layer7-auth-offloading": {
    "id": "layer7-auth-offloading",
    "category": "Infraestructura & Red",
    "categoryIcon": "🌐",
    "title": "Offloading de Autenticación al Load Balancer (ALB + Cognito)",
    "headline": "Capa 7 de AWS interceptando y validando JWTs antes de que el tráfico toque el backend",
    "frontendAnalogy": "Pensá en un middleware de Next.js en el Edge que valida la cookie de sesión antes de cargar la página, pero llevado un nivel más abajo a la infraestructura de red: tus servidores backend ni siquiera se enteran de que existen usuarios no autenticados, porque el balanceador los rebota antes con un HTTP 302 o 401.",
    "mechanism": "En arquitecturas tradicionales, el backend de la aplicación recibe todas las peticiones entrantes, parsea las cabeceras Authorization, consulta certificados públicos para verificar firmas criptográficas de JWTs y maneja redirecciones de login. En AWS, el Application Load Balancer (ALB, Layer 7) puede configurarse con listeners HTTPS nativos que se integran directamente con AWS Cognito. El balanceador intercepta el tráfico, ejecuta el flujo Authorization Code Grant de OAuth 2.0 / OIDC, valida el token y solo reenvía a las instancias EC2 tráfico legítimo, inyectando las claims del usuario en cabeceras HTTP limpias (x-amzn-oidc-data).",
    "keyTerms": [
      {
        "term": "ALB HTTPS Listener Rule",
        "explanation": "Regla a nivel de balanceador de carga que evalúa rutas, métodos o cabeceras y ejecuta acciones nativas (autenticar con OIDC, redirigir HTTPS, enrutar a Target Groups)."
      },
      {
        "term": "x-amzn-oidc-data Header",
        "explanation": "Cabecera HTTP firmada criptográficamente por AWS que el balanceador inyecta hacia las instancias privadas con la identidad verificada del usuario."
      }
    ],
    "farmacyCase": "ArchColider documentó en Security.md que el monolito modular en EC2 no necesitaba implementar código complejo de autenticación para endpoints protegidos: el ALB de AWS se encargaba de validar los tokens contra Cognito, protegiendo las instancias internas.",
    "architecturalLesson": "Descargá tareas de seguridad e infraestructura en el borde de tu red. Cada ciclo de CPU que ahorrás en verificar firmas criptográficas en tu backend es un ciclo más disponible para procesar lógica del negocio."
  },
  "dev-prod-parity-concurrency": {
    "id": "dev-prod-parity-concurrency",
    "category": "Prácticas de Ingeniería",
    "categoryIcon": "👥",
    "title": "El Problema 1:1 de Paridad Dev/Prod en Concurrencia",
    "headline": "Por qué correr una sola instancia en desarrollo enmascara race conditions que explotan en producción",
    "frontendAnalogy": "En frontend, si probás tu app únicamente en Chrome con conexión de fibra óptica de 500 Mbps, nunca vas a ver los parpadeos de carga (layout shifts), problemas de compatibilidad de Safari ni condiciones de carrera que sufren los usuarios en móviles con 3G. Simular condiciones reales es obligatorio.",
    "mechanism": "El 'Problema 1:1' ocurre cuando el entorno de desarrollo o staging ejecuta exactamente un proceso de backend conectado a una base de datos local. En una sola instancia, las variables en memoria parecen compartidas, los bloqueos parecen atómicos y la latencia de red entre servicios es cero. Al desplegar a producción con 3 réplicas detrás de un balanceador de carga, el sistema colapsa: aparecen condiciones de carrera, inconsistencias de sesión y fallas de sincronización que eran invisibles en desarrollo.",
    "keyTerms": [
      {
        "term": "Paridad Dev/Prod (The Twelve-Factor App)",
        "explanation": "Principio de ingeniería que exige mantener los entornos de desarrollo, staging y producción lo más similares posible para evitar sorpresas desagradables al desplegar."
      },
      {
        "term": "Multi-Instance Local Staging",
        "explanation": "Práctica de ejecutar al menos 2 instancias de los servicios de negocio detrás de un balanceador local (ej: Docker Compose o Minikube) durante el desarrollo."
      }
    ],
    "farmacyCase": "ArchColider catalogó en su documento RisksAndSensitivePoints.md que correr 1 sola instancia en local enmascararía errores de concurrencia en pedidos. Establecieron como norma obligatoria correr al menos 2 instancias de servicios de negocio en staging para que cualquier falla de comunicación aflorara de inmediato.",
    "architecturalLesson": "Si tu arquitectura está diseñada para correr con múltiples réplicas en producción, nunca pruebes con una sola réplica en desarrollo. La concurrencia solo se valida bajo concurrencia real."
  }
};

export const conceptDeepDivesEn: Record<string, ConceptDetail> = {
  "actor-model": {
    "id": "actor-model",
    "category": "Concurrency & Memory",
    "categoryIcon": "🧊",
    "title": "The Actor Pattern (Actor Model)",
    "headline": "An in-memory sequential mailbox per physical fridge: zero database lock contention",
    "frontendAnalogy": "If you know how a Web Worker or single-threaded event loop processes tasks one by one without shared memory, or how a Redux reducer processes an action queue deterministically, an Actor in the backend works identically: an isolated entity with its own private mailbox that processes messages strictly one after another.",
    "mechanism": "Instead of managing concurrency at the relational database tier (using heavy row locks like SELECT ... FOR UPDATE that exhaust connection pools and risk deadlocks), the Actor Model (conceived by Carl Hewitt and popularized by Erlang/Akka) encapsulates state within a lightweight in-memory process. Each actor processes messages from its private mailbox strictly sequentially at microsecond CPU speeds. No other process can mutate its internal state directly; they can only send asynchronous messages.",
    "keyTerms": [
      {
        "term": "Actor Mailbox",
        "explanation": "A private in-memory FIFO queue for each actor. Commands (reserve meal, deduct stock) enter the mailbox and are processed sequentially, eliminating race conditions without mutexes."
      },
      {
        "term": "In-Memory RAM State",
        "explanation": "Live stock for the fridge lives in server memory. When a physical removal is confirmed, the actor updates its state in microseconds and publishes an async event to persist to disk."
      }
    ],
    "farmacyCase": "ArchColider assigned exactly one Actor to each physical smart fridge. Their physical reasoning was undeniable: a user purchases from a specific fridge, and a meal cannot magically jump from one fridge to another. Purchases were resolved sequentially in that fridge's actor, ensuring zero inventory conflicts.",
    "architecturalLesson": "Map concurrency boundaries to the physical world. When a physical asset cannot be shared across locations, an in-memory actor per physical entity eliminates the burden of distributed locking.",
    "originalQuote": "We propose to use the actor pattern because we have natural actors in life: fridges. A user always buys from a specific fridge, and a meal can't magically jump from one fridge to another."
  },
  "inhibit-window": {
    "id": "inhibit-window",
    "category": "Transactions & Resilience",
    "categoryIcon": "⏱️",
    "title": "Inhibit Window (Gmail Undo Send Pattern)",
    "headline": "Delaying orders 30 seconds in the backend to void impulsive cancellations without gateway fees",
    "frontendAnalogy": "Identical to Gmail's 'Undo Send' button. When you hit Send, the email client doesn't immediately dispatch the message via SMTP: it holds it for 10 to 30 seconds in a temporary local queue. If you click Undo, the email never left for the outside world.",
    "mechanism": "In e-commerce and unattended retail, impulsive cancellations are a major source of operational friction. If the backend immediately charges the credit card via Stripe on millisecond zero, a cancellation 5 seconds later forces a formal bank refund: paying non-refundable gateway fees, enduring 3 to 5 business day settlement delays, and triggering multi-service compensation flows. The inhibit window holds the order in a pending dispatch state for 10 to 30 seconds before calling the external payment processor.",
    "keyTerms": [
      {
        "term": "Compensating Transaction",
        "explanation": "A software operation that unwinds the side effects of a previously committed transaction in a distributed system (e.g. issuing a credit memo or bank refund). Always more complex and failure-prone than avoiding the operation in the first place."
      },
      {
        "term": "Inhibition Hold",
        "explanation": "A deliberate operational pause where an order is recorded but not financially settled, enabling clean cancellations at zero cost."
      }
    ],
    "farmacyCase": "ArchColider documented in InformationModels.md that 2% to 5% of orders experience immediate cancellations. By enforcing a 10 to 30-second hold prior to charging with Stripe, all immediate cancellations were resolved in memory with zero payment fees or customer complaints.",
    "architecturalLesson": "Do not rush to execute destructive or costly external API calls. Introducing a controlled delay before committing funds or external resources dramatically reduces the complexity of handling human error.",
    "originalQuote": "User can cancel any order, and as Gmail does, we can inhibit order execution for 10-30 seconds to give a chance for a user to cancel an order without any complications as refunding and involving payment systems."
  },
  "pacelc-theorem": {
    "id": "pacelc-theorem",
    "category": "Distributed Theorems",
    "categoryIcon": "⚖️",
    "title": "The PACELC Theorem (The Practical Extension of CAP)",
    "headline": "If Partition: Availability vs Consistency. Else: Latency vs Consistency",
    "frontendAnalogy": "Think of caching in React Query: during a network blackout on the client, you decide whether to display stale cached UI (Availability) or an error screen (Consistency). But when the network works fine (99.9% of the time), your daily dilemma is: do I serve stale cache in 1 ms (Latency) or wait 300 ms for the server to confirm fresh data (Consistency)?",
    "mechanism": "Formulated by Daniel Abadi in 2012, PACELC addresses the fundamental gap in Brewer's CAP Theorem. CAP only addresses what happens during a network partition (P). But in modern cloud providers, networks run normally 99.99% of the time. PACELC states: If there is a Partition (P), choose between Availability (A) and Consistency (C); Else (E), normal operation requires trading between Latency (L) and Consistency (C). To provide fast global reads, systems must embrace eventual consistency.",
    "keyTerms": [
      {
        "term": "CAP Theorem (Brewer)",
        "explanation": "The 2000 proof showing that when network partitions occur in distributed systems, guaranteeing both strict Consistency and full Availability is impossible."
      },
      {
        "term": "Else Trade-off (L vs C)",
        "explanation": "In normal network operation, distributed replicas must decide whether to answer read requests immediately with local state (low latency) or wait for replica quorum acknowledgment (strict consistency)."
      }
    ],
    "farmacyCase": "Myagis-Forest favored Latency (L) for menu browsing via denormalized cache views: hungry patrons browsing menus at noon get 50 ms response times even if an item sold seconds earlier takes a moment to disappear. Conversely, ArchColider prioritized Consistency (C) at checkout via its fridge actor to avoid charging for empty shelves.",
    "architecturalLesson": "Do not design your architecture solely around network disasters. Systems are evaluated during normal operation: explicitly decide whether your business suffers more from slow response times or slightly stale data."
  },
  "optimistic-concurrency": {
    "id": "optimistic-concurrency",
    "category": "Persistence & Locks",
    "categoryIcon": "🛡️",
    "title": "Optimistic Concurrency Control (OCC)",
    "headline": "Conditional commits with version numbers: scaling without freezing database tables",
    "frontendAnalogy": "Identical to HTTP If-Match and ETags, or how Git manages commits. If two developers pull version 12 of a file and one pushes first, the remote moves to version 13. When the second developer pushes, Git rejects the commit and asks for a pull, without having locked the repository while they were typing.",
    "mechanism": "In pessimistic locking, the database assumes conflicts will happen and locks rows (SELECT ... FOR UPDATE), preventing other transactions from reading or writing until completion. This destroys throughput and creates deadlocks. Optimistic Concurrency Control (OCC) assumes conflicts are rare: it never locks records during browsing. Each row or aggregate maintains a version field. At commit time, it runs UPDATE ... WHERE id = X AND version = 5. If another write occurred first, the version changed, zero rows are updated, and the application handles the retry cleanly.",
    "keyTerms": [
      {
        "term": "Aggregate Version",
        "explanation": "A monotonic sequential number or hash that increments on every committed domain state mutation."
      },
      {
        "term": "Deadlock",
        "explanation": "A deadlock in pessimistic systems where transaction A locks row 1 and awaits row 2, while transaction B locks row 2 and awaits row 1, freezing database worker threads."
      }
    ],
    "farmacyCase": "ArchColider adopted OCC inside EventStoreDB (ADR 007). Each meal order aggregate holds a sequential version number. If two processes attempted to reserve the same meal simultaneously, the second write failed on version mismatch without holding table locks.",
    "architecturalLesson": "Use pessimistic locking only when the operational cost of a retry is unacceptably high or collision rates are massive. For 95% of web platforms, optimistic concurrency delivers significantly higher throughput."
  },
  "distributed-fallacies": {
    "id": "distributed-fallacies",
    "category": "Distributed Systems",
    "categoryIcon": "💣",
    "title": "The Fallacies of Distributed Computing",
    "headline": "The 8 false assumptions compiled by L. Peter Deutsch that break microservice projects",
    "frontendAnalogy": "In a React SPA, calling a local JavaScript function takes 0.0001 ms and never fails due to network wiring. But when calling a remote API with fetch(), connections drop, lag for seconds, arrive out of order, or return 504 Gateway Timeouts. Assuming that splitting a backend into microservices is as harmless as local function calls is the classic junior architect trap.",
    "mechanism": "In the 1990s, L. Peter Deutsch and Sun Microsystems fellows identified 8 premises that developers assume to be true when designing networked systems, all of which prove false in production: 1. The network is reliable. 2. Latency is zero. 3. Bandwidth is infinite. 4. The network is secure. 5. Topology does not change. 6. There is one administrator. 7. Transport cost is zero. 8. The network is homogeneous.",
    "keyTerms": [
      {
        "term": "Cascading Latency",
        "explanation": "When a single user request triggers sequential synchronous RPC calls across microservices, total latency becomes the sum of all network round trips, turning a 20 ms action into a 600 ms wait."
      },
      {
        "term": "Partial Failure",
        "explanation": "When an individual subsystem crashes or times out while the rest of the distributed cluster remains online, stranding transactions in inconsistent states."
      }
    ],
    "farmacyCase": "ArchColider defended its modular monolith in ADR 002 by acknowledging these exact fallacies: for 2 pilot fridges, distributing code across 8 microservices introduced JSON serialization, network latency, and partial failure risks with zero business upside.",
    "architecturalLesson": "An in-process method call inside a single application is always orders of magnitude faster, more reliable, and cheaper than network RPCs. Distribute physically only when organizational or computing scale genuinely demands it."
  },
  "event-delivery-guarantees": {
    "id": "event-delivery-guarantees",
    "category": "Asynchronous Messaging",
    "categoryIcon": "📬",
    "title": "Message Delivery Guarantees: At-Least-Once & Idempotency",
    "headline": "In real-world networks exactly-once delivery is a myth: consumers must be idempotent",
    "frontendAnalogy": "Think of a 'Pay $25' button in React. If a user double-clicks rapidly or connectivity flickers while dispatching, the browser might fire the POST request twice. To avoid charging $50, the frontend includes an 'Idempotency-Key: uuid-123' header. In backend message brokers, identical rules apply.",
    "mechanism": "Because the Two Generals Problem proves consensus over unreliable networks is impossible, message brokers (RabbitMQ, Kafka, AWS SQS) guarantee 'At-Least-Once' delivery. When a consumer completes work and sends an acknowledgment (ACK), a network hiccup can prevent the broker from receiving the ACK. The broker re-delivers the message. If the consumer does not track processed message IDs, it will execute duplicate operations.",
    "keyTerms": [
      {
        "term": "Idempotency",
        "explanation": "The property where an operation produces the identical outcome regardless of whether it is invoked once or ten times with the same parameters (f(x) = f(f(x)))."
      },
      {
        "term": "Message ACK",
        "explanation": "A protocol signal sent from the consumer to the broker confirming successful processing, allowing the message to be removed from the queue."
      }
    ],
    "farmacyCase": "ArchColider established in ADR 008 an At-Least-Once delivery contract for orders ready for payment. Each message carries a unique OrderID. When RabbitMQ re-delivers a message during network blips, the payment handler identifies that the OrderID is already settled and skips processing.",
    "architecturalLesson": "Never assume a message broker will deliver an event exactly once. Design every asynchronous consumer assuming it will receive duplicate and out-of-order messages from Day 1."
  },
  "architectural-quantum": {
    "id": "architectural-quantum",
    "category": "Architecture Fundamentals",
    "categoryIcon": "⚛️",
    "title": "The Architectural Quantum",
    "headline": "The smallest independently deployable unit with high cohesion and its own persistence",
    "frontendAnalogy": "In frontend, an isolated React component is not a 'quantum' if it relies on an entangled global state that breaks when relocated. A quantum is like an autonomous micro-frontend with its own build pipeline and storage, capable of operating completely independently in production.",
    "mechanism": "Formally introduced by Mark Richards and Neal Ford in 'Fundamentals of Software Architecture', an architectural quantum is an independently deployable artifact featuring high functional cohesion, internal synchronous coupling, and dedicated data storage. A traditional monolith has exactly 1 quantum: scaling any feature requires scaling the entire binary. But note: 10 microservices sharing a single SQL database do NOT represent 10 quanta: they remain a single data-coupled quantum.",
    "keyTerms": [
      {
        "term": "Synchronous Coupling",
        "explanation": "Blocking calls between components where callers cannot continue without immediate callee replies, binding their availability together."
      },
      {
        "term": "Independent Persistence",
        "explanation": "Each quantum must exclusively own its data tables; no external service can query or mutate its underlying storage directly."
      }
    ],
    "farmacyCase": "ArchColider packaged its solution as a single modular quantum on AWS EC2, maintaining minimal operating costs for Year 1. If meal browsing demanded massive scaling in Year 2, code boundaries allowed extracting that single quantum without rewriting the application.",
    "architecturalLesson": "Count your system's quanta to evaluate its actual architectural complexity. If you operate 20 services that all crash together when a single shared database hiccups, you do not have microservices: you have a distributed monolith."
  },
  "bounded-contexts": {
    "id": "bounded-contexts",
    "category": "Domain-Driven Design",
    "categoryIcon": "🗺️",
    "title": "Bounded Contexts & Semantic Boundaries in DDD",
    "headline": "Why the same word has completely different meanings across separate domains",
    "frontendAnalogy": "In React, you know the danger of maintaining a monolithic global 'User' state mixing authentication credentials, checkout credit cards, dark mode preferences, and social followers: mutating one field risks breaking unrelated components. Bounded contexts enforce clean isolation boundaries.",
    "mechanism": "In enterprise software, the most common modeling trap is creating a universal data model (such as a single 'Order' or 'Product' class shared across every repository). In Domain-Driven Design (Eric Evans), a Bounded Context defines the linguistic boundary where a domain model applies cleanly. Beyond that boundary, the same real-world concept holds distinct attributes, rules, and lifecycles.",
    "keyTerms": [
      {
        "term": "Ubiquitous Language",
        "explanation": "A shared, precise terminology agreed upon by engineers and domain experts within a specific bounded context, eliminating semantic ambiguity."
      },
      {
        "term": "Anti-Corruption Layer (ACL)",
        "explanation": "An adapter layer that translates external models into pure internal domain entities, preventing foreign schema leaks."
      }
    ],
    "farmacyCase": "In Farmacy Food, 'Meal' has contradictory meanings across contexts: in Kitchen, it represents raw ingredients, recipes, and prep times; in the Smart Fridge, it represents grams of weight, RFID tags, and expiration timestamps; in Billing, it represents SKUs, tax rates, and discount vouchers. Forcing all of these into a single table would have been catastrophic.",
    "architecturalLesson": "Do not chase a universal data model. Embrace controlled model duplication across bounded contexts so that teams and domains can evolve business logic autonomously."
  },
  "strategic-subdomains": {
    "id": "strategic-subdomains",
    "category": "Domain-Driven Design",
    "categoryIcon": "🎯",
    "title": "Strategic Subdomains in DDD: Core, Supporting, Generic",
    "headline": "The golden rule of engineering ROI: where to build bespoke software and where to buy SaaS",
    "frontendAnalogy": "In a web project, you build custom UI components for your product's signature workflow (Core), build a simple feedback modal with Tailwind (Supporting), and import proven libraries like date-fns or Stripe Elements (Generic) rather than coding date parsers or credit card validators from scratch.",
    "mechanism": "Strategic Domain-Driven Design organizes business capabilities to allocate engineering capital where it matters most: 1. Core Domain: The proprietary competitive advantage. Demands bespoke custom development and your strongest engineers. 2. Supporting Domain: Essential operational functions that do not differentiate the business. Kept modular and simple. 3. Generic Domain: Standard industry problems. Never coded from scratch; handled via SaaS or commercial software.",
    "keyTerms": [
      {
        "term": "Competitive Software Advantage",
        "explanation": "Capabilities that cannot be bought off the shelf and that represent the primary value proposition of the company."
      },
      {
        "term": "COTS (Commercial Off-The-Shelf)",
        "explanation": "Existing commercial products and SaaS platforms that solve generic functions without bespoke engineering overhead."
      }
    ],
    "farmacyCase": "ArchColider classified their architecture with surgical precision: Core Domain for the real-time fresh meal catalog and recurring subscription engine; Supporting Domain for kitchen scheduling; Generic Domain for payments (Stripe), SMS (Twilio), and telemetry (DataDog), allowing 4 developers to ship the platform on time.",
    "architecturalLesson": "Never spend engineering hours building what you can buy for $50/month. Concentrate 80% of your technical firepower on your Core Domain."
  },
  "hexagonal-architecture": {
    "id": "hexagonal-architecture",
    "category": "Architecture Patterns",
    "categoryIcon": "⬡",
    "title": "Hexagonal Architecture (Ports & Adapters)",
    "headline": "Isolating business logic from outside technology: databases and frameworks as interchangeable plugins",
    "frontendAnalogy": "Identical to writing pure TypeScript business functions and hooks with injected interfaces: your domain does not care whether data originates from localStorage, an API fetch, or mock data inside a Vitest suite. Business logic remains 100% pure.",
    "mechanism": "Conceived by Alistair Cockburn in 2005, Hexagonal Architecture dictates that business logic (the application core) must not depend on external technology (such as databases, web frameworks, message brokers, or physical hardware). The core declares 'Ports' (input/output interfaces). Concrete technology is implemented in 'Adapters' that plug into those ports from the outside in, enforcing the Dependency Inversion Principle.",
    "keyTerms": [
      {
        "term": "Port",
        "explanation": "An interface declared by the domain core specifying required external interactions (e.g. IOrderRepository or INotificationGateway)."
      },
      {
        "term": "Adapter",
        "explanation": "An infrastructure class implementing a port to communicate with concrete technology (e.g. PostgresOrderRepository or TwilioSmsAdapter)."
      }
    ],
    "farmacyCase": "Myagis-Forest structured its microservices with hexagonal ports and adapters. Consequently, they could test smart fridge interactions using in-memory mock adapters inside unit test suites without needing physical hardware connected to CI.",
    "architecturalLesson": "Keep domain models framework-agnostic. If switching from PostgreSQL to DynamoDB forces you to alter business domain entities, your architecture is coupled."
  },
  "bff-pattern": {
    "id": "bff-pattern",
    "category": "Integration Patterns",
    "categoryIcon": "📱",
    "title": "The BFF Pattern (Backend For Frontend)",
    "headline": "A dedicated adapter micro-backend for each client experience: web, mobile, and IoT terminals",
    "frontendAnalogy": "As a React developer, you know the frustration of consuming a generic backend API that returns 80 useless fields when your mobile view only needs 3, or having to make 6 chained HTTP queries to assemble a view. A BFF is the intermediary service you own to shape the exact payload in a single network hop.",
    "mechanism": "Popularized by Sam Newman, the Backend For Frontend pattern provides specialized, lightweight server layers tailored to specific client applications rather than exposing one generic API. The BFF authenticates requests, orchestrates downstream microservice calls over high-speed cloud networks, strips irrelevant fields, and compresses data specifically for the client's screen and network constraints.",
    "keyTerms": [
      {
        "term": "Over-fetching / Under-fetching",
        "explanation": "Over-fetching downloads unnecessary bytes that drain battery and bandwidth; under-fetching requires chained round trips to complete a view."
      },
      {
        "term": "Edge Aggregation",
        "explanation": "The BFF coordinates concurrent downstream calls to inventory, pricing, and rewards over local cloud networks, delivering a single consolidated response."
      }
    ],
    "farmacyCase": "Myagis-Forest deployed a web BFF and a dedicated kiosk BFF. While the web app received rich imagery and nutritional breakdowns, the kiosk terminal received a minimal payload optimized for high-latency cellular networks.",
    "architecturalLesson": "Do not force constrained mobile devices or peripheral hardware to consume generic internal APIs. A BFF decouples frontend evolution from backend service topologies."
  },
  "event-sourcing": {
    "id": "event-sourcing",
    "category": "Persistence Patterns",
    "categoryIcon": "📜",
    "title": "Event Sourcing & Append-Only Logs",
    "headline": "Storing immutable history instead of destructive updates: why CQRS read views do not need backups",
    "frontendAnalogy": "Conceptually identical to Redux or Git. In Git, you never execute a destructive UPDATE over code; each commit is an immutable historical fact. Your working directory is merely a projected view resulting from applying commits sequentially from HEAD.",
    "mechanism": "In traditional CRUD databases, changing an entity's state executes a destructive UPDATE that overwrites previous rows, erasing intermediate history. In Event Sourcing (Greg Young), the database is an append-only log storing immutable past-tense domain events (e.g. OrderPlaced, ItemScanned, OrderCancelled). Current state is calculated by replaying (fold/reduce) events. Relational query tables are disposable projections derived from the log.",
    "keyTerms": [
      {
        "term": "Append-Only Log",
        "explanation": "A storage structure that only permits writing at the tail. Delivers high sequential write performance, immutability, and full forensic auditability."
      },
      {
        "term": "Projection Replay",
        "explanation": "The ability to delete a relational read database and reconstruct it to 100% accuracy in minutes by replaying raw events from EventStoreDB."
      }
    ],
    "farmacyCase": "ArchColider documented in ADR 007 that when patrons disputed charges or smart fridge sensors malfunctioned, EventStore allowed auditors to reconstruct the exact millisecond-by-millisecond sequence of events. Furthermore, they explicitly noted that their read projections did not require backups, as the event log can regenerate them at will.",
    "architecturalLesson": "If you operate in domains where financial, legal, or forensic audits matter, avoid destructive SQL UPDATEs. Events are ground truth; current state is just a disposable view.",
    "originalQuote": "Keeping only the final state of a domain entity won't help to understand how we end up with a specific state... The event sourcing approach gives us a full history of changes and can help investigate issues and users' complaints."
  },
  "cqrs": {
    "id": "cqrs",
    "category": "Persistence Patterns",
    "categoryIcon": "🔀",
    "title": "CQRS (Command Query Responsibility Segregation)",
    "headline": "Separating transactional writes from denormalized reads to optimize both ends",
    "frontendAnalogy": "The exact reason you separate mutations (useMutation) from cached query views (useQuery) in React. Conflating both into a single endpoint or database model forces compromises in either query speed or transactional safety.",
    "mechanism": "Formulated by Greg Young upon Bertrand Meyer's CQS principle, CQRS physically separates the model that processes business state changes (Commands: POST, PUT, DELETE) from the model that supplies data to user interfaces (Queries: GET). The write side is tuned for transactional integrity and domain validation (e.g. PostgreSQL). The read side is tuned for raw speed via denormalized views in memory or search caches (e.g. Redis or Elasticsearch).",
    "keyTerms": [
      {
        "term": "Command",
        "explanation": "An instruction expressing an intent to mutate system state. It mutates data and returns execution status without querying broad read data."
      },
      {
        "term": "Query",
        "explanation": "A read request that returns formatted view data to the client without producing any side effects on system state."
      }
    ],
    "farmacyCase": "Myagis-Forest leveraged CQRS to handle Farmacy Food's asymmetric traffic: thousands of hungry workers inspect menus and allergens at lunch (massive reads), but only a subset finalize purchases (writes). Reads were served from high-speed caches without burdening the order database.",
    "architecturalLesson": "Do not force a single normalized relational schema to handle both rigid transactional safety and lightning-fast view queries. Separate commands from queries when traffic asymmetry warrants it."
  },
  "pci-dss-saq-a": {
    "id": "pci-dss-saq-a",
    "category": "Security & Compliance",
    "categoryIcon": "💳",
    "title": "PCI DSS & The SAQ A Architectural Shortcut",
    "headline": "How embedding a Stripe iframe saves $100,000+ USD and 300 audit controls",
    "frontendAnalogy": "When integrating Stripe Elements in React, you never render your own `<input>` tag for credit card numbers: you mount an iframe hosted directly on Stripe servers. That frontend choice has an immense, invisible compliance impact on the backend.",
    "mechanism": "PCI DSS (Payment Card Industry Data Security Standard) regulations mandate that any organization that accepts, processes, or stores cardholder data must undergo rigorous audits (SAQ D: 300+ technical controls, network segmentation, quarterly penetration testing, and expensive certified hardware). By delegating checkout to Stripe via embedded iframes or redirects, raw card numbers travel directly from the user's browser to Stripe, never touching your own servers. This qualifies the company for the simplest compliance tier: SAQ A (a self-assessment checklist of ~22 questions).",
    "keyTerms": [
      {
        "term": "SAQ A (Self-Assessment Questionnaire A)",
        "explanation": "The lightest, most cost-effective PCI DSS compliance tier, applicable only when cardholder operations are 100% outsourced to a validated Level 1 provider."
      },
      {
        "term": "Cardholder Attack Surface",
        "explanation": "The scope of internal servers subject to payment security audits. With SAQ A, internal server attack surface is reduced to zero."
      }
    ],
    "farmacyCase": "Both ArchColider (ADR 009) and Myagis-Forest specified SAQ A compliance via Stripe embedded elements. For a Day 1 startup, attempting to process raw cards on proprietary EC2 instances would have consumed their entire first-year budget on compliance audits alone.",
    "architecturalLesson": "The best security strategy for hyper-sensitive data is to never touch it. Delegate custody to specialized providers to shrink your regulatory scope to the legal minimum."
  },
  "fitness-functions": {
    "id": "fitness-functions",
    "category": "Code Governance",
    "categoryIcon": "🧪",
    "title": "Architectural Fitness Functions",
    "headline": "Automated CI tests that break the build if anyone violates module boundaries or imports forbidden packages",
    "frontendAnalogy": "Like configuring ESLint with strict circular dependency checks or TypeScript in strict mode in your CI, but for architectural modules: if an engineer writes `import { kitchenDB } from '../kitchen/internal'` inside the Orders module, the test fails and blocks the Pull Request.",
    "mechanism": "Introduced by Neal Ford, Rebecca Parsons, and Patrick Kua in 'Building Evolutionary Architectures', an architectural fitness function is an objective, automated mechanism that checks whether a software system retains its intended architectural qualities as it evolves. Using tools like ArchUnit (Java), NetArchTest (.NET), or ts-arch / dependency-cruiser (TypeScript/Node), teams write unit tests in CI that assert package dependency rules and fail the build on boundary violations.",
    "keyTerms": [
      {
        "term": "ArchUnit / Boundary Linters",
        "explanation": "Static analysis libraries that inspect bytecode or abstract syntax trees (AST) to verify package dependencies adhere to architecture rules."
      },
      {
        "term": "Big Ball of Mud Degradation",
        "explanation": "The steady deterioration of a modular codebase when engineers, rushed by deadlines, bypass public facades and directly query internal module tables."
      }
    ],
    "farmacyCase": "ArchColider highlighted in its risk matrix that the primary vulnerability of its modular monolith was internal coupling. Their mitigation was implementing architectural fitness functions in the CI pipeline to reject unauthorized cross-module dependencies.",
    "architecturalLesson": "Architecture guidelines written in a PDF are never followed over time. If you want a modular boundary respected in production, turn it into an automated test that fails the build."
  },
  "store-and-forward": {
    "id": "store-and-forward",
    "category": "Hardware & Edge",
    "categoryIcon": "📡",
    "title": "Store-and-Forward & Offline Edge Resilience",
    "headline": "Selling fresh meals through WiFi outages: secure local storage and delayed cloud reconciliation",
    "frontendAnalogy": "Identical to how Service Workers and PWAs buffer background requests in IndexedDB using tools like Workbox Background Sync: if a user loses connection in a subway tunnel and clicks 'Submit', the request is stored locally and flushed to the cloud as soon as connection recovers.",
    "mechanism": "In unattended physical retail and IoT kiosks, relying on 100% continuous internet connectivity is a fatal mistake. The Store-and-Forward pattern allows an edge terminal to record a transaction, apply a local cryptographic signature, and persist it to tamper-proof storage (*Store*). The door unlocks and the customer receives their food. When cellular or WiFi connectivity resumes, the edge device flushes pending transactions in batches to the cloud (*Forward*) for financial settlement.",
    "keyTerms": [
      {
        "term": "Deferred Reconciliation",
        "explanation": "The backend workflow that reconciles offline purchases, inventory counts, and payment charges hours after the physical sale occurred."
      },
      {
        "term": "Float Risk",
        "explanation": "The credit risk that an offline card might lack funds when processed later in the cloud. Mitigated by capping maximum offline purchase amounts ($15-$25)."
      }
    ],
    "farmacyCase": "For assisted kiosks on Toast POS terminals and one-time pickup PINs (ADR 011), Farmacy Food needed to guarantee lunch meal pickup during local ISP downtime, accepting a small financial float risk capped at the price of a salad.",
    "architecturalLesson": "In physical edge computing, disconnections are not an exception: they are standard operating conditions. Design edge devices to act autonomously and reconcile when the network returns."
  },
  "crdt-pragmatism": {
    "id": "crdt-pragmatism",
    "category": "Architectural Pragmatism",
    "categoryIcon": "📊",
    "title": "CRDT Rejection vs. Google Sheets Pragmatism",
    "headline": "When a shared Google Spreadsheet beats an elaborate distributed synchronization algorithm",
    "frontendAnalogy": "In frontend we sometimes rush to install heavy WebSockets, WebRTC, and CRDT libraries (like Yjs) to build real-time multi-cursor collaboration, when the actual product requirement was simply a standard form where one admin updates a record at a time.",
    "mechanism": "Conflict-free Replicated Data Types (CRDTs) are mathematical structures used by platforms like Figma, Google Docs, and Apple Notes to resolve concurrent edits across multiple nodes without a central coordinating server. However, running CRDTs in production carries heavy complexity: metadata bloat, tombstone garbage collection, and non-trivial state synchronization.",
    "keyTerms": [
      {
        "term": "CRDT (Conflict-free Replicated Data Type)",
        "explanation": "Data structures designed to merge concurrent offline edits deterministically without centralized locks."
      },
      {
        "term": "Over-Engineering",
        "explanation": "The anti-pattern of applying complex, costly distributed algorithms to simple problems that could be solved via human workflows or standard tools."
      }
    ],
    "farmacyCase": "When designing promotional campaigns, ArchColider considered multi-operator concurrent editing. In Concurrency.md they pragmatically stated: 'We do not want to make it complicated involving CRDTs... preparing campaigns in Google Spreadsheet or Excel does the trick.' Exporting a spreadsheet saved weeks of development.",
    "architecturalLesson": "A great software architect is not measured by how many complex technologies they assemble, but by how much unnecessary complexity they prevent with practical common sense.",
    "originalQuote": "From the operator's perspective we don't want to make it complicated right now involving CRDT (Conflict-free Replicated Data Types)... Preparing campaigns in Google Spreadsheet or Office 365 Excel do the trick."
  },
  "layer7-auth-offloading": {
    "id": "layer7-auth-offloading",
    "category": "Infrastructure & Networking",
    "categoryIcon": "🌐",
    "title": "Layer 7 Auth Offloading (ALB + Cognito)",
    "headline": "Terminating TLS and validating JWTs at the load balancer before traffic reaches your backend",
    "frontendAnalogy": "Like an edge middleware in Next.js that validates session cookies before rendering a route, but pushed even deeper into network infrastructure: your backend servers never even see unauthenticated traffic because the load balancer bounces them with an HTTP 302 or 401 beforehand.",
    "mechanism": "In traditional applications, backend application processes receive incoming requests, parse Authorization headers, query public keys to verify cryptographic JWT signatures, and handle session redirects. In AWS, an Application Load Balancer (ALB, Layer 7) can configure HTTPS listener rules that integrate directly with AWS Cognito. The ALB intercepts traffic, executes the OAuth 2.0 / OIDC Authorization Code Grant flow, validates the token, and only forwards authenticated traffic to EC2 instances, injecting claims into signed 'x-amzn-oidc-data' HTTP headers.",
    "keyTerms": [
      {
        "term": "ALB HTTPS Listener Rule",
        "explanation": "A Layer 7 routing rule evaluating paths, methods, or headers to execute native actions (authenticate with OIDC, redirect to HTTPS, forward to target groups)."
      },
      {
        "term": "x-amzn-oidc-data Header",
        "explanation": "A cryptographically signed HTTP header injected by AWS load balancers into private backend instances containing verified user identity claims."
      }
    ],
    "farmacyCase": "ArchColider documented in Security.md that their modular monolith on EC2 did not need custom authentication logic for protected endpoints: the AWS ALB validated tokens against Cognito, shielding internal application code.",
    "architecturalLesson": "Offload security and protocol enforcement to the edge of your network. Every CPU cycle saved on verifying cryptographic signatures in application code is an extra cycle available for business logic."
  },
  "dev-prod-parity-concurrency": {
    "id": "dev-prod-parity-concurrency",
    "category": "Engineering Practices",
    "categoryIcon": "👥",
    "title": "The 1:1 Dev/Prod Parity Concurrency Bug",
    "headline": "Why running a single instance in development masks race conditions that explode in production",
    "frontendAnalogy": "In frontend, if you only test your application on Chrome over 500 Mbps fiber optic internet, you will never witness layout shifts, mobile Safari quirks, or network race conditions that mobile 3G users suffer every day. Testing realistic conditions is mandatory.",
    "mechanism": "The '1:1 Parity Problem' happens when development or staging environments run exactly one backend process connected to a local database. In a single instance, in-memory variables appear shared, operations seem atomic, and network latency is zero. When deployed to production across 3 load-balanced replicas, the application breaks: race conditions, session desynchronization, and locking bugs that were invisible in development suddenly surface.",
    "keyTerms": [
      {
        "term": "Dev/Prod Parity (12-Factor App)",
        "explanation": "The engineering tenet demanding that development, staging, and production environments remain as close as possible to prevent deployment surprises."
      },
      {
        "term": "Multi-Instance Local Staging",
        "explanation": "The practice of running at least two instances of business services behind a local load balancer (via Docker Compose or Minikube) during development."
      }
    ],
    "farmacyCase": "ArchColider cataloged in RisksAndSensitivePoints.md that running 1 local instance would mask order concurrency flaws. They mandated running at least 2 instances of business services in staging so that any distributed coordination failures emerged immediately.",
    "architecturalLesson": "If your architecture runs across multiple replicas in production, never test on a single replica in development. Concurrency can only be validated under real concurrent execution."
  }
};
