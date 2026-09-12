import type { ArticleContent } from './types';

export const ES: ArticleContent = {
  lang: 'es',
  heroKicker: "O'Reilly Software Architecture Kata · Otoño 2020",
  heroTitleA: 'El caso Farmacy Food:',
  heroTitleB: 'cómo se toman decisiones reales de arquitectura',
  heroParagraphs: [
    'Los <a class="concept-chip" data-concept="kata" role="button" tabindex="0">Architecture Katas</a> son competencias donde equipos de ingenieros reciben el pliego de una empresa real y tienen unas semanas para diseñar la arquitectura completa de la solución, defendida ante un jurado. En la edición de otoño de 2020, el jurado de semifinales reunió a cuatro arquitectos de primer nivel: <strong>Nate Schutta</strong>, <strong>Mark Richards</strong> —coautor del libro canónico <em>Fundamentals of Software Architecture</em>—, <strong>Sarah Taraporewalla</strong> (ThoughtWorks) y <strong>Luca Mezzalira</strong> (VP de Arquitectura en DAZN).',
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
        { type: 'p', html: 'El pliego guardaba además dos números intermedios que casi nadie mira: el crecimiento inmediato — de 2 a <strong>8 locaciones durante 2021</strong> — y el consumo estimado de un suscriptor: <strong>~10 comidas por semana</strong>. Esa matemática silenciosa es la que dimensiona el futuro: 1.000 suscriptores son unas 10.000 comidas semanales — exactamente el escenario de crecimiento rápido de la planilla de costos que vas a ver al final.' },
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
        { type: 'p', html: 'Ninguna de las tres es "la correcta". Como resume la primera ley de Richards & Ford que los propios jueces repiten en cada kata: <em>en arquitectura no hay decisiones correctas o incorrectas — todo es una compensación</em>. Y "calidad del razonamiento" no era una impresión vaga: el deck que los jueces usaron en semifinales — también está en el repositorio — deja la rúbrica por escrito. Cada propuesta se evaluó contra siete criterios:' },
        {
          type: 'list',
          items: [
            '<strong>Claridad de narrativa, organización y documentación de apoyo.</strong> Una buena arquitectura que no se sabe contar, no defiende.',
            '<strong>Entendimiento de los requerimientos y completitud de la solución.</strong> ¿Responde al problema que se le planteó, o a uno más cómodo?',
            '<strong>Identificación de las características arquitectónicas de soporte.</strong> ¿Qué atributos de calidad importan y dónde?',
            '<strong>Diagramas: tipos, nivel de detalle y completitud.</strong> Los jueces citan aquí a Neal Ford: "el objetivo de un diagrama es transmitir una comprensión clara y compartida de la arquitectura".',
            '<strong>Arquitectura general del sistema.</strong>',
            '<strong>Arquitectura de integración con los sistemas de terceros requeridos.</strong> El negocio ya tenía heladeras, kioscos y pasarela: había que conectarlos bien.',
            '<strong>ADRs: documentación y justificación de las decisiones.</strong> Aquí aparece la segunda ley: <em>"el porqué importa más que el cómo"</em>.',
          ],
        },
        { type: 'p', html: 'Dicho de otro modo: el jurado no premiaba el diagrama más vistoso sino la trazabilidad completa — del negocio a la decisión, y de la decisión a su costo. Es la misma vara con la que se puede medir cualquier propuesta de arquitectura, dentro o fuera de un concurso.' },
        { type: 'p', html: 'Para entender por qué el razonamiento de ArchColider convenció al jurado, hay que retroceder un paso: antes de dibujar una sola caja, el equipo se fijó reglas de juego propias. Eso es lo próximo.' },
      ],
    },

    /* ───────────────────────── 3 ───────────────────────── */
    {
      id: 'principios',
      phase: 'El marco de decisión',
      title: 'Las reglas de juego antes del primer diagrama',
      blocks: [
        { type: 'p', html: 'El repositorio del equipo ganador tiene una particularidad reveladora: durante la primera semana no hay un solo diagrama de software. Hay documentos de negocio: objetivos, restricciones, preguntas al cliente, glosario de vocabulario. El pliego mismo había llegado como ocho requerimientos crudos, y la primera tarea fue releerlo en voz alta: los reescribieron como escenarios de uso y marcaron el primero — integrarse con las heladeras — como <em>"vago y probablemente fuera de alcance: requiere clarificación"</em>, porque esa integración ya la hacía el sistema de gestión de kioscos de Byte. Cuestionar el pliego antes de cumplirlo es la segunda herramienta del arquitecto. Y las preguntas no son genéricas: el equipo les escribió al cliente una lista concreta, con los casos límites que un desarrollador suele descubrir — tarde — en producción. Algunas reales, citadas del archivo <em>Questions.md</em>:' },
        {
          type: 'list',
          items: [
            '<em>"Si un suscriptor se enferma y no puede retirar sus comidas durante uno o varios días, ¿qué pasa?"</em>',
            '<em>"¿Puede un usuario registrado hacer un pedido por lotes que no entre en una heladera? ¿Y entonces — entrega directa?"</em>',
            '<em>"¿La comida que un suscriptor no retiró puede venderse a otros? ¿Después de cuánto tiempo? ¿Cómo se le notifica al suscriptor?"</em>',
            '<em>"No sabemos qué datos proveen las heladeras: ¿el total de comidas disponibles o solo el delta del último cambio? Esperamos que sea el total."</em>',
          ],
        },
        { type: 'p', html: 'Notese lo que el equipo hace aquí: en vez de <strong>inventar</strong> una respuesta conveniente para cada ambigüedad del pliego, la anotan, le ponen un signo de pregunta y la mandan al dueño del negocio. Cada respuesta que llegue puede cambiar el diseño; inventarla, lo habría escondido.' },
        { type: 'p', html: 'Recién después aparece el método que ordenó todo el resto del trabajo: <strong>Viewpoints and Perspectives</strong>, el marco de Rozanski & Woods, un estándar de la industria para describir arquitecturas desde múltiples vistas (contexto, funcional, información, despliegue…) cruzadas con atributos de calidad.' },
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
        { type: 'p', html: 'Queda una pieza metodológica más, y es la que da nombre a media docena de archivos del repositorio: el <a class="concept-chip" data-concept="adr" role="button" tabindex="0">ADR</a> (<em>Architecture Decision Record</em>). Un ADR es un documento cortito — una carilla — que registra una decisión estructural en tres partes: el <strong>contexto</strong> (qué problema la motivó), la <strong>decisión</strong> y las <strong>consecuencias</strong> asumidas, incluidas las negativas. El formato lo popularizó Michael Nygard con un argumento que los slides oficiales de este kata elevan a categoría: la <strong>segunda ley de la arquitectura de software</strong> — <em>"el porqué importa más que el cómo"</em>. El código muestra cómo es el sistema; solo el ADR guarda por qué quedó así. Y su regla de oro es honestidad: un ADR que no admite desventajas es propaganda, no una decisión.' },
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
        { type: 'p', html: 'El repositorio guarda la justificación completa en el <button class="adr-ref" data-adr="002" type="button">ADR 002</button> — y guarda también algo que casi nadie publica: el paso intermedio entre la conversación y el diagrama pulido. Esta es la pizarra real de una sesión de diseño detallado del 29 de octubre de 2020:' },
        { type: 'figure', src: '/img/whiteboard-menu-plugins.png', alt: 'Pizarra del equipo: el menú como núcleo rodeado de plug-ins y un post-it sobre el protocolo de mensajería', caption: 'El núcleo "Menu" rodeado de extensiones (nutrición, recomendaciones, reviews, descuentos) — y el post-it que ya anticipaba todo: "se comunica con los plug-ins por protocolo de mensajería (el protocolo debe ser lo bastante inteligente como para desacoplar después); si el núcleo se congestiona, le agregamos cache". Hasta los tamaños crudos están: 4 núcleos/8 GB para el centro, 1 núcleo/2 GB para lo escalado. (Pizarra original de ArchColider)' },
        { type: 'p', html: 'Miren el post-it: la filosofía completa del monolito modular, escrita a mano antes de existir ningún diagrama formal. Diseñar para la extracción futura no salió de un libro: salió de una sesión con marcadores. Después, esa misma idea se ordenó en los dos diagramas que quedaron en la documentación final:' },
        { type: 'figure', src: '/img/FF_Modularization.PNG', alt: 'Diagrama de modularización del monolito', caption: 'La modularización del monolito: módulos con fronteras estrictas dentro de una sola pieza desplegable. (Documento original de ArchColider)' },
        { type: 'figure', src: '/img/FF_ModularizationExtraction.PNG', alt: 'Diagrama de extracción futura de módulos', caption: 'El camino de evolución: cualquier módulo se extrae como servicio independiente cuando la telemetría lo justifique. (Documento original de ArchColider)' },
        { type: 'p', html: 'Y por si queda alguna duda sobre el espectro de opciones: también descartaron los otros dos extremos. El monolito <em>puro</em> ("sirve para una prueba de concepto, pero acá sería simplificación de más") y los microservicios desde el día uno ("exigen un modelo de dominio estable que todavía no existe: el esfuerzo se pierde y el usuario no lo ve"). El monolito modular es el punto medio deliberado, no una apuesta a ciegas.' },
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
        { type: 'p', html: 'El corte core/genérico trae una consecuencia de diseño que el equipo documentó en su presentación final: si el catálogo de comidas es la joya de la casa, hay que protegerla de los formatos de los demás. Alrededor del <strong>Menu Catalog</strong> dibujaron una <a class="concept-chip" data-concept="acl" role="button" tabindex="0">capa anticorrupción</a>: una frontera interna por donde obligatoriamente entran la cocina fantasma, el programa de lealtad, la app y los kioscos — y de la que el dominio solo sale hablando en comandos y eventos con el carrito, las recomendaciones y los reviews. Su valor se mide en un detalle delicioso de los documentos internos: si las heladeras de Byte no publican eventos, la capa los fabrica — convierte los datos crudos de la API en el mismo evento "catálogo actualizado" que consume todo el sistema, y el resto jamás se entera de la diferencia.' },
        { type: 'figure', src: '/img/menu-catalog-acl.png', alt: 'Diagrama del servicio Menu Catalog con su capa anticorrupción', caption: 'El servicio Menu Catalog con su capa anticorrupción (Meals Offer, Loyalty, API): los sistemas externos tocan la frontera, jamás el dominio. Este diagrama solo existe en la presentación del equipo — nunca lo volcaron a la documentación. (Documento original de ArchColider)' },
        { type: 'p', html: 'El mismo documento muestra hasta dónde llega el pragmatismo con lo genérico: los pagos. En la pizarra lo garabatearon sin rodeos — un único bloque de pago que reparte hacia Visa, Mastercard o PayPal:' },
        { type: 'figure', src: '/img/whiteboard-payment-facade.png', alt: 'Pizarra del equipo: fachada de pagos hacia Visa, Mastercard y PayPal', caption: 'La fachada de pagos, garabateada: un solo bloque interno reparte hacia cada red de pago. (Pizarra original de ArchColider)' },
        { type: 'decision', id: 'payment' },
        { type: 'p', html: 'Hasta el mapa para encontrar las heladeras se decidió con la misma vara. El ADR 015 comparó cuatro proveedores por cuota gratuita — OpenStreetMap, TomTom, Mapbox y Here Maps — y eligió <strong>Here Maps</strong>: sus 250.000 consultas mensuales gratis alcanzaban de sobra para el volumen real del negocio. La consecuencia aceptada es de manual: vigilar el consumo mes a mes para no empezar a pagar de más sin notarlo.' },
        { type: 'h3', html: 'El metamodelo: reglas por un lado, ejecución por el otro' },
        { type: 'p', html: 'La joya menos obvia del repositorio es un diagrama llamado <em>metamodelo</em>. Separa dos niveles que suelen mezclarse en un mismo embrollo: el <strong>nivel de conocimiento</strong> (las reglas: qué tipos de usuario existen, qué acciones puede hacer cada uno, qué promociones aplican a qué menús) y el <strong>nivel operacional</strong> (los hechos del día a día: esta orden, este menú, esta cocina). Es la misma separación entre "el reglamento del torneo" y "el partido del domingo".' },
        { type: 'figure', src: '/img/FF_Metamodel_v1.png', alt: 'Metamodelo conceptual: nivel de conocimiento y nivel operacional', caption: 'El metamodelo: reglas de negocio (arriba) separadas de las entidades operativas (abajo). Es la respuesta directa a la Entity Trap. (Documento original de ArchColider)' },
        { type: 'p', html: 'Este corte tiene un beneficio enorme a futuro: cuando el negocio invente un tipo de promoción o un nuevo perfil de usuario, cambia una regla del "reglamento" sin reescribir el "partido". El metamodelo está diseñado para absorber escenarios que todavía no existen. Un ejemplo del propio documento: las promociones cuelgan de menús y de tipos de comida, nunca de comidas sueltas — así una cocina concreta puede ofrecer su propia promoción sin tocar el resto de la plataforma.' },
        { type: 'h3', html: 'El presupuesto de calidad de cada subsistema' },
        { type: 'p', html: 'El diseño se cerró con una idea que vale copiar: los atributos de calidad globales primero, y después <strong>un presupuesto propio por subsistema</strong> — porque cada pieza necesita patrones distintos. La app debía ser usable, rápida y <em>autónoma</em> (funcionar sin señal); el catálogo, extensible, mantenible y disponible — con una honestidad refrescante: "disponibilidad resuelta con reinicios y escala vertical; una caída corta sigue siendo posible", porque era prueba de negocio, no un banco. Las órdenes: confiabilidad e integridad (es la caja fuerte del dinero). La pasarela de pago: seguridad máxima y disponibilidad ("no poder pagar es pérdida directa de plata"). El diagrama muestra además los dos <em>centros de gravedad</em> destacados, y una elegancia adicional: la app del cajero no es un producto aparte — impersona usuarios y recorre el mismo flujo de trabajo que la app del cliente.' },
        { type: 'figure', src: '/img/FF_system_approach.png', alt: 'Composición del sistema con centros de gravedad y atributos de calidad por subsistema', caption: 'La composición final con los centros de gravedad destacados (Menu Catalog y Ordering) y el presupuesto de calidad de cada pieza. (Documento original de ArchColider)' },
      ],
    },

    /* ───────────────────────── 6 ───────────────────────── */
    {
      id: 'concurrencia',
      phase: 'El diseño',
      title: 'El mundo físico: heladeras, dinero y conexiones inestables',
      blocks: [
        { type: 'p', html: 'Aquí el caso deja de ser teórico y se vuelve ingeniería de la realidad: dos personas comprando la última vianda al mismo tiempo, arrepentimientos con plata de por medio, heladeras sin señal. Cada problema viene con la solución que el equipo le diseñó — y el patrón que se repite al final es la lección más grande de todo el caso.' },
        { type: 'h3', html: 'Problema 1: dos personas quieren el último plato' },
        { type: 'p', html: 'La tentación es bloquear la base de datos ("nadie toca el stock mientras yo compro"). El equipo hizo algo mejor usando una peculiaridad física del negocio: <strong>una vianda no puede saltar de una heladera a otra</strong>. Entonces cada heladera tiene su propio <a class="concept-chip" data-concept="actor-model" role="button" tabindex="0">actor</a>: un proceso que procesa las compras de esa heladera de a una, en orden. Nunca hay dos escrituras simultáneas sobre el mismo stock, así que nunca hacen falta locks. El stock vive en memoria, a velocidad de procesador.' },
        { type: 'figure', src: '/img/FF_concurency_order_processing.PNG', alt: 'Diagrama de procesamiento de órdenes con actores', caption: 'Órdenes pasando de actor en actor, cada uno con una sola responsabilidad. (Documento original de ArchColider)' },
        { type: 'p', html: 'Mirando el mundo físico apareció además un problema que un diagrama genérico no muestra: <strong>un local puede tener varias heladeras</strong>. Si un gimnasio tiene tres, ¿de quién es el stock que ve el usuario: el de una heladera o el del local entero? La API de Byte Technology no garantizaba esa suma por local, así que el equipo anotó el riesgo de tener que implementarla por su cuenta — y dejó registrada la pregunta honesta que hicieron al proveedor: ¿la API reporta el <em>total</em> de comidas disponibles o solo el <em>delta</em> del último cambio? Cuando un sistema depende de una API externa que no controlás, esas preguntas se escriben antes que el código.' },
        { type: 'h3', html: 'Problema 2: el reclamo del cliente que cobraron mal' },
        { type: 'p', html: 'Un negocio que maneja comida y dinero va a recibir reclamos. La pregunta es qué evidencia existe cuando llegue el reclamo. La respuesta del equipo fue <a class="concept-chip" data-concept="event-sourcing" role="button" tabindex="0">Event Sourcing</a>: registrar cada orden como una secuencia inmutable de eventos en vez de un estado que se borra y reescribe. Para que el mensaje "cobrá esta orden" no se pierda ni se procese doble, usaron una <a class="concept-chip" data-concept="message-queue" role="button" tabindex="0">cola de mensajes</a> con confirmación de recibo e identificadores únicos.' },
        { type: 'decision', id: 'event-sourcing' },
        { type: 'decision', id: 'rabbitmq' },
        { type: 'p', html: 'Dos detalles finos de esta misma decisión, sacados de los documentos internos: cada agregado del sistema lleva un <strong>número de versión</strong>, de modo que dos escrituras concurrentes sobre la misma orden se detectan sin locks; y el equipo también diagramó el lado B del dinero — si el proveedor de pagos rechaza el cargo o expira el intento, el stock reservado se repone solo y el usuario recibe el aviso de rechazo. Nada queda a medias: ni un cobro huérfano, ni una comida desaparecida del catálogo. Y como el historial de órdenes vive alrededor de un mes en el dispositivo, el rechazo se convierte en un botón: la app ofrece reintentar la última orden con un toque.' },
        { type: 'p', html: 'Antes de la táctica, el flujo completo de una compra normal — cada paso numerado es un comando (lo que alguien <em>quiere</em> que ocurra) o un evento (lo que <em>ya ocurrió</em> y todos escuchan):' },
        { type: 'figure', src: '/img/IM_meal_purchase.PNG', alt: 'Diagrama de información: compra de una comida paso a paso', caption: 'La compra instantánea de punta a punta: Start Order y Confirm Order (comandos, azul), MealStockReserved y OrderPurchased (eventos, verde). Fíjate cómo el stock reservado y el stock descontado son eventos distintos que escuchan catálogo y reporting. (Documento original de ArchColider)' },
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
      id: 'suscriptor',
      phase: 'El diseño',
      title: 'El viaje de una vianda de suscriptor',
      blocks: [
        { type: 'p', html: 'Quedaba un cabo: el suscriptor, el cliente ideal que el negocio quería sobre todo, presentado en la primera sección y nunca más visto. ¿Cómo llega físicamente su comida? El equipo lo trabajó de punta a punta, y el repositorio guarda hasta la génesis: un garabato titulado "IDEA!!!" donde la idea nace en la pizarra — un usuario con cuenta, una heladera con comidas disponibles, y abajo una fila de casilleros prepagados por día que además suman puntos de lealtad.' },
        { type: 'figure', src: '/img/whiteboard-subscriber-idea.png', alt: 'Pizarra "IDEA!!!": el concepto de suscripción naciendo', caption: 'El momento en que la suscripción se inventa en la pizarra: menú prepagado por días (1d, 2d, 3d…) con puntos de lealtad. (Pizarra original de ArchColider)' },
        { type: 'p', html: 'La versión final es un pequeño festival de eventos encadenados. La cocina recibe por las mañanas sus <em>inventory updates</em> — la lista de lo que debe producir, formada desde los menús de los suscriptores — y responde con un vocabulario mínimo de cuatro palabras: <strong>aceptado, despachado, no puedo, demorado</strong>. Cuando despacha, el evento <em>OrderDispatched</em> se publica y lo escuchan el catálogo (libera stock), el reporting y la propia orden. Cuando la comida entra físicamente a la heladera, esa confirma el evento <em>OrderPlacedInFridge</em>, y recién entonces la orden pasa a <em>disponible para retiro</em> y el usuario recibe su aviso con el PIN. El módulo de scheduling no consulta el event store directamente: lee <a class="concept-chip" data-concept="cqrs" role="button" tabindex="0">proyecciones</a> — copias listas para consultar que alguien más mantiene al día. Y dentro del planificador quedó documentado un trade-off de manual: ¿materializar de una vez todas las órdenes futuras del suscriptor, o generarlas cada día desde su menú? Eligiendo lo segundo, cambiar o cancelar el menú no obliga a cazar y reescribir decenas de órdenes ya creadas — el único costo es marcar cuáles van prepagadas.' },
        { type: 'figure', src: '/img/IM_preparing_scheduled_orders.PNG', alt: 'Diagrama de información: preparación de órdenes programadas de suscriptores', caption: 'Del calendario a la heladera: PrepareOrders, OrderDispatched, OrderPlacedInFridge y OrderAvailableForPicking — el ciclo completo de una vianda de suscriptor. (Documento original de ArchColider)' },
        { type: 'p', html: '¿Y si el suscriptor se arrepiente fuera de la ventana de los 30 segundos? Ahí sí hay dolor: la cocina ya compró ingredientes, quizá ya cocinó. El flujo diagramado distingue: la cancelación de una orden programada dispara un <em>ClaimRefund</em> hacia el proveedor de pagos, y el evento <em>RefundSuccessful</em> le confirma a la app que la plata volvió. Sin eventos, ese "¿ya se lo devolví o no?" es la clase de pregunta que estresa a un equipo de soporte. La letra chica de negocio también está escrita: la cancelación de un menú programado rige <em>desde el día siguiente</em> — la comida ya preparada no se cancela, y en vez de perderse puede liberarse al stock común.' },
        { type: 'figure', src: '/img/IM_cancel_scheduled_order_by_user.PNG', alt: 'Diagrama de información: cancelación de orden programada con reembolso', caption: 'Cancelación fuera de la ventana: ClaimRefund viaja a la pasarela y RefundSuccessful vuelve a la app. (Documento original de ArchColider)' },
        { type: 'p', html: 'Tres eventos y un vocabulario de cuatro palabras: hasta el cliente más valioso del negocio se sostiene con las mismas piezas simples que el resto del sistema.' },
      ],
    },

    /* ───────────────────────── 8 ───────────────────────── */
    {
      id: 'infraestructura',
      phase: 'El diseño',
      title: 'Aterrizar el diseño en la nube',
      blocks: [
        { type: 'p', html: 'Todo lo anterior es lógica pura; en algún momento hay que pagar servidores. El equipo eligió AWS por una restricción del pliego y una razón práctica: la región más cercana a Detroit. La topología es una lección de <a class="concept-chip" data-concept="vpc" role="button" tabindex="0">red privada</a> bien entendida: un recinto privado con el balanceador en la puerta, los servidores adentro sin direcciones públicas y todo duplicado en dos edificios de datacenter distintos.' },
        { type: 'figure', src: '/img/infra-vpc.png', alt: 'Diagrama de la topología de red VPC en AWS', caption: 'La red VPC: dos zonas de disponibilidad, subredes públicas (balanceadores) y privadas (los servidores, sin IP pública). (Documento original de ArchColider)' },
        { type: 'h3', html: 'Validar credenciales en la puerta' },
        { type: 'p', html: 'El detalle de seguridad más didáctico: en vez de que cada pieza del software verifique la identidad de cada visitante, lo hace el <strong>balanceador de entrada</strong> contra el servicio de identidades de AWS (Cognito) antes de que el tráfico llegue a los servidores. Los servidores solo reciben visitas ya verificadas. El servicio de identidades permite además <strong>federación</strong>: el usuario puede entrar con su cuenta de Google o Facebook, y el equipo lo anotó como argumento de producto — la federación "genera confianza inmediata en una porción grande de usuarios potenciales". Aunque con letra chica: quien desconfíe de las cuentas de los gigantes tecnológicos siempre puede crear una cuenta independiente. Y por dentro, "confianza cero": los módulos también exigen autorización entre sí — con control de acceso por atributos (ABAC) desde el día uno — como si ya fueran servicios separados, para que el día que se separen, la seguridad ya esté hecha.' },
        { type: 'decision', id: 'edge-auth' },
        { type: 'figure', src: '/img/Authentication.png', alt: 'Diagrama del flujo de autenticación con Cognito y ALB', caption: 'El flujo de autenticación: el balanceador valida tokens contra Cognito en el borde de la red. (Documento original de ArchColider)' },
        { type: 'figure', src: '/img/services.png', alt: 'Esquema de servicios y hardware virtual: servidores, colas, streaming y SaaS por subred', caption: 'La topología completa: cada servidor es una plantilla t3.medium; colas, streaming de logs y los SaaS externos con su rol. (Documento original de ArchColider)' },
        { type: 'p', html: 'La comunicación entre piezas tampoco es una telaraña de llamadas directas. El equipo nombró explícitamente el anti-patrón que querían evitar — el <em>"espagueti con albóndigas"</em>, cada servicio gritándole a cada otro — y citó su inspiración: los escritos de Martin Kleppmann sobre logs como infraestructura de datos. La solución: un <strong>stream basado en log</strong> por donde se propagan los cambios, y cada servicio consume a su propio ritmo, sin que nadie dependa de que el otro esté vivo. El beneficio secundario es puramente económico: relajar los requisitos de disponibilidad y performance de los consumidores permite comprarles máquinas más baratas.' },
        { type: 'figure', src: '/img/FF_LogBasedStream.PNG', alt: 'Diagrama de propagación de información vía stream basado en log', caption: 'La propagación por log: los productores escriben una vez; reporting, notificaciones y cualquier consumidor futuro leen a su ritmo. (Documento original de ArchColider)' },
        { type: 'p', html: 'La infraestructura entera, además, no se clickea a mano: se define como <strong>código declarativo</strong> (CloudFormation en el ADR, sin cerrar la puerta a Terraform). El beneficio citado va más allá de la reproducibilidad — subredes que nacen como copias exactas unas de otras, entornos derivados con transformaciones estándar: permite correr <strong>pruebas de arquitectura contra la especificación</strong> antes de desplegar nada, probar escenarios sin mover un solo servidor, y detectar <em>drift</em> cuando alguien cambia algo a mano por fuera del código.' },
        { type: 'h3', html: '¿Y si el negocio crece?' },
        { type: 'p', html: 'La estrategia de escala es la más honesta del caso: primero agrandar la máquina ("escala vertical"), y recién multiplicar instancias con balanceadores ("escala horizontal") cuando la telemetría — obligatoria, principio rector número tres — muestre que la vertical ya no da. Los umbrales iniciales que dejaron escritos son concretamente gráficos del tamaño del negocio: <strong>CPU por encima del 75% o memoria por encima del 85%</strong>. Y también dejaron anotado el peligro inverso, un punto sensible poco obvio: las tecnologías de nube permiten escalar vertical <em>durante mucho tiempo</em>, lo que puede <strong>postergar indefinidamente</strong> la decisión de escalar horizontal — su antídoto: evaluar el camino crítico del negocio directamente en producción. Para el momento del corte, el módulo con más presión se extrae del monolito, exactamente como se diseñó en la sección de estilo.' },
        { type: 'figure', src: '/img/menu-catalog-extraction.png', alt: 'Caso concreto de extracción: el Menu Catalog como servicio con balanceador y réplicas propias', caption: 'El caso de extracción trabajado: el Menu Catalog ya convertido en servicio, con balanceador propio y N réplicas de filtrado + caché escalando en paralelo. (Documento original de ArchColider)' },
        { type: 'p', html: 'Y la telemetría tiene un truco extra que vale conocer: los endpoints de salud del monolito exponen tres niveles de información — si cada módulo está <strong>listo para operar</strong>, métricas internas del <strong>negocio</strong> (cómo se procesan los pedidos) y métricas <strong>técnicas</strong> (tasa de requests, tasa de fallos). Además del monitoreo de máquinas, el sistema se prueba con <strong>escenarios sintéticos</strong> — los caminos críticos a vigilar se identifican en un taller de atributos de calidad —: un "cliente dummy" recorre el camino crítico (elegir comida, pagar, retirar) cada tantos minutos y mide si el resultado es correcto y cuánto tarda. Una máquina puede estar "sana" con la lógica de negocio clavada; el cliente fantasma se entera. Esos números son además la señal que decide cuándo partir el monolito.' },
        { type: 'decision', id: 'scale-up' },
        { type: 'h3', html: 'Los riesgos, con mitigación a mano' },
        { type: 'p', html: 'El análisis del equipo termina con algo que la mayoría de las entregas omite: una lista de riesgos donde cada riesgo tiene su opción de mitigación escrita al lado. No todos son técnicos — varios son decisiones de negocio que el equipo marcó explícitamente como "a resolver con el dueño". Una selección:' },
        {
          type: 'list',
          items: [
            '<strong>La pasarela de pagos cae:</strong> las órdenes se guardan y se reintenta por un período definido; mientras tanto, política de confianza para conocidos y suscriptores (ya sabemos quiénes son).',
            '<strong>Review bombing contra cocinas terceras:</strong> solo puede opinar quien tiene un cobro confirmado — la reputación también se diseña.',
            '<strong>El canal de notificación falla:</strong> canal de respaldo; y si la comida ya llegó a la heladera, a veces la mejor notificación es ninguna.',
            '<strong>Un cliente reserva y no retira:</strong> la reserva se prepaga — el costo del olvido lo asume quien se olvida, no la cocina que ya cocinó.',
            '<strong>La heladera se llena físicamente:</strong> suscriptores y conocidos juntos pueden pedir más comida de la que entra en la heladera. Los autores fueron brutalmente honestos: no hay mitigación técnica — "decisión pendiente del negocio".',
            '<strong>El pedido llega fuera del horario de la cocina:</strong> las cocinas no operan 24/7; queda como punto abierto para el dueño.',
            '<strong>La cocina fantasma se cae:</strong> se sigue operando con la información interna del sistema de órdenes; si un despacho falla, protocolo de compensación.',
            '<strong>Un cambio rompe el formato de los mensajes:</strong> versionado de API y compatibilidad hacia atrás negociada por contrato, con avisos de fin de vida ("sunset") para los consumidores.',
            '<strong>Escalar dispara la factura:</strong> tope máximo de instancias por servicio, y por encima del umbral, confirmación humana antes de encender nada.',
            '<strong>Un release rompe algo:</strong> hot-swap al release anterior como requisito de plataforma, no como esperanza.',
          ],
        },
      ],
    },

    /* ───────────────────────── 9 ───────────────────────── */
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
            ['Review con foto (reclamo o reseña)', '~4 MB', '10% de los usuarios escribe reviews; 5% registra algún problema'],
          ],
        },
        { type: 'p', html: 'Este es el hábito más transferible de toda la sección de costos: un arquitecto serio dimensiona <strong>bytes y frecuencias antes de elegir servidores</strong>. La tabla también justifica decisiones que ya viste — por ejemplo, por qué bajar el catálogo entero una vez al día y actualizarlo con mensajitos de 0,1 kb, y no recalcarlo en cada pantalla. Y fíjate en la última fila: el mensaje más pesado de todo el sistema no lo genera el negocio — lo genera un usuario quejándose con una foto de 4 MB. Por eso los reviews entran en el cálculo: la planilla cruda muestra que son, con diferencia, el mayor consumidor de tráfico y almacenamiento.' },
        { type: 'figure', src: '/img/database_forecast.png', alt: 'Pronóstico de crecimiento de la base de datos', caption: 'El pronóstico de base de datos: ~3,96 GiB mensuales en el escenario proyectado de 30.000 registros. (Planilla original de ArchColider)' },
        { type: 'figure', src: '/img/traffic_forecst.png', alt: 'Pronóstico de tráfico mensual', caption: 'El pronóstico de tráfico del equipo: ~16,5 GiB mensuales en el escenario proyectado. (Planilla original de ArchColider)' },
        { type: 'p', html: 'La planilla sin pulir, además, deja los supuestos a la vista — y eso es un elogio, no un defecto. Ahí se lee que el cálculo asume tráfico <strong>uniforme</strong> ("en la realidad el número podría ser hasta un 60% menor", aclaran ellos), que <strong>no contempla compresión</strong> ("con GZIP bajaría significativamente"), y que la base de datos se dimensionó para el crecimiento a 12 meses: 1 TB fijos de DynamoDB que cuestan 3.072 USD al año — <em>casi lo mismo que todas las máquinas juntas</em> (3.115 USD). Nada de esto invalida el cálculo; al contrario: un estimado que muestra sus supuestos se puede discutir. Uno que los esconde, no.' },
        {
          type: 'stats',
          items: [
            { value: '12.248 USD', label: 'costo total del año 1 en el escenario mínimo' },
            { value: '12.548 USD', label: 'en el escenario de crecimiento proyectado' },
            { value: '22.481 USD', label: 'en el escenario de crecimiento rápido (×10)' },
            { value: '~1.000 USD', label: 'por mes para operar todo el negocio en el escenario base' },
          ],
        },
        { type: 'p', html: 'Ahora, el dato que sorprende a todos: el ítem más caro de la factura no son los servidores. Es el <strong>monitoreo</strong> (DataDog, 3.336 USD/año) seguido del <strong>reporting</strong> (Tableau, 1.440 USD/año): juntos, cerca del 40% del presupuesto anual. ¿Por qué pagarlos? Porque la alternativa "gratis" — montar las herramientas open source en servidores propios — cuesta lo más caro que existe: horas de desarrollador de un equipo chico. Y no fue fe: compararon alternativas. Para monitoreo, Grafana y el stack ELK (descartados por exigir mantenimiento propio); para reportes, Tableau contra Power BI y KoolReport — Power BI era viable solo si el dueño tenía suscripción Microsoft.' },
        { type: 'decision', id: 'datadog' },
        { type: 'figure', src: '/img/1y-min-tco.png', alt: 'Distribución del costo total anual por servicio', caption: 'La distribución del presupuesto anual: monitoreo y reporting pesan más que la computación. (Documento original de ArchColider)' },
        { type: 'callout', tone: 'amber', title: 'La lección de presupuesto', html: 'Comparar "gratis" contra "de pago" mirando solo la factura mensual es el error clásico. El costo real de una herramienta incluye quién la va a mantener. A veces el software de pago es el más barato del mundo.' },
      ],
    },

    /* ───────────────────────── 10 ───────────────────────── */
    {
      id: 'mapa',
      phase: 'La realidad económica',
      title: 'El mapa de decisiones completo',
      blocks: [
        { type: 'p', html: 'El repositorio entregó dieciséis ADRs, pero no todos pesan lo mismo: algunos son decisiones estructurales profundas, otros son higiene operativa y algunos son trámite documental. Hicimos el trabajo de curaduría por vos: las decisiones que de verdad definen esta arquitectura, agrupadas en tres pilares, cada una en su formato esencial — <strong>problema, decisión y compensación asumida</strong> — con el enlace al documento original.' },
        { type: 'decisionMap' },
      ],
    },

    /* ───────────────────────── 11 ───────────────────────── */
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
