import type { Chapter } from '../types';
import { c, doc } from '../helpers';

export const principios: Chapter = {
  id: 'principios',
  number: 3,
  phase: 'El marco de decisión',
  title: 'Las reglas antes del primer diagrama',
  subtitle: 'Primero se lee el negocio, después se fijan criterios de desempate, y recién después se diseña. El orden es el método.',
  minutes: 11,
  learn: [
    'Reconocer el orden del método: <strong>leer el negocio</strong> antes de dibujar.',
    'Explicar los cuatro principios del equipo y de qué restricción sale cada uno.',
    'Seguir la <strong>trazabilidad</strong> de un objetivo de negocio hasta un requerimiento arquitectónico.',
    'Leer y escribir un ADR: contexto, decisión y consecuencias, incluidas las negativas.',
  ],
  extraDocs: ['business-goal', 'constraints', 'functional-reqs', 'questions', 'glossary', 'adr-001'],
  steps: [
    {
      id: 'cover',
      layout: 'cover',
      title: 'Las reglas antes del primer diagrama',
      blocks: [
        { t: 'p', html: 'El capítulo anterior dejó una idea: el jurado premió la calidad del razonamiento. Este capítulo muestra cómo se <strong>hace</strong> ese razonamiento, en el mismo orden en que lo hizo el equipo.' },
      ],
    },
    {
      id: 'semana-cero',
      kicker: 'Semana cero',
      title: 'Una semana sin un solo diagrama',
      visual: { scene: 'weekzero' },
      blocks: [
        { t: 'p', html: 'El repositorio del equipo ganador tiene una particularidad reveladora: durante la primera semana no hay un solo diagrama de software.' },
        { t: 'p', html: 'Hay documentos de negocio: objetivos, restricciones, preguntas al cliente, un glosario de vocabulario. Podés abrir cada uno desde el panel.' },
        { t: 'callout', tone: 'note', title: 'La primera renuncia del método', html: 'No empezar por la solución. Leer el negocio es aburrido, y por eso funciona.' },
      ],
    },
    {
      id: 'releer',
      kicker: 'Semana cero',
      title: 'Releer el pliego en voz alta',
      visual: { scene: 'reqs' },
      describe: '<p>Los ocho requerimientos del pliego, cada uno releído como escenario de uso. El primero, integrarse con las heladeras, quedó marcado como vago y probablemente fuera de alcance, porque ya lo resolvía el sistema de gestión de las heladeras. El tercero y el cuarto se agrupan: acompañar a los ocasionales y soportar efectivo.</p>',
      blocks: [
        { t: 'p', html: `El pliego había llegado como <strong>ocho requerimientos crudos</strong>. La primera tarea fue releerlo y reescribirlo como escenarios de uso ${doc('functional-reqs')}.` },
        { t: 'p', html: 'El primero, integrarse con las heladeras, quedó marcado como <em>“vago y probablemente fuera de alcance: requiere clarificación”</em>: esa integración ya la hacía el sistema de gestión de las heladeras.' },
        { t: 'p', html: 'Cuestionar el pliego antes de cumplirlo es la segunda herramienta del arquitecto.' },
      ],
    },
    {
      id: 'preguntas',
      kicker: 'Semana cero',
      title: 'Preguntar en vez de inventar',
      visual: { scene: 'questions' },
      blocks: [
        { t: 'p', html: `Las preguntas no son genéricas. El equipo le escribió al cliente una lista concreta ${doc('questions')}, con los casos límite que un desarrollador suele descubrir tarde, en producción.` },
        { t: 'p', html: 'En vez de <strong>inventar</strong> una respuesta conveniente para cada ambigüedad, la anotan y la mandan al dueño del negocio. Cada respuesta puede cambiar el diseño; inventarla lo habría escondido.' },
      ],
    },
    {
      id: 'marco',
      kicker: 'El marco',
      title: 'Viewpoints and Perspectives',
      visual: { scene: 'views' },
      evidence: { src: '/img/view-context.png', alt: 'Mapa de vistas del equipo: despliegue, operacional, desarrollo y estructura del software', caption: 'El mapa de vistas del propio equipo, en la carpeta de vistas y perspectivas del repositorio.' },
      describe: '<p>La estructura del software se compone de tres vistas: funcional, de información y de concurrencia. La vista de despliegue define cómo se despliega; la operacional, cómo se opera; la de desarrollo, sus restricciones de implementación. Las perspectivas, como seguridad o performance, atraviesan todas las vistas.</p>',
      blocks: [
        { t: 'p', html: 'Recién después aparece el método que ordenó el resto del trabajo: <strong>Viewpoints and Perspectives</strong>, el marco de Rozanski &amp; Woods.' },
        { t: 'p', html: 'Describe una arquitectura desde varias <strong>vistas</strong> (funcional, información, concurrencia, despliegue…) cruzadas con <strong>perspectivas</strong>: los atributos de calidad que atraviesan a todas.' },
        { t: 'p', html: 'No hace falta memorizarlo: cada vista reaparece en su capítulo.' },
      ],
    },
    {
      id: 'principios',
      kicker: 'Principios',
      title: 'Cuatro criterios de desempate',
      visual: { scene: 'principles', state: 'list' },
      describe: '<ol><li>Simplicidad cognitiva: si una opción no se puede explicar con facilidad, se descarta.</li><li>Evolucionabilidad sobre optimización prematura: módulos fáciles de extraer mañana, sin extraerlos hoy.</li><li>Telemetría obligatoria: cada módulo se mide.</li><li>Mensajes antes que llamadas directas.</li></ol>',
      blocks: [
        { t: 'p', html: 'Antes de aplicar el marco, el equipo firmó cuatro principios rectores. Su función es práctica: cuando dos diseñadores se atascan discutiendo opciones, <strong>los principios desempatan</strong>.' },
        {
          t: 'list',
          items: [
            '<strong>Simplicidad cognitiva.</strong> La complejidad que no se justifica sola no se compra.',
            '<strong>Evolucionabilidad sobre optimización prematura.</strong> Diseñar para extraer mañana, sin extraer hoy.',
            `<strong>${c('telemetry', 'Telemetría')} obligatoria.</strong> Las decisiones de escala se toman con datos.`,
            '<strong>Mensajes antes que llamadas directas.</strong> Ninguna parte depende de que otra esté viva en ese instante.',
          ],
        },
      ],
    },
    {
      id: 'destilados',
      kicker: 'Principios',
      title: 'Los principios se destilan de las restricciones',
      visual: { scene: 'principles', state: 'map' },
      describe: '<p>Equipo chico y presupuesto mínimo llevan a la simplicidad cognitiva. La meta de pasar de 2 a 68 locaciones, a la evolucionabilidad. El costo de escalar a ciegas, a la telemetría obligatoria. Los sistemas externos que no controlan, a preferir mensajes antes que llamadas.</p>',
      blocks: [
        { t: 'p', html: 'Ninguno es filosofía abstracta: cada uno responde a una presión concreta del caso. Mirá cómo se conectan en el diagrama.' },
        { t: 'p', html: 'Y el orden importa: fijar criterios de desempate <em>antes</em> de discutir tecnologías es lo que evita que la discusión se convierta en una guerra de gustos.' },
        { t: 'callout', tone: 'info', title: 'Para llevarte', html: 'Los buenos principios no se inventan: se <strong>destilan de las restricciones</strong>.' },
      ],
    },
    {
      id: 'trazabilidad',
      kicker: 'Trazabilidad',
      title: 'Del objetivo de negocio al requerimiento',
      visual: { scene: 'trace', state: 'predict', props: { correct: 1 } },
      blocks: [
        { t: 'p', html: `Entre los documentos hay uno que es casi solo una tabla ${doc('business-drivers')}: conecta cada <em>impulsor</em> de negocio con los requerimientos que realmente van a moldear la arquitectura.` },
        {
          t: 'predict',
          question: 'El impulsor 1 es convertir ocasionales en suscriptores. ¿Cuál de estos requerimientos sale de ahí?',
          options: [
            { label: 'Microservicios desde el primer día', feedback: 'Eso es una solución, no un requerimiento. Los impulsores hablan del negocio.' },
            { label: 'Poder comprar sin registrarse antes', correct: true, feedback: '<strong>Exacto.</strong> Si el ocasional tiene que crear una cuenta para comprar, no compra. Mirá cuántos más salen del mismo impulsor.' },
            { label: 'Un panel de control para los nutricionistas', feedback: 'No figura en la tabla. Los especialistas de salud tienen su propio impulsor, el 6.' },
          ],
        },
      ],
    },
    {
      id: 'tabla',
      kicker: 'Trazabilidad',
      title: 'La tabla que lo decide todo',
      visual: { scene: 'trace', state: 'full' },
      describe: '<p>Seis impulsores de negocio y diez requerimientos arquitectónicamente significativos. Por ejemplo: maximizar la garantía de retiro de cada comida sale de los impulsores 1 y 5, y termina justificando el retiro offline por PIN del capítulo 6.</p>',
      blocks: [
        { t: 'p', html: `El equipo llamó a estos requerimientos, con un chiste que quedó en su guion de presentación ${doc('script')}, los <strong>SAD</strong>: “los drivers que ponen triste al arquitecto”, porque muestran cuánto trabajo hay.` },
        { t: 'p', html: 'Fijate en el último: <strong>maximizar la garantía de retiro de cada comida</strong>. Vuelve en el capítulo 6 y termina justificando el retiro offline por PIN.' },
        { t: 'p', html: 'Esa continuidad (objetivo de negocio → requerimiento → decisión → ADR) es lo que los jueces llaman trazabilidad. Es la columna vertebral de una arquitectura defendible.' },
      ],
    },
    {
      id: 'adr',
      kicker: 'El cuaderno',
      title: 'Donde se anotan las decisiones',
      visual: { scene: 'adr' },
      blocks: [
        { t: 'p', html: `Queda una pieza más, la que da nombre a media docena de archivos del repositorio: el ${c('adr', 'ADR')} (<em>Architecture Decision Record</em>). Un documento cortito que registra una decisión en tres partes.` },
        { t: 'p', html: 'El primer ADR del equipo es, justamente, la decisión de usar ADRs. El formato lo popularizó Michael Nygard.' },
        { t: 'callout', tone: 'warn', title: 'La regla de oro', html: 'Un ADR que no admite desventajas es propaganda, no una decisión.' },
        { t: 'p', html: 'ArchColider entregó dieciséis. Vas a encontrarlos en su momento exacto, cuando aparezca el problema que los motivó.' },
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
              q: '¿Qué hizo el equipo durante la primera semana?',
              options: ['Elegir la nube y el lenguaje', 'Dibujar el diagrama de despliegue', 'Leer el negocio: objetivos, restricciones, preguntas y glosario', 'Programar un prototipo'],
              answer: 2,
              why: 'Cero diagramas de software: primero se entiende el negocio.',
            },
            {
              q: 'Un requerimiento del pliego parece vago. ¿Qué hace el equipo?',
              options: ['Lo interpreta como le conviene', 'Lo ignora', 'Lo marca, escribe la pregunta y se la manda al cliente', 'Lo implementa igual por si acaso'],
              answer: 2,
              why: 'Preguntar en vez de inventar: cada respuesta del cliente puede cambiar el diseño.',
            },
            {
              q: '¿De dónde salen los buenos principios de arquitectura?',
              options: ['De los libros de moda', 'De las restricciones concretas del caso', 'De la experiencia previa del equipo con otras tecnologías', 'Del jurado'],
              answer: 1,
              why: 'Equipo chico → simplicidad; crecimiento → evolucionabilidad; escalar a ciegas → telemetría; sistemas ajenos → mensajes.',
            },
            {
              q: '¿Qué tiene que incluir un buen ADR en sus consecuencias?',
              options: ['Solo las ventajas', 'El código de la solución', 'También las desventajas y riesgos que se aceptan', 'La lista de tecnologías usadas'],
              answer: 2,
              why: 'Un ADR sin desventajas es propaganda. Segunda ley: el porqué importa más que el cómo.',
            },
          ],
        },
      },
      blocks: [
        { t: 'p', html: 'Repasá lo esencial antes de seguir.' },
        { t: 'p', html: 'Con las reglas fijadas, llega la decisión madre de todo el caso: <strong>¿una sola pieza o muchas?</strong>' },
      ],
    },
  ],
};
