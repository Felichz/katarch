import type { Chapter } from '../types';
import { c, doc } from '../helpers';

export const terreno: Chapter = {
  id: 'terreno',
  number: 1,
  phase: 'El problema',
  title: 'El terreno de juego',
  subtitle: 'El negocio, sus piezas físicas, quién compra, qué ya existía y el número que gobierna todo el caso.',
  minutes: 9,
  learn: [
    'Describir las tres piezas físicas del negocio y los tres tipos de usuario.',
    'Separar lo que el arquitecto <strong>recibe hecho</strong> de lo que tiene que <strong>construir</strong>.',
    'Calcular el volumen real del sistema y guardarlo como criterio para todo lo que sigue.',
  ],
  steps: [
    {
      id: 'cover',
      layout: 'cover',
      title: 'El terreno de juego',
      blocks: [
        {
          t: 'p',
          html: `Los ${c('kata', 'Architecture Katas')} son competencias donde equipos de ingenieros reciben el pliego de una empresa real y tienen unas semanas para diseñar la arquitectura completa, defendida ante un jurado. En otoño de 2020 el caso fue <strong>Farmacy Food</strong>, y este curso reconstruye paso a paso cómo razonó el equipo ganador, <strong>ArchColider</strong>, con los documentos reales de su repositorio.`,
        },
      ],
    },

    /* ── el negocio ── */
    {
      id: 'mision',
      kicker: 'El negocio',
      title: 'Comida como medicina, a precio de comida rápida',
      visual: { scene: 'mission' },
      blocks: [
        {
          t: 'p',
          html: 'Farmacy Food vende comida saludable y personalizada a precio accesible en comunidades de Detroit, donde conseguir comida fresca es difícil.',
        },
        {
          t: 'p',
          html: 'Su lema se toma al pie de la letra: viandas armadas alrededor de necesidades médicas concretas (diabetes, celiaquía, dietas prescriptas) y vendidas a precio de comida rápida.',
        },
        {
          t: 'p',
          html: `Para no pagar el rubro más caro del negocio, los restaurantes, la empresa opera con <strong>tres piezas físicas</strong> que ya funcionaban cuando empezó el kata. El ${c('rfp', 'pliego del cliente')} las describía una por una.`,
        },
      ],
    },

    /* ── piezas físicas ── */
    {
      id: 'cocinas',
      kicker: 'Las piezas físicas',
      title: 'Donde se cocina: las ghost kitchens',
      visual: { scene: 'ecosystem', state: 'kitchen' },
      describe:
        '<p>Una sola pieza: la ghost kitchen, una cocina sin salón. De ella salen viandas por lotes hacia los puntos de venta.</p>',
      blocks: [
        {
          t: 'p',
          html: 'Cocinas que cocinan únicamente para despacho y retiro, sin salón. Ya usaban un software especializado, <strong>ChefTec</strong>, para costear recetas y controlar insumos.',
        },
        {
          t: 'p',
          html: 'Un detalle que va a importar: no cocinan las 24 horas. Producen <strong>por lotes</strong>, con uno o dos ciclos de cocina por día.',
        },
      ],
    },
    {
      id: 'heladeras',
      kicker: 'Las piezas físicas',
      title: 'Donde se vende sola: la heladera inteligente',
      visual: { scene: 'ecosystem', state: 'fridge' },
      describe:
        '<p>La cocina abastece a una heladera inteligente. La heladera vende sin personal: tarjeta, puerta, lectura RFID y cobro automático.</p>',
      blocks: [
        {
          t: 'p',
          html: 'Heladeras de autoservicio provistas por <strong>Byte Technology</strong>. El cliente desliza su tarjeta, la puerta se destraba y retira los platos.',
        },
        {
          t: 'p',
          html: 'Al cerrarse la puerta, antenas internas leen las etiquetas <strong>RFID</strong> (chips pegados a cada vianda, leídos por radio) y el consumo se cobra automáticamente. Nadie atiende.',
        },
      ],
    },
    {
      id: 'kioscos',
      kicker: 'Las piezas físicas',
      title: 'Donde vende una persona: el kiosco',
      visual: { scene: 'ecosystem', state: 'kiosk' },
      describe:
        '<p>Tercera pieza: el kiosco con cajero. La cocina abastece a la heladera y al kiosco.</p>',
      blocks: [
        {
          t: 'p',
          html: 'Heladeras comunes en espacios subalquilados: gimnasios, clínicas, cafeterías aliadas.',
        },
        {
          t: 'p',
          html: 'Acá sí hay una persona detrás del mostrador, cobrando con terminales comerciales <strong>Toast POS</strong>, que ya tenían API propia.',
        },
        {
          t: 'callout',
          tone: 'note',
          title: 'Fijate en el dibujo',
          html: 'Una cocina, dos maneras de vender: una sin personas y otra con personas. Cada una va a traer problemas técnicos distintos.',
        },
      ],
    },

    /* ── usuarios ── */
    {
      id: 'usuarios',
      kicker: 'Quién compra',
      title: 'Tres usuarios, tres formas de pagar',
      visual: { scene: 'ecosystem', state: 'users' },
      describe:
        '<p>El conocido y el suscriptor compran en la heladera, identificados por su tarjeta o su cuenta. El ocasional compra en el kiosco, en efectivo: esa venta no le avisa nada al sistema central.</p>',
      blocks: [
        { t: 'p', html: 'El pliego también define quién compra. No es un dato de marketing: <strong>la forma de pagar de cada usuario genera problemas técnicos distintos</strong>.' },
        {
          t: 'cards',
          cards: [
            { title: 'Ocasional', tag: 'efectivo, sin cuenta', html: 'Elige mirando la vitrina y paga en la caja del kiosco. El negocio quiere convertirlo en conocido.' },
            { title: 'Conocido', tag: 'cuenta + tarjeta', html: 'Navega el catálogo, reserva y paga desde la app. La heladera lo reconoce por la tarjeta.' },
            { title: 'Suscriptor', tag: 'menú semanal', html: 'El cliente ideal: prepaga su menú de la semana y retira cada día. Carga predecible, a cambio de cancelaciones y reembolsos.' },
          ],
        },
        { t: 'callout', tone: 'warn', title: 'Dato para después', html: 'La compra en efectivo del ocasional <strong>no le dice nada al sistema central en tiempo real</strong>. Guardalo: vuelve cuando aparezca el dinero.' },
      ],
    },
    {
      id: 'stakeholders',
      kicker: 'Quién compra',
      title: 'Los que no compran, pero importan',
      visual: { scene: 'ecosystem', state: 'stakeholders' },
      describe:
        '<p>Además de los tres usuarios: el cajero del kiosco, que registra ventas en Toast POS; los nutricionistas, que buscan comidas por componente nutricional; y los proveedores de ingredientes, que quieren prever cuánto comprar.</p>',
      blocks: [
        { t: 'p', html: 'Hay una cuarta figura que se olvida con facilidad: el <strong>cajero del kiosco</strong>, que atiende a los ocasionales y registra sus ventas en el Toast POS.' },
        {
          t: 'p',
          html: `El análisis del equipo fue más lejos y sumó a los <strong>nutricionistas</strong> (buscan comidas por componente nutricional) y a los <strong>proveedores de ingredientes</strong> (quieren prever cuánto comprar) ${doc('stakeholders')}.`,
        },
        { t: 'callout', tone: 'info', title: 'Pregunta de arquitecto', html: '¿A quién más le importa este sistema, además de a los usuarios? Cada respuesta es alguien cuyas necesidades pueden moldear el diseño.' },
      ],
    },

    /* ── lo que ya existía ── */
    {
      id: 'sistemas',
      kicker: 'Lo que ya existía',
      title: 'Construir un puente, no el mundo entero',
      visual: { scene: 'ecosystem', state: 'systems' },
      describe:
        '<p>El dibujo cambia de vista: del mundo físico al software. En el centro, la Plataforma Central de Órdenes, lo único a construir. A la izquierda, los canales de entrada: heladeras (API de Byte), kioscos (API de Toast POS) y la app web y móvil. A la derecha, los sistemas que ya existían: cocinas (ChefTec), pagos (Stripe) y contabilidad (QuickBooks).</p>',
      blocks: [
        { t: 'p', html: 'El trabajo era acotado: construir la <strong>Plataforma Central de Órdenes</strong>, el puente entre los usuarios y las herramientas que la empresa ya tenía contratadas.' },
        {
          t: 'list',
          items: [
            '<strong>Byte Technology</strong>: qué viandas quedan en cada heladera, y cada cobro al cerrarse la puerta.',
            '<strong>Toast POS</strong>: las ventas que los cajeros registran en los kioscos.',
            '<strong>ChefTec</strong>: la lista consolidada de lo que las cocinas deben cocinar.',
            '<strong>Stripe</strong>: los cobros digitales de la app.',
            '<strong>QuickBooks</strong>: la contabilidad oficial.',
          ],
        },
        { t: 'p', html: 'El arquitecto no elige esas piezas: las recibe. Son <strong>restricciones</strong>.' },
      ],
    },
    {
      id: 'alcance',
      kicker: 'Lo que ya existía',
      title: 'Lo que no es problema del arquitecto',
      visual: { scene: 'ecosystem', state: 'scope' },
      describe:
        '<p>Un borde punteado marca el alcance del kata. Fuera del borde, tachados: la logística de camionetas, el firmware de las heladeras y cualquier movimiento de comida que no sea una compra.</p>',
      blocks: [
        { t: 'p', html: 'El pliego también era explícito sobre lo que <strong>no</strong> entraba: la logística de camionetas que reponen las heladeras, el firmware interno de las heladeras (propiedad de Byte) y cualquier movimiento de comida que no sea una compra de cliente.' },
        { t: 'callout', tone: 'note', title: 'La primera decisión', html: 'Definir qué <strong>no</strong> hay que resolver es la primera decisión de un arquitecto. Es el primer eslabón de una cadena de renuncias que recorre todo el caso.' },
      ],
    },

    /* ── los números ── */
    {
      id: 'numeros',
      kicker: 'Los números',
      title: 'El dato que lo cambia todo',
      visual: { scene: 'stats' },
      blocks: [
        { t: 'p', html: 'Lo que sigue separa una solución seria de una fantasiosa. El pliego declara el volumen actual y las metas del negocio.' },
        { t: 'p', html: 'Mirá la última cifra. Antes de explicarla, hacé la cuenta vos.' },
      ],
    },
    {
      id: 'cuenta',
      kicker: 'Los números',
      title: 'Hacé la cuenta antes de elegir herramientas',
      visual: { scene: 'rate', props: { correct: 3 } },
      describe:
        '<p>Una línea de tiempo de 24 horas con 42 puntos, uno por comida vendida, concentrados al mediodía y a la tarde. Al ampliar un segundo cualquiera en plena hora pico, hay cero ventas: 42 dividido 86.400 segundos da unas 0,0005 comidas por segundo.</p>',
      blocks: [
        {
          t: 'predict',
          question: 'Con ~42 comidas por día entre dos puntos de venta, ¿cuánto tráfico recibe el sistema en hora pico?',
          options: [
            { label: 'Miles de peticiones por segundo, como cualquier app', feedback: 'Eso es escala de una app masiva. Acá hay 42 ventas repartidas en un día entero.' },
            { label: 'Unas cien por segundo', feedback: 'Cien por segundo serían más de ocho millones por día. Compará con 42 ventas.' },
            { label: 'Alrededor de diez por segundo', feedback: 'Todavía es muchísimo: diez por segundo son 864.000 por día.' },
            { label: 'Prácticamente cero: menos de una por minuto', correct: true, feedback: '<strong>Eso.</strong> Una venta cada pocos minutos, en el peor caso. Incluso la meta anual queda por debajo de una petición por segundo.' },
          ],
        },
      ],
    },
    {
      id: 'crecer',
      kicker: 'Los números',
      title: '¿Y cuando crezca?',
      visual: { scene: 'growth' },
      describe:
        '<p>Locaciones: 2 el día 1, 8 durante 2021, 68 como meta a 12 meses. Volumen semanal: ~300 comidas hoy, 1.500 a 2.000 en la meta anual y ~10.000 en el escenario de crecimiento rápido, contra una vara de 604.800 por semana, que equivale a una petición por segundo sostenida.</p>',
      blocks: [
        { t: 'p', html: 'El pliego guardaba dos números fáciles de pasar por alto: el crecimiento inmediato, de 2 a <strong>8 locaciones durante 2021</strong>, y el consumo de un suscriptor: <strong>~10 comidas por semana</strong>.' },
        { t: 'p', html: 'Con esa matemática, 1.000 suscriptores son unas 10.000 comidas semanales: exactamente el escenario de crecimiento rápido de la planilla de costos que vas a ver al final del curso.' },
        { t: 'callout', tone: 'warn', title: 'Guardá este número', html: 'Menos de <strong>una petición por segundo</strong>, hoy y en la meta. Todavía no sabés para qué sirve. Explica casi todas las decisiones que vienen.' },
      ],
    },

    /* ── el mapa ── */
    {
      id: 'contexto',
      kicker: 'El mapa completo',
      title: 'Todo el terreno en un solo dibujo',
      visual: { scene: 'ecosystem', state: 'complete' },
      describe:
        '<p>Diagrama de contexto: los canales de entrada (heladeras, kioscos, app) envían a la Plataforma Central de Órdenes, que a su vez habla con las cocinas (ChefTec), los pagos (Stripe) y la contabilidad (QuickBooks). Solo la plataforma central se construye; todo lo demás ya existía.</p>',
      blocks: [
        { t: 'p', html: 'Con el negocio, los actores y los números sobre la mesa, todo entra en un dibujo: un <strong>diagrama de contexto</strong>. Muestra los límites del sistema y con quién habla, sin decir nada todavía de cómo está hecho por dentro.' },
        { t: 'p', html: 'Recién ahora cada caja y cada flecha debería resultarte conocida. Recorré las piezas en el diagrama para repasarlas.' },
      ],
    },

    /* ── checkpoint ── */
    {
      id: 'checkpoint',
      kicker: 'Checkpoint',
      title: 'Tres preguntas antes de seguir',
      visual: {
        scene: 'quiz',
        props: {
          questions: [
            {
              q: '¿Qué le toca construir al equipo de arquitectura?',
              options: [
                'Todo: heladeras, cajas, cocina y pagos',
                'Solo la Plataforma Central de Órdenes, conectando lo que ya existe',
                'El firmware de las heladeras y la logística de reposición',
                'Una app móvil y nada más',
              ],
              answer: 1,
              why: 'Heladeras (Byte), kioscos (Toast POS), cocina (ChefTec), pagos (Stripe) y contabilidad (QuickBooks) venían dados. Lo nuevo es el puente.',
            },
            {
              q: '¿Por qué el usuario ocasional es un desafío técnico?',
              options: [
                'Porque usa la app todo el tiempo',
                'Porque pide reembolsos con frecuencia',
                'Porque paga en efectivo y su compra no avisa al sistema central en tiempo real',
                'Porque tiene un menú semanal prepago',
              ],
              answer: 2,
              why: 'El efectivo pasa por la caja del kiosco. Para el sistema central, esa venta es invisible en el momento en que ocurre.',
            },
            {
              q: '¿Qué tráfico tiene que soportar el sistema, hoy y en la meta anual?',
              options: ['Miles de peticiones por segundo', 'Unas cien por segundo', 'Menos de una por segundo'],
              answer: 2,
              why: '~42 comidas por día en 2 locaciones, y aun la meta anual queda por debajo de una petición por segundo. Este número vuelve en el próximo capítulo.',
            },
          ],
        },
      },
      blocks: [
        { t: 'p', html: 'Sin nota ni apuro: el objetivo es que el capítulo te quede en la cabeza antes de pasar al siguiente.' },
        { t: 'p', html: 'En el próximo capítulo, los diez equipos reciben este mismo pliego, y los tres finalistas responden de formas opuestas a una sola pregunta: <strong>¿cuánta maquinaria comprar para 42 comidas por día?</strong>' },
      ],
    },
  ],
};
