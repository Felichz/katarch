export interface KeyTerm {
  term: string;
  explanation: string;
}

export interface MatrixCellDetail {
  featureId: string;
  featureName: string;
  featureIcon: string;
  styleId: string;
  styleName: string;
  styleIcon: string;
  rating: "++" | "+" | "O" | "-" | "--";
  ratingLabel: string;
  badgeClasses: string;
  headline: string;
  coreProblem: string;
  keyTerms: KeyTerm[];
  farmacyExample: string;
  architecturalLesson: string;
}

export const matrixDeepDives: Record<string, MatrixCellDetail> = {
  // ==========================================
  // 1. FACILIDAD DE DESPLIEGUE
  // ==========================================
  "despliegue-traditional": {
    featureId: "despliegue",
    featureName: "Facilidad de Despliegue",
    featureIcon: "🚀",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Un solo pipeline, un solo binario y despliegue todo-o-nada",
    coreProblem: "En un monolito tradicional no hay orquestación de red ni desincronización de versiones en producción. La compilación genera un único artefacto (.jar, binario Go o contenedor Docker). El despliegue consiste en reemplazar el artefacto antiguo por el nuevo en los servidores.",
    keyTerms: [
      {
        term: "Artefacto Único (Single Deployable Unit)",
        explanation: "Empaquetar todo el sistema (backend, lógica, dependencias) en un archivo ejecutable autocontenido, eliminando la necesidad de coordinar despliegues entre servicios."
      },
      {
        term: "Rollback Atómico",
        explanation: "Si la nueva versión falla en producción, volver a la versión anterior requiere simplemente restaurar la imagen o binario previo, sin lidiar con servicios en versiones mixtas incompatibles."
      }
    ],
    farmacyExample: "El equipo compila una única imagen Docker y la publica en un servidor EC2. En 2 minutos todo el sistema de Farmacy Food (pedidos, catálogo y facturación) está actualizado.",
    architecturalLesson: "Si tenés un equipo pequeño o estás en fase de validación (Día 1), la simplicidad de un único pipeline supera ampliamente la flexibilidad de desplegar componentes por separado."
  },
  "despliegue-microservices": {
    featureId: "despliegue",
    featureName: "Facilidad de Despliegue",
    featureIcon: "🚀",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "-",
    ratingLabel: "Desfavorable",
    badgeClasses: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    headline: "El desafío de coordinar múltiples releases y contratos de red",
    coreProblem: "En teoría cada microservicio se despliega de forma independiente. En la práctica, los servicios dependen unos de otros. Cuando un cambio requiere actualizar el servicio de Órdenes y el de Pagos a la vez, coordinar los pipelines, mantener retrocompatibilidad y gestionar Kubernetes añade una sobrecarga operacional colosal.",
    keyTerms: [
      {
        term: "Contrato de API (API Contract)",
        explanation: "La interfaz pública acordada (endpoints REST, schemas Protobuf) entre servicios. Un cambio incompatible (breaking change) puede derribar a los consumidores si no se versiona con extremo cuidado."
      },
      {
        term: "Orquestación de Contenedores (Kubernetes / Helm)",
        explanation: "Plataformas para gestionar el ciclo de vida de decenas de pods. Requiere dominar ingress controllers, service mesh, health checks y secretos, exigiendo ingenieros DevOps dedicados."
      }
    ],
    farmacyExample: "Myagis-Forest necesitó configurar manifiestos de Kubernetes para 8 microservicios distintos, con ingress y pipelines individuales, elevando drásticamente el costo de mantenimiento para solo dos heladeras.",
    architecturalLesson: "No adoptes microservicios para 'hacer despliegues más rápidos' a menos que tengas múltiples equipos autónomos que realmente se bloqueen entre sí en un único repositorio."
  },
  "despliegue-microkernel": {
    featureId: "despliegue",
    featureName: "Facilidad de Despliegue",
    featureIcon: "🚀",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "-",
    ratingLabel: "Desfavorable",
    badgeClasses: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    headline: "Gestión de dependencias de plugins y compatibilidad en tiempo de carga",
    coreProblem: "Aunque el núcleo central es estable, los plugins suelen tener ciclos de vida y dependencias de librerías heterogéneas. Desplegar un plugin sin reiniciar el núcleo (hot-plugging) es notoriamente complejo de implementar de forma robusta en la mayoría de runtimes.",
    keyTerms: [
      {
        term: "Hot-Plugging (Carga dinámica)",
        explanation: "Capacidad de insertar o actualizar un plugin en un sistema en ejecución sin reiniciar el proceso. Si una nueva versión del plugin tiene fugas de memoria o incompatibilidades, desestabiliza al núcleo."
      },
      {
        term: "API de Registro de Plugins (Plugin Registry)",
        explanation: "Mecanismo central que valida versiones, permisos y dependencias de cada extensión antes de permitirle registrar listeners o rutas en el núcleo."
      }
    ],
    farmacyExample: "Si se crea un plugin para un nuevo proveedor de heladeras inteligentes, hay que verificar que use la misma versión de runtime que el núcleo para no provocar errores de classpath o colisiones de librerías.",
    architecturalLesson: "El microkernel brilla cuando los plugins los desarrollan usuarios finales o clientes (como extensiones de VS Code), pero en sistemas web internos suele añadir fricción innecesaria al pipeline."
  },
  "despliegue-modular": {
    featureId: "despliegue",
    featureName: "Facilidad de Despliegue",
    featureIcon: "🚀",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Arquitectura limpia por dentro, artefacto único por fuera",
    coreProblem: "Combina lo mejor de dos mundos: durante el desarrollo, cada módulo está estrictamente encapsulado con sus límites de dominio (Bounded Contexts). Al momento de construir (build), todo se empaqueta en una sola unidad ejecutable, eliminando cualquier complejidad de orquestación de red.",
    keyTerms: [
      {
        term: "Empaquetado Atómico",
        explanation: "Construir un único artefacto que contiene módulos lógicos aislados por carpetas, módulos de lenguaje o proyectos internos (ej: Gradle multi-project, monorepo npm o Go workspaces)."
      },
      {
        term: "Despliegue Cero-Fricción",
        explanation: "Un único comando de despliegue actualiza todo el sistema de manera coherente, garantizando que todos los módulos corren con versiones perfectamente sincronizadas."
      }
    ],
    farmacyExample: "ArchColider estructuró módulos bien definidos para Pedidos, Inventario y Usuarios, pero los desplegó como un solo proceso en AWS EC2, permitiendo a 4 desarrolladores operar sin equipo de DevOps.",
    architecturalLesson: "La modularidad es una propiedad del código y del diseño lógico; la distribución física es un costo operacional. Mantené la modularidad lógica sin pagar el costo de la distribución física hasta que sea indispensable."
  },

  // ==========================================
  // 2. DISPONIBILIDAD
  // ==========================================
  "disponibilidad-traditional": {
    featureId: "disponibilidad",
    featureName: "Disponibilidad",
    featureIcon: "🛡️",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "-",
    ratingLabel: "Desfavorable",
    badgeClasses: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    headline: "Punto único de fallo: un error en un módulo secundario tira toda la aplicación",
    coreProblem: "Todos los componentes comparten el mismo espacio de memoria y el mismo pool de hilos de ejecución. Si una funcionalidad no crítica sufre una fuga de memoria (OOM) o entra en un bucle infinito, el sistema operativo mata el proceso completo, interrumpiendo todas las operaciones del negocio.",
    keyTerms: [
      {
        term: "Out of Memory (OOM)",
        explanation: "Falla catastrófica cuando la aplicación consume toda la memoria RAM disponible, forzando al sistema operativo o al runtime (JVM/Node) a terminar el proceso inmediatamente."
      },
      {
        term: "Blast Radius (Radio de Impacto)",
        explanation: "El alcance del daño cuando ocurre una falla. En un monolito plano, el radio de impacto de cualquier bug no capturado es el 100% de la plataforma."
      }
    ],
    farmacyExample: "Si un cliente genera un reporte analítico pesado con miles de filas y satura la memoria del servidor, el sistema entero colapsa y los usuarios en la calle no pueden abrir las heladeras para almorzar.",
    architecturalLesson: "En un monolito tradicional se debe invertir fuertemente en límites de recursos (timeouts estrictos, límites de paginación y aislamiento de hilos) para contener el radio de impacto de las fallas."
  },
  "disponibilidad-microservices": {
    featureId: "disponibilidad",
    featureName: "Disponibilidad",
    featureIcon: "🛡️",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Aislamiento de fallas por compartimentos estancos (Bulkheading)",
    coreProblem: "Al ejecutarse cada servicio en su propio contenedor y máquina virtual, los fallos quedan contenidos en el proceso que los originó. Si un servicio se cae, los demás siguen atendiendo peticiones siempre que no haya dependencias síncronas bloqueantes.",
    keyTerms: [
      {
        term: "Bulkheading (Mamparas de contención)",
        explanation: "Patrón de resiliencia inspirado en los mamparos estancos de los barcos: si una sección se inunda, el resto del barco sigue a flote. Si el servicio de encuestas muere, el de pagos sigue activo."
      },
      {
        term: "Circuit Breaker (Interruptor de circuito)",
        explanation: "Patrón que detecta fallos repetidos en un servicio remoto y corta temporalmente las llamadas hacia él, respondiendo con un valor por defecto para evitar agotar hilos y recursos."
      }
    ],
    farmacyExample: "El microservicio de Fidelización y Encuestas colapsa por una mala consulta SQL. El microservicio de Inventario y el de Integración con Byte Technology siguen online, permitiendo despachar comidas con total normalidad.",
    architecturalLesson: "El aislamiento de fallas solo funciona si la comunicación es asíncrona o si se implementan Circuit Breakers. Si el servicio A llama síncronamente al B y el B al C, la falla se propaga en cascada."
  },
  "disponibilidad-microkernel": {
    featureId: "disponibilidad",
    featureName: "Disponibilidad",
    featureIcon: "🛡️",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Núcleo protegido contra fallos de plugins externos",
    coreProblem: "El diseño separa la infraestructura crítica (núcleo) de las extensiones (plugins). Un buen diseño de microkernel envuelve la ejecución de los plugins con bloques de captura de excepciones e interceptores, evitando que un error en una extensión derribe el flujo principal.",
    keyTerms: [
      {
        term: "Defensive Sandboxing",
        explanation: "Aislar la ejecución de código externo o secundario para que no pueda corromper el estado global del sistema ni agotar recursos críticos sin control."
      },
      {
        term: "Fallback Graceful",
        explanation: "Capacidad del sistema de degradar una funcionalidad de forma elegante cuando un plugin no responde, permitiendo continuar la operación principal."
      }
    ],
    farmacyExample: "Si el plugin para enviar notificaciones push a través de Twilio falla con un error de timeout, el núcleo del microkernel registra el fallo y completa la venta del plato sin bloquear al cliente.",
    architecturalLesson: "La disponibilidad en microkernel depende de qué tan defensivo sea el contrato del núcleo. Si un plugin comparte memoria sin intermediación y sufre un panic, derriba al host."
  },
  "disponibilidad-modular": {
    featureId: "disponibilidad",
    featureName: "Disponibilidad",
    featureIcon: "🛡️",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "-",
    ratingLabel: "Desfavorable",
    badgeClasses: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    headline: "Límites lógicos fuertes, pero el mismo espacio de memoria físico",
    coreProblem: "El monolito modular resuelve el acoplamiento del código, pero no el aislamiento físico de recursos. Todos los módulos siguen corriendo bajo el mismo proceso del sistema operativo. Si el módulo de reportes satura la memoria o bloquea el event loop, todo el monolito modular sufre.",
    keyTerms: [
      {
        term: "Aislamiento Lógico vs. Físico",
        explanation: "Aislamiento lógico significa que el compilador impide acceder a clases privadas de otro módulo. Aislamiento físico significa procesos y memoria independientes en el sistema operativo."
      },
      {
        term: "Degradación por Concurrencia",
        explanation: "Cuando un módulo satura el pool de conexiones de base de datos compartido o los hilos de CPU, afectando el rendimiento de módulos completamente no relacionados."
      }
    ],
    farmacyExample: "ArchColider asumió este riesgo conscientemente: para 68 locaciones y 1.000 clientes, el tráfico es tan bajo que la probabilidad de saturar el proceso es mínima, justificando no pagar el sobrecosto de microservicios.",
    architecturalLesson: "Un monolito modular asume el riesgo de disponibilidad física a cambio de extrema simplicidad operativa. Cuando un módulo demuestre requerir alta disponibilidad independiente, se extrae a microservicio."
  },

  // ==========================================
  // 3. AUTONOMÍA DE EQUIPOS
  // ==========================================
  "autonomia-traditional": {
    featureId: "autonomia",
    featureName: "Autonomía de Equipos",
    featureIcon: "👥",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "--",
    ratingLabel: "Muy desfavorable",
    badgeClasses: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/60 dark:border-red-900/60",
    headline: "Conflictos de merge constantes, bases compartidas y trenes de release",
    coreProblem: "Cuando 30 desarrolladores tocan las mismas carpetas, las mismas tablas en la base de datos y la misma rama principal, se generan cuellos de botella humanos gigantescos. Nadie puede desplegar sin pedir permiso a los demás y un cambio en una entidad rompe el código de otro equipo.",
    keyTerms: [
      {
        term: "Ley de Conway",
        explanation: "'Las organizaciones que diseñan sistemas están limitadas a producir diseños que son copias de las estructuras de comunicación de dichas organizaciones.' Equipos acoplados generan código acoplado."
      },
      {
        term: "Release Train (Tren de Despliegue)",
        explanation: "Tener que esperar a que todos los equipos terminen sus tareas para desplegar todo junto cada dos semanas. Si un equipo tiene un bug, el tren no sale y bloquea a todos."
      }
    ],
    farmacyExample: "Si el equipo de Marketing quiere cambiar el esquema de suscripciones mientras el equipo de Operaciones modifica la tabla de stock, ambos chocan en migraciones SQL conflictivas de la misma base de datos.",
    architecturalLesson: "El monolito tradicional es inviable con más de 2 o 3 equipos trabajando en simultáneo. El problema no es tecnológico, es de escala organizacional."
  },
  "autonomia-microservices": {
    featureId: "autonomia",
    featureName: "Autonomía de Equipos",
    featureIcon: "👥",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Regla de las dos pizzas: cada equipo es dueño de su ciclo de vida",
    coreProblem: "Es la principal razón legítima para adoptar microservicios. Cada equipo tiene su propio repositorio, su propia base de datos y despliega a producción cuando quiere, sin pedir permiso a nadie, siempre que respete el contrato de sus APIs públicas.",
    keyTerms: [
      {
        term: "Regla de las Dos Pizzas (Amazon)",
        explanation: "Un equipo no debe ser más grande de lo que se puede alimentar con dos pizzas (~5 a 8 personas). Equipos pequeños y enfocados en un único microservicio se mueven mucho más rápido."
      },
      {
        term: "You Build It, You Run It",
        explanation: "Filosofía donde el mismo equipo que escribe el código del microservicio se encarga de monitorearlo, desplegarlo y solucionar sus incidentes en producción."
      }
    ],
    farmacyExample: "Un equipo enfocado exclusivamente en la integración con las terminales de Toast POS puede desplegar 5 veces al día sin consultar al equipo que desarrolla la aplicación móvil para clientes.",
    architecturalLesson: "Los microservicios son una solución a un problema de escala de personas, no de escala de peticiones por segundo. Si tenés un solo equipo de 4 personas, los microservicios restan autonomía en lugar de sumarla."
  },
  "autonomia-microkernel": {
    featureId: "autonomia",
    featureName: "Autonomía de Equipos",
    featureIcon: "👥",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Extensibilidad por terceros sin acceso al código fuente central",
    coreProblem: "Permite que equipos satélites o incluso proveedores externos creen nuevas funcionalidades de forma completamente aislada. No necesitan tocar el repositorio del núcleo ni entender cómo funciona por dentro; solo deben implementar las interfaces públicas del plugin.",
    keyTerms: [
      {
        term: "Contrato de Extensión (SPI - Service Provider Interface)",
        explanation: "Conjunto de interfaces que define el núcleo. Cualquier clase que implemente esas interfaces es reconocida y ejecutada automáticamente como plugin."
      },
      {
        term: "Desacople de Proveedor",
        explanation: "Capacidad de delegar la integración de un nuevo hardware a un equipo externo sin darle acceso a la propiedad intelectual del core del negocio."
      }
    ],
    farmacyExample: "Farmacy Food podría contratar a una agencia externa para que desarrolle el plugin de integración de un nuevo modelo de heladera sin darle acceso al código de facturación ni a las recetas de cocina.",
    architecturalLesson: "Excelente cuando se necesita un ecosistema abierto de extensiones o cuando diferentes equipos trabajan en características completamente ortogonales."
  },
  "autonomia-modular": {
    featureId: "autonomia",
    featureName: "Autonomía de Equipos",
    featureIcon: "👥",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Propiedad clara por dominio de código, pero despliegue coordinado",
    coreProblem: "Mediante Domain-Driven Design (DDD), cada módulo tiene un equipo responsable (code ownership claro). Las herramientas de análisis estático (ej: ArchUnit) impiden que un desarrollador de un módulo modifique el código interno de otro. Sin embargo, la salida a producción final sigue estando unificada.",
    keyTerms: [
      {
        term: "Code Ownership (Propiedad del Código)",
        explanation: "Práctica de asignar un equipo responsable de la calidad, contratos y evolución de un Bounded Context específico dentro del monorepo."
      },
      {
        term: "Arquitectura Enforced por Compilador",
        explanation: "Uso de visibilidad de paquetes o herramientas de análisis estático que fallan el build si alguien intenta importar una clase privada de otro módulo sin pasar por su API pública."
      }
    ],
    farmacyExample: "En ArchColider, un desarrollador podía trabajar en el algoritmo de descuentos sin preocuparse por romper el módulo de cocina, porque las interfaces públicas protegían los límites del código.",
    architecturalLesson: "Ideal para organizaciones medianas (de 1 a 4 equipos): otorga el 80% de la autonomía de los microservicios sin pagar el costo de infraestructura distribuida."
  },

  // ==========================================
  // 4. TRAZABILIDAD DE ERRORES
  // ==========================================
  "trazabilidad-traditional": {
    featureId: "trazabilidad",
    featureName: "Trazabilidad de Errores",
    featureIcon: "🔍",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Un stack trace completo desde el controller hasta la base de datos",
    coreProblem: "Cuando ocurre una excepción, el runtime imprime el stack trace continuo de extremo a extremo en un único archivo de log. Podés conectar un debugger local en tu máquina (en VS Code o IntelliJ) y poner breakpoints en cualquier punto del flujo de ejecución para ver el estado de las variables.",
    keyTerms: [
      {
        term: "Stack Trace Continuo",
        explanation: "Registro secuencial exacto de qué función llamó a cuál, con nombres de archivo y números de línea, sin rupturas por saltos de red o hilos asíncronos."
      },
      {
        term: "Local Debugging",
        explanation: "Poder reproducir cualquier bug en local levantando una sola aplicación, sin necesidad de correr contenedores de soporte ni emular servicios remotos."
      }
    ],
    farmacyExample: "Si falla el cálculo del precio de una ensalada, el log muestra exactamente: OrderController.checkout() -> PricingService.calculate() -> TaxRepository.find() en la línea 42 del mismo archivo.",
    architecturalLesson: "La facilidad de depurar en local acelera enormemente la velocidad de desarrollo en las etapas iniciales de un producto. Valorala antes de fragmentar el sistema."
  },
  "trazabilidad-microservices": {
    featureId: "trazabilidad",
    featureName: "Trazabilidad de Errores",
    featureIcon: "🔍",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "-",
    ratingLabel: "Desfavorable",
    badgeClasses: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    headline: "Pistas rotas entre nodos: la pesadilla de correlacionar logs dispersos",
    coreProblem: "Una sola petición del usuario cruza 5 servicios diferentes a través de la red y colas de mensajes. Si el servicio 4 falla, el stack trace del servicio 1 solo dice 'HTTP 500 Bad Gateway'. Sin una infraestructura avanzada de observabilidad distribuida, encontrar la causa raíz es como buscar una aguja en un pajar.",
    keyTerms: [
      {
        term: "Correlation ID / Trace ID",
        explanation: "Un identificador único (UUID) generado en el punto de entrada que debe propagarse manualmente en las cabeceras HTTP de cada llamada entre servicios para vincular sus logs."
      },
      {
        term: "Distributed Tracing (OpenTelemetry / Jaeger)",
        explanation: "Herramienta que dibuja una línea de tiempo mostrando cuánto tardó cada microservicio individual en procesar su parte de la solicitud y dónde ocurrió el error."
      }
    ],
    farmacyExample: "El kiosco no puede cobrar. Hay que buscar en los logs del Gateway, luego en el servicio de Kioscos, luego en el servicio de Pagos y luego en el de Contabilidad para descubrir que falló un timeout de red intermedio.",
    architecturalLesson: "Si vas a implementar microservicios, el tracing distribuido y la agregación de logs centralizada no son opcionales: son el costo de entrada obligatorio desde el Día 1."
  },
  "trazabilidad-microkernel": {
    featureId: "trazabilidad",
    featureName: "Trazabilidad de Errores",
    featureIcon: "🔍",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Interceptores centralizados que delimitan la responsabilidad del plugin",
    coreProblem: "Todo se ejecuta en memoria en un solo proceso. Además, como toda interacción entre el núcleo y los plugins pasa por interfaces conocidas, el núcleo puede instrumentar automáticamente cada invocación con métricas de tiempo y captura de errores estructurada.",
    keyTerms: [
      {
        term: "Interceptor Pattern",
        explanation: "Capa que envuelve la ejecución de un plugin para medir su tiempo, auditar sus parámetros de entrada/salida y capturar cualquier excepción que escape."
      },
      {
        term: "Atribución de Fallas",
        explanation: "Capacidad de saber inmediatamente si el fallo se originó en la lógica central del negocio o en una extensión particular mediante el prefijo del stack trace."
      }
    ],
    farmacyExample: "El interceptor del core detecta que el plugin de la heladera Byte arrojó una excepción al procesar un tag RFID desconocido, registrando el nombre del plugin y los datos del sensor en un solo log claro.",
    architecturalLesson: "Aprovechá la centralización del núcleo para colocar observabilidad estandarizada que ningún plugin pueda saltear por omisión."
  },
  "trazabilidad-modular": {
    featureId: "trazabilidad",
    featureName: "Trazabilidad de Errores",
    featureIcon: "🔍",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "O",
    ratingLabel: "Aceptable",
    badgeClasses: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    headline: "Fácil depuración en local, pero con indirección por eventos internos",
    coreProblem: "La depuración sigue siendo en un solo proceso con debugger local. Sin embargo, para mantener los módulos desacoplados, la comunicación entre ellos a menudo utiliza eventos en memoria (Domain Events) o fachadas. Esto rompe la continuidad visual del stack trace lineal, obligando a rastrear qué handler procesó el evento.",
    keyTerms: [
      {
        term: "Eventos de Dominio en Memoria (In-Memory Event Bus)",
        explanation: "Publicar un evento que escuchan otros módulos en el mismo hilo o en hilos de fondo. Desacopla el código, pero hace que la llamada no aparezca de forma directa en el call stack."
      },
      {
        term: "Fachada de Módulo (Module Facade)",
        explanation: "Punto de entrada único que expone las operaciones públicas de un módulo, ocultando su implementación interna para que los logs sean limpios."
      }
    ],
    farmacyExample: "Cuando se retira una comida, el módulo de Heladeras emite el evento MealTakenEvent. El módulo de Inventario lo procesa de forma asíncrona en memoria; si falla, el stack trace inicia en el listener del evento.",
    architecturalLesson: "En un monolito modular, utilizá convenciones claras de nombres en tus eventos y middlewares que pasen el contexto de ejecución para no perder la pista del flujo."
  },

  // ==========================================
  // 5. RENDIMIENTO (LATENCIA)
  // ==========================================
  "rendimiento-traditional": {
    featureId: "rendimiento",
    featureName: "Rendimiento (Latencia)",
    featureIcon: "⚡",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Llamadas a funciones en memoria a velocidad de CPU (nanosegundos)",
    coreProblem: "En un monolito, la comunicación entre clases ocurre mediante saltos de punteros en la memoria RAM (nanosegundos). No existe latencia de socket TCP, no hay handshake de red ni serialización de objetos a JSON o Protobuf. Las consultas a la base de datos se ejecutan en transacciones locales directas.",
    keyTerms: [
      {
        term: "In-Memory Method Call",
        explanation: "Invocar una función pasando referencias de memoria. La latencia es de ~1 a 10 nanosegundos, virtualmente imperceptible comparada con los ~2 a 50 milisegundos de una llamada de red."
      },
      {
        term: "Zero-Serialization",
        explanation: "Los objetos de dominio se pasan directamente sin gastar ciclos de CPU en convertir objetos a texto (JSON) y luego parsearlos de nuevo."
      }
    ],
    farmacyExample: "Cuando un kiosco consulta si hay stock de una ensalada, el controlador invoca directamente al servicio de inventario en el mismo proceso y responde al usuario en 15 milisegundos.",
    architecturalLesson: "La red es el componente más lento y propenso a fallas de cualquier arquitectura. Eliminar saltos de red es la forma más barata de garantizar baja latencia."
  },
  "rendimiento-microservices": {
    featureId: "rendimiento",
    featureName: "Rendimiento (Latencia)",
    featureIcon: "⚡",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "La penalización del salto de red y el problema de los servicios conversadores",
    coreProblem: "Cada vez que un microservicio necesita datos de otro, debe abrir una conexión TCP/HTTP, serializar el payload, viajar por la red y deserializar la respuesta. Si para mostrar una pantalla la app debe consultar 6 microservicios en cadena, la latencia acumulada se dispara (latency tail / p99).",
    keyTerms: [
      {
        term: "Chatty Services (Servicios Conversadores)",
        explanation: "Antipatrón donde dos servicios intercambian decenas de llamadas pequeñas para completar una sola operación, multiplicando la latencia de red y congestionando los enlaces."
      },
      {
        term: "Tail Latency (Latencia de Cola p99)",
        explanation: "El tiempo de respuesta que experimenta el 1% de los usuarios más lentos. Si una petición depende de 10 servicios con p99 de 100ms, la probabilidad de que la petición total sea lenta aumenta dramáticamente."
      }
    ],
    farmacyExample: "Para autorizar una compra en una heladera, el Gateway llama al servicio de Clientes, este llama al de Membresías, este al de Descuentos y este a Stripe. La acumulación de latencia hace que la puerta tarde 3 segundos en destrabar.",
    architecturalLesson: "Para mitigar la latencia en microservicios se debe recurrir a cachés agresivas (Redis), replicación de datos de lectura y llamadas paralelas o patrones BFF (Backend for Frontend)."
  },
  "rendimiento-microkernel": {
    featureId: "rendimiento",
    featureName: "Rendimiento (Latencia)",
    featureIcon: "⚡",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Invocación directa con pequeña sobrecarga por interfaces dinámicas",
    coreProblem: "La ejecución se produce dentro del mismo proceso del host, lo que mantiene el rendimiento muy cercano al monolito tradicional. La única sobrecarga medible proviene de las capas de indirección dinámica (reflexión, despacho virtual o proxies de interceptación).",
    keyTerms: [
      {
        term: "Dynamic Dispatch (Despacho dinámico)",
        explanation: "Mecanismo por el cual el runtime determina en tiempo de ejecución qué método de qué plugin invocar. Agrega una fracción insignificante de microsegundos comparado con llamadas estáticas."
      },
      {
        term: "Memory Overhead",
        explanation: "Cada plugin cargado en el runtime consume espacio en memoria, pero no añade latencia de comunicación."
      }
    ],
    farmacyExample: "El procesamiento del sensor RFID en el plugin de Byte Technology corre a velocidad nativa en memoria, evaluando la sustracción del plato en menos de 5 microsegundos.",
    architecturalLesson: "Si necesitás alta extensibilidad con rendimiento de tiempo real en la misma máquina física, el microkernel es mucho más eficiente que dividir el sistema en microservicios por red."
  },
  "rendimiento-modular": {
    featureId: "rendimiento",
    featureName: "Rendimiento (Latencia)",
    featureIcon: "⚡",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Máxima velocidad: interfaces en memoria fuertemente tipadas",
    coreProblem: "Al igual que el monolito tradicional, todas las llamadas entre módulos ocurren en la memoria de la máquina. La presencia de Bounded Contexts y contratos de fachada no introduce penalizaciones de red ni serializaciones: el compilador resuelve las referencias directamente.",
    keyTerms: [
      {
        term: "Llamada por Fachada en Memoria",
        explanation: "Invocar orderModuleFacade.createOrder(cmd) como una llamada normal a un método tipado de TypeScript, C# o Java, ejecutada a la velocidad nativa del hardware."
      },
      {
        term: "Latencia Sub-milisegundo",
        explanation: "Capacidad de orquestar operaciones complejas entre 4 módulos de negocio en menos de 1 milisegundo antes de interactuar con la base de datos."
      }
    ],
    farmacyExample: "ArchColider logra tiempos de respuesta de menos de 80ms en su API web porque el filtrado de alérgenos, el stock en tiempo real y la validación del usuario se ejecutan en un solo ciclo de CPU sin saltos de red.",
    architecturalLesson: "El monolito modular ofrece la disciplina de arquitectura de los microservicios sin pagar el 'impuesto de red' en cada interacción de negocio."
  },

  // ==========================================
  // 6. MODIFICABILIDAD
  // ==========================================
  "modificabilidad-traditional": {
    featureId: "modificabilidad",
    featureName: "Modificabilidad",
    featureIcon: "🛠️",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "O",
    ratingLabel: "Aceptable",
    badgeClasses: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    headline: "La erosión arquitectónica hacia la 'Gran Bola de Lodo' (Big Ball of Mud)",
    coreProblem: "Al inicio es fácil modificar código porque todo está a mano. Pero al no haber barreras arquitectónicas enforced por herramientas, los desarrolladores bajo presión empiezan a importar clases privadas de otros módulos o a hacer JOINs directos entre tablas no relacionadas. Con el tiempo, tocar una línea rompe tres funcionalidades distantes.",
    keyTerms: [
      {
        term: "Big Ball of Mud (Gran Bola de Lodo)",
        explanation: "Patrón arquitectónico informal donde el sistema carece de estructura reconocible: todo depende de todo y es imposible predecir qué efectos colaterales tendrá un cambio."
      },
      {
        term: "Acoplamiento Espurio",
        explanation: "Dependencias creadas por comodidad rápida (ej: usar el modelo de base de datos de Facturación dentro de la vista del Catálogo de platos)."
      }
    ],
    farmacyExample: "Un desarrollador necesita mostrar el nombre del cliente en el ticket de la cocina y hace una consulta directa a la tabla de Usuarios desde el módulo de Cocina, acoplando permanentemente ambos dominios.",
    architecturalLesson: "La modificabilidad en un monolito plano se degrada con el tiempo a menos que el equipo tenga una disciplina férrea de revisiones de código y arquitectura."
  },
  "modificabilidad-microservices": {
    featureId: "modificabilidad",
    featureName: "Modificabilidad",
    featureIcon: "🛠️",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Libertad para reescribir, cambiar tecnologías y experimentar sin riesgo",
    coreProblem: "Cada microservicio es una 'caja negra' conectada por APIs. Si necesitás cambiar la base de datos de PostgreSQL a MongoDB en el servicio de Catálogo, o reescribirlo completamente en Rust para mayor eficiencia, podés hacerlo sin que ningún otro servicio se entere ni se rompa.",
    keyTerms: [
      {
        term: "Poliglotismo Tecnológico",
        explanation: "Capacidad de utilizar el lenguaje, base de datos y framework más adecuado para cada problema particular, en lugar de forzar una única tecnología para todo el sistema."
      },
      {
        term: "Reemplazabilidad (Replaceability)",
        explanation: "Poder desechar y volver a escribir un servicio de 1.000 líneas en dos semanas sin poner en riesgo la estabilidad del negocio global."
      }
    ],
    farmacyExample: "Myagis-Forest puede actualizar la librería del servicio de encuestas de clientes a la última versión de Node.js sin tener que probar ni re-compilar el servicio de pagos en Go.",
    architecturalLesson: "La modificabilidad de microservicios es insuperable a nivel de componente individual, pero tiene una trampa: modificar un flujo que atraviesa 4 servicios requiere versionar contratos de red en simultáneo."
  },
  "modificabilidad-microkernel": {
    featureId: "modificabilidad",
    featureName: "Modificabilidad",
    featureIcon: "🛠️",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Agregar requerimientos nuevos mediante plugins sin tocar el código existente",
    coreProblem: "Cumple a la perfección el Principio Abierto/Cerrado (Open/Closed Principle): el sistema está abierto a la extensión creando nuevos plugins, pero cerrado a la modificación de su núcleo estable. Sin embargo, si un nuevo requerimiento exige alterar el contrato de la interfaz central, todos los plugins existentes deben actualizarse.",
    keyTerms: [
      {
        term: "Open/Closed Principle (Principio Abierto/Cerrado)",
        explanation: "Una entidad de software debe estar abierta para su extensión, pero cerrada para su modificación, evitando introducir regresiones en el código ya probado."
      },
      {
        term: "Fragilidad del Contrato Central",
        explanation: "El riesgo de que un cambio en la interfaz del core rompa todos los plugins implementados previamente si no se prevén métodos por defecto o adaptadores."
      }
    ],
    farmacyExample: "Para soportar promociones especiales de 'Happy Hour' en ciertas heladeras, se programa un plugin HappyHourDiscountPlugin que se conecta al core sin tocar la lógica de facturación estándar.",
    architecturalLesson: "Excelente cuando los cambios son aditivos (nuevas reglas, nuevos conectores). Poco flexible si la lógica del negocio central cambia constantemente de raíz."
  },
  "modificabilidad-modular": {
    featureId: "modificabilidad",
    featureName: "Modificabilidad",
    featureIcon: "🛠️",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Refactorizaciones seguras dentro del módulo respaldadas por el compilador",
    coreProblem: "Al aplicar Domain-Driven Design y Bounded Contexts dentro del monolito, los detalles de implementación de cada módulo son privados. Podés refactorizar toda la estructura de clases internas de un módulo con la total tranquilidad de que no romperás a los demás, siempre que mantengas intacta su interfaz pública.",
    keyTerms: [
      {
        term: "Encapsulamiento a Nivel de Módulo",
        explanation: "Hacer públicas únicamente las fachadas o DTOs del módulo, manteniendo entidades y servicios auxiliares invisibles para el resto del proyecto mediante modificadores de acceso o reglas de empaquetado."
      },
      {
        term: "Refactorización Asistida por IDE",
        explanation: "Poder renombrar métodos, extraer clases y reestructurar código con el soporte automático del compilador en un solo proyecto, sin temor a romper llamadas remotas no tipadas."
      }
    ],
    farmacyExample: "ArchColider puede cambiar su modelo de cálculo de reposición de viandas de FIFO a LIFO internamente en el módulo de Inventario sin modificar ni una sola línea del módulo de Kioscos.",
    architecturalLesson: "El monolito modular ofrece una modificabilidad excelente para la inmensa mayoría de las empresas, sin la fricción de versionar contratos de red entre repositorios separados."
  },

  // ==========================================
  // 7. INTEGRIDAD TRANSACCIONAL
  // ==========================================
  "integridad-traditional": {
    featureId: "integridad",
    featureName: "Integridad Transaccional",
    featureIcon: "🔒",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "La magia de BEGIN TRANSACTION y COMMIT en una única base de datos",
    coreProblem: "Toda la aplicación utiliza la misma base de datos relacional. Garantizar que una operación compuesta (descontar dinero, reducir stock y generar factura) se cumpla al 100% o no se cumpla nada es nativo y trivial mediante transacciones ACID gestionadas por el motor SQL.",
    keyTerms: [
      {
        term: "Transacción ACID",
        explanation: "Atomicidad (todo o nada), Consistencia (respeta reglas), Aislamiento (no interfiere con otras transacciones concurrentes) y Durabilidad (persiste tras cortes de energía)."
      },
      {
        term: "Rollback Automático",
        explanation: "Si el cobro falla a mitad del proceso, la base de datos revierte automáticamente los cambios de inventario previos en microsegundos sin dejar inconsistencias."
      }
    ],
    farmacyExample: "El cliente compra un plato en el kiosco Toast POS. El backend abre una transacción: inserta la orden, descuenta 1 unidad de stock y genera la factura. Si la tarjeta es declinada, un simple ROLLBACK cancela todo limpiamente.",
    architecturalLesson: "La integridad transaccional ACID local es el superpoder más grande de los sistemas monolíticos. Perderla es el costo oculto más alto al migrar a microservicios."
  },
  "integridad-microservices": {
    featureId: "integridad",
    featureName: "Integridad Transaccional",
    featureIcon: "🔒",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "--",
    ratingLabel: "Muy desfavorable",
    badgeClasses: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/60 dark:border-red-900/60",
    headline: "Sin ACID global: el dolor de implementar Sagas y compensaciones",
    coreProblem: "La regla de oro de los microservicios es 'Database per Service' (cada servicio tiene su propia base de datos). Por lo tanto, no podés hacer un BEGIN TRANSACTION que abarque dos servicios distintos. Para coordinar una compra, tenés que abandonar las transacciones ACID y diseñar Sagas con consistencia eventual y acciones de compensación manuales.",
    keyTerms: [
      {
        term: "Patrón Saga (Saga Pattern)",
        explanation: "Secuencia de transacciones locales en múltiples servicios. Cada servicio ejecuta su parte y emite un evento. Si un paso falla, se deben ejecutar transacciones de compensación hacia atrás para deshacer los cambios."
      },
      {
        term: "Transacción de Compensación",
        explanation: "Lógica explícita para revertir un cambio ya comiteado en otra base de datos (ej: si el pago falló, llamar al servicio de inventario para devolver el plato reservado)."
      },
      {
        term: "2PC (Two-Phase Commit)",
        explanation: "Protocolo clásico para transacciones distribuidas. Es sumamente lento, bloquea tablas a través de la red y es propenso a bloqueos mutuos (deadlocks) en entornos cloud, por lo que la industria lo evita."
      }
    ],
    farmacyExample: "El servicio de Heladeras descuenta el stock de ensaladas y llama asíncronamente al servicio de Pagos. Stripe rechaza la tarjeta. El sistema debe orquestar una compensación: restaurar el stock y marcar al usuario como deudor sin haber podido bloquear la heladera físicamente.",
    architecturalLesson: "Si tu negocio maneja dinero, auditorías contables estrictas o reservas críticas en tiempo real, pensalo dos veces antes de dividir esas entidades en microservicios separados."
  },
  "integridad-microkernel": {
    featureId: "integridad",
    featureName: "Integridad Transaccional",
    featureIcon: "🔒",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "O",
    ratingLabel: "Aceptable",
    badgeClasses: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700",
    headline: "Depende de si los plugins persisten en la base central o de forma aislada",
    coreProblem: "Si los plugins solo ejecutan lógica de cálculo y delegan la persistencia en el repositorio del núcleo, la transacción se mantiene dentro de una única base relacional (ACID). Pero si cada plugin guarda su propio estado en almacenes independientes, surgen los mismos problemas de consistencia distribuida.",
    keyTerms: [
      {
        term: "Persistencia Delegada",
        explanation: "El plugin calcula el resultado, pero le devuelve una entidad al núcleo para que este la guarde dentro de su propia transacción SQL."
      },
      {
        term: "Estado Autónomo del Plugin",
        explanation: "Cuando un plugin escribe directamente en una base de datos propia, generando un punto de posible desincronización con el estado del núcleo."
      }
    ],
    farmacyExample: "El plugin de control de temperatura de la heladera guarda lecturas en SQLite local, mientras que las ventas se registran en la base PostgreSQL central del núcleo sin requerir coordinación atómica.",
    architecturalLesson: "Mantené las operaciones transaccionales críticas dentro del núcleo y limitá los plugins a tareas de cómputo o persistencia no transaccional."
  },
  "integridad-modular": {
    featureId: "integridad",
    featureName: "Integridad Transaccional",
    featureIcon: "🔒",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Transacciones ACID entre módulos compartiendo la misma base relacional",
    coreProblem: "Cada módulo tiene sus propias tablas y esquemas lógicamente separados para no violar DDD. Sin embargo, al residir físicamente en el mismo cluster de base de datos (ej: PostgreSQL), la aplicación puede coordinar transacciones atómicas seguras cuando el caso de negocio lo exige de forma indispensable.",
    keyTerms: [
      {
        term: "Esquemas Separados en Misma DB",
        explanation: "Estructurar la base de datos con esquemas distintos (ej: orders.db, inventory.db) dentro del mismo servidor SQL, garantizando aislamiento de tablas pero permitiendo transacciones nativas."
      },
      {
        term: "Transactional Outbox Pattern",
        explanation: "Guardar el evento de negocio en una tabla outbox dentro de la misma transacción SQL que modifica los datos, garantizando que el evento se enviará sí o sí al broker de mensajería."
      }
    ],
    farmacyExample: "ArchColider adoptó EventStore y PostgreSQL para registrar la compra y la reserva de la comida de forma atómica en una sola operación, evitando cualquier riesgo de comida cobrada sin stock asignado.",
    architecturalLesson: "Permite preservar la integridad transaccional estricta donde importa, sin cerrarte la puerta a una futura partición distribuida cuando el volumen lo exija."
  },

  // ==========================================
  // 8. ESCALABILIDAD
  // ==========================================
  "escalabilidad-traditional": {
    featureId: "escalabilidad",
    featureName: "Escalabilidad",
    featureIcon: "📈",
    styleId: "traditional",
    styleName: "Monolito Tradicional",
    styleIcon: "🏛️",
    rating: "--",
    ratingLabel: "Muy desfavorable",
    badgeClasses: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/60 dark:border-red-900/60",
    headline: "Escalado tosco: duplicar la aplicación entera para aliviar una sola función",
    coreProblem: "Si el 95% del tráfico son usuarios consultando el menú al mediodía y el módulo de catálogo se satura, estás obligado a levantar 5 instancias completas del monolito. Cada instancia duplica módulos pesados que no se usan, consume gigabytes de RAM innecesarios y satura el pool de conexiones de la base de datos central.",
    keyTerms: [
      {
        term: "Escalado Grueso (Coarse-Grained Scaling)",
        explanation: "Tener que escalar toda la aplicación como una unidad indivisible, replicando partes que no tienen carga y desperdiciando presupuesto de infraestructura."
      },
      {
        term: "Saturación de Conexiones SQL",
        explanation: "Si cada réplica del monolito abre un pool de 20 conexiones a PostgreSQL y levantás 30 réplicas, la base de datos colapsa por exceso de conexiones concurrentes."
      }
    ],
    farmacyExample: "Al mediodía, miles de oficinistas abren la app para ver qué comida hay en la heladera de su piso. Para responder a las consultas, hay que levantar servidores enormes que cargan módulos inútiles a esa hora como facturación contable.",
    architecturalLesson: "En un monolito tradicional, la primera línea de defensa para escalar son cachés agresivas (Redis, CDN) en las lecturas antes de duplicar instancias del backend."
  },
  "escalabilidad-microservices": {
    featureId: "escalabilidad",
    featureName: "Escalabilidad",
    featureIcon: "📈",
    styleId: "microservices",
    styleName: "Microservicios",
    styleIcon: "🌐",
    rating: "++",
    ratingLabel: "Excelente",
    badgeClasses: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    headline: "Escalado quirúrgico y elástico: solo paga por lo que realmente se usa",
    coreProblem: "Cada servicio escala de forma 100% independiente. Podés tener 100 pods del microservicio de Catálogo corriendo en Kubernetes durante el mediodía y solo 2 pods del microservicio de Notificaciones. Cuando pasa el pico de almuerzo, el auto-scaler apaga los pods sobrantes, optimizando el costo al máximo.",
    keyTerms: [
      {
        term: "Horizontal Pod Autoscaler (HPA)",
        explanation: "Herramienta de Kubernetes que aumenta o reduce automáticamente la cantidad de réplicas de un microservicio en función del uso de CPU o métricas personalizadas de peticiones."
      },
      {
        term: "Escalado Asimétrico",
        explanation: "Ajustar la capacidad de cómputo y memoria específicamente al perfil de carga de cada servicio (ej: intensivo en memoria vs. intensivo en CPU)."
      }
    ],
    farmacyExample: "Myagis-Forest puede escalar únicamente su servicio de Catálogo de comidas a 20 instancias en EKS entre las 12:00 y las 14:00, manteniendo los microservicios de Cocina y Proveedores en su tamaño mínimo.",
    architecturalLesson: "Los microservicios son imbatibles en escalabilidad cuando los diferentes dominios del negocio tienen perfiles de tráfico radicalmente asimétricos e impredecibles."
  },
  "escalabilidad-microkernel": {
    featureId: "escalabilidad",
    featureName: "Escalabilidad",
    featureIcon: "📈",
    styleId: "microkernel",
    styleName: "Microkernel (Plugins)",
    styleIcon: "🧩",
    rating: "-",
    ratingLabel: "Desfavorable",
    badgeClasses: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    headline: "El núcleo y los plugins están atados a los límites del mismo host",
    coreProblem: "Al igual que el monolito, el microkernel corre en un solo proceso en la misma máquina. Si un plugin en particular realiza operaciones pesadas (como procesamiento de imágenes de los sensores de la heladera), consume la CPU y memoria del host, degradando la capacidad del núcleo para procesar peticiones.",
    keyTerms: [
      {
        term: "Host Resource Contention",
        explanation: "Competencia feroz entre plugins por los hilos de CPU y memoria RAM disponibles en la máquina virtual donde reside el núcleo."
      },
      {
        term: "Vertical Scaling Limit",
        explanation: "Tener que recurrir a agrandar la máquina física (más RAM, más vCPUs), lo cual tiene un techo técnico duro y un costo exponencialmente más caro."
      }
    ],
    farmacyExample: "Si el plugin que procesa el firmware de las heladeras Byte consume 90% de CPU procesando telemetría de peso en tiempo real, el kiosco Toast POS sufre demoras para cobrar un café.",
    architecturalLesson: "No uses microkernel para tareas con demanda de cómputo masiva o asimétrica a menos que los plugins ejecuten en procesos aislados o workers secundarios."
  },
  "escalabilidad-modular": {
    featureId: "escalabilidad",
    featureName: "Escalabilidad",
    featureIcon: "📈",
    styleId: "modular",
    styleName: "Monolito Modular",
    styleIcon: "🥇",
    rating: "+",
    ratingLabel: "Favorable",
    badgeClasses: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    headline: "Escala horizontal simple con balanceador de carga y bajo costo de arranque",
    coreProblem: "Se escala horizontalmente colocando múltiples réplicas del monolito modular detrás de un balanceador de carga (Application Load Balancer en AWS). Para la escala real del problema (68 locaciones, 1.000 clientes activos), dos instancias EC2 t3.medium con Auto-Scaling son más que suficientes y cuestan menos de $150 al mes.",
    keyTerms: [
      {
        term: "Stateless Replicas (Réplicas sin estado)",
        explanation: "Hacer que el backend no guarde sesiones en memoria local, permitiendo que cualquier petición pueda ser atendida por cualquier instancia del monolito modular tras el balanceador."
      },
      {
        term: "Extracción Evolutiva a Microservicio",
        explanation: "Si en el Año 2 el módulo de Catálogo realmente satura el sistema, la presencia de límites limpios mediante fachadas permite extraerlo como microservicio independiente sin reescribir la aplicación."
      }
    ],
    farmacyExample: "ArchColider calculó que 2 instancias EC2 t3.medium con Auto-Scaling Group absorben hasta 310.000 peticiones mensuales con holgura, costando una fracción de lo que demandaría un clúster EKS gestionado.",
    architecturalLesson: "Escalar infraestructura prematuramente para un tráfico que no existe es una de las principales causas de muerte de startups. Comenzá con un monolito modular y escalá por evidencia, no por ego."
  }
};


export const matrixDeepDivesEn: Record<string, MatrixCellDetail> = {
  "despliegue-traditional": {
    "featureId": "despliegue",
    "featureName": "Deployment Simplicity",
    "featureIcon": "🚀",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Single pipeline, single binary, and all-or-nothing release",
    "coreProblem": "A traditional monolith eliminates network coordination and version drift in production. The build produces a single artifact (such as a jar, Go binary, or Docker image). Deployment simply swaps the previous artifact with the new one across target servers.",
    "keyTerms": [
      {
        "term": "Single Deployable Unit",
        "explanation": "Packaging the entire codebase, business logic, and dependencies into a single self-contained artifact, removing any need to synchronize multi-service deployments."
      },
      {
        "term": "Atomic Rollback",
        "explanation": "If a new version encounters defects in production, returning to stability requires only rolling back the single image or binary, avoiding mixed incompatible service states."
      }
    ],
    "farmacyExample": "The team builds a single Docker image and pushes it to an EC2 instance. Within two minutes, all Farmacy Food subsystems (orders, inventory, billing) are fully updated.",
    "architecturalLesson": "When validating product-market fit with a small engineering team, single-pipeline simplicity heavily outweighs the flexibility of independent deployments."
  },
  "despliegue-microservices": {
    "featureId": "despliegue",
    "featureName": "Deployment Simplicity",
    "featureIcon": "🚀",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "-",
    "ratingLabel": "Challenging",
    "badgeClasses": "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    "headline": "The burden of coordinating multiple releases and network contracts",
    "coreProblem": "While microservices theoretically deploy independently, production features often cross service boundaries. Updating both Orders and Payments simultaneously requires backwards compatibility, canary releases, and Kubernetes manifests that demand dedicated operational attention.",
    "keyTerms": [
      {
        "term": "API Contract & Versioning",
        "explanation": "The agreed-upon public boundary (REST, OpenAPI, gRPC Protobuf) between autonomous services. Breaking changes can instantly cascade and break client services if not carefully versioned."
      },
      {
        "term": "Container Orchestration Overhead",
        "explanation": "Operating clusters with Kubernetes or Helm charts. Teams must configure ingress controllers, service meshes, readiness probes, and secret managers."
      }
    ],
    "farmacyExample": "Myagis-Forest had to manage deployment manifests for eight distinct microservices and an ingress layer, multiplying operational cost for an initial deployment of just two fridges.",
    "architecturalLesson": "Avoid adopting microservices solely to deploy faster unless multiple autonomous teams are genuinely blocked by a shared deployment pipeline."
  },
  "despliegue-microkernel": {
    "featureId": "despliegue",
    "featureName": "Deployment Simplicity",
    "featureIcon": "🚀",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "-",
    "ratingLabel": "Challenging",
    "badgeClasses": "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    "headline": "Managing plugin dependencies and dynamic loading runtime compatibility",
    "coreProblem": "Although the core system is stable, plugins often introduce heterogeneous dependencies and separate lifecycles. Dynamic hot-reloading without restarting the host process is notoriously difficult to implement reliably in most language runtimes.",
    "keyTerms": [
      {
        "term": "Dynamic Hot-Plugging",
        "explanation": "Loading or upgrading code modules inside a running process without restarting it. Memory leaks or runtime library clashes inside a plugin can destabilize the host application."
      },
      {
        "term": "Plugin Registry",
        "explanation": "A control mechanism that verifies plugin versions, interfaces, and permissions before registering event listeners or route handlers."
      }
    ],
    "farmacyExample": "Deploying a plugin for a third-party smart fridge requires ensuring strict binary compatibility with the core engine runtime to prevent classloader conflicts.",
    "architecturalLesson": "Microkernels excel when external third parties write extensions (like IDEs), but they add unnecessary operational friction to internal web platforms."
  },
  "despliegue-modular": {
    "featureId": "despliegue",
    "featureName": "Deployment Simplicity",
    "featureIcon": "🚀",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Clean module encapsulation delivered in a single deployable unit",
    "coreProblem": "A modular monolith combines architectural boundary discipline with single-pipeline simplicity. Modules communicate through internal language facades rather than network calls, allowing the whole system to be compiled, tested, and deployed as one artifact.",
    "keyTerms": [
      {
        "term": "Architectural Quantum",
        "explanation": "An independently deployable artifact with high functional cohesion and independent data storage. A modular monolith maintains a single quantum, simplifying operational complexity."
      },
      {
        "term": "Monorepo Build Caching",
        "explanation": "CI tools (such as Nx or Turborepo) determine which modules changed and only run tests for affected components, maintaining fast pipeline execution."
      }
    ],
    "farmacyExample": "ArchColider packages Inventory, Orders, and Kitchen integrations into a single deployable container on AWS EC2, guaranteeing zero distributed network failures during releases.",
    "architecturalLesson": "Preserve domain boundaries inside the code structure first. You can always split a clean module into an independent service later if scaling requirements demand it."
  },
  "disponibilidad-traditional": {
    "featureId": "disponibilidad",
    "featureName": "High Availability & Fault Isolation",
    "featureIcon": "🛡️",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "--",
    "ratingLabel": "Critical Trade-off",
    "badgeClasses": "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300/60 dark:border-rose-700",
    "headline": "Shared process memory means unhandled exceptions can crash the entire system",
    "coreProblem": "In an unpartitioned monolith, all modules share heap memory, CPU threads, and database connection pools. A memory leak in an auxiliary feature like PDF receipt generation can consume all memory and crash the primary order-taking workflow.",
    "keyTerms": [
      {
        "term": "Single Point of Failure (SPOF)",
        "explanation": "A component whose failure stops the entire application from functioning, due to lack of process or resource boundaries."
      },
      {
        "term": "Cascading Memory Exhaustion",
        "explanation": "When an unconstrained operation consumes server memory until the runtime triggers Out-Of-Memory errors, taking down all concurrent user threads."
      }
    ],
    "farmacyExample": "A batch job generating end-of-month accounting reports consumes available database connections, preventing patrons at smart fridges from opening doors to purchase food.",
    "architecturalLesson": "Without process boundaries or rigorous resource quotas, non-critical features inevitably put core revenue streams at risk."
  },
  "disponibilidad-microservices": {
    "featureId": "disponibilidad",
    "featureName": "High Availability & Fault Isolation",
    "featureIcon": "🛡️",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Isolated process boundaries and graceful degradation",
    "coreProblem": "Each service runs in its own process, container, and VM. If the customer feedback service fails, the order processing service remains completely unaffected. Fault isolation patterns ensure failure remains localized.",
    "keyTerms": [
      {
        "term": "Blast Radius",
        "explanation": "The maximum scope of impact caused by a component failure. Microservices restrict this radius to the boundary of the individual service."
      },
      {
        "term": "Circuit Breaker Pattern",
        "explanation": "A protective wrapper around remote calls that trips after repeated failures, immediately returning a fallback response to prevent thread exhaustion."
      }
    ],
    "farmacyExample": "In Myagis-Forest, when the SMS notification service experiences an external provider outage, smart fridges continue dispensing food and recording purchases without interruption.",
    "architecturalLesson": "Microservices provide robust fault isolation, but only when teams actively implement circuit breakers, retries, and fallback mechanisms."
  },
  "disponibilidad-microkernel": {
    "featureId": "disponibilidad",
    "featureName": "High Availability & Fault Isolation",
    "featureIcon": "🛡️",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "O",
    "ratingLabel": "Neutral",
    "badgeClasses": "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-300/60 dark:border-slate-700",
    "headline": "The core stays resilient, but poorly sandboxed plugins can threaten stability",
    "coreProblem": "The core engine enforces basic validation, but plugins running in the same process space can still trigger fatal runtime errors or block worker pools unless sandboxing or process boundaries are enforced.",
    "keyTerms": [
      {
        "term": "Runtime Sandboxing",
        "explanation": "Restricting plugin execution through memory limits, time-outs, and constrained capabilities to prevent rogue code from hijacking the host process."
      },
      {
        "term": "Defensive Invocation",
        "explanation": "Wrapping external plugin hooks in strict try-catch blocks and timeout promises to protect core system loops."
      }
    ],
    "farmacyExample": "If a third-party fridge vendor plugin enters an infinite loop while parsing temperature telemetry, the core inventory system might freeze without timeout supervision.",
    "architecturalLesson": "Never trust plugin stability. Wrap every external hook in strict timeout and error boundaries."
  },
  "disponibilidad-modular": {
    "featureId": "disponibilidad",
    "featureName": "High Availability & Fault Isolation",
    "featureIcon": "🛡️",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "Strong module contracts protect business logic, backed by multi-instance horizontal scaling",
    "coreProblem": "Although running in a single process, internal domain facades and strict exception handling prevent failures from cascading across domains. Placing redundant monolith instances behind a load balancer ensures high availability.",
    "keyTerms": [
      {
        "term": "Internal Domain Facade",
        "explanation": "A public interface exposed by a module that encapsulates internal errors and returns domain results, preventing raw unhandled exceptions from propagating."
      },
      {
        "term": "Redundant Horizontal Clustering",
        "explanation": "Running multiple identical instances of the modular monolith behind AWS Application Load Balancers with automated health checks."
      }
    ],
    "farmacyExample": "ArchColider deploys the modular application across multiple AWS Availability Zones inside an Auto Scaling Group, maintaining high uptime even if an instance restarts.",
    "architecturalLesson": "Horizontal redundancy of modular monoliths provides high availability at a fraction of the operational cost of multi-service clusters."
  },
  "autonomia-traditional": {
    "featureId": "autonomia",
    "featureName": "Team Autonomy & Velocity",
    "featureIcon": "👥",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "-",
    "ratingLabel": "Challenging",
    "badgeClasses": "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    "headline": "Merge conflicts, shared database tables, and release train bottlenecks",
    "coreProblem": "When dozens of engineers push code to a single repository with shared database schemas, merge conflicts increase and regression risks grow. Teams are forced into coordinated release trains.",
    "keyTerms": [
      {
        "term": "Release Train",
        "explanation": "A scheduled deployment cadence where multiple teams merge their features together, meaning a single defect can hold back the entire scheduled release."
      },
      {
        "term": "Shared Schema Coupling",
        "explanation": "Multiple modules querying the same database tables directly, causing small schema changes to trigger unexpected regressions across other teams."
      }
    ],
    "farmacyExample": "The marketing team changes the discount model in the shared users table, unintentionally breaking authentication checks across all kiosk terminals.",
    "architecturalLesson": "A traditional monolith creates friction as team size grows past roughly 15 to 20 engineers without architectural boundaries."
  },
  "autonomia-microservices": {
    "featureId": "autonomia",
    "featureName": "Team Autonomy & Velocity",
    "featureIcon": "👥",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Conway's Law optimized: independent repos, pipelines, and tech choices",
    "coreProblem": "Teams have end-to-end ownership of their service, from database design to CI/CD pipeline. They can release multiple times a day without coordinating with other teams, provided API contracts remain stable.",
    "keyTerms": [
      {
        "term": "Conway's Law",
        "explanation": "Organizations design systems that mirror their own communication structures. Microservices empower small, cross-functional teams with full domain ownership."
      },
      {
        "term": "Polyglot Persistence",
        "explanation": "The ability for each microservice to select the ideal storage engine for its workload, such as PostgreSQL for orders and Redis for session cache."
      }
    ],
    "farmacyExample": "The ghost kitchen engineering squad uses Python and Celery to manage kitchen queues while the mobile app team uses TypeScript and Node, operating independently.",
    "architecturalLesson": "Microservices shine when organizational scale creates real coordination bottlenecks between distinct engineering teams."
  },
  "autonomia-microkernel": {
    "featureId": "autonomia",
    "featureName": "Team Autonomy & Velocity",
    "featureIcon": "👥",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "Core team maintains the platform while feature squads build plugins",
    "coreProblem": "The core team defines extension contracts and interfaces. Feature squads develop, test, and package plugins independently without modifying core business workflows.",
    "keyTerms": [
      {
        "term": "Extension Point (Hook)",
        "explanation": "A well-defined interface or callback in the core system where external plugins inject custom business logic."
      },
      {
        "term": "Core Platform Governance",
        "explanation": "A dedicated platform team sets architectural standards and API contracts, allowing plugin authors to build independently."
      }
    ],
    "farmacyExample": "An external contractor builds a custom loyalty integration plugin without requiring access to the core inventory codebase.",
    "architecturalLesson": "Microkernel architecture separates platform engineering from custom feature development effectively."
  },
  "autonomia-modular": {
    "featureId": "autonomia",
    "featureName": "Team Autonomy & Velocity",
    "featureIcon": "👥",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "Module ownership enforced by compiler boundaries without network overhead",
    "coreProblem": "Teams own specific directories or packages within a monorepo. Access to internal implementation details is blocked by package-private visibility and linting rules (such as ArchUnit or ESLint boundaries).",
    "keyTerms": [
      {
        "term": "Package Boundary Enforcement",
        "explanation": "Automated rules or compiler constraints that forbid direct imports of internal module classes from external domains."
      },
      {
        "term": "Codeowners Governance",
        "explanation": "Repository configuration requiring approval from domain owners whenever pull requests modify files within their bounded context."
      }
    ],
    "farmacyExample": "The Orders team cannot import internal Inventory database entities directly; they must call the documented `IInventoryService` facade.",
    "architecturalLesson": "Enforce domain boundaries using language visibility rules and CI checks to gain team autonomy without premature microservices complexity."
  },
  "trazabilidad-traditional": {
    "featureId": "trazabilidad",
    "featureName": "Debugging & Traceability",
    "featureIcon": "🔍",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Single stack traces, local breakpoints, and unified server logs",
    "coreProblem": "Diagnosing an issue is straightforward. An error produces an exact stack trace indicating the exact file and line number across all call frames. Developers can attach a local debugger and step through the entire flow.",
    "keyTerms": [
      {
        "term": "Local Stack Trace",
        "explanation": "A continuous call stack captured by the runtime, detailing every function invocation leading up to an unhandled exception."
      },
      {
        "term": "Zero Network Asynchrony",
        "explanation": "Synchronous in-process calls preserve call context, correlation IDs, and transaction scopes without requiring distributed headers."
      }
    ],
    "farmacyExample": "When an order calculation fails, the developer attaches a local debugger, sets a breakpoint, and inspects local variables directly in their IDE.",
    "architecturalLesson": "Local debuggability is one of the greatest productivity drivers in software engineering. Do not abandon it lightly."
  },
  "trazabilidad-microservices": {
    "featureId": "trazabilidad",
    "featureName": "Debugging & Traceability",
    "featureIcon": "🔍",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "--",
    "ratingLabel": "Critical Trade-off",
    "badgeClasses": "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300/60 dark:border-rose-700",
    "headline": "Asynchronous network boundaries fragment logs and require distributed tracing",
    "coreProblem": "A single user transaction crosses multiple network hops and message queues. When an order disappears, there is no single stack trace. Debugging requires OpenTelemetry, trace IDs, distributed spans, and centralized log aggregation.",
    "keyTerms": [
      {
        "term": "Distributed Tracing (OpenTelemetry)",
        "explanation": "Passing trace and span IDs across HTTP headers and message envelopes to reconstruct the distributed execution graph across services."
      },
      {
        "term": "Log Fragmentation",
        "explanation": "Logs scattered across dozens of individual containers, requiring Elasticsearch or Datadog clusters to correlate events."
      }
    ],
    "farmacyExample": "Investigating why a smart fridge failed to unlock required Myagis-Forest to query Jaeger across Auth, Inventory, and Hardware services to find the culprit timeout.",
    "architecturalLesson": "Microservices require production observability infrastructure before you can reliably troubleshoot issues."
  },
  "trazabilidad-microkernel": {
    "featureId": "trazabilidad",
    "featureName": "Debugging & Traceability",
    "featureIcon": "🔍",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "O",
    "ratingLabel": "Neutral",
    "badgeClasses": "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-300/60 dark:border-slate-700",
    "headline": "Clear host lifecycle, but plugin internal state can be opaque",
    "coreProblem": "Core execution logs are centralized, but dynamic plugin execution can obfuscate call stacks when reflection or event dispatchers decouple invocations.",
    "keyTerms": [
      {
        "term": "Dynamic Dispatch Obfuscation",
        "explanation": "When code is invoked indirectly via reflection or event emitters, standard stack traces lose direct caller information."
      },
      {
        "term": "Plugin Diagnostic Context",
        "explanation": "Logging frameworks tagging log entries with plugin metadata to distinguish host issues from third-party extension failures."
      }
    ],
    "farmacyExample": "A custom pricing plugin crashes silently; the core logs indicate a null reference, but identifying which plugin triggered the hook requires custom logging wrappers.",
    "architecturalLesson": "Ensure event dispatchers capture and log the identity of active plugins to preserve debuggability."
  },
  "trazabilidad-modular": {
    "featureId": "trazabilidad",
    "featureName": "Debugging & Traceability",
    "featureIcon": "🔍",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Complete stack traces across modules with clear architectural boundaries",
    "coreProblem": "Calls between modules pass through documented facade interfaces in memory. An exception traces cleanly from the controller through domain facades to the repository, with zero network latency or serialized context loss.",
    "keyTerms": [
      {
        "term": "End-to-End In-Process Stack",
        "explanation": "The runtime preserves the entire call hierarchy across domain boundaries, providing immediate root-cause visibility."
      },
      {
        "term": "Domain Log Namespaces",
        "explanation": "Configuring loggers with module prefixes (such as `farmacy.orders` and `farmacy.inventory`) enables easy log filtering while keeping storage unified."
      }
    ],
    "farmacyExample": "ArchColider traces an entire order lifecycle from POS webhook to inventory deduction in a single server log stream with full variable inspection.",
    "architecturalLesson": "Retain in-process debugging advantages while enforcing domain modularity to maintain high developer velocity."
  },
  "rendimiento-traditional": {
    "featureId": "rendimiento",
    "featureName": "Performance & Latency",
    "featureIcon": "⚡",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "In-memory method calls execute in nanoseconds without network serialization",
    "coreProblem": "Communication between application layers occurs via native memory pointers. There is no JSON serialization, TLS handshake, or network latency between domain operations.",
    "keyTerms": [
      {
        "term": "In-Memory Pointer Dereference",
        "explanation": "Passing data objects between functions in sub-microsecond memory lookups, orders of magnitude faster than network I/O."
      },
      {
        "term": "Relational Join Optimization",
        "explanation": "Querying multiple tables in a single optimized SQL join, avoiding N+1 remote network requests."
      }
    ],
    "farmacyExample": "Calculating menu item discounts across 500 items takes 4 milliseconds in local memory using direct object references.",
    "architecturalLesson": "Local memory execution is unbeatable for low latency. Never replace a method call with a network call without a clear justification."
  },
  "rendimiento-microservices": {
    "featureId": "rendimiento",
    "featureName": "Performance & Latency",
    "featureIcon": "⚡",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "-",
    "ratingLabel": "Challenging",
    "badgeClasses": "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    "headline": "Network latency tax and serialization overhead accumulate per request",
    "coreProblem": "Each remote service interaction introduces network latency (1 to 10 ms), JSON or protobuf serialization, DNS resolution, and connection pool management. Complex workflows compounding multiple hops suffer significant tail latency.",
    "keyTerms": [
      {
        "term": "Network Latency Tax",
        "explanation": "The cumulative latency added by remote network hops, payload serialization, and socket handshakes on every cross-service interaction."
      },
      {
        "term": "Distributed N+1 Problem",
        "explanation": "When a service calls another remote service iteratively in a loop instead of bulk querying, multiplying latency by the number of items."
      }
    ],
    "farmacyExample": "In Myagis-Forest, fetching user details, verifying active subscriptions, and checking location stock required four sequential network calls, adding 120 ms of overhead.",
    "architecturalLesson": "Design coarse-grained service boundaries or adopt asynchronous event-driven messaging to mitigate remote call latency."
  },
  "rendimiento-microkernel": {
    "featureId": "rendimiento",
    "featureName": "Performance & Latency",
    "featureIcon": "⚡",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "Fast in-process plugin execution with minor dynamic dispatch overhead",
    "coreProblem": "Plugins run inside the host application process, keeping performance close to native monolith speeds. The only minor overhead comes from interface reflection and lifecycle hooks.",
    "keyTerms": [
      {
        "term": "Dynamic Method Invocation",
        "explanation": "Calling plugin hooks via runtime interfaces, which modern JIT compilers optimize nearly as effectively as direct calls."
      },
      {
        "term": "Zero Network Boundary",
        "explanation": "Plugins share memory space with the core, avoiding network serialization penalties completely."
      }
    ],
    "farmacyExample": "A custom tax calculation plugin evaluates local sales tax in 0.2 milliseconds using direct in-memory invocation.",
    "architecturalLesson": "Microkernels provide modular extensibility while preserving high in-process execution speed."
  },
  "rendimiento-modular": {
    "featureId": "rendimiento",
    "featureName": "Performance & Latency",
    "featureIcon": "⚡",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Zero network latency between modules with clean architectural contracts",
    "coreProblem": "Domain modules communicate via strongly typed in-memory facades. The system retains the high performance of monolithic execution while keeping code decoupled and cleanly structured.",
    "keyTerms": [
      {
        "term": "Facade Direct Invocation",
        "explanation": "Calling exposed module methods directly in memory, executing in fractions of a microsecond."
      },
      {
        "term": "Unified Database Connection Pooling",
        "explanation": "Sharing a high-performance database connection pool across modules, avoiding connection churn and distributed lock overhead."
      }
    ],
    "farmacyExample": "ArchColider coordinates inventory reservation and payment processing in under 15 milliseconds, with zero inter-service network latency.",
    "architecturalLesson": "Modular monoliths deliver top-tier performance by replacing slow network hops with high-speed in-memory method calls."
  },
  "modificabilidad-traditional": {
    "featureId": "modificabilidad",
    "featureName": "Maintainability & Modifiability",
    "featureIcon": "🛠️",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "--",
    "ratingLabel": "Critical Trade-off",
    "badgeClasses": "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300/60 dark:border-rose-700",
    "headline": "Unconstrained dependencies lead to spaghetti code and high regression risk",
    "coreProblem": "Without strict architectural boundaries, developers take shortcuts by importing arbitrary classes and querying foreign tables. Over time, the codebase degrades into a high-coupling Big Ball of Mud.",
    "keyTerms": [
      {
        "term": "Big Ball of Mud",
        "explanation": "A software system lacking clear structure, where changes to one component cause unpredictable regressions in unrelated features."
      },
      {
        "term": "Temporal Coupling",
        "explanation": "Dependencies between functions that rely on specific execution order and shared global state, complicating refactoring."
      }
    ],
    "farmacyExample": "A change to the customer discount calculation inadvertently broke the kitchen inventory display because both shared direct database queries.",
    "architecturalLesson": "Without automated architecture enforcement rules, monoliths naturally decay into high-coupling legacy systems."
  },
  "modificabilidad-microservices": {
    "featureId": "modificabilidad",
    "featureName": "Maintainability & Modifiability",
    "featureIcon": "🛠️",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "Physical network boundaries prevent illegal imports, but cross-cutting changes are costly",
    "coreProblem": "Physical boundaries force decoupling. You cannot simply import internal database entities from another service. However, modifying a feature that spans multiple services requires coordinating changes across multiple repositories and releases.",
    "keyTerms": [
      {
        "term": "Physical Boundary Enforcement",
        "explanation": "Network boundaries that physically prevent code from bypassing public API endpoints."
      },
      {
        "term": "Shotgun Surgery",
        "explanation": "A single business requirement forcing synchronized code updates across multiple separate repositories and services."
      }
    ],
    "farmacyExample": "Refactoring customer dietary preferences in Myagis-Forest required modifying data schemas and APIs across User, Menu, and Recommendation services.",
    "architecturalLesson": "Microservices isolate single-domain modifications well, but impose heavy overhead on cross-cutting feature refactoring."
  },
  "modificabilidad-microkernel": {
    "featureId": "modificabilidad",
    "featureName": "Maintainability & Modifiability",
    "featureIcon": "🛠️",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Open-Closed Principle realized: extend system behavior without modifying core code",
    "coreProblem": "The core system remains untouched while new business requirements are added as modular plugins. Adding support for a new payment gateway or hardware sensor simply involves writing a new plugin adhering to the interface.",
    "keyTerms": [
      {
        "term": "Open-Closed Principle (OCP)",
        "explanation": "Software entities should be open for extension, but closed for modification. New features are added without risking core logic stability."
      },
      {
        "term": "SPI (Service Provider Interface)",
        "explanation": "A set of public interfaces designed to be implemented by plugins to provide custom implementations of core services."
      }
    ],
    "farmacyExample": "Adding support for a new RFID fridge vendor requires implementing a single `IFridgeProvider` plugin without altering existing billing logic.",
    "architecturalLesson": "Microkernel is the premier pattern when business evolution consists of adding alternative implementations to fixed workflows."
  },
  "modificabilidad-modular": {
    "featureId": "modificabilidad",
    "featureName": "Maintainability & Modifiability",
    "featureIcon": "🛠️",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Refactoring safety of a single codebase combined with domain encapsulation",
    "coreProblem": "Modular monoliths provide the optimal refactoring experience: automated IDE renames, compiler validation, and instant type checking across boundaries, combined with strict facade encapsulation.",
    "keyTerms": [
      {
        "term": "Automated Architectural Fitness Functions",
        "explanation": "Automated tests (such as ArchUnit or Depcheck) that fail the build if a module imports classes from another module outside its public facade."
      },
      {
        "term": "Safe Cross-Module Refactoring",
        "explanation": "Using IDE refactoring tools to safely update method signatures across domain boundaries with immediate compiler feedback."
      }
    ],
    "farmacyExample": "ArchColider cleanly encapsulates the kitchen integration behind a facade, allowing internal queue logic to be overhauled without affecting the orders module.",
    "architecturalLesson": "Rigorous modular boundaries backed by compiler checks offer superior long-term maintainability over premature service distribution."
  },
  "integridad-traditional": {
    "featureId": "integridad",
    "featureName": "Transactional Integrity & ACID",
    "featureIcon": "🔒",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Native ACID transactions with complete rollback guarantees in relational databases",
    "coreProblem": "A single `BEGIN TRANSACTION` guarantees Atomicity, Consistency, Isolation, and Durability. If any step fails, the database automatically rolls back all intermediate operations.",
    "keyTerms": [
      {
        "term": "ACID Guarantees",
        "explanation": "Database guarantees ensuring multiple table updates either succeed completely or leave the database completely unaltered."
      },
      {
        "term": "Row-Level Locking",
        "explanation": "Preventing race conditions (like overselling the last item in a fridge) using standard database transaction isolation."
      }
    ],
    "farmacyExample": "Deducting stock from inventory and creating the customer order record execute within a single database transaction, eliminating data inconsistencies.",
    "architecturalLesson": "When financial accuracy and strict consistency are critical, native ACID transactions eliminate immense business and engineering risk."
  },
  "integridad-microservices": {
    "featureId": "integridad",
    "featureName": "Transactional Integrity & ACID",
    "featureIcon": "🔒",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "--",
    "ratingLabel": "Critical Trade-off",
    "badgeClasses": "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300/60 dark:border-rose-700",
    "headline": "Independent databases rule out global ACID, requiring complex Sagas and eventual consistency",
    "coreProblem": "With one database per service, global transactions require either Two-Phase Commit (slow and fragile) or Saga orchestration with compensating transactions and eventual consistency.",
    "keyTerms": [
      {
        "term": "Saga Pattern (Choreography / Orchestration)",
        "explanation": "A sequence of local transactions across services where each step publishes events, requiring compensating transactions if a step fails."
      },
      {
        "term": "Eventual Consistency",
        "explanation": "Accepting temporary data inconsistency across services with the guarantee that states will converge over time."
      }
    ],
    "farmacyExample": "If payment fails after inventory is reserved, a compensating event must be sent to restore fridge stock, creating a window for race conditions.",
    "architecturalLesson": "Do not split databases across services until your domain model and business stakeholders can tolerate eventual consistency."
  },
  "integridad-microkernel": {
    "featureId": "integridad",
    "featureName": "Transactional Integrity & ACID",
    "featureIcon": "🔒",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "The core manages transaction scopes, while plugins execute within boundary contexts",
    "coreProblem": "The core engine controls the primary database transaction, allowing plugin hooks to participate in the transaction before committing.",
    "keyTerms": [
      {
        "term": "Transaction Context Propagation",
        "explanation": "Passing an active transaction handle into plugin hooks so their actions commit or roll back alongside core logic."
      },
      {
        "term": "Side-Effect Isolation",
        "explanation": "Deferring non-transactional plugin actions (such as sending emails or webhooks) until after the database transaction commits."
      }
    ],
    "farmacyExample": "A custom discount plugin calculates pricing inside the active checkout transaction, ensuring price rules commit with the order record.",
    "architecturalLesson": "Allow plugins to participate in core database transactions, but defer external I/O until transaction commit."
  },
  "integridad-modular": {
    "featureId": "integridad",
    "featureName": "Transactional Integrity & ACID",
    "featureIcon": "🔒",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "ACID transactions preserved across modules with isolated schema boundaries",
    "coreProblem": "Modules maintain isolated table schemas or separate database schemas within the same database engine, allowing cross-module transactions to leverage ACID guarantees without network latency.",
    "keyTerms": [
      {
        "term": "Schema-Per-Module Isolation",
        "explanation": "Organizing database tables into module-specific schemas (such as `orders.transactions` and `inventory.stock`), enforcing data boundaries while sharing a database engine."
      },
      {
        "term": "Transactional Outbox Pattern",
        "explanation": "Writing domain events to an outbox table within the same ACID transaction, guaranteeing reliable message publishing to external queues."
      }
    ],
    "farmacyExample": "ArchColider records order creation, decrements fridge stock, and writes to an internal outbox in a single transaction, achieving perfect consistency.",
    "architecturalLesson": "A modular monolith lets you enforce strict schema boundaries while keeping the reliability of relational ACID transactions."
  },
  "escalabilidad-traditional": {
    "featureId": "escalabilidad",
    "featureName": "Scalability & Resource Utilization",
    "featureIcon": "📈",
    "styleId": "traditional",
    "styleName": "Traditional Monolith",
    "styleIcon": "🏛️",
    "rating": "O",
    "ratingLabel": "Neutral",
    "badgeClasses": "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-300/60 dark:border-slate-700",
    "headline": "Coarse horizontal scaling: scaling one bottleneck replicates the entire system",
    "coreProblem": "You scale by spinning up additional instances of the entire application. If only the PDF receipt generator is under heavy load, you must still replicate the entire application image, leading to inefficient resource utilization.",
    "keyTerms": [
      {
        "term": "Coarse-Grained Scaling",
        "explanation": "Replicating the entire application to handle load on a single subcomponent, increasing memory and infrastructure costs."
      },
      {
        "term": "Database Connection Saturation",
        "explanation": "Each new monolithic instance opens database connections for all its modules, potentially exhausting database connection limits."
      }
    ],
    "farmacyExample": "Handling lunch-hour traffic spikes at kiosks requires spinning up four new monolith servers, duplicating unused backend accounting workers.",
    "architecturalLesson": "Coarse scaling is acceptable for small to medium workloads where infrastructure cost is far lower than developer engineering time."
  },
  "escalabilidad-microservices": {
    "featureId": "escalabilidad",
    "featureName": "Scalability & Resource Utilization",
    "featureIcon": "📈",
    "styleId": "microservices",
    "styleName": "Microservices",
    "styleIcon": "🌐",
    "rating": "++",
    "ratingLabel": "Excellent",
    "badgeClasses": "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700",
    "headline": "Targeted, granular horizontal scaling matched to specific workload profiles",
    "coreProblem": "Each service scales independently based on its own resource constraints. A CPU-heavy recommendation service scales on GPU or high-compute nodes, while lightweight I/O services scale on small containers.",
    "keyTerms": [
      {
        "term": "Granular Elasticity",
        "explanation": "Independently scaling specific services experiencing peak demand without allocating resources to idle subsystems."
      },
      {
        "term": "Heterogeneous Hardware Provisioning",
        "explanation": "Assigning specialized cloud instance types (compute-optimized, memory-optimized) to individual services according to their needs."
      }
    ],
    "farmacyExample": "During the 12 PM lunch rush, Myagis-Forest auto-scales the Orders service from two to twenty pods while leaving Kitchen and Reporting at single instances.",
    "architecturalLesson": "Granular scaling is valuable when specific workloads have radically disproportionate scaling profiles."
  },
  "escalabilidad-microkernel": {
    "featureId": "escalabilidad",
    "featureName": "Scalability & Resource Utilization",
    "featureIcon": "📈",
    "styleId": "microkernel",
    "styleName": "Microkernel (Plugins)",
    "styleIcon": "🧩",
    "rating": "O",
    "ratingLabel": "Neutral",
    "badgeClasses": "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-slate-300/60 dark:border-slate-700",
    "headline": "Scales horizontally like a monolith, limited by the heaviest loaded plugin",
    "coreProblem": "Because plugins execute inside the host application process, scaling the system requires replicating the entire core and all registered plugins together.",
    "keyTerms": [
      {
        "term": "Monolithic Scaling Profile",
        "explanation": "Like a standard monolith, the host process must be replicated in its entirety across instances to handle increased load."
      },
      {
        "term": "Plugin Memory Footprint",
        "explanation": "Loading numerous optional plugins into the host runtime increases baseline memory consumption across all running nodes."
      }
    ],
    "farmacyExample": "Scaling the system to process incoming RFID fridge events requires running extra instances that also load unused kiosk and POS plugins.",
    "architecturalLesson": "Microkernels provide modular extensibility, not independent infrastructure scaling."
  },
  "escalabilidad-modular": {
    "featureId": "escalabilidad",
    "featureName": "Scalability & Resource Utilization",
    "featureIcon": "📈",
    "styleId": "modular",
    "styleName": "Modular Monolith",
    "styleIcon": "🥇",
    "rating": "+",
    "ratingLabel": "Favorable",
    "badgeClasses": "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    "headline": "Efficient horizontal scaling today, with a direct path to extract independent services tomorrow",
    "coreProblem": "The modular monolith scales horizontally behind load balancers with minimal memory overhead. If one specific module eventually outgrows the monolith, clean facade boundaries allow extracting it into a microservice without refactoring business logic.",
    "keyTerms": [
      {
        "term": "Evolutionary Decomposition",
        "explanation": "Extracting a single high-load bounded context into an autonomous service only when real production traffic patterns demand it."
      },
      {
        "term": "Resource Efficiency",
        "explanation": "Running multiple modules inside a single process reduces baseline memory and container overhead compared to running dozens of microservices."
      }
    ],
    "farmacyExample": "ArchColider serves 68 locations and thousands of daily orders on two modest AWS EC2 instances, with the flexibility to extract Catalog to a separate service if search volume spikes.",
    "architecturalLesson": "Start with a modular monolith to maximize efficiency, and extract individual services only when empirical scaling data justifies it."
  }
};
