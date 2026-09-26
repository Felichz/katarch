import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Smartphone, Refrigerator, Cloud, CloudOff, KeyRound, Server, Timer, CreditCard, Check, Delete, Wifi, WifiOff,
  DoorOpen, FileSpreadsheet, MapPin, Camera, UserCog, Inbox, Bell, AlertTriangle, ShieldAlert, Fingerprint,
  RotateCcw, Play, XCircle, BookOpen,
} from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, Packet, Stepper, EASE, type SceneProps } from './kit';
import { usePhases } from './usePhases';

/* ───────────────────────── purchase: the command / event alphabet ───────────────────────── */
const LANES = [
  { k: 'u', x: 100, t: 'Usuario', s: 'app' },
  { k: 'lo', x: 262, t: 'Orden local', s: 'en el teléfono' },
  { k: 'so', x: 480, t: 'Orden del sistema', s: 'servidor' },
  { k: 'cat', x: 670, t: 'Catálogo', s: 'servidor' },
  { k: 'all', x: 860, t: 'Todos los usuarios', s: 'cada dispositivo' },
];
const X = Object.fromEntries(LANES.map((l) => [l.k, l.x])) as Record<string, number>;
const MSGS = [
  { from: 'u', to: 'lo', y: 150, kind: 'cmd' as const, tok: 'Start Order', cap: '<strong>Comando local.</strong> El teléfono arma el carrito sin molestar al servidor.' },
  { from: 'lo', to: 'so', y: 220, kind: 'cmd' as const, tok: 'Confirm Order by User', cap: '<strong>Comando.</strong> El usuario confirma: recién acá la orden cruza la frontera hacia el servidor. Todavía puede fallar.' },
  { from: 'so', to: 'cat', y: 290, kind: 'evt' as const, tok: 'MealStockReserved', cap: '<strong>Evento.</strong> La vianda quedó apartada. Ya ocurrió: el catálogo solo se entera.' },
  { from: 'cat', to: 'all', y: 360, kind: 'evt' as const, tok: 'MealStockUpdated', cap: '<strong>Evento difundido.</strong> Todos los dispositivos refrescan su catálogo local.' },
  { from: 'so', to: 'u', y: 430, kind: 'evt' as const, tok: 'OrderPurchased', cap: '<strong>Evento.</strong> El pago se procesó: llega la confirmación final al usuario.' },
];

export function Purchase({ reduced }: SceneProps) {
  const s = usePhases(MSGS.length, { interval: 2100, reduced });
  const p = s.phase;
  return (
    <Frame
      title="Una compra instantánea, mensaje por mensaje"
      legend={<Legend items={[{ tone: 'cmd', label: 'Comando: pide que algo ocurra' }, { tone: 'evt', label: 'Evento: algo ya ocurrió' }]} />}
      foot={<Stepper phase={p} count={MSGS.length} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: MSGS[p].cap }} />} labels={MSGS.map((m) => m.tok)} />}
    >
      <Canvas w={960} h={480} label="Diagrama de secuencia de una compra: Start Order y Confirm Order son comandos; MealStockReserved, MealStockUpdated y OrderPurchased son eventos">
        {(ids) => (
          <>
            <rect x={371} y={20} width={0.1} height={450} />
            <line x1={372} x2={372} y1={24} y2={470} stroke="var(--line-strong)" strokeWidth={1.5} strokeDasharray="3 6" />
            <Label x={362} y={466} anchor="end" size={10}>teléfono</Label>
            <Label x={382} y={466} anchor="start" size={10}>servidor</Label>
            {LANES.map((l) => (
              <g key={l.k}>
                <line x1={l.x} x2={l.x} y1={84} y2={450} stroke="var(--line)" strokeWidth={1.5} strokeDasharray="2 5" />
                <Node x={l.x} y={52} w={l.k === 'so' || l.k === 'all' ? 164 : 140} h={52} kind={l.k === 'u' || l.k === 'all' ? 'plain' : 'cmp'} label={l.t} sub={l.s} />
              </g>
            ))}
            {MSGS.map((m, i) => {
              const x1 = X[m.from];
              const x2 = X[m.to];
              const dir = x2 > x1 ? 1 : -1;
              const a: [number, number] = [x1 + dir * 6, m.y];
              const b: [number, number] = [x2 - dir * 8, m.y];
              const shown = i <= p;
              const midx = (x1 + x2) / 2;
              return (
                <g key={m.tok}>
                  <Edge points={[a, b]} tone={m.kind} marker={m.kind === 'cmd' ? ids.arrowCmd : ids.arrowEvt} show={shown} />
                  <motion.g initial={false} animate={{ opacity: shown ? (i === p ? 1 : 0.55) : 0 }}>
                    <rect x={midx - (m.tok.length * 7.3 + 20) / 2} y={m.y - 30} width={m.tok.length * 7.3 + 20} height={22} rx={11} className={`pk pk--${m.kind}`} />
                    <text x={midx} y={m.y - 15} textAnchor="middle" className="pk-t">{m.tok}</text>
                    <circle cx={x1} cy={m.y} r={4} fill={`var(--${m.kind})`} />
                    <text x={Math.min(x1, x2) - 16} y={m.y + 4} textAnchor="end" className="lb lb--muted" style={{ fontSize: 10 }}>{i + 1}</text>
                  </motion.g>
                  {i === p && !reduced && <Packet key={`pk${p}`} reduced={reduced} tone={m.kind} points={[a, b]} duration={1.1} w={14} />}
                </g>
              );
            })}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── window: the 30-second undo ───────────────────────── */
type WinState = 'idle' | 'window' | 'canceled' | 'charged' | 'refunded';
const WINDOW_S = 30;
const SPEED = 4; // simulated seconds per real second

export function UndoWindow({ reduced }: SceneProps) {
  const [st, setSt] = useState<WinState>('idle');
  const [t, setT] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  const start = useRef(0);

  useEffect(() => {
    if (st !== 'window') return;
    start.current = performance.now() - (t * 1000) / SPEED;
    const tick = (now: number) => {
      const sim = ((now - start.current) / 1000) * SPEED;
      if (sim >= WINDOW_S) {
        setT(WINDOW_S);
        setSt('charged');
        return;
      }
      setT(sim);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [st]);

  const fees = st === 'refunded' ? 2 : st === 'charged' ? 1 : 0;
  const confirm = () => { setT(0); setSt('window'); };
  const cancel = () => setSt(st === 'window' ? 'canceled' : 'refunded');
  const reset = () => { setT(0); setSt('idle'); };
  const pct = (t / WINDOW_S) * 100;

  const msg: Record<WinState, string> = {
    idle: 'Confirmá una compra y probá arrepentirte a tiempo, o dejá pasar la ventana.',
    window: 'La orden está <strong>retenida en memoria</strong>. La pasarela todavía no sabe nada.',
    canceled: 'Cancelada en memoria: <span class="tok tok--evt">MealStockCanceled</span> y <span class="tok tok--evt">MealStockUpdated</span> devuelven la vianda al catálogo. <strong>La pasarela nunca se enteró.</strong>',
    charged: 'Pasó la ventana sin cancelación: <strong>recién ahora</strong> se invoca al pago. Para el usuario, “procesar el pago” tardó unos segundos, como siempre.',
    refunded: 'Cancelar después de cobrar es un reembolso real: <strong>comisión de cobro + comisión de reembolso</strong>, por la misma comida.',
  };

  return (
    <Frame title="Simulador · la ventana de deshacer" foot={<p className="win__speed mono">tiempo acelerado ×{SPEED} · la ventana real dura entre 10 y 30 segundos</p>}>
      <div className="win">
        <div className="win__pipe">
          <div className={`win__box ${st !== 'idle' ? 'is-on' : ''}`}>
            <Inbox size={20} aria-hidden />
            <strong>Orden confirmada</strong>
            <span>{st === 'idle' ? 'esperando' : 'lasaña de espinaca'}</span>
          </div>
          <div className="win__arrow" aria-hidden />
          <div className={`win__box win__box--mem ${st === 'window' ? 'is-live' : ''} ${st === 'canceled' ? 'is-ok' : ''}`}>
            <Timer size={20} aria-hidden />
            <strong>Ventana en memoria</strong>
            <div className="win__bar" role="progressbar" aria-valuemin={0} aria-valuemax={WINDOW_S} aria-valuenow={Math.round(t)} aria-label="Tiempo de la ventana">
              <motion.div className="win__fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="mono">{Math.floor(t)} / {WINDOW_S} s</span>
          </div>
          <div className="win__arrow" aria-hidden />
          <div className={`win__box win__box--pay ${st === 'charged' || st === 'refunded' ? 'is-hit' : ''} ${st === 'canceled' ? 'is-never' : ''}`}>
            <CreditCard size={20} aria-hidden />
            <strong>Pasarela de pago</strong>
            <span>{st === 'charged' ? 'cobro iniciado' : st === 'refunded' ? 'cobro + reembolso' : st === 'canceled' ? 'nunca invocada' : 'sin tocar'}</span>
          </div>
        </div>

        <div className="win__panel vcard">
          <div className="win__msg" aria-live="polite" dangerouslySetInnerHTML={{ __html: msg[st] }} />
          <div className="win__row">
            <div className={`win__fees ${fees ? 'is-bad' : 'is-good'}`}>
              <span className="mono">{fees}</span> {fees === 1 ? 'comisión' : 'comisiones'} pagadas
            </div>
            <div className="win__btns">
              {st === 'idle' && (
                <button type="button" className="play-btn play-btn--primary" onClick={confirm}>
                  <Play size={14} aria-hidden /> Confirmar compra
                </button>
              )}
              {(st === 'window' || st === 'charged') && (
                <button type="button" className="play-btn" onClick={cancel}>
                  <XCircle size={14} aria-hidden /> Cancelar la orden
                </button>
              )}
              {st !== 'idle' && st !== 'window' && (
                <button type="button" className="play-btn" onClick={reset}>
                  <RotateCcw size={14} aria-hidden /> Otra vez
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ───────────────────────── offline: the basement fridge ───────────────────────── */
export function Offline({ chosen, props }: SceneProps) {
  const revealed = chosen !== null && chosen === (props?.correct ?? -1);
  return (
    <Frame title="Hospital · subsuelo 2">
      <Canvas w={960} h={520} label="Una heladera en el subsuelo de un hospital, sin señal celular, con un cliente que ya pagó esperando su comida">
        {(ids) => (
          <>
            <Node x={480} y={70} w={220} h={64} kind="core" icon={Cloud} label="Plataforma en la nube" sub="valida, cobra, registra" />
            <line x1={120} x2={840} y1={210} y2={210} stroke="var(--line-strong)" strokeWidth={2} />
            <Label x={130} y={200} anchor="start">planta baja</Label>
            <rect x={200} y={212} width={560} height={290} rx={4} className="zone-fill" />
            <Label x={215} y={236} anchor="start">subsuelo</Label>
            <Edge points={[[480, 104], [480, 180]]} tone="danger" dashed />
            <g>
              <circle cx={480} cy={180} r={17} fill="var(--danger-soft)" stroke="var(--danger)" strokeWidth={1.5} />
              <foreignObject x={468} y={168} width={24} height={24}>
                <div style={{ color: 'var(--danger)', display: 'grid', placeItems: 'center', height: '100%' }}><WifiOff size={15} /></div>
              </foreignObject>
            </g>
            <Label x={500} y={150} anchor="start" tone="danger">sin señal celular</Label>
            <Node x={600} y={380} w={210} h={80} kind="cmp" icon={Refrigerator} label="Heladera" sub="no puede hablar con la nube" />
            <Node x={330} y={380} w={200} h={80} icon={Smartphone} label="Cliente" sub="ya pagó su almuerzo" />
            <Edge points={[[432, 380], [492, 380]]} tone="cmd" marker={ids.arrowCmd} />
            <Label x={462} y={366} tone="cmd">¿abro?</Label>
            <motion.g initial={false} animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 8 }} transition={{ duration: 0.4 }}>
              <rect x={505} y={436} width={190} height={34} rx={17} className="pk pk--evt" />
              <foreignObject x={515} y={441} width={24} height={24}>
                <div style={{ color: 'var(--evt)', display: 'grid', placeItems: 'center', height: '100%' }}><KeyRound size={15} /></div>
              </foreignObject>
              <text x={612} y={458} textAnchor="middle" className="pk-t">algo que ya conoce</text>
            </motion.g>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── pin: prepare (online) ───────────────────────── */
export function PinPrepare({ reduced }: SceneProps) {
  return (
    <Frame title="Mientras hay señal" legend={<Legend items={[{ tone: 'evt', label: 'PIN de un solo uso' }]} />}>
      <Canvas w={960} h={520} label="Con señal, la nube genera un PIN de un solo uso y lo envía al teléfono del cliente y a la memoria de la heladera">
        {(ids) => (
          <>
            <Node x={480} y={80} w={240} h={70} kind="core" icon={Server} label="Plataforma" sub="genera un PIN por entrega" />
            <Node x={210} y={360} w={210} h={80} icon={Smartphone} label="Teléfono del cliente" sub="guarda su PIN" />
            <Node x={750} y={360} w={210} h={80} kind="cmp" icon={Refrigerator} label="Heladera" sub="guarda los PIN pendientes" />
            <Edge points={[[400, 115], [210, 115], [210, 318]]} tone="evt" marker={ids.arrowEvt} />
            <Edge points={[[560, 115], [750, 115], [750, 318]]} tone="evt" marker={ids.arrowEvt} />
            <Label x={480} y={160} tone="evt">
              ✓ con señal
            </Label>
            <Packet reduced={reduced} tone="evt" label="PIN 482 917" points={[[400, 115], [210, 115], [210, 316]]} duration={2} repeat repeatDelay={1.5} />
            <Packet reduced={reduced} tone="evt" label="PIN 482 917" points={[[560, 115], [750, 115], [750, 316]]} duration={2} repeat repeatDelay={1.5} />
            <foreignObject x={640} y={410} width={220} height={100}>
              <div className="pinmem">
                <span className="mono pinmem__k">memoria local</span>
                <span className="mono">482 917 · lasaña</span>
                <span className="mono">305 118 · wrap</span>
                <span className="mono">771 402 · bowl</span>
              </div>
            </foreignObject>
            <Label x={210} y={430} tone="muted">6 a 8 dígitos · atado a una comida</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── pin: pickup (offline, interactive keypad) ───────────────────────── */
const PIN = '482917';

export function PinPickup({ reduced }: SceneProps) {
  const [entry, setEntry] = useState('');
  const [status, setStatus] = useState<'typing' | 'bad' | 'open' | 'synced'>('typing');
  const log: string[] = [];
  if (status === 'bad') log.push('PIN inválido: reintentá');
  if (status === 'open' || status === 'synced') log.push('PIN validado contra la memoria local', 'Puerta destrabada: retiro OK', 'Retiro guardado para reportar después');
  if (status === 'synced') log.push('Volvió la señal: retiro reportado a la nube');

  const press = (d: string) => {
    if (status === 'open' || status === 'synced') return;
    setStatus('typing');
    setEntry((e) => (e.length < 6 ? e + d : e));
  };
  const back = () => setEntry((e) => e.slice(0, -1));
  const ok = () => setStatus(entry === PIN ? 'open' : 'bad');
  const auto = () => {
    setEntry('');
    setStatus('typing');
    PIN.split('').forEach((d, i) => setTimeout(() => setEntry((e) => e + d), reduced ? 0 : 140 * (i + 1)));
  };
  const reset = () => { setEntry(''); setStatus('typing'); };

  return (
    <Frame title="Sin señal · la heladera decide sola">
      <div className="pinx">
        <div className={`pinx__net ${status === 'synced' ? 'is-on' : ''}`}>
          {status === 'synced' ? <Wifi size={15} aria-hidden /> : <CloudOff size={15} aria-hidden />}
          {status === 'synced' ? 'Señal recuperada' : 'Sin conexión con la nube'}
        </div>
        <div className="pinx__grid">
          <div className="pinx__phone vcard">
            <Smartphone size={18} aria-hidden />
            <span className="pinx__lbl mono">tu PIN de retiro</span>
            <strong className="pinx__code mono">482 917</strong>
            <span className="pinx__hint">También guardado en tu teléfono: no hace falta señal para verlo.</span>
          </div>
          <div className={`pinx__door vcard ${status === 'open' || status === 'synced' ? 'is-open' : ''} ${status === 'bad' ? 'is-bad' : ''}`}>
            <div className="pinx__head"><Refrigerator size={16} aria-hidden /> Heladera · subsuelo 2</div>
            <div className="pinx__display mono" aria-live="polite" aria-label={`PIN ingresado: ${entry.length} dígitos`}>
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={i < entry.length ? 'on' : ''}>{entry[i] ?? '·'}</span>
              ))}
            </div>
            {status === 'open' || status === 'synced' ? (
              <motion.div className="pinx__opened" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <DoorOpen size={28} aria-hidden /> Puerta abierta
              </motion.div>
            ) : (
              <div className="pinx__pad" role="group" aria-label="Teclado de la heladera">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                  <button key={d} type="button" onClick={() => press(d)}>{d}</button>
                ))}
                <button type="button" onClick={back} aria-label="Borrar"><Delete size={16} /></button>
                <button type="button" onClick={() => press('0')}>0</button>
                <button type="button" className="ok" onClick={ok} aria-label="Validar PIN"><Check size={18} /></button>
              </div>
            )}
          </div>
          <div className="pinx__log vcard">
            <span className="pinx__lbl mono">registro de la heladera</span>
            <ol>
              <AnimatePresence initial={false}>
                {log.length === 0 && <li className="muted">Teclea el PIN, o usá “autocompletar”.</li>}
                {log.map((l, i) => (
                  <motion.li key={l} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduced ? 0 : i * 0.25 }} className={l.startsWith('PIN inválido') ? 'bad' : ''}>
                    {l}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </div>
        </div>
        <div className="pinx__ctl">
          {status !== 'open' && status !== 'synced' && (
            <button type="button" className="play-btn" onClick={auto}><KeyRound size={14} aria-hidden /> Autocompletar el PIN</button>
          )}
          {status === 'open' && (
            <button type="button" className="play-btn play-btn--primary" onClick={() => setStatus('synced')}><Wifi size={14} aria-hidden /> Volver la señal</button>
          )}
          {status === 'synced' && (
            <button type="button" className="play-btn" onClick={reset}><RotateCcw size={14} aria-hidden /> Otra vez</button>
          )}
        </div>
      </div>
    </Frame>
  );
}

/* ───────────────────────── trust: ArchColider vs Jedis ───────────────────────── */
export function Trust({ reduced }: SceneProps) {
  const cols = [
    {
      team: 'ArchColider', tag: '1.º puesto', icon: KeyRound,
      title: 'Un código pre-compartido',
      items: ['El PIN se genera antes, mientras hay señal.', 'La heladera lo valida con su memoria local.', 'El retiro se reporta cuando vuelve la conexión.'],
      trust: 'La identidad vive en un código que ya conocen la heladera y el cliente.',
    },
    {
      team: 'Jedis', tag: '3.er puesto', icon: Fingerprint,
      title: 'Una sesión de compra',
      items: ['La “purchase session” se crea antes de abrir la puerta.', 'La identidad sale de la tarjeta deslizada o del token de la app.', 'Si el cliente toma una comida que no es suya, suena la alarma.', 'La sesión cachea los detalles por si pagos se cae.'],
      trust: 'La identidad vive en la sesión, no en un código pre-compartido.',
    },
  ];
  return (
    <div className="trust">
      {cols.map((c, i) => (
        <motion.section key={c.team} className={`vcard trust__col ${i === 0 ? 'is-main' : ''}`} initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15, duration: 0.45, ease: EASE }}>
          <header className="trust__head">
            <span className="trust__icon" aria-hidden><c.icon size={20} /></span>
            <div>
              <p className="trust__team mono">{c.team} · {c.tag}</p>
              <h3>{c.title}</h3>
            </div>
          </header>
          <ul>
            {c.items.map((it) => <li key={it}>{it}</li>)}
          </ul>
          <p className="trust__foot">{c.trust}</p>
        </motion.section>
      ))}
      <p className="trust__q">Dos modelos de confianza para la misma puerta. Ninguno es “el correcto”: cada uno compra una garantía distinta.</p>
    </div>
  );
}

/* ───────────────────────── catalog in your pocket ───────────────────────── */
export function PocketCatalog({ reduced }: SceneProps) {
  return (
    <Frame title="Navegar es local, cobrar es verdad" legend={<Legend items={[{ tone: 'cmd', label: 'Comando' }, { tone: 'evt', label: 'Evento' }]} />}>
      <Canvas w={960} h={520} label="El catálogo vive en el teléfono; el servidor difunde avisos de cambio y el stock real se verifica solo al pagar">
        {(ids) => (
          <>
            <Node x={200} y={260} w={230} h={300} icon={Smartphone} label="Teléfono" sub="catálogo guardado" labelTop>
              <foreignObject x={16} y={70} width={198} height={210}>
                <ul className="pcat">
                  <li><span>Lasaña de espinaca</span><em>✓</em></li>
                  <li><span>Wrap sin gluten</span><em>✓</em></li>
                  <li><span>Bowl para diabéticos</span><em>✓</em></li>
                  <li className="old"><span>Guiso de lentejas</span><em>?</em></li>
                </ul>
              </foreignObject>
            </Node>
            <Node x={770} y={260} w={220} h={90} kind="core" icon={Server} label="Plataforma" sub="stock real por heladera" />
            <Edge points={[[770, 214], [770, 90], [200, 90], [200, 108]]} tone="evt" marker={ids.arrowEvt} />
            <Label x={485} y={80} tone="evt">CatalogUpdated · solo id y ubicación, no el catálogo entero</Label>
            <Edge points={[[316, 390], [770, 390], [770, 306]]} tone="cmd" marker={ids.arrowCmd} />
            <Label x={540} y={412} tone="cmd">al pagar: ¿queda stock de verdad?</Label>
            <Edge points={[[700, 306], [700, 350], [318, 350]]} tone="evt" marker={ids.arrowEvt} />
            <Label x={500} y={340} tone="evt">stock confirmado, o alternativas</Label>
            <Packet reduced={reduced} tone="evt" label="algo cambió" points={[[770, 214], [770, 90], [200, 90], [200, 110]]} duration={2.4} repeat repeatDelay={2} />
            <Packet reduced={reduced} tone="cmd" label="pagar" points={[[316, 390], [770, 390], [770, 308]]} duration={2} delay={2.2} repeat repeatDelay={2.4} />
            <Label x={200} y={440} tone="text" size={13}>Navegar: instantáneo, sin señal,</Label>
            <Label x={200} y={458} tone="text" size={13}>quizás un poco viejo</Label>
            <Label x={792} y={176} anchor="start" tone="text" size={13}>Cobrar: nunca</Label>
            <Label x={792} y={194} anchor="start" tone="text" size={13}>con datos viejos</Label>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── partition: spreadsheet + cities ───────────────────────── */
export function Partition({ reduced }: SceneProps) {
  const cities = [
    { n: 'Detroit', d: 'cocinas, heladeras y clientes de Detroit' },
    { n: 'Nueva York', d: 'si algún día llega: sus propios datos' },
  ];
  return (
    <div className="part">
      <motion.section className="vcard part__sheet" initial={{ opacity: 0, x: reduced ? 0 : -14 }} animate={{ opacity: 1, x: 0 }}>
        <header><FileSpreadsheet size={18} aria-hidden /> <strong>Promociones</strong> <span className="mono">hoja de cálculo · ejemplo</span></header>
        <table>
          <thead><tr><th>Campaña</th><th>Comida</th><th>Descuento</th></tr></thead>
          <tbody>
            <tr><td>Lunes verde</td><td>Bowls</td><td>15%</td></tr>
            <tr><td>2×1 gimnasio</td><td>Wraps</td><td>50%</td></tr>
            <tr><td>Suscriptor+</td><td>Todo</td><td>10%</td></tr>
          </tbody>
        </table>
        <p className="part__arrow">→ el sistema solo consume el <strong>resultado final</strong></p>
        <p className="part__why">Cambian poco y las deciden personas. Sincronizarlas entre operadores con algoritmos de consistencia distribuida sería resolver un problema que no existe.</p>
      </motion.section>
      <motion.section className="part__cities" initial={{ opacity: 0, x: reduced ? 0 : 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
        {cities.map((c, i) => (
          <div key={c.n} className={`vcard part__city ${i ? 'is-future' : ''}`}>
            <header><MapPin size={16} aria-hidden /> <strong>{c.n}</strong></header>
            <div className="part__chips">
              <span>catálogo</span><span>stock</span><span>órdenes</span>
            </div>
            <p>{c.d}</p>
          </div>
        ))}
        <p className="part__note">“Las cocinas de Detroit no ofrecen comida en Nueva York.” Los datos se parten por ciudad, casi sin replicar nada entre regiones.</p>
      </motion.section>
    </div>
  );
}

/* ───────────────────────── journey: the rainy day ───────────────────────── */
const JL = [
  { k: 'sus', y: 80, t: 'Suscriptor' },
  { k: 'hel', y: 180, t: 'Heladera' },
  { k: 'fb', y: 280, t: 'Reclamos' },
  { k: 'ord', y: 380, t: 'Órdenes' },
  { k: 'not', y: 470, t: 'Notificaciones' },
];
const JCAP = [
  'El suscriptor ingresa su código de acceso en la heladera.',
  '¿Código válido? Si no, reintenta. Por eso los códigos también viven en su teléfono: nadie queda atrapado en el loop.',
  'El código es válido… pero la vianda queda <strong>físicamente trabada</strong>. Ningún software empuja la bandeja.',
  'Desde la app, el suscriptor saca una <strong>foto</strong> y registra el reclamo.',
  'Una persona, un administrador, revisa la evidencia y <strong>aprueba el reclamo</strong>.',
  'El sistema de órdenes registra la compensación: <strong>una orden nueva</strong> (o un cupón).',
  'La notificación cierra el círculo: el suscriptor se entera de que su reclamo fue aprobado.',
];

export function Journey({ reduced }: SceneProps) {
  const s = usePhases(JCAP.length, { interval: 2300, reduced });
  const p = s.phase;
  const on = (i: number) => p >= i;
  return (
    <Frame
      title="Subscribed user cannot pick up the meal"
      legend={<Legend items={[{ tone: 'danger', label: 'Falla física' }, { tone: 'accent', label: 'Decisión humana' }]} />}
      foot={<Stepper phase={p} count={JCAP.length} playing={s.playing} onPlay={() => s.setPlaying(true)} onPause={() => s.setPlaying(false)} onGo={s.goTo} caption={<span dangerouslySetInnerHTML={{ __html: JCAP[p] }} />} />}
    >
      <Canvas w={960} h={520} label="Journey del error: el suscriptor ingresa su código, la vianda se traba, reclama con foto, un administrador aprueba, se crea una orden nueva y se lo notifica">
        {(ids) => (
          <>
            {JL.map((l, i) => (
              <g key={l.k}>
                <rect x={0} y={l.y - 44} width={960} height={i === JL.length - 1 ? 84 : 100} fill={i % 2 ? 'transparent' : 'var(--bg-grid)'} />
                <text x={14} y={l.y + 4} className="lb lb--muted" style={{ fontSize: 10.5 }}>{l.t}</text>
              </g>
            ))}
            <Node x={250} y={80} w={160} h={56} icon={KeyRound} label="Ingresa su código" show={on(0)} highlight={p === 0} />
            <Edge points={[[250, 108], [250, 150]]} show={on(1)} tone="plain" marker={ids.arrow} />
            {/* diamond */}
            <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }}>
              <polygon points="250,146 312,180 250,214 188,180" className={`nd ${p === 1 ? 'is-hl' : ''}`} />
              <text x={250} y={184} textAnchor="middle" style={{ fontSize: 12.5, fontWeight: 650, fill: 'var(--text)' }}>¿válido?</text>
            </motion.g>
            <Edge points={[[188, 180], [150, 180], [150, 80], [166, 80]]} show={on(1)} tone="muted" dashed marker={ids.arrow} />
            <Label x={146} y={134} anchor="end" show={on(1)} size={10}>no: reintentar</Label>
            <Edge points={[[312, 180], [352, 180]]} show={on(2)} tone="plain" marker={ids.arrow} />
            <Label x={330} y={170} show={on(2)} size={10}>sí</Label>
            <Node x={440} y={180} w={170} h={60} kind="danger" icon={AlertTriangle} label="La vianda se traba" sub="falla física" show={on(2)} highlight={p === 2} />
            <Edge points={[[440, 150], [440, 110]]} show={on(3)} tone="danger" marker={ids.arrowDanger} />
            <Node x={440} y={80} w={170} h={56} icon={Camera} label="Foto + reclamo" show={on(3)} highlight={p === 3} />
            <Edge points={[[525, 80], [620, 80], [620, 248]]} show={on(4)} tone="plain" marker={ids.arrow} />
            <Node x={620} y={280} w={180} h={60} kind="core" icon={UserCog} label="Admin aprueba" sub="persona, no software" show={on(4)} highlight={p === 4} />
            <Edge points={[[710, 280], [770, 280], [770, 348]]} show={on(5)} tone="cmd" marker={ids.arrowCmd} />
            <Node x={770} y={380} w={160} h={56} kind="cmp" icon={Inbox} label="Orden nueva" sub="o un cupón" show={on(5)} highlight={p === 5} />
            <Edge points={[[850, 380], [880, 380], [880, 442]]} show={on(6)} tone="evt" marker={ids.arrowEvt} />
            <Node x={880} y={470} w={140} h={50} kind="evt" icon={Bell} label="Aprobado" show={on(6)} highlight={p === 6} />
            <Edge points={[[880, 444], [880, 470]]} show={false} />
            <Edge points={[[950, 470], [950, 80], [855, 80]]} show={on(6)} tone="evt" dashed marker={ids.arrowEvt} />
            <Node x={790} y={80} w={120} h={48} kind="evt" icon={Check} label="Compensado" show={on(6)} />
          </>
        )}
      </Canvas>
    </Frame>
  );
}

