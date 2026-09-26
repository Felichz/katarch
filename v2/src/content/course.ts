import type { CourseEntry } from './types';

export const COURSE_META = {
  kicker: "O'Reilly Software Architecture Kata · Otoño 2020",
  title: 'El caso Farmacy Food',
  subtitle: 'Cómo se toman decisiones reales de arquitectura, reconstruido paso a paso desde el repositorio del equipo ganador.',
  intro:
    'Un curso guiado para devs sin experiencia en arquitectura. Once capítulos, una idea por pantalla, y cada diagrama construido para que lo recorras vos.',
};

export const COURSE: CourseEntry[] = [
  { id: 'terreno', number: 1, phase: 'El problema', title: 'El terreno de juego', blurb: 'El negocio, sus piezas físicas y el número que gobierna todo el caso.', available: true },
  { id: 'podio', number: 2, phase: 'El problema', title: 'El dilema del podio', blurb: 'Tres finalistas, tres respuestas opuestas, y la rúbrica real del jurado.', available: true },
  { id: 'principios', number: 3, phase: 'El marco de decisión', title: 'Las reglas antes del primer diagrama', blurb: 'Preguntas al cliente, principios rectores y el cuaderno de decisiones.', available: true },
  { id: 'estilo', number: 4, phase: 'El marco de decisión', title: 'Cuánta maquinaria comprar', blurb: 'La Entity Trap, la aritmética del tráfico y el monolito modular.', available: true },
  { id: 'dominio', number: 5, phase: 'El diseño', title: 'Qué se construye y qué se alquila', blurb: 'Dominios, capa anticorrupción, fachada de pagos y metamodelo.', available: true },
  { id: 'concurrencia', number: 6, phase: 'El diseño', title: 'El mundo físico', blurb: 'Heladeras, dinero y conexiones inestables: tres problemas reales, tres renuncias.', available: true },
  { id: 'suscriptor', number: 7, phase: 'El diseño', title: 'El viaje de una vianda', blurb: 'Del calendario a la heladera: el ciclo del suscriptor en eventos.', available: false },
  { id: 'infraestructura', number: 8, phase: 'El diseño', title: 'Aterrizar en la nube', blurb: 'Red privada, identidad en el borde, escala vertical y extracción de módulos.', available: false },
  { id: 'costos', number: 9, phase: 'La realidad económica', title: 'La factura anual', blurb: 'Volumetría, tres escenarios de costo y por qué el monitoreo pago ganó.', available: false },
  { id: 'mapa', number: 10, phase: 'La realidad económica', title: 'El mapa de decisiones', blurb: 'Las diez decisiones estructurales en tres pilares.', available: false },
  { id: 'guia', number: 11, phase: 'Para llevar', title: 'Guía de campo', blurb: 'El método en cuatro pasos, para tu próximo sistema.', available: false },
];
