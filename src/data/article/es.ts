import type { ArticleContent } from './types';

export const ES: ArticleContent = {
  lang: 'es',
  heroKicker: "O'Reilly Software Architecture Kata · Otoño 2020",
  heroTitleA: 'El caso Farmacy Food:',
  heroTitleB: 'cómo se toman decisiones reales de arquitectura',
  heroParagraphs: [
    'Los <a class="concept-chip" data-concept="kata" role="button" tabindex="0">Architecture Katas</a> son competencias donde equipos de ingenieros reciben el pliego de una empresa real y tienen unas semanas para diseñar la arquitectura completa de la solución, defendida ante un jurado. En la edición de otoño de 2020, el jurado fue de primer nivel: <strong>Mark Richards</strong> y <strong>Neal Ford</strong>, autores del libro canónico <em>Fundamentals of Software Architecture</em>, junto a otros arquitectos invitados.',
    'El caso fue <strong>Farmacy Food</strong>, una startup de Detroit que vende comidas saludables en heladeras inteligentes. Este artículo reconstruye paso a paso cómo el equipo ganador, <strong>ArchColider</strong>, analizó el problema y llegó a cada decisión — con los números, diagramas y documentos reales de su repositorio público, y con las soluciones finalistas de <strong>Myagis-Forest</strong> y <strong>Jedis</strong> como contrapunto.',
    'No hace falta experiencia en arquitectura para seguirlo: cada concepto técnico se explica en el momento justo en que aparece, y todo lo que requiere contexto se puede leer sin salir de la página.',
  ],
  tocTitle: 'Contenido',
  sections: [
    /* ───────────────────────── 1 ───────────────────────── */
    {
      id: 'terreno',
      phase: 'El problema',
      title: 'El terreno de juego',
      blocks: [
        { type: 'p', html: 'Farmacy Food nació con una misión directa: llevar alimentación saludable y personalizada a precios accesibles a comunidades urbanas de Detroit, donde conseguir comida fresca suele ser difícil. Su lema, tomado en serio, es "que la comida sea tu medicina": arman viandas alrededor de necesidades nutricionales concretas (diabetes, celiaquía, dietas médicas) y las venden a precio de comida rápida.' },
        { type: 'p', html: 'Para hacerlo sin abrir restaurantes — que es lo más caro del rubro — la empresa monta un modelo de tres piezas que ya estaba operando cuando empezó el kata. El <a class="concept-chip" data-concept="rfp" role="button" tabindex="0">pliego del cliente</a> describía estas tres piezas del mundo físico:' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: 'Las ghost kitchens',
              tag: 'Producción',
              html: 'Cocinas comerciales que cocinan únicamente para despacho y retiro, sin salón ni comensales. Ya usaban un software especializado, <strong>ChefTec</strong>, para costear recetas y controlar insumos. No cocinan las 24 horas: producen por lotes, con uno o dos ciclos de cocina por día.',
            },
            {
              title: 'Las heladeras inteligentes',
              tag: 'Venta autónoma',
              html: 'Heladeras de autoservicio provistas por <strong>Byte Technology</strong>: el cliente desliza su tarjeta en el frente, la puerta se destraba, retira los platos que quiere y, al cerrar la puerta, antenas internas leen etiquetas <strong>RFID</strong> — chips pegados a cada vianda que se leen por radio — para cobrar automáticamente lo consumido.',
            },
            {
              title: 'Los kioscos con cajero',
              tag: 'Venta asistida',
              html: 'Heladeras comunes en espacios subalquilados (gimnasios, clínicas, cafeterías aliadas). A diferencia de las autónomas, aquí una persona atiende al público y cobra con terminales comerciales <strong>Toast POS</strong>, que ya tenían su propia API.',
            },
          ],
        },
        { type: 'h3', html: 'Quién compra: los tres tipos de usuario' },
        { type: 'p', html: 'El pliego también definía con precisión quién entra al negocio. No es un detalle de marketing: como vas a ver, <strong>la forma de pagar de cada usuario genera problemas técnicos distintos</strong>.' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: 'Ocasional',
              tag: 'Efectivo, sin cuenta',
              html: 'Entra sin registro, elige una vianda mirándola y paga en efectivo en la caja del kiosco. El negocio quiere convertirlo en conocido. <strong>Dato clave para después:</strong> su compra en efectivo no le dice nada al sistema central en tiempo real.',
            },
            {
              title: 'Conocido',
              tag: 'Cuenta + tarjeta',
              html: 'Tiene cuenta y tarjeta asociada, pero sin suscripción. Navega el catálogo, reserva y paga por la app. La heladera lo reconoce por su tarjeta.',
            },
            {
              title: 'Suscriptor',
              tag: 'Menú semanal prepagado',
              html: 'El cliente ideal: arma su menú de la semana por adelantado, lo prepagó, y retira cada día. Carga predecible para las cocinas — y el reto de gestionar cancelaciones y reembolsos.',
            },
          ],
        },
        { type: 'p', html: 'Los une una cuarta figura que a menudo se olvida: el <strong>cajero del kiosco</strong>, que atiende a los ocasionales y registra sus ventas en el Toast POS. Y el análisis del equipo ganador iba más lejos aún: listó como stakeholders a los <strong>nutricionistas</strong> (que necesitan buscar comidas por componente nutricional) y a los <strong>proveedores de ingredientes</strong> (que quieren prever cuánto comprar). Un arquitecto pregunta siempre: ¿a quién más le importa este sistema, además de a los usuarios?' },
        { type: 'h3', html: 'Lo que ya existía y no se podía cambiar' },
        { type: 'p', html: 'La tarea no era inventar un ecosistema desde cero, sino construir la <strong>Plataforma Central de Órdenes</strong>: el puente entre los usuarios (por web o móvil) y las herramientas que la empresa ya tenía contratadas. Un arquitecto no elige esas piezas: las recibe como restricciones.' },
        {
          type: 'list',
          items: [
            '<strong>API de Byte Technology</strong> — para saber qué viandas quedan en cada heladera y enterarse de cada cobro cuando la puerta se cierra.',
            '<strong>API de Toast POS</strong> — para registrar las ventas que los cajeros ingresan en los kioscos.',
            '<strong>ChefTec</strong> — para enviar a las cocinas la lista consolidada de lo que deben cocinar.',
            '<strong>Stripe</strong> — la pasarela que procesa los cobros digitales de la app.',
            '<strong>QuickBooks</strong> — la contabilidad oficial de la empresa.',
          ],
        },
        { type: 'p', html: 'El pliego también era explícito sobre lo que <strong>no</strong> era problema del arquitecto: la logística de camionetas que reponen las heladeras, el firmware interno de las heladeras (propiedad de Byte) y cualquier movimiento de comida que no fuera una compra de cliente. Preguntarse "¿qué NO tengo que resolver?" es la primera herramienta de un arquitecto.' },
        { type: 'h3', html: 'Los números reales: el dato que lo cambia todo' },
        { type: 'p', html: 'Aquí está la información que separa una solución seria de una fantasiosa. El pliego declaraba el volumen actual y las metas del negocio:' },
        {
          type: 'stats',
          items: [
            { value: '2', label: 'locaciones piloto en el día 1, en Detroit' },
            { value: '~300', label: 'comidas por semana al empezar: unas 42 por día en toda la ciudad' },
            { value: '68', label: 'locaciones y 1.000 suscriptores como meta a 12 meses' },
            { value: '~0', label: 'peticiones por segundo: menos de una por minuto en hora pico' },
          ],
        },
        { type: 'callout', tone: 'amber', title: 'Hacé la cuenta antes de elegir herramientas', html: '42 comidas al día entre dos puntos de venta significa, en el peor caso, una venta cada pocos minutos — y el tráfico web equivalente: <strong>prácticamente cero</strong>. Incluso en la meta anual (1.500–2.000 comidas semanales), el sistema completo maneja menos de una petición por segundo. Guardá este número: explica casi todas las decisiones que vienen.' },
        { type: 'p', html: 'Con el negocio, los actores físicos y los números sobre la mesa, todo lo visto hasta ahora se puede resumir en un solo dibujo — y ahora sí, cada caja y flecha debería resultarte conocida:' },
        { type: 'contextDiagram' },
      ],
    },

    /* ───────────────────────── 2 ───────────────────────── */
    {
      id: 'podio',
      phase: 'El problema',
      title: 'El dilema del podio',
      blocks: [
        { type: 'p', html: 'Cuando los diez equipos recibieron este mismo pliego, las soluciones finalistas se repartieron en tres posturas opuestas sobre la misma pregunta: ¿cuánta maquinaria comprar hoy para un negocio que hoy vende 42 comidas al día?' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: '🥇 ArchColider',
              tag: 'Monolito modular',
              html: 'Concluyó que montar infraestructura distribuida para ese volumen era tirar plata y tiempo. Propuso un <strong>monolito dividido en módulos con fronteras estrictas</strong> en pocas máquinas de AWS: barato hoy, fácil de partir mañana si hace falta. El jurado premió ese pragmatismo.',
            },
            {
              title: '🥈 Myagis-Forest',
              tag: 'Microservicios',
              html: 'Argumentó exactamente lo contrario: partir un monolito después significa hacer el trabajo dos veces. Montó <strong>microservicios desde el día uno</strong>, con un modelado de dominio impecable — y un costo fijo de operación mucho más alto para una startup que recién valida su mercado.',
            },
            {
              title: '🥉 Jedis',
              tag: 'Kafka',
              html: 'Apostó a la analítica futura: una plataforma centrada en un <strong>bus de eventos</strong> que registra cada movimiento de stock y compra en tiempo real. Habilita recomendaciones y datos en vivo… sosteniendo una plataforma de mensajería sobredimensionada durante los primeros meses.',
            },
          ],
        },
        { type: 'p', html: 'Ninguna de las tres es "la correcta". Como resume la primera ley de Richards & Ford que los propios jueces repiten en cada kata: <em>en arquitectura no hay decisiones correctas o incorrectas — todo es una compensación</em>. Lo que el jurado evaluó fue la calidad del razonamiento: si cada compensación estaba identificada, justificada y medida contra las restricciones reales del cliente.' },
        { type: 'p', html: 'Para entender por qué el razonamiento de ArchColider convenció al jurado, hay que retroceder un paso: antes de dibujar una sola caja, el equipo se fijó reglas de juego propias. Eso es lo próximo.' },
      ],
    },

    /* ───────────────────────── 3 ───────────────────────── */
    {
      id: 'principios',
      phase: 'El marco de decisión',
      title: 'Las reglas de juego antes del primer diagrama',
      blocks: [
        { type: 'p', html: 'El repositorio del equipo ganador tiene una particularidad reveladora: durante la primera semana no hay un solo diagrama de software. Hay documentos de negocio: objetivos, restricciones, preguntas al cliente, glosario de vocabulario. Recién después aparece el método que ordenó todo el resto del trabajo: <strong>Viewpoints and Perspectives</strong>, el marco de Rozanski & Woods, un estándar de la industria para describir arquitecturas desde múltiples vistas (contexto, funcional, información, despliegue…) cruzadas con atributos de calidad.' },
        { type: 'p', html: 'Pero antes de aplicar el marco, el equipo firmó cuatro principios rectores. Su función es práctica: cuando dos diseñadores se atascan discutiendo opciones, los principios desempatan.' },
        {
          type: 'list',
          items: [
            '<strong>Simplicidad cognitiva.</strong> Si una opción no se puede explicar y razonar con facilidad, se descarta. La complejidad que no se justifica sola no se compra.',
            '<strong>Evolucionabilidad sobre optimización prematura.</strong> Diseñar módulos fáciles de extraer mañana, en vez de extraerlos hoy sin necesidad.',
            '<strong><a class="concept-chip" data-concept="telemetry" role="button" tabindex="0">Telemetría</a> obligatoria.</strong> Cada módulo debe medirse: las decisiones de escala se toman con datos, no con ansiedad.',
            '<strong>Mensajes antes que llamadas directas.</strong> Las partes del sistema se comunican de forma asíncrona para que ninguna dependa de que la otra esté viva en ese instante.',
          ],
        },
        { type: 'callout', tone: 'emerald', title: 'El orden importa', html: 'Estos cuatro principios no son decoración de slideware: cada decisión técnica que veremos en el resto del artículo se puede rastrear hacia uno de ellos. Fijar criterios de desempate <em>antes</em> de discutir tecnologías es lo que evita que la discusión se convierta en guerra de gustos.' },
        { type: 'h3', html: 'Del objetivo de negocio al requerimiento arquitectónico' },
        { type: 'p', html: 'El documento más instructivo del repositorio es también el más aburrido a primera vista: una tabla que conecta cada <em>driver</em> de negocio con los requerimientos que realmente van a moldear la arquitectura — los que el equipo llamó, con un chiste, los <strong>SAD</strong> (<em>Significant Architectural Drivers</em>: "los drivers que ponen triste al arquitecto", porque muestran cuánto trabajo hay). Esta traducción de negocio a técnica es la habilidad que más le cuesta a un desarrollador senior camino a arquitecto. Algunas filas reales del equipo:' },
        {
          type: 'table',
          caption: 'Trazabilidad: objetivo de negocio → requerimiento arquitectónicamente significativo',
          headers: ['Si el negocio quiere…', 'el sistema debe garantizar…'],
          rows: [
            ['Convertir ocasionales en suscriptores', 'comprar sin registrarse antes, y pagos tanto en efectivo como electrónicos'],
            ['Que el cliente vuelva (lealtad)', 'cupones, puntos y promociones combinables en cualquier proporción del pago'],
            ['Cocinar sin desperdiciar', 'reportes puntuales de consumo por punto de venta y tipo de usuario'],
            ['Que nadie se quede sin su comida', 'maximizar la garantía de retiro de cada almuerzo pagado'],
            ['Crecer a más ciudades', 'notificaciones e integraciones que no se reescriban al expandirse'],
          ],
        },
        { type: 'p', html: 'Guardá la fila "que nadie se quede sin su comida": va a volver a aparecer en la sección del mundo físico — y va a justificar una de las decisiones más celebradas del caso. Esa continuidad — objetivo de negocio → requerimiento → decisión → ADR — es lo que los jueces llaman <strong>trazabilidad de requerimientos</strong>, y es la columna vertebral de una arquitectura defendible.' },
        { type: 'h3', html: 'El cuaderno donde se anotan las decisiones' },
        { type: 'p', html: 'Queda una pieza metodológica más, y es la que da nombre a media docena de archivos del repositorio: el <a class="concept-chip" data-concept="adr" role="button" tabindex="0">ADR</a> (<em>Architecture Decision Record</em>). Un ADR es un documento cortito — una carilla — que registra una decisión estructural en tres partes: el <strong>contexto</strong> (qué problema la motivó), la <strong>decisión</strong> y las <strong>consecuencias</strong> asumidas, incluidas las negativas. El formato lo popularizó Michael Nygard, y su regla de oro es honestidad: un ADR que no admite desventajas es propaganda, no una decisión.' },
        { type: 'p', html: 'ArchColider entregó dieciséis ADRs. En este artículo los vas a encontrar en su momento exacto — cuando el problema que los motivó aparece en la historia — y al final, en un mapa curado por si querés volver a consultarlos. Cada uno se abre en su propia ficha y enlaza al archivo original en GitHub.' },
      ],
    },

    /* ───────────────────────── 4 ───────────────────────── */
    {
      id: 'estilo',
      phase: 'El marco de decisión',
      title: 'La gran decisión: cuánta maquinaria comprar',
      blocks: [
        { type: 'p', html: 'La decisión madre de todo el caso es la de estilo: ¿una sola pieza o muchas? Si venís de escuchar charlas sobre microservicios, conviene primero desactivar una trampa en la que — según los propios jueces — cayeron varios equipos del kata.' },
        { type: 'p', html: 'Los slides oficiales de Richards & Ford la llaman la <a class="concept-chip" data-concept="entity-trap" role="button" tabindex="0">Entity Trap</a>: anotar los sustantivos del negocio (usuario, menú, orden) y crear un componente por cada uno. Suena ordenado y está podrido: la vida real avanza por flujos de trabajo, no por sustantivos. El equipo ganador la esquivó modelando acciones de actores, no colecciones de cosas.' },
        { type: 'p', html: 'Con la trampa identificada, la comparación de estilos se vuelve una cuenta concreta. Recordá el número de la primera sección: menos de una petición por segundo incluso en la meta anual. Con ese número sobre la mesa, el equipo comparó las opciones de estilo contra las cuatro restricciones duras del cliente: equipo chico, salida rápido al mercado, presupuesto mínimo y AWS como plataforma.' },
        { type: 'decision', id: 'monolith' },
        { type: 'p', html: 'El repositorio guarda la justificación completa en el <button class="adr-ref" data-adr="002" type="button">ADR 002</button>, y dos diagramas que valen mil palabras: cómo se agrupan los módulos hoy y cómo se extrae cualquiera de ellos mañana sin cirugía mayor.' },
        { type: 'figure', src: '/img/FF_Modularization.PNG', alt: 'Diagrama de modularización del monolito', caption: 'La modularización del monolito: módulos con fronteras estrictas dentro de una sola pieza desplegable. (Documento original de ArchColider)' },
        { type: 'figure', src: '/img/FF_ModularizationExtraction.PNG', alt: 'Diagrama de extracción futura de módulos', caption: 'El camino de evolución: cualquier módulo se extrae como servicio independiente cuando la telemetría lo justifique. (Documento original de ArchColider)' },
        { type: 'callout', tone: 'slate', title: 'La lección transferible', html: 'La pregunta "¿monolito o microservicios?" está mal formulada desde el arranque. La pregunta correcta es: <strong>¿qué volumen real tengo, qué equipo tengo y cuánto cuesta cada estilo en ese contexto?</strong> Con 42 comidas al día, la respuesta era matemática, no ideológica.' },
      ],
    },

    /* ───────────────────────── 5 ───────────────────────── */
    {
      id: 'dominio',
      phase: 'El diseño',
      title: 'Repartir el sistema: qué se construye y qué se alquila',
      blocks: [
        { type: 'p', html: 'Un monolito modular solo funciona si los módulos están bien cortados. Para decidir los cortes, el equipo aplicó <a class="concept-chip" data-concept="ddd" role="button" tabindex="0">Domain-Driven Design</a> en su nivel estratégico: clasificar cada capacidad del negocio según si es la ventaja competitiva, un soporte, o algo genérico que cualquier empresa necesita.' },
        {
          type: 'cards',
          cols: 3,
          cards: [
            {
              title: 'Core — construir a medida',
              tag: 'La ventaja competitiva',
              html: 'El catálogo de comidas (con disponibilidad por heladera, ingredientes, promociones), las órdenes (suscripciones, cupones, pagos encadenados) y el programa de lealtad. Aquí es donde el negocio gana o pierde: se construye propio, con el mejor equipo.',
            },
            {
              title: 'Soporte — adaptar',
              tag: 'Importante pero comprable',
              html: 'El sistema de opiniones y la programación de producción de las cocinas. El negocio los necesita, pero no lo diferencian: se adaptan herramientas o se construyen simples.',
            },
            {
              title: 'Genérico — alquilar',
              tag: 'Igual para todos',
              html: 'Reportes, pagos, notificaciones. Ninguna empresa gana ventaja construyendo su propio procesador de pagos: se integran servicios existentes (Stripe, herramientas de reporting, servicios de mensajería).',
            },
          ],
        },
        { type: 'figure', src: '/img/FF_StrategicDomainDesign.jpg', alt: 'Mapa de subdominios estratégicos de DDD', caption: 'El mapa estratégico original del equipo: cada dominio clasificado por unicidad de negocio y complejidad. (Documento original de ArchColider)' },
        { type: 'h3', html: 'El metamodelo: reglas por un lado, ejecución por el otro' },
        { type: 'p', html: 'La joya menos obvia del repositorio es un diagrama llamado <em>metamodelo</em>. Separa dos niveles que suelen mezclarse en un mismo embrollo: el <strong>nivel de conocimiento</strong> (las reglas: qué tipos de usuario existen, qué acciones puede hacer cada uno, qué promociones aplican a qué menús) y el <strong>nivel operacional</strong> (los hechos del día a día: esta orden, este menú, esta cocina). Es la misma separación entre "el reglamento del torneo" y "el partido del domingo".' },
        { type: 'figure', src: '/img/FF_Metamodel_v1.png', alt: 'Metamodelo conceptual: nivel de conocimiento y nivel operacional', caption: 'El metamodelo: reglas de negocio (arriba) separadas de las entidades operativas (abajo). Es la respuesta directa a la Entity Trap. (Documento original de ArchColider)' },
        { type: 'p', html: 'Este corte tiene un beneficio enorme a futuro: cuando el negocio invente un tipo de promoción o un nuevo perfil de usuario, cambia una regla del "reglamento" sin reescribir el "partido". El metamodelo está diseñado para absorber escenarios que todavía no existen.' },
      ],
    },

    /* ───────────────────────── 6 ───────────────────────── */
    {
      id: 'concurrencia',
      phase: 'El diseño',
      title: 'El mundo físico: heladeras, dinero y conexiones inestables',
      blocks: [
        { type: 'p', html: 'Esta es la sección donde el caso deja de ser teórico y se vuelve ingeniería de la realidad. Tres problemas concretos, tres soluciones elegantes.' },
        { type: 'h3', html: 'Problema 1: dos personas quieren el último plato' },
        { type: 'p', html: 'La tentación es bloquear la base de datos ("nadie toca el stock mientras yo compro"). El equipo hizo algo mejor usando una peculiaridad física del negocio: <strong>una vianda no puede saltar de una heladera a otra</strong>. Entonces cada heladera tiene su propio <a class="concept-chip" data-concept="actor-model" role="button" tabindex="0">actor</a>: un proceso que procesa las compras de esa heladera de a una, en orden. Nunca hay dos escrituras simultáneas sobre el mismo stock, así que nunca hacen falta locks. El stock vive en memoria, a velocidad de procesador.' },
        { type: 'figure', src: '/img/FF_concurency_order_processing.PNG', alt: 'Diagrama de procesamiento de órdenes con actores', caption: 'Órdenes pasando de actor en actor, cada uno con una sola responsabilidad. (Documento original de ArchColider)' },
        { type: 'h3', html: 'Problema 2: el reclamo del cliente que cobraron mal' },
        { type: 'p', html: 'Un negocio que maneja comida y dinero va a recibir reclamos. La pregunta es qué evidencia existe cuando llegue el reclamo. La respuesta del equipo fue <a class="concept-chip" data-concept="event-sourcing" role="button" tabindex="0">Event Sourcing</a>: registrar cada orden como una secuencia inmutable de eventos en vez de un estado que se borra y reescribe. Para que el mensaje "cobrá esta orden" no se pierda ni se procese doble, usaron una <a class="concept-chip" data-concept="message-queue" role="button" tabindex="0">cola de mensajes</a> con confirmación de recibo e identificadores únicos.' },
        { type: 'decision', id: 'event-sourcing' },
        { type: 'decision', id: 'rabbitmq' },
        { type: 'h3', html: 'Los 30 segundos que evitan un reembolso' },
        { type: 'p', html: 'Dentro de ese mismo flujo hay una táctica deliciosa, documentada en los diagramas de información del equipo. Los números del propio caso dicen que un <strong>2–5% de las órdenes se cancelan al toque</strong>: compras impulsivas de las que el usuario se arrepiente antes de que termine el segundo café. Si cada una de esas cancelaciones llega a la pasarela de pago, el negocio paga comisión de proceso… y después otra de reembolso, por la misma comida.' },
        { type: 'p', html: 'La solución replica el "deshacer envío" de un cliente de correo: cuando llega una orden, el sistema <strong>la retiene entre 10 y 30 segundos antes de invocar al pago</strong>. La cancelación se resuelve en memoria, en ese intervalo, con costo cero de pasarela. Si pasa la ventana sin cancelación, recién ahí arranca el cobro. El usuario ni se entera: ya está acostumbrado a que "procesar el pago" tome unos segundos.' },
        { type: 'figure', src: '/img/IM_cancel_order_by_user.PNG', alt: 'Diagrama de secuencia: cancelación de orden por el usuario dentro de la ventana de inhibición', caption: 'La cancelación dentro de la ventana de inhibición: se resuelve en memoria, sin pasar por la pasarela de pagos. (Documento original de ArchColider)' },
        { type: 'h3', html: 'Problema 3: la heladera del subsuelo sin señal' },
        { type: 'p', html: 'Las heladeras dependen de conexión celular. Una heladera en el subsuelo de un hospital puede quedarse sin señal justo cuando un cliente llega a retirar su almuerzo ya pagado.' },
        { type: 'callout', tone: 'slate', title: 'Antes de seguir leyendo', html: 'Te toca a vos: el cliente pagó, la comida está adentro de la heladera, y la heladera no puede hablar con la nube. <strong>¿Cómo le darías su comida sin abrir la puerta a los fraudes?</strong> Pensalo un segundo — la respuesta del equipo es de lo más elegante del caso.' },
        { type: 'p', html: 'La solución del equipo: códigos PIN generados por adelantado que la heladera valida en su memoria local, sin hablar con la nube. Los documentos guardan además la evolución de la idea: primero pensaron en "códigos de acceso" genéricos, y los descartaron por engorrosos — el PIN de 6 a 8 dígitos atado a cada comida fue la simplificación final. (¿Te suena la fila "que nadie se quede sin su comida" de la tabla de trazabilidad? Este es su destino.)' },
        { type: 'decision', id: 'pin-offline' },
        { type: 'p', html: 'El mismo pragmatismo aparece en la app: el catálogo vive en el teléfono (instantáneo, disponible sin señal) y el stock real se verifica recién en el momento de pagar.' },
        { type: 'decision', id: 'catalog-cache' },
        { type: 'p', html: 'Esa manera de pensar llega hasta las decisiones más chicas. ¿Sincronizar campañas promocionales entre operadores con algoritmos de consistencia distribuida? Innecesario: las promociones cambian poco y las manejan <strong>en una hoja de cálculo</strong>, y el sistema solo consume el resultado final. Y todo el modelo de datos descansa sobre una observación del mundo físico: <strong>las cocinas de Detroit no ofrecen comida en Nueva York</strong>. Los datos se pueden partir por ciudad — catálogos, stock, órdenes — sin replicar casi nada entre regiones, lo que simplifica acceso, consistencia y costos de un plumazo.' },
        { type: 'h3', html: 'El día nublado: cuando la comida se traba' },
        { type: 'p', html: 'Todos los diagramas de esta sección muestran el "día de sol": el usuario pide, paga, retira, feliz. El equipo también diagramó el día nublado: la vianda queda <strong>físicamente trabada</strong> dentro de la heladera, el usuario ya pagó, y no hay ningún software que empuje la bandeja. Ese journey existe de punta a punta: el usuario saca una foto desde la app y registra el reclamo, un administrador humano lo revisa, y el sistema emite la compensación (una comida nueva o un cupón).' },
        { type: 'figure', src: '/img/user-journey-error.png', alt: 'Journey del usuario cuando la comida queda trabada en la heladera', caption: 'El journey del error: la comida se traba, el usuario documenta con foto, un admin compensa. Diseñar el día nublado también es arquitectura. (Documento original de ArchColider)' },
        { type: 'p', html: 'La lección: <em>happy path</em> es la mitad del diseño. La mitad que lo distingue de un dibujo bonito está en los journeys donde el hardware falla, la señal se corta o el usuario se arrepiente — y esa mitad también se diagrama antes de escribir código.' },
        { type: 'callout', tone: 'emerald', title: 'El patrón que se repite', html: 'Todas las soluciones de esta sección hacen lo mismo: <strong>aceptar la realidad física en vez de pelearla</strong>. Las heladeras se van a quedar sin señal: diseñá para eso. Los datos van a llegar tarde: diseñá para eso. Los reclamos van a llegar: guardá la evidencia. La arquitectura madura no elimina los problemas del mundo real; los espera preparada.' },
      ],
    },

    /* ───────────────────────── 7 ───────────────────────── */
    {
      id: 'infraestructura',
      phase: 'El diseño',
      title: 'Aterrizar el diseño en la nube',
      blocks: [
        { type: 'p', html: 'Todo lo anterior es lógica pura; en algún momento hay que pagar servidores. El equipo eligió AWS por una restricción del pliego y una razón práctica: la región más cercana a Detroit. La topología es una lección de <a class="concept-chip" data-concept="vpc" role="button" tabindex="0">red privada</a> bien entendida: un recinto privado con el balanceador en la puerta, los servidores adentro sin direcciones públicas y todo duplicado en dos edificios de datacenter distintos.' },
        { type: 'figure', src: '/img/infra-vpc.png', alt: 'Diagrama de la topología de red VPC en AWS', caption: 'La red VPC: dos zonas de disponibilidad, subredes públicas (balanceadores) y privadas (los servidores, sin IP pública). (Documento original de ArchColider)' },
        { type: 'h3', html: 'Validar credenciales en la puerta' },
        { type: 'p', html: 'El detalle de seguridad más didáctico: en vez de que cada pieza del software verifique la identidad de cada visitante, lo hace el <strong>balanceador de entrada</strong> contra el servicio de identidades de AWS (Cognito) antes de que el tráfico llegue a los servidores. Los servidores solo reciben visitas ya verificadas. Y por dentro, "confianza cero": los módulos también exigen autorización entre sí, como si ya fueran servicios separados — para que el día que se separen, la seguridad ya esté hecha.' },
        { type: 'decision', id: 'edge-auth' },
        { type: 'figure', src: '/img/Authentication.png', alt: 'Diagrama del flujo de autenticación con Cognito y ALB', caption: 'El flujo de autenticación: el balanceador valida tokens contra Cognito en el borde de la red. (Documento original de ArchColider)' },
        { type: 'figure', src: '/img/services.png', alt: 'Esquema de servicios y hardware virtual: servidores, colas, streaming y SaaS por subred', caption: 'La topología completa: cada servidor es una plantilla t3.medium; colas, streaming de logs y los SaaS externos con su rol. (Documento original de ArchColider)' },
        { type: 'h3', html: '¿Y si el negocio crece?' },
        { type: 'p', html: 'La estrategia de escala es la más honesta del caso: primero agrandar la máquina ("escala vertical"), y recién multiplicar instancias con balanceadores ("escala horizontal") cuando la telemetría — obligatoria, principio rector número tres — muestre que la vertical ya no da. Para ese momento, el módulo con más presión se extrae del monolito, exactamente como se diseñó en la sección de estilo.' },
        { type: 'p', html: 'Y la telemetría tiene un truco extra que vale conocer: además de métricas de máquina, el sistema se monitorea con <strong>escenarios sintéticos</strong> — un "cliente dummy" recorre el camino crítico (elegir comida, pagar, retirar) cada tantos minutos y mide si el resultado es correcto y cuánto tarda. Una máquina puede estar "sana" con la lógica de negocio clavada; el cliente fantasma se entera. Esos números son además la señal que decide cuándo partir el monolito.' },
        { type: 'decision', id: 'scale-up' },
        { type: 'h3', html: 'Los riesgos, con mitigación a mano' },
        { type: 'p', html: 'El análisis del equipo termina con algo que la mayoría de las entregas omite: una lista de riesgos donde cada riesgo tiene su opción de mitigación escrita al lado. No todos son técnicos — varios son decisiones de negocio que el equipo marcó explícitamente como "a resolver con el dueño". Una selección:' },
        {
          type: 'list',
          items: [
            '<strong>La pasarela de pagos cae:</strong> las órdenes se guardan y se reintenta por un período definido; mientras tanto, política de confianza para conocidos y suscriptores (ya sabemos quiénes son).',
            '<strong>Review bombing contra cocinas terceras:</strong> solo puede opinar quien tiene un cobro confirmado — la reputación también se diseña.',
            '<strong>El canal de notificación falla:</strong> canal de respaldo; y si la comida ya llegó a la heladera, a veces la mejor notificación es ninguna.',
            '<strong>Escalar dispara la factura:</strong> tope máximo de instancias por servicio, y por encima del umbral, confirmación humana antes de encender nada.',
            '<strong>Un release rompe algo:</strong> hot-swap al release anterior como requisito de plataforma, no como esperanza.',
          ],
        },
      ],
    },

    /* ───────────────────────── 8 ───────────────────────── */
    {
      id: 'costos',
      phase: 'La realidad económica',
      title: 'La factura anual, al centavo',
      blocks: [
        { type: 'p', html: 'Pocas entregas de arquitectura incluyen el costo total de operación. El equipo ganador entregó una planilla con el cálculo completo, bajo tres escenarios de crecimiento, partiendo del <a class="concept-chip" data-concept="tco" role="button" tabindex="0">TCO</a>: no el precio de lista de cada pieza, sino el costo anual de tener todo funcionando.' },
        { type: 'p', html: 'El punto de partida fue dimensionar la carga con números, no con miedo: ~1.000 peticiones diarias generan unos 30.000 registros por mes — alrededor de 4 GB de base de datos y 16,5 GB de tráfico mensual. Cifras diminutas, calculadas antes de elegir cualquier máquina.' },
        { type: 'h3', html: 'La calculadora antes que el servidor' },
        { type: 'p', html: '¿De dónde salen esas cifras? De algo que el equipo llamó <strong>volumetría</strong>: para cada mensaje que viaja por el sistema, anotaron cuánto pesa y con qué frecuencia ocurre. Con esa tabla, el ancho de banda y el almacenamiento se derivan solos — y los costos dejan de ser adivinanza. Los valores reales del caso:' },
        {
          type: 'table',
          caption: 'Volumetría de mensajes del sistema (documento original del equipo)',
          headers: ['Mensaje / paquete', 'Peso', 'Frecuencia'],
          rows: [
            ['Confirmar una orden', '0,2 kb', '1–3 por día por usuario'],
            ['Catálogo completo (sin imágenes)', '500–700 kb', '1 descarga por día, vive 24 h en el dispositivo'],
            ['Actualización de stock de una heladera', '0,1–150 kb', 'con cada orden y por lote de la heladera'],
            ['Cancelación de una orden', '0,1 kb', '2–5% de todas las órdenes'],
            ['Despacho del día hacia una cocina', '20–50 kb', '0–2 por día por heladera'],
          ],
        },
        { type: 'p', html: 'Este es el hábito más transferible de toda la sección de costos: un arquitecto serio dimensiona <strong>bytes y frecuencias antes de elegir servidores</strong>. La tabla también justifica decisiones que ya viste — por ejemplo, por qué bajar el catálogo entero una vez al día y actualizarlo con mensajitos de 0,1 kb, y no recalcarlo en cada pantalla.' },
        { type: 'figure', src: '/img/traffic_forecst.png', alt: 'Pronóstico de tráfico mensual', caption: 'El pronóstico de tráfico del equipo: ~16,5 GiB mensuales en el escenario proyectado. (Planilla original de ArchColider)' },
        {
          type: 'stats',
          items: [
            { value: '12.248 USD', label: 'costo total del año 1 en el escenario mínimo' },
            { value: '12.548 USD', label: 'en el escenario de crecimiento proyectado' },
            { value: '22.481 USD', label: 'en el escenario de crecimiento rápido (×10)' },
            { value: '~1.000 USD', label: 'por mes para operar todo el negocio en el escenario base' },
          ],
        },
        { type: 'p', html: 'Ahora, el dato que sorprende a todos: el ítem más caro de la factura no son los servidores. Es el <strong>monitoreo</strong> (DataDog, 3.336 USD/año) seguido del <strong>reporting</strong> (Tableau, 1.440 USD/año): juntos, cerca del 40% del presupuesto anual. ¿Por qué pagarlos? Porque la alternativa "gratis" — montar las herramientas open source en servidores propios — cuesta lo más caro que existe: horas de desarrollador de un equipo chico.' },
        { type: 'decision', id: 'datadog' },
        { type: 'figure', src: '/img/1y-min-tco.png', alt: 'Distribución del costo total anual por servicio', caption: 'La distribución del presupuesto anual: monitoreo y reporting pesan más que la computación. (Documento original de ArchColider)' },
        { type: 'callout', tone: 'amber', title: 'La lección de presupuesto', html: 'Comparar "gratis" contra "de pago" mirando solo la factura mensual es el error clásico. El costo real de una herramienta incluye quién la va a mantener. A veces el software de pago es el más barato del mundo.' },
      ],
    },

    /* ───────────────────────── 9 ───────────────────────── */
    {
      id: 'mapa',
      phase: 'La realidad económica',
      title: 'El mapa de decisiones completo',
      blocks: [
        { type: 'p', html: 'El repositorio entregó dieciséis ADRs, pero no todos pesan lo mismo: algunos son decisiones estructurales profundas, otros son higiene operativa y algunos son trámite documental. Hicimos el trabajo de curaduría por vos: las decisiones que de verdad definen esta arquitectura, agrupadas en tres pilares, cada una en su formato esencial — <strong>problema, decisión y compensación asumida</strong> — con el enlace al documento original.' },
        { type: 'decisionMap' },
      ],
    },

    /* ───────────────────────── 10 ───────────────────────── */
    {
      id: 'guia',
      phase: 'Para llevar',
      title: 'Guía de campo: el método en cuatro pasos',
      blocks: [
        { type: 'p', html: 'Sacá el caso Farmacy Food y queda un método aplicable a cualquier proyecto. El equipo ganador lo ejecutó en este orden, y el orden es parte del método:' },
        {
          type: 'list',
          items: [
            '<strong>1. Entender el negocio antes del software.</strong> Una semana de preguntas, números y glosario antes del primer diagrama. Saber cuántas peticiones por segundo tiene el sistema real — no el imaginario — es el dato que desempata todo.',
            '<strong>2. Fijar principios de desempate antes de discutir herramientas.</strong> Simplicidad cognitiva, evolucionabilidad, telemetría obligatoria, mensajes antes que llamadas. Sin criterios previos, la discusión de arquitectura se vuelve una guerra de gustos.',
            '<strong>3. Diseñar para la realidad física, no para la ideal.</strong> Las heladeras pierden señal, los datos llegan tarde, los reclamos llegan igual. La arquitectura espera los problemas preparada en vez de pretender que no existan.',
            '<strong>4. Cerrar con la factura.</strong> Una arquitectura sin costo anual estimado está incompleta: el cliente no despliega diagramas, despliega facturas. Y el costo incluye las horas de las personas que mantienen cada pieza.',
          ],
        },
        { type: 'p', html: 'Todos los documentos citados en este artículo — el análisis del ganador, los ADRs originales, las planillas de costos y las soluciones de los otros finalistas — están en los repositorios públicos de <a href="https://github.com/TheKataLog" target="_blank" rel="noopener noreferrer">TheKataLog en GitHub</a>. Si querés ver cómo tres equipos excelentes resuelven el mismo problema de forma opuesta, comparar los repositorios es la mejor continuación de esta lectura.' },
      ],
    },
  ],
  closing: {
    title: 'Fin del análisis del caso',
    paragraphs: [
      'Este artículo es un análisis pedagógico independiente del material público de la competencia: los documentos, diagramas y planillas originales de los equipos, citados y enlazados en cada sección.',
      'Marco teórico de referencia: Fundamentals of Software Architecture (Mark Richards & Neal Ford) y Software Architecture and Design Explained (Rozanski & Woods).',
    ],
  },
};
