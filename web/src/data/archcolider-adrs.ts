export interface AdrItem {
  id: string;
  title: string;
  originalTitle: string;
  date: string;
  status: 'Accepted' | 'Proposed' | 'Declined' | 'Draft';
  category: string;
  context: string;
  decision: string;
  consequences: {
    positive?: string[];
    negative?: string[];
    neutral?: string[];
    risks?: string[];
  };
  reason?: string;
  githubUrl: string;
}

export const ARCHCOLIDER_ADRS: AdrItem[] = [
  {
    "id": "001",
    "title": "Registro de Decisiones de Arquitectura (Uso de Plantilla ADR)",
    "originalTitle": "Record architecture decisions",
    "date": "2020-11-19",
    "status": "Accepted",
    "category": "Estilo & Arquitectura",
    "context": "Se requiere una forma estandarizada y persistente de documentar las decisiones técnicas estructurales, asegurando que cualquier colaborador comprenda el contexto, las alternativas evaluadas y las consecuencias asumidas a lo largo de la vida del proyecto.",
    "decision": "Utilizar Architectural Decision Records (ADRs) siguiendo la plantilla formal de Michael Nygard (Contexto, Decisión y Consecuencias). Cada registro se versiona en el repositorio en formato Markdown.",
    "consequences": {
      "positive": [
        "Registro histórico transparente de todas las elecciones técnicas estructurales.",
        "Facilidad para incorporar nuevos integrantes al equipo sin pérdida de contexto.",
        "Claridad explícita sobre qué problemas se consideraron y bajo qué premisas."
      ],
      "negative": [
        "Sobrecarga de mantenimiento documental para mantener sincronizados los registros con la evolución del código."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/001%20We%20are%20using%20ADR%20(template).md"
  },
  {
    "id": "002",
    "title": "Enfoque de Sistema: Adopción del Monolito Modular",
    "originalTitle": "System approach",
    "date": "2020-10-29",
    "status": "Accepted",
    "category": "Estilo & Arquitectura",
    "context": "El proyecto debe arrancar con bajo costo y volumen reducido (2 locaciones iniciales, ~300 comidas/semana), pero soportar un crecimiento proyectado a 68 locaciones y 1.000 suscriptores en 12 meses. Se evaluaron cuatro estilos: Monolito Tradicional, Microservicios Distribuidos, Microkernel (Plugins) y Monolito Modular.",
    "decision": "Adoptar un Monolito Modular desplegado en contenedores gestionados (AWS ECS / Fargate). El código se estructura internamente por límites de dominio (Bounded Contexts) con fachadas e interfaces estrictas. Si en el futuro un módulo específico requiere escalado independiente, su extracción física es directa y limpia.",
    "consequences": {
      "positive": [
        "Máxima simplicidad y velocidad de despliegue inicial con baja sobrecarga de infraestructura.",
        "Baja latencia en comunicaciones entre módulos (llamadas en memoria sin salto de red).",
        "Integridad transaccional preservada sin requerir transacciones distribuidas de dos fases.",
        "Camino de evolución claro hacia microservicios cuando la escala lo justifique."
      ],
      "negative": [
        "Un fallo catastrófico no controlado en un módulo puede impactar al proceso global si no se aísla adecuadamente.",
        "Requiere disciplina estricta y herramientas automatizadas para evitar acoplamientos indebidos entre módulos."
      ],
      "risks": [
        "Degradación hacia un Big Ball of Mud si los desarrolladores importan clases internas saltándose las interfaces públicas."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/002%20System%20approach.md"
  },
  {
    "id": "003",
    "title": "Sistema Unificado de Trazabilidad y Monitoreo",
    "originalTitle": "Tracing and monitoring system",
    "date": "2020-10-29",
    "status": "Proposed",
    "category": "Observabilidad & Operaciones",
    "context": "En un sistema modularizado con interacciones asíncronas y eventos, diagnosticar la causa raíz de fallas o cuellos de botella de rendimiento requiere observabilidad distribuida de extremo a extremo sin depender rígidamente de un proveedor propietario específico.",
    "decision": "Adoptar OpenTelemetry como estándar de instrumentación neutro para métricas, trazas y registros, enviando telemetría a Prometheus/Grafana (o soluciones gestionadas como DataDog en producción). Cada solicitud entrante recibe un identificador de correlación (Trace ID) que se propaga a través de módulos y colas de mensajes.",
    "consequences": {
      "positive": [
        "Visibilidad integral del flujo de transacciones a través de límites modulares y colas asíncronas.",
        "Independencia de vendor gracias al estándar abierto OpenTelemetry.",
        "Capacidad para detectar degradaciones de latencia antes de que impacten a los usuarios."
      ],
      "negative": [
        "Incremento marginal en el tamaño de los encabezados de mensajes y en el consumo de red.",
        "Costo de almacenamiento de métricas y retención de trazas en la plataforma de observabilidad."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/003%20Tracing%20and%20Monitoring%20Sytem.md"
  },
  {
    "id": "004",
    "title": "Endpoints de Health Check Dedicados (Técnicos y de Negocio)",
    "originalTitle": "Dedicated health-check endpoint for services",
    "date": "2020-10-29",
    "status": "Accepted",
    "category": "Observabilidad & Operaciones",
    "context": "Los supervisores de infraestructura necesitan conocer el estado operativo de cada componente. Además, verificar que un proceso esté vivo no garantiza que las reglas de negocio estén funcionando correctamente (ej. fallas lógicas silenciosas con base de datos disponible pero transacciones bloqueadas).",
    "decision": "Implementar endpoints dedicados por servicio con dos niveles de comprobación: 1) Health checks técnicos mediante patrón heartbeat pasivo para detección de fallas del proceso; 2) Health checks de negocio que inician escenarios sintéticos en la ruta crítica con mensajes ficticios para medir corrección y duración de flujos de usuario reales.",
    "consequences": {
      "positive": [
        "Detección proactiva de anomalías tanto a nivel de infraestructura como de lógica de negocio.",
        "Datos empíricos de duración de la ruta crítica para planificar escalado y extracción de módulos.",
        "Detección temprana de bloqueos lógicos donde el contenedor responde pero la transacción falla."
      ],
      "negative": [
        "El diseño e inyección de mensajes ficticios (dummy messages) en la ruta crítica añade complejidad al código.",
        "Riesgo de que un desarrollador procese por error datos ficticios en flujos de liquidación reales si no están bien aislados."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/004%20Health%20check%20endpoints.md"
  },
  {
    "id": "005",
    "title": "Comprobaciones de Disponibilidad Operativa (Readiness Probes)",
    "originalTitle": "Service readiness checks",
    "date": "2020-10-30",
    "status": "Proposed",
    "category": "Observabilidad & Operaciones",
    "context": "Muchos servicios requieren un tiempo de inicialización (calentamiento de cachés, establecimiento de conexiones a base de datos) antes de estar en condiciones de recibir tráfico. Si reciben solicitudes antes de tiempo, se producen fallos por timeout que pueden inducir al auto-escalador a crear más instancias en bucle.",
    "decision": "Separar la sonda de actividad (/health/live) de la sonda de preparación operativa (/health/ready). El balanceador de carga solo enruta tráfico a una instancia cuando su probe de readiness confirma que todas las dependencias locales y cachés están listas.",
    "consequences": {
      "positive": [
        "Prevención del efecto dog-pile (acumulación excesiva de peticiones durante el arranque de instancias).",
        "Eliminación de falsas alarmas en los supervisores durante despliegues progresivos.",
        "Evita el escalado descontrolado de costos por contenedores que fallan prematuramente."
      ],
      "negative": [
        "Mayor tiempo de arranque percibido antes de que una nueva instancia comience a procesar solicitudes activas."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/005%20Service%20readiness%20checks.md"
  },
  {
    "id": "006",
    "title": "Arquitectura Zero Trust en Comunicaciones Internas",
    "originalTitle": "Zero trust architecture",
    "date": "2020-10-30",
    "status": "Proposed",
    "category": "Seguridad & Pagos",
    "context": "El sistema opera en un entorno cloud público y se comunica con sistemas aguas arriba y aguas abajo. No es seguro asumir que el tráfico dentro de la misma red privada es benigno. Además, los módulos actuales se extraerán a servicios independientes a futuro.",
    "decision": "Aplicar principios Zero Trust desde la fase monolítica: toda invocación inter-módulo debe incluir información de seguridad con tokens criptográficos y claims de contexto. No se autoriza ninguna operación basada únicamente en la pertenencia a la misma subred.",
    "consequences": {
      "positive": [
        "Aislamiento riguroso y postura de seguridad robusta frente a amenazas internas o movimientos laterales.",
        "Facilidad de transición cuando los módulos se extraigan a microservicios físicos en redes separadas.",
        "Cumplimiento alineado con estándares corporativos y regulaciones de datos personales."
      ],
      "negative": [
        "Añade sobrecarga computacional de validación de tokens en llamadas internas dentro del mismo binario.",
        "Mayor complejidad conceptual para el equipo de desarrollo al programar interacciones entre módulos."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/006%20Zero%20trust%20architecture.md"
  },
  {
    "id": "007",
    "title": "Adopción de Event Sourcing con EventStore para Órdenes e Inventario",
    "originalTitle": "Event sourcing usage",
    "date": "2020-10-30",
    "status": "Proposed",
    "category": "Datos & Concurrencia",
    "context": "Farmacy Food interactúa con usuarios en locaciones físicas y su modelo depende críticamente de la confianza. Ante reclamos por discrepancias de cobro o platos no retirados, guardar únicamente el estado final (como en un UPDATE relacional tradicional) destruye la evidencia histórica y hace imposible reconstruir los hechos.",
    "decision": "Implementar Event Sourcing utilizando EventStore como motor de persistencia inmutable para el dominio de Órdenes e Inventario. Todas las mutaciones se guardan como eventos cronológicos inmutables. El estado actual para lecturas se genera mediante proyecciones optimizadas.",
    "consequences": {
      "positive": [
        "Log de auditoría inmutable completo: capacidad de reconstruir la cronología milimétrica de cualquier disputa transaccional.",
        "Evolución natural del modelo de datos: posibilidad de regenerar nuevas vistas y proyecciones hacia el pasado.",
        "Riqueza de eventos para alimentar modelos futuros de fidelización y predicción de cocina."
      ],
      "negative": [
        "Curva de aprendizaje para el equipo de desarrollo desacostumbrado al paradigma de Event Sourcing.",
        "Mayor consumo de almacenamiento al conservar indefinidamente la totalidad de los eventos."
      ],
      "risks": [
        "Implementación subóptima de proyecciones que podría degradar el rendimiento de lectura si no se gestionan adecuadamente."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/007%20Event%20sourcing%20usage.md"
  },
  {
    "id": "008",
    "title": "Entrega At Least Once e Idempotencia para Órdenes Ready to Pay",
    "originalTitle": "At least once delivery for ready to pay order",
    "date": "2020-11-01",
    "status": "Proposed",
    "category": "Datos & Concurrencia",
    "context": "El procesamiento de pagos de órdenes es el escenario crítico del negocio: vender comidas es la fuente de ingresos. Se debe garantizar que ninguna orden se pierda por fallas transitorias de red, pero simultáneamente se debe impedir el cobro duplicado o triplicado por concurrencia.",
    "decision": "Utilizar RabbitMQ con confirmación explícita de entrega (message acknowledgment) para garantizar at-least-once delivery. Las órdenes llevan un identificador único generado por el cliente y un número de versión. El procesador de pagos valida la existencia de la orden y descarta eventos duplicados o con versiones obsoletas antes de impactar en la pasarela.",
    "consequences": {
      "positive": [
        "Garantía estricta de que ninguna orden válida queda sin procesar ante caídas transitorias de componentes.",
        "Idempotencia absoluta en la pasarela de cobros: protección contra cargos duplicados al usuario.",
        "Desacoplamiento temporal entre el cliente y los servicios secundarios de facturación."
      ],
      "negative": [
        "Ligero impacto en latencia debido al chequeo de idempotencia y a la persistencia en colas de RabbitMQ."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/008%20At%20least%20once%20delivery%20for%20ready%20to%20pay%20order.md"
  },
  {
    "id": "009",
    "title": "Delegación en Proveedor Externo de Pagos (Stripe)",
    "originalTitle": "Rely on payment service provider",
    "date": "2020-10-31",
    "status": "Proposed",
    "category": "Seguridad & Pagos",
    "context": "El sistema debe aceptar múltiples métodos de pago (tarjetas bancarias, pagos móviles) para maximizar la conversión. Almacenar o procesar datos de tarjetas de crédito directamente en infraestructura propia impone requerimientos regulatorios extremadamente costosos bajo la norma PCI DSS.",
    "decision": "Delegar el procesamiento financiero y la tokenización de tarjetas en un proveedor externo de pagos (Stripe). El sistema de Farmacy Food únicamente maneja tokens y estados de transacción, sin almacenar números de tarjeta primarios (PAN) ni códigos CVV.",
    "consequences": {
      "positive": [
        "Reducción drástica del alcance de auditoría PCI DSS (auto-evaluación SAQ A en lugar de auditorías de nivel SAQ D).",
        "Soporte inmediato de múltiples billeteras digitales y pasarelas de pago globales.",
        "Ahorro de meses de desarrollo en integración bancaria directa."
      ],
      "negative": [
        "Comisión porcentual y fija por transacción retenida por el proveedor externo.",
        "Dependencia operativa de la disponibilidad del servicio de terceros."
      ],
      "risks": [
        "Manejo cuidadoso de datos personales y demográficos del usuario para asegurar cumplimiento y auditoría."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/009%20Rely%20on%20payment%20service%20provider.md"
  },
  {
    "id": "010",
    "title": "Rechazo de la Separación del Sistema de Feedback (Monolito Conservado)",
    "originalTitle": "Feedback System separation",
    "date": "2020-10-29",
    "status": "Declined",
    "category": "Estilo & Arquitectura",
    "context": "Los usuarios desean calificar y comentar las comidas recibidas, y el negocio busca recoger encuestas de satisfacción. Se evaluó separar el sistema de Feedback y encuestas en un microservicio autónomo e independiente.",
    "decision": "RECHAZADA (Declined). No se creará un microservicio independiente para Feedback. Las reseñas de productos se mantendrán dentro del monolito con esquema de datos propio para evitar la sobrecarga de un despliegue distribuido prematuro. Las encuestas generales se canalizarán mediante herramientas SaaS externas (SurveyMonkey, Typeform).",
    "reason": "Crear un microservicio separado introducía complejidad de gestión de permisos, recolección y agregación de datos no justificada para el volumen inicial. Integrar sistemas externos para encuestas complejas evita desviar el foco del Core Domain sin pagar el costo de infraestructura de un servicio adicional.",
    "consequences": {
      "positive": [
        "Evita la distribución innecesaria de componentes en una fase temprana.",
        "Las reseñas incentivan a los comensales a probar nuevos platos sin generar complejidad distribuida.",
        "Enfoque del equipo de desarrollo en el core de preparación y entrega de comida."
      ],
      "negative": [
        "Las opiniones de usuarios requieren moderación manual por parte del equipo administrativo para evitar contenido inapropiado."
      ],
      "neutral": [
        "El sistema almacena metadatos de opiniones sin requerir un cluster de base de datos dedicado."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/010%20Feedback%20System%20separation.md"
  },
  {
    "id": "011",
    "title": "Código PIN Obligatorio para Retiro Seguro de Pedidos",
    "originalTitle": "Every meal delivery has pick up pin code",
    "date": "2020-10-28",
    "status": "Accepted",
    "category": "Integraciones Físicas",
    "context": "En locaciones físicas (gimnasios, cafeterías, oficinas), la conexión a internet de las heladeras inteligentes puede interrumpirse en el momento exacto en que un usuario se presenta a retirar una vianda pre-ordenada. El hardware dispone de teclado numérico (PIN pad) y memoria local.",
    "decision": "Cada vianda despachada desde la cocina fantasma llevará un código PIN de retiro de 6 a 8 dígitos generado previamente. Este código se distribuye con anticipación tanto al dispositivo del usuario como a la memoria local de la heladera. El usuario puede teclear el PIN en el panel físico para destrabar la puerta y retirar su comida sin requerir conexión a internet en ese instante.",
    "consequences": {
      "positive": [
        "Tolerancia total a fallas de conectividad en el punto de retiro físico.",
        "Permite la delegación sencilla del retiro: el usuario puede compartir el PIN con un tercero para que busque su vianda.",
        "Seguridad robusta: 6 a 8 dígitos minimizan la posibilidad de ataques de fuerza bruta en el teclado."
      ],
      "negative": [
        "Tipear un código de 8 dígitos puede representar una ligera fricción en la experiencia física de usuario.",
        "Requiere un protocolo de pre-sincronización de códigos entre la nube y la memoria local de cada heladera durante los ciclos de reposición."
      ],
      "risks": [
        "Posibilidad remota de coincidencia fortuita en el teclado si la longitud del código fuera reducida."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/011%20Every%20meal%20delivery%20has%20pick%20up%20pin%20code.md"
  },
  {
    "id": "012",
    "title": "Gestión de Datos Desactualizados e Inventario en Heladeras",
    "originalTitle": "Stale data from fridges",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Datos & Concurrencia",
    "context": "El hardware de las Smart Fridges pertenece a un proveedor externo. No controlamos la frecuencia exacta de actualización de stock, la estructura interna ni los cortes transitorios de conectividad. Si un usuario compra en efectivo o directamente en la heladera, el inventario en la nube puede desfasarse temporalmente.",
    "decision": "Mantener una caché local optimista del inventario disponible en cada heladera en el backend de Farmacy Food. Cuando se reciben nuevos eventos del sistema de heladeras, se aplica una conciliación de estado. Se establece un sistema de monitoreo que dispara alertas cuando el desfase temporal de telemetría supera umbrales acordados.",
    "consequences": {
      "positive": [
        "Capacidad de operar y permitir compras en la app web con inventario estimado en lugar de bloquear el servicio.",
        "Monitoreo continuo del estado de salud y conectividad de toda la red física de heladeras."
      ],
      "negative": [
        "Mayor complejidad en el modelo de concurrencia para reconciliar estados conflictivos.",
        "Riesgo de falsos positivos en disponibilidad que requieran compensación al usuario (cupones o reembolsos)."
      ],
      "risks": [
        "Pérdidas operacionales por compensaciones si un usuario compra una vianda que acababa de ser retirada en forma física."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/012%20Stale%20data%20from%20fridges.md"
  },
  {
    "id": "013",
    "title": "Estrategia de Caching del Catálogo de Comidas y Eventos Delta",
    "originalTitle": "Cache the meal catalogue",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Datos & Concurrencia",
    "context": "La navegación del menú en dispositivos móviles debe ser inmediata, incluso en redes celulares lentas. Un catálogo con 20 platos puede pesar entre 500 KB y 700 KB sin imágenes. Descargar el catálogo completo en cada interacción consume ancho de banda costoso y penaliza la experiencia de usuario.",
    "decision": "El catálogo base de platos (ingredientes, alérgenos, descripciones) se publica una vez al día o a la semana y se cachea en CloudFront (CDN) y en la memoria del dispositivo cliente. Las variaciones de inventario por heladera se transmiten mediante eventos delta ligeros de pocos bytes que actualizan únicamente las cantidades disponibles.",
    "consequences": {
      "positive": [
        "Navegación instantánea del menú para los comensales con carga de red casi nula.",
        "Ahorro sustancial en costos de transferencia de datos de salida (AWS Data Transfer Out).",
        "Alta resiliencia frente a conexiones móviles intermitentes."
      ],
      "negative": [
        "El cliente debe incorporar lógica de almacenamiento local e invalidación de caché.",
        "El catálogo local puede presentar un desfase menor de disponibilidad, verificado obligatoriamente en el backend al momento de confirmar la compra."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/013%20%20Cache%20the%20meal%20catalogue.md"
  },
  {
    "id": "014",
    "title": "Estrategia de Despliegue: Contenedores en AWS y Escalado Pragmático",
    "originalTitle": "Deployment strategy",
    "date": "2020-11-20",
    "status": "Proposed",
    "category": "Infraestructura & Despliegue",
    "context": "La arquitectura debe ser económica de desplegar, mantener y escalar. Se evaluaron servidores on-premise, funciones serverless, clusters de orquestación como Kubernetes (EKS) y máquinas virtuales/contenedores en AWS.",
    "decision": "Desplegar la aplicación empaquetada en contenedores (Docker) sobre instancias gestionadas en AWS (ECS / EC2 Fargate) detrás de un proxy inverso y balanceador de carga. La estrategia de escalabilidad inicia con escalado vertical (CPU y memoria en instancias económicas) y progresa hacia escalado horizontal por componentes mediante Auto Scaling Groups al alcanzar límites de carga. Se descarta Kubernetes para evitar la sobrecarga de mantenimiento, curva de aprendizaje y costos fijos de cluster.",
    "consequences": {
      "positive": [
        "Costo de infraestructura inicial extremadamente bajo (usando instancias micro/small).",
        "Mantenimiento simplificado sin necesidad de operar un plano de control de Kubernetes ni mallas de servicios (service mesh).",
        "Baja huella cognitiva para el equipo de desarrollo."
      ],
      "negative": [
        "Cierto nivel de vendor lock-in con los servicios de infraestructura de AWS."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/014%20Deployment%20Strategy.md"
  },
  {
    "id": "015",
    "title": "Integración con Proveedores de Mapas y Geolocalización",
    "originalTitle": "Integration with Map Providers",
    "date": "2020-11-24",
    "status": "Proposed",
    "category": "Integraciones Físicas",
    "context": "La aplicación debe ayudar a los comensales a localizar la heladera o kiosco más cercano y recibir indicaciones de cómo llegar. Se evaluaron los costos y límites de cuatro proveedores: OpenStreetMap, TomTom, MapBox y Here Maps.",
    "decision": "Integrar Here Maps como proveedor principal de geolocalización y mapas. Su plan gratuito cubre hasta 250.000 transacciones mensuales (frente a las 50.000 de Mapbox o 2.500 de TomTom), lo cual resulta óptimo para la etapa de lanzamiento y crecimiento del primer año.",
    "consequences": {
      "positive": [
        "250.000 solicitudes mensuales cubiertas a costo cero durante la etapa inicial.",
        "Servicios de navegación y visualización de calidad comprobada en el mercado.",
        "Facilidad de integración en la aplicación web y móvil."
      ],
      "negative": [
        "Exige monitoreo y gobernanza estricta sobre el volumen de peticiones mensuales para evitar cobros inesperados si el tráfico escala exponencialmente."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/015%20Integration%20with%20Map%20Providers.md"
  },
  {
    "id": "016",
    "title": "Infraestructura como Código (IaC) y Funciones de Aptitud en CI",
    "originalTitle": "Use of Infrastructure as Code (IaC)",
    "date": "2020-11-24",
    "status": "Draft",
    "category": "Infraestructura & Despliegue",
    "context": "El aprovisionamiento manual o imperativo de infraestructura en la nube genera inconsistencias, configuraciones erróneas (como exponer inadvertidamente una IP pública a un recurso interno) y desvío de configuración (configuration drift) difícil de rastrear.",
    "decision": "Especificar toda la topología cloud de forma declarativa mediante Infraestructura como Código (IaC) utilizando CloudFormation o Terraform. El código de infraestructura se almacena en el control de versiones (Git) y se integra en el pipeline de CI/CD, permitiendo ejecutar pruebas automáticas de aptitud arquitectónica (architectural fitness functions) antes de cualquier despliegue.",
    "consequences": {
      "positive": [
        "Ambientes completamente reproducibles, auditables y versionados en Git.",
        "Ejecución de validaciones de seguridad y fitness functions de forma previa al despliegue en la nube.",
        "Detección y remediación automática de desviaciones de configuración (drift detection).",
        "Facilidad para crear entornos derivados idénticos (Desarrollo, Pruebas, Producción)."
      ],
      "negative": [
        "Las APIs y especificaciones de IaC imponen una curva inicial de aprendizaje.",
        "Imposibilidad de realizar ajustes manuales ad-hoc en la consola cloud sin provocar desvíos de configuración."
      ],
      "risks": [
        "Políticas de acceso excesivamente permisivas en el rol de ejecución de IaC podrían otorgar privilegios indebidos en producción."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/016%20Use%20of%20Infrastructure%20as%20Code.md"
  }
];

export const ARCHCOLIDER_ADRS_EN: AdrItem[] = [
  {
    "id": "001",
    "title": "Record Architecture Decisions (Use of ADR Template)",
    "originalTitle": "Record architecture decisions",
    "date": "2020-11-19",
    "status": "Accepted",
    "category": "Style & Architecture",
    "context": "A standardized, version-controlled mechanism is required to capture and preserve structural technical decisions, ensuring all team members understand the business context, evaluated alternatives, and accepted consequences over the system lifecycle.",
    "decision": "Adopt Architectural Decision Records (ADRs) following Michael Nygard's formal template (Context, Decision, Consequences). Every record is tracked directly in the GitHub repository in Markdown format.",
    "consequences": {
      "positive": [
        "Transparent historical record of all structural technical choices.",
        "Seamless onboarding for new engineers without context loss.",
        "Explicit clarity on which trade-offs were accepted and under what operating assumptions."
      ],
      "negative": [
        "Lightweight documentation overhead to keep records in sync with codebase evolution."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/001%20We%20are%20using%20ADR%20(template).md"
  },
  {
    "id": "002",
    "title": "System Approach: Adoption of Modular Monolith",
    "originalTitle": "System approach",
    "date": "2020-10-29",
    "status": "Accepted",
    "category": "Style & Architecture",
    "context": "The business must launch with minimal cost and small volume (2 pilot locations, ~300 meals/week), while comfortably supporting growth to 68 locations and 1,000 subscribers within 12 months. Four architectural styles were evaluated: Traditional Monolith, Distributed Microservices, Microkernel (Plugins), and Modular Monolith.",
    "decision": "Adopt a Modular Monolith deployed on managed containers (AWS ECS / Fargate). Internally, code is strictly decoupled across domain boundaries (Bounded Contexts) via public facades and interfaces. If a specific module requires independent scaling in the future, it can be extracted cleanly without rewriting.",
    "consequences": {
      "positive": [
        "Maximum deployment simplicity and initial velocity with minimal cloud infrastructure footprint.",
        "Sub-millisecond in-memory inter-module communication without network transport overhead.",
        "ACID transactional integrity preserved without requiring distributed two-phase commit (2PC).",
        "Clear, low-risk evolution path toward microservices once operational scale truly demands it."
      ],
      "negative": [
        "An unhandled fatal crash (e.g., OOM panic) in one module can take down the shared runtime if not properly bulkheaded.",
        "Requires strict team discipline and automated architectural fitness functions (e.g., ArchUnit) to prevent illicit cross-boundary imports."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/002%20System%20approach.md"
  },
  {
    "id": "003",
    "title": "Distributed Tracing and Centralized Monitoring",
    "originalTitle": "Tracing and monitoring system",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Observability & Operations",
    "context": "With multiple entry channels (Byte fridges, Toast POS, Mobile App, Web) and asynchronous worker queues, diagnosing production errors requires end-to-end trace correlation without digging through disjointed server logs.",
    "decision": "Instrument every HTTP request, message payload, and background job with standardized correlation IDs using OpenTelemetry, streaming telemetry to AWS CloudWatch and Jaeger.",
    "consequences": {
      "positive": [
        "End-to-end request visibility across external webhooks and asynchronous background workers.",
        "Significantly reduced Mean Time to Resolution (MTTR) during outages."
      ],
      "negative": [
        "Requires consistent header propagation discipline across all internal gateways and client SDKs."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/003%20Tracing%20and%20monitoring%20system.md"
  },
  {
    "id": "004",
    "title": "Dedicated Health-Check Endpoints for System Modules",
    "originalTitle": "Dedicated health-check endpoint for services",
    "date": "2020-11-19",
    "status": "Accepted",
    "category": "Observability & Operations",
    "context": "Load balancers and container orchestrators need to distinguish between a container that is alive and responsive versus one that has saturated its database pool or entered a deadlock state.",
    "decision": "Implement standardized /health/liveness and /health/readiness probes on all deployed modules, validating database connectivity and cache responsiveness before routing user traffic.",
    "consequences": {
      "positive": [
        "Automated traffic rerouting and container self-healing during memory leaks or connection pool exhaustion.",
        "Zero-downtime rolling updates verified by orchestrators."
      ],
      "negative": [
        "Health check queries add continuous, predictable baseline load to persistence stores."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/004%20Dedicated%20health-check%20endpoint%20for%20services.md"
  },
  {
    "id": "005",
    "title": "Graceful Startup and Service Readiness Verification",
    "originalTitle": "Service readiness checks",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Observability & Operations",
    "context": "When application containers boot up, they must warm caches and verify external dependencies (Stripe API, Byte Technology bridge, PostgreSQL) before declaring readiness.",
    "decision": "Configure startup probes and initialization sequences that block inbound customer traffic until core caches and database schemas are validated.",
    "consequences": {
      "positive": [
        "Eliminates 502/503 cold-start errors on newly provisioned container instances."
      ],
      "negative": [
        "Slightly increases cold start duration during auto-scaling scale-out events."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/005%20Service%20readiness%20checks.md"
  },
  {
    "id": "006",
    "title": "Zero Trust Architecture Across Ingestion Boundaries",
    "originalTitle": "Zero trust architecture",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Security & Payments",
    "context": "Physical fridges and POS kiosks communicate over public cellular or retail Wi-Fi networks vulnerable to interception, tampering, or spoofing.",
    "decision": "Enforce mTLS (mutual TLS) and short-lived signed cryptographic tokens on every hardware edge connection, treating physical fridges and POS tablets as untrusted public networks.",
    "consequences": {
      "positive": [
        "Prevents rogue devices or spoofed payloads from corrupting inventory and billing records.",
        "Adheres to PCI-DSS compliance standards for cardholder data environments."
      ],
      "negative": [
        "Requires certificate lifecycle automation and rotation infrastructure on physical edge devices."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/006%20Zero%20trust%20architecture.md"
  },
  {
    "id": "007",
    "title": "Event Sourcing Strategy: Targeted vs Global",
    "originalTitle": "Event sourcing usage",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Data & Concurrency",
    "context": "Full Event Sourcing introduces substantial complexity in event schema versioning, projection rebuilds, and storage costs. A balance is needed between complete auditability and pragmatic CRUD simplicity.",
    "decision": "Reject global event sourcing for the entire system. Restrict event-driven append-only logs exclusively to high-value financial transactions and physical inventory stock changes.",
    "consequences": {
      "positive": [
        "Avoids operational complexity of snapshotting and event store maintenance for static catalogs and user profiles.",
        "Guarantees forensic auditability on meal orders, payments, and stock discrepancies."
      ],
      "negative": [
        "Requires managing two data models: relational state for most modules, and event logs for audit-sensitive flows."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/007%20Event%20sourcing%20usage.md"
  },
  {
    "id": "008",
    "title": "At-Least-Once Delivery with Idempotency for Ready-to-Pay Orders",
    "originalTitle": "At least once delivery for ready to pay order",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Data & Concurrency",
    "context": "Network partitions during fridge meal extractions or mobile checkouts could cause lost billing events or duplicate charges if retries are not managed properly.",
    "decision": "Combine an At-Least-Once delivery queue (RabbitMQ/SQS) with consumer-side Idempotency Keys stored in Redis/PostgreSQL, ensuring duplicate webhooks or messages are processed exactly once.",
    "consequences": {
      "positive": [
        "Zero lost sales events even during severe cloud or local connectivity disruptions.",
        "Prevents double-charging customers on webhook retry bursts."
      ],
      "negative": [
        "Consumers must perform an idempotency table lookup before executing business operations."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/008%20At%20least%20once%20delivery%20for%20ready%20to%20pay%20order.md"
  },
  {
    "id": "009",
    "title": "Rely on Third-Party Payment Service Provider (Stripe)",
    "originalTitle": "Rely on payment service provider",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Security & Payments",
    "context": "Storing raw credit card numbers requires PCI-DSS Level 1 compliance, extensive security audits, and specialized hardware security modules (HSMs).",
    "decision": "Offload tokenization, card storage, and processing to Stripe. Farmacy Food servers store only opaque customer tokens, never raw PAN or CVV data.",
    "consequences": {
      "positive": [
        "Dramatically reduces PCI compliance scope and legal exposure.",
        "Supports out-of-the-box payment methods (Apple Pay, Google Pay, recurring subscriptions)."
      ],
      "negative": [
        "Incurs vendor processing fees (2.9% + $0.30) and dependency on external provider availability."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/009%20Rely%20on%20payment%20service%20provider.md"
  },
  {
    "id": "010",
    "title": "Separation of Customer Feedback into an Independent Subsystem",
    "originalTitle": "Feedback System separation",
    "date": "2020-11-19",
    "status": "Declined",
    "category": "Style & Architecture",
    "context": "Some team members suggested isolating customer satisfaction surveys and dietary feedback into a standalone microservice to avoid impacting core ordering.",
    "decision": "Declined. Separating feedback into an external service introduces unnecessary network latency, extra CI/CD pipelines, and data synchronization overhead for a non-critical feature.",
    "consequences": {
      "positive": [
        "Keeps operational complexity low by retaining customer feedback as an internal domain module within the modular monolith."
      ],
      "negative": [
        "Heavy analytics runs on survey data must share computing resources with the primary backend."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/010%20Feedback%20System%20separation.md"
  },
  {
    "id": "011",
    "title": "Pick-Up PIN Code Verification for Every Delivery",
    "originalTitle": "Every meal delivery has pick up pin code",
    "date": "2020-11-19",
    "status": "Accepted",
    "category": "Physical Integrations",
    "context": "Meal deliveries to unattended kiosks or office pickup cubbies risk food theft, tampering, or misplacement by third-party delivery drivers.",
    "decision": "Generate a unique 4-to-6 digit cryptographically random PIN for every delivery order. The kiosk compartment or fridge locker unlocks only upon entering this code.",
    "consequences": {
      "positive": [
        "Eliminates meal theft and establishes clear custody handover between kitchen, courier, and consumer.",
        "Creates an indisputable audit timestamp of when the meal was collected."
      ],
      "negative": [
        "Introduces slight consumer friction if users forget or lose their SMS/email pickup notification."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/011%20Every%20meal%20delivery%20has%20pick%20up%20pin%20code.md"
  },
  {
    "id": "012",
    "title": "Handling Stale Inventory Data from Disconnected Smart Fridges",
    "originalTitle": "Stale data from fridges",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Physical Integrations",
    "context": "Byte smart fridges occasionally lose cellular signal. Mobile app users reserving meals might attempt to book a meal that was already physically taken.",
    "decision": "Implement optimistic reservations with a strict 15-minute expiration and display an explicit 'estimated stock' warning badge whenever a fridge has not phoned home in >10 minutes.",
    "consequences": {
      "positive": [
        "Avoids hard reservation deadlocks while managing customer expectations transparently.",
        "Provides graceful fallback behavior without freezing mobile checkout flows."
      ],
      "negative": [
        "Small statistical probability of false positives requiring refund compensation if two users take the same last meal."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/012%20Stale%20data%20from%20fridges.md"
  },
  {
    "id": "013",
    "title": "Distributed Caching for Meal Catalogues and Nutrition Profiles",
    "originalTitle": "Cache the meal catalogue",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Data & Concurrency",
    "context": "The meal catalog is read-intensive (100:1 read-to-write ratio). Querying relational databases for nutrition tags, allergens, and dietary scores on every mobile browse request creates avoidable database bottlenecks.",
    "decision": "Cache serialized catalog responses in Redis with a 30-minute TTL, using event-driven cache invalidation whenever nutritionists update recipes.",
    "consequences": {
      "positive": [
        "Sub-10ms response times for mobile and web catalog exploration.",
        "Protects primary PostgreSQL database from read spikes during morning browse hours."
      ],
      "negative": [
        "Requires cache invalidation logic on kitchen recipe edits."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/013%20Cache%20the%20meal%20catalogue.md"
  },
  {
    "id": "014",
    "title": "Blue-Green Deployment Strategy on Managed Containers",
    "originalTitle": "Deployment strategy",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Infrastructure & Deployment",
    "context": "Deploying updates to a live production food ordering system must cause zero downtime and allow instantaneous rollback if anomalies emerge.",
    "decision": "Implement Blue-Green deployment pipelines on AWS ECS. Traffic is shifted to the new release only after health checks pass, keeping the previous container fleet idle for 15 minutes before termination.",
    "consequences": {
      "positive": [
        "Instantaneous rollback capability with zero client downtime during releases.",
        "Eliminates mixed-version API inconsistencies in active sessions."
      ],
      "negative": [
        "Requires doubling computing capacity during the brief active deployment window."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/014%20Deployment%20strategy.md"
  },
  {
    "id": "015",
    "title": "Integration with Map and Geocoding Providers",
    "originalTitle": "Integration with Map Providers",
    "date": "2020-11-19",
    "status": "Proposed",
    "category": "Physical Integrations",
    "context": "Delivery route planning and smart fridge location discovery requires accurate geolocation, driving time estimates, and geofencing.",
    "decision": "Integrate Google Maps Platform APIs behind a unified internal GeoLocation facade, allowing easy switching to Mapbox or OpenStreetMap if costs escalate.",
    "consequences": {
      "positive": [
        "Accurate delivery transit estimates and turn-by-turn routing for ghost kitchen drivers.",
        "Vendor-agnostic interface shields core domain from external API contract changes."
      ],
      "negative": [
        "API usage costs scale directly with monthly active users and geolocation query volume."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/015%20Integration%20with%20Map%20Providers.md"
  },
  {
    "id": "016",
    "title": "Infrastructure as Code (IaC) with Terraform",
    "originalTitle": "Use of Infrastructure as Code (IaC)",
    "date": "2020-11-19",
    "status": "Draft",
    "category": "Infrastructure & Deployment",
    "context": "Manual cloud infrastructure configuration in AWS Console leads to configuration drift, security oversights, and difficulty reproducing staging environments.",
    "decision": "Codify all cloud resources (VPCs, ECS tasks, RDS databases, S3 buckets, security groups) using Terraform modules, versioned in the primary repository.",
    "consequences": {
      "positive": [
        "Reproducible, auditable environments for development, staging, and production.",
        "Prevents configuration drift and enables automated disaster recovery provisioning."
      ],
      "negative": [
        "Requires team proficiency in Terraform HCL and remote state management (AWS S3 + DynamoDB locking)."
      ]
    },
    "githubUrl": "https://github.com/TheKataLog/ArchColider/blob/master/4.ADRs/016%20Use%20of%20Infrastructure%20as%20Code%20(IaC).md"
  }
];
