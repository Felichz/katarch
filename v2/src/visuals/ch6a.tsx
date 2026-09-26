import { AnimatePresence, motion } from 'motion/react';
import {
  Smartphone, Refrigerator, Database, Lock, Split, Cpu, BookOpen, CreditCard, Building2, Inbox, Send,
  ShieldCheck, Ban, RotateCw, Users, Swords, Banknote, WifiOff, CloudRain,
} from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, Packet, Stepper, EASE, type SceneProps } from './kit';
import { usePhases } from './usePhases';

/* ───────────────────────── problems (chapter roadmap + recap) ───────────────────────── */
const PROBLEMS = [
  { icon: Swords, k: 'Problema 1 · Contención', t: 'Dos personas, el último plato', r: 'Sin locks', rs: 'Un actor por heladera procesa sus órdenes de a una.' },
  { icon: Banknote, k: 'Problema 2 · Evidencia', t: 'Reclamos con dinero de por medio', r: 'Sin borrar nada', rs: 'Event sourcing, colas con confirmación y 30 segundos antes de cobrar.' },
  { icon: WifiOff, k: 'Problema 3 · Autonomía', t: 'Heladeras sin señal', r: 'Sin depender de la nube', rs: 'PIN validado en la heladera y catálogo en el teléfono.' },
];

export function Problems({ state = 'intro', reduced }: SceneProps) {
  const recap = state === 'recap';
  return (
    <div className="problems">
      <div className="problems__row">
        {PROBLEMS.map((p, i) => (
          <motion.article
            key={p.k}
            className={`problem ${recap ? 'is-recap' : ''}`}
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
          >
            <span className="problem__icon" aria-hidden><p.icon size={22} /></span>
            <p className="problem__k mono">{p.k}</p>
            <h3 className="problem__t">{p.t}</h3>
            <AnimatePresence initial={false}>
              {recap && (
                <motion.div className="problem__r" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}>
                  <p className="problem__rk mono">La renuncia</p>
                  <p className="problem__rt">{p.r}</p>
                  <p className="problem__rs">{p.rs}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>
      <motion.div className="problems__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <CloudRain size={16} aria-hidden />
        {recap ? (
          <span>Y el día nublado: cuando el hardware falla, un camino humano diseñado de antemano.</span>
        ) : (
          <span>Cada problema viene con la solución que el equipo diseñó. Al final, el patrón que comparten.</span>
        )}
      </motion.div>
    </div>
  );
}

/* ───────────────────────── race: the naive temptation ───────────────────────── */
export function Race({ reduced }: SceneProps) {
  return (
    <Frame title="La tentación: bloquear el stock" legend={<Legend items={[{ tone: 'cmd', label: 'Comando: quiero comprar' }, { tone: 'danger', label: 'Espera / conflicto' }]} />}>
      <Canvas w={960} h={540} label="Dos clientes compran la última vianda al mismo tiempo; la base de datos bloquea a uno mientras atiende al otro">
        {(ids) => (
          <>
            <Node x={150} y={150} w={190} icon={Smartphone} label="Ana" sub="compra desde la app" />
            <Node x={150} y={390} w={190} icon={Smartphone} label="Beto" sub="en el mismo segundo" />
            <Node x={500} y={270} w={210} h={80} kind="danger" icon={Database} label="Base de datos" sub="stock bloqueado" />
            <Node x={820} y={270} w={200} h={80} kind="cmp" icon={Refrigerator} label="Heladera del gimnasio" sub="queda 1 lasaña" />
            <Edge points={[[247, 150], [320, 150], [320, 250], [393, 250]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[247, 390], [320, 390], [320, 290], [393, 290]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[607, 270], [718, 270]]} tone="muted" marker={ids.arrow} />
            <Packet reduced={reduced} tone="cmd" label="comprar" points={[[247, 150], [320, 150], [320, 250], [390, 250]]} duration={1.4} repeat repeatDelay={1.6} />
            <Packet reduced={reduced} tone="danger" label="espera…" points={[[247, 390], [320, 390], [320, 300], [320, 300], [320, 300]]} duration={2.4} repeat repeatDelay={0.6} hold />
            <motion.g
              initial={false}
              animate={reduced ? {} : { scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <circle cx={500} cy={200} r={20} fill="var(--danger-soft)" stroke="var(--danger)" strokeWidth={1.6} />
              <foreignObject x={488} y={188} width={24} height={24}>
                <div style={{ color: 'var(--danger)', display: 'grid', placeItems: 'center', height: '100%' }}><Lock size={16} /></div>
              </foreignObject>
            </motion.g>
            <Label x={500} y={380} tone="text" size={14}>“Nadie toca el stock mientras yo compro”</Label>
            <Label x={500} y={404} tone="muted">cada compra espera a la anterior</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── actors: one per fridge ───────────────────────── */
const LANES = [
  { k: 'A', y: 120 },
  { k: 'B', y: 280 },
  { k: 'C', y: 440 },
];

function Queue({ x, y, dim, items = [] as string[], hl = false }: { x: number; y: number; dim?: boolean; items?: string[]; hl?: boolean }) {
  return (
    <motion.g initial={false} animate={{ opacity: dim ? 0.3 : 1 }}>
      <rect x={x - 70} y={y - 26} width={140} height={52} rx={10} className={`nd ${hl ? 'is-hl' : ''}`} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x + 36 - i * 30} y={y - 14} width={24} height={28} rx={5} fill="var(--surface-3)" />
      ))}
      <AnimatePresence>
        {items.map((it, i) => (
          <motion.g key={it} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35 }}>
            <rect x={x + 36 - i * 30} y={y - 14} width={24} height={28} rx={5} className="pk pk--cmd" />
            <text x={x + 48 - i * 30} y={y + 5} textAnchor="middle" className="pk-t" style={{ fontSize: 11 }}>{it[0]}</text>
          </motion.g>
        ))}
      </AnimatePresence>
      <text x={x} y={y + 44} textAnchor="middle" className="lb lb--muted" style={{ fontSize: 10 }}>cola</text>
    </motion.g>
  );
}

const SERIAL_CAPTIONS = [
  'En la cola de la heladera A esperan dos órdenes por la <strong>última lasaña</strong>: Ana llegó primero, Beto después.',
  'El actor toma la orden de Ana. Nadie más toca ese stock mientras tanto: no porque esté bloqueado, sino porque <strong>no hay nadie más</strong>.',
  'Stock en memoria: 1 → 0. La orden de Ana sigue hacia el pago.',
  'Recién entonces toma la orden de Beto: stock 0. Beto recibe un <strong>agotado</strong> limpio, sin conflicto ni reintento.',
];

export function Actors({ state = 'route', reduced }: SceneProps) {
  const serial = state === 'serial';
  const broadcast = state === 'broadcast';
  const s = usePhases(4, { interval: 2000, reduced, key: state, auto: serial });
  const ph = serial ? s.phase : 3;
  const queueA = serial ? (ph === 0 ? ['Ana', 'Beto'] : ph < 3 ? ['Beto'] : []) : [];
  const stockA = serial ? (ph >= 2 ? 0 : 1) : null;

  return (
    <Frame
      title={serial ? 'Dentro de una sola heladera' : broadcast ? 'Dos salidas por cada orden' : 'Un actor por heladera'}
      legend={<Legend items={[{ tone: 'cmd', label: 'Comando' }, { tone: 'evt', label: 'Evento' }, { tone: 'cmp', label: 'Componente con estado' }]} />}
      foot={
        serial ? (
          <Stepper phase={s.phase} count={4} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: SERIAL_CAPTIONS[s.phase] }} />} />
        ) : undefined
      }
    >
      <Canvas w={960} h={560} label="Clientes de tres ubicaciones envían órdenes a un router, que las reparte en una cola por heladera; cada heladera tiene su propio actor">
        {(ids) => (
          <>
            {/* clients */}
            {LANES.map((l, i) => (
              <Node key={l.k} x={80} y={l.y} w={130} h={56} icon={Smartphone} label={`Clientes ${l.k}`} dim={serial && i > 0} />
            ))}
            {/* router */}
            <Node x={270} y={280} w={150} h={72} kind="cmp" icon={Split} label="Router" sub="lee la ubicación" dim={serial} />
            {LANES.map((l, i) => (
              <g key={l.k}>
                <Edge points={[[145, l.y], [170, l.y], [170, 280], [193, 280]]} tone="cmd" marker={ids.arrowCmd} />
                <Edge points={[[345, 280], [370, 280], [370, l.y], [407, l.y]]} tone="cmd" marker={ids.arrowCmd} />
                <Queue x={480} y={l.y} dim={serial && i > 0} items={i === 0 ? queueA : []} hl={serial && i === 0} />
                <Edge points={[[550, l.y], [597, l.y]]} tone="cmd" marker={ids.arrowCmd} />
              </g>
            ))}
            {/* actors */}
            {LANES.map((l, i) => (
              <Node key={l.k} x={675} y={l.y} w={150} h={64} kind="cmp" icon={Cpu} label={`Actor ${l.k}`} sub={i === 0 && stockA !== null ? `lasaña: ${stockA}` : 'stock en memoria'} dim={serial && i > 0} highlight={serial && i === 0 && (ph === 1 || ph === 3)} />
            ))}

            {/* route packets */}
            {state === 'route' &&
              LANES.map((l, i) => (
                <Packet
                  key={l.k}
                  reduced={reduced}
                  tone="cmd"
                  label={`orden ${l.k}`}
                  points={[[145, l.y], [170, l.y], [170, 280], [193, 280], [345, 280], [370, 280], [370, l.y], [410, l.y], [550, l.y], [600, l.y]]}
                  duration={3.2}
                  delay={i * 0.9}
                  repeat
                  repeatDelay={1.4}
                />
              ))}

            {/* serial outcomes */}
            {serial && (
              <>
                <motion.g initial={false} animate={{ opacity: ph >= 2 ? 1 : 0 }}>
                  <rect x={770} y={60} width={170} height={40} rx={10} className="nd nd--evt" />
                  <text x={855} y={85} textAnchor="middle" className="pk-t">Ana: comprada ✓</text>
                  <Edge points={[[750, 110], [800, 100]]} show={ph >= 2} tone="evt" marker={ids.arrowEvt} />
                </motion.g>
                <motion.g initial={false} animate={{ opacity: ph >= 3 ? 1 : 0 }}>
                  <rect x={770} y={140} width={170} height={40} rx={10} className="nd nd--danger" />
                  <text x={855} y={165} textAnchor="middle" className="pk-t">Beto: agotado</text>
                  <Edge points={[[750, 130], [800, 150]]} show={ph >= 3} tone="danger" marker={ids.arrowDanger} />
                </motion.g>
                <Label x={480} y={530} tone="accent" size={12}>una fila por heladera = cero escrituras simultáneas</Label>
              </>
            )}

            {/* broadcast */}
            <Node x={880} y={200} w={140} h={60} kind="cmp" icon={BookOpen} label="Catálogo" show={broadcast} />
            <Node x={880} y={380} w={140} h={60} kind="ext" icon={CreditCard} label="Pago" show={broadcast} />
            {LANES.map((l) => (
              <g key={l.k}>
                <Edge points={[[750, l.y], [780, l.y], [780, 200], [808, 200]]} show={broadcast} tone="evt" marker={ids.arrowEvt} />
                <Edge points={[[750, l.y + 10], [790, l.y + 10], [790, 380], [808, 380]]} show={broadcast} tone="cmd" marker={ids.arrowCmd} />
              </g>
            ))}
            <Edge points={[[880, 170], [880, 30], [80, 30], [80, 90]]} show={broadcast} tone="evt" dashed marker={ids.arrowEvt} />
            <Label x={480} y={22} tone="evt" show={broadcast}>catálogo actualizado · para todos los clientes</Label>
            {broadcast && (
              <>
                <Packet reduced={reduced} tone="evt" label="stock −1" points={[[750, 120], [780, 120], [780, 200], [808, 200]]} duration={1.4} repeat repeatDelay={2.6} />
                <Packet reduced={reduced} tone="cmd" label="orden" points={[[750, 130], [790, 130], [790, 380], [808, 380]]} duration={1.4} delay={0.4} repeat repeatDelay={2.6} />
                <Packet reduced={reduced} tone="evt" label="CatalogUpdated" points={[[880, 170], [880, 30], [80, 30], [80, 90]]} duration={2.2} delay={1.5} repeat repeatDelay={1.8} />
              </>
            )}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── venue: several fridges per location ───────────────────────── */
export function Venue({ reduced }: SceneProps) {
  const fridges = [
    { id: 'H1', n: 4 },
    { id: 'H2', n: 7 },
    { id: 'H3', n: 1 },
  ];
  return (
    <div className="venue">
      <motion.section className="vcard venue__place" initial={{ opacity: 0, y: reduced ? 0 : 12 }} animate={{ opacity: 1, y: 0 }}>
        <header className="venue__head">
          <Building2 size={18} aria-hidden /> <strong>Un gimnasio</strong> <span className="mono venue__tag">ejemplo · 1 local, 3 heladeras</span>
        </header>
        <div className="venue__fridges">
          {fridges.map((f, i) => (
            <motion.div key={f.id} className="venue__fridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
              <Refrigerator size={22} aria-hidden />
              <span className="mono">{f.id}</span>
              <strong>{f.n}</strong>
              <span className="venue__u">viandas</span>
            </motion.div>
          ))}
        </div>
        <div className="venue__sum">
          <span>La app muestra el local:</span>
          <strong className="mono">¿12?</strong>
          <span className="venue__who">¿Quién hace la suma? La API de Byte no la garantizaba.</span>
        </div>
      </motion.section>
      <div className="venue__apis">
        <motion.section className="vcard venue__api" initial={{ opacity: 0, x: reduced ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <p className="venue__apik mono">Si la API reporta el total</p>
          <pre className="venue__code">{'{ "heladera": "H2", "disponibles": 7 }'}</pre>
          <p className="venue__apit">Cada mensaje se sostiene solo: si uno se pierde, el siguiente corrige el número.</p>
        </motion.section>
        <motion.section className="vcard venue__api" initial={{ opacity: 0, x: reduced ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
          <p className="venue__apik mono">Si reporta solo el delta</p>
          <pre className="venue__code">{'{ "heladera": "H2", "cambio": -1 }'}</pre>
          <p className="venue__apit">Hay que acumular cada cambio: un mensaje perdido deja el stock desfasado.</p>
        </motion.section>
        <motion.p className="venue__q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          La pregunta del equipo al proveedor, textual: <em>“¿el total de comidas disponibles o solo el delta del último cambio? Esperamos que sea el total.”</em>
        </motion.p>
      </div>
    </div>
  );
}

/* ───────────────────────── ledger: overwrite vs append ───────────────────────── */
const LEDGER = [
  { state: 'CREADA', ev: 'Orden confirmada', tok: 'Confirm Order', kind: 'cmd', t: '12:03:10' },
  { state: 'RESERVADA', ev: 'Stock reservado', tok: 'MealStockReserved', kind: 'evt', t: '12:03:11' },
  { state: 'PAGADA', ev: 'Pago confirmado', tok: 'OrderPurchased', kind: 'evt', t: '12:03:41' },
];

export function Ledger({ reduced }: SceneProps) {
  const s = usePhases(5, { interval: 1700, reduced });
  const n = Math.min(s.phase + 1, 3);
  const claim = s.phase >= 3;
  const verdict = s.phase >= 4;
  return (
    <Frame
      title="La misma orden, guardada de dos maneras"
      foot={
        <Stepper
          phase={s.phase}
          count={5}
          playing={s.playing}
          onPlay={() => s.setPlaying(true)}
          onPause={() => s.setPlaying(false)}
          onGo={s.goTo}
          caption={
            s.phase < 3 ? (
              <span>La orden avanza. A la izquierda, cada cambio <strong>pisa</strong> al anterior. A la derecha, cada cambio se <strong>agrega</strong> como un hecho nuevo.</span>
            ) : s.phase === 3 ? (
              <span>Llega un reclamo: “me cobraron y nunca retiré mi comida”.</span>
            ) : (
              <span>Solo el registro de eventos puede responder qué pasó y cuándo. <strong>El estado actual se reconstruye repasando la historia</strong>, como un libro contable escrito en tinta.</span>
            )
          }
        />
      }
    >
      <div className="ledger">
        <section className="vcard ledger__col">
          <p className="ledger__k mono">Tabla tradicional</p>
          <div className="ledger__row">
            <span className="mono ledger__id">Orden #481</span>
            <span className="ledger__estado">
              estado:{' '}
              <AnimatePresence mode="popLayout">
                <motion.strong key={n} className="mono" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10, textDecoration: 'line-through' }}>
                  {LEDGER[n - 1].state}
                </motion.strong>
              </AnimatePresence>
            </span>
          </div>
          <p className="ledger__note">Un solo casillero que se reescribe.</p>
          {verdict && (
            <motion.div className="ledger__verdict is-bad" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Ban size={15} aria-hidden /> “Está PAGADA.” ¿Desde cuándo? ¿Qué pasó antes? No queda rastro.
            </motion.div>
          )}
        </section>
        <section className="vcard ledger__col">
          <p className="ledger__k mono">Registro de eventos (event store)</p>
          <ol className="ledger__log">
            <AnimatePresence initial={false}>
              {LEDGER.slice(0, n).map((e) => (
                <motion.li key={e.tok} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                  <span className="mono ledger__t">{e.t}</span>
                  <span>{e.ev}</span>
                  <span className={`tok tok--${e.kind}`}>{e.tok}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
          <p className="ledger__note">Nada se borra: cada hecho queda escrito, en orden.</p>
          {verdict && (
            <motion.div className="ledger__verdict is-good" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <ShieldCheck size={15} aria-hidden /> Reservada 12:03:11, pagada 12:03:41, ningún retiro registrado: el reclamo se resuelve con evidencia.
            </motion.div>
          )}
        </section>
        <AnimatePresence>
          {claim && (
            <motion.div className="ledger__claim" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <Users size={16} aria-hidden /> Reclamo · “me cobraron y nunca retiré mi comida”
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Frame>
  );
}

/* ───────────────────────── queue: at-least-once with acks ───────────────────────── */
const ACK_CAPTIONS = [
  'La orden decide cobrar y deja un mensaje en la cola: <strong>“cobrá la orden #481”</strong>, con un identificador único.',
  'La cola lo entrega al servicio de pagos. Mientras no reciba confirmación, <strong>no lo borra</strong>: si algo se cae, lo vuelve a entregar.',
  'Pagos procesa el cobro con la pasarela.',
  'Pagos confirma el recibo (<strong>ack</strong>). Recién ahora la cola descarta el mensaje: no se perdió.',
  'Un reintento tardío entrega el <strong>mismo</strong> mensaje otra vez. Pasa en cualquier red.',
  'Pagos ve un identificador ya procesado y lo descarta sin efecto: <strong>no se cobra doble</strong>.',
];

export function AckQueue({ reduced }: SceneProps) {
  const s = usePhases(6, { interval: 1900, reduced });
  const p = s.phase;
  const inQueue = p >= 0 && p <= 3;
  return (
    <Frame
      title="El mensaje que no se puede perder ni duplicar"
      legend={<Legend items={[{ tone: 'cmd', label: 'Comando' }, { tone: 'evt', label: 'Confirmación' }]} />}
      foot={<Stepper phase={p} count={6} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: ACK_CAPTIONS[p] }} />} />}
    >
      <Canvas w={960} h={440} label="Una orden envía un mensaje de cobro por una cola con confirmación de recibo; un duplicado se descarta por su identificador">
        {(ids) => (
          <>
            <Node x={120} y={200} w={170} h={70} kind="cmp" icon={Inbox} label="Orden" sub="decide cobrar" highlight={p === 0} />
            <Node x={400} y={200} w={190} h={80} icon={Send} label="Cola de mensajes" sub="RabbitMQ administrado" highlight={p === 1 || p === 3} />
            <Node x={680} y={200} w={180} h={70} kind="cmp" icon={CreditCard} label="Servicio de pagos" sub="recuerda ids procesados" highlight={p === 2 || p === 5} />
            <Node x={880} y={200} w={120} h={60} kind="ext" label="Pasarela" sub="Stripe" />
            <Edge points={[[205, 200], [303, 200]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[495, 190], [588, 190]]} tone="cmd" marker={ids.arrowCmd} />
            <Edge points={[[590, 215], [497, 215]]} tone="evt" marker={ids.arrowEvt} show={p >= 3} />
            <Edge points={[[770, 200], [818, 200]]} tone="muted" marker={ids.arrow} />

            {/* the message held in the queue */}
            <motion.g initial={false} animate={{ opacity: inQueue && p !== 2 ? 1 : p === 2 ? 0.5 : 0 }}>
              <rect x={345} y={262} width={110} height={26} rx={13} className="pk pk--cmd" />
              <text x={400} y={279} textAnchor="middle" className="pk-t">#481 · a7f3</text>
            </motion.g>
            <Label x={400} y={310} show={p >= 1 && p <= 2} tone="muted">retenido hasta el ack</Label>

            {p === 0 && <Packet key="p0" reduced={reduced} tone="cmd" label="cobrar #481" points={[[205, 200], [303, 200]]} duration={1.3} />}
            {p === 1 && <Packet key="p1" reduced={reduced} tone="cmd" label="a7f3" points={[[495, 190], [588, 190]]} duration={1.3} />}
            {p === 2 && <Packet key="p2" reduced={reduced} tone="muted" label="cobro" points={[[770, 200], [818, 200]]} duration={1.1} />}
            {p === 3 && <Packet key="p3" reduced={reduced} tone="evt" label="ack a7f3" points={[[590, 215], [497, 215]]} duration={1.3} />}
            {p >= 4 && <Packet key="p4" reduced={reduced} tone="cmd" label="a7f3 (otra vez)" points={[[400, 110], [520, 90], [590, 170]]} duration={1.4} hold />}
            <Label x={680} y={290} show={p >= 5} tone="danger" size={12}>id a7f3 ya procesado · descartado</Label>
            <Label x={680} y={120} show={p >= 5} tone="evt" size={11}>1 cobro, no 2</Label>

            <Label x={480} y={400} tone="text" size={13}>Entrega “al menos una vez” + identificador único = ni perdido ni duplicado</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── refused: side B of the money path ───────────────────────── */
const REF_CAPTIONS = [
  'La orden tiene stock reservado y espera el cobro.',
  'La pasarela <strong>rechaza</strong> el cargo, o el intento expira.',
  'El stock reservado vuelve solo al catálogo: <span class="tok tok--evt">MealStockCanceled</span>.',
  'El usuario recibe el aviso de rechazo, que también alimenta los reportes: <span class="tok tok--evt">OrderPurchaseRefused</span>.',
  'Como el historial vive ~1 mes en el teléfono, el rechazo se vuelve un botón: <strong>reintentar la última orden</strong> con un toque.',
];

export function Refused({ reduced }: SceneProps) {
  const s = usePhases(5, { interval: 2000, reduced });
  const p = s.phase;
  return (
    <Frame
      title="Cuando el pago falla"
      legend={<Legend items={[{ tone: 'evt', label: 'Evento' }, { tone: 'danger', label: 'Rechazo' }]} />}
      foot={<Stepper phase={p} count={5} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: REF_CAPTIONS[p] }} />} />}
    >
      <Canvas w={960} h={440} label="Si el pago es rechazado, el stock reservado se repone y el usuario recibe el aviso con opción de reintentar">
        {(ids) => (
          <>
            <Node x={480} y={210} w={200} h={80} kind="cmp" icon={Inbox} label="Orden del sistema" sub={p >= 2 ? 'cancelada por el pago' : 'esperando el cobro'} highlight={p === 0} />
            <Node x={850} y={210} w={170} h={70} kind={p >= 1 ? 'danger' : 'ext'} icon={CreditCard} label="Pasarela" sub={p >= 1 ? 'rechazado / expirado' : 'procesando…'} />
            <Node x={480} y={60} w={180} h={60} kind="cmp" icon={BookOpen} label="Catálogo" sub={p >= 2 ? 'lasaña: 1 (repuesta)' : 'lasaña: 0 (reservada)'} highlight={p === 2} />
            <Node x={130} y={210} w={200} h={80} icon={Smartphone} label="App del usuario" sub={p >= 3 ? 'pago rechazado' : 'procesando pago…'} highlight={p >= 3} />
            <Node x={480} y={370} w={170} h={56} kind="muted" label="Reportes" show={p >= 3} />
            <Edge points={[[765, 210], [582, 210]]} tone="danger" marker={ids.arrowDanger} show={p >= 1} />
            <Edge points={[[480, 168], [480, 92]]} tone="evt" marker={ids.arrowEvt} show={p >= 2} />
            <Edge points={[[378, 210], [232, 210]]} tone="evt" marker={ids.arrowEvt} show={p >= 3} />
            <Edge points={[[480, 252], [480, 340]]} tone="evt" marker={ids.arrowEvt} show={p >= 3} />
            {p === 1 && <Packet key="r1" reduced={reduced} tone="danger" label="rechazado" points={[[765, 210], [585, 210]]} duration={1.3} />}
            {p === 2 && <Packet key="r2" reduced={reduced} tone="evt" label="MealStockCanceled" points={[[480, 168], [480, 94]]} duration={1.2} />}
            {p === 3 && <Packet key="r3" reduced={reduced} tone="evt" label="OrderPurchaseRefused" points={[[378, 210], [236, 210]]} duration={1.3} />}
            {p >= 4 && (
              <foreignObject x={40} y={262} width={180} height={44}>
                <motion.button type="button" className="play-btn play-btn--primary" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', justifyContent: 'center' }} tabIndex={-1}>
                  <RotateCw size={14} aria-hidden /> Reintentar
                </motion.button>
              </foreignObject>
            )}
            <Label x={480} y={425} tone="text" size={13} show={p >= 4}>Nada queda a medias: ni un cobro huérfano, ni una comida desaparecida del catálogo</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

