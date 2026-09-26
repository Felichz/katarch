import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  User, BookOpen, Inbox, CreditCard, Refrigerator, Users, Rocket, Wallet, Cloud, Gauge, CalendarClock, MessageSquare, Tag,
  Zap, Eye, DollarSign, Monitor, Soup, Filter, Server, Box, StickyNote, XCircle, CheckCircle2, HelpCircle, GitFork,
} from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, Packet, Stepper, EASE, type SceneProps } from './kit';
import { usePhases } from './usePhases';

/* ───────────────────────── the Entity Trap ───────────────────────── */
const NOUNS = [
  { k: 'usuario', label: 'Usuario', icon: User },
  { k: 'menú', label: 'Menú', icon: BookOpen },
  { k: 'orden', label: 'Orden', icon: Inbox },
  { k: 'pago', label: 'Pago', icon: CreditCard },
  { k: 'heladera', label: 'Heladera', icon: Refrigerator },
];

export function EntityTrap({ state = 'nouns', reduced }: SceneProps) {
  const flows = state === 'flows';
  const xs = [120, 300, 480, 660, 840];
  const path: [number, number][] = [];
  xs.forEach((x, i) => {
    path.push([x, 300]);
    if (i < xs.length - 1) path.push([x, 380], [xs[i + 1], 380]);
  });
  return (
    <Frame title={flows ? 'Un solo flujo atraviesa todas las cajas' : 'Un componente por sustantivo'} legend={flows ? <Legend items={[{ tone: 'cmd', label: 'Un flujo real: comprar una vianda' }]} /> : undefined}>
      <Canvas w={960} h={480} label="La Entity Trap: se crea un servicio por cada sustantivo del negocio, y un flujo real como comprar una vianda tiene que atravesarlos todos">
        {(ids) => (
          <>
            <foreignObject x={60} y={30} width={840} height={70}>
              <p className="trap__sentence">
                Un <mark>usuario</mark> elige un <mark>menú</mark>, arma una <mark>orden</mark>, la <mark>paga</mark> y la retira de una <mark>heladera</mark>.
              </p>
            </foreignObject>
            {NOUNS.map((n, i) => (
              <g key={n.k}>
                <Edge points={[[xs[i], 104], [xs[i], 222]]} tone="muted" dashed show={!flows} delay={0.2 + i * 0.08} />
                <Node x={xs[i]} y={260} w={160} h={70} kind="cmp" icon={n.icon} label={n.label} sub="servicio CRUD" delay={0.3 + i * 0.1} highlight={flows} />
              </g>
            ))}
            <Edge points={path} tone="cmd" show={flows} marker={ids.arrowCmd} delay={0.2} />
            {flows && <Packet reduced={reduced} tone="cmd" label="comprar" points={path} duration={5} repeat repeatDelay={0.6} />}
            <Label x={480} y={440} tone={flows ? 'danger' : 'muted'} size={flows ? 12 : 11}>
              {flows ? 'cada cambio del negocio toca cinco servicios a la vez' : 'suena ordenado'}
            </Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── constraints + the number ───────────────────────── */
export function Constraints({ reduced }: SceneProps) {
  const cs = [
    { icon: Users, t: 'Equipo chico', s: 'la solución debe ser simple al comienzo para probar las ideas de negocio' },
    { icon: Rocket, t: 'Salida al mercado crítica', s: 'con un equipo chico, el despliegue tiene que ser súper simple' },
    { icon: Cloud, t: 'AWS', s: 'la plataforma de despliegue principal' },
    { icon: Wallet, t: 'Presupuesto muy limitado', s: 'software libre y herramientas de la plataforma, primero' },
  ];
  return (
    <div className="cons">
      <div className="cons__grid">
        {cs.map((c, i) => (
          <motion.div key={c.t} className="cons__c vcard" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <c.icon size={20} aria-hidden />
            <strong>{c.t}</strong>
            <span>{c.s}</span>
          </motion.div>
        ))}
      </div>
      <motion.div className="cons__num" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 }}>
        <Gauge size={22} aria-hidden />
        <span className="mono">&lt; 1 petición por segundo</span>
        <span>hoy y en la meta a un año, del capítulo 1</span>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── ADR 002 value map ───────────────────────── */
const STYLES = ['Monolito', 'Microservicios', 'Micro-kernel', 'Monolito modularizado'];
const ATTRS: [string, number[]][] = [
  ['Facilidad de despliegue', [2, -1, -1, 2]],
  ['Disponibilidad', [-1, 2, 1, -1]],
  ['Autonomía', [-2, 2, 2, 1]],
  ['Trazabilidad', [2, -1, 1, 0]],
  ['Performance', [2, 1, 1, 2]],
  ['Modificabilidad', [0, 2, 1, 1]],
  ['Mantenibilidad', [-1, 2, 1, 1]],
  ['Integridad', [2, -2, 0, 1]],
  ['Seguridad', [-1, 2, 1, 2]],
  ['Escalabilidad', [-2, 2, -1, 1]],
];
const SYM: Record<number, string> = { 2: '++', 1: '+', 0: 'O', [-1]: '−', [-2]: '−−' };

export function ValueMap({ chosen, props }: SceneProps) {
  const revealed = chosen !== null && chosen === props?.correct;
  const [col, setCol] = useState<number | null>(null);
  const active = col ?? (revealed ? 3 : null);
  const totals = STYLES.map((_, j) => ATTRS.reduce((a, [, v]) => a + v[j], 0));
  return (
    <Frame title="ADR 002 · mapa de valores" legend={<p className="vmap__legend mono">++ promueve fuerte · + promueve · O neutral · − negativo · −− muy negativo</p>}
      foot={<p className="vmap__hint">Tocá una columna para resaltarla. {revealed ? 'La elegida por el equipo está marcada.' : ''}</p>}>
      <div className="vmap-wrap">
        <table className="vmap">
          <thead>
            <tr>
              <th />
              {STYLES.map((s, j) => (
                <th key={s} className={active === j ? 'is-col' : ''}>
                  <button type="button" onClick={() => setCol(col === j ? null : j)} aria-pressed={col === j}>{s}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ATTRS.map(([a, v], i) => (
              <motion.tr key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <th scope="row">{a}</th>
                {v.map((x, j) => (
                  <td key={j} className={`s${x < 0 ? 'm' : 'p'}${Math.abs(x)} ${active === j ? 'is-col' : ''}`}>
                    <span className="mono">{SYM[x]}</span>
                  </td>
                ))}
              </motion.tr>
            ))}
            <tr className="vmap__tot">
              <th scope="row">Suma sin pesos <span>(solo para orientarte)</span></th>
              {totals.map((t, j) => (
                <td key={j} className={active === j ? 'is-col' : ''}><span className="mono">{t > 0 ? '+' : ''}{t}</span></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

/* ───────────────────────── modular monolith: inside and extraction ───────────────────────── */
const MODS = [
  { k: 'cat', label: 'Catálogo', icon: BookOpen, x: 180, y: 190 },
  { k: 'ord', label: 'Órdenes', icon: Inbox, x: 360, y: 190 },
  { k: 'sch', label: 'Agenda', icon: CalendarClock, x: 540, y: 190 },
  { k: 'pay', label: 'Pagos', icon: CreditCard, x: 180, y: 340 },
  { k: 'fb', label: 'Opiniones', icon: MessageSquare, x: 360, y: 340 },
  { k: 'pro', label: 'Promociones', icon: Tag, x: 540, y: 340 },
];

export function ModMono({ state = 'inside', reduced }: SceneProps) {
  const extract = state === 'extract';
  return (
    <Frame title={extract ? 'El día que la telemetría lo pide' : 'Un solo despliegue, módulos con fronteras'} legend={<Legend items={[{ tone: 'cmp', label: 'Módulo' }, { tone: 'cmd', label: 'Mensaje por contrato' }, { tone: 'accent', label: 'Límite de despliegue' }]} />}>
      <Canvas w={960} h={500} label={extract ? 'Un módulo sale del monolito como servicio propio sin cambiar sus mensajes' : 'Un monolito con seis módulos separados que se hablan por contratos'}>
        {(ids) => (
          <>
            <rect x={60} y={100} width={620} height={330} rx={18} className="zone zone--accent" />
            <Label x={80} y={90} anchor="start" tone="accent">una aplicación · pocas máquinas de AWS</Label>
            <motion.rect x={730} y={150} width={200} height={230} rx={18} className="zone zone--accent" initial={false} animate={{ opacity: extract ? 1 : 0 }} />
            <Label x={830} y={140} tone="accent" show={extract}>servicio propio</Label>
            <Label x={830} y={400} tone="muted" show={extract}>escala por su lado</Label>
            {/* contract lines */}
            <Edge points={[[252, 190], [288, 190]]} tone="cmd" marker={ids.arrowCmd} show={!extract} />
            <Edge points={[[432, 190], [468, 190]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[360, 222], [360, 308]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[180, 308], [180, 222]]} tone="cmd" marker={ids.arrowCmd} show={!extract} />
            <Edge points={[[432, 176], [760, 176]]} tone="cmd" marker={ids.arrowCmd} show={extract} delay={0.4} />
            {MODS.map((m) => {
              const out = extract && m.k === 'cat';
              return <Node key={m.k} x={out ? 830 : m.x} y={out ? 250 : m.y} w={144} h={62} kind="cmp" icon={m.icon} label={m.label} sub={out ? 'N réplicas' : 'módulo'} highlight={out} />;
            })}
            {!extract && <Packet reduced={reduced} tone="cmd" points={[[432, 190], [468, 190]]} duration={1.2} repeat repeatDelay={1.4} w={14} />}
            {!extract && <Packet reduced={reduced} tone="cmd" points={[[360, 222], [360, 308]]} duration={1.2} delay={0.8} repeat repeatDelay={1.4} w={14} />}
            {extract && <Packet reduced={reduced} tone="cmd" label="mismo mensaje" points={[[432, 176], [758, 176]]} duration={1.8} repeat repeatDelay={1} />}
            <motion.g initial={false} animate={{ opacity: extract ? 1 : 0 }} transition={{ delay: extract ? 0.3 : 0 }}>
              <rect x={760} y={295} width={140} height={30} rx={15} className="pk pk--danger" />
              <text x={830} y={315} textAnchor="middle" className="pk-t">telemetría: carga alta</text>
            </motion.g>
            <Label x={370} y={465} tone="text" size={13}>{extract ? 'la frontera ya existía: extraer no reescribe a los demás' : 'cada módulo habla por contratos, como si hubiera red entre ellos'}</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── the 29 Oct 2020 whiteboard ───────────────────────── */
const SAT = [
  { icon: null, t: 'N', label: 'nutrición' },
  { icon: Zap, label: 'recomendaciones' },
  { icon: Eye, label: 'reviews' },
  { icon: DollarSign, label: 'descuentos' },
  { icon: Monitor, label: 'front-end' },
  { icon: Soup, label: 'comidas' },
  { icon: Filter, label: 'filtrado' },
];
const WB_CAP = [
  'En el centro, el núcleo <strong>Menu</strong>: la pieza que no puede fallar. Alrededor, extensiones candidatas, como plug-ins.',
  'El núcleo vive en una máquina grande: <strong>4 núcleos y 8 GB</strong> en AWS.',
  'Separada a propósito, una pieza chica de <strong>1 núcleo y 2 GB</strong>, con balanceador y su propio paquete (JAR): escala por su lado. Entre ambas, un canal de <strong>mensajes</strong>.',
  'Y el post-it, la política completa del monolito modular escrita a mano antes de cualquier diagrama formal.',
];

export function Whiteboard({ reduced }: SceneProps) {
  const s = usePhases(4, { interval: 2400, reduced });
  const p = s.phase;
  const cx = 290, cy = 260, r = 140;
  return (
    <Frame title="Pizarra de la sesión del 29 de octubre de 2020, redibujada"
      foot={<Stepper phase={p} count={4} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: WB_CAP[p] }} />} />}>
      <Canvas w={960} h={500} label="Pizarra: el núcleo Menu rodeado de plug-ins en una máquina de 4 núcleos, una pieza escalable aparte de 1 núcleo, un canal de mensajes y un post-it con la política de comunicación">
        {(ids) => (
          <>
            <motion.rect x={60} y={50} width={470} height={420} rx={20} className="zone" initial={false} animate={{ opacity: p >= 1 ? 1 : 0 }} />
            <Label x={80} y={40} anchor="start" show={p >= 1}>AWS · 4 cores / 8 GB</Label>
            {SAT.map((st, i) => {
              const a = (i / SAT.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r;
              return (
                <motion.g key={st.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.2 + i * 0.08 }}>
                  <line x1={cx + Math.cos(a) * 58} y1={cy + Math.sin(a) * 58} x2={x - Math.cos(a) * 30} y2={y - Math.sin(a) * 30} stroke="var(--text-3)" strokeWidth={1.4} />
                  <circle cx={x} cy={y} r={30} className="nd nd--cmp" />
                  <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
                    <div className="wb-ic">{st.icon ? <st.icon size={17} /> : <strong>{st.t}</strong>}</div>
                  </foreignObject>
                  <text x={x} y={y + 46} textAnchor="middle" className="lb lb--muted" style={{ fontSize: 10 }}>{st.label}</text>
                </motion.g>
              );
            })}
            <circle cx={cx} cy={cy} r={58} className="nd nd--core" />
            <text x={cx} y={cy + 7} textAnchor="middle" style={{ fontSize: 22, fontWeight: 750, fill: 'var(--text)' }}>Menu</text>

            <motion.g initial={false} animate={{ opacity: p >= 2 ? 1 : 0 }}>
              <rect x={690} y={120} width={220} height={190} rx={16} className="zone zone--accent" />
              <text x={800} y={110} textAnchor="middle" className="lb lb--accent" style={{ fontSize: 11 }}>1 core / 2 GB</text>
            </motion.g>
            <Node x={800} y={165} w={160} h={44} kind="plain" icon={Server} label="LoadBalancer" show={p >= 2} />
            <Node x={800} y={250} w={160} h={50} kind="cmp" icon={Box} label="JAR" sub="caching / scaling" show={p >= 2} />
            <Edge points={[[530, 230], [688, 230]]} tone="cmd" marker={ids.arrowCmd} show={p >= 2} />
            <Label x={610} y={220} tone="cmd" show={p >= 2}>MSG</Label>
            {p >= 2 && <Packet reduced={reduced} tone="cmd" points={[[530, 230], [686, 230]]} duration={1.4} repeat repeatDelay={1} w={14} />}

            <motion.g initial={false} animate={{ opacity: p >= 3 ? 1 : 0, rotate: p >= 3 ? -2 : 0 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <rect x={590} y={330} width={350} height={150} rx={4} fill="#fde68a" stroke="#d6a93a" />
              <foreignObject x={604} y={340} width={322} height={134}>
                <p className="postit">
                  <StickyNote size={14} aria-hidden /> “Se comunica con los plug-ins por protocolo de mensajería (el protocolo debe ser lo bastante inteligente como para desacoplar después). Si el núcleo se congestiona, le agregamos caché.”
                </p>
              </foreignObject>
            </motion.g>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── the spectrum of discarded extremes ───────────────────────── */
const SPECTRUM = [
  { t: 'Monolito puro', verdict: 'Descartado', q: '“Sirve para una prueba de concepto, pero acá sería simplificación de más.”', ok: false },
  { t: 'Monolito modular', verdict: 'Elegido', q: '“La mejor opción por ahora. Al mismo tiempo, abre la posibilidad de migrar a microservicios cuando sea necesario.” (ADR 002)', ok: true },
  { t: 'Microservicios desde el día uno', verdict: 'Descartado', q: '“Exigen un modelo de dominio estable que todavía no existe: el esfuerzo se pierde y el usuario no lo ve.”', ok: false },
];

export function Spectrum({ reduced }: SceneProps) {
  const [sel, setSel] = useState(1);
  const cur = SPECTRUM[sel];
  return (
    <div className="spec">
      <div className="spec__line" role="radiogroup" aria-label="Espectro de estilos">
        {SPECTRUM.map((s, i) => (
          <button key={s.t} type="button" role="radio" aria-checked={sel === i} className={`spec__stop ${sel === i ? 'is-sel' : ''} ${s.ok ? 'is-ok' : ''}`} onClick={() => setSel(i)}>
            <span className="spec__dot" aria-hidden />
            <span className="spec__t">{s.t}</span>
          </button>
        ))}
      </div>
      <div className="spec__axis mono" aria-hidden><span>menos piezas</span><span>más piezas</span></div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} className={`vcard spec__card ${cur.ok ? 'is-ok' : 'is-no'}`} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <p className="spec__v mono">{cur.ok ? <CheckCircle2 size={15} aria-hidden /> : <XCircle size={15} aria-hidden />} {cur.verdict}</p>
          <p className="spec__q">{cur.q}</p>
        </motion.div>
      </AnimatePresence>
      <p className="spec__foot">El punto medio es deliberado, no una apuesta a ciegas. Tocá cada extremo para leer por qué quedó afuera.</p>
    </div>
  );
}

/* ───────────────────────── the fork: ArchColider vs Myagis-Forest ───────────────────────── */
export function Fork({ reduced }: SceneProps) {
  const cols = [
    {
      team: 'ArchColider', adr: 'ADR 002', steps: ['Hoy: monolito modular', 'Mañana, si la telemetría lo justifica: extraer módulos'],
      why: ['La experiencia y las capacidades del equipo también se consideran.', 'Bajo costo de desarrollo y complejidad cognitiva: una sola base de código, menos reuniones de sincronización.'],
    },
    {
      team: 'Myagis-Forest', adr: 'ADR 001', steps: ['Hoy: microservicios en contenedores Docker', 'Sin una segunda migración por etapas'],
      why: ['En una startup el modo es “shut up and type”: no ven necesidad de diseñar arquitecturas por etapas.', 'Microservicios desde el arranque, viables en tiempo, técnica y financieramente, amparados en la madurez de herramientas y desarrolladores.'],
    },
  ];
  return (
    <div className="fork">
      <div className="fork__top"><GitFork size={20} aria-hidden /> La misma bifurcación, dos salidas por escrito</div>
      <div className="fork__cols">
        {cols.map((c, i) => (
          <motion.section key={c.team} className={`vcard fork__col ${i === 0 ? 'is-main' : ''}`} initial={{ opacity: 0, x: reduced ? 0 : (i ? 16 : -16) }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.15, duration: 0.45, ease: EASE }}>
            <header><strong>{c.team}</strong><span className="mono">{c.adr}</span></header>
            <ol className="fork__path">
              {c.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <ul className="fork__why">
              {c.why.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </motion.section>
        ))}
      </div>
      <p className="fork__foot">Dos equipos serios, salidas opuestas, cada una con su justificación escrita: la primera ley funcionando en la práctica.</p>
    </div>
  );
}

/* ───────────────────────── reframe the question ───────────────────────── */
export function Reframe({ reduced }: SceneProps) {
  const qs = ['¿Qué volumen real tengo?', '¿Qué equipo tengo?', '¿Cuánto cuesta cada estilo en ese contexto?'];
  return (
    <div className="reframe">
      <motion.p className="reframe__bad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <span>¿Monolito o microservicios?</span>
      </motion.p>
      <motion.div className="reframe__good" initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <HelpCircle size={20} aria-hidden />
        <ol>
          {qs.map((q, i) => (
            <motion.li key={q} initial={{ opacity: 0, x: reduced ? 0 : -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.15 }}>{q}</motion.li>
          ))}
        </ol>
      </motion.div>
      <motion.p className="reframe__ans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        Con 42 comidas al día, la respuesta era <strong>matemática, no ideológica</strong>.
      </motion.p>
    </div>
  );
}
