/**
 * Concept deep dives — bilingual.
 *
 * Editorial rules (from the author's review):
 * - A concept chip may only appear in the section where the concept first
 *   becomes necessary. No spoilers of later sections inside a modal.
 * - Everything is explained in natural language with physical-world analogies.
 *   No frontend-specific libraries, no uncontextualized jargon.
 * - The modal must fully satisfy the reader's curiosity without leaving the page.
 */
export interface ConceptEntry {
  title: { es: string; en: string };
  body: { es: string; en: string };
}

export const CONCEPTS: Record<string, ConceptEntry> = {
  kata: {
    title: { es: '¿Qué es un Architecture Kata?', en: 'What is an Architecture Kata?' },
    body: {
      es: `<p>Un <strong>kata</strong> es un ejercicio de práctica deliberada, tomado de las artes marciales japonesas: se repite una secuencia hasta dominarla. Un <em>Software Architecture Kata</em> aplica la idea al diseño de software: un equipo recibe el pliego de requerimientos de un negocio real y tiene unas semanas para entregar la arquitectura completa de la solución, defendida ante un jurado.</p>
<p>No se programa nada. Se entrega lo que un arquitecto entrega en la vida real: análisis del negocio, restricciones, diagramas, decisiones justificadas y costos. Es lo más parecido a un caso real de consultoría, pero con retroalimentación de algunos de los arquitectos más reconocidos del mundo.</p>`,
      en: `<p>A <strong>kata</strong> is a deliberate-practice exercise borrowed from Japanese martial arts: you repeat a sequence until you master it. A <em>Software Architecture Kata</em> applies the idea to software design: a team receives the requirements brief of a real business and has a few weeks to deliver the complete architecture of the solution, defended before a jury.</p>
<p>No code is written. You deliver what an architect delivers in real life: business analysis, constraints, diagrams, justified decisions and costs. It is the closest thing to a real consulting engagement, with feedback from some of the most respected architects in the world.</p>`,
    },
  },
  rfp: {
    title: { es: 'El pliego del cliente', en: 'The client brief' },
    body: {
      es: `<p>En este kata, el "cliente" era Farmacy Food, una startup real de Detroit. El pliego que entregaron a los equipos incluía la misión del negocio, los sistemas que ya tenían contratados (heladeras inteligentes, terminales de cobro, software de cocina), los números de venta actuales y proyectados, y una lista explícita de lo que estaba fuera de alcance.</p>
<p>Todo lo que venía en ese pliego era una <strong>restricción</strong>: los arquitectos no podían cambiarlo, solo diseñar alrededor de él. Distinguir "lo que venía dado" de "lo que el equipo decidió" es la clave para leer cualquier solución de arquitectura con ojos críticos.</p>`,
      en: `<p>In this kata the "client" was Farmacy Food, a real Detroit startup. The brief handed to the teams included the business mission, the systems they had already contracted (smart fridges, payment terminals, kitchen software), current and projected sales numbers, and an explicit out-of-scope list.</p>
<p>Everything in that brief was a <strong>constraint</strong>: architects could not change it, only design around it. Telling apart "what was given" from "what the team decided" is the key to reading any architecture solution critically.</p>`,
    },
  },
  adr: {
    title: { es: '¿Qué es un ADR?', en: 'What is an ADR?' },
    body: {
      es: `<p>Un <strong>ADR</strong> (<em>Architecture Decision Record</em>) es un documento de una carilla que registra una decisión de arquitectura en tres partes: el <strong>contexto</strong> (qué problema la motivó), la <strong>decisión</strong> tomada y las <strong>consecuencias</strong> — incluidas las desventajas.</p>
<p>El formato lo popularizó Michael Nygard con un argumento simple: el código dice <em>cómo</em> es el sistema, pero no dice <em>por qué</em> quedó así. Sin ese "por qué" escrito, a los seis meses nadie se acuerda si una decisión fue deliberada o un accidente, y el siguiente desarrollador la deshace sin saberlo.</p>
<p>Su regla de oro es la honestidad: un ADR que no admite desventajas es propaganda, no una decisión. En este artículo, cada mención a un ADR (como <em>ADR 002</em>) se puede abrir en su propia ficha, con enlace al archivo original.</p>`,
      en: `<p>An <strong>ADR</strong> (<em>Architecture Decision Record</em>) is a one-page document that records an architecture decision in three parts: the <strong>context</strong> (what problem motivated it), the <strong>decision</strong> taken, and the <strong>consequences</strong> — including the downsides.</p>
<p>The format was popularized by Michael Nygard with a simple argument: code says <em>how</em> the system works, but never <em>why</em> it ended up that way. Without that "why" in writing, six months later nobody remembers whether a decision was deliberate or an accident, and the next developer undoes it unknowingly.</p>
<p>Its golden rule is honesty: an ADR that admits no downsides is propaganda, not a decision. In this article, every ADR mention (like <em>ADR 002</em>) opens its own card, linked to the original file.</p>`,
    },
  },
  'monolito-modular': {
    title: { es: 'Monolito modular vs. microservicios', en: 'Modular monolith vs. microservices' },
    body: {
      es: `<p>Un <strong>monolito</strong> es una aplicación que se despliega como una sola pieza: un único programa corriendo en un servidor. Un <strong>microservicio</strong> es lo opuesto: decenas de programas pequeños, cada uno desplegado por separado, que se comunican por red.</p>
<p>El problema del monolito clásico es que con el tiempo todo el código se mezcla con todo (el famoso "plato de espaguetis"). El problema de los microservicios es que pagas una multa permanente: más servidores, más complejidad de despliegue, más cosas que pueden fallar al comunicarse.</p>
<p>Un <strong>monolito modular</strong> toma lo mejor de ambos: se despliega como una sola pieza (barato y simple), pero su interior está dividido en módulos con fronteras estrictas, como los compartimentos de un cajón de herramientas. Si algún día un módulo necesita crecer por su cuenta, se extrae sin desarmar el resto.</p>`,
      en: `<p>A <strong>monolith</strong> is an application deployed as a single piece: one program running on one server. A <strong>microservice</strong> is the opposite: dozens of small programs, each deployed separately, communicating over the network.</p>
<p>The problem with the classic monolith is that over time everything in the code ends up entangled with everything else (the famous "big ball of mud"). The problem with microservices is that you pay a permanent toll: more servers, more deployment complexity, more things that can fail while talking to each other.</p>
<p>A <strong>modular monolith</strong> takes the best of both: it deploys as one piece (cheap and simple), but its interior is divided into modules with strict boundaries, like the compartments of a toolbox. If one day a module needs to grow on its own, it is extracted without dismantling the rest.</p>`,
    },
  },
  'entity-trap': {
    title: { es: 'La "Entity Trap"', en: 'The "Entity Trap"' },
    body: {
      es: `<p>Es el error de diseño que Mark Richards y Neal Ford señalaron en los slides oficiales de este kata: mirar el negocio, anotar los sustantivos (usuario, menú, orden, cocina) y crear un componente por cada sustantivo: <em>UsuarioManager</em>, <em>MenuManager</em>, <em>OrdenManager</em>…</p>
<p>El resultado parece ordenado pero está podrido por dentro: todos esos "managers" terminan compartiendo la misma base de datos y pisándose unos a otros, porque la vida real no avanza por sustantivos sino por <strong>flujos de trabajo</strong>: un usuario navega, pide, paga, retira. Un cajero registra. Una cocina produce.</p>
<p>El antídoto es modelar acciones de actores en el tiempo, no colecciones de cosas — y es exactamente lo que el equipo ganador hizo con su metamodelo de niveles de conocimiento y operación.</p>`,
      en: `<p>It is the design mistake Mark Richards and Neal Ford called out in this kata's official slides: look at the business, write down the nouns (user, menu, order, kitchen) and create one component per noun: <em>UserManager</em>, <em>MenuManager</em>, <em>OrderManager</em>…</p>
<p>The result looks tidy but is rotten inside: all those "managers" end up sharing the same database and stepping on each other, because real life does not advance by nouns but by <strong>workflows</strong>: a user browses, orders, pays, picks up. A cashier registers. A kitchen produces.</p>
<p>The antidote is modeling actor actions over time, not collections of things — exactly what the winning team did with its knowledge/operational-level metamodel.</p>`,
    },
  },
  'event-sourcing': {
    title: { es: 'Event Sourcing, en lenguaje llano', en: 'Event Sourcing, in plain language' },
    body: {
      es: `<p>La mayoría de los sistemas guardan el <strong>estado actual</strong> de las cosas: la tabla de órdenes dice "orden 843: pagada". Si alguien cambió ese dato, el valor anterior se perdió para siempre — como una pizarra que se borra y se reescribe.</p>
<p><strong>Event Sourcing</strong> hace lo contrario: nunca borra. Guarda la secuencia completa de eventos que ocurrieron ("orden creada", "pago confirmado", "comida retirada"), como el cuaderno de contabilidad de un negocio tradicional: cada asiento se escribe a pluma y no se borra. El estado actual se obtiene repasando el cuaderno.</p>
<p>¿Para qué sirve aquí? Si un cliente reclama "¡la heladera me cobró de más!", el sistema puede reproducir segundo a segundo qué pasó con esa orden. Para un negocio que maneja dinero y alimentos, esa trazabilidad vale oro.</p>`,
      en: `<p>Most systems store the <strong>current state</strong> of things: the orders table says "order 843: paid". If someone changed that value, the previous one is lost forever — like a whiteboard that gets erased and rewritten.</p>
<p><strong>Event Sourcing</strong> does the opposite: it never erases. It stores the complete sequence of events that happened ("order created", "payment confirmed", "meal picked up"), like the ledger of a traditional business: every entry is written in ink and never erased. The current state is derived by replaying the ledger.</p>
<p>Why does it matter here? If a customer complains "the fridge overcharged me!", the system can replay exactly what happened to that order, second by second. For a business handling money and food, that traceability is worth gold.</p>`,
    },
  },
  'actor-model': {
    title: { es: 'El modelo de actores, en lenguaje llano', en: 'The actor model, in plain language' },
    body: {
      es: `<p>Imaginá un banco con una sola fila y un solo empleado: todos los trámites pasan por él, uno por vez, en orden. Nunca hay dos clientes atendiendo la misma caja al mismo tiempo, así que nunca hay conflictos por "quién llegó primero a la misma cuenta".</p>
<p>El <strong>modelo de actores</strong> aplica esa idea al software: un "actor" es un pequeño empleado digital que tiene una cola de mensajes privada y los procesa de a uno, en orden. Mientras procesa uno, nadie más puede tocar su información interna.</p>
<p>En este caso, cada heladera tiene su propio actor. Como una vianda no puede saltar físicamente de una heladera a otra, no hace falta coordinar nada entre heladeras: cada actor administra su stock en memoria, a velocidad de procesador, sin bloquear la base de datos.</p>`,
      en: `<p>Picture a bank with a single queue and a single teller: every transaction goes through them, one at a time, in order. Two clients are never served at the same window simultaneously, so there is never a fight over "who touched the same account first".</p>
<p>The <strong>actor model</strong> applies that idea to software: an "actor" is a tiny digital clerk with a private message queue, processing messages one by one, in order. While it processes one, nobody else can touch its internal data.</p>
<p>Here, each fridge has its own actor. Since a meal cannot physically jump from one fridge to another, there is nothing to coordinate across fridges: each actor manages its stock in memory, at processor speed, without locking the database.</p>`,
    },
  },
  'message-queue': {
    title: { es: 'Colas de mensajes, en lenguaje llano', en: 'Message queues, in plain language' },
    body: {
      es: `<p>Una <strong>cola de mensajes</strong> es un buzón con confirmación de recibo entre partes de un sistema. El que envía deja el mensaje y sigue con su vida; el que recibe lo toma cuando puede y, al terminarlo, firma la confirmación ("ACK"). Si el receptor se cae a mitad de tarea, el mensaje no se pierde: vuelve a estar disponible hasta que alguien lo complete.</p>
<p>La contracara es que un mensaje puede entregarse <strong>más de una vez</strong> (el sistema reenvía por las dudas). Por eso cada mensaje lleva un identificador único: si llega repetido, el receptor reconoce "esto ya lo procesé" y lo descarta. Esa combinación — reintentos más identificador — es lo que se llama <em>idempotencia</em>, y es lo que impide cobrarle dos veces la misma comida a un cliente.</p>`,
      en: `<p>A <strong>message queue</strong> is a mailbox with delivery confirmation between parts of a system. The sender drops the message and moves on; the receiver takes it when it can and, when done, signs the confirmation ("ACK"). If the receiver crashes mid-task the message is not lost: it becomes available again until someone completes it.</p>
<p>The flip side is that a message may be delivered <strong>more than once</strong> (the system resends just in case). That is why every message carries a unique identifier: if a duplicate arrives, the receiver recognizes "I already processed this" and discards it. That combination — retries plus identifier — is called <em>idempotency</em>, and it is what prevents charging a customer twice for the same meal.</p>`,
    },
  },
  ddd: {
    title: { es: 'Domain-Driven Design (DDD), en lenguaje llano', en: 'Domain-Driven Design (DDD), in plain language' },
    body: {
      es: `<p><strong>Domain-Driven Design</strong> es una forma de organizar software grande que parte de una pregunta simple: ¿qué partes de este negocio son <em>nosotros</em> y qué partes son <em>de nadie en particular</em>?</p>
<p>Un supermercado no fabrica las bolsas ni imprime su propio dinero: compra las bolsas y usa el dinero existente, pero su forma de acomodar la góndola y fijar precios es su ventaja competitiva. DDD aplica la misma lógica: clasificar cada parte del sistema en <strong>Core</strong> (la ventaja competitiva, se construye a medida), <strong>Soporte</strong> (importante pero comprable/adaptable) y <strong>Genérico</strong> (todos los negocios necesitan lo mismo: se alquila hecho).</p>
<p>La clasificación decide dónde va el dinero y el esfuerzo del equipo de desarrollo — y dónde no.</p>`,
      en: `<p><strong>Domain-Driven Design</strong> is a way of organizing large software that starts from a simple question: which parts of this business are <em>ours</em>, and which parts are <em>nobody's in particular</em>?</p>
<p>A supermarket does not manufacture bags or print its own money: it buys bags and uses existing currency, but how it arranges shelves and sets prices is its competitive edge. DDD applies the same logic: classify every part of the system as <strong>Core</strong> (the competitive edge, built in-house), <strong>Supporting</strong> (important but purchasable/adaptable) and <strong>Generic</strong> (every business needs the same thing: rent it off the shelf).</p>
<p>That classification decides where the development team's money and effort go — and where they don't.</p>`,
    },
  },
  vpc: {
    title: { es: '¿Qué es una VPC y una zona de disponibilidad?', en: 'What is a VPC and an availability zone?' },
    body: {
      es: `<p>Una <strong>VPC</strong> (Virtual Private Cloud) es un recinto privado dentro de la nube de Amazon: un terreno vallado donde solo entran los servidores de la empresa. En la frontera del recinto hay un <strong>balanceador</strong>: el recepcionista que recibe a todos los visitantes, revisa sus credenciales y solo deja pasar a los válidos hacia adentro.</p>
<p>Una <strong>zona de disponibilidad</strong> es un edificio de datacenter físicamente separado de los demás. Montar el sistema en dos zonas es como guardar copias del inventario en dos depósitos de distintos barrios: si uno se inunda, el otro sigue atendiendo.</p>`,
      en: `<p>A <strong>VPC</strong> (Virtual Private Cloud) is a private enclosure inside Amazon's cloud: a fenced plot where only the company's servers live. At the fence gate stands a <strong>load balancer</strong>: the receptionist who greets every visitor, checks credentials, and only lets valid ones through.</p>
<p>An <strong>availability zone</strong> is a physically separate datacenter building. Running the system in two zones is like keeping copies of your inventory in two warehouses in different neighborhoods: if one floods, the other keeps serving customers.</p>`,
    },
  },
  tco: {
    title: { es: '¿Qué es el TCO?', en: 'What is TCO?' },
    body: {
      es: `<p><strong>TCO</strong> significa <em>Total Cost of Ownership</em> (costo total de propiedad): cuánto cuesta de verdad tener algo funcionando durante un período, contando todo. No solo el precio del servidor: también el software de monitoreo, el almacenamiento, las notificaciones, el tráfico de red y — lo que más se olvida — el tiempo de los desarrolladores que lo mantienen.</p>
<p>Es la diferencia entre "el auto cuesta $10.000" y "el auto cuesta $10.000 más seguro, combustible, mantenciones y neumáticos por un año". Un arquitecto que solo mira precios de lista toma decisiones caras; el equipo ganador calculó el costo anual completo al centavo.</p>`,
      en: `<p><strong>TCO</strong> stands for <em>Total Cost of Ownership</em>: what it truly costs to keep something running over a period, counting everything. Not just the server price: also monitoring software, storage, notifications, network traffic and — the most forgotten item — the developer time required to maintain it all.</p>
<p>It is the difference between "the car costs $10,000" and "the car costs $10,000 plus insurance, fuel, maintenance and tires for a year". An architect who only reads price tags makes expensive decisions; the winning team computed the full yearly cost to the cent.</p>`,
    },
  },
  telemetry: {
    title: { es: 'Telemetría, en lenguaje llano', en: 'Telemetry, in plain language' },
    body: {
      es: `<p><strong>Telemetría</strong> es el tablero de instrumentos de un sistema: métricas y registros que dicen, en cada momento, qué está pasando por dentro (cuántas órdenes por minuto, cuánto tarda un pago, qué módulo va más lento).</p>
<p>Sin telemetría, optimizar es adivinar. Con ella, cada discusión de arquitectura se zanja con datos: "este módulo es el cuello de botella, extráigalo; este otro está sobrado, ni lo toque". El equipo ganador la declaró <em>obligatoria</em> desde el día uno precisamente para saber cuándo (y cuándo no) era momento de partir el monolito.</p>`,
      en: `<p><strong>Telemetry</strong> is a system's dashboard: metrics and logs that say, at every moment, what is happening inside (orders per minute, payment latency, which module is slowest).</p>
<p>Without telemetry, optimizing is guesswork. With it, every architecture debate is settled by data: "this module is the bottleneck, extract it; this one has headroom, don't touch it". The winning team made telemetry <em>mandatory</em> from day one precisely to know when (and when not) to split the monolith.</p>`,
    },
  },
};
