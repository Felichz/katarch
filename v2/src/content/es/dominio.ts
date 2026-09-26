import type { Chapter } from '../types';
import { c, doc } from '../helpers';

export const dominio: Chapter = {
  id: 'dominio',
  number: 5,
  phase: 'El diseño',
  title: 'Qué se construye y qué se alquila',
  subtitle: 'Un monolito modular solo funciona si los módulos están bien cortados. Dónde se corta, cómo se protege lo que diferencia al negocio y qué se paga a otros.',
  minutes: 15,
  learn: [
    'Clasificar capacidades en <strong>core, soporte y genérico</strong> con dos preguntas.',
    'Explicar para qué sirve una <strong>capa anticorrupción</strong> y seguir un dato a través de ella.',
    'Reconocer una <strong>fachada</strong> que compra tiempo sin cerrar puertas.',
    'Leer el metamodelo: reglas arriba, hechos abajo.',
    'Asignar un presupuesto de calidad por subsistema preguntando qué pasa si falla.',
  ],
  steps: [
    {
      id: 'cover',
      layout: 'cover',
      title: 'Qué se construye y qué se alquila',
      blocks: [
        { t: 'p', html: 'El capítulo anterior eligió una sola aplicación dividida en módulos. Este decide dónde van las fronteras, y es el más visual del caso: cinco diagramas originales, redibujados para recorrerlos.' },
      ],
    },
    {
      id: 'vara',
      kicker: 'La vara',
      title: 'Dos preguntas para cada capacidad',
      visual: { scene: 'sorter' },
      blocks: [
        { t: 'p', html: `Para decidir los cortes, el equipo aplicó ${c('ddd', 'Domain-Driven Design')} en su nivel estratégico ${doc('solution-overview')}: clasificar cada capacidad según si es la ventaja competitiva, un soporte, o algo genérico que cualquier empresa necesita.` },
        { t: 'p', html: 'La prueba cabe en dos preguntas: <strong>¿esto diferencia a Farmacy Food? ¿ya existe hecho y probado?</strong> Dos “no” mandan la capacidad al cajón de alquilar, sin culpa.' },
        { t: 'p', html: 'Probalo vos antes de ver el mapa del equipo.' },
      ],
    },
    {
      id: 'mapa',
      kicker: 'La vara',
      title: 'El mapa estratégico del equipo',
      visual: { scene: 'domainmap' },
      evidence: { src: '/img/FF_StrategicDomainDesign.jpg', alt: 'Mapa original de subdominios estratégicos', caption: 'El mapa estratégico original: cada dominio ubicado por unicidad y complejidad.' },
      describe: '<p>Core, arriba a la derecha: lealtad, catálogo de comidas y órdenes. Soporte, arriba a la izquierda: opiniones y agenda de cocina. Genérico, abajo: reportes, notificaciones y pagos.</p>',
      blocks: [
        {
          t: 'cards',
          cards: [
            { title: 'Core', tag: 'construir a medida', html: 'Catálogo (disponibilidad por heladera, ingredientes, promociones), órdenes (suscripciones, cupones, pagos encadenados) y lealtad. Donde el negocio gana o pierde.' },
            { title: 'Soporte', tag: 'adaptar', html: 'Opiniones y la agenda de producción de las cocinas. Se necesitan, pero no diferencian.' },
            { title: 'Genérico', tag: 'alquilar', html: 'Reportes, pagos, notificaciones. Nadie gana ventaja construyendo su propio procesador de pagos.' },
          ],
        },
        { t: 'p', html: 'Esta foto decide el presupuesto: dónde va el mejor código propio y dónde se le paga a otro.' },
      ],
    },
    {
      id: 'aduana',
      kicker: 'La aduana',
      title: 'Proteger lo que diferencia',
      visual: { scene: 'acl', state: 'structure' },
      evidence: { src: '/img/menu-catalog-acl.png', alt: 'Diagrama original del servicio Menu Catalog con su capa anticorrupción', caption: 'El servicio Menu Catalog con su capa anticorrupción, del deck de la propuesta final.' },
      describe: '<p>El servicio Menu Catalog tiene una capa anticorrupción con tres piezas de traducción: Meals Offer, Loyalty y Menu Catalog API. Los externos (Ghost Kitchen, Loyalty Management, front-end y punto de venta) solo tocan esa capa. La capa le habla al dominio con comandos, y el dominio les habla a los consumidores internos (carrito, recomendaciones, reviews, filtrado) con eventos.</p>',
      blocks: [
        { t: 'p', html: 'Si el catálogo es lo que diferencia al negocio, hay que protegerlo de los formatos de los demás.' },
        { t: 'p', html: `Alrededor del <strong>Menu Catalog</strong> el equipo dibujó una ${c('acl', 'capa anticorrupción')}: una frontera por donde obligatoriamente entran la cocina, el programa de lealtad, la app y los kioscos.` },
        { t: 'p', html: 'Del dominio solo se sale hablando en comandos y eventos, la regla del post-it de la pizarra: nada de llamadas directas.' },
      ],
    },
    {
      id: 'aduana-flujo',
      kicker: 'La aduana',
      title: 'Un dato cruza la frontera',
      visual: { scene: 'acl', state: 'flow' },
      describe: '<p>La cocina publica que cocinó 40 lasañas en su propio formato. Meals Offer lo traduce al formato interno y se lo pasa al dominio. El dominio emite el evento de stock actualizado, que escuchan el carrito, las recomendaciones, los reviews y el filtrado.</p>',
      blocks: [
        { t: 'p', html: 'Seguile el camino a un dato: la cocina publica que cocinó 40 lasañas, en su formato. <strong>Meals Offer</strong> lo traduce. El dominio lo procesa y emite “stock actualizado”, que escuchan los consumidores.' },
        { t: 'p', html: 'Ni un dato crudo de un tercero tocó el dominio, y ningún consumidor tuvo que saber de dónde vino.' },
      ],
    },
    {
      id: 'aduana-fabrica',
      kicker: 'La aduana',
      title: 'Si el proveedor no publica eventos, la capa los fabrica',
      visual: { scene: 'acl', state: 'fabricate' },
      describe: '<p>Las heladeras de Byte exponen datos crudos por API, sin eventos. La capa anticorrupción los convierte en el mismo evento de catálogo actualizado que consume todo el sistema.</p>',
      blocks: [
        { t: 'p', html: 'El valor de la capa se mide en un detalle de los documentos internos: si las heladeras de Byte no publican eventos, <strong>la capa los fabrica</strong>.' },
        { t: 'p', html: 'Convierte los datos crudos de la API en el mismo evento “catálogo actualizado” que consume todo el sistema. El resto jamás se entera de la diferencia.' },
      ],
    },
    {
      id: 'wrapper',
      kicker: 'La aduana',
      title: 'Myagis-Forest llegó a lo mismo con otro nombre',
      visual: { scene: 'wrapper' },
      blocks: [
        { t: 'p', html: 'El contrapunto: el ADR 004 de Myagis-Forest aplica el patrón <strong>Wrapper</strong>. Ningún servicio de negocio habla directo con un tercero: cada sistema externo tiene su propio wrapper que traduce el contrato ajeno al estándar interno.' },
        { t: 'p', html: 'Mismo instinto (los formatos de afuera no tocan el dominio), distinta forma: en ArchColider la aduana es una capa dentro del módulo; en Myagis-Forest, un microservicio por tercero.' },
      ],
    },
    {
      id: 'fachada',
      kicker: 'Lo genérico',
      title: 'Pagos: una fachada delante de muchas redes',
      visual: { scene: 'facade' },
      evidence: { src: '/img/whiteboard-payment-facade.png', alt: 'Pizarra original: fachada de pagos hacia Visa, Mastercard y PayPal', caption: 'La fachada de pagos garabateada en la pizarra: un solo bloque interno reparte hacia cada red.' },
      describe: '<p>Órdenes y Suscripciones le hablan a una fachada de pagos propia. Hoy la fachada delega en un proveedor que conecta con Visa, Mastercard y PayPal. Mañana, si la expansión lo exige, la fachada puede empezar a hablar directo con una red, de a una, sin que los módulos se enteren.</p>',
      blocks: [
        { t: 'p', html: 'Los pagos muestran hasta dónde llega el pragmatismo con lo genérico. En la pizarra lo garabatearon sin rodeos: un único bloque de pago que reparte hacia Visa, Mastercard o PayPal.' },
        { t: 'p', html: 'Alterná entre <strong>hoy</strong> y <strong>mañana</strong> en el diagrama: comprar tiempo sin cerrar puertas.' },
        { t: 'decision', id: 'payment' },
      ],
    },
    {
      id: 'mapas',
      kicker: 'Lo genérico',
      title: 'Hasta el mapa, con la misma vara',
      visual: { scene: 'maps' },
      blocks: [
        { t: 'p', html: `Hasta el mapa para encontrar las heladeras se decidió igual. El ${doc('adr-015', 'ADR 015')} comparó cuatro proveedores por cuota gratuita y eligió <strong>Here Maps</strong>: sus 250.000 consultas mensuales gratis alcanzaban de sobra para el volumen real.` },
        { t: 'p', html: 'Es una decisión chica, y por eso sirve de calibre: no todo ADR es un cambio de estilo. Algunos son una tabla de precios y una alerta en el calendario.' },
      ],
    },
    {
      id: 'metamodelo',
      kicker: 'El metamodelo',
      title: 'El reglamento y el partido',
      visual: { scene: 'metamodel', state: 'levels' },
      evidence: { src: '/img/FF_Metamodel_v1.png', alt: 'Metamodelo original: nivel de conocimiento y nivel operacional', caption: 'El metamodelo original, con la línea punteada que separa reglas de hechos.' },
      describe: '<p>Arriba, el nivel de conocimiento: tipos de usuario, de acción, de orden, estados de orden, reglas y tipos de promoción, tipos de comida y de feedback. Abajo, el nivel operacional: usuario, acción, orden, feedback, agenda, promoción, menú, comida y ghost kitchen. Cada regla de arriba describe, limita o controla un hecho de abajo.</p>',
      blocks: [
        { t: 'p', html: `La visión general de la solución ${doc('solution-overview')} incluye un <em>metamodelo</em>. Separa dos niveles que suelen mezclarse:` },
        { t: 'list', items: ['<strong>Conocimiento:</strong> las reglas. Qué tipos de usuario existen, qué acciones puede hacer cada uno, qué promociones aplican a qué menús.', '<strong>Operacional:</strong> los hechos. Esta orden, este menú, esta cocina.'] },
        { t: 'p', html: 'El reglamento del torneo y el partido del domingo. Tocá las cajas: fijate en <strong>tipo de acción</strong>, las acciones de actores que esquivan la Entity Trap.' },
      ],
    },
    {
      id: 'metamodelo-promo',
      kicker: 'El metamodelo',
      title: 'Cambiar la campaña sin tocar el partido',
      visual: { scene: 'metamodel', state: 'promo' },
      describe: '<p>Una regla de promoción define un tipo de promoción, que se aplica a tipos de comida y se combina con tipos de orden. Abajo, una promoción concreta aplica esa regla a los ítems de un menú. Cambiar la campaña es tocar arriba.</p>',
      blocks: [
        { t: 'p', html: 'El beneficio es a futuro: cuando el negocio invente una promoción nueva o un perfil de usuario nuevo, cambia una regla de arriba sin reescribir lo de abajo.' },
        { t: 'p', html: 'Un ejemplo del propio documento: las promociones cuelgan de menús y de tipos de comida, <strong>nunca de comidas sueltas</strong>. Así una cocina puede ofrecer su propia promoción sin tocar el resto.' },
      ],
    },
    {
      id: 'presupuesto',
      kicker: 'Presupuesto de calidad',
      title: '¿Qué le pasa al negocio si esta pieza falla?',
      visual: { scene: 'composition' },
      evidence: { src: '/img/FF_system_approach.png', alt: 'Composición original del sistema con centros de gravedad y atributos de calidad', caption: 'La composición final, con los centros de gravedad en verde y el presupuesto de calidad de cada subsistema.' },
      describe: '<p>Front-end (app móvil y punto de venta): usabilidad, performance y autonomía. Catálogo (feedback, promociones, Menu Catalog, retiro): extensibilidad, mantenibilidad y disponibilidad. Órdenes (agenda y ordering): confiabilidad e integridad. Pasarela de compra: seguridad y disponibilidad. Notificaciones y reportes: confiabilidad. Centros de gravedad: Menu Catalog y Ordering.</p>',
      blocks: [
        { t: 'p', html: `El diseño se cerró con una idea que vale copiar ${doc('system-approach')}: los ${c('quality-attributes', 'atributos de calidad')} globales primero, y después <strong>un presupuesto propio por subsistema</strong>.` },
        { t: 'p', html: 'La lógica es reproducible: preguntar qué le pasa al negocio si esa pieza falla. El atributo dominante de cada subsistema es el que protege su parte del negocio. Tocá cada uno.' },
        { t: 'p', html: 'Los dos <strong>centros de gravedad</strong>, catálogo y órdenes, son donde vive casi todo el próximo capítulo.' },
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
              q: 'Pagos: ¿diferencia a Farmacy Food? No. ¿Existe hecho y probado? Sí. ¿Qué se hace?',
              options: ['Construirlo a medida con el mejor equipo', 'Alquilarlo: se integra un servicio existente', 'Adaptar una herramienta de soporte', 'Postergarlo'],
              answer: 1,
              why: 'Dos “no”: genérico. Nadie gana ventaja construyendo su propio procesador de pagos.',
            },
            {
              q: '¿Para qué sirve la capa anticorrupción del catálogo?',
              options: ['Para encriptar los datos', 'Para que los formatos de terceros mueran en la frontera y no toquen el dominio', 'Para balancear carga', 'Para guardar la caché'],
              answer: 1,
              why: 'Traduce lo ajeno al lenguaje interno, y hasta fabrica eventos cuando el proveedor no los publica.',
            },
            {
              q: '¿Qué compra la fachada de pagos?',
              options: ['Nada: es burocracia', 'Tiempo hoy (un proveedor) sin cerrar la puerta a hablar directo con las redes mañana', 'Pagos más baratos desde el día uno', 'Que no haga falta un proveedor'],
              answer: 1,
              why: 'Los módulos le hablan a la fachada; lo que hay detrás puede cambiar sin que se enteren.',
            },
            {
              q: 'En el metamodelo, ¿dónde se cambia una campaña de promociones?',
              options: ['En cada comida suelta', 'En el nivel de conocimiento (las reglas), sin reescribir los hechos', 'En la base de datos de órdenes', 'En la app móvil'],
              answer: 1,
              why: 'Reglamento arriba, partido abajo. Las promociones cuelgan de menús y tipos de comida.',
            },
          ],
        },
      },
      blocks: [
        { t: 'p', html: 'Repasá lo esencial antes de seguir.' },
        { t: 'p', html: 'Hasta acá el sistema se pensó como software limpio. En el próximo capítulo choca con el mundo físico: heladeras sin señal, dinero y dos personas queriendo el último plato.' },
      ],
    },
  ],
};
