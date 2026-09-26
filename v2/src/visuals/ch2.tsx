import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Inbox, CreditCard, Heart, BarChart3, Database, Container, Radio, Trophy, Users, Check, ChevronDown, Gavel } from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, Packet, EASE, type SceneProps } from './kit';

/* ───────────────────────── teams: ten teams, three finalists ───────────────────────── */
export function Teams({ reduced }: SceneProps) {
  const finalists: Record<number, string> = { 1: 'ArchColider', 4: 'Myagis-Forest', 7: 'Jedis' };
  return (
    <div className="teams">
      <motion.p className="teams__q" initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        ¿Cuánta maquinaria comprar hoy para un negocio que hoy vende <span>42 comidas al día</span>?
      </motion.p>
      <div className="teams__grid" aria-label="Diez equipos, tres finalistas">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={i}
            className={`teams__t ${finalists[i] ? 'is-final' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: finalists[i] ? 1 : 0.45, scale: 1 }}
            transition={{ delay: reduced ? 0 : 0.3 + i * 0.06 + (finalists[i] ? 0.6 : 0) }}
          >
            <Users size={18} aria-hidden />
            <span>{finalists[i] ?? `Equipo ${i + 1}`}</span>
            {finalists[i] && <em className="mono">finalista</em>}
          </motion.div>
        ))}
      </div>
      <p className="teams__foot">Diez equipos, el mismo pliego. Tres llegaron a la final con respuestas opuestas.</p>
    </div>
  );
}

/* ───────────────────────── styles: the same modules, three architectures ───────────────────────── */
const MODS = [
  { k: 'cat', label: 'Catálogo', icon: BookOpen },
  { k: 'ord', label: 'Órdenes', icon: Inbox },
  { k: 'pay', label: 'Pagos', icon: CreditCard },
  { k: 'loy', label: 'Lealtad', icon: Heart },
  { k: 'rep', label: 'Reportes', icon: BarChart3 },
];
type Pt = { x: number; y: number };
const LAYOUT: Record<string, Pt[]> = {
  arch: [ { x: 290, y: 220 }, { x: 480, y: 220 }, { x: 670, y: 220 }, { x: 385, y: 320 }, { x: 575, y: 320 } ],
  forest: [ { x: 150, y: 150 }, { x: 480, y: 110 }, { x: 810, y: 150 }, { x: 260, y: 380 }, { x: 700, y: 380 } ],
  jedis: [ { x: 150, y: 170 }, { x: 480, y: 170 }, { x: 810, y: 170 }, { x: 290, y: 430 }, { x: 670, y: 430 } ],
};
const META: Record<string, { title: string; team: string; cost: number; costLabel: string }> = {
  arch: { title: 'Monolito modular', team: 'ArchColider', cost: 1, costLabel: 'costo fijo hoy: bajo' },
  forest: { title: 'Microservicios desde el día uno', team: 'Myagis-Forest', cost: 3, costLabel: 'costo fijo hoy: alto' },
  jedis: { title: 'Plataforma sobre un bus de eventos', team: 'Jedis', cost: 2.5, costLabel: 'costo fijo hoy: mensajería sobredimensionada' },
};

export function Styles({ state = 'arch', reduced }: SceneProps) {
  const L = LAYOUT[state] ?? LAYOUT.arch;
  const m = META[state] ?? META.arch;
  const arch = state === 'arch';
  const forest = state === 'forest';
  const jedis = state === 'jedis';
  return (
    <Frame title={`${m.team} · ${m.title}`} legend={<Legend items={[{ tone: 'cmp', label: 'Módulo o servicio' }, { tone: 'cmd', label: 'Llamada / mensaje' }, { tone: 'evt', label: 'Evento' }]} />}
      foot={
        <div className="cost" aria-label={m.costLabel}>
          <span className="cost__l mono">{m.costLabel}</span>
          <div className="cost__bar"><motion.div className="cost__fill" initial={false} animate={{ width: `${(m.cost / 3) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} /></div>
        </div>
      }
    >
      <Canvas w={960} h={520} label={`Los mismos cinco módulos organizados como ${m.title}`}>
        {(ids) => (
          <>
            {/* monolith shell */}
            <motion.rect x={170} y={150} width={620} height={240} rx={18} className="zone zone--accent" initial={false} animate={{ opacity: arch ? 1 : 0 }} />
            <Label x={190} y={140} anchor="start" tone="accent" show={arch}>una sola aplicación · pocas máquinas de AWS</Label>
            <Label x={480} y={410} tone="muted" show={arch}>fronteras estrictas entre módulos, contratos como si hubiera red</Label>
            <Node x={480} y={470} w={200} h={48} icon={Database} label="1 base de datos" show={arch} />

            {/* microservices network */}
            {forest && (
              <>
                {[[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [0, 2]].map(([a, b], i) => (
                  <Edge key={i} points={[[L[a].x, L[a].y], [L[b].x, L[b].y]]} tone="cmd" delay={0.3 + i * 0.05} />
                ))}
                {L.map((p, i) => (
                  <Node key={i} x={p.x} y={p.y + 62} w={132} h={36} icon={Database} label="su base" delay={0.4} />
                ))}
                <Packet reduced={reduced} tone="cmd" points={[[L[0].x, L[0].y], [L[1].x, L[1].y], [L[4].x, L[4].y]]} duration={2.2} repeat repeatDelay={1} label="red" />
                <Label x={480} y={500} tone="muted">cada servicio: su contenedor Docker, su base, su despliegue</Label>
              </>
            )}

            {/* event bus */}
            <motion.rect x={60} y={288} width={840} height={24} rx={12} fill="var(--evt-soft)" stroke="var(--evt)" initial={false} animate={{ opacity: jedis ? 1 : 0 }} />
            <Label x={480} y={338} tone="evt" show={jedis}>Kafka · cada movimiento de stock y cada compra, en vivo</Label>
            {jedis &&
              L.map((p, i) => <Edge key={i} points={[[p.x, p.y + (i < 3 ? 30 : -30)], [p.x, i < 3 ? 288 : 312]]} tone="evt" delay={0.2 + i * 0.05} />)}
            {jedis && (
              <>
                <Packet reduced={reduced} tone="evt" points={[[70, 300], [890, 300]]} duration={3} repeat repeatDelay={0.2} w={18} />
                <Packet reduced={reduced} tone="evt" points={[[70, 300], [890, 300]]} duration={3} delay={1.5} repeat repeatDelay={0.2} w={18} />
              </>
            )}

            {/* the same five modules move between layouts */}
            {MODS.map((mod, i) => (
              <Node key={mod.k} x={L[i].x} y={L[i].y} w={150} h={58} kind="cmp" icon={mod.icon} label={mod.label} sub={forest ? 'microservicio' : jedis ? 'consume y publica' : 'módulo'} />
            ))}
            {forest && <Node x={480} y={250} w={120} h={40} kind="muted" icon={Container} label="Docker" />}
            {jedis && <Node x={480} y={250} w={130} h={40} kind="muted" icon={Radio} label="analítica" />}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── bets: what each posture buys, what it pays ───────────────────────── */
export function Bets({ reduced }: SceneProps) {
  const rows = [
    { team: 'ArchColider', place: '1.º', style: 'Monolito modular', bet: 'Barato hoy, fácil de partir mañana si hace falta.', price: 'Si hay que partirlo, será trabajo futuro: el argumento con el que el segundo puesto eligió lo contrario.' },
    { team: 'Myagis-Forest', place: '2.º', style: 'Microservicios', bet: 'No hacer el trabajo dos veces; un modelado de dominio impecable desde el día uno.', price: 'Un costo fijo de operación mucho más alto mientras la startup recién valida su mercado.' },
    { team: 'Jedis', place: '3.º', style: 'Bus de eventos', bet: 'La analítica futura: cada movimiento de stock y cada compra registrados en tiempo real.', price: 'Sostener una plataforma de mensajería sobredimensionada durante los primeros meses.' },
  ];
  return (
    <div className="bets">
      <div className="bets__head">
        <span />
        <span className="mono">Lo que compra</span>
        <span className="mono">Lo que paga</span>
      </div>
      {rows.map((r, i) => (
        <motion.div key={r.team} className="bets__row" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.45, ease: EASE }}>
          <div className="bets__who">
            <span className="bets__place mono">{r.place}</span>
            <div>
              <strong>{r.team}</strong>
              <span>{r.style}</span>
            </div>
          </div>
          <p className="bets__bet">{r.bet}</p>
          <p className="bets__price">{r.price}</p>
        </motion.div>
      ))}
      <motion.p className="bets__law" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Trophy size={16} aria-hidden /> Primera ley: <em>en arquitectura no hay decisiones correctas o incorrectas, todo es una compensación.</em>
      </motion.p>
    </div>
  );
}

/* ───────────────────────── rubric: the judges and their seven criteria ───────────────────────── */
const JUDGES = [
  { n: 'Nate Schutta', r: 'arquitecto de software' },
  { n: 'Mark Richards', r: 'coautor de Fundamentals of Software Architecture' },
  { n: 'Sarah Taraporewalla', r: 'ThoughtWorks' },
  { n: 'Luca Mezzalira', r: 'VP de Arquitectura en DAZN' },
];
const CRITERIA = [
  { t: 'Narrativa, organización y documentación', d: 'Una buena arquitectura que no se sabe contar, no se defiende.' },
  { t: 'Entendimiento de los requerimientos y completitud', d: '¿Responde al problema planteado, o a uno más cómodo?' },
  { t: 'Características arquitectónicas de soporte', d: '¿Qué atributos de calidad importan y dónde?' },
  { t: 'Diagramas: tipos, nivel de detalle y completitud', d: 'Citando a Neal Ford: “el objetivo de un diagrama es transmitir una comprensión clara y compartida de la arquitectura”.' },
  { t: 'Arquitectura general del sistema', d: 'La vista del sistema entero, más allá de las piezas sueltas.' },
  { t: 'Integración con los sistemas de terceros', d: 'Heladeras, kioscos y pasarela ya existían: había que conectarlos bien.' },
  { t: 'ADRs: documentación y justificación de las decisiones', d: 'Segunda ley: “el porqué importa más que el cómo”.' },
];

export function Rubric({ state = 'full', chosen, props, reduced }: SceneProps) {
  const revealed = state === 'full' || (chosen !== null && chosen === props?.correct);
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="rubric">
      <div className="rubric__judges">
        {JUDGES.map((j, i) => (
          <motion.div key={j.n} className="rubric__judge" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Gavel size={15} aria-hidden />
            <strong>{j.n}</strong>
            <span>{j.r}</span>
          </motion.div>
        ))}
      </div>
      <div className={`rubric__list vcard ${revealed ? '' : 'is-hidden'}`} aria-hidden={!revealed}>
        <p className="rubric__k mono">Rúbrica del deck de semifinales · 7 criterios</p>
        <ol>
          {CRITERIA.map((c, i) => (
            <motion.li key={c.t} initial={false} animate={{ opacity: revealed ? 1 : 0.25 }} transition={{ delay: revealed ? i * 0.07 : 0 }}>
              <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} tabIndex={revealed ? 0 : -1}>
                <span className="rubric__n mono">{i + 1}</span>
                <span className="rubric__t">{c.t}</span>
                <ChevronDown size={15} aria-hidden className={open === i ? 'is-open' : ''} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p className="rubric__d" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    {c.d}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ol>
        {!revealed && <div className="rubric__veil">Respondé a la izquierda para ver la rúbrica</div>}
      </div>
      {revealed && (
        <motion.p className="rubric__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Check size={15} aria-hidden /> Ningún criterio dice “la tecnología más moderna”. Todos miden si el razonamiento se puede seguir.
        </motion.p>
      )}
    </div>
  );
}
