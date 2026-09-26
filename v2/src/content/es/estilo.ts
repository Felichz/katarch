import type { Chapter } from '../types';
import { c, doc } from '../helpers';

export const estilo: Chapter = {
  id: 'estilo',
  number: 4,
  phase: 'El marco de decisión',
  title: 'Cuánta maquinaria comprar',
  subtitle: 'La decisión madre de todo el caso: ¿una sola pieza o muchas? Primero se desactiva una trampa, después se hace la cuenta.',
  minutes: 12,
  learn: [
    'Reconocer la <strong>Entity Trap</strong> y por qué falla.',
    'Leer un mapa de valores de estilos y entender por qué el contexto decide, no la tabla sola.',
    'Explicar qué es un <strong>monolito modular</strong> y cómo se diseña para extraer módulos después.',
    'Reformular la pregunta “¿monolito o microservicios?” como una cuenta de volumen, equipo y costo.',
  ],
  extraDocs: ['adr-002'],
  steps: [
    {
      id: 'cover',
      layout: 'cover',
      title: 'Cuánta maquinaria comprar',
      blocks: [
        { t: 'p', html: 'Con las reglas del capítulo anterior fijadas, llega la decisión de estilo. Si venís de escuchar charlas sobre microservicios, conviene primero desactivar una trampa en la que, según los propios jueces, cayeron varios equipos del kata.' },
      ],
    },
    {
      id: 'trampa',
      kicker: 'La trampa',
      title: 'Un componente por sustantivo',
      visual: { scene: 'entitytrap', state: 'nouns' },
      describe: '<p>De la frase “un usuario elige un menú, arma una orden, la paga y la retira de una heladera” salen cinco servicios, uno por sustantivo: usuario, menú, orden, pago y heladera.</p>',
      blocks: [
        { t: 'p', html: `Los slides oficiales de Richards &amp; Ford la llaman la ${c('entity-trap', 'Entity Trap')}: anotar los sustantivos del negocio (usuario, menú, orden) y crear un componente por cada uno.` },
        { t: 'p', html: 'Suena ordenado. Cada caja tiene un nombre claro y hace lo básico con su dato: crear, leer, actualizar, borrar.' },
      ],
    },
    {
      id: 'flujos',
      kicker: 'La trampa',
      title: 'La vida avanza por flujos, no por sustantivos',
      visual: { scene: 'entitytrap', state: 'flows' },
      describe: '<p>Un solo flujo real, comprar una vianda, tiene que pasar por los cinco servicios en fila. Cada cambio del negocio los atraviesa a todos.</p>',
      blocks: [
        { t: 'p', html: 'Y falla. Un flujo real, como comprar una vianda, no vive en ninguna caja: las atraviesa todas. Cada cambio del negocio termina tocando cinco componentes a la vez.' },
        { t: 'p', html: 'El equipo ganador la esquivó modelando <strong>acciones de actores</strong> (elegir, pagar, retirar, agendar, cancelar), no colecciones de cosas. Ese modelo aparece dibujado en el próximo capítulo.' },
      ],
    },
    {
      id: 'restricciones',
      kicker: 'La cuenta',
      title: 'Cuatro restricciones y un número',
      visual: { scene: 'constraints' },
      blocks: [
        { t: 'p', html: 'Con la trampa identificada, la comparación de estilos se vuelve una cuenta concreta.' },
        { t: 'p', html: `De un lado, el número del capítulo 1: menos de una petición por segundo. Del otro, las cuatro restricciones duras del cliente ${doc('constraints')}: equipo chico, salida rápida al mercado, AWS y presupuesto mínimo.` },
      ],
    },
    {
      id: 'mapa-valores',
      kicker: 'La cuenta',
      title: 'El mapa de valores del ADR 002',
      visual: { scene: 'valuemap', props: { correct: 3 } },
      describe: '<p>Tabla del ADR 002: cuatro estilos (monolito, microservicios, micro-kernel, monolito modularizado) evaluados en diez atributos, de muy negativo a promueve fuerte. Los microservicios promueven fuerte casi todo, salvo facilidad de despliegue, trazabilidad e integridad. El monolito modularizado promueve fuerte despliegue, performance y seguridad.</p>',
      blocks: [
        { t: 'p', html: `El ${doc('adr-002', 'ADR 002')} compara cuatro estilos contra diez atributos de calidad. Recorré la tabla: los microservicios promueven fuerte casi todo.` },
        {
          t: 'predict',
          question: 'Con un equipo chico, salida rápida al mercado y un presupuesto mínimo, ¿qué columna elegirías?',
          options: [
            { label: 'Monolito', feedback: 'Despliega fácil, pero es muy negativo en autonomía y escalabilidad: cierra la puerta al crecimiento.' },
            { label: 'Microservicios', feedback: 'Gana en la tabla sola, pero pierde justo en lo que el contexto exige: facilidad de despliegue e integridad, con un equipo chico.' },
            { label: 'Micro-kernel', feedback: 'Equilibrado, pero negativo en despliegue y escalabilidad.' },
            { label: 'Monolito modularizado', correct: true, feedback: '<strong>Eso eligió el equipo.</strong> Despliegue fácil hoy, y ninguna puerta cerrada: por eso el contexto pesa más que la cantidad de “++”.' },
          ],
        },
      ],
    },
    {
      id: 'decision',
      kicker: 'La decisión',
      title: 'Un monolito modular',
      visual: { scene: 'modmono', state: 'inside' },
      describe: '<p>Una sola aplicación desplegable con seis módulos (catálogo, órdenes, agenda, pagos, opiniones, promociones). Cada módulo tiene fronteras estrictas y se comunica con los demás por mensajes, como si hubiera red entre ellos.</p>',
      blocks: [
        { t: 'p', html: `Un ${c('monolito-modular', 'monolito modular')}: una sola aplicación, en pocas máquinas de AWS, dividida por dentro en módulos con fronteras estrictas.` },
        { t: 'p', html: 'Cada módulo se habla con los demás a través de contratos, <strong>como si hubiera red entre ellos</strong>, aunque no la haya.' },
        { t: 'decision', id: 'monolith' },
      ],
    },
    {
      id: 'extraer',
      kicker: 'La decisión',
      title: 'Diseñado para la extracción',
      visual: { scene: 'modmono', state: 'extract' },
      describe: '<p>Cuando la telemetría muestra carga alta en el catálogo, ese módulo sale del monolito como servicio propio, con varias réplicas. Los mensajes que recibe son los mismos que antes: la frontera ya existía.</p>',
      blocks: [
        { t: 'p', html: 'Por eso los contratos: el día que la telemetría lo justifique, cualquier módulo puede salir como servicio independiente sin reescribir a los demás.' },
        { t: 'callout', tone: 'warn', title: 'El precio', html: 'El propio ADR lo admite: sin disciplina en la comunicación entre módulos, será “solo un monolito con tendencia hacia la gran bola de lodo”. Contratos internos, telemetría por módulo y revisión constante son el contrapeso.' },
      ],
    },
    {
      id: 'pizarra',
      kicker: 'La evidencia',
      title: 'El post-it que anticipó todo',
      visual: { scene: 'whiteboard' },
      evidence: { src: '/img/whiteboard-menu-plugins.png', alt: 'Pizarra original del equipo: el menú como núcleo rodeado de plug-ins y un post-it', caption: 'La pizarra original de la sesión de diseño detallado del 29 de octubre de 2020.' },
      describe: '<p>El núcleo Menu en el centro, rodeado de extensiones: nutrición, recomendaciones, reviews, descuentos, front-end, comidas y filtrado. El núcleo vive en una máquina de 4 núcleos y 8 GB. Aparte, una pieza de 1 núcleo y 2 GB con balanceador y su propio paquete, que escala sola, conectada por mensajes. Un post-it fija la política: comunicación por mensajería, pensada para desacoplar después, y caché si el núcleo se congestiona.</p>',
      blocks: [
        { t: 'p', html: 'El repositorio guarda también el paso intermedio entre la conversación y el diagrama pulido: la pizarra real de una sesión de diseño del 29 de octubre de 2020.' },
        { t: 'p', html: 'Recorrela en el diagrama. La asimetría entre la caja grande y la chica ya insinúa el monolito modular, y el post-it lo dice con todas las letras.' },
        { t: 'p', html: 'Diseñar para la extracción futura no salió de un libro: salió de una sesión con marcadores.' },
      ],
    },
    {
      id: 'descartes',
      kicker: 'Los descartes',
      title: 'Los dos extremos, descartados por escrito',
      visual: { scene: 'spectrum' },
      blocks: [
        { t: 'p', html: 'Por si queda alguna duda sobre el espectro de opciones: el equipo también descartó los dos extremos, y dejó escrito por qué.' },
        { t: 'p', html: 'El monolito modular es el <strong>punto medio deliberado</strong>. Tocá cada punto del espectro para leer la cita.' },
      ],
    },
    {
      id: 'contrapunto',
      kicker: 'El contrapunto',
      title: 'Myagis-Forest tomó la salida opuesta',
      visual: { scene: 'fork' },
      blocks: [
        { t: 'p', html: 'La otra finalista miró la misma bifurcación y eligió lo contrario, también por escrito.' },
        { t: 'p', html: 'Su ADR 001 rechaza de forma explícita el camino por etapas (primero monolito modular, después microservicios) y apuesta a microservicios con Docker desde el día uno.' },
        { t: 'p', html: 'Dos equipos serios, salidas opuestas: la primera ley de la arquitectura funcionando en la práctica, no en la teoría.' },
      ],
    },
    {
      id: 'leccion',
      kicker: 'La lección',
      title: 'La pregunta estaba mal formulada',
      visual: { scene: 'reframe' },
      blocks: [
        { t: 'p', html: '“¿Monolito o microservicios?” está mal formulada desde el arranque. Invita a una discusión de gustos.' },
        { t: 'callout', tone: 'note', title: 'La lección transferible', html: 'La pregunta correcta: <strong>¿qué volumen real tengo, qué equipo tengo y cuánto cuesta cada estilo en ese contexto?</strong>' },
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
              q: '¿En qué consiste la Entity Trap?',
              options: ['Usar demasiadas bases de datos', 'Crear un componente por cada sustantivo del negocio', 'Elegir microservicios siempre', 'No documentar las entidades'],
              answer: 1,
              why: 'Suena ordenado, pero los flujos reales atraviesan todas las cajas. El equipo modeló acciones de actores.',
            },
            {
              q: 'En el mapa de valores, los microservicios promueven casi todo. ¿Por qué no ganaron?',
              options: ['Porque eran caros de licenciar', 'Porque el contexto (equipo chico, salida rápida) pesa más que la cantidad de “++”', 'Porque AWS no los soporta', 'Porque el jurado los prohibía'],
              answer: 1,
              why: 'Pierden justo en facilidad de despliegue e integridad, lo que más importa con un equipo chico y poco tiempo.',
            },
            {
              q: '¿Qué permite extraer un módulo del monolito modular sin reescribir a los demás?',
              options: ['Tener una sola base de datos', 'Que los módulos se hablen por contratos, como si hubiera red', 'Usar un lenguaje moderno', 'Desplegar todo en una sola máquina'],
              answer: 1,
              why: 'La frontera ya existía: el módulo extraído recibe los mismos mensajes que antes.',
            },
            {
              q: '¿Qué riesgo admite el propio ADR 002?',
              options: ['Que AWS aumente sus precios', 'Que sin disciplina el monolito termine como una gran bola de lodo', 'Que el equipo no sepa Docker', 'Ninguno'],
              answer: 1,
              why: 'Un ADR honesto nombra su precio. El contrapeso: contratos internos, telemetría y revisión constante.',
            },
          ],
        },
      },
      blocks: [
        { t: 'p', html: 'Repasá lo esencial antes de seguir.' },
        { t: 'p', html: 'Un monolito modular solo funciona si los módulos están bien cortados. ¿Dónde se corta? Eso es el próximo capítulo.' },
      ],
    },
  ],
};
