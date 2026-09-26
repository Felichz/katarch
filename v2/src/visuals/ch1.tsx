import { useEffect, useMemo, useState } from 'react';
import { animate, motion } from 'motion/react';
import {
  ChefHat, Refrigerator, Store, User, UserCheck, CalendarCheck, Smartphone, Server, CreditCard, BookOpenCheck,
  Truck, Cpu, PackageX, Apple, Wheat, UserRound, MapPin, HeartPulse,
} from 'lucide-react';
import { Canvas, Edge, Frame, Label, Legend, Node, Packet, type SceneProps, EASE } from './kit';

/* ───────────────────────── mission ───────────────────────── */
export function Mission({ reduced }: SceneProps) {
  const tags = [
    { icon: HeartPulse, t: 'Diabetes' },
    { icon: Wheat, t: 'Celiaquía' },
    { icon: Apple, t: 'Dietas prescriptas' },
  ];
  return (
    <div className="mission">
      <motion.p className="mission__place mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <MapPin size={14} aria-hidden /> Detroit, Michigan · 2020
      </motion.p>
      <motion.blockquote
        className="mission__quote"
        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      >
        “Que la comida<br />sea tu <span>medicina</span>”
      </motion.blockquote>
      <div className="mission__tags">
        {tags.map((x, i) => (
          <motion.span key={x.t} className="mission__tag" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 + i * 0.1 }}>
            <x.icon size={15} aria-hidden /> {x.t}
          </motion.span>
        ))}
      </div>
      <motion.div className="mission__eq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <span>Comida saludable y a medida</span>
        <span className="mission__plus">+</span>
        <span>precio de comida rápida</span>
        <span className="mission__plus">+</span>
        <span>sin restaurantes</span>
      </motion.div>
    </div>
  );
}

/* ───────────────────────── ecosystem (morphing context diagram) ───────────────────────── */
const PHYS = ['kitchen', 'fridge', 'kiosk', 'users', 'stakeholders'];
type P = { x: number; y: number };

const INFO: Record<string, string> = {
  fridge: '<strong>Heladeras de Byte Technology.</strong> Informan el stock y cobran al cerrarse la puerta. La plataforma consume su API; su firmware no es asunto del arquitecto.',
  kiosk: '<strong>Kioscos con cajero.</strong> Un cajero registra las ventas en Toast POS, incluidas las del ocasional que paga en efectivo.',
  app: '<strong>App web y móvil.</strong> Donde conocidos y suscriptores navegan el catálogo, reservan y pagan.',
  platform: '<strong>Plataforma Central de Órdenes.</strong> Lo único que se construye: catálogo, órdenes, pagos y reportes, en el medio de todo.',
  kitchen: '<strong>Cocinas.</strong> Reciben por ChefTec la lista consolidada de lo que deben cocinar.',
  stripe: '<strong>Stripe.</strong> Procesa los cobros digitales de la app.',
  books: '<strong>QuickBooks.</strong> La contabilidad oficial de la empresa.',
};

export function Ecosystem({ state = 'kitchen', reduced }: SceneProps) {
  const phys = PHYS.includes(state);
  const step = PHYS.indexOf(state);
  const showFridge = !phys || step >= 1;
  const showKiosk = !phys || step >= 2;
  const showUsers = phys && step >= 3;
  const showStake = phys && step >= 4;
  const soft = state === 'systems' || state === 'scope' || state === 'complete';
  const scope = state === 'scope';
  const complete = state === 'complete';
  const [hover, setHover] = useState<string | null>(null);
  useEffect(() => setHover(null), [state]);

  const pos: Record<string, P> = phys
    ? { kitchen: state === 'kitchen' ? { x: 480, y: 270 } : { x: 170, y: 300 }, fridge: { x: 500, y: 170 }, kiosk: { x: 500, y: 430 } }
    : { kitchen: { x: 800, y: 150 }, fridge: { x: 160, y: 150 }, kiosk: { x: 160, y: 290 } };

  const hl = (k: string) => (state === k ? true : hover === k);
  const enter = complete ? (k: string) => () => setHover(k) : () => undefined;

  const title =
    state === 'kitchen' || state === 'fridge' || state === 'kiosk'
      ? 'El mundo físico'
      : state === 'users'
        ? 'Quién compra y dónde'
        : state === 'stakeholders'
          ? 'A quién más le importa'
          : state === 'scope'
            ? 'Qué entra y qué no'
            : 'Diagrama de contexto';

  const legend = soft ? (
    <Legend items={[{ tone: 'accent', label: 'Se construye' }, { tone: 'ext', label: 'Ya existía (restricción)' }]} />
  ) : undefined;

  return (
    <Frame
      title={title}
      legend={legend}
      foot={
        complete ? (
          <div className="eco-info" aria-live="polite">
            {hover ? <span dangerouslySetInnerHTML={{ __html: INFO[hover] }} /> : <span className="eco-info__hint">Pasá el cursor o tocá cualquier pieza para repasarla.</span>}
          </div>
        ) : undefined
      }
    >
      <Canvas w={960} h={600} label="Diagrama del ecosistema de Farmacy Food">
        {(ids) => (
          <>
            {/* scope boundary */}
            <motion.rect x={24} y={34} width={912} height={446} rx={18} className="zone zone--accent" initial={false} animate={{ opacity: scope ? 1 : 0 }} transition={{ duration: 0.4 }} />
            <Label x={40} y={26} anchor="start" tone="accent" show={scope}>Alcance del kata</Label>

            {/* column labels, software view */}
            <Label x={160} y={80} show={soft}>Canales de entrada</Label>
            <Label x={800} y={80} show={soft}>Sistemas que ya existían</Label>
            <Label x={480} y={196} tone="accent" show={soft}>Lo que se construye</Label>

            {/* physical edges: food flow */}
            <Edge points={[[272, 300], [330, 300], [330, 170], [386, 170]]} show={phys && showFridge} tone="muted" marker={ids.arrow} />
            <Edge points={[[272, 300], [330, 300], [330, 430], [386, 430]]} show={phys && showKiosk} tone="muted" marker={ids.arrow} delay={0.1} />
            {phys && step <= 2 && (
              <>
                <Label x={322} y={236} anchor="end" show={step >= 1}>viandas por lotes</Label>
                {showFridge && <Packet reduced={reduced} tone="cmp" points={[[272, 300], [330, 300], [330, 170], [386, 170]]} duration={2.2} repeat repeatDelay={0.8} />}
                {showKiosk && <Packet reduced={reduced} tone="cmp" points={[[272, 300], [330, 300], [330, 430], [386, 430]]} duration={2.2} delay={1.1} repeat repeatDelay={0.8} />}
              </>
            )}

            {/* batch cycles, kitchen-only state */}
            <Label x={480} y={352} show={state === 'kitchen'} delay={0.3}>1 o 2 ciclos de cocina por día</Label>
            {[0, 1].map((k) => (
              <motion.g key={k} initial={false} animate={{ opacity: state === 'kitchen' ? 1 : 0 }} transition={{ delay: state === 'kitchen' ? 0.45 + k * 0.2 : 0 }}>
                <rect x={330 + k * 160} y={372} width={140} height={40} rx={10} className="nd nd--cmp" />
                <text x={400 + k * 160} y={397} textAnchor="middle" className="pk-t">{k === 0 ? 'Lote mañana' : 'Lote tarde'}</text>
              </motion.g>
            ))}
            <Label x={480} y={452} tone="text" size={13} show={state === 'kitchen'} delay={0.8}>Sin salón: cocina solo para despacho y retiro</Label>

            {/* user edges */}
            <Edge points={[[728, 110], [680, 110], [680, 160], [614, 160]]} show={showUsers} tone="cmd" marker={ids.arrowCmd} delay={0.2} />
            <Edge points={[[728, 240], [680, 240], [680, 180], [614, 180]]} show={showUsers} tone="cmd" marker={ids.arrowCmd} delay={0.3} />
            <Edge points={[[728, 430], [614, 430]]} show={showUsers} tone="danger" dashed marker={ids.arrowDanger} delay={0.4} />
            <Label x={670} y={420} tone="danger" show={showUsers} delay={0.5}>efectivo</Label>
            <Label x={830} y={488} tone="danger" show={state === 'users'} delay={0.7} size={10.5}>el sistema central no se entera</Label>
            <Edge points={[[500, 468], [500, 512]]} show={showStake} tone="muted" delay={0.1} />

            {/* software edges */}
            <Edge points={[[262, 150], [310, 150], [310, 262], [358, 262]]} show={soft} tone="plain" marker={ids.arrow} delay={0.3} />
            <Edge points={[[262, 290], [358, 290]]} show={soft} tone="plain" marker={ids.arrow} delay={0.35} />
            <Edge points={[[262, 430], [310, 430], [310, 318], [358, 318]]} show={soft} tone="plain" marker={ids.arrow} delay={0.4} />
            <Edge points={[[602, 262], [650, 262], [650, 150], [698, 150]]} show={soft} tone="plain" marker={ids.arrow} delay={0.45} />
            <Edge points={[[602, 290], [698, 290]]} show={soft} tone="plain" marker={ids.arrow} delay={0.5} />
            <Edge points={[[602, 318], [650, 318], [650, 430], [698, 430]]} show={soft} tone="plain" marker={ids.arrow} delay={0.55} />

            {/* nodes that morph between both views */}
            <Node {...pos.kitchen} w={204} h={72} kind={soft ? 'ext' : 'cmp'} icon={ChefHat} label={soft ? 'Cocinas' : 'Ghost kitchen'} sub={soft ? 'ChefTec' : 'cocina por lotes · ChefTec'} highlight={hl('kitchen')} onEnter={complete ? enter('kitchen') : undefined} ariaLabel="Cocinas, ChefTec" />
            <Node {...pos.fridge} w={soft ? 204 : 224} h={72} kind={soft ? 'ext' : 'cmp'} icon={Refrigerator} label={soft ? 'Heladeras' : 'Heladera inteligente'} sub={soft ? 'API de Byte Technology' : 'Byte · RFID · cobro al cerrar'} show={showFridge} highlight={hl('fridge')} onEnter={complete ? enter('fridge') : undefined} ariaLabel="Heladeras, API de Byte Technology" />
            <Node {...pos.kiosk} w={soft ? 204 : 224} h={72} kind={soft ? 'ext' : 'cmp'} icon={Store} label={soft ? 'Kioscos' : 'Kiosco con cajero'} sub={soft ? 'API de Toast POS' : 'venta asistida · Toast POS'} show={showKiosk} highlight={hl('kiosk')} onEnter={complete ? enter('kiosk') : undefined} ariaLabel="Kioscos, API de Toast POS" />

            {/* users */}
            <Node x={830} y={110} w={200} h={64} icon={UserCheck} label="Conocido" sub="cuenta + tarjeta" show={showUsers} delay={0.05} />
            <Node x={830} y={240} w={200} h={64} icon={CalendarCheck} label="Suscriptor" sub="menú semanal prepago" show={showUsers} delay={0.12} />
            <Node x={830} y={430} w={200} h={64} icon={User} label="Ocasional" sub="efectivo, sin cuenta" show={showUsers} delay={0.19} highlight={state === 'users'} />

            {/* stakeholders */}
            <Node x={500} y={544} w={204} h={60} icon={UserRound} label="Cajero" sub="registra ventas en Toast" show={showStake} highlight={state === 'stakeholders'} />
            <Node x={170} y={110} w={210} h={60} kind="muted" icon={Apple} label="Nutricionistas" sub="buscan por nutriente" show={showStake} delay={0.1} highlight={state === 'stakeholders'} />
            <Node x={170} y={490} w={210} h={60} kind="muted" icon={Truck} label="Proveedores" sub="quieren prever compras" show={showStake} delay={0.2} highlight={state === 'stakeholders'} />

            {/* software-only nodes */}
            <Node x={160} y={430} w={204} h={72} icon={Smartphone} label="App web y móvil" sub="conocidos y suscriptores" show={soft} delay={0.2} highlight={hl('app')} onEnter={complete ? enter('app') : undefined} ariaLabel="App web y móvil" />
            <Node x={480} y={290} w={244} h={120} kind="core" icon={Server} label="Plataforma Central de Órdenes" sub="catálogo · órdenes · pagos · reportes" show={soft} delay={0.1} highlight={state === 'systems' || hl('platform')} onEnter={complete ? enter('platform') : undefined} ariaLabel="Plataforma Central de Órdenes" />
            <Node x={800} y={290} w={204} h={72} kind="ext" icon={CreditCard} label="Pagos" sub="Stripe" show={soft} delay={0.25} highlight={hl('stripe')} onEnter={complete ? enter('stripe') : undefined} ariaLabel="Pagos, Stripe" />
            <Node x={800} y={430} w={204} h={72} kind="ext" icon={BookOpenCheck} label="Contabilidad" sub="QuickBooks" show={soft} delay={0.3} highlight={hl('books')} onEnter={complete ? enter('books') : undefined} ariaLabel="Contabilidad, QuickBooks" />

            {/* out of scope */}
            <Label x={480} y={516} tone="danger" show={scope} delay={0.2}>Fuera de alcance, por escrito en el pliego</Label>
            <Node x={180} y={560} w={250} h={54} kind="muted" icon={Truck} label="Logística de camionetas" show={scope} delay={0.3} crossed />
            <Node x={480} y={560} w={250} h={54} kind="muted" icon={Cpu} label="Firmware de heladeras" show={scope} delay={0.4} crossed />
            <Node x={780} y={560} w={250} h={54} kind="muted" icon={PackageX} label="Movimientos sin compra" show={scope} delay={0.5} crossed />

            {complete && !reduced && (
              <>
                <Packet reduced={reduced} tone="cmd" points={[[262, 150], [310, 150], [310, 262], [358, 262]]} duration={1.6} repeat repeatDelay={2.4} />
                <Packet reduced={reduced} tone="cmd" points={[[262, 430], [310, 430], [310, 318], [358, 318]]} duration={1.6} delay={1.3} repeat repeatDelay={2.4} />
                <Packet reduced={reduced} tone="evt" points={[[602, 262], [650, 262], [650, 150], [698, 150]]} duration={1.6} delay={0.8} repeat repeatDelay={2.4} />
                <Packet reduced={reduced} tone="evt" points={[[602, 290], [698, 290]]} duration={1.4} delay={2} repeat repeatDelay={2.6} />
              </>
            )}
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── stats ───────────────────────── */
function CountUp({ to, prefix = '', reduced, delay = 0 }: { to: number; prefix?: string; reduced: boolean; delay?: number }) {
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (reduced) return setV(to);
    const c = animate(0, to, { duration: 1.1, delay, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to, reduced, delay]);
  return (
    <>
      {prefix}
      {v.toLocaleString('es-AR')}
    </>
  );
}

export function Stats({ reduced }: SceneProps) {
  const items = [
    { v: 2, p: '', label: 'locaciones piloto en el día 1', sub: 'en Detroit' },
    { v: 300, p: '~', label: 'comidas por semana al empezar', sub: 'unas 42 por día, en toda la ciudad' },
    { v: 68, p: '', label: 'locaciones como meta a 12 meses', sub: 'y 1.000 suscriptores' },
    { v: 0, p: '~', label: 'peticiones por segundo', sub: 'menos de una por minuto en hora pico', key: true },
  ];
  return (
    <div className="stats">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className={`stat ${it.key ? 'stat--key' : ''}`}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
        >
          <div className="stat__v mono">
            <CountUp to={it.v} prefix={it.p} reduced={reduced} delay={i * 0.12} />
          </div>
          <div className="stat__l">{it.label}</div>
          <div className="stat__s">{it.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ───────────────────────── rate (the arithmetic) ───────────────────────── */
function seeded(n: number) {
  let s = 20201029;
  const r = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  // sales cluster around lunch (12-14h) and early dinner (18-20h)
  return Array.from({ length: n }, (_, i) => {
    const u = r();
    const base = u < 0.55 ? 11.5 + r() * 3 : u < 0.85 ? 17.5 + r() * 3 : 8 + r() * 14;
    return { h: Math.min(23.9, Math.max(7, base)), lane: r(), i };
  });
}

export function Rate({ chosen, props, reduced }: SceneProps) {
  const revealed = chosen !== null && chosen === (props?.correct ?? -1);
  const dots = useMemo(() => seeded(42), []);
  const X0 = 70, X1 = 900, Y = 170;
  const hx = (h: number) => X0 + (h / 24) * (X1 - X0);
  return (
    <Frame title="Un día de ventas en toda la ciudad" legend={<Legend items={[{ tone: 'cmp', label: '1 punto = 1 comida vendida' }]} />}>
      <Canvas w={960} h={560} label="Línea de tiempo de un día con 42 ventas distribuidas y un segundo ampliado vacío">
        {() => (
          <>
            <rect x={X0} y={Y - 70} width={X1 - X0} height={140} rx={12} className="zone-fill" />
            {Array.from({ length: 25 }, (_, h) => (
              <g key={h}>
                <line x1={hx(h)} x2={hx(h)} y1={Y + 70} y2={Y + (h % 6 === 0 ? 82 : 76)} stroke="var(--line-strong)" />
                {h % 3 === 0 && <text x={hx(h)} y={Y + 98} textAnchor="middle" className="lb lb--muted" style={{ fontSize: 11 }}>{String(h).padStart(2, '0')}h</text>}
              </g>
            ))}
            {dots.map((d, k) => (
              <motion.circle
                key={d.i}
                cx={hx(d.h)}
                cy={Y - 52 + d.lane * 104}
                r={6}
                fill="var(--cmp)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: reduced ? 0 : 0.2 + k * 0.035, duration: 0.3 }}
              />
            ))}
            <text x={X0} y={Y - 84} className="lb lb--muted" style={{ fontSize: 11 }}>42 ventas · 24 horas · 86.400 segundos</text>

            {/* zoom into one second at peak */}
            <motion.g initial={false} animate={{ opacity: revealed ? 1 : 0.0 }} transition={{ duration: 0.5 }}>
              <path d={`M ${hx(12.9)} ${Y + 70} L 330 330 M ${hx(12.92)} ${Y + 70} L 630 330`} stroke="var(--accent)" strokeWidth={1.4} strokeDasharray="4 5" fill="none" />
              <rect x={hx(12.9) - 2} y={Y - 72} width={6} height={144} fill="var(--accent)" opacity={0.5} rx={2} />
              <rect x={330} y={330} width={300} height={110} rx={14} fill="var(--surface)" stroke="var(--accent)" strokeWidth={1.8} />
              <text x={480} y={362} textAnchor="middle" className="lb lb--accent" style={{ fontSize: 11 }}>1 segundo, en plena hora pico</text>
              <text x={480} y={412} textAnchor="middle" style={{ fontSize: 34, fontWeight: 700, fill: 'var(--text)' }}>0 ventas</text>
            </motion.g>
            <motion.g initial={false} animate={{ opacity: revealed ? 1 : 0 }} transition={{ duration: 0.5, delay: revealed ? 0.3 : 0 }}>
              <text x={480} y={486} textAnchor="middle" style={{ fontSize: 17, fill: 'var(--text-2)' }}>42 ÷ 86.400 ≈ 0,0005 comidas por segundo</text>
              <text x={480} y={516} textAnchor="middle" style={{ fontSize: 15, fill: 'var(--text-3)' }}>Aun en hora pico, el tráfico web queda en menos de una petición por minuto.</text>
            </motion.g>
            <motion.text x={480} y={400} textAnchor="middle" initial={false} animate={{ opacity: revealed ? 0 : 1 }} style={{ fontSize: 16, fill: 'var(--text-3)' }}>
              Elegí una respuesta a la izquierda para ampliar un segundo cualquiera.
            </motion.text>
          </>
        )}
      </Canvas>
    </Frame>
  );
}

/* ───────────────────────── growth ───────────────────────── */
export function Growth({ reduced }: SceneProps) {
  const REF = 604800;
  const bars = [
    { label: 'Hoy', v: 300, txt: '~300 comidas por semana' },
    { label: 'Meta a un año', v: 2000, txt: '1.500 a 2.000 por semana' },
    { label: 'Crecimiento rápido', v: 10000, txt: '1.000 suscriptores × ~10 = ~10.000 por semana' },
  ];
  const locs = [
    { label: 'Día 1', n: 2 },
    { label: '2021', n: 8 },
    { label: 'Meta 12 meses', n: 68 },
  ];
  return (
    <div className="growth">
      <section className="vcard">
        <h3 className="growth__h mono">Locaciones</h3>
        <div className="growth__locs">
          {locs.map((l, j) => (
            <div key={l.label} className="growth__loc">
              <div className="growth__dots" aria-hidden>
                {Array.from({ length: 68 }, (_, i) => (
                  <motion.span
                    key={i}
                    className={i < l.n ? 'on' : ''}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: reduced ? 0 : j * 0.3 + (i < l.n ? i * 0.012 : 0.4) }}
                  />
                ))}
              </div>
              <div className="growth__cap"><strong className="mono">{l.n}</strong> {l.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="vcard">
        <h3 className="growth__h mono">Volumen semanal contra una vara de referencia</h3>
        <div className="growth__ref">
          <div className="growth__refbar" />
          <div className="growth__reftxt">
            <strong className="mono">604.800</strong> por semana = <strong>una</strong> petición por segundo, sostenida
          </div>
        </div>
        {bars.map((b, i) => (
          <div key={b.label} className="growth__row">
            <span className="growth__lab">{b.label}</span>
            <div className="growth__track">
              <motion.div
                className="growth__bar"
                initial={{ width: 0 }}
                animate={{ width: `max(4px, ${(b.v / REF) * 100}%)` }}
                transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.4 + i * 0.2 }}
              />
              <span className="growth__txt">{b.txt}</span>
            </div>
          </div>
        ))}
        <p className="growth__note">Ni la barra más grande llega al 2% de la vara. Una comida puede generar varias peticiones, pero la escala sigue siendo otra.</p>
      </section>
    </div>
  );
}
