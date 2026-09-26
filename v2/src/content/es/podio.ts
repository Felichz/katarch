import type { Chapter } from '../types';
import { c } from '../helpers';

export const podio: Chapter = {
  id: 'podio',
  number: 2,
  phase: 'El problema',
  title: 'El dilema del podio',
  subtitle: 'Diez equipos, el mismo pliego. Tres finalistas con respuestas opuestas a una sola pregunta, y la vara real con la que los midió el jurado.',
  minutes: 7,
  learn: [
    'Comparar las tres posturas finalistas como respuestas distintas a la <strong>misma pregunta económica</strong>.',
    'Explicar por qué ninguna de las tres es “la correcta” (primera ley).',
    'Nombrar los siete criterios con los que el jurado evaluó cada propuesta.',
  ],
  steps: [
    {
      id: 'cover',
      layout: 'cover',
      title: 'El dilema del podio',
      blocks: [
        { t: 'p', html: 'Con el número del capítulo anterior en la mano (menos de una petición por segundo), toca ver qué hicieron con él los equipos que compitieron. Este capítulo es una bisagra: cierra el problema y abre la pregunta de cómo se piensa.' },
      ],
    },
    {
      id: 'pregunta',
      kicker: 'La pregunta',
      title: 'Diez equipos, un mismo pliego',
      visual: { scene: 'teams' },
      blocks: [
        { t: 'p', html: 'Diez equipos recibieron exactamente el pliego que acabás de recorrer. Las soluciones finalistas se repartieron en <strong>tres posturas opuestas</strong> sobre la misma pregunta.' },
        { t: 'p', html: 'No es una pregunta técnica: es económica. ¿Cuánta maquinaria comprar hoy para un negocio que hoy vende 42 comidas al día?' },
      ],
    },
    {
      id: 'archcolider',
      kicker: 'Tres posturas',
      title: 'ArchColider: barato hoy, partible mañana',
      visual: { scene: 'styles', state: 'arch' },
      describe: '<p>Cinco módulos (catálogo, órdenes, pagos, lealtad, reportes) dentro de una sola aplicación, separados por fronteras estrictas, sobre una sola base de datos y pocas máquinas de AWS.</p>',
      blocks: [
        { t: 'p', html: 'El equipo que después ganó concluyó que montar infraestructura distribuida para ese volumen era tirar plata y tiempo.' },
        { t: 'p', html: `Propuso un ${c('monolito-modular', 'monolito dividido en módulos con fronteras estrictas')}, en pocas máquinas de AWS: barato hoy, fácil de partir mañana si hace falta.` },
        { t: 'p', html: 'Mirá el diagrama: los mismos cinco módulos van a reorganizarse en las dos pantallas siguientes.' },
      ],
    },
    {
      id: 'myagis',
      kicker: 'Tres posturas',
      title: 'Myagis-Forest: microservicios desde el día uno',
      visual: { scene: 'styles', state: 'forest' },
      describe: '<p>Los mismos cinco módulos, ahora como microservicios independientes: cada uno con su contenedor, su base de datos y su despliegue, comunicándose por la red.</p>',
      blocks: [
        { t: 'p', html: 'El segundo puesto argumentó exactamente lo contrario: partir un monolito después significa <strong>hacer el trabajo dos veces</strong>.' },
        { t: 'p', html: 'Montó microservicios desde el primer día, con un modelado de dominio impecable. El precio: un costo fijo de operación mucho más alto para una startup que recién valida su mercado.' },
      ],
    },
    {
      id: 'jedis',
      kicker: 'Tres posturas',
      title: 'Jedis: todo pasa por un bus de eventos',
      visual: { scene: 'styles', state: 'jedis' },
      describe: '<p>Los mismos cinco módulos, conectados a un bus de eventos (Kafka) por el que circula en tiempo real cada movimiento de stock y cada compra.</p>',
      blocks: [
        { t: 'p', html: 'El tercer puesto apostó a la analítica futura: una plataforma centrada en un <strong>bus de eventos</strong> que registra en tiempo real cada movimiento de stock y cada compra.' },
        { t: 'p', html: 'Habilita recomendaciones y datos en vivo, sosteniendo una plataforma de mensajería sobredimensionada durante los primeros meses.' },
      ],
    },
    {
      id: 'compensacion',
      kicker: 'Ninguna es la correcta',
      title: 'Tres apuestas, tres precios',
      visual: { scene: 'bets' },
      blocks: [
        { t: 'p', html: 'Ninguna de las tres es “la correcta”. Cada postura decide qué <strong>no</strong> pagar hoy, y acepta un precio distinto a cambio.' },
        { t: 'p', html: 'Es la primera ley de Richards &amp; Ford, que los propios jueces repiten en cada kata: <em>en arquitectura no hay decisiones correctas o incorrectas, todo es una compensación</em>.' },
        { t: 'callout', tone: 'note', title: 'Todavía sin veredicto', html: 'Por qué convenció la primera postura se ve con números dos capítulos más adelante. Antes hay que entender cómo razonó el equipo.' },
      ],
    },
    {
      id: 'jurado',
      kicker: 'La vara del jurado',
      title: '¿Qué premió el jurado?',
      visual: { scene: 'rubric', state: 'hidden', props: { correct: 3 } },
      blocks: [
        { t: 'p', html: 'El jurado de semifinales reunió a cuatro arquitectos de primer nivel. Su deck de evaluación está en el repositorio del equipo, con la rúbrica por escrito.' },
        {
          t: 'predict',
          question: '¿Qué te parece que midió el jurado en cada propuesta?',
          options: [
            { label: 'Qué tan moderna era la tecnología elegida', feedback: 'Ninguno de los siete criterios habla de modernidad.' },
            { label: 'El diagrama más vistoso', feedback: 'Los diagramas cuentan, pero por su claridad y completitud, no por lo vistosos.' },
            { label: 'La solución más barata', feedback: 'El costo importa, pero no hay un criterio de “gana la más barata”.' },
            { label: 'Si el razonamiento se puede seguir, del negocio a la decisión', correct: true, feedback: '<strong>Eso.</strong> La rúbrica mide trazabilidad: entender el problema, justificar cada decisión y contarlo con claridad.' },
          ],
        },
      ],
    },
    {
      id: 'rubrica',
      kicker: 'La vara del jurado',
      title: 'Siete criterios por escrito',
      visual: { scene: 'rubric', state: 'full' },
      describe: '<ol><li>Claridad de narrativa, organización y documentación de apoyo.</li><li>Entendimiento de los requerimientos y completitud de la solución.</li><li>Identificación de las características arquitectónicas de soporte.</li><li>Diagramas: tipos, nivel de detalle y completitud.</li><li>Arquitectura general del sistema.</li><li>Integración con los sistemas de terceros requeridos.</li><li>ADRs: documentación y justificación de las decisiones.</li></ol>',
      blocks: [
        { t: 'p', html: `“Calidad del razonamiento” no era una impresión vaga. El tercer criterio pide identificar los ${c('quality-attributes', 'atributos de calidad')} que importan; el último, justificar cada decisión.` },
        { t: 'p', html: 'Abrí cada criterio en el diagrama. El jurado no premiaba el dibujo más vistoso sino la <strong>trazabilidad completa</strong>: del negocio a la decisión, y de la decisión a su costo.' },
        { t: 'p', html: 'Es la misma vara con la que se puede medir cualquier propuesta de arquitectura, dentro o fuera de un concurso.' },
      ],
    },
    {
      id: 'checkpoint',
      kicker: 'Checkpoint',
      title: 'Tres preguntas antes de seguir',
      visual: {
        scene: 'quiz',
        props: {
          questions: [
            {
              q: '¿Qué pregunta respondieron de formas opuestas los tres finalistas?',
              options: ['Qué lenguaje de programación usar', 'Cuánta maquinaria comprar hoy para un negocio de 42 comidas al día', 'Qué nube elegir', 'Cómo diseñar la app móvil'],
              answer: 1,
              why: 'Las tres posturas son tres respuestas a la misma pregunta económica: cuánto sistema construir hoy, y qué se deja para después.',
            },
            {
              q: 'Myagis-Forest eligió microservicios desde el día uno. ¿Cuál fue su argumento?',
              options: ['Que eran más baratos de operar', 'Que partir un monolito después es hacer el trabajo dos veces', 'Que el jurado los prefería', 'Que Kafka los exigía'],
              answer: 1,
              why: 'Es un argumento serio. El precio que aceptó fue un costo fijo de operación más alto mientras el negocio se valida.',
            },
            {
              q: '¿Qué dice la primera ley de la arquitectura de software?',
              options: ['El porqué importa más que el cómo', 'Todo es una compensación: no hay decisiones correctas o incorrectas', 'Los microservicios siempre escalan mejor', 'La solución más simple siempre gana'],
              answer: 1,
              why: '“El porqué importa más que el cómo” es la segunda ley, y aparece en el próximo capítulo.',
            },
          ],
        },
      },
      blocks: [
        { t: 'p', html: 'Repasá lo esencial antes de seguir.' },
        { t: 'p', html: 'Para entender por qué el razonamiento de ArchColider convenció, hay que retroceder un paso: antes de dibujar una sola caja, el equipo se fijó <strong>reglas de juego propias</strong>. Eso es lo próximo.' },
      ],
    },
  ],
};
